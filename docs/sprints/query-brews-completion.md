# Completion report — `query_brews` MCP Tool (2026-07-27)

Item 2 of the [freezer-lookup + query_brews kickoff brief](freezer-lookup-and-query-brews-kickoff.md). Item 1 (freezer-stock enumerate-then-read-section) shipped separately in PR #598 / `eac0894` and was not touched here.

## The plan, restated

`list_recent_brews` has only a `limit` parameter, so any brew-corpus question narrower than "what's recent?" meant pulling a 100-240K-char window and filtering client-side — impossible on mobile sessions (no save-to-file + `jq` recovery), so sibling-lot and prior-brew lookups were a mobile hard-block. The recurring shape (N=3 by 2026-07-27) is the sibling-variant lookup by roaster + coffee family, where matching the sibling lot's terroir/cultivar FKs is a correctness requirement (one farm → one canonical row).

The brief's design fork: (a) fatten `list_recent_brews` with filter params, vs (b) a new `query_brews` Tool. **Resolved as (b)** — the invoking handoff, branch name, and brief recommendation all named it; it matches the `list_recent_brews` description's own documented intent ("filtered fetches belong on a future query_brews Tool"), and Tool count 38→39 stays well under the 50 tripwire. The three non-blocking sub-questions all took their defaults: trimmed-by-default projection with `fields` as opt-in widener; roaster canonical-resolved via `ROASTER_LOOKUP` with substring fallback; `green_bean_id` filter included now.

## What shipped

**Code:**
- [lib/mcp/query-brews.ts](../../lib/mcp/query-brews.ts) (new, modeled on `list-recent-brews.ts`) — Tool registration + zod input schema. Roaster AND cultivar both canonical-resolve through their registries (`ROASTER_LOOKUP` / `CULTIVAR_LOOKUP.canonicalize`, raw input as substring fallback — "Geisha" hits "Gesha" rows; response echoes `roaster_resolved` when resolution changed the term). `fields` / `extraction_strategy` / `base_process` are `z.enum`s (push-brew's documented idiom), so the valid vocabularies are introspectable in the published schema and typos die at zod, not as silent empty results.
- [lib/mcp/brews.ts](../../lib/mcp/brews.ts) — `fetchBrewsFiltered` with `fetchRecentBrews` collapsed to a one-line delegate (`filters: {}` + all `BREW_SCALAR_COLUMNS` as fields; live-verified byte-identical output), so clamp/scoping/ordering live once. `BREW_SCALAR_COLUMNS` exported with a `BrewScalarColumn` union type (`extraFields` is typed against it; `QUERY_DEFAULT_COLUMNS` pinned via `satisfies`); `QUERY_DEFAULT_COLUMNS` = 15 identity + core-recipe scalars; all three FK embeds (terroir / cultivar / green_bean) always included — the sibling-lot correctness case is *about* the embeds. `cultivars!inner` swap when the cultivar filter is present so non-matching parents drop out. Same `RECENT_MAX_LIMIT=50` clamp.
- [lib/mcp/server.ts](../../lib/mcp/server.ts) — registration next to `list_recent_brews`.
- [lib/mcp/list-recent-brews.ts](../../lib/mcp/list-recent-brews.ts) — forward-reference flipped "a future query_brews Tool" → "the query_brews Tool", filter-axis list updated.

**Filter axes (all AND together, latest-first):** `roaster` (canonical-resolved, case-insensitive substring), `coffee_name` (substring), `extraction_strategy` (canonical enum), `base_process` (canonical enum), `cultivar` (canonical-resolved, substring on the FK-joined `cultivars.cultivar_name`), `since_date` (`created_at >=`, YYYY-MM-DD), `green_bean_id` (exact FK). Zero filters is allowed (trimmed recency query).

**Docs (six-actor propagation):**
- SYNC_V2.md — count line 38→39 + Brews Tool-table row.
- CLAUDE.md — § MCP server status + § Standing tripwires, both 38→39.
- PRODUCT.md — § Scaling Watch-Items count 38→39.
- [operational-guide.md § Archive lookup paths for 1c](../skills/brewing-assistant/cluster/operational-guide.md) — new "Prior brews of this coffee / sibling lots (DB)" line: `query_brews(roaster:)` + `coffee_name` narrowing, with an explicit do-NOT-wide-pull-`list_recent_brews` warning. This is where the `/brew` skill's Step 1 dispatch reads.
- [process-friction-log.md](../skills/brewing-assistant/cluster/process-friction-log.md) — 2026-07-01 and 2026-07-27 entries flipped to `→ graduated:` per § Discipline.
- [feedback-backlog.md](../product/feedback-backlog.md) — entry converted to a shipped blockquote per the status lifecycle; header line updated.
- [shipped.md](shipped.md) — new top row.

**Divergences from the brief:** none of substance. The trimmed default is 15 scalars rather than the sketched ~8 (recipe core = brewer/dose/water/ratio/temp/time earned inclusion; still ~700 bytes/row). The FK embeds are in the *default* projection rather than opt-in, deliberately — the motivating correctness case needs them. The `/simplify` pass (4 review agents) upgraded three things beyond the brief: cultivar filter got the same canonicalize-then-fallback treatment as roaster; `extraction_strategy` / `base_process` / `fields` became introspectable `z.enum`s instead of free strings; `fetchRecentBrews` collapsed into `fetchBrewsFiltered`. Skipped from review findings (noted, low value): a shared `limit` zod field between the two brew tools (descriptions intentionally differ), and pre-computing the no-`fields` select string (single-user server, noise-tier).

## PR + merge

- PR: https://github.com/chrismccann-dev/latent-coffee/pull/599 (squash-merged 2026-07-27)
- Merge SHA on main: `542fbf117e3ea84ee0246f5ae6313b0bd3c1c222`

## Actual verification results (run 2026-07-27, not "should work")

Live regression ran against the prod DB through `fetchBrewsFiltered` itself (tsx script in the worktree; the Tool surface goes live at the Vercel deploy on merge):

1. `npm run check:mcp` — **"TOTAL: 39 tools registered"**, type-coverage + unknown-argument guardrails both passed.
2. `npx tsc --noEmit` — clean (via node_modules symlink in the worktree; one `Set` spread fixed to `Array.from` for the ES-target).
3. **Untold regression:** `roaster: "Untold Coffee Lab"` → 4 rows, **3,109 bytes** (Deborah Interstellar / Fazenda Um Pink Bourbon / Janson Pacamara / Fazenda Um Wush Wush). Same-session baseline `fetchRecentBrews(50)` = **252,376 bytes** — an **81× reduction**, well under the brief's 10 KB bar.
4. **Roaster fallback:** `canonicalize("untold")` → `"Untold Coffee Lab"` (registry resolution working; unresolvable inputs fall through as raw substring).
5. **Empty result:** nonsense roaster → `[]`, no error.
6. **Cultivar inner join:** `cultivar: "Pink Bourbon"` → 4 rows, every row's joined cultivar matches (no null-embed parents leaking through).
7. **Clamp:** `limit: 500` → 50 rows.
8. **`fields` widener:** `["flavors", "what_i_learned"]` present on rows; payload 11.8 KB for 4 rows — still bounded.
9. **Combined filters:** `extraction_strategy: "Hybrid"` + `since_date: "2026-07-01"` → 6 rows, all `Hybrid`.

The whole battery (3-9) was re-run after the `/simplify` refactor and passed identically, including the byte-identical `fetchRecentBrews` output through its new delegate path.

**Catalog-cache caveat (open until Chris's next session):** this build session's MCP catalog predates the deploy, so the Tool could not be called end-to-end through the connector here. Per the standing rule, confirm in a **fresh session** (or explicit ToolSearch) that `query_brews` surfaces, then rerun `query_brews(roaster: "Untold Coffee Lab")` as the end-to-end receipt. The data layer beneath it is verified above.

## Deferred / surfaced

- **Free-text prose search** (`what_i_learned` / `strategy_notes`) stays out per the brief — own indexing question; PRODUCT.md § Before 200+ brews already tracks it.
- `docs/prompts/start-brew.md` (mobile fallback) was left unedited: it delegates Step 1 to the same operational-guide section that now carries the `query_brews` path, so no second edit surface existed (checked — it has no own `list_recent_brews` instruction).
- **Close-out for Chris:** paste-back loop per the kickoff brief — the backlog + friction-log + shipped.md flips are already in this PR; remaining is only the fresh-session catalog confirmation above, and `route-feedback` any new friction from this build (none surfaced worth filing).
