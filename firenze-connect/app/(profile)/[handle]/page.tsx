import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, MapPin, MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { formatAvailability, formatEuro } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const profile = await prisma.user.findUnique({
    where: { handle: params.handle },
    select: { name: true, bio: true },
  });

  if (!profile) {
    return {
      title: "Creative not found | Firenze Connect",
    };
  }

  return {
    title: `${profile.name ?? params.handle} | Firenze Connect`,
    description: profile.bio ?? "Discover creative talent in Florence.",
  };
}

export default async function ProfilePage({ params }: { params: { handle: string } }) {
  const profile = await prisma.user.findUnique({
    where: { handle: params.handle },
    include: {
      tags: { select: { tag: true } },
      portfolioImages: { orderBy: { createdAt: "asc" } },
      availability: { orderBy: { start: "asc" } },
    },
  });

  if (!profile) {
    notFound();
  }

  const hero = profile.portfolioImages[0];
  const gallery = profile.portfolioImages.slice(1, 4);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
      <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <Badge variant="secondary" className="w-fit">
              @{profile.handle}
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight">
              {profile.name ?? profile.handle}
            </h1>
            <p className="text-lg text-muted-foreground">{profile.bio}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.tags.map(({ tag }) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {profile.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Camera className="h-4 w-4" /> {profile.role.toLowerCase()}
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={`/dashboard?talent=${profile.handle}`}>Request booking</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sign-in" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> Message
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Day rate</CardTitle>
                <CardDescription>Flexible depending on scope</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{formatEuro(profile.dayRate ?? 400)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Next availability</CardTitle>
                <CardDescription>Instant confirmations through Supabase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {profile.availability.length ? (
                  profile.availability.slice(0, 3).map((slot) => (
                    <p key={slot.id}>
                      {formatAvailability(slot.start, slot.end)} — {slot.timezone}
                    </p>
                  ))
                ) : (
                  <p>Availability calendar coming soon.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-4">
          {hero ? (
            <div className="overflow-hidden rounded-2xl border shadow-sm">
              <Image
                src={hero.url}
                alt={hero.caption ?? profile.name ?? profile.handle}
                width={900}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          {gallery.length ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {gallery.map((image) => (
                <Image
                  key={image.id}
                  src={image.url}
                  alt={image.caption ?? profile.name ?? profile.handle}
                  width={400}
                  height={400}
                  className="h-40 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>About {profile.name?.split(" ")[0] ?? profile.handle}</CardTitle>
            <CardDescription>
              A summary pulled from the Prisma layer so agencies can review highlights quickly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Based in {profile.location}, this creative specialises in{" "}
              {profile.tags.map(({ tag }) => tag.name).join(", ") || "bespoke experiences"}.
            </p>
            <p>
              Projects typically begin at {formatEuro(profile.dayRate ?? 400)} per day, with travel
              and production costs billed separately.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Get in touch</CardTitle>
            <CardDescription>
              Use the dashboard to send a Supabase-powered booking request.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Share your moodboard and preferred timeline.</p>
            <p>We recommend 48h lead time for shoots within Florence&apos;s historic centre.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
