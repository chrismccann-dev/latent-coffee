-- Cluster A / MB-7 (2026-06-01) — attach reference (optimized) brew
--
-- Add nullable FK `green_beans.optimized_brew_id` pointing at the brews(id)
-- row for the lot's own canonical optimized brew (the pour-over recipe Chris
-- dials in for daily consumption of the reference roast). Sibling to
-- migration 069's `peer_reference_brew_id` — together they form the lot's
-- "brew-web" (see ADR-0019 + CONTEXT-shared § Relationships).
--
-- Why explicit, not heuristic: today the resolved view guesses the optimized
-- brew via `pickOptimizedBrew` (prefer the brew whose roast_id = the
-- reference roast, else the first brew row). That heuristic is fragile — a
-- lot can have several brews on the reference roast, and the "first row"
-- fallback is arbitrary. This FK makes the link definite, set at close-lot
-- from the brew_id carried in the optimized-brew handoff brief. The heuristic
-- survives only as a legacy fallback for lots closed before this column.
--
-- Named `optimized_brew_id`, not `reference_brew_id` — "reference brew"
-- collides three ways (reference roast = winning batch / reference cup =
-- xBloom gate / reference brew = the purchased-bean term). For a self-roasted
-- lot the attached artifact is precisely the optimized brew per CONTEXT.
--
-- No backfill in this migration — there is no clean programmatic
-- disambiguation from green_bean_id alone, so Chris supplies the per-lot
-- optimized-brew mapping and patches via patch_green_bean(optimized_brew_id).
--
-- ON DELETE SET NULL — if the optimized brew row is deleted, the green_bean
-- row remains valid with the FK cleared. The green-bean row is the primary
-- entity and outlives its brew links.
--
-- Idempotent: re-applying is safe (ADD COLUMN IF NOT EXISTS guard).

ALTER TABLE green_beans
  ADD COLUMN IF NOT EXISTS optimized_brew_id uuid
  REFERENCES brews(id) ON DELETE SET NULL;

COMMENT ON COLUMN green_beans.optimized_brew_id IS
  'Nullable FK pointing at brews(id) for the lot''s own canonical optimized brew (the daily-consumption pour-over recipe dialed in for the reference roast). Sibling to peer_reference_brew_id. Set at close-lot from the brew_id in the optimized-brew handoff; replaces the legacy pickOptimizedBrew heuristic (kept only as fallback for pre-FK lots). Migration 075 (Cluster A / MB-7 / 2026-06-01). See ADR-0019 + CONTEXT-roasting.md § Optimized brew.';
