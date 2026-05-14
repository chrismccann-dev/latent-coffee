# Sprint 3.2 — Cleanup-A bundle kickoff brief

Paste-ready hand-off for the next Claude Code session. First architectural-queue sprint after the Sub Pages 6 series close (6.7 shipped 2026-05-13, [apps#153](https://github.com/chrismccann-dev/2026-05-13)). 12 low-risk items in one ~2-3 day code sprint. Trigger condition met.

## Goal

Bundle 12 low-risk cleanup items into a single code+migration sprint. No design ambiguity, no architectural decisions — each item has a known fix shape. Cheapest-impact-first per the Sprint 3.1 brainstorm build-order rationale.

## Scope (in)

5 items from the 2.7.5 retro cleanup bundle:

1. **Tokenize `admin_region` in `findOrCreateTerroir`** ([feedback_v2_mcp_feedback_log.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_v2_mcp_feedback_log.md) Round-2 #1). Current implementation matches raw strings; tokenizing prevents false near-misses when claude.ai writes a slightly drift-shaped region name.
2. **Auto-populate `green_beans.origin` from `terroir.country`** ([feedback log](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_v2_mcp_feedback_log.md) Round-2 #2). Today the field is hand-set on every push; can derive from the FK.
3. **`end_condition_value` cross-field semantic bounds** (Round-2 test 1 review). The numeric value's meaning depends on `end_condition_type` (°C / s / null); add Zod refinement to reject mismatched pairs at the boundary.
4. **`power_bezier` vs `profile_type=5` consistency check** (Round-2 test 1 review). `power_bezier` is only meaningful on Roest profile type 5; flag at validation if the pairing drifts.
5. **`npm run migrations:check` script + PR template prereq + CI gate** ([migration_drift_pattern](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_migration_drift_pattern.md) — Round-6). Migrations land in `supabase/migrations/` but aren't always run against the live DB; the drift bites silently. Recipe: script that diffs `list_migrations` vs `ls supabase/migrations/` and flags any tracked-but-not-applied; PR template line item + CI step that gates merges.

3 items from Phase 3 PR #105 deviations:

6. **Backfill SQL for `*_override` columns** on `brews` and `green_beans` for historical rows. Today new writes populate `terroir_override` / `cultivar_override` flags correctly; legacy rows have NULL. Backfill `false` where the canonical lookup succeeded post-hoc.
7. **SR `/add` direct-insert path computes provenance from `FindOrCreateResult.created`** — historical inconsistency. Note: Sub Pages 6.6 deleted the SR `/add` direct-insert path, so this item collapses to "audit `push_green_bean` / `push_brew` write-paths use the FindOrCreateResult.created flag consistently for `terroir_provenance` / `cultivar_provenance`." Reduces to ~30 min.
8. **`/green/[id]` UI surfaces provenance + `canonicals_updated_at`**. Currently invisible. Likely a small render block on the `<GreenBeanInfoCard>` showing "Terroir: <name> (auto-created on 2026-04-22)" when `terroir_provenance = 'auto_created'`. Optional / parked to Track 3 page-design refresh if scope creeps.

2 items from OAuth 3.0 retro follow-ups:

9. **Anthropic-style OAuth error wrapping diagnostic note**. When the OAuth flow fails with a generic 4xx, log the inner error so claude.ai gets a useful message instead of "unknown auth error."
10. **`.env.local` git-tracked hygiene fix** — the file is tracked in `.gitignore` AND in git history. Decide: untrack (and add to `.gitignore` precedence note) or accept the tracked-but-ignored state and document why. Note: Sub Pages 6.7 close-out hit this trip-wire during worktree symlinking — confirms the cleanup is worth doing.

1 item promoted from debt:

11. **Defensive try/catch + console.error sweep across all MCP Tool handlers**. Today some handlers throw bare errors; wrap with try/catch + `console.error('[tool_name]', err)` for diagnostic logging. ~30 min sweep across ~38 files.

Plus one bundling concern flagged in retro:

12. **Audit-completeness verification grep standing rule.** Sub Pages 6.7's Track C exposed that the Explore-agent audit under-sampled MCP at 39% and missed 3 of 4 drift items. Capture as a new memory feedback file: "for any cross-system audit task, run a structured grep across the full surface AFTER the agent pass, not before."

## Scope (out)

- Sprint 3.3 Auto-supersede (3 items, ~2-3h) — separate sprint, lands after 3.2.
- Sprint 3.4 Per-batch failure_boundary breach record — plan-mode required.
- Sprint 3.5 Roest API parity Phase 3 — separate sprint, ~3-4 days.
- Anything that requires schema design decisions (out of cleanup-bundle scope).

## Files likely to touch

- `lib/brew-import.ts` (items 1, 2, 7)
- `lib/mcp/*.ts` (items 3, 4, 11 — Zod refinements + try/catch sweep)
- `app/(app)/green/[id]/page.tsx` (item 8 if not parked)
- `scripts/migrations-check.ts` (NEW, item 5)
- `.github/PULL_REQUEST_TEMPLATE.md` (NEW or update, item 5)
- `.github/workflows/*.yml` (NEW or update, item 5)
- `supabase/migrations/NNN_override_backfill.sql` (NEW, item 6)
- `lib/mcp/server.ts` (item 9 — OAuth error wrapping)
- `.gitignore` (item 10)
- `~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_audit_completeness_verification_grep.md` (NEW, item 12)

## Verification plan

For each of 12 items:

1. **Tokenize `admin_region`**: write a unit-style check (or a quick test via `findOrCreateTerroir` MCP Tool) on a drifted input that previously created a duplicate row; confirm it now resolves to the existing canonical.
2. **`green_beans.origin` auto-pop**: push a new green_bean WITHOUT `origin`; confirm post-insert that `origin = terroir.country`.
3. **`end_condition_value` bounds**: push a roast with `end_condition_type='dev_time'` + `end_condition_value=210` (out of seconds range); confirm Zod rejects.
4. **`power_bezier` consistency**: push a profile with `profile_type=4` + `power_bezier` populated; confirm Zod rejects.
5. **`migrations:check`**: run locally, verify it flags any drift. Test with an intentionally unapplied migration.
6. **Backfill SQL**: run on dev DB, verify `*_override` columns populate `false` for historical rows.
7. **Provenance from FindOrCreateResult.created**: push a new bean, verify `terroir_provenance` / `cultivar_provenance` reflect the actual create-vs-find outcome.
8. **`/green/[id]` provenance render**: visit a lot with `terroir_provenance='auto_created'`; confirm the "(auto-created)" annotation appears.
9. **OAuth error wrapping**: trigger an OAuth failure, confirm the inner error message is preserved in the response body.
10. **`.env.local` hygiene**: `git ls-files .env.local` returns nothing after the fix.
11. **MCP try/catch sweep**: trigger a synthetic error in one Tool handler; confirm the `[tool_name] error: ...` log line appears.
12. **Audit-grep rule**: memory file lands; pointer in MEMORY.md.

## Open questions

1. **Item 8 — `/green/[id]` provenance render**: is this Cleanup-A scope or should it ride with the Track 3 page-design refresh? Cleanup-A bias: skip unless the render is trivial (< 1h).
2. **Item 10 — `.env.local` git tracking**: untrack OR document the tracked-but-ignored state? Memory `feedback_git_email.md` doesn't explicitly cover this. Probably needs a kickoff question.
3. **Item 12 — verification-grep rule**: writing this as a memory feedback file vs. extending an existing one (e.g. `feedback_cross_system_audit.md`)? Choose at kickoff.

## Standing rules that bind 3.2

- Plan approved = run through merge (per `feedback_autonomy.md`).
- Doc-touch check before PR (CLAUDE.md drift, PRODUCT.md roadmap currency, shipped.md row).
- Run `/simplify` before commit.
- `npx tsc --noEmit` from worktree before push (symlink node_modules per CLAUDE.md Dev Notes; restore `.env.local` from HEAD before commit).
- Set worktree-local `git config user.email "chris.r.mccann@gmail.com"` before commit.

## Branch name

`claude/sprint-3-2-cleanup-a`

## Pre-flight DB queries

```sql
-- Item 6: count override-NULL rows
SELECT
  (SELECT COUNT(*) FROM brews WHERE terroir_override IS NULL) AS brews_terroir_null,
  (SELECT COUNT(*) FROM brews WHERE cultivar_override IS NULL) AS brews_cultivar_null,
  (SELECT COUNT(*) FROM green_beans WHERE terroir_override IS NULL) AS gb_terroir_null,
  (SELECT COUNT(*) FROM green_beans WHERE cultivar_override IS NULL) AS gb_cultivar_null;

-- Item 2: count green_beans rows where origin disagrees with terroir.country
SELECT COUNT(*)
FROM green_beans gb
LEFT JOIN terroirs t ON t.id = gb.terroir_id
WHERE gb.origin IS DISTINCT FROM t.country;
```

## Bundle option

If item 8 expands beyond ~1h: split to a 3.2-rendered follow-up bundled with Track 3. Cleanup-A stays focused on the 11 non-UI items + 12.
