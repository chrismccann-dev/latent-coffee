-- Sprint 2.3 Phase 2: api_keys table for the V2 MCP server's Bearer auth.
--
-- Single-row, sha256-hashed at rest. Service-role client only; no user-readable
-- RLS policy. Bearer middleware sha256s the incoming Authorization header value
-- and looks up by key_hash. Rotation = INSERT new + UPDATE revoked_at on the old.
--
-- Per Sprint 2.3 plan + brief: single-tenant for now, just Chris's claude.ai
-- "Coffee Brewing" project. Multi-key surface is available via additional
-- INSERTs but no UI for self-service issuance.

CREATE TABLE api_keys (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash      text NOT NULL,
  label         text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_used_at  timestamptz,
  revoked_at    timestamptz
);

CREATE UNIQUE INDEX api_keys_active_hash ON api_keys (key_hash) WHERE revoked_at IS NULL;
CREATE INDEX api_keys_user_active ON api_keys (user_id) WHERE revoked_at IS NULL;

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE api_keys IS 'Bearer API keys for the V2 MCP server. Single-row, sha256-hashed. Lookup-by-hash via service-role client only; no user-readable RLS policy.';
COMMENT ON COLUMN api_keys.key_hash IS 'sha256 hex of the raw key. Service role compares hash on every MCP request.';
COMMENT ON COLUMN api_keys.label IS 'Human-readable label, e.g. claude.ai-coffee-brewing. Disambiguates keys when more than one is issued.';
COMMENT ON COLUMN api_keys.last_used_at IS 'Updated fire-and-forget on every successful auth. Useful for spotting unused / leaked keys.';
COMMENT ON COLUMN api_keys.revoked_at IS 'Non-null = revoked. The unique active-hash index ignores revoked rows so a hash can be re-issued after revocation.';
