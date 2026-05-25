-- Sprint R Phase 4 Step 4 Group 4 (2026-05-24) — grilling-queue Item 17
--
-- Add nullable FK `green_beans.peer_reference_brew_id` pointing at the brew
-- row for a peer-roasted variant of the same green-bean lot.
--
-- Use case (Chris-stated 2026-05-24 audio): for ~25-30%+ of green-bean lots,
-- Chris buys the roasted variant from the same source as a calibration
-- anchor for the roasting side. Lived instances at migration time: CGLE
-- Sudan Rume Natural (special-guest roasted variant), Wush Wush (peer-
-- roasted version), every bean from Untold Coffee Lab (paired roasted
-- variant for each lot). Currently lives outside the data model — the
-- peer-roasted brew sits in `brews` (as a purchased brew), the green-bean
-- lot sits in `green_beans`, no FK linking them. claude.ai must fetch by
-- coffee_name match heuristics today, which drifts.
--
-- Schema decision (audio-ratified Alternative 3 / Phase 2 Item 17):
-- single nullable FK column on green_beans pointing at brews(id). 1:1
-- relationship in current practice — a green-bean lot has at most one
-- peer-roasted reference. Many-to-many (one green-bean from multiple peer
-- roasters) is not a current pattern but is extensible via future join-table
-- migration if it becomes one.
--
-- No backfill in this migration — Chris will patch existing lots via
-- patch_green_bean(peer_reference_brew_id) as the operator walks the
-- existing 5+ lived instances. The Zod schema add + Tool description update
-- carry the write path.
--
-- ON DELETE SET NULL on the FK constraint — if a peer brew row gets deleted
-- (rare), the green_bean row remains valid with the FK cleared. NOT SET
-- DEFAULT or CASCADE; the green-bean row is the primary entity and outlives
-- its peer-reference link.
--
-- Idempotent: re-applying is safe (ADD COLUMN IF NOT EXISTS guard).

ALTER TABLE green_beans
  ADD COLUMN IF NOT EXISTS peer_reference_brew_id uuid
  REFERENCES brews(id) ON DELETE SET NULL;

COMMENT ON COLUMN green_beans.peer_reference_brew_id IS
  'Nullable FK pointing at brews(id) for the peer-roasted reference brew of the same green-bean lot. ~25-30%+ of lots have a peer-roasted variant Chris buys as a calibration anchor for the roasting side. 1:1 in current practice (one green-bean lot, at most one peer reference). Migration 069 (Phase 2 Item 17 / 2026-05-24). See CONTEXT.md § Peer-roasted reference brew.';
