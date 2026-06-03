# KICKOFF — CONTEXT-roasting.md pruning exercise (pruning case 002)

**THIS IS AN INTERPRETIVE PRUNING SESSION.** Chris's steer is load-bearing on every shape call. Default to "ask, don't ship" on what-to-prune; once a call is steered, execute the mechanical part (same shape as the 2026-06-02 CLAUDE.md compaction — interpretive forks → Chris decides → Claude executes). Do NOT mass-delete glossary content. Do NOT ship content removal without Chris approving the specific section.

This is the **first deliberate dogfood** of the doc-pruning protocol scoped at [docs/features/doc-pruning-mechanism-brainstorm-2026-06-03.md](../features/doc-pruning-mechanism-brainstorm-2026-06-03.md). Its explicit job is to test the protocol live and produce the case-002 handoff doc.

## Why this doc, why now

`CONTEXT-roasting.md` is **115.8 KB / 120 KB (96%)** — the live fire in [docs/architecture/doc-tripwires.md](../architecture/doc-tripwires.md). It is section-read at every claude.ai roasting session, the largest CONTEXT zone file, and the one approaching its tripwire.

## The deliberate-hunt mandate (this is the point of the exercise)

Every pruning case so far is `extract`. CONTEXT-roasting is a **living glossary** — and you **cannot** extract a glossary term to a pointer without breaking the cross-reference web that is the glossary's whole value. So this doc is the shape that should force the two sub-mechanisms we have no worked example of:

- **consolidate** — merge overlapping / redundant term definitions into something more concise (synthesis, not move). Look for terms that drifted into near-duplicates, definitions that grew prose bloat, relationship notes restated in multiple headwords.
- **delete (flag-only)** — flag terms that are stale / superseded / no longer load-bearing for **Chris review**. Do NOT delete autonomously. Candidates: vocabulary for deprecated workflows, terms superseded by later decisions, definitions that exist nowhere downstream.

**Reflex-extract is the failure mode here.** If the session ends having only moved blocks to a sub-doc, it has not advanced shape-coverage and the dogfood failed its purpose. Push on consolidate/delete first; fall back to extract only where a genuinely self-contained, on-demand-reference block exists (e.g. a long worked-example dialogue that isn't a glossary term).

## Procedure

1. Size-map CONTEXT-roasting.md section-by-section (like the CLAUDE.md case opened) so Chris can see where the weight sits.
2. Walk the heavy sections. For each, propose a shape: consolidate / delete-flag / (extract only if truly self-contained) / keep. Present forks to Chris in long-form prose; wait for audio steer.
3. Apply only steered calls. Preserve every cross-reference; a glossary with dangling relationship pointers is worse than a large one.
4. Re-measure; confirm under tripwire (or document why a follow-up is needed).

## Output

- A pruned CONTEXT-roasting.md under the 120 KB tripwire (or a documented partial + follow-up).
- **The case-002 handoff doc** at `docs/sprints/pruning-cases/002-context-roasting.md` using `_template.md` — with the structured header filled (doc / trigger / shape(s) used / judgment calls / heuristic learned), a delete-flag list if any, and the shape-coverage note answering "did we hunt the missing shapes or reflex-extract?"
- Update the [doc-tripwires.md](../architecture/doc-tripwires.md) Current-size column + Live queue.
- Return the handoff doc to the Cluster B doc-pruning thread so the lessons aggregate.
- If new pruning vocab firms up, append to the CONTEXT-shared grill queue (don't author CONTEXT entries inline — still forming).

## Standing rules

- This touches CONTEXT-roasting (claude.ai-facing substrate). A grilling-session close runs the claude.ai grilling review IF claude.ai-facing vocabulary changed materially. A consolidate that only tightens existing definitions without changing meaning likely does not trigger it; a delete that removes a live term does — judge at close.
- Six-actor audit: Actor 5 (CONTEXT doc) is the primary surface; check whether any pruned/renamed term is referenced by a prompt (Actor 2) or cluster doc before removing.

BRANCH: own branch off latest main.
