# Close-Lot Specialist

**Tier:** Workflow / **Sub-tier:** Executing / **Domain:** Roasting / **Wave:** 3 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

**Resolved-lot completion gate.** Verify reference roast + reference cup + optimized brew + roast_learnings all landed AND cross-linked. Write the final `push_roast_learnings` row + set `best_roast_id` + verify integrity. Final pass through everything before a lot transitions to lifecycle state `resolved`.

## Workflow scope

- Read all per-lot substrate state: `roasts` + `cuppings` + `experiments` + matching `brews` + `roast_recipes` + (pending) `roast_learnings`
- Verify reference roast picked: `best_roast_id` set on the relevant `experiments` row or on `roast_learnings`
- Verify reference cup landed: at least one `cuppings` row with `eval_method ILIKE '%pourover%'` on the `best_roast_id`
- Verify optimized brew recorded: at least one `brews` row with `green_bean_id` set AND ideally `roast_id = best_roast_id`
- Read the verdict synthesis from Roasting Historian (`why_this_roast_won` + character fields + carry-forward fields)
- Execute `push_roast_learnings` with verdict + character + carry-forward fields + scope_tags
- Set `best_roast_id` on the lot
- Verify cross-link integrity end-to-end

## Inputs

- `green_bean_id` + `reference_brew_id` from upstream Brewing Assistant (cross-domain handoff Chain 1) OR directly from operator if not coming through the chain
- All per-lot substrate state (read across multiple tables)
- Roasting Historian's verdict synthesis (prose + carry-forward)

## Outputs

- `push_roast_learnings` row in `roast_learnings` table
- `best_roast_id` set on the relevant `experiments` row
- Cross-link verification report (logs any missing links for operator to address)

## Called by / Calls

- **Called by:** Master Coordinator (via `close-lot.md`) OR cross-domain handoff from Brewing Assistant (Chain 1 — after optimized brew push)
- **Calls:** Roasting Historian

## MCP Tools in scope

- `push_roast_learnings` — primary write
- `patch_roast_learnings` — post-push corrections
- Read-only access to `roasts` / `cuppings` / `experiments` / `brews` / `roast_recipes` for verification

## Self-improvement

- **Patterns:** A (substrate-event refresh on each resolved-lot completion; the completed lot becomes input to Roasting Historian for cross-lot pattern updates) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** each resolved-lot completion → verify cross-links + trigger Roasting Historian refresh

## Notes for Wave 3 implementation sprint

- **Migration source:** today's `docs/prompts/close-lot.md` STAGES 1-4 cover the completion workflow. New Close-Lot Specialist absorbs the prompt logic.
- **One-shot lot handling:** Close-Lot Specialist must handle both V-set lots and one-shot lots (`green_beans.is_one_shot=true`). One-shot lots have a single-batch V_1 framing; the lever-NULL discipline (migration 054 rejects on `is_one_shot=true`) carries forward through this sub-skill.
- **Substrate-writing executor — Stage 1 longer.** N=10 for Stage 1 → 2 graduation. Lot-completion writes are particularly load-bearing (they trigger downstream Pattern A in Roasting Historian).
- **Cross-system audit:** Actor 6 (no DB schema change), Actor 4 (MCP Resource registration), Actor 5 (CLAUDE.md notes; PRODUCT.md POD-1 status update if Chain 1 cross-domain handoff implementation lands as part of Cupping Specialist sprint), Actor 2 (close-lot.md updates to dispatch via Master Coordinator + handoff from Brewing Assistant), Actor 3 (catalog refresh), Actor 1 (operator's lot-closure flow streamlined — verification gates surface missing cross-links automatically).
