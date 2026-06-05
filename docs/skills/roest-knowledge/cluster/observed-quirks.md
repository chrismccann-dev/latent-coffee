# Machine-Side Observed Quirks

Operator-stub doc per [Roest Knowledge SKILL.md](docs/skills/roest-knowledge/SKILL.md) — Chris-stubbed-Claude-integrates. Machine-side anomalies, distinct from API-side quirks (which live at [cluster/api/quirks.md](docs/skills/roest-knowledge/cluster/api/quirks.md)).

---

## Promotion criteria

A quirk earns an entry here when:

1. **≥3 roasts** show the same anomaly (cluster spec's observed-quirk threshold)
2. The anomaly is **machine-conditioned** (probe placement, drum behavior, thermal response) not coffee-conditioned (coffee-conditioned belongs in Roasting Historian)
3. The anomaly is **actionable** — Chris can either work around it or compensate for it

---

## Current state

Today: load-bearing machine-side quirks are documented inline in [cluster/machine/counterflow-observations.md](docs/skills/roest-knowledge/cluster/machine/counterflow-observations.md) where they directly drive recipe construction (TP probe artifact, charge-temp probe lag, session position effect). This doc covers quirks that don't drive recipe construction directly but are worth knowing.

No standalone entries today. Pattern A refresh (substrate-event threshold ≥3 roasts) flows content here.

Examples of what might land here:
- "FC audibility threshold drifts seasonally" (would gate by humidity / room temp / similar)
- "Drum probe reading instability after Nth back-to-back batch" (would gate by session length)
- "Manual override button has a Nms input-debounce window" (would change manual-drop timing assumptions)

---

## Cross-links

- [cluster/machine/counterflow-observations.md](docs/skills/roest-knowledge/cluster/machine/counterflow-observations.md) — machine-specific observations that directly drive recipe construction (load-bearing).
- [cluster/api/quirks.md](docs/skills/roest-knowledge/cluster/api/quirks.md) — API-side quirks (cloud-API behavior, not machine-side).
- [cluster/firmware/README.md](docs/skills/roest-knowledge/cluster/firmware/README.md) — per-firmware-version notes when a quirk is version-specific.
