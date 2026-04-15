# Latent Coffee Research

Personal coffee research journal — a Next.js app backed by Supabase for tracking brews, terroirs, cultivars, and green beans. The goal is compounding knowledge: every brew should make the next one better.

## Stack

- **Framework:** Next.js (App Router, server components)
- **Database:** Supabase (Postgres + RLS)
- **AI:** Anthropic SDK (`claude-sonnet-4-6`) for synthesis features
- **Styling:** Tailwind CSS with custom design tokens (`latent-fg`, `latent-mid`, `latent-border`, `latent-bg`)

## Data Hierarchy

### Cultivars
Species → Genetic Family → **Lineage** → Cultivar subtype

Pages and synthesis operate at the **lineage** level. Individual subtypes (e.g., "Colombian Gesha selection") are metadata tags on lineage pages.

- Text-based matching (`lib/cultivar-matching.ts`) — brews don't use FK relationships for cultivars; matching is done via `brew.variety` against cultivar name/lineage keywords
- Synthesis API: `POST /api/cultivars/synthesize` with `{ cultivarIds: string[] }`

### Terroirs
Country → Admin Region → **Macro Terroir** → Meso Terroir → Micro Terroir

Pages and synthesis should operate at the **macro terroir** level (analogous to lineage for cultivars).

- FK relationships — brews reference terroirs via `terroir_id`
- Synthesis API: `POST /api/terroirs/synthesize` (planned)

### Brews
The core data unit. Each brew captures recipe, tasting notes, and learning fields (key_takeaways, peak_expression, temperature_evolution, cultivar_connection, terroir_connection).

## Key Patterns

- **No FK for cultivar matching** — `brews.cultivar_id` is not populated. Use `brewMatchesCultivar()` from `lib/cultivar-matching.ts` for text-based matching
- **FK for terroir matching** — `brews.terroir_id` is populated and reliable
- **Server components** — pages fetch data directly via Supabase server client, no API layer for reads
- **Client components** only for interactive features (synthesis generation, forms)
- **Synthesis caching** — `synthesis` and `synthesis_brew_count` columns on cultivars table; synthesis regenerates when brew count changes
- **Country colors** — hardcoded in terroir and cultivar page components per genetic_family/country

## Design Conventions

- Monospace uppercase headers (`font-mono text-xs font-semibold tracking-wide uppercase`)
- Section cards with white bg + border (`rounded-md p-6 mb-4 bg-white border border-latent-border`)
- Dark section variant for confidence indicators (`bg-latent-fg text-white`)
- Tags use `.tag` class (light green bg)
- Single-column layout for characteristic fields (acidity, body, aromatics — not side-by-side)
- Coffee list cards show color swatches derived from process/variety/flavor

## Commands

```bash
npm run dev    # Start dev server (port 3000)
npm run build  # Production build
```
