# Writing-path surface polish series — 2026-05-26

**Series umbrella** for the claude.ai → MCP → DB writing layer cleanup work. PRODUCT.md § Active Sprints #3. Four sub-sprints that ship as separate PRs but are conceptually one surface area — the writing path is mission-critical (per Chris audio 2026-05-26: "this layer becomes a much more important one and much more critical one to get correct").

This doc is the **session handoff** between sub-sprints. When you finish one sub-sprint and start a new session for the next, point that session here.

## Series purpose

Post-architecture (Waves 1-4 closed 2026-05-21) the writing path has accumulated friction across three categories:

1. **Roest pull-side fidelity** — what comes back from the Roest API vs. what we capture vs. what we surface (Sub-sprint 1 / Sprint 3.5).
2. **MCP response-shape ergonomics** — Tool responses that mislead, redirect-stub blindness, prompts that surface invalid levers before constraints load (Sub-sprint 2).
3. **Canonical-input alignment** — the writing path should be ONE path (claude.ai → MCP → Claude Code arbitrates). Brewing-completion prompts converge on `bundled-brewing-completion.md` (Sub-sprint 3); human-write surfaces (`/add`, `/edit`) deprecate (Sub-sprint 4).

After this series ships, the writing path is stable enough to support the Read-path surface polish series (PRODUCT.md § Active Sprints #4) without writing-path drift hurting read-side polish.

## Sub-sprint sequence

| # | Sub-sprint | Sizing | Status | Kickoff doc |
|---|---|---|---|---|
| 1 | Sprint 3.5 — Roest pull-side audit + /datapoints/ unlock | ~3-4h actual (vs ~1-2 days kickoff sizing) | SHIPPED — [PR #263](https://github.com/chrismccann-dev/latent-coffee/pull/263) / main `451935d` | [sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md](./sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md) + [post-ship reshape](../features/roest-api-parity-phase-3.md) |
| 2 | MCP ergonomics polish (Round 15 cluster) | ~1.5h actual | SHIPPED — [PR #266](https://github.com/chrismccann-dev/latent-coffee/pull/266) / main `e6eca4a` | Inline § below |
| 3 | Brewing-completion prompt consolidation | ~30 min actual | SHIPPED — [PR #268](https://github.com/chrismccann-dev/latent-coffee/pull/268) / main `5cd9d4b` | Inline § below |
| 4 | Human-write surface deprecation | ~3h actual (vs ~1 day kickoff sizing) | SHIPPED — [PR #TBD] / main `TBD` | Inline § below |

**Sequencing logic:**

- Default order is 1 → 2 → 3 → 4. Loosely coupled — Sub-sprints 2 + 3 are small enough to swap if a quick-win is preferable.
- Sub-sprint 4 ships last (most destructive — deletes the human-write fallback surfaces; want the writing path verified stable before pruning).
- Sub-sprints 2 + 3 are independent of each other; either can ship before the other.

**Series completion:** when all 4 sub-sprints have shipped + merged + landed in `shipped.md`, update PRODUCT.md § Active Sprints — flip #3 to CLOSED, promote #4 Read-path series to ACTIVE.

## How to use this doc

- **Starting Sub-sprint 1**: open the dedicated kickoff brief at [sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md](./sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md). That doc has full per-item detail.
- **Starting Sub-sprint 2, 3, or 4**: point a new session at THIS doc + scroll to the relevant inline kickoff § below. Each has self-contained scope; no separate kickoff brief needed.
- **At the end of any sub-sprint**: update the Status column above in this doc as part of the ship PR (SHIPPED + PR # + merge commit). Surface "Sub-sprint N+1 is next" in the closing message so the next session has a clear handoff.

## Cross-system audit reminder

Per CLAUDE.md sprint cadence #4, every sub-sprint that changes substrate (new field / Tool / prompt vocabulary / sub-skill doc) must trace through the **six-actor chain** before declaring done. The writing-path series touches Actors 4 + 5 + 6 most heavily (MCP / Claude Code / app schema). Actor 2 (prompts) lands in Sub-sprint 3 specifically. Actor 1 (Chris) is the verifier on real-lot dogfood.

---

## Sub-sprint 1 — Sprint 3.5 — Roest pull-side audit + parity cleanup

**Full kickoff brief:** [sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md](./sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md).

TL;DR: 6 audit items (R57 / R59 / R60 / R64 / R65 / R66) + 1 new discovery item (RoR tracking fields) + roest-api-worker sub-skill vocabulary sync. Lighter than the original Phase 3 scope per Chris audio — several items will resolve to "documented as manual augmentation." One audio-confirm checkpoint on the RoR migration scope decision.

**Sizing:** ~1-2 days.

---

## Sub-sprint 2 — MCP ergonomics polish (Round 15 cluster)

**Inline kickoff scope (no separate brief needed).** From `feedback_mcp_continuous_log.md` Outstanding follow-ups items 14-19; items 14 + 16 are claude.ai-client issues (stay in feedback log); items 15(b) + 17 + 18 + 19 are Latent-side and ship here.

### Goal

Tighten the writing-path response shapes + one prompt edit. Four small fixes; no schema changes.

### Items

1. **15(b)** — Completion-prompt auto-split for multi-citation `propose_doc_changes` bundles.
   - Confirmed via Round 15 diagnostic: aggregate-payload (proposed_text + rationale sum across citations) above a client-side ceiling between largest-single and 3-citation-sum trips persistent approval gating.
   - **Direction**: completion prompts (`bundled-brewing-completion.md` + `close-lot.md` + `one-shot-closeout.md`) that emit multi-citation `propose_doc_changes` calls should auto-split into per-(target_doc, section_anchor) singles when targeting more than one doc.
   - **Touches**: `docs/prompts/bundled-brewing-completion.md` + `docs/prompts/close-lot.md` + `docs/prompts/one-shot-closeout.md`. Prompt-side rewrite at the propose_doc_changes call point.

2. **17** — `propose_doc_changes` response payload should warn when `target_doc` resolves to a redirect stub.
   - Today: prior sessions wrote `target_doc: "roasting.md"`; system silently re-routed to migrated cluster doc. Operator had no signal.
   - **Direction**: extend `lib/mcp/propose-doc-changes.ts` response to include a warning field when the resolved doc differs from the input `target_doc` (e.g. when input matches a redirect-stub URI).
   - **Touches**: `lib/mcp/propose-doc-changes.ts` (response shape + tool description).

3. **18** — `list_doc_sections` on a redirect stub should return `redirect_to` field or pseudo-anchors.
   - Today: `Available anchors (1): ROASTING.md` is a dead-end if you don't think to `read_doc` the stub body.
   - **Direction**: extend `lib/mcp/docs.ts` `list_doc_sections` handler — when the requested doc is a redirect stub (detect via stub pattern or front-matter flag), return `redirect_to: '<cluster-path>'` + pseudo-anchors derived from the redirect table.
   - **Touches**: `lib/mcp/docs.ts` (handler + tool description).

4. **19** — `log-cupping.md` STAGE 5 design-rule list should front-load operator-fixed constants.
   - Today: claude.ai conversationally floated "lower charge temp 113-115°C" before reading `between-batch-protocol.md` and seeing the Item 25 / Group 5 audio-ratified constraint (charge 117°C / hopper 125°C never varied).
   - **Direction**: edit `docs/prompts/log-cupping.md` STAGE 5 to surface operator-fixed constants block BEFORE the design-rule list.
   - **Touches**: `docs/prompts/log-cupping.md` (STAGE 5 prose).

### Verification

- `npm run check:mcp` exit 0 (35 tools unchanged).
- `npx tsc --noEmit` exit 0.
- `npm run check:mcp-bundle` clean.
- End-to-end dogfood: re-run a multi-citation propose_doc_changes call from a brew or roast completion to confirm auto-split works + a `read_doc('roasting.md')` to confirm redirect-stub warning surfaces.

### Sizing

~1-2h.

### Files likely modified

- `docs/prompts/bundled-brewing-completion.md`
- `docs/prompts/close-lot.md`
- `docs/prompts/one-shot-closeout.md`
- `docs/prompts/log-cupping.md`
- `lib/mcp/propose-doc-changes.ts`
- `lib/mcp/docs.ts`

### Autonomy framing

Mechanical — all 4 items have clear directions + small surface area. Ship + verify + merge per `feedback_autonomy.md`.

---

## Sub-sprint 3 — Brewing-completion prompt consolidation

**Inline kickoff scope (no separate brief needed).** Deprecate two unused prompts per Chris audio 2026-05-26 — `bundled-brewing-completion.md` is what's actually used; `log-brew.md` + `propose-doc-changes-from-brew.md` are dead paths. Same shape as Sub Pages 6.6's `/add?type=self-roasted` deprecation per `feedback_mcp_only_input.md`.

### Goal

Deprecate the unbundled brewing-completion path; consolidate on the bundled prompt as the canonical brewing-completion entry. Tiny sprint; mostly redirect-stub rewrite.

### Steps

1. **Convert `docs/prompts/log-brew.md` to a redirect stub.** Pattern matches BREWING.md / ROASTING.md stubs — a thin pointer table redirecting to `bundled-brewing-completion.md`. Preserve the anchor name for any session still referencing the old path.

2. **Convert `docs/prompts/propose-doc-changes-from-brew.md` to a redirect stub.** Same pattern; redirect to `bundled-brewing-completion.md`.

3. **Update `lib/mcp/docs.ts`** — both `DOC_FILES` entries get their `description` field updated to note the redirect.

4. **Grep + cleanup cross-refs.** Search the codebase for any reference to the deprecated prompts (likely in `BREWING.md`, brewing-historian cluster docs, brewing-assistant cluster docs, possibly other prompts). Update each to point at `bundled-brewing-completion.md`.

5. **Brew Recorder SKILL.md verification.** Open `docs/skills/brew-recorder/SKILL.md`; confirm it names `bundled-brewing-completion.md` as the canonical brewing-completion entry. Edit if it references the deprecated paths.

### Verification

- `npm run check:mcp-bundle` clean (no DOC_FILES additions; descriptions updated).
- `grep -r 'log-brew\.md\|propose-doc-changes-from-brew\.md'` returns either redirect-stub bodies or the updated cross-refs — no stale assumptions.
- `npx tsc --noEmit` exit 0.

### Sizing

~30 min.

### Files likely modified

- `docs/prompts/log-brew.md` (rewrite to stub)
- `docs/prompts/propose-doc-changes-from-brew.md` (rewrite to stub)
- `lib/mcp/docs.ts` (description updates)
- Cross-refs (grep first; list at sprint start)
- `docs/skills/brew-recorder/SKILL.md` (verification edit if needed)

### Autonomy framing

Fully autonomous — Chris audio explicitly approved: "alright easy choice lets deprecate and go with bundled as canonical, its what i use anyway so no change for me."

---

## Sub-sprint 4 — Human-write surface deprecation

**Inline kickoff scope (no separate brief needed).** Final sub-sprint in the series; biggest deletion. Per Chris audio 2026-05-26: "the app should only be orchestrated by claude.ai... I do not edit anything in the app. I do not fill out a form. I do not write anything." Aligns with `feedback_mcp_only_input.md` standing principle.

### Goal

Delete every human-write surface in the app. The single canonical writing path = claude.ai → MCP → Claude Code arbitrates. Read pages stay untouched.

### Surfaces to delete

1. **`/add?type=purchased` flow** — the entire wizard at `app/(app)/add/page.tsx`. Was the 5-step review flow for purchased brews.
2. **`EditBrewForm.tsx` + PATCH route** — `app/(app)/brews/[id]/edit/EditBrewForm.tsx` + `app/api/brews/[id]/route.ts` PATCH handler (READ remains for `/brews/[id]` page; just remove the PATCH path).
3. **Header `+ ADD` button** — `components/Header.tsx`. The button removes entirely (no add surface left).
4. **`/edit` surface on `/green/[id]` if any** — verify and delete if present (likely none post-Sub-Pages-6.6 SR deprecation, but confirm).
5. **Stale form components** — `components/ProcessPicker.tsx`, `components/FlavorComposer.tsx`, `components/StructureTagsPicker.tsx`, `components/ModifierComposer.tsx`, `components/GrindSettingInput.tsx`, `components/HybridSubformPicker.tsx`, `components/CanonicalTextInput.tsx`, `components/SaveGateWarning.tsx`. Delete the form chrome. **PRESERVE the registries** (`lib/process-registry.ts` etc.) — those are still consumed by MCP validation + read-surface render + sub-skill canonical lookups.
6. **`lib/brew-import.ts`** — audit. The `findOrCreate*` helpers may still be consumed by MCP `push_brew`. Delete only the form-side adapters; keep the canonical-resolution helpers.

### Steps

1. **Pre-flight grep audit.** Map every file that imports / references the surfaces above. Don't trust the file list — verify against the codebase.
2. **Delete in dependency order.** Components → routes → pages → button → cleanup. Each step compiles before moving to the next.
3. **`lib/brew-import.ts` careful diff.** Per CLAUDE.md, this file has shared `validateCanonicalText` + 7 find-or-create helpers used by both UI and MCP. Surgical edit — preserve MCP-consumed paths.
4. **Cross-system audit** per CLAUDE.md sprint cadence #4. Six-actor walk:
   - Actor 6 (UI / schema / lib): confirm UI deletions don't break registry exports / API routes that MCP consumes.
   - Actor 4 (MCP): no Tool changes expected; verify `push_brew` + `patch_brew` paths still work.
   - Actor 5 (Claude Code): update CLAUDE.md to reflect form deletions (any `/add` / `/edit` mentions get rewritten or struck through).
   - Actor 2 (prompts): no prompt changes (prompts already canonical via MCP).
   - Actor 3 (claude.ai): no change in claude.ai-side workflow.
   - Actor 1 (Chris): visit the app post-deploy; confirm forms are gone, read surfaces intact.

### Verification

- `npm run check:mcp` exit 0 (35 tools unchanged).
- `npm run check:mcp-bundle` clean (no DOC_FILES changes).
- `npx tsc --noEmit` exit 0 — strict-null-checks compile cleanly post-deletion.
- Vercel preview deploy: `/add` returns 404; `/brews/[id]` renders without the Edit button; `/green/[id]` renders without any edit surface; existing brew + green-bean detail pages unchanged.
- `npm run check:registry-md-sync` clean — no registry drift.

### Sizing

~1 day. Most time is the careful audit + surgical edits to `lib/brew-import.ts` + Header + verification.

### Autonomy framing

Chris audio approved: "this should be mostly a deleting exercise — to lower the maintenance burden going forward... good to get it over with and be clear going forward that there is no more human write surface anymore." Ship + verify + merge per `feedback_autonomy.md`.

One audio-confirm checkpoint: if the pre-flight audit surfaces an unexpected consumer of one of the form components (e.g. CanonicalTextInput is used somewhere outside `/add` + `/edit`), surface that before deletion + AskUserQuestion the right scope.

### Files likely modified

- `app/(app)/add/page.tsx` (delete)
- `app/(app)/brews/[id]/edit/` (delete directory)
- `app/api/brews/[id]/route.ts` (delete PATCH handler; keep GET if any)
- `components/Header.tsx` (delete + ADD button)
- 8 form-component files in `components/` (delete; see list above)
- `lib/brew-import.ts` (surgical edit — keep MCP-consumed paths)
- `CLAUDE.md` (update any /add / /edit mentions)
- `PRODUCT.md` § Current App State — update `/add` row to mark deprecated (or delete the row)

---

## Series completion checklist

When Sub-sprint 4 ships:

- [ ] All 4 sub-sprint rows in this doc's sequence table show SHIPPED + PR # + merge commit
- [ ] PRODUCT.md § Active Sprints #3 flipped from ACTIVE → CLOSED
- [ ] PRODUCT.md § Active Sprints #4 (Read-path surface polish series) promoted to ACTIVE
- [ ] `shipped.md` has a row for the series closure (single combined row OR 4 per-sub-sprint rows; per convention, separate rows per significant ship)
- [ ] Memory retro at `~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_writing_path_polish_series_2026-XX-XX.md` capturing the series-level pattern (what worked, what didn't, what to mirror in Read-path series)
- [ ] CLAUDE.md § Pages — any references to `/add` + `/edit` removed or updated to "deprecated"
- [ ] Next session opens with the **Read-path surface polish series — 2026-XX-XX** umbrella doc (analog of this doc) authored as part of the series-closure PR

## Cross-references

- [PRODUCT.md § Active Sprints #3 Writing-path surface polish series](../../PRODUCT.md#active-sprints) — the canonical scope source
- [sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md](./sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md) — Sub-sprint 1 detailed kickoff
- [`feedback_mcp_continuous_log.md`](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md) Outstanding follow-ups items 14-19 — Sub-sprint 2 source
- [`feedback_mcp_only_input.md`](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_only_input.md) — standing principle that bounds Sub-sprints 3 + 4
- [docs/sprints/shipped.md](./shipped.md) — sprint-by-sprint ship log
