import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Firenze Connect. Crafted in Tuscany.</p>
        <nav className="flex flex-wrap items-center gap-4">
          <Link href="/search" className="hover:text-foreground">
            Search
          </Link>
          <Link href="/sign-in" className="hover:text-foreground">
            Sign in
          </Link>
          <Link href="/sign-up" className="hover:text-foreground">
            Join
          </Link>
          <a
            href="https://supabase.com/docs/guides/auth"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            Supabase Auth
          </a>
        </nav>
      </div>
    </footer>
  );
}
