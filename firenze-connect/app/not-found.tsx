import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">We couldn&apos;t find that page</h1>
      <p className="max-w-md text-muted-foreground">
        Try adjusting your filters or head back to the roster to discover Florence&apos;s creative
        community.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/search">Browse talent</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
