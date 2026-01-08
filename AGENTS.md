# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router entry (pages, `layout.tsx`, `page.tsx`), global styles in `app/globals.css`.
- `components/`: Reusable UI (shadcn-style primitives in `components/ui/`, theming in `components/theme-provider.tsx`).
- `hooks/`: Custom React hooks (e.g., `hooks/use-toast.ts`).
- `lib/`: Utilities (e.g., `lib/utils.ts`).
- `public/`: Static assets (icons, placeholders).
- `styles/`: Additional global CSS.
- Root config: `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `components.json`.

## Build, Test, and Development Commands
- Install deps (pnpm preferred): `pnpm install`
- Start dev server: `pnpm dev` (http://localhost:3000)
- Lint sources: `pnpm lint` (uses ESLint; install if missing)
- Production build: `pnpm build`
- Serve production: `pnpm start`

## Coding Style & Naming Conventions
- Language: TypeScript + React (Next.js 16). Use `.tsx` for components/pages.
- Indentation: 2 spaces; quotes: double; prefer functional components and hooks.
- Components: PascalCase filenames in `components/`; hooks start with `use*` in `hooks/`.
- CSS: Tailwind CSS v4 utility-first; keep minimal custom CSS in `app/globals.css` or `styles/`.
- Imports: Use path aliases where configured (e.g., `@/components/ui/button`).

## Testing Guidelines
- No test runner is configured yet. If adding tests, prefer Vitest + React Testing Library for unit/UI and Playwright for e2e.
- Name tests `*.test.ts(x)` alongside source or under `tests/`.
- Aim for meaningful coverage on game logic (state transitions, timers) and critical UI.

## Commit & Pull Request Guidelines
- Commit style: use Conventional Commits (e.g., `feat(app): add reaction timer reset`). Keep commits small and focused.
- PRs: include a concise description, screenshots/GIFs for UI changes, and any manual test steps.
- Link related issues; note breaking changes under a "BREAKING CHANGE" section.
- Verify locally: `pnpm build` must pass; run `pnpm lint` and smoke-test `pnpm dev` before requesting review.

## Security & Configuration Tips
- Never commit secrets. Use `.env.local` for local overrides (`.env*` is git-ignored).
- Update `next.config.mjs` for runtime/config changes and document required env vars in the PR.
