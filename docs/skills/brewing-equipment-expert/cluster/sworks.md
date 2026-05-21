# SWORKS Bottomless Dripper - Valve Position Taxonomy

Self-only canonical sub-taxonomy capturing Chris's SWORKS Bottomless Dripper valve-dial vocabulary. The dial controls flow rate during a brew — a real lever distinct from grind, temperature, agitation. The vocabulary is reference material claude.ai consults at brief time (Step 1d strategy + Step 2 recipe design) and lifecycle-archive material for cross-brew analysis.

**Authoritative authored content.** [lib/sworks-registry.ts](../../../../lib/sworks-registry.ts) is the validation mirror.

**Not a comprehensive registry.** Captures one owned instrument (SWORKS Bottomless Dripper, office). Adding a second valve-modulated brewer would be a deliberate registry extension — the validation surface stays self-only by design, structurally analogous to [grinder-eg1.md](grinder-eg1.md) (EG-1 only).

## Canonical list

| Dripper | Manufacturer | Owned |
| --- | --- | --- |
| **SWORKS Bottomless Dripper** | SWORKS | Yes (office) |

## SWORKS Bottomless Dripper

| Field | Value |
| --- | --- |
| Name | SWORKS Bottomless Dripper |
| Manufacturer | SWORKS |
| Owned | Yes (office) |
| Dial range | 0-7, 1 step |
| Filter pairing | Kalita 155 / xBloom Premium Paper (office) |
| Cone geometry | Yes |
| Compatible brewers | Standalone (does not stack with other brewers) |

Variable-flow valve dripper. Cone geometry, uses Kalita 155-sized flat or wave filters. Valve dial restricts or opens flow mid-brew; each pour phase can have an independent valve state. Primary office brewer for **Balanced Intensity** and **Full Expression** when contact time management is critical; canonical **Hybrid (Sequential)** brewer when slow/slow/open valve sequences are used (lever transitions = phase boundaries).

## Valid Dials

The dial is an integer 0-7 + a wrap-around state past 7. Dials 1-4 are dead zones with a real coffee bed — restriction at those positions doesn't differentiate from Dial 0 (closed) due to bed resistance. **Use Dial 0 / 5 / 6 / 7 / past-7 only.** Dial 5 is the structural "Restricted" position; Dial 6 is "Half-Open"; Dial 7 is "Open" (which is fast — not a baseline).

Flow rates are calibrated against xBloom Premium Paper + real coffee bed at EG-1 6.0. Per-coffee variance exists; the calibration is directional.

### Dial 0 — Fully Closed

- **Flow behavior**: Zero flow — true immersion
- **Use when**: Bloom phase only (~20 seconds)
- **Notes**: Pour to target weight, close fully, saturate 20s, then crack to Restricted. Do NOT hold beyond ~25s — cup starts reading muddy. Dial positions 0-1 both behave as fully closed with a real coffee bed.

### Dial 1-4 — Dead Zone

- **Flow behavior**: Indistinguishable from Dial 0 with a real coffee bed
- **Use when**: Never (with brewing coffee). Dead zone — bed resistance dominates valve restriction.
- **Notes**: The dial mechanism continues to operate but valve restriction adds no useful control beyond what the coffee bed already provides. Skip 1-4 entirely in brewing recipes; jump 0 → 5 directly.

### Dial 5 — Restricted

- **Flow behavior**: Very slow controlled drip
- **Calibrated**: ~60 sec / 100g (xBloom Premium Paper + real bed at EG-1 6.0)
- **Use when**: Early main pours (Pour 1, sometimes Pour 2)
- **Notes**: Core extraction lever — most brew time happens here. Artificially slows drawdown without finer grind. Distinct from Dial 6 (which is moderate, not very-slow). Canonical Restricted position.

### Dial 6 — Half-Open

- **Flow behavior**: Moderate — controlled percolation
- **Calibrated**: ~45 sec / 100g (xBloom Premium Paper + real bed at EG-1 6.0)
- **Use when**: Later pours, transitioning to faster drain; Clarity-First main pours
- **Notes**: Starting position for Clarity-First where full restriction would over-extract. Standard "main" dial for anaerobic-natural Suppression brews (per Altieri Family + Basha Bekele references).

### Dial 7 — Open

- **Flow behavior**: Fast — bottomless baseline (very fast)
- **Calibrated**: ~30 sec / 100g (xBloom Premium Paper + real bed at EG-1 6.0)
- **Use when**: Final flush, ending extraction cleanly, tail-cut
- **Notes**: Open is faster than most open brewers. Open is NOT a "normal" setting — it's a fast setting. Use deliberately for tail cuts / Sequential Hybrid drawdown phase / clean finish.

### Past Dial 7 — Maximum Flow

- **Flow behavior**: ~20 sec / 100g maximum flow (full turn past 7 back to 0)
- **Use when**: Rare; emergency over-extraction recovery only
- **Notes**: Wraps back to position 0 mechanically but flows at maximum rate momentarily before re-closing. Not a brewing position; a recovery state.

## Adjustment logic (valve-first)

When dialing in a SWORKS recipe, valve is the primary lever; grind is secondary.

- **Thin / sharp cup** → close valve more (Dial 5 → Dial 6 instead, or extend Dial 5 through more of the brew)
- **Muddy / flat cup** → open valve earlier (also check if closed bloom ran >25s — common drift)
- **Bitter finish** → shorten contact time by opening valve sooner in the final pour
- **Adjust grind only after valve position is optimized** — finer grind compounds the valve-restriction effect; valve-first dialing keeps grind as a single-direction lever

## Canonical recipe patterns

The SWORKS valve has produced canonical reference recipes for multiple strategies — each with a distinct dial sequence. These pattern names live in BREWING.md archive but the vocabulary is canonical here:

| Pattern | Dial sequence | Strategy → Use case |
| --- | --- | --- |
| **Slow / slow / open (Sequential Hybrid)** | 0 (bloom) → 5 (Pours 1-2) → 7 (drawdown) | Hybrid (Sequential) on yeast-anaerobic naturals (Janson 1010, Sebastian Ramirez White Honey, Finca La Reserva Honey Anaerobic) |
| **Fast / fast / slow (Phase-Mapped Hybrid)** | 0 (bloom) → 7 (Pours 1-2) → 5 (final pour) | Full Expression / Hybrid (Phase-Mapped) on Picolot Garrido Mokka |
| **Half-open throughout** | 0 (bloom) → 6 (main pours) | Suppression on anaerobic-natural lots (Altieri Family Mima Estate, Basha Bekele) |
| **Restricted main + late half-open transition** | 0 (bloom) → 5 (Pours 1 to ~190g) → 6 (Pour 2 finish) | Balanced Intensity on yeast-inoculated honey (Project One Blue Iris) — valve-transition timing is a co-lever with temperature |
| **Restricted main + half-open finish (Hybrid Sequential)** | 0 (bloom) → 5 (Pours 1-2) → 6 (final pour) | Hybrid (Sequential) on heavy co-ferment washed (Moonwake El Eden Tamarind, Sebastián Ramírez El Placer) — valve transition timing IS the phase boundary |

The dial sequences above are canonical at the *vocabulary* level (Dial X = Y state). The pattern names (slow/slow/open, fast/fast/slow, etc.) are descriptive shorthands used in BREWING.md archive, not canonical pattern names — they emerge from operational practice and could be renamed without affecting the dial vocabulary.

## Future extension triggers

This taxonomy is intentionally narrow today (one instrument, 5 useful dial states + 1 dead-zone range + 1 wrap-around). Re-extend the registry IF:

1. A second valve-modulated brewer enters Chris's rotation (e.g. a SWORKS v2 or an alternative valve-dripper). The shape supports multiple `SworksEntry`-class entries; today there's only one.
2. Per-pour valve-dial pattern becomes a structured `brews` column. Today the dial sequence lives in `brews.pour_structure` free-text; a future structured-pour-structure sprint may extract it. At that point the registry becomes the validation source for the column.
3. Cross-brew aggregation queries demand structured valve-dial patterns (per [CR-7 scoping](../../../audits/2026-05-18/CR-7-sworks-valve-flow-scoping.md) trigger #2).

Until then the registry is a vocabulary anchor only; brew-side persistence stays free-text.

## Related references

- [lib/sworks-registry.ts](../../../../lib/sworks-registry.ts) — validation mirror (TS)
- [lib/brewer-registry.ts](../../../../lib/brewer-registry.ts) — `SWORKS Bottomless Dripper` is the canonical brewer entry; this file extends valve-dial vocabulary
- [BREWING.md § Valve Position Reference](../../../../BREWING.md) — original prose location, retained as the practical brewing playbook
- [docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md](grinder-eg1.md) — sibling self-only canonical sub-taxonomy (EG-1)
