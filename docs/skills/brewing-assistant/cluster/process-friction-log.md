# Brewing process-friction log (append-only)

The cross-brew, cross-session friction log for the **brewing workflow itself**, the brewing analog
of the roasting [process-friction-log](docs/skills/roasting-coordinator/cluster/process-friction-log.md),
instituted with the brewing to Claude Code migration ([roadmap.md Active queue #4](docs/product/roadmap.md), 2026-06-15).
The DB row + `propose_doc_changes` hold what we learned about the COFFEE; this log holds what we
learned about the PROCESS: the entry that didn't trigger, the running tasting-arc block that still
lost the arc across an idle gap, a knowledge-cluster fetch that failed, a gate that fired wrong,
anything the Claude-Code surface made harder than the claude.ai path did.

Why a file and not a meta-thread: a standing feedback thread would rebuild the long-lived-session
bloat the whole architecture avoids. Persistent artifact, transient sessions, the same trick the
roasting Brief uses, scaled down to brewing's short single session.

**Brewing has no Coordinator/Assistant split** (it is one short session, not roasting's multi-week
lot, [ADR-0024 § Context](docs/adr/0024-lot-coordinator-claude-code-native.md)). So unlike the
roasting log there is no Assistant-reports / Coordinator-transcribes step: the brew session appends
here directly at the close retro.

## Discipline

- **Who writes:** the brew session itself, at the close retro (see [`.claude/skills/brew/SKILL.md` § Close retro](.claude/skills/brew/SKILL.md), or the equivalent step when entering via [`start-brew.md`](docs/prompts/start-brew.md)). If the session can't write the repo file (e.g. a constrained mobile context), surface the friction line for Chris to land.
- **What qualifies:** friction about the WORKFLOW, not the coffee. "The entry skill didn't surface on a fresh mobile session" belongs here; "this anaerobic natural needed Suppression" belongs in the DB / the historian cluster via `propose_doc_changes`.
- **Entry shape:** one dated bullet, `- **YYYY-MM-DD · <coffee-slug> · brew** - <friction, 1-3 sentences>. <optional: proposed fix>.` Append at the bottom of § Entries. Never edit or remove prior entries.
- **Graduation:** a friction recurring across brews graduates into a SKILL.md / operational-guide edit at the N=3 threshold ([ADR-0022](docs/adr/0022-formalization-tax-and-self-improvement-counterbalance.md)); the anti-lawyer-redline safeguard applies (make the skill better, not bigger, [ADR-0023](docs/adr/0023-self-improving-skill-loop.md)). Operational-guide edits route through `propose_doc_changes` (the arbiter applies them); the `.claude/skills/brew/` SKILL.md is edited directly. Graduated entries get a trailing `→ graduated: <where>` annotation rather than deletion.

## Entries

- **2026-06-15 · (migration build) · build session** - Log instituted with the brewing to Claude Code entry surface. The two mobile-runtime gates the build could not verify from a desktop worktree, (1) does a fresh mobile CC session surface the `.claude/skills/brew/` skill, and (2) does the long-multi-fact audio-dictation tasting turn work on mobile, are deferred to the first live dogfood brew (4c). Capture both outcomes here on the first real brew; a hard audio gap is the one finding that can block the migration and should be surfaced to Chris immediately rather than logged silently.
- **2026-06-16 · xliii-daterra-ziriguidum-2-laurina · brew** - First live dogfood brew; both deferred build-gate outcomes captured. **(1) Skill surfaced — PASS:** `/brew` loaded and composed the operational guide (Step 1/2/3 via `read_doc_section`) + knowledge clusters cleanly. **(2) Audio dictation — usable, soft hiccup, NOT a hard gap:** long multi-fact tasting turns extracted into the ARC STATE block fine across all 4 turns, but Chris's *first* audio note "didn't go through" and had to be re-recorded ("I thought the audio message thing on Claude Code doesn't work as well"). Worth watching for recurrence; doesn't block the migration. **Bonus:** the running ARC STATE block survived ~13h+ of idle gaps across 4 turns intact — compaction discipline held as designed.
- **2026-06-16 · xliii-daterra-ziriguidum-2-laurina · brew** - Completion flow has **no documented no-push branch for purchased beans.** The skill's Completion section assumes the operator declares an optimized brew → `push_brew` + `propose_doc_changes`; the self-roasted gate has an explicit STOP, but a *purchased* bean has no "don't push" path. This brew resolved to **no push** (roast-side ceiling — under-developed ultra-light roast that no extraction technique could resolve; full reasoning in grilling-queue item 52). Surfaced that "no satisfying optimized brew" is a real terminal state the completion flow should name. Proposed fix: add a no-push terminal branch to the brew SKILL.md Completion section + bundled-brewing-completion once grilling-queue item 52 decides the convention (schema flag vs documented no-push). N=1 — log only, don't graduate yet.
