# AGENTS.local.md

Repo-specific guidance for coding agents. This file is yours: the shared `AGENTS.md` is synced from `crithits/agent-standards` and overwritten, but this one never is. **Update it when you create a repo from the template.**

## What this repo is

<!-- Replace: one or two sentences on what it does and who uses it. -->
A React + TypeScript starter (Vite, React Compiler, Vitest, Testing Library).

## Architecture

- `src/main.tsx` — entry point
- `src/App.tsx` — root component
- `src/test/setup.ts` — Vitest setup (jest-dom matchers, cleanup)
- Tests sit next to the code they test: `Foo.tsx` → `Foo.test.tsx`

<!-- As the app grows, document the layout here, e.g.
- `src/features/<name>/` — one folder per feature: components, hooks, api, tests
- `src/lib/` — framework-agnostic utilities
-->

## Data fetching and state

<!-- Replace once chosen, e.g. "TanStack Query for all server state; hooks in src/features/*/api.ts". -->
No data layer chosen yet. Ask before adding one; don't fetch in `useEffect`.

## Commands

Package manager: **pnpm**. Defaults from `AGENTS.md` apply (`pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`).

## Local conventions

<!-- Anything agents keep getting wrong in this repo. -->
