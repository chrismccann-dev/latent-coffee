# Writing-path surface polish series — umbrella + session handoff

**Date opened:** 2026-05-26
**Roadmap location:** [PRODUCT.md § Active Sprints #3](../../PRODUCT.md#active-sprints)
**Status:** ACTIVE — sub-sprint 1 next up
**Successor on close:** Read-path surface polish series (PRODUCT.md § Active Sprints #4) — write the analog umbrella doc when sub-sprint 4 ships.

## Why this series exists

The claude.ai → MCP → DB writing layer is the mission-critical surface. Per Chris audio 2026-05-26: "we should do one big sprint on all of the surface layers of the writing path." The work spans 4 distinct sub-sprints that can ship as separate PRs but conceptually one surface area — pull-side parity, MCP ergonomics, prompt consolidation, and human-write surface deprecation.

Sequence runs BEFORE the read-path surface polish series because writing-path correctness is more critical than read-side UX. The Claude-Design-led redesign (PRODUCT.md § Active Sprints #5) cannot start until both surface polish series are complete.

## Sub-sprint sequence + status

Flip the status column as each sub-sprint ships. PR + retro links go in the rightmost column at ship time.

| # | Sub-sprint | Sizing | Status | PR / retro |
|---|---|---|---|---|
| 1 | [Sprint 3.5 — Roest pull-side audit + parity cleanup](sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md) | ~1-2d | NEXT UP | _pending_ |
| 2 | MCP ergonomics polish (Round 15 cluster) — § below | ~1-2h | QUEUED | _pending_ |
| 3 | Brewing-completion prompt consolidation — § below | ~30 min | QUEUED | _pending_ |
| 4 | Human-write surface deprecation — § below | ~1d | QUEUED | _pending_ |

## How to use this doc

**Starting sub-sprint 1 (Sprint 3.5):** open a new session and point at [docs/sprints/sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md](sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md). That brief is self-contained and opens with a back-pointer to this umbrella.

**Starting sub-sprints 2 / 3 / 4:** open a new session and point at this umbrella doc. The session reads the sequence + status table, scrolls to the relevant inline § below, and ships from the self-contained scope there.

**At the end of every sub-sprint** (mechanical handoff, no separate doc needed):
1. Flip the row in the status table above from QUEUED / NEXT UP → SHIPPED with PR + retro links.
2. Flip the next row from QUEUED → NEXT UP.
3. The closing message in the session names the next sub-sprint by number + title.
4. Next session has clean continuity from the table state.

**On the final sub-sprint (4) shipping:** follow [§ Series completion checklist](#series-completion-checklist) below — flips PRODUCT.md, writes series retro, authors the Read-path umbrella as analog.

---

## Sub-sprint 1 — Sprint 3.5 — Roest pull-side audit + parity cleanup

**Kickoff brief:** [sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md](sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md) (self-contained — open that file at session start).

Reshaped from the original Phase 3 scope per Chris audio 2026-05-26 — lighter, more audit-flavored. 6 audit items (R57 / R59 / R60 / R64 / R65 / R66) + 1 discovery item (RoR tracking fields).

---

## Sub-sprint 2 — MCP ergonomics polish (Round 15 cluster)

### Goal

Clear the Latent-side subset of the Round 15 MCP friction from `feedback_mcp_continuous_log.md`. Items 14 + 16 are claude.ai-client issues and stay in the feedback log; items 15(b) + 17 + 18 + 19 are local-Latent fixes that land here.

### Sizing

~1-2 hours. Single PR.

### Scope (in)

- **15(b)** — Completion-prompt auto-split for multi-citation `propose_doc_changes` bundles. Confirmed trigger: aggregate payload above a client-side ceiling between largest-single and 3-citation-sum. Action: chunk the response into multiple Tool-result payloads when the citation count or aggregate size crosses the ceiling.
- **17** — `propose_doc_changes` response payload should warn when `target_doc` is a redirect stub. Currently re-routes silently to the migrated cluster doc; warning should surface "target was redirect stub at X, routed to Y" so the caller can update its `target_doc` parameter.
- **18** — `list_doc_sections` on a redirect stub should return `redirect_to` field or pseudo-anchors. Currently returns dead-end stub anchors that are useless for downstream `propose_doc_changes` citation calls.
- **19** — `log-cupping.md` STAGE 5 design-rule list should front-load operator-fixed constants (charge 117°C / hopper 125°C — never varied per Sprint R Phase 4 Step 4 Group 5 audio-ratified constraint) BEFORE claude.ai conversationally floats an invalid lever like "consider charge temp adjustment for V2."

### Scope (out)

- Items 14 + 16 — both are claude.ai-client side; stay in feedback log for upstream report.
- Round 14 + earlier feedback items not explicitly listed above.
- New Tools or schema changes.

### Files likely to touch

- `lib/mcp/propose-doc-changes.ts` — 15(b) chunking; 17 redirect-stub warning.
- `lib/mcp/list-doc-sections.ts` — 18 redirect_to surfacing.
- `lib/mcp/docs.ts` — redirect-stub registry / lookup helper if shared between 17 + 18.
- `docs/prompts/log-cupping.md` — STAGE 5 reorder.
- Tool describe() strings if behavior changes warrant disclosure.

### Verification

- **End-to-end** — re-trigger a `propose_doc_changes` against a known redirect stub (e.g. legacy `docs/taxonomies/sworks.md`), confirm warning fires. Trigger a `list_doc_sections` on same; confirm `redirect_to` lands.
- **15(b) sizing test** — synthesize a 3+ citation bundle that crosses the prior ceiling, confirm chunking activates.
- **19 prompt visual scan** — open `log-cupping.md` STAGE 5, confirm operator-fixed constants are the first bullet in the design-rule list.
- **`npm run check:mcp`** — exit 0, 35 tools (count unchanged).
- **`npm run check:mcp-bundle`** — clean.
- **`npx tsc --noEmit`** — exit 0 via worktree node_modules symlink.

### Autonomy framing

All 4 items are mechanical or have explicit Chris-stated direction in the feedback log. Run autonomously per `feedback_autonomy.md` — no audio-confirm checkpoints expected. If a ceiling threshold for 15(b) is interpretive, AskUserQuestion before locking the number.

### Cross-references

- `feedback_mcp_continuous_log.md` § Round 15 — full friction context + item phrasing.
- `feedback_mcp_only_input.md` — operator-fixed constants principle for item 19.

---

## Sub-sprint 3 — Brewing-completion prompt consolidation

### Goal

Deprecate the two unused brewing-side prompts (`log-brew.md` + `propose-doc-changes-from-brew.md`) by converting to redirect stubs pointing at `bundled-brewing-completion.md`. Per Chris audio 2026-05-26: "doesn't use `log-brew.md` or `propose-doc-changes-from-brew.md` because `bundled-brewing-completion.md` covers the full path."

Aligns with [feedback_mcp_only_input.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_only_input.md) — when a prompt has a lived-practice replacement, deprecate the dead path.

### Sizing

~30 minutes. Single PR.

### Scope (in)

- Convert `docs/prompts/log-brew.md` → redirect stub pointing at `bundled-brewing-completion.md`. Preserve the original heading + one-line "this prompt was consolidated into the bundled flow on 2026-05-26" note + pointer.
- Convert `docs/prompts/propose-doc-changes-from-brew.md` → redirect stub same target, same shape.
- Update `lib/mcp/docs.ts` descriptions for both DOC_FILES entries to reflect the redirect-stub state (so claude.ai's list_docs surface doesn't recommend a dead path).
- Brew Recorder SKILL.md verification — confirm `bundled-brewing-completion.md` is named as the canonical brewing-completion entry; patch if it still references the deprecated prompts.
- One grep pass for stale cross-refs across `docs/`, `CLAUDE.md`, `BREWING.md` (stub), `CONTEXT-brewing.md`, all sub-skill cluster docs. Update any inline links to point at the bundled prompt.

### Scope (out)

- Roasting-side prompt consolidation (separate question; no Chris-confirmed direction yet).
- Logic changes to `bundled-brewing-completion.md` itself.
- Deleting the redirect-stub files outright (keep stubs for back-compat on any old session that loaded the old path; analog to the BREWING.md / ROASTING.md redirect-stub pattern).

### Files likely to touch

- `docs/prompts/log-brew.md` — convert to stub.
- `docs/prompts/propose-doc-changes-from-brew.md` — convert to stub.
- `lib/mcp/docs.ts` — DOC_FILES description edits.
- `docs/skills/brew-recorder/SKILL.md` (or whichever sub-skill owns the brewing-completion entry) — pointer verification.
- Cross-ref grep targets across `docs/skills/**`, `CLAUDE.md`, sub-skill cluster docs.

### Verification

- **Grep** — `grep -rn 'log-brew\|propose-doc-changes-from-brew' docs/ CLAUDE.md *.md` returns only the new stub files + this umbrella + the kickoff briefs. Any other hit is stale and gets updated in the same PR.
- **MCP surface** — `npm run check:mcp` + `npm run check:mcp-bundle` clean.
- **list_docs response** — manually invoke `list_docs` (or read the response shape from a test) and confirm the descriptions reflect redirect-stub state.

### Autonomy framing

Pure mechanical deprecation. Run autonomously. Only escalate if grep surfaces a load-bearing cross-ref in a sub-skill that suggests the bundled flow isn't actually a full replacement (e.g. a SKILL.md that explicitly hands off to `log-brew.md` mid-flow) — that's a Chris audio-confirm before flipping.

### Cross-references

- [feedback_mcp_only_input.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_only_input.md) — deprecation principle.
- `docs/prompts/bundled-brewing-completion.md` — the canonical replacement.
- BREWING.md / ROASTING.md current state — analog redirect-stub pattern reference.

---

## Sub-sprint 4 — Human-write surface deprecation

### Goal

Delete the remaining human-write surfaces on the app side. Per Chris audio 2026-05-26: "the app should only be orchestrated by claude.ai... I do not edit anything in the app. I do not fill out a form. I do not write anything." Single canonical writing path = claude.ai → MCP → Claude Code arbitrates.

Expanded from the prior "Edit-form mobile polish" + "Brewing-side `/add` + `/edit` deprecation" entries into one canonical pruning sprint. Roasting-side `/add?type=self-roasted` already deprecated in Sub Pages 6.6; this sprint closes the brewing-side analog.

### Sizing

~1 day. Mostly a deletion exercise. Single PR (additive-deletion only — no schema changes; no API changes other than removing unused routes).

### Scope (in)

Surfaces to delete:
- `/add?type=purchased` flow + Step 5 review pages (`app/(app)/add/page.tsx` + companion components).
- `EditBrewForm.tsx` + PATCH route (`app/(app)/brews/[id]/edit/` + `app/api/brews/[id]/route.ts` PATCH handler — keep the GET handler if it's used for read surfaces).
- Header `+ ADD` button — remove entirely (`components/Header.tsx`).
- Any `/edit` surface on `/green/[id]` if surviving from the pre-Sub-Pages-6.6 era.
- Stale form components: `<ProcessPicker>`, `<FlavorComposer>`, `<StructureTagsPicker>`, `<ModifierComposer>`, `<HybridSubformPicker>`, `<SaveGateWarning>`, `<CanonicalTextInput>` (if no read-surface consumer — verify before deleting), `<GrindSettingInput>`, etc. Keep the registries (`lib/*-registry.ts`); delete only the form chrome.
- API routes that are write-only and exclusively backed the deleted surfaces: `app/api/brews/import/route.ts`, `app/api/brews/parse/route.ts` (verify no MCP-side consumer first).
- Cross-reference grep + cleanup across `docs/`, `CLAUDE.md`, sub-skill clusters.

Read pages untouched. Brewing-side claude.ai prompts already canonical via MCP. Synthesis APIs untouched (they're read-trigger, not write).

### Scope (out)

- Schema changes — no migrations.
- MCP Tool changes — no additions or deletions.
- Registry edits — keep all `lib/*-registry.ts` intact (consumed by MCP write paths + read pages).
- Mobile-polish work on any surviving page — that's read-path series, not this.
- Synthesis pipeline — write-trigger but not a human-write surface.

### Files likely to touch

- `app/(app)/add/page.tsx` — delete.
- `app/(app)/brews/[id]/edit/EditBrewForm.tsx` + `page.tsx` — delete.
- `app/api/brews/[id]/route.ts` — drop PATCH handler (keep GET if consumed).
- `app/api/brews/import/route.ts` + `app/api/brews/parse/route.ts` — delete after consumer-grep confirms safe.
- `components/Header.tsx` — drop ADD button.
- `components/ProcessPicker.tsx`, `components/FlavorComposer.tsx`, `components/StructureTagsPicker.tsx`, `components/ModifierComposer.tsx`, `components/HybridSubformPicker.tsx`, `components/SaveGateWarning.tsx`, `components/GrindSettingInput.tsx`, `components/CanonicalTextInput.tsx` — delete each after consumer-grep confirms no read-surface use.
- `CLAUDE.md` § Brews / § Add brew (purchased) / § Edit brew — rewrite sections to reflect MCP-only state.
- `PRODUCT.md` — any inline references to the deprecated surfaces (likely none post-roadmap-re-session, but grep + verify).
- Sub-skill cluster docs that reference `/add` or `/brews/[id]/edit` flows.

### Verification

- **Build + typecheck** — `npx tsc --noEmit` exit 0 via worktree node_modules symlink; `npm run build` exit 0 (if runnable locally; otherwise rely on Vercel preview).
- **Vercel preview deploy** — confirm the read pages (`/`, `/brews`, `/brews/[id]`, `/green`, `/green/[id]`, `/terroirs`, `/cultivars`, `/processes`, `/roasters`) all render. Header should show no ADD button. Navigating to `/add` should 404 cleanly.
- **No-regression grep** — `grep -rn 'EditBrewForm\|/add?type\|FlavorComposer' app/ components/ lib/ docs/ CLAUDE.md` returns no live consumers.
- **MCP surface unchanged** — `npm run check:mcp` exit 0, 35 tools (count unchanged); `npm run check:mcp-bundle` clean.
- **Manual smoke** — open Vercel preview, click through every read surface from the header, confirm no broken links or 500s.

### Autonomy framing

Mostly mechanical. Run autonomously per `feedback_autonomy.md`. **Two audio-confirm checkpoints expected:**
1. **Before deleting any `lib/*-registry.ts` consumer component** that might be read-surface load-bearing (e.g. `<CanonicalTextInput>` if a read surface uses it for display rendering, not just write input). Surface the list of "delete candidates with unclear read-surface dependency" via AskUserQuestion before flipping.
2. **Before deleting `app/api/brews/import/route.ts` / `app/api/brews/parse/route.ts`** if grep surfaces any consumer outside the deleted UI flows (e.g. an MCP path that happened to share the API). Audio-confirm before deletion.

Otherwise: delete, verify, push + merge.

### Cross-references

- [feedback_mcp_only_input.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_only_input.md) — the standing principle this sprint closes out for the brewing side.
- `project_sub_pages_6_6_*.md` (roasting-side analog, already shipped) — pattern reference for what "deprecate a write surface" looks like in this codebase.
- CLAUDE.md § Add brew (purchased) / § Edit brew — the sections that need rewriting post-deletion.

---

## Series completion checklist

Run this when sub-sprint 4 ships. The umbrella isn't done until every box is checked.

- [ ] **Status table flips:** sub-sprint 4 row → SHIPPED with PR + retro link.
- [ ] **PRODUCT.md § Active Sprints #3** flips from ACTIVE → CLOSED (analog to how Architecture implementation #1 was closed). Move the entry to a one-paragraph summary referencing this umbrella + the 4 retros.
- [ ] **PRODUCT.md § Active Sprints #4 (Read-path surface polish series)** promotes from QUEUED → ACTIVE. Update the section opener to reflect the in-flight state.
- [ ] **Series retrospective** — write `~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_writing_path_surface_polish_series_2026-05-26.md` covering: 4 sub-sprints / what worked across the sequence / what surprised / cross-cutting friction / patterns to reuse for the read-path series. Update MEMORY.md index pointer.
- [ ] **Author the Read-path umbrella doc as analog** — `docs/sprints/read-path-surface-polish-series-2026-05-26.md` (or whatever date the read-path series opens). Same structure as this umbrella: purpose / sequence + status table / how-to-use / inline kickoff scopes for 4a–4f / completion checklist. Sub-sprint 4a (Green-bean polish bundle) gets the first kickoff brief pointer same way Sprint 3.5 does here.
- [ ] **shipped.md row** — append a line for the writing-path series closure: date, series name (bold), landmark summary.
- [ ] **MEMORY.md index** — add a pointer to the series retro under `# Shipped sprints (chronological)`.

---

## Cross-references

- [PRODUCT.md § Active Sprints #3](../../PRODUCT.md#active-sprints) — roadmap entry that surfaces this umbrella.
- [PRODUCT.md § Active Sprints #4](../../PRODUCT.md#active-sprints) — read-path series this work unblocks.
- [Sprint 3.5 kickoff brief](sprint-3-5-roest-pull-side-audit-kickoff-2026-05-26.md) — sub-sprint 1.
- [feedback_mcp_only_input.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_only_input.md) — standing principle behind sub-sprints 3 + 4.
- [feedback_autonomy.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_autonomy.md) — autonomy rule cited in every sub-sprint's autonomy framing.
- [shipped.md](shipped.md) — the chronological ship log to update on each sub-sprint close.
