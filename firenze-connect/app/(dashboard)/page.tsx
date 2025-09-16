import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MessageCircle, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/db";
import { formatAvailability, formatEuro } from "@/lib/utils";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard | Firenze Connect",
  description:
    "Keep track of bookings, availability, and client conversations in one collaborative hub.",
};

export default async function DashboardPage() {
  const session = await getSession();

  const profile = session
    ? await prisma.user.findUnique({
        where: {
          supabaseId: session.user.id,
        },
        include: {
          availability: { orderBy: { start: "asc" } },
          tags: { select: { tag: true } },
        },
      })
    : await prisma.user.findFirst({
        where: { role: { in: ["ARTIST", "MODEL"] } },
        include: {
          availability: { orderBy: { start: "asc" } },
          tags: { select: { tag: true } },
        },
      });

  const bookings = profile
    ? await prisma.booking.findMany({
        where: {
          OR: [{ talentId: profile.id }, { clientId: profile.id }],
        },
        orderBy: { start: "asc" },
        take: 3,
        include: {
          talent: true,
          client: true,
        },
      })
    : [];

  const inbox = profile
    ? await prisma.message.findMany({
        where: {
          booking: {
            OR: [{ talentId: profile.id }, { clientId: profile.id }],
          },
        },
        include: {
          booking: {
            include: {
              client: true,
              talent: true,
            },
          },
          sender: true,
        },
        orderBy: { sentAt: "desc" },
        take: 4,
      })
    : [];

  const availability = profile?.availability.slice(0, 3) ?? [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Ciao {profile?.name ?? "ospite"}
          </h1>
          <p className="text-muted-foreground">
            {profile
              ? "Here’s what’s happening across your Firenze Connect collaborations."
              : "Sign in to manage your bookings, or explore the demo workspace below."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href="/search">
              <PlusCircle className="mr-2 h-4 w-4" /> Find talent
            </Link>
          </Button>
          <Button asChild>
            <Link href="/sign-in">Launch inbox</Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {bookings.length ? (
              bookings.map((booking) => (
                <div key={booking.id} className="space-y-1 rounded-md border p-3">
                  <p className="font-medium text-sm text-foreground">{booking.projectName}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {booking.status}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatAvailability(booking.start, booking.end)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    With {booking.client?.name ?? booking.client?.handle} →{" "}
                    {booking.talent?.name ?? booking.talent?.handle}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No bookings scheduled yet.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="link" className="px-0 text-sm">
              <Link href="/search">Browse opportunities</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Availability</CardTitle>
            <Badge variant="secondary">Live</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {availability.length ? (
              availability.map((slot) => (
                <div key={slot.id} className="rounded-md border p-3 text-sm">
                  <p className="font-medium">{formatAvailability(slot.start, slot.end)}</p>
                  <p className="text-xs text-muted-foreground">{slot.timezone}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Publish your first slot to let agencies know when you&apos;re free.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="link" className="px-0 text-sm">
              <Link href="/dashboard?view=availability">Manage calendar</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inbox</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {inbox.length ? (
              inbox.map((message) => (
                <div key={message.id} className="space-y-1 rounded-md border p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {message.booking.projectName}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {message.sender.name ?? message.sender.handle}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">You&apos;re all caught up.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="link" className="px-0 text-sm">
              <Link href="/sign-in">Open full inbox</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      {profile ? (
        <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Profile snapshot</CardTitle>
              <CardDescription>
                Keep your profile fresh so producers understand your skillset at a glance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Handle</p>
                <p className="text-lg font-medium">@{profile.handle}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Primary tags</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.tags.length ? (
                    profile.tags.map(({ tag }) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Add tags to help agencies find you.
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="rounded-md border p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Starting day rate
                  </p>
                  <p className="text-lg font-semibold">{formatEuro(profile.dayRate ?? 450)}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Base city</p>
                  <p className="text-lg font-semibold">{profile.location}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Jump into the workflows you use most.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button asChild variant="outline">
                <Link href="/dashboard?view=bookings">Review booking requests</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/profile/${profile.handle}`}>Preview public profile</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-in">Invite collaborator</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
