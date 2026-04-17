-- Normalize free-text brews.process values: casing + ordering consistency,
-- and merge "Classic Natural" into "Natural" (verbose label for dominant bucket).
-- DRD / ASD / Anoxic stay distinct as genuine processing differences.

UPDATE brews SET process = 'Cold Fermented Washed' WHERE process = 'Cold fermented washed';
UPDATE brews SET process = 'Anaerobic Honey'       WHERE process = 'Honey Anaerobic';
UPDATE brews SET process = 'Yeast Anaerobic Natural' WHERE process = 'Yeast anaerobic natural';
UPDATE brews SET process = 'Natural'               WHERE process = 'Classic Natural';

-- Synthesis cache for /processes/[slug] pages. Keyed on (user_id, process)
-- since there is no processes table / FK. Mirrors the synthesis fields on
-- cultivars / terroirs tables but lives in its own row per process.
CREATE TABLE process_syntheses (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  process text NOT NULL,
  synthesis text NOT NULL,
  synthesis_brew_count int NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, process)
);

ALTER TABLE process_syntheses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own syntheses" ON process_syntheses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
