# Operational reference — location constraints + equipment envelope + brewer rotation

*Coffee Research · Latent · Brewing Equipment Expert cluster*

Migrated from BREWING.md in Wave 4 PR 4b (2026-05-21); consolidated to pointers in pruning case 010 (2026-07-08). Per-brewer / per-filter / per-grinder / per-sworks taxonomies live in the sibling cluster files ([brewers.md](docs/skills/brewing-equipment-expert/cluster/brewers.md) / [filters.md](docs/skills/brewing-equipment-expert/cluster/filters.md) / [grinder-eg1.md](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md) / [sworks.md](docs/skills/brewing-equipment-expert/cluster/sworks.md)) - each is the measured canonical source for its equipment. This doc holds only the **cross-equipment operational reference** that consumes them: location constraints, the cup-tendency rotation view, and the rotation framework.

## Location Constraints

### Office (Downtown Palo Alto)

| **Field**                     | **Details**                                                                                                                                                                                                                                                                                                                                                                               |
|-------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Brewers**                   | April Brewer Glass, Kalita Wave Tsubame 155, SWORKS Bottomless Dripper. (XBLOOM available but manual preferred.)                                                                                                                                                                                                                                                                          |
| **Filters**                   | xBloom Premium Paper only (compatible with both Kalita Wave 155 and Bottomless Dripper).                                                                                                                                                                                                                                                                                                      |
| **Water**                     | Tap water — Downtown Palo Alto municipal supply. Do not assume soft or mineralized water. No water adjustments available. **Roast-forward amplification:** office tap minerals fill out an already-heavy body — on a coffee already carrying developed-roast solubles, office tap pushes it from 'manageable brown tea' to 'punishing oversteeped black tea' (Khun Lao Double Honey arc, 2026-05-26). For any roast-forward lot, prefer home low-mineral remineralized water; if office-only, expect the body one register heavier and do not chase it with grind. Cross-anchor water × roast-level rule lives in [cross-coffee-insights.md § Pattern #6](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md). |
| **April Brewer**              | OFFICE: drains ~2:30 with xBloom Premium Paper regardless of grind. Strong fit for integration / Suppression / mid-palate work — works well on heavy-roast / loud beans where the brew layer needs to control rather than push (e.g. Mandela XO heavy-suppression brewing). Not suitable for Full Expression at the office (use Kalita 155 or SWORKS Bottomless when high agitation is needed).                                                                                                                                                                                                                                       |
| **Kalita Wave 155**           | Reliable 3:00-3:30 drawdown with xBloom Premium Paper. Pour structure and rest timing are the primary extraction levers, not grind size. NOTE: runs faster than expected even at finer grind — use Bottomless Dripper when precise flow control is needed. On some coffees (confirmed: Sebastian Ramirez White Honey Gesha) the Kalita still drains too fast for Balanced Intensity — switch to the SWORKS Bottomless Dripper with a Restricted valve when contact time is critical.                                                                                                                                                         |
| **SWORKS Bottomless Dripper** | Variable-flow valve dripper. Cone geometry, uses 155 flat or wave filters (xBloom Premium Paper at office). Valve dial restricts or opens flow mid-brew — each pour phase can have an independent valve state (Restricted / Half-Open / Open). Primary office brewer for Balanced Intensity and Full Expression when contact time management is critical. See Valve Position Reference below. |

### Home

| **Field**     | **Details**                                                                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Equipment** | Full equipment inventory as listed in the Equipment Reference below.                                                                                            |
| **Water**     | A deliberate lever when focusing: built per [water.md](docs/skills/brewing-equipment-expert/cluster/water.md)'s anion→phase chart for a per-coffee custom water (the `/brew` Step 2 home suggestion drives this). Low-effort daily default: distilled + remineralized with Third Wave Water packs (Light Roast packet diluted ~1:3 concentrate-to-distilled, topped up with pure distilled to brew volume), or any standing crushable comp. The comp stays available; the built water is for when the brew is a deliberate dial-in. |

## Equipment Reference

### Brewer System

Canonical brewer SKUs are in `canonicals://brewers` (47 canonicals + 26 aliases). Below is the rotation-relevant subset with cup-tendency framing for recipe construction. The per-brewer technical spec sheet lives in [brewers.md](docs/skills/brewing-equipment-expert/cluster/brewers.md) (owned); not-owned entries in [docs/taxonomies/brewers-not-owned-archive.md](docs/taxonomies/brewers-not-owned-archive.md).

| **Brewer**                    | **Geometry**           | **Flow**                    | **Cup Tendency**                          | **Notes**                                                                                                                                                                                                                |
|-------------------------------|------------------------|-----------------------------|-------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **UFO Ceramic**               | Cone                   | Very Fast                   | Extreme clarity, high aromatic separation | Delicate high-aroma coffees. Home only. ★ Rotate more deliberately — has been over-relied on.                                                                                                                            |
| **Orea Glass**                | Flat                   | Fast                        | Bright fruit clarity, clean finish        | Washed African coffees, expressive light roasts. Home only.                                                                                                                                                              |
| **Orea Porcelain**            | Flat                   | Fast-Medium                 | Slightly sweeter and rounder than glass   | Fruit-forward coffees needing balance. Home only.                                                                                                                                                                        |
| **Orea v4**                   | Flat (modular)         | Variable — base-controlled  | Clarity-balanced flat with base-driven flow control | Home only. Modular base system — flow is controlled by interchangeable base rather than fixed geometry. Distinct from v1-3 (Glass/Porcelain) in that flow can be tuned independently of paper choice. Pair with Negotiator base or Sibarist FLAT papers. |
| **Hario V60 Glass**           | Cone                   | Medium-Fast                 | Classic clarity, balanced extraction      | Baseline dialing brewer. Home only.                                                                                                                                                                                      |
| **April Brewer**              | Flat (wave / shallow)  | Medium                      | High sweetness, rounded acidity, mid-palate integration           | Home + Office. Primary use case: integration vehicle for round sweetness + controlled clarity. OFFICE: use for Suppression / integration work; not for Full Expression (route Full Expression to Kalita 155 or SWORKS Bottomless; office drain times in § Location Constraints).                                                                                |
| **Kalita Wave 155**           | Wave Flat              | Medium-Slow                 | Fuller body, strong sweetness             | Home + Office. OFFICE DEFAULT for Full Expression/Balanced Intensity (office drain time in § Location Constraints). NOTE: runs faster than expected even at finer grinds.                                                                  |
| **SWORKS Bottomless Dripper** | Cone (variable)        | Variable — valve-controlled | Flexible depending on valve state         | Home + Office. Primary variable-flow brewer; canonical Hybrid-strategy brewer at home and office (v8.4). Full behavior model (immersion-to-percolation continuum, per-phase hold/release vs the Switch's binary lever, paper-matters-less rationale, filter pairing) lives in [sworks.md](docs/skills/brewing-equipment-expert/cluster/sworks.md). |
| **Hario Switch Glass**        | Cone Hybrid            | Variable                    | Round sweetness, controlled extraction    | Difficult coffees, extraction experiments. Home only. **Canonical Hybrid-strategy brewer at home (v8.4)** — lever closed = immersion phase, opened = percolation drawdown. Use for Switch-style Sequential staging (Wibawa), Selective Bloom Hybrid (Ferket 2025 — separate bloom liquid from main brew), and immersion-to-percolation Phase-Mapped recipes (Garam Victor Um 2023, modulo no mesh-then-paper swap available).                                                                                                                                                                    |
| **Weber Bird**                | Immersion              | Restricted                  | Dense sweetness, uniform extraction       | Controlled extraction studies. Home only.                                                                                                                                                                                |
| **XBLOOM**                    | Automated Flat         | Programmable                | Highly repeatable                         | Testing repeatable recipes. Home + Office (manual preferred at office).                                                                                                                                                  |
| **Chemex Funnex**             | Cone (deep)            | Variable by paper           | Depends on paper — heavy/sweet with Chemex Half Moon, fast clarity with Cafec Abaca+ Deep27 or Sibarist CONE 28 FAST | Home only. Small-dose specialist (5-15g per paper spec). Currently calibrated against Cafec Abaca+ Deep27 (FP-2 half-moon equivalent). With Sibarist CONE 28 FAST the dynamics shift significantly: pour speed becomes a contact-time lever rather than relying on filter resistance. Used primarily for sub-15g doses where bed depth in cone brewers becomes a problem. |
| **Sibarist Brewing System**   | Cone (system-integrated) | Very Fast (HALO FAST) or Medium (HALO B3) | System-level peak clarity — eliminates fit and bypass variability | Home only. HALO holder + borosilicate brewing chamber + temperature exchanger. Pairs only with Sibarist HALO CONE FAST or HALO CONE B3 papers (perfect-seal system-specific). Use case: isolating extraction variables when the dripper/paper interface needs to be eliminated as a source of variance. Reserve for diagnostic / reference brews, not daily rotation. |
| **Oxo Rapid Brewer**          | Pressure + Percolation | Fast                        | Very concentrated                         | Travel, co-ferments, experimental coffees. Home only.                                                                                                                                                                    |

#### Decision rule when two brewers fit the cup goal

The cup-tendency column above describes each brewer's primary register, but in practice two brewers will often both fit a stated cup goal — most commonly **April Brewer Glass** vs **Kalita Wave 155** when the goal is balanced fruit sweetness with mid-palate integration. The lived tiebreaker (Wush Wush brewing iteration, Round 10, 2026-05-22) is to drill into the **secondary register** rather than rely on rotation-debt alone:

- **April** when integration *and softness* is the goal. The wider base geometry pulls more of the cup together — better fit when the coffee has many register signals competing for attention ("crazy flavors that need pulling together"). Round mid-palate is the dominant move.
- **Kalita Wave 155** when integration *with preserved sharpness* is the goal. Narrower base + metal construction does less of the softening work, so coffees that aren't inherently as expressive keep more of their attack and structural definition. Body + sweetness extension is the dominant move.

> **Lived-experience caveat (Chris, 2026-05-24):** the April-wider-base / Kalita-narrower-base reasoning is derived from lived sessions, not from a controlled neutral test (same coffee, same recipe, same dose, same paper, swap brewer only). Treat as a working heuristic; a future side-by-side dial-in would either confirm or refine it.

**General principle.** When two brewers share a primary cup tendency, the tiebreaker is which secondary register the coffee benefits from — softening / pulling-together vs preserving sharpness / structural definition. This is a Step 2 brewer-selection move, after strategy is locked. Rotation-debt remains a valid follow-on tiebreaker when neither secondary register clearly dominates.


> **Hario Switch Glass - output-selection / tail-cut note.** On the Switch, Output Selection (late_cut) and the Hybrid open-drain phase are the SAME physical action - the full note (why it is the cleanest tail-cut hardware in the kit, fast-cone-paper pairing, cut-tighter-not-later) lives in the Khun Lao Double Honey entry of [brewing-historian hybrid.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md).

### Filter System

Canonical filter SKUs are in `canonicals://filters` (58 canonicals + 56 aliases). The per-filter spec sheet - fit groups, behavior, cup impact, and **measured loaded-bed drawdown** (the operative number; marketing flow labels mislead, e.g. CAFEC "Fast"/"Slow" = extraction intent, not flow physics) - lives in [filters.md](docs/skills/brewing-equipment-expert/cluster/filters.md). Select there.

Two operational notes kept inline:

- **Office paper: xBloom Premium Paper is the only paper option at the office** (compatible with Kalita Wave 155 and SWORKS Bottomless via Kalita 155 sizing). It runs faster than its thin-pulp spec might suggest in cup terms - on the Bottomless Dripper, use valve restriction to compensate when contact time is critical.
- **T-92 + boiling water pairing:** CAFEC T-92 (Cup 4 Light Roast) promotes extraction - pair with boiling water for Full Expression on high-EY roasters.

### Filter Flow Gap — B3 to FAST (Cone, Home)

The Sibarist B3 Cone (medium-fast) and Sibarist FAST Cone (very fast) sit at noticeably different points on the cone-flow spectrum, with no intermediate cone filter in current home inventory. On a single-pouch washed Panama Gesha at 12.5g (Longboard Misty Mountain, brew e479e75b), substituting B3 for FAST on a recipe designed around FAST added an estimated ~30 seconds of contact time, producing a Balanced-adjacent cup (heavier body, more bergamot/tannin tea, less aromatic separation) despite Clarity-First strategy and grind. Practical rules:

- For pure Clarity-First on delicate washed Gesha at small-pouch (12.5g) doses: Sibarist FAST Cone, not B3.
- If only B3 is available and a FAST-style result is wanted: pull a half-notch finer (e.g. 6.5 instead of 6.6) to compensate, then verify drawdown.
- The Sibarist B2 Cone (not currently in inventory) would fill this gap at a flow rate intermediate between B3 and FAST. Worth considering for purchase if delicate washed Gesha brewing becomes more frequent.
- A Filter Drawdown Test Protocol has been drafted to convert filter choice from a gut-read into a measured lever — see [brewing-historian/cluster/patterns/cross-coffee-insights.md § Open Questions](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md).

### Additional Tools

| **Tool**              | **Purpose**                    | **Effect**                                                                           |
|-----------------------|--------------------------------|--------------------------------------------------------------------------------------|
| Melodrip              | Reduces agitation during pours | Cleaner extraction, less fines movement — use for Clarity-First strategy. Home only. |
| Paragon chilling ball | Rapid cooling of extraction    | Preserves aromatics, boosts perceived sweetness — use at end of brew. Home only.     |

### Grinder: Weber EG-1

Large flat burr, tight particle distribution, low fines. One EG-1 at home (distilled + remineralized water), one at office (tap water, Downtown Palo Alto). Both calibrated to the same grind settings. **The canonical source is [grinder-eg1.md](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md)** - the 51-setting taxonomy (16 measured, 35 valid-but-unmeasured) plus § Structural findings (D50 compression band, the 6.0-to-5.5 step, the sub-5.0 floor, and the high-EY-roaster physically-unreachable-D50 implication with its temperature/agitation/filter/time compensation levers).

## Valve Position Reference — SWORKS Bottomless Dripper

The per-dial-state taxonomy (Dial 0 / 5 / 6 / 7 / past-7), calibrated flow rates, and valve-first adjustment logic live in [sworks.md](docs/skills/brewing-equipment-expert/cluster/sworks.md) - the authoritative authored source; consult it for recipe construction.

**Dead-zone warning kept inline:** Dial positions 1-4 are dead zones with a real coffee bed - bed resistance dominates valve restriction, so they do not differentiate from Dial 0 (closed). Usable range is 0 (bloom immersion) then 5 (Restricted) through 7 (Open); jump 0 to 5 directly.

## Practical Brewer Rotation Framework

*Rotate by cup structure goal. Do not default to the same brewer repeatedly. Note: office brewers are limited to April, Kalita Wave 155, and SWORKS Bottomless Dripper.*

| **Desired Cup**                | **Home Brewers**            | **Office Brewers**                                    | **Notes**                                                   |
|--------------------------------|-----------------------------|-------------------------------------------------------|-------------------------------------------------------------|
| Maximum clarity                | UFO, Orea Glass             | — not available                                       | Home only for this profile                                  |
| Balanced fruit sweetness       | April, Kalita, Bottomless Dripper (Half-Open)               | Kalita 155, Bottomless Dripper (Half-Open)            | Bottomless Dripper gives per-phase flow control at either location. |
| Full Expression / contact time | Switch (hybrid), Bottomless Dripper (Restricted→Half-Open), Weber Bird | Bottomless Dripper (Restricted→Half-Open), Kalita 155 | Bottomless Dripper is the preferred contact-time brewer at both home and office; at home it edges the Switch when per-phase (not binary) staging is wanted. |
| Maximum intensity              | Oxo Soup Shot               | — not available                                       | Home only                                                   |

## Example Outputs

The BREWING.md-era format demos that lived here were cut in pruning case 010 (2026-07-08; git-recoverable). The canonical recipe output format lives in [brewing-assistant/cluster/operational-guide.md](docs/skills/brewing-assistant/cluster/operational-guide.md) Step 2 (recipe output) + Step 4 (resolved brew format, incl. the SWORKS valve clause); valve adjustment logic lives in [sworks.md § Adjustment logic](docs/skills/brewing-equipment-expert/cluster/sworks.md).

## Cross-references

- [brewers.md](docs/skills/brewing-equipment-expert/cluster/brewers.md) — per-brewer technical spec sheet (13 owned entries; not-owned archive at [docs/taxonomies/brewers-not-owned-archive.md](docs/taxonomies/brewers-not-owned-archive.md))
- [filters.md](docs/skills/brewing-equipment-expert/cluster/filters.md) — per-filter technical spec sheet (23 owned entries; not-owned archive at [docs/taxonomies/filters-not-owned-archive.md](docs/taxonomies/filters-not-owned-archive.md))
- [grinder-eg1.md](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md) — per-setting D50 / Zone / Extraction Behavior taxonomy (51 settings)
- [sworks.md](docs/skills/brewing-equipment-expert/cluster/sworks.md) — per-dial-state SWORKS taxonomy with flow-rate measurements
- [brewing-assistant/cluster/operational-guide.md](docs/skills/brewing-assistant/cluster/operational-guide.md) — the BREW PROMPT operational guidance that consumes this reference
- [coordinator/catalog.md § brewing-domain-principles](docs/skills/coordinator/catalog.md) — brewer rotation discipline framing
