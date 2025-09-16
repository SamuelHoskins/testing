import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import prisma from "@/lib/db";
import { formatAvailability, formatEuro } from "@/lib/utils";

const TALENT_ROLES = ["ARTIST", "MODEL"] as const;

type TalentRole = (typeof TALENT_ROLES)[number];

type SearchParams = {
  q?: string;
  role?: TalentRole;
  tag?: string;
};

export const metadata: Metadata = {
  title: "Search creatives | Firenze Connect",
  description:
    "Discover verified creatives in Florence and request bookings directly from the roster.",
};

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const roleFilter = searchParams.role;
  const query = searchParams.q?.trim();
  const tag = searchParams.tag?.trim();

  const talents = await prisma.user.findMany({
    where: {
      role: roleFilter ? roleFilter : { in: TALENT_ROLES },
      AND: [
        query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { handle: { contains: query, mode: "insensitive" } },
                { bio: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
        tag
          ? {
              tags: {
                some: {
                  tag: {
                    name: { contains: tag, mode: "insensitive" },
                  },
                },
              },
            }
          : {},
      ],
    },
    include: {
      tags: {
        select: {
          tag: true,
        },
      },
      availability: {
        orderBy: { start: "asc" },
        take: 2,
      },
      portfolioImages: {
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!talents.length && (query || tag || roleFilter)) {
    return notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <form className="grid gap-6 md:grid-cols-[2fr_1fr_1fr]">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                name="q"
                placeholder="Try 'fashion model' or 'makeup artist'"
                defaultValue={query}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Discipline</Label>
            <select
              id="role"
              name="role"
              defaultValue={roleFilter ?? ""}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All talent</option>
              {TALENT_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0) + role.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tag">Tag</Label>
            <Input
              id="tag"
              name="tag"
              placeholder="Editorial, runway, portrait..."
              defaultValue={tag}
            />
          </div>
          <div className="md:col-span-3">
            <Button type="submit" className="w-full md:w-auto">
              Apply filters
            </Button>
          </div>
        </form>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {talents.map((talent) => {
          const hero = talent.portfolioImages[0];
          return (
            <Card key={talent.id} className="overflow-hidden">
              {hero ? (
                <Image
                  src={hero.url}
                  alt={hero.caption ?? talent.name ?? talent.handle}
                  width={800}
                  height={600}
                  className="h-52 w-full object-cover"
                />
              ) : null}
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{talent.name ?? talent.handle}</CardTitle>
                    <CardDescription>{talent.location}</CardDescription>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {formatEuro(talent.dayRate ?? 400)} / day
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {talent.tags.map(({ tag: tagRelation }) => (
                    <Badge key={tagRelation.id} variant="secondary">
                      {tagRelation.name}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{talent.bio}</p>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Next availability
                  </p>
                  <div className="mt-2 space-y-1 text-sm">
                    {talent.availability.length ? (
                      talent.availability.map((slot) => (
                        <p key={slot.id}>
                          {formatAvailability(slot.start, slot.end)} — {slot.timezone}
                        </p>
                      ))
                    ) : (
                      <p>No availability slots published</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button asChild variant="outline">
                    <Link href={`/profile/${talent.handle}`}>View profile</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/dashboard?talent=${talent.handle}`}>Request booking</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
