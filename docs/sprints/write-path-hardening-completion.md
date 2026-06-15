# Completion - Write-path hardening (feedback-backlog sprint, 2026-06-15)

Execution sprint off the `plan-feedback` run over [docs/product/feedback-backlog.md](../product/feedback-backlog.md).
Three concrete write-path footguns, shipped as one flow per [CLAUDE.md § Git Discipline](../../CLAUDE.md).
Kickoff: [write-path-hardening-kickoff.md](write-path-hardening-kickoff.md).

## 1. Plan (restated so this report stands alone)

Three feedback-backlog members in one cluster:

- **#54 - `op`/`operation` citation alias.** `propose_doc_changes` accepts `op` as a
  server-side alias for `operation` on each citation.
- **#56 - push_brew FK-inherit.** When a brew is pushed with `green_bean_id`, the brew's
  `terroir_id`/`cultivar_id` bind to the green bean's canonical FKs instead of re-resolving
  from the payload (which minted divergent/orphan terroir rows).
- **#46 - patch_inventory pre-load hint.** A session-start pre-warm hint at the top of both
  close-out prompts so `patch_inventory` is warm before the single STAGE 6 archive call.

Two locked design calls (not re-litigated):

1. **#54 precedence:** if a citation supplies BOTH `op` and `operation`, explicit `operation`
   wins and `op` is dropped silently; `op` only fills `operation` when `operation` is absent.
   Implemented as `z.preprocess` on the citation object. One-line note added to the `operation`
   `.describe()`.
2. **#56 inheritance rule:** per-axis - when `green_bean_id` is supplied AND that axis's FK on the
   green-bean row is non-NULL, bind to it directly and SKIP `findOrCreate*` (no mint). When the FK
   is NULL or the green bean isn't found, FALL BACK to the payload `findOrCreate*` path for that
   axis. The purchased path (no `green_bean_id`) is unchanged. An inherited axis binds to an
   existing canonical row, so `provenance: 'canonical'`.

## 2. What shipped, per item

### #54 - `op`/`operation` alias ([lib/mcp/propose-doc-changes.ts](../../lib/mcp/propose-doc-changes.ts))

Split the former `citation = z.object({...})` into `citationFields` (the same field set, with the
`operation` enum) and `citation = z.preprocess(fn, citationFields)`. The preprocess fn normalizes a
plain-object citation: if `op` is present and `operation` is absent, it sets `operation = op` and
drops `op`; if `op` is present alongside `operation`, it drops `op` (operation wins); otherwise it
passes the value through untouched. The `z.enum(VALID_OPERATIONS)` validator is unchanged, so a
bogus `op` (e.g. `op: 'bogus'`) still rejects on the enum. Added the alias note to the `operation`
`.describe()`. **No divergence from the brief** - used `z.preprocess` (the preferred mechanism); the
optional-field-+-`.transform` fallback was not needed because `z.preprocess` keeps the published
JSON Schema clean (it emits the inner object's schema, so there's no `op` property and `operation`
keeps its `type: "string"` + enum). That is exactly why `check:mcp` stays green and the
schema-compat rewrite ([lib/mcp/schema-compat.ts](../../lib/mcp/schema-compat.ts)) has nothing new
to chew on - verified empirically (see §4).

### #56 - push_brew FK-inherit ([lib/brew-import.ts](../../lib/brew-import.ts))

Confirmed first that `persistBrew` does NOT fetch the green-bean row anywhere upstream (no
`from('green_beans')`; `green_bean_id` and `roast_id` pass straight through to the insert without
existence validation), so per the kickoff open question this needed one scoped query. Added a
userId-scoped `select('terroir_id, cultivar_id')` on `green_beans` (`.maybeSingle()`) guarded by
`payload.green_bean_id?.trim()`, ahead of the existing terroir/cultivar resolution. Each
`findOrCreate*` call is now ternary-gated: `inheritedTerroirId ? Promise.resolve(null) :
findOrCreateTerroir(...)` (same for cultivar) - so an inherited axis SKIPS the resolve entirely and
no divergent row is minted. Final id = `inheritedTerroirId ?? (payload findOrCreate id)`; provenance
= `'canonical'` for an inherited axis, `'auto_created'` only when the payload path actually minted a
fresh row. The brew still binds via `green_bean_id` + `roast_id` (unchanged). Also documented the
inherit behavior in push_brew's `green_bean_id` `.describe()`
([lib/mcp/push-brew.ts](../../lib/mcp/push-brew.ts)). **No divergence from the brief.**

### #46 - patch_inventory pre-load hint ([close-lot.md](../prompts/close-lot.md) + [one-shot-closeout.md](../prompts/one-shot-closeout.md))

Added an identical **Pre-load `patch_inventory` at session start** hint right after the "MCP
namespace" line (before STAGE 1) in both prompts, mirroring the pre-warm hint style in
[bundled-brewing-completion.md](../prompts/bundled-brewing-completion.md). The hint names
`patch_inventory`, explains it's called exactly once per lot (STAGE 6) so it's structurally never
warm, gives the `tool_search` query + the direct-invocation fallback, and notes the param is
`roest_inventory_id` (not `inventory_id`). Did NOT touch the param-name half - both prompts already
pass the correct `roest_inventory_id` at STAGE 6 (out of scope per the brief). **No divergence.**

## 3. PR + merge SHA

- **PR:** {{PR_URL}}
- **Merge commit on main:** {{MERGE_SHA}}

## 4. Verification - actual results

**Build + gates** (run in the worktree with `ln -sf ../../../node_modules node_modules` so
`@anthropic-ai/sdk` resolves; symlink removed before commit):

- `npx tsc --noEmit` - **exit 0, no errors.** The `FindOrCreateResult | null` discriminated-union
  narrowing in `persistBrew` compiles under strictNullChecks; the `z.preprocess` citation typing
  resolves (`z.infer<typeof citation>` gives the inner object's output type).
- `npm run build` - **exit 0**, full Next build compiled, all routes generated.
- `npm run check:mcp` - **exit 0**: "Published-catalog type coverage passed (no untyped properties,
  no bare unions; price_per_kg canary OK)", 35 tools registered. Confirms the `z.preprocess` did NOT
  regress the published schema.
- `npm run check:doc-links` - **exit 0**: "scanned 374 markdown files - 0 live miss(es) - 90 archive
  warning(s)", "no live-substrate dead links". The two edited prompt files added no links.

**#54 - alias logic** (zod parse harness replicating the live preprocess byte-for-byte; 6/6 pass):

- `op:'append'` (no operation) parses to `operation:'append'`; `op` absent from output.
- both `op:'replace'` + `operation:'append'` parses to `operation:'append'` (operation wins).
- `operation:'prepend'` only parses unchanged.
- `op:'bogus'` is REJECTED by the enum.
- neither `op` nor `operation` is REJECTED (operation required).
- published input JSON Schema has no `op` property; `operation` keeps `type:"string"` + enum.

**#56 - inherit-or-fallback logic** (4-scenario unit harness replicating the persistBrew branch,
grounded on a live read-only DB probe of the real Higuito lot; 8/8 assertions pass):

- Live probe: `get_green_bean(roest_inventory_id: 9132)` returned green_bean_id
  `79d0f814-8682-43ff-b6e0-6906aa8dd1a0`, `terroir_id: 56dedde9-b182-4820-9491-51b00cc922ca`,
  `cultivar_id: ddfce7fc-4595-41f9-9ee4-a788af8a792b` - the exact `56dedde9` the kickoff names, both
  FKs non-NULL. This is the Round 10 #2 lot where the old path minted divergent brew terroir
  `b3a5681e`.
- Inherit-both: brew binds to `56dedde9`/`ddfce7fc`, findOrCreate call count = 0 (the `b3a5681e`
  divergent row is NEVER minted), provenance `canonical` on both axes.
- Green NULL terroir / non-NULL cultivar: terroir falls back to the payload findOrCreate
  (auto_created), cultivar inherits (canonical) - per-axis, as locked.
- green_bean_id supplied but row not found: both axes fall back to payload findOrCreate.
- Purchased path (no green_bean_id): both findOrCreate run, behavior unchanged.

**#56 - live push deliberately NOT run.** The deployed Vercel `push_brew` runs the pre-change code
(my change exists only in this worktree until merge + deploy), so a live push would (a) exercise the
OLD behavior and prove nothing about the fix, and (b) mint a real divergent terroir row in the prod
DB - the exact footgun being fixed. Per the kickoff's explicit instruction, the inherit logic is
asserted at the code/unit level + the real-lot precondition, and this is stated plainly rather than
claimed as a live result.

**#46 - prompt-only**, verified by reading both rendered prompts: the hint is present in each, names
`patch_inventory`, and sits before STAGE 1.

## 5. Deferred / surprising / newly surfaced

- **#54 live-MCP call deferred to a fresh claude.ai/Coordinator session** (Actor 3, standing
  MCP-cache rule): the propose_doc_changes input-schema change to an existing tool isn't callable
  until a session re-handshakes the catalog. Existing sessions hold the stale schema. A live
  `propose_doc_changes` with `op:'append'` should be re-verified in the next fresh session.
- **#56 live push** (above) is the analogous deferred verify - run a real `push_brew` with a
  `green_bean_id` after the deploy lands and confirm the brew binds to the green's terroir with no
  new auto_created row. (The Higuito lot is the natural probe.)
- **#52 is already removed from the backlog open list** (resolved-by-side-effect of the 2026-06-13
  schema-compat ship). Its only remaining step is a live re-verification in the next fresh
  Coordinator session; no build owed.
- Nothing surprising surfaced in the build that warrants a `route-feedback` filing. The one mild
  observation: `persistBrew` validates neither `green_bean_id` nor `roast_id` existence before
  insert (a non-existent `green_bean_id` simply yields a not-found -> payload fallback under #56, and
  `roast_id` is unchecked). Not in scope here and not obviously worth a sprint; noted for awareness,
  not filed.

## 6. Loop-close checklist (for the next Claude Code session)

- Backlog items #54 / #56 / #46 already flipped `planned -> shipped` by REMOVING their entries from
  [docs/product/feedback-backlog.md](../product/feedback-backlog.md) (this PR). #52's "Resolved
  2026-06-13" callout left untouched.
- One [docs/sprints/shipped.md](shipped.md) row added (2026-06-15, top of table) for the combined
  sprint.
- `route-feedback` any new friction from the next live dogfood (none owed from this build).
