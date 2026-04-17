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
- **terroirs** — geographic/ecological zones. Hierarchy: Country → Admin Region → Macro Terroir → Meso Terroir → Micro Terroir
- **cultivars** — coffee varieties. Hierarchy: Species → Genetic Family → Lineage → Cultivar subtype
- **green_beans** — raw coffee lots (self-roasted only, 4 records). Has roasts, experiments, cuppings.

### Relationship patterns (IMPORTANT)
- **Brew → Terroir:** FK via `brews.terroir_id`. All 55 brews linked (backfilled in migrations 005-006).
- **Brew → Cultivar:** FK via `brews.cultivar_id`. All 55 brews linked (backfilled in migration 006).
- **Brew → Green Bean:** `brews.green_bean_id` — set for all 4 self-roasted brews (backfilled in migration 006).
- **Green Bean → Terroir/Cultivar:** `green_beans.terroir_id` and `green_beans.cultivar_id` — all 4 populated.
- **New brews must set `terroir_id` and `cultivar_id`** on insert. The add flow handles this for self-roasted; purchased brews need an import flow (not yet built).

### Canonical registries
- **Macro Terroir names** must come from a predefined registry of ecological systems. See Chris's terroir ruleset doc.
- **Cultivar names** must resolve to canonical names from the Cultivar Registry. Marketing/trade names are normalized.
- **Genetic Families:** Ethiopian Landrace Families, Typica Family, Bourbon Family, Typica × Bourbon Crosses, Modern Hybrids
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
- **Detail:** URL = `/processes/${encodeURIComponent(processName)}`. Aggregates all brews with `process = processName`. Shows synthesis, flavor notes, cultivars, terroirs, coffee list, confidence.
- **Synthesis:** `/api/processes/synthesize` — accepts `{ process: string }`, finds brews by `process` equality, caches into `process_syntheses` table keyed on (user_id, process).
- **Family lookup:** [lib/process-families.ts](lib/process-families.ts) — single source of truth for process → family mapping + family colors. 5 families: Washed / Natural / Honey / Anaerobic / Experimental. Processes not in the lookup fall into "Other".
- **Prompt framing:** synthesis prompt explicitly tells Claude Chris's palate has widened beyond clean-washed, and asks for "when this style delivers vs. when it goes off" rather than good/bad scoring. See `memory/user_taste_evolution.md`.

### Brews (`app/(app)/brews/`)
- **Index:** Grid of book-cover cards. All card content sits on the cover (variety / process / producer / region stack top-left, extraction-strategy chip top-right, flavor notes bottom). No text below the card — everything is one tile. Strategy filter pills above the grid drive server-side filtering via `searchParams.strategy`.
- **Detail:** Hero card with unified cover color (same `getCoverColor` as the list), coffee details, terroir, cultivar, recipe with extraction strategy. The "Tasted As (differs)" column only renders when `extraction_confirmed` diverges from `extraction_strategy`.
- **Cover color helper:** [lib/brew-colors.ts](lib/brew-colors.ts) — single source of truth. Used by list, detail, terroir-detail, cultivar-detail, processes-detail. Do NOT re-implement per page.
- **Extraction-strategy helper:** [lib/extraction-strategy.ts](lib/extraction-strategy.ts) — pill colors, canonical list, `truncateLearning` helper.
- **Strategy pill component:** [components/StrategyPill.tsx](components/StrategyPill.tsx) — two variants: `row` (bordered pill with full name, used in coffee-row lists on terroir/cultivar/processes detail) and `card` (borderless rounded-full abbreviation, used on brew covers in the list). Do NOT re-inline the span markup.

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

- **Desktop is the primary design target.** The current layout is not tested on mobile — any new feature sprint should add a mobile + tablet pass (viewport checks via `preview_resize`) before merging.
- **Colors** — `lib/brew-colors.ts` is the single source of truth for brew-card covers. Current palette: forest green (Gesha variety), muted teal (floral flavor), burgundy (anaerobic/berry/wine), gold (honey), brown (natural), slate (neutral fallback — non-green so it doesn't compete with the variety/flavor greens). Adding a new color requires a thought pass on hue distinctness.
- **Content on cards** — brew cards intentionally surface *all* content on the cover (no secondary text block below). Avoid "where does this data live" duplication: if a field belongs on the card, remove it from the surrounding chrome.

## Sprint cadence (for Claude)

Run these four checkpoints on every non-trivial sprint:

1. **Plan before coding when scope is interpretive.** If the brief is a mockup, a redesign, or anything with "make it better" — enter plan mode (ExitPlanMode tool) and surface your interpretation *before* editing files. Skip only when the scope is fully concrete (specific file, specific line, specific fix). Silent interpretation calls are the #1 source of back-and-forth.

2. **Preview every UI change.** Start the dev server (`preview_start`), take a screenshot after each change, and verify via `preview_eval` / `preview_screenshot` before committing. Don't rely on "it should work" — the mismatched Alo Village cover color would have been caught on the first screenshot.

3. **Run `/simplify` before review or commit.** Claude over-engineers — duplicate JSX across pages, inline IIFEs, copy-pasted inline styles. Let the simplify skill catch it before it becomes tech debt. Run once per sprint, after implementation is done but before the commit step. Especially important when a sprint touched 2+ files that now share a rendering pattern. Current pending candidates: the `Section` / `Tag` helpers are now triple-duplicated across terroir-detail, cultivar-detail, and processes-detail — next aggregation page (roasters?) should trigger an extract into `components/SectionCard.tsx` + `components/Tag.tsx` rather than a 4th copy.

4. **Retro before docs.** Before updating PRODUCT.md / CLAUDE.md / memory files at the end of a sprint, explicitly pause and list: what we tried that didn't work, what surprised us, what we'd do differently next time. The doc updates then write themselves. Don't wait for Chris to ask — this is a standing part of every sprint.
