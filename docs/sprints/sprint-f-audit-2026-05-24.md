# Sprint F — Final cross-system sync audit (Sprints 0-14)

**Date:** 2026-05-24
**Sizing:** S (single session, audit + ride-along shipped.md backfill)
**Branch:** `claude/sprint-f-final-cross-system-sync-2026-05-24`
**Predecessor:** Sprint 14 (#191, merged 2026-05-19)
**Successor:** Sprint R (PRODUCT.md / roadmap review)

## Scope

Read-only 6-actor matrix audit across the full post-grilling-sequencing delta: Sprint 0 through Sprint 14. The matrix is the cross-system audit pattern locked in [CLAUDE.md § Sprint cadence #4](CLAUDE.md) — every substrate change should be traceable through each actor that consumes or produces it.

Per [post-grilling-sequencing.md § Sprint F](docs/sprints/post-grilling-sequencing.md), this is the gate before Sprint R. If clean, proceed to Sprint R; if drift surfaces, fix inline or queue per Chris-decision.

## Substrate-change inventory (Sprints 0-14)

### Schema migrations (11)

| # | Sprint | Migration | Substance |
|---|---|---|---|
| 055 | Schema (S1) | `cuppings_wb_agtron_delta.sql` | snapshots `wb_agtron` on cuppings + generated `wb_to_ground_delta` column |
| 056 | Schema (S2) | `roasts_reference_candidate.sql` | `roasts.is_reference_candidate boolean` |
| 057 | Schema (S4) | `roast_recipes_backfill_provenance.sql` | `was_backfilled boolean` + `backfill_notes text` |
| 058 | T1 / BR-1 | `signature_method_hybrid_washed_deprecation.sql` | Hybrid Washed decomposition |
| 059 | T3 / CR-5 | `brews_fermentation_qualifiers.sql` | `brews.fermentation_qualifiers text[]` |
| 060 | 10 / RO-1+3 | `brewing_tolerance_rename_and_terroir_takeaway.sql` | rename `elasticity` → `brewing_tolerance` + add `terroir_takeaway` |
| 061 | 11 / RO-CP-3 | `roasts_fc_audibility.sql` | `roasts.fc_audibility` 4-value enum |
| 062 | 11 / RO-6 | `cuppings_character_relocation.sql` | relocate `aromatic_behavior` + `structural_behavior` from `roast_learnings` to `cuppings` |
| 063 | 12 / MCP-1 | `taxonomy_queue_signature_method.sql` | widen queue axis CHECK 7→8 (add `signature_method`) |
| 064 | 12 / RO-CP-5 | `roast_learnings_scope_tags.sql` | 4 paired `*_scope_tags text[]` columns |
| 065 | 13 / SYN-3+7 | `synthesis_cross_source_and_short_form.sql` | 8-column add across 4 synthesis cache surfaces (`short_form_capsule` + `synthesis_input_max_updated_at`) |

### ADRs (4 new, 0007-0010; gap at 0006 intentional)

| ADR | Sprint | Title | Back-linked from |
|---|---|---|---|
| 0007 | 10 | elasticity → brewing-tolerance rename | CONTEXT.md L117 + L1530, migration 060 header, CLAUDE.md, shipped.md |
| 0008 | 11 | aromatic + structural relocation | CONTEXT.md L339 + L343 + L1534, migration 062 header, CLAUDE.md, shipped.md |
| 0009 | 12 | carry-forward scope tags | CONTEXT.md L258 + L262 + L1566, migration 064 header, CLAUDE.md, shipped.md |
| 0010 | 13 | cross-source synthesis + 3-call pipeline | CONTEXT.md L1337 + L1386 + L1562 + L1573, CLAUDE.md L53, shipped.md |
| (0006) | — | RESERVED for RO-CP-9 substrate-practice gap audit (deferred per Chris-confirmed: "when a 3rd cross-party audit lands") | post-grilling-sequencing.md L354 + L680 |

### MCP Tool surface

- **Tool count: 35** (2 from canonical-tools + 4 from doc-tools + 29 single-file). Matches [CLAUDE.md § MCP server status](CLAUDE.md) ("35 Tools live as of 2026-05-21").
- Sprint 12 / CR-4 added the one new Tool (`list_skeleton_entries`); prior 34-Tool baseline since Sub Pages 6.1.
- `lib/mcp/docs.ts` `DOC_FILES`: 14 paths covered by 8 globs in `next.config.js` `outputFileTracingIncludes['/api/mcp/**']`. `check:mcp-bundle` clean.

### Canonical surface deltas

- **Sprint T1 (BR-1):** `SIGNATURE_METHODS` registry 3 → 15 entries + Hybrid Washed deprecation (migration 058).
- **Sprint T5 (CR-7):** SWORKS Bottomless Dripper canonical surface — `docs/taxonomies/sworks.md` + `lib/sworks-registry.ts` + MCP catalog (TAXONOMY_AXES 10 → 11).
- **Sprint 14 (RO-CP-6):** recipe / Roest profile / curve-shape canonical-noun asymmetry locked. No registry change; vocabulary lock in CONTEXT.md + prompts.

### Prompt deltas

| Prompt | Sprint(s) | Surface |
|---|---|---|
| `one-shot.md` | T1, 11, 12, 14 | fc_audibility capture + aromatic/structural on cuppings + recipe noun |
| `one-shot-closeout.md` | 10, 11, 12, 14 | brewing_tolerance + terroir_takeaway + scope_tags + recipe noun |
| `close-lot.md` | 10, 11, 12, 14 | brewing_tolerance + terroir_takeaway + scope_tags + relocation notes + recipe noun |
| `log-roast.md` | 11 | fc_audibility capture |
| `log-cupping.md` | 11 | aromatic_behavior + structural_behavior capture (10 prose fields) |
| `start-lot.md` | (no Sprint 0-14 edits) | n/a |
| `start-brew.md` / `log-brew.md` / `bundled-brewing-completion.md` / `propose-doc-changes-from-brew.md` | (brewing-side, no Sprint 0-14 edits) | n/a |

## 6-actor matrix walk

| # | Actor | Outcome | Evidence |
|---|---|---|---|
| 1 | Chris (rendered UI) | ✅ clean | ResolvedView reads `aromatic_behavior` / `structural_behavior` from `pourover` (cuppings row) per Sprint 11 RO-6 / migration 062. SynthesisCard renders short-form below `md:` per Sprint 13 SYN-3. TO CARRY FORWARD card renders `terroir_takeaway` between cultivar + general. CharacterCard reads `brewing_tolerance` (renamed from `elasticity`). |
| 2 | `docs/prompts/*.md` | ✅ clean | Zero stale-vocab hits across 7 roasting-side + 4 brewing-side prompt files (greps: `elasticity\b` = 0 outside historical-rename comments; `Hybrid Washed` = 0; `Design the single profile` = 0; `<Z spec>` = 0; `key recipe specs one-liner` = 0). All Sprint 10-14 fields cited in the correct files. The aromatic/structural mentions in `close-lot.md` + `one-shot-closeout.md` are correct relocation notices, not stale citations. |
| 3 | claude.ai project instructions / Resource catalog | ✅ clean | `lib/mcp/docs.ts` registers all 14 doc files including sworks.md (Sprint T5), importer-exporter-scoping.md (Sprint T3 CR-3), dongzhe-livestream.md, redesign.md. TAXONOMY_AXES = 11 (sworks included). `docs/audits/2026-05-18/` files intentionally NOT registered as Resources (internal audit trail, not catalog-served). |
| 4 | MCP server (`lib/mcp/*.ts`) | ✅ clean | Tool count = 35. Every Sprint 10-14 schema column has matching Zod field in push/patch Tools with `.describe()` citing the migration + ADR. `signature_method_override` on push_brew; queue trio AXIS_VALUES widened to 8; `fermentation_qualifiers` on push/patch brew. `check:mcp-bundle` 14/8 clean. |
| 5 | Claude Code (CLAUDE.md + CONTEXT.md + docs/) | ✅ clean | CONTEXT.md has glossary entries for every Sprint 10-14 substrate change with explicit Sprint-N + migration + ADR back-links: Brewing tolerance / Acceptable roast window / Terroir takeaway / FC audibility state / Aromatic behavior / Structural behavior / Rest behavior (correctly not relocated) / Scope tags / Scope-tag prefix convention / Cross-source / Short-form capsule / Recipe / Roest profile / curve-shape names / Fermentation qualifier / Reference candidate / Signature method. ADR-0006 gap is intentional (deferred RO-CP-9 candidate). |
| 6 | Latent app (schema + UI + registries) | ✅ clean | All 11 migrations 055-065 land in `lib/types.ts` with provenance comments. `check:registry-sync` all 20 axes in sync. UI render paths verified at lines [page.tsx:1479-1490](../../app/(app)/green/[id]/page.tsx) (Sprint 11 character relocation) + [SynthesisCard.tsx:103-107](components/SynthesisCard.tsx) (Sprint 13 short-form). |

## Drift findings + resolution

### 1. `docs/sprints/shipped.md` — 4 missing Sprint 0-14 era rows

**Severity:** Medium — currency violation per the standing rule in `memory/feedback_sprint_closeout_roadmap_currency.md` (shipped.md row must land in the same PR as the sprint).

**Detail:**

| Sprint | PR | Status | Source of flag |
|---|---|---|---|
| Sprint 0 | #173 (merged 2026-05-18) | row never written | new finding this audit |
| Sprint 9 | #186 (merged 2026-05-19) | row never written | already flagged in Sprint 10's retro ("separate follow-up should backfill") |
| Sprint M | #185 (merged 2026-05-19) | row never written | already flagged in Sprint 10's retro |
| Sprint 14 | #191 (merged 2026-05-19) | row never written | new finding this audit (kickoff brief implied Sprint 14 included a shipped.md row, but the PR diff did not produce one) |

**Resolution (per Chris-decision 2026-05-24, ride-along Sprint F):** all 4 rows added to shipped.md in this PR + Sprint F row added at top. Five total inserts. Content derived from PR titles, commit messages, retros, and this audit's substrate inventory. Sprint F report itself is this file.

### 2. No other drift surfaced.

All other 6-actor matrix hops are clean. Every substrate change Sprint 0-14 is traceable through the chain. Substrate-practice gap candidates (ADR-0006) remain deferred per Chris's "wait for a 3rd cross-party audit" lock.

## Handoff to Sprint R

Sprint F closes clean post-ride-along. Sprint R (PRODUCT.md / roadmap review) opens with:

1. **PRODUCT.md § Active Sprint Queue** walks the post-grilling-sequencing-closeout state with a current shipped.md tableau.
2. **Deferred sprint candidates** at top of next-step list per [post-grilling-sequencing.md § Deferred sprints](docs/sprints/post-grilling-sequencing.md):
   - **POD-1** (pour-over discriminator gate + optimized brew lifecycle states) — Chris-flagged near-term 2026-05-18.
   - **DF-SCH-CAND-1..5** dogfood schema migration sprint enumeration — 4 of 5 candidates already shipped via Schema sprints S1-S4 + Sprints 11-12; Sprint R's job is to decide whether the 5th candidate (`experiments.taste_for_validation_*`) earns its own sprint.
   - **CR-7-promote** SWORKS valve flow taxonomy structured-pour-structure column.
   - **CR-9 / WBC-4-large** water taxonomy bootstrap.
3. **Roadmap currency** — surface anything in PRODUCT.md § Side Quests / Newly queued that's been quietly resolved by Sprints 10-14's work.

## Verification

- `npm run check:mcp-bundle` — 14 DOC_FILES / 8 bundle globs, clean.
- `npm run check:registry-sync` — all 20 axes in sync.
- Substrate-change inventory: matches per-sprint shipped.md rows + retro narratives.
- 6-actor matrix walk: each cell verified via targeted grep over the codebase (not agent-sampled).

## Retro / surprises

- **Substrate-side audit was much faster than expected.** Sprints 10-14 each documented their 6-actor matrix walk in their own shipped.md rows + retros, so Sprint F's job collapsed to spot-checking the assertions rather than re-deriving them from scratch. The retro discipline of writing the 6-actor walk INTO each sprint's shipped.md row is paying compounding cross-system audit dividends.
- **The one drift Sprint F caught (shipped.md missing 4 rows) is the same drift Sprint 10's retro already flagged.** The "separate follow-up" deferral compounds: Sprint M + Sprint 9 sat un-rowed since 2026-05-19; Sprint 0 + Sprint 14 added to the pile. Sprint F closes the loop by ride-along; the standing rule (`feedback_sprint_closeout_roadmap_currency`) should keep firing for future sprints to prevent re-accumulation.
- **ADR numbering gap at 0006 was a moment of confusion.** Initial read of `docs/adr/` flagged the missing 0006 as drift; cross-checking against `post-grilling-sequencing.md` confirmed Chris deliberately reserved 0006 for the substrate-practice gap audit candidate (RO-CP-9) and chose to defer until a third cross-party audit lands. Not a numbering error — the reserved slot is correct.
- **CONTEXT.md flagged-ambiguities cascade is healthy.** Every "Resolved 2026-05-XX Sprint N" strikethrough I found in the L1500s region corresponds to a real ship. No orphaned strikethroughs (claim-without-substrate); no orphaned substrate (substrate-without-glossary).

## Out of scope

- PRODUCT.md updates — those land in Sprint R.
- Any new substrate work — Sprint F is read-only audit + the narrow drift fix.
- Production DB verification of migrations — Sprint F is code-level audit; per-migration DB application was verified at each sprint's own ship time.
- ADR-0006 promotion — deferred per Chris-locked "3rd cross-party audit" trigger.
