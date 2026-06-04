# Doc-pruning mechanism — brainstorm + protocol (Cluster B member #1)

**Session:** 2026-06-03 grilling/brainstorm (Chris audio-driven; no autonomous calls). Cluster B member #1 of the system-maintenance / anti-bloat layer.
**Status:** protocol defined + tripwires placed. Systematization **deliberately deferred** until all 5 pruning shapes have a lived worked example.

## The problem (Chris's framing, Group D Round 2 audio)

> "We are adding cumulatively to all of these docs but there is no mechanism to consolidate, split, delete... real pruning exercises on specific docs and then figure out the mechanism to apply this to all doc surfaces and then have this be part of the ongoing autonomy process."

The ADD-shaped self-improvement patterns (A-E in [ADR-0013](../adr/0013-self-improvement-primitives.md)) compound substrate monotonically. Pattern J (substrate pruning) is the named counterbalance but shipped 2026-05-24 as a **placeholder** — the mechanism was deliberately deferred pending lived case studies. This session resolves *how we accumulate those case studies and what we put in place now*, not the final mechanism.

## Core decision: don't systematize yet

The deferral gate (ADR-0013: "lock the mechanism once 2-3-4 lived candidates are worked through") looks cleared on a count basis — we have ~4 de-facto prunes. **But every one of them is the same shape: `extract`.**

| Prune | Shape |
|---|---|
| PRODUCT.md § Recently shipped → shipped.md | extract |
| CLAUDE.md 152→38 KB compaction (#352) | extract (+ split into 4 docs) |
| CONTEXT.md 483 KB → 3 zone docs (#244) | extract / split |
| BREWING.md / ROASTING.md → redirect stubs (Waves 2-4) | extract + archive (stub) |

A mechanism generalized from these would over-fit to extraction and leave the **risky shapes — `delete`, `consolidate`, `archive`-as-standalone — guessed at.** `delete` is the dangerous one (irreversible; the "looks quiet but is load-bearing" trap) and we have **zero** worked example of it.

**Decision (Chris, 2026-06-03):** keep accumulating manual case studies until we've seen all five shapes — **extract / split / consolidate / archive / delete** — *then* decide whether to systematize. Right now systematizing "feels a little immature."

## The five pruning shapes (sub-mechanism vocabulary)

Carried from ADR-0013 / grilling-queue, now treated as the coverage checklist:

| Shape | What it does | Worked example? |
|---|---|---|
| **extract** | move a block verbatim to a sub-doc + leave a pointer | ✅ ×4 (+ FC operational detail → fc-marking.md, [case 002](../sprints/pruning-cases/002-context-roasting.md)) |
| **split** | divide one doc into multiple zone/topic docs | ✅ (CONTEXT zone split) — often co-occurs with extract |
| **consolidate** | merge multiple sections into something more concise (synthesis, not move) | ✅ first example: [case 002](../sprints/pruning-cases/002-context-roasting.md) (operator cluster-regroup + definition-tightening + concept relocation) |
| **archive** | move stale-but-historical content to an archival surface (or redirect stub) | ✅ first standalone example: [case 003](../sprints/pruning-cases/003-product-md.md) — PRODUCT.md closed-roadmap detail (ceased-duplication, already in shipped.md) + Source-Data/Taste-Profile + Lessons Learned → archive doc |
| **delete** | true removal of content that exists nowhere else | ✅ first example: [case 002](../sprints/pruning-cases/002-context-roasting.md) — two operator-authorized sub-categories (provenance shrapnel + deferred-future TODOs). Concept-bearing delete **stays flag-only** |

**Status update (2026-06-03, after case 003):** **all five shapes now have a worked example** across three doc-shapes (reference-doc [001](../sprints/pruning-cases/001-claude-md-compaction.md) / glossary [002](../sprints/pruning-cases/002-context-roasting.md) / roadmap [003](../sprints/pruning-cases/003-product-md.md)). The deferral gate ("lock the mechanism once all five shapes are worked through") is **clear** — the systematization decision is now a live Cluster B item (see [roadmap](../product/roadmap.md) § Active queue). Systematization inputs surfaced so far: (1) `delete` splits into a low-risk class (provenance + deferred-future TODOs — git-recoverable, zero downstream consumers, candidate for the *first autonomous-delete rule*) vs. a concept-bearing class (must stay flag-only) [case 002]; (2) **always run a concept-set diff after a structural reorg** — case 002's reorg silently dropped a concept a prompt cross-referenced; (3) **`archive`'s tell is "the content already has a historical home; the prune is ceasing to re-state it in the live surface"** — case 003 shrank PRODUCT.md 72 KB while writing only ~35 KB of new files, because ~37 KB of closed detail simply stopped being duplicated from shipped.md.

## The protocol (what we do now and going forward)

### 1. Tripwires on all constantly-loaded core docs — PLACED this session

Tripwires now cover the docs most constantly loaded across all three surfaces, not just CLAUDE.md / PRODUCT.md. Canonical registry: [docs/architecture/doc-tripwires.md](../architecture/doc-tripwires.md). New coverage filled the two holes Claude Code can't see from its own session:

- **CONTEXT-\* family** (claude.ai-facing, section-read) — 120 KB cap with explicit per-file watch-lines. CONTEXT-roasting is the live fire at 115.8 KB.
- **claude.ai entry prompts** (full-read every session) — **40 KB cap**, tighter than the CONTEXT files because full-read costs more per session than a section-read glossary. log-cupping (49.2 KB) is already over.

### 2. Tripwire fires → manual post-tripwire pruning exercise

When a doc trips, run a manual session (operator + Claude Code back-and-forth, the shape of the CLAUDE.md compaction in [docs/sprints/pruning-cases/001-claude-md-compaction.md](../sprints/pruning-cases/001-claude-md-compaction.md)). Two standing rules on every exercise:

- **Bias toward shape-coverage, don't just reach for extract.** Extraction is the safe default; if we always reach for it we'll rack up five more `extract` cases and still have no `delete`/`consolidate` precedent. Each exercise explicitly asks: *is the honest move here actually a consolidate or a delete, even though extract is easier?* — deliberately hunt the missing shapes.
- **Capture a structured handoff doc, not just a transcript.** Each case lands in [docs/sprints/pruning-cases/](../sprints/pruning-cases/) using the [_template.md](../sprints/pruning-cases/_template.md) 5-line structured header (doc / trigger / shape(s) used / judgment calls / heuristic learned) + transcript appended. The header is what lets the eventual systematization session read structured inputs across all cases instead of five raw logs.

### 3. delete stays flag-only

Claude Code **flags** delete candidates for operator review; it never deletes content that exists nowhere else autonomously. Revisit autonomy on delete only after several delete cases where Chris agreed each time. (Same posture as the autonomy ladder for irreversible writes in ADR-0013.)

### 4. After all 5 shapes have a worked example → decide on systematization

Only then do we evaluate whether to build the mechanism (a consolidate-memory-style skill for docs/, a recurring schedule, an arbiter step, or a standing cadence rule). The third+ candidate of each shape tests whichever rule the first two suggested.

## Heuristics learned so far

- **extract works cleanly when content has chronological-append or on-demand-reference shape** (a sprint log, per-page IA history, per-column migration notes) — content you only need when actively touching that surface. It does **not** fit living-glossary shape, where the value is in the cross-references staying co-located. (From the CLAUDE.md + PRODUCT.md-shipped cases.)
- **Living-glossary docs (CONTEXT-\*) will likely force `consolidate` or `delete`, not `extract`** — you can't extract a glossary term to a pointer without breaking the relationship web. This is why CONTEXT-roasting is the right next dogfood: it's the shape that forces the missing sub-mechanisms.

## Open questions for the eventual systematization sprint

1. Once all 5 shapes are seen: skill vs. recurring schedule vs. arbiter step vs. standing cadence rule? (ADR-0013 leans mech-a, the arbiter pass.)
2. How autonomous can `consolidate`/`archive` safely become, given delete stays flag-only?
3. Cadence relative to the ADD-side patterns — how often must pruning fire to keep substrate net-flat rather than net-growing?
4. Does the prompt 40 KB cap hold, or loosen once we have prompt-side pruning evidence?
5. Does the structured-handoff format need richer fields once we have non-extract cases to compare?
6. **Registry-drift / size automation.** The tripwire registry's "Current size" column is hand-maintained and has drifted **3× in 3 days** (CONTEXT-roasting 105→116, PRODUCT 114→126→127). "Keep it current or the tripwires go blind" is a real failure mode. Candidate: a tiny `npm run check:doc-sizes` script (analog to `check:mcp-bundle`) that prints each tracked doc's live size vs cap and flags over/approaching — could ship *before* full systematization as the trigger half of the mechanism, with the manual exercise staying the response half.
7. **Autonomous-delete rule for provenance-class content** (from case 002): provenance shrapnel + deferred-future TODOs are git-recoverable with zero downstream consumers — the lowest-risk delete class and the candidate for the *first* autonomous-delete rule, kept distinct from concept-bearing deletes (which stay flag-only).

## New vocabulary to queue for a CONTEXT-shared grill (not authored yet — premature)

The pruning-op vocabulary is still forming; queue for a CONTEXT-shared grill once 2-3 cases stabilize it, rather than authoring CONTEXT entries now:

- the five shapes as first-class ops (extract / split / consolidate / archive / delete)
- "tripwire registry" · "post-tripwire pruning exercise" · "loading-profile-aware tiering" · "shape-coverage bias" · "structured handoff doc / pruning case"

## This session's outputs

- [docs/architecture/doc-tripwires.md](../architecture/doc-tripwires.md) — the consolidated tripwire registry (NEW; placed live).
- [docs/sprints/pruning-cases/](../sprints/pruning-cases/) — structured handoff home + `_template.md` + `001-claude-md-compaction.md` (the retroactive `extract` seed case).
- [docs/sprints/context-roasting-prune-kickoff-2026-06-03.md](../sprints/context-roasting-prune-kickoff-2026-06-03.md) — kickoff for the next dogfood (CONTEXT-roasting; the first deliberate consolidate/delete hunt).
- grilling-queue § Substrate pruning candidates — worked examples filed (#244, #352); procedure points here.
- ADR-0014 — pointer note: live tripwire table now lives in the registry.
- **Decision (revised after case 003, 2026-06-03):** all five shapes now have a standalone worked example across three doc-shapes (reference-doc 001 / glossary 002 / roadmap 003) — **the full-coverage deferral gate is clear.** Case 003 (PRODUCT.md refactor + split, 127→21 KB) landed the missing `archive` shape. The **systematization decision** (skill / recurring schedule / arbiter step / standing cadence rule) is now a live Cluster B item on the [roadmap](../product/roadmap.md) § Active queue — no longer deferred.
