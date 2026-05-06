-- Phase 3 (sprint, 2026-05-05): taxonomy_overrides_queue + provenance columns.
--
-- Per docs/features/taxonomy-overrides-queue.md (PR #103). Closes Cluster E
-- from feedback_v2_mcp_feedback_log.md Batch 18 — #R41 (queue table) +
-- #R47 (response echo) + #R73 (re-resolution surface) + #R74 (provenance
-- column) + #R75 (propose_canonical_addition Tool).
--
-- This migration ships SCHEMA + 3 INLINE DATA FIXES.
--
-- Backfill from existing override flags is INTENTIONALLY OMITTED. The design
-- doc's backfill SQL assumed *_override:bool columns persisted on `brews`;
-- they do not (the flag is transient on push, only the verbatim value lands
-- in `brews.{roaster, producer, brewer, filter, grinder}`). Going-forward
-- queueing is wired via Site A runtime hooks in lib/brew-import.ts +
-- lib/roast-import.ts; historical non-canonical values can be queued via a
-- follow-on registry-scan script if/when the manual list_taxonomy_queue path
-- becomes onerous.
--
-- Inline data fixes follow the design doc's "find-or-create the canonical
-- terroir row, repoint the bean, bump canonicals_updated_at" pattern.
-- Idempotent: if a bean's terroir_id already points at the canonical row, the
-- DO block bumps canonicals_updated_at without changing the FK.

-- ---------------------------------------------------------------------------
-- 1. taxonomy_overrides_queue table
-- ---------------------------------------------------------------------------

CREATE TABLE taxonomy_overrides_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- WHICH axis the entry is for
  axis text NOT NULL CHECK (axis IN (
    'producer', 'roaster', 'brewer', 'filter', 'grinder',
    'terroir', 'cultivar'
  )),

  -- WHAT was submitted (canonical lookup didn't resolve, so this is verbatim)
  raw_value text NOT NULL,

  -- HOW it landed in the queue (for triage + analytics)
  submission_path text NOT NULL CHECK (submission_path IN (
    'override_flag',     -- *_override:true flag was set on a push tool
    'manual_propose'     -- model called propose_canonical_addition explicitly
  )),

  -- WHERE it came from (audit trail; no FK because source can span 3 tables)
  source_kind text CHECK (source_kind IN ('brew', 'green_bean', 'roast', 'manual')),
  source_id uuid,

  -- WHAT it resolved to once arbitrated
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'promoted',
    'aliased',
    'rejected',
    'duplicate'
  )),
  canonical_target text,
  evidence jsonb,
  arbiter_notes text,

  submitted_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,

  -- One pending row per (user, axis, raw_value). Repeat overrides for the
  -- same value collapse to "duplicate" via auto-supersede in the Tool layer.
  CONSTRAINT taxonomy_overrides_unique_pending
    EXCLUDE (user_id WITH =, axis WITH =, lower(raw_value) WITH =)
    WHERE (status = 'pending')
);

CREATE INDEX idx_taxonomy_overrides_pending
  ON taxonomy_overrides_queue (user_id, status, axis)
  WHERE status = 'pending';

CREATE INDEX idx_taxonomy_overrides_source
  ON taxonomy_overrides_queue (source_kind, source_id);

ALTER TABLE taxonomy_overrides_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY taxonomy_overrides_queue_owner ON taxonomy_overrides_queue
  FOR ALL USING (user_id = auth.uid());

COMMENT ON TABLE taxonomy_overrides_queue IS
  'Canonical-promotion queue. Mirrors doc_proposals (037) for the canonical-side. Claude.ai writes via push tools (override_flag) or propose_canonical_addition (manual_propose); Claude Code arbitrates via list_taxonomy_queue + resolve_queue_entry.';

COMMENT ON COLUMN taxonomy_overrides_queue.axis IS
  'producer | roaster | brewer | filter | grinder (text-only fields with allowOverride) — terroir | cultivar (strict, only manual_propose path).';

COMMENT ON COLUMN taxonomy_overrides_queue.submission_path IS
  'override_flag = push tool with *_override:true; manual_propose = propose_canonical_addition Tool.';

COMMENT ON COLUMN taxonomy_overrides_queue.source_id IS
  'Polymorphic FK (brew / green_bean / roast); no DB FK because the column targets multiple tables. Disambiguated by source_kind. SET NULL via cleanup migration if source row is deleted.';

COMMENT ON COLUMN taxonomy_overrides_queue.status IS
  'pending → promoted | aliased | rejected | duplicate. promoted means a registry edit landed; aliased means mapped to existing canonical via alias map.';

-- ---------------------------------------------------------------------------
-- 2. Provenance columns on green_beans + brews
-- ---------------------------------------------------------------------------

ALTER TABLE green_beans ADD COLUMN terroir_provenance text DEFAULT 'canonical'
  CHECK (terroir_provenance IN ('canonical', 'auto_created'));
ALTER TABLE green_beans ADD COLUMN cultivar_provenance text DEFAULT 'canonical'
  CHECK (cultivar_provenance IN ('canonical', 'auto_created'));
ALTER TABLE green_beans ADD COLUMN canonicals_updated_at timestamptz;

ALTER TABLE brews ADD COLUMN terroir_provenance text DEFAULT 'canonical'
  CHECK (terroir_provenance IN ('canonical', 'auto_created'));
ALTER TABLE brews ADD COLUMN cultivar_provenance text DEFAULT 'canonical'
  CHECK (cultivar_provenance IN ('canonical', 'auto_created'));

COMMENT ON COLUMN green_beans.terroir_provenance IS
  'canonical = clean lookup hit, FK row already existed. auto_created = clean lookup hit, this insert materialized the FK row for the first time. Set in findOrCreateTerroir based on the create branch firing.';

COMMENT ON COLUMN green_beans.cultivar_provenance IS
  'canonical = clean lookup hit, FK row already existed. auto_created = this insert materialized the FK row.';

COMMENT ON COLUMN green_beans.canonicals_updated_at IS
  'Bumped whenever terroir_id / cultivar_id changes via patch_green_bean or future canonical re-resolution. NULL on rows whose canonicals have not been re-resolved post-original-insert.';

COMMENT ON COLUMN brews.terroir_provenance IS
  'canonical = clean lookup hit, FK row existed. auto_created = this push materialized the row.';

COMMENT ON COLUMN brews.cultivar_provenance IS
  'canonical = clean lookup hit, FK row existed. auto_created = this push materialized the row.';

-- ---------------------------------------------------------------------------
-- 3. Inline data fix #1 — Bean 6 (Bukure Natural Lot 21)
--
-- Currently: terroir admin_region = 'Southern Province' (wrong — Gicumbi
-- District is in Northern Province). PR #99 added (Rwanda, Northern Province,
-- Central Plateau Highlands) to the registry; this fix re-resolves the bean.
-- Macro is already 'Central Plateau Highlands' (was 'Lake Kivu Highlands' at
-- design-time but a prior session landed the macro fix; admin still drifts).
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  bean_user_id uuid;
  bean_meso text;
  current_terroir record;
  target_terroir_id uuid;
BEGIN
  SELECT g.user_id, t.meso_terroir, t.country, t.admin_region, t.macro_terroir
  INTO bean_user_id, bean_meso, current_terroir.country, current_terroir.admin_region, current_terroir.macro_terroir
  FROM green_beans g
  LEFT JOIN terroirs t ON g.terroir_id = t.id
  WHERE g.id = '9f7e586d-0d1e-47fd-bbe0-d3792b5a1c0e';

  IF bean_user_id IS NULL THEN
    RAISE NOTICE 'Bean 6 not found, skipping inline fix';
    RETURN;
  END IF;

  -- Find the canonical (Rwanda, Northern Province, Central Plateau Highlands)
  -- terroir row for this user, scoped by current meso (preserves locality).
  SELECT id INTO target_terroir_id FROM terroirs
  WHERE user_id = bean_user_id
    AND country = 'Rwanda'
    AND admin_region = 'Northern Province'
    AND macro_terroir = 'Central Plateau Highlands'
    AND ((bean_meso IS NULL AND meso_terroir IS NULL) OR meso_terroir IS NOT DISTINCT FROM bean_meso)
  LIMIT 1;

  -- Materialize the canonical row if absent.
  IF target_terroir_id IS NULL THEN
    INSERT INTO terroirs (user_id, country, admin_region, macro_terroir, meso_terroir)
    VALUES (bean_user_id, 'Rwanda', 'Northern Province', 'Central Plateau Highlands', bean_meso)
    RETURNING id INTO target_terroir_id;
  END IF;

  -- Re-point + bump audit timestamp. Idempotent: same id → no-op except the bump.
  UPDATE green_beans
  SET terroir_id = target_terroir_id,
      canonicals_updated_at = now()
  WHERE id = '9f7e586d-0d1e-47fd-bbe0-d3792b5a1c0e';
END $$;

-- ---------------------------------------------------------------------------
-- 4. Inline data fix #2 + #3 — 2 CGLE beans (Sudan Rume Natural / Hybrid Washed)
--
-- Currently both bind to terroir 6720eea6 (Colombia, Valle del Cauca / Risaralda
-- / Cauca, Western Andean Cordillera, Las Margaritas). The design doc framing
-- ("wrong macro") is stale post-prior-fix; the rows are now correct. Bumping
-- canonicals_updated_at = now() to record that the audit happened.
-- ---------------------------------------------------------------------------

UPDATE green_beans
SET canonicals_updated_at = now()
WHERE id IN (
  '1cf02eb8-accb-4e74-8ce5-52892b4ecfd7',
  '0d3212f8-3f18-4ff7-b54e-7bd4b3363e86'
);
