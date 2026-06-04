# KICKOFF — log-cupping.md pruning exercise (pruning case 006)

**THIS IS AN INTERPRETIVE PRUNING SESSION.** Chris's steer is load-bearing on every shape call. Default to "ask, don't ship"; once a call is steered, execute the mechanical part (operator owns the interpretive restructure + shape steer; Claude Code owns the mechanical prune + fidelity verification). **This is a LIVE WORKFLOW prompt — dropping a load-bearing instruction breaks cupping sessions. Higher stakes than a reference doc; verify every removed step is genuinely dead before cutting.**

Pruning case 006 ([scope doc](../features/doc-pruning-mechanism-brainstorm-2026-06-03.md); [Pattern J, ADR-0013 Amendment](../adr/0013-self-improvement-primitives.md)). Coverage is complete, so a normal prune — reach for the honest shape.

## Why this doc, why now

`docs/prompts/log-cupping.md` is **49.2 KB / 40 KB** — over the prompt cap ([doc-tripwires.md](../architecture/doc-tripwires.md)). It is a **full-read claude.ai entry prompt**: every cupping session loads all 49 KB before doing anything, so the per-session context cost is the whole file (this is why prompts are capped tighter than the section-read CONTEXT glossaries). It is also the longest-standing live fire.

## Doc shape → likely prune shapes

A prompt is **operational/procedural** (STAGE 0-7 + "What this prompt does NOT do"), not reference. That predicts:

- **consolidate** (likely primary) — prompts accrete prose iteration over iteration; tighten verbose stage instructions to the minimum that still drives the workflow correctly. Synthesis, not move.
- **extract** — push detailed *reference* material the prompt currently inlines (long examples, schema enumerations, edge-case tables) into a cluster doc the prompt *points at* — the prompt keeps the procedure, the reference loads on demand. Candidate: STAGE 6 ("propose cluster-doc update") detail; any inlined schema/field tables that duplicate the Cupping Specialist cluster.
- **delete (flag-only, with a strong candidate)** — **STAGE 0 "State-shape migration (pre-rewrite lot detection)"** (~70 lines) is legacy: it detects and migrates pre-rewrite-shape lots. If every lot is already in the current shape, STAGE 0 is dead weight loaded every single cupping session. **Verify against the DB** whether any pre-rewrite lots remain; if none, this is a superseded-legacy delete (the same low-risk class as case 002's deferred-future deletes). If a few remain, archive the migration path to a one-time doc rather than carrying it in the every-session prompt.

Also worth a look: STAGE 5 (V_(n+1) design) overlaps the Roasting Assistant / start-lot surface — check whether it can reference rather than restate.

## The load-bearing safety constraints

- **It is a live workflow.** Before removing any stage/step, confirm it is genuinely unused (DB check for STAGE 0; cross-ref check for the rest). A wrongly-cut instruction silently breaks the next cupping session.
- **It is MCP-registered (Actor 4).** `docs://prompts/log-cupping.md` is a Resource in `lib/mcp/docs.ts` with a description that references its stages. If a prune removes/renames a stage the description names, update the description in the same PR. No new registration needed (it's an existing Resource), and no bundle change.
- **It is claude.ai-facing (Actor 3).** This prune changes claude.ai-loaded substrate, so the **claude.ai grilling review fires at session close** (per the standing rule) — the one surface Claude Code can't see.

## Procedure

1. Size-map log-cupping.md by stage so the weight is visible; flag STAGE 0 (and any other legacy/migration block) first.
2. **DB-check STAGE 0**: are there any pre-rewrite-shape lots left? (execute_sql / get_bean_pipeline.) Result drives delete-vs-archive-vs-keep.
3. Per stage, propose a shape: consolidate verbose prose / extract reference detail to the Cupping Specialist cluster / delete-flag dead legacy / keep load-bearing procedure. Present forks in long-form prose; wait for audio steer.
4. Apply only steered calls. Re-read the pruned prompt end-to-end as if running a cupping session — every stage transition must still work.
5. Re-measure; confirm < 40 KB. `npm run check:doc-sizes -- --write`.

## Output

- log-cupping.md under the 40 KB prompt cap.
- **Case-006 handoff** at `docs/sprints/pruning-cases/006-log-cupping.md` (`_template.md`) — shape(s) / judgment calls / heuristic learned / delete-flag list (esp. the STAGE 0 disposition + the DB evidence).
- `lib/mcp/docs.ts` Resource description updated if a named stage changed.
- Run the **claude.ai grilling review** at close (claude.ai-facing substrate changed).
- Return the handoff to the Cluster B doc-pruning thread.

## Six-actor

Actor 2 (this IS a prompt — primary) · Actor 4 (`lib/mcp/docs.ts` description) · Actor 3 (claude.ai reload + grilling review) · Actor 6 (DB check for STAGE 0 legacy lots) · Actor 5 (Cupping Specialist cluster, if reference detail extracts there — keep its SKILL.md manifest accurate). Grilling posture: no content-removal ship without Chris's sign-off on the pruned result.

BRANCH: own branch off latest main.
