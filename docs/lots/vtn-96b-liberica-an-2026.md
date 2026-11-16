# Roasting Brief - 96B Liberica Anaerobic (vtn-96b-liberica-an-2026)

**green_bean_id:** `e3811972-bfaf-4b71-91cb-9a2feb8fd73a` · **lot_status:** waiting_for_next_roast · **Started:** 2026-11-15 · **Roest inventory:** 12498

First Liberica in the archive. Species-level exploratory lot with a generous budget (5000 g, about 50 batches at 100 g).

## Anchor

- Liberica / 120 hr anaerobic fermentation, two-phase drying, 4-week post-drying rest / 96B Coffee Company (Hana & Thai) via Chloe Ca Phe / Vietnam, Huong Phung, Quang Tri, 600 masl. Terroir and cultivar rows are both `auto_created` provenance.
- Density 817 g/L / moisture 10.2% (measured 2026-11-15, written to the row).
- Producer tasting notes (the verify-on-track anchor): **herbal, dry fruit, black licorice, low acidity.** Chloe recommends pour-over or espresso.
- Operator green read (2026-11-15): beans are **very small** (surprising against the 817 g/L reading, and against the usual large-bean picture of Liberica - worth a second look at whether this is an Excelsa-type selection; unverified), **brownish rather than green**, with a clear **process smell** and black licorice already audible on the green.
- Operator prior cup: has had this roaster's Liberica as a cortado - tasty and unique. No filter-roast reference cup of this lot. One other Liberica datapoint sits in freezer stock (One Half Malaysia Liberica Lot 004 JH Natural), not yet cupped as a reference.
- Closest prior lot: **none that transfers.** Seen-before test fails on every leg (no closed Liberica, no closed lot from this terroir). Anchor confidence **Low**. The heavy-ferment family (Mandela XO Batch 139, then Bukure AN10) is used as a **mechanical anchor only**: curve shape, shaped fan, bean_temp end condition, silent-FC handling. Its trigger numbers, color model, ceiling and overdevelopment signature are NOT assumed to transfer.

## Strategic arc

**What the lot is for (operator, 2026-11-15):** a species baseline - learn how Liberica roasts and cups on this machine - with the aim of ending at a roast Chris actually drinks. Target expression: **more jackfruit, less smoky.** The roaster's own version worked in a milk drink, which may mean their roast leans developed; whether the filter-apex version sits lighter is an open question this lot answers.

**Apex framing.** The layered-evolving apex still governs the reference call, but on a species with low-medium terroir transparency and a heavy ferment the realistic first question is simpler: *is there a development depth where the fruit (jackfruit / dry fruit) leads and the smoky / woody / licorice-bitter side recedes?* Smoky is treated as ambiguous until V1 reads it - it may be roast-injected (overdevelopment) or inherent to species and process. The ladder separates the two: if smoke rises with drop depth it is roast; if it sits in every slot it is the bean.

**Forward design.**
- V1 maps development depth wide on one fixed curve. No slot is expected to be the reference.
- V2 narrows on whichever side of the ladder leads (1-2°C steps), or changes the curve if V1's roast logs show the energy was wrong (FC timing far off the model, stalls, racing).
- With this budget the lot can afford V3+ and side probes (a deliberately developed "cortado" roast; larger batches once a reference exists). It also feeds two downstream things: the deferred Que Liberica Honey lot (blocked on this baseline) and the blending prototype lane, where Liberica is a body component.

## V-set log (the plan-state)

- **V1 - STAGED 2026-11-15** (operator ratified as proposed). Experiment `VTN-96B-LIBERICA-AN-2026-V1` (pk `0ebc151c-1a2e-45ec-bd89-5a027828a90a`); recipes v1a / v1b / v1c (`facf8d0b` / `0ab6b929` / `a566fb94`); Roest profiles **635792 / 635793 / 635794** ("Liberica 96B - v1a/b/c"). All numbers live in those rows.
  · design intent: **wide development-depth map.** One fixed inlet curve on the heavy-ferment family shape (early energy held gentle for low moisture + very small beans; tail sustained so the deep slot keeps momentum), three slots that differ only in the bean_temp auto-drop, 4°C apart - double the seen-before step because the anchor is a guess. BEAN_TEMP end condition because FC is expected silent-to-subtle.
  · slot roles: v1a = light wall at the expected FC zone; v1b = centre, the fruit window if one exists; v1c = deep wall and the smoke test. No slot is expected to be the reference. All predictions Low confidence.
  · gate: Day-7 Latent house style on all three slots.
  · status: designed, waiting for roast.

## Current state + next step

V1 is staged and the lot is waiting for roast. **Next action: Chris roasts V1 in a V-Set Assistant session** (Handoff Packet emitted 2026-11-15), cups at Day 7 on the house-style gate, and pastes the Results Packet into a fresh Coordinator session, which resolves the deltas and routes.

Forks considered at V1 design and closed by the operator: single-axis drop ladder over a peak-inlet diagonal; ladder placed at 204 / 208 / 212; three slots, not four.

## Open questions / carry-forward

- Is smoky roast-injected or inherent? (V1 ladder answers.)
- Does FC fire audibly at all? If not, the bean_temp ladder is the only development ruler and dev-time numbers are not available.
- The very small bean size against 817 g/L: do the beans race the probe (reading light for a given trigger, as the low-density Deborah lot did) or read true? V1 color-per-degree slope answers.
- Bean identity: small beans are unusual for Liberica. Ask Chloe / 96B if it becomes relevant to the taxonomy row.
- Brief location: recent lots keep their working doc in `roasting-historian/cluster/active-lots/`; this lot follows the Coordinator skill and lives here. Reconcile at close-out if the learnings fold needs an active-lots stub.

## Cross-domain handoffs

- Tie-break rebrew: not-needed
- Optimized brew: not-started

## Close-out (when resolved)

Not yet.
