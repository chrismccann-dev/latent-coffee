# Workflow-Feedback Backlog

*Last updated: 2026-07-15 (plan-feedback pass — claude.ai surface fully deprecated per Chris: Bucket C escalation + #49 + #51 + the Round-1 #5/#6 intermittents RETIRED; fc_audibility data-patch UNBLOCKED (migration 079 verified applied via `check:migrations`); #57 sub-issue (b) mooted by the 2026-07-10 single-connector canon + root cause pinned to the `numField` `z.preprocess` wrapper. Prior 2026-06-20: Round 25 filed #57 + #58; partial-build note on #22.)*

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

### SPG / calibration-gate is not a first-class lifecycle state
- **Shape:** arch (schema/lifecycle)
- **Recurrence:** 5+ (Gesha Clouds V3, 2nd SPG lot, Bukure V2; reinforced by the one-shot defer-verdict gap #30 and the deferred-proposals gap below)
- **Criticality:** high
- **Status:** planned (2026-07-15 — [docs/sprints/lifecycle-spg-reconciliation-grilling-kickoff.md](docs/sprints/lifecycle-spg-reconciliation-grilling-kickoff.md))
- **Source:** master log #22 (Round 17), reinforced #30 (Round 18)
- **Body:** When SPG (Simulated Pourover Gate) / any C-path calibration gate fires mid-V-set, the lot sits in a state distinct from both "winner declared" and "advance to V_(n+1)" — winner null, brew-side confirmation pending. Only encoded in prose today. Candidates: `lifecycle_state` enum (`waiting_for_spg`) on experiments, or a lightweight `gates` table `(green_bean_id, gate_type, status)`. This is the **lifecycle-gate-not-modeled meta-pattern** — the single highest-recurrence theme in the backlog; it spans V-set (SPG) AND one-shot (defer-verdict) paths. Tagged in `issues.md` as a Lot Coordinator + V-Set Assistant sprint concern.
  - **Partial build (2026-06-20, AN10 dogfood):** migration-080's stored `waiting_for_brewing` state is now the de-facto SPG-handoff home (the lot sits there while the brew-side SPG runs) and is wired end-to-end. It's not a `waiting_for_spg`-specific state — it conflates SPG with optimized-brew — but it does give the gate a queryable, rendered home, partially addressing this entry. The remaining gap is the SPG-specific distinction + the winner-sentinel fooling the derivation (see the new prompt entry below). The prompt drift it created is filed separately under prompt/doc-touch.

### Deferred-proposals queue + partial-proposal gap during a calibration gate
- **Shape:** arch (workflow/lifecycle)
- **Recurrence:** 2 (Round 17; echoes an earlier log-roast partial-proposal flag)
- **Criticality:** high
- **Status:** planned (2026-07-15 — [docs/sprints/lifecycle-spg-reconciliation-grilling-kickoff.md](docs/sprints/lifecycle-spg-reconciliation-grilling-kickoff.md))
- **Source:** master log #23 (Round 17)
- **Body:** `log-cupping.md` STAGE 6's binary skip/propose during a gate defers ALL doc proposals to post-SPG re-entry, including cupping-INDEPENDENT ones that could land now (the V_n status flip, SPG-independent cup findings, a CCIL violation). Consequence: the active-lot doc reads "designed/pushed, not roasted" when it was in fact cupped. Needs a real-time partial-write rule + an explicit "deferred proposals" queue concept. Pairs tightly with the SPG lifecycle-state item.

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

### `patch_green_bean` over-requires fields on a field-level patch + the two registrations disagree
- **Shape:** mcp (schema)
- **Recurrence:** 1 (Round 25 / AN10 SPG handoff, 2026-06-20)
- **Criticality:** med
- **Source:** master log #57 (Round 25)
- **Status:** planned (2026-07-15 — [docs/sprints/mcp-required-axis-fix-kickoff.md](docs/sprints/mcp-required-axis-fix-kickoff.md))
- **Body:** `patch_green_bean` is a field-level mutation ("only fields you supply are updated") yet the typed `eeaa2042` registration marks SIX fields `required` — `green_bean_id` + `price_per_kg` + `quantity_g` + `elevation_m` + `roast_priority` + `roest_inventory_id` — so a `lot_status`-only change forces collateral writes AND a `roast_priority` null-clobber (the auto-mode classifier correctly blocked it as unconsented data loss). Sibling of #52 (same "MCP schema publication" family — #52 was the type-axis, resolved 2026-06-13 by [schema-compat.ts](lib/mcp/schema-compat.ts); this is the required-axis, which that fix did not touch).
  - **Root cause pinned (2026-07-15 plan-feedback pass, code-verified):** the 5 over-required fields are exactly the `numField(...)` fields in [lib/mcp/coerce.ts](lib/mcp/coerce.ts) — the inner schema IS `.optional().nullable()`, but it sits inside a `z.preprocess(...)` wrapper, and the optionality doesn't propagate to the published object-level `required` array. Fix direction: make preprocess-wrapped optional fields publish as optional (wrap-order fix in `numField`/`boolField`, or extend `schema-compat.ts` to strip them from `required`). Affects every Tool using `numField`/`boolField`, not just patch_green_bean — audit the family in the same pass.
  - **Sub-issue (b) MOOT (2026-07-15):** the "two registrations publish divergent `required` arrays" facet dissolved with the 2026-07-10 connector canon — the desktop-local `latent-coffee` registration is deprecated/removed; the single account-level connector is the only registration. Only facet (a) remains.

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

### log-cupping Path C-2 needs a schema-reconciliation pass (lot_status flip + SPG-note field)
- **Shape:** prompt (doc reconciliation)
- **Recurrence:** 2 (Round 25 / AN10 V1 SPG handoff + SPG return, 2026-06-20/21 — two distinct Path C-2 prompt-vs-schema mismatches in one V-set)
- **Criticality:** med
- **Source:** master log #58 (Round 25)
- **Status:** planned (2026-07-15 — [docs/sprints/lifecycle-spg-reconciliation-grilling-kickoff.md](docs/sprints/lifecycle-spg-reconciliation-grilling-kickoff.md))
- **Body:** Path C-2's prose has drifted from the current schema in two places; reconcile both in one pass. **(1) lot_status flip:** Path C-2 says "state stays Waiting for next cupping" on an SPG handoff, but migration-080 added a stored `waiting_for_brewing` state now wired end-to-end (green index section + `--tile-brewing` color + "In brewing" label + `green/[id]/page.tsx:200` render branch reusing `WaitingForNextCuppingView` + the `check:lifecycle-consistency` designed exception `stored=waiting_for_brewing` / `derived=waiting_for_next_roast`). Leaving `lot_status` at `waiting_for_next_cupping` actually REDDENS the consistency cron — the `"deferred pending SPG"` winner sentinel pushes derived → `waiting_for_next_roast`, so only `waiting_for_brewing` lands the designed exception. Fix: Path C-2 should flip `lot_status` → `waiting_for_brewing` at the SPG / optimized-brew handoff (re-entry still via log-cupping). Catches the prompt up to a state that now exists — see the partial-build note on #22. **(2) SPG-note field doesn't exist:** Path C-2 says SPG recipe metadata "goes in `additional_notes` … `SPG: brewed alongside <finalist sibling roast_id> at <recipe>`," but the **cuppings table has no `additional_notes` column** (`push_cupping` exposes no such field). On the AN10 SPG return the per-finalist recipe + sibling pairing was routed to the *experiment's* `additional_notes` instead, and `eval_method: 'Simulated Pourover'` already makes the SPG cups queryable. Fix: pick one and update Path C-2 to match — (a) point it at the experiment `additional_notes` and lean on `eval_method` as the grep key, (b) add a `cuppings.additional_notes` column, or (c) name a real cupping prose field (`overall` / `structural_behavior`) for the canonical phrasing. Both facets share one root: Path C-2 prose written independent of the migration-080 + cuppings schema reality.

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

### Data-patch: 2 SPG cuppings recipe_variant → eval_method
- **Shape:** schema (data-patch)
- **Recurrence:** 1 (Round 21 S2#1 + S6#7)
- **Criticality:** low
- **Status:** planned (2026-07-15 — folded into [docs/sprints/mcp-required-axis-fix-kickoff.md](docs/sprints/mcp-required-axis-fix-kickoff.md) as the live-verification step: patch_cupping cannot change its own composite-key `eval_method` today, so the tool gains a `cupping_id` key-field path first)
- **Source:** master log #48 (Round 21)
- **Body:** Two pre-migration SPG cuppings (`a3946b27-6a9d-405f-b49c-c4920b85c0af` + `d8f814c8-3976-4018-b93f-86c4240873b5`) carry the SPG flag in recipe_variant/overall and should be patched to the canonical `eval_method` field now the migration is live.

> **Shipped 2026-07-15 (plan-feedback pass, no PR — MCP data patches):** fc_audibility ambiguous → did_not_fire on Batch 193 (`f4ef106f`, Bukure RWA-NOVA-NAT21-RB-2026) + Wush Wush V2 batches 206/207/208 (`13cbc569` / `18afda8a` / `58324a4b`). Migration 079 verified applied via `check:migrations` (84/84); all four rows had fc_start/fc_temp/dev_time_s already NULL (068 co-rule satisfied); patched via `patch_roast`, `updated_fields:["fc_audibility"]` echoed on all four — which also live-verified 079's constraint accepts `did_not_fire` (the original #35 rejection).

---

## Routed elsewhere (recorded for the recurrence trail, not built here)

These were triaged to non-build homes; kept as one-liners so recurrence is visible if they
resurface (per the route-feedback dedup rule). Full detail in the master log.

- **claude.ai client approval-gating** (master log #14 / #15 / #16 / #21 — Rounds 15/16) → ~~Bucket C: surface to Anthropic~~ **RETIRED 2026-07-15: claude.ai surface fully deprecated (Chris), so the escalation is moot — the client these gates lived in is no longer a workflow surface.** The auto-split-per-citation pattern (direction b) that worked around #15 remains the standing close-out shape regardless.
- **`recipe_variant` canonical promotion** (master log #8 / Round 5) → parked canonical-promotion trigger (promote at 5+ distinct values across 3+ beans). Lives in `project_recipe_variant_canonical.md`.
- **`parse_cupping_transcript` voice-memo pipeline** (master log #9 / Round 5) → parked product candidate (`project_parse_cupping_transcript.md`); Chris executes manually today.
- **Brief-framing kitchen-state vs DB-state** (master log Round 1 #4) → standing-rule candidate (route to `memory/feedback_*.md` when confirmed).
