# Latent Coffee Research

Personal coffee research journal that compounds brewing knowledge over time. Built with Next.js 14, Supabase (Postgres + Auth + RLS), deployed on Vercel.

## Architecture

- **Framework:** Next.js 14 App Router, server components by default, client components only for interactivity (synthesis auto-generation)
- **Database:** Supabase Postgres with Row Level Security — all queries scoped to authenticated user
- **Auth:** Supabase cookie-based auth via `@supabase/ssr`
- **AI Synthesis:** Claude Sonnet 4.6 via `@anthropic-ai/sdk` — generates per-lineage and per-macro-terroir insights
- **Deployment:** Vercel, preview deployments per branch

## Data Model

### Core entities
- **brews** — individual coffee tastings (purchased or self-roasted). 55 records as of April 2026.
- **terroirs** — geographic/ecological zones. Hierarchy: Country → Admin Region → Macro Terroir → Meso Terroir → Micro Terroir
- **cultivars** — coffee varieties. Hierarchy: Species → Genetic Family → Lineage → Cultivar subtype
- **green_beans** — raw coffee lots (self-roasted only, 4 records). Has roasts, experiments, cuppings.

### Relationship patterns (IMPORTANT)
- **Brew → Terroir:** FK via `brews.terroir_id`. Backfilled in migration 005. New imports must set this.
- **Brew → Cultivar:** NO FK. Text-based matching via `brews.variety` against cultivar keywords. See `lib/cultivar-matching.ts`.
- **Brew → Green Bean:** `brews.green_bean_id` — only set for self-roasted coffees (4 of 55 brews).
- **Green Bean → Terroir/Cultivar:** `green_beans.terroir_id` and `green_beans.cultivar_id` — mostly NULL.

### Known data issues
- Most brews are "purchased" with no green_bean record and no cultivar_id FK
- `green_bean_id` is NULL on all 55 brews (even self-roasted ones didn't link)
- Terroir-brew links only exist because of the migration 005 backfill — future imports need to maintain this

## Page structure

### Terroirs (`app/(app)/terroirs/`)
- **Index:** Groups by Country → Macro Terroir, brew counts via `select('*, brews(id)')` FK join
- **Detail:** Aggregates all terroirs sharing `macro_terroir + country`. Merges context fields (first-non-null for scalars, union for meso terroirs, min/max for elevation). Shows synthesis, flavor notes, cultivars, processes, coffee list, confidence.
- **Synthesis:** `/api/terroirs/synthesize` — accepts `terriorIds[]`, finds brews via `terroir_id` FK

### Cultivars (`app/(app)/cultivars/`)
- **Index:** Groups by Genetic Family → Lineage, brew counts via text matching
- **Detail:** Aggregates all cultivars sharing `lineage`. Merges characteristics. Shows synthesis, flavor notes, terroirs, processes, coffee list, confidence.
- **Synthesis:** `/api/cultivars/synthesize` — accepts `cultivarIds[]`, finds brews via keyword text matching

### Brews (`app/(app)/brews/`)
- List and detail views for individual tastings

### Green (`app/(app)/green/`)
- Green bean management (self-roasted lots)

## Dev notes

- `ANTHROPIC_API_KEY` must be explicitly passed to `new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })` — auto-detection fails in Vercel serverless
- Country color swatches are hardcoded in terroir pages (12 countries mapped)
- Cultivar family colors are hardcoded in cultivar pages
- Migrations are in `supabase/migrations/` — run manually via Supabase SQL Editor
- The `@anthropic-ai/sdk` package doesn't resolve in the worktree dev server (missing node_modules) but works in Vercel builds

## Running locally

```bash
npm install
npm run dev
```

Requires `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
