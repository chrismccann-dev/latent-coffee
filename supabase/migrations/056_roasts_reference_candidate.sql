-- Schema sprint S2 — 2026-05-18.
-- Forward-looking quality flag during V-set iteration. Set TRUE on the
-- leading slot per V-set when it's a viable lot-reference candidate. Distinct
-- from is_reference (which fires at lot close-out, after Day-7 cupping
-- confirms the lot-level winner across all V-sets) and distinct from
-- worth_repeating (judgment axis on the recipe itself).
--
-- Routing intent (Round 3 #8): "leading slot in this V-set is NOT a reference
-- example" vs "leading slot IS a reference example" is currently encoded
-- across 3 free-text fields (experiments.winner / experiments.additional_notes
-- / experiments.key_insight). This column makes the Path A vs Path B routing
-- decision queryable.
--
-- No data backfill — net-new semantic forward. Close-out flow promotes the
-- final-reference batch via is_reference; the candidate flag does NOT
-- auto-flip (explicit promotion is the close-out act).

ALTER TABLE roasts
  ADD COLUMN IF NOT EXISTS is_reference_candidate boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN roasts.is_reference_candidate IS
  'Forward-looking quality flag during V-set iteration. TRUE on leading slots that could plausibly become the lot reference at close-out. Distinct from is_reference (lot-level final, set at close-out — candidate does NOT auto-flip to is_reference). Distinct from worth_repeating (judgment axis on the recipe). One green-bean lot can have multiple candidates across V-sets; only one batch ultimately gets is_reference=true at close-out. Surfaced by Round 3 #8 dogfood feedback (Fazenda Um V1B was leading but "best of the worst, not a reference example" — that state needs a queryable flag distinct from "no winner yet").';

CREATE INDEX IF NOT EXISTS idx_roasts_reference_candidate
  ON roasts (green_bean_id, is_reference_candidate)
  WHERE is_reference_candidate = true;

NOTIFY pgrst, 'reload schema';
