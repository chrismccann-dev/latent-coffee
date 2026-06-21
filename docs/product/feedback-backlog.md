# Workflow-Feedback Backlog

*Last updated: 2026-06-20 (Round 25 — filed #57 patch_green_bean required-set + #58 SPG-lifecycle prompt drift, both from the AN10 V1 cupping/SPG dogfood; partial-build note added to the #22 lifecycle entry). Prior 2026-06-15: write-path-hardening sprint SHIPPED - #54 op/operation alias + #56 push_brew FK-inherit + #46 patch_inventory pre-load hint removed; #52 resolved-by-side-effect of the 2026-06-13 schema-compat ship; Round 24 filed #53-#56.)*

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
- **Status:** open
- **Source:** master log #22 (Round 17), reinforced #30 (Round 18)
- **Body:** When SPG (Simulated Pourover Gate) / any C-path calibration gate fires mid-V-set, the lot sits in a state distinct from both "winner declared" and "advance to V_(n+1)" — winner null, brew-side confirmation pending. Only encoded in prose today. Candidates: `lifecycle_state` enum (`waiting_for_spg`) on experiments, or a lightweight `gates` table `(green_bean_id, gate_type, status)`. This is the **lifecycle-gate-not-modeled meta-pattern** — the single highest-recurrence theme in the backlog; it spans V-set (SPG) AND one-shot (defer-verdict) paths. Tagged in `issues.md` as a Lot Coordinator + V-Set Assistant sprint concern.
  - **Partial build (2026-06-20, AN10 dogfood):** migration-080's stored `waiting_for_brewing` state is now the de-facto SPG-handoff home (the lot sits there while the brew-side SPG runs) and is wired end-to-end. It's not a `waiting_for_spg`-specific state — it conflates SPG with optimized-brew — but it does give the gate a queryable, rendered home, partially addressing this entry. The remaining gap is the SPG-specific distinction + the winner-sentinel fooling the derivation (see the new prompt entry below). The prompt drift it created is filed separately under prompt/doc-touch.

### Deferred-proposals queue + partial-proposal gap during a calibration gate
- **Shape:** arch (workflow/lifecycle)
- **Recurrence:** 2 (Round 17; echoes an earlier log-roast partial-proposal flag)
- **Criticality:** high
- **Status:** open
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
- **Status:** open
- **Body:** `patch_green_bean` is a field-level mutation ("only fields you supply are updated") yet the typed `eeaa2042` registration marks SIX fields `required` — `green_bean_id` + `price_per_kg` + `quantity_g` + `elevation_m` + `roast_priority` + `roest_inventory_id` — so a `lot_status`-only change forces collateral writes AND a `roast_priority` null-clobber (the auto-mode classifier correctly blocked it as unconsented data loss). The `latent-coffee` registration of the same tool requires ONLY `green_bean_id` (that was the clean path used to set AN10's `waiting_for_brewing`). Two distinct problems: (a) a patch tool shouldn't require unrelated fields — the 5 over-required fields are almost certainly `.nullable()` without `.optional()` in the zod schema (nullable ≠ optional → published as required); make them `.optional().nullable()` so the required set collapses to `[green_bean_id]`; (b) the two registrations publish divergent `required` arrays. Sibling of #52 (same "MCP schema publication" family — #52 was the type-axis, resolved 2026-06-13 by [schema-compat.ts](lib/mcp/schema-compat.ts); this is the required-axis, which that fix did not touch).

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

### push_brew tool_search ranking boost
- **Shape:** mcp (tool-discovery ranking)
- **Recurrence:** 1 (Round 22 Item 1)
- **Criticality:** low
- **Status:** open
- **Source:** master log #49 (Round 22)
- **Body:** Both `push_brew` (literal) and "INSERT CREATE new brew row primary write path" (descriptive) initially returned the tool with the *wrong parameter set*; two searches with full descriptive phrasing needed to load the correct schema. Pre-warm in bundled-brewing-completion.md prevents an empty-recall loop but the mis-ranking still burns one tool_search. Ask: keyword boost on push_brew when query tokens "new brew row" / "primary write path" are present. Distinct from #46 (wrong-result ranking, not latency). Part of catch-time→hint-time cluster (with #51).

### Net-new per-lot file-registration ticket lives outside the MCP write surface — make it trackable
- **Shape:** arch (schema/surface) + mcp
- **Recurrence:** 1 (Round 24 / Item 4)
- **Criticality:** med
- **Status:** open
- **Source:** master log #55 (Round 24); follow-on gap after shipped #33/#418
- **Body:** The #33/#418 arbiter-ticket flow (option b) shipped the *creation* path for net-new per-lot learnings/calibrations files, but the emitted ticket lives entirely outside MCP — a fenced block the operator hand-routes to a Claude Code arbiter session. Seam: the lot is "Resolved" in the DB the moment STAGE 6 archives inventory, yet the closed-lot learnings file doesn't exist until the ticket is processed separately, so the resolved-view "see closed-lot learnings" pointer (proposal 1/3) dangles if the ticket is lost. The only record the ticket was emitted is chat. Ask: (a) a lightweight `pending_file_registrations` table the close-lot prompt writes to (dangling-pointer risk becomes queryable), or (b) surface unprocessed tickets where the operator sees them. **Distinct from #33** (creation, shipped) — this is the tracking/visibility gap. Part of the doc-write-ergonomics cluster; the close-out-fan-out seam.

## Open — prompt / doc-touch

### log-cupping Path C-2 needs a schema-reconciliation pass (lot_status flip + SPG-note field)
- **Shape:** prompt (doc reconciliation)
- **Recurrence:** 2 (Round 25 / AN10 V1 SPG handoff + SPG return, 2026-06-20/21 — two distinct Path C-2 prompt-vs-schema mismatches in one V-set)
- **Criticality:** med
- **Source:** master log #58 (Round 25)
- **Status:** open
- **Body:** Path C-2's prose has drifted from the current schema in two places; reconcile both in one pass. **(1) lot_status flip:** Path C-2 says "state stays Waiting for next cupping" on an SPG handoff, but migration-080 added a stored `waiting_for_brewing` state now wired end-to-end (green index section + `--tile-brewing` color + "In brewing" label + `green/[id]/page.tsx:200` render branch reusing `WaitingForNextCuppingView` + the `check:lifecycle-consistency` designed exception `stored=waiting_for_brewing` / `derived=waiting_for_next_roast`). Leaving `lot_status` at `waiting_for_next_cupping` actually REDDENS the consistency cron — the `"deferred pending SPG"` winner sentinel pushes derived → `waiting_for_next_roast`, so only `waiting_for_brewing` lands the designed exception. Fix: Path C-2 should flip `lot_status` → `waiting_for_brewing` at the SPG / optimized-brew handoff (re-entry still via log-cupping). Catches the prompt up to a state that now exists — see the partial-build note on #22. **(2) SPG-note field doesn't exist:** Path C-2 says SPG recipe metadata "goes in `additional_notes` … `SPG: brewed alongside <finalist sibling roast_id> at <recipe>`," but the **cuppings table has no `additional_notes` column** (`push_cupping` exposes no such field). On the AN10 SPG return the per-finalist recipe + sibling pairing was routed to the *experiment's* `additional_notes` instead, and `eval_method: 'Simulated Pourover'` already makes the SPG cups queryable. Fix: pick one and update Path C-2 to match — (a) point it at the experiment `additional_notes` and lean on `eval_method` as the grep key, (b) add a `cuppings.additional_notes` column, or (c) name a real cupping prose field (`overall` / `structural_behavior`) for the canonical phrasing. Both facets share one root: Path C-2 prose written independent of the migration-080 + cuppings schema reality.

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

### drop_rule_if_fast/slow REQUIRED for control experiments + end-condition sweeps
- **Shape:** prompt
- **Recurrence:** 1 (Round 21 S5)
- **Criticality:** med
- **Status:** open
- **Source:** master log #40 (Round 21)
- **Body:** log-roast/start-lot STAGE 6 should mark drop_rule_if_fast/slow required per slot when the experiment varies end_condition_target, varies a lever with per-slot pre-FC/stall divergence, or leaves slots at different fast/slow risk. They're the day-of manual-override runbook; skipping defeats design-intent-frozen-at-creation. Pairs with #37 (surface drop rules pre-roast).

### log-cupping STAGE 6 seed-then-bump CCIL sub-rule
- **Shape:** prompt (sub-rule)
- **Recurrence:** 1 (Round 21 S2#5)
- **Criticality:** low
- **Status:** open
- **Source:** master log #41 (Round 21)
- **Body:** When a prior session seeded a Low-confidence pending-cup CCIL entry and this session resolves it, prefer REPLACE on the existing entry (bump confidence, drop provisional hedges, add resolution evidence) over creating a new entry. Part of the doc-write-ergonomics cluster.

### close-lot STAGE 4-before-STAGE 3 ordering (brew-insight invalidation)
- **Shape:** prompt (workflow ordering)
- **Recurrence:** 1 (Round 21 S6#3)
- **Criticality:** med
- **Status:** open
- **Source:** master log #42 (Round 21)
- **Body:** Brewing dial-in can surface insights (honeycomb) that invalidate roast_learnings carry-forward written seconds earlier; the SPG packet doesn't always predict them. Fix: re-order STAGE 4 (link+read brew) before STAGE 3 (push roast_learnings), OR add a formal STAGE 4.5 patch step.

### close-lot STAGE 5 clarification bundle
- **Shape:** prompt (clarification)
- **Recurrence:** 1 (Round 21 S6#4-6)
- **Criticality:** low
- **Status:** open
- **Source:** master log #43 (Round 21)
- **Body:** Three ambiguities: (a) when auto-split fires, does it produce one call per (target_doc, section_anchor) globally or still bundle within-target_doc citations; (b) active-lot soft-retire "empty-replace working-hypothesis prose body" = H1 status-block region (H2 preserved) vs each H2 body — operator chose (a), preserve H2 as historical/cross-ref anchors; (c) STAGE 2 should ask the operator to confirm drop attribution when end_condition_type=manual pairs with a drop temp meaningfully under the designed bean_temp trigger (Batch 194 provisional).

### log-cupping/log-roast prompt-clarity bundle
- **Shape:** prompt
- **Recurrence:** 1 (Round 21 S2#2, S2#4, S3#3, S3#4, S3#6)
- **Criticality:** low
- **Status:** open
- **Source:** master log #44 (Round 21)
- **Body:** Five small prompt additions: Path A affirmative-confirmation line ("✓ N V-sets / ✓ xbloom / ✓ SPG cup-set"); key_insight_confidence ladder worked example (Medium-High requires N≥3 within-lot OR N≥2 cross-lot + falsifier); cooling_arc_pattern per-value example each (esp. flat-vs-hold); "on re-entry from a calibration gate, re-assess the candidate flag"; "control experiment can be a single-variable sweep within an identified lever."

### SPG schema-note + append-then-new-H2 documentation
- **Shape:** prompt (schema-note + doc)
- **Recurrence:** 1 (Round 21 S2#1 note-part, S2#6)
- **Criticality:** low
- **Status:** open
- **Source:** master log #45 (Round 21)
- **Body:** (a) tighten the cupping schema-note to specify WHERE the SPG free-text note goes ("SPG flag in `overall`, freetext-prefixed"); (b) document in propose_doc_changes notes that an append op accepts new H2+ headers in the text — they land as new sections positioned relative to subsequent section boundaries. Part of the doc-write-ergonomics cluster.

### N=2-cleanly-replicated-hypothesis CCIL-promotion rule clarity
- **Shape:** prompt (rule clarification)
- **Recurrence:** 1 (Round 21 S1#4)
- **Criticality:** low
- **Status:** open
- **Source:** master log #47 (Round 21)
- **Body:** Does a single hypothesis replicated across two one-shots (full-energy + 125°C-hopper correction; warm-peak/cool-degrade) earn a CCIL contribution at one-shot close-out, given the "Medium-High or High required" rule + the "single-lot Low shouldn't push to CCIL" rule? Conservative move taken (held in general_takeaway). Judgment territory — needs an explicit rule line.

### net-new roaster-card append convention not in the spec
- **Shape:** prompt (operational-guide / brewing-completion spec)
- **Recurrence:** 1 (Round 22 Item 2)
- **Criticality:** low
- **Status:** open
- **Source:** master log #50 (Round 22)
- **Body:** Adding a brand-new roaster card (no existing section) wasn't obvious from the operational-guide spec; targeting a non-existent `section_anchor` got an unresolved-anchor + a closest_match pointing at a *different* roaster. Preflight surfaced it fast (working as intended). Ask: spec line — "for net-new roaster cards, append after the last existing card section, or to the file-level h1 anchor." Sibling of #34/#45; part of the doc-write-ergonomics cluster.

### initial brief should fetch live substrate, not project-uploaded snapshot
- **Shape:** prompt (brief-step guardrail)
- **Recurrence:** 1 (Round 22 Item 3)
- **Criticality:** med
- **Status:** open
- **Source:** master log #51 (Round 22)
- **Body:** v1 strategy reasoning referenced the project-uploaded Brewing_v8_4.md snapshot (no Terraform card); live taxonomy roasters.md already had the Terraform Coffee Roasters card. End-of-brew workflow caught it via live-fetch; the *initial* brief did not. Reinforces the standing rule "current_text for replace ops must be fetched live immediately before drafting — never from project-uploaded files." Ask: brief-generation guardrail so the upfront brief fetches live too. Part of catch-time→hint-time cluster (with #49).

### close-lot/one-shot-closeout STAGE 5 resume-after-compaction note
- **Shape:** prompt
- **Recurrence:** 1 (Round 24 / Item 1)
- **Criticality:** med
- **Status:** open
- **Source:** master log #53 (Round 24)
- **Body:** A mid-close-out compaction + trigger re-send can naively re-run STAGES 1-4 (re-patch the reference roast, re-push roast_learnings, re-issue Calls 1-2). All idempotent (roast_learnings UPSERT, proposal auto-supersede per (target_doc, section_anchor), patch_* echoes) so re-run is safe but wasteful/noisy. Ask: a one-line "resuming a partially-completed close-out" preamble in close-lot.md / one-shot-closeout.md STAGE 5 — check roast_learnings existence + existing proposal_ids by (target_doc, section_anchor) before re-issuing. The data model already tolerates it; the guidance makes resume explicit. Part of the resume-safety / idempotency-is-implicit cluster (with #55 — the one non-idempotent seam).

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
- **Status:** open (actionable — `eval_method='Simulated Pourover'` migration is live, confirmed S3#2)
- **Source:** master log #48 (Round 21)
- **Body:** Two pre-migration SPG cuppings (`a3946b27-6a9d-405f-b49c-c4920b85c0af` + `d8f814c8-3976-4018-b93f-86c4240873b5`) carry the SPG flag in recipe_variant/overall and should be patched to the canonical `eval_method` field now the migration is live.

### Data-patch: fc_audibility ambiguous → did_not_fire backfill (Batch 193 + Wush Wush V2 206/207/208) (blocked on migration 079)
- **Shape:** schema (data-patch)
- **Recurrence:** 2 (Round 21 S2#7 — residual of #35, which itself SHIPPED PR #409; + Wush Wush V2 surfaced 2026-06-15 arbiter session, #445)
- **Criticality:** low
- **Status:** open (triggered — blocked until Chris pastes migration 079 into the SQL Editor)
- **Source:** master log #35 (Round 21); Wush Wush V2 via doc-proposal 774fa01c
- **Body:** Batch 193 `f4ef106f` needs fc_audibility ambiguous→did_not_fire via patch_roast; blocked until migration 079 lands in PROD, and requires fc_start/fc_temp/dev_time_s NULL on the row first (068 triple-null co-rule). The #35 constraint-drift fix shipped; this is just the data row waiting on the migration paste. **Second instance:** the BRA-FAZENDAUM-WUSHWUSH-NAT-2026 V2 batches 206/207/208 all dropped at bean-temp targets with FC never firing — pushed as `fc_audibility='ambiguous'` and want the same ambiguous→did_not_fire patch under the same migration-079 + 068-co-rule conditions. (Note: the V2 active-lot doc + proposal 774fa01c reference "migration 066" for the enum value, but 066 already landed 2026-05-24 — the live blocker is 079 + the triple-null co-rule, same as Batch 193.)

---

## Routed elsewhere (recorded for the recurrence trail, not built here)

These were triaged to non-build homes; kept as one-liners so recurrence is visible if they
resurface (per the route-feedback dedup rule). Full detail in the master log.

- **claude.ai client approval-gating** (master log #14 / #15 / #16 / #21 — Rounds 15/16) → **Bucket C: surface to Anthropic, not Latent substrate.** High recurrence (multi-tool, multi-round: propose_doc_changes aggregate-payload/multi-citation gate; list_doc_sections tool-class gate; AskUserQuestion mobile echo). Strong tool-class-gating hypothesis. Not a Latent build — escalation, not a sprint.
- **`recipe_variant` canonical promotion** (master log #8 / Round 5) → parked canonical-promotion trigger (promote at 5+ distinct values across 3+ beans). Lives in `project_recipe_variant_canonical.md`.
- **`parse_cupping_transcript` voice-memo pipeline** (master log #9 / Round 5) → parked product candidate (`project_parse_cupping_transcript.md`); Chris executes manually today.
- **Brief-framing kitchen-state vs DB-state** (master log Round 1 #4) → standing-rule candidate (route to `memory/feedback_*.md` when confirmed).
