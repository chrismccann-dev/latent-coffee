# KICKOFF — brewing-equipment-expert cluster over-cap (pruning case 005, CONDITIONAL)

**RUN THIS SECOND, AND ONLY IF STILL NEEDED.** The cluster is over its cap *because* `filters.md` is bloated (70.4 of 157.8 KB). Run `filters-md-prune-kickoff-2026-06-03.md` FIRST, then `npm run check:doc-sizes`. **If the cluster is back under 150 KB, this kickoff is moot — close it, no session needed.** Only proceed below if the cluster is *still* over after the filters.md prune.

**THIS IS AN INTERPRETIVE SESSION** (Chris's steer load-bearing) — and unlike a normal prune, the cluster-cap question is as much a **Pattern F decomposition** decision ([ADR-0014](../adr/0014-pattern-f-threshold-tiers.md)) as a Pattern J prune. Default to "ask, don't ship"; decomposition is an architectural call, not a mechanical edit.

## Why this exists

`docs/skills/brewing-equipment-expert/` is **157.8 KB / 150 KB** (Equipment-Reference cluster cap, [doc-tripwires.md](../architecture/doc-tripwires.md)) — surfaced by the first `npm run check:doc-sizes` run (2026-06-03), which caught drift the 2026-05-23 ADR-0014 hand-audit had logged as "144 / 150, approaching." Composition:

| Doc | Size |
|---|---|
| cluster/filters.md | 70.4 KB ← **the lever (case 004)** |
| cluster/operational-reference.md | 40.7 KB |
| cluster/brewers.md | 19.2 KB |
| cluster/sworks.md | 8.1 KB |
| SKILL.md | 7.6 KB |
| cluster/grinder-eg1.md | 6.5 KB |
| resources/*-registry.md | ~5 KB total |

## Decision tree (only if still over after case 004)

This is the genuine fork — present it to Chris, don't pre-pick:

1. **Prune `operational-reference.md` (40.7 KB)** — the next-largest doc, a Pattern J prune. Likely consolidate (operational reference accretes). Lower-risk; keeps the cluster intact. Try this before decomposing.
2. **Decompose the cluster (Pattern F)** — ADR-0013 names this exact candidate: "Brewing Equipment Expert might eventually split into Drippers / Filters / Grinders / Valves sub-skills." This is a real architectural change: a new sub-skill = SKILL.md + cluster + Master Coordinator catalog/dispatch/handoff updates + the six-actor chain. Bigger; only if the registry genuinely spans independent equipment domains that a brewing session loads separately. Note the binding constraint (ADR-0014): the cap exists because claude.ai loads the cluster into a live session — decomposition helps only if sessions can load *one* equipment sub-domain instead of all four.

**Recommendation to surface:** try (1) first (prune operational-reference), reserve (2) for when the cluster is structurally too big to prune under cap. Decomposition re-introduces sub-skill management overhead the architecture deliberately bounded — don't reach for it until pruning genuinely can't keep the cluster under 150.

## Output (if a session runs)

- Cluster under 150 KB (via operational-reference prune, or a scoped decomposition).
- **Case-005 handoff** at `docs/sprints/pruning-cases/005-brewing-equipment-expert.md` — if it's a decomposition, note that explicitly (it's a Pattern F case, the first one filed through the pruning-case format, which is itself a useful data point).
- `npm run check:doc-sizes -- --write`; update the Live queue.
- If decomposed: full six-actor audit (new sub-skill touches Actor 4 catalog + Actor 3 claude.ai dispatch).

## Six-actor (decomposition path only)

A new sub-skill is a substrate change: Master Coordinator catalog.md + dispatch-rules.md + handoff-rules.md (Actor 4), claude.ai catalog refresh (Actor 3), CLAUDE.md sub-skill count (Actor 5), ADR (the decomposition decision). The prune path (option 1) is Actor-5-only.

BRANCH: own branch off latest main (only if a session runs).
