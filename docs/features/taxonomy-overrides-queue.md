# Taxonomy Overrides Queue (Phase 3)

**Status:** Design doc. Implementation ships in a follow-on PR after Chris's review.
**Sprint:** Phase 3 of the post-2.7 cleanup (architectural). Phases 1 + 2 shipped in [#100](https://github.com/chrismccann-dev/latent-coffee/pull/100) + [#101](https://github.com/chrismccann-dev/latent-coffee/pull/101) + [#102](https://github.com/chrismccann-dev/latent-coffee/pull/102).
**Closes:** Cluster E from `feedback_v2_mcp_feedback_log.md` Batch 18 — #R41 (queue table) + #R47 (response echo) + #R73 (re-resolution surface) + #R74 (provenance column) + #R75 (`propose_canonical_addition` Tool).

---

## Goal

Turn canonical promotion from a manual registry edit into a queueable workflow. Today, `*_override:true` flags persist a verbatim string but leave no audit trail; net-new producers / roasters / brewers / filters / grinders accumulate silently in the brews table with no path to canonical promotion. After Phase 3, every override path inserts a row in `taxonomy_overrides_queue`, every push response echoes which entries queued, and a unified arbiter playbook walks both `doc_proposals` (prose) and `taxonomy_overrides_queue` (canonicals) in one session.

The big-ticket framing: Phase 3 makes `taxonomy_overrides_queue` the canonical-side analog of `doc_proposals`. Same shape, same arbiter. One Chris-as-arbiter session covers both.

## Non-goals

- **Soften strict-canonical for terroir + cultivar.** These stay strict. The queue covers the 6 text-only override axes (roaster / producer / brewer / filter / grinder + signature_method, the 6th added Sprint 12 / MCP-1 2026-05-21). Net-new terroirs/cultivars route through `propose_canonical_addition` (model-callable) — there is no `terroir_override` / `cultivar_override` flag.
- **Auto-edit `lib/{axis}-registry.ts` from the MCP server.** Promotion to canonical is a registry edit done during an arbiter session; the `resolve_queue_entry` Tool just records the decision. Mirrors `propose_doc_changes` → ARBITER.md flow.
- **Surface drift items beyond canonical-promotion.** Bean 6's wrong-region case lands as a one-off migration patch, not a queue row. The queue is scoped to canonical-promotion in v1; a future "data-correction" submission_path can be added if drift items start accumulating.
- **In-app review surface.** Chris-as-arbiter via Claude Code session. No new app page.

---

## Locked design decisions

10-point design pass converged with Chris on 2026-05-05. Decisions (D1–D10):

| # | Decision | Resolution |
|---|---|---|
| D1 | Queue table shape | `taxonomy_overrides_queue` — single table, all axes share one shape. Minimal sufficient info; arbiter fills the rest. |
| D2 | Hook locations | Override path only (5 text-only `findOrCreate*` helpers). Auto-created FK rows from canonical input do NOT queue. |
| D3 | Strict-canonical softening | Terroir + cultivar stay strict. No `terroir_override` / `cultivar_override` flags. Net-new lands via `propose_canonical_addition`. |
| D4 | Tool surface | 3 new Tools: `list_taxonomy_queue` / `propose_canonical_addition` / `resolve_queue_entry`. Tool count 26 → 29. |
| D5 | Provenance columns | `terroir_provenance` + `cultivar_provenance` enum on `green_beans` + `brews`. Values: `'canonical' \| 'auto_created'`. |
| D6 | Re-resolution surface | `green_beans.canonicals_updated_at` timestamp. Brews skipped — drift detection not yet a need on the brew side. |
| D7 | Backfill | All existing `*_override = true` brew rows → queue rows at migration time. 3 inline data fixes (Bean 6 + 2 CGLE). |
| D8 | Bean 6 + 2 CGLE | Migration patches; not queue items (canonical was always available, the wrong-canonical was a sync-time mistake). |
| D9 | Response echo | Ship in Phase 3, kept tight. New field: `queued_for_taxonomy_review`. Existing `created_with_overrides` retained. |
| D10 | UX for resolution | Unified arbiter playbook walks both queues. New section in ARBITER.md. |

---

## Data model

### Table: `taxonomy_overrides_queue`

```sql
CREATE TABLE taxonomy_overrides_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- WHICH axis the entry is for. Sprint 12 / MCP-1 (2026-05-21, migration 063)
  -- widened the enum to 8 by adding 'signature_method'.
  axis text NOT NULL CHECK (axis IN (
    'producer', 'roaster', 'brewer', 'filter', 'grinder',
    'terroir', 'cultivar', 'signature_method'
  )),

  -- WHAT was submitted (canonical lookup didn't resolve, so this is verbatim)
  raw_value text NOT NULL,

  -- HOW it landed in the queue (for triage + analytics)
  submission_path text NOT NULL CHECK (submission_path IN (
    'override_flag',     -- *_override:true flag was set on push_brew/push_green_bean/push_roast
    'manual_propose'     -- model called propose_canonical_addition explicitly
  )),

  -- WHERE it came from (audit trail; SET NULL on delete preserves the row)
  source_kind text CHECK (source_kind IN ('brew', 'green_bean', 'roast', 'manual')),
  source_id uuid,
  -- No FK constraint — source_id can point to any of brews/green_beans/roasts.
  -- source_kind disambiguates. SET NULL via cleanup migration if the source row is deleted.

  -- WHAT it resolved to once arbitrated
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',           -- awaiting arbiter
    'promoted',          -- new entry added to lib/{axis}-registry.ts (registry edit lands separately)
    'aliased',           -- mapped to existing canonical via alias map
    'rejected',          -- drift / typo / not actually new
    'duplicate'          -- collapsed to another pending row for the same raw_value
  )),
  canonical_target text,    -- when status='promoted' or 'aliased', the canonical this resolves to
  evidence jsonb,           -- free-form context the submitter supplied (URLs, prose, tier, etc.)
  arbiter_notes text,       -- prose from Chris/CC at resolution time

  -- Timestamps
  submitted_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,

  -- One pending row per (user, axis, raw_value) — second push of the same
  -- net-new producer surfaces as duplicate via auto-collapse logic, not a
  -- second queue row. Mirrors propose_doc_changes auto-supersede.
  CONSTRAINT taxonomy_overrides_unique_pending
    EXCLUDE (user_id WITH =, axis WITH =, lower(raw_value) WITH =)
    WHERE (status = 'pending')
);

CREATE INDEX idx_taxonomy_overrides_pending ON taxonomy_overrides_queue (user_id, status, axis) WHERE status = 'pending';
CREATE INDEX idx_taxonomy_overrides_source ON taxonomy_overrides_queue (source_kind, source_id);

ALTER TABLE taxonomy_overrides_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY taxonomy_overrides_queue_owner ON taxonomy_overrides_queue
  FOR ALL USING (user_id = auth.uid());
```

**Why a single table across all 8 axes:** uniform Tool surface (`list_taxonomy_queue` doesn't need 8 different shapes) and uniform arbiter playbook (one routine handles all axes). The `axis` discriminator is enough. **Sprint 12 / MCP-1 (2026-05-21, migration 063)** widened the enum from 7 to 8 by adding `signature_method` (Chris-locked 2026-05-15 during MCP grilling; net-new proprietary processes — Alchemy, TIM, Enzyflow, etc. — now flow through the queue rather than failing fast).

**Why `EXCLUDE` not `UNIQUE`:** allow multiple resolved rows for the same `(user, axis, raw_value)` — if a producer was rejected once and surfaced again later, that's two distinct decisions to record. Only the pending row needs to be unique.

**Why no FK on `source_id`:** the column refers to one of three tables (brews / green_beans / roasts). A single FK can't span all three. Nullable + indexed; cleanup happens via migration on row delete.

### Provenance columns (D5)

```sql
ALTER TABLE green_beans ADD COLUMN terroir_provenance text DEFAULT 'canonical'
  CHECK (terroir_provenance IN ('canonical', 'auto_created'));
ALTER TABLE green_beans ADD COLUMN cultivar_provenance text DEFAULT 'canonical'
  CHECK (cultivar_provenance IN ('canonical', 'auto_created'));
ALTER TABLE green_beans ADD COLUMN canonicals_updated_at timestamptz;

ALTER TABLE brews ADD COLUMN terroir_provenance text DEFAULT 'canonical'
  CHECK (terroir_provenance IN ('canonical', 'auto_created'));
ALTER TABLE brews ADD COLUMN cultivar_provenance text DEFAULT 'canonical'
  CHECK (cultivar_provenance IN ('canonical', 'auto_created'));
```

**Semantics:**
- `'canonical'` — clean lookup hit, FK row already existed (most common).
- `'auto_created'` — clean lookup hit, but this push materialized the FK row for the first time. Jurutungo case; useful for "show me terroirs that auto-materialized recently." Set in `findOrCreateTerroir`/`findOrCreateCultivar` when the create branch fires.

**Backfill default:** all existing rows → `'canonical'`. We do not retro-flag historical auto-creates; not load-bearing enough to justify the heuristic.

**Forward-looking only:** `canonicals_updated_at` is set whenever `terroir_id` or `cultivar_id` changes via `patch_green_bean` or future migrations that re-resolve canonicals. Backfill default: NULL.

---

## Hook insertion sites

5 sites, all in [`lib/brew-import.ts`](../../lib/brew-import.ts) and [`lib/roast-import.ts`](../../lib/roast-import.ts) (file may not exist yet for roast-side hooks; see "Roast hooks" below).

### Site A — 5 text-only `findOrCreate*` helpers (override → queue)

In [`lib/brew-import.ts:500-526`](../../lib/brew-import.ts):

```ts
export function findOrCreateRoaster(
  rawName: string | null | undefined,
  opts: { allowOverride?: boolean } = {},
): FindOrCreateRoasterResult {
  return validateCanonicalText(rawName, ROASTER_LOOKUP, 'roaster', opts)
}
```

Today: when `allowOverride: true` AND `lookup.canonicalize(trimmed)` returns null, the helper returns `{ ok: true, canonicalName: trimmed, resolved: false }`. Verbatim string passes through; nothing queued.

After Phase 3: `validateCanonicalText` gains a return field `needsQueue: boolean` (true when override was taken AND the value didn't resolve). The caller (`persistBrew` in `lib/brew-import.ts:743-751`) collects `needsQueue` results across the 5 axes and fires queue inserts after the brew row lands.

```ts
// Pseudocode in persistBrew, post-insert
const queueInserts = [
  { axis: 'roaster',  resolved: roasterResult.resolved,  raw: payload.roaster,  override: payload.roaster_override },
  { axis: 'producer', resolved: producerResult.resolved, raw: payload.producer, override: payload.producer_override },
  // ...
].filter(({ resolved, override, raw }) => override === true && resolved === false && raw)

for (const { axis, raw } of queueInserts) {
  await insertQueueRow({ axis, raw_value: raw, source_kind: 'brew', source_id: brewId, submission_path: 'override_flag' })
}
```

The queue inserts happen post-brew-insert so `source_id` resolves to a real row. If queue insert fails, brew row stays committed; we don't roll back. (Failures land in server logs; arbiter can run a manual sweep if needed.)

### Site B — `findOrCreateTerroir` / `findOrCreateCultivar` (auto-created FK rows)

In [`lib/brew-import.ts:528+`](../../lib/brew-import.ts) (terroir) and [`lib/brew-import.ts:452-493`](../../lib/brew-import.ts) (cultivar): when the create branch fires, set `terroir_provenance = 'auto_created'` (or `cultivar_provenance`) on the green_bean / brew row that triggered the create. This is a column write, not a queue insert (per D2 — auto-created FK rows from canonical input do NOT queue).

The `created` flag on `FindOrCreateResult` (already exists in [`lib/brew-import.ts:448-450`](../../lib/brew-import.ts:448)) is the signal — caller spreads `terroir_provenance: result.created ? 'auto_created' : 'canonical'` into the green_bean / brew insert.

### Site C — Roast push paths

`push_roast` in [`lib/mcp/push-roast.ts`](../../lib/mcp/push-roast.ts) doesn't use the 5 text-only `findOrCreate*` helpers directly — roasts are a child entity of green_beans (which carry the canonicals). No new hook needed. Confirmed by reviewing the `push_roast` schema; canonicals live on the parent green_bean row.

### Site D — `propose_canonical_addition` (model-callable submit)

New file `lib/mcp/propose-canonical-addition.ts`. Direct queue insert with `submission_path: 'manual_propose'` and `source_kind: 'manual'`. The model calls this when it knows ahead of time that a value won't be canonical (e.g., a fresh terroir region not yet in the registry).

For terroir + cultivar specifically: this is the only path. Strict-canonical fail-fast in `findOrCreateTerroir` / `findOrCreateCultivar` blocks the push; the model recovers by calling `propose_canonical_addition`, then waits for the arbiter to land the registry edit, then retries the push.

---

## Tool surface

### `list_taxonomy_queue`

```ts
list_taxonomy_queue({
  status?: 'pending' | 'promoted' | 'aliased' | 'rejected' | 'duplicate',  // default: 'pending'
  axis?: 'producer' | 'roaster' | 'brewer' | 'filter' | 'grinder' | 'terroir' | 'cultivar',
  since?: string,         // ISO timestamp; only entries submitted after this
  limit?: number          // default 50, max 200
}) → {
  entries: Array<{
    id: string,
    axis: string,
    raw_value: string,
    submission_path: 'override_flag' | 'manual_propose',
    source_kind: 'brew' | 'green_bean' | 'roast' | 'manual',
    source_id: string | null,
    status: string,
    canonical_target: string | null,
    evidence: Record<string, any> | null,
    arbiter_notes: string | null,
    submitted_at: string,
    resolved_at: string | null
  }>,
  total: number
}
```

Read-only. Both Chris-as-arbiter (Claude Code) and claude.ai can call it (claude.ai might want to check whether a specific producer is already pending review before re-submitting).

### `propose_canonical_addition`

```ts
propose_canonical_addition({
  axis: 'producer' | 'roaster' | 'brewer' | 'filter' | 'grinder' | 'terroir' | 'cultivar',
  value: string,                      // raw_value to queue
  evidence?: {                        // optional context
    source_url?: string,              // producer/roaster website, IG post, etc.
    notes?: string,                   // free-form prose
    tier?: 1 | 2 | 3,                 // for producers
    country?: string,                 // for terroir
    macro?: string,                   // for terroir; what macro this region falls under
    [k: string]: any
  }
}) → {
  queue_id: string,
  status: 'pending' | 'duplicate',    // 'duplicate' if same (axis, value) already pending
  duplicate_of?: string               // id of the existing pending row
}
```

Auto-collapse on duplicate: if a `(user, axis, lower(value))` row is already pending, return that id with `status: 'duplicate'` instead of creating a new row. Same shape as `propose_doc_changes` auto-supersede.

### `resolve_queue_entry`

```ts
resolve_queue_entry({
  queue_id: string,
  action: 'promoted' | 'aliased' | 'rejected' | 'duplicate',
  canonical_target?: string,          // required when action='promoted' or 'aliased'
  duplicate_of?: string,              // required when action='duplicate'
  arbiter_notes?: string
}) → {
  queue_id: string,
  status: string,
  resolved_at: string
}
```

Used by Chris-as-arbiter (Claude Code session). Just records the decision. The actual registry edit (`docs/taxonomies/{axis}.md` + `lib/{axis}-registry.ts`) happens in the same Claude Code session via `Edit` tool — the Tool just flips status + records the canonical target for the audit trail. Mirrors `propose_doc_changes` → arbiter applies → ARBITER.md flow.

**Important:** `resolve_queue_entry` does not edit registry source files. Auto-editing TS source from a Tool would require Claude Code execution context the MCP server doesn't have. The Claude Code arbiter session does the edit + the Tool call together in one transaction.

---

## Response echo (D9)

Three push Tools — `push_brew`, `push_green_bean`, `push_roast` — gain one new field:

```ts
queued_for_taxonomy_review: Array<{
  axis: string,
  raw_value: string,
  queue_id: string
}>
```

Empty array when no overrides used. Confirms the queue picked up the override without requiring a re-query.

`push_brew`'s existing `created_with_overrides` (Phase 2 #R47) stays. No other response-shape changes — keeping it tight per Q9.

`get_green_bean` gains:

```ts
canonicals_updated_at: string | null,    // timestamp of last terroir_id / cultivar_id change
terroir_provenance: 'canonical' | 'auto_created',
cultivar_provenance: 'canonical' | 'auto_created'
```

The provenance fields surface to claude.ai so it can flag "this green_bean's terroir was auto-materialized — it'll appear in the queue for review."

---

## Backfill SQL (D7)

Migration runs after the schema is in place. Single transaction.

### A. Backfill queue from existing override flags

```sql
-- Producer overrides
INSERT INTO taxonomy_overrides_queue (user_id, axis, raw_value, submission_path, source_kind, source_id, submitted_at)
SELECT user_id, 'producer', producer, 'override_flag', 'brew', id, created_at
FROM brews
WHERE producer_override = true
  AND producer IS NOT NULL;

-- Roaster overrides
INSERT INTO taxonomy_overrides_queue (...)
SELECT user_id, 'roaster', roaster, 'override_flag', 'brew', id, created_at
FROM brews WHERE roaster_override = true AND roaster IS NOT NULL;

-- Brewer / filter / grinder — same shape across 3 more axes
-- (5 INSERTs total)
```

Estimated row count: ~10-30 across all 5 axes (most overrides cluster on producer, a few on roaster from the dog-food rounds).

### B. 3 inline data fixes (Bean 6 + 2 CGLE)

These are NOT queue items — canonical was always available; the wrong-canonical was a sync-time mistake. Direct patch via the migration:

```sql
-- Bean 6 (Bukure Natural Lot 21 - Red Bourbon, green_bean 9f7e586d-0d1e-47fd-bbe0-d3792b5a1c0e)
-- Wrong: macro='Lake Kivu Highlands' (was a fallback during sync)
-- Right: country='Rwanda', admin='Northern Province', macro='Central Plateau Highlands'

-- Two CGLE beans (1cf02eb8 + 0d3212f8)
-- Wrong macro_terroir
-- Right: country='Colombia', admin='Valle del Cauca', macro='Western Andean Cordillera'
```

Approach for each: find-or-create the correct terroir row scoped to `user_id`, then UPDATE the green_bean's `terroir_id` to point at it. Bump `canonicals_updated_at = now()`. If the old terroir row becomes orphaned (no other rows reference it), leave it for a separate cleanup migration — don't auto-delete in Phase 3.

Each patch is one SQL block in the migration; ~30 lines total for all 3 fixes.

---

## Unified arbiter playbook (D10)

ARBITER.md gets a new section: **"Taxonomy queue arbitration."** Same trigger phrase as prose — Chris says **"process pending arbitration"** (or **"process pending doc proposals"** for backwards compat) and the Claude Code session walks both queues.

Diff summary:

- **Step 1** (current: "Read pending proposals" against `doc_proposals`) → expanded to also read `taxonomy_overrides_queue` where status='pending'.
- **Step 2** (current: "Group by target_doc") → for queue rows, group by `axis`. Each axis becomes one PR (one branch, one batch commit) since registry edits are per-file.
- **New step** (between current 5 + 6): **"Per queue row: locate the registry file."** Map axis → file path (e.g., `producer` → `lib/producer-registry.ts` + `docs/taxonomies/producers.md`). Read existing canonicals; surface the queue's `raw_value` + `evidence` to Chris; ask `[promote / alias / reject / duplicate]`.
- **Step 6** (current: "Apply Chris's decision") → for queue rows, the apply step is a registry edit (Edit tool) + a `resolve_queue_entry` Tool call. Both happen in one atomic step.
- **Step 7** (current: "Roll up proposal status") → simplified for queue rows; status flips per-row, not roll-up.
- **Step 8** (current: "Commit + PR + merge") → unchanged. Multi-axis batches can land in one PR; multi-doc proposals get separate PRs per current convention.

Trigger phrase aliasing: "process pending doc proposals" / "process pending arbitration" / "arbitrate" all route to the same playbook. The playbook checks both tables.

---

## Cross-system audit checklist

Per `feedback_cross_system_audit.md` standing rule. Surfaces touched by Phase 3:

- [ ] **Migration:** new table + 5 columns + 3 inline data fixes + queue backfill
- [ ] **`lib/brew-import.ts`:** 5 `findOrCreate*` queue hooks + provenance writes in `findOrCreateTerroir`/`Cultivar` + `validateCanonicalText` adds `needsQueue` field
- [ ] **`lib/mcp/push-brew.ts`:** response shape adds `queued_for_taxonomy_review`
- [ ] **`lib/mcp/push-green-bean.ts`:** same response shape addition + provenance writes
- [ ] **`lib/mcp/push-roast.ts`:** response shape addition (passthrough — roasts don't trigger queue inserts directly per Site C)
- [ ] **`lib/mcp/get-green-bean.ts`:** response gains `canonicals_updated_at` + 2 provenance fields
- [ ] **`lib/mcp/server.ts`:** register 3 new Tools
- [ ] **`lib/mcp/list-taxonomy-queue.ts`** (new) — read Tool
- [ ] **`lib/mcp/propose-canonical-addition.ts`** (new) — write Tool
- [ ] **`lib/mcp/resolve-queue-entry.ts`** (new) — write Tool
- [ ] **`lib/mcp/discoverability-check.ts`:** all 3 new Tools added to descriptor list, audit passes
- [ ] **`lib/types.ts`:** `GreenBean` type gains 3 new fields (`terroir_provenance`, `cultivar_provenance`, `canonicals_updated_at`); `Brew` type gains 2
- [ ] **`/add` page write path:** does the SR insert path need a queue echo? (Probably yes — same response shape as MCP `push_brew`. Verify.)
- [ ] **`/green/[id]` render:** surface `terroir_provenance = 'auto_created'` flag in UI? (Phase 3 v1: skip the UI — flag is queryable, not user-facing yet.)
- [ ] **`ARBITER.md`:** new "Taxonomy queue arbitration" section
- [ ] **`BREWING.md` + `ROASTING.md`:** any reference to "manual registry edit" updated to mention the queue path
- [ ] **7 prompts in `docs/prompts/`:** any STAGE referencing override flags now also mentions queue
- [ ] **`CLAUDE.md`:** Tool count 26 → 29; new section on the queue's role in the canonical pipeline
- [ ] **`SYNC_V2.md` § "Net-new producer flow":** rewrite to reflect the real queue (was speculative)
- [ ] **`npm run check:mcp`** passes for 29 Tools
- [ ] **`npx tsc --noEmit`** clean (run from main repo per build hygiene rule)

State the audit results in PR body per standing rule.

---

## Acceptance criteria

- [ ] Design doc PR (this file) merges first; Chris approves shape before implementation begins.
- [ ] Migration ships per the resolved D1 + D5 + D7 shape.
- [ ] Bean 6 + 2 CGLE inline fixes land as part of the migration's data backfill.
- [ ] Hook inserts at all 6 text-only override sites (Site A — roaster / producer / brewer / filter / grinder / signature_method post Sprint 12) + provenance writes at FK auto-create sites (Site B).
- [ ] 3 new Tools (`list_taxonomy_queue` / `resolve_queue_entry` / `propose_canonical_addition`) at `lib/mcp/`, registered in `server.ts`, passing discoverability check.
- [ ] Tool count 26 → 29 reflected in CLAUDE.md / memory references.
- [ ] `push_brew` / `push_green_bean` / `push_roast` responses echo `queued_for_taxonomy_review[]`.
- [ ] `get_green_bean` response includes `canonicals_updated_at` + 2 provenance fields.
- [ ] ARBITER.md gains the unified-playbook section.
- [ ] `tsc --noEmit` clean in main repo.
- [ ] Cross-system audit results stated in PR body.
- [ ] PR body includes a side-by-side: "old behavior (override flag, no audit) vs new behavior (override flag + queue insert + Chris arbitrates later)" so the workflow change is explicit.

---

## Test plan

- [ ] `tsc --noEmit` clean in main repo (worktree symlink trick).
- [ ] `npm run check:mcp` passes for 29 tools.
- [ ] Post-deploy: push a brew with `producer_override:true` for a net-new producer. Verify queue row inserts; verify `push_brew` response echoes `queued_for_taxonomy_review`.
- [ ] Post-deploy: call `list_taxonomy_queue({status: 'pending'})` and confirm the row surfaces.
- [ ] Post-deploy: call `propose_canonical_addition` with a fresh terroir region. Verify queue row inserts with `submission_path: 'manual_propose'` and `source_kind: 'manual'`.
- [ ] Post-deploy: re-call `propose_canonical_addition` with the same value. Verify it returns `status: 'duplicate'` with the existing `queue_id`.
- [ ] Post-deploy: walk arbiter session — call `list_taxonomy_queue`, edit a registry file, call `resolve_queue_entry` with `action: 'promoted'`. Verify status flips + canonical_target persists.
- [ ] Post-deploy: re-push the same producer without `producer_override` after promotion. Verify it now resolves canonically (no override needed; no new queue row).
- [ ] Post-deploy: verify Bean 6 + 2 CGLE green_beans have correct `terroir_id` after migration; verify `canonicals_updated_at` was bumped.

---

## Out of scope (deferred)

- **#R49** (extraction_confirmed reshape) — its own sprint. Different shape (column split, not workflow change).
- **Cluster C** (push_experiment structured failure_boundary) — structured-experiment-quality sub-sprint.
- **#R63** (structured inlet_points) — programmatic-curves bucket.
- **In-app review surface for the queue** — V2 feature. Chris-as-arbiter is sufficient through the foreseeable.
- **Provenance columns on producer/roaster/brewer/filter/grinder** — not needed; `*_override:bool` already serves the canonical-vs-override distinction. Add if drift becomes painful.
- **Data-correction queue path** — Bean 6 + 2 CGLE land as one-off migration patches in v1. If drift items start accumulating, add a `data_correction` `submission_path` value later.
- **Sweep / cron job to scan existing data for drift** — not needed for v1; Chris arbitrates as items surface.

---

## Estimated time (after design pass approves)

- Migration + backfill: ~45 min
- Hook inserts (Site A 5 sites + Site B 2 sites): ~1h
- 3 Tools + describes + discoverability: ~1.5h
- Response-shape additions + `get_green_bean` update: ~30 min
- ARBITER.md unified-playbook section: ~30 min
- Cross-system audit + PR: ~30-45 min

**Total: ~4-6h end-to-end** for the implementation PR after this design doc lands.

---

## References

- **Brief:** Phase 3 of the post-2.7 cleanup sprint (this conversation, 2026-05-05).
- **Source feedback:** `memory/feedback_v2_mcp_feedback_log.md` Batch 18 Cluster E (#R41 / #R47 / #R73 / #R74 / #R75).
- **Memory pointers consulted:** `project_post_2_7_followups.md` § item 6 + § Cluster E; `feedback_brewing_md_can_lead_db.md`; `feedback_canonical_registry_picker.md`; `feedback_cross_system_audit.md`.
- **Architectural prior art:**
  - `ARBITER.md` — prose-side arbitration playbook (mirrored here for canonicals).
  - `SYNC_V2.md` § "Asymmetric write trust" — propose-then-apply pattern established for prose, extended here to canonicals.
  - `SYNC_V2.md` § "Net-new producer flow" — speculative producer_overrides_queue from 2.2; this doc replaces with the real shape.
- **Sprint 2.2 brainstorm pattern:** design doc first (this file), then implementation in a follow-on PR after Chris's approval.
