-- Sprint 13 — Synthesis pipeline cross-source corpus + mobile short-form
--
-- Adds 2 columns per synthesis cache surface (8 column adds total):
--   short_form_capsule            -- SYN-3: 3rd-call digested 1-2 paragraph + 2-3 takeaway capsule for mobile
--   synthesis_input_max_updated_at -- SYN-7: max(updated_at) across corpus rows at synthesis time; supplements
--                                    the existing synthesis_brew_count signal so content edits to existing rows
--                                    (rewritten what_i_learned, newly-filled roast_learnings) trigger regen.
--
-- Idempotent (IF NOT EXISTS); no backfill — NULL means "stale, regenerate on next page visit". The 4 cache
-- surfaces match the 4 SynthesisCard endpoint variants (terroirs / cultivars / roasters / processes).
--
-- See docs/adr/0010-cross-source-synthesis-and-three-call-pipeline.md for the design rationale.

ALTER TABLE terroirs
  ADD COLUMN IF NOT EXISTS short_form_capsule text,
  ADD COLUMN IF NOT EXISTS synthesis_input_max_updated_at timestamptz;

ALTER TABLE cultivars
  ADD COLUMN IF NOT EXISTS short_form_capsule text,
  ADD COLUMN IF NOT EXISTS synthesis_input_max_updated_at timestamptz;

ALTER TABLE roaster_syntheses
  ADD COLUMN IF NOT EXISTS short_form_capsule text,
  ADD COLUMN IF NOT EXISTS synthesis_input_max_updated_at timestamptz;

ALTER TABLE process_aggregation_syntheses
  ADD COLUMN IF NOT EXISTS short_form_capsule text,
  ADD COLUMN IF NOT EXISTS synthesis_input_max_updated_at timestamptz;
