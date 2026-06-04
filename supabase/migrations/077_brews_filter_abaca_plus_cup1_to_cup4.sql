-- 077_brews_filter_abaca_plus_cup1_to_cup4.sql
--
-- Filter registry reconciliation (case-004 follow-up, 2026-06-04).
--
-- The registry canonical "CAFEC Abaca+ Cup 1 Cone Paper Filter" (APC1-100W) was
-- collapsed into the owned Abaca+ Cup-4 paper, which was simultaneously renamed
-- from the mislabeled "CAFEC Abaca Cup 4 ... (40 pack)" / APC4-40W to its true
-- identity "CAFEC Abaca+ Cup 4 Cone Paper Filter" / APC4-100W.
--
-- Chris brews single cups only and has only ever used the Abaca+ Cup-4 paper, so
-- the 2 historical brews recorded against the Cup-1 canonical were really the
-- Cup-4 Abaca+ paper. Remap them to the surviving canonical name so brews.filter
-- holds the canonical string directly (the runtime FILTER_ALIASES entry also
-- resolves the old string as a backstop, so reads were never broken).
--
-- Idempotent: re-running matches zero rows after the first apply.

UPDATE public.brews
SET filter = 'CAFEC Abaca+ Cup 4 Cone Paper Filter'
WHERE filter = 'CAFEC Abaca+ Cup 1 Cone Paper Filter';

-- Self-register (the >= 076 convention).
INSERT INTO public.applied_migrations (filename) VALUES ('077_brews_filter_abaca_plus_cup1_to_cup4.sql')
ON CONFLICT (filename) DO NOTHING;
