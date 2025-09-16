import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MessagesSquare, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { formatEuro } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Firenze Connect — Florence&apos;s talent network",
  description:
    "Discover artists and models across Florence, manage bookings, and keep collaborations flowing with a modern Supabase-powered platform.",
};

const valueProps = [
  {
    title: "Verified creatives",
    description:
      "Every profile is hand-reviewed by our curators in Florence, ensuring agencies work with trusted professionals only.",
    icon: Sparkles,
  },
  {
    title: "Real-time availability",
    description:
      "Share live availability slots and let clients request shoots that match your calendar instantly.",
    icon: Calendar,
  },
  {
    title: "Inbox built-in",
    description:
      "Keep bookings, briefs, and approvals together with threaded messaging that syncs to your Supabase data.",
    icon: MessagesSquare,
  },
];

export default async function MarketingPage() {
  const featuredTalents = await prisma.user.findMany({
    where: { isFeatured: true },
    take: 3,
    include: {
      tags: {
        select: {
          tag: true,
        },
      },
      portfolioImages: {
        take: 1,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-col">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-background via-background to-secondary/40">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6">
            <Badge className="w-fit" variant="secondary">
              Built for Florence&apos;s creative community
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Book the city&apos;s most sought-after artists & models in minutes.
            </h1>
            <p className="text-lg text-muted-foreground">
              Firenze Connect is the curated marketplace connecting fashion houses, photographers,
              and event producers with local talent. Powered by Supabase Auth and Prisma for
              workflows that feel effortless.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/sign-up" className="flex items-center gap-2">
                  Request an invite
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/search">Browse the roster</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="grid gap-4">
              {featuredTalents.map((talent) => {
                const heroImage = talent.portfolioImages[0];
                return (
                  <Card key={talent.id} className="overflow-hidden">
                    {heroImage ? (
                      <Image
                        src={heroImage.url}
                        alt={heroImage.caption ?? talent.name ?? talent.handle}
                        width={800}
                        height={600}
                        className="h-48 w-full object-cover"
                      />
                    ) : null}
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{talent.name ?? talent.handle}</CardTitle>
                          <CardDescription>{talent.location}</CardDescription>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {formatEuro(talent.dayRate ?? 450)} / day
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {talent.tags.map(({ tag }) => (
                          <Badge key={tag.id} variant="secondary">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {valueProps.map((value) => (
            <Card key={value.title} className="h-full">
              <CardHeader>
                <value.icon className="h-10 w-10 text-primary" />
                <CardTitle className="text-xl">{value.title}</CardTitle>
                <CardDescription>{value.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-secondary/30">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight">
              Built on a future-proof stack.
            </h2>
            <p className="text-muted-foreground">
              We pair Prisma and Supabase for reliable data, while shadcn/ui keeps your team
              shipping accessible interfaces fast. Deploy to Vercel, connect Supabase Auth with
              email magic links, and manage every booking from one dashboard.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Supabase Auth &amp; Postgres</li>
              <li>• Prisma models tailored for talent marketplaces</li>
              <li>• Reusable shadcn components and Tailwind design tokens</li>
            </ul>
          </div>
          <div className="space-y-4 rounded-2xl border bg-background/70 p-6 shadow-sm">
            <h3 className="text-lg font-semibold">What&apos;s included</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Dashboard:</span> manage bookings,
                availability, and client messaging in one hub.
              </li>
              <li>
                <span className="font-medium text-foreground">Search:</span> filter by discipline,
                tags, availability slot, or budget.
              </li>
              <li>
                <span className="font-medium text-foreground">Profile pages:</span> highlight
                curated imagery and pricing for each creative.
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/sign-up">Start collaborating</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
