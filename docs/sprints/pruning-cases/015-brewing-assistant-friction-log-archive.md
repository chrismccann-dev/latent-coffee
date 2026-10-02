# Pruning case 015 — brewing-assistant cluster (friction-log archive + SKILL.md provenance)

> Structured handoff doc for a post-tripwire pruning exercise. Lead with the 5-line header so lessons aggregate across cases toward the eventual systematization decision (see [docs/features/doc-pruning-mechanism-brainstorm-2026-06-03.md](docs/features/doc-pruning-mechanism-brainstorm-2026-06-03.md)).

## Header

- **Doc pruned:** `docs/skills/brewing-assistant/` cluster **98.1 → 72.8 KB** (cap 100). Levers: `cluster/process-friction-log.md` **34.7 → 12.5 KB** (11 settled entries, 2026-06-15 → 07-28, moved verbatim to the new [docs/sprints/brewing-friction-archive.md](docs/sprints/brewing-friction-archive.md) 25.4 KB, outside the cluster; a one-line index per moved entry left in the live log); `SKILL.md` **8.8 → 5.7 KB** (§ Wave 3 PR 2 ship notes deleted, migration note compressed to a pointer). `operational-guide.md` untouched at 51.9 / 60.
- **Trigger:** preemptive pass at 98% of the 100 KB cluster cap (⚠️ approaching; would have re-tripped on the next brew), requested by Chris 2026-10-01 as the second of three cluster passes. The brief's hypothesis (RP8 / RP9 material duplicating CONTEXT-brewing / brewing-historian in the operational guide) was tested and **did not hold**: the guide took three one-line edits since case 013, and the only RP8 artifact is the 2.7 KB AeroPress method card (canonical, MCP-registered). The pressure was the friction log: 0 → 34.7 KB in 3.5 months (~2 KB per brew, 16 entries), append-only by its own rule and not MCP-registered. Chris ratified A (archive + Discipline amendment) and B (SKILL.md) 2026-10-01.
- **Shape(s) used:** **`archive`** (primary - case-009 growth-isolation shape applied to a running log: the fast-growing settled half leaves the cluster, the live half stays where the `/brew` close-retro appends), plus a **rule amendment** to make the shape repeatable (§ Discipline gained an Archive bullet; "never edit or remove prior entries" became "never edit a prior entry in place" - moving whole entries is not editing). **`delete`** on SKILL.md ship notes (case-011/014 provenance class; narrative in shipped.md + sub-skills-status.md).
- **Judgment calls:** (1) **Archive-with-index inside the cluster's own file, not relocating the whole log out of the cluster** - the cluster is the log's stated home (mirrors the roasting analog in roasting-coordinator) and the `/brew` skill appends there; only the settled half needed to leave. (2) **Settled vs live boundary drawn at 2026-07-28 / 08-08**: the five August-September entries carry the `get_bean_pipeline` payload-overflow thread at N=3 ("graduation due") and the trace-NaCl N≈3 water.md candidate - both open, so they stay live even though several are otherwise confirmation-only. (3) **Verbatim move, no compression** - compressing the entries would have been the consolidate shape, but the Discipline's audit-trail intent is better served by verbatim archive + index than by rewritten summaries. (4) **operational-guide.md deliberately not re-opened** - case 013 established its residual is the considered-and-kept list and nothing substantive has been added since; the ⚠️ 87% single-doc watcher stays by design (ledger note unchanged).
- **Heuristic learned:** **An append-only log inside a capped cluster is a scheduled tripwire, not a design** - the brewing log reached 35% of its cluster's cap in 3.5 months with a "never remove" rule and no archive path. Every append-only log in a Tier-1 cluster needs an archive rule at institution time (where settled entries go, what "settled" means, what stays behind). The roasting-coordinator analog (11.5 KB, no archive rule yet) is the next instance; apply the same amendment there before it needs a prune pass. Second: **test the brief's duplication hypothesis with a grep before planning around it** - here the suspected RP8/RP9 duplication was zero and the real growth vector was a different file.

## Shape-coverage note

Deliberately `archive` with a rule change, not extract and not consolidate. Extract (split the log to a sibling inside the cluster) saves nothing against a cluster cap. Consolidate (compress entries) conflicts with the log's audit-trail purpose. The one open alternative - relocating the whole log out of the cluster - was considered and rejected (judgment call 1).

## Delete flags (if any)

None outstanding. Chris ratified the SKILL.md § Wave 3 PR 2 ship notes delete 2026-10-01 (git-recoverable; narrative in shipped.md + sub-skills-status.md). No friction entries were deleted - all 11 moved verbatim.

**Considered and kept:** `operational-guide.md` whole (51.9 / 60; Step 4 anchor pinned by bundled-brewing-completion.md + roast-to-brew-translation.md); `aeropress-immersion-press.md` (RP8 canon); the five live friction entries; the Discipline section (amended, not cut).

**Out of scope, flagged for `plan-feedback`:** `get_bean_pipeline` payload overflow at N=3 (live entries 2026-08-10 / 09-07 ×2) - graduation due.

## Result

- Cluster **72.8 KB / 100** (`npm run check:doc-sizes`); friction log 12.5 KB; new archive 25.4 KB at `docs/sprints/brewing-friction-archive.md` (archive tier, not MCP-registered - the live log never was, so no `lib/mcp/docs.ts` change). `check:doc-links` green; `check:mcp-bundle` green.
- `.claude/skills/brew/SKILL.md` § Close retro unchanged (it appends to the log; the log's § Live entries is where appends land).
- PR: see shipped.md row dated 2026-10-02.
