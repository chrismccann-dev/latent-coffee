# Latent Coffee Research — Design Brief

*For use with external design tools (e.g. Claude Design). Last updated: 2026-04-17.*

---

## What this is
A **personal coffee research journal** that compounds brewing and roasting knowledge over time. It's an **archival tool**, not an iteration workspace — the 5-10 dial-in attempts for a recipe happen in Claude projects and spreadsheets; this app is where the *final, best expression* of each coffee lives, alongside the learnings that got there.

Single-user (Chris McCann). Next.js 14 App Router + Supabase Postgres + Claude Sonnet 4.6 for AI synthesis. Deployed on Vercel.

## Goals
1. **Train toward world brewer's cup–level mastery** by building a structured understanding of how cultivars × terroirs × processes × extraction strategies interact.
2. **Compound a knowledge base** so that every new green bean or roasted coffee starts from prior learnings, not zero.

## Data model (short version)
- **brews** (55) — one archived row per coffee. Has recipe, sensory notes, what_i_learned, extraction_strategy.
- **terroirs** (22) — Country → Admin Region → Macro Terroir → Meso. Macros are *ecological systems*, not admin units.
- **cultivars** (30) — Species → Genetic Family (5 canonical) → Lineage → Cultivar.
- **processes** — free-text on brews, grouped into 5 families via a lookup (Washed / Natural / Honey / Anaerobic / Experimental).
- **green_beans → roasts → cuppings / experiments / roast_learnings** — the self-roasted pipeline (4 beans so far).
- Every aggregation dimension (terroir / cultivar / process) has an AI-synthesized 2–4 sentence summary per macro-terroir / lineage / process.

## Pages
| Page | What it does |
|------|--------------|
| `/brews` | Grid of "book cover" cards, filterable by extraction strategy. Effectively the home page. |
| `/brews/[id]` | Full brew detail: hero card, recipe, sensory, terroir, cultivar, extraction strategy. |
| `/terroirs`, `/cultivars`, `/processes` | Aggregation indices grouped by family / lineage / country. |
| `/terroirs/[id]`, `/cultivars/[id]`, `/processes/[slug]` | Aggregation detail: AI synthesis, flavor notes, coffee list, confidence. |
| `/green` | Green bean lots with full roast journey (roasts → cuppings → experiments → learnings). |
| `/add` | 9-step wizard for self-roasted; purchased flow also built. |

## Design conventions already in place
These are **hard-won** — lessons from prior sprints (see PRODUCT.md "Lessons Learned"):

- **Book-cover brew cards**: all content sits on the cover — variety / process / producer / region stack top-left, extraction-strategy chip top-right, flavor notes bottom. No text below the card. Duplicating content in surrounding chrome is a known anti-pattern here.
- **One color helper per visual system**: `lib/brew-colors.ts` (cover colors), `lib/extraction-strategy.ts` (strategy pills), `lib/process-registry.ts` (family colors). Never re-implement inline.
- **Hue separation, not lightness**: the palette uses forest green (Gesha), muted teal (floral), burgundy (anaerobic/berry/wine), gold (honey), brown (natural), slate (fallback). Adding a color requires a hue-distinctness pass.
- **Signal density must co-vary with the view**: on aggregation detail pages, a per-coffee strategy pill was noise because it didn't relate to the page's grouping dimension — it was removed.

## Known design debt (open for suggestions)
- **Mobile `/brews` grid at 375px**: 2-col cards truncate card text (coffee name, producer, region, roaster) at 4-8 chars. Needs either a 1-col stack or a simplified mobile card layout.
- **Mobile `/brews/[id]` hero**: long coffee names wrap word-by-word because the `PURCHASED` badge competes for horizontal space.
- **`/brews` only has one filter dimension (extraction strategy)**. Process / terroir / cultivar filters are missing. No full-text search across learnings. No saved multi-dimensional views.
- **Cooling behavior** (temperature thresholds like "rose character only near 40°C") is scattered across unstructured text — no surface for it yet.
- **Desktop is the primary design target** — mobile has been partially addressed (hamburger nav) but never a full pass.

## What would be most valuable
Looking for an outside eye on:
1. **Information architecture** — does the /brews + 3 aggregation dimensions split feel right, or is there a better primary organizing metaphor for a knowledge-compounding journal?
2. **The brew card** — it carries a lot of signal. Is the current density well-resolved, or is there a cleaner visual hierarchy?
3. **Aggregation detail pages** — synthesis + flavor notes + coffee list + confidence. Three pages share this shape; are we under-using what aggregation *could* look like (e.g., charts of strategy-by-variety, timeline of palate evolution, anything spatial for terroirs)?
4. **Mobile** — specifically the two debt items above, but also: is a phone the right form factor for this at all, or is it fundamentally a desktop research tool?
5. **Surfacing compounding knowledge** — the whole point is that learnings should compound. Right now knowledge surfaces via AI synthesis on each dimension page. Are there design patterns that would make compounding more visible / useful?

## Taste profile (useful context for color / tone)
High-clarity, tea-structured. Floral, citric, light-bodied. Palate has *widened* to include controlled naturals and red-wine profiles, but clarity and a clean finish stay non-negotiable. The design should feel like a **research journal**, not a coffee shop menu — compact, structured, honest about confidence levels, not precious.
