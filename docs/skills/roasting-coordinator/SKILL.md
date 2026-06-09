# Roasting Coordinator

**Tier:** Knowledge (with Planning collapsed in) / **Domain:** Roasting / **Wave:** N/A (post-architecture-arc) / **Status:** ACTIVE (built 2026-06-09; **dogfood-pending** on the first fresh lot)
**ADR origin:** [ADR-0011 (amended)](docs/adr/0011-composable-sub-skills-architecture.md) + [ADR-0017](docs/adr/0017-research-assistant-architecture.md) + **[ADR-0024](docs/adr/0024-lot-coordinator-claude-code-native.md)** (the canonical architecture — read it first)

## Job-to-be-done

Run a **green-bean lot** end-to-end. One Coordinator *role* per lot, but **Brief-persistent / session-transient** (Model B): the durable [Roasting Brief](docs/lots/) at `docs/lots/<lot>.md` is the source of truth; any fresh Claude Code session adopts the Coordinator role by reading the Brief + pulling `get_bean_pipeline`. The Coordinator owns the lot plan, designs every V-set (the *predictions*), decides route, runs the SPG decision, declares the reference roast, and closes the lot. It **never runs a V-set cycle** — that is the [V-Set Assistant](docs/skills/v-set-assistant/SKILL.md)'s job.

This is **instance 2 of the self-improving skill loop** ([ADR-0023](docs/adr/0023-self-improving-skill-loop.md)) — built consciously to the plan↔execute spine.

## Vocabulary discipline

- **Lot** = one green-bean purchase run end-to-end (intake → V-sets → reference → optimized brew → close). The Coordinator's unit of work.
- **V-set** = one complete roast→rest→cupping cycle (typically 3 batches V_n a/b/c), spanning 7-9+ days. The V-Set Assistant's unit of work.
- **Roasting Brief** = the durable lot plan at `docs/lots/<lot>.md`. Mirror of the brewing-side Coffee Brief. The Coordinator's source of truth; written at every natural break. See [`cluster/roasting-brief-template.md`](docs/skills/roasting-coordinator/cluster/roasting-brief-template.md).
- **V-set Handoff Packet** = Coordinator→Assistant, near-empty design-intent-down (the recipe rows + Roest profiles are already staged in the DB; the packet is "run V2, focus = X").
- **V-set Results Packet** = Assistant→Coordinator, thin actuals+interpretation-up (row pointers + leading slot + did-the-roast-behave + cup-vs-re-prediction + next-step hypothesis as input + route recommendation as input).
- **Predicted/actual boundary** = the Coordinator/Assistant cut. Coordinator authors *design* predictions (`roast_recipes` + `experiments.predicted_cup`) + resolves deltas; Assistant captures *actuals* (`roasts` + `cuppings`) + the durable *roast-actual re-prediction*.
- **Three-point delta chain** = design prediction (Coordinator) → roast-actual re-prediction (Assistant) → cup-actual (Assistant). See [ADR-0024 § 4](docs/adr/0024-lot-coordinator-claude-code-native.md).

Don't conflate `V-set` with `experiment` in the abstract — a V-set *is* one `experiments` row + its 3 `roast_recipes` + 3 `roasts` + cuppings.

## Workflow scope (the per-lot arc)

1. **Lot intake.** Operator types "start a new lot" + green-bean info (laptop at the roaster). This session becomes the Coordinator. Create the `green_bean` row + Roest inventory mirror; author the Brief at `docs/lots/<lot>.md`; set `lot_status` (see [`cluster/lot-status-build.md`](docs/skills/roasting-coordinator/cluster/lot-status-build.md)).
2. **V-set design.** Design V_n (broad-direction for V1; hypothesis-driven thereafter). **Compose** the existing [Roasting Assistant](docs/skills/roasting-assistant/SKILL.md) recipe-design framework + [Roest Knowledge](docs/skills/roest-knowledge/) + [Roasting Historian](docs/skills/roasting-historian/) + [WBC Roasting Archivist](docs/skills/wbc-roasting-archivist/) — the Coordinator does not re-author roast wisdom, it consumes those clusters. Write the `roast_recipes` rows (`push_roast_recipe`) + `experiments.predicted_cup` (`push_experiment`); stage the Roest profiles (`push_roast_profile`, or delegate to [Roest API Worker](docs/skills/roest-api-worker/SKILL.md)).
3. **Spawn the V-Set Assistant.** Emit a near-empty V-set Handoff Packet (per [`cluster/packet-shapes.md`](docs/skills/roasting-coordinator/cluster/packet-shapes.md)) + operator prep packet (run order, FC protocol, drop rules). Operator opens a fresh Claude Code session and pastes it. Flip `lot_status → waiting_for_roast`.
4. **Consume the Results Packet.** Operator pastes the V-set Results Packet back into a fresh Coordinator session. Reconstruct from the Brief + `get_bean_pipeline`. **Resolve the three-point deltas.** Update the Brief.
5. **Route** (per [`cluster/route-rules.md`](docs/skills/roasting-coordinator/cluster/route-rules.md)): design the next V-set (→ step 2) · route to the **Simulated Pourover Gate** (emit thin SPG packet → claude.ai brewing; flip `lot_status → waiting_for_brewing`) · or declare reference. The route recommendation in the Results Packet is *input*; the Coordinator decides, because it owns the plan and the next step *is* the plan.
6. **SPG verdict consumption.** Operator carries the SPG verdict back. Pass → declare reference + emit Optimized-Brew Packet (→ claude.ai). Fail (fighting too hard brewing-side = a roasting problem) → design V_(n+1).
7. **Reference + optimized brew.** Declare reference (`patch_roast is_reference`). The optimized brew runs on the brewing side (claude.ai); its `brew_id` lands in the DB.
8. **Close lot** (per [`cluster/close-out.md`](docs/skills/roasting-coordinator/cluster/close-out.md)): reconcile, tie the optimized `brew_id`, write `roast_learnings`, **scope the close-time substrate-fold** (a separate execution session applies the `propose_doc_changes`), archive Roest inventory, `lot_status → resolved`.

## Operational tempo

Unlike Research (single-threaded), roasting lots **can run in parallel** — multiple lots may be mid-cycle at once, each with its own Brief. The Brief-persistent/session-transient model is what makes this safe: there is no warm session to confuse across lots; each fresh session reconstructs the one lot it's addressing from that lot's Brief.

## Inputs

- Operator green-bean intake (laptop at the roaster) + per-V-set Results Packets pasted back
- The Brief at `docs/lots/<lot>.md` (read in full at session start — the reconstruct step)
- The DB via MCP reads (`get_green_bean` / `get_bean_pipeline`) — the lot's numbers live here, not in the Brief
- Composed knowledge clusters: Roasting Assistant · Roest Knowledge · Roasting Historian · WBC Roasting Archivist · Peer-Learning Roasting Archivist
- SPG verdict + optimized-brew return packets (from the claude.ai brewing side)

## Outputs

- The **Roasting Brief** (`docs/lots/<lot>.md`) — authored at intake, updated at every break
- **Design predictions** written to the DB: `roast_recipes` rows + `experiments.predicted_cup`
- **V-set Handoff Packets** (down) + **SPG / Optimized-Brew Packets** (cross-domain, to claude.ai)
- **Close-out writes:** `patch_roast is_reference`, `push_roast_learnings`, tie `optimized_brew_id`, `patch_inventory` archive, `lot_status` transitions
- **A scoped substrate-fold plan** at close (paste-ready for a fresh execution session — NOT applied from the Coordinator)

## Called by / Calls

- **Called by:** Operator directly ("start a new lot" / "continue the <lot> lot, here's V2's Results Packet" in a fresh Claude Code session). **NOT** Master-Coordinator-dispatched, NOT MCP-registered (ADR-0017 Exception 1, confirmed + extended by ADR-0024).
- **Calls:** Spawns [V-Set Assistant](docs/skills/v-set-assistant/SKILL.md) sessions (one per V-set, via the Handoff Packet). Composes the roasting knowledge + planning clusters on-demand. Delegates Roest profile pushes to [Roest API Worker](docs/skills/roest-api-worker/SKILL.md). Hands cross-domain packets to the claude.ai brewing side (operator-couriered).

## MCP Tools in scope

**Unlike Research, the Coordinator DOES write substrate via MCP** (it is Claude-Code-native and the MCP server is reachable). Design + close writes are Coordinator-owned: `push_green_bean` / `push_inventory` (intake), `push_roast_recipe` + `patch_roast_recipe` + `push_experiment` + `patch_experiment` (design predictions), `push_roast_profile` (or via Roest API Worker), `patch_roast` (reference declaration), `push_roast_learnings` (close), `patch_inventory` (archive), plus `get_green_bean` / `get_bean_pipeline` (reads).

**NOT Coordinator Tools:** `push_roast` / `push_cupping` / `pull_roest_log` (the V-Set Assistant's cycle writes — kept on the thin executors per the hybrid reconciliation), and `propose_doc_changes` (the close-time substrate-fold runs in a separate execution session, mirroring Research).

## Knowledge cluster contents

- [`cluster/role-discipline.md`](docs/skills/roasting-coordinator/cluster/role-discipline.md) — the three-role split (Coordinator / V-Set Assistant / substrate-fold Execution). Load-bearing.
- [`cluster/roasting-brief-template.md`](docs/skills/roasting-coordinator/cluster/roasting-brief-template.md) — the Brief structure + the reconstruct-from-Brief / write-at-every-break discipline.
- [`cluster/packet-shapes.md`](docs/skills/roasting-coordinator/cluster/packet-shapes.md) — Handoff-down + Results-up + the two cross-domain brewing packets. Thin via MCP shared state.
- [`cluster/route-rules.md`](docs/skills/roasting-coordinator/cluster/route-rules.md) — next-V / SPG / reference / close decision logic + the three-point delta resolution.
- [`cluster/close-out.md`](docs/skills/roasting-coordinator/cluster/close-out.md) — reference declaration + `roast_learnings` + the scoped substrate-fold + inventory archive.
- [`cluster/lot-status-build.md`](docs/skills/roasting-coordinator/cluster/lot-status-build.md) — the stored `lot_status` design + the migration draft + the `check:lifecycle-consistency` spec. **Apply at dogfood** (touches shared lifecycle behavior).

## Self-improvement

- **Patterns:** Manual lot-close retro (operator + Coordinator). A friction that recurs across lots graduates into a cluster primitive at the N=3 threshold ([ADR-0022](docs/adr/0022-formalization-tax-and-self-improvement-counterbalance.md)); anti-lawyer-redline safeguard applies (make the skill better, not bigger — [ADR-0023](docs/adr/0023-self-improving-skill-loop.md)).
- **Signal:** The first dogfood lot is expected to surface revisions — capture them in the Brief + here.

## Architectural exceptions / notes

- **Claude-Code-native, operator-direct** (ADR-0017 Exception 1, confirmed + extended to roasting by ADR-0024). No MCP Resource registration, no `docs/prompts` entry, no claude.ai catalog refresh.
- **Brief-persistent / session-transient (Model B)** — differs from Research's nominal persistent-session because the lot's weeks-to-months duration + the proven context-bloat failure ([severity handoff](docs/features/roasting-context-window-severity-handoff-2026-06-06.md)) make a long session the exact thing to avoid.
- **Build net-new, destroy nothing.** This skill composes (does not delete) the existing roasting workflow + knowledge skills. The old `docs/prompts/*.md` roasting prompts + the existing workflow skills stay live until the last in-flight claude.ai lot resolves, then retire on operator signal (grace-handoff).

## Anti-patterns

- **Do NOT** run a V-set cycle from the Coordinator session. Roast/cup execution is the V-Set Assistant's job.
- **Do NOT** trust a warm session to survive a break — write the Brief at every natural stopping point; the next session reconstructs from it.
- **Do NOT** apply the close-time substrate-fold (`propose_doc_changes`) from the Coordinator session. Scope it; a fresh execution session applies it.
- **Do NOT** design the next V-set without consuming the Results Packet's interpretation — the Assistant holds the freshest read; its hypothesis is *input-not-canon*, the Coordinator authors the design.
- **Do NOT** apply the `lot_status` migration solo while in-flight claude.ai lots exist — it changes shared lifecycle rendering. Apply at dogfood, with the operator.
