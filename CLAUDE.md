# Latent Coffee Research

Personal coffee research journal that compounds brewing knowledge over time. Built with Next.js 14, Supabase (Postgres + Auth + RLS), deployed on Vercel.

> **See [PRODUCT.md](PRODUCT.md)** for the full product document — vision, workflows, data model, current state, and future directions.

## Architecture

- **Framework:** Next.js 14 App Router, server components by default, client components only for interactivity (synthesis auto-generation)
- **Database:** Supabase Postgres with Row Level Security — all queries scoped to authenticated user
- **Auth:** Supabase cookie-based auth via `@supabase/ssr`
- **AI Synthesis:** Claude Sonnet 4.6 via `@anthropic-ai/sdk` — generates per-lineage and per-macro-terroir insights
- **Deployment:** Vercel, preview deployments per branch

## Data Model

### Core entities
- **brews** — individual coffee tastings (purchased or self-roasted). 55 records as of April 2026. Has distinct `roaster` and `producer` columns; don't conflate them. Self-roasted brews carry `roaster = 'Latent'`.
- **terroirs** — geographic/ecological zones. Hierarchy: Country → Admin Region → Macro Terroir → Meso Terroir → Micro Terroir. 23 rows across 21 canonical macro groups as of migration 015.
- **cultivars** — coffee varieties. Hierarchy: Species → Genetic Family → Lineage → Cultivar subtype. 26 rows across 13 lineages and 5 genetic families as of migration 016 (Gesha is one canonical row, not 5).
- **green_beans** — raw coffee lots (self-roasted only, 4 records). Has roasts, experiments, cuppings.

### Relationship patterns (IMPORTANT)
- **Brew → Terroir:** FK via `brews.terroir_id`. All 55 brews linked (backfilled in migrations 005-006).
- **Brew → Cultivar:** FK via `brews.cultivar_id`. All 55 brews linked (backfilled in migration 006).
- **Brew → Green Bean:** `brews.green_bean_id` — set for all 4 self-roasted brews (backfilled in migration 006).
- **Green Bean → Terroir/Cultivar:** `green_beans.terroir_id` and `green_beans.cultivar_id` — all 4 populated.
- **New brews must set `terroir_id` and `cultivar_id`** on insert. The add flow handles this for self-roasted; purchased brews need an import flow (not yet built).

### Canonical registries
- **DB is source of truth.** The reference docs (terroir ruleset, cultivar ruleset) are pattern guides. When there's a conflict, trust the `terroirs.macro_terroir` / `cultivars.lineage` columns. Migration 015/016 codified this.
- **Macro Terroir names** represent ecological systems (not administrative regions). New macros only when elevation band / climate regime / soil base / roast behavior clusters differently. 21 canonical macros including the post-015 additions (Huehuetenango Highlands, Acatenango Volcanic Highlands, Yunnan Monsoonal Highlands, Sierra Sur Highlands, Southern Andean Cordillera).
- **Cultivar names** must resolve to canonical names from the Cultivar Registry. Marketing/trade names are normalized. **Gesha is one canonical cultivar** (post-016) — all selections (Panamanian / Colombian / Brazilian / 1931) collapsed into a single row. Blends stay separate from their component cultivars because blends can't transfer learnings (see `JARC blend lineage` vs `JARC selection lineage`).
- **Genetic Families:** Ethiopian Landrace Families, Typica Family, Bourbon Family, Typica × Bourbon Crosses, Modern Hybrids. 13 lineages across these 5 families.
- **Genetic cross notation:** Always use `×` (multiplication sign), never plain `x`, in lineage names (e.g. `Pacas × Maragogype lineage`, `Caturra × Timor Hybrid lineage`).
- **Extraction strategies:** `Clarity-First`, `Balanced Intensity`, `Full Expression` (canonical list in [lib/brew-import.ts](lib/brew-import.ts)). All 55 brews populated. `extraction_confirmed` is optional free-text recorded only when the planned strategy diverged from what was tasted.

## Page structure

### Terroirs (`app/(app)/terroirs/`)
- **Index:** Groups by Country → Macro Terroir, brew counts via `select('*, brews(id)')` FK join
- **Detail:** Aggregates all terroirs sharing `macro_terroir + country`. Merges context fields (first-non-null for scalars, union for meso terroirs, min/max for elevation). Shows synthesis, flavor notes, cultivars, processes, coffee list, confidence.
- **Synthesis:** `/api/terroirs/synthesize` — accepts `terriorIds[]`, finds brews via `terroir_id` FK

### Cultivars (`app/(app)/cultivars/`)
- **Index:** Groups by Genetic Family → Lineage, brew counts via `cultivar_id` FK join
- **Detail:** Aggregates all cultivars sharing `lineage`. Merges characteristics. Shows synthesis, flavor notes, terroirs, processes, coffee list, confidence.
- **Synthesis:** `/api/cultivars/synthesize` — accepts `cultivarIds[]`, finds brews via `cultivar_id` FK join

### Processes (`app/(app)/processes/`)
- **Index:** Groups by Process Family → process, brew counts via direct `brews.process` equality (no FK).
- **Detail:** URL = `/processes/${encodeURIComponent(processName)}`. Aggregates all brews with `process = processName`. Shows synthesis, flavor notes, cultivars, terroirs, roasters, coffee list, confidence.
- **Synthesis:** `/api/processes/synthesize` — accepts `{ process: string }`, finds brews by `process` equality, caches into `process_syntheses` table keyed on (user_id, process).
- **Family lookup:** [lib/process-families.ts](lib/process-families.ts) — single source of truth for process → family mapping + family colors. 5 families: Washed / Natural / Honey / Anaerobic / Experimental. Processes not in the lookup fall into "Other".
- **Prompt framing:** synthesis prompt explicitly tells Claude Chris's palate has widened beyond clean-washed, and asks for "when this style delivers vs. when it goes off" rather than good/bad scoring. See `memory/user_taste_evolution.md`.

### Roasters (`app/(app)/roasters/`)
- **Index:** Groups by Roaster Family → roaster, brew counts via direct `brews.roaster` equality (no FK). Same shape as `/processes`.
- **Detail:** URL = `/roasters/${encodeURIComponent(roasterName)}`. Aggregates all brews with `roaster = roasterName`. Shows BMR-derived HOUSE STYLE block, palate-aware synthesis, flavor notes, cultivars, terroirs, processes, coffee list, confidence.
- **Synthesis:** `/api/roasters/synthesize` — accepts `{ roaster: string }`, finds brews by `roaster` equality, caches into `roaster_syntheses` table keyed on (user_id, roaster).
- **Family lookup:** [lib/roaster-registry.ts](lib/roaster-registry.ts) — canonical list of 21 roasters + family map + warm-neutral palette + per-roaster `ROASTER_METADATA` (location, URL, BMR strategy tag, BMR house-style blurb, prior notes). 5 families mirror the BMR's extraction-strategy tags: Clarity-First / Balanced / Extraction-Forward / Varies / Self-Roasted. New roasters not in the map fall into "Unknown" (rendered only when populated).
- **Prompt framing:** synthesis prompt injects the roaster's BMR `bmrStrategy` + `bmrHouseStyle` as a *working hypothesis* — Claude is asked to confirm or push back on it from the brew corpus, not to recite it. Same palate-widened framing as `/processes`. For roasters with <3 brews, prompt explicitly flags "early data — patterns will firm up."
- **Adding a new roaster:** edit `lib/roaster-registry.ts` — add to `ROASTER_MAP` with chosen family + add `ROASTER_METADATA` card (full name / location / URL / BMR strategy / 1-2 sentence house style / optional notes). Family placement is a deliberate decision, not drift.

### Brews (`app/(app)/brews/`)
- **Index:** Grid of book-cover cards. All card content sits on the cover (variety / process / producer / region stack top-left, extraction-strategy chip top-right, flavor notes bottom). No text below the card — everything is one tile. Strategy filter pills above the grid drive server-side filtering via `searchParams.strategy`.
- **Detail:** Hero card with unified cover color (same `getCoverColor` as the list), coffee details, terroir, cultivar, recipe with extraction strategy. The "Tasted As (differs)" column only renders when `extraction_confirmed` diverges from `extraction_strategy`.
- **Cover color helper:** [lib/brew-colors.ts](lib/brew-colors.ts) — single source of truth. Used by list, detail, terroir-detail, cultivar-detail, processes-detail. Do NOT re-implement per page.
- **Extraction-strategy helper:** [lib/extraction-strategy.ts](lib/extraction-strategy.ts) — pill colors, canonical list, `truncateLearning` helper.
- **Strategy pill component:** [components/StrategyPill.tsx](components/StrategyPill.tsx) — two variants: `row` (bordered pill with full name) and `card` (borderless rounded-full abbreviation, used on brew covers in the list). As of PR #14 only the `card` variant is in use (on `/brews` cards); the `row` variant was removed from aggregation detail coffee rows because the per-row strategy signal was orthogonal to the page's grouping and read as noise. Keep the `row` variant available in case strategy becomes relevant on a future aggregation page.
- **Section / Tag components:** [components/SectionCard.tsx](components/SectionCard.tsx) + [components/Tag.tsx](components/Tag.tsx) — used by all 4 aggregation detail pages (terroir / cultivar / processes / roasters). `SectionCard` supports optional `title` and `dark` variant. Do NOT re-declare inline.
- **Tag-link list component:** [components/TagLinkList.tsx](components/TagLinkList.tsx) — `SectionCard` + flex-wrap of `<Link><Tag>` triplet. Used wherever an aggregation detail page surfaces clickable cross-link tags (currently: ROASTERS EXPLORED on terroir / cultivar / processes detail; CULTIVARS / TERROIRS / PROCESSES EXPLORED on roasters detail). Accepts `{ title, items: { key, label, href }[] }` — empty `items` renders null. Use this for any new cross-link tag block; do NOT inline the SectionCard + Link + Tag triplet again.
- **COMMON FLAVOR NOTES on aggregation pages:** rendered by [components/FlavorNotesByFamily.tsx](components/FlavorNotesByFamily.tsx) on all 3 aggregation detail pages. Accepts `[note, count][]` (produced by `aggregateFlavorNotes(brews)` from `lib/flavor-registry.ts`), groups into 8 families + Other, renders family label in family color. Do NOT re-implement per page.
- **Edit brew:** `/brews/[id]/edit` → [EditBrewForm.tsx](app/(app)/brews/%5Bid%5D/edit/EditBrewForm.tsx), single-page (not stepped) form. PATCH handler [app/api/brews/[id]/route.ts](app/api/brews/%5Bid%5D/route.ts) uses a whitelist of editable fields + `.eq('user_id')` belt-and-suspenders over RLS. Terroirs and cultivars are pick-from-existing; creating new entities still goes through `/add`.

### Header nav slot allocation (`components/Header.tsx`)
- 6 desktop items + LATENT logo + ADD button. Sits at `gap-6` (24px) — fits cleanly to ~720px width before overflow risk. Below `md:` breakpoint a hamburger sheet appears (PR #14).
- Adding a 7th item will require either dropping `gap-6` further (tight), abbreviating one label, or moving a non-primary item into a secondary nav. Don't silently add — make the trade-off visible.

### Flavor notes registry (`lib/flavor-registry.ts`)
- Canonical tag list + family + hue-separated palette. Same shape as `lib/process-families.ts` but adds a **3-tier classifier**: exact → case-insensitive → **longest canonical substring**. The substring tier lets composite tags ("Floral sweetness", "Tea-like finish") route to their base family at render time without a migration to rewrite the data.
- 8 families + Other: Citrus, Stone Fruit (absorbs pome), Berry, Tropical, Grape & Wine, Floral, Tea & Herbal, Sweet & Confection.
- `aggregateFlavorNotes(brews)` → `[note, count][]` sorted desc. Use this over re-implementing the counting loop per page.
- `FLAVOR_REGISTRY` exports the sorted canonical names for autocomplete datalists.
- `findClosestFlavor(input)` returns a suggestion when the input isn't canonical — used in the edit form chip input.
- Adding a new canonical tag = a deliberate decision, not drift. Same treatment as the macro-terroir + cultivar registries.

### Green (`app/(app)/green/`)
- Green bean management (self-roasted lots)

## Dev notes

- `ANTHROPIC_API_KEY` must be explicitly passed to `new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })` — auto-detection fails in Vercel serverless
- Country color swatches are hardcoded in terroir pages (12 countries mapped)
- Cultivar family colors are hardcoded in cultivar pages
- Migrations are in `supabase/migrations/` — run manually via Supabase SQL Editor
- The `@anthropic-ai/sdk` package doesn't resolve in the worktree dev server (missing node_modules) but works in Vercel builds
- **tsconfig has `strictNullChecks: true`** (under `strict: false`) — required so discriminated-union narrowing (`if (result.ok) return; result.code`) compiles under Next.js build. Do not turn it off without refactoring the `PersistResult` / `ValidationResult` / `TerroirMatch` / `CultivarMatch` usages in `lib/brew-import.ts` and the import/parse routes.
- **Always run `npm run build` before pushing** if you touched API routes or `lib/brew-import.ts`. Vercel will fail the deploy on TS errors, and the worktree can't run the full build because it's missing `@anthropic-ai/sdk`. Use the main repo dir `/Users/chrismccann/latent-coffee` for `npx tsc --noEmit` as a cheap proxy.

## Running locally

```bash
npm install
npm run dev
```

Requires `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`

## Design / UX conventions

**See [PRODUCT.md § Design System](PRODUCT.md#design-system) for the full token map, palette, type scale, and component primitive reference.** The rules below are the code-level enforcement points.

- **Desktop is the primary design target.** Tablet spot-check via `preview_resize` on every UI sprint; phone-scope lives in its own sprint.
- **Tokens live in `tailwind.config.ts` + `app/globals.css`.** Adding a token = a deliberate decision, not drift. No arbitrary `text-[Npx]` / `p-[Npx]` in JSX for anything chrome-related — if a size isn't in the scale, add it to the theme (and document what it's for) or don't use it.
- **Typography scale:** `text-chip` (8px), `text-micro` (9px), `text-xxs` (10.4px), `text-xs` (11.5px), `text-sm` (14px), `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px). The loudest in-product text is a brew name at `text-2xl font-semibold`. No display type.
- **Chrome vs semantic colors:**
  - Chrome: `latent-fg / bg / mid / subtle / border / accent / accent-light / highlight / highlight-border`. Use these via Tailwind utility classes; never hardcode hex for chrome.
  - Semantic palettes live in `lib/brew-colors.ts`, `lib/extraction-strategy.ts`, `lib/process-families.ts`, `lib/flavor-registry.ts`, `lib/roaster-registry.ts`, `lib/country-colors.ts`, `lib/cultivar-family-colors.ts`. Each is the single source of truth for its signal; do not copy the constants into page files.
  - Hue-separated colors — if a signal deserves its own color, shift hue, not lightness.
- **Primitive components — use, don't reimplement:**
  - `<SectionCard title? dark? children>` for every section on a detail page (imports from `@/components/SectionCard`). Do NOT inline `<div className="rounded-md p-6 mb-4 bg-white border border-latent-border">`.
  - `<Tag>` (from `@/components/Tag`) for every pill/chip using the sage-highlight treatment.
  - `<TagLinkList>` for every cross-link tag block on aggregation detail pages.
  - `<StrategyPill>`, `<FlavorNotesByFamily>` are canonical — don't redraw them.
  - `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-sm` for every button-shaped element; `.input` / `.textarea` for every form field; `.label` for every mono-uppercase section header.
- **Content on cards** — brew cards intentionally surface *all* content on the cover (no secondary text block below). Avoid "where does this data live" duplication.
- **`next dev` does not hot-reload `tailwind.config.ts` theme-extend changes.** When adding a new token, restart the dev server before verifying in `preview_*`, or you'll see the browser default and not the token.

## Sprint cadence (for Claude)

Run these four checkpoints on every non-trivial sprint:

1. **Plan before coding when scope is interpretive.** If the brief is a mockup, a redesign, or anything with "make it better" — enter plan mode (ExitPlanMode tool) and surface your interpretation *before* editing files. Skip only when the scope is fully concrete (specific file, specific line, specific fix). Silent interpretation calls are the #1 source of back-and-forth.

2. **Preview every UI change.** Start the dev server (`preview_start`), take a screenshot after each change, and verify via `preview_eval` / `preview_screenshot` before committing. Don't rely on "it should work" — the mismatched Alo Village cover color would have been caught on the first screenshot.

3. **Run `/simplify` before review or commit.** Claude over-engineers — duplicate JSX across pages, inline IIFEs, copy-pasted inline styles. Let the simplify skill catch it before it becomes tech debt. Run once per sprint, after implementation is done but before the commit step. Especially important when a sprint touched 2+ files that now share a rendering pattern.

4. **Retro before docs.** Before updating PRODUCT.md / CLAUDE.md / memory files at the end of a sprint, explicitly pause and list: what we tried that didn't work, what surprised us, what we'd do differently next time. The doc updates then write themselves. Don't wait for Chris to ask — this is a standing part of every sprint.
