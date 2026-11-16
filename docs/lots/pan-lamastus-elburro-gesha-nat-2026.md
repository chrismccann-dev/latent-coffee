# Roasting Brief - Lamastus El Burro Geisha Natural Lot #16 (pan-lamastus-elburro-gesha-nat-2026)

**green_bean_id:** `0d1440c2-33e5-4d7f-bb7f-198d6bae538f` · **lot_status:** waiting_for_next_roast · **Started:** 2026-11-15 · **Roest inventory:** 12500

## Anchor

- **Variety / process / producer / terroir:** Gesha / Natural (traditional, no inoculation noted) / Lamastus Family, El Burro / Panama, Potrerillos, Chiriquí. 2025 harvest, Forward Coffee lot P250044, 1 kg.
- **Density / moisture:** operator-measured 2026-11-15, on the DB row. Density is the lowest in the archive (below Deborah); moisture ties the archive high (Maya). That pairing - low density with high moisture - has no closed precedent.
- **Elevation:** not on the bag. The DB value is the midpoint of the range roaster listings give for El Burro Geisha (retailer-sourced, not producer-verified).
- **Producer tasting notes (the verify-on-track anchor):** hot = strawberry, mandarin, honey, jasmine, orange blossom, coating; cool = watermelon, strawberry, mandarin, papaya, sugary, refreshing. A stated hot-to-cool transformation, which is the layered-evolving signal.
- **Closest prior lots (Roasting Historian):**
  - [Deborah](docs/skills/roasting-historian/cluster/learnings/pan-deborah-geisha-nat-2026.md) - the density match. Low-density Gesha races the probe: FC reads late and high on the probe, whole-bean colour reads far lighter than the family model, the playable drop zone is narrow, and FC is silent on light drops. Its curve is the density-gated one (lower peak, gentler early ramp).
  - [Los Lajones](docs/skills/roasting-historian/cluster/learnings/pan-loslajones-bambu-gesha-nat-2026.md) - the process + moisture match (plain natural Gesha, Forward set), but dense. Landed on V1 from a 2°C drop ladder.
  - [Maya](docs/skills/roasting-historian/cluster/learnings/pan-lostorigin-maya-triup-yeast-nat-2026.md) - same moisture, densest of the family.
- **Seen-before test:** process family and cultivar family both pass. The density/moisture leg fails by the letter - density sits below every closed lot, and the one lot within reach on density (Deborah) is about a full moisture point drier. So the lot is **novel on green spec**, with a strong family anchor. Anchor confidence: Medium-High (same cultivar, process family, terroir; density off-span).

## Strategic arc

Find the narrow drop band where this bean shows its hot-to-cool arc (floral/strawberry hot, watermelon/papaya cool) without the roast adding anything. The working belief from three closed Chiriquí naturals plus Deborah: curve architecture transfers, the drop trigger does not, and density is what re-anchors the trigger. So the lever under test is the bean-temp drop on the density-matched (Deborah) curve.

The open risk specific to this lot is drying: the Deborah curve's gentler early ramp was built for a drier bean. The moisture-delays-FC expectation did not hold on the three dense lots, which is why the recommendation does not spend a slot on it, but none of those lots was low-density. If V1 cups read incoherent or lactic across the whole ladder rather than at one end, the curve (early energy) is the suspect, not the drop.

1 kg at ~100 g a batch gives room for a V2 and repeat roasts of the reference.

## V-set log (the plan-state)

- **V1** - design intent: Deborah reference curve verbatim, three-slot bean-temp drop ladder in 2°C steps centred on the trigger both the Deborah close-out calibration and the Los Lajones reference point at; the outer slots are walls meant to fail. · status: **designed 2026-11-15, staged, awaiting roast** · experiment `PAN-LAMASTUS-ELBURRO-GESHA-NAT-2026-V1` (`6788b723-d054-4315-a798-1d8346d80e94`); recipe rows v1a/b/c and Roest profiles "El Burro - v1a/b/c" are in the DB.
  - Operator call (Chris, 2026-11-15): the lot is novel by the letter of the seen-before test, and he chose the narrow fixed-curve ladder anyway over a curve-hedge alternative (third slot on the hotter Maya / Los Lajones curve at the centre trigger). Grounds: a density-matched anchor exists, and moisture has not moved timing on any closed lot. Cost accepted: V1 does not isolate the drying question.
  - Route reading: bracketed winner at the centre -> declare reference. Winner at an edge -> extend the ladder that way, same curve. All three incoherent / lactic -> the curve under-dried; V2 changes early energy, not the trigger.

## Current state + next step

Intake done and V1 staged. The V-set Handoff Packet + operator prep packet were emitted to Chris on 2026-11-15. **Next:** Chris roasts V1 in a V-Set Assistant session; a fresh Coordinator session consumes the Results Packet, resolves the three-point deltas, and routes.

## Open questions / carry-forward

- Does high moisture at low density want more early (drying) energy than the Deborah curve gives? Untested anywhere in the archive.
- Will FC be audible? Deborah's was silent on light drops and only audible on the deeper rungs; do not read a silent FC on the light rung as a problem.
- Expect the lot to run fast and read light on whole-bean colour (Deborah precedent). If it runs fast at the machine, shift all three triggers together (Los Lajones precedent) rather than holding.
- Do not design to a whole-bean colour or dev-time number carried from another lot.
- Workflow note for the lot-close retro (not yet in the process-friction log, to avoid colliding with the parallel 96B thread): the seen-before test does not say what to do when density is within reach of one closed lot and moisture of another.

## Cross-domain handoffs

- Tie-break rebrew: not-needed
- Optimized brew: not-started

## Close-out (when resolved)

-
