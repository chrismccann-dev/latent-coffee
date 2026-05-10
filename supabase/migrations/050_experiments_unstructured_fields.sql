-- 050_experiments_unstructured_fields.sql
-- Round-4 dogfood (2026-05-11): three free-text fields on `experiments` for
-- prose that doesn't fit the existing structured slots.
--
-- additional_notes: catch-all for operator-framing observations that bloated
--   observed_outcome_a/b/c/d under the prior schema. Examples from the
--   Higuito V2 cup: "almost like opposite ends of the spectrum",
--   "narrow roast window where 1°C peak shifts are material",
--   cup-vs-structure tension narratives. Keeps the structured fields tight.
--
-- open_questions: separates "what we still don't know that the next iteration
--   needs to answer" from what_changes_going_forward (which currently
--   conflates lessons-applied-forward with open-questions). Higuito V1->V2
--   transition was the surfacing case.
--
-- key_insight_confidence: Low / Medium / Medium-High / High. Mirrors the
--   Cross-Coffee Insight Layer hypothesis-confidence pattern in ROASTING.md.
--   Validated at write time via z.enum on push_experiment + patch_experiment;
--   the column type is plain text so the canonical set can extend without a
--   second migration if needed. Downstream queries can filter "what insights
--   are High confidence and ready to promote to protocol changes."
--
-- All three nullable + default null. Backwards compatible with all existing
-- experiment rows.

ALTER TABLE experiments
  ADD COLUMN additional_notes text,
  ADD COLUMN open_questions text,
  ADD COLUMN key_insight_confidence text;

COMMENT ON COLUMN experiments.additional_notes IS
  'Free-text catch-all for operator-framing observations and tasting prose that does not fit the structured outcome / insight fields. Round-4 dogfood (2026-05-11).';
COMMENT ON COLUMN experiments.open_questions IS
  'What this experiment did NOT answer - separated from what_changes_going_forward (which captures lessons-applied-forward). Round-4 dogfood (2026-05-11).';
COMMENT ON COLUMN experiments.key_insight_confidence IS
  'Hypothesis confidence on key_insight: Low / Medium / Medium-High / High. Validated via z.enum on push_experiment + patch_experiment; column type is text for relax-later flexibility. Round-4 dogfood (2026-05-11).';
