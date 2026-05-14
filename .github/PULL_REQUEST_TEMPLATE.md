## Summary



## Test plan

- [ ] `npx tsc --noEmit` clean (from main checkout if worktree-blocked)
- [ ] Preview spot-check for any UI change

## Pre-merge checklist

- [ ] If this PR adds a file under `supabase/migrations/`: the migration has been **applied to the live Supabase project** via SQL Editor or MCP `apply_migration`. Verify with `npm run check:migrations` — exit 0 means clean. (Recurring failure mode: PRs land with the SQL file committed but never run; see `~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_migration_drift_pattern.md`.)
- [ ] If this PR adds a canonical entry to a registry: `npm run check:registry-sync` clean.
- [ ] If this PR changes MCP Tool descriptions: `npm run check:mcp` clean.
- [ ] PRODUCT.md / CLAUDE.md / shipped.md updated for the sprint substrate touched (cross-system audit per `CLAUDE.md § Sprint cadence` checkpoint 4).
