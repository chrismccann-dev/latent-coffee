-- 080_lot_status.sql — stored lot lifecycle status (ADR-0024 § 6, Lot Coordinator dogfood)
--
-- Moves the green-bean lifecycle from derived-only to a stored column, because
-- the brew-side wait (waiting_for_brewing) has no row to derive from. Nullable
-- on purpose: in-flight lots stay NULL and render via the derived fallback
-- (lib/lifecycle-state.ts computeLifecycleState); the MCP write path maintains
-- the column going forward (single-write-path guardrail). No CHECK constraint
-- yet — the enum is confirmed on the first live dogfood lot (formalization
-- tax); the constraint lands in a follow-up migration once the set is proven.
--
-- Value set (lib/lifecycle-state.ts LOT_STATUS_VALUES is the mirror):
--   in_inventory | waiting_for_next_roast | waiting_for_next_cupping |
--   waiting_for_brewing | resolved | unresolved

ALTER TABLE public.green_beans
  ADD COLUMN IF NOT EXISTS lot_status text;

INSERT INTO public.applied_migrations (filename)
  VALUES ('080_lot_status.sql') ON CONFLICT (filename) DO NOTHING;
