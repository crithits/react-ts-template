# react-ts-template

Starter for React + TypeScript repos, wired to [agent-standards](https://github.com/crithits/agent-standards):

- **Vite 8 + React 19 + React Compiler**: no manual `useMemo`/`useCallback`.
- **`@crithits/eslint-config-react`**: React Compiler lint rules (including `set-state-in-effect`), strict type-checked TypeScript, a11y.
- **`@crithits/tsconfig`**: strict, with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
- **Vitest + Testing Library**: role-based queries, `userEvent`.
- **Agent files**: `AGENTS.md`, `CLAUDE.md` and `.agents/skills/` + `.claude/skills/` are synced from agent-standards. `AGENTS.local.md` is yours.

## Starting a new repo

1. On GitHub, **Use this template → Create a new repository**.
2. Fill in `AGENTS.local.md`: what the repo is, its layout, its data layer.
3. Add the repo to `repos:` in agent-standards' `.github/sync.yml`, and install the sync App on it, so it gets future rule updates.
4. Give the repo read access to the packages: org **Packages → `eslint-config-react` / `tsconfig` → Package settings → Manage Actions access → Add repository**. (Not needed if the packages inherit org-wide access.)
5. For Dependabot updates to `@crithits/*`, add an org or repo Dependabot secret `DEPENDABOT_PACKAGES_TOKEN` (a token with `read:packages`).

## Local setup

```sh
# once per machine: a GitHub token with read:packages
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> ~/.npmrc

pnpm install
pnpm dev
```

## Scripts

| | |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `lint:fix` | ESLint, zero warnings allowed |
| `pnpm test` / `test:watch` | Vitest |
| `pnpm build` | Typecheck, then production build |
