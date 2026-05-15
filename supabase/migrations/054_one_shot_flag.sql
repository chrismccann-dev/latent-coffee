-- Migration 054: green_beans.is_one_shot boolean
--
-- One-shot green-bean lots (single-batch samples, typically 100-120g, no iteration
-- possible) are a distinct workflow class from V-set lots. Origin: auction-lot
-- sample sets where the full lot isn't yet sold, farm sample sets sent during
-- sourcing negotiations, rare allocations. Constraint: no V2 recovery, no
-- cross-batch variable attribution, no margin for error.
--
-- Per the 2026-05-15 dogfood pass on Rancho Tio Emilio (the existing one-shot lot
-- that was processed under pre-rewrite prompts), one-shot lots need:
--   1. Schema flag for queryability + page-side disambiguation
--   2. Validation: lever-attribution fields on roast_learnings require cross-batch
--      evidence (primary_lever / secondary_levers / roast_window_width / elasticity
--      / what_didnt_move_needle / underdevelopment_signal / overdevelopment_signal)
--      and must be NULL on one-shot close-outs. Enforced Node-side in
--      lib/roast-import.ts persistRoastLearnings (the canonical writer per
--      feedback_mcp_only_input.md).
--   3. Dedicated prompt pair (docs/prompts/one-shot.md + one-shot-closeout.md)
--      with tolerance-anchored design framing distinct from V-set V1's
--      wide-variance-exploratory framing.
--
-- See docs/sprints/one-shot-lot-framework-kickoff.md for the full sprint scope.

ALTER TABLE green_beans
  ADD COLUMN is_one_shot boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN green_beans.is_one_shot IS
  'True for single-batch sample lots (~100-120g, no iteration possible). Sets the workflow class: one-shot lots route through docs/prompts/one-shot.md + one-shot-closeout.md instead of the 4-prompt V-set pipeline (start-lot / log-roast / log-cupping / close-lot). Triggers schema-validation in persistRoastLearnings: lever-attribution fields (primary_lever / secondary_levers / roast_window_width / elasticity / what_didnt_move_needle / underdevelopment_signal / overdevelopment_signal) must be NULL on one-shot close-outs (require cross-batch evidence; N=1 cannot populate). Defaults false (all existing 13 lots are V-set).';
