# Development Guide

How we work on ScholarSphere. Read this before your first contribution.

## Prerequisites

- Node.js ≥ 22.12 (check with `node --version`)
- npm ≥ 10

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the built app locally |
| `npm run lint` | ESLint (includes architecture-boundary rules) |
| `npm run format` / `format:check` | Prettier (write / verify) |
| `npm run typecheck` | `tsc -b` across project references |
| `npm run test` / `test:watch` | Vitest (single run / watch mode) |

## Architecture Rules (enforced by CI)

The layered architecture only works if the boundaries hold. ESLint fails the build when they don't:

1. **UI never imports the API layer.** `src/app`, `src/components`, `src/features`, `src/hooks`,
   and `src/pages` may not import `@/lib/api*`, `@/mock-api*`, or `@/data/**`. They use
   `src/services`.
2. **Services never import the mock server or seeds directly.** They go through
   `@/lib/api` (the `ApiClient` interface).
3. **Test files are exempt** — they verify integration across layers.

When you need API knowledge in the UI (e.g., "is this a 404?"), add a helper to
`src/services/errors.ts` instead of importing the API layer.

## Conventions

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) —
  `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.
- **Branches:** work happens on the session branch (`arena/01a07a3a-scholarship`); phases land as
  PRs to `main`. Never force-push to `main`.
- **TypeScript strict,** including `noUncheckedIndexedAccess` — handle possible `undefined`.
- **Design tokens only.** No raw hex values or magic spacing in components — everything comes from
  `src/styles/tokens.css` (`@theme`). New colors go into the token file.
- **i18n always.** No user-facing strings in components — every string goes into
  `src/i18n/translations/{en,bn}/*.json` (both languages, or the parity test fails).
  Domain content uses `LocalizedText { en, bn }` fields rendered with `useLocalized()`.
- **Accessibility is not optional.** Semantic landmarks, labeled controls, visible focus,
  keyboard paths, `prefers-reduced-motion` support. New interactive components need a keyboard
  story.
- **Tests colocated.** `Foo.tsx` ↔ `Foo.test.tsx`. Behavior that spans layers gets tested at the
  service or app level.
- **Design-system primitives live in `src/components/ui/`.** They are forward-ref, use design
  tokens only, and own their accessibility wiring. Compose them; don't fork their styles.
  - `Field` generates ids and wires `label`/`hint`/`error` to a single control via context
    (`aria-describedby`, `aria-invalid`, `aria-required`). `Checkbox`/`Radio` bring their own
    labels — never wrap them in `Field`.
  - Primitives with user-facing fixed strings (`Modal`, `Pagination`, `ToastProvider`) take them
    as props with English defaults; call sites pass translated strings.
- **Contrast is CI-enforced.** `src/styles/contrast.test.ts` verifies every pair in
  `AA_CONTRAST_PAIRS` (`src/utils/designTokens.ts`) against the real `tokens.css`. Change a color
  token → the gate re-runs. The internal style guide renders the same list with live ratios.

## Internal tooling (English-only exception)

The `/style-guide` route (and only it) is a development reference, not public content: its labels
are English-only, it is excluded from `robots.txt`, and it sets `noindex` via
`useDocumentMeta(..., { noindex: true })`. Everything user-facing remains fully bilingual.

## Testing notes

- Vitest runs with `css: true` so `import ... from '*.css?raw'` returns the real stylesheet
  source (Vite-native behavior; used by the contrast gate and the style guide).
- Fake timers: assert synchronously after `fireEvent` (don't mix `findBy*` polling with fake
  timers), and restore real timers in the same test — a timeout abort skips `finally`.

## Adding Things — Checklists

**A new page**
1. Create `src/pages/MyPage.tsx` (default export, call `useDocumentMeta`).
2. Register a lazy route in `src/app/App.tsx`.
3. Add nav/footer links + `pages` translations (en + bn).
4. If public content is needed, extend the relevant service + seed data first.

**A new service method**
1. Add the endpoint handler in `src/mock-api/routes/` (+ types in `src/types/`).
2. Add the service function in `src/services/`.
3. Add tests at the service level (success + failure paths).
4. UI consumes it via a hook (TanStack Query).

**A new translation key**
1. Add it to BOTH `en` and `bn` catalogs (parity test enforces this).
2. Reference it type-safely: first namespace of `useTranslation(...)` → unprefixed key; other
   namespaces → `ns:key` prefix.

## Phase Gates

Each phase in [ARCHITECTURE.md §18](ARCHITECTURE.md#18-development-phases-gated) ends with a gate
(all checks green: `lint` → `format:check` → `typecheck` → `test` → `build`) plus its phase-specific
acceptance criteria. Don't start the next phase with a red gate.

## Resetting Demo Data

User-generated demo data (applications, audit log) lives in localStorage under
`scholarsphere.db.v1.*`. The admin dashboard will offer a "Reset demo data" action (Phase 7);
during development, clear site data in devtools or run `resetMockApi()` from a test.
