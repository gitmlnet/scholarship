# ScholarSphere

**ScholarSphere Excellence Scholarship 2026** — a premium scholarship/education platform built as a
learning project.
*Empowering potential. Recognizing excellence. Shaping tomorrow.*

> ⚠️ **Fictional learning project.** ScholarSphere processes no real students, payments, or personal
> information. All names, schools, dates, statistics, and payment details are fictional. The backend
> is a realistic in-browser mock API designed to teach full-stack architecture — see
> [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

**Status:** Phase 1 (Foundation) complete — app shell, layered mock-API architecture, i18n, CI.
Public pages arrive in Phase 3.

---

## Technology Stack

| Concern | Choice | Version |
|---|---|---|
| UI library | React | 19 |
| Language | TypeScript (strict) | 6 |
| Build tool | Vite | 8 |
| Routing | React Router (library mode) | 8 |
| Styling | Tailwind CSS (token-first `@theme`) | 4 |
| Server state | TanStack Query | 5 |
| Forms (Phase 4) | React Hook Form + Zod | — |
| i18n | i18next + react-i18next (English / বাংলা) | 26 / 17 |
| Tests | Vitest + Testing Library (jsdom) | 5 |
| Quality | ESLint 10 + typescript-eslint + Prettier | — |
| CI/CD | GitHub Actions → GitHub Pages | — |

## Quick Start

```bash
npm install       # install dependencies (Node ≥ 22.12)
npm run dev       # dev server at http://localhost:5173
npm run test      # unit + component tests (36 tests)
npm run lint      # eslint (includes architecture-boundary rules)
npm run typecheck # strict TypeScript
npm run build     # typecheck + production build → dist/
npm run preview   # serve the production build locally
```

No database, no environment setup, no secrets — the backend is simulated in the browser.

## Architecture (the short version)

```
UI (pages, features, components)
  ↓ uses
Services (settings, notices, stats, … applications later)   ← the only API the UI may import
  ↓ uses
ApiClient interface  ──►  MockApiClient (in-browser, HTTP-shaped, latency, errors)   ← today
                       └► FetchApiClient (real HTTP via VITE_API_BASE_URL)           ← future
  ↓ dispatches to
Mock server (route table, validation, state machine, audit log, authorization)
  ↓ reads/writes
Mock DB = seed data (code) ⊕ user-generated demo data (localStorage)
```

- The **UI never touches** mock data, `fetch`, or `localStorage` directly — enforced by ESLint
  architecture-boundary rules that fail CI.
- Requests are HTTP-shaped (`GET /notices/:id`) with simulated latency and realistic failures
  (404/409/422/500), so swapping in a real backend later means implementing one interface
  (`FetchApiClient` already exists as proof).
- **Seed data** (fictional notices, FAQs, stats, program settings) lives in `src/data/seed/`;
  **user-generated demo data** (applications, audit log) persists in versioned localStorage keys.

Full details, the data model, API surface, and the phase plan: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.
Development workflow and conventions: **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)**.

## Folder Structure

```
src/
├── app/            # composition root: router, providers, layouts
├── pages/          # thin route components (lazy-loaded)
├── components/     # ui/ (design-system primitives), layout/, common/
├── features/       # vertical slices (notices/, registration/ …) with colocated hooks
├── services/       # the ONLY module the UI imports for data (+ error helpers, query policy)
├── lib/api/        # ApiClient interface, MockApiClient, FetchApiClient
├── mock-api/       # simulated server: routes, handlers, DB, localStorage persistence
├── data/seed/      # fictional seed content (bilingual en/bn)
├── config/         # static site constants + public env handling
├── i18n/           # i18next setup + translations/{en,bn}/*.json
├── hooks/          # useSettings, useStats, useLocalized, useDocumentMeta
├── types/          # domain types — the shared "schema"
├── styles/         # design tokens (@theme) + base styles
└── test/           # test setup
tests/e2e/          # (planned) Playwright, CI-only
docs/               # architecture + development guides
.github/workflows/  # ci.yml, deploy.yml
```

Unit tests are colocated with the code they test (`*.test.ts(x)`).

## Internationalization

- UI strings: `src/i18n/translations/{en,bn}/*.json` — a CI test enforces **exact key parity**
  between English and বাংলা, so no translation can go missing.
- Domain content (notices, FAQs, settings): bilingual `LocalizedText { en, bn }` fields on seed
  entities, rendered through `useLocalized()`.
- The language switcher updates instantly, persists the preference, and switches
  `<html lang>` (fonts, screen readers, and Bengali line-height follow).

## Testing

`npm run test` covers the foundation: mock-client transport (routing, params, latency, abort,
error shaping), real-client contract (fetch mocking), localStorage persistence (corruption
handling), service behavior through the mock API, translation parity, language switching, and an
end-to-end app smoke test (hero + notices + stats + বাংলা round-trip). The design system is
covered by a **WCAG AA contrast gate** (`src/styles/contrast.test.ts` — every token pair the UI
relies on) plus per-primitive behavior tests (forms wiring, modal, tabs keyboard, toasts,
pagination, …), and every public page has colocated tests (data loading, filtering, forms,
URL-driven state). The registration wizard has an end-to-end suite (per-step validation, draft
autosave/restore/discard, review edit-jumps, submission with generated application IDs, duplicate
payment rejection, fee display) alongside service-level tests for `POST /applications`.

The remaining test matrix (status transitions, payment verification, data isolation, …) lands
phase by phase — see ARCHITECTURE.md §14.

## Design System

An internal reference lives at **`/style-guide`** (dev tool: English-only, `noindex`, excluded
from robots) — it renders every primitive, the color scales, typography, and the live AA contrast
table. Components live in `src/components/ui/`; tokens in `src/styles/tokens.css`.

## Deployment (GitHub Pages)

1. **One-time:** repo *Settings → Pages → Build and deployment → Source: **GitHub Actions***.
2. Merge work to `main` (PRs come from the working branch).
3. `deploy.yml` runs: install → test → build (`GITHUB_PAGES=true` sets the `/scholarship/` base)
   → `404.html` SPA fallback → deploy.
4. Site: https://gitmlnet.github.io/scholarship/

## Demo Accounts

Demo authentication is simulated (sessionStorage token, 8-hour expiry, salted-hash credentials —
a teaching pattern, not production security). Sessions die with the browser tab. The admin UI
arrives in Phase 7; the accounts already work at the API/service layer.

| Account | Email | Password | Role |
|---|---|---|---|
| Program Office | `admin@scholarsphere.test` | `demo-admin-2026` | admin |
| Ayesha Rahman | `ayesha@scholarsphere.test` | `demo-applicant-2026` | applicant (owns `SS26-100001`) |
| Rafiq Chowdhury | `rafiq@scholarsphere.test` | `demo-applicant-2026` | applicant (owns `SS26-100002`) |

Applicants only ever see their own applications (`/me/applications`); guessing another person's
application ID via public tracking reveals only status data — never names, schools, or contacts.

**DemoPay payment simulation (deterministic):** roughly 2 seconds after submission the payment
"verifies" and the application moves to `under_review`. Transaction IDs **ending in `00`** are
flagged for admin attention instead (the application stays `payment_pending` until an admin
accepts or rejects the payment). No real provider is contacted — this is documented, testable
simulation.

## Environment Configuration

See [.env.example](.env.example) — public, non-secret values only (`VITE_API_BASE_URL`,
`VITE_MOCK_LATENCY`, `VITE_DEMO_MODE`). **Never commit secrets**; nothing in this project needs
one.

## Development Workflow

Work happens on the session branch `arena/01a07a3a-scholarship` in small, conventional commits,
pushed to GitHub, and opened as a PR to `main` when a phase is gated green. CI
(lint → format → typecheck → test → build) must pass before merge. Details:
[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).
