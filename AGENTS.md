<!--
  MANAGED FILE — synced from crithits/agent-standards. Local edits will be overwritten.
  Put anything specific to this repo or folder in the AGENTS.local.md next to this file.
-->

# AGENTS.md — React + TypeScript

Guidance for coding agents working in this project. Lint (`@crithits/eslint-config-react`) and typecheck (`@crithits/tsconfig`) enforce most of this; when a rule here conflicts with a lint error, fix the code, don't silence the linter.

**Also read `AGENTS.local.md`** in the same folder as this file. It has this project's architecture, commands that differ from the defaults below, and local conventions. Where it conflicts with this file, it wins.

In a monorepo this file may sit in a subfolder (e.g. `apps/web/`). It then covers only that folder, and the repo's root `AGENTS.md` still applies (git workflow, secrets, and so on).

## Commands

Every project exposes these `package.json` scripts (use the repo's package manager — check the lockfile):

- `typecheck` — `tsc --noEmit`
- `lint` — ESLint with the shared config (`lint:fix` to autofix)
- `test` — unit tests
- `dev` / `build`

**Before saying a task is done:** run `typecheck`, `lint`, and the tests touching your change. Report what you ran and whether it passed.

**Before opening a PR:** after those checks pass, run `ponytail-review` on the whole branch: every change since it left the base branch, not only uncommitted work. Then:

- Fix each _Must fix_ finding that's in the PR's scope, and rerun the checks.
- List the other findings for the user; fix them only if asked.
- If you leave a _Must fix_ finding unfixed, say so and why, and put it under _Open_ in the PR's review notes.

This applies inside any workflow that opens a PR. It doesn't apply when you only edit an existing PR's title or description.

## Skills

These skills are installed once per machine, not in this repo. Load them when relevant:

- `vercel-react-best-practices` — performance: waterfalls, bundle size, re-renders. Use when writing or reviewing components or data fetching.
- `vercel-composition-patterns` — component API design: compound components, avoiding boolean-prop sprawl.
- `pr-description` (version 1) — titles and descriptions for pull requests. **Always** use it when you open a PR or edit a PR's title or description, including inside another workflow that opens one. Don't write a PR body without it.
- `ponytail` — the smallest change that fully solves the task. Use it on every coding task: writing, fixing, refactoring, choosing dependencies. Where it conflicts with this file, this file wins.
- `ponytail-review` — review a change for correctness, safety, load, tests and needless code. **Always** run it before you open a PR (see _Before opening a PR_ above), and use it when asked to review a diff, commit or PR.
- `ponytail-audit` — one-shot quality audit of a whole repo. Use when asked to audit the codebase or find what to delete.
- `ponytail-debt` — lists the `shortcut:` comments `ponytail` leaves as a debt ledger. Use when asked what was deferred.
- `unslop` — turns generic, AI-looking UI into a designed interface. Use when asked to polish, clean up or redesign a screen, or when a UI you're building shows its tells (glows, gradient text, emoji labels, uneven spacing). Keep the product's design system and components.
- `security-audit` — security guidance and vulnerability review. Use for security questions and when reviewing code at a trust boundary (auth, input handling, secrets). Run the full audit only when asked for one.
- `tdd` — test-first loop and what makes a test worth keeping. Use when building a feature or fixing a bug test-first. The Testing rules below still apply.
- `diagnosing-bugs` — a diagnosis loop for hard bugs and performance regressions. Use when something is broken, throwing, failing or slow and the cause isn't obvious.

**If any of them is missing from your available skills,** tell the user once, at the start of your first reply in the session, then carry on with the task (everything else in this file still applies). Give them the command for each missing skill; these install for Claude Code and Codex:

```sh
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices --skill vercel-composition-patterns -g -a claude-code -a codex -y
```

```sh
npx skills add crithits/agent-standards --skill pr-description -g -a claude-code -a codex -y
```

```sh
npx skills add DietrichGebert/ponytail --skill ponytail --skill ponytail-review --skill ponytail-audit --skill ponytail-debt -g -a claude-code -a codex -y
```

```sh
npx skills add heydamir/unslop --skill unslop -g -a claude-code -a codex -y
```

```sh
npx skills add cloudflare/security-audit-skill --skill security-audit -g -a claude-code -a codex -y
```

```sh
npx skills add mattpocock/skills --skill tdd --skill diagnosing-bugs -g -a claude-code -a codex -y
```

For another agent, swap the `-a` values (e.g. `-a cursor`). Don't run them yourself unless the user asks: they install into their home directory. Skills load when a new session starts. `npx skills update -g` updates them later.

**If a skill listed with a version above is out of date,** tell the user once, then use it as installed. You can only tell when you load it: compare the `Skill version:` line near its top with the version listed here. It's out of date when that line is missing or its number is lower. Give the user the update command, and say that if the skill is still out of date after it, they should run the `npx skills add` command above again:

```sh
npx skills update -g
```

If you're about to open a PR and `pr-description` is still missing, follow `https://github.com/crithits/agent-standards/blob/main/skills/pr-description/SKILL.md` instead of improvising. If `ponytail-review` is missing, follow `https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail-review/SKILL.md` the same way.

## Effects: `useEffect` is a last resort

Effects are for synchronizing with systems _outside_ React. Before writing one, check this list — most effects in agent-written code fall into one of these:

| If you're about to...                              | Do this instead                                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Compute a value from props/state                   | Calculate it during render. `const total = items.reduce(...)`                                          |
| Cache an expensive calculation                     | Compute during render (React Compiler memoizes); `useMemo` only if the compiler is off                 |
| Reset state when a prop changes                    | Pass a `key` so React remounts: `<Profile key={userId} />`                                             |
| Adjust some state when a prop changes              | Derive it, or store the ID not the object                                                              |
| Respond to a user action (submit, click)           | Put the logic in the event handler                                                                     |
| Notify a parent of a state change                  | Call the parent's callback in the same event handler                                                   |
| Fetch data                                         | Use the project's data layer (TanStack Query / router loader / RSC) — never raw `fetch` in `useEffect` |
| Subscribe to an external store                     | `useSyncExternalStore`                                                                                 |
| Chain effects that set state that triggers effects | Collapse into one event handler or derived values                                                      |

Legitimate effects: DOM APIs (focus, measure, third-party widgets), subscriptions with cleanup, analytics on mount, syncing with non-React code. Every effect must have a cleanup if it subscribes, starts a timer, or opens a connection. Use `useEffectEvent` for non-reactive logic read inside an effect rather than disabling `exhaustive-deps`.

Reference: https://react.dev/learn/you-might-not-need-an-effect

## Components and hooks

- Function components only. In React 19, `ref` is a regular prop — don't use `forwardRef`.
- Never define a component inside another component's body.
- Never call hooks conditionally or in loops.
- Keys must be stable IDs, not array indexes (unless the list is static and never reordered).
- Keep components pure: no mutations of props, state, or module-level variables during render; no reading `ref.current` during render.
- Don't add `useMemo` / `useCallback` / `React.memo` by default — the React Compiler handles memoization. Add manually only with a measured reason.
- Extract a custom hook when logic is reused or an effect needs a name; name it for what it does (`useOnlineStatus`), not how.
- Prefer composition (children, slots) over boolean prop explosions like `isPrimary isLarge isCompact`.

## State

- Keep state minimal. If it can be derived from other state or props, it isn't state.
- Don't mirror props into state.
- Group related state; use a reducer when updates depend on each other.
- Server data lives in the data-fetching cache, not in `useState` or a global store.
- Shareable UI state (filters, tabs, pagination) belongs in the URL.
- Colocate state as low as possible; lift only when siblings need it. Reach for context only for truly app-wide values.

## TypeScript

- `strict` is on; keep it that way. No `any` — use `unknown` and narrow.
- No `as` casts to silence errors. Validate external data (API responses, `localStorage`, URL params, form input) at the boundary with a schema (e.g. Zod), and let types flow from there.
- No non-null assertions (`!`) — handle the null case.
- Model variant state with discriminated unions, not parallel booleans:
  `type State = { status: 'loading' } | { status: 'error'; error: Error } | { status: 'ok'; data: User }`
- Prefer string-literal unions or `as const` objects over `enum`.
- Use `satisfies` to check object shapes without widening.
- Type props with a named `type` next to the component; don't use `React.FC`.
- Use `import type` for type-only imports.
- Don't hand-write types for things you can infer (`ReturnType`, `z.infer`, `ComponentProps<typeof X>`).

## Accessibility

- Use semantic elements: `<button>` for actions, `<a href>` for navigation. No `onClick` on `div`/`span`.
- Every input has an associated label; every image has meaningful `alt` (or `alt=""` if decorative).
- Interactive elements must be keyboard reachable and show focus.

## Testing

- Test behavior, not implementation: React Testing Library queries by role/label/text (`getByRole`), not test IDs or class names unless unavoidable.
- Use `userEvent` over `fireEvent`.
- Don't snapshot whole components.
- Mock at the network boundary (MSW), not internal modules.

## Guardrails

- Do not add `eslint-disable`, `@ts-ignore`, or `@ts-expect-error` to make errors go away. If a rule is genuinely wrong for a case, explain why in a comment and flag it in your summary.
- Do not add new dependencies without asking.
- Do not edit generated files, lockfiles by hand, or `*.d.ts` from packages.
- Match existing patterns in the codebase before introducing new ones. If you think a pattern is wrong, say so rather than silently diverging.
- Keep diffs focused on the task; no drive-by refactors.
- Do not edit `AGENTS.md` or `CLAUDE.md` — they're synced from `agent-standards`. Don't override shared lint rules in `eslint.config.js` to get past an error. Propose changes in `agent-standards` instead.
