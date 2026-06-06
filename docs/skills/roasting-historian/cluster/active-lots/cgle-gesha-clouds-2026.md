*Coffee Research · Latent · Roasting Historian cluster · active-lots*

**Lot:** CGLE-GESHA-CLOUDS-2026
**Status:** Active - V1 + V2 + V3 complete (V3 SPG cupped 2026-06-04). V4 designed + pushed to Roest 2026-06-05 (3 slots: bean-temp end condition target 211/212/213°C). Lot NOT closeable at V3 - V3 winner (192 / v3c) won SPG but is not finishable as reference roast (core-development gap).
**Cultivar:** Gesha
**Terroir:** Colombia / Tolima
**Producer:** Forest Coffee / Milton Monroy

Migrated from ROASTING.md § Active Lots in Wave 4 PR 4b (2026-05-21). Updated post-V3 SPG + V4 design 2026-06-05.

## V1 (April 19) - peak inlet variation 242 / 247 / 252°C

- **V1 winner: #162** confirmed via Day 7 pourover gate. Cupping table picked #163; pourover reversed it.
- #162 had tightest WB-to-Ground delta (+2.5) despite worst-on-paper roast metrics.
- Brewing diagnosis: Full Expression / Extraction Push (UFO + Sibarist), NOT Suppression. #162 at 5.8 grind / 93°C / 1:15 surfaced producer notes for the first time.

## V2 (May 4) - post-peak decline variation (04:00 inlet 240/244/246°C)

- All three V2 cups read as underdeveloped at Day 7 xbloom_gate.
- **V2 winner at the gate: #172 (v2c)** - the worst roast metrics produced the most accessible cup.
- Post-V2 brewing iteration on #172 at UFO Extraction Push surfaced producer notes (tangerine / rose / raspberry-kiwi tart) for the first time at real pourover - confirmed the AGGRESSIVE direction.

## V2 key findings

- **Gentle-decline hypothesis REFUTED.** Extending post-peak inlet did not translate to cup development.
- **Aggressive direction confirmed** via #172's UFO Extraction Push real-pourover cup.
- **Bean-temp end condition adopted** going forward - V2's dev-time-timer caused ceiling overshoots on silent-FC batches.
- **207°C drop ceiling provisionally retired** for this coffee - v1c + v2c both hit 209.9°C and won.

## V3 (May 23) - peak inlet micro-sweep 252 / 254 / 250°C, bean-temp end condition 209°C

- **xBloom-gate winner: #192 (v3c, 250°C peak)** - preserves complexity on cooling, balanced producer-notes expression.
- xBloom-gate finalists: 191 (v3b, 254°C, +2°C-over-#172 hypothesis) + 192 (v3c).
- **All three were MANUAL drops** - the 209°C end condition fired ~4:10-4:20 when FC came 4:04-4:33, too early for the desired 4:30 drop; operator overrode all three to hold to 4:29-4:50.
- Non-monotonic FC audibility: v3a (252°C peak) audible 4 cracks; v3b (254°C, highest) only subtle 2; v3c (250°C, cooler) subtle 3. Highest peak suppressed audibility.
- v3a (matched-control replica of #172) was the LEAST-favored cup at xBloom gate despite cleanest roast metrics (lowest Maillard, tightest WB-to-Ground delta +3.0). Roast-metrics-vs-cup divergence pattern continues.

## V3 Simulated Pourover Gate (June 4) - Hario Switch Intensity-Clarity Split

Finalists 191 + 192 cupped at the same recipe (V60 02, EG-1 5.6, 93°C off-base declining, 1:15, closed immersion → open drain + late cut). Day 12 cuppings - REST_DAYS_DRIFT (+5 days off Day 7 gate).

- **SPG winner: 192 (v3c)** - holds the xBloom-gate ranking at real pourover. Sweet fruit on top; rose / sweetness / lemongrass readable; no hollow underdevelopment in foreground.
- **191 did NOT survive the jump** from xBloom gate to real pourover. Body-centric, dark-brown-tea, nutty register; roast character poking through despite light structure. "Underexpressed and overexpressed at the same time." xBloom-gate finalist status partly a gate artifact.
- **192 is NOT a finishable reference roast.** Cup reads not-fully-developed at real pourover; extra extraction muddied rather than cleaned - gap is roast-side core development, not brew-side under-extraction. Brewing levers near exhausted (grind at EG-1 D50 floor; temperature brings back the now-cut tail).
- **Drying/puckering tail confirmed as BREW ARTIFACT.** Hario Switch late cut removed it mechanically; the cut-off fraction collected separately tasted as the bitterness source. Do NOT design V4 against the tail.
- Brew carry-forward for eventual reference: Intensity-Clarity Split on Hario Switch with late cut.

## V3 key findings

- **Roast-metrics-vs-cup divergence is now SYSTEMATIC across V1-V2-V3 (Medium-High confidence).** Three V-sets where the batch with worst-looking roast metrics produced the best cup. The Sudan-Rume-Washed roast-metric playbook does not generalize to heavy-anaerobic Gesha.
- **Wide WB-to-Ground delta is non-disqualifying at xBloom gate AND a real signal at SPG.** xBloom-gate wins on this lot all carried wide deltas (+7.6 / +7.3 / +9.1) - non-disqualifying. SPG refined the read: at real pourover, V3C's +9.1 surface-vs-core gap shows up as a quietly under-developed core. Not contradictory - the two gates measure different things.
- **xBloom gate is now demoted on this lot.** It amplifies surface presentation and masks the core gap that real pourover surfaces. V4 cup evaluation should re-run SPG at the same Hario Switch ICS recipe so V4-vs-V3 comparison is on the same gate.
- **209°C bean-temp end condition target was mismatched** to this coffee's FC timing at 250-254°C peaks - FC came 4:04-4:33, threshold fired ~4:10-4:20, too close together. V4 raises target to 211-213°C so auto-drop fires later naturally.

## V4 (designed 2026-06-05) - bean-temp end condition target sweep 211 / 212 / 213°C

**Variable**: bean-temp end condition target. **Control**: held v3c (192) curve EXACTLY across all three slots - same 250°C peak, same post-peak shape (200→234→244→250→244→232→224°C). Only the end-condition target varies.

- **v4a (211°C target, same-day control)** - minimal extension over V3's 209°C. Resolves session-vs-session drift confound. If cup at SPG shows fuller producer-notes volume than v3c, lot may resolve at v4a. (Recipe 70280341; Roest profile 526869)
- **v4b (212°C target, SPG handoff sweet-spot hypothesis)** - TARGET. If cup matches producer-notes-at-volume, this is the candidate reference roast for the lot. (Recipe 9afce53d; Roest profile 526870)
- **v4c (213°C target, upper-bound test)** - tests where "more core development" tips into over-development. Defines the V4 sweep ceiling. Risk: body-creep into V2 dark-tea register. (Recipe 5281eb19; Roest profile 526871)

**Shared constants** (held from v3c): fan curve 80→68→63→70→73%, RPM flat 65, preheat air 210°C, hopper 128°C v4a / 125°C v4b/v4c, charge 117°C. **V4 cup evaluation gate: SPG at Hario Switch Intensity-Clarity Split** (the V3 SPG recipe) for V4-vs-V3 comparison on the same gate.

## Open questions for V4

1. How much additional core development can V4 land at the held 250°C peak without losing the complexity-preservation that gives v3c its identity?
2. Is there a control-batch upper bound where "more development" tips into over-development on this anaerobic natural? V4 sweep brackets.
3. Does the wide-WB-to-Ground-delta-non-disqualifying-at-gate-but-limiting-at-real-pourover pattern generalize across heavy-anaerobic Gesha as a process-family pattern, or is it lot-specific? Needs another anaerobic-natural lot to test (queue for cross-lot review at lot close-out).
4. Does the Hario Switch ICS + late cut hold up across rest days? V4 SPG at Day 7 vs V3 SPG at Day 12 tests this implicitly.

## Cross-references

- [by-process/washed.md](docs/skills/roasting-historian/cluster/patterns/by-process/washed.md) - Gesha washed pattern context (variety + process anchor)
- [cross-coffee-insights.md § Varietal Aromatic Fingerprints](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#varietal-aromatic-fingerprints) - Gesha row
