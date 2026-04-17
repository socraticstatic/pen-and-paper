# Pen &amp; Paper

A catalogue of one reader's journey through fountain pens and paired papers, from first pen to savant.

Each entry is a short literary piece tied to a specific pen + paper + ink. A growing reference catalogue sits alongside the writing so new readers can search, filter, and take the pairing quiz to find what might suit them.

**Status:** Pre-Phase 0. Scaffolding has not started. See [`docs/superpowers/plans/2026-04-17-plan-index.md`](docs/superpowers/plans/2026-04-17-plan-index.md) for the phased build plan.

---

## What this is

- **Editorial-first.** The story is the front door. Utility is reached _through_ the writing, never around it.
- **Cataloguing, not blogging.** Every entry is a numbered _Specimen_ with a typographic tombstone.
- **CMS-driven.** Specimens, pens, papers, field notes, and pairings are authored via a Payload admin at `/admin`.
- **Quiz-guided.** A six-question quiz scores the catalogue against reader preferences and returns three pen + paper recommendations.
- **Luxury-craft minimal.** Warm bone ground, tinted ink, one whisper of oxidized copper. Editorial New &amp; Supreme typography. No card shadows, no gradients, no side-stripe borders.

Design context lives in [`.impeccable.md`](.impeccable.md). Full design spec in [`docs/superpowers/specs/2026-04-17-pen-and-paper-design.md`](docs/superpowers/specs/2026-04-17-pen-and-paper-design.md).

---

## Stack

| Layer           | Pick                                                     |
| --------------- | -------------------------------------------------------- |
| Framework       | Next.js 15 App Router (TypeScript strict, React 19 RSC)  |
| CMS             | Payload CMS 3 (installed in-process, admin at `/admin`)  |
| Database        | Postgres (Docker locally; Neon in production)            |
| Media storage   | Vercel Blob                                              |
| Styling         | Vanilla CSS with custom properties; no utility framework |
| Typography      | Fontshare self-hosted (Editorial New, Supreme)           |
| Testing         | Vitest (unit + component) &middot; Playwright (E2E)      |
| Hosting         | Vercel                                                   |
| Package manager | pnpm 9                                                   |
| Node            | 22 LTS (pinned via `.nvmrc`)                             |

---

## Quickstart

### Prerequisites

- Node 22 (use `.nvmrc`: `nvm use` or `fnm use`)
- Docker Desktop (for local Postgres)
- pnpm 9 (via corepack: `corepack enable && corepack prepare pnpm@9.15.0 --activate`)
- A populated `.env.local` (copy `.env.example` and fill in values)

### Install and run

```bash
# Enable pnpm (one-time)
corepack enable && corepack prepare pnpm@9.15.0 --activate

# Install dependencies
pnpm install

# Copy env template and generate a Payload secret
cp .env.example .env.local
echo "PAYLOAD_SECRET=$(openssl rand -hex 32)" >> .env.local

# Start Postgres
pnpm db:up

# Start the dev server
pnpm dev

# Open the site
open http://localhost:3000

# Open the CMS (first visit creates the initial admin user)
open http://localhost:3000/admin
```

### Common commands

| Command                       | What it does                                           |
| ----------------------------- | ------------------------------------------------------ |
| `pnpm dev`                    | Start Next.js dev server on `:3000`.                   |
| `pnpm build`                  | Production build.                                      |
| `pnpm start`                  | Serve the production build locally.                    |
| `pnpm lint`                   | ESLint (with `next/core-web-vitals` + jsx-a11y).       |
| `pnpm lint:fix`               | Lint and auto-fix.                                     |
| `pnpm format`                 | Prettier-format the repo.                              |
| `pnpm format:check`           | Prettier check (fails on drift).                       |
| `pnpm typecheck`              | `tsc --noEmit`.                                        |
| `pnpm test`                   | Vitest unit + component tests.                         |
| `pnpm test:watch`             | Vitest in watch mode.                                  |
| `pnpm test:e2e`               | Playwright E2E (spawns dev server).                    |
| `pnpm test:e2e:ui`            | Playwright UI mode.                                    |
| `pnpm payload`                | Payload CLI proxy (`generate:types`, `migrate`, etc.). |
| `pnpm payload:generate-types` | Regenerate `src/payload-types.ts` from collections.    |
| `pnpm db:up`                  | Start local Postgres via Docker Compose.               |
| `pnpm db:down`                | Stop local Postgres.                                   |

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in values:

| Variable                | Required  | Description                                                                                              |
| ----------------------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | yes       | The site's public URL. `http://localhost:3000` locally.                                                  |
| `PAYLOAD_SECRET`        | yes       | 64-char hex secret for Payload auth. Generate with `openssl rand -hex 32`.                               |
| `DATABASE_URI`          | yes       | Postgres connection string. `postgres://penandpaper:penandpaper_dev@localhost:5432/penandpaper` locally. |
| `BLOB_READ_WRITE_TOKEN` | prod only | Vercel Blob token. Empty locally; set in production via Vercel dashboard.                                |

Never commit `.env.local`. It is gitignored.

---

## Architecture at a glance

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 (App Router)                  │
│                                                              │
│  (frontend)                          (payload)               │
│  ├── /                               ├── /admin              │
│  ├── /catalogue/[slug]               └── /api/*              │
│  ├── /stages/[stage]                                         │
│  ├── /register                                               │
│  ├── /register/pens/[slug]                                   │
│  ├── /register/papers/[slug]                                 │
│  ├── /quiz                                                   │
│  ├── /field-notes                                            │
│  └── /colophon                                               │
│                                                              │
│      ▲                                         ▲             │
│      │ (RSC, static-rendered, revalidated)     │ (server)    │
│      │                                         │             │
│      └────────── Payload in-process ───────────┘             │
│                          │                                   │
│                          ▼                                   │
│                      Postgres                                │
│                  (Docker / Neon)                             │
└─────────────────────────────────────────────────────────────┘
```

- Editorial pages are RSC, statically rendered at build, and revalidated on-demand when Payload content changes (via `afterChange` hooks).
- The Register and Quiz are client-hydrated components with URL-sync state.
- Media uploads land in Vercel Blob via Payload's storage adapter.

Detailed architecture, data model, and surface-by-surface design in the spec.

---

## Repository conventions

- **Branches**: `main` is always deployable. Feature branches named `phase-<N>/<topic>` or `fix/<topic>`. Squash-merge via PR.
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org) enforced by commitlint. Prefixes: `feat`, `fix`, `test`, `docs`, `chore`, `refactor`, `perf`, `ci`, `style`.
- **Reviews**: every merge to `main` has a code-review pass (the `superpowers:requesting-code-review` skill). Phase merges additionally pass an `impeccable-audit`.
- **Testing**: TDD is default. Write the failing test first, then the minimum implementation. Coverage floor on `src/lib` and `src/components` is 85%.
- **No** `any`. No `@ts-ignore` without a linked issue. No default exports except Next.js route files.
- **Files change together live together.** Components organized by surface (`components/catalogue/`, `components/specimen/`, etc.), not by file type.

---

## Deploying

Production: [Vercel](https://vercel.com) → the `pen-and-paper` project. Neon Postgres attached via Vercel's integration. Vercel Blob for media. Preview deploys on every PR; Neon branches mirror git branches.

To deploy manually:

```bash
pnpm dlx vercel --prod
```

A deploy checklist lives in Phase 4 of the plan.

---

## Documentation

- [`.impeccable.md`](.impeccable.md) — brand, aesthetic, design context. Every design skill reads this first.
- [`docs/superpowers/specs/2026-04-17-pen-and-paper-design.md`](docs/superpowers/specs/2026-04-17-pen-and-paper-design.md) — the full design spec.
- [`docs/superpowers/plans/2026-04-17-plan-index.md`](docs/superpowers/plans/2026-04-17-plan-index.md) — phased build plan.
- [`docs/superpowers/plans/2026-04-17-phase-0-scaffold.md`](docs/superpowers/plans/2026-04-17-plan-index.md) — Phase 0 step-by-step.
- [`CHANGELOG.md`](CHANGELOG.md) — user-visible changes, following Keep a Changelog.

### Documentation discipline

**This README and [`CHANGELOG.md`](CHANGELOG.md) are kept current with every phase.** When a phase lands or a user-visible change ships, both files update as part of the same commit.

---

## Contributing

This is a single-author project in Phase 1. External contributions deferred to Phase 2. If you are the author returning to the repo: read `.impeccable.md`, then the spec, then the plan index, then the relevant phase plan. Then run the failing test.

---

## License

- **Source code**: [MIT](LICENSE).
- **Editorial writing, photography, and design assets**: All Rights Reserved — see [CONTENT-LICENSE](CONTENT-LICENSE). Short quotations with attribution are welcome; republishing specimens, field notes, or photography is not.

---

_Last updated: 2026-04-17 (plan drafted; implementation has not begun)._
