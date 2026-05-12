-- Sub Pages 4 — /processes first-principles regrouping (2026-05-11).
--
-- Replaces process_syntheses (keyed on free-text process column) with a
-- composable aggregation cache that supports 5 aggregation kinds:
--   base               — /processes/[base] hub pages
--   honey_subprocess   — /processes/honey/[white|generic] sub-pages
--   modifier_combo     — /processes/[base]/modifiers/[combo] mini-pages
--   modifier_index     — /processes/modifiers/[modifier] cross-base index pages
--   signature          — /processes/signatures/[name] signature method pages
--
-- The synthesis column stores a JSON blob shape per aggregation kind:
--   { "whatILearned": "...", "overview": "...", "observedCupProfile": ["..."] }
-- so a single cache row covers Process Overview / Cup Profile / What I Learned
-- where applicable (modifier-combo + signature sub-pages need all three).
--
-- Drops the legacy process_syntheses table (3 rows, all regenerate on visit).

CREATE TABLE IF NOT EXISTS process_aggregation_syntheses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  aggregation_kind text NOT NULL CHECK (
    aggregation_kind IN (
      'base',
      'honey_subprocess',
      'modifier_combo',
      'modifier_index',
      'signature'
    )
  ),
  aggregation_key text NOT NULL,
  synthesis text,
  synthesis_brew_count integer,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, aggregation_kind, aggregation_key)
);

ALTER TABLE process_aggregation_syntheses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see only their syntheses" ON process_aggregation_syntheses;
CREATE POLICY "Users see only their syntheses" ON process_aggregation_syntheses
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Legacy table — 3 cached rows replaced by the new aggregation surface.
DROP TABLE IF EXISTS process_syntheses;

NOTIFY pgrst, 'reload schema';
