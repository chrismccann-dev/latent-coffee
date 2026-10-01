-- 085_cgle17_cultivar_rename.sql
-- 2026-10-01 arbitration follow-up. Rename the override-minted "CGLE" cultivars
-- row to CGLE-17 in place (keeps lot 3d962a1b's FK) and sync genetics to the
-- registry. Data-only; idempotent. Precedent: 083 / 084. Applied via SQL Editor.

UPDATE public.cultivars
  SET cultivar_name = 'CGLE-17',
      genetic_family = 'Typica × Bourbon Crosses',
      lineage = 'Gesha × Caturra lineage',
      species = 'Arabica'
  WHERE id = 'ad8fb66c-5edd-4d69-a3e4-7c4ae1c827d5'
    AND cultivar_name ILIKE 'CGLE';

UPDATE public.green_beans
  SET cultivar_provenance = 'canonical',
      canonicals_updated_at = now()
  WHERE id = '3d962a1b-c0d1-4ad7-bc3e-956a6a6745e2'
    AND cultivar_id = 'ad8fb66c-5edd-4d69-a3e4-7c4ae1c827d5'
    AND cultivar_provenance = 'auto_created';

INSERT INTO public.applied_migrations (filename)
  VALUES ('085_cgle17_cultivar_rename.sql') ON CONFLICT (filename) DO NOTHING;
