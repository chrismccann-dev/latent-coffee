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
- **brews** — individual coffee tastings (purchased or self-roasted). 56 records as of April 2026 (52 purchased, 4 self-roasted).
- **terroirs** — geographic/ecological zones (22 records). Hierarchy: Country → Admin Region → Macro Terroir → Meso Terroir → Micro Terroir
- **cultivars** — coffee varieties (30 records). Hierarchy: Species → Genetic Family → Lineage → Cultivar subtype
- **green_beans** — raw coffee lots (4 records, self-roasted only). Has roasts, experiments, cuppings.

### Relationship patterns (IMPORTANT)
- **Brew → Terroir:** FK via `brews.terroir_id`. All brews linked.
- **Brew → Cultivar:** FK via `brews.cultivar_id`. All brews linked.
- **Brew → Green Bean:** `brews.green_bean_id` — set for all self-roasted brews.
- **Green Bean → Terroir/Cultivar:** `green_beans.terroir_id` and `green_beans.cultivar_id` — all populated.
- **New brews must set `terroir_id` and `cultivar_id`** on insert. Both the purchased import flow and the self-roasted wizard handle this.

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

### Add (`app/(app)/add/`)
- Source picker → branches to self-roasted wizard or purchased wizard
- **Purchased flow (6 steps):** source → 4 paste steps (Bean / Terroir / Cultivar / Best Brew tabs, matching Chris's archive spreadsheet structure) → Review & save
  - Shared parse/validate/persist logic in [lib/brew-import.ts](lib/brew-import.ts)
  - Review screen shows tri-state cards: green "MATCHED EXISTING" / amber "NEW — IN REGISTRY" / red "NEW — NOT IN REGISTRY"
  - Drift detection: casing / cross-country / lineage-mismatch / family-mismatch with one-click "Auto-fix to canonical"
  - Multi-row terroir match: `matchTerroir` fetches all rows matching `(user_id, country, macro_terroir)` and prefers the one whose `admin_region` matches (Colombia has two Western Andean Cordillera rows)
- **Self-roasted flow (9 steps):** still uses original tab-delimited paste parser; untouched by the purchased rebuild
- **Programmatic endpoints:**
  - `POST /api/brews/import` — JSON payload, returns `200 { brewId, terroirId, cultivarId, createdTerroir, createdCultivar }`, `400` for validation, `409 { error: 'confirm_required', newTerroir, newCultivar }` when registry growth needs confirmation
  - `POST /api/brews/parse` — accepts raw paste text, tries deterministic parser first, falls back to Claude Sonnet 4.6 if text is sparse. Returns `{ parsed, terroirMatch, cultivarMatch, drift, usedClaude }`

## Dev notes

- `ANTHROPIC_API_KEY` must be explicitly passed to `new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })` — auto-detection fails in Vercel serverless
- Country color swatches are hardcoded in terroir pages (12 countries mapped)
- Cultivar family colors are hardcoded in cultivar pages
- Migrations are in `supabase/migrations/` — run manually via Supabase SQL Editor
- Worktrees created under `.claude/worktrees/` start without `node_modules`; run `npm install` in the worktree before `npm run dev`
- **TypeScript build gotcha:** Next.js production build (not dev) fails to narrow discriminated unions across `if (!result.ok)` branches on async function return types. Prefer single-interface shapes with optional fields over tagged unions for API response types. See [lib/brew-import.ts](lib/brew-import.ts) `PersistResult` / `TerroirMatch` / `CultivarMatch` for the pattern.

## Running locally

```bash
npm install
npm run dev
```

Requires `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
