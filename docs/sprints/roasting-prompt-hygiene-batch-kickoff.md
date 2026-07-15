# Kickoff brief — Roasting-prompt hygiene batch (10 items, one PR) [EXECUTION]

Emitted by the 2026-07-15 plan-feedback pass (Chris selected this cluster). Execution work -
the autonomy rule applies: implement, verify, commit + push + PR + merge, end with PR URL +
merge SHA. Bucket-A precedent: the Round-19 "ship bucket A now" batch is the shape - many
small prompt edits, one PR, per-item ledger in the PR body.

Context note: the claude.ai workflow surface is fully deprecated (Chris, 2026-07-15); these
prompts survive as the substrate Claude Code Coordinator sessions compose via `read_doc` /
repo reads. Edit them as Claude-Code-read substrate - do not add claude.ai-specific
instructions.

## Problem

Ten small, individually-cheap prompt gaps keep costing a question, a wasted tool call, or a
mis-ordered write in lived roasting sessions - none big enough for its own sprint, all
shippable in one batch.

## Goal

One PR that lands all ten prompt/doc edits below, each traceable to its backlog item.

## The items (backlog `## Open — prompt / doc-touch`)

1. **#40** — log-roast/start-lot STAGE 6: `drop_rule_if_fast/slow` REQUIRED per slot when the
   experiment varies `end_condition_target`, varies a lever with per-slot pre-FC/stall
   divergence, or leaves slots at different fast/slow risk.
2. **#42** — close-lot ordering: re-order STAGE 4 (link + read brew) BEFORE STAGE 3 (push
   roast_learnings). Recommended: the plain reorder (renumber stages); fall back to a formal
   "STAGE 4.5 patch step" only if the reorder breaks a downstream stage dependency you find
   in the prompt.
3. **#53** — close-lot.md + one-shot-closeout.md STAGE 5: "resuming a partially-completed
   close-out" preamble - check roast_learnings existence + existing proposal_ids by
   (target_doc, section_anchor) before re-issuing calls.
4. **#43a** — document auto-split granularity in close-lot STAGE 5: confirm from
   [lib/mcp/propose-doc-changes.ts](../../lib/mcp/propose-doc-changes.ts) whether auto-split
   emits one call per (target_doc, section_anchor) globally or bundles within-target_doc,
   then state it in the prompt (read the code; don't guess).
5. **#43b** — record the already-made operator call: active-lot soft-retire empty-replaces the
   H1 status-block region only; H2 sections are preserved as historical/cross-ref anchors.
6. **#43c** — close-lot STAGE 2: ask the operator to confirm drop attribution when
   `end_condition_type=manual` pairs with a drop temp meaningfully under the designed
   bean_temp trigger.
7. **#44** — five clarity additions across log-cupping/log-roast: Path A affirmative-
   confirmation line ("✓ N V-sets / ✓ xbloom / ✓ SPG cup-set"); key_insight_confidence ladder
   worked example (Medium-High requires N≥3 within-lot OR N≥2 cross-lot + falsifier);
   cooling_arc_pattern per-value example each (esp. flat-vs-hold); "on re-entry from a
   calibration gate, re-assess the candidate flag"; "a control experiment can be a
   single-variable sweep within an identified lever."
8. **#41** — log-cupping STAGE 6 seed-then-bump CCIL sub-rule: when a prior session seeded a
   Low-confidence pending-cup CCIL entry and this session resolves it, prefer REPLACE on the
   existing entry (bump confidence, drop provisional hedges, add resolution evidence) over a
   new entry.
9. **#45** — (a) tighten the cupping schema-note: the SPG free-text note goes in `overall`,
   freetext-prefixed; (b) document in the propose_doc_changes guidance that an append op
   accepts new H2+ headers (they land as new sections positioned relative to subsequent
   section boundaries). ⚠️ Coordinate (a) with the parallel lifecycle/SPG grilling session -
   if that session re-homes the SPG note, its call wins; land (a) only if the grill hasn't
   ruled, and say so in the completion report.
10. **#47** — CCIL-promotion rule line: codify the conservative call the operator already
    took - a single hypothesis replicated across two one-shots (N=2 cross-lot) stays BELOW
    the CCIL bar; hold it in `general_takeaway`, promote at N=3 or when confidence reaches
    Medium-High under the ladder. (Prior operator lock is the default; flag in the PR body
    for veto.)
11. **#50** — operational-guide / brewing-completion spec line: for net-new roaster cards,
    append after the last existing card section (or to the file-level h1 anchor).
12. **#10** — fold anchor-confidence framing into start-lot.md's V1-design template
    (originally filed against new-bean-intake.md, which start-lot.md replaced - retarget).

## Scope

**In:** the twelve edits above (10 backlog items), across docs/prompts/*.md + the
brewing-completion/operational-guide spec docs they name.
**Out:** #58 / Path C-2 (owned by the lifecycle/SPG grilling session); any MCP/schema code;
anything requiring a new operator decision beyond the recommended defaults flagged above.

## Entry surface

Spawned implementer sub-agent (this brief is its prompt), fresh branch off origin/main.

## Files likely to touch

- docs/prompts/log-roast.md · log-cupping.md · close-lot.md · one-shot-closeout.md ·
  start-lot.md · bundled-brewing-completion.md
- docs/skills/coordinator/operator-guide.md (or wherever the net-new-roaster-card spec line
  lives - locate via grep, don't assume)
- docs/product/feedback-backlog.md + docs/sprints/shipped.md (close-out currency)

## Verification plan

- Per-item ledger in the PR body: item → file → anchor of the edit.
- `npm run check:doc-sizes` (log-cupping.md was pruned to 24KB against a 40KB cap - these
  additions must not blow it; if any prompt approaches its cap, trim in place per Pattern J
  instincts and note it).
- `npm run check:doc-links` green (new intra-doc references must be root-relative).
- Six-actor trace: Actor 2 is the whole sprint; Actor 5 - update CONTEXT-roasting.md only if
  an edit introduces new vocabulary (none expected; the #47 rule line may earn a one-line
  glossary touch - judgment call, note it); Actors 3/4/6 - no changes expected, skip
  explicitly in the completion report.

## Open questions

- #42: reorder vs STAGE 4.5 (recommended: reorder - decide from the prompt's actual stage
  dependencies).
- #47: the codified rule line is a recommended default from the operator's prior conservative
  move, not a fresh ratification - flag prominently in the PR body.
- #45a: yields to the lifecycle/SPG grill if it rules on the SPG-note home first.

## Completion handoff

When merged, write `docs/sprints/roasting-prompt-hygiene-batch-completion.md`: (1) restate
the plan, (2) per-item recap incl. divergences + why (incl. any item skipped because the
grill claimed it), (3) PR URL + merge SHA, (4) actual verification results (check outputs,
the per-item ledger), (5) anything deferred/surprising/new. Then flip the ten backlog items
`planned → shipped` (move to shipped.md) and `route-feedback` any new friction.
