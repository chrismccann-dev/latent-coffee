# Sprint M — Mid-sequence cross-system sync report

**Date**: 2026-05-18
**Sprint**: Sprint M (post-T5, pre-blocking-dogfood-merge-gate, pre-Sprint 6)
**Sizing**: S — 1-3h
**Master plan**: [post-grilling-sequencing.md § Sprint M](post-grilling-sequencing.md)
**Branch**: `claude/sprint-m-sync-audit-2026-05-18`

## Summary

Six-actor matrix walked against the substrate-change union from the 2026-05-18 audit window (T1-T5 + Schema sprints S1-S4 + cleanup-actions PR + CCIL pass). **Largely clean** — 5 drift spots inside the audit window + 2 pre-existing Tool-count stales discovered during audit, all fixed inline. No follow-up sprint needed. Sprints 6-14 may proceed unblocked once the blocking dogfood-merge gate clears (Chris-confirmed already cleared).

**Verification commands all pass**:
- `npx tsc --noEmit` (main repo, worktree can't run it per CLAUDE.md): EXIT 0
- `npm run check:registry-sync`: 20 axes in sync (incl. new `sworks`)
- `npm run check:mcp-bundle`: 14 DOC_FILES paths covered by 8 bundle globs
- `npm run check:migrations`: 1 pre-existing prefix collision at 046 (not introduced by audit window — both files predate by 12 days, PRs #108 / #111)
- Stale-vocabulary greps clean post-fix (Hybrid Washed survivors are all proper-noun lot names or historical sprint logs; `process_dominant` / `earlyData` / `Nordic Approach` / `roast_window` all canonical or historical-context only)

## Substrate union audited

T1 (#179) · T2 (#180) · T3 (#181 + #182) · T4 (#183) · T5 (#184) · Schema sprints S1-S4 (migrations 055-058 + S3 fold-in) · Cleanup-actions PR (28 items across 5 prompts + 7 MCP files + 3 page sections + 3 CONTEXT.md entries) · CCIL consolidation pass (ROASTING.md restructure + ARBITER.md playbook).

## Actor 1 — Chris (human-facing surfaces)

**Status**: Clean ✅ (after 4 fixes — see Drift section).

- CONTEXT.md flagged-ambiguity entries from the 2026-05-16 grilling sessions: 10 closed inline at "Resolved 2026-05-18" markers (T1 / T3 CR-1 / T3 CR-2 / T4 SYN-2 / T5 CR-7 + RO-7 cluster + others). Spot-checked § Qualifier (CR-1 corrective locked), § Reference candidate (S2 entry), § Corpus tier (T4 entry), § Backfilled recipe (S4 entry) — all coherent.
- 11 audit decision docs at [docs/audits/2026-05-18/](../audits/2026-05-18/) are reachable via filesystem (intentional per T5 — NOT registered as MCP Resources).
- `/brews/[id]` qualifier render `[Anaerobic Natural] QUALIFIER [Anoxic]` verified via T3 retro on Rosado brew.

## Actor 2 — `docs/prompts/*.md` (claude.ai session prompts)

**Status**: Clean ✅

Stale-vocab grep across all 10 prompt files (`start-brew.md` / `log-brew.md` / `propose-doc-changes-from-brew.md` / `bundled-brewing-completion.md` + `start-lot.md` / `log-roast.md` / `log-cupping.md` / `close-lot.md` / `one-shot.md` / `one-shot-closeout.md`) returned zero hits for `Hybrid Washed`, abstract Phase-Mapped vocabulary (`saturation.*body.*clarity`), `earlyData`, `Nordic Approach`, `process_dominant` (non-`is_` form), `roast_window` (non-`_width` form).

Schema sprints S1-S4 vocabulary propagation verified:
- `wb_agtron` / `wb_to_ground_delta` (S1): log-cupping.md STAGE 2 + one-shot.md STAGE 4
- `is_reference_candidate` (S2): log-cupping.md STAGE 3 + close-lot.md STAGE 2
- `sweetness` + `temperature_behavior` (S3): log-cupping.md STAGE 2 + one-shot.md STAGE 4 (both flagged "distinct axis from acidity / body — don't fold in")
- `was_backfilled` + `backfill_notes` (S4): log-roast.md STAGE 1(b) + log-cupping.md STAGE 0 (with canonical phrasing patterns)

T1 (signature methods 3→15) doesn't surface in prompts directly — the brewing-side prompts delegate process intake to BREWING.md + `canonicals://processes`; the roasting-side prompts don't address signature_method at all. No drift.

T3 (`fermentation_qualifiers`) doesn't surface in brewing prompts — same delegation pattern. Brewing-side picker deprecation is queued; claude.ai writes the field directly via push_brew / patch_brew. No drift.

## Actor 3 — claude.ai project instructions (MCP Resource consumers)

**Status**: Clean ✅ (next session start picks up additions)

- New `docs://taxonomies/sworks.md` Resource (T5) registered in [lib/mcp/docs.ts](../../lib/mcp/docs.ts) at L42-50 — visible alongside grinders.md, brewers.md, etc. claude.ai catalog refresh on next session start picks it up.
- New `docs://features/importer-exporter-scoping.md` Resource (T3 CR-3) registered at L51 — first `docs/features/` entry in DOC_FILES; bundle coverage extended in next.config.js (verified `check:mcp-bundle` passes 14/8).
- `canonicals://processes` axis (T3 CR-5) now exposes `fermentation_qualifiers` sub-axis — [lib/mcp/canonicals.ts:216](../../lib/mcp/canonicals.ts).
- `push_brew` + `patch_brew` Zod schemas (T3 CR-5) expose `fermentation_qualifiers: z.array(z.string()).optional().nullable()` with descriptions — [lib/mcp/push-brew.ts:140](../../lib/mcp/push-brew.ts) + [lib/mcp/patch-brew.ts:29](../../lib/mcp/patch-brew.ts).
- `push_cupping` + `patch_cupping` Zod (Schema sprint S3 fold-in) expose `sweetness` + `temperature_behavior` + `wb_agtron`.

## Actor 4 — MCP server (lib/mcp/*.ts Tools + Resources)

**Status**: Clean ✅

- **Tool count: 34** (was 32 at the 2026-05-06 baseline; Sub Pages 6.1 added `push_roast_recipe` + `patch_roast_recipe` on 2026-05-13). Counted via `grep -c 'registerTool(' lib/mcp/*.ts` summed: 28 single-tool files + 4 in `doc-tools.ts` + 2 in `canonical-tools.ts` = 34.
- **Bundle coverage**: 14 DOC_FILES paths under 8 globs in `next.config.js outputFileTracingIncludes['/api/mcp/**']`. Script enforced (sworks added at T5, importer-exporter-scoping.md glob added at T3 CR-3). No drift.
- **Stale enum check**: `Hybrid Washed` is not in any active Zod enum — `signature_method` is `z.string().optional().nullable()` (not z.enum), validated against `SIGNATURE_LOOKUP.canonicalize()` which now resolves only the 15 BR-1 canonicals.
- **No new Tools in audit window** — T-series + Schema sprints + cleanup-actions + CCIL pass were all additive (Zod fields + descriptions + Resources + behavior fixes), no new `registerTool` calls.

## Actor 5 — Claude Code (CLAUDE.md + CONTEXT.md + docs/)

**Status**: Clean ✅ (after 3 fixes — see Drift section).

- CLAUDE.md L92 fermentation_qualifiers paragraph (T3) ✅
- CLAUDE.md L92 signature_method 15-canonical enumeration + Hybrid Washed deprecation note (T1) ✅
- CLAUDE.md L165 SWORKS taxonomy paragraph (T5) ✅
- CLAUDE.md L112 + L124 Signature Methods nav surface counts (T1) ✅
- shipped.md rows 9-16 cover the full audit window: T5 / T4 / T3 / T2 / T1 / CCIL consolidation pass / cleanup-actions PR / Schema sprint (S1+S2+S4+S3 fold-in)
- PRODUCT.md roadmap currency: T1-T5 did NOT originate from PRODUCT.md § Active Sprints — they came from the post-grilling-sequencing.md master plan, which is the active queue surface for that work. No movement needed in PRODUCT.md. (The Active Sprints section continues to track Sprint 3.3-3.7 + General cleanup + Per-entity directed synthesis from the Sprint 3.1 brainstorm output.)

## Actor 6 — Latent app (schema + UI + registries)

**Status**: Clean ✅

- `npx tsc --noEmit` (main repo) returns EXIT 0.
- `check:registry-sync` confirms all 20 axes in sync (incl. sworks at ts:1 / md:1).
- Migration ledger: 058 (BR-1 Hybrid Washed → structured) + 059 (CR-5 fermentation_qualifiers) + 055/056/057 (S1/S2/S4) all applied. Pre-existing 046 prefix collision (PRs #108 + #111, 2026-05-06/07) flagged but out of audit window.
- `lib/sworks-registry.ts` + `lib/process-registry.ts` (signature methods 3→15) + `lib/producer-registry.ts` (Nordic Approach alias removed) all consistent with `docs/taxonomies/*.md` per registry-sync script.
- New UI render: `/brews/[id]` Process row qualifier display (T3 CR-5), `/processes/signatures/*` 15-canonical surface (T1), Schema sprint S3 fold-in renders sweetness + temperature_behavior on `/green/[id]` ResolvedView REFERENCE CUP card.

## Drift surfaced + fixed inline

Six edits to close drift discovered during the matrix walk. All small (1-line or 1-paragraph reframes) — no semantics change beyond aligning stated state with shipped state.

| # | File | Drift | Fix |
|---|---|---|---|
| 1 | [CLAUDE.md:30](../../CLAUDE.md) | "32 Tools live as of 2026-05-06" — stale since Sub Pages 6.1 (2026-05-13) added `push_roast_recipe` + `patch_roast_recipe` | Updated to "34 Tools live as of 2026-05-13" with the 6.1 attribution + prior-baseline pointer |
| 2 | [CLAUDE.md:300](../../CLAUDE.md) | "Currently 32 Tools" in tripwire enumeration | Updated to "Currently 34 Tools" |
| 3 | [PRODUCT.md:471](../../PRODUCT.md) | Hybrid Washed listed as a signature in the "synthesis variant" follow-up bullet | Reframed to reference the 15-canonical post-T1 list + name BR-1 deprecation explicitly |
| 4 | [BREWING.md:322](../../BREWING.md) | Signature Method spec lists `Hybrid Washed` as a canonical | Replaced 3-name enumeration with the 15-canonical post-T1 list + deprecation note pointing at the structured `[Anaerobic, Aerobic] Washed` replacement |
| 5 | [BREWING.md:420](../../BREWING.md) | Anoxic-natural row's qualifier note: "The qualifier is queryable and preserves the strategy distinction" — over-claim corrected by T3 CR-1 | Reframed to align with the locked corrective ("record-when-known annotation, NOT a strategy-decision layer"); kept the single-data-point Full-Expression call on the row as lot-specific record |
| 6 | [app/(app)/processes/page.tsx:5](../../app/%28app%29/processes/page.tsx) | Comment lists "Moonshadow / Hybrid Washed / TyOxidator" as the Signature Methods | Reframed comment to point at the 15-canonical post-T1 registry + name the 2 currently-brewed signatures (Moonshadow + TyOxidator) + Hybrid Washed deprecation |
| 7 | [CONTEXT.md:951](../../CONTEXT.md) | Qualifier-pattern-is-generalizable bullet uses "Wave Hybrid as a qualifier on Hybrid Washed" as the open example — both halves resolved differently in T1 / BR-1 | Reframed to document the T1 / BR-1 resolution (Wave Hybrid promoted to canonical; Hybrid Washed deprecated) and explicitly keep the pattern open for future cases |

## Out of scope (intentional)

- **046 prefix collision**: pre-existing from PRs #108 + #111 (2026-05-06/07); not introduced by audit window. Renumbering one of them is a separate cleanup; flagged in CONTEXT.md `migration-drift-pattern` follow-up.
- **PRODUCT.md roadmap reorder**: the T-series sprints sit in post-grilling-sequencing.md, not PRODUCT.md § Active Sprints — no roadmap currency rule applies.
- **Sprints 6-14**: post-dogfood execution. Sprint M is the gate; Chris-confirmed dogfood-merge gate is cleared. Sprint 6 (DF Sub-PR A) is the next sprint after Sprint M lands.

## Retro

- **Pre-flight verification commands cleanly bounded the audit window** — `check:registry-sync` + `check:mcp-bundle` + tsc all-pass meant the audit only had to look at substrate-side drift (CLAUDE / CONTEXT / BREWING / PRODUCT prose + page comments), not registry-mirror mismatches.
- **Stale-vocab greps caught all 5 in-window drifts** — 4 Hybrid Washed survivors (PRODUCT / BREWING / page.tsx / CONTEXT) + the related qualifier-as-strategy-layer over-claim in BREWING.md L420. The greps were the right shape; the matrix walk surfaced the qualifier framing separately because that one didn't grep on the word "Hybrid Washed" but on the CR-1 corrective semantics.
- **Two pre-existing CLAUDE.md Tool-count stales** (L30 + L300) discovered as ride-along — Sub Pages 6.1 (2026-05-13) added 2 Tools but the count line + tripwire line didn't get updated. Not in the strict audit window but the fix is 1-line. Decision: include in the same PR per "always open a PR even if a 1-file PR" question-3 default.
- **Audit time**: ~1.5h total — well under the S 1-3h bound.

## Branch + commit

Branch `claude/sprint-m-sync-audit-2026-05-18`. Single commit with the 7 fixes + this report. PR opens after commit per "always open a PR" Sprint M default.
