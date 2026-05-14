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

## Additions from Sub Pages 6.7 spot-check (2026-05-13)

Chris ran a manual spot-check of every green-bean page at /green close-out time and surfaced 8 additional items. All low-risk, all cleanup-shaped.

13. **Backfill `green_beans.variety` from `cultivar.cultivar_name`** — sibling of item #2 (`origin` from `terroir.country`). 4 rows affected: CGLE Sudan Rume Hybrid Washed, CGLE Sudan Rume Natural, Gesha Clouds Forest, Fazenda Um Wush Wush. All have `cultivar_id` set but `variety` NULL.

    ```sql
    UPDATE green_beans gb
    SET variety = c.cultivar_name, updated_at = NOW()
    FROM cultivars c
    WHERE gb.cultivar_id = c.id AND gb.variety IS NULL;
    ```

14. **Lot header FK fallback on `/green/[id]`** — render `bean.terroir.country` when `bean.origin` is NULL; render `bean.cultivar.cultivar_name` when `bean.variety` is NULL. Today the hero subtitle uses `[bean.origin, bean.variety, bean.process].filter(Boolean).join(' · ')` (page.tsx ~line 178/710); when 2 of 3 fields are NULL the result looks empty. Worst case today: CGLE Sudan Rume Natural — origin + variety both NULL, only "Natural" renders. Item #2 + item #13 backfills resolve the root cause; this UI item is a belt-and-suspenders fallback for any future row that inserts with NULL fields before the backfill runs.

15. **Update Rancho Tio lot name** — currently `"Rancho Tio Emilio - Typica Mejorado Washed (Taza Dorada 2024 #6)"`; Chris wants the `(Taza Dorada 2024 #6)` suffix dropped (auction-metadata-in-name pattern bleeds into render width). One-row UPDATE:

    ```sql
    UPDATE green_beans
    SET name = 'Rancho Tio Emilio - Typica Mejorado Washed', updated_at = NOW()
    WHERE id = 'b0c57fd5-2a43-46b4-9cf8-197ec97bd6ab';
    ```

16. **Document the lot-naming convention** — Chris's preferred shape: `PRODUCER_OR_FARM_NAME - CULTIVAR_NAME, PROCESS_NAME`. Add to CLAUDE.md (Green section) or `feedback_lot_naming_convention.md` memory file. NOT to retroactively enforce — auction-tier suffixes and per-lot quirks (#6, Lot 21, etc.) are legitimate when distinctive; the convention is a guide for new lots. Spot-check existing names for obvious cleanups while documenting.

17. **One-shot lot framework codification** — Chris flagged Rancho Tio as a single-shot lot (only enough green for one roast, no V-set possible). Today the lifecycle helper routes it to `waiting_for_next_roast` because the rule is "no experiments + has roasts → waiting_for_next_roast (pre-framework legacy)". Chris's intent: treat one-shot lots as **V1 with batch_ids of 1** — they still pass through experiment → roast → cupping → learnings, just without iteration. Action items:
    - **Backfill an experiment row for Rancho Tio** with `batch_ids = '<batch_id>'` and 1-batch experiment frame fields. Chris will provide content via Track B-style template fire.
    - **Document in CLAUDE.md (Green section)** and **docs/roasting/redesign.md (§ 3 lifecycle states)** that one-shot lots are V1 with a single batch. No schema flag needed; the pattern is implicit via `batch_ids` cardinality.
    - **Verify the lifecycle helper handles it correctly** — once the experiment row exists with `batch_ids = '<single>'` and the roast is matched, the helper should route to `waiting_for_next_cupping`. No code change expected.

18. **"Resolved-without-reference-roast" state** — Oma (`6756d000-9581-4f1a-8b04-269d11a9888e`) is resolved (has `roast_learnings` row) but Chris flagged it "didn't actually make it to a real reference roast." Today the resolved view renders em-dashes for the Reference Roast Recipe and Achieved columns when `best_roast_id` is NULL. Decision needed:
    - **Option A**: Accept the em-dash rendering as the empty-state for non-referenced resolved lots; document in `redesign.md § 5.4` that "Some resolved lots close without identifying a reference roast — render gracefully."
    - **Option B**: Add a small "Closed without reference" sub-card to the resolved view that explains the state explicitly (rather than em-dashes that look like missing data).
    - Recommend Option B for clarity. ~30 min UI add. Chris's call.

19. **Auto-hide "Additional Information" placeholder section on ResolvedView** — when the section would render only the existing placeholder italics ("The resolved view is the densest of the four lifecycle shapes..."), drop the section entirely. The placeholder was written as forward-investment for content that didn't materialize. Affects all 6 resolved lots. Trivial fix on `page.tsx` ResolvedView (~lines 1592-1605): delete the section.

20. **Mandela XO text overflow on resolved view** — Chris attached a screenshot showing prose mid-word truncation ("Mai-", "ferm") in the resolved view 2-col grid. Likely cause: `grid grid-cols-1 md:grid-cols-2` on lines 1289 + 1347 don't have `min-w-0` on their children, so long prose can't shrink below content min-content width. Likely fix: add `min-w-0` to the grid children OR add `break-words` Tailwind utility on the prose blocks. Investigate in preview at md: viewport width (~768-900px) with Mandela XO loaded, apply minimum fix, verify on Mandela + Sudan Rume Hybrid Washed (the 2 resolved lots with the longest `why_this_roast_won` prose).

## Track B opportunities surfaced in the spot-check

Not Cleanup-A scope — but Chris flagged ~6 lots' worth of recipe / learnings data he can paste via MCP when ready. Use the templates at `docs/sprints/sub-pages-6-7-recipe-backfill-templates.md` for `patch_roast_recipe`, plus the simpler `patch_roast_learnings({why_this_roast_won: "..."})` for the resolved-lot prose gaps:

- **Higuito V3** — just-completed roast, needs `push_roast_recipe` + `push_roast` for the V3 batches.
- **Gesha Clouds Forest** — just-completed simulated pourover cupping, needs `push_cupping` + likely `patch_experiment` synthesis fields.
- **CGLE Sudan Rume Natural** — next roasts done, needs `push_roast_recipe` + `push_roast` + experiment update.
- **Fazenda Um** — just-completed cupping, needs `push_cupping` + patch.
- **Surma / Libertad / El Socorro** — resolved-lot enrichment for `why_this_roast_won` + Phase 3 recipe enrichment.

These are the dogfood targets for the next claude.ai workflow session.
