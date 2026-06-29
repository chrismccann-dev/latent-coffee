# SWORKS Bottomless Dripper - Valve Position Taxonomy

Self-only canonical sub-taxonomy capturing Chris's SWORKS Bottomless Dripper valve-dial vocabulary. The dial controls flow rate during a brew — a real lever distinct from grind, temperature, agitation. The vocabulary is reference material claude.ai consults at brief time (Step 1d strategy + Step 2 recipe design) and lifecycle-archive material for cross-brew analysis.

**Authoritative authored content.** [lib/sworks-registry.ts](lib/sworks-registry.ts) is the validation mirror.

**Not a comprehensive registry.** Captures one owned instrument (SWORKS Bottomless Dripper, home + office). Adding a second valve-modulated brewer would be a deliberate registry extension — the validation surface stays self-only by design, structurally analogous to [grinder-eg1.md](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md) (EG-1 only).

## Canonical list

| Dripper | Manufacturer | Owned |
| --- | --- | --- |
| **SWORKS Bottomless Dripper** | SWORKS | Yes (home + office) |

## SWORKS Bottomless Dripper

| Field | Value |
| --- | --- |
| Name | SWORKS Bottomless Dripper |
| Manufacturer | SWORKS |
| Owned | Yes (home + office) |
| Dial range | 0-7, 1 step |
| Filter pairing | Kalita 155 / xBloom Premium Paper (office); any small flat-bottom paper (Kalita 155-sized) except April Brewer paper (home) |
| Cone geometry | Yes |
| Compatible brewers | Standalone (does not stack with other brewers) |

Variable-flow valve dripper. Cone geometry, uses Kalita 155-sized flat or wave filters (office runs xBloom Premium Paper; home takes any small flat-bottom paper except April Brewer paper). Valve dial restricts or opens flow mid-brew; each pour phase can have an independent valve state. Primary office **and home** brewer for **Balanced Intensity** and **Full Expression** when contact time management is critical; canonical **Hybrid (Sequential)** brewer when slow/slow/open valve sequences are used (lever transitions = phase boundaries).

Conceptually the SWORKS is a **finer-grained Switch**: the Hario Switch's lever is binary (immersion closed / percolation open), whereas the SWORKS valve lets you set *how long to hold and how fast to drain each phase individually*. That continuous per-phase control is why paper choice matters less here than on fixed-geometry brewers — you dial the flow you want directly rather than letting the paper set it. At home this makes it an alternative to the Switch for Hybrid staging when per-phase (not on/off) control is the goal; the dial vocabulary and adjustment logic below are location-independent, but the flow-rate calibrations are office-anchored (office tap + xBloom paper at EG-1 6.0) and should be re-confirmed on the first home brews.

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

## Valve restriction timing principles

When to restrict is as load-bearing as how much. These three principles (re-homed from the brewing-historian Office Brewing Notes, pruning case 007b) govern valve *sequencing* across the brew, beyond the per-dial flow rates above.

### Mid-pour restriction can starve the bed (Picolot Garrido Mokka Natural)

Restricting the valve to Dial 5 during mid-extraction pours (Pours 1-2) can REDUCE fruit and sugar development by starving the bed of fresh water. Extraction depends on the concentration gradient of fresh water meeting saturated grounds, not just contact time. Reserve Dial 5 restriction for the final integration pour. For fast/fast/slow roaster structures (e.g. Picolot): Dial 7 Open → Dial 7 Open → Dial 5 Restricted, not Dial 5 throughout.

- **Exception — heavy co-ferment washed** (e.g. Moonwake El Eden Tamarind) needs Dial 5 through all main pours because the extraction ceiling is much higher; valve timing for those lots is about WHEN to crack open, not whether to restrict.
- **Diagnostic:** tea-like body with subtle attack + no sweetness = under-extraction from over-restriction of mid-pours. Fix by opening Pours 1-2 and going finer on grind, not by restricting more.

### Small-dose Clarity-First inverts the Mokka principle (Lovely Vuelta)

SWORKS valve restriction on small-dose Clarity-First office brews behaves OPPOSITE to the Mokka principle. Garrido Mokka (18g, Full Expression, fast/fast/slow) needed Dial 5 only on the final integration pour. Lovely Vuelta (15g, Clarity-First, Panama Gesha washed DRD) needed Dial 5 through both Pours 1 & 2 — shallower bed + lighter extraction-capable roast + tap water together require more contact time across the extraction window, not less.

- **Rule:** on 15g office Clarity-First brews with tap water, start Dial 5 through the extraction-critical pours and open to Dial 7 on the tail to cut tannins.
- **Final-pour tail management is a distinct lever:** closing further (Dial 6 → Dial 5) at integration extends the drying tail; opening to Dial 7 at completion of Pour 2 cuts a tannic finish cleanly.

### Valve transition timing is a co-lever with temperature (Project One Blue Iris)

On Moonwake Blue Iris (yeast-anaerobic honey Catimor) at EG-1 6.3, the same temperature (95°C) that produced flattened florals + a bitter tail with a late Dial 5 → 6 transition produced the reference cup with the transition moved to ~halfway through Pour 2. Earlier valve-open shortens contact time on the tail, clearing bitter finish artifacts and creating headroom to push temperature higher for aromatic unlock. If a Balanced Intensity recipe has the right grind and temperature ceiling but the finish reads bitter, move the Dial 5 → 6 transition earlier in Pour 2 before dropping temperature. Confirmed once; retest on the next yeast-inoculated lot at the office. (Captured as the "Restricted main + late half-open transition" row in the table below.)

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
3. Cross-brew aggregation queries demand structured valve-dial patterns (per [CR-7 scoping](docs/audits/2026-05-18/CR-7-sworks-valve-flow-scoping.md) trigger #2).

Until then the registry is a vocabulary anchor only; brew-side persistence stays free-text.

## Related references

- [lib/sworks-registry.ts](lib/sworks-registry.ts) — validation mirror (TS)
- [lib/brewer-registry.ts](lib/brewer-registry.ts) — `SWORKS Bottomless Dripper` is the canonical brewer entry; this file extends valve-dial vocabulary
- [BREWING.md § Valve Position Reference](docs/skills/brewing-equipment-expert/cluster/operational-reference.md) — original prose location, retained as the practical brewing playbook
- [docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md) — sibling self-only canonical sub-taxonomy (EG-1)
