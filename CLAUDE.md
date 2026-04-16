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
- **brews** — individual coffee tastings (purchased or self-roasted). 55 records as of April 2026.
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

## Page structure

### Terroirs (`app/(app)/terroirs/`)
- **Index:** Groups by Country → Macro Terroir, brew counts via `select('*, brews(id)')` FK join
- **Detail:** Aggregates all terroirs sharing `macro_terroir + country`. Merges context fields (first-non-null for scalars, union for meso terroirs, min/max for elevation). Shows synthesis, flavor notes, cultivars, processes, coffee list, confidence.
- **Synthesis:** `/api/terroirs/synthesize` — accepts `terriorIds[]`, finds brews via `terroir_id` FK

### Cultivars (`app/(app)/cultivars/`)
- **Index:** Groups by Genetic Family → Lineage, brew counts via `cultivar_id` FK join
- **Detail:** Aggregates all cultivars sharing `lineage`. Merges characteristics. Shows synthesis, flavor notes, terroirs, processes, coffee list, confidence.
- **Synthesis:** `/api/cultivars/synthesize` — accepts `cultivarIds[]`, finds brews via `cultivar_id` FK join

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
