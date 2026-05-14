---
name: sprint-closeout
description: Run the end-of-sprint checklist before declaring a sprint done. Verifies all changes are committed and PR is opened/merged, logs the sprint to PRODUCT.md and docs/sprints/shipped.md, updates MEMORY.md if substrate or process learnings surfaced, captures retro notes (what didn't work, what surprised us), and produces a paste-ready kickoff brief for the next sprint. Use when the user says "sprint is done", "wrap up the sprint", "let's close out", "ship it and move on", or invokes /sprint-closeout.
---

# Sprint Closeout

Walk through each step in order. Don't batch — pause after each so the user can confirm or redirect. Show concrete output (git status, diff stats, PR URLs) rather than narrating.

## 1. Verify commits + PR state

Run in parallel:
- `git status` — anything uncommitted?
- `git log --oneline origin/main..HEAD` — what's on this branch beyond main?
- `gh pr view --json state,mergeable,url,title 2>/dev/null` — PR opened? merged? mergeable?

Surface anything uncommitted, unpushed, or any PR not yet opened. If a PR exists but isn't merged, ask whether to wait for merge or proceed with closeout against the unmerged state.

## 2. Log the sprint to PRODUCT.md + docs/sprints/shipped.md

If this sprint shipped from a queued section in `PRODUCT.md` (`## Active Sprints`, `## Newly queued`, `## Side Quests`):
- Move the entry out of the queued section
- Add a new line to `docs/sprints/shipped.md` (reverse-chronological) with: **date** / **sprint name (bold)** / one-line landmark + PR # link

If the sprint didn't originate from PRODUCT.md but produced shippable substrate (new MCP Tool, new column, new registry entry, new page, doc rewrite), still add an entry to `docs/sprints/shipped.md`.

Skip this step only if the sprint was purely operational (config tweak, hook setup, settings.json edit) and didn't change product substrate. Say so explicitly when skipping.

## 3. Update MEMORY.md if a learning surfaced

Did this sprint produce a NEW standing rule, NEW operational pattern, or NEW reference worth recalling in future sessions? If yes:
- Write a new memory file under `~/.claude/projects/-Users-chrismccann-latent-coffee/memory/`
- Add a one-line pointer to `~/.claude/projects/-Users-chrismccann-latent-coffee/memory/MEMORY.md` under the relevant section (User profile / Reference / Standing feedback / Roadmap pointers / Shipped sprints)

Don't write memories for things already captured by code, git log, CLAUDE.md, or existing memories. If the sprint was purely mechanical with no recall-worthy lesson, skip and say so.

## 4. Retro: what didn't work + what surprised us

Before producing the kickoff brief, explicitly pause and list:
- **What we tried that didn't work** (dead ends, wrong assumptions)
- **What surprised us** (cost of a refactor, scope creep, unexpected dependency)
- **What we'd do differently next time** (process or technical)

Even if the answer is "everything went smoothly", say that. Don't skip — the retro is the cheapest insurance against repeating mistakes.

If the retro produced a standing rule, loop back to step 3 and capture it as a memory.

## 5. Produce the kickoff brief for the next sprint

Follow the structure from `.claude/skills/kickoff-brief/SKILL.md` (Goal / Scope / Files / Migration / Verification / Open questions / Estimated PR count). Either invoke the kickoff-brief skill OR produce the brief inline using that structure.

The brief should be self-contained — a fresh session pasting this in must have full context without rediscovery. No placeholders.

After the brief is generated and shared, the closeout is complete.
