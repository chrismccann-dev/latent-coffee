-- Sprint 2.5 dog-food gap (2026-04-30).
--
-- Roest API returns end_weight + start_weight at sub-gram precision (89.7g)
-- and Chris's spreadsheet uses 1-decimal floats too. The original `integer`
-- column type rejected the pull_roest_log -> push_roast flow on the very
-- first non-trivial Roest payload. Widening to `numeric` preserves source
-- precision and unblocks the path with no caller-side rounding band-aid.
--
-- Applied during Sprint 2.5 dog-food after the bean+1 partial state was
-- already in DB; existing rows were re-cast losslessly via the explicit
-- ::numeric USING clause.

ALTER TABLE roasts ALTER COLUMN roasted_weight_g TYPE numeric USING roasted_weight_g::numeric;
ALTER TABLE roasts ALTER COLUMN batch_size_g TYPE numeric USING batch_size_g::numeric;
