# Roasting Brief - Lamastus El Burro Geisha Natural Lot #16 (pan-lamastus-elburro-gesha-nat-2026)

**green_bean_id:** `0d1440c2-33e5-4d7f-bb7f-198d6bae538f` · **lot_status:** resolved (closed 2026-11-23) · **Started:** 2026-11-15 · **Roest inventory:** 12500

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

- **V1** - design intent: Deborah reference curve verbatim, three-slot bean-temp drop ladder in 2°C steps centred on the trigger both the Deborah close-out calibration and the Los Lajones reference point at; the outer slots are walls meant to fail. · status: **resolved** - roasted 2026-11-15 (Batches 251 / 252 / 253), house-style gate 2026-11-23 · leading slot: **v1a (Batch 251)** · experiment `PAN-LAMASTUS-ELBURRO-GESHA-NAT-2026-V1` (`6788b723-d054-4315-a798-1d8346d80e94`); recipe rows v1a/b/c and Roest profiles "El Burro - v1a/b/c" are in the DB.
  - Operator call (Chris, 2026-11-15): the lot is novel by the letter of the seen-before test, and he chose the narrow fixed-curve ladder anyway over a curve-hedge alternative (third slot on the hotter Maya / Los Lajones curve at the centre trigger). Grounds: a density-matched anchor exists, and moisture has not moved timing on any closed lot. Cost accepted: V1 does not isolate the drying question.
  - Roast-actual read (design -> roast): all three dropped honestly, FC audible on all three. Two surprises against the Deborah-derived model. First, the lot did **not** race the probe - every slot ran slower than predicted, with FC arriving just under the light rung's trigger, so the light rung got essentially no development. Second, Chris manually dropped the deep rung short of its trigger, on a real-time read that it was drifting too dark, so the realised ladder is compressed and shifted light. Whole-bean colour landed on prediction on every slot. The deep rung's FC mark is early against its two siblings on the identical curve; treat its logged dev as overstated.
  - Consequence for the gate: the light rung is a firm wall; the centre and deep rungs are **co-candidates**; there may be no deep wall. Re-predictions and taste-for notes are on the experiment row.
  - Chris's call: V1 runs in this Coordinator thread rather than a separate V-Set Assistant session (hoping for a one-V-set lot).
  - Cup read (roast-actual -> cup): the re-predictions inverted. The light rung, predicted hollow, was the most elegant and integrated cup and won; development past first crack added chocolate, roundness and bitterness step by step. The centre rung lost a back-to-back to it clearly; the deep rung went out on the first pass.
  - Route taken (Chris, 2026-11-23): **declare reference and close on V1.** This is an edge winner with no wall on the light side - the route rule would extend the ladder lighter. Chris closed anyway, with the winning gate cup as the optimized brew. Recorded as an open question on the learnings row, not relitigated.

## Current state + next step

**Lot closed 2026-11-23.** Nothing further is planned. ~700 g of green remain; if it is roasted again, the starting point is the reference recipe (v1a), and the one untested direction is a rung at or just below first crack.

## Open questions / carry-forward

- Does high moisture at low density want more early (drying) energy than the Deborah curve gives? Untested anywhere in the archive.
- Answered by V1's roasts: FC is audible on this lot even at the light rung, and the lot does not race the probe - the Deborah low-density timing model did not transfer. Colour-per-degree did.
- Do not design to a whole-bean colour or dev-time number carried from another lot.
- Workflow note for the lot-close retro (not yet in the process-friction log, to avoid colliding with the parallel 96B thread): the seen-before test does not say what to do when density is within reach of one closed lot and moisture of another.

## Cross-domain handoffs

- Tie-break rebrew: not-needed (251 vs 252 settled back-to-back at the gate)
- Optimized brew: brew_id `874696c5-6c79-4ce3-816b-0cbfb72da2fc` - the winning gate cup as-is (house style, one temperature delta)

## Close-out (when resolved)

- **Reference roast:** Batch 251 (v1a), `c29a7485-d58f-4949-892e-44fb53f3a6f9` - most layered and integrated cup of the ladder; the least roast register over the bean's fruit, floral and tea layers.
- **roast_learnings:** `79980626-70b1-46fc-b4cd-9fef22f270a0`
- **Optimized brew:** `874696c5-6c79-4ce3-816b-0cbfb72da2fc`
- **Inventory:** Roest 12500 archived.
- **Closed-lot learnings doc:** [learnings/pan-lamastus-elburro-gesha-nat-2026.md](docs/skills/roasting-historian/cluster/learnings/pan-lamastus-elburro-gesha-nat-2026.md)
- **Substrate-fold plan (scoped, NOT applied - for a fresh execution session):**
  1. [cross-coffee-insights.md § First-V-set default](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md) - add this lot as a fourth evidence row, with the caveat that it landed on V1 at the ladder's edge, unbracketed; note that the seen-before test is silent when density is near one closed lot and moisture near another.
  2. Same doc, additive table "Density <= 760 g/L" row - second low-density data point: the probe-racing behaviour did not repeat; hold as single-lot counter-evidence, do not rewrite the row.
  3. [process-friction-log.md](docs/skills/roasting-coordinator/cluster/process-friction-log.md) - two entries: the seen-before-test ambiguity above; and a designed-to-fail light wall producing an unbracketed winner.
  Recurrence gate applies: items 1-2 are one lot's findings, not cluster primitives.
