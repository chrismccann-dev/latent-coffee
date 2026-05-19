-- Sprint T3 / CR-5 (2026-05-18) — closes the qualifier storage gap on brews.
--
-- Background: docs/taxonomies/processes.md defines `fermentation qualifier` as
-- an orthogonal annotation on a fermentation modifier — currently only `Anoxic`
-- on `Anaerobic` (sealed-container, no-headspace execution). The qualifier was
-- defined doc-side and in the decompositional alias map (`Anoxic → Anaerobic
-- + qualifier:Anoxic`), but `brews` had no column to receive it, so a write
-- of `process = "Anoxic Natural"` was silently downgraded to
-- `fermentation_modifiers = ['Anaerobic']` and the qualifier signal was lost.
--
-- One historical brew in the 79-row corpus carries qualifier data: the
-- "Anoxic Natural, Rosado" row (Diego Bermúdez El Paraíso, Sudan Rume + Pink
-- Bourbon). Its `coffee_name` preserves "Anoxic" but the structured columns
-- don't. This migration adds the column and backfills that one row; new writes
-- via push_brew + patch_brew preserve the qualifier going forward.
--
-- The aggregation level for /processes pages stays at the modifier (Anaerobic),
-- NOT the qualifier (Anoxic) — Round 9 of the 2026-05-16 grilling locked that
-- corrective. Qualifier is a record-when-known annotation, not a strategy-
-- decision layer. The column is therefore an information-preservation field,
-- not a new aggregation surface.
--
-- Naming: matches the existing 4-array shape on brews
-- (fermentation_modifiers / drying_modifiers / intervention_modifiers /
-- experimental_modifiers) — text[] with DEFAULT '{}'::text[] and NOT NULL.
-- Canonical values today: { 'Anoxic' }. Validation lives in
-- lib/process-registry.ts FERMENTATION_QUALIFIER_LOOKUP.

ALTER TABLE brews
  ADD COLUMN IF NOT EXISTS fermentation_qualifiers text[] NOT NULL DEFAULT '{}'::text[];

COMMENT ON COLUMN brews.fermentation_qualifiers IS
  'Orthogonal annotations on a fermentation modifier — preserves a structural execution distinction (e.g. Anoxic on Anaerobic) without forking a new modifier. Today canonical: { Anoxic }. Aggregation stays at the modifier; qualifier is record-when-known. Sprint T3 / CR-5, migration 059, 2026-05-18.';

-- Anoxic Rosado backfill — the one historical row that legitimately carried
-- the qualifier in its coffee_name but lost it at decomposition time
-- (migration 025 → fermentation_modifiers=['Anaerobic']).
UPDATE brews
  SET fermentation_qualifiers = ARRAY['Anoxic']
  WHERE id = 'fd346045-b3ac-4ee2-b9e8-8dbb682e448e'
    AND coffee_name = 'Anoxic Natural, Rosado'
    AND fermentation_modifiers @> ARRAY['Anaerobic']::text[];
