# Bukure Anaerobic Lot 10 (Red Bourbon, Rwanda Northern Province) - closed-lot learnings
*Coffee Research · Latent · Roasting Historian cluster · learnings*
**Lot:** RWA-NOVA-AN10-RB-2026
**Status:** Closed (2026-08-08)
**Cultivar:** Red Bourbon
**Terroir:** Rwanda / Northern Province / Gicumbi-Bukure / Nova Washing Station (Agnes Mukamushinja & Felix Hitayezu)
**Process:** Anaerobic Natural (mild ferment - fermentation-variable sibling of clean-natural Lot 21)
**Reference roast:** Batch 218 (V2 v2b) · 242°C peak, sustained post-FC tail · FC 4:53 / 207.7°C (audible, 4 cracks; mark likely late) · drop 209.05°C / 5:10 (honest bean_temp auto-drop) · WB Agtron 79.3 / ground 73.0 / delta +6.3
**Optimized brew:** brew_id 146a263f · Sworks Bottomless valve-hybrid (sequential) · 15g / 240g poured, late cut at ~205g · EG-1 6.4 · 93°C off-base · closed-valve bloom 45g + pour to 140g, immersion hold to 2:00, then open-valve fast drain · MgCl2 GH44/KH0 + trace NaCl pre-brew

## Substrate pointers
- **roast_learnings row:** `1e9aaa64-6d8a-4dee-b0e6-1dc52992fbdf` (green_bean_id 50ae372d-a4ee-465e-9e54-e2dcf9189c22). All structured fields populated; rest_behavior NULL.
- **Experiments:**
  - V1 AN10-PEAK-INLET-v1: `fb8b4330-5b27-4c77-b0d3-d628a954db7e` (peak 236/239/242; winner V1C Batch 216 via SPG, but manual-hold confounded; zero overdev at 207 -> V2 pushes development)
  - V2 AN10-DEV-DEPTH-v2: `490fa6a6-e2b3-4bd7-b2e6-e59ee29c1f26` (drop ladder 207/209/211 at fixed 242 peak, honest auto-drop; winner V2B Batch 218 via SPG; key insight Medium-High)
- **Roasts:** V1 Batches 214/215/216; V2 Batch 217 (`a1cf5c4f-…`, underdev-masking marker), Batch 218 (`8977e12b-…`, **reference roast** is_reference=true), Batch 219 (`11356a1c-…`, overdev marker)
- **Cuppings:** V2 xbloom gate (Day 7, 2026-08-01): `a20c94be-…` (217), `b9dc50ee-…` (218), `768a112f-…` (219, eliminated). V2 SPG (Day 11, 2026-08-05, Balanced Intensity, April Glass + April Paper): `1ff2db6c-…` (217, loser), `d69dcafb-…` (218, decisive winner)
- **Brews:** Optimized brew `146a263f-1e61-40b0-9ffa-510be34ec1ab` (2026-08-08, four-iteration dial-in)
- **Active-lot doc:** none was ever created for this lot (gap noted at V2 close; not backfilled - this file is the durable home)
- **CCIL / doc proposals at close:** `3430b443` (xbloom-misranking cross-lot corroboration + widest-delta family norm) + `23ea470d` (FC Floor & Ceiling extension)

## Why Batch 218 won as the lot reference
The V2 dev-depth ladder (207/209/211, single variable, honest auto-drop) fully separated the cup: 217 (207) bright but hollow under real extraction, 218 (209) integrated cherry/berry/cola depth with zero roast character, 219 (211) conventionally overdeveloped. 218 won the SPG decisively ("the very clear winner by far"), held on cooling, and is the first repeatable developed roast on the lot - V1's 216 reached the same territory only by manual hold. Widest WB->Gnd delta of its set (+6.3), the 4th consecutive widest-delta winner on this producer's Red Bourbon.

## Roast architecture that produced it
XO curve shape, 242°C peak (the audible-FC threshold: 236 no-fire / 239 one pop / 242 audible), sustained post-FC inlet tail (239/235/231/228 at 4:00/5:00/6:00/7:00) so drop targets are reached on genuine dev-phase energy (RoR ~11 at 4:00, no bake); shaped fan 80/68/63/70/73; RPM 65; bean_temp auto-drop 209. Steep color slope above 207: ~3 Agtron pts/°C of drop. Crack count tracked time-past-FC-onset (0/4/11 at ~15/40/80s) - a dev-time signal, not an energy signal.

## Cup-side diagnostic signals
- **Underdev (masking!):** bright gate read (blackberry/cherry/lime) over grassy/hay aroma; collapses hollow/separated/woody under real pourover. Correlates: WB >= 83.5 / delta <= 3 / FC silent or barely past. Seen: 214, 217.
- **Overdev:** conventional roast takeover ("too roasted, too far"), fruit flattened, NO XO spice. Appears abruptly between 209 and 211. Correlates: drop 211 / WB 72.1 / dev 82s. Seen: 219.

## The xbloom/SPG pattern (load-bearing)
Two slot-level gate inversions on this lot (214 in V1, 217 in V2), both over-amplifying the bright/less-developed slot; 3rd inversion in the family (Higuito, Lot 21). Real-pourover arbiter is mandatory between close finalists on this family. Promotion to Confirmed Patterns proposed at close (`3430b443`).

## Cross-lot framing
The A/B against Lot 21 resolved: the mild anaerobic layer adds cherry-cordial/cola depth over the same base without heavy-ferment behavior - audible FC at sufficient energy, conventional overdev, ceiling 209-211 (a full step above XO's ~205-206; never import heavy-ferment ceilings onto mild anaerobics). Lot 21's low-energy world (238 peak, 203-205 bean-temp trigger) and AN10's high-energy world (242 peak, 209 trigger) are two valid operating points on the same bean family, distinguished by ferment layer and energy budget.

## Related
- Sibling lot: [learnings/rwa-nova-nat21-rb-2026.md](rwa-nova-nat21-rb-2026.md)
- Patterns: [cross-coffee-insights.md](../patterns/cross-coffee-insights.md) (FC Floor & Ceiling, WB-delta norms, xbloom misranking)
