# Pen &amp; Paper — Design Spec

**Status**: Phase 1 design, approved 2026-04-17.
**Owner**: Micah Boswell.
**Companion doc**: `.impeccable.md` at project root (brand + aesthetic context; every implementation skill reads it before writing code).

---

## 1. Feature Summary

A CMS-backed website that catalogues one reader's journey through fountain pens and paired papers, from first pen to savant. Each **Specimen Entry** is an essay-first piece with a structured pairing block. Alongside the specimens lives a growing **catalog of pens and papers** (attributes, images, commerce), authored in the same admin UI. A **pairing quiz** guides beginners from "what should I start with?" to a short list of pens and papers that fit them, each linking to a specimen if one exists.

Phase 1 is single-author. No public accounts, no UGC, no community. All content and catalog data authored via the CMS admin at `/admin`. Commerce is light-touch affiliate links.

---

## 2. Goals &amp; Non-Goals

### Goals

- **Story-first funnel.** First-time visitor lands on a single Specimen hero, not a nav menu, not a grid of cards, not a search box.
- **Catalogue, not blog.** Entries are numbered specimens with typographic tombstones. Nothing feels disposable.
- **Four primary surfaces, clear hierarchy.** Catalogue → Register → Quiz → Field Notes. Utility is reached _through_ editorial.
- **CMS-driven authoring.** Specimens, Pens, Papers, Pairings, Field Notes all edited via Payload's admin UI. Non-technical editing from day one.
- **Typed end-to-end.** Payload collections generate TypeScript types; front-end imports them; zero `any` between CMS and UI.
- **Luxury-craft minimal aesthetic.** Warm bone, tinted ink, one whisper of oxidized copper. Editorial New + Supreme. Asymmetric editorial grid. Rule lines as structure.
- **Static-rendered editorial.** Specimen, stage, catalogue, and field-note pages statically generated (SSG) with on-demand revalidation when CMS changes. Admin and API routes server-rendered. Target Lighthouse 95+ on editorial pages.

### Non-goals (explicitly out of Phase 1)

- Public user accounts, authentication, profiles.
- User-submitted specimens or pairing notes.
- Comments, reactions, threads.
- Community forums or direct messaging.
- Local-shop directory.
- Shopping cart or checkout (affiliate outbound only).
- Native email newsletter (embedded ConvertKit/Buttondown form is fine; separate system).
- Dark mode.
- Internationalization.

---

## 3. Information Architecture

```
/                                 The Catalogue — home, current specimen, stages, chronology
/catalogue/[specimen-slug]        A specimen entry (essay + tombstone + figures)
/stages/[stage]                   Stage view (all specimens in I | II | III | IV)
/register                         The Register — pens/papers, filterable
/register/pens/[pen-slug]         Single pen detail (attributes + specimens featuring it)
/register/papers/[paper-slug]     Single paper detail (attributes + specimens using it)
/quiz                             The Pairing Quiz — beginner-to-advanced guide
/quiz/result?...                  Quiz result (top 3 pen+paper pairings)
/field-notes                      Field Notes index
/field-notes/[slug]               A single field note
/colophon                         Site colophon
/404                              Quiet 404
/admin                            Payload CMS (auth-gated)
/api/*                            Payload REST + local API (server-rendered)
/feed.xml                         RSS feed (specimens + field notes)
/sitemap.xml                      Auto-generated
```

### Navigation

Sticky top bar: wordmark left, italic center tagline, three links right — **The Catalogue · The Register · Field Notes**. The Quiz is not in top-nav; it's reached via a quiet link from the home hero and from the Register header ("_New to pens? Start here._"). Current surface marked in oxidized-copper. No dropdowns. No hamburger. Mobile collapses to wordmark + overflow.

---

## 4. Surface Design

### 4.1 The Catalogue (`/`)

Three stacked blocks. No carousel, no floating CTAs.

**Block A — Current Specimen hero.** (As detailed in approved mockup.)

**Block B — Stage Index.** Four cards in a row (2×2 tablet, vertical mobile). Roman numeral + name + short description + count. Active stage accent-colored.

**Block C — Recent Chronology.** Rule-lined list of five most recent specimens. Each row: specimen number · title · pairing summary · stage + date.

**Quiz invitation**: a single italic line below the hero, before Stage Index: _"New to pens? Begin with the quiz."_ (links to `/quiz`).

### 4.2 Specimen Entry (`/catalogue/[slug]`)

Two-column desktop (tombstone left, essay right). As detailed in approved mockup.

Entry footer:

- Pairing rationale paragraph (_"Why these three"_).
- Cross-links: "Also written with this pen" / "Also written on this paper" as tracked-small-caps sentences.
- Affiliate row.

### 4.3 Stage Views (`/stages/[stage]`)

Filtered chronology by stage. Stage intro at top (italic Editorial New).

### 4.4 The Register (`/register`)

Pens and papers listed as a reader's index, not a search UI. Two modes:

- **Default view**: pens, alphabetical, filterable sidebar (see §5.2 below).
- **Toggle to papers**: same surface, papers listed.

Each row in the list is typographically rich (see approved mockup). Click → pen or paper detail page.

### 4.5 Pen Detail (`/register/pens/[slug]`)

Single-column editorial layout:

- Tombstone block at top (pen attributes laid out like a museum label).
- Two hero images of the pen.
- "Specimens featuring this pen" — rule-lined list of Specimen Entries that used it.
- "Papers this pen has been paired with" — derived from specimens, with a short pairing rationale per paper where available.
- Affiliate row.

### 4.6 Paper Detail (`/register/papers/[slug]`)

Same architecture as Pen Detail, adapted:

- Paper tombstone (mill, line, gsm, finish, ink-behavior ratings displayed as small bar indicators, not stars).
- Hero image (paper surface + ruling).
- "Specimens using this paper."
- "Pens this paper has been paired with."
- Affiliate row.

### 4.7 The Quiz (`/quiz`)

Client-rendered flow. A single column, one question at a time, editorial in feel — not a product-survey.

**Architecture:**

- 6 questions, each on its own screen within the same route (no page reload).
- Typography: questions in Editorial New (36–52px fluid), options as tracked-small-caps rows separated by rule lines.
- Progress indicator: a single hairline at the top that advances as the user answers, not a numbered progress bar.
- Back button is a tracked-caps link, not a button chip.
- No cancel / start-over / reset buttons — the user can close the tab. If they return, state is not persisted in Phase 1.

**Questions (v1):**

1. **Experience** — "Have you written with a fountain pen before?" (Never · A little · Regularly · I have a collection)
2. **Budget** — "What feels like the right investment right now?" (Under $50 · $50–$200 · $200–$500 · $500+ · Open)
3. **Hand pressure** — "When you write, you tend to press..." (Very lightly · Lightly · Normally · Firmly)
4. **Feedback preference** — "On the page you want..." (Glass-smooth · Slight texture · Real feedback)
5. **Line width** — "Your ideal line is..." (Hair-fine · Fine · Medium · Bold & expressive)
6. **Paper preference** — "When you picture the paper..." (Bright white and smooth · Ivory and absorbent · Cream and toothy · I'll follow your lead)

Each answer assigns weighted scores against Pen and Paper attribute tags (e.g. "Glass-smooth" scores +3 for pens with `feedback: glass-smooth`).

**Result (`/quiz/result?...`):**

- Top three pen+paper pairings, scored by the sum of matching attributes.
- Each pairing rendered as a miniature Specimen tombstone: pen name + nib + paper + tier.
- If a Specimen exists that used this exact pair, link to it (_"Read the specimen entry →"_).
- If no Specimen exists, show the catalog entry (_"Not yet catalogued. Here's the data →"_).
- Share link is the URL-encoded answer set; shareable and deep-linkable.
- Quiz result is a client-side computed page; not pre-rendered. Scoring runs entirely in browser against a pre-built `catalog.json` index.

### 4.8 Field Notes (`/field-notes`, `/field-notes/[slug]`)

As detailed in original spec. Index list (restrained, not a grid), detail same typography as Specimens without tombstone.

### 4.9 Colophon (`/colophon`)

Single quiet page: about the site, the author, typography, palette, principles.

### 4.10 Admin (`/admin`)

Payload's admin UI, customized with:

- Site theme (warm bone ground where Payload permits CSS override; otherwise default Payload dark).
- Custom collection groupings: **Editorial** (Specimens, Field Notes) · **Catalogue** (Pens, Papers, Pairings) · **Media**.
- Author view is single-user; roles left simple (single admin role, expandable in Phase 2).

---

## 5. Data Model (Payload Collections)

### 5.1 Specimen (editorial content)

Rich-text essay + structured pairing metadata + figure array + relations.

```ts
{
  specimenNumber: number,          // unique, int, positive
  title: string,
  subtitle: string?,
  slug: string,                    // auto-generated, editable
  stage: 'first-pen' | 'curious' | 'collector' | 'savant',
  acquired: date,
  published: date?,
  pen: relationship(Pen),          // single
  paper: relationship(Paper),      // single
  ink: group {                      // inline, not its own collection in v1
    maker: string,
    color: string,
    notes: string?,
  },
  figures: array of {
    src: media(upload),
    alt: string,
    caption: string?,
    layout: 'square' | 'wide' | 'portrait',
  },
  essay: richText (lexical),
  pairingRationale: richText,      // short rationale ("Why these three")
  affiliateOverrides: group {       // optional per-specimen overrides
    penUrl: url?,
    paperUrl: url?,
    inkUrl: url?,
  },
  readingTime: number (auto-computed),
  draft: boolean (default true),
}
```

### 5.2 Pen (catalog entry)

See attribute tiers in §5.5 below. Full schema:

```ts
// Core
{
  make: string,
  model: string,
  slug: string (auto),
  variant: string?,
  countryOfOrigin: enum ['japan','germany','italy','usa','china','uk','france','other'],
  nibOptions: array of { width, material, grindClass, customAvailable },
    // width: 'UEF'|'EF'|'F'|'MF'|'M'|'B'|'BB'|'Stub'|'Italic'|'Music'|'Soft-Fine'|'3B'
    // material: 'stainless'|'gold-plated-steel'|'14k'|'18k'|'21k'|'titanium'|'palladium'
    // grindClass: 'round'|'stub'|'italic'|'architect'|'oblique'|'flex'|'music'
  fillMechanism: enum ['cartridge','converter','piston','vacuum','eyedropper','pneumatic','snorkel','lever'],
  inkCapacityMl: number?,
  weightG: number,
  lengthCappedMm: number,
  diameterGripMm: number,
  bodyMaterial: enum ['resin','precious-resin','urushi','ebonite','celluloid','metal','sterling-silver','titanium','solid-gold','wood'],
  postable: boolean,
  demonstrator: boolean,
  wetness: enum ['very-dry','dry','balanced','wet','very-wet'],   // subjective — author-assessed
  feedback: enum ['glass-smooth','smooth','slight-feedback','toothy','pencil-like'], // subjective
  flex: enum ['rigid','springy','semi-flex','flex','wet-noodle'], // subjective
  experienceLevel: enum ['beginner','intermediate','advanced','collector'],
  paperAffinity: array of tag,
    // tags: 'wet-coated'|'dry-uncoated'|'flex-tomoe'|'toothy-cream'|'smooth-bright-white'|'heavy-120gsm'|'light-52gsm'|'universal'
  priceUsd: number,
  priceTier: enum ['under-50','50-200','200-500','500-1000','above-1000'],
  availability: enum ['current','limited','discontinued','vintage'],
  affiliateUrl: url?,
  images: array of { src: media, alt, caption?, heroCandidate: boolean },

// Secondary
  releaseYear: int?,
  trim: enum ['gold','silver','rhodium','rose-gold','black-pvd','none']?,
  capType: enum ['screw-on','snap-on','friction','magnetic']?,
  balance: enum ['front-weighted','balanced','back-weighted']?,
  nibSize: enum ['#5','#6','#8','proprietary']?,
  nibMakerExternal: string?,
  maintenanceLevel: enum ['low','medium','high']?,
  dailyCarry: boolean?,
  pressureTolerance: enum ['light','medium','heavy']?,
  tippingMaterial: enum ['iridium','osmium','platinum']?,
  relatedPens: array of relationship(Pen),

// Meta
  authorNotes: richText?,          // author's private notes, not rendered publicly
  draft: boolean (default true),
}
```

### 5.3 Paper (catalog entry)

```ts
// Core
{
  mill: string,
  line: string,
  slug: string (auto),
  countryOfOrigin: enum ['japan','france','germany','italy','usa','uk','korea','other'],
  gsmOptions: array of int,        // e.g. [52, 68, 80]
  sizeOptions: array of enum ['a4','a5','b5','b6','letter','pocket','a6','custom'],
  color: enum ['bright-white','white','ivory','cream','tan','gray','black'],
  finish: enum ['uncoated','coated','vellum','laid','ripple'],
  texture: enum ['glass-smooth','smooth','soft-tooth','toothy','rough'], // subjective
  absorption: enum ['fast','medium','slow'],                              // subjective
  bleedThrough: int 0..5,           // 0=none, 5=severe
  showThrough: int 0..5,
  feathering: int 0..5,
  dryTime: enum ['quick','medium','slow'],
  sheenEnabling: boolean,
  shadingEnabling: boolean,
  bestForNibs: array of tag,
    // tags: 'ef-f'|'m-b'|'stub-italic'|'flex'|'wet'|'dry'|'universal'
  bindings: array of enum ['pad','spiral','smyth-sewn','saddle-staple','loose-leaf','hardcover','softcover'],
  rulings: array of enum ['plain','lined','dot','graph','music','cornell','todo'],
  availability: enum ['current','limited','discontinued'],
  priceUsd: number?,
  affiliateUrl: url?,
  images: array of { src: media, alt, caption?, heroCandidate },

// Secondary
  opacityPercent: int?,
  brightnessPercent: int?,
  acidFree: boolean?,
  leftHandFriendly: boolean?,
  ghosting: int 0..5?,
  lineSpacingMm: number?,
  perforated: boolean?,
  pageCount: int?,
  authorNotes: richText?,
  draft: boolean (default true),
}
```

### 5.4 Pairing (optional, for curator picks without a specimen)

```ts
{
  pen: relationship(Pen),
  paper: relationship(Paper),
  ink: group { maker, color, notes? }?,
  rationale: richText,           // why these belong together
  stage: enum (shared stage IDs),
  featured: boolean,
  draft: boolean (default true),
}
```

Pairings are optional. Most pairings in Phase 1 are **derived** from Specimens (a Specimen implies a Pairing). Explicit Pairings are for curator picks where no Specimen has been written.

### 5.5 FieldNote

```ts
{
  title: string,
  slug: string,
  excerpt: string,
  topic: enum ['nib','ink','paper','history','technique'],
  cover: media?,
  body: richText,
  relatedSpecimens: array of relationship(Specimen),
  published: date,
  readingTime: number (auto),
  draft: boolean (default true),
}
```

### 5.6 Derived at build time (not stored)

- Per-pen: specimens featuring it; papers it has been paired with.
- Per-paper: specimens using it; pens it has been paired with.
- `catalog.json` — a compiled, client-loadable index for the Quiz: `[{id, type, make, model, ...attrs}]`.

---

## 6. Components

All components in `src/components/` unless noted. Organized by surface.

| Component          | Type                   | Responsibility                                                      |
| ------------------ | ---------------------- | ------------------------------------------------------------------- |
| `SiteNav`          | `.tsx` (RSC)           | Sticky top bar with wordmark, tagline, three links, current marker. |
| `SpecimenHero`     | `.tsx` (RSC)           | Home hero: eyebrow + giant number + title + lede + meta + figure.   |
| `StageIndex`       | `.tsx` (RSC)           | Four-card stage row with active state.                              |
| `Chronology`       | `.tsx` (RSC)           | Rule-lined list of recent specimens.                                |
| `Tombstone`        | `.tsx` (RSC)           | Left-column specimen metadata.                                      |
| `SpecimenEssay`    | `.tsx` (RSC)           | Rich-text essay renderer (Payload's Lexical output → React).        |
| `FigurePlate`      | `.tsx` (RSC)           | Single figure + caption + figure number.                            |
| `FigureGrid`       | `.tsx` (RSC)           | Multi-figure layouts.                                               |
| `PairingFooter`    | `.tsx` (RSC)           | Cross-links + affiliate row.                                        |
| `RegisterHead`     | `.tsx` (RSC)           | Register hero heading.                                              |
| `RegisterFilters`  | `.tsx` (Client)        | Filters with URL-sync state.                                        |
| `RegisterList`     | `.tsx` (RSC or client) | List of pens or papers; rows.                                       |
| `PenTombstone`     | `.tsx` (RSC)           | Pen detail page label block.                                        |
| `PaperTombstone`   | `.tsx` (RSC)           | Paper detail page label block with bleed/show-through indicators.   |
| `InkBehaviorMeter` | `.tsx` (RSC)           | Small typographic meter (not a progress bar) for 0–5 ratings.       |
| `QuizFlow`         | `.tsx` (Client)        | Multi-step quiz controller; URL-state for shareable answers.        |
| `QuizQuestion`     | `.tsx` (Client)        | Single-question screen.                                             |
| `QuizResult`       | `.tsx` (Client)        | Top-3 pairing result cards.                                         |
| `FieldNoteCard`    | `.tsx` (RSC)           | Index row.                                                          |
| `Colophon`         | `.tsx` (RSC)           | Page footer colophon.                                               |
| `TypeSet`          | `.tsx` (RSC)           | Prose wrapper enforcing body typography.                            |

React Server Components by default. Client components only where interactivity demands it (RegisterFilters, QuizFlow, QuizQuestion, QuizResult).

Styles: `src/styles/` with `tokens.css`, `reset.css`, `typography.css`, `layout.css`. Vanilla CSS + CSS custom properties. No Tailwind.

---

## 7. Key States

### 7.1 Empty &amp; first-build

- **Before first specimen**: home hero shows "Forthcoming" placeholder. Never live.
- **Stage with no specimens** (Savant at launch): stage intro + italic "_No specimens catalogued in this stage yet._" No CTA.
- **Register with zero filter matches**: italic "_No pairings match these filters._" Filters themselves are the reset.
- **Quiz result with no exact pairing**: show top three _catalog_ pairings with "_Not yet catalogued in a specimen — here's the data._"
- **Pen detail with zero specimens**: shows attributes; "_This pen has not yet been catalogued in a specimen._" (common for newly added catalog entries).

### 7.2 Loading

- Editorial pages are statically rendered — no loading state.
- Register filter transitions: 200ms opacity crossfade; no spinner.
- Quiz: instantaneous (client-computed against pre-loaded `catalog.json`).
- Admin: standard Payload UX.

### 7.3 Error

- **Invalid CMS data** → Payload validation errors at save time (collection hooks validate), and at build time (zod-at-boundary for catalog index generation).
- **Missing image** → Payload prevents save; build catches in case of stale reference.
- **404**: single quiet page. Editorial New italic headline _"A page that does not appear in the catalogue."_, rule, caps link to `/`.
- **500**: Payload admin and API handle via Next.js error boundary; quiet error page.

### 7.4 First-time visitor

No popup, no cookie banner, no newsletter modal. Type fade-in over 500ms; reader begins.

### 7.5 Admin-only states (Payload)

- Drafts vs Published per entry.
- Scheduled publish (Payload supports).
- Version history (Payload supports).
- Live preview from the editor (Payload + Next.js draft mode).

---

## 8. Interaction Model

Covered in §7 above and §4.7 Quiz. Additional notes:

- **All links focus-visible**: 1px oxidized-copper underline, 2px offset.
- **Keyboard navigable** throughout.
- **`prefers-reduced-motion`** disables transforms and staggers; opacity transitions kept.
- **No SPA routing in Phase 1**. Standard Next.js page transitions. View Transitions API may be enabled later.

---

## 9. Content Requirements

### 9.1 Microcopy

Unchanged from prior spec. Additions:

| Context                 | Copy                                                                   |
| ----------------------- | ---------------------------------------------------------------------- |
| Home quiz invitation    | `New to pens? Begin with the quiz.`                                    |
| Register header subline | `Pens and papers, catalogued for future reference.`                    |
| Quiz progress line      | (hairline, no text)                                                    |
| Quiz back               | `← Back` (tracked caps)                                                |
| Quiz result empty       | `No pairings match these answers yet. The catalogue is still growing.` |

### 9.2 Voice

First-person Micah. Specific, sensory, adult. No emojis. No exclamation marks. No em dashes (author house style — use commas, colons, or rephrase).

### 9.3 Seed content for launch

- 6–10 specimens spread across Stages I–III.
- 20–40 pens catalogued (can exceed specimens).
- 15–25 papers catalogued.
- 2–3 field notes.
- Colophon.

---

## 10. Tech Stack

### Stack

| Layer         | Pick                                              | Reason                                                                                                                                                                                                     |
| ------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework     | **Next.js 15 App Router**                         | Author's existing stack. RSC for editorial. Server routes for Payload. Static rendering for public pages with on-demand revalidation.                                                                      |
| CMS           | **Payload CMS 3**                                 | Installed _inside_ Next.js — one codebase, one deploy. TS-first. Admin UI at `/admin`. Typed collections generate runtime types. Relations, drafts, live preview, versioning, access control all built-in. |
| Database      | **Postgres via Neon**                             | Serverless Postgres, generous free tier, works natively with Payload. Neon branches mirror git branches for preview environments.                                                                          |
| Media storage | **Vercel Blob**                                   | Zero-config with Next.js on Vercel. Payload has an adapter. R2 alternative if cost grows.                                                                                                                  |
| Styling       | **Vanilla CSS + custom properties**               | Editorial typography needs direct CSS; utility classes interfere. Four files: `tokens.css`, `reset.css`, `typography.css`, `layout.css`.                                                                   |
| MDX           | Not used directly                                 | Payload Lexical rich text is the essay source. Lexical → HTML serializer at render time. MDX dropped (CMS-first).                                                                                          |
| Type safety   | **TypeScript strict** + Payload's generated types | End-to-end typed from admin → DB → page.                                                                                                                                                                   |
| Hosting       | **Vercel**                                        | Next.js-native. Preview deploys on PRs. Neon integration official. Blob integration official.                                                                                                              |
| Fonts         | **Fontshare self-hosted**                         | `public/fonts/*.woff2` with `font-display: swap`. No third-party font CDN (privacy + perf).                                                                                                                |
| Testing       | **Vitest** + **Playwright**                       | Unit tests for register index, quiz scoring, content utilities. E2E for quiz flow and admin authoring.                                                                                                     |
| Analytics     | **Plausible** or none in Phase 1                  | Deferred decision; no GA.                                                                                                                                                                                  |

### Runtime architecture

- **Editorial pages** (Catalogue home, Specimen, Stage, Field Notes, Colophon): statically rendered at build. `revalidatePath('/catalogue/[slug]')` triggered by Payload `afterChange` hook when content updates. Zero client JS baseline (except nav).
- **Register pages**: statically rendered. Register filters hydrate as a single client component.
- **Quiz**: client-rendered flow; reads pre-built `catalog.json` published as a static asset.
- **Admin (`/admin`)**: server-rendered; auth-gated; Payload's UI.
- **API (`/api/*`)**: Payload REST + GraphQL routes; server-rendered; rate-limited by Vercel.

### Dependency budget

Target: under **200 packages** transitive (Payload + Postgres driver brings weight). Zero client JS on pure editorial pages; **≤ 25 KB gz** client JS on `/register`; **≤ 30 KB gz** on `/quiz`.

### Rejected alternatives (and why)

- **Astro** — rejected at author's direction (prior bad experience).
- **Sanity + Next.js** — split codebase (Studio + front-end as separate apps); more ops, more integration. Payload wins on single-codebase simplicity.
- **Directus / Strapi** — both are valid but require separate process / deployment. Payload in-process is cleaner.
- **Keystatic / Decap / TinaCMS** — file-backed; author wants a real database for the growing catalog.
- **Contentful / Hygraph** — enterprise-grade but overkill and expensive.
- **SvelteKit, Remix** — author's stack is React/Next; no reason to switch.
- **Tailwind** — interferes with editorial typography iteration.

---

## 11. Performance Budget

| Target                             | Budget                                 |
| ---------------------------------- | -------------------------------------- |
| Lighthouse Performance (editorial) | ≥ 95                                   |
| Lighthouse Accessibility           | ≥ 95                                   |
| Lighthouse Best Practices          | ≥ 95                                   |
| Lighthouse SEO                     | ≥ 95                                   |
| First Contentful Paint             | ≤ 1.2 s                                |
| Largest Contentful Paint           | ≤ 1.8 s                                |
| Total Blocking Time                | ≤ 100 ms                               |
| Cumulative Layout Shift            | ≤ 0.02                                 |
| Client JS on editorial pages       | 0 KB gz (nav may contribute trivially) |
| Client JS on `/register`           | ≤ 25 KB gz                             |
| Client JS on `/quiz`               | ≤ 30 KB gz                             |
| `catalog.json` on `/quiz`          | ≤ 120 KB gz at 300 entries             |
| Total CSS                          | ≤ 28 KB gz                             |
| Web fonts                          | ≤ 150 KB gz, 4 faces max               |

Images: AVIF with WebP fallback via `next/image` + Payload's upload plugin. Explicit dimensions enforced in schema (Payload's image handler). Lazy loading below the fold only.

---

## 12. Accessibility

- WCAG AA minimum; AAA for body text contrast.
- Body text ratio ≥ 7:1 against bone ground.
- Secondary text ≥ 4.5:1.
- All figures require `alt`. Payload schema marks `alt` required on media upload.
- Semantic HTML: `<article>`, `<figure>`, `<figcaption>`, single `<h1>` per page.
- Focus-visible: 1px oxidized-copper underline, 2px offset.
- Skip-to-content link at top of every page.
- `prefers-reduced-motion` respected.
- Fontshare faces with `font-display: swap` and system-serif fallback (minimizes FOUT shift).

Quiz accessibility:

- Each question is a proper `<fieldset>` with a visible `<legend>`.
- Options are real radio inputs styled as typography; label clicks work.
- Progress indicator is `aria-hidden` if purely decorative, or `role="progressbar"` with `aria-valuenow`.
- Keyboard: arrow keys move between options; Enter advances.
- Result page announces summary via `aria-live="polite"`.

---

## 13. Directory Structure

```
pen-and-paper/
├── .impeccable.md
├── README.md
├── .gitignore
├── .nvmrc                                    # Node 22
├── .env.local.example
├── next.config.mjs
├── package.json
├── payload.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── src/
│   ├── app/
│   │   ├── (frontend)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                      # Home / Catalogue
│   │   │   ├── catalogue/[slug]/page.tsx
│   │   │   ├── stages/[stage]/page.tsx
│   │   │   ├── register/
│   │   │   │   ├── page.tsx                  # Register landing (pens/papers tabs)
│   │   │   │   ├── pens/[slug]/page.tsx
│   │   │   │   └── papers/[slug]/page.tsx
│   │   │   ├── quiz/
│   │   │   │   ├── page.tsx                  # Quiz flow
│   │   │   │   └── result/page.tsx
│   │   │   ├── field-notes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── colophon/page.tsx
│   │   │   ├── not-found.tsx                 # 404
│   │   │   ├── feed.xml/route.ts
│   │   │   └── sitemap.xml/route.ts
│   │   ├── (payload)/
│   │   │   ├── admin/[[...segments]]/page.tsx
│   │   │   └── api/[...slug]/route.ts        # Payload REST + GraphQL
│   │   └── globals.css
│   ├── collections/
│   │   ├── Specimens.ts
│   │   ├── Pens.ts
│   │   ├── Papers.ts
│   │   ├── Pairings.ts
│   │   ├── FieldNotes.ts
│   │   ├── Media.ts
│   │   └── Users.ts                          # admin auth
│   ├── components/
│   │   ├── nav/SiteNav.tsx
│   │   ├── catalogue/{SpecimenHero,StageIndex,Chronology}.tsx
│   │   ├── specimen/{Tombstone,SpecimenEssay,FigurePlate,FigureGrid,PairingFooter}.tsx
│   │   ├── register/{RegisterHead,RegisterFilters,RegisterList,PenTombstone,PaperTombstone,InkBehaviorMeter}.tsx
│   │   ├── quiz/{QuizFlow,QuizQuestion,QuizResult}.tsx
│   │   ├── field-notes/FieldNoteCard.tsx
│   │   ├── Colophon.tsx
│   │   └── TypeSet.tsx
│   ├── lib/
│   │   ├── stages.ts                         # stage enum + metadata
│   │   ├── scoring.ts                        # quiz scoring algorithm
│   │   ├── catalogIndex.ts                   # build catalog.json
│   │   ├── format.ts                         # date, roman numeral, etc.
│   │   └── payload.ts                        # get payload client helper
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   ├── typography.css
│   │   └── layout.css
│   └── payload-types.ts                      # generated by Payload
├── public/
│   ├── catalog.json                          # generated at build
│   ├── fonts/
│   ├── favicon.svg
│   └── robots.txt
├── scripts/
│   └── build-catalog-index.ts                # runs post-build; regenerates catalog.json
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-04-17-pen-and-paper-design.md
└── tests/
    ├── unit/
    │   ├── stages.test.ts
    │   ├── scoring.test.ts
    │   └── catalogIndex.test.ts
    └── e2e/
        ├── quiz-flow.spec.ts
        ├── specimen-read.spec.ts
        └── admin-auth.spec.ts
```

---

## 14. Success Criteria

Phase 1 launches when all of the following hold:

1. **Six or more specimens** published across Stages I–III.
2. **Twenty or more pens** and **fifteen or more papers** catalogued.
3. **Two or more field notes** published.
4. **Quiz returns sensible top-3 pairings** for at least 12 distinct answer combinations (manually verified).
5. Lighthouse scores ≥ 95 across all four categories on: `/`, a specimen entry, `/register`, `/quiz`.
6. Mobile (≤ 420 px) and desktop (≥ 1200 px) match approved mockup fidelity.
7. Register filter state URL-shareable and deep-linkable.
8. Payload admin accessible; at least one trial editor (the author) completes a full specimen round-trip (draft → edit → publish → revalidation → live).
9. RSS feed validates; sitemap validates.
10. Deployed to production domain with HTTPS.
11. No console errors. No hydration mismatches. No 500s on critical paths.

---

## 15. Phase 2 (deferred, for record)

Data-model assumptions Phase 1 honors so Phase 2 doesn't rewrite:

- Specimen IDs are stable and permanent.
- Author identity is a single-row singleton; Phase 2 widens to multi-author by adding a `primaryAuthor` relation.
- Affiliate URLs live on Pens/Papers/Specimens; a Phase 2 cart layer replaces the click-out.
- `Users` collection exists for admin auth in Phase 1; Phase 2 public accounts extend it with role `subscriber`.

Phase 2 scope (not committed):

- Public user accounts (email + magic link or passkey).
- User-submitted pairings with moderation queue.
- Comments on specimen entries.
- Saved quiz results per user.
- Local-shop directory with geo-search.
- Community index: who else is in Stage II.

---

## 16. Open Questions

None blocking. Resolved later by implementer or the next session:

1. **Domain name.** Candidates: `penandpaper.co`, `specimen.co`, `the-register.co`, `inkandleaf.co`, or author-named. Decide before first deploy.
2. **Newsletter mechanism.** Deferred; likely ConvertKit or Buttondown embed in Phase 1 footer.
3. **Figure plates pipeline.** Real photography vs Leonardo vs mix. Early entries may rely on Leonardo until pens acquired.
4. **Stage names.** `First Pen / Curious / Collector / Savant` is the working spine. Final copy may tighten.
5. **Analytics.** Plausible (privacy-respecting) or none in Phase 1.
6. **Admin theme.** Whether to theme Payload's admin UI with our tokens, or leave stock for speed.

---

## 17. Timeline (rough, non-binding)

Not a commitment — a shape.

| Milestone  | Work                                                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Week 1** | Next.js + Payload scaffolding. Postgres connected. Collections defined. Admin running locally.                                    |
| **Week 2** | Editorial pages: Catalogue home, Specimen entry, Stage views, Field Notes. Typography, layout, tokens. First specimen end-to-end. |
| **Week 3** | Register: list views, Pen detail, Paper detail, filters. `catalog.json` build pipeline.                                           |
| **Week 4** | Quiz flow + scoring. Result page. Edge cases. Accessibility pass.                                                                 |
| **Week 5** | Seed content authoring. Lighthouse pass. Domain + deploy. Launch.                                                                 |

---

_Spec drafted 2026-04-17. Locked for first implementation pass._
