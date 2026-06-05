# Workflow-Feedback Backlog

*Last updated: 2026-06-04 (seeded from `feedback_mcp_continuous_log.md` Round 19 open state)*

The **actionable** subset of workflow feedback — the items that need a *build* (prompt
fix / MCP fix / schema / UI / architecture), not just a route-and-forget filing.
This is the seam between the [route-feedback](../../.claude/skills/route-feedback/SKILL.md)
skill (which files items here) and the [plan-feedback](../../.claude/skills/plan-feedback/SKILL.md)
skill (which clusters + prioritizes them into a buildable sprint).

**Master log** (raw intake + routing ledger + wins + non-actionable items):
`~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md`.
Terminal-home items (standing rules → memory, concepts → grilling-queue, etc.) are
NOT duplicated here; only buildable work lands here. See [ADR-0020](../adr/0020-feedback-handoff-pipeline.md)
for the pipeline rationale.

## Entry format

Each entry is machine-scannable so `plan-feedback` can cluster + score:

```
### <title>
- **Shape:** prompt | mcp | schema | ui | arch | reference
- **Recurrence:** <count> (<source rounds/lots>)
- **Criticality:** low | med | high
- **Status:** open | planned | shipped
- **Source:** <round #(s) in master log>
- **Body:** <the ask, 2-4 lines>
```

**Recurrence is the priority signal.** When the same friction shows up across multiple
sessions, bump the count + add the source rather than filing a duplicate — that count is
what tells `plan-feedback` what keeps biting and is worth a sprint first.

**Status lifecycle:** `open` → `planned` (claimed by a plan-feedback brief) → `shipped`
(move the line to `docs/sprints/shipped.md`; do not keep shipped detail here).

---

## Open — architectural (schema / lifecycle)

### SPG / calibration-gate is not a first-class lifecycle state
- **Shape:** arch (schema/lifecycle)
- **Recurrence:** 5+ (Gesha Clouds V3, 2nd SPG lot, Bukure V2; reinforced by the one-shot defer-verdict gap #30 and the deferred-proposals gap below)
- **Criticality:** high
- **Status:** open
- **Source:** master log #22 (Round 17), reinforced #30 (Round 18)
- **Body:** When SPG (Simulated Pourover Gate) / any C-path calibration gate fires mid-V-set, the lot sits in a state distinct from both "winner declared" and "advance to V_(n+1)" — winner null, brew-side confirmation pending. Only encoded in prose today. Candidates: `lifecycle_state` enum (`waiting_for_spg`) on experiments, or a lightweight `gates` table `(green_bean_id, gate_type, status)`. This is the **lifecycle-gate-not-modeled meta-pattern** — the single highest-recurrence theme in the backlog; it spans V-set (SPG) AND one-shot (defer-verdict) paths. Tagged in `issues.md` as a Lot Coordinator + V-Set Assistant sprint concern.

### Deferred-proposals queue + partial-proposal gap during a calibration gate
- **Shape:** arch (workflow/lifecycle)
- **Recurrence:** 2 (Round 17; echoes an earlier log-roast partial-proposal flag)
- **Criticality:** high
- **Status:** open
- **Source:** master log #23 (Round 17)
- **Body:** `log-cupping.md` STAGE 6's binary skip/propose during a gate defers ALL doc proposals to post-SPG re-entry, including cupping-INDEPENDENT ones that could land now (the V_n status flip, SPG-independent cup findings, a CCIL violation). Consequence: the active-lot doc reads "designed/pushed, not roasted" when it was in fact cupped. Needs a real-time partial-write rule + an explicit "deferred proposals" queue concept. Pairs tightly with the SPG lifecycle-state item.

### `cooling_arc_pattern` enum on cuppings
- **Shape:** schema
- **Recurrence:** 1 (now differentiating on a 2nd lot)
- **Criticality:** med
- **Status:** open
- **Source:** master log #27 (Round 17)
- **Body:** `degrade / hold / improve / flat`, independent of `temperature_behavior` prose. Becoming a real signal axis; cross-lot "which lots cooling-arc-degrade" should be canonical-queryable not regex-on-prose. Pairs with the prior shipped cupping-schema axes (wb_to_ground_delta S1, sweetness S3).

### recipe↔roast intentional-divergence signal
- **Shape:** schema (derived field)
- **Recurrence:** 1 (all 3 V3 roasts on one lot)
- **Criticality:** low
- **Status:** open
- **Source:** master log #26 (Round 17)
- **Body:** `recipe.end_condition_target=209` vs `roast.end_condition_type=manual` (target NULL) is an intentional, lore-dependent divergence. Candidate derived `roast.execution_diverged_from_recipe: true` so analytics read correctly without knowing the lore.

### Server-side `cupping_date ≥ roast_date+1` + rest_days consistency validation
- **Shape:** schema (validation)
- **Recurrence:** 1 (voice-to-text date slip caught only by day-of-week math)
- **Criticality:** med
- **Status:** open
- **Source:** master log #31 (Round 18)
- **Body:** Voice-to-text date slips are a real transcript-drift class; a bare "March 31" with no day-of-week would write nonsense rest_days (e.g. −23) with no guard. Low-cost server-side guardrail: cupping_date follows roast_date, and computed rest_days matches supplied (modulo timezone).

### Per-batch failure-boundary breach record on experiments (JSONB array)
- **Shape:** schema
- **Recurrence:** 1
- **Criticality:** low
- **Status:** open
- **Source:** master log #6 (Round 4)
- **Body:** A JSONB array shape to record per-batch failure-boundary breaches on experiments. Plan-mode-sized; parked since Round 4.

## Open — MCP / infra

### `patch_roast` + `read_doc_section` intermittent execute-after-search failures
- **Shape:** mcp (infra)
- **Recurrence:** 2 (patch_roast + read_doc_section, same session; "surfaced in tool_search but errored on execution")
- **Criticality:** med
- **Status:** open
- **Source:** master log Round 1 #5 + #6
- **Body:** Tool resolves in search, errors on execution, succeeds on retry. Same signature on two tools → likely a deployment/cold-start class, not call-content. Needs Vercel-logs investigation at next pause (request IDs captured in the log).

### `push_cupping` body-length error (awaiting failure capture)
- **Shape:** mcp
- **Recurrence:** 1
- **Criticality:** low
- **Status:** open (triggered — needs next failure capture)
- **Source:** master log #7 (Round 5)
- **Body:** Triggered item; act when the next failure is captured with the payload.

## Open — prompt / doc-touch

### Anchor-confidence framing in new-bean-intake (now `start-lot.md`)
- **Shape:** prompt
- **Recurrence:** 1
- **Criticality:** low
- **Status:** open
- **Source:** master log #10 (Round 2 claude.ai #5)
- **Body:** Fold anchor-confidence framing into the V1-design template. Note: `new-bean-intake.md` was replaced by `start-lot.md` in the 4-prompt rewrite — retarget on action.

### `recipe_variant` lightweight-summary render on `/green/[id]`
- **Shape:** ui
- **Recurrence:** 1 (partially absorbed by Sub-sprint 4a)
- **Criticality:** low
- **Status:** open
- **Source:** master log #11 (Round 7 #4)
- **Body:** Small render polish — surface recipe_variant in the lightweight lot summary. Most of #11 shipped in Sub-sprint 4a; this remnant only if Chris re-flags.

## Open — data / migration (operator-run via MCP)

### Historical recipe→experiment FK + batch_slot backfill
- **Shape:** schema (data backfill)
- **Recurrence:** 1 (affects ~129 migration-052 rows across all lots)
- **Criticality:** med
- **Status:** open (deferred — Cleanup-B candidate)
- **Source:** master log #3 (Round 1)
- **Body:** All migration-052 `roast_recipes` rows have NULL `experiment_id` + `batch_slot`, silently breaking the recipe-grouped-by-V-set page surface for historical lots. Backfill via paste-and-patch from claude.ai (MCP-only-input rule).

### Historical `end_condition` backfill on reference roasts
- **Shape:** schema (data backfill)
- **Recurrence:** 1
- **Criticality:** low
- **Status:** open (triggered — fold into next close-lot)
- **Source:** master log #8 (Round 1)
- **Body:** Roasts ≤ batch-169 have NULL `end_condition_type` (pull_roest_log didn't surface it then; the API now does). Opportunistic re-pull + patch at next close-out; fold into `close-lot.md` STAGE 2.

---

## Routed elsewhere (recorded for the recurrence trail, not built here)

These were triaged to non-build homes; kept as one-liners so recurrence is visible if they
resurface (per the route-feedback dedup rule). Full detail in the master log.

- **claude.ai client approval-gating** (master log #14 / #15 / #16 / #21 — Rounds 15/16) → **Bucket C: surface to Anthropic, not Latent substrate.** High recurrence (multi-tool, multi-round: propose_doc_changes aggregate-payload/multi-citation gate; list_doc_sections tool-class gate; AskUserQuestion mobile echo). Strong tool-class-gating hypothesis. Not a Latent build — escalation, not a sprint.
- **`recipe_variant` canonical promotion** (master log #8 / Round 5) → parked canonical-promotion trigger (promote at 5+ distinct values across 3+ beans). Lives in `project_recipe_variant_canonical.md`.
- **`parse_cupping_transcript` voice-memo pipeline** (master log #9 / Round 5) → parked product candidate (`project_parse_cupping_transcript.md`); Chris executes manually today.
- **Brief-framing kitchen-state vs DB-state** (master log Round 1 #4) → standing-rule candidate (route to `memory/feedback_*.md` when confirmed).
