-- Sprint 3.0: OAuth 2.1 Authorization Code grant for claude.ai web MCP integration.
--
-- claude.ai web has no "Authorization header" field in its custom-connector form,
-- only OAuth Client ID/Secret. So Bearer-direct (the desktop pattern via mcp-remote)
-- doesn't work on web; we need a real OAuth Authorization Code flow with PKCE.
--
-- This table stores short-lived (5-min) single-use authorization codes minted at
-- /api/mcp/authorize and consumed at /api/mcp/token. PKCE code_challenge is stored
-- so /token can verify the code_verifier matches.
--
-- Service-role only, no RLS policy (same pattern as api_keys).

CREATE TABLE oauth_authorization_codes (
  code                  text PRIMARY KEY,
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id             text NOT NULL,
  redirect_uri          text NOT NULL,
  resource              text NOT NULL,
  code_challenge        text NOT NULL,
  code_challenge_method text NOT NULL DEFAULT 'S256',
  scope                 text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  expires_at            timestamptz NOT NULL,
  consumed_at           timestamptz
);

CREATE INDEX oauth_authorization_codes_expires ON oauth_authorization_codes (expires_at) WHERE consumed_at IS NULL;

ALTER TABLE oauth_authorization_codes ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE oauth_authorization_codes IS 'Short-lived single-use OAuth authorization codes for the MCP server (claude.ai web). 5-min TTL, marked consumed at /token exchange. Service-role only.';
COMMENT ON COLUMN oauth_authorization_codes.code IS 'Random 32-byte hex. Returned to the client via redirect_uri at /authorize, exchanged at /token.';
COMMENT ON COLUMN oauth_authorization_codes.code_challenge IS 'PKCE S256 challenge. /token verifies sha256(code_verifier) base64url-encoded matches.';
COMMENT ON COLUMN oauth_authorization_codes.resource IS 'RFC 8707 resource indicator. Must be the canonical MCP server URI; tokens are audience-bound to this.';
COMMENT ON COLUMN oauth_authorization_codes.redirect_uri IS 'Must be re-validated at /token to match the value sent at /authorize.';
COMMENT ON COLUMN oauth_authorization_codes.consumed_at IS 'Single-use. Non-null = already exchanged for a token; further exchange attempts must fail with invalid_grant.';
