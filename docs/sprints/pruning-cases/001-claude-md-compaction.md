# Pruning case 001 — CLAUDE.md compaction

> Retroactive case study, cast into the structured-handoff format from the live session transcript (PR #352, 2026-06-02). The `extract` seed case — the first of the five shapes to get a worked example. Full transcript preserved at the bottom.

## Header

- **Doc pruned:** `CLAUDE.md` — 152.4 KB → 38.1 KB (PRODUCT.md 132 KB → 114 KB as a side effect of the shared design doc).
- **Trigger:** root-doc 120 KB tripwire (CLAUDE.md was ~32 KB over). Now tracked in [docs/architecture/doc-tripwires.md § Root living docs](../../architecture/doc-tripwires.md).
- **Shape(s) used:** **extract** (primary) + **split** (one source doc → four destination docs). Move-never-delete; zero content removed.
- **Judgment calls:**
  1. *Data Model depth* — keep inline vs. split entity-roster from per-column histories. Chris: bite the bullet and split now ("cheap now, harder every time a column gets added"). The line is stable: roster = every-session, column histories = on-demand.
  2. *Design system* — extract whole vs. keep inline. Resolved: extract full token map to `docs/design-system.md` (shared with PRODUCT.md) + keep a tight ~2 KB enforcement checklist inline (the rules wanted every UI session).
  3. *What stays in CLAUDE.md* — the "how we build" core (Git Discipline, Architecture, Dev notes, Sprint cadence, the Documentation Index as a pointer map); coffee-domain reference moves out behind pointers.
- **Heuristic learned:** **extract works cleanly when content has chronological-append or on-demand-reference shape** (per-page IA history, per-column migration notes, sprint logs) — content you only need when actively touching that surface. The split line is stable when one side is genuine every-session context and the other is reference-on-touch.

## Shape-coverage note

This case is pure `extract`/`split` — and that was genuinely correct here: the moved content (per-page IA, per-column histories, design token map) is on-demand-reference shape, the textbook extract fit. No content was stale enough to `delete` and nothing needed `consolidate` (no merging/synthesis — everything moved verbatim). This is exactly why the case **does not** advance coverage of the risky shapes; it reinforces that `extract` is the safe default and underlines the need to deliberately hunt `consolidate`/`delete` on a living-glossary doc (→ CONTEXT-roasting, case 002).

## Delete flags

None. Move-never-delete was the explicit constraint; 0 missing content lines / 0 missing headings verified against the pre-merge file.

## Result

- CLAUDE.md 152.4 → 38.1 KB; PRODUCT.md 132 → 114 KB (both under the 120 KB tripwire).
- 4 new on-demand docs: `docs/architecture/page-ia.md` (81 KB), `docs/architecture/data-model.md` (12 KB), `docs/architecture/registries.md` (20 KB), `docs/design-system.md` (27 KB, shared).
- Pointer stubs everywhere; standing `§ Green` / `§ Brews` etc. heading refs still land.
- `lib/mcp/docs.ts` untouched (no MCP registration needed). Verified move-never-delete: 0 missing lines/headings across all 7 moved ranges.
- Shipped: [PR #352](https://github.com/chrismccann-dev/latent-coffee/pull/352), merged to main at 0cc8e99.

## Transcript / detailed log

The full operator + Claude Code back-and-forth for this case is preserved verbatim in Chris's archive (`Claude.md pruning example.md`). Key arc: Chris read CLAUDE.md in full first and proposed the section-by-section pruning calls himself → Claude grounded the proposal against existing `docs/reference/*` infrastructure (found `canonical-registries.md` + `synthesis-pipeline.md` already established the sequester+pointer pattern) → two judgment-call forks (data-model depth, design-system whole-vs-split) → plan mode → verbatim extraction with promoted sub-headings → move-never-delete verification → autonomy-rule ship (commit/push/PR/merge as one flow, post-approval). Notable: it cut harder than the plan's ~72 KB estimate (the Green IA block alone was ~30 KB).
