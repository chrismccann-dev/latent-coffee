-- 081_api_keys_expires_at.sql
-- Security remediation #1 (security-review-2026-06): MCP access tokens never
-- expired server-side. `requireApiKey` only checked `revoked_at IS NULL`, and
-- the token endpoint advertised `expires_in: 1y` without persisting/enforcing it.
-- Add a nullable `expires_at` so OAuth-minted tokens carry a real expiry that
-- `requireApiKey` enforces. NULL = non-expiring (the hand-issued desktop bearer
-- predates this column and intentionally stays alive until manually revoked).
--
-- Additive, nullable, non-destructive: existing rows get NULL (non-expiring),
-- so no current token breaks. New `claude-web-oauth` tokens get now()+TTL.

ALTER TABLE public.api_keys
  ADD COLUMN IF NOT EXISTS expires_at timestamptz;

COMMENT ON COLUMN public.api_keys.expires_at IS
  'Hard expiry for the token. NULL = non-expiring (legacy desktop key). '
  'OAuth-minted tokens set this to now()+ACCESS_TOKEN_TTL_SECONDS; '
  'requireApiKey rejects rows where expires_at IS NOT NULL AND expires_at <= now().';

INSERT INTO public.applied_migrations (filename) VALUES ('081_api_keys_expires_at.sql') ON CONFLICT (filename) DO NOTHING;
