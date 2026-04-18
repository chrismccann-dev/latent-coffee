-- 014_roasters_aggregation
-- Cleanup the one drift surface (Luminous = canonical per BMR card)
-- and add the synthesis cache table for /roasters/[slug] pages.

UPDATE brews SET roaster = 'Luminous' WHERE roaster = 'Luminous Coffee';

-- Synthesis cache, keyed (user_id, roaster). Mirrors process_syntheses (012).
-- brews.roaster is free-text (no FK), so the cache lives in its own table per roaster name.
CREATE TABLE roaster_syntheses (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roaster text NOT NULL,
  synthesis text NOT NULL,
  synthesis_brew_count int NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, roaster)
);

ALTER TABLE roaster_syntheses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own syntheses" ON roaster_syntheses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
