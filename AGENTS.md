<!--
  MANAGED FILE — synced from crithits/agent-standards. Local edits will be overwritten.
  Put anything specific to this repo in AGENTS.local.md instead.
-->

# AGENTS.md — React + TypeScript

Guidance for coding agents working in this repo. Lint (`@crithits/eslint-config-react`) and typecheck (`@crithits/tsconfig`) enforce most of this; when a rule here conflicts with a lint error, fix the code, don't silence the linter.

**Also read `AGENTS.local.md`** in the repo root. It has this repo's architecture, commands that differ from the defaults below, and local conventions. Where it conflicts with this file, it wins.

## Commands

Every repo exposes these `package.json` scripts (use the repo's package manager — check the lockfile):

- `typecheck` — `tsc --noEmit`
- `lint` — ESLint with the shared config (`lint:fix` to autofix)
- `test` — unit tests
- `dev` / `build`

**Before saying a task is done:** run `typecheck`, `lint`, and the tests touching your change. Report what you ran and whether it passed.

## Skills

Deeper references live in `.agents/skills/` (and `.claude/skills/`). Load them when relevant:

- `vercel-react-best-practices` — performance: waterfalls, bundle size, re-renders. Use when writing or reviewing components or data fetching.
- `vercel-composition-patterns` — component API design: compound components, avoiding boolean-prop sprawl.

## Effects: `useEffect` is a last resort

Effects are for synchronizing with systems *outside* React. Before writing one, check this list — most effects in agent-written code fall into one of these:

| If you're about to... | Do this instead |
|---|---|
| Compute a value from props/state | Calculate it during render. `const total = items.reduce(...)` |
| Cache an expensive calculation | Compute during render (React Compiler memoizes); `useMemo` only if the compiler is off |
| Reset state when a prop changes | Pass a `key` so React remounts: `<Profile key={userId} />` |
| Adjust some state when a prop changes | Derive it, or store the ID not the object |
| Respond to a user action (submit, click) | Put the logic in the event handler |
| Notify a parent of a state change | Call the parent's callback in the same event handler |
| Fetch data | Use the project's data layer (TanStack Query / router loader / RSC) — never raw `fetch` in `useEffect` |
| Subscribe to an external store | `useSyncExternalStore` |
| Chain effects that set state that triggers effects | Collapse into one event handler or derived values |

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
- Do not edit `AGENTS.md`, `CLAUDE.md`, or anything under `.agents/skills/` / `.claude/skills/` — they're synced from `agent-standards`. Don't override shared lint rules in `eslint.config.js` to get past an error. Propose changes in `agent-standards` instead.
