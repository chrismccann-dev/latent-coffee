# KICKOFF — cross-coffee-insights.md 007b (drain the Pending Relocation block)

**THIS IS AN INTERPRETIVE SESSION** (Chris's steer load-bearing). Default to "ask, don't ship." This is the follow-on to **pruning case 007a** ([handoff](pruning-cases/007-cross-coffee-insights.md)) — a **cross-cluster re-home**, not a content prune. Read the 007a handoff + [the refactor architecture](../skills/brewing-historian/cluster/patterns/cross-coffee-insights.md) first.

## What 007a left for you

007a re-architected `cross-coffee-insights.md` into a cross-anchor-only layer and graduated the 7 N≥3 by-cultivar capsules. It parked three blocks of single-axis detail in a `## Pending Relocation (007b)` holding section at the **bottom of the CCIL**, full fidelity, because their homes are in *other* clusters / capsules whose migration is cross-cluster work. **Your job: cut each block to its destination, then delete the Pending Relocation section.** This drops the CCIL further below cap and completes the architecture.

The three blocks:

1. **By Process (default-strategy table, 10 process classes + the El Paraíso thermal shock entry)** → the `by-coffee-family/<family>.md` capsules. Map each table row to its family capsule (Anaerobic Natural, Anaerobic Washed, Anoxic, Heavy Co-ferment, Experimental/thermal-shock/yeast-inoculated, Washed, Honey, Standard/Controlled Natural). The El Paraíso thermal shock block → `by-coffee-family/thermal-shock-washed.md` (gesha.md already has a router pointing there). Some families may not have a capsule yet (Washed, Honey, Standard Natural, Controlled Natural) — decide with Chris whether to create them (uniform n≥3 rule — check counts) or keep a thin cross-anchor note in the CCIL.
2. **Office Brewing Notes (Palo Alto) — SWORKS valve calibration + restriction-timing principles + Kalita/xBloom drawdown + tap-water rules** → the **Brewing Equipment Expert cluster**. Likely homes: `cluster/sworks.md` (8.4 KB — valve calibration + the three restriction-timing principles + valve-transition-timing co-lever) and `cluster/operational-reference.md` (42 KB, near its 60 KB cap — be careful; route the bulk to sworks.md). **Dedupe required:** the anaerobic-natural capsule already restates the "Dial 6 office template," and sworks.md likely overlaps the calibration table — reconcile, don't blind-append. This is a **second cluster**, so update *its* SKILL.md manifest + any `lib/mcp/docs.ts` description that enumerates contents, and re-run `check:doc-sizes` (equipment cluster has a 60 KB single-doc cap).
3. **Per-coffee cooling notes (14 entries)** → respective capsules: honey-process → (honey family, may need creation); Sydra cold-ferment → `by-cultivar/sidra.md`; anoxic Rosado → Rosado candidate (stays in CCIL until n≥3); thermal-shock Letty/Lychee → thermal-shock-washed.md; yeast-inoculated → yeast-inoculated family capsules; heavy co-ferment → co-ferment family; Picolot/DAK/Newbery roaster signatures → `docs/brewing/roasters.md`; Rwandan Red Bourbon → (Red Bourbon cultivar, n? — likely stays in CCIL); medium-dark Pacamara → pacamara.md router already exists. The cross-diagnostic (3 cooling modes + prefers-hot=overshoot) already graduated to Active Pattern #5 — do not move it.

## Possible graduation (check at session start)

If a **non-Untold medium/dark-roast specialty natural** confirmation has landed since 007a (tracked in Open Questions), stand up `by-roast-level/medium-developed.md`: create the folder, move Active Pattern #1's detailed evidence there, register the file in `lib/mcp/docs.ts` (DOC_FILES + description + listDocs), add it to the brewing-historian SKILL.md manifest, leave a router in the CCIL. If no non-Untold confirmation yet, leave roast-level as Active Pattern #1.

## Safety constraints (same as 007a)

- **Move-never-delete / full fidelity.** Cut to destination at full fidelity; concept-set diff every block against the Pending Relocation source before deleting it. The only legitimate deletions are genuinely stale content — flag to Chris separately, don't fold a content-delete into the re-home.
- **Capsules-first ordering.** Write the destination before removing from Pending Relocation.
- **Uniform n≥3 graduation.** A family/cultivar gets its own capsule only at n≥3; sub-threshold stays in the CCIL. Don't author empty stubs.

## Six-actor

Actor 5 (brewing-historian cluster docs + by-coffee-family capsules) + **Actor 4/5 second cluster** (Brewing Equipment Expert: SKILL.md + sworks.md / operational-reference.md + its MCP descriptions) · Actor 4 (any new capsule/axis file → `lib/mcp/docs.ts` DOC_FILES + description + listDocs; `check:mcp-bundle`) · Actor 2 (no brewing prompt references a moved anchor) · Actor 6 none. **Premise correction carried from 007a:** these cluster docs ARE individually MCP-registered — new files need docs.ts entries.

## Output

- Pending Relocation block fully drained + deleted; CCIL smaller still. By-coffee-family capsules + equipment cluster carry the re-homed detail. Case-007b handoff appended to / alongside [007-cross-coffee-insights.md](pruning-cases/007-cross-coffee-insights.md).
- Return the handoff to the Cluster B doc-pruning thread.

BRANCH: own branch off latest main.
