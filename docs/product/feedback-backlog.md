# Workflow-Feedback Backlog

*Last updated: 2026-07-15 (lifecycle-gate reconciliation grill shipped: #22 + #23 + #58 closed per ADR-0025 — SPG-pending composite ratified, winner-dependence partial-write rule, peer-cup gate demoted to advisory; new freezer-stock peer-roast reminder item filed. Earlier same day: MCP required-axis fix shipped — #57 + the SPG eval_method 2-row data patch flipped to shipped, PR #578; and the plan-feedback pass — claude.ai surface fully deprecated per Chris: Bucket C escalation + #49 + #51 + the Round-1 #5/#6 intermittents RETIRED; fc_audibility data-patch UNBLOCKED; #57 sub-issue (b) mooted by the 2026-07-10 single-connector canon.)*

The **actionable** subset of workflow feedback — the items that need a *build* (prompt
fix / MCP fix / schema / UI / architecture), not just a route-and-forget filing.
This is the seam between the [route-feedback](.claude/skills/route-feedback/SKILL.md)
skill (which files items here) and the [plan-feedback](.claude/skills/plan-feedback/SKILL.md)
skill (which clusters + prioritizes them into a buildable sprint).

**Master log** (raw intake + routing ledger + wins + non-actionable items):
`~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md`.
Terminal-home items (standing rules → memory, concepts → grilling-queue, etc.) are
NOT duplicated here; only buildable work lands here. See [ADR-0020](docs/adr/0020-feedback-handoff-pipeline.md)
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

> **Shipped 2026-07-15 (lifecycle-gate reconciliation grill / ADR-0025):** #22 (SPG lifecycle state) resolved as RATIFY-the-composite, no new state — SPG-pending = `lot_status: waiting_for_brewing` + the exact `winner` sentinel `deferred pending SPG`; two canonical sentinel strings (incl. `none - SPG eliminated all finalists` at a no-winner re-entry); the SPG process is not recorded, only the decisive cup-set re-enters. #23 (deferred proposals) resolved as the winner-dependence partial-write rule + `DEFERRED_PROPOSAL:` lines in the experiment's `additional_notes` (no queue table). Peer-cup gate demoted to a non-gating advisory (SPG is the only winner-deferring gate). See [docs/adr/0025-spg-pending-composite-encoding.md](docs/adr/0025-spg-pending-composite-encoding.md) + [docs/sprints/lifecycle-spg-reconciliation-completion.md](docs/sprints/lifecycle-spg-reconciliation-completion.md) + [docs/sprints/shipped.md](docs/sprints/shipped.md). Removed from the open list per the status lifecycle.

> **Shipped 2026-06-04 (#385, Cluster 2):** `cooling_arc_pattern` enum (#27), `cupping_date`/rest_days guard (#31), and `roast_recipe_divergence` view (#26) — see [docs/sprints/shipped.md](docs/sprints/shipped.md). Migration 078. Removed from the open list per the status lifecycle.

### Per-batch failure-boundary breach record on experiments (JSONB array)
- **Shape:** schema
- **Recurrence:** 1
- **Criticality:** low
- **Status:** open
- **Source:** master log #6 (Round 4)
- **Body:** A JSONB array shape to record per-batch failure-boundary breaches on experiments. Plan-mode-sized; parked since Round 4.

### roast-structure-inference-overridden-by-cup — candidate structured field
- **Shape:** schema (candidate / pattern-tracking)
- **Recurrence:** 1 (Round 21 S2#3; watch Mt Elgon 199, Higuito v1b)
- **Criticality:** low
- **Status:** open (observing — needs N=3 before building)
- **Source:** master log #36 (Round 21)
- **Body:** Roast-side `what_to_change` carries forward-looking inferences from structure alone; the cup occasionally inverts them (Bukure v2b "lengthen dev" vs SPG "minimal dev is the lever"). Candidate field `roast_structure_inference_overridden_by_cup`. Not asking for the field yet — track across lots; a third occurrence → CCIL-promotion-worthy. Pairs with the #22/#23 lifecycle-modeling meta-pattern.

## Open — MCP / infra

> **Resolved 2026-06-13 (#52 — by side-effect of the "MCP published-schema compat" ship, see [docs/sprints/shipped.md](docs/sprints/shipped.md)):** push_roast (and every numeric-field Tool) string-rejection shared the *same root cause* as the same-day (same lot, RWA-NOVA-AN10-RB-2026) schema-compat fix — `.optional().nullable()` numeric fields published as bare `anyOf:[T,null]` unions that Claude Code's client drops (claude-code#5844), leaving the field untyped so numerics serialized as strings → zod -32602 reject. [lib/mcp/schema-compat.ts](lib/mcp/schema-compat.ts) rewrites the published catalog globally (`anyOf [T,null]` → `type:[T,"null"]`, recursive, one `tools/list` wrap, no per-tool edits); the `check:mcp` gate now fails on any property lacking resolvable type info across the whole catalog (986 problems → 0). Verified in code: every field #52 named (`batch_size_g`/`agtron`/`charge_temp`/`drop_temp`/`end_condition_target`/`fc_total_cracks`/…) is `z.number().optional().nullable()` in [push-roast.ts](lib/mcp/push-roast.ts), exactly the shape the ship rewrites. Different mechanism than #52's proposed `z.coerce.number()`, same symptom gone. Removed from the open list per the status lifecycle. Flip is pending one live re-verification in the next fresh Coordinator session (existing sessions hold the stale catalog per the MCP-cache rule).

> **Shipped 2026-07-15 (#57 — MCP required-axis fix, PR [#578](https://github.com/chrismccann-dev/latent-coffee/pull/578), merge `d66af05`):** `patch_green_bean` over-required fields on a field-level patch. Root cause as pinned: `numField`/`boolField` in [lib/mcp/coerce.ts](lib/mcp/coerce.ts) buried `.optional()` INSIDE the `z.preprocess` wrap, so optionality never reached the published `required` array. Fixed by reordering the wrap (`.optional()` outside; coercion behavior verified unchanged — CC-bridge string scalars still coerce, explicit null passes). Published `required` now collapses to the true key sets: `patch_green_bean → ["green_bean_id"]` (was 6), `push_green_bean → ["lot_id","name"]` (was 7); all 38 tools audited. `check:mcp` gained the required-axis gate (any zod-optional field in a published `required` array fails, `safeParse(undefined)` detection + a `patch_green_bean.required == ["green_bean_id"]` canary; negative-tested: old coerce.ts reports 11 problems). Sub-issue (b) was already MOOT per the 2026-07-10 single-connector canon. Completion report: [docs/sprints/mcp-required-axis-fix-completion.md](docs/sprints/mcp-required-axis-fix-completion.md).

> **Retired 2026-07-15 (claude.ai-era stale):** `patch_roast` + `read_doc_section` intermittent execute-after-search failures (master log Round 1 #5 + #6). Observed once on the claude.ai client in Round 1; zero recurrence across 24 subsequent rounds, and the claude.ai surface is now fully deprecated. Re-file only if the signature recurs on a Claude Code session (the server-side cold-start hypothesis would then be back in play).

### `push_cupping` body-length error (awaiting failure capture)
- **Shape:** mcp
- **Recurrence:** 1
- **Criticality:** low
- **Status:** open (triggered — needs next failure capture)
- **Source:** master log #7 (Round 5)
- **Body:** Triggered item; act when the next failure is captured with the payload.

### `execute_sql` doc references are ambiguous (separate Supabase MCP server, not always connected)
- **Shape:** mcp (doc accuracy)
- **Recurrence:** 1 (surfaced by the Cluster-2 build §5, 2026-06-04)
- **Criticality:** low
- **Status:** open
- **Source:** Cluster-2 completion report §5; flagged by Chris on close-out
- **Body:** CLAUDE.md § Local Verification Fallbacks, ARBITER.md, and the kickoff-brief template reference an MCP `execute_sql` for DB work, but it is NOT in the latent-coffee MCP server's 35 Tools — it comes from a **separately-connected Supabase MCP server** (project `uhqxyxglyuhmpxegqsrt`, per `memory/reference_supabase_project_id.md`) that Chris connects on some sessions, not all. The references read as always-available. Fix: clarify them as "the Supabase MCP `execute_sql` *when that server is connected*" + name the fallback (a `.select('<col>')` PostgREST probe with the service-role key) for sessions without it. Not env-dependent-stale, just under-specified.

> **Shipped 2026-06-06 (#418, plan-feedback Sprint 1 / #33 keystone):** per-lot-file-registration arbiter-ticket flow (option (b)) — close-out STAGE 5 emits a standardized ticket; new ARBITER.md `## Per-lot file registration tickets` section (P1-P6) registers + seeds the net-new per-lot learnings/calibrations file under the whitelisted `learnings/` + `one-shot-calibrations/` prefixes; propose_doc_changes rejection message now points at the ticket flow. See [docs/sprints/shipped.md](docs/sprints/shipped.md) + completion report. Removed from the open list per the status lifecycle.

### propose_doc_changes append has no mid-section placement
- **Shape:** mcp (schema)
- **Recurrence:** 1 (Round 21 S1#2)
- **Criticality:** med
- **Status:** open
- **Source:** master log #34 (Round 21)
- **Body:** append lands at end-of-section (only signal is `section_anchor`; `current_text_match` ignored for append). Mid-list per-lot pointers can't be placed precisely. Ask: a `position_anchor` (sub-anchor / list-item indicator) for append, or confirm REPLACE is the only mid-section path. Part of the doc-write-ergonomics cluster (with #33, #41, #45, #50).

### get_bean_pipeline should surface drop rules in pre-roast confirmation
- **Shape:** mcp (Tool / UI surface)
- **Recurrence:** 1 (Round 21 S5)
- **Criticality:** low
- **Status:** open
- **Source:** master log #37 (Round 21)
- **Body:** drop_rule_if_fast/slow are stored but invisible unless you read the recipe row; surfacing them in the pre-roast confirmation block (or waiting-for-next-roast UI) makes a null as visible as a null predicted_cup. Pairs with #40 (drop rules required for control experiments).

### experiment_id closest_match collision hint
- **Shape:** mcp (Tool guidance)
- **Recurrence:** 1 (Round 21 S4)
- **Criticality:** low
- **Status:** open
- **Source:** master log #38 (Round 21)
- **Body:** Apply the accept-and-warn/closest_match pattern to `experiment_id` reuse — warn when an experiment_id is reused with a different green_bean_id (catches cross-lot copy-paste). Extends the shipped #28a accept-and-warn work.

> **Retired 2026-07-15 (claude.ai surface deprecated):** push_brew tool_search ranking boost (master log #49, Round 22). The mis-ranking was observed on the claude.ai client's tool_search; brewing is now 100% Claude Code (`/brew` skill, retired claude.ai brewing 2026-06-18) and the bundled-brewing-completion pre-warm covers discovery. Re-file if Claude Code's ToolSearch shows the same wrong-parameter-set recall.

### Net-new per-lot file-registration ticket lives outside the MCP write surface — make it trackable
- **Shape:** arch (schema/surface) + mcp
- **Recurrence:** 1 (Round 24 / Item 4)
- **Criticality:** med
- **Status:** open
- **Source:** master log #55 (Round 24); follow-on gap after shipped #33/#418
- **Body:** The #33/#418 arbiter-ticket flow (option b) shipped the *creation* path for net-new per-lot learnings/calibrations files, but the emitted ticket lives entirely outside MCP — a fenced block the operator hand-routes to a Claude Code arbiter session. Seam: the lot is "Resolved" in the DB the moment STAGE 6 archives inventory, yet the closed-lot learnings file doesn't exist until the ticket is processed separately, so the resolved-view "see closed-lot learnings" pointer (proposal 1/3) dangles if the ticket is lost. The only record the ticket was emitted is chat. Ask: (a) a lightweight `pending_file_registrations` table the close-lot prompt writes to (dangling-pointer risk becomes queryable), or (b) surface unprocessed tickets where the operator sees them. **Distinct from #33** (creation, shipped) — this is the tracking/visibility gap. Part of the doc-write-ergonomics cluster; the close-out-fan-out seam.

## Open — prompt / doc-touch

> **Shipped 2026-07-15 (roasting-prompt-hygiene batch — 10 items, one PR):** #10 (anchor-confidence framing → start-lot.md STAGE 2), #40 (drop rules REQUIRED per slot → start-lot STAGE 3(b) + log-cupping STAGE 6(b)), #41 (seed-then-bump CCIL sub-rule → log-cupping STAGE 7), #42 (close-lot STAGE 3↔4 reorder: brew link now BEFORE roast_learnings; cross-refs updated repo-wide), #43a/b/c (auto-split granularity code-verified + soft-retire = h1 status-block region only + STAGE 2 drop-attribution confirm → close-lot.md), #44 (five clarity additions → log-cupping), #45a/b (SPG note homed in `overall` + append-accepts-new-H2 documented), #47 (N=2 cross-one-shot stays below CCIL bar → one-shot-closeout STAGE 5), #50 (net-new roaster-card append spec → bundled-brewing-completion STEP 2), #53 (resume-after-compaction preamble → close-lot + one-shot-closeout STAGE 5). See [docs/sprints/shipped.md](docs/sprints/shipped.md) + [docs/sprints/roasting-prompt-hygiene-batch-completion.md](docs/sprints/roasting-prompt-hygiene-batch-completion.md). Removed from the open list per the status lifecycle.

> **Shipped 2026-07-15 (lifecycle-gate reconciliation grill / ADR-0025):** #58 both facets closed. Facet 1 (lot_status flip): log-cupping Path C (formerly C-2) now writes the SPG handoff pair — `winner` sentinel at STAGE 4.3 + `patch_green_bean(lot_status: 'waiting_for_brewing')` — landing the `check:lifecycle-consistency` designed exception. Facet 2 (SPG-note field): already resolved by the same-day hygiene batch (#45a, option (c)) — the note lives in the cupping's `overall` prose behind the `SPG:` prefix with `eval_method` as the grep key; the grill ratified that choice. Path C-2/C-1 route labels retired: peer-cup gate demoted to advisory, SPG is the only Path C. See [docs/sprints/lifecycle-spg-reconciliation-completion.md](docs/sprints/lifecycle-spg-reconciliation-completion.md). Removed from the open list per the status lifecycle.

### Freezer-stock peer-roast reminder for active green lots
- **Shape:** ui (cross-inventory surfacing)
- **Recurrence:** 1 (lifecycle-gate reconciliation grill, 2026-07-15)
- **Criticality:** low
- **Status:** open
- **Source:** Chris, mid-grill (peer-cup advisory discussion)
- **Body:** Now that the peer cup is a non-gating advisory (ADR-0025), the useful automation is the *reminder*: when a peer-roasted variant of an ACTIVE green lot (same green, per § Information value ideally compatible roast philosophy) sits in freezer stock (`docs/brewing/freezer-stock.md`), surface "you have a peer-roasted reference for <lot> in the freezer — consider cupping it for calibration." Candidate surfaces: log-cupping route-time advisory line, `/green/[id]` detail, or the green-inventory re-rank pass. Chris: "latent can remind me if I have one of those in my freezer lot."

### `recipe_variant` lightweight-summary render on `/green/[id]`
- **Shape:** ui
- **Recurrence:** 1 (partially absorbed by Sub-sprint 4a)
- **Criticality:** low
- **Status:** open
- **Source:** master log #11 (Round 7 #4)
- **Body:** Small render polish — surface recipe_variant in the lightweight lot summary. Most of #11 shipped in Sub-sprint 4a; this remnant only if Chris re-flags.

> **Retired 2026-07-15 (claude.ai surface deprecated):** initial brief should fetch live substrate, not project-uploaded snapshot (master log #51, Round 22). "Project-uploaded files" are a claude.ai-project concept; Claude Code sessions read the repo/live docs directly, so the stale-snapshot failure mode has no surface anymore. The standing rule "fetch current_text live immediately before drafting" survives in memory and still applies.

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

> **Shipped 2026-07-15 (#48 data-patch — live verification of the MCP required-axis fix, PR [#578](https://github.com/chrismccann-dev/latent-coffee/pull/578)):** the 2 SPG cuppings (`a3946b27-6a9d-405f-b49c-c4920b85c0af` + `d8f814c8-3976-4018-b93f-86c4240873b5`, Bukure RWA-NOVA-NAT21-RB-2026, cupping_date 2026-06-04) patched `eval_method: 'Pourover' → 'Simulated Pourover'` via the NEW `patch_cupping` `cupping_id` direct-lookup path against the deployed production Tool; both rows re-read and confirmed. `recipe_variant` (`real_pourover`) + the SPG flag in `overall` prose left untouched per the conservative read of #48. This was patch_cupping's first key-field change — previously impossible (composite mode can only write back what it matched).

> **Shipped 2026-07-15 (plan-feedback pass, no PR — MCP data patches):** fc_audibility ambiguous → did_not_fire on Batch 193 (`f4ef106f`, Bukure RWA-NOVA-NAT21-RB-2026) + Wush Wush V2 batches 206/207/208 (`13cbc569` / `18afda8a` / `58324a4b`). Migration 079 verified applied via `check:migrations` (84/84); all four rows had fc_start/fc_temp/dev_time_s already NULL (068 co-rule satisfied); patched via `patch_roast`, `updated_fields:["fc_audibility"]` echoed on all four — which also live-verified 079's constraint accepts `did_not_fire` (the original #35 rejection).

---

## Routed elsewhere (recorded for the recurrence trail, not built here)

These were triaged to non-build homes; kept as one-liners so recurrence is visible if they
resurface (per the route-feedback dedup rule). Full detail in the master log.

- **claude.ai client approval-gating** (master log #14 / #15 / #16 / #21 — Rounds 15/16) → ~~Bucket C: surface to Anthropic~~ **RETIRED 2026-07-15: claude.ai surface fully deprecated (Chris), so the escalation is moot — the client these gates lived in is no longer a workflow surface.** The auto-split-per-citation pattern (direction b) that worked around #15 remains the standing close-out shape regardless.
- **`recipe_variant` canonical promotion** (master log #8 / Round 5) → parked canonical-promotion trigger (promote at 5+ distinct values across 3+ beans). Lives in `project_recipe_variant_canonical.md`.
- **`parse_cupping_transcript` voice-memo pipeline** (master log #9 / Round 5) → parked product candidate (`project_parse_cupping_transcript.md`); Chris executes manually today.
- **Brief-framing kitchen-state vs DB-state** (master log Round 1 #4) → standing-rule candidate (route to `memory/feedback_*.md` when confirmed).
