import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/search", label: "Search talent" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/sign-in", label: "Sign in" },
];

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn("sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur", className)}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Firenze Connect
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
            <Link href="/sign-up">Join the network</Link>
          </Button>
          <Button asChild size="sm" className="md:hidden">
            <Link href="/search">Search</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
