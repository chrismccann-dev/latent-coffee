# Roest L200 Ultra — Machine Reference

Chris's primary roaster. Single owned instrument in this cluster today; cluster expands when (if) a second Roest unit or firmware variant enters the rotation. Authored from prior ROASTING.md § Equipment + folded sprint learnings.

---

## Hardware + accessory stack

- **Roaster:** Roest L200 Ultra (counterflow mode, 100g batches). Counterflow is the only mode Chris uses; the conventional drum-mode behavior is out of scope for this cluster.
- **Color measurement:** Lightcells CM-200 — whole bean Agtron post-roast, ground Agtron pre-brew at Day 7 evaluation. The WB→Gnd delta is the load-bearing internal-development signal; see [cluster/protocols/evaluation.md](docs/skills/roest-knowledge/cluster/protocols/evaluation.md) § Ground Agtron measurement.
- **Primary evaluation brewer:** xbloom (Brian Quan recipe — consistent, repeatable pourover for all evaluation sessions). xbloom + Brian Quan recipe = the calibration anchor, not the cup-target tool.
- **Optimized brew setup:** Once a reference roast is identified, treat the roasted bean as you would a purchased bean — route through the full [BREWING.md](BREWING.md) framework (Two-Axis strategy selection, Step 1d Coffee Brief, Equipment Reference rotation). Don't hardcode a single brewer/filter combo. The xbloom evaluation recipe is a different tool from the optimized brew recipe.
- **Grinder:** EG-1 (Weber Workshop) — primary grinder for both evaluation and optimized brew. Full setting taxonomy in [docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md).

---

## Machine-side capabilities + controls

Detail authored here as Pattern A signals accumulate (Chris discovers a quirk; logs it; this section grows). Today: load-bearing capabilities are documented inline in the cluster's protocols + observed-quirks docs:

- **End-condition mechanism** — see [cluster/protocols/fan-strategy.md](docs/skills/roest-knowledge/cluster/protocols/fan-strategy.md) § Standard Inlet Curve Template + [cluster/machine/counterflow-observations.md](docs/skills/roest-knowledge/cluster/machine/counterflow-observations.md) § Drop Temp as the Primary Drop Signal. Bean-temp end condition is the default; manual-override button works in practice; 4 documented override cases.
- **FC marking** — see [cluster/protocols/fc-marking.md](docs/skills/roest-knowledge/cluster/protocols/fc-marking.md). Manual vs. auto vs. manual-no-audio; auto-mark lags 5-15s.
- **BBP (Between Batch Protocol)** — fan taper 100% → 60% → 40% → 25% over 1:45; air temp flat at 100°C; end condition drum-temp 120°C; runtime ~2:00-2:30 from the 140°C dry-roast endpoint. ROASTING.md § Standard Workflow holds the canonical wording; this cluster's expanded coverage waits on operator-curated Pattern I content.
- **Hopper pre-load timing** — load beans at ~125°C. Discovery from V5 Sudan Rume Washed experiments; pre-load at 125°C vs. 120°C shifts FC timing by ~35s and FC temp by ~7°C on the same profile. ROASTING.md § Hopper Pre-Load Timing holds the canonical wording; full mechanism explanation deferred to operator-curated Pattern I.

---

## Thermal behavior

Per-machine thermal behavior that drives recipe construction lives in [cluster/machine/counterflow-observations.md](docs/skills/roest-knowledge/cluster/machine/counterflow-observations.md) — TP probe artifact, FC temperature targeting, charge temperature anchor, total roast time band, session position effect, drop temp as primary drop signal, WB→Ground Agtron delta as development signal. All counterflow-physics observations are machine-specific to this unit.

---

## Operator-stub status

This doc is the first machine-side anchor for the cluster. Per [Roest Knowledge SKILL.md](docs/skills/roest-knowledge/SKILL.md), the cluster is Chris-stubbed-Claude-integrates: Chris does the research + initial format proposal + stub authoring when he discovers something worth documenting; Claude Code integrates into cluster shape. Pattern A (observed-quirk-threshold) and Pattern B (firmware-update / API drift) both flow content into this cluster.
