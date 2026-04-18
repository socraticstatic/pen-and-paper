# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Update discipline**: this file is updated as part of the same commit as any user-visible change. Every phase landing on `main` gets a dated release entry. If you are about to merge and this file hasn't been touched, you are probably missing something.

---

## [Unreleased]

Nothing yet.

---

## [0.1.0] — 2026-04-18 — Phase 0: Scaffold

### Added

- Next.js 15 App Router project with TypeScript strict, ESLint (`next/core-web-vitals` + `jsx-a11y`), and Prettier.
- Payload CMS 3 installed in-process; `Users` and `Media` collections; admin mounted at `/admin` and `/api/*`.
- Payload import map generated (`src/app/(payload)/admin/importMap.js`) and typed.
- Postgres via Docker Compose locally (`docker-compose.yml`); `.env.example` documenting all required variables.
- Vitest with jsdom and a smoke test (`tests/unit/smoke.test.ts`).
- Playwright with home and admin E2E tests; `chromium` + mobile-chrome projects.
- Husky pre-commit hook (lint-staged + typecheck) and commit-msg hook (commitlint).
- `@commitlint/config-conventional` enforcing Conventional Commits.
- GitHub Actions CI: `quality` (lint + typecheck + unit), `e2e` (Playwright on Postgres service), `build` (Next.js production build).
- `src/payload.d.ts` module declaration for `@payloadcms/next/css` side-effect import.
- `importMap.d.ts` type declaration for Payload-generated importMap.

### Changed

- Plan and docs revised from Node 20 LTS to **Node 22 LTS**.

### Planned for 0.2.0 (Phase 1 — Editorial)

- Design tokens, typography system, self-hosted Fontshare faces.
- `Specimens` and `FieldNotes` Payload collections.
- Catalogue home (`/`): SpecimenHero · StageIndex · Chronology.
- Specimen detail (`/catalogue/[slug]`): Tombstone + essay + figures + pairing footer.
- Stage views, Field Notes index &amp; detail, Colophon, 404.
- On-demand revalidation tied to Payload `afterChange` hooks.

### Planned for 0.3.0 (Phase 2 — Register)

- `Pens`, `Papers`, and optional `Pairings` collections with full attribute schema.
- Register landing (`/register`) with URL-synced filters.
- Pen detail and Paper detail pages with cross-references and affiliate rows.

### Planned for 0.4.0 (Phase 3 — Quiz)

- Build-time `catalog.json` from Pens + Papers.
- 6-question `/quiz` flow, scoring algorithm, and result page with shareable URLs.

### Planned for 1.0.0 (Phase 4 — Launch)

- Seed content at launch minimums (6+ specimens, 20+ pens, 15+ papers, 2+ field notes).
- RSS feed, sitemap, robots, social meta.
- Final domain, production Neon branch, Vercel Analytics (or Plausible).
- Lighthouse 95+ verified via Lighthouse CI on four representative URLs.
- Accessibility and polish passes (`impeccable-audit`, `impeccable-polish`).

---

## [0.0.0] — 2026-04-17

Initial commit. Planning &amp; design only; no application code yet.

- Design context (`.impeccable.md`), design spec, phased plan, Phase 0 plan, README, CHANGELOG written.
- Visual direction mockup authored and approved (luxury-craft minimal; see brainstorm scratch in `.superpowers/brainstorm/.../content/craft-direction.html` — not committed).

---

_Every future entry must be dated, versioned, and linked to the PR or commit range that introduced the change._
