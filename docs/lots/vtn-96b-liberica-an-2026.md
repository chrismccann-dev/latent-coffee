# Roasting Brief - 96B Liberica Anaerobic (vtn-96b-liberica-an-2026)

**green_bean_id:** `e3811972-bfaf-4b71-91cb-9a2feb8fd73a` · **lot_status:** waiting_for_next_cupping · **Started:** 2026-11-15 · **Roest inventory:** 12498

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
  · status: **CLOSED** - roasted 2026-11-15 (batches 254 / 255 / 256), house-style gate Day 8 (2026-11-23, operator's standard S-Works 3-pour at 93°C). Roast rows, cuppings, deltas and the key insight are on the experiment row.
  · roast-side read: the whole set landed **lighter than designed** - this bean stays light for its bean-temp trigger (the small-bean racing-probe effect flagged at intake). The ladder mapped under / light / moderate, not under / middle / over, so **the over-development wall is not yet found.** v1c never reached its trigger - the curve stalls just short of it - and was stopped manually late, with a long low-RoR finish (baked risk, not smoky risk).
  · **measurement finding (operator, 2026-11-15): both of the usual rulers are unreliable on this lot.** Cracks are few and quiet - hard to hear, and the machine's detection struggled too (v1a none heard, v1b one logged mark, v1c a single crack around six minutes) - so FC time, FC temp and dev time are all soft. Colour is inconsistent because the beans are so small (v1a and v1b read almost identical). **Design and read this lot on end temperature, weight loss and total time**; treat crack and colour numbers in the DB as soft.

  · **leading slot: V1A (Batch 254) - best of set, NOT the reference** ("not a bad first pass", would suit a milk drink, not optimized).
  · what it proved: (1) **development is the enemy of fruit on this bean.** The least-roasted slot won - herbal liqueur, jackfruit with a slight durian edge, light licorice, a little boozy - and each step deeper traded fruit for licorice, over-steeped black tea, medicinal, then smoke and low-quality bitterness. (2) **Smoke is roast-injected**, present only at the deepest slot - the intake question is answered. (3) **The over wall is found and sits far lighter than any Arabica lot in the archive**; the middle slot is already past it. **The under wall is not found** - the lightest slot showed no raw or grassy defect. (4) The producer's description (herbal, licorice, low acidity) matches the middle slot best, which the operator does not like; the cup he wants is lighter than the producer's framing. (5) A herbal / medicinal thread runs through all three - inherent or reducible is open.
  · delta resolution: design -> roast-actual: a and b ran on plan, c stalled short of its trigger. roast-actual -> cup: **the post-roast re-predictions were wrong on every slot** (expected a raw, b bright, c the leader; got the reverse order). They were built on Arabica weight-loss intuition, which does not transfer. design -> cup: the original design order (c = smoky over wall) was right at the deep end and wrong about where the fruit window sits - it is at or below the light wall.
  · route taken: **A - design V2**, winner at the edge of the ladder.
- **V2 - STAGED 2026-11-23** (operator ratified as proposed). Experiment `VTN-96B-LIBERICA-AN-2026-V2` (pk `eadf701c-b224-4d2c-a97a-92e79709f841`); recipes v2a-d (`61596335` / `f25e3582` / `9c6cd05b` / `bc932f78`); Roest profiles **641151 / 641152 / 641153 / 641154** ("Liberica 96B - v2a/b/c/d"). Numbers live in those rows. Operator direction: bracket around 254 and/or change roast speed (squeeze or lengthen the whole curve) at the 254 end point; nothing goes deeper than 254.
  · design intent: **two questions, four slots, nothing past 204°C.** (a) the under wall: a lighter drop on the V1 curve. (b) roast speed to the same end point: the whole inlet curve shifted up and down around a re-roasted 254 control.
  · v2a - V1 curve, drop 200°C (lighter probe). v2b - V1 curve, drop 204°C (254 replicate, the control). v2c - whole curve +6°C (peak 248), drop 204°C (fast). v2d - whole curve -6°C (peak 236), drop 204°C (slow).
  · fan, RPM, preheat, hopper load, batch size as V1. BEAN_TEMP end condition on all four with clock-time slow rules.
  · read: end temperature, weight loss and total time; crack and colour are soft on this lot.
  · no cup ranking is predicted - V1's predictions were wrong on every slot. The set is only readable if the control cups like 254.
  · status: **roasted 2026-11-27** (batches 257 / 258 / 259 / 260 = v2a / b / c / d), waiting for the Day-7 cup (2026-12-04). Roast rows and per-slot deltas are on the experiment row.
  · roast-side read: all four ended on their bean-temp trigger; the slow slot did not stall. **The control replicated 254 on the clock exactly**, with about half a point more weight loss - that is the noise floor for this set. **Roast speed moved weight loss at a fixed end temperature**: fast lost nearly a point less than the control, slow half a point more, and colour followed loss in order across all four. So end temperature alone does not fix development on this bean - **weight loss is the better single ruler.**
  · caveats: the slow slot (260) is not a clean speed-only comparison - the operator charged the beans late, with the drum about 5°C cooler than on the other three, so it started with less stored heat (the end itself was on the trigger). It carries two changes at once - lower curve and colder start - and its loss sits close to Batch 255, which cupped past the over wall. The fast slot (259) lands at almost the same loss as the 200°C probe (257) - those two are the interesting pair: same loss, different route.
  · no cup ranking predicted. Table questions per slot are on the experiment row (`taste_for_*`).

## Current state + next step

V2 is roasted and resting. **Next action: Chris cups all four at Day 7 (2026-12-04)** on the house style, tasting the control (258) first against his memory of 254, then dictates here; the Coordinator records the cuppings and routes. Roast and cupping logging on this lot has run in the Coordinator thread at the operator's request.

Forks closed by the operator at V2 design: four slots with a re-roasted control; speed via a whole-curve shift of 6°C either way; lighter probe at 200°C.

## Open questions / carry-forward

- Smoky: answered at V1 - roast-injected, only at the deepest slot.
- Where is the under wall? Is the herbal / medicinal thread inherent or reducible? Does roast speed change the fruit / herbal / boozy balance at a fixed end point? (V2.)
- Is weight loss the real development ruler here (same loss by two routes: 257 light-and-normal vs 259 hot-and-fast)? V2 cup answers.
- Arabica weight-loss and development intuition does not transfer to this bean; around 9% loss is the working zone. Do not re-predict cups from it.
- FC audibility: answered at V1 - cracks are few and quiet, not a usable ruler. Every future slot on this lot uses a bean_temp end condition with a clock-time slow rule; never a dev-time end condition.
- The very small bean size against 817 g/L: do the beans race the probe (reading light for a given trigger, as the low-density Deborah lot did) or read true? V1 color-per-degree slope answers.
- Bean identity: small beans are unusual for Liberica. Ask Chloe / 96B if it becomes relevant to the taxonomy row.
- Brief location: recent lots keep their working doc in `roasting-historian/cluster/active-lots/`; this lot follows the Coordinator skill and lives here. Reconcile at close-out if the learnings fold needs an active-lots stub.

## Cross-domain handoffs

- Tie-break rebrew: not-needed
- Optimized brew: not-started

## Close-out (when resolved)

Not yet.
