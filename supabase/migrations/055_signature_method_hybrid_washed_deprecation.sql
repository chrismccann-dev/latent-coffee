-- Migration 055: deprecate signature_method='Hybrid Washed' + remap affected brew row.
--
-- Sprint T1 / BR-1 (2026-05-18). Brewing-cluster grilling follow-up #1 closed:
-- registry expanded from 3 to 15 signatures to match Chris's working canonical
-- list (CONTEXT.md L426). "Hybrid Washed" dropped because it fails the
-- "mechanically opaque" signature criterion - CGLE publicly decomposes the
-- proprietary technique as Whole-cherry aerobic -> sealed anaerobic -> depulp ->
-- mucilage aerobic finish, which expresses cleanly in the structured
-- modifier axes without losing producer-brand info.
--
-- One brew row affected today (pre-migration audit via execute_sql):
--   coffee_name = "CGLE Sudan Rume Hybrid Washed"
--   roaster = "Latent" (self-roasted)
--   producer = "Rigoberto & Luis Eduardo Herrera"
--   process = "Hybrid Washed"
--   base_process = "Washed"
--   fermentation_modifiers = []
--   signature_method = "Hybrid Washed"
--
-- Re-mapping (per docs/taxonomies/processes.md Signature methods (15) section):
--   signature_method     -> NULL
--   fermentation_modifiers -> ['Anaerobic', 'Aerobic']
--   base_process         -> 'Washed'  (already correct; no change)
--   process              -> composeProcess(structured) = 'Aerobic Anaerobic Washed'
--                           (recompose from structured; alphabetized within axis)
--
-- The green_beans row keeps its lot name ("CGLE Sudan Rume Hybrid Washed")
-- verbatim - the producer-marketing term is fine in human-readable lot labels.
-- green_beans has no signature_method column, and green_beans.process is a
-- free-text descriptor used only as a label, not for canonical validation.
--
-- After this migration, any push_brew or patch_brew write attempting to set
-- signature_method='Hybrid Washed' will fail canonical resolution (the value is
-- no longer in SIGNATURE_METHODS or SIGNATURE_ALIASES). That failure is the
-- desired behavior: the deprecated term should surface explicitly via the
-- override path rather than silently re-entering the data.
--
-- Idempotent: WHERE signature_method = 'Hybrid Washed' is empty on a second
-- run, so re-applying is a no-op.

BEGIN;

UPDATE brews
SET signature_method = NULL,
    fermentation_modifiers = ARRAY['Anaerobic', 'Aerobic']::text[],
    process = 'Aerobic Anaerobic Washed',
    updated_at = NOW()
WHERE signature_method = 'Hybrid Washed';

COMMIT;
