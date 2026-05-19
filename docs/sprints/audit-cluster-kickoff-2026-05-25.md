# Audit cluster kickoff — three-surface drift check

**Date:** 2026-05-25
**Predecessor:** Sprint R (PRODUCT.md / roadmap restructure)
**Successor:** Architecture brainstorm cluster (#5+#6+#7)
**Sizing:** S-M (~1-2h Chris-side execution; prep artifacts already produced in Sprint R)
**Branch:** TBD at kickoff (suggest `claude/audit-cluster-execution-2026-05-XX`)

## Goal

Run a coordinated drift check across the three surfaces that drive Latent's workflows, BEFORE entering the architecture brainstorm cluster. Surface where lived practice has diverged from substrate so the brainstorm doesn't decompose along the wrong lines.

The three surfaces:

1. **Codebase + docs** — already audited via Sprint F ([report](sprint-f-audit-2026-05-24.md)). 6-actor matrix walked clean across Sprints 0-14 + M. No drift surfaced beyond shipped.md row backfill (closed inline).
2. **claude.ai project memory + custom instructions** — surface Claude Code cannot touch. ~12-day delta since pre-grilling era likely.
3. **Chris's lived workflow** — green bean → reference roast → reference cup → optimized brew (roasting side); purchased bean → iteration → optimized brew → propose_doc_changes (brewing side). Substrate has moved a lot in 2 weeks.

## Why this is its own sprint (not folded into Sprint R or the brainstorm)

- Codebase audit was done in Sprint F. The other two need Chris's eyes, not Claude Code's.
- Doing the audit AFTER the brainstorm would mean rewriting the brainstorm's decomposition spec when drift surfaces. Cheaper to do it first.
- Audit cluster is fast (~1-2h) if the prep artifacts are good — Sprint R produced 3 of them inline.

## Scope (in)

### Surface 2 — claude.ai memory + instructions audit

Read: [sprint-r-audit-prep-claude-ai-memory-diff-2026-05-25.md](sprint-r-audit-prep-claude-ai-memory-diff-2026-05-25.md)

Walk:
- Section 1 — canonical taxonomies (11 axes including new SWORKS) — verify counts + recent deltas
- Section 2 — MCP Tool surface (35 Tools) — verify count
- Section 3 — MCP Resources (`docs://`) — verify catalog
- Section 4 — ADRs (0001-0010, 0006 reserved) — verify list
- Section 5 — recent substrate changes (Sprints 0-14 summary) — surface any gaps
- Section 6 — CONTEXT.md resolved ambiguities (21 closures) — verify nothing reopened
- Section 7 — standing principles (4 items) — verify alignment

For each stale or gap finding: refresh claude.ai's memory inline. Log finding in `memory/feedback_mcp_continuous_log.md` Batch <N+1>.

### Surface 3 — Chris's lived workflow audit

Read:
- [sprint-r-audit-prep-roasting-workflow-baseline-2026-05-25.md](sprint-r-audit-prep-roasting-workflow-baseline-2026-05-25.md)
- [sprint-r-audit-prep-brewing-workflow-baseline-2026-05-25.md](sprint-r-audit-prep-brewing-workflow-baseline-2026-05-25.md)

For each phase in each baseline:
- ✅ matches lived practice
- ⚠️ partially matches (specify what diverges)
- ❌ doesn't match (specify what lived practice is)

Both baselines surface 6 "notable substrate gaps Chris may notice" at the bottom — these are the most likely drift points. Start there.

Bundle findings into `memory/project_audit_cluster_2026-05-XX.md` (single retro covering both surfaces).

## Scope (out)

- Substrate edits flowing out of findings — most should be queued as next-sprint candidates, not landed inline. Exception: a finding that's trivially closable (one-line CONTEXT.md edit, claude.ai memory refresh) can ship inline.
- New ADRs — none expected. If an architectural finding emerges, log as a brainstorm-cluster input, not as an inline ADR.
- Code changes — none expected. This is a read-only + claude.ai-edit + memory-write sprint.

## Files likely to touch

- `memory/feedback_mcp_continuous_log.md` — Batch N+1 entries for claude.ai memory drifts
- `memory/project_audit_cluster_2026-05-XX.md` — single retro covering both surfaces
- claude.ai project memory + custom instructions (UI-only, no file touch)
- Possibly small CONTEXT.md or `docs/prompts/*.md` edits if trivial closures surface

## Verification

- Walk each section of the claude.ai memory diff checklist
- Walk each phase of both workflow baselines
- Verify findings logged before closing
- Commit `memory/*` + any inline edits, push, open PR (or just commit if no PR-worthy substrate change)

## Coordination notes

- Worktree-local git config already set to chris.r.mccann@gmail.com per [feedback_git_email.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_git_email.md)
- Standing autonomy rule (CLAUDE.md § Git Discipline): approved work = commit + push + PR + merge as one flow. This sprint is approved per Sprint R's Option 1 lock.
- Plan-mode not needed — this is a read + verify + log pattern, not interpretive design work.

## Output

Triggers the architecture brainstorm cluster kickoff ([architecture-rethink-cluster-kickoff-2026-05-25.md](architecture-rethink-cluster-kickoff-2026-05-25.md)). The brainstorm session reads the audit retro as one of its primary inputs.

## Open questions

1. **Do trivial inline fixes (CONTEXT.md typo, claude.ai memory refresh) ship in the same PR as the audit retro, or split?** Recommend: same PR if 3 or fewer trivial fixes; split if more. Audit-retro PR otherwise stays focused on findings.
2. **Does the audit produce a kickoff brief for any of its findings?** Recommend: if a finding scopes naturally to its own sprint (e.g. "Chris isn't setting `fc_audibility` — needs a `log-roast.md` prompt strengthening sprint"), produce a one-liner candidate for the post-architecture roadmap re-session. Don't write a full kickoff doc inline.
3. **What if the audit surfaces something that should change the brainstorm cluster's scope?** Recommend: amend the brainstorm kickoff doc before triggering the brainstorm session. The kickoff doc is meant to be edited as upstream inputs land.
