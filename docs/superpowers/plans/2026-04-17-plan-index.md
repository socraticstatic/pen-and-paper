# Pen &amp; Paper — Phased Plan Index

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to execute each phase plan. Do not execute this index — it is a manifest. Each phase has its own plan file with checkbox steps.

**Goal:** Deliver the Pen &amp; Paper catalogue website across five phases, each shipping working software on its own. Build quality is non-negotiable: typed end-to-end, tested at every boundary, tiny bundles, Lighthouse 95+.

**Spec:** [docs/superpowers/specs/2026-04-17-pen-and-paper-design.md](../specs/2026-04-17-pen-and-paper-design.md)
**Brand &amp; aesthetic:** [.impeccable.md](../../../.impeccable.md) (load before any design work).

---

## Guiding principles (apply to every phase)

1. **TDD with discipline.** RED → GREEN → REFACTOR, every unit. Tests are the spec; no production code without a failing test first. Exception: pure UI shells (layouts with no behavior) and the Payload admin customization, which are exercised via Playwright E2E rather than unit tests.
2. **Typed end-to-end.** No `any`. No `@ts-ignore` without a linked issue. Payload-generated types imported where collections are queried.
3. **Frequent commits.** Commit after every passing step. Small, reversible diffs. Conventional commit prefixes (`feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`).
4. **DRY, YAGNI.** No feature not in the spec. No abstraction not justified by two concrete uses. Delete the unused code as we find it.
5. **Editorial-first performance.** Client JS is earned, not assumed. Any new client component requires a bundle-size note in the PR.
6. **Accessibility is not optional.** WCAG AA minimum, AAA body contrast. Every phase ends with an `impeccable-audit` pass.
7. **Documentation lives alongside code.** README and CHANGELOG update *as part of* each phase's final commit — never "later."
8. **Reviewability.** Each phase closes with `requesting-code-review` skill before merging to `main`.

---

## Phase map

| Phase | Ships | Plan file | Status |
|---|---|---|---|
| **0 — Scaffold** | Next.js + Payload + Postgres running locally and on Vercel; admin auth; CI green; zero features yet | `2026-04-17-phase-0-scaffold.md` | Detailed plan written |
| **1 — Editorial** | Typography, layout tokens, design-system primitives, Catalogue home, Specimen pages, Stage views, Field Notes, Colophon. First specimen live. | `2026-04-17-phase-1-editorial.md` | To be written before execution |
| **2 — Register** | Pens collection, Papers collection, Register landing, Pen &amp; Paper detail pages, filters with URL-sync | `2026-04-17-phase-2-register.md` | To be written before execution |
| **3 — Quiz** | Catalog index build pipeline, 6-question quiz flow, scoring algorithm, result page, share links | `2026-04-17-phase-3-quiz.md` | To be written before execution |
| **4 — Launch** | Seed content (specimens, pens, papers, field notes), Lighthouse pass, domain, RSS, sitemap, deploy, smoke tests | `2026-04-17-phase-4-launch.md` | To be written before execution |

Each phase is roughly one working week. Each phase is independently deployable. Each phase is a merge candidate.

---

## Phase 0 — Scaffold

**Goal:** Stand up the full stack (Next.js 15 App Router + Payload CMS 3 + Postgres + Vercel) with admin auth, CI, and zero application features. Any subsequent phase should be able to assume this foundation and never re-justify it.

**Ships:**
- Next.js 15 project with TypeScript strict, ESLint, Prettier, Vitest, Playwright configured.
- Payload CMS 3 installed in-process, Postgres (Neon) attached locally via Docker and in production via Neon serverless.
- `/admin` reachable, seeded with a single admin user; auth working end-to-end.
- `Users` and `Media` collections (Payload's baseline); no other collections yet.
- GitHub Actions CI: lint, typecheck, unit tests, Playwright smoke test, Next build.
- Vercel production + preview deployments, Neon branch per PR.
- README and CHANGELOG committed, both kept current from day one.
- `.env.example` documenting every required variable.
- Pre-commit hook (Husky + lint-staged) and commit-msg hook (commitlint).

**Exit criteria** (all must hold before Phase 1 starts):
- `pnpm test`, `pnpm test:e2e`, `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass locally.
- CI green on `main`.
- Production admin URL returns 200 and requires login.
- A code-review pass (superpowers:requesting-code-review) with no P0/P1 issues.

**Dependencies:** none.

---

## Phase 1 — Editorial

**Goal:** Make the catalogue readable. Deliver the design system and every surface that shows Micah's writing. A single specimen should be authorable via `/admin` and render at `/catalogue/[slug]` with the exact typography and layout shown in the approved craft mockup.

**Ships:**
- Design tokens (`tokens.css`), reset, typography, layout.
- Self-hosted Fontshare faces (Editorial New, Supreme) in `public/fonts/` with `font-display: swap` and size-adjust fallbacks.
- `SiteNav`, `Colophon` layout primitives.
- `Specimens` and `FieldNotes` Payload collections with full schema, slug auto-gen, draft/publish, versioning, live preview.
- Catalogue home (`/`): SpecimenHero · StageIndex · Chronology · Quiz invitation line (link dead until Phase 3).
- Specimen detail (`/catalogue/[slug]`): Tombstone + SpecimenEssay + FigureGrid + PairingFooter.
- Stage views (`/stages/[stage]`).
- Field Notes index and detail.
- Colophon page.
- 404 page.
- On-demand revalidation hooked into Payload `afterChange` for Specimens and FieldNotes.
- Unit tests for stage metadata, date format, roman-numeral helpers, reading-time calculation.
- Playwright tests for each surface at desktop and mobile widths.
- Lighthouse 95+ on the editorial surfaces (unseeded, with one Specimen).

**Exit criteria:**
- One Specimen authored entirely via admin, published, revalidates on save, renders at spec fidelity.
- All visual details match the approved `craft-direction.html` mockup at ≥1200 px and ≤420 px.
- CI green.
- Code-review pass with no P0/P1.

**Dependencies:** Phase 0 complete.

---

## Phase 2 — Register

**Goal:** Make the catalogue searchable. The pens and papers grow as a reference independent of specimens. Filters live on the register; detail pages surface per-pen and per-paper. No quiz yet.

**Ships:**
- `Pens` and `Papers` Payload collections with full attribute schema (Core + Secondary tiers from spec §5).
- Optional `Pairings` collection for curator picks.
- Register landing `/register` (pens ↔ papers toggle; default pens alphabetical).
- Pen detail `/register/pens/[slug]`: PenTombstone + images + specimens-featuring + papers-paired-with + affiliate row.
- Paper detail `/register/papers/[slug]`: PaperTombstone + InkBehaviorMeter (0–5) + images + specimens-using + pens-paired-with + affiliate row.
- `RegisterFilters` client component with URL-sync (multi-select within group, cross-group AND).
- Build-time derivation of cross-references (pen → specimens, paper → specimens).
- Unit tests for filter reducer, cross-reference derivation, URL-state serialization.
- Playwright tests for filter happy paths and empty-state copy.

**Exit criteria:**
- At least 8 pens and 5 papers authored via admin.
- Filters URL-shareable; deep-link restores state.
- Register JS bundle ≤ 25 KB gz.
- Lighthouse 95+ on `/register` and pen detail.
- Code-review pass with no P0/P1.

**Dependencies:** Phase 1 complete.

---

## Phase 3 — Quiz

**Goal:** Turn the catalogue into a guide. A first-time visitor answers six questions and gets three pen + paper recommendations, each linking to a specimen or a catalog entry.

**Ships:**
- `scripts/build-catalog-index.ts` — emits `public/catalog.json` from Pens + Papers at build time.
- `QuizFlow`, `QuizQuestion`, `QuizResult` components (all client).
- Scoring algorithm in `lib/scoring.ts`, pure function over `(answers, catalog) → rankedPairings`.
- 6-question flow with hairline progress, typography-only chrome (no product-survey UX).
- Result page `/quiz/result?...` with top-3 pairings, each linking to specimen-if-exists or catalog-if-not.
- Unit tests for scoring (12+ manually defined answer sets → expected top-3s).
- Playwright tests for end-to-end quiz completion, keyboard nav, share-link restoration.
- Revalidation on Pen/Paper changes triggers `catalog.json` rebuild.

**Exit criteria:**
- Quiz runs offline after initial load (no API calls).
- Scoring produces "sensible" results for 12 manually verified answer combinations.
- Quiz JS bundle ≤ 30 KB gz; `catalog.json` ≤ 120 KB gz.
- Lighthouse 95+ on `/quiz`.
- Code-review pass with no P0/P1.

**Dependencies:** Phase 2 complete.

---

## Phase 4 — Launch

**Goal:** Take the site live. Seed content to the minimums. Harden performance, accessibility, and SEO. Deploy on a real domain.

**Ships:**
- Seed content authored via admin: 6+ specimens, 20+ pens, 15+ papers, 2+ field notes.
- RSS feed route (`/feed.xml`) and sitemap.xml generator.
- `robots.txt`, favicon, social meta (OG + Twitter cards).
- Domain purchase + DNS + Vercel domain attach.
- Production Neon branch (non-preview) promoted.
- Vercel Analytics enabled (privacy-respecting) or Plausible embedded — decision logged in CHANGELOG.
- Full impeccable-audit pass; impeccable-polish pass.
- Playwright smoke tests against production (read-only).
- Launch announcement draft in `docs/launch/`.

**Exit criteria:**
- All §14 Success Criteria from the spec verified.
- Production URL live on HTTPS; no mixed content; no console errors.
- Lighthouse 95+ on four representative URLs on production (verified with `@lhci/cli`).
- RSS validates with W3C validator.
- Sitemap validates.
- Code-review pass.

**Dependencies:** Phase 3 complete.

---

## Cross-cutting workstreams (run in every phase, not a separate phase)

### Documentation

- **README.md**: project summary, stack, local-dev quickstart, common commands, env variables, architecture diagram, deploy instructions. Updated at every phase boundary.
- **CHANGELOG.md**: follows "Keep a Changelog" format + SemVer. Entry per phase landing on `main`. Entry per user-visible change thereafter.
- **docs/adr/**: one ADR per meaningful architectural decision that deviates from the spec or introduces new surface area. Numbered (`001-next-and-payload-in-process.md`, `002-vanilla-css-no-tailwind.md`, etc.).
- **Inline docs**: JSDoc on public lib functions, Payload collection descriptions, component prop interfaces commented.

### CI quality gates

Every PR blocks on:
- Lint (ESLint + Prettier)
- Typecheck (`tsc --noEmit`)
- Unit tests (Vitest) with coverage ≥ 85% on `lib/**` and `components/**`
- Playwright smoke (1 happy path)
- Next build with no warnings
- Bundle-size check (measured per route; fails if any route exceeds its budget in §11 of the spec)
- Lighthouse CI against preview deploy (fails below 90 on all four categories; production requires 95)

### Observability (Phase 4+)

- Vercel Analytics or Plausible (decision deferred).
- Error reporting via Sentry (optional, decided at Phase 4).
- Build logs retained 30 days via Vercel.

### Security

- No secrets in source. `.env.example` only.
- Payload admin behind auth. Rate-limit admin login.
- CSP headers configured via `next.config.mjs` middleware.
- Dependabot + weekly `pnpm audit` review.

---

## Repo conventions (set in Phase 0, honored forever)

- **Package manager:** pnpm (faster, deterministic lockfile).
- **Node:** v22 LTS, pinned via `.nvmrc`.
- **Commit style:** Conventional Commits, enforced via commitlint.
- **Branch model:** `main` is always deployable. Feature branches named `phase-<N>/<topic>` or `fix/<topic>`. PRs merge via squash + semantic-release-compatible message.
- **Linting:** ESLint (eslint-config-next + @typescript-eslint + eslint-plugin-jsx-a11y).
- **Formatting:** Prettier with config in `package.json`. Runs via `lint-staged` pre-commit.
- **Testing:** Vitest for unit + integration. Playwright for E2E. `@testing-library/react` for component unit tests.
- **Path aliases:** `@/` → `src/`. Enforced via `tsconfig.json` + `vitest.config.ts`.
- **File naming:** PascalCase for React components, camelCase for utilities, kebab-case for route segments.
- **No default exports** from component files (named exports aid refactor).

---

## How to use this index

1. Before starting any phase, verify the prior phase's exit criteria.
2. If the phase plan file exists, follow its tasks step-by-step via `superpowers:subagent-driven-development` (preferred) or `superpowers:executing-plans`.
3. If the phase plan does not yet exist, write it using the `superpowers:writing-plans` skill against the spec, then execute.
4. At phase landing: update README, update CHANGELOG, request code review, merge.

*Index drafted 2026-04-17. Update when phase status, scope, or dependencies change.*
