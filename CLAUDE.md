# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev        # Start dev server at http://localhost:3000 (HMR)
npm run build      # Production build (TypeScript errors ignored via next.config.mjs)
npm run start      # Serve production build
npm run lint       # ESLint (config not yet set up — will fail)
```

Note: AGENTS.md references pnpm, but `package-lock.json` is the actual lockfile — use **npm**.

## Tech Stack

- **Next.js 16** with App Router, **React 19**, **TypeScript** (strict mode)
- **Tailwind CSS v4** via `@tailwindcss/postcss` — CSS variables with OKLCH colors defined in `app/globals.css`
- **shadcn/ui** (new-york style, RSC-enabled) — components in `components/ui/`, configured in `components.json`
- **Supabase** for auth (Google OAuth) and PostgreSQL database
- **Recharts** for reaction time trend charts
- **Vercel Analytics** integrated in root layout
- Deployed to **Vercel** at `https://reactiontest.site`

## Architecture

### Data Flow

```
Browser ─── Next.js Server (App Router) ─── Supabase (Auth + PostgreSQL)
                                         └── Google OAuth
```

### Server vs Client Components

- **Server Components** (default): `app/page.tsx`, `app/account/page.tsx`, `app/pricing/page.tsx` — fetch user via `createClient()` from `utils/supabase/server.ts`
- **Client Components** (`"use client"`): `components/reaction-time-game.tsx`, `components/auth-header.tsx`, `components/google-signin.tsx` — use `utils/supabase/client.ts`

Both Supabase client factories return `null` when env vars are missing — callers must handle this.

### Auth Flow

1. `GoogleSignIn` → `supabase.auth.signInWithOAuth({ provider: 'google' })` → redirects to `/auth/callback`
2. `app/auth/callback/route.ts` exchanges the code for a session
3. `middleware.ts` refreshes the Supabase session cookie on every request (excludes static files, sitemap, robots)

### Core Game Logic

`components/reaction-time-game.tsx` — a client component with state machine:
- States: `waiting` → `ready` → `active` → `result` (or `too-early` on premature click)
- Uses `performance.now()` for high-resolution timing via `onPointerDown`
- Fixed at 5 attempts (`MAX_ATTEMPTS`), then shows summary with trend chart and floating reset button

### Database

`profiles` table (see `supabase/membership.sql`): `id` (UUID FK to auth.users), `email`, `membership_start`, `membership_end` with RLS — users can only read their own row.

## Path Aliases

`@/*` maps to the project root (configured in `tsconfig.json`). Example: `import { Button } from '@/components/ui/button'`

## Key Conventions

- **Commit style**: Conventional Commits with optional scope — `feat(app):`, `fix:`, etc.
- **Components**: PascalCase filenames, functional components with hooks
- **Styling**: Tailwind utility classes; use `cn()` from `lib/utils.ts` (wraps `clsx` + `tailwind-merge`) for conditional classes
- **Pages**: Each page renders `<AuthHeader user={user} />` at the top with a consistent gradient background

## Environment Variables

Stored in `.env.local` (git-ignored):
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous/public key

## Known Gaps

- No test runner configured (AGENTS.md recommends Vitest + React Testing Library + Playwright)
- ESLint config missing — `npm run lint` will fail
- `next.config.mjs` sets `ignoreBuildErrors: true` — TypeScript errors won't block builds
