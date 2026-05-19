-- Sprint 10 (2026-05-19) — RO-1 + RO-3 schema bundle
--
-- RO-1: rename roast_learnings.elasticity → brewing_tolerance.
-- Physics metaphor had ambiguous polarity (high elasticity = forgiving? sensitive?).
-- The column captures "how well the cup holds up when brewing variables are
-- pushed toward extremes" — that is workflow-language brewing tolerance.
-- See docs/adr/0007-elasticity-to-brewing-tolerance-rename.md for the broader
-- elasticity → (acceptable_roast_window + brewing_tolerance) concept split.
--
-- RO-3 ≡ RO-CP-7: add roast_learnings.terroir_takeaway nullable text column.
-- Chris's mental model has 4 carry-forward axes (cultivar / terroir / general /
-- starting-hypothesis); schema today only carries 3. Adds the missing axis.
-- Past rows NULL by default — same as if the field had never existed.
-- close-lot.md's "fold the terroir lesson into general_takeaway until the
-- column lands" workaround retires with this migration.
--
-- Idempotent-safe: re-applying on an already-renamed column raises an error
-- but doesn't corrupt; re-adding terroir_takeaway is guarded by IF NOT EXISTS.

ALTER TABLE roast_learnings RENAME COLUMN elasticity TO brewing_tolerance;

ALTER TABLE roast_learnings ADD COLUMN IF NOT EXISTS terroir_takeaway text;
