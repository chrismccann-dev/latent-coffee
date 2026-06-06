# Washed — per-process roasting patterns

*Coffee Research · Latent · Roasting Historian cluster · by-process*

**Corpus (closed lots):** N=6 — Sudan Rume Hybrid Washed (CGLE), Gesha Village Oma, Gesha Village Surma, Guatemala El Socorro Java, Guatemala Libertad Bourbon/Caturra, Rancho Tio Emilio Typica Mejorado (one-shot). Hybrid Washed counts as a washed variant; pre-counterflow legacy lots included for the broader pattern signal.

**Current rollups in [cross-coffee-insights.md](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md):**

- [§ FC Floor & Ceiling by Processing Method](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#fc-floor--ceiling-by-processing-method) — High-density washed Colombian (Sudan Rume): FC floor ~200°C, drop ceiling ~208°C (High confidence, 20+ batches)
- [§ WB-to-Ground Agtron Delta Norms by Processing Method](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#wb-to-ground-agtron-delta-norms-by-processing-method) — Washed (high density): target ≤3 points; V1 typical 3-5; resolution 1.0 (#119)
- [§ Green Spec → Starting Hypothesis](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#green-spec--starting-hypothesis) — Density ≥800 g/L row (High confidence, confirmed on Sudan Rume Washed 809 g/L; Sudan Rume Natural at 791 g/L is below the threshold and natural-processed, so not corroborating evidence); producer-notes-include-"lemongrass"/"jasmine"/"bergamot" row (High confidence, confirmed on Sudan Rume Washed via optimized brew session)
- [§ Rest Behavior Patterns](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#rest-behavior-patterns) — Washed, high-density Colombian: Day 7 pourover correct gate (Confirmed across 20+ batches); Day 6 directionally reliable as fallback

**Per-lot deep dives:**

- [CGLE Sudan Rume Hybrid Washed](docs/skills/roasting-historian/cluster/learnings/cgle-srume-washed-2026.md) — closed, reference roast Batch #133 (#148 closest replication); FC temp + drop temp working together as primary lever
- [Gesha Village Oma](docs/skills/roasting-historian/cluster/learnings/gv-oma-25-035.md) — closed pre-counterflow; 48s dev-time floor on Gesha
- [Gesha Village Surma](docs/skills/roasting-historian/cluster/learnings/gv-surma-25-039.md) — closed pre-counterflow; dev-time-relative-to-FC primary lever
- [Guatemala El Socorro Java](docs/skills/roasting-historian/cluster/learnings/gua-soc-java-2024.md) — closed pre-counterflow; RoR shape through Maillard primary lever
- [Guatemala Libertad Bourbon/Caturra blend](docs/skills/roasting-historian/cluster/learnings/gua-lib-adc-2024.md) — closed pre-counterflow; Maillard energy continuity primary lever (recurring oversteeped-tea defect resolved by smooth inlet shape)
- [Rancho Tio Emilio Typica Mejorado Washed](docs/skills/roasting-historian/cluster/learnings/ecu-td24-ranchotio-tm-washed.md) — closed one-shot calibration; brew-anchor-transferability lesson (variety signal dominates over anchor-roast brew lineage)

**Cross-lot patterns specific to washed process:**

The washed corpus is the most data-rich slice of the roasting archive. The FC floor + drop ceiling window is the tightest of any process tested — a ~4°C usable FC temp window and ~2°C usable drop temp window on Sudan Rume Hybrid Washed. Washed lots are the most demanding for precision but also the least forgiving of operator inattention (recurring oversteeped-tea on Guatemala Libertad was a Maillard-energy-continuity inlet-shape defect that ran across multiple early experiment sets before resolution).

Patterns specific to washed sub-groupings (low-altitude washed, high-moisture washed, washed Gesha vs washed Colombian, Hybrid Washed signature method) that don't fit the cross-coffee rollup will accrue here as the corpus grows.

## Mountain Harvest Mount Elgon Ladies' Lot Washed - closed 2026-06-02 (one-shot, Outcome B)

*First Ugandan / first Mount Elgon coffee in archive. Lot id `UGA-MH-ELGON-LADIES-FW-2026` (`green_bean_id b0fdd336-c1af-459a-bba5-2483ba0294d1`); reference roast Batch 199 (`roast_id 003fbb64-44b8-4494-9234-248815817c0d`); optimized brew `brew_id f5ea7303-eb62-4b7d-9da9-3fe6b34adfe1` (Intensity-Clarity Split Hybrid); `roast_learnings_id 6a732675-9a08-45d1-8f09-c88227f3e25a`. The dedicated per-lot learnings file `cluster/learnings/uga-mh-elgon-ladies-fw-2026.md` is queued for registration in `lib/mcp/docs.ts SKILL_FILES` (Claude-Code-side ops follow-up); until then this entry is the human-readable surface for the lot.*

**Anchor**: Sudan Rume Washed CF-Light #133, FULL anchor energy (peak 245°C, 125°C hopper) - the canonical one-shot pattern from the Rancho Tio Emilio correction (no altitude downward hedge). FC landed dead-on the 202°C target (202.2°C / 4:15, audible, 5 cracks), **validating the full-energy + 125°C-hopper correction on a second one-shot** (N=2, promote toward Medium confidence). Anchor transfer directionally confirmed: cup IS recognizably washed and IS reaching for the producer's brown sugar / orange / chocolate descriptors at the structural level.

**Outcome B failure mode (drop-rule clock cap)**: Cup came in light - dev 30s, weight loss 10.0%, drop 204.2°C / 4:45 manual (1.8°C below 206°C target). NOT an anchor failure: the 4:45 absolute-clock slow-cap fired before bean-temp could reach 206°C, because FC ran 15s late of the 4:00 prediction (first-roast-of-session run-late). On V-sets a corrective batch absorbs this; on one-shots there is no recovery. **Carry-forward for next washed one-shot**: revise drop-rule slow-cap from absolute clock to relative-to-actual-FC + dev floor - e.g. "drop at FC + 40s minimum dev, OR 4:45 clock cap, whichever is LATER." Queued application targets: MH Kajere Washed PK1 Yeast, MH Rwenzori Washed Dry Ferment.

**First negative WB→ground Agtron delta on washed in archive**: WB 66.7 / ground 72.9 / delta **−6.2**. CCIL precedent on washed is positive (#119 closed at +1.0, #139 at +3.6). Negative delta = surface-ahead-of-core underdevelopment signature, mechanistically consistent with truncated dev. Promote toward Medium confidence as more negative-delta data accumulates.

**Warm-peak / cool-degrade temperature behavior - second data point on the Rancho Tio hypothesis (N=2)**: Cup peaked at ~55°C and degraded through cooling rather than improving. Both data points are underdeveloped washed one-shots; pattern may be specific to underdeveloped roasts. Promote toward Medium confidence pending V-set corroboration. **Carry-forward**: on next underdeveloped washed cup, set cooling-curve evaluation target to 50-55°C (not 45-50°C).

**Brew-side recovery via extraction-strategy choice - second archive data point (N=2)**: Intensity-Clarity Split Hybrid brew recovered the producer triplet (orange / brown sugar / milk chocolate) that the xbloom-gate cup had buried. Brew could not manufacture developed-Maillard back-half body - that's the roast ceiling, not brew-fixable. Different strategies from Rancho Tio's Clarity-First recovery, both worked. **Underdeveloped washed one-shots CAN be partially recovered through extraction-strategy choice**; the brew-side compensation has a body-ceiling limit but extends meaningful aromatic recovery.

**Open question** - *almond / nutty register*: Cup expressed a notable almond / nutty register sitting above the producer's brown sugar / orange / chocolate target. Three competing attributions cannot be discriminated at N=1: (a) Nyasaland / SL-14 / SL-28 East African blend-cultivar signature; (b) Mount Elgon terroir signature; (c) roast-state artifact of underdevelopment. Resolved on the next East African washed lot at full development - the queued MH lots (Kajere / Sironko / Rwenzori) are the natural discriminators.
