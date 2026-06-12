# Pruning case 008 — CONTEXT-roasting.md (second pass, preemptive)

> Structured handoff doc for a post-tripwire pruning exercise. 5-line header first; notes below. First **preemptive** case (doc under cap at kickoff) and first **second pass on an already-pruned doc** (case 002 took this file 118.7 → 108.2 KB on 2026-06-03).

## Header

- **Doc pruned:** `CONTEXT-roasting.md` — 109.2 KB → **104.0 KB** (cap 120 KB; pruned preemptively at ~91% rather than waiting for the fire). Companion edits: `docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` (+4 precedence-table rows, "rule #N" citations rewired), `docs/architecture/data-model.md` (+`peer_reference_brew_id` column entry — the FK had no data-model entry at all).
- **Trigger:** operator-initiated preemptive prune while strong-model access lasted; CONTEXT-roasting was the largest Tier-1 surface (109.2 KB ⚠️).
- **Shape(s) used:** **consolidate-to-pointer** (primary — § Roast-session operating protocol deduped against `between-batch-protocol.md`, which already held ~100% of the operational detail) + **re-home** (Signal precedence 7-rule list → the CCIL precedence table, resolving case 002's "keep until a home exists" disposition AND the entry's own "Storage open question"; peer-cluster exemplar narratives → `peer-variant-handoffs.md` where they already lived) + **extract** (one block: peer FK schema mechanics → data-model.md, which was missing the column entirely) + targeted same-doc dedupe (Roast→Cup Trace vs V-set close-out narrative asymmetry prose).
- **Judgment calls:** (1) Operator scoped the pass to groups A/B/C + one D row, deferring the interpretive within-entry consolidations (Anchor confidence narratives, SPG bullets, Rest-days drift scoping prose) — preemptive margin didn't justify meaning-drift risk on a living glossary. (2) Two practice contradictions surfaced and were operator-ruled mid-session: BBP duration (glossary said ~7 min; protocol doc's 2:00-2:30 is correct) and session-position slot placement (glossary advised middle-slot placement for the key batch; Chris runs thermal reset + BBP before every batch including the first, so **slot ordering is not a design lever** — entry + Agent rules rewritten to interpretation-only). (3) Janson Pacamara's information-value numbers (47.9 Agtron, oily) exist nowhere else (courier-carried handoff, deliberately NOT filed in peer-variant-handoffs.md), so the exemplar-ladder one-liners keep the numbers — only narratives with a confirmed duplicate were thinned to pointers.
- **Heuristic learned:** **On a second pass over an already-pruned glossary, the dominant bloat class shifts from deliberation narrative (case 002) to cluster duplication** — operational detail re-stated in full where a cluster doc is already the canonical home. The detection move is mechanical: for each operational-flavored glossary section, diff against the cluster doc the redirect-stub map says owns that content. Also: **a prune is a cheap practice-contradiction detector** — putting glossary prose side by side with its operational twin surfaced two real contradictions (BBP duration, slot placement) that neither doc's own maintenance would have caught. And: estimates ran ~2× actual savings (estimated ~10.5 KB for the approved scope, landed 5.3 KB) because keeping definitions + distinctions + avoid-lists intact — correctly — bounds how much a glossary entry can shrink.

## Shape-coverage note

Not a shape-hunt (coverage complete since case 003). Reached for the honest shapes: dedupe-to-pointer where the cluster already held the content (A), re-home where a registry home now exists that didn't at case 002 (B), thin-to-pointer where the archivist cluster already filed the narratives (C). No delete — the two flagged delete candidates (eval_method future-schema speculation, Lifecycle-behavior double statement) were declined by the operator ("no need").

## Delete flags

None executed. The two case-002-class deferred-future TODO candidates flagged in the plan were left in place per operator call.

## Operator rulings recorded (substrate corrections, not prunes)

1. **BBP typical runtime is ~2:00-2:30**, not ~7 minutes — glossary corrected to match `between-batch-protocol.md`.
2. **Slot ordering is not a design lever.** Thermal reset + BBP run before every batch (including the first), so the residual session-position effect is absorbed into the experiment. The glossary's "place the most important batch in the middle position" guidance + the matching Agent rules bullet were removed; the entry now scopes session position to post-hoc interpretation, consistent with `counterflow-observations.md § Session Position Effect` ("do not compensate — rely on the standard thermal reset protocol").

## Result

- `CONTEXT-roasting.md` 109.2 → **104.0 KB** (⚠️ at 87% of cap; margin ~13%). **Heading set byte-identical** (verified by diff) — all ~20 prompt-side `§` pointers resolve unchanged.
- `cross-coffee-insights.md`: precedence table now carries all 7 operating rules (rows for variety-difficulty, drop-ceiling discipline, lot-value/confidence layering, unresolved-anchor one-shot deferral added); "rule #N" back-pointers rewired since the numbering left the glossary.
- `data-model.md`: `green_beans.peer_reference_brew_id` column entry added (migration 069 mechanics — previously undocumented there).
- Stale-ref sweep (fix group E): 8 ROASTING.md-section references repointed to their post-Wave-4 cluster homes; Backfilled-recipe's archived-STAGE-0 reference repointed to `log-cupping-stage0-migration.md`.
- Verification: heading-set diff clean · repo-wide `CONTEXT-roasting.md#` anchor grep clean (zero inbound fragments) · `check:doc-links` 0 live misses · `check:doc-sizes -- --write` registry refreshed · six-actor audit: Actor 6 n/a (no schema/UI change) · Actor 4 — `lib/mcp/docs.ts` CONTEXT-roasting description verified still accurate (every enumerated concept kept its heading; no Resource add → no bundle change) · Actor 2 — prompt pointers resolve (headings unchanged) · Actor 5 — CLAUDE.md tripwire summary line updated · Actor 3 — claude.ai picks up the slimmer doc next session · Actor 1 — cleaner glossary, two practice contradictions fixed.

## Deferred (still on the shelf)

Group D within-entry consolidations (~3.5 KB): Anchor confidence per-lot narratives, SPG-section bullet tightening, Rest-days drift scoping paragraph, Closed-without-reference decoupling narration, Backfilled-recipe source enumeration, WB→Gnd Mandela narrative. Take these when the tripwire actually fires.
