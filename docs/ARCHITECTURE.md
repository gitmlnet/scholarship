# ScholarSphere — Architecture & Engineering Plan

**Status:** Proposed (Phase 0 complete). This document is the foundation for all implementation phases.
**Program:** ScholarSphere Excellence Scholarship 2026 (fictional)
**Tagline:** *Empowering potential. Recognizing excellence. Shaping tomorrow.*

---

## 0. Scope & Honesty Statement

This is a **learning project**. Nothing in it processes real students, real payments, or real personal information. All names, schools, notices, results, statistics, and payment details are fictional.

| Layer | Reality |
|---|---|
| Frontend (UI, routing, forms, i18n, a11y) | **Real implementation** |
| API / backend | **Simulated** — an HTTP-shaped mock API running in the browser |
| Persistence | **Demo persistence** — browser `localStorage` (per-device, not shared) |
| Authentication | **Demo auth** — fictional accounts, session tokens, role checks enforced in the mock API layer |
| Payments | **Simulated** — no gateway, no real numbers, deterministic demo verification |
| Real backend | **Future migration** — designed for, deliberately not built now |

We never claim "backend implemented" when it is frontend + simulation. The mock layers are built to *teach the architecture of* a real backend, and to be swappable for one later without UI rewrites.

**Reference rule:** No reference site has been supplied yet. When one is, it will be used only to understand category-level behavior (typical pages, workflow, IA). Branding, layout, colors, typography, copy, names, and content of this project will remain fully independent.

---

## 1. Phase 0 — Discovery Findings

Inspected 2026-09-07. **No existing application code** — the repository contained only a stub `README.md` (greenfield project, nothing to preserve).

| Item | Finding |
|---|---|
| Repository | `github.com/gitmlnet/scholarship`, default branch `main`, session branch `arena/01a07a3a-scholarship` |
| Git push | ✅ Works (HTTPS, authenticated). Push to the session branch creates it on origin. |
| `gh` CLI | ✅ v2.23.0, authenticated as a bot integration (`arena-ai-coding-agent[bot]`) |
| GitHub REST API | ⚠️ Scope-limited: **cannot read/configure Pages via API (403)**, cannot read user API. Repo content CRUD and git push work. |
| Node.js | ✅ v22.22.3 (satisfies Vite 7 requirement: ≥ 22.12) |
| npm | ✅ 10.9.8; registry reachable (~206 ms ping). yarn 1.22 also present; pnpm/bun absent → **npm** is the package manager. |
| Python | 3.11.2 (not needed) |
| Sandbox resources | 2 vCPU / 3.8 GB RAM / 21 GB disk — plenty for Vite dev + builds |
| Live preview | Arena proxies a dev server (bind `0.0.0.0`, default Vite port 5173) — used for phase-by-phase review |
| Headless browser | Not preinstalled → E2E (Playwright) is **optional/CI-only**; unit + component tests use jsdom |

**Consequences for decisions:**
1. GitHub Pages is viable, but the repo owner must **enable it once manually** (Settings → Pages → Source: *GitHub Actions*). My token cannot do this.
2. Static-first architecture is appropriate: no backend server is required by any feature (payments, auth, and data are all simulated by design), so we deploy a static SPA.
3. npm + Vite is the friction-free toolchain for this environment.

---

## 2. Technology Stack

| Concern | Choice | Rationale |
|---|---|---|
| UI library | **React 19** | Largest ecosystem, best learning value (component architecture, hooks, patterns transfer to any framework), best documentation |
| Language | **TypeScript (strict)** | Domain types *are* the schema; the type layer is the contract between UI, services, mock API, and a future real backend |
| Build tool | **Vite** | Fast, stable, first-class GitHub Pages static builds, zero-config TS/JSX/HMR |
| Routing | **React Router (library mode)** | Declarative nested routes + layouts; teaches real routing concepts; works on static hosting |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` tokens) | Design tokens as CSS custom properties + utility speed; industry standard for premium SaaS UIs; no runtime cost. **No component library** (no MUI/Bootstrap) — we build an original design system, avoiding template appearance and bundle bloat |
| Server state | **TanStack Query v5** | The realistic way to manage API data: loading/error/success states, caching, invalidation. Keeps us from hand-rolling caching against a service layer |
| Forms | **React Hook Form + Zod** (from Phase 4) | Industry standard for multi-step wizards; schema-first validation, accessible error binding; Zod schemas double as shared contracts for a future real API |
| i18n | **i18next + react-i18next** | Standard, supports namespaces + lazy loading + runtime language switching (English / বাংলা) |
| Fonts | **@fontsource (self-hosted)** incl. a Bengali-capable family (e.g. Noto Sans Bengali, from Phase 2) | No external font CDN at runtime; `unicode-range`-based lazy loading so Bengali glyphs only load when needed |
| Unit/component tests | **Vitest + Testing Library (jsdom)** | Fast, Vite-native; covers the entire required test matrix (§15) |
| E2E | **Playwright (optional, CI-only)** | No local browser in sandbox; added in Phase 9/10 if desired |
| Lint/format | **ESLint + typescript-eslint + Prettier** | CI gates: lint, typecheck, test, build; ESLint also enforces the architecture boundaries (§4) |

**Installed versions (Phase 1, 2026-09-07):** React 19.2 · TypeScript 6.0 · Vite 8.2 ·
React Router 8.3 · Tailwind 4.3 · TanStack Query 5.102 · i18next 26.4 / react-i18next 17.0 ·
Vitest 5.0 · ESLint 10.10. The toolchain resolved to newer majors than this doc originally
assumed (Vite 7 / RR7 / TS5); the APIs they expose are compatible with the planned architecture,
verified before implementation.

**Deliberately rejected (overengineering for this project):** Next.js (no SSR need; static export adds framework weight without benefit here), a Node/Express server or MSW service worker (a hand-rolled in-browser API layer is simpler, testable in jsdom, and equally swappable), Redux (unnecessary with TanStack Query + RHF), a real database (localStorage suffices for a per-device demo), Storybook (an internal `/style-guide` route serves the same purpose with zero dependencies).

---

## 3. Deployment Strategy (GitHub Pages)

```
git push (to main, via PR from session branch)
  → GitHub Actions: ci.yml (lint → typecheck → test → build)
  → GitHub Actions: deploy.yml (build → upload artifact → deploy)
  → GitHub Pages (https://gitmlnet.github.io/scholarship/)
```

- **Base path:** Vite `base: '/scholarship/'` (Pages serves the site under the repo name).
- **SPA deep links:** GitHub Pages has no URL rewriting. The deploy workflow copies `index.html` → `404.html` in the artifact, the standard SPA fallback: deep links like `/scholarship/track` boot the app, then React Router takes over. *(Alternative if we prefer zero tricks: `HashRouter`. Decision: try clean paths first; HashRouter is a documented fallback.)*
- **One-time manual step (repo owner):** Settings → Pages → Build and deployment → Source: **GitHub Actions**. My integration token cannot configure Pages (403). Until this is done, deploys queue but won't publish.
- **Preview during development:** every phase runs on the Arena live preview (`vite dev --host 0.0.0.0`), so review never depends on Pages.
- **Future real backend:** document the limitation rather than adding infrastructure now (§20).

---

## 4. Layered Architecture (the core idea)

```
┌───────────────────────────────────────────────┐
│ UI  (pages, features, components)             │  React only — no fetch, no localStorage, no mock data
├───────────────────────────────────────────────┤
│ Services  (ApplicationService, AuthService,   │  framework-agnostic TS modules; the ONLY API the UI imports
│            NoticeService, ResultService …)    │  own business phrasing: getApplications(), submitApplication()
├───────────────────────────────────────────────┤
│ ApiClient interface                           │  transport abstraction: request(method, path, body)
│   ├── MockApiClient   (now)                   │  in-browser route table, latency, errors, persistence
│   └── FetchApiClient  (future)                │  same interface over real HTTP (VITE_API_BASE_URL)
├───────────────────────────────────────────────┤
│ Mock API  (routes + handlers)                 │  the "server": validation, unique constraints, 401/403/404/409/422,
│                                             │  status machine, audit log, role enforcement
├───────────────────────────────────────────────┤
│ Mock DB  (seed ⊕ user data)                   │  in-memory tables with unique indexes → localStorage sync
└───────────────────────────────────────────────┘
```

**Rules that make the swap real:**
1. UI components never import from `mock-api/` or touch `localStorage`/`fetch` directly.
2. Services speak in domain terms and return typed results; errors are typed (`ApiError` with `status`, `code`, `details`).
3. All authorization (ownership, roles) is enforced in the **mock API layer**, never only in hidden UI.
4. Requests are HTTP-shaped (`GET /applications/:id`) with simulated latency (default ~150–450 ms; deterministic in tests) and realistic failures — validation errors, duplicate (409), unauthorized (401/403), not found (404), illegal transition (422).
5. `VITE_API_BASE_URL` set → services transparently use `FetchApiClient`. UI unchanged.

**Migration honesty:** when a real backend arrives, only `MockApiClient` is deleted; `FetchApiClient`, services, and all UI survive.

---

## 5. Folder Structure

Adapted to Vite/React conventions (deviation from the sketch in the brief: unit tests are colocated with source — the established Vitest practice; an integration/E2E folder remains at root).

```
scholarship/
├── .github/workflows/        # ci.yml, deploy.yml
├── docs/                     # ARCHITECTURE.md (this file), DEVELOPMENT.md, decisions/ (ADRs)
├── public/                   # robots.txt, favicon, og-image (static assets)
├── src/
│   ├── main.tsx              # bootstrap
│   ├── app/                  # router, providers, layouts (PublicLayout, AdminLayout)
│   ├── pages/                # thin route components composing features
│   ├── components/
│   │   ├── ui/               # design system primitives (Button, Field, Card, Badge, Modal, Table…)
│   │   ├── layout/           # Header, Footer, AnnouncementBar, LanguageSwitcher, SkipLink
│   │   └── common/           # SectionHeading, PageHero, StatusBadge, EmptyState, ErrorState…
│   ├── features/             # vertical slices, each with components + hooks + (colocated) tests
│   │   ├── registration/     #   7-step wizard
│   │   ├── applications/     #   tracking, status timeline
│   │   ├── notices/
│   │   ├── syllabus/
│   │   ├── results/
│   │   └── admin/
│   ├── services/             # UI-facing service modules (the only API the UI uses)
│   ├── lib/api/              # ApiClient interface, MockApiClient, FetchApiClient (future)
│   ├── mock-api/             # route table, handlers, auth/session module, middleware
│   ├── mock-api/db/          # tables, unique indexes, localStorage sync, reset
│   ├── data/seed/            # fictional seed content ONLY (notices, syllabi, results, faqs, users, settings)
│   ├── config/               # app config: program name, dates, fees, feature flags (non-secret)
│   ├── i18n/                 # i18next setup; translations/ (en/, bn/ JSON namespaces)
│   ├── hooks/                # useAuth, useLocalized, useDocumentMeta …
│   ├── utils/                # dates, ids, formatting, cn()
│   ├── types/                # domain types — the "schema"
│   ├── styles/               # tokens.css (@theme), base.css
│   └── test/                 # setup, factories, helpers
├── tests/e2e/                # Playwright (optional, later)
├── .env.example              # public, non-secret config only
├── index.html                # lang, meta, JSON-LD, font preloads
├── vite.config.ts / tsconfig / eslint.config / README.md
└── package.json
```

---

## 6. Data Model (domain types)

All in `src/types/`. Localizable content uses `LocalizedText = { en: string; bn: string }`.

| Entity | Key fields | Notes |
|---|---|---|
| `ProgramSettings` | programName, tagline, cycle (2026), shortCode (`SS26`), importantDates, feeByGrade, paymentMethod (fictional MFS, merchant placeholder `SCHOLARSPHERE-DEMO` — no real-format numbers), contacts | Single source of truth for configurable values; admin-editable later |
| `GradeConfig` | gradeId (4–10), eligibility rules, subjects, examDuration, totalMarks, instructions, syllabusRef | Per-grade configurability (§15 of brief) |
| `Syllabus` | gradeId, description, subjects[{name, topics[], weight}] | "Download" renders a generated info sheet (print-to-PDF friendly page or generated file) — never a broken link |
| `Notice` | id, date, category (`registration`/`exam`/`result`/`general`), pinned, title/description/details as `LocalizedText` | Content is data, not components |
| `Application` | id (`SS26-XXXXXX`), student, guardian, academic (gradeId, school), paymentRef{method, transactionId, status}, status, statusHistory[], correctionNote?, ownerUserId?, contactEmail, createdAt/updatedAt | Personal data stays inside the mock API; UI receives only authorized projections |
| `ApplicationStatus` | `draft → submitted → payment_pending → under_review → (needs_correction → under_review) → approved \| rejected` | State machine enforced **server-side** (mock API rejects illegal transitions with 422); timeline view derives from status + paymentRef.status |
| `Result` | year (2024, 2025 archives), gradeId, meritList[{position, name, school, score, award}] | Fully fictional; minimal personal data (name + school only, as public merit lists) |
| `Faq` | id, category, question/answer as `LocalizedText` | |
| `User` | id, email (`…@scholarsphere.test`), role (`applicant` \| `admin`), displayName, credentialRecord (salted hash, never plaintext) | Demo accounts only |
| `AuditEntry` | id, timestamp, actor, action (e.g. `application.created`, `application.status_changed`, `auth.login_failed`), recordType, recordId, result | Never stores passwords or tokens |
| `Statistic` | label `LocalizedText`, value, derivedFrom? | Homepage stats mix static fictional numbers with live counts from the mock DB |

**Application ID generation:** mock API generates `SS26-` + 6 digits (from `ProgramSettings.shortCode` + cycle), checks a unique index, retries on collision. Never hardcoded client-side.

**Duplicate transaction prevention:** unique index on `paymentRef.transactionId` per cycle → second submission with the same ID gets **409** with a friendly field-level error.

**Demo payment verification (deterministic, documented, testable):** after submission, status is `payment_pending`; a simulated verification job runs (~1.5–3 s): transaction IDs matching the documented demo "valid" pattern → payment verified, status `under_review`; a documented demo "invalid" pattern (e.g. ending in `00`) → flagged `needs_review` for admin attention. The UI always labels this as *demo simulation*, never a real provider verification.

---

## 7. API Surface (HTTP-shaped, mock now — real later)

```
# Public content
GET  /settings                     GET  /grades
GET  /notices?category=&limit=     GET  /notices/:id
GET  /syllabus                     GET  /syllabus/:gradeId
GET  /results?year=&grade=&q=      GET  /results/years
GET  /faqs                         GET  /stats

# Auth (demo)
POST /auth/login                   POST /auth/logout
GET  /auth/me                      → 401 when no/expired session

# Applications
POST /applications                 → 201 { id } (wizard submit; anonymous allowed)
GET  /applications/:id/status      → public-safe tracking payload (timeline only, NO personal data)
GET  /me/applications              → own applications only (auth)

# Admin (role: admin — enforced in mock API)
GET    /admin/applications?status=&grade=&q=&sort=&page=
GET    /admin/applications/:id
PATCH  /admin/applications/:id/status        { status, note }
POST   /admin/applications/:id/correction    { note }
GET    /admin/audit?recordId=
PATCH  /admin/settings, /admin/notices/:id   (later phases)
```

**Tracking without login (anti-enumeration by design):** `GET /applications/:id/status` returns only: current status, payment status, timeline step states, and timestamps — no name, email, school, or guardian data. Guessing an ID reveals nothing personal. (Optional later: require email match for richer detail.)

**Demo accounts (documented in README):** 1 admin + 2 seeded applicants with applications — used to demonstrate data isolation (applicant A cannot retrieve applicant B's application → 404).

---

## 8. Persistence Strategy

- **Seed data** lives in `src/data/seed/` as typed TS modules — read-only, versioned in git, trivially replaceable.
- **User-generated demo data** (submitted applications, sessions, audit log, admin edits, contact messages, wizard drafts) persists in `localStorage` under a **versioned namespace** (`scholarsphere.db.v1.*`), merged over seed at boot. Corrupt/unknown-shape records are schema-validated (Zod) and discarded on load.
- A **"Reset demo data"** action (admin dashboard + a small dev panel) clears user tables back to pristine seed state.
- Clear separation is maintained at all times: seed = code, user data = storage. Nothing crosses.

Limitation (documented, intentional): localStorage is **per-browser** — applications submitted in one browser are not visible in another. That is the demo persistence boundary; the real-backend migration removes it.

---

## 9. Auth & Authorization Model (demo, but architecturally honest)

- Login exchanges demo credentials for an **opaque random session token** (WebCrypto-generated), stored in `sessionStorage` (dies with the tab — safer default for a demo), expiry enforced by the mock API.
- Credentials stored as **salted hashes** in seed (WebCrypto SHA-256; teaching the pattern without pretending it's production-grade — documented as such).
- **Every mock handler enforces authorization**: applicant scope (`/me/*` filters by session user), admin-only routes reject non-admins (403), unauthenticated → 401. The UI hides nothing it isn't denied by the "server".
- No secrets in frontend code or git. `.env.example` contains only public config (`VITE_API_BASE_URL`, mock latency toggle, demo-mode flag).

---

## 10. Routing & Pages

**Public** (under `PublicLayout`: announcement bar, header/nav, footer, language switcher, skip link):

| Route | Page | Highlights |
|---|---|---|
| `/` | Home | Hero ("Your Potential Deserves an Opportunity."), program facts, overview, benefits, eligibility teaser, how it works, syllabus preview, stats, success stories, leadership message, latest notices, FAQ teaser, final CTA |
| `/scholarship` | Program | Purpose, benefits, exam structure, important dates, application process |
| `/eligibility` | Eligibility | Grade 4–10 cards, per-grade config |
| `/syllabus` (+`/:gradeId`) | Syllabus library | Subjects, details, working "download" (generated sheet) |
| `/notices` (+`/:noticeId`) | Notices | Filter by category, pinned first |
| `/register` | Registration | 7-step wizard (below) |
| `/track` | Track Application | ID lookup → status timeline |
| `/results` | Results | By year, by grade, search, merit list |
| `/faq`, `/contact`, `/privacy`, `/terms` | Support & legal | Contact stores to a mock inbox (labeled demo) |
| `/style-guide` | Design system reference | Internal, not in sitemap/nav |

Later (optional): `/about`, `/stories`, `/resources`.

**Admin** (under `AdminLayout`, demo login at `/admin/login`): dashboard stats → `/admin/applications` (search/filter/sort/paginate) → `/admin/applications/:id` (review, payment reference check, status updates, correction request, audit trail) → later: notices, settings, results, content management.

**Registration wizard** (7 steps): Eligibility → Student Info → Guardian Info → Academic Info → Payment Reference → Review → Confirmation. Progress indicator, per-step Zod validation with inline accessible errors, previous/next, autosaved draft (localStorage), loading state on submit, success screen with generated application ID + print/download acknowledgment. The wizard submits through the service layer exactly once; it never talks to mock data directly.

---

## 11. Design System

- **Tokens** in `styles/tokens.css` (Tailwind v4 `@theme`): color scales, typography, spacing, radius, shadow, z-index, motion — named, semantic (e.g. `--color-surface`, `--color-accent`), not one-off values.
- **Direction:** premium academic — deep navy, refined blue, warm gold accent, off-white surfaces, dark charcoal text. Exact values tuned in Phase 2 with **WCAG AA contrast verified per token pair** (navy-on-gold for CTAs, focus rings ≥ 3:1 on all surfaces).
- **Primitives** (`components/ui/`): Button (primary/secondary/ghost/destructive × sizes), Input/Select/Textarea with `Field` wrapper (label, hint, error wired via `aria-describedby` + `aria-invalid`), Checkbox/Radio, Card, Badge (status-colored), Alert, Modal (native `<dialog>`: focus trap, Esc, backdrop), Table (caption, scope), Tabs, Accordion, Pagination, Skeleton, EmptyState, ErrorState, Toast (`aria-live`), ProgressSteps, Timeline.
- **Motion:** small, purposeful (fade/slide 150–250 ms), fully disabled under `prefers-reduced-motion`.
- **Bengali typography:** self-hosted Bengali webfont via `@fontsource` unicode-range; `bn` gets slightly larger line-height (≈1.75) and `overflow-wrap: anywhere` guards on dense layouts; `document.documentElement.lang` switches with the language so screen readers and fonts follow.

---

## 12. Internationalization (dual system, like real products)

1. **UI strings** → i18next catalogs in `src/i18n/translations/{en,bn}/*.json` per namespace (`common`, `home`, `registration`, `tracking`, `admin`, …). Language switcher updates instantly; preference persisted (non-sensitive). A CI test asserts **en/bn key parity** so no string is ever missing.
2. **Domain content** (notice bodies, FAQ answers, syllabus descriptions) → `LocalizedText { en, bn }` fields on seed entities, surfaced via `useLocalized()`. This mirrors real CMS-localization and keeps long-form content out of component code.

---

## 13. State Management Strategy

| State | Owner |
|---|---|
| API data (notices, applications, results, settings, stats) | TanStack Query + services (loading/error/refetch handled once, consistently) |
| Wizard form data | React Hook Form (+ autosaved draft) |
| Session/user | Auth context backed by `AuthService` |
| Language | i18next (+ persisted preference) |
| Ephemeral UI (modals, mobile nav, filters) | Local component state |

No global store library needed — this is the modern, justified split.

---

## 14. Testing Strategy (maps 1:1 to the brief's §37)

| Required test | Where (Vitest + Testing Library) |
|---|---|
| Form validation | `features/registration` — step schemas + wizard behavior |
| Application ID generation | `mock-api` — format, uniqueness, collision retry |
| Duplicate transaction prevention | `mock-api/db` unique index → 409 |
| Application submission | service + API integration: persisted, status `submitted`, audit written |
| Application lookup | tracking endpoint: found / 404 / no-PII payload |
| Status transitions | state machine: legal path ✓, illegal → 422 |
| Authorization / data isolation | applicant A ≠ B (404), admin ✓, anonymous tracking minimal |
| Language switching | i18n parity (en/bn), `document.lang` update, `useLocalized()` |
| UI interactions | wizard navigation + inline errors, tracking timeline render, notice filters, admin table actions |
| Extras | payment verification rules, draft autosave/restore, localStorage schema rejection, audit entries |

Colocated `*.test.ts(x)` files; `npm run test` gates every PR in CI. Manual responsive (320→1920) and keyboard/screen-reader passes in Phases 9/11. Playwright smoke test (home → register → track) optional in CI.

---

## 15. CI/CD

- **`.github/workflows/ci.yml`** — on PRs and pushes (any branch): `npm ci` → lint → typecheck → `vitest run` → build. PRs to `main` come from the session branch; branch protection recommended.
- **`.github/workflows/deploy.yml`** — on push to `main`: same gates → `vite build` (base `/scholarship/`) → copy `index.html` → `404.html` → `actions/upload-pages-artifact` → `actions/deploy-pages` (concurrency-grouped). Requires the one-time Pages enablement (§3).

---

## 16. Security Checklist (reviewed in Phase 8, tracked here)

- [ ] XSS: React auto-escaping; **zero** `dangerouslySetInnerHTML`; user content rendered as text only
- [ ] No `eval`, no remote code, no URL-`javascript:` handling
- [ ] Authorization enforced in mock API (401/403/404) — verified by tests, not just hidden UI
- [ ] Data isolation: ownership filters + minimal public tracking payload (anti-enumeration)
- [ ] localStorage: schema-validated on read (corrupt data discarded), versioned keys, no tokens/secrets/PII beyond necessary demo data; session token in sessionStorage
- [ ] No secrets in repo: `.env.example` public-only; grep-gate in CI for obvious key patterns
- [ ] Validation: Zod at the "server" (mock API) **and** client; server-side rejection tested
- [ ] Dependency hygiene: minimal deps, `npm audit` in CI
- [ ] Honest labeling: demo payment/auth clearly never claimed as real verification

---

## 17. Performance & SEO

- Route-level code splitting (`React.lazy`), language-catalog lazy loading, font subsets with `font-display: swap`, hero as optimized original SVG illustration (no reference-site imagery), lazy below-fold sections, no chart/heavy libraries (stats rendered as SVG/CSS).
- SEO within static-SPA limits: per-page title + meta description via a `useDocumentMeta` hook, Open Graph tags, `robots.txt`, sitemap-shaped route registry, JSON-LD (Organization + ScholarshipProgram) in `index.html`, semantic heading order. **Honest limitation:** content is client-rendered (no SSR on Pages); if SEO ever becomes critical, the documented migration path is an SSG (e.g. Vite SSG or Next static export) — not extra infrastructure now.

---

## 18. Development Phases (gated)

| Phase | Deliverable | Gate |
|---|---|---|
| 0 Discovery | This document | ✅ done |
| 1 Foundation | Vite+React+TS scaffold, Tailwind tokens, router, i18n, ESLint/Prettier, CI workflows, README, `.env.example`, folder skeleton, service/mocking spike | ✅ done 2026-09-07 — lint/typecheck/36 tests/build green; live preview works; layered slice (settings/notices/stats) running end-to-end; ESLint architecture boundaries active |
| 2 Design system | Tokens tuned (AA contrast), all `ui/` primitives, `/style-guide` route | ✅ done 2026-09-07 — 24 `ui/` primitives; AA contrast gate (36 pairs) enforced by `src/styles/contrast.test.ts`; self-hosted Inter + Noto Sans Bengali (unicode-range); `/style-guide` renders with live token/contrast tables; lint/typecheck/113 tests/build green |
| 3 Public site | Home + Scholarship + Eligibility + Syllabus + Notices + Results + FAQ + Contact + legal pages | ✅ done 2026-09-07 — 9 pages live (Home completed with overview/benefits/process/stories/leadership/FAQ-teaser/CTA); `/grades`, `/syllabus(/:gradeId)`, `/results(/years)`, `/faqs`, `POST /contact` mock endpoints + services; fully bilingual incl. numerals/dates; per-page meta; print-to-PDF syllabus; responsive via container/token scale; lint/typecheck/162 tests/build green |
| 4 Registration | 7-step wizard, validation, drafts, success screen | Wizard tests green | ✅ done 2026-09-07 — 7-step wizard (eligibility→student→guardian→academic→payment→review→confirmation) with single RHF form + Zod schemas localized per language; per-step `trigger` validation with focus management (h2 focus per step); debounced draft autosave to localStorage (restore/discard, reset-demo clears it); grade-based fee card + DemoPay reference; review with per-section edit jumps; 409 duplicate-transaction → field error + return to payment step; success screen with `SS26-######` ID, printable receipt, what-next list; POST `/applications` (422/409/201) + shared Zod contracts in `types/`; wizard submits through the service layer only; lint/typecheck/177 tests/build green |
| 5 Mock backend | Full route table, persistence, ID/duplicate logic, payment simulation, state machine, audit log; wizard wired to services | Service/API test suite green incl. isolation |
| 6 Tracking | Track page, status timeline, all states | Lookup tests green |
| 7 Admin | Login, applications table (search/filter/sort/paginate), detail + status actions, audit view, demo reset | Role tests green |
| 8 Security | §16 checklist pass | Checklist signed off |
| 9 Testing | Full matrix + responsive/a11y/Lighthouse manual audit | All required tests green |
| 10 Deployment | Pages enabled, deploy workflow, live smoke test | Site live on Pages |
| 11 Polish | Visual/console/link/mobile/a11y/performance/dead-code audit | Zero console errors; Lighthouse ≥ 90 targets |

*(Minor re-sequencing vs. the brief: the service **interfaces** and domain types land in Phase 1, and the wizard (Phase 4) submits through a minimal temporary in-memory create so Phase 5 completes the mock API without rewriting the wizard — defining contracts early avoids throwaway code.)*

---

## 19. Known Limitations (explicit)

1. **Pages enablement is manual** (token scope) — one click by the repo owner.
2. SPA deep links use the `404.html` fallback (first load of a deep link technically returns 404 status) — standard GitHub Pages SPA behavior; HashRouter is the fallback plan.
3. Demo persistence is per-browser; no cross-device data. By design.
4. Demo auth simulates real auth patterns but is not production security (documented; that's the point — learning the architecture, not deploying PII).
5. No real email/SMS/payment — all simulated, clearly labeled.
6. E2E browser tests are CI-only (no local browser in sandbox).
7. SEO is client-rendered-only (see §17) — acceptable for a learning/demo product.

---

## 20. Future Real-Backend Migration (the payoff of the service boundary)

1. Stand up a real API (any stack) implementing the §7 surface.
2. Implement `FetchApiClient` behind the existing `ApiClient` interface; set `VITE_API_BASE_URL`.
3. Delete `mock-api/` and the localStorage DB. **UI, services, wizard, tracking, and admin components remain untouched.**
4. Zod schemas / TS types move to a shared package if the backend is TS — contracts already exist.

---

## 21. Decisions

**Approved 2026-09-07:**

1. ✅ **Stack approved as proposed** (§2): React 19 + Vite 7 + TypeScript + Tailwind CSS v4 + React Router 7 + TanStack Query v5 + React Hook Form/Zod + i18next.
2. ✅ **Demo-content flavor: Bangladesh-inspired fictional** — BDT (৳) currency, fictional MFS-style payment method (clearly labeled demo, no real-format numbers), English + বাংলা, fictional Bangla/English student names and schools.

**Still open (non-blocking):**

3. GitHub Pages enablement (§3) — one-time manual step by the repo owner, needed only before Phase 10: *Settings → Pages → Build and deployment → Source: GitHub Actions*.
4. Reference website (if any) — to be provided later; used only under §0 rules.
