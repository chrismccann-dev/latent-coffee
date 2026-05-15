# SYNC_V2.md — Claude.ai ↔ App Bidirectional Sync

> **Status:** Live architecture reference for the MCP-based sync. Originally locked in Sprint 2.2 (2026-04-28); shipped sprints 2.3 → 2.7 + 3.0 + 3.0.5 + Phase 1-3 + Roest write integration. *Last refreshed: 2026-05-07 (May 2026 doc cleanup PR).*
>
> **The driving question this answers:** when Chris finishes a brew in his `claude.ai` "Coffee Brewing" project, what's the next interaction? Answer: he says "log it" and the project's MCP tools push the resolved brew to the app + queue lessons-learned proposals against `BREWING.md` for Claude Code to arbitrate.
>
> Sprint history (2.3 onward) lives in [docs/sprints/shipped.md](docs/sprints/shipped.md) and per-sprint retros in `memory/project_*.md`.

---

## The five architectural decisions

| # | Decision | Locked answer |
|---|---|---|
| 1 | **Transport** | MCP server hosted by app over HTTP (Next.js API route, `@modelcontextprotocol/sdk` TypeScript SDK). Resources for reads, Tools for writes. |
| 2 | **Authentication** | **Two paths:** (a) Long-lived **bearer token** in env for desktop MCP clients (`Authorization: Bearer <key>`, single-tenant, single api_keys row, rotate manually). (b) **OAuth 2.1 + PKCE** for claude.ai web (Sprint 3.0, 2026-05-03) — discovery endpoints (`/.well-known/oauth-protected-resource` + `/.well-known/oauth-authorization-server`), `/api/mcp/authorize`, `/api/mcp/token`, static client credentials via Vercel env. Single-tenant + single-user shape collapsed OAuth's heaviest costs (consent UI, scopes, identity) to nothing. |
| 3 | **Direction** | Bidirectional. App serves canonical taxonomies + living docs (`BREWING.md`, `ROASTING.md`, per-roaster lessons, prompts) as MCP Resources; Claude.ai writes brews + roasts + cuppings + experiments + roast_learnings + Roest profiles directly via Tools and queues prose-doc proposals for Claude Code to apply. |
| 4 | **Doc storage** | Repo files remain the source of truth. App API serves them from build filesystem. Proposed prose changes land in a `doc_proposals` DB table; Claude Code is the arbiter (batched apply across sessions). Vercel auto-deploys propagate canonical edits back to Claude.ai's view of the docs. |
| 5 | **Write trust** | **Asymmetric.** Direct write for brews / roasts / cuppings / experiments / roast_learnings (taxonomy-validated, registry-picked, FK-enforced). **Propose-then-apply** for `BREWING.md` / `ROASTING.md` / per-roaster lessons / taxonomy markdown (Claude.ai writes citations referencing specific lines; Claude Code arbitrates in batch via `process pending arbitration`). |

The asymmetry is the load-bearing call: Claude.ai's strong suit is structured field-picking against canonical registries (proven across many V2 dog-food rounds); free-form prose mutation is where drift happens, and Chris explicitly wants Claude Code as the arbiter for that path.

---

## Scope

**In scope (live):**
- Brewing flow end-to-end: coffee briefing in claude.ai → recipe iteration → "log it" → push_brew + propose lessons.
- Roasting flow end-to-end: per-roast push (not just per-bean compile) → push_cupping → push_experiment → push_roast_learnings at lot close. Roest API write integration (push_roast_profile + push_inventory + patch_inventory) closes the manual-transcription step in profile design + inventory bookkeeping.
- **Self-roasted brew sync** - the SR reference brew gets pushed via `push_brew` with `source: 'self-roasted'` + `green_bean_id` + `roast_id` linking. Bundled into `close-lot.md` STAGE 4 so the brew lands together with the lot close-out narrative.
- Bidirectional reads: claude.ai pulls canonicals + docs + recent brews live (no manual upload to project context).
- Net-new canonical fallback: push-with-override + Phase 3 `taxonomy_overrides_queue` + arbiter playbook.

**Out of scope (won't ship):**
- Multi-user / multi-tenant. Single API key, single user.
- Real-time push from app → claude.ai. Claude.ai pulls on demand (resource fetch); no server-push, no webhooks.
- Conflict resolution beyond "Claude Code arbitrates sequentially." No CRDT, no auto-merge, no diff-merge UI.
- App UI changes for MCP plumbing. Existing `/brews`, `/roasters`, `/cultivars`, `/processes`, `/terroirs` keep their current read paths — they read from the same `brews` table.

---

## MCP server architecture

### Hosting

HTTP transport on Next.js API routes under `/api/mcp/*`. Single server instance per Vercel deployment. Stateless request handling — each MCP call is a self-contained HTTP request, no long-lived session needed. The taxonomies and recent brews are cheap to re-fetch per request; doc files are read from filesystem (cached by Vercel's runtime if hot).

**Cold-start verdict (validated in Sprint 2.3):** ~2.07s cold / 0.21-0.44s warm on Vercel Node serverless. Within marginal band; no Edge Functions fallback needed.

**Why not a separate process / Railway / Fly:**
- Vercel auto-deploys propagate doc edits in 30-60s, which matches Chris's batched arbitration cadence.
- Co-located with the app's existing Supabase client + auth surface — no duplicated config.
- Reuses the existing canonical registries directly.

### Authentication

Two auth paths, both resolve to the same `user_id` for RLS scoping.

**Path A — Bearer token (desktop MCP clients):**
```
GET /api/mcp/list_resources
Authorization: Bearer <ANTHROPIC_LATENT_SYNC_KEY>
```
- Key generated once via Supabase admin SQL: `INSERT INTO api_keys (key_hash, user_id, label) VALUES (...)`.
- Stored in claude.ai project's MCP config (or Claude Code's `~/.config/...`).
- Server validates against `api_keys` table (`SUPABASE_SERVICE_ROLE_KEY` for the lookup), resolves to `user_id`, all queries scoped via RLS.
- Rotation: invalidate row, generate new, paste into client config.

**Path B — OAuth 2.1 + PKCE (claude.ai web):**
- Discovery endpoints: `/.well-known/oauth-protected-resource` + `/.well-known/oauth-authorization-server`.
- `/api/mcp/authorize` → 5-minute auth code (stored in `oauth_authorization_codes`, migration 043).
- `/api/mcp/token` → returns access_token (reuses the api_keys row internally).
- WWW-Authenticate header on `/api/mcp` 401 to trigger re-auth.
- Static client credentials via Vercel env (`MCP_OAUTH_CLIENT_ID` + `MCP_OAUTH_CLIENT_SECRET`).
- Single-tenant + single-user shape collapsed B-OAuth's heaviest costs (consent UI, scopes, identity) to ~nothing.

### MCP Resources (read-only, browseable)

Resources are content endpoints claude.ai can list and fetch. Each Resource has a URI; URI templates allow parameterized fetches.

| URI | Returns | Source |
|---|---|---|
| `canonicals://{axis}` | JSON registry for one axis (cultivars / terroirs / processes / roasters / producers / brewers / filters / flavors / grinders / roast-levels / extraction-strategies / modifiers) | `lib/{axis}-registry.ts` exports |
| `docs://brewing.md` | `BREWING.md` text (full, or `#{anchor}` for one section) | Repo file |
| `docs://brewing/roasters.md` | Per-roaster lessons + house-style cards (full, or `#{anchor}` for one card) | Repo file |
| `docs://brewing/wbc-reference.md` | WBC 5-axis foundational map + 8 strategy families | Repo file |
| `docs://brewing/wbc-recipes.md` | 102-recipe WBC archive (2022-2025) | Repo file |
| `docs://roasting.md` | `ROASTING.md` text (full, or `#{anchor}` for one section) | Repo file |
| `docs://taxonomies/{axis}.md` | Authored markdown for one of the 10 canonical taxonomies (full, or `#{anchor}`) | Repo file |
| `docs://prompts/{name}.md` | Operational prompts (start-brew / log-brew / propose-doc-changes-from-brew / bundled-brewing-completion brewing-side; start-lot / log-roast / log-cupping / close-lot V-set roasting; one-shot / one-shot-closeout one-shot roasting) | Repo file |

**Note:** `brews://recent` and `brews://by-id/{uuid}` were Resources in Sprint 2.3 but were promoted to Tools (`list_recent_brews` + `get_brew`) in Sprint 3.0.5 (2026-05-03). Architectural rule confirmed: claude.ai surfaces Tools to the model; Resources are catalog only.

### MCP Tools (write actions + reads that need Tool-level discoverability)

**34 Tools live as of 2026-05-13 (post Sub Pages 6.1 — added `push_roast_recipe` + `patch_roast_recipe` for the roast_recipes first-class entity).**

The full Tool list (with input schemas) is the source of truth — see `lib/mcp/*.ts`. Below is a categorized overview for human reference.

| Category | Tools | Purpose |
|---|---|---|
| **Brews** | `push_brew`, `patch_brew`, `list_recent_brews`, `get_brew` | Push/patch a brew; list recent or fetch by id (promoted from Resources in 3.0.5 because claude.ai surfaces Tools, not Resources). |
| **Green beans** | `push_green_bean`, `patch_green_bean`, `get_green_bean`, `get_bean_pipeline` | Bean intake + lookups; `get_bean_pipeline` returns fat JSON `{green_bean, roasts[], cuppings[], experiments[], roast_learnings, brews[]}`. |
| **Roasts** | `push_roast`, `patch_roast` | Per-batch roast log push (UPSERT on `(user_id, green_bean_id, batch_id)`). Sub Pages 6.1 (2026-05-13): added optional `recipe_id` FK to roast_recipes. |
| **Roast recipes** | `push_roast_recipe`, `patch_roast_recipe` | Sub Pages 6.1 (2026-05-13). First-class design-intent entity, separate from the as-recorded roast. UPSERT on `(user_id, experiment_id, batch_slot)` (V-set framing) or `(user_id, green_bean_id, recipe_name)` (one-off). ~30 fields cover curves (bezier jsonb) + design specs + drop rules + design-time predictions + Roest linkage + per-batch `rationale` (Hypothesis prose) + free `notes`. |
| **Cuppings** | `push_cupping`, `patch_cupping` | Day 7 evaluation push. Composite key includes `recipe_variant` (NULLS NOT DISTINCT). |
| **Experiments** | `push_experiment`, `patch_experiment` | A/B/C/D experiment record (UPSERT on `experiment_id`). Sub Pages 6.1 (2026-05-13): added 16 cross-batch fields covering 4 temporal write moments — `updated_cup_prediction_a/b/c/d` (post-roast, pre-cupping) + `taste_for_a/b/c/d` (cupping-table questions) + `delta_from_roast_a/b/c/d` (vs recipe predictions) + `delta_from_cup_a/b/c/d` (vs updated_cup_prediction). |
| **Roast learnings** | `push_roast_learnings`, `patch_roast_learnings` | Per-bean lot close-out synthesis (one row per closed bean). Sub Pages 6.1 (2026-05-13): added optional `best_roast_id` typed UUID FK alongside legacy `best_batch_id` text (preferred for new writes). |
| **Roest API** | `push_roast_profile`, `push_inventory`, `patch_inventory`, `pull_roest_log`, `list_roest_logs`, `list_roest_inventory` | Bidirectional Roest integration: push profiles to the machine, push/patch inventory entries, pull roast graph data + inventory listings. |
| **Doc proposals** | `propose_doc_changes` | Polymorphic prose-doc-change proposal Tool. Writes to `doc_proposals`; Claude Code arbitrates in batch. |
| **Doc reads** | `read_doc`, `read_doc_section`, `list_docs`, `list_doc_sections` | Doc-introspection Tools for claude.ai (Resources stay registered but Tools are reliably surfaced). |
| **Canonical reads** | `read_canonical`, `list_canonicals` | Canonical-introspection Tools. Same gotcha — Tools are reliably surfaced; Resources serve the same JSON. |
| **Taxonomy queue** | `list_taxonomy_queue`, `propose_canonical_addition`, `resolve_queue_entry` | Phase 3 canonical-promotion queue (single shape across 7 axes). Arbiter walks via ARBITER.md § Taxonomy queue arbitration. |

**Why doc + canonical reads are Tools, not just Resources:** SYNC_V2's original design assumed `docs://` and `canonicals://` Resources would be model-callable from claude.ai. Sprint 2.4 dog-food (2026-04-29) surfaced that claude.ai's MCP client surfaces Tools as the on-demand model surface; Resources are catalog/context but not reliably reachable as "fetch X now" by the model. Without Tool-shaped reads, `propose_doc_changes` citations couldn't be drafted against verbatim live-doc text and `push_brew` callers had to read full taxonomy markdown (133 anchors for producers!) to validate single canonical names. The introspection Tools close that gap. Resources stay registered for clients that DO surface them.

For full per-Tool input schemas, see `lib/mcp/*.ts`. Each Tool's `description` field is what claude.ai's `tool_search` ranks against; an audit pass on Tool descriptions for clarity + searchability is queued as its own sprint (see PRODUCT.md § Longer Term Items § Newly queued).

---

## Doc storage model

### Source of truth

- `BREWING.md` lives at repo root (existing location).
- `ROASTING.md` lives at repo root (created in Sprint 2.5, 2026-04-30).
- Per-roaster lessons: `docs/brewing/roasters.md` (split out of BREWING.md SECTION 2 in Sprint 2.4 so each roaster card section-anchors cleanly under MCP for `propose_doc_changes`). target_doc='roaster/{Canonical Name}' resolves to a section in this file.
- WBC reference + recipes: `docs/brewing/wbc-reference.md` + `docs/brewing/wbc-recipes.md` (Sprint 2.7 + v8.4).
- Closed-lot archive: `docs/roasting/archive.md`.
- Taxonomy authored content: `docs/taxonomies/<axis>.md`. Authored by Chris; `lib/<axis>-registry.ts` is the validation mirror (2-step deliberate edit when adding a new entry).
- Prompts: `docs/prompts/<name>.md`. Operational prompts for claude.ai sessions.

### How Claude.ai sees them

- MCP Tool fetch: `read_doc(uri)` returns the live file text. `read_doc_section(uri, anchor)` returns one section by header anchor.
- `list_docs()` returns the catalog (uri / name / title / mimeType).
- The MCP server parses headers into a `sections` map and exposes them as resource metadata.
- Cache: the API route reads from disk on each request. Vercel's edge cache may cache for ~30s; that's acceptable since edits propagate via redeploys (longer cycle than cache TTL).

### How writes flow

```
Claude.ai      "log this lesson"
   │
   ├─→ propose_doc_changes(target_doc='brewing.md', citations=[...], summary='...')
   │      │
   │      └─→ POST /api/mcp/tools/propose_doc_changes
   │             │
   │             └─→ INSERT INTO doc_proposals (..., status='pending')
   │
   │   (later, batched)
   │
Chris (in Claude Code session)
   │
   ├─→ "process pending arbitration"  (or aliases — see ARBITER.md § Trigger phrase)
   │      │
   │      └─→ Claude Code reads doc_proposals + taxonomy_overrides_queue
   │             │
   │             └─→ Per ARBITER.md procedure: present diffs, get approval per citation,
   │                    apply via Edit tool, status=applied/rejected/superseded
   │                    │
   │                    ├─→ git commit + push + PR + merge
   │                    └─→ UPDATE doc_proposals SET status='applied'
   │
   └─→ Vercel auto-deploys; Claude.ai's next session pulls fresh BREWING.md.
```

### Why repo file + DB proposals (not DB-backed docs)

- Preserves git history natively. Every BREWING.md edit is a commit; rollback is `git revert`.
- No syncing problem — one canonical location.
- Claude Code's existing workflow (read file → edit → commit → PR) doesn't change.
- Vercel's auto-deploy cadence (30-60s) matches Chris's batched arbitration.
- Lower infra: no `docs` table, no per-write commit machinery, no merge-conflict resolution between live DB writes and git history.

### Why DB queue (not git-tracked proposals)

- claude.ai shouldn't have git write access; auth surface is different (MCP API key vs git push permissions).
- A DB row is a structured record (queryable, indexable, statusable) where a git-committed proposal file would be a flat artifact.
- Chris can review pending count from the app: `SELECT count(*) FROM doc_proposals WHERE status='pending'`.

---

## Conflict resolution / two-store reconciliation

Sprint 2.1 surfaced that `BREWING.md` sometimes leads the DB: claude.ai writes prose during iteration (before the brew row lands at "log it"). V2 reconciles this:

**Two-store identities:**
- DB: `brews` row keyed on `(user_id, roaster, lower(coffee_name))`.
- BREWING.md: prose sections keyed on `## Section Name` headers + free-text body.

**No primary/replica.** Both stores can be written independently. The proposal queue ensures that BREWING.md edits are sequential (Claude Code applies one at a time per batch), so there's no merge-conflict scenario in the prose path. The DB is independently consistent via Postgres ACID.

**Cross-store linking:** brews can reference BREWING.md sections via section anchor strings (e.g., `brews.what_i_learned` may say "see § Coffees That Needed Full Expression"). Not enforced by FK; just narrative pointer. BREWING.md sections can list `brew_id` references (added by propose_doc_changes when relevant).

**Drift policy:** if a doc edit conflicts with what's now in DB (e.g., a BREWING.md "Coffees That Confirmed Clarity-First" mentions a brew that's since been reclassified to Suppression in DB), Claude Code surfaces this during arbiter review and asks Chris to resolve.

**No CRDT, no auto-merge.** Sequential application + arbiter judgment. Frequency of conflicts expected to be low (Chris is the only writer; iterations are coffee-by-coffee).

---

## Net-new canonicals flow (Phase 3 architecture)

Chris's audio framing: producers won't ever be 100% comprehensive; AI-assisted research at sync time is OK as background; don't block claude.ai when a new producer (or any net-new canonical) appears.

**Live shape:** `taxonomy_overrides_queue` (migration 045, Phase 3, 2026-05-05). Single table covering all 7 text-based axes (producer / roaster / brewer / filter / grinder / terroir / cultivar). Mirror of `doc_proposals` shape — same arbiter playbook walks both queues. See [docs/features/taxonomy-overrides-queue.md](docs/features/taxonomy-overrides-queue.md) for full design.

**Push path (claude.ai → app):**

1. Claude.ai detects a value not in registry. For axes with `allowOverride` (producer / roaster / brewer / filter / grinder), sets `<axis>_override: true` and passes verbatim string. For strict axes (terroir / cultivar), the push fails fast and the model recovers via `propose_canonical_addition`.
2. Server-side push handler (`persistBrew` / `persistGreenBean`): stores text verbatim. `validateCanonicalText` returns `needsQueue: true`.
3. After the row lands, `fireQueueInserts` from `lib/taxonomy-queue.ts` writes a row to `taxonomy_overrides_queue`:
   - `axis = 'producer'` (etc.)
   - `raw_value = <verbatim>`
   - `submission_path = 'override_flag'` (or `'manual_propose'` for the strict-axis path)
   - `source_kind = 'brew' | 'green_bean'`
   - `source_id = <new row id>`
4. Push response echoes `queued_for_taxonomy_review: [{axis, raw_value, queue_id}]` so claude.ai can confirm the queue picked it up without a follow-up `list_taxonomy_queue`.
5. EXCLUDE constraint on `(user_id, axis, lower(raw_value)) WHERE status='pending'` auto-collapses duplicate pushes — second push of the same string returns the existing pending row.

**Arbiter (Chris-as-arbiter / Claude Code session):**

Same playbook as `doc_proposals`. See [ARBITER.md § Taxonomy queue arbitration](ARBITER.md#taxonomy-queue-arbitration-phase-3) for the T1-T6 procedure: `list_taxonomy_queue` → group by axis → present each row to Chris → for each, edit registry + markdown → call `resolve_queue_entry({queue_id, action: 'promoted' | 'aliased' | 'rejected' | 'duplicate', ...})`.

**No automated background research routine.** Today the arbiter manually researches net-new producers when needed. Future enhancement (logged as a side-quest in PRODUCT.md): arbiter spawns a research subagent that drafts a `ProducerEntry` shape per queued producer, surfaces for Chris's sign-off. Trigger: when manual cadence becomes onerous.

---

## Open questions

Most architectural questions from Sprint 2.2 brainstorm have resolved through shipping. One remains genuinely open:

- **`extraction_confirmed` semantic drift.** Originally specified as "differs only" (only set when planned strategy diverged from tasted), but the field has been used in practice as confirmation prose. Documented by the Extraction Strategy v2 retro and Sprint 2.7's prompt rewrite. Worth re-spec'ing the field next time the brewing prompt is revisited.

---

## Pointers

- **Active and queued sprints:** [PRODUCT.md § Roadmap](PRODUCT.md#roadmap)
- **Shipped sprint history:** [docs/sprints/shipped.md](docs/sprints/shipped.md)
- **BMR (driving prompt for the Coffee Brewing claude.ai project):** [BREWING.md](BREWING.md)
- **Roasting master reference:** [ROASTING.md](ROASTING.md)
- **Arbiter playbook:** [ARBITER.md](ARBITER.md)
- **Per-axis canonical sources:** [docs/taxonomies/](docs/taxonomies/)
- **Phase 3 design doc:** [docs/features/taxonomy-overrides-queue.md](docs/features/taxonomy-overrides-queue.md)
- **MCP TypeScript SDK:** https://github.com/modelcontextprotocol/typescript-sdk
- **MCP HTTP transport spec:** https://modelcontextprotocol.io/docs/concepts/transports
