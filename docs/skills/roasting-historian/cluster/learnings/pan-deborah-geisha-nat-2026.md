# Finca Deborah Geisha Natural 'Interstellar' (Panama, Jamison Savage) - closed-lot learnings

*Coffee Research · Latent · Roasting Historian cluster · learnings*

**Lot:** PAN-DEBORAH-GEISHA-NAT-2026
**Status:** Closed (2026-09-07) - **the depth-arc lot**: first lot run explicitly against the layered-evolving apex goal
**Cultivar:** Gesha (Green Tip per Untold bag)
**Terroir:** Panama / Volcán Barú Highlands (Chiriquí) / Finca Deborah, ~1,900-1,950 masl (reconcile never landed; non-blocking)
**Process:** Natural - Multi-Variable Yeast Inoculated, 100+ hr (heavy-ferment family; bag-open funk read anaerobic-adjacent, but the ferment expressed as integrated depth, never as a sitting-on-top note)
**Green:** density 741 g/L (LOW - fired the design's density gate), moisture 10.5%. $419/kg, highest-cost lot in the archive. ~400g remaining at close (vacuum-seal + freeze; Roest inventory 10870 archived at 400g).
**Reference roast:** Batch 229 (V2 v2a) · 244°C-peak sustained-tail curve · bean_temp auto-drop 210.5°C / 5:00 · FC audible 4:52 / 209.4°C (first audible on the lot) · WB Agtron 84.9 / WL 11.8% · Roest profile 571885 ("Deborah - v2a")
**Optimized brew:** brew_id `23ebcdd7` · Clarity-First low edge · Orea v1-3 + FLAT FAST · 15g / 240g (1:16) · EG-1 6.6 · 91°C off-base · Melodrip all pours, minimal agitation · straight MgCl₂ GH44/KH0 · optimized on Brew 1 (diminishing-returns call) · melon + spiced-dark-chocolate + cardamom + peach, blossom/stone fruit cool-station-only, arc improves cooling

## Substrate pointers

- **roast_learnings row:** `6373e6de-3890-4912-9470-4537b4a5c8a1` (green_bean_id `3e21eeff-5d67-4f03-a225-1a6e4f11556f`). All structured fields populated.
- **Experiments:**
  - V1 `PAN-DEBORAH-GEISHA-NAT-2026-V1`: `d39d25fd-fe22-4142-b6b5-b28a620f289c` (drop ladder 206/207.5/209 on the fixed 244°C curve; winner V1C Batch 228 at the xbloom gate)
  - V2 `PAN-DEBORAH-GEISHA-NAT-2026-V2`: `06f58686-12cf-47b3-8891-1467bb4dccf8` (ladder 210.5/212/213.5, same curve, 228 as control; winner V2A Batch 229 via SPG runoff)
- **Roasts:** V1 Batches 226/227/228 (`e8288988` / `1f6c532e` / `a57ebb55` - 228 is the light-edge benchmark + parked espresso note); V2 Batches 229 (`aeecc75e`, **reference**, is_reference=true) / 230 (`4b9d17ab`) / 231 (`6d73133d`, anti-target marker).
- **Cuppings:** V1 Day-7 xbloom gate 2026-08-18 (`283b0811` / `07d96729` / `22a1b55c`); V2 Day-8 xbloom gate 2026-09-01 (`c5ee9d5e` 229 / `250f0639` 230 / `40cb3f6e` 231); **SPG runoff 2026-09-07**: `de7909cb` (228, runner-up) vs `6dd77565` (229, winner).
- **Brews:** optimized `23ebcdd7-9659-4bd7-bf24-7a70321cdd40` (2026-09-07); peer reference `c818dfcb` (Untold's WB-60.6 roast of the same lot, cupped 2026-07-27 - vocabulary calibration only, recipe explicitly non-transferable).
- **Active-lot doc:** [active-lots/pan-deborah-geisha-nat-2026.md](docs/skills/roasting-historian/cluster/active-lots/pan-deborah-geisha-nat-2026.md) (closed stub; carried the full Roasting Brief + V-set design records during the arc).
- **Doc proposals at close:** `33d3c5ae` (V2 + SPG record - resolved applied into this file); CCIL cross-lot contributions queued via propose_doc_changes at close (xbloom-inversion 2nd-lot corroboration; low-density green-spec row) alongside AN10's pending `3430b443`.

## Why Batch 229 won as the lot reference

The SPG runoff decided it, and that is the story: 229 won the V2 set at the xbloom gate but lost there to V1's 228 - then the real-pourover SPG (2026-09-07) **inverted the gate verdict**. Under consumption conditions 229 carried more sweetness and more visible acidity, melon with a peach-blossom hint and an improving cool arc, while 228's milk-chocolate/bitters note read MORE developed than 229 despite 228's lighter whole-bean color (90.8 vs 84.9). 229 sits at the top of the lot's narrow playable zone: one step lighter (207.5°C) the cup is bright-but-one-note, two steps darker (212°C+) the melon dies into the disliked Untold-like roast-forward register. The optimized brew confirmed the pick on Brew 1. Rest-days confound on the runoff (228 at Day 27 vs 229 at Day 14) held open as a caveat.

## Roast architecture that produced it

Single fixed curve across all six batches (a deliberate narrow-V1 deviation per the high-lot-value precedence rule): 244°C peak (density gate: 741 g/L fired the pre-committed 246→244 reduction), early ramp 200→232→240→244, AN10-style sustained post-FC tail 241/237/233/230 at 4:00-7:00, SR-Natural fan 80/68/63/70/73, RPM 65, charge 117 / hopper 125 / preheat 210, honest bean_temp auto-drop on every slot, no manual holds. The **drop ceiling was the entire development lever** and it separated every cup. Two lot-specific physics findings: the low-density bean **races the probe** (every batch fast + 13-18 WB points lighter than the family-derived model), and the color-per-degree slope steepens sharply above the FC zone (V2 under-called darkening by 3/6/7 points up the ladder).

## Cup-side diagnostic signals

- **Underdev:** hollow / incomplete / thin - melon sweetness with nothing supporting it, no arc movement, cooling does not rescue; one step up, bright one-note acid-dominant that collapses cooling. Correlates: ground ≥ ~87 (WB ≥ 90, delta ≤ 6), drops ≤ 207.6°C. Seen: 226 (floor), 227.
- **Overdev (two-stage):** first a milk-chocolate/bitters note that sits where the sweetness belongs and reads "more developed" than the color suggests - **visible only under real pourover, not at the gate** (228 at the SPG); terminal stage, melon death into roast-forward Untold-like character - the apex anti-target. Correlates: terminal at WB ≤ 78.7 / drops ≥ 212°C. Seen: 230, 231.
- **Ferment:** never a failure mode. The 100+ hr yeast inoculation read as integrated depth at every development level - "loud funk" never appeared; roast character was the only ceiling.

## Measurement lessons (load-bearing)

- **WB Agtron under-reads development on this lot**: plateaued 90.2→90.8 across V1's top while ground and the cup kept moving; the lighter-WB batch tasted more developed at the SPG. Ground Agtron + the cup arc are authoritative - with the partial-tray-fill + chaff caveat from SPG day (grilling-queue item 57).
- **FC audibility was dev-window-gated, not energy-gated**: identical curve, silent at 206-209°C drops (V1), audible at 210.5-213.5°C (V2). A silent FC on a light drop does not mean ferment suppression.
- **The xbloom gate picked the wrong reference and the SPG flipped it** - second lot-level inversion in the ferment-natural family (after AN10). The real-pourover arbiter before any reference call is cross-lot-corroborated, promotion-ready practice.

## The apex scorecard (why this lot mattered)

First lot run directly against the layered-evolving bar. The reference cup layers (melon / spice / dark-chocolate / blossom / stone fruit) and moves - spice dominant hot, receding warm, fruit + florality + sweetness peaking cool - with clarity as the carrier and the roast register integrated as a layer rather than bleeding.

**Operator verdict at close (2026-09-07):** the closest self-roast yet to the apex - a step ahead of the Fazenda Um Pink Bourbon - but NOT at the level of the PicoLot benchmark coffees. The cup's expression sits in a **chocolaty/spice category**, and the operator's read is that this register may be bean-intrinsic (the yeast-ferment expression) rather than roast-derived - the optimized-brew session attributed it roast-side, so the attribution is an open question. The Deborah 'Elipse' sibling (same farm, washed-finish) is the natural attribution test: if the chocolate/spice category persists there at a light roast, it is farm/bean character, not process or roast. The honest-baseline line in CONTEXT-taste.md still stands; this lot moves the high-water mark, not the bar.

## Cross-lot framing

The lot resolved the ferment-family fork the design bracketed: it is **ferment-behaved** (more development wins - AN10 pattern), not variety-behaved (Wush Wush FC-onset pattern), but at a far lighter absolute color than AN10 because of the density gap. The family rule that survives: bracket the drop ladder against the two family solutions, then trust ground color + the real-pourover arbiter, never WB or the gate. For the Deborah 'Elipse' sibling (nitrogen/washed-finish, in transit): inherit the starting_hypothesis on the roast_learnings row - measure density first, anchor on this exact curve, ladder ≤1.5°C steps biased light around 209-210.5, and put the FC-onset light end back in the bracket (the ferment-integration question is moot on a washed finish).

## Related

- Practice-arc lots that fed the design: [learnings/bra-fazendaum-wushwush-nat-2026.md](docs/skills/roasting-historian/cluster/learnings/bra-fazendaum-wushwush-nat-2026.md) (FC-onset solution) + [learnings/rwa-nova-an10-rb-2026.md](docs/skills/roasting-historian/cluster/learnings/rwa-nova-an10-rb-2026.md) (ferment-integration solution + sustained tail + gate-inversion family history)
- Patterns: [cross-coffee-insights.md](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md) (FC Floor & Ceiling, WB-delta norms, xbloom misranking - pending promotions at arbitration)
