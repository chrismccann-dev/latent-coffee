-- 084_arbiter_2026_10_01_cleanup.sql
-- Follow-up to the 2026-10-01 arbitration pass (PRs #667-#672). Data-only.
-- Applied via SQL Editor 2026-10-01 21:08 UTC; this file is the receipt.

-- (1) Illubabor Forest: sync DB-row genetics to the registry (precedent: 083 Syrina)
UPDATE public.cultivars
  SET genetic_family = 'Ethiopian Landrace Families',
      lineage = 'Ethiopian landrace-derived selection (non-JARC)',
      species = 'Arabica'
  WHERE cultivar_name ILIKE 'Illubabor Forest'
    AND (genetic_family LIKE 'Unresolved%' OR lineage LIKE 'Unresolved%');

UPDATE public.green_beans
  SET cultivar_provenance = 'canonical', canonicals_updated_at = now()
  WHERE id = 'caf6c03e-1921-4e15-840a-4c81a3cd2230'
    AND cultivar_provenance = 'auto_created';

-- (2) Leal control lot: macro is canonical, flip the meso-keyed insert's flag
UPDATE public.green_beans
  SET terroir_provenance = 'canonical', canonicals_updated_at = now()
  WHERE id = '50a91b9d-582c-4f47-97e5-07c2829cdc83'
    AND terroir_id = '93c19f40-26f7-4bad-a56d-d10f88dff18b'
    AND terroir_provenance = 'auto_created';

-- (3) Orphaned auto-created terroir rows, referrer-guarded
DELETE FROM public.terroirs t
  WHERE t.id IN (
    '4d83d6ba-eb93-42c9-a73f-e1bbca4413cf',
    '1889fff8-1ba4-4d14-b23a-6d8190649e4e',
    '86aae74d-eb20-4dd2-91ce-0f386457149f'
  )
  AND NOT EXISTS (SELECT 1 FROM public.brews b WHERE b.terroir_id = t.id)
  AND NOT EXISTS (SELECT 1 FROM public.green_beans g WHERE g.terroir_id = t.id);

INSERT INTO public.applied_migrations (filename)
  VALUES ('084_arbiter_2026_10_01_cleanup.sql') ON CONFLICT (filename) DO NOTHING;
