# Post-grilling sequencing plan

Planning doc, not an execution doc. Output of the 2026-05-17 planning session that consolidated:
- The 8 `/grill-with-docs` followup files (2026-05-14 through 2026-05-17)
- The in-flight green-bean roasting dogfood cleanup queue (Rounds 0-7 logged, Round 8 lands 2026-05-18)
- The 3 ADRs that landed during cross-party grilling (0003 / 0004 / 0005)

Subsequent execution sessions consume this doc one sprint at a time, fresh context per session.

## Scope of this doc

1. Inventory (Option A: per-followup-file rows + per-dogfood-bucket rows, deduped)
2. Sprint bundling
3. Sprint sequence with the explicit blocking dogfood-merge gate Chris asked for (Sprint 0 = strengthened cross-system rule; Sprints 1-5 = pre-dogfood; Sprint M = mid-sequence sync; **🚨 BLOCKING GATE 🚨**; Sprints 6-14 = post-dogfood; Sprint F = final sync; Sprint R = roadmap review)
4. Risk flags surfaced by planning, not by per-cluster grilling
5. Resolved decisions (Chris-confirmed 2026-05-17 — all 8 original open questions resolved)
6. PRODUCT.md § Active Sprints 3.3-3.7 scope-impact assessment (Chris-requested)

Standing fences:
- **Dogfood close**: Round 8 (one-shot.md production run, scheduled 2026-05-18, Chris-confirmed definitive last). NO roasting-side MCP / prompt / schema changes ship before this fence.
- **Brewing-side is fully fair game during dogfood (Chris-confirmed 2026-05-17)**. The dogfood exercises the roasting + cupping iteration loop, not the brewing-side write surface. Brewing-side schema, MCP Tools, prompts, registries, and UI are pre-safe.
- **Doc-only roasting changes** (CONTEXT.md, ADRs, ROASTING.md prose, docs/roasting/*.md prose) are also pre-safe. The "no roasting changes" rule is scoped to MCP / prompt / schema only per Chris's correction in [grilling-2026-05-17-brewing-cross-party-followups.md](grilling-2026-05-17-brewing-cross-party-followups.md). HOWEVER, per Chris-confirmed 2026-05-17, SYN-8's roasting-side rename ships unified with the brewing-side in Sprint 9 (post-dogfood) to avoid any risk to claude.ai's roasting-substrate read during dogfood.
- **Round 8 may grow the dogfood inventory**. Chris flagged that Round 8 could add items to the DF-* queue. Sprint 6's exact sizing is gated on the post-Round-8 handoff brief update.
- **No --global git config** in any execution sprint (worktree-local `user.email=chris.r.mccann@gmail.com` only).

---

## 1. Inventory

### Conventions

- **ID**: stable identifier of shape `<source>-<n>` (e.g. `RO-1` = roasting cluster item 1; `BR-1` = brewing cluster item 1; `DF-A2` = dogfood Sub-PR A item 2). IDs propagate to execution sprint briefs verbatim so traceability survives across sessions.
- **Substrate codes**: `CTX` (CONTEXT.md), `CLD` (CLAUDE.md), `PRD` (PRODUCT.md), `BR` (BREWING.md), `RO` (ROASTING.md), `SYNC` (SYNC_V2.md), `ARB` (ARBITER.md), `TAX` (docs/taxonomies/), `DOCS` (other docs/), `ADR` (docs/adr/), `SCH` (schema + migration), `MCP` (lib/mcp/), `REG` (lib/*-registry.ts), `PRM` (docs/prompts/), `UI` (app/ + components/), `LIB` (lib/* general), `SCRIPT` (scripts/), `MEM` (memory/), `OPS` (Chris-physical-world work).
- **Timing**: `PRE` (pre-dogfood-close, safe to ship now); `POST` (post-dogfood-close only); `DEF` (deferred future-scope, not in immediate sequence).
- **Scope**: `XS` (under 1h), `S` (1-3h), `M` (half-day to 1d), `L` (1-3d), `XL` (3d+ or multi-sprint).
- **Coupled with**: cross-references to other IDs in this inventory that should bundle or sequence-after.

### Part A: Grilling followups

#### A.1 Roasting cluster — 2026-05-14 (file: `grilling-2026-05-14-followups.md`)

| ID | Title | Substrate | Timing | Scope | Coupled with | Notes |
|---|---|---|---|---|---|---|
| RO-1 | Rename `roast_learnings.elasticity` → `brewing_tolerance` | SCH + MCP + UI + PRM | POST | M | RO-3, RO-6, RO-CP-7 | ADR-worthy. Migration drops data carries through. |
| RO-2 | UI relabel `roast_window` → "Acceptable Roast Window" | UI | POST | XS | RO-1 | Bundle with RO-1's UI pass; no migration. |
| RO-3 | Add `roast_learnings.terroir_takeaway` column | SCH + MCP + UI + PRM | POST | M | RO-CP-7, RO-1 | **Duplicate of RO-CP-7** — track as RO-3≡RO-CP-7. |
| RO-4 | Audit `docs/prompts/` for new vocabulary | PRM | POST | S | RO-1, RO-3, RO-6 | Sequence after RO-1/3/6 schema lands. |
| RO-5 | Underdev/overdev cup-vs-roast intermix audit | SCH (data) + PRM | POST | S | RO-6, RO-CP-8 | **Duplicate of RO-CP-8** — track as RO-5≡RO-CP-8. |
| RO-6 | Relocate `aromatic_behavior` + `structural_behavior` from `roast_learnings` to `cuppings` | SCH + MCP + UI + PRM + ADR | POST | L | RO-1, RO-4, RO-5 | ADR-worthy. Migration moves data via `best_roast_id → roast_id → cupping`. |
| RO-7 | Decide whether to keep or drop `rest_behavior` | scoping | PRE | XS | none | Decision doc; can land pre-dogfood. |

#### A.2 Brewing cluster — 2026-05-15 (file: `grilling-2026-05-15-brewing-followups.md`)

| ID | Title | Substrate | Timing | Scope | Coupled with | Notes |
|---|---|---|---|---|---|---|
| BR-1 | Signature method registry gap (3 → 14-15 entries) | REG + TAX | PRE | M | MCP-1 | Highest brewing-side priority. Registry-only edit is pre-safe; the MCP-1 queue-addition complement is POST. |
| BR-2 | BREWING.md doc-edit Phase-Mapped + Role-Based Pulse vocab | BR | PRE | S | BR-1 | Mechanical-role vs cup-side-target split per round 4. |
| BR-3 | WBC systematic review (5 axes + 9 families vs current 6+4) | DOCS + scoping | PRE | M | WBC-2 | Output is a report, not code. Pairs with WBC-2 promotion scoping. |
| BR-4 | `extraction_confirmed` legacy field retirement evaluation | SCH (decision) | PRE | XS | none | Decision doc; if retire, separate POST-dogfood schema sprint. |
| BR-5 | `process_dominant` load-bearing-at-current-corpus evaluation | SCH (decision) | PRE | XS | RO-CP-5 | Decision doc. Roasting-side analog is RO-CP-5. |
| BR-6 | Brewing iteration-trace recording asymmetry | SCH design | DEF | L | none | Forward-investment scoping; defer past current sequence. |
| BR-7 | Selective Bloom ↔ Output Selection re-test trigger | CTX | DEF | XS | none | Re-test trigger; not actionable today. |
| BR-8 | Intensity-Clarity Split ↔ Phase-Mapped collapsibility | CTX | DEF | XS | none | Re-test trigger; not actionable today. |
| BR-9 | Roasting-side `process_dominant` analog | SCH (decision) | DEF | XS | RO-CP-5 | Re-test trigger; coupled with carry-forward scope tag. |

#### A.3 MCP / Sync Architecture cluster — 2026-05-15 (file: `grilling-2026-05-15-mcp-followups.md`)

| ID | Title | Substrate | Timing | Scope | Coupled with | Notes |
|---|---|---|---|---|---|---|
| MCP-1 | Signature method as override-eligible axis on `taxonomy_overrides_queue` | SCH + MCP + ARB + DOCS | POST | M | BR-1 | Schema widens queue enum + MCP override-flag wiring. POST because it touches `push-green-bean.ts` write surface. |
| MCP-2 | Signature method registry sync (= BR-1) | REG + TAX | PRE | M | BR-1 | **Duplicate of BR-1** — track as MCP-2≡BR-1. |
| MCP-3 | Per-axis canonical-strictness 4-tier audit | DOCS | PRE | S | CR-13 | Audit + proposal doc. Partly resolved by canonical-registries session's coverage-strategy framing. |
| MCP-4 | xBloom API existence check | DOCS investigation | PRE | XS | none | 30-min lookup; close-out either way. |
| MCP-5 | Aggregation scope per axis | CTX | PRE | XS | none | **Resolved by canonical-registries session** (aggregation level). Remove from active queue. |
| MCP-6 | 5 SYNC_V2 decisions as umbrella entry | CTX | DEF | XS | none | Chris no-strong-opinion; defer. |
| MCP-7 | Real-time push out-of-scope confirmed | CTX | DEF | none | none | **Resolved**. No follow-up. |
| MCP-8 | Canonical registries cluster grilling | (grilling) | DONE | none | none | **Shipped 2026-05-16**. Remove from queue. |

After dedupe and resolution: MCP-1, MCP-3, MCP-4 are the only live MCP items. MCP-5/-7/-8 are done; MCP-2 dedupes to BR-1; MCP-6 is deferred.

#### A.4 Canonical registries cluster — 2026-05-16 (file: `grilling-2026-05-16-canonical-registries-followups.md`)

| ID | Title | Substrate | Timing | Scope | Coupled with | Notes |
|---|---|---|---|---|---|---|
| CR-1 | `processes.md` qualifier-strategy doc-edit pass | TAX | PRE | S | none | Trivial doc edit; bundle with CR-2. |
| CR-2 | Nordic Approach → Mekuria Mergia alias removal | REG + TAX + SCH (data) | PRE | S | CR-3 | Alias edit + DB audit + brew-by-brew producer re-identification. |
| CR-3 | Importer/exporter as future canonical axis - scoping | scoping | PRE | M | CR-2 | Scoping doc; implementation deferred. Triggered by CR-2 pain. |
| CR-4 | Skeleton-entry review extension to arbiter procedure | ARB + MCP + REG | POST | M | CR-10 | Touches MCP Tool surface; POST. Pairs with CR-10 roaster extension. |
| CR-5 | `fermentation_qualifiers` schema column on `brews` | SCH + MCP + LIB | PRE | M | none | Brewing-side MCP fully fair game during dogfood per Chris-confirmed 2026-05-17. Lands in Sprint 3. |
| CR-6 | Strategy tag ↔ extraction strategy vocab-coherence audit | DOCS + REG (potential) | PRE | M | none | Audit doc; rename sprint follow-up if signal emerges. |
| CR-7 | SWORKS valve flow taxonomy promotion scoping | TAX + REG | PRE | S (scope) / M (promote) | none | Self-only axis. Promotion-effort gated on Chris's TODO. |
| CR-8 | Filter flow-rate measurement exercise | OPS + REG + TAX | PRE (scope) / OPS (execute) | M | WBC-3 | **Duplicate of WBC-3** — track as CR-8≡WBC-3. |
| CR-9 | Water taxonomy bootstrap (next self-only axis) | TAX + REG + SCH | DEF | XL | WBC-4 | **Duplicate of WBC-4 second-half** — track as CR-9≡WBC-4-large. Bottoms-up authoring + schema column. |
| CR-10 | Roaster skeleton-flag extension | REG | POST | XS | CR-4 | Pairs with CR-4. POST because it ships alongside CR-4. |
| CR-11 | 95-96% pick-not-author saturation audit | SCRIPT | PRE | S | none | One-off SQL or script; reports per-axis canonical-resolution rate. |
| CR-12 | Aggregation-scope-from-MCP-cluster resolved | (resolved) | DONE | none | MCP-5 | Resolved this session as Aggregation level. |
| CR-13 | 4-tier canonical-strictness mapping | DOCS | PRE | S | MCP-3 | Partial resolution of MCP-3. Bundle audit. |

#### A.5 WBC reference materials cluster — 2026-05-16 (file: `grilling-2026-05-16-wbc-followups.md`)

| ID | Title | Substrate | Timing | Scope | Coupled with | Notes |
|---|---|---|---|---|---|---|
| WBC-1 | BREWING.md single-variable orthodoxy softening | BR | PRE | S | none | Doc edit; preserve Motta-prevention while allowing early-iteration multi-variable. |
| WBC-2 | Time Distribution Playbook canonical-modifier promotion scoping | DOCS + scoping | PRE | M | BR-3 | Scoping doc; implementation deferred to a v8.6 brewing taxonomy expansion sprint. |
| WBC-3 | Filter behavior measurement plan | OPS + REG + TAX | PRE (scope) / OPS (execute) | M | CR-8 | Same as CR-8. |
| WBC-4 | Water Strength experiment + Water taxonomy bootstrap | OPS (experiment) + future taxonomy | PRE (experiment scope) / DEF (taxonomy) | S + XL | CR-9 | Experiment is small + pre-safe; taxonomy bootstrap is the deferred CR-9. |
| WBC-5 | Calibration pair as standing sourcing-prompt practice | PRM | PRE | XS | none | `docs/prompts/start-lot.md` edit. Doc-only roasting prompt edit — but it IS a roasting-side prompt. **Flag: brewing-side prompt edits are PRE-safe, roasting-side prompt edits per Chris's standing rule are POST**. Reclassify to POST. |
| WBC-6 | Portfolio lanes 5th lane formalization | DOCS | PRE | XS | WBC-7, WBC-8 | wbc-sourcing.md doc edit. Bundle 6-7-8. |
| WBC-7 | Geisha Village classification correction | DOCS | PRE | XS | WBC-6, WBC-8 | wbc-sourcing.md doc edit. |
| WBC-8 | Direct-from-auction sourcing channel addition | DOCS | PRE | XS | WBC-6, WBC-7 | wbc-sourcing.md doc edit. |
| WBC-9 | Long-run experiment architectural review | scoping | DEF | M | none | Deferred per Chris's framing. |
| WBC-10 | Same-green blending + Rest curve protocol execution | OPS + ROASTING-EXECUTION | DEF | OPS-physical | none | Physical roasting on next reference roast cycle. |

#### A.6 Synthesis cluster — 2026-05-16 (file: `grilling-2026-05-16-synthesis-followups.md`)

| ID | Title | Substrate | Timing | Scope | Coupled with | Notes |
|---|---|---|---|---|---|---|
| SYN-1 | Synthesis pipeline subsystem-wide revisit umbrella | scoping | DEF | XL | none | Future-scope scoping doc; defer. |
| SYN-2 | Confidence + length modulation by corpus size | LIB (prompt + adapter) | PRE | S | SYN-4 | Replace binary `earlyData` flag with tiered logic. Pure brewing-side touching code? Yes — `lib/synthesis/buildPrompt.ts` is shared. Pre-safe (no roasting MCP/prompt/schema). |
| SYN-3 | Mobile capsule short-form variant | UI + SCH (column) + LIB | PRE | M | none | Cache column + 3rd LLM call. Brewing-side capsule UX; pre-safe. |
| SYN-4 | Re-synthesize-don't-append discipline as stronger prompt rule | LIB | PRE | S | SYN-2 | `SHARED_RULES` edit in buildPrompt.ts. |
| SYN-5 | Humanizer vocabulary grounding | LIB + investigation | PRE | S | none | Decision doc + possible refactor to CONTEXT.md-aware humanizer. |
| SYN-6 | Cross-source brewing + roasting unified capsule | LIB + adapter + SCH (query) | POST | L | RO-3, RO-6 | Touches `roast_learnings` query path. POST. |
| SYN-7 | Resynthesize trigger gap (content-change-without-count-change) | LIB | POST | S | SYN-6 | Partly tied to SYN-6 cross-source. POST. |
| SYN-8 | BREWING.md ↔ ROASTING.md cross-coffee section naming asymmetry | BR + RO | POST | XS | none | Both sides rename together in Sprint 9 (unified post-dogfood) per Chris-confirmed 2026-05-17. Avoids transient asymmetry + any risk to claude.ai's roasting-substrate read during dogfood. |

#### A.7 Brewing cross-party — 2026-05-17 (file: `grilling-2026-05-17-brewing-cross-party-followups.md`)

Items 1-2 shipped as [PR #166](https://github.com/chrismccann-dev/latent-coffee/pull/166); items 4-5 noted as not-picked-up by parallel #167; items 6-8 parked with re-test triggers.

| ID | Title | Substrate | Timing | Scope | Coupled with | Notes |
|---|---|---|---|---|---|---|
| BCP-1 | lib/mcp/docs.ts CONTEXT.md description update | MCP (description only) | DONE | none | none | **Shipped in #166**. |
| BCP-2 | Vercel bundle audit guardrail | CLD + SCRIPT | DONE | none | S0 (Sprint 0) | **Partly shipped in #166** as CLAUDE.md cadence #4 sentence. Sprint 0 below proposes the SCRIPT enforcement upgrade. |
| BCP-3 | Brewer rotation discipline → Default-brewer trap split | CTX | DEF | XS | none | Re-test trigger. |
| BCP-4 | V-set budget headword | CTX | DEF | XS | none | Not picked up by #167. Future-scope. |
| BCP-5 | Cross-side parallel-table sweep methodology | (methodology) | DEF | none | none | Not picked up by #167. Future grilling discipline. |
| BCP-6 | WBC corpus check composite split | CTX | DEF | XS | none | Re-test trigger. |
| BCP-7 | Cooling Behavior Observations as separate glossary entry | CTX | DEF | XS | none | Re-test trigger. |
| BCP-8 | `what_i_learned` dual semantic role | CTX | DEF | XS | none | Re-test trigger. |

#### A.8 Roasting cross-party — 2026-05-17 (file: `grilling-2026-05-17-roasting-cross-party-followups.md`)

Items 1-2 shipped as [PR #167](https://github.com/chrismccann-dev/latent-coffee/pull/167); items 3-9 carried forward.

| ID | Title | Substrate | Timing | Scope | Coupled with | Notes |
|---|---|---|---|---|---|---|
| RO-CP-1 | ROASTING.md additive-vs-precedence table split | RO | PRE | M | RO-CP-2 | Doc edit only. Bundle with RO-CP-2. PRE-safe per Chris's correction (doc-only roasting). |
| RO-CP-2 | Development entry framing edit (WB→Gnd polarity by lot family) | RO | PRE | S | RO-CP-1 | Doc edit only. PRE-safe. |
| RO-CP-3 | Add `fc_audibility` enum field to roast schema | SCH + MCP + LIB + RO | POST | M | none | 4-value enum + backfill. POST. |
| RO-CP-4 | Peer roaster framework structured storage | SCH design + REG + MCP + RO | POST | L | none | Scope decision then implementation. POST. |
| RO-CP-5 | Carry-forward scope-tag mechanism | SCH + MCP + RO + PRM | POST | M | BR-5 | Roasting-side analog of `process_dominant`. POST. |
| RO-CP-6 | Roast recipe specification canonical noun (recipe vs profile vs spec) | CTX + PRM | PRE | S | none | Glossary edit + prompt language consistency. Touching prompts → POST per Chris's rule. **Reclassify to POST.** |
| RO-CP-7 | `roast_learnings.terroir_takeaway` column gap | SCH + MCP + RO + PRM | POST | M | RO-1, RO-3 | **= RO-3** dedupe. |
| RO-CP-8 | `roast_learnings` underdev/overdev cup-side strictness | SCH (data audit) + PRM | POST | S | RO-5 | **= RO-5** dedupe. |
| RO-CP-9 | Skeleton ADR for substrate-practice gap audit mechanism | ADR | DEF | XS | none | Deferred per Chris-confirmed 2026-05-17 to "when a 3rd cross-party audit lands." Not scoped in current sequence. |

### Part B: Dogfood cleanup queue (post-Round-7 handoff brief, all POST by construction)

Source: `docs/sprints/cleanup-queue-handoff-brief-2026-05-17.md` (paste-ready brief in the other session's worktree; canonical recap pasted inline in the planning session prompt). All items are POST-dogfood-close — they target the dogfood-produced friction, not pre-dogfood-safe substrate.

#### B.1 Sub-PR A — Prompt edits (10 items, `docs/prompts/`)

| ID | Title | Files touched | Scope | Highlight |
|---|---|---|---|---|
| DF-A1 | (Round 1+ catch-all) | log-roast.md | S | |
| DF-A2 | **log-cupping.md STAGE 0 state-shape migration** | log-cupping.md | M | **Highest-leverage in the entire queue.** Supersedes 4+ prior round-specific items (R1#2, R3#2/#3/#5, R4#6/#7 implicit). Single-shot mechanical backfill that detects pre-rewrite-lot state in STAGE 1 and walks claude.ai through writing new-prompt fields. |
| DF-A3 | (Round 2-5 friction) | log-roast.md / log-cupping.md | S | |
| DF-A4 | (Round 3-4 friction) | close-lot.md | S | |
| DF-A5 | (Round 5 one-shot.md friction) | one-shot.md | S | |
| DF-A6 | (Round 5 one-shot-closeout.md friction) | one-shot-closeout.md | S | |
| DF-A7-A10 | (Round 6+7 incremental fixes) | various 5 prompt files | S each | Exact decomposition pending re-read of full handoff brief in execution session. |

Full enumeration of A-items will be re-read from the handoff brief at execution-sprint kickoff (the user pasted the high-level recap into this session; full item-by-item decomposition is in the handoff brief itself).

#### B.2 Sub-PR B — MCP schema-description + behavior fixes (8 items, `lib/mcp/*.ts`)

| ID | Title | Files touched | Scope |
|---|---|---|---|
| DF-B1-B8 | Schema-description rewording + behavior fixes across 6 MCP Tool files | lib/mcp/push-*.ts + lib/mcp/patch-*.ts | S each |

Exact decomposition pending re-read of full handoff brief; 8 items distributed across 6 tool files.

#### B.3 Sub-PR C — Page-render polish (3 items, `app/(app)/green/[id]/page.tsx`)

| ID | Title | Files touched | Scope |
|---|---|---|---|
| DF-C1-C3 | Page-render polish on green-bean detail page | app/(app)/green/[id]/page.tsx | S each |

#### B.4 CONTEXT.md additions (2 items)

| ID | Title | Files touched | Scope |
|---|---|---|---|
| DF-CTX1-CTX2 | 2 glossary entries surfaced during dogfood Rounds 0-7 | CONTEXT.md | XS each |

#### B.5 Schema migration sprint (4 candidates, separate future sprint)

| ID | Title | Substrate | Scope |
|---|---|---|---|
| DF-SCH1-SCH4 | 4 schema migration candidates surfaced during dogfood | SCH + MCP + UI | L (bundled sprint) |

#### B.6 Long-term arbiter task

| ID | Title | Substrate | Scope |
|---|---|---|---|
| DF-ARB1 | ARBITER.md playbook expansion (CCIL consolidation arbiter task) | ARB | M |

#### B.7 Open investigations

| ID | Title | Substrate | Scope |
|---|---|---|---|
| DF-INV1-INV2 | Vercel logs intermittent fail patterns | investigation | S each |

#### B.8 Operational backfills

| ID | Title | Substrate | Scope |
|---|---|---|---|
| DF-OPS1-OPS2 | Chris-driven operational backfills | OPS | OPS |

### Inventory totals after dedupe

- Grilling followups (Parts A.1-A.8): **70 raw items → ~63 unique** after collapsing duplicates (RO-3≡RO-CP-7; RO-5≡RO-CP-8; MCP-2≡BR-1; CR-8≡WBC-3; CR-9≡WBC-4-large) and removing resolved/shipped/done items (MCP-5, MCP-7, MCP-8, CR-12, BCP-1, BCP-2-partial).
- Dogfood cleanup queue (Part B): **32 items**.
- Grand total: **~95 unique items** across the planning surface.

Status mix after dedupe + Chris-confirmed reclassifications (2026-05-17):
- `DONE` (already shipped or resolved): 6 items (BCP-1, MCP-5, MCP-7, MCP-8, CR-12, BCP-2-partial)
- `PRE` (pre-dogfood-safe, execution-ready): ~23 items (+CR-5 moved from POST; -RO-CP-9 moved to DEF; -SYN-8 moved to POST = net +0 from prior count of ~22, but composition shifted)
- `POST` (post-dogfood-only): ~17 items + 32 dogfood items = ~49 items (CR-5 left POST; SYN-8 joined; RO-CP-9 left)
- `DEF` (deferred future-scope): ~19 items (+RO-CP-9)

---

## 2. Sprint bundling

Bundling criteria: shared substrate + dependency chain + review surface. Items in the same sprint should share a PR or share a tight sub-PR bundle.

### Sprint 0 — Strengthened cross-system sync rule

Single-PR sprint. Ships FIRST so subsequent sprints are accountable to the new rule. Self-contained: edits CLAUDE.md cadence #4 + ships one enforcement script + updates ARBITER.md.

**Bundled items**: BCP-2 (Vercel bundle audit guardrail, full enforcement upgrade beyond the #166 prose sentence), plus the new "six-actor traceability matrix" framing the user specifically asked for in the planning brief.

**Surface**:
- CLAUDE.md cadence #4 expanded to a 6-actor traceability checklist
- Distinguish two named directions: **substrate-to-substrate** (existing `propose_doc_changes` arbiter pipeline) and **practice-to-substrate** (cross-party `/grill-with-docs` audit per #167's "substrate-practice gap audit" framing)
- New `scripts/check-mcp-bundle.ts` that diffs `lib/mcp/docs.ts` `DOC_FILES` keys against `next.config.js` `outputFileTracingIncludes['/api/mcp/**']` glob → exits non-zero on mismatch. Wireable to a pre-commit hook or CI step.
- ARBITER.md gets a "substrate-practice gap audit" section naming cross-party grilling as the canonical practice-to-substrate mechanism (referencing ADR-0006 candidate per RO-CP-9 if Chris promotes it).

**Why this shape and not just expand cadence #4 prose**: the rule has been bitten 3 times (PR #65, docs/roasting/*.md, CONTEXT.md). Three repeats means prose alone is insufficient. Concrete enforcement (the script) is the difference between "rule that exists" and "rule that holds." The 6-actor matrix is the analytical scaffolding; the script is the operational enforcement; the substrate-to-substrate vs practice-to-substrate naming is the conceptual completeness.

**The 6-actor matrix**:

| # | Actor | What changes propagate to it | Read direction | Write direction |
|---|---|---|---|---|
| 1 | Chris (human) | none — Chris is the source | reads CONTEXT/CLAUDE/PRODUCT | authors source data |
| 2 | docs/prompts/*.md | terminology + Tool surface + workflow shape | claude.ai reads at session start | Claude Code edits |
| 3 | claude.ai project instructions | Tool inventory + MCP Resource catalog + terminology | reads docs:// Resources at runtime | Chris edits in claude.ai UI |
| 4 | MCP server (Tools + Resources + descriptions) | schema + registry + glossary | exposes to claude.ai | Claude Code edits lib/mcp/ |
| 5 | Claude Code (CLAUDE.md + CONTEXT.md + docs/) | rules + glossary + reference docs | reads at session start | Claude Code edits |
| 6 | Latent app (schema + UI + registries) | schema + Tool writes + read surfaces | renders to Chris | Claude Code edits |

A substrate change must be traced through the chain. Example trace for "add `terroir_takeaway` column": actor 6 (schema migration + UI) → actor 4 (push_roast_learnings Tool field) → actor 5 (CLAUDE.md doc) → actor 2 (`close-lot.md` prompt vocab) → actor 3 (claude.ai picks up new field via MCP Tool catalog) → actor 1 (Chris sees rendered field). Missing any hop = the bug pattern.

### Pre-dogfood sprints (Sprints 1-5)

#### Sprint 1 — Brewing cluster doc edits + canonical surface

**Bundled items**: BR-1 (signature method registry, 11+ canonical entries) + BR-2 (BREWING.md Phase-Mapped vocab) + WBC-1 (BREWING.md single-variable orthodoxy softening).

**Why bundle**: all touch brewing-side authoritative content (BREWING.md + process registry); shared review surface.

**Note on SYN-8**: moved to Sprint 9 (unified rename both sides post-dogfood) per Chris-confirmed.

**Estimated PRs**: 1.

**Sizing**: M (half-day to 1d).

#### Sprint 2 — wbc-sourcing.md doc-edit bundle

**Bundled items**: WBC-6 + WBC-7 + WBC-8 (Portfolio lanes 5th lane + Geisha Village correction + direct-from-auction channel).

**Why bundle**: all `wbc-sourcing.md` edits, single PR per the WBC followups' explicit suggestion.

**Estimated PRs**: 1.

**Sizing**: S (1-3h).

#### Sprint 3 — Canonical registries doc edits + alias cleanup + brewing-side MCP schema

**Bundled items**: CR-1 (processes.md qualifier doc-edit) + CR-2 (Nordic Approach alias removal + producer re-ID) + CR-3 (importer/exporter scoping doc) + CR-5 (`fermentation_qualifiers` schema column on `brews` + `push_brew` Tool wiring).

**Why bundle**: all touch the canonical/process surface; CR-2's brew-by-brew producer re-ID is the load-bearing item. CR-5 added per Chris-confirmed brewing-side MCP is fair game during dogfood; the column addition + Tool wiring + `composeProcess`/`decomposeProcess` updates land alongside the related processes.md qualifier doc-edit (CR-1).

**Estimated PRs**: 1-2 (CR-2's data audit may want its own commit; CR-5's schema migration may want its own commit for review depth — split if review load is too high).

**Sizing**: M-L (CR-5 pushes this from M into L territory; if too big, split CR-5 into its own Sprint 3b).

#### Sprint 4 — Synthesis pipeline pre-safe edits

**Bundled items**: SYN-2 (confidence + length modulation) + SYN-4 (re-synthesize discipline rule) + SYN-5 (humanizer vocab grounding investigation).

**Why bundle**: all `lib/synthesis/` shared; shared review surface; SYN-2 and SYN-4 reinforce each other (tiered logic + non-additive rule pair cleanly).

**Estimated PRs**: 1.

**Sizing**: S-M.

**Defer SYN-3 (mobile capsule short-form)** to a later sprint — adds schema column + 3rd LLM call, larger scope.

#### Sprint 5 — Pre-safe scoping + audit docs

**Bundled items**: BR-3 (WBC systematic review report) + BR-4 (extraction_confirmed retirement decision) + BR-5 (process_dominant evaluation decision) + WBC-2 (Time Distribution Playbook promotion scoping) + CR-6 (strategy tag ↔ extraction strategy audit) + CR-7 (SWORKS valve flow scoping) + CR-11 (95-96% pick-not-author saturation audit) + MCP-3 + CR-13 (canonical-strictness 4-tier audit) + MCP-4 (xBloom API check) + RO-7 (rest_behavior decision) + DF-SCH enumeration (the 4 dogfood schema-migration candidates get enumerated at this sprint's kickoff per Chris-confirmed; sequencing decision is made then).

**Why bundle**: all are reflective/scoping/audit work producing decision docs, not code or schema changes. Bundling lets Chris read the entire decision surface in one review pass.

**Note**: RO-CP-9 (substrate-practice gap audit ADR-0006) removed per Chris-confirmed deferral to "when a 3rd cross-party audit lands."

**Estimated PRs**: 1 PR with multiple commits per audit doc, OR split into 2 PRs (audits vs decisions) if review becomes unwieldy. Per Chris's standing caution about mega-sprints, the kickoff brief includes a hard checkpoint after item 6 — if review/cognitive load is too high, split there into Sprint 5a + 5b.

**Sizing**: M-L (11 small scoping deliverables stacked + DF-SCH enumeration).

**Output**: A folder `docs/audits/2026-05-XX/` with per-item decision docs. Each one is short, 1 page typical.

### Sprint M — Mid-sequence cross-system sync

Triggers after Sprint 5 closes and BEFORE any post-dogfood sprint begins. Runs through the 6-actor matrix from Sprint 0 against everything that landed in Sprints 1-5. Catches drift before roasting-side sprints inherit it.

**Substrate check focus**:
- New canonical entries in BR-1 → are they in the right MCP Resource bundle?
- WBC doc edits → does claude.ai re-fetch the doc, or is there a Vercel cache?
- Synthesis prompt edits → do they invalidate cached syntheses correctly?
- Audit doc folder → registered as MCP Resources or filesystem-only? If Resources, runs the new `check-mcp-bundle.ts` script.

**Output**: A 1-page "Sprint M sync report" noting what propagated cleanly and what needed a follow-up commit. If clean, the report stays empty and Sprints 6+ proceed.

**Sizing**: S (1-3h).

### Post-dogfood sprints (Sprints 6-12)

These run AFTER Round 8 closes the dogfood (target: 2026-05-18 + Round 8 completion). The dogfood cleanup queue (DF-A through DF-OPS) is the highest priority because it's the most current friction.

#### Sprint 6 — DF Sub-PR A: Prompt edits (10 items)

**Bundled items**: DF-A1 through DF-A10. The handoff brief recommends shipping this as Sub-PR A first.

**Highlighted item**: DF-A2 — log-cupping.md STAGE 0 state-shape migration. Supersedes 4+ prior round-specific items. Land this first within the sprint; the other 9 prompt edits ride along.

**Estimated PRs**: 1 (or 2 if DF-A2 wants its own PR for review depth).

**Sizing**: M.

#### Sprint 7 — DF Sub-PR B: MCP schema-description + behavior fixes (8 items)

**Bundled items**: DF-B1 through DF-B8 across 6 MCP Tool files.

**Estimated PRs**: 1.

**Sizing**: M.

#### Sprint 8 — DF Sub-PR C + CONTEXT.md additions (5 items combined)

**Bundled items**: DF-C1-C3 (page-render polish) + DF-CTX1-CTX2 (CONTEXT.md additions).

**Estimated PRs**: 1.

**Sizing**: S.

#### Sprint 9 — Roasting cluster doc edits (post-dogfood)

**Bundled items**: RO-CP-1 (ROASTING.md additive-vs-precedence table split per ADR-0005) + RO-CP-2 (Development entry framing edit for WB→Gnd polarity by lot family) + SYN-8 (BREWING.md ↔ ROASTING.md cross-coffee section naming asymmetry — UNIFIED rename both sides in this sprint per Chris-confirmed).

**Why post-dogfood despite being doc-only**: ROASTING.md drives claude.ai's roasting design language; editing it mid-dogfood would change the substrate claude.ai is reading. Even doc-only roasting edits ship after the dogfood closes. SYN-8's brewing-side rename rides along here to avoid the transient asymmetry of half-renamed cross-doc vocabulary.

**Estimated PRs**: 1.

**Sizing**: S.

#### Sprint 10 — Roasting schema migrations bundle 1 (terroir + brewing_tolerance)

**Bundled items**: RO-1 (`elasticity` → `brewing_tolerance` rename) + RO-2 (UI label) + RO-3≡RO-CP-7 (`terroir_takeaway` column) + RO-4 (prompts vocab audit, sequenced after the schema migration).

**Why bundle**: all touch `roast_learnings` schema + push_roast_learnings Tool + close-lot.md prompt + UI. Single coherent migration + Tool update + prompt update + UI update PR.

**Estimated PRs**: 1 (or split schema migration commit from prompt commit for atomicity).

**Sizing**: L.

**ADRs**: RO-1 lands ADR-0007 (per cadence-#1 ADR-worthy framing in the followups). RO-3 may or may not — straightforward column addition with prior precedent.

#### Sprint 11 — Roasting schema migrations bundle 2 (audibility + character relocation)

**Bundled items**: RO-CP-3 (`fc_audibility` enum) + RO-5≡RO-CP-8 (underdev/overdev audit + close-lot.md strictness) + RO-6 (aromatic_behavior + structural_behavior relocation from roast_learnings to cuppings).

**Why bundle**: all touch the same `roast_learnings` + `cuppings` schema surface; sequencing them in one sprint avoids back-and-forth migrations.

**Estimated PRs**: 1 (with multiple commits for review-ability).

**Sizing**: L.

**ADRs**: RO-6 lands ADR-0008 (per followup's ADR-worthy framing).

#### Sprint 12 — Roasting scope-tag + MCP queue + arbiter extensions

**Bundled items**: RO-CP-5 (carry-forward scope-tag mechanism) + MCP-1 (signature method queue addition on `taxonomy_overrides_queue`) + CR-4 (skeleton-entry arbiter extension, third queue type) + CR-10 (roaster skeleton-flag extension).

**Why bundle**: all touch MCP Tool surface + ARBITER.md procedure + schema. Bundling lets the cross-actor propagation (actor 4 → 5 → 3 → 2) happen as one coherent change.

**Note**: CR-5 moved to Sprint 3 (brewing-side MCP is fair game during dogfood per Chris-confirmed).

**Estimated PRs**: 1-2 (split if L sizing turns into XL after Sprint 5 enumerates the DF-SCH candidates that may also land here).

**Sizing**: L. Per Chris's caution about mega-sprints, this is a candidate for plan-execute split (one session scopes the cross-actor matrix; a second session executes).

#### Sprint 13 — Cross-source synthesis + resynthesize trigger (post-roasting-schema)

**Bundled items**: SYN-6 (cross-source brewing + roasting unified capsule) + SYN-7 (resynthesize trigger content-change gap) + SYN-3 (mobile capsule short-form variant, deferred from Sprint 4).

**Why bundle**: SYN-6 unlocks the brewing + roasting capsule unification, which depends on Sprints 10-12's roasting schema work being stable. SYN-3 rides along — both are synthesis-output UX work.

**Estimated PRs**: 1-2.

**Sizing**: L.

#### Sprint 14 — Roasting prompt vocab + recipe noun canonicalization

**Bundled items**: RO-CP-6 (recipe vs profile vs spec canonical noun) + final pass of RO-4 if any items remain + DF-ARB1 (CCIL consolidation arbiter task).

**Why bundle**: all are roasting-side prompt + ARBITER.md vocabulary cleanup, sequenced after all roasting schema settles.

**Estimated PRs**: 1.

**Sizing**: S-M.

### Sprint F — Final cross-system sync

Triggers after Sprint 14 closes. Runs the 6-actor matrix end-to-end against the full delta of Sprints 1-14. Every change should be traceable through the chain. The new `check-mcp-bundle.ts` from Sprint 0 runs as a CI gate.

**Output**: Sprint F report. If clean, proceed to Sprint R.

**Sizing**: S.

### Sprint R — PRODUCT.md / roadmap review

Triggers after Sprint F closes. Walks PRODUCT.md § Active Sprints / Newly queued / Side Quests / Roadmap with the clean post-grilling state. Decides what new things to take on next.

**Output**: PRODUCT.md updates + `docs/sprints/shipped.md` rows for everything that shipped Sprints 1-14 + a new kickoff brief for whatever comes next.

**Sizing**: S-M.

### Deferred sprints (not in immediate sequence)

| ID(s) | Title | Trigger |
|---|---|---|
| DF-SCH1-SCH4 | Dogfood schema migration sprint (4 candidates) | After Sprint 14; bundle as a separate dedicated migration sprint. |
| DF-INV1-INV2 | Vercel intermittent fail investigations | Trigger on next failure occurrence. |
| DF-OPS1-OPS2 | Operational backfills | Chris-driven; standalone. |
| CR-7-promote | SWORKS valve flow taxonomy promotion (post-scoping) | After CR-7's scoping decision in Sprint 5. |
| CR-9 / WBC-4-large | Water taxonomy bootstrap | Large bottoms-up authoring sprint; trigger when Chris has bandwidth. |
| WBC-3 / CR-8 | Filter behavior measurement OPS | Chris-physical-world work. |
| WBC-4 (experiment) | Water Strength experiment | Chris-physical-world work. |
| WBC-9 | Long-run experiment architectural review | Deferred per Chris. |
| WBC-10 | Same-green blending + Rest curve protocol OPS execution | Next reference roast cycle. |
| BR-6 | Brewing iteration-trace recording asymmetry | Forward-investment scoping. |
| BR-7 / BR-8 / BR-9 | Re-test triggers | Trigger on the specified brew pattern landing. |
| BCP-3 / BCP-4 / BCP-5 / BCP-6 / BCP-7 / BCP-8 | Cross-party re-test triggers | Trigger on the specified pattern landing. |
| MCP-6 | 5 SYNC_V2 decisions umbrella entry | No-strong-opinion; defer. |
| SYN-1 | Synthesis pipeline subsystem-wide revisit umbrella | Future-scope. |

---

## 3. Sprint sequence

Linear execution order. Each sprint is one session with fresh context; kickoff brief per sprint generated from this plan's bundling section. Per Chris-confirmed, L+ sprints are candidates for plan-execute split (one session plans, a second session executes) to avoid mega-session overload.

### ✅ Phase 1: Pre-dogfood (safe to ship now)

These sprints have ZERO dependency on Round 8 closing. All items are brewing-side, doc-only, or scoping/audit work.

```
Sprint 0:  Strengthened cross-system sync rule + check-mcp-bundle.ts script + 6-actor matrix in CLAUDE.md
           [substrate: CLD + SCRIPT + ARB]
Sprint 1:  Brewing cluster doc edits + canonical surface  (BR-1, BR-2, WBC-1)
           [substrate: BR + REG + TAX]
Sprint 2:  wbc-sourcing.md doc-edit bundle  (WBC-6, WBC-7, WBC-8)
           [substrate: DOCS]
Sprint 3:  Canonical registries cleanup + brewing-side MCP schema  (CR-1, CR-2, CR-3, CR-5)
           [substrate: TAX + REG + SCH + MCP for brews-side only]
Sprint 4:  Synthesis pipeline pre-safe edits  (SYN-2, SYN-4, SYN-5)
           [substrate: LIB]
Sprint 5:  Pre-safe scoping + audit docs  (BR-3, BR-4, BR-5, WBC-2, CR-6, CR-7, CR-11,
           MCP-3+CR-13, MCP-4, RO-7, DF-SCH enumeration)
           [substrate: DOCS + scoping; checkpoint mid-sprint]

Sprint M:  Mid-sequence cross-system sync against Sprints 1-5
           [substrate: read-only audit; no edits unless drift surfaces]
```

### 🚨 BLOCKING GATE: DOGFOOD MERGE 🚨

**Cannot proceed to Sprint 6 until ALL of the following are true**:

1. Round 8 (one-shot.md production run on Higuito V3 or equivalent) has been executed by Chris on the Roest L200 + cupped at day-7
2. The continuous feedback log (`memory/feedback_mcp_continuous_log.md`) has its Round 8 entry written
3. The dogfood handoff brief (`docs/sprints/cleanup-queue-handoff-brief-2026-05-17.md` or successor) is updated with any Round 8 friction items appended to the DF-* inventory
4. Chris confirms in-session: "dogfood is closed, DF inventory is locked, you may proceed to Sprint 6"
5. The handoff brief is merged to `main` so Claude Code can read the full DF inventory cold

**Sprint 6 kickoff session must verify all 5 conditions before doing any DF-A work.** If any condition is unmet, the session pauses and surfaces the gap to Chris.

**Trigger**: Round 8 is Chris-confirmed for Monday 2026-05-18. Estimated gate opens within ~24-48h of Round 8 cupping completion.

**Risk**: Round 8 may grow the DF inventory. Sprint 6 sizing rebalances based on the post-Round-8 brief; if DF-A exceeds 12-15 items it splits into DF-A1 (mechanical state-shape backfill: DF-A2 only) + DF-A2 (remaining edits).

### 🔒 Phase 2: Post-dogfood (BLOCKED until gate opens)

```
Sprint 6:  DF Sub-PR A  (10+ prompt-edit items; DF-A2 STAGE-0 state-shape migration leads)
           [substrate: PRM]
Sprint 7:  DF Sub-PR B  (8 MCP description + behavior fixes across 6 Tool files)
           [substrate: MCP]
Sprint 8:  DF Sub-PR C + CONTEXT.md additions  (3 page-render + 2 CTX entries)
           [substrate: UI + CTX]
Sprint 9:  Roasting cluster doc edits + unified cross-coffee rename
           (RO-CP-1, RO-CP-2, SYN-8 both sides)
           [substrate: RO + BR]
Sprint 10: Roasting schema migrations bundle 1  (RO-1, RO-2, RO-3, RO-4)
           [substrate: SCH + MCP + UI + PRM; ADR-0007 candidate]
Sprint 11: Roasting schema migrations bundle 2  (RO-CP-3, RO-5, RO-6)
           [substrate: SCH + MCP + UI + PRM; ADR-0008 candidate]
Sprint 12: Roasting scope-tag + MCP queue + arbiter extensions
           (RO-CP-5, MCP-1, CR-4, CR-10)
           [substrate: SCH + MCP + ARB + REG; L, possibly plan-execute split]
Sprint 13: Cross-source synthesis + mobile capsule  (SYN-6, SYN-7, SYN-3)
           [substrate: LIB + adapter + SCH; depends on Sprints 10-12 stable]
Sprint 14: Roasting prompt vocab + recipe noun  (RO-CP-6, RO-4-final, DF-ARB1)
           [substrate: PRM + ARB]
```

### ✅ Phase 3: Close-out

```
Sprint F:  Final cross-system sync against full delta of Sprints 1-14
           [substrate: read-only audit; 6-actor matrix end-to-end]
Sprint R:  PRODUCT.md / roadmap review
           [substrate: PRD; reconciles 3.3-3.7 against post-grilling/post-dogfood state]
```

### Totals

- 17 execution sprints (Sprint 0 + Sprints 1-14 + Sprint M + Sprint F + Sprint R)
- 6 pre-dogfood sprints (0-5)
- 1 pre-dogfood sync (M)
- 1 BLOCKING GATE
- 9 post-dogfood sprints (6-14)
- 2 close-out sprints (F, R)

**Wall-clock estimate**: ~2-3 weeks at ~1 sprint per session and 1-2 sessions per day, ~4-5 weeks if Chris chunks sessions less aggressively. L+ sprints (3, 5, 10, 11, 12, 13) may each span 2 sessions (plan + execute) per Chris-confirmed.

---

## 4. Risk flags

### 4.1 Signal-arbitration interpretive drift between #166 and #167

The brewing cross-party brief (#166) characterizes brewing as "judgment-based weighting, not strict precedence" via the Signal override entry. The roasting cross-party brief (#167) characterizes brewing as "pure-precedence" via ADR-0005's comparison framing. Both ran in parallel sessions; neither saw the other's framing live.

**Risk**: ADR-0005's pure-precedence-vs-parameter-type-conditional axis depends on the brewing-side framing as a comparison point. If brewing is actually judgment-based weighting (closer to roasting's multi-factor weighting than precedence), ADR-0005's cross-project asymmetry argument weakens.

**Mitigation**: Sprint M includes a deliberate check of this specific framing. If the framings are reconcilable (e.g. brewing precedence is the dominant mode but judgment-based weighting fires when signals overlap), document it. If they conflict, surface to Chris for a tie-break before any roasting-side ADR-driven work (Sprints 10-12) lands.

**Item to add to inventory**: track as `RISK-1`.

### 4.2 Composite Named Consideration split (BCP-6)

The v8.5 WBC corpus check Named Consideration bundles "WBC corpus + cross-cutting control patterns" as one item. The brewing cross-party brief flagged this as a potential split. If the composite obscures which half fired during a real brew during Sprints 1-5 (specifically Sprint 1's BR-2 BREWING.md edits could surface the split need), the split becomes pre-dogfood-safe rather than DEF.

**Mitigation**: Sprint 1's BR-2 review should explicitly check for this. If the writer (Claude Code) and reader (Chris) feel the composite obscures the test, promote BCP-6 from DEF to a same-sprint item.

### 4.3 Brewing-side MCP changes during dogfood (RESOLVED)

Chris-confirmed 2026-05-17: ALL brewing-side edits (schema, MCP Tools, prompts, registries, UI) are fair game during dogfood. The dogfood exercises the roasting + cupping iteration loop, not the brewing-side write surface. CR-5 moved from POST to PRE; lands in Sprint 3.

The brewing-side close-out full-fill flow DOES touch `push_brew` (the end of a closed bean produces a perfected-brew row), but Chris confirmed that's a separate workflow he's not blocking on for dogfood. Brewing-side MCP edits ride.

### 4.4 SYN-8 split (RESOLVED)

Chris-confirmed 2026-05-17: ship SYN-8 unified in Sprint 9 (both BREWING.md + ROASTING.md renamed together). Removes the transient asymmetry. Sprint 1 doesn't carry SYN-8.

### 4.5 Sprint 5 bundle size

Sprint 5 has 12 scoping/audit deliverables. Real risk of a single sprint becoming unreviewable. Splitting it into Sprint 5a (audits) and Sprint 5b (decisions) is the natural cut.

**Mitigation**: kickoff brief for Sprint 5 includes a checkpoint after item 6 — if review/cognitive load is too high, split there.

### 4.6 Sprint 12 cross-actor surface

Sprint 12 (RO-CP-5 + MCP-1 + CR-4 + CR-10 + CR-5) touches: schema (3 changes), MCP Tool surface (3 changes), ARBITER.md, registry files, prompts, UI. The 6-actor traceability matrix has the most exercise here. The new `check-mcp-bundle.ts` from Sprint 0 will fire if any of the MCP Tool additions register a new Resource without updating the bundle glob.

**Mitigation**: Sprint 12 kickoff brief includes the matrix as a checklist Claude Code completes inline before opening the PR.

### 4.7 Round 8 scope expansion (likely, not just possible)

Chris-confirmed 2026-05-17: Round 8 may add items to the DF-* inventory ("there might be some additional items because of that last one, but that will be the last data point we look at, but that might increase the scope of the number of items in that"). Chris offered to send the Round 8 shape inline if load-bearing for execution; not blocking on it now.

**Mitigation**:
- The blocking dogfood-merge gate explicitly waits for the Round-8-updated handoff brief before Sprint 6 begins (see § 3 gate item 3).
- Sprint M runs after Sprint 5, BEFORE Round 8 lands — its scope is "audit Sprints 1-5 substrate," not "audit dogfood inventory." Sprint M doesn't block on Round 8.
- Sprint 6's kickoff brief reads the updated handoff brief cold; if DF-A grows past 12-15 items, Sprint 6 splits into Sprint 6a (DF-A2 mechanical state-shape backfill leading) + Sprint 6b (remaining DF-A edits).

### 4.8 BREWING.md size already over 120KB tripwire

BREWING.md is at 188KB per CLAUDE.md sprint cadence § Standing tripwires. Sprints 1 + 2 add to it (BR-1 ✕ BR-2 ✕ WBC-1 ✕ WBC-6 ✕ WBC-7 ✕ WBC-8). Risk that the BREWING.md split sprint Chris mentions in the standing tripwires becomes the next-logical thing in Sprint R, which is exactly the right answer — but worth surfacing now so it doesn't become a surprise.

**Mitigation**: Sprint R explicitly weighs the BREWING.md split sprint as a candidate for the next sequence's first item.

### 4.9 Sprint 0 enforcement script depth

`check-mcp-bundle.ts` covers ONE pattern (Resource registration vs bundle glob). The broader 6-actor matrix is prose, not enforcement. Future Vercel-bundle-style misses on other axes (e.g. lib/types.ts changes not reflected in MCP Tool descriptions) remain possible.

**Mitigation**: name this explicitly as a known limitation in Sprint 0's CLAUDE.md edit. Mark "expand enforcement script coverage" as a Sprint R candidate if a 4th miss occurs in the post-Sprint-0 sequence.

---

## 5. Resolved decisions (Chris-confirmed 2026-05-17)

All 8 open questions from the initial draft are now resolved. Captured here for execution-session reference.

1. **Brewing-side MCP edits during dogfood**: PRE-safe. CR-5 (`fermentation_qualifiers` column + `push_brew` Tool field) moves to Sprint 3. All brewing-side schema/MCP/prompt/UI work is fair game during dogfood. The brewing-side close-out full-fill workflow is separate from the dogfood; not blocking on it.

2. **SYN-8 split or unified**: UNIFIED in Sprint 9. Both BREWING.md and ROASTING.md renamed together post-dogfood. No half-rename in Sprint 1.

3. **Sprint 5 split threshold**: ship as one with hard checkpoint after item 6. Only split into 5a + 5b if review load is too high mid-sprint.

4. **Round 8 fence**: Monday 2026-05-18 is the definitive last round. Chris will execute the one-shot.md production run from the new prompt + cup at day-7 + log Round 8 entry + update the handoff brief. May add items to the DF-* inventory; Sprint 6 sizing rebalances post-Round-8.

5. **ADR-0006 (substrate-practice gap audit)**: DEFERRED to "when a 3rd cross-party audit lands." Removed from Sprint 5. RO-CP-9 status = DEF.

6. **DF-SCH1-SCH4 enumeration**: enumerate at Sprint 5 kickoff. Bundling decision (single dedicated sprint after Sprint 14, or interleaved into Sprints 10-12) made at enumeration time when substrate overlap is visible.

7. **PRODUCT.md § Active Sprints 3.3-3.7 sequencing**: see new § 6 below. Sprint R reconciles 3.3-3.7 against the post-grilling/post-dogfood/post-consistency-check state. Do not interleave 3.3-3.7 into the current sequence.

8. **Sprint cadence vs session cadence**: L+ sprints may split plan and execute across two sessions. Avoid mega-sessions. Plan stays as one sprint conceptually; execution may take two sessions when prudent. L-sized sprints flagged in § 2 / § 3 with the "plan-execute split candidate" note.

## 6. PRODUCT.md § Active Sprints 3.3-3.7 scope-impact assessment

Quick read against the existing PRODUCT.md § Active Sprints to surface overlap with the post-grilling work. Chris's directive: reconcile these at Sprint R (after grilling + dogfood + consistency check land), not interleave into the current sequence.

| PRODUCT.md sprint | Original scope | Overlap with post-grilling sequence | Expected Sprint R disposition |
|---|---|---|---|
| **3.3** Auto-supersede paired sprint (#R88 + #R89 + MCP tool-list cache visibility) | 3 items, ~2-3h. `supersede_ids[]` parameter on `propose_doc_changes` + arbiter-side implicit-intent gap + MCP tool-list cache visibility | None. Independent MCP work. | **Survives intact**. Ships as scoped after Sprint R. |
| **3.4** Per-batch failure_boundary breach record | Plan-mode + impl. `failure_boundary` text → structured JSON + per-batch breach record + `/green/[id]` render. Schema work on `experiments`. | Adjacent to RO-CP-3 (fc_audibility enum on roasts) and Sprint 11/12 schema work. The CONTEXT.md "Experiment frame" entry names `failure_boundary` as a frame field. | **Survives**, possibly absorbed into Sprint 11 or 12 if substrate overlap warrants. Re-scope at Sprint R. |
| **3.5** Roest API parity Phase 3 | 7 items pull-side schema sweep. Includes #R65 HIGH IMPACT (Roest UTC date miscoding). | None. Independent Roest API integration work. #R65 is high-priority bug; should not be further delayed. | **Survives intact**, possibly bumped in priority if Sprint 11 schema sprints exposed more pull-side gaps. |
| **3.6** BREWING/ROASTING doc reconciliation | Doc-content fixes bundled. ROASTING.md anchor-confidence framing + R52 (BREWING.md subprocess spec disagrees with canonical) + R70-72 (STAGE 8 routing, Active Lots, one-shot calibration) + schema-describe micro-fixes (R45/R48/R51/R69/R86). | **HIGH overlap with Sprint 1 (BREWING.md edits) + Sprint 9 (ROASTING.md edits) + Sprint 14 (prompt vocab) + Sprint 7 (DF-B MCP schema-describe fixes).** Anchor-confidence framing is now in ADR-0003 (anchor profile canonicalization); schema-describe items overlap with DF-B 8 items. | **Scope shrinks substantially**. Sprint R re-scopes what's left. Likely the bulk of 3.6 absorbs into the post-grilling work; residual items become a small follow-up sprint. |
| **3.7** Prompt v5 rewrites | 9 items. `in-process-bean-incremental-sync.md` + `new-bean-intake.md` updates. R76-84: list_roest_inventory call + hopper_load_temp describe + density TBM + STAGE 1 drift + STAGE renumbering + patch_* mentioned + cupping composite key + STAGE 6 softened + producer_override caveat. | **HIGH overlap with Sprint 6 (DF Sub-PR A 10+ prompt-edit items) + Sprint 14 (roasting prompt vocab + recipe noun).** The 4-prompt rewrite shipped as PR #157 already addressed `new-bean-intake.md` and the lifecycle prompts. | **Scope shrinks substantially**. Sprint R re-scopes; many items absorbed by DF-A2 STAGE-0 state-shape migration + DF-A3-A10. Residual items become small follow-up sprint or fold into Sprint 14's RO-4 prompts vocab audit. |

**Sprint R deliverable**: a re-scoped PRODUCT.md § Active Sprints reflecting what's actually left of 3.3-3.7 after the post-grilling/post-dogfood work lands. Per Chris-confirmed: "look at all the product.md roadmap things and only do the ones in the context of what has actually been changed to merge all that stuff into the new main going forward."

---

## Appendix A: Cross-references

- Grilling followup files: `docs/sprints/grilling-2026-05-14-followups.md` through `grilling-2026-05-17-roasting-cross-party-followups.md`
- ADRs landed during grilling: `docs/adr/0003-anchor-vocabulary-canonicalization.md`, `0004-vset-close-schema-writing-seam.md`, `0005-parameter-type-conditional-signal-arbitration.md`
- Dogfood handoff brief: `docs/sprints/cleanup-queue-handoff-brief-2026-05-17.md` (pending merge to main from the parallel dogfood session)
- Continuous feedback log: `~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md` (Rounds 0-7 logged; Round 8 incoming)
- Methodology rules memory: `~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_methodology_rules.md` (R1 grep-first / R2 analytical-vs-operational / R3 confabulation ledger)
- Standing rules: `feedback_cross_system_audit.md`, `feedback_vercel_bundle_static_files.md`, `feedback_grilling_refresh_at_feature_ship.md`

## Appendix B: Plan revision protocol

This doc is the substrate the next ~17 execution sessions consume. Update it (not memory, not a separate doc) when:
- A new item surfaces during execution that needs sequencing
- A sprint bundle changes shape
- A risk flag fires
- An open question resolves

Don't update for:
- Per-sprint retrospectives (those live in `memory/project_*.md` as usual)
- Sprint kickoff briefs (each sprint generates its own from this plan)
- Shipped-log entries (those go in `docs/sprints/shipped.md` per cadence #4 roadmap-currency rule)
