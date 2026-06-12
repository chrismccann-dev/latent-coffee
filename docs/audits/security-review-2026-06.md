# Security Review — Latent Coffee Research (full-repo, 2026-06)

**Date:** 2026-06-12
**Scope:** Whole codebase live attack surface (not a pending diff). Next.js 14 App Router + Supabase (Postgres/Auth/RLS) + MCP server, deployed on Vercel. Public GitHub repo.
**Method:** `/security-review` methodology, fanned out across 5 parallel auditors (MCP auth/OAuth, MCP tool inputs, RLS + service-role, non-MCP API routes + FS/LLM, secrets hygiene), then findings de-duplicated and the load-bearing ones re-verified by hand against source.
**Threat model (as scoped):** single-tenant, single-user (Chris), publicly deployed. Writes are me-only by design. Prioritized: unauthenticated access to Tools/routes, token theft/replay, injection through MCP Tool inputs, RLS gaps. Multi-tenant cross-user concerns are de-prioritized because exactly one legitimate user exists — but note that "one user exists" is the property doing the isolation work in several places, not the code.

## Remediation status (updated 2026-06-12)

Remediation steps 1–5 from the bottom of this report were implemented in the same PR as this audit (security-review-2026-06). Status by finding:

| Finding | Status | Notes |
|---------|--------|-------|
| #1 token expiry | **Fixed** | Migration `081_api_keys_expires_at.sql` (additive nullable); `requireApiKey` enforces `expires_at`; `/token` mints `now()+1y` (enforced 1-year per owner choice). NULL = non-expiring (desktop key). **Requires: apply migration 081 in the Supabase SQL Editor.** |
| #2 owner-pin + signup | **Fixed (code)** | `/authorize` pinned to `OWNER_USER_ID` (fails closed if unset); `app/signup/` + login link deleted. **Requires: set `OWNER_USER_ID` in Vercel; flip Supabase dashboard "Allow new users to sign up" OFF.** |
| #3 local stash secrets | **Fixed** | Both stale stashes dropped from the main repo (`stash@{0}` held the secrets). Optional backstop: rotate `ROEST_CLIENT_SECRET` + `OAUTH_CLIENT_SECRET`. |
| #4 synthesize auth gate | **Fixed** | Explicit `getUser()` 401 added to `terroirs` + `cultivars` synthesize routes (parity with `processes`/`roasters`). |
| #5 `/auth/callback` open redirect | **Fixed** | `safeNext()` guard added (mirrors login). |
| #6 code-reuse race | **Fixed** | Consume UPDATE is now a compare-and-swap (`.select()` + zero-row → `invalid_grant`). |
| #7 dead `last_used_at` | **Fixed** | `.then()`-fired with error handler (was a no-op `void` on a lazy builder). |
| #8 timing-unsafe secret compare | **Fixed** | `safeStrEqual` (sha256 + `timingSafeEqual`) on client id/secret at `/token`. |
| #9–#17 | **Deferred** | Defense-in-depth; not in the chosen remediation set. |

**Operator actions still required for full effect:** (a) apply migration 081 in the SQL Editor, (b) set `OWNER_USER_ID=bb339172-8bb4-4483-a8ca-1078abbc2bfb` in Vercel env, (c) turn off open signups in the Supabase dashboard.

## Headline

The codebase is, on the whole, **well-hardened**. The strongest result: **no SQL injection, no raw-SQL execution, no PostgREST filter-string injection, no path traversal, no SSRF, and no command/fs-write sink is reachable from any MCP Tool input or HTTP route.** The `execute_sql` path you asked about **does not exist in this server** — every `execute_sql` reference in the repo is documentation pointing at a *separate* Supabase MCP that Claude Code uses during development. All 18 modeled tables have RLS enabled with correctly-shaped `auth.uid() = user_id` policies; the service-role key never leaves server-only code.

The real exposure is concentrated in the **MCP token lifecycle** and **OAuth/registration posture**, plus one **local-only secret in a git stash**. No Critical findings. One High, three Medium, the rest Low / defense-in-depth.

| # | Severity | Finding | Location |
|---|----------|---------|----------|
| 1 | **High** | MCP access tokens never expire server-side (advertised `expires_in: 1y` is fiction) | `lib/mcp/auth.ts:33-40` |
| 2 | Medium | `/authorize` mints a token for *any* logged-in user, not pinned to the owner; combined with open self-service signup | `app/api/mcp/authorize/route.ts:109-113`, `app/signup/page.tsx:35` |
| 3 | Medium | Real secrets (ROEST + OAuth client secrets) sit in a local git stash | `refs/stash` (local only) |
| 4 | Medium | `terroirs` / `cultivars` synthesize routes have no explicit auth gate (rely on RLS short-circuit) | `app/api/terroirs/synthesize/route.ts:7-24`, `.../cultivars/synthesize/route.ts:7-21` |
| 5 | Low | Open redirect in `/auth/callback` via unvalidated `next` | `app/auth/callback/route.ts:13` |
| 6 | Low | OAuth code consume-then-mint race allows double token issuance | `app/api/mcp/token/route.ts:143-151` |
| 7 | Low | `last_used_at` audit write never fires (`void` on a lazy builder) — leaked-key detection signal is dead | `lib/mcp/auth.ts:43` |
| 8 | Low | Token-endpoint client-secret compared with `!==` (not constant-time) | `app/api/mcp/token/route.ts:88-95` |
| 9 | Low | Service-role bypasses RLS; `.eq('user_id')` is the *sole* isolation control, but inline comments call it "belt-and-suspenders" | `lib/brew-import.ts:1442`, `lib/mcp/auth.ts:32` |
| 10 | Low | `.ilike()` wildcard injection in taxonomy-queue dedup (own-scope data-integrity) | `lib/taxonomy-queue.ts:75,101` |
| 11 | Low | No rate limiting on paid synthesize endpoints (3 Sonnet calls each) | `app/api/*/synthesize/route.ts` |
| 12 | Low | Expired OAuth codes never purged | `supabase/migrations/043_oauth_authorization_codes.sql` |
| 13 | Low | No-op middleware: no session refresh; future routes outside `app/(app)` get no default auth | `middleware.ts:4-6` |
| 14 | Low | No security response headers (HSTS / X-Frame-Options / CSP) | `next.config.js` |
| 15 | Low | `.claude/hooks/check-destructive-sql.py` tautology bypass (`WHERE 1=1`) | `.claude/hooks/check-destructive-sql.py` |
| 16 | Low | `npm run check:*` scripts use `npx -y -p tsx@4` (unpinned) with service-role key in env | `package.json` scripts |
| 17 | Info | `.env.local` + `.next/` historically git-tracked (only the public anon key ever exposed; history rewritten) | git history (not on `origin`) |

---

## High

### 1. MCP access tokens never expire server-side
- **Files:** `lib/mcp/auth.ts:33-40` (validation), `app/api/mcp/token/route.ts:23` (advertises `expires_in: 31536000`), `supabase/migrations/036_api_keys.sql:11-19` (schema has no `expires_at`)
- **Severity:** High
- **Category:** token lifecycle / replay
- **Description:** `requireApiKey` looks up `api_keys` by `key_hash` filtering only on `.is('revoked_at', null)`. The `api_keys` table has **no `expires_at` column** and nothing in the lookup checks expiry. The token endpoint returns `expires_in: 31536000` (1 year), but that value is never persisted or enforced — every minted token is valid **forever** until someone manually sets `revoked_at`. OAuth-minted keys all carry the fixed `label: 'claude-web-oauth'` and accumulate (one row per exchange). A single leaked bearer grants permanent full read/write across all 35 Tools — including `pull_roest_log` (drives the Roest API) and every `push_*`/`patch_*` write — and the advertised `expires_in` actively misleads you into believing it self-rotates.
- **Exploit scenario:** A bearer leaks once (claude.ai connector storage, an upstream proxy 500, an old env dump, browser history on the OAuth round-trip). The attacker replays `Authorization: Bearer <raw>` against `https://<app>/api/mcp` indefinitely. There is no expiry gate; only manual revocation stops it, and because finding #7 means `last_used_at` never updates, you have no signal that a stale/leaked key is being used.
- **Fix:**
  1. `ALTER TABLE api_keys ADD COLUMN expires_at timestamptz;` (nullable so the hand-issued desktop key can stay non-expiring if desired).
  2. At mint time in `token/route.ts`, set `expires_at = now() + ACCESS_TOKEN_TTL`.
  3. In `requireApiKey`, add an expiry gate, e.g. fetch `expires_at` and reject if non-null and `<= now()`, or `.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())`.
  4. Consider short-lived access tokens + refresh-token rotation for the web client, and periodically revoke stale `claude-web-oauth` rows.

---

## Medium

### 2. `/authorize` is not pinned to the owner; open signup compounds it
- **Files:** `app/api/mcp/authorize/route.ts:109-113` (mints a code for *any* logged-in user), `app/signup/page.tsx:35` (open `supabase.auth.signUp`, no allowlist)
- **Severity:** Medium
- **Category:** authorization / abuse surface
- **Description:** The authorize endpoint resolves `user` via `supabase.auth.getUser()` and mints an auth code for whatever session is present (the code even comments "No consent screen — single-user, you're approving your own integration"). There is no allow-list pinning the flow to the owner's `user_id`. Signup is open and self-service in-app. So a stranger can register an account and then either (a) drive the full OAuth dance to mint a real, working `api_keys` bearer scoped to *their own* `user_id`, and/or (b) use the plain Supabase session + public anon key to INSERT their own rows and POST the synthesize routes (finding #4/#11). RLS contains the data blast radius — a new account sees only its own (empty) data, **cannot** read or corrupt Chris's rows — so this is abuse/foothold/cost-burn, not data theft. Live exploitability of signup depends on the Supabase dashboard "Allow new users to sign up" + email-confirmation toggles, which aren't in the repo.
- **Exploit scenario:** Attacker `POST`s `/auth/v1/signup` with the public anon key, confirms email (if required), then (i) burns your `ANTHROPIC_API_KEY` via the synthesize routes on their own corpus, and/or (ii) completes `/api/mcp/authorize` → `/api/mcp/token` to hold a working MCP bearer. A non-owner holding a valid MCP token on a "single-user" app is a foothold even if RLS keeps their data view empty.
- **Fix:**
  1. Pin the flow: after `getUser()` in `authorize/route.ts`, reject unless `user.id === process.env.OWNER_USER_ID`.
  2. Disable open signups in the Supabase dashboard (Auth → Providers → Email → "Allow new users to sign up" off), and/or remove `app/signup/`.
  3. Belt-and-suspenders: a `RESTRICTIVE ... WITH CHECK (auth.uid() = '<owner-uid>')` policy on the write tables makes "only the owner can write" a DB invariant.

### 3. Real secrets live in a local git stash
- **Location:** stash commit (`refs/stash`, `stash@{0}`) snapshots a `.env.local` containing `ROEST_CLIENT_ID/SECRET` + `OAUTH_CLIENT_ID/SECRET` (names only — values not reproduced here). **Verified local-only:** not reachable from any `origin/*` ref.
- **Severity:** Medium
- **Category:** secrets-in-local-git-objects
- **Description:** The stash carries the live Roest API client_credentials and the MCP OAuth client secret. `git push` doesn't push stashes, but they leak on an explicit `git push origin refs/stash`, a `git push --mirror`, or a future history operation that picks up the ref. The OAuth client secret guards the `/api/mcp/token` exchange.
- **Exploit scenario:** Any path that pushes all refs (accidental `--mirror`, a tool that pushes `refs/*`) lands the Roest + OAuth secrets in the **public** repo; an attacker with a valid PKCE code could then complete a token exchange.
- **Fix:** `git stash drop stash@{0}` (and any sibling stashes). Confirm no automation pushes `refs/stash`. Given the repo is public, rotating `ROEST_CLIENT_SECRET` + `OAUTH_CLIENT_SECRET` is cheap insurance even though the ancestor check says the stash was never pushed.

### 4. `terroirs` / `cultivars` synthesize routes have no explicit auth gate
- **Files:** `app/api/terroirs/synthesize/route.ts:7-24`, `app/api/cultivars/synthesize/route.ts:7-21` (sibling `processes`/`roasters` routes *do* call `getUser()` + 401)
- **Severity:** Medium (latent; not currently exploitable)
- **Category:** missing authentication / cost-abuse parity
- **Description:** These two routes don't check the session. They run the anon-cookie client and rely on RLS returning zero rows for an unauthenticated caller → `!terroirs?.length` → 404 *before* any Anthropic call. That incidental short-circuit saves them today, so there's **no live unauthenticated paid-call exploit** right now. The risk is the protection is accidental: it rests on RLS row-count + 404 ordering, not on an auth gate. The day any anon-readable / `USING(true)` policy is added to `terroirs`/`cultivars` (e.g. for a public landing page), both routes instantly become unauthenticated triggers for 3 paid Sonnet calls + a DB write each, with attacker-controlled ids driving fan-out.
- **Exploit scenario:** Not exploitable now. Becomes a live unauthenticated paid-LLM-abuse vector the moment an anon read policy lands on either table. (An authenticated user can already hammer them — see #11.)
- **Fix:** Add the same guard the sibling routes use at the top of both: `const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({error:'unauthorized'},{status:401})`.

---

## Low / defense-in-depth

### 5. Open redirect in `/auth/callback` via unvalidated `next`
- **File:** `app/auth/callback/route.ts:7,13` — `NextResponse.redirect(\`${origin}${next}\`)`
- **Severity:** Low
- **Category:** open redirect / phishing
- **Description:** `next` comes straight off the query string with no validation. `next=@evil.com` yields `https://<origin>@evil.com`, whose URL host is `evil.com` (the origin becomes userinfo); `next=.evil.com` yields `https://<origin>.evil.com`. The login page already guards this exact class with `safeNext()` (`app/login/page.tsx:12-16`) — the callback route was missed. Reachable only after a successful `exchangeCodeForSession`, so it requires luring the single user through an attacker-crafted login link. (Note: one sub-auditor initially read this as same-origin-safe; the `@`/`.` host-confusion makes it a genuine off-origin redirect, and the presence of `safeNext` on the login path confirms the maintainer treats it as real.)
- **Fix:** Reuse the login guard: `const raw = searchParams.get('next'); const next = raw && raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/\\') ? raw : '/brews'`.

### 6. OAuth code consume-then-mint race → double token issuance
- **File:** `app/api/mcp/token/route.ts:143-151`
- **Severity:** Low
- **Category:** OAuth flow / single-use enforcement
- **Description:** The "mark consumed" UPDATE uses `.is('consumed_at', null)` but never checks the affected-row count. Two concurrent exchanges of the same code both pass the earlier SELECT (both see `consumed_at` null), one UPDATE matches 1 row, the other matches 0 — neither errors — and both go on to mint an `api_keys` row. Single-use semantics aren't actually enforced under concurrency. Exploitation needs a stolen code (5-min TTL) *plus* the PKCE verifier, so practical risk is minimal; combined with #1 each duplicate token is permanent.
- **Fix:** Add `.select('code')` to the consume UPDATE and treat an empty result as `invalid_grant`:
  ```ts
  const { data: consumed } = await service.from('oauth_authorization_codes')
    .update({ consumed_at: new Date().toISOString() })
    .eq('code', code).is('consumed_at', null).select('code')
  if (!consumed?.length) return errorResponse('invalid_grant', 'code already used')
  ```

### 7. `last_used_at` audit write never fires
- **File:** `lib/mcp/auth.ts:43` — `void supabase.from('api_keys').update({...}).eq('id', data.id)`
- **Severity:** Low
- **Category:** audit trail / detection
- **Description:** supabase-js query builders are lazy thenables — the HTTP request only fires on `.then()`/`await`. `void <builder>` constructs and discards it; **no request is ever sent**, so `last_used_at` is never updated. Migration 036 comments that this column is "useful for spotting unused / leaked keys" — that detection is silently dead, which matters more given #1 (tokens never expire). You'd have no telemetry that a leaked key is in active use.
- **Fix:** Actually fire it: `supabase.from('api_keys').update({last_used_at:new Date().toISOString()}).eq('id', data.id).then(()=>{}, e=>console.error('[mcp/auth] last_used_at update failed:', e))`. On Vercel prefer `waitUntil(...)` or just `await` it (one indexed UPDATE).

### 8. Token-endpoint client secret compared with `!==`
- **File:** `app/api/mcp/token/route.ts:88-95`
- **Severity:** Low
- **Category:** timing-unsafe comparison
- **Description:** `clientSecret !== expectedClientSecret` short-circuits on the first differing byte. The secret is a long static env value, so a network timing attack is largely impractical — but it's the one place a real plaintext credential (not a hash) is compared.
- **Fix:** `crypto.timingSafeEqual` over equal-length buffers (hash both sides first to normalize length), for both `client_id` and `client_secret`.

### 9. Service-role bypasses RLS; isolation rests solely on `.eq('user_id')`
- **Files:** `lib/mcp/auth.ts:32` (`createServiceClient()`), misleading comment `lib/brew-import.ts:1442` ("RLS scopes to the owning user; `.eq('user_id')` is belt-and-suspenders")
- **Severity:** Low (no current miss found)
- **Category:** latent authorization
- **Description:** Every MCP request runs as the Supabase **service role**, which bypasses RLS entirely. So the `.eq('user_id', userId)` on each query is **not** redundant on top of RLS — it is the sole isolation mechanism. A full trace of every `.from()` call reachable from the 35 Tools (`lib/mcp/*`, `lib/brew-import.ts`, `lib/roast-import.ts`, `lib/taxonomy-queue.ts`) found the filter present everywhere today, including UPSERT branches that key on an `existing.id` derived from a prior user-scoped read. The risk is forward-looking: one future handler that forgets the filter is an immediate full cross-user read/write with no backstop — and the inline comments actively teach the next author that RLS will catch it (it won't).
- **Fix:** (a) Correct the comments to state plainly that the MCP path runs as service-role and bypasses RLS. (b) Introduce a `scopedFrom(table)` helper that pre-binds `.eq('user_id', auth.userId)` so omission is structurally hard. (c) Optional CI lint: assert every `.from(<modeled table>)` in `lib/mcp`/import layer is followed by a `user_id` constraint.

### 10. `.ilike()` wildcard injection in taxonomy-queue dedup
- **File:** `lib/taxonomy-queue.ts:75,101` — `.ilike('raw_value', trimmed)` with `trimmed` = verbatim input
- **Severity:** Low
- **Category:** data-integrity (own-scope)
- **Description:** `insertQueueRow` dedupes by `.ilike('raw_value', trimmed)`. PostgREST percent-encodes URL-reserved chars, so this is **not** filter/SQL injection — but `%` and `_` keep their LIKE-wildcard meaning. A value like `%` matches an unrelated pending row, returns its `queue_id` with `created:false`, and silently swallows the genuinely-intended proposal. Scoped to the caller's own `user_id`; impact is queue-dedup mis-collapse, not exfiltration.
- **Fix:** Escape metacharacters before the probe (`trimmed.replace(/[%_]/g, '\\$&')`), or switch to `.eq('raw_value', trimmed)` and lean on the existing `lower(raw_value)` EXCLUDE constraint for case-insensitive dedup.

### 11. No rate limiting on paid synthesize endpoints
- **Files:** all four `app/api/*/synthesize/route.ts`
- **Severity:** Low (resource/cost-abuse class)
- **Category:** cost-abuse
- **Description:** An authenticated caller (you, or a #2 signup) can POST these in a loop; each non-empty call fans out to **three** Sonnet calls (`runSynthesis.ts:89-128`) with no cap. `roasters`/`processes` take attacker-influenced strings that select the corpus, so input is fan-out-controlling. (Flagged as Low because pure rate-limiting/DoS is normally out of scope for `/security-review`, but it directly governs your Anthropic spend, which you asked to keep in view.)
- **Fix:** A lightweight per-user throttle (a `last_synthesized_at` check, or Vercel edge rate-limit). Even a few-per-minute cap is invisible to single-user normal use.

### 12. Expired OAuth codes never purged
- **File:** `supabase/migrations/043_oauth_authorization_codes.sql` (no TTL cleanup)
- **Severity:** Low
- **Category:** token-material retention
- **Description:** Codes are correctly single-use and time-checked at `/token`, but rows are never deleted. The table accumulates every code (with its `code_challenge`, `user_id`, `resource`). Not directly exploitable, but it broadens the blast radius of any future read primitive against that table.
- **Fix:** Scheduled `DELETE FROM oauth_authorization_codes WHERE expires_at < now() - interval '1 day'` on the existing daily CI cron.

### 13. No-op middleware (no session refresh, no default route protection)
- **File:** `middleware.ts:4-6`
- **Severity:** Low
- **Category:** session handling / hardening
- **Description:** Middleware is pure pass-through, so the `@supabase/ssr` token-refresh hop is absent and Server Components can't persist refreshed cookies. Not a bypass today — `app/(app)/layout.tsx` gates with server-verified `getUser()` and all protected queries go through the RLS cookie client. But sessions can go stale mid-use, and any future route added *outside* `app/(app)` inherits no default protection.
- **Fix:** Implement the standard `updateSession` middleware from the `@supabase/ssr` docs (create server client in middleware, `getUser()`, forward refreshed cookies), with a matcher excluding `/api/mcp` and static assets.

### 14. No security response headers
- **File:** `next.config.js` (no `headers()` export)
- **Severity:** Low
- **Category:** missing hardening headers
- **Description:** No `Strict-Transport-Security`, `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options`, or CSP. Vercel terminates TLS so transport is encrypted, but clickjacking + MIME-sniff protections are absent. (Token/authorize routes do correctly set `Cache-Control: no-store`.)
- **Fix:** Add a `headers()` block setting `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`).

### 15. Destructive-SQL guard tautology bypass
- **File:** `.claude/hooks/check-destructive-sql.py`
- **Severity:** Low (dev-tooling convenience, not a security boundary)
- **Category:** guardrail bypass
- **Description:** The PreToolUse guard flags `DELETE FROM`/`UPDATE ... SET` only when no `WHERE` appears in the same statement. `DELETE FROM brews WHERE 1=1` / `UPDATE t SET x=1 WHERE true` pass silently, as do CTE/function-expressed mutations. It's a speed-bump, not a boundary (the `execute_sql` MCP tool is allow-listed), so this is informational.
- **Fix:** Document as best-effort; optionally detect tautological predicates (`WHERE 1=1`, `WHERE true`) or require confirmation for any DELETE/UPDATE on core tables regardless of WHERE.

### 16. Unpinned `npx -y -p tsx@4` in check scripts with service-role key in env
- **File:** `package.json` (`check:migrations`, `check:types-vs-schema`, `audit:data`, etc.)
- **Severity:** Low
- **Category:** supply chain (trust-on-first-use)
- **Description:** Each check script auto-installs `tsx@4` (major range, no integrity pin) and resolves the latest `4.x` per run. Several read `SUPABASE_SERVICE_ROLE_KEY`, and some run in CI with that key in the environment. A malicious `tsx@4.x.y` publish would execute with the service-role key in scope.
- **Fix:** Add `tsx` as a pinned exact-version `devDependency` and call the local binary instead of `npx -y`, so the lockfile + integrity hash gate the version.

### 17. (Info) `.env.local` + `.next/` historically git-tracked
- **Location:** early-April commits (purged via `git rm --cached` + `git filter-branch`); a `refs/original/refs/heads/main` backup ref remains locally
- **Severity:** Informational
- **Category:** secrets-in-git-history
- **Description:** Two early commits tracked `.env.local` and the `.next/` build cache. The committed versions held **only** `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — both public-by-design (the anon key is a deliberately-public RLS-scoped JWT; confirmed `"role":"anon"`, never `service_role`). No `SUPABASE_SERVICE_ROLE_KEY`/`ANTHROPIC_API_KEY`/`ROEST_*`/`OAUTH_*` ever appeared. Neither commit is reachable from any `origin/*` ref. Current `.gitignore` covers `.env.local` + `.env*.local` + `.next/`; the live `.env.local` is a mode-600 symlink, confirmed ignored.
- **Fix:** None strictly required. Optional: prune the local backup ref — `git update-ref -d refs/original/refs/heads/main && git reflog expire --expire=now --all && git gc --prune=now`.

---

## Verified-safe (checked, correctly implemented)

**MCP auth / OAuth**
- All MCP methods are behind auth and fail-closed: `app/api/mcp/route.ts:21-28` calls `requireApiKey` first and returns 401 on any `McpAuthError` before `buildMcpServer`/`transport.handleRequest`. No `initialize`/`tools/list`/`resources`/tool-call path bypasses it (GET/POST/DELETE all route through it).
- Bearer tokens are 256-bit (`randomBytes(32)`), sha256-hashed at rest, never stored raw; lookup compares hashes only (no timing oracle on the token), strict header parsing.
- Revocation enforced (`revoked_at IS NULL` + partial unique index `api_keys_active_hash`).
- PKCE **S256 mandatory**, `plain` rejected at both `/authorize` and `/token`; verifier checked as `base64url(sha256(verifier)) == stored challenge`.
- Auth codes single-use + 5-min TTL; `redirect_uri` exact-matched against the hardcoded claude.ai callback **before** any error is reflected (closes open-redirect-via-error); RFC 8707 `resource` bound at authorize and re-checked at token; `client_id`/`client_secret` required at `/token`; grant type restricted.
- No tokens/codes/secrets/verifiers/hashes are logged in any auth path.
- Login `next=` open-redirect blocked by `safeNext` (`app/login/page.tsx:12-16`).

**RLS / service-role**
- All 18 modeled tables have RLS enabled with `auth.uid() = user_id` policies (`WITH CHECK` on writes). No `USING(true)`, no `TO anon`, no cross-user read policy across all 80 migrations. The four infra tables (`api_keys`, `doc_proposals`, `oauth_authorization_codes`, `applied_migrations`) are deny-all, service-role-only. `applied_migrations` is **not** anon-spoofable.
- `SUPABASE_SERVICE_ROLE_KEY` consumed only in `lib/supabase/service.ts`; `createServiceClient` imported only by `lib/mcp/auth.ts`, the two OAuth routes, and build-time CI scripts. Zero client components (`'use client'`) touch it; not `NEXT_PUBLIC_*`.
- Single SECURITY DEFINER function (`handle_new_user`, trigger-only on `auth.users`, derived inserts). No views, no `GRANT` widening, no `rpc()` calls, no app-exposed `execute_sql`.

**MCP tool inputs**
- No SQL injection, no raw-SQL execution, no PostgREST `.or()/.filter()/.match()` string injection anywhere; all filters are parameterized `.eq()/.gte()/.in()`.
- `read_doc`/`read_doc_section`/`list_doc_sections` gated through the static `DOC_FILES` allowlist; `loadDoc` reads only fixed map values — no path traversal.
- `propose_doc_changes`/`resolve_queue_entry`/`propose_canonical_addition` write only to user-scoped queue tables, never to files; UUIDs validated; closed enums on actions/axes.
- Roest client (`pull_roest_log` etc.): outbound host is the fixed const `https://api.roestcoffee.com`; pagination strips the API's `next` to `pathname+search` and re-targets the fixed base — **no SSRF**; Roest credentials stay server-side.
- Repo-wide: no `eval(`, no `child_process`, no `dangerouslySetInnerHTML`, no `react-markdown`/`rehype-raw`. `execFileSync`/`writeFileSync` confined to `scripts/check-*.ts` (local CI tooling, unreachable from any handler/route).

**Non-MCP routes / render**
- Synthesis output (LLM → DB → render) is emitted as React text nodes (`<p>{content}</p>`) — auto-escaped; injected `<script>` renders inert. No XSS sink.
- `processes`/`roasters` synthesize routes check `getUser()` + 401; no service client in any synthesize route; only outbound call is the fixed Anthropic endpoint (no SSRF).
- `app/(app)/layout.tsx` gates with server-verified `getUser()` (not the spoofable `getSession()`).

**Secrets**
- No live secret values in any tracked source/migration/doc (only `process.env.*` name references). Migration 036 seeds no token. No `NEXT_PUBLIC_` secret misuse. No URL-embedded credentials. The SessionStart symlink hook uses a fully hardcoded absolute path — no command-injection surface.

---

## Suggested remediation order (you pick — nothing fixed yet)

1. **#1 token expiry** — highest leverage; today `expires_in` is fiction. Add `expires_at` + enforce in `requireApiKey`.
2. **#3 drop the local stash** — one command (`git stash drop`), removes real secrets from a pushable ref; rotate ROEST/OAuth secrets if any doubt.
3. **#2 owner-pin `/authorize` + disable signup** — closes the non-owner-token + cost-burn foothold.
4. **#7 fix `last_used_at` + #6 code-race + #8 timing compare** — small MCP-auth hardening cluster; #7 especially because it restores leaked-key detection that #1 makes load-bearing.
5. **#4 + #5** — trivial parity fixes (auth gate on two synthesize routes; reuse `safeNext` in `/auth/callback`).
6. **#9–#16** — defense-in-depth / hardening as time allows.

*No code was modified. This report stops at findings per the brief.*
