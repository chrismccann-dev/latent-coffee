-- Sprint 12 / MCP-1 (2026-05-21): widen taxonomy_overrides_queue.axis CHECK
-- enum from 7 to 8 values, adding 'signature_method' as the 8th override-
-- eligible axis. Chris-locked decision from grilling-2026-05-15-mcp-followups #1.
--
-- Why: today the queue covers producer / roaster / brewer / filter / grinder /
-- terroir / cultivar. signature_method is structurally analogous to producer
-- (text-only column on brews, no FK row) with high net-new probability — every
-- new proprietary process from a producer (Alchemy, TIM, Enzyflow, etc.) needs
-- the same arbiter pipeline rather than failing fast.
--
-- Mechanics: drop the named CHECK constraint, recreate with the 8-value list.
-- Done in a transaction so a failure mid-way leaves the table in its prior
-- state.

ALTER TABLE taxonomy_overrides_queue
  DROP CONSTRAINT taxonomy_overrides_queue_axis_check;

ALTER TABLE taxonomy_overrides_queue
  ADD CONSTRAINT taxonomy_overrides_queue_axis_check
  CHECK (axis IN (
    'producer',
    'roaster',
    'brewer',
    'filter',
    'grinder',
    'terroir',
    'cultivar',
    'signature_method'
  ));
