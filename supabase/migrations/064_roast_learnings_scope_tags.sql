-- Sprint 12 / RO-CP-5 (2026-05-21): per-field scope_tags text[] arrays on
-- roast_learnings carry-forward fields. Locks ADR-0009.
--
-- Why: pre-flight on 7 closed lots confirmed scope IS implicit in carry-forward
-- prose today but is INCONSISTENT — 3/7 explicit ("For washed Colombians" /
-- "For XO-fermented" / "For washed Guatemalan"), 4/7 unscoped general principles
-- ("Day 4 cupping misleads"). The Sudan Rume Washed→Natural transition is the
-- canonical case study where prose-only scoping bit Chris (FC-temp constraint
-- hypothesis emerged because some washed-anchor carry-forwards didn't transfer
-- to the natural). Cross-lot queries are not reliable via grep.
--
-- Shape: 4 new text[] columns, one per carry-forward field, NOT NULL DEFAULT
-- '{}'::text[]. Mirrors brews.fermentation_qualifiers pattern from migration 059.
-- Loose-canonical prefix convention (process:washed / variety:sudan-rume /
-- country:colombia / etc.) — prompts describe the convention; write paths do
-- NOT enforce. Justifies low complexity at 7-lot corpus scale.
--
-- Backfill: NONE. Going-forward only. 7 closed lots land with empty arrays.
-- Tags appear on the next close-lot / one-shot-closeout write.

ALTER TABLE roast_learnings
  ADD COLUMN cultivar_takeaway_scope_tags text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN terroir_takeaway_scope_tags text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN general_takeaway_scope_tags text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN starting_hypothesis_scope_tags text[] NOT NULL DEFAULT '{}'::text[];

COMMENT ON COLUMN roast_learnings.cultivar_takeaway_scope_tags IS
  'Loose-canonical scope tags for cultivar_takeaway. Sub-scopes within the cultivar axis (e.g. process:washed when the lesson applies only to washed lots of this cultivar). See ADR-0009.';

COMMENT ON COLUMN roast_learnings.terroir_takeaway_scope_tags IS
  'Loose-canonical scope tags for terroir_takeaway. Sub-scopes within the terroir axis (e.g. altitude:high when the lesson applies only to high-altitude lots in this terroir). See ADR-0009.';

COMMENT ON COLUMN roast_learnings.general_takeaway_scope_tags IS
  'Loose-canonical scope tags for general_takeaway. Cross-axis scoping (e.g. process:xo-fermented + country:colombia + density:high). Tag "general" for unscoped universal principles. See ADR-0009.';

COMMENT ON COLUMN roast_learnings.starting_hypothesis_scope_tags IS
  'Loose-canonical scope tags for starting_hypothesis. Defines which future similar-lot pattern should consume this hypothesis on STAGE 1 carry-forward search. See ADR-0009.';
