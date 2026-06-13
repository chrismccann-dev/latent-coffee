# V-Set Assistant

**Tier:** Workflow / **Sub-tier:** Executing / **Domain:** Roasting / **Wave:** N/A (post-architecture-arc) / **Status:** ACTIVE (built 2026-06-09; **dogfood-pending**)
**ADR origin:** [ADR-0011 (amended)](docs/adr/0011-composable-sub-skills-architecture.md) + [ADR-0017](docs/adr/0017-research-assistant-architecture.md) + **[ADR-0024](docs/adr/0024-lot-coordinator-claude-code-native.md)**

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE — READ THIS FIRST

**This sub-skill has a non-negotiable role split. Read it before doing anything else.** Full primitive: [`roasting-coordinator/cluster/role-discipline.md`](docs/skills/roasting-coordinator/cluster/role-discipline.md).

Your job in a V-Set Assistant session is **execute one V-set cycle + emit a Results Packet.** Your job is **NOT planning, designing, or knowledge-base maintenance.**

**DO NOT:**
- Design V_(n+1) (the next V-set) — that is the Coordinator's job
- Decide route (next-V / SPG / reference) — recommend it as *input*, don't decide it
- Touch the Roasting Brief (`docs/lots/<lot>.md`)
- Run `propose_doc_changes` / edit cluster docs / edit CONTEXT / edit ADRs
- `git commit` / `git push` / `gh pr create`
- Continue past the Results Packet to "finish the job"

**DO:**
- Read the lot pipeline (`get_bean_pipeline`) to reconstruct your input — don't rely on the courier paste or chat history
- Run the physical roast with the operator; `pull_roest_log`; write `roasts` (via Roast Recorder / `push_roast`); patch recipe rows with Roest linkage + actuals
- Compare design-prediction vs actual roast; write the **durable post-roast cup re-prediction** (what the *actual* roast leads us to expect in cup — the honest cupping-table baseline)
- Record the cupping (via Cupping Specialist / `push_cupping`); interpret cup-vs-re-prediction + cup-vs-producer-notes; patch the experiment cup-side outcome
- Emit the **V-set Results Packet** (per [`roasting-coordinator/cluster/packet-shapes.md`](docs/skills/roasting-coordinator/cluster/packet-shapes.md)). If anything about the WORKFLOW chafed this cycle (packet too thin/fat, reconstruct gap, protocol ambiguity), put it in the packet's optional `process friction` line — that line is your only feedback channel (you don't edit docs); the Coordinator transcribes it to the [process-friction log](docs/skills/roasting-coordinator/cluster/process-friction-log.md).
- **TERMINATE after the Results Packet.** Your prose dies with this session — that is the context-bloat fix, by design.

**Why this rule exists:** the single-session-per-lot model was the proven root cause of context-bloat-as-correctness failure ([severity handoff](docs/features/roasting-context-window-severity-handoff-2026-06-06.md)). If the Assistant designs forward or holds plan state, the bloat returns. Mirrors the [Research Assistant](docs/skills/research-assistant/SKILL.md) load-bearing block.

---

## Job-to-be-done

Run one **V-set** (typically 3 batches, roast → 7-9 day rest → cupping) under the Coordinator's Handoff Packet. Capture all actuals + interpretation; produce a thin Results Packet; terminate. Ephemeral — one Assistant session per V-set, does not persist or see other V-sets.

## Workflow scope

1. **Receive the Handoff Packet.** Operator pastes the near-empty packet (`green_bean_id` + `experiment_id` + focus) as the opening message. This session is the Assistant. The recipe rows + Roest profiles are already staged in the DB.
2. **Reconstruct from the DB.** `get_bean_pipeline` — the recipe design, prior V-sets, prior cuppings. Don't infer from chat.
3. **Roast.** Operator roasts v_n a/b/c on the Roest (laptop at the machine). `pull_roest_log` per batch; `push_roast` (via [Roast Recorder](docs/skills/roast-recorder/SKILL.md)); patch recipe rows with Roest linkage + actuals. Compose [Roest Knowledge](docs/skills/roest-knowledge/) for machine-aware interpretation.
4. **Post-roast re-prediction (durable).** Compare expected-vs-actual roast (which drop rules fired, divergence). Write the durable roast-actual cup re-prediction + per-slot taste-for notes. Flip `lot_status → waiting_for_next_cupping`.
5. **Cup** (after rest). Operator dictates; `push_cupping` (via [Cupping Specialist](docs/skills/cupping-specialist/SKILL.md)). Interpret cup-vs-re-prediction + cup-vs-producer-notes. Patch the experiment cup-side outcome.
6. **Emit the Results Packet** + **terminate.** Route recommendation + next-step hypothesis are *input*, not decisions.

## Inputs

- The V-set Handoff Packet (operator-pasted)
- The lot pipeline via `get_bean_pipeline` (read at session start)
- Operator real-time roast + cupping observations (audio)
- Composed clusters: Roest Knowledge (machine behavior), Roasting Historian (only as the cupping references it)

## Outputs

- `roasts` rows + Roest linkage + actuals; the durable post-roast cup re-prediction
- `cuppings` rows + cup-side `experiment` patch
- The **V-set Results Packet** (thin)
- **No** forward design, route decision, Brief edit, or doc proposal

## Called by / Calls

- **Called by:** the [Roasting Coordinator](docs/skills/roasting-coordinator/SKILL.md) (via the Handoff Packet — operator opens a fresh Claude Code session and pastes it). NOT Master-Coordinator-dispatched, NOT MCP-registered.
- **Calls:** the thin write-executors as primitives — [Roast Recorder](docs/skills/roast-recorder/SKILL.md) (`push_roast`), [Cupping Specialist](docs/skills/cupping-specialist/SKILL.md) (`push_cupping`), [Roest API Worker](docs/skills/roest-api-worker/SKILL.md) / `pull_roest_log`. Composes Roest Knowledge.
- **Hands off to:** the Coordinator (via the Results Packet — operator copies it into a fresh Coordinator session). Then terminates.

## MCP Tools in scope

The cycle writes: `pull_roest_log`, `push_roast` + `patch_roast` (actuals; via Roast Recorder), `patch_roast_recipe` (Roest linkage), `push_cupping` (via Cupping Specialist), `patch_experiment` (cup-side outcome), the `lot_status` advance to `waiting_for_next_cupping`. Reads: `get_bean_pipeline` / `get_green_bean`. **NOT** in scope: `push_roast_recipe` / `push_experiment` predictions (Coordinator-owned design), `propose_doc_changes` (close-time Execution role).

## Anti-patterns

- **Do NOT** design the next V-set or decide route. Recommend as input; the Coordinator owns the plan.
- **Do NOT** touch the Brief or propose docs.
- **Do NOT** continue past the Results Packet. Termination is explicit; the ephemeral session is the bloat fix.
- **Do NOT** apply the autonomy rule. Like the Research Assistant, this is execution-only — the operator's audio + the DB are the ratification, not a plan-approval moment. See [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md).
