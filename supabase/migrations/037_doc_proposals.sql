-- Sprint 2.4 Phase 2: doc_proposals table for the V2 MCP server's `propose_doc_changes`
-- Tool. Claude.ai writes proposals; Claude Code (the arbiter) reads pending rows and
-- applies them to repo prose docs (BREWING.md, docs/brewing/roasters.md, taxonomy MD,
-- future ROASTING.md).
--
-- Per SYNC_V2.md § propose_doc_changes + § "Asymmetric write trust":
--   - Canonical-validated entities (brews) get DIRECT writes via push_brew.
--   - Prose docs flow through THIS table; Claude Code is the batched arbiter.
--   - 4-state lifecycle: pending → applied | rejected | superseded.
--
-- Auto-supersede semantics: when a NEW proposal targets a (target_doc, section_anchor)
-- pair that already has a `pending` row, the application-side handler in
-- lib/mcp/propose-doc-changes.ts marks the older row `superseded` in the same
-- transaction as the INSERT. Logic lives in app code (not a trigger) so it's visible
-- to debugging and easy to disable for stale-anchor dog-food tests.
--
-- Service-role only access (mirror api_keys 036 pattern) — RLS enabled, no
-- user-readable policy. The arbiter (Claude Code) reads via service-role client.

CREATE TABLE doc_proposals (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_doc          text NOT NULL,
  source              jsonb NOT NULL,
  citations           jsonb NOT NULL,
  summary             text NOT NULL,
  status              text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'applied', 'rejected', 'superseded')),
  created_at          timestamptz NOT NULL DEFAULT now(),
  applied_at          timestamptz,
  applied_by_session  text,
  notes               text
);

-- Pending index lets the arbiter `SELECT WHERE status='pending'` cheaply.
-- Sort key (target_doc, created_at) groups proposals by file naturally.
CREATE INDEX doc_proposals_pending
  ON doc_proposals (user_id, target_doc, created_at)
  WHERE status = 'pending';

-- Auto-supersede uses jsonb containment on citations[*].section_anchor; a GIN
-- index on the citations jsonb pays off when the table grows past a few hundred
-- pending rows. Worth adding now since the cost is minimal at low row count.
CREATE INDEX doc_proposals_citations_gin
  ON doc_proposals USING GIN (citations);

ALTER TABLE doc_proposals ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE doc_proposals IS 'Prose-doc change queue. Claude.ai writes (via propose_doc_changes Tool); Claude Code arbitrates and applies. Service-role only.';
COMMENT ON COLUMN doc_proposals.target_doc IS 'Doc identifier: ''brewing.md'' | ''roasting.md'' | ''roaster/{canonical name}'' | ''taxonomies/{axis}.md''. Validated by Tool input schema; not enforced at DB layer to allow future namespaces without schema change.';
COMMENT ON COLUMN doc_proposals.source IS 'jsonb { kind: ''brew''|''roast''|''cupping''|''session'', id?: uuid }. Identifies what triggered the proposal.';
COMMENT ON COLUMN doc_proposals.citations IS 'jsonb array of { section_anchor, line_range?, current_text?, proposed_text, operation: ''append''|''replace''|''prepend'', rationale }. Each citation is independently arbitrated.';
COMMENT ON COLUMN doc_proposals.status IS 'Lifecycle: pending (queued) | applied (Chris approved + arbiter committed) | rejected (Chris discarded) | superseded (newer proposal overlaps the same target_doc + section_anchor).';
COMMENT ON COLUMN doc_proposals.applied_by_session IS 'Claude Code session id that applied the change. For audit / re-tracing.';
COMMENT ON COLUMN doc_proposals.notes IS 'Arbiter notes — typically the supersede pointer (''Superseded by <new_id>'') or per-citation outcomes when a multi-citation proposal is partially applied.';
