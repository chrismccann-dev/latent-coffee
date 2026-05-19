# Sprint R — Audit prep: claude.ai memory diff (as of 2026-05-25)

**Purpose:** Hand-off artifact for the upcoming audit-execution sprint. Chris uses this checklist to compare his claude.ai project memory + custom instructions against the current canonical state of the codebase, identifying what's stale on the claude.ai side.

**Why this matters:** Claude Code can't directly read or write claude.ai's project memory. The two surfaces drift when substrate changes land in the codebase but no one manually updates claude.ai's memory. This audit closes that gap.

**Scope baseline:** Everything that landed Sprints 0 through 14 + M + F (2026-05-18 through 2026-05-24) is potentially new to claude.ai's memory if Chris hasn't manually refreshed it during that window. ~12-day delta.

---

## How to use this doc

1. Open claude.ai → Settings → Custom Instructions (or the equivalent for the Latent project)
2. Walk each section below
3. For each item: either confirm "already in claude.ai memory" or copy/paste the suggested text into claude.ai's custom instructions / project memory
4. If you find sections in claude.ai's current memory that contradict the canonical state below, edit them
5. Output: list of stale items removed + new items added (feedback memory entry at end of audit sprint)

---

## Section 1 — Canonical taxonomies (current state, 11 axes)

If claude.ai's memory references counts or shapes that don't match below, refresh.

| Axis | Count | Source of truth | Recent delta |
|---|---|---|---|
| Macro Terroirs | 121 canonicals + 12 aliases across 38 countries | `lib/terroir-registry.ts` + `docs/taxonomies/regions.md` | No change since 2026-04-22 (sprint 1d.1) |
| Cultivars | 63 canonicals + 48 aliases | `lib/cultivar-registry.ts` + `docs/taxonomies/varieties.md` | No change since 2026-04-22 |
| Genetic Families | 5 Arabica + 3 non-Arabica | Same as cultivars | No change |
| Processes | 4 base + 7 honey sub + 4 modifier axes + 15 signature methods + 1 qualifier (`Anoxic`) | `lib/process-registry.ts` + `docs/taxonomies/processes.md` | **Sprint T1 (BR-1)** widened signatures 3→15 + deprecated Hybrid Washed. **Sprint T3 (CR-5)** added `fermentation_qualifiers` axis with `Anoxic` canonical. |
| Brewers | 46 canonicals + 24 aliases | `lib/brewer-registry.ts` + `docs/taxonomies/brewers.md` | No change since sprint 1f |
| Filters | 64 canonicals + 34 aliases | `lib/filter-registry.ts` + `docs/taxonomies/filters.md` | No change since sprint 1f |
| Producers | 120 canonicals + 65 aliases | `lib/producer-registry.ts` + `docs/taxonomies/producers.md` | **Sprint T3 (CR-2)** removed Nordic Approach as alias (real producer relationship reverted to Mekuria Mergia & Elias Rooba). |
| Roasters | 70 canonicals + 24 aliases across 6 families | `lib/roaster-registry.ts` + `docs/taxonomies/roasters.md` | No change |
| Roast levels | 8 Agtron-anchored buckets + 22 aliases | `lib/roast-level-registry.ts` + `docs/taxonomies/roast-levels.md` | No change |
| Grinders | 1 canonical (EG-1 enumerated 51 settings) | `lib/grinder-registry.ts` + `docs/taxonomies/grinders.md` | No change |
| Flavors | 182 bases + 43 modifiers + 29 structure tags (3-axis composable) | `lib/flavor-registry.ts` + `docs/taxonomies/flavors.md` | No change |
| **SWORKS valve flow** | **NEW: 1 canonical (Bottomless Dripper) + enumerated dial states 0-8** | `lib/sworks-registry.ts` + `docs/taxonomies/sworks.md` | **Sprint T5 (CR-7)** added the 11th canonical axis. Vocabulary anchor only — not yet referenced in `brews` schema. |

**Net new since pre-grilling:** SWORKS canonical axis · signature methods 3→15 + Hybrid Washed deprecation · `Anoxic` fermentation qualifier · Nordic Approach alias removed.

---

## Section 2 — MCP Tool surface (35 Tools as of 2026-05-21)

If claude.ai's memory says 32, 33, or 34 Tools, refresh. Most recent: **Sprint 12 / CR-4 added `list_skeleton_entries`** (34 → 35).

**Read tools:** `read_doc`, `read_canonical`, `get_green_bean`, `get_bean_pipeline`, `list_roest_inventory`, `list_roest_logs`, `pull_roest_log`, `read_doc_section`, `list_doc_sections`, `list_canonicals`, `list_skeleton_entries`, `get_brew`, `list_taxonomy_queue`, `list_recent_brews`, `list_docs` (15)

**Write tools (push_*):** `push_brew`, `push_green_bean`, `push_inventory`, `push_experiment`, `push_roast_recipe`, `push_roast_profile`, `push_roast`, `push_cupping`, `push_roast_learnings` (9)

**Patch tools (patch_*):** `patch_brew`, `patch_green_bean`, `patch_inventory`, `patch_experiment`, `patch_roast_recipe`, `patch_roast_profile`, `patch_roast`, `patch_cupping`, `patch_roast_learnings` (9)

**Arbitration / doc tools:** `propose_doc_changes`, `propose_canonical_addition`, `resolve_queue_entry` (3)

**Total: 35 Tools.** Auth: bearer-token (desktop MCP clients) + OAuth 2.1 + PKCE (claude.ai web). All documented in [SYNC_V2.md](../../SYNC_V2.md).

---

## Section 3 — MCP Resources (`docs://`)

If claude.ai's memory references a different Resource set, refresh. Current registered Resources in [lib/mcp/docs.ts](../../lib/mcp/docs.ts) `DOC_FILES`:

- `docs://brewing.md`
- `docs://roasting.md`
- `docs://context.md`
- `docs://product.md`
- `docs://sync.md`
- `docs://arbiter.md`
- `docs://taxonomies/<axis>.md` × 11 (incl. **NEW sworks.md** from Sprint T5)
- `docs://roasting/archive.md`, `docs://roasting/wbc-roasting.md`, `docs://roasting/wbc-sourcing.md`, `docs://roasting/dongzhe-livestream.md`, `docs://roasting/redesign.md`
- `docs://brewing/roasters.md`, `docs://brewing/wbc.md`, `docs://brewing/wbc-recipes.md`
- `docs://prompts/<flow>.md` × 11 (start-lot, log-roast, log-cupping, close-lot, one-shot, one-shot-closeout, start-brew, log-brew, bundled-brewing-completion, propose-doc-changes-from-brew, in-process-bean-incremental-sync, new-bean-intake)
- `docs://features/...` × multiple feature scoping docs

**Net new since pre-grilling:** sworks.md (Sprint T5) · importer-exporter-scoping.md (Sprint T3 CR-3) · roasting/redesign.md (Sub Pages 6 series).

**NOT registered as Resources (intentional):** `docs/audits/2026-05-18/*` are internal audit trail, not catalog-served. `docs/sprints/*` are session-scoped, not Resource-served.

---

## Section 4 — ADRs (Architectural Decision Records)

Live in `docs/adr/`. If claude.ai's memory says fewer than 10, refresh. Current state:

| ADR | Title | Sprint |
|---|---|---|
| 0001 | (initial) | — |
| 0002 | (initial) | — |
| 0003 | (cross-party grilling era) | grilling cluster |
| 0004 | (cross-party grilling era) | grilling cluster |
| 0005 | (cross-party grilling era) | grilling cluster |
| **0006** | **RESERVED** for substrate-practice gap audit mechanism (RO-CP-9 candidate, deferred per Chris-locked "wait for 3rd cross-party audit") | — |
| **0007** | elasticity → brewing-tolerance rename | Sprint 10 |
| **0008** | aromatic + structural behavior relocation (roast_learnings → cuppings) | Sprint 11 |
| **0009** | carry-forward scope tags on roast_learnings | Sprint 12 |
| **0010** | cross-source synthesis + 3-call pipeline | Sprint 13 |

**Net new since pre-grilling:** ADRs 0007-0010 (4 new). 0006 reserved slot is intentional, not a numbering error.

---

## Section 5 — Recent substrate changes (Sprints 0-14 + M + F summary)

If claude.ai's memory doesn't mention any of these, surface them.

### Schema migrations (11 new, 055-065)
- **055** (Schema S1): `cuppings.wb_agtron` + generated `wb_to_ground_delta` column
- **056** (Schema S2): `roasts.is_reference_candidate boolean`
- **057** (Schema S4): `roast_recipes.was_backfilled boolean` + `backfill_notes text`
- **058** (T1 / BR-1): Hybrid Washed decomposition (one row re-mapped to `[Anaerobic, Aerobic] Washed`)
- **059** (T3 / CR-5): `brews.fermentation_qualifiers text[]`
- **060** (Sprint 10 / RO-1+3): rename `roast_learnings.elasticity` → `brewing_tolerance` + add `terroir_takeaway` column
- **061** (Sprint 11 / RO-CP-3): `roasts.fc_audibility` 4-value enum
- **062** (Sprint 11 / RO-6): relocate `aromatic_behavior` + `structural_behavior` from `roast_learnings` → `cuppings`
- **063** (Sprint 12 / MCP-1): widen `taxonomy_overrides_queue` CHECK 7→8 (add `signature_method`)
- **064** (Sprint 12 / RO-CP-5): 4 paired `*_scope_tags text[]` columns on `roast_learnings`
- **065** (Sprint 13 / SYN-3+7): 8-column add across 4 synthesis cache surfaces (`short_form_capsule` + `synthesis_input_max_updated_at`)

### Vocabulary locks (Sprint 14 / RO-CP-6)
- **recipe** = canonical aggregate noun for design intent (the `roast_recipes` entity)
- **Roest profile** = machine artifact (JSON pushed to Roest tablet)
- **anchor profile / reference roast profile / curve-shape names** = transferable starting frameworks at V1 design time (NOT same as `roast_recipes` row, NOT same as Roest profile)
- These three are distinct nouns. Don't conflate.

### Synthesis pipeline (Sprint 13 / ADR-0010)
- **3 LLM calls per synthesis**: raw → humanizer (strip AI-tells) → short-form digest (mobile)
- **4-tier corpus classifier** (Sprint T4) replaces the prior binary early-data flag: early / emerging / established / mature thresholds drive paragraph + takeaway count + max_tokens
- **Cross-source corpus** (SYN-6): terroir / cultivar / roaster adapters read both `brews` AND `roast_learnings` rows. Process adapter unchanged.
- **Resynthesize trigger** (SYN-7): every cache surface carries `synthesis_input_max_updated_at` — SynthesisCard regenerates on delta
- **Mobile short-form** (SYN-3): `short_form_capsule` column renders below `md:`, long-form at `md:` and up

### Roasting close-out vocab
- `roast_learnings.elasticity` → `brewing_tolerance` (Sprint 10 / ADR-0007 / migration 060)
- `roast_learnings.terroir_takeaway` added alongside cultivar_takeaway + general_takeaway (Sprint 10)
- `aromatic_behavior` + `structural_behavior` moved from `roast_learnings` to `cuppings` (Sprint 11 / ADR-0008 / migration 062)
- `roasts.fc_audibility` (audible / subtle / silent / ambiguous) — Sprint 11 / migration 061
- `roasts.is_reference_candidate` — mid-flight quality flag, distinct from final `is_reference` and recipe-replay `worth_repeating` (Schema S2 / migration 056)
- `roast_learnings.*_scope_tags text[]` for cross-lot SQL queries (Sprint 12 / ADR-0009 / migration 064)

### Brewing-side
- `brews.fermentation_qualifiers text[]` (Sprint T3 / CR-5 / migration 059) — canonical today is `['Anoxic']` for sealed-container no-headspace; aggregation stays at modifier per CONTEXT.md § Qualifier
- 15 signature methods canonical (Sprint T1 / BR-1): Moonshadow, TyOxidator, Alchemy, TIM, XO, Enzyflow, Bio-innovation, Sous-vide, Amazake, Anti-maceration, Dynamic cherry, Dry fermentation, Splash, Symbiotic, Wave Hybrid

---

## Section 6 — CONTEXT.md flagged ambiguities (21 resolved across post-grilling era)

If claude.ai's memory references "open ambiguities" on any of these, refresh — they're resolved with strikethrough + "Resolved 2026-05-XX Sprint N" attribution in CONTEXT.md:

Brewing tolerance / Acceptable roast window / Terroir takeaway / FC audibility state / Aromatic behavior / Structural behavior / Rest behavior (preserved, not relocated) / Scope tags / Scope-tag prefix convention / Cross-source / Short-form capsule / Recipe / Roest profile / Curve-shape names / Fermentation qualifier / Reference candidate / Signature method / Portfolio lanes / Sourcing channels / Importer-exporter scoping / Anoxic.

If anything is missing or stale, refer to live CONTEXT.md for current locked text.

---

## Section 7 — Standing principles (verify alignment)

These principles are codified in CLAUDE.md + memory. If claude.ai's memory contradicts any, refresh:

1. **claude.ai via MCP is canonical input for ALL surfaces.** No manual DB inserts; no paste-into-spreadsheet. End-goal direction (Chris-stated 2026-05-13): `/add`, `/edit`, draft, and self-write form surfaces all eventually deprecate. Roasting deprecation shipped Sub Pages 6.6 (2026-05-13). Brewing follows as a future sprint. See `memory/feedback_mcp_only_input.md`.

2. **Brewing is archive-driven; roasting is iterative.** Brewing: claude.ai iterates locally, app gets the final brew. Roasting: Roest API streams logs/experiments/cuppings into app as the lot resolves, closes with reference roast + roast_learnings synthesis.

3. **6-actor matrix audit on every substrate change.** Trace the change through every actor that consumes or produces it. See CLAUDE.md § Sprint cadence #4.

4. **Standing tripwires:**
   - 120KB on any root-level living doc (currently **BREWING.md 204KB + ROASTING.md 132KB are PAST tripwire**)
   - Tool count crosses 50 (currently 35)
   - MEMORY.md index size (already warning)

---

## Output format for the audit-execution sprint

Per item touched in claude.ai memory, write a one-line entry in `memory/feedback_mcp_continuous_log.md` Batch <N> as a `claude.ai memory drift` finding. Example shape:

> `claude.ai memory drift: said Tool count was 32, refreshed to 35 (Sprint 12 added list_skeleton_entries). Updated project instructions.`

If a category in claude.ai's memory was BLANK on a substrate change (not stale but absent), log it as a `claude.ai memory gap` finding instead.

Bundle the audit's net findings into a single feedback memory at sprint close — likely `memory/project_audit_cluster_2026-05-XX.md`.
