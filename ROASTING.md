# Coffee Roasting Master Reference Guide

*Latent Coffee*

*V4 - Last updated: April 25, 2026. V4 changes (April 25, 2026, post-CGLE Mandela XO full lot close-out): CGLE-MANDELA-XO-2026 moved from Active to Recently Closed with confirmed reference roast (Batch 139) and brew recipe. FC Marking Protocol strengthened: silent-crack coffees must use bean temp end condition, not dev time - dev time anchored to an inaudible FC produces unpredictable Maillard overrun. Fan Strategy: Mandela XO reference fan curve updated from working hypothesis to confirmed. Cross-Coffee Insight Layer updated throughout: FC Floor & Ceiling table updated with confirmed XO-fermented data; Varietal Aromatic Fingerprints table updated with confirmed Mandela XO descriptor vocabulary (caramelized pineapple, lemongrass, barbecue caramel, milk tea body); Green Spec → Starting Hypothesis table updated with confirmed XO/heavy fermentation guidance including bean temp end condition rule; Rest Behavior Patterns updated for XO-fermented; Roast-to-Brew Translation updated with confirmed Mandela XO brew recipe and corrected XO brew strategy (Balanced Intensity, not Full Expression). New Key Learning added: for XO and heavily fermented coffees, the roast job is distribution of fermentation character through the body, not amplification - fan curve shape is the primary lever. Prior updates (V3, April 25, 2026, post-CGLE Sudan Rume Hybrid Washed full lot close-out): Hopper pre-load replication caveat added - reference roast #133 was produced at old ~120°C standard, not the current 125°C standard; replication requires ~120°C to match logged parameters. Seventh Key Learning added: stone fruit tartness (malic acid) is a confirmed varietal characteristic of Sudan Rume Washed, not an extraction artifact. Varietal Aromatic Fingerprints table updated with stone fruit tartness descriptor for Sudan Rume Hybrid Washed. Rest Behavior Patterns updated: Day 6 confirmed as directionally reliable for winner selection on this coffee type. Reference Brew Recipe key signal updated to include stone fruit tartness. Current State updated to reflect final lot close-out parameters. Prior updates (V2, April 18, 2026, post-Costa Rica Higuito onboarding): Session-position compensation default changed from 128°C hopper load to no compensation (thermal reset protocol is sufficient). Experiment naming convention codified (v1a/v1b/v1c in Roest profile names; A/B/C retained in spreadsheet columns). Producer tasting notes promoted from optional to required intake field. Anchor profile tie-breaker logic added. Q1 on experiment structure made conditional. Green bean intake format aligned to Roest inventory fields. Prior updates (V1): CGLE Sudan Rume Hybrid Washed lot closed with confirmed reference roast and brew recipe. Evaluation protocol updated to Day 7 pourover-only. Standard workflow updated with new BBP and hopper pre-load protocol. Key counterflow learnings added. FC floor/ceiling concept introduced. Session position effect documented. Sections added: Session Debrief Template, Cross-Coffee Insight Layer, Roast-to-Brew Translation. New Coffee Onboarding Protocol section added. Standard Inlet Curve Template added. Green Spec → Starting Hypothesis table added.*

---

# Who I Am & What I'm Doing

I am roasting for myself only - I control the full chain from green bean sourcing through roasting to brewing and end cup. I am not roasting for customers, consistency, or broad appeal.

I am treating this like preparation for competition-level coffee (Brewers Cup / Roasting Championship standard). The goal is not to produce one universally "best" roast style - it is to build a repeatable, systematic methodology for understanding each coffee as a unique material, identifying the roast parameters that maximize its potential, and producing a reference roast that can be brewed with precision and confidence.

Different coffees have different ideal expressions. A washed Sudan Rume wants jasmine, bergamot, and stone fruit clarity. A natural from the same farm wants lemongrass and ginger integration. An XO-fermented lot wants caramelized pineapple, lemongrass tea, and integrated fermentation warmth. I am not chasing one ideal - I am building the skills and system to find the ideal for each individual coffee I source.

Every coffee is an opportunity to learn something generalizable, not just to make a good cup.

---

# Roasting Philosophy

> **Roast for elasticity. Brew for intensity.**

A successful roast is not the loudest or sweetest cup at first sip. It is a roast that improves as it cools, responds positively to small brewing changes, and allows me to choose how aggressively I want to brew. The goal is optional intensity - the ability to push a coffee hard at brew time without it collapsing.

I like coffees roasted in the style of Moonwake, Substance, Sey, Picky Chemist, Big Sur - very expressive, very light. But I am not chasing one style of coffee. I like the uniqueness and expressiveness of naturals, washed, honey, co-fermented, from many different origins and varieties. It is an exploratory exercise, not a search for one ideal type.

I roast exclusively in counterflow mode on the Roest L200 Ultra. Counterflow changes heat transfer mechanics enough that conventional roast logic does not map directly. All active experiments and learnings are built around counterflow.

---

# Equipment

- **Roaster:** Roest L200 Ultra (counterflow mode, 100g batches)
- **Color measurement:** Lightcells CM-200 - whole bean Agtron post-roast, ground Agtron pre-brew at Day 7 evaluation
- **Primary evaluation brewer:** xbloom (Brian Quan recipe - consistent, repeatable pourover for all evaluation sessions)
- **Optimized brew setup:** UFO Ceramic + Sibarist Fast Cone, EG-1 (Weber Workshop), Melodrip
- **Grinder:** EG-1 (Weber Workshop) - primary grinder for both evaluation and optimized brew

---

# Evaluation Protocol

> **Simplified from prior version:** Day 4 cupping was consistently misleading across multiple lots and multiple experiment sets. The pourover gate is the only signal that matters.

## Current Protocol

**Day 7 pourover - this is the only evaluation gate.**

- Brew method: xbloom (Brian Quan recipe) - consistent across all evaluation sessions
- Dose: 15g per batch
- Up to 3 batches per session (preferred maximum); 4 is possible but not ideal
- Evaluate as full cup sips - no spoon-only tasting. The full cup consistently reveals different character than the spoon and is closer to the real-world experience

**Ground Agtron measurement - required at every evaluation session:**

- Grind 15g from each batch before brewing
- Record WB Agtron (already measured post-roast) and Ground Agtron
- Calculate WB-to-Ground delta - this is a primary internal development signal
- Target delta ≤3 points for well-developed counterflow roasts
- Delta above 5 points: surface development is running ahead of core - profile needs more early energy
- Delta near zero or slightly negative: even development confirmed (this is the target)

**Optimized brew session - one additional session after a winner is identified:**

- Once the Day 7 evaluation identifies a winning batch, run one dedicated optimized brew session using UFO Ceramic + Sibarist Fast Cone
- This session establishes the reference brew recipe for the lot - it is for expression maximization, not evaluation
- The xbloom evaluation recipe and the optimized recipe are different tools for different purposes - do not conflate them

## Why Day 4 Cupping Was Removed

Across CGLE Sudan Rume Hybrid Washed (6 experiment sets, 20+ batches), Day 4 cupping results were wrong or misleading in both directions on multiple occasions:

- Batches that looked clean and expressive at Day 4 showed lactic/cheese defects at Day 7-10 pourover (#110)
- Batches that looked flat and underdeveloped at Day 4 revealed clean, complex character at Day 7-10 pourover (#111)
- The cupping table protocol systematically exaggerated acidity and suppressed delicate aromatic compounds

Day 4 should only be used as a catastrophic defect screen (lactic, phenolic, obvious underdevelopment). Never use Day 4 to rank batches or make advancement decisions.

**For naturals and heavily fermented coffees:** Day 7 is still the correct evaluation window. The operational simplicity of a universal Day 7 protocol for all coffees outweighs any marginal benefit from evaluating naturals a day earlier.

---

# Standard Workflow

> This workflow is fixed and should be followed identically for every roast session, regardless of coffee.

- Turn on Roest
- Pick the profile
- Let it heat up for 10 minutes
- Run a dry roast (no beans) until drum temp reaches 140°C - **this is the thermal reset that standardizes starting conditions for every batch**. Do not skip or shorten it.
- Run BBP (see BBP parameters below)
- Load green beans into hopper when drum reaches **~125°C** - hopper pre-load step
- Charge (drop beans) when drum reads **117°C** - drum coasts naturally from 120°C BBP endpoint to 117°C over ~60-90 seconds while beans are in hopper
- Preheat air temp: set to 210°C - effectively irrelevant given the dry roast thermal reset. Do not adjust as a roasting lever.

## Between Batch Protocol (BBP)

**Current BBP:**

- Fan: 100% at 0:00 → 60% at 0:30 → 40% at 1:00 → 25% at 1:45
- Air temp: 100°C (flat, no changes)
- End condition: drum temp 120°C
- Typical runtime: approximately 2:00-2:30 from 140°C endpoint to 120°C trigger

**Why this shape:** Fan at 100% early removes heat quickly from the 140°C dry roast endpoint. Tapering to 25% by 1:30 allows the drum to coast down gently rather than being blast-cooled through the charge point. Do not adjust air temp during BBP - the fan taper is the correct lever.

## Hopper Pre-Load Timing

> **Load beans at ~125°C.** This was a key discovery from V5 experiments on Sudan Rume Washed. Confirmed empirically: pre-load at 125°C vs. 120°C shifted FC timing by ~35 seconds and FC temp by ~7°C on the same profile.

Loading beans into the hopper at 125°C gives the beans approximately 60-90 seconds of pre-warming in ambient drum heat before charge. This raises the effective thermal mass at the charge event and produces earlier and cooler FC.

This is likely part of the reason a trusted peer (same machine, same mode) consistently achieves TP of 94°C vs. this machine's 78-81°C.

**Important caveat:** Loading too early produces underdevelopment. Batch #134 (hopper loaded at ~125°C on a non-standard session) produced FC at 197.6°C - below the FC floor for Sudan Rume Washed - resulting in a nutty, grassy, flat cup regardless of dev time. The 125°C hopper load with 117°C charge produces FC at approximately 201-205°C on the CF-Light profile. Do not push the hopper pre-load earlier.

**Replication caveat:** The confirmed reference roast for Sudan Rume Washed (#133) and its closest replication (#148) were both produced using the **old ~120°C hopper load standard**, not the current 125°C standard. The 125°C standard was established mid-lot after the #134 discovery. If replicating #133 exactly, use ~120°C hopper load to match the logged FC timing (~4:07, 204.5°C). Using the current 125°C standard will shift FC approximately 10-15 seconds earlier and ~1-2°C cooler - still within the usable window but not an exact match to the archive parameters. Note this difference in the Roast log when replicating.

## Standard Inlet Curve Template

All V1 roast profiles on this machine use the same seven inlet stage timestamps. Only the inlet temperature values change across experimental batches. Fixing the timestamps reduces design overhead and makes A/B/C batches within an experiment set strictly comparable.

| Timestamp | Phase Role | What This Point Controls |
|---|---|---|
| **00:00** | Charge / start inlet | Starting energy at bean contact. Default 200°C across all experiments unless there is a specific reason to vary. |
| **01:15** | Mid-drying ramp | Drying phase aggressiveness. Earlier and higher here = faster drying, shorter overall roast. |
| **02:30** | Late drying / early Maillard | Transition into Maillard. This is where drying phase ends and browning reactions begin. Typically 5-8°C below peak. |
| **03:15** | **Peak inlet (late Maillard)** | **The energy lever. This is typically the primary variable in V1 experiments. Peak occurs 45-60 seconds before expected FC so the curve can decline into crack.** |
| **04:00** | Into FC (post-peak decline) | RoR momentum into crack. Typically 4-6°C below peak. Steeper decline here compresses dev time; gentler decline extends it. |
| **05:00** | Development phase | Continued decline through dev. Usually 8-12°C below peak. Drop typically fires before this point if managing by temp. |
| **06:00** | Safety floor / overrun buffer | Terminal value if the roast overruns target drop time. Usually 12-16°C below peak. Drop should always fire before this. |

**Design rules for V1 experiments:**

- Hold all seven timestamps constant across A/B/C. Only inlet temperature values change.
- When varying peak inlet, scale the full curve proportionally: the entire shape shifts up or down while preserving relative ratios between stages.
- Later experiment sets (V2, V3) may deliberately shift timestamps to test Maillard length or post-peak decline steepness as isolated variables. When that happens, note the deviation explicitly in the Experiment record.
- Reference for V1 batches A/B/C: 200 → [low/mid/high] → [low/mid/high] → peak → peak-4 → peak-14 → peak-20°C. The low/mid/high row is the only row that changes across batches.

---

# Key Counterflow Observations (Machine-Specific)

## Turning Point (TP)

TP probe reads consistently low (78-81°C) across all sessions regardless of charge temp, BBP fan speed, or charge timing. Peer's machine reads ~94°C under similar conditions. TP is almost certainly a measurement artifact or probe placement difference specific to this unit.

> **Do not use TP as a primary diagnostic signal - it is not actionable on this machine.** Use FC temp and FC timing as the primary drum-state proxies instead.

## FC Temperature Targeting

**Target FC at 202-205°C arriving at ~4:00-4:15.**

For CGLE Sudan Rume Hybrid Washed, the confirmed FC window is 200-205°C:

- Below 200°C (#134, FC 197.6°C): uniformly underdeveloped cup - nutty, grassy, flat - regardless of dev time
- 200-205°C: correct development range - aromatic character fully expresses
- Above 206°C: overdevelopment risk begins - dark tea, flat, loss of top-note lift

This FC floor/ceiling concept is coffee-specific and should be re-established for each new lot through experimentation. Do not assume this window transfers directly.

## Charge Temperature

Charge at 117°C. This is the resolved charge temp for this machine based on extensive empirical testing.

- Charging at 112-113°C: slow Maillard, late FC, potential stalling
- Charging at 117°C with 125°C hopper pre-load: FC timing and phase balance on target
- Charging at 119°C+: risk of over-energized drum, compressed dev time, early overdevelopment

The logged "charge drum temp" in Roest Connect will read 113-116°C due to probe measurement lag after beans begin absorbing heat. This is normal. Your actual charge moment is when the probe reads 117°C.

## Total Roast Time

**Target total roast time: 4:30-5:00.**

- Under 4:30: risk of insufficient internal development in counterflow mode regardless of surface Agtron reading
- Over 5:00: risk of Maillard stall, roasty/baked notes, loss of top-note expressiveness

## Session Position Effect

Roast position within a session meaningfully affects FC timing. First roast in a session consistently runs 10-15 seconds slower through Maillard than second or third roast due to accumulated residual drum heat.

**Practical implication:** The first roast of a session is the hardest to replicate precisely. Default behavior: do not compensate - rely on the standard thermal reset protocol (dry roast to 140°C → BBP to 120°C → charge at 117°C) and use drop temp as the primary control across all three batches. The thermal reset protocol standardizes starting drum temp batch-to-batch, so the residual session-position effect is small enough to absorb into the experiment rather than correct for. Fallback: if session-position effects are later shown to materially confound a replication session, loading the first batch at ~128°C (vs. standard 125°C) is the compensation lever - but this introduces a second variable and should not be used during V1 directional probes.

## Drop Temp as the Primary Drop Signal

> **Drop on temp, not on clock.** End conditions in the Roest profile are useful as a safety net and upper limit, but drop temp is the more reliable and consistent decision gate. If bean temp reaches the target before the dev time fires, drop early. If the end condition fires before the target temp, override and wait.

## WB-to-Ground Agtron Delta as Development Signal

The delta between whole bean (WB) Agtron and ground Agtron is one of the most sensitive internal development signals available.

| Delta | Reading | Action |
|---|---|---|
| ≤3 points (either direction) | Even development - surface and core developing at similar rates | Target zone - no profile change needed |
| +4-6 points (ground lighter) | Surface developing ahead of core | Profile needs more early energy to penetrate the bean |
| Above +7 points | Significant surface-to-core imbalance | Surface character dominates; core fruit/sweetness suppressed |
| Near zero or slightly negative | Core developing evenly with or slightly ahead of surface | Confirmed target zone |

On CGLE Sudan Rume Hybrid Washed, the winning pourover batch (#119, delta 1.0) had the tightest delta in the entire experiment run. On CGLE Sudan Rume Natural V1, deltas of 7-11 points confirmed the fruit layer was insulating the core.

---

# Fan Strategy (Counterflow - Shaped Curves Required)

Flat fan is a blunt instrument in counterflow mode. Fan speed controls convective heat transfer alongside inlet temp. A shaped fan curve gives a second axis of control and meaningfully affects how the Maillard and development phases behave.

> **All profiles should use a shaped fan curve, not flat fan.**

## General Fan Framework

- **Drying phase** (charge through yellow): 78-82% - supports moisture removal without over-driving bean temp
- **Maillard phase** (yellow through FC): step down to 63-70% - slows convective heat transfer, extends the phase
- **Development phase** (FC through drop): gentle step back up to 70-75% - maintains momentum through crack without spiking RoR

## Fan Curves by Coffee Type

- Washed / higher density / higher moisture: Maillard floor 65-70%
- Natural / lower density / lower moisture: Maillard floor 63-67%
- Heavy fermentation / XO process: Maillard floor 63-65%

## Current Reference Fan Curves

| Profile | Fan Curve |
|---|---|
| **Sudan Rume Washed (CF-Light - confirmed)** | 80% at 0:00 → 70% at 1:45 → 65% at 2:30 → 72% at 4:15 → 75% at 5:30 |
| **Sudan Rume Natural (working hypothesis, V2 not confirmed)** | 80% at 0:00 → 68% at 1:45 → 63% at 2:30 → 70% at 4:15 → 73% at 5:30 |
| **Mandela XO (confirmed - Batch 139 reference roast)** | 80% at 0:00 → 68% at 1:45 → 63% at 2:30 → 70% at 4:15 → 73% at 5:30 |

Fan curve changes count as a changed variable and should be isolated in experiment design.

---

# Naturals - Roasting Framework

Use the washed profile as the starting point. Lower inlet temp for the early stages (gentler start). Taper heat away earlier. At 100g batch size, exothermic runaway is not a meaningful risk. Primary failure mode for naturals is **overdevelopment** (collapses fruit/ferment complexity), not underdevelopment.

**Key learning from Sudan Rume Natural V1:** This specific natural (791 g/L density, 10.3% moisture) required more early energy than a typical natural because the dried fruit layer provided significant thermal insulation not captured by the green specs. 242°C peak inlet was insufficient. 247°C brought FC timing into range. Do not assume "natural = less heat" applies universally - always start from the washed profile and let FC timing tell you whether to add or reduce energy.

> **Drop temp discipline is the most critical natural-specific constraint.** For naturals, drop on temp with a strict ceiling - do not wait for dev time. Overdevelopment suppresses fruit/ferment character and produces dark tea, flat cups with no attack.

---

# How This Project Is Structured

## Per-Coffee Threads

One thread per green lot, active while that coffee is in rotation. Each thread contains the full experiment history, current best batch, open questions, and the working hypothesis for the next session. When a coffee is finished, the thread is closed and key findings are archived.

## Archive Spreadsheet

The canonical record of all roasts. Contains five sheets with the following canonical formats:

**Green Beans sheet columns:**
Green Lot ID (unique key) / Picture / Coffee Name / Producer / Origin (Country) / Region / Variety / Process / Seller / Importer / Source Type / Link / Purchase Date / Price per kg / Moisture % / Density (g/L) / Total Purchased (g)

**Roasts sheet columns:**
Roast Date / Roest Batch # / Coffee Name / Roest Graph (link) / Green Coffee Weight (g) / Roasted Weight (g) / Weight Loss (%) / Agtron Color / Color Description / Yellow Time / First Crack Time / First Crack Bean Temp (°C) / Drop Time / Drop Bean Temp (°C) / Dev Time (s) / Dev % / What Worked / What Didn't / What I'd Change Next Time / Worth Repeating? / Reference Roast?

**Experiments sheet columns:**
Experiment ID / Coffee Name / Roest Batch #s / Context / Primary Question / Control Baseline (If Applicable) / Shared Constants / Variable Changed / Levels Tested / Expected Outcomes / Failure Boundary Definition / Observed Outcome A / Observed Outcome B / Observed Outcome C / Observed Outcome D (Optional) / Winner / Best Expression / Key Insight / What This Changes Going Forward

**Cuppings sheet columns:**
Roest Batch # / Coffee Name / Cupping Date / Rest Days at Tasting / Evaluation Method / Brew Method / Ground Agtron Color / Ground Color Description / Aroma / Flavor / Acidity / Sweetness / Body / Finish / Overall Impression / Temperature Behavior (direction / when / what changes) / Spoon-to-cup gap notes / Comparative statements / Aromatic descriptors / Body/texture notes at temperature

**Overall Lessons sheet columns (filled at lot close-out only):**
Coffee Name / Producer & Region / Cultivar / Process / Best Roast Batch # / Why This Roast Won / Aromatic Behavior / Structural Behavior / Elasticity / Roast Window Width / Primary Lever That Mattered / Secondary Levers / What Didn't Move the Needle (and why) / Underdevelopment Failure Signal / Overdevelopment Failure Signal / Cultivar-Specific Takeaway / General Roasting Takeaway / Reference Roasts to Keep in Mind / Starting Hypothesis for Similar Coffees / Rest Behavior / Evaluation Timing

---

# What Good Looks Like For Each Coffee

A coffee is considered **resolved** when all five conditions are met:

- A reference roast is confirmed through Day 7 pourover evaluation AND an optimized brew session that demonstrates the roast's full expression
- The dev range floor and ceiling are defined (not just a best batch, but the boundaries on either side of it)
- The primary lever that mattered most is identified
- Key failure signals (underdevelopment and overdevelopment) are documented for that specific coffee
- A generalizable takeaway is captured in the Overall Lessons sheet

Until all five are true, the coffee is still in active exploration.

---

# What I Am Not Trying To Do

- Produce approachable or forgiving roasts
- Optimize for one brew method only
- Find one perfect cup - the goal is roasts that contain many possible cups
- Rush to a "good enough" result - the process of learning each coffee is the point
- Chase loudness or aggression for its own sake - the target is the best expression of each specific coffee

---

# New Coffee Onboarding Protocol

This section defines the repeatable intake flow for introducing a new green lot, designed to support running multiple experiments in parallel across different coffees. The goal is to compress the time from "I just bought a new green" to "V1 profiles loaded on the machine" while keeping Claude's reasoning well-informed.

## Step 1 - Intake: What to Provide Claude

When onboarding a new coffee, paste the following into a new message:

- Full green bean spec row in the format used by the Roest inventory (Green Lot ID, Coffee Name, Variety, Producer, Region, Origin, Seller/Importer, Process, Moisture %, Density g/L, Purchase Date, and any additional fields like Altitude, Source Type, Price per kg when available). Field set mirrors the Roest new-inventory form rather than a fixed canonical list - do not block onboarding on missing optional fields.
- Producer's published tasting notes verbatim - **REQUIRED**. These are the comparison target for the Day 7 pourover gate and feed into the evaluation session's primary question: does the cup match what the producer described? Do not proceed with V1 design without these notes; if unavailable from the producer, use the seller's cupping notes (e.g. Sweet Maria's full cupping notes).
- Process description if available (fermentation length, drying method, time in drying, any anaerobic, thermal shock, or co-ferment details)
- Whether a reference roast of this same variety/process exists (peer, favorite roaster, competition lot) - if so, what it tasted like
- Learning intent: is this a "find out what this coffee wants" V1 or a "optimize toward a specific expression" V1?

## Step 2 - Claude Asks These Three Questions

Before drafting V1, Claude should ask exactly these three questions. These define the scope of V1 and eliminate ambiguity downstream:

- **Experiment structure** - always three batches (v1a/v1b/v1c). Default variable is peak inlet temperature. Skip this question when the user's learning intent is a directional probe (e.g. "broad sense of what direction this coffee wants to go") - peak inlet variation is assumed in that case and asking is redundant. Ask this question only when intent is ambiguous, when the anchor coffee is well-resolved enough that fan curve or Maillard length could legitimately be the primary variable, or when the user signals a specific hypothesis worth isolating.
- **Anchor profile** - which existing profile to start from. Default: closest process match from a resolved or active counterflow lot. See Anchor Profile Selection Logic below.
- **FC ambiguity risk** - how to handle silent-crack risk. Naturals, heavy-ferment processes, and some high-grown washed coffees often produce subtle or silent cracks. Decision: plan for manual mark at 208°C if silent, manage primarily by drop temp.

## Step 3 - Anchor Profile Selection Logic

Select the anchor profile in priority order:

- Exact process + variety match from a resolved lot → use reference roast profile directly
- Same process, different variety from a resolved lot → use that lot's reference profile, expect process-driven behavior to transfer but variety character to differ
- Same process from an active (unresolved) lot → use that lot's current working hypothesis as anchor, noting it is not yet confirmed. If multiple active-but-unresolved lots share process characteristics, see tie-breaker logic below.
- Related process (e.g. natural coffee, anchor on closest resolved natural) → adjust starting energy per Green Spec → Starting Hypothesis table in Cross-Coffee Insight Layer
- No close match → anchor on CF-Light (Sudan Rume Washed confirmed) as baseline counterflow profile and scale energy based on density and moisture

**Tie-breaker when multiple active-but-unresolved lots share process characteristics:** Prefer the lot with the most recent empirical data (closest to current machine behavior and current protocol - e.g. a lot whose V2 used the current BBP and 125°C hopper pre-load is a stronger anchor than a lot whose V1 predates those changes). When confidence in the anchor is Low or Medium, the correct response is to widen the v1a/v1b/v1c peak inlet spread rather than to narrow around the anchor. An unresolved anchor with a wide spread is more likely to produce a usable data point than a resolved-looking anchor with a narrow spread that misses the coffee entirely.

**Cross-coffee transfer caveat:** Per the Cross-Coffee Insight Layer guidance, patterns should be treated as hypotheses until confirmed across three or more lots. When anchoring V1 on a related (but not identical) coffee, design V1 to *test* the transfer rather than assume it. The A/B/C spread should be wide enough that if the anchor is wrong, one of the three batches still lands in a usable zone.

## Step 4 - V1 Design Output

Claude produces the following for every new lot V1 design:

- Shared constants table (BBP, charge temp, standard 125°C hopper load for all three batches - no session-position compensation by default, fan curve, drop target, dev time safety net, FC marking protocol, preheat)
- Three inlet profiles (v1a/v1b/v1c), using the Standard Inlet Curve Template timestamps with only the seven inlet values differing across batches. Profile names in the Roest UI follow the format "[Lot short name] v1a", "[Lot short name] v1b", "[Lot short name] v1c" (e.g. "Higuito Anaerobic v1a") so experiment set identity is visible in the machine itself.
- Expected outcome table (FC time/temp, drop temp, dev time, Agtron WB, WB-to-ground delta prediction per batch)
- Failure boundary definitions (specific temperature and time breakpoints that invalidate a batch as a data point)
- Batch ordering recommendation (anchor/midpoint batch first for most consistent session position; outer batches second and third). No session-position compensation applied - thermal reset protocol handles starting drum temp equalization.
- Full pre-filled Experiments sheet record (all columns populated except Observed Outcomes and Winner, which come from the session debrief and Day 7 evaluation). Spreadsheet columns retain A/B/C labels (Observed Outcome A, B, C) for archive-import compatibility - the v1a/v1b/v1c naming lives in the Roest profile names and session notes, while the spreadsheet schema remains unchanged.
- Explicit list of what V1 does NOT answer (reserves V2/V3 scope)

## Naming Conventions

Experiment sets are numbered sequentially per lot (V1, V2, V3…) with three batches per set labeled a/b/c:

- First experiment set: v1a, v1b, v1c
- Second experiment set: v2a, v2b, v2c
- Third experiment set: v3a, v3b, v3c
- Subsequent sets follow the same pattern (v4a/b/c, v5a/b/c, etc.)

**Where each label lives:**

- **Roest profile names** - use the lot short name followed by the batch label (e.g. "Higuito Anaerobic v1a"). This keeps experiment set identity visible on the machine itself and prevents mixing profiles across batches during a session.
- **Session notes and conversation context** - use v1a/v1b/v1c labels throughout session debriefs, Claude conversations, and experiment hypotheses. This matches the Roest profile names and keeps reasoning unambiguous.
- **Spreadsheet columns** - retain A/B/C labels (Observed Outcome A, Observed Outcome B, Observed Outcome C). These column names are import-compatible with the archive app and must not change. The v1a/v1b/v1c labels appear in the Roest Batch #s and Context cells, not as column renames. Translation is implicit: v1a → A, v1b → B, v1c → C.

Claude uses v1a/v1b/v1c in all conversational output (V1 design, session debrief responses, next-experiment hypotheses). When writing to the Experiments sheet, Claude maps v1a → Observed Outcome A, v1b → B, v1c → C without requiring explicit instruction.

## Parallel Experiment Considerations

When running experiments across multiple lots in parallel:

- Session rule: do not mix lots within a single session. Each session targets exactly one lot and one experiment set (A/B/C). This keeps session-position effects and thermal drift isolated to a single coffee.
- Evaluation cadence: Day 7 pourover evaluations can be stacked across lots within a single sitting (up to 3 batches per session, 4 possible but not preferred). Across lots, the xbloom recipe stays identical - only the dose and grind setting need resetting.
- Context handoff: when bootstrapping a new Claude session focused on a specific active lot, paste the lot's Green Beans row, the most recent Experiments record for that lot, and a one-line status ("V2 complete, V3 not yet executed, working hypothesis: [X]"). This is sufficient context for V-next design without re-reading the full master doc.
- Bake-off planning: when two different lots approach reference-roast declaration near the same time, schedule a direct comparison brew session rather than relying on cross-session memory. Day 4 cupping staleness applies equally across lots.

---

# Current State

## Active Lots

**CGLE-SRUME-NATURAL-2026 - Sudan Rume Natural**

- Status: Active - V1, V2, V3 complete. V4 not yet executed.
- V3 batches 152/153/154(discarded)/155. Current best expression: Batch 152 - confirmed at Day 7 pourover cupping and real pourover (April Glass, 92°C, EG-1 6.3, 15g/255g). Sweet, tart, blueberry, lemongrass, ginger, cardamom spice, brown tea - blended and integrated. Sichuan peppercorn quality present as pleasant texture. Sweetness leads hot, lemongrass/ginger emerges cool.
- Confirmed brew recipe: April Brewer Glass + April Paper, 15g/255g, EG-1 6.3, 92°C, bloom 45g/55s, pour to 155g at 0:55 centered, pour to 255g at 1:45 centered.
- Paradoxical roast finding: Batch 152 (no audible FC, Maillard 66.9%, total time 6:00) produced the preferred cup. The hard post-peak cliff accidentally created a slow-bake effect - extended time at lower temperature through Maillard - that integrated flavor compounds better than any higher-energy profile. Sichuan peppercorn drying finish correlates positively with energy input and is suppressed by lower heat.
- FC is ambiguous/inaudible on this coffee (confirmed across V1-V3). Bean temp end condition is the correct drop management approach, consistent with Mandela XO protocol.
- V4 hypothesis: replicate Batch 152's thermal history intentionally. Low peak (238-242°C), hard post-peak cliff, bean temp end condition at 204-205°C, accept total roast time 5:30-6:00. Vary peak inlet across three batches (238/240/242°C) holding cliff shape constant. Agtron WB target 74-80. Drop ceiling framework retired - replaced by bean temp end condition.

**CGLE-GESHA-CLOUDS-2026 - Gesha Clouds (Forest Coffee, Milton Monroy, Tolima)**

- Status: Active - V1 complete, V2 hypothesis drafted but not yet executed; brewing iteration on V1 winner paused mid-stream
- V1 batches 161/162/163 - peak inlet variation (242 / 247 / 252°C). #161 within drop ceiling but Maillard 53.0%; #162 ceiling-tight at 208.0°C, dev 18s, Maillard 51.7%, Agtron WB 88.7; #163 BREACHED ceiling at 209.9°C (held deliberately to extend dev), Agtron WB 91.3.
- WB-to-Ground deltas: #161 +4.4, #162 +2.5 (best), #163 +10.5 (worst). Aggressive inlet failed to penetrate core despite extended dev.
- **V1 winner: #162** - confirmed via Day 7 pourover gate, NOT cupping table. Cupping-table preference for #163 was reversed by the pourover (#163 fell apart at pushed extraction; #162 cup was structurally cleanest with low volume as the only deficit).
- Producer flavor target: tangerine, rose, kiwi, raspberry, lemongrass. Pushed pourover on #162 surfaced apricot, grapefruit, bergamot tea on cooling - closest the lot has come to producer notes.
- V1 brewing diagnosis: Full Expression / Extraction Push (NOT Suppression). The cup is under-expressed, not over-expressive - heavy black-tea body is a brewing problem, not a fermentation-restraint problem.
- V2 hypothesis (paused pending decision on whether brewing iteration alone resolves the lot): hold v1b inlet structure (peak 247°C); soften post-peak decline by raising 04:00 inlet from 240 -> ~244°C to extend dev to 35-45s without compressing Maillard further. Variable: post-peak decline steepness, not Maillard length and not peak inlet.
- Open question: does pushed pourover iteration on #162 (5.9 grind, 93°C, 1:15, evaluate cool 50-45°C) close the lot at V1, or do the structural deficits at the brewing ceiling require V2?

**COS-HIG-BOR-2026 - Costa Rica Anaerobic Dry Process Higuito**

- Status: Active - V1 complete, V2 not yet executed
- V1 batches 157/158/159 - silent crack confirmed across all three (heavy anaerobic Green Spec table prediction matched). All drops 207-208°C, total times 4:15-5:07. Session-position effect small under thermal reset protocol (TP band 79.5-81.3°C - confirms V2 onboarding protocol's no-compensation default)
- Winner: v1c (#159, 251°C peak, drop 208°C, total 4:15) - decisive across both xbloom evaluation gate AND real pourover Balanced Intensity session. WB-to-ground delta 1.3 (target zone). "Best by far. Right volume of flavor, right notes - the one."
- Confirmed flavor target: honey mead, Port wine, tobacco, sweet-tart integration, peatiness/whiskey-textural finish (peatiness is a NEW descriptor for this coffee - not in producer notes but reads as integrated smoke+sweetness when development is even)
- Critical V1 finding: higher peak inlet produced EVENER core development on this coffee, not over-development as predicted. Heavy anaerobic + fruit-layer thermal insulation requires more energy to drive core in step with surface. v1a's "darkest WB Agtron" (82) was actually the MOST surface-over-developed batch - surface running ahead of core, smoke and fruit don't integrate at brew. WB-to-ground delta is more diagnostic than WB Agtron alone for this coffee type.
- Drop ceiling for this coffee is at least 208°C, not the Sudan Rume Washed-derived 207°C - v1c at 208°C produced the most integrated cup, not overdevelopment. V2 should formalize 208°C as the ceiling.
- xbloom evaluation gate produced FALSE-POSITIVE underdevelopment signal on v1b (lactic note in aroma) that the real pourover at Balanced Intensity (Orea Glass + Sibarist FAST Flat, 1:16, 92°C, EG-1 6.5) cleanly resolved. The Brew-Reveals-Roast Principle applies in the inverse direction on anaerobic naturals - evaluation recipe can flag false defects.
- V2 hypothesis: anchor on v1c (251°C peak) and probe headroom upward - test 253°C and 255°C peak with drop ceiling held at 208°C. Push total roast time toward 4:30-5:00 by extending post-peak decline. Continue fan curve 80->68->63->70->73%. Target tighter delta (<=2 points) at higher peak.

## Recently Closed Lots

**CGLE-MANDELA-XO-2026 - Mandela Variety, XO Extended Fermentation - CLOSED**

- Reference roast: Batch #139 (confirmed)
- Best brew: April Brewer Glass + April Brewer Paper, EG-1 6.4, 15g/255g, 93°C, bloom 50g/40s, pour to 160g then 255g, target 2:45-3:15
- Roast parameters: v3b inlet (195°C→232°C→240°C→241°C→236°C→228°C), fan (80%→68%→63%→70%→73%), charge 117°C, hopper load 125°C, end condition bean temp ~203-204°C, Maillard 44.5%, Agtron WB 76 / ground 72.4
- Key process learning: FC is inaudible on XO-fermented coffees - use bean temp end condition, not dev time. Fan curve shape is the primary roast lever for fermentation character distribution.
- Overall Lessons entry complete. See archive for full record.

**CGLE-SRUME-WASHED-2026 - Sudan Rume Hybrid Washed - CLOSED**

- Reference roast: Batch #133 (confirmed), Batch #148 (closest replication)
- Best brew: UFO Ceramic + Sibarist Fast Cone, EG-1 6.0, 15g/210g, 91°C, Melodrip, bloom 45g/45s, pour to 130g then 210g, target 2:45-3:15
- Roast parameters: CF-Light inlet (200→237→245→245→240→230→222°C), fan (80→70→65→72→75%), charge 117°C, hopper load ~120°C (old standard - see Hopper Pre-Load replication caveat), drop at 206-207°C, dev time 0:45 end condition
- Overall Lessons entry complete. See archive for full record.

**GUA-SOC-JAVA-2024 - CLOSED.** Reference roast: Batch 88. Best brew: UFO Ceramic + Sibarist UFO Fast Cone, EG-1 6.5, 15g/255g, 94°C, Melodrip.

**GUA-LIB-ADC-2024 - CLOSED.** Reference roast: Batch 94. Brew recipe developed.

**GV-OMA-25-035 (Gesha Village Oma) - CLOSED.** Reference roast: Batch 52 (pre-counterflow). Counterflow chapter unresolved - green exhausted. Treat 40s as confirmed floor for future washed Gesha in counterflow - start at 48s minimum.

---

# Reference Roast Target (Peer's Batch #249 - "IT simple slow 100g")

The primary external reference for style and structure throughout Sudan Rume Washed experiments.

| Parameter | Value |
|---|---|
| FC | 3:55 / 200.3°C |
| Drop | 205°C |
| Dev | 36s / 13.3% DTR |
| TP | 94.3°C |
| Charge | 112.2°C |
| Maillard | 39.1% |
| Drying | 47.6% |

**Machine differences confirmed:** Peer's TP is 94.3°C vs. this machine's 78-81°C. Peer's charge temp is 112.2°C vs. this machine's resolved 117°C. These differences are machine-specific and do not represent different roast philosophies - directional principles transfer, specific numbers do not.

---

# Peer Insights - Counterflow L200 Ultra (Same Machine, Same Mode)

Source: A peer who roasts exclusively on the Roest L200 Ultra in counterflow mode. High weight on directional principles; specific numbers don't transfer due to confirmed machine-level thermal differences (his TP ~94°C vs. my ~78-81°C, his charge 112.2°C vs. my resolved 117°C).

## Core Insight - RoR Shape Over Dev Time as the Primary Lever

Don't treat dev time as the independent variable. Instead, vary the RoR curve leading into FC (how much momentum you carry through Maillard and into crack) while holding drop temp fixed. Dev time becomes the measured output of that shape decision, not the thing you're directly setting.

**Important nuance from Sudan Rume Washed resolution:** This principle governs early-stage experimentation when profile architecture is still being resolved. Once profile shape is established, dev time can be legitimately tested as the primary variable to find the ceiling and floor within a confirmed shape.

## The Maillard + Dev Flavor Axis

Shorter Maillard + higher momentum at crack + shorter dev → more acidity and clarity. Longer Maillard + slower momentum at crack + longer dev → more sweetness and body. These are not independent dials - they move together as a function of how energy is applied through the curve.

## Naturals Starting Framework

Use the washed profile as the starting point. Lower inlet for early stages - gentler start. Taper heat away earlier. Primary failure mode for naturals is overdevelopment, not underdevelopment.

**Caveat from Sudan Rume Natural experience:** Sudan Rume Natural required nearly as much energy as the washed version due to the fruit layer insulating the core. Always start from the washed profile and let FC timing tell you whether to add or reduce energy.

---

# Key Learnings - Sudan Rume Hybrid Washed (Generalized)

These learnings emerged from 6 experiment sets across 20+ batches and are likely to apply broadly to high-density washed Colombians with unusual aromatic profiles.

**1. FC floor and ceiling are real and coffee-specific.** The usable roast window was approximately 4°C wide at FC temp and 2°C wide at drop temp. Assume other coffees have similar windows - find them empirically.

**2. The Day 7 pourover evaluation gate is mandatory for delicate aromatic coffees.** Day 4 cupping was actively misleading across multiple sessions.

**3. Aromatics may be present in the roast but hidden at standard brew parameters.** When a roast passes the evaluation gate but feels muted, try a pushed brew before concluding the roast needs more development.

**4. WB-to-ground Agtron delta is a better development predictor than DTR alone.** Evenness of development, not total development time, was the decisive factor.

**5. Session position affects roast outcomes even with identical protocol.** First roast in a session runs ~10-15 seconds slower through Maillard than subsequent roasts.

**6. The lemongrass/herbal descriptor is varietal, not a defect signal.** Sudan Rume's characteristic aromatic compounds read as funky when underdeveloped and as lemongrass/bergamot/jasmine when developed correctly. Naming the descriptor correctly transformed the evaluation.

**7. Stone fruit tartness (malic acid) is a varietal characteristic, not an extraction artifact.** At the correct roast and brew, Sudan Rume Washed expresses a simultaneous sweet-and-tart quality consistent with candied dried apricot - this is malic acid, the primary acid in stone fruits. It sits underneath the sweetness rather than dominating, softens and integrates as the cup cools fully, and reads as complexity rather than sharpness. Do not attempt to brew it away - it is part of the correct expression. If it reads sharp or disconnected rather than integrated, the likely cause is brew temperature too high or extraction too aggressive, not a roast problem.

---

# Key Learnings - Mandela XO (Generalized)

These learnings emerged from 4 experiment sets across 13 batches and are likely to apply broadly to XO-fermented, heavily anaerobic, and co-fermented coffees where fermentation intensity is very high.

**1. For heavily fermented coffees, the roast job is distribution of fermentation character, not amplification.** The XO fermentation places high-concentration aromatic compounds at very high intensity in the green bean. Short Maillard / high momentum into FC concentrates those compounds in the attack and produces an aggressive, pungent, front-loaded cup. Extended Maillard / lower momentum distributes the fermentation character through the body and finish. Fan curve shape was the most powerful lever for controlling this.

**2. Shaped fan curve is mandatory for XO-fermented coffees under the new charge protocol.** Flat 90% fan combined with the 125°C hopper pre-load produced darker development (Agtron 67-71 vs. target 74-76) and more aggressive cups, moving away from the target rather than toward it. This was the single most impactful variable change in the entire experiment series.

**3. FC is acoustically absent on XO-fermented coffees - never use dev time as the end condition.** Across all four experiment sets (13 batches), FC was inaudible or ambiguous on the majority of roasts. Dev time end condition fired at machine-estimated FC timestamps that were not reliable, producing Maillard overrun (51-58% vs. target 44%) in the final experiment set. Bean temp end condition at the confirmed drop target is the only reliable drop signal on these coffees.

**4. Brew strategy for XO-fermented coffees is Balanced Intensity, not Full Expression.** The fermentation already provides all the intensity the cup needs. Full Expression brewing (UFO fast cone, fine grind, high temp) amplifies the attack and produces a sharp, aggressive cup. Balanced Intensity (April Brewer, coarser grind, moderate temp) rounds the fermentation character into the body without muting it.

**5. Lemongrass is a CGLE terroir/varietal descriptor, not a defect signal.** It appeared consistently across Mandela XO from V3 onward and is shared with Sudan Rume Natural from the same farm. When integrated correctly, it reads as a complex herbal-floral note alongside pineapple and caramel. When the roast is underdeveloped or over-extracted, it reads as pungent and dominating. The correct goal is integration, not elimination.

---

# Green Bean Storage Protocol

Store roasted beans in 4oz kraft foil bags with resealable zipper and one-way degassing valve (100g batch fits comfortably). Leave zipper open for 24 hours post-roast to allow initial CO2 burst to escape. Seal zipper and rest until Day 7 evaluation.

Do not use plastic sandwich bags - they are permeable to oxygen and cannot protect aromatics across a 7-day rest window.

Measure ground Agtron (15g) at the Day 7 evaluation session before brewing - grind into the bag, measure, then proceed with pour.

---

# FC Marking Protocol

**Manual marking at first audible crack above 202°C** is the standard. This gives the earliest reliable signal and is more consistent than waiting for the Roest auto-mark (which fires after a second crack, lagging actual onset by 5-15 seconds).

**Exceptions:**

- **False positive below 202°C:** A single crack below 202°C is almost certainly a defect bean - do not mark. Wait for confirmation above 202°C.
- **Silent crack coffees (e.g. Mandela XO, heavily fermented, XO process):** FC on these coffees is acoustically absent or too diffuse to reliably anchor a dev time end condition. **Do not use dev time as the end condition on silent-crack coffees - use bean temp end condition instead.** Set Roest end condition to bean temp at the confirmed drop target (203-205°C for Mandela XO). A dev time end condition anchored to an inaudible or machine-estimated FC timestamp will produce unpredictable Maillard overrun - confirmed across V4 of Mandela XO where Maillard reached 51-58% instead of the target 44%. Use RoR flattening around 200-203°C as the primary FC proxy alongside bean temp. If no audible crack by 208°C and bean temp end condition is not set, mark manually at 208°C to preserve drop headroom - but this is a fallback, not the primary protocol.
- **High-volume crack:** If the Roest auto-marks due to a dense, vigorous crack event, accept the auto-mark.

Record FC method in the Roast log (manual / auto / manual-no-audio) for any session where exception cases apply.

---

# Session Debrief Template

> **How to use this section:** After each roast session, paste this template into a new Claude message and fill in your answers. Claude will use your responses to update the experiment records, flag anything unexpected, and write the forward-looking hypothesis for the next session. Complete within 24 hours of roasting while the details are fresh.

## Prompt Claude With This After Each Session

Copy and paste the block below at the start of a new message, fill in your answers, and attach any Roest Connect screenshots.

```
SESSION DEBRIEF - [Coffee Name] [Experiment Set e.g. V3]

Date:
Batches roasted (Roest batch numbers):
Profile used:
Variable tested this session:

ROAST OUTCOMES (fill in from Roest Connect):
Batch A - FC time/temp, drop time/temp, dev time/%, Maillard %, Agtron WB, weight loss:
Batch B - FC time/temp, drop time/temp, dev time/%, Maillard %, Agtron WB, weight loss:
Batch C - FC time/temp, drop time/temp, dev time/%, Maillard %, Agtron WB, weight loss:

QUALITATIVE NOTES:
1. What surprised you during the session?
2. Did anything behave differently than expected vs. the hypothesis?
3. Which batch felt like it ran best during the roast (before tasting)?
4. Any FC marking exceptions this session (false positive, silent crack, auto-mark)?
5. Hopper load timing used (standard 125°C or different)?
6. Session position - was this a first roast of day or mid-session?

OPEN QUESTIONS:
What are you most uncertain about heading into the Day 7 pourover?

ANYTHING ELSE:
```

## What Claude Will Do With Your Debrief

- Update the Roasts sheet data for all batches in this session
- Update the Experiments sheet Observed Outcomes fields with roast-level data
- Flag any roasts that breach failure boundaries (Maillard too high, Agtron out of range, FC outside target window)
- Note any unplanned variables that may confound the experiment (session position, hopper timing anomalies, FC marking exceptions)
- Carry forward hypotheses and questions to inform the Day 7 pourover evaluation

## After Day 7 Pourover - What to Tell Claude

After brewing, provide a voice or text transcript of your tasting notes. Claude will extract and format these into Cuppings sheet format and update the experiment record with Observed Outcomes. Include:

- Ground Agtron readings for each batch (measured before brewing)
- Aroma and flavor notes for each batch, hot and as it cools
- Full cup sip notes (not just spoon)
- Temperature behavior - does it open up, close down, or stay neutral as it cools?
- Comparative statements - which is preferred and why
- Whether any batch felt under-extracted (likely a brew recipe issue, not a roast issue - try a pushed brew before concluding the roast is at fault)

## After Optimized Brew Session - What to Tell Claude

Once a winner is identified from Day 7 evaluation, run an optimized brew session and report:

- Brew recipe used (brewer, dose, water, grind, temp, pour structure)
- Tasting notes at hot, warm, and fully cool stages
- Whether the cup improves as it cools (elasticity signal)
- Whether it matches the producer's published tasting notes

Claude will then write the final brew recipe for the lot record and assess whether the lot is resolved.

---

# Cross-Coffee Insight Layer

*This section is updated at lot close-out. It captures patterns that emerge across multiple coffees, not within a single lot. These insights reduce the number of experiments needed on future lots by providing informed starting hypotheses.*

> Current data set: 2 fully resolved counterflow lots (CGLE Sudan Rume Hybrid Washed, closed April 2026; CGLE Mandela XO, closed April 2026), 1 active unresolved lot (CGLE Sudan Rume Natural), 2 pre-counterflow closed lots. Patterns below should be treated as hypotheses until confirmed across 3+ lots.

## FC Floor & Ceiling by Processing Method

Every coffee appears to have a minimum FC temp below which the cup is underdeveloped regardless of dev time, and a maximum drop temp above which overdevelopment suppresses aromatics. These windows are coffee-specific and must be found empirically, but processing method appears to set the rough range.

| Process Type | FC Floor (est.) | Drop Ceiling (est.) | Evidence Base | Confidence |
|---|---|---|---|---|
| High-density washed Colombian (Sudan Rume) | ~200°C | ~208°C | CGLE-SRUME-WASHED-2026 (20+ batches) | High - confirmed empirically |
| Natural (Sudan Rume) | ~202°C (est.) | ~207°C | CGLE-SRUME-NATURAL-2026 V1 (3 batches) | Low - V1 only, drop ceiling breached in all batches |
| XO-fermented Colombian | ~200°C (est.) | ~205-206°C | CGLE-MANDELA-XO-2026 (13 batches, 4 experiment sets) | Medium - lot closed. FC floor estimated from RoR flattening; drop ceiling confirmed - above 208°C produces overdevelopment signal. Best results at 203-205°C drop temp with inaudible FC. |
| Washed Gesha (counterflow) | ~200°C (est.) | Unknown | GV-OMA-25-035 (3 counterflow batches) | Very low - green exhausted before resolution |

**Key pattern emerging:** Drop temp ceiling appears to sit around 205-208°C across all coffees tested in counterflow, varying by process. XO-fermented coffees appear to have a lower optimal drop temp (203-205°C) than washed high-density lots (206-207°C) - the fermentation has already done significant development work on the bean structure. FC floor on XO-fermented is difficult to establish empirically because FC is acoustically absent - manage by RoR behavior and bean temp rather than crack sound.

## WB-to-Ground Agtron Delta Norms by Processing Method

The WB-to-ground delta is the most sensitive internal development signal identified so far. Target ranges appear to vary meaningfully by processing method due to differences in how the bean's outer layers develop relative to the core.

| Process Type | Target Delta | V1 Typical Delta | Resolution Delta | Notes |
|---|---|---|---|---|
| Washed (high density) | ≤3 points | 3-5 points (V1/V2) | 1.0 points (#119) | Tight delta strongly correlated with best cup quality |
| Natural (fruit layer) | ≤5 points (est.) | 7-11 points (V1) | Not yet resolved | Fruit layer provides thermal insulation; large deltas expected early |
| XO-fermented | ≤4 points (est.) | Not systematically measured in V1 | 3.6 points (#139, WB 76 / ground 72.4) | Fermentation layer behaves similarly to natural in early experiment sets - large deltas expected when profile is not yet dialed. Tight delta at resolution consistent with other lot types. |

**Key pattern:** First experiment sets on any coffee will likely show large deltas as the profile is dialed in. Shrinking delta over successive experiment sets is a reliable signal that profile development is on the right track.

**Working hypothesis added (Low confidence, 1 lot - CGLE-GESHA-CLOUDS-2026):** Heavy anaerobic Gesha may follow a similar pattern to other heavy-ferment lots - V1 typical deltas wide (4.4 / 2.5 / 10.5 across three batches), with the tightest delta (+2.5) tracking the cup that won at the Day 7 pourover. Surface Agtron values run unusually high on this coffee (84-91 WB) - significantly higher than the Sudan Rume Washed resolution range (70-78). This may be a coffee-specific surface-development signature where surface Agtron alone is unreliable but the WB-to-Ground delta still tracks internal development quality reliably. Treat as hypothesis pending 2+ more lots before promoting to a confirmed pattern.

**Anaerobic Dry Process (heavy fermentation, 2-3 day sealed) - hypothesis from V1 only:** Target delta <=2 points (Medium confidence). V1 deltas: 4.2 / 3.7 / 1.3 (single lot, COS-HIG-BOR-2026). v1c at delta 1.3 was the only batch in target zone and was the decisive winner. Higher peak inlet produced TIGHTER delta, opposite of intuition - heavy anaerobic fermentation + fruit-layer thermal insulation requires more energy to drive core development in step with surface. Confidence will firm as V2 results land.

## Session Position Effect - Machine-Specific Data

Confirmed across multiple lots and sessions: first roast of a session consistently runs slower and produces later, hotter FC than subsequent roasts on identical protocol. This effect is consistent enough to predict:

| Session Position | FC Timing vs. Target | Recommended Correction | Notes |
|---|---|---|---|
| First roast of session | Late by ~10-15s, ~1-2°C hotter | None - rely on thermal reset protocol (dry roast to 140°C). Fallback: 128°C hopper load if replication-critical. | Most variable roast in any session - consider warm-up function |
| Second roast | Close to target, slight improvement | Standard protocol (125°C hopper load) | Reliable, consistent |
| Third roast | On target or very slightly faster | Standard protocol | Most consistent - closest to established targets |

**Practical implication for experiment design:** When designing replication sessions, the third roast of the session is the most structurally consistent. When designing experiments with three A/B/C batches, batch C will naturally run slightly faster and hotter than batch A on identical protocol - factor this into interpretation of results.

## Green Spec → Starting Hypothesis

Translates density, moisture, processing method, and variety into directional cues for V1 design. Use this as a starting hypothesis only - every new coffee should still test energy direction through a three-batch V1 before committing to a profile.

| Signal | Starting Hypothesis | Confidence & Evidence |
|---|---|---|
| **Density ≥ 800 g/L (high density)** | More energy-tolerant. Anchor peak inlet on CF-Light or equivalent confirmed profile. Expect FC floor near 200°C. | High - confirmed on Sudan Rume Washed (810 g/L) and Sudan Rume Natural (805 g/L) |
| **Density ≤ 760 g/L (low density)** | Taper energy earlier. Reduce peak inlet by 3-5°C vs. CF-Light. Compress Maillard slightly. Watch for overdevelopment. | Low - no directly resolved low-density counterflow lot yet. Treat as starting hypothesis only. |
| **Moisture ≥ 11% (high moisture)** | Longer drying phase needed. Hold 01:15 and 02:30 inlet higher to complete drying before Maillard. Expect later FC if energy is normal. | Medium - counterflow has not yet seen a high-moisture lot. Principle carries from conventional roasting logic. |
| **Moisture ≤ 10% (low moisture)** | Shorter drying phase. FC arrives faster. Watch for compressed dev time. Drop ceiling more important than usual. | Medium - confirmed on Sudan Rume Natural (10.3%); carries to Gesha Clouds (10.4%) as active hypothesis |
| **Natural with visible fruit layer** | May need more energy than density/moisture predict (fruit layer thermal insulation) to get FC timing right - but this is a timing fix only, not a flavor fix. Sudan Rume Natural V1-V3 (10 batches): 247°C peak was needed to get FC timing into range, but higher energy amplified an unwanted drying/astringent compound. The preferred cup came from the lowest-energy batch (Batch 152, no audible FC, Maillard 66.9%, extended total time). For this variety: once FC timing is approximately workable, dial energy back rather than forward. Do NOT assume "natural = less heat" for FC timing, but DO assume "natural = less heat" for flavor quality on Sudan Rume-type naturals. | Medium-High - confirmed on Sudan Rume Natural V1-V3 (10 batches). The energy-vs-flavor tension is now well-established for this specific variety/process combination. |
| **Heavy anaerobic / extended fermentation (>36hr)** | Expect subtle or silent FC. **Use bean temp end condition in Roest, not dev time** - a dev time end condition anchored to an inaudible FC will produce unpredictable Maillard overrun (confirmed: Mandela XO V4 reached 51-58% Maillard when dev time fired at machine-estimated FC). Set end condition to bean temp at the expected drop target (~203-205°C for XO-type coffees). Manage drop primarily by bean temp and RoR flattening. Fan floor slightly lower (63-65% in Maillard). | Medium-High - confirmed on Mandela XO (silent crack across all 4 experiment sets), active hypothesis for Gesha Clouds (84hr anaerobic) |
| **Variety = Gesha (any process, counterflow)** | Dev time floor of 48s minimum. Use shaped fan curve from start. Be skeptical of any batch with dev time under 40s regardless of Agtron. | Medium - GV Oma Washed 40s confirmed as floor (3 underdeveloped batches), active hypothesis for Gesha Clouds |
| **Producer notes include "lemongrass," "jasmine," "bergamot" (delicate aromatic signals)** | Evaluation recipe will likely under-extract. Plan pushed brew for optimized session (91-92°C, 1:14 ratio). At Day 7, evaluate at cool stage, not hot. Do not conclude roast failed if muted at 94°C/1:17. | High - confirmed on Sudan Rume Washed via optimized brew session |

**How to use this table:** Read every row whose Signal applies to the new coffee. Combine the Starting Hypotheses into V1 design. Signals can stack (e.g. high density + natural + heavy anaerobic) and their guidance compounds. When confidence is Low or Medium, widen the A/B/C spread on peak inlet to improve the chance that one of the three batches lands in a usable zone even if the anchor hypothesis is wrong.

## Varietal Aromatic Fingerprints

Sudan Rume as a variety produces unusually delicate, high-compound aromatics that are shared across washed and natural processing. The flavor vocabulary took many sessions to establish correctly - this table is intended to short-circuit that process for future lots.

| Variety / Lot | Expected Character (well-developed) | Underdevelopment Reads As | Overdevelopment Reads As | Source |
|---|---|---|---|---|
| Sudan Rume Hybrid Washed | Jasmine, bergamot, candied apricot, lemon, floral, faint mint, stone fruit tartness (malic acid) sitting underneath sweetness | Nutty, grassy, flat, lactic/fermented (misread as defect) | Dark black tea, flat, body-heavy, loss of florals | CGLE-SRUME-WASHED-2026 (confirmed) |
| Sudan Rume Natural | Lemongrass, ginger, brown tea, blueberry, tart sweetness, cardamom/spice at cool stage. Sweetness leads hot; lemongrass/ginger emerge as cools. Sichuan peppercorn texture at finish when well-integrated (pleasant). Descriptor set confirmed via Special Guests (London) direct comparison and 3 experiment sessions (10 batches). Target expression: blended and cohesive at April Glass 92°C, not aggressive or pungent. | Flat, thin, missing lemongrass attack; grassy/hay aroma (confirmed batch 142 at 17s dev) | Dark tea (tannin-heavy), deep brown tea with drying finish; Sichuan peppercorn becomes aggressive/distracting rather than textural; lemongrass muted; spice-dominant. Correlates with higher energy input (confirmed: higher peak = more drying compound). Optimal expression requires lower-energy roast, not higher. | CGLE-SRUME-NATURAL-2026 (V1-V3 confirmed, 10 batches, 3 experiment sessions) |
| Mandela XO | Caramelized/charred pineapple, lemongrass, barbecue caramel, milk tea body, tropical fruit, light liqueur warmth at finish. Lemongrass is varietal/terroir character from CGLE (shared with Sudan Rume Natural from same farm) - it reads as pungent/funky when underdeveloped and as an integrated complexity marker when dialed correctly. Do not try to eliminate it. | Under-integrated fermentation, alcoholic attack dominant, cup thins after attack, pungent and one-dimensional, no caramel or sweetness perceptible | Spice-dominant (cinnamon, cardamom), muted fruit, body-heavy with hollow finish, slight roast character on finish | CGLE-MANDELA-XO-2026 (confirmed - 4 experiment sets, 13 batches, lot closed) |
| Java (Guatemala El Socorro) | Clean, structured, balanced | Thin, cereal | Roasty, baked | GUA-SOC-JAVA-2024 (closed) |

**Key pattern:** The "fermented/funky" descriptor that appeared throughout early Sudan Rume Washed sessions was the variety's characteristic lemongrass and ginger compounds misread as a defect due to underdevelopment. Once the correct descriptor vocabulary was established (via direct comparison with a notable roaster's version), the path to resolution accelerated dramatically. For any new lot where you consistently taste something unexpected, cross-reference with the producer's tasting notes and seek a reference roast before assuming it is a roast artifact.

## Rest Behavior Patterns

Universal finding: Day 7 pourover is the correct evaluation gate for all lot types so far. Day 4 cupping has been consistently unreliable or actively misleading.

| Lot Type | Optimal Evaluation Window | Day 4 Reliability | Notes |
|---|---|---|---|
| Washed, high-density Colombian | Day 7 pourover | Unreliable - misleading in both directions | Confirmed across 20+ batches of Sudan Rume Washed. Day 6 confirmed as directionally reliable for winner selection (V6 evaluation, #148 correctly identified) - Day 7 remains standard but Day 6 is sufficient if needed. |
| Natural | Day 7 pourover | Not tested (skipped per protocol) | No evidence to differentiate - keep Day 7 universal |
| XO-fermented | Day 7 pourover | Not tested (skipped per protocol) | Confirmed: Day 7 is correct gate. Day 0 cuppings were directionally useful but reversed the winner in V1 (Day 0 preferred Batch 102; Day 7/10 preferred Batch 103). Day 6 evaluations were close but slightly early - coffee continues integrating between Day 6 and Day 8. Real brew session required before reference roast declaration - xbloom evaluation recipe consistently under-expressed caramel and body character that April Brewer brew revealed. |

**Brew recipe gap:** There is consistently a significant delta between the Day 7 xbloom evaluation recipe and the optimized brew recipe. The evaluation recipe is calibrated for comparison consistency, not expression maximization. Always run an optimized brew session before declaring a lot resolved - the evaluation recipe will typically under-extract delicate washed coffees with unusual aromatic profiles. Lower temperature (91°C vs. 94°C) and higher concentration (1:14 vs. 1:17) were the primary levers on Sudan Rume Washed.

**Working hypothesis added (Low confidence, 1 lot - CGLE-GESHA-CLOUDS-2026):** On heavy anaerobic Gesha, the cupping table actively reversed the Day 7 pourover verdict. The cupping table preferred #163 (which fell apart under pushed extraction); the pourover identified #162 as the structurally cleanest cup. This is the strongest data point yet for the V4 principle that Day 7 pourover is the only evaluation gate. For this process type specifically, the cupping table protocol may amplify body and suppress structural defects in ways that mislead about brewing behavior. Treat as hypothesis pending 1-2 more heavy-anaerobic-Gesha lots before promoting to a confirmed pattern.

**xbloom evaluation gate can produce false-positive underdevelopment signals on anaerobic naturals (Low confidence - single lot, working hypothesis):** COS-HIG-BOR-2026 V1 Batch #158 (v1b) showed a lactic note in xbloom aroma that triggered an underdevelopment diagnosis. Real pourover at Balanced Intensity (Orea Glass + Sibarist FAST Flat, 1:16, 92°C, EG-1 6.5) cleanly resolved the lactic note - it was an extraction artifact at the xbloom recipe (1:17.5/94°C), not a roast defect. This is the Brew-Reveals-Roast Principle applying in the inverse direction: evaluation gate flagging false defects on coffees that need different extraction strategy. Operational implication: for heavy-anaerobic / co-ferment / anaerobic-natural lots, the optimized brew session should be elevated from "after winner identified" to "always run on top 2 candidates before declaring underdevelopment." Watch for repeat pattern on Mandela XO, Sudan Rume Natural future experiments, and other heavy-ferment lots before promoting from hypothesis.

---

# Roast-to-Brew Translation

*This section translates roast parameter patterns into expected brew behavior and starting recipe adjustments. It bridges the gap between the roasting reference guide and the brewing reference guide. Updated as new lots are resolved.*

> Core principle: The brew recipe does not fix a bad roast, but it can hide a good one. A roast that passes the Day 7 evaluation gate but feels muted is often an extraction problem, not a roast problem. Always try a pushed brew before concluding more development is needed.

## Reading Roast Parameters to Predict Brew Behavior

Several roast parameters directly predict how a coffee will behave at brew time, independent of cup flavor notes. These patterns have been confirmed across Sudan Rume Washed and should be applied as starting hypotheses for new lots.

| Roast Signal | Brew Prediction | Starting Adjustment |
|---|---|---|
| WB-to-ground delta ≤2 points | Even internal development - coffee will likely respond well to extraction pressure. Flavor hidden at standard params may emerge at finer grind or lower temp. | Try 1-2 clicks finer than evaluation grind; lower temp by 2-3°C |
| WB-to-ground delta +4 to +6 points | Surface developed faster than core - may taste bright/harsh with thin mid-palate | Lower temp to soften surface extraction; consider longer bloom |
| Agtron WB 74-78, delta tight | Light internal development, evenness confirmed - this is the target zone for delicate washed expression | Start with pushed recipe (see below). Standard recipe likely under-extracts. |
| Agtron WB above 79 | Very light - likely underdeveloped unless delta is tight. Nutty/grassy at standard params. | Increase extraction aggressively - finer grind, higher temp, higher concentration |
| Agtron WB below 70 | Risk of overdevelopment - tea-like, flat. Standard recipe may be appropriate. | Back off extraction. Coarser grind, lower temp, lower concentration. |
| Maillard above 47% | Bloated Maillard - roasty/baked character likely, reduced top-note lift | Standard or backed-off extraction. Do not push. |
| Maillard 40-44% | Balanced phase structure - full aromatic expression available | Pushed recipe appropriate. Lower temp, higher concentration. |
| FC temp 202-205°C, drop 206-207°C | Confirmed target zone for Sudan Rume-type coffees - full expression should be achievable at brew | Pushed recipe. See reference recipe below. |

## Reference Brew Recipes by Lot

These are confirmed optimized brew recipes established through the full roast-to-cup process. Use as direct starting points when brewing these reference roasts.

### CGLE Sudan Rume Hybrid Washed - Reference Roast #133

| Field | Value |
|---|---|
| Brewer | UFO Ceramic + Sibarist Fast Cone |
| Dose | 15g |
| Water | 210g (1:14 ratio) |
| Water temp | 91°C |
| Grind | EG-1 at 6.0 |
| Agitation | Melodrip throughout |
| Bloom | 45g, 45 seconds |
| First pour | To 130g total, slow through Melodrip |
| Second pour | To 210g total, slow through Melodrip |
| Target brew time | 2:45-3:15 |
| Best evaluation stage | Warm to cool (50-45°C) - opens significantly as it cools. Do not evaluate at high temp. |
| Key signal | Candied apricot, bergamot, jasmine, lemon, and integrated stone fruit tartness (malic acid) should appear at cool stage - sweet and tart simultaneously, like a candied dried apricot. The tartness sits underneath sweetness and softens as it cools. If muted at 91°C, do not increase temp - try 1 click finer on grind. If tartness feels sharp or disconnected rather than integrated, lower temp slightly or extend bloom. |

### CGLE Mandela XO - Reference Roast #139

| Field | Value |
|---|---|
| Brewer | April Brewer Glass + April Brewer Paper |
| Dose | 15g |
| Water | 255g (1:17 ratio) |
| Water temp | 93°C |
| Grind | EG-1 at 6.4 |
| Agitation | Spiral bloom, center pours for main pours |
| Bloom | 50g, 10s pour, wait 40s |
| First pour | 0:50 → pour to 160g, 15s, wait 25s |
| Second pour | 1:30 → pour to 255g, 15s |
| Target brew time | 2:45-3:15 |
| Best evaluation stage | Warm to cool (50-45°C) - cup rounds out and integrates as it cools. Do not evaluate at high temp - acidity reads sharp at hot stage. |
| Key signal | Caramelized/charred pineapple, barbecue caramel, lemongrass tea, creamy milk tea body, light liqueur warmth at finish. Flavors should distribute through the full body rather than concentrating in the attack. If cup reads pungent and front-loaded, drop brew temp to 91°C before adjusting grind - lower temp is the primary correction lever for this coffee. |
| Critical note | Do not use UFO + fast cone as the primary brewer for this coffee - it amplifies the fermentation attack and produces a sharp, over-expressed result. April Brewer's flat bottom geometry and rounded flow is essential to the target expression. |

## Pushed vs. Standard Recipe Decision Logic

For delicate washed coffees with high aromatic compound concentration (Sudan Rume, Gesha, Ethiopian landraces), the standard xbloom evaluation recipe is calibrated for consistency, not expression. The following decision logic determines when to push:

| Observation at Standard Recipe | Diagnosis | Action |
|---|---|---|
| Muted, quiet, tea-like throughout | Under-extraction - delicate compounds not being released | Lower temp by 2-3°C AND increase concentration to 1:14. Try finer grind last. |
| Pleasant but thin, loses character as it cools | Extraction correct, but missing body compounds | Finer grind (1-2 clicks). Lower ratio to 1:14.5. |
| Bright, sharp attack but hollow finish | Surface extracting ahead of core | Lower temp. Longer bloom. Do not go finer. |
| Good character at hot stage, closes at cool | Correct extraction range - just needs more concentration | Lower ratio to 1:14 only. |
| Dark tea, flat throughout | Overdevelopment in the roast - brew recipe cannot fix this | Do not push. Standard or backed-off recipe. Flag roast as overdeveloped. |
| Nutty, grassy, flat | Underdevelopment in the roast - confirmed by Agtron above 79 | Do not push at brew - cannot compensate for roast underdevelopment. Flag for next roast session. |

## Processing Method Starting Hypotheses for Brew

These starting points are derived from the brewing reference guide's extraction strategy framework, adjusted for what has been confirmed on these specific counterflow roasts.

| Process Type | Evaluation Recipe Strategy | Optimized Recipe Direction | Temperature | Ratio |
|---|---|---|---|---|
| Washed, high-density Colombian | Standard xbloom - but expect muting. Evaluate at cool stage. | Lower temp, higher concentration, Melodrip | 91-92°C | 1:14-1:15 |
| Natural (CGLE Sudan Rume) | Standard xbloom - expect more expressiveness than washed version | Similar to washed but possibly slightly higher temp to handle body | 92-93°C | 1:14.5-1:15.5 |
| XO-fermented (Mandela) | Standard xbloom - fermentation character will emerge but may be front-loaded and pungent. Do not adjust based on xbloom alone - run real brew before concluding. | **Balanced Intensity, not Full Expression.** The fermentation provides all the intensity the cup needs. Use April Brewer or equivalent flat-bottom brewer, coarser grind, moderate temp. Do not use UFO/fast cone as the primary evaluation brewer - it amplifies the fermentation attack. | 93°C | 1:17 |
| Washed Gesha (counterflow) | Standard xbloom - but start evaluation at warm stage, not hot | Very low agitation, lower temp, Melodrip critical | 90-91°C | 1:15-1:16 |

## The Brew-Reveals-Roast Principle

One of the most important learnings from Sudan Rume Washed: **what appears in the optimized brew cup is what was already in the roast, waiting to be unlocked.** The evaluation recipe will often miss it.

Concretely: Batch #133 at the standard xbloom recipe tasted muted, tea-like, and under-extracted. At 91°C / 1:14 / EG-1 6.0, the same batch produced candied apricot, bergamot, jasmine, and lemon that matched the producer's own tasting notes exactly.

The implication for the development loop:

- If the evaluation recipe gives a muted or thin result but the WB-to-ground delta is tight and roast structure looks correct, the roast is likely fine - run an optimized brew before concluding that more development is needed
- If the optimized brew also gives a muted or thin result, the roast genuinely needs more development
- If the optimized brew gives a sharp, harsh, or disconnected result, the roast may be overdeveloped - back off extraction before concluding the roast failed

**Build the optimized brew session into every lot close-out.** Do not declare a reference roast without confirming it produces the target cup through the optimized brew, not just the evaluation recipe.

---

# Washed Gesha - Counterflow Signal (Incomplete)

Three counterflow batches (95, 97, 99) all returned underdeveloped at Day 10 pourover despite dev times of 24-40s. Even Batch 99 at 40s/16.1% DTR was monotone, nutty, and missing Gesha character.

> **Treat 40s as a confirmed floor, not a target.** For future washed Gesha lots in counterflow, start at 48s minimum. These batches also used flat fan - shaped fan curves should be used from the start on future Gesha lots.
