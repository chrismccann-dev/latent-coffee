---
name: kickoff-brief
description: Produce a paste-ready kickoff brief for the next sprint. Output is structured for a fresh session to start with full situational awareness instead of rediscovery. Sections cover goal, scope, files, migration plan, verification, open questions, and estimated PR count. Use when the user asks for a "next-sprint brief", "handoff context", "what's next", "kickoff prompt for the next session", or invokes /kickoff-brief. Also invoke as step 5 of /sprint-closeout.
---

# Next-Sprint Kickoff Brief

Produce a paste-ready brief structured as below. No placeholders — concrete content or omit the section. The output is the deliverable; output it as plain markdown the user can copy and paste into a fresh Claude Code session.

If you don't have enough context to fill a section concretely (e.g. you don't know what files will be touched), ASK before producing the brief rather than handwaving.

## Required structure

```
## Sprint goal
<1-2 sentences. What this sprint accomplishes and why. Imperative voice. Name the concrete artifact (page, migration, registry entry), not "implement support for".>

## Scope

**In:**
- <bulleted list of what's included>

**Out:**
- <bulleted list of what's explicitly NOT in scope — forward-investment surfaces, future sub-sprints, parked items>

## Files likely to touch
- `<path>` — <one-line what changes>
- ...

Group by domain (registry / page / migration / docs) when the sprint spans more than 3-4 files. Call out explicitly if any root-level living doc is touched (PRODUCT.md, CLAUDE.md, BREWING.md, ROASTING.md, SYNC_V2.md).

## Migration / schema changes
<File name (`supabase/migrations/NNN_*.sql`), columns added/changed/dropped, expected row count impact. State "none" if no migration.>

## Verification plan
<How the next session proves it works. Default: MCP `execute_sql` for DB-level checks + Vercel preview / `preview_*` MCP tools for UI verification. Name specific queries or UI flows that gate "done". For doc-only sprints, name the propose_doc_changes round.>

## Open questions
<What Chris needs to decide before the sprint can fully execute. If none, say "none — proceed end-to-end".>

## Estimated PR count
<1 (single end-to-end) or 2+ (substrate-first then UI). Match historical pattern for similar sprints in docs/sprints/shipped.md.>
```

## Output rules

- Imperative voice ("Build the resolved-lot view" not "We will build...")
- Use hyphens, not em-dashes (see [feedback_hyphens_not_emdashes.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_hyphens_not_emdashes.md))
- No "we'll figure that out later" — if a section can't be filled, ask
- Length: aim for 200-400 words total. Longer than that suggests scope creep or fuzzy thinking

After producing the brief, end with one line: "Paste this into a fresh session to kick off the next sprint."
