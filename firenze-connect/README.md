# Firenze Connect

Firenze Connect is a Next.js 15 marketplace starter tailored for Florence's creative community. It combines Supabase Auth (email magic links), Prisma, and shadcn/ui so you can launch a curated roster of artists and models with modern developer ergonomics.

## Features

- ⚡️ **Next.js 15 App Router + TypeScript** with a clean route grouping structure for marketing, auth, search, dashboard, and profile experiences.
- 🎨 **Tailwind CSS & shadcn/ui** components configured with shared design tokens and reusable UI primitives.
- 🔐 **Supabase Auth** integration using email magic links and a callback route that exchanges codes for sessions.
- 🗃️ **Prisma data layer** targeting Supabase Postgres with models for users, tags, portfolios, availability, bookings, and threaded messages.
- 🌱 **Seed script** that loads demo artists, models, availability slots, bookings, and messages centred around Florence.
- ✅ ESLint + Prettier ready to keep the codebase consistent.

## Project structure

```
app/
  (marketing)/page.tsx      -> Landing page with featured talent
  (search)/search/page.tsx  -> Talent discovery experience
  (auth)/sign-in/page.tsx   -> Supabase magic-link sign in
  (auth)/sign-up/page.tsx   -> Supabase invite request form
  (dashboard)/page.tsx      -> Authenticated workspace demo
  (profile)/[handle]/page.tsx -> Public profile powered by Prisma
lib/
  auth.ts  -> Supabase helpers
  db.ts    -> Prisma client singleton
  utils.ts -> UI helpers & formatters
components/
  ui/      -> shadcn/ui primitives (button, input, card, ...)
  site-*.tsx, auth/ -> layout and form components
prisma/
  schema.prisma
  migrations/0001_init/migration.sql
  seed.ts
```

## Prerequisites

- Node.js 20+
- npm (or pnpm/yarn) — the repository uses npm scripts by default
- A Supabase project with Postgres enabled

## Environment variables

Duplicate `.env.example` to `.env` and populate the values from your Supabase project:

```bash
cp .env.example .env
```

| Variable                        | Description                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| `DATABASE_URL`                  | Supabase Postgres connection string (used by Prisma).                                    |
| `DIRECT_URL`                    | Direct connection string for Prisma migrations (Supabase dashboard > Database settings). |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL.                                                                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key for the browser client.                                                |
| `SUPABASE_SERVICE_ROLE_KEY`     | Service role key (only required for elevated server-side tasks).                         |
| `NEXT_PUBLIC_SITE_URL`          | Base URL for magic link redirects (e.g. `http://localhost:3000`).                        |

## Database

1. **Install dependencies** (already done if you ran `npm install`).
2. Generate the Prisma client and apply migrations:

```bash
npm run db:generate
npm run db:migrate
```

> ℹ️ Supabase enables the `uuid-ossp` extension by default. If you are using another Postgres instance, run `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` before applying the migration.

3. Seed the demo data:

```bash
npm run db:seed
```

This loads Florence-based talent profiles, availability slots, example bookings, and threaded messages so the UI has realistic content.

## Supabase Auth

- The sign-in and sign-up forms send email magic links via `supabase.auth.signInWithOtp`.
- The callback handler lives at `/auth/callback` and exchanges the code for a session using `@supabase/ssr` helpers.
- Update the `NEXT_PUBLIC_SITE_URL` env variable to match your development hostname so Supabase can redirect correctly.

## Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the marketing homepage. Navigation links take you to search, dashboard, and profile flows powered by the seeded Prisma data.

## Quality tooling

```bash
npm run lint     # ESLint with Prettier integration
npm run format   # Prettier formatting
```

## Deployment

The project is ready to deploy on Vercel. Set the same environment variables (`DATABASE_URL`, `DIRECT_URL`, Supabase keys) in your hosting provider. Run `npm run db:migrate` during deploys to keep Postgres in sync.

---

Built with ❤️ in Florence.
