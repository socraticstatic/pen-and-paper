# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Update discipline**: this file is updated as part of the same commit as any user-visible change. Every phase landing on `main` gets a dated release entry. If you are about to merge and this file hasn't been touched, you are probably missing something.

---

## [Unreleased]

### Added

- Project scaffolding plan in `docs/superpowers/plans/` (phased index + Phase 0 detailed plan).
- Design context in `.impeccable.md` (luxury-craft minimal; Editorial New &amp; Supreme; warm bone + tinted ink + oxidized copper).
- Design spec in `docs/superpowers/specs/2026-04-17-pen-and-paper-design.md` covering IA, surfaces, Payload collections, pen/paper attributes, quiz flow, perf budget, accessibility, directory structure.
- Initial `README.md` documenting stack and quickstart.
- This `CHANGELOG.md`.
- `LICENSE` (MIT) for source code.
- `CONTENT-LICENSE` (All Rights Reserved) for editorial writing, photography, and design assets.
- Claude Code Stop hook (`.claude/hooks/readme-changelog-reminder.sh` + `.claude/settings.json`) that blocks turn-end when source files changed but README/CHANGELOG did not — enforces documentation discipline.

### Changed

- Plan and docs revised from Node 20 LTS to **Node 22 LTS** (current LTS; already installed in author's environment; Next.js 15 + Payload 3 both officially support it).

### Planned for 0.1.0 (Phase 0 — Scaffold)

- Next.js 15 App Router project with TypeScript strict, ESLint, Prettier.
- Payload CMS 3 installed in-process; `Users` and `Media` collections; admin at `/admin`.
- Postgres via Docker Compose locally; Neon in production.
- Vitest + Playwright scaffolding with passing smoke tests.
- Husky + lint-staged + commitlint pre-commit hooks.
- GitHub Actions CI: lint, typecheck, unit, E2E, build.
- Vercel preview + production deploys; Vercel Blob for media.

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
