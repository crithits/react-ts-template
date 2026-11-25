# react-ts-template

Starter for React + TypeScript repos, wired to [agent-standards](https://github.com/crithits/agent-standards):

- **Vite 8 + React 19 + React Compiler**: no manual `useMemo`/`useCallback`.
- **`@crithits/eslint-config-react`**: React Compiler lint rules (including `set-state-in-effect`), strict type-checked TypeScript, a11y.
- **`@crithits/tsconfig`**: strict, with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
- **Vitest + Testing Library**: role-based queries, `userEvent`.
- **Agent files**: `AGENTS.md` and `CLAUDE.md` are synced from agent-standards. `AGENTS.local.md` is yours. The React skills they mention are installed per machine (see Local setup).

## Starting a new repo

1. On GitHub, **Use this template → Create a new repository**.
2. Fill in `AGENTS.local.md`: what the repo is, its layout, its data layer.
3. For Dependabot updates to `@crithits/*`, add an org or repo Dependabot secret `DEPENDABOT_PACKAGES_TOKEN` (a token with `read:packages`).

The `@crithits/*` packages are public, so CI works in the new repo with no package-access setup. Because the repo has `AGENTS.local.md`, agent-standards will open PRs here when the shared rules change (delete that file to opt out). If the lockfile ever drifts from `package.json`, run **Actions → Update lockfile** (optionally *from scratch*) to regenerate and commit it.

## Local setup

```sh
# once per machine: a GitHub token with read:packages
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> ~/.npmrc

pnpm install
pnpm dev

# once per machine: the React skills for Claude Code and Codex
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices --skill vercel-composition-patterns -g -a claude-code -a codex -y
```

## Scripts

| | |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `lint:fix` | ESLint, zero warnings allowed |
| `pnpm test` / `test:watch` | Vitest |
| `pnpm build` | Typecheck, then production build |
