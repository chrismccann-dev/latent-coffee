# Roast Levels

**Enforcement bar:** Strict (sprint 1m — enforcement lands with adoption)
**Canonical registry:** [lib/roast-level-registry.ts](../../lib/roast-level-registry.ts) (validation mirror)
**Last adopted:** 2026-04-24
**Adoption path:** Authored taxonomy (Chris, 2026-04-24 planning session). Bucket ranges anchored to the Lighttells CM200 whole-bean Agtron scale — Chris's primary color-measurement instrument for self-roasted lots and resting/purchased coffee. Marketing-tag aliases (Nordic Light / Ultra Light / Specialty Light / Modern Light / Omni Light) were surveyed from prevailing roaster self-positioning language and mapped onto the objective buckets.

Canonical roast-level reference for the latent-coffee app. **8 canonical buckets** covering the full Agtron whole-bean range from ~130 (raw-ish under-developed) down to 0 (carbonized). Each bucket owns a 10-unit (or wider at extremes) Agtron range; a measurement on the CM200 maps deterministically to exactly one bucket. Part of the [Reference Taxonomies umbrella](../features/reference-taxonomies-attribution.md), sprint 1m structural port.

**Composition:** Each roast level is `{ name, agtronWholeBean: [min, max] }`. Intentionally lean — no sensory prose, no ground-bean Agtron range, no development-time ratio. Sensory prose can be added later if `/api/synthesize` prompts grow to need per-bucket framing; ground Agtron is out of scope because Chris's CM200 workflow measures whole bean only.

**Two-dimensional model:** `brews.roast_level` tracks the **objective** measured (or estimated) color bucket. Marketing tags like "Nordic Light" capture **roaster positioning**, not measurement, and conceptually belong on `roaster.roastStyle` — a separate slice (follow-up sprint 1h.3). This registry deliberately collapses marketing tags into objective buckets at ingest via aliases.

Additions require a 2-step edit: this doc + `lib/roast-level-registry.ts` (no DB migration unless re-bucketing existing brews, in which case a 3rd file is the migration).

---

## Canonical list

Matches `ROAST_LEVELS` in [lib/roast-level-registry.ts](../../lib/roast-level-registry.ts) exactly. 8 entries, ordered from lightest to darkest.

| Bucket | Agtron whole bean | Intent note |
|---|---|---|
| **Extremely Light** | 91-130 | Aromatic and highly origin-expressive. Narrow window for development; brews run short if under-developed. Competition / showcase zone. |
| **Very Light** | 81-90 | "Nordic Light" landing zone. Clean, bright, full acid structure. Most well-known ultra-light roasters cluster here. |
| **Light** | 71-80 | Broad specialty filter default. Balanced sweetness + acidity, origin still dominant. "Specialty Light" industry centerpiece. |
| **Medium Light** | 61-70 | "Modern Light" / "Omni Light" zone — shifts just darker than Light. Designed for espresso tolerance without losing origin. |
| **Medium** | 51-60 | Balanced — sweetness starts to dominate acidity; roast character becomes co-lead with origin. Classic US "specialty medium". |
| **Moderately Dark** | 41-50 | Roast character leads origin. Bitter-sweet edge, less acid structure. Covers "medium-dark" or "full city+" industry territory. |
| **Dark** | 31-40 | Roast-forward. Caramel → bitter-chocolate band. Traditional European / Italian styling. |
| **Very Dark** | 0-30 | Carbonized edge. Acrid past the band; historical / regional-specialty use only. |

---

## Aliases

Structural mappings — input strings in this list resolve to a canonical bucket. `isCanonical` returns false for aliases; `canonicalize` / `findClosest` surface the canonical target. Keys are case-insensitive (factory lowercases).

### Marketing tags

Roaster-positioning language surveyed from bag copy, roaster websites, and Chris's paste history. Marketing tags overlap Agtron ranges — each resolves to the single objective bucket with the greatest overlap at the tag's center of gravity.

| Marketing tag | Resolves to | Notes |
|---|---|---|
| `Ultra Light` / `UL` | Extremely Light | 88-100 Agtron; center sits in Extremely Light territory |
| `Nordic Light` / `Nordic` | Very Light | 78-88 Agtron; Nordic style target |
| `Specialty Light` | Light | 70-82 Agtron; specialty filter centerpiece |
| `Modern Light` | Light | 65-74 Agtron, boundary case; resolves to Light by family, not numeric center |
| `Omni Light` | Medium Light | 60-72 Agtron; espresso + filter crossover, slightly more developed |

### Drift variants

Capitalization, hyphenation, and word-order variants surfaced in imports and paste flows.

| Drift form | Resolves to |
|---|---|
| `Light Roast` | Light |
| `Light-Medium` / `Light Medium` / `Medium-Light` / `Light to Medium` / `med-light` | Medium Light |
| `Medium Roast` | Medium |
| `Medium Dark` / `Medium-Dark` | Moderately Dark |
| `Dark Roast` | Dark |
| `Extra Light` / `Extra-Light` | Extremely Light |

---

## Excluded

**Trade-name roasts (Vienna / French / Italian / Cinnamon / City / City+ / Full City / Full City+ / New England).** These map cleanly to Agtron buckets in industry charts, but Chris's corpus doesn't use them — his roaster set is third-wave specialty, which positions by the marketing-tag language (Nordic / Specialty / Ultra Light). Adding them creates adoption drag without adoption surface. Add later if a roaster ever ships with trade-name bag copy.

**Sensory / tasting prose per bucket.** Out of scope — no page currently consumes per-bucket prose. Add if `/api/synthesize` roaster/process/cultivar prompts ever need per-roast-level framing.

**Ground-bean Agtron range.** Chris measures whole-bean only (CM200 workflow). Ground Agtron runs ~5-7 points lower than whole — industry-reportable but decorative for this app.

**Development time ratio hints.** Roast-side context belongs with green_beans / roasts tables, not on a brew-facing roast-level registry.

---

## Adoption retro

See [memory/project_roast_level_taxonomy_adoption.md](../../memory/project_roast_level_taxonomy_adoption.md) for the sprint 1m retro covering the two-dimensional-model decision, the `canonicalize()` CanonicalLookup method addition, and the bundled 1h.2 roaster `/add` enforcement.
