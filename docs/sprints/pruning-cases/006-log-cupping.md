# Pruning case 006 — log-cupping.md

> Structured handoff doc for a post-tripwire pruning exercise. 5-line header first; transcript/notes below.

## Header

- **Doc pruned:** `docs/prompts/log-cupping.md` — 49.3 KB → **24.0 KB** (cap 40 KB). New sibling `docs/prompts/log-cupping-stage0-migration.md` (6.9 KB, archive).
- **Trigger:** 🔴 over the 40 KB prompt cap; #1 in the [doc-tripwires.md](docs/architecture/doc-tripwires.md) Live queue. First prompt-shape (procedure) case taken through the protocol.
- **Shape(s) used:** **consolidate** (primary — duplicated CONTEXT-roasting vocabulary collapsed to pointers) + **archive** (STAGE 0 pre-rewrite migration → sibling doc + thin detection stub). No delete.
- **Judgment calls:** (1) STAGE 5/6 design-ownership — Chris's prototype moved V_(n+1) design + doc-proposal OUT to handoff packets; **operator decided to KEEP today's inline behavior unchanged** and note the move for the future roasting-coordinator workflow instead (the boundary has to be designed against the whole roast flow, not just the cupping side). (2) STAGE 0 — DB check found zero live pre-rewrite lots, so archive (not inline-slim, not delete); kept as a recoverable break-glass doc because historical NULL-shaped V-sets still exist.
- **Heuristic learned:** **For a procedure prompt that re-states concepts owned by a glossary, the highest-leverage prune is consolidate-to-pointer, and it does NOT require touching behavior.** Validate every pointer against the live glossary headings first (all 13 resolved here), keep every STAGE write-contract / halt gate / MCP call / uncross-queryable field semantic, and let prose (worked examples, historical backstory, re-stated definitions) carry the cut. The consolidation alone cleared the cap (49.3 → 24.0) with the live workflow behavior byte-for-byte intact — so an architectural refactor (moving design out) could be declined on its merits rather than forced by the KB target.

## Shape-coverage note

Not a shape-hunt (coverage was already complete after cases 001-004). Reached for the honest shapes: a procedure prompt's bloat is duplicated-concept prose (→ consolidate-to-pointer) + a dead exception path (→ archive). The discipline that mattered was *fidelity*, not shape novelty: a prompt governs live behavior, so the cut had to preserve the procedural skeleton exactly while only shedding prose. Verified post-prune: all 10 `**Writes:**` contracts present; all 9 MCP tools (`push_cupping`/`patch_cupping`/`patch_experiment`/`patch_roast`/`push_experiment`/`push_roast_recipe`/`patch_roast_recipe`/`push_roast_profile`/`propose_doc_changes`) present; halt/guard strings present (`is_reference_candidate`, `NULLS NOT DISTINCT`, `REST_DAYS_DRIFT`, the SPG push-back line, `power_bezier MUST be null`, one-shot exemption, SIMULATED POUROVER PACKET).

## Prompt-cap evidence note (first prompt-side case — feeds the "does 40 KB hold?" question)

What was **genuinely every-session-load-bearing** (had to stay inline): the STAGE skeleton + per-stage write contracts; the exact MCP call sequences (esp. the STAGE 6 three-call design + link-back, and STAGE 3 `push_cupping` keying); the halt/push-back gates; the format-strict bits (`winner` = `V<n><letter> (Batch <Roest#>)`, the SIMULATED POUROVER PACKET literal); and the uncross-queryable field semantics (sweetness-is-distinct, the field-split rule).

What was **pointer-able** (every-session cost with no every-session value): re-stated CONTEXT-roasting definitions (SPG system, reference-designation terms, key-insight ladder, operator-fixed constants, adjustment scale, rest-days-drift interpretation), long worked examples (the v3a delta paragraph, the taste_for examples), and historical backstory ("renamed from Path C-2 at Item 7 grill", the SPG how-it-came-about prose).

What was **archivable** (loaded every session for a path that can't fire): STAGE 0 (~7 KB), the pre-rewrite migration.

**Recommendation on the cap:** 40 KB held comfortably — the doc landed at 24 KB with full behavior intact and real headroom. The cap is doing its job. No reason to loosen it yet; revisit only if a prompt's genuinely-inline procedural core (skeleton + contracts + gates, none of it pointer-able) ever approaches 40 KB on its own. `one-shot.md` (33.9 KB ⚠️) is the next prompt to watch and the second data point when it's touched.

## Delete flags (if any)

None. STAGE 0 was archived (recoverable), not deleted — historical NULL-shaped V-sets still exist (Gesha Clouds V1/V2, Bukure V1, Wush Wush V1, the resolved Sudan Rume CGLE lot), so a one-off re-cup of an old V-set could still want the procedure. Per protocol, delete stays flag-only; archive was the correct disposition.

## STAGE 0 DB evidence (drove the archive call)

Checked all 6 active Roest-inventory lots (2026-06-04). **Zero are STAGE-0-live:** Mt Elgon is a one-shot (uses `one-shot.md`); Sudan Rume CGLE is resolved (`roast_learnings` present); Gesha Clouds (V3), Bukure (V2), and El Paraiso (both V-sets) have all migrated to post-rewrite shape (`updated_cup_prediction_a` SET) at their live V_n; Wush Wush is between V1 (done) and an un-roasted V2. The NULL/pre-rewrite signature survives only on historical, already-cupped early V-sets that do not re-enter `log-cupping`.

## Six-actor audit

- **Actor 6 (schema/UI):** no change — prune touches prose about already-shipped columns, not the columns.
- **Actor 4 (MCP):** `docs://prompts/log-cupping.md` description in `lib/mcp/docs.ts` **still accurate, no edit needed** — behavior unchanged (still "designs V_(n+1) inline … or routes to close-lot.md"). The new `log-cupping-stage0-migration.md` is deliberately **not** MCP-registered (break-glass, operator-pulled; keeps the Resource surface flat for a dead path). `docs/prompts/*.md` is already bundle-covered.
- **Actor 5 (Claude Code):** new sibling doc + roadmap note added; no CONTEXT/CLAUDE edits needed (pointers target existing headings).
- **Actor 2 (prompts):** sibling/cross-prompt refs intact; the SIMULATED POUROVER PACKET contract with `simulated-pourover.md` preserved verbatim.
- **Actor 3 (claude.ai):** slimmer prompt surfaces next session automatically. **Pre-existing drift flagged (not introduced here):** the `cupping-specialist` + `roasting-assistant` SKILL.md descriptions in `lib/mcp/docs.ts` still say "Path C-2 / real-pourover discriminator" and "STAGE 3 V_(n+1) design intent" — both already loose vs the prompt. Out of scope for this prune; candidate for the roasting-coordinator grill.
- **Grilling-close:** consolidation tightened prose without changing meaning or live behavior; STAGE 0 archive removed a path no lot can trigger. Low claude.ai-vocabulary delta. A full claude.ai grilling review is not warranted by this prune alone (judge at the next roasting grill).

## Result

- `docs/prompts/log-cupping.md`: 49.3 → **24.0 KB** (cap cleared, 🔴 → ✅).
- `docs/prompts/log-cupping-stage0-migration.md`: new, 6.9 KB (archived STAGE 0 backfill procedure).
- `docs/product/roadmap.md`: note added under Lot Coordinator + V-Set Assistant (STAGE 5/6 design-ownership question).
- `npm run check:doc-sizes`: log-cupping ✅; registry live-block refreshed via `-- --write`.
- Operator decisions honored: STAGE 5/6 behavior unchanged; STAGE 0 archived.

## Transcript / detailed log

Operator-driven (2026-06-04). Chris supplied a prototype refactor + long-form audio framing; Claude Code validated pointers (13/13 resolved against CONTEXT-roasting headings), ran the STAGE 0 DB check (0 live pre-rewrite lots), and built the pruned doc keeping today's behavior. The central fork — move V_(n+1) design + doc-proposal out to handoff packets (prototype) vs keep inline (audio) — was resolved by Chris in favor of keep-inline-and-note, on the grounds that the boundary must be designed against the whole roast flow in the roasting-coordinator workflow, not decided cupping-side in a prune.
