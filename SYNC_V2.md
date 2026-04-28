# SYNC_V2.md — Claude.ai ↔ App Bidirectional Sync (V2 Architecture)

> **Status:** Architecture locked 2026-04-28 (Sprint 2.2). Build sprints 2.3-2.7 follow this doc.
>
> **V1 reference:** [SYNC.md](SYNC.md) — paste-driven Claude Code playbook. Stays operational until 2.3 ships `push_brew`. After V2 ships, V1 deprecates with a header redirect.
>
> **Driving question this answers:** when Chris finishes a brew in his `claude.ai` "Coffee Brewing" project, what's the next interaction? Answer: he says "log it" and the project's MCP tools push the resolved brew to the app + queue lessons-learned proposals against `BREWING.md` for Claude Code to arbitrate.

---

## The five architectural decisions

| # | Decision | Locked answer |
|---|---|---|
| 1 | **Transport** | MCP server hosted by app over HTTP (Next.js API route, `@modelcontextprotocol/sdk` TypeScript SDK). Resources for reads, Tools for writes. |
| 2 | **Authentication** | Long-lived API key in env. Bearer token in `Authorization` header. Single-tenant; rotate manually when needed. |
| 3 | **Direction** | Bidirectional. App serves canonical taxonomies + living docs (`BREWING.md`, `ROASTING.md`, per-roaster lessons) as MCP Resources; Claude.ai writes brews + roasts directly and queues prose-doc proposals for Claude Code to apply. |
| 4 | **Doc storage** | Repo files remain the source of truth. App API serves them from build filesystem. Proposed prose changes land in a `doc_proposals` DB table; Claude Code is the arbiter (batched apply across sessions). Vercel auto-deploys propagate canonical edits back to Claude.ai's view of the docs. |
| 5 | **Write trust** | **Asymmetric.** Direct write for brews / roasts / cuppings / experiments (taxonomy-validated, registry-picked). **Propose-then-apply** for `BREWING.md` / `ROASTING.md` / per-roaster lessons (Claude.ai writes citations referencing specific lines; Claude Code arbitrates in batch). |

The asymmetry is the load-bearing call: Claude.ai's strong suit is structured field-picking against canonical registries (where it's already proven across two Sprint 2.1 dog-food runs); free-form prose mutation is where drift happens, and Chris explicitly wants Claude Code as the arbiter for that path.

---

## Scope

**In scope (V2 design):**
- Brewing flow end-to-end: coffee briefing in Claude.ai → recipe iteration → "log it" → push_brew + propose lessons.
- Roasting flow end-to-end: per-roast push (not just per-bean compile) → push_cupping → push_experiment → end-of-bean lessons proposal.
- Bidirectional reads: Claude.ai pulls canonicals + docs + recent brews live (no more manual upload to project context).
- Net-new producer fallback: push-with-override + background research routine.

**Built first:** brewing path (Sprint 2.3 + 2.4). Roasting path follows (2.5).

**Out of scope (deferred):**
- Self-roasted brew sync via Claude.ai. Self-roasted brews continue through `/add` until 2.5 ships and roasting flow is validated.
- App UI changes. V2 is API/MCP, not UI. The app's `/brews`, `/roasters`, `/cultivars`, etc. continue to read from the same DB.
- Multi-user / multi-tenant. Single API key, single user.
- Real-time push from app → Claude.ai. Claude.ai pulls on demand (resource fetch); no server-push.
- Conflict resolution beyond "Claude Code arbitrates sequentially." No CRDT, no auto-merge, no diff-merge UI.
- Brewing prompt v9 rewrite (defaults too narrow per Chris's audio note). Bundled into 2.7 as a content sprint after the MCP plumbing lands.

---

## MCP server architecture

### Hosting

HTTP transport on Next.js API routes under `/api/mcp/*`. Single server instance per Vercel deployment. Stateless request handling — each MCP call is a self-contained HTTP request, no long-lived session needed. The taxonomies and recent brews are cheap to re-fetch per request; doc files are read from filesystem (cached by Vercel's runtime if hot).

**Why not a separate process / Railway / Fly:**
- Vercel auto-deploys propagate doc edits in 30-60s, which matches Chris's batched arbitration cadence (queue proposals across sessions, process in one Claude Code session, deploy once).
- Co-located with the app's existing Supabase client + auth surface — no duplicated config.
- Reuses the existing `@/lib/supabase/server` client + canonical registries directly.

**Risk to validate in 2.3:** MCP HTTP transport behavior on Vercel serverless cold-start. If cold-start latency is unacceptable, the fallback is Edge Functions (faster cold-start, more limited runtime). Document at end of 2.3.

### Authentication

```
GET /api/mcp/list_resources
Authorization: Bearer <ANTHROPIC_LATENT_SYNC_KEY>
```

- Key generated once via Supabase admin SQL: `INSERT INTO api_keys (key_hash, user_id, label) VALUES (...)`.
- Stored in Claude.ai project's MCP config (same env-var slot as other MCP servers Chris uses).
- Server validates against `api_keys` table, resolves to `user_id`, all queries scoped to that user via RLS.
- Rotation: invalidate row, generate new, paste into Claude.ai project config.
- No OAuth, no refresh tokens. Friction is one paste per rotation; Chris can rotate manually when he wants to.

### MCP Resources (read-only, browseable)

MCP Resources are content endpoints Claude.ai can list and fetch. Each Resource has a URI; URI templates allow parameterized fetches.

| URI | Returns | Source |
|---|---|---|
| `canonicals://{axis}` | JSON registry for one axis (e.g. `cultivars`, `terroirs`, `processes`, `roasters`, `producers`, `brewers`, `filters`, `flavors`, `roast-levels`, `grinders`, `extraction-strategies`, `modifiers`) | `lib/{axis}-registry.ts` exports |
| `docs://brewing.md` | `BREWING.md` text | Repo file via `fs.readFileSync` |
| `docs://roasting.md` | `ROASTING.md` text (created in 2.5) | Repo file |
| `docs://roaster/{slug}` | Per-roaster lessons doc — TBD whether this is a section of `BREWING.md` or its own file (decided in 2.4) | Repo file |
| `brews://recent?n=20` | Last N resolved brews as JSON: id, roaster, coffee_name, terroir, cultivar, process, extraction_strategy, modifiers, flavors, structure_tags, what_i_learned | Supabase query |
| `brews://by-id/{uuid}` | One brew, full record | Supabase query |
| `roasts://by-bean/{green_bean_id}` | All roasts + cuppings + experiments for one bean (created in 2.5) | Supabase query |

Claude.ai project's session start fetches `canonicals://` for each axis it needs + `docs://brewing.md` for context. Recent brews are pulled on demand when iterating a new coffee (e.g., "find prior yeast-inoculated naturals" → fetch `brews://recent?strategy=balanced&process_modifier=anaerobic`).

### MCP Tools (write actions)

Five Tools. Hybrid granularity per Chris's deferred-to-me call: fat tools for the hot path, one polymorphic tool for proposals.

#### `push_brew`

Direct write. Server validates payload against canonicals; if valid, inserts into `brews` and returns `brew_id`. If invalid, returns 422 with field-level errors (Claude.ai retries with corrections).

```ts
push_brew({
  // Identity (Tier 1 strict canonicals via lookups)
  roaster: string,                  // canonical roaster
  coffee_name: string,
  producer: string | null,          // canonical OR override (allowOverride pattern)
  producer_override?: boolean,      // true if producer not in registry
  
  // Origin (FK targets — server resolves via findOrCreateTerroir/Cultivar)
  terroir: { country: string, macro: string, meso?: string },
  cultivar: string,                 // canonical cultivar; aliases resolve
  
  // Process (composable, all canonical)
  process: {
    base: 'Washed' | 'Honey' | 'Natural' | 'Wet-hulled',
    subprocess?: string,            // Honey color tier
    fermentation_modifiers?: string[],
    drying_modifiers?: string[],
    intervention_modifiers?: string[],
    experimental_modifiers?: string[],
    decaf_modifier?: string,
    signature_method?: string,
  },
  
  // Roast
  roast_level: string,              // canonical bucket
  
  // Recipe (canonicals where applicable)
  brewer: string,                   // canonical OR override
  brewer_override?: boolean,
  filter: string,                   // canonical OR override
  filter_override?: boolean,
  grinder: string,                  // canonical OR override
  grinder_override?: boolean,
  grind_setting: string | number,   // strict against grinder.validSettings
  dose_g: number,
  water_g: number,
  ratio?: string,
  temp_c: number,
  bloom?: string,
  pour_structure?: string,
  total_time?: string,
  
  // Extraction (canonical strategy + canonical modifiers jsonb)
  extraction_strategy: 'Suppression' | 'Clarity-First' | 'Balanced Intensity' | 'Full Expression' | 'Extraction Push',
  extraction_confirmed?: string,
  modifiers?: Array<{
    type: 'output_selection' | 'inverted_temperature_staging' | 'aroma_capture' | 'immersion',
    // type-specific subfields
    [k: string]: any,
  }>,
  
  // Tasting (canonical flavor chips + structure tags + free-text prose)
  flavors: Array<{ base: string, modifiers: string[] }>,
  structure_tags: string[],         // "Axis:Descriptor" keys
  aroma?: string,
  attack?: string,
  mid_palate?: string,
  body?: string,
  finish?: string,
  temperature_evolution?: string,
  peak_expression?: string,
  what_i_learned?: string,
  
  // Optional
  is_process_dominant?: boolean,
  classification?: string,          // lot code + roast date stash, until schema add
  source?: 'purchased' | 'self-roasted',  // defaults purchased; self-roasted in 2.5+
  green_bean_id?: string,           // self-roasted only
  allow_dup?: boolean,              // for legitimate same-name different-lot
}) → { brew_id: string, created_terroir?: bool, created_cultivar?: bool }
```

Server-side validation pipeline (reuses existing `lib/brew-import.ts` `persistBrew`):
- `cleanFlavors` + `cleanStructureTags` (rule-of-2 helpers, already extracted in Sprint 1g)
- `cleanModifiers` (rule from Sprint Extraction Strategy v2)
- `structuredProcessColumns` + `isProcessResolvable` (Sprint 1e.3)
- `findOrCreateTerroir` + `findOrCreateCultivar` (Sprint 1d.3 / 1i)
- `validateCanonicalText` for roaster / producer / brewer / filter / grinder / grind setting / roast level (Sprint 1f extraction)
- Override flags (`*_override: true`) bypass `isCanonical` for the corresponding lookup; verbatim string persisted; queued for follow-up research routine if `producer_override`
- Dedup check on `(user_id, roaster, lower(coffee_name))` unless `allow_dup: true`

#### `push_roast`

Direct write per roast (built in 2.5). Sketch:

```ts
push_roast({
  green_bean_id: string,
  batch_id: string,
  roast_date: string,
  experiment_id?: string,           // FK to experiments
  charge_temp: number,
  drop_temp: number,
  fc_temp: number,
  fc_time: string,
  drop_time: string,
  development_time: string,
  agtron?: number,                  // CM200 reading
  weight_loss_pct?: number,
  charge_mass: number,
  end_mass?: number,
  rise_rate_at_fc?: number,
  notes?: string,
  is_reference?: boolean,
  profile_link?: string,            // Roest URL
  // ... full 22-field roast schema
}) → { roast_id: string }
```

#### `push_cupping`

Direct write per cupping (2.5). FK to roast.

```ts
push_cupping({
  roast_id: string,
  cupping_date: string,
  protocol?: string,                // pour-over verification protocol
  flavors: Array<{ base, modifiers }>,
  structure_tags: string[],
  notes?: string,
  cup_score?: number,
}) → { cupping_id: string }
```

#### `push_experiment`

Direct write per experiment (2.5). 22-field experiment schema; populated end-of-experiment after roast 3 of 3 lands.

#### `propose_doc_changes`

The ONE write tool for prose. Polymorphic on `target_doc`. Claude.ai writes a proposal; Claude Code arbitrates.

```ts
propose_doc_changes({
  target_doc: 'brewing.md' | 'roasting.md' | 'roaster/picolot' | 'roaster/{slug}',
  source: { kind: 'brew' | 'roast' | 'cupping' | 'session', id?: string },
  citations: Array<{
    section_anchor: string,         // e.g. "Coffees That Needed Balanced Intensity"
    line_range?: [number, number],  // optional, target file line numbers
    current_text?: string,          // optional, what's there now (for context)
    proposed_text: string,          // what to add or replace with
    operation: 'append' | 'replace' | 'prepend',
    rationale: string,              // why this change, free-text
  }>,
  summary: string,                  // one-line summary of what this proposal does
}) → { proposal_id: string, status: 'pending' }
```

Schema:

```sql
CREATE TABLE doc_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  target_doc text NOT NULL,
  source jsonb NOT NULL,            -- { kind, id }
  citations jsonb NOT NULL,         -- array of { section_anchor, line_range, current_text, proposed_text, operation, rationale }
  summary text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'applied', 'rejected', 'superseded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  applied_at timestamptz,
  applied_by_session text,          -- claude code session id, for audit
  notes text                        -- arbiter's note when rejecting/applying
);

CREATE INDEX doc_proposals_pending ON doc_proposals (user_id, target_doc, created_at)
  WHERE status = 'pending';
```

**Arbiter workflow (Claude Code session, batched):**

1. Chris opens a Claude Code session, says "process pending doc proposals."
2. Claude Code reads `SELECT * FROM doc_proposals WHERE status='pending' ORDER BY target_doc, created_at`.
3. Groups by `target_doc`. For each group:
   - Reads the actual file (`BREWING.md` etc.).
   - For each proposal, locates the section_anchor in the file, evaluates the citation (does the current file state match `current_text`? Is `proposed_text` already present? Does the rationale make sense?).
   - Presents to Chris: summary + diff + rationale + `[apply / reject / edit]`.
   - On `apply`: edits the file in repo, marks proposal `status='applied'`, records `applied_at`.
   - On `reject`: marks `status='rejected'` with note.
   - On `edit`: Chris dictates the actual change; Claude Code applies the edited form and marks proposal applied with note.
4. After processing the batch: commit + push + PR + squash-merge per Chris's standard pattern. Vercel auto-deploys; Claude.ai's next session pulls fresh BREWING.md.

**No proposal-state UI in app.** Chris's framing was explicit: "I don't have to worry about proposals, saving state, merging diffs." The /sync UI option from Round 2 was rejected; the DB queue + Claude Code arbiter is the entire write path for prose.

**Auto-supersede:** if a new proposal targets the same `(target_doc, section_anchor)` as a pending one, mark the older `status='superseded'` (don't apply both). Avoids stale citations from earlier sessions clobbering newer thinking.

---

## Doc storage model

### Source of truth

- `BREWING.md` lives at repo root (existing location).
- `ROASTING.md` lives at repo root (created in 2.5).
- Per-roaster lessons: TBD in 2.4 whether they're a section of `BREWING.md` or separate files at `docs/roasters/{slug}.md`. Default plan is sectioned-within-BREWING.md (matches existing § Roaster Reference structure); flip to per-file if the docs grow large.

### How Claude.ai sees them

- MCP Resource fetch: `docs://brewing.md` returns the live file text.
- Section anchoring: the file uses `## Section Name` markdown headers; the MCP server parses headers into a `sections` map and exposes them as resource metadata. Claude.ai can request `docs://brewing.md#Coffees%20That%20Needed%20Balanced%20Intensity` to pull just one section (avoids loading the full 1000+-line doc when only one section is relevant).
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
   ├─→ "process pending doc proposals"
   │      │
   │      └─→ SELECT FROM doc_proposals WHERE status='pending'
   │             │
   │             └─→ Claude Code applies citations to BREWING.md
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
- Vercel's auto-deploy cadence (30-60s) matches Chris's batched arbitration (he aggregates across sessions, processes in one go).
- Lower infra: no `docs` table, no per-write commit machinery, no merge-conflict resolution between live DB writes and git history.

### Why DB queue (not git-tracked proposals)

- Claude.ai shouldn't have git write access; auth surface is different (MCP API key vs git push permissions).
- A DB row is a structured record (queryable, indexable, statusable) where a git-committed proposal file would be a flat artifact.
- Chris can review pending count from the app: `SELECT count(*) FROM doc_proposals WHERE status='pending'`. That's a one-line check; a git-tracked alternative would require a `find docs/proposals/*.md` sweep.

---

## Conflict resolution / two-store reconciliation

Sprint 2.1 surfaced that `BREWING.md` sometimes leads the DB: Claude.ai writes prose during iteration (before the brew row lands at "log it"). V2 reconciles this:

**Two-store identities:**
- DB: `brews` row keyed on `(user_id, roaster, lower(coffee_name))`.
- BREWING.md: prose sections keyed on `## Section Name` headers + free-text body.

**No primary/replica.** Both stores can be written independently. The proposal queue ensures that BREWING.md edits are sequential (Claude Code applies one at a time per batch), so there's no merge-conflict scenario in the prose path. The DB is independently consistent via Postgres ACID.

**Cross-store linking:** brews can reference BREWING.md sections via section anchor strings (e.g., `brews.what_i_learned` may say "see § Coffees That Needed Full Expression"). Not enforced by FK; just narrative pointer. BREWING.md sections can list `brew_id` references (added by propose_doc_changes when relevant).

**Drift policy:** if a doc edit conflicts with what's now in DB (e.g., a BREWING.md "Coffees That Confirmed Clarity-First" mentions a brew that's since been reclassified to Suppression in DB), Claude Code surfaces this during arbiter review and asks Chris to resolve.

**No CRDT, no auto-merge.** Sequential application + arbiter judgment. Frequency of conflicts expected to be low (Chris is the only writer; iterations are coffee-by-coffee).

---

## Net-new producer flow

Chris's audio: producers won't ever be 100% comprehensive; AI-assisted research at sync time is OK as background; don't block Claude.ai when a new producer appears.

**Push path (Claude.ai → app):**

1. Claude.ai detects producer not in registry. Sets `producer_override: true`, passes verbatim string.
2. Server-side `push_brew`: stores producer text, marks the brew row's `producer_canonical: false` (new column added in 2.3 if needed; today's `allowOverride` pattern stores verbatim without flagging).
3. Server inserts a row in `producer_overrides_queue` (new table in 2.3):
   ```sql
   CREATE TABLE producer_overrides_queue (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id uuid NOT NULL,
     producer_name text NOT NULL,
     first_seen_brew_id uuid REFERENCES brews(id),
     status text NOT NULL DEFAULT 'pending'
       CHECK (status IN ('pending', 'researched', 'rejected')),
     researched_payload jsonb,        -- proposed ProducerEntry from research routine
     created_at timestamptz DEFAULT now()
   );
   ```

**Research routine (Sprint 2.6):**

A scheduled or on-demand Claude Code session (could be a cron, could be invoked manually) sweeps the queue:

1. `SELECT * FROM producer_overrides_queue WHERE status='pending'`.
2. For each: web-research (Anthropic SDK + WebSearch tool) — find producer's region, farming model, cultivars, processing style, references. Build a `ProducerEntry`.
3. `UPDATE producer_overrides_queue SET status='researched', researched_payload = ...`.
4. Generate a `propose_doc_changes` row targeting `lib/producer-registry.ts` + `docs/taxonomies/producers.md` with the new entry as proposed_text.
5. On next arbiter session, Chris reviews + applies → commits → deploys → next push_brew with that producer hits the canonical lookup cleanly.

**Same pattern for net-new cultivars** (rare; registry is ~comprehensive) and **net-new roasters** (occasional). All flow through `*_overrides_queue` tables; same research routine architecture applies.

**Why not real-time research:** Chris's audio explicitly: "I don't want Claude.ai to be stuck waiting on me." Backgrounding the research preserves Claude.ai velocity. The brew lands with `producer_override=true`; the canonical entry catches up later.

---

## Build sprint queue (2.3 — 2.7)

Each sprint is intended to be ship-able independently. 2.3 unlocks the rest. The rest are loosely sequenceable but 2.4 should follow 2.3 directly to validate the read+write loop end-to-end before roasting (2.5) widens scope.

### Sprint 2.3 — MCP scaffold + push_brew + read Resources

**Scope:**
- Wire `@modelcontextprotocol/sdk` into Next.js. `app/api/mcp/[...path]/route.ts` (or equivalent).
- API key auth: `api_keys` table + middleware + Bearer-token resolution to `user_id`.
- Resource list: `canonicals://{axis}` for all 12 axes, `brews://recent`, `brews://by-id/{uuid}`, `docs://brewing.md` (read-only — write tooling lands in 2.4).
- Tool: `push_brew` (full payload validation against canonicals, FK resolves, dedup check, 201 with `brew_id`).
- Validate: register MCP server in Claude.ai "Coffee Brewing" project; run end-to-end push of one real backlog brew. Mirror Sprint 2.1 dog-food cadence — not a synthetic test.

**Substrate gaps that may surface:** MCP HTTP behavior on Vercel cold-start (validate then; switch to Edge Functions if needed). Brewer canonicalize() paren-strip (already logged; fix in same sprint if it bites). LABEL_ALIASES post-F2 fields (less relevant once paste is gone but still worth fixing if encountered).

**Estimate:** ~3-4 hours. Scaffold + push_brew + dog-food validation.

### Sprint 2.4 — propose_doc_changes + arbiter playbook + sectioned doc reads

**Scope:**
- Tool: `propose_doc_changes` + `doc_proposals` table.
- MCP Resource enrichment: section-anchor parsing for `docs://brewing.md` so Claude.ai can fetch a single section by anchor (avoids loading 1000+-line file when irrelevant).
- Arbiter playbook: a section in this doc (or a sibling `ARBITER.md`) that future Claude Code sessions follow when Chris says "process pending doc proposals." Includes the diff-presentation pattern, supersede logic, batch commit flow.
- Validate: Claude.ai writes one BREWING.md proposal during a brew log session. Claude Code arbitrates in a follow-up session, applies, commits, merges. Verify next Claude.ai session pulls the updated file.

**Substrate decisions:** roaster lessons format — section-of-BREWING.md vs `docs/roasters/{slug}.md`. Default to section-of-BREWING.md; revisit if it grows past ~5000 lines.

**Estimate:** ~3 hours. Tool + table + arbiter doc + dog-food.

### Sprint 2.5 — Roasting MCP tools + ROASTING.md

**Scope:**
- Tools: `push_roast`, `push_cupping`, `push_experiment`. Schemas mirror existing `roasts` / `cuppings` / `experiments` tables.
- Resource: `roasts://by-bean/{green_bean_id}` returns full roast history + cuppings + experiments.
- New repo file: `ROASTING.md` (initial scaffold; per Chris's audio less authored than BREWING.md, can start light).
- Resource: `docs://roasting.md`.
- Self-roasted brew sync: extend `push_brew` to accept `green_bean_id` + `source: 'self-roasted'`. Validate against an in-progress green bean iteration.
- Validate: dog-food a roast cycle for an active green bean (Mandela XO or Sudan Rume Hybrid Washed if landing per timeline). Per-roast push, mid-iteration cupping push, end-of-bean lessons proposal.

**Substrate decisions:** roasting taxonomy expansion — Chris's audio suggests roast schema is mostly there but per-bean lessons compile may want a structured shape (currently free-text in `green_beans.roast_learnings`). Leave free-text for V2; revisit if patterns emerge.

**Estimate:** ~4 hours. Wider scope than 2.3/2.4; touches multiple tables.

### Sprint 2.6 — Producer research routine + override-queue cleanup

**Scope:**
- `producer_overrides_queue` table + populate trigger from `push_brew` overrides.
- Claude Code session pattern: `process_producer_research.md` playbook. Sweep queue, web-research each, generate `propose_doc_changes` for `lib/producer-registry.ts` + `docs/taxonomies/producers.md`.
- Optional: schedule via `mcp__scheduled-tasks__create_scheduled_task` for periodic auto-sweep (weekly).
- Same pattern available for `cultivar_overrides_queue` + `roaster_overrides_queue` if/when those entries appear.
- Validate: push a brew with a known-net-new producer; trigger research; see proposal land; arbitrate in next session; verify subsequent push_brew with that producer hits canonical lookup.

**Estimate:** ~3 hours. Mostly new playbook authoring + one new table.

### Sprint 2.7 — Brewing prompt v9 + register MCP server in Coffee Brewing project

**Scope:**
- Update `Brewing v8.4.md` (in `~/Documents/brewing-reference-artifacts/`) to v9:
  - Replace "consult these uploaded taxonomy docs" with "fetch from MCP `canonicals://`" (since the project now has live access).
  - Broaden default brewer recommendations (per Chris's audio: don't gravitate to same brewer at home).
  - Broaden default extraction strategy axis (per Chris's audio: don't always default to one of Clarity / Balanced / Full; consider Suppression, Push, immersion-modifier, Hario Switch staged-immersion).
  - Add reframe: "this is for brewer-championship style, not cafe-repeatable; push extreme axes; experiment with under-explored combinations."
- Register the MCP server in Claude.ai "Coffee Brewing" project config.
- Validate: Chris runs his next brew iteration entirely against the V2 stack — no manual upload of taxonomies, no copy-paste at "log it" moment.

**Estimate:** ~2 hours. Mostly content work + project config.

### Why this order

1. **2.3 first** — proves the write path end-to-end with one brew. Lowest risk to validate; unblocks everything else. If MCP HTTP transport doesn't work on Vercel, we discover it here, not three sprints in.
2. **2.4 next** — propose_doc_changes is the second leg of the bidirectional sync; without it, BREWING.md still drifts (Claude.ai can read but can't propose updates). 2.4 closes the loop on the brewing flow before roasting widens scope.
3. **2.5 follows brewing path** — roasting reuses the same MCP scaffold, auth, and arbiter pattern; just adds new tools + resources. Per Chris's framing, build brewing first.
4. **2.6 polishes long tail** — producer overrides queue accumulates as 2.3 + 2.5 push real brews; 2.6 catches up the canonical-research backlog. Independent of 2.5.
5. **2.7 ships UX once everything's behind it** — the brewing prompt rewrite assumes the MCP server is live and registered. Doing it earlier means re-rewriting the prompt later.

---

## Open questions

These are not blocking 2.3 but should resolve during the build queue.

1. **MCP HTTP transport on Vercel cold-start.** Validate in 2.3. Fallback: Edge Functions or dedicated MCP host (Railway/Fly).
2. **Section-anchor matching robustness** — when Claude.ai's proposal cites `## Coffees That Needed Balanced Intensity`, the arbiter's file-edit logic needs to find that section anchor. If anchors drift (Chris renames a section), proposals against the old anchor become orphaned. Mitigation: `superseded` status when arbiter can't find the anchor; surface to Chris for manual resolution.
3. **Per-roaster lessons doc model** — sectioned in BREWING.md vs `docs/roasters/{slug}.md`. Decide in 2.4 based on existing § Roaster Reference structure.
4. **Producer research routine cadence** — daily cron, weekly cron, on-demand only? Default to on-demand (Chris invokes when he wants it); add scheduled-tasks integration in 2.6 if backlog accumulates.
5. **`extraction_confirmed` semantic drift** — flagged in Extraction Strategy v2 retro, still untouched. Not blocking; revisit before 2.7 (the prompt rewrite is a natural moment to re-spec the field).
6. **Brewing prompt v9 scope** — content sprint, not engineering. Chris drives. May expand into a separate retro doc.

---

## What's NOT in scope

(Restated from § Scope, with rationale.)

- **Self-roasted brews via Claude.ai pre-2.5.** Continue through `/add` until roasting flow validated. Chris's standing rule: upload-on-resolution.
- **App UI changes.** V2 is API/MCP. Existing `/brews`, `/roasters`, `/cultivars`, `/processes`, `/terroirs`, `/cultivars` keep their current read paths — they read from the same `brews` table.
- **Multi-user.** Single Chris-tenant. API key gates everything.
- **Real-time push from app → Claude.ai.** Claude.ai pulls on demand. No server-push, no webhooks.
- **CRDT / auto-merge / diff-merge UI.** Sequential arbiter application is the conflict resolution. Out of scope to over-engineer for a single-writer system.
- **Brewing prompt v9 in 2.3.** Bundled into 2.7 after the MCP plumbing lands.

---

## Logged follow-ups (from Sprint 2.1, queued for 2.3-2.6)

| # | Follow-up | Sprint to land |
|---|---|---|
| 1 | Panama macro collapse — Boquete Slopes → Volcán Barú Highlands; Santa Clara stays | Anytime; tiny pure-registry edit |
| 2 | Brewer canonicalize() paren-strip — recipe detail in equipment field defeats alias match | 2.3 if it bites; otherwise 2.6 |
| 3 | SYNC LABEL_ALIASES post-F2 fields | Less relevant post-V2 (paste path deprecates); fix only if V1 still in use |
| 4 | Add Janson Farms to `docs/taxonomies/producers.md` | Tiny; bundle with next producer registry edit |
| 5 | extraction_confirmed semantic drift | Revisit in 2.7 prompt rewrite |
| 6 | CANONICALS.md sibling doc — possibly moot once MCP serves canonicals live | Confirmed moot post-2.3; delete from queue |

---

## Substrate state at sprint start

- 57 brews in DB (Picolot Emerald + Janson Green-Tip Gesha most recent).
- 8 canonical registries fully adopted, every `/add` field validates (12 axes counting extraction_strategy + modifiers).
- 4 modifier types canonical (`output_selection`, `inverted_temperature_staging`, `aroma_capture`, `immersion`).
- `cleanFlavors` / `cleanStructureTags` / `cleanModifiers` / `structuredProcessColumns` / `isProcessResolvable` extracted as shared helpers.
- `validateCanonicalText` + `isOverridableValid` extracted (rule-of-5 / rule-of-10 from Sprint 1f).
- `findOrCreateTerroir` / `findOrCreateCultivar` + 5 text-only `findOrCreate*` (roaster / producer / grinder / brewer / filter) all live in `lib/brew-import.ts`.

V2 build sprints reuse all of the above. The MCP push_brew handler is essentially `persistBrew` wrapped in HTTP + auth + MCP framing.

---

## Pointers

- V1 paste-driven playbook (still operational): [SYNC.md](SYNC.md)
- Active sprint queue: [PRODUCT.md § Active Sprint Queue](PRODUCT.md#active-sprint-queue)
- BMR (driving prompt for Coffee Brewing project): [BREWING.md](BREWING.md)
- Per-axis canonical sources: [docs/taxonomies/](docs/taxonomies/)
- MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- MCP HTTP transport spec: https://modelcontextprotocol.io/docs/concepts/transports

---

## Sprint 2.2 retro (this sprint)

Brainstorm sprint, not build. Five architectural decisions locked + four deferred-to-me, all converged on a coherent design in two AskUserQuestion rounds. Chris's audio-note input was load-bearing — the "Claude Code as arbiter for prose" framing reshaped the write trust model from a per-resource staging table (heavier) to a single polymorphic `propose_doc_changes` tool + DB queue (lean). The "BREWING.md should live in the app" framing stayed conceptually simple because Chris's batched arbitration cadence matches Vercel auto-deploy timing — no live-DB-backed-doc machinery required.

Build queue ships brewing-first per Chris's preference; roasting designed in same doc to keep the MCP surface coherent.

First build sprint: **2.3 — MCP scaffold + push_brew + read Resources**. Self-contained, ~3-4 hour estimate, validates the write path end-to-end with one real backlog brew.
