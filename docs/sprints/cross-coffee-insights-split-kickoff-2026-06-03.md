# KICKOFF — cross-coffee-insights.md split (pruning case 007)

**THIS IS AN INTERPRETIVE SESSION** (Chris's steer load-bearing). Default to "ask, don't ship." **This is a Pattern-F single-doc SPLIT, NOT a content prune** — read the framing below before reaching for delete.

Pruning case 007 ([scope doc](docs/features/doc-pruning-mechanism-brainstorm-2026-06-03.md); [Pattern J, ADR-0013 Amendment](docs/adr/0013-self-improvement-primitives.md) + [ADR-0014](docs/adr/0014-pattern-f-threshold-tiers.md) single-doc cap).

## Why this doc, why now — and why it's NOT a delete

`docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md` is **80.0 KB / 80 KB** — at the Historian single-doc cap ([doc-tripwires.md](docs/architecture/doc-tripwires.md); ADR-0014 logged it as "76/80, approaching" on 2026-05-23, now tripped).

**The Historian is DESIGNED to compound.** ADR-0014 gives it the highest caps (250 cluster / 80 single-doc) precisely because per-coffee / per-strategy / per-variety cross-coffee synthesis accumulating IS the desired growth pattern. So the content here is load-bearing hard-won synthesis — **do not delete insight to hit a byte target.** The single-doc cap is about one *file* being too big to load into a claude.ai brewing session in one read, not about the content being excess. The honest move is **`split`**: reorganize so each loadable unit is under cap; preserve every insight.

## The doc is already axis-organized → split by axis

Current structure (the split lines are already drawn by the headings):

```
## How to Use This Section
## Process / Variety Signal Table
## By Extraction Strategy
## By Modifier (Axis 2)
## By Process
## By Variety            ← large
## Cooling Behavior Observations
## Office Brewing Notes (Palo Alto)
## Open Questions
## End-of-Coffee Workflow
```

Candidate split (operator decides the exact cut): keep `cross-coffee-insights.md` as a **thin index + the cross-cutting bits** (How to Use / Signal Table / Open Questions / End-of-Coffee Workflow), and lift the big per-axis bodies into sibling pattern docs under `cluster/patterns/` — e.g. `by-strategy-and-modifier.md`, `by-process.md`, `by-variety.md` (there is already a `patterns/by-strategy/` subtree — check whether these merge into it rather than creating parallel files). Each resulting doc lands well under 80 KB. The index keeps the agent's reading-order + pointers so nothing is lost at retrieval.

## The load-bearing safety constraints

- **It's a Historian append target.** The Brewing Historian's self-improvement (Pattern A) appends new cross-coffee insights to *this* doc. After the split, there must be an unambiguous home for a new insight of each axis — the index doc should say "new By-Variety insights go in by-variety.md," etc., or the next Historian refresh will re-bloat the index.
- **It's claude.ai-loaded (Actor 3).** The Brewing Historian cluster is pulled in claude.ai brewing sessions. Splitting changes which files exist; update the cluster `SKILL.md` manifest + any intra-cluster cross-refs so the historian still finds every pattern doc.
- **Concept-set diff after the split** (cases 002/003 safety step): every insight + every axis section present in the original must exist in exactly one destination; the index's pointers must all resolve.
- **Move-never-delete.** This is a pure reorganization — verify 0 content lines lost against the pre-split file. If any section is genuinely stale (a superseded observation, a resolved Open Question), flag it for Chris separately; don't fold a content-delete into the split silently.

## Procedure

1. Size-map the sections so the operator can draw the split (which axes go to which sibling doc; what stays in the index).
2. Propose the split + the index shape; confirm whether per-axis docs merge into the existing `patterns/by-strategy/` subtree or stand alone. Present to Chris; wait for steer.
3. Execute the split (write the sibling docs first, then thin the index — move-never-delete order). Update SKILL.md manifest + cross-refs + the "where new insights go" pointers.
4. Concept-set diff vs. the original. Re-measure each resulting doc < 80 KB. `npm run check:doc-sizes -- --write`.

## Output

- `cross-coffee-insights.md` (now a thin index) + the new per-axis sibling docs, each under the 80 KB Historian single-doc cap; cluster total still well under 250.
- **Case-007 handoff** at `docs/sprints/pruning-cases/007-cross-coffee-insights.md` — note this is the **first `split` driven by a single-doc cap on a compounding Historian doc** (distinct from case 004's ownership-axis split and the CONTEXT zone split's load-surface split); record the "preserve the append target" lesson.
- Return the handoff to the Cluster B doc-pruning thread.

## Six-actor

Actor 5 (the cluster docs + SKILL.md manifest — primary) · Actor 3 (claude.ai cluster reload; `list_doc_sections` picks up the new files) · Actor 2 (check no brewing prompt references a moved section by anchor). No schema / no MCP Resource (the historian cluster docs are not individually MCP-registered — verify). Grilling posture: no content removal (this is a move) without Chris's sign-off; flag any stale section separately rather than deleting in the split.

BRANCH: own branch off latest main.
