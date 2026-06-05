# Roest API write integration

**Status:** Scoped 2026-05-05, not yet sprint-ranked. Not in Active Sprint Queue yet — slot when ready.
**Substrate confirmed:** Yes — Roest's `Latent Coffee` API credential is already capable of `scope=read write` (verified 2026-05-05 via terminal token mint, response confirmed `"scope": "read write"`). No email back-and-forth needed; the credential UI doesn't expose scope per-credential because scope is requested at token-mint time, not assigned at credential-creation time.
**OpenAPI spec source:** `https://raw.githubusercontent.com/Kaffebrenner/roest-api-example/main/schema.yml` (132KB). Cache locally with `curl -o /tmp/roest-schema.yml ...` then `docker run -p 8080:8080 -e SWAGGER_JSON=/schema.yml -v ${PWD}/schema.yml:/schema.yml swaggerapi/swagger-ui` for browseable docs.

## Goal

Enable claude.ai to push **roast profiles** (Phase 1, highest leverage) and **bean inventory** (Phase 2) directly to Chris's Roest L200 Ultra via API, removing the manual transcription step from the planning loop.

**Value prop in one sentence:** Today claude.ai writes "v1a should be preheat 235°C, FC at 7:00 / 195°C bean, fan steps from 75% → 50% at 1:30, drop on 200°C bean" and Chris hand-keys all of that into the Roest tablet's profile editor. After this sprint, claude.ai writes the same plan and pushes it; Chris taps **Load** on the tablet and roasts. Same loop for bean lots when they arrive.

**Out of scope this sprint:** MQTT live telemetry. Genuinely interesting (claude.ai watching the roast in real time), but it's a separate channel (TLS MQTT against `coap.roestcoffee.com:8883`), bigger lift, and Chris's reframe — "now that I can drop on bean temp the consistency problem is mostly solved" — drops the urgency. Documented as a future sprint at the bottom of this doc.

## Phased scope

| Phase | Tools | API endpoints | Effort | Priority |
|---|---|---|---|---|
| **1** | `push_roast_profile` | `POST /profiles/` + `PUT /profiles/{id}/enable_share/` | ~1 day | **Highest** |
| **2** | `push_inventory` + `patch_inventory` | `POST /inventories/` + `PATCH /inventories/{id}/` | ~1 day | Medium |
| 3 (future) | `mqtt_subscribe_live` | MQTT TLS subscribe | 2-3 days | Deferred |

Phases can ship as separate PRs or one bundled. Recommend separate — Phase 1 is the high-leverage win; Phase 2 is nice-to-have. If Phase 1 takes longer than expected, Phase 2 doesn't get held hostage.

## Substrate work (do first, before either phase)

Three small changes to existing code, plus one schema review:

1. **Token mint scope.** [lib/roest-client.ts:48](lib/roest-client.ts) currently sends `body: 'grant_type=client_credentials'` with no scope. Add `scope=read+write` so minted tokens can hit write endpoints. The cached token's `expires_at` field already accounts for refresh — no other change needed.

2. **File header comment fix.** [lib/roest-client.ts:14](lib/roest-client.ts) says "Roest credentials are read-only (scope: 'read')" — that comment is now wrong. Update when touching the file.

3. **POST/PATCH-capable fetcher.** Existing `authedFetch<T>(path)` is GET-only. Add a sibling:

   ```ts
   async function authedWrite<TIn, TOut>(
     method: 'POST' | 'PATCH' | 'PUT',
     path: string,
     body: TIn,
   ): Promise<TOut>
   ```

   Same shape — bearer header, JSON content-type, error-on-non-2xx. Don't bend `authedFetch` to take a method param; readability wins by keeping read and write paths visibly distinct.

4. **Customer URL resolution.** Both `POST /profiles/` and `POST /inventories/` need a `customer` field. The example does `GET /users/self/` and pulls `customers[0].url` (a Roest API URL like `https://api.roestcoffee.com/customers/2424/`). Add `getRoestCustomerUrl(): Promise<string>` that caches the result in module-level memory (lifetime = process / Vercel container — same as the token cache). Don't hardcode `customer=2424`; minor cost, much cleaner.

## Phase 1: `push_roast_profile`

### Tool shape

```typescript
{
  name: 'push_roast_profile',
  description: '[detailed description — see below]',
  inputSchema: {
    name: { type: 'string', required: true, maxLength: 255 },
    notes: { type: 'string', maxLength: 2047 },
    batch_weight_g: { type: 'number', default: 100 },
    preheat_temperature_c: { type: 'number', required: true },
    temperature_bezier: { type: 'array', items: '[msec, °C] tuple', required: true },
    fan_bezier: { type: 'array', items: '[msec, %] tuple', required: true },
    rpm_bezier: { type: 'array', items: '[msec, rpm] tuple', required: true },
    power_bezier: { type: 'array', nullable: true, default: null },
    end_condition: { enum: ['BEAN_TEMP', 'TOTAL_TIME', 'DEV_TIME', 'DTR', 'DRUM_TEMP'], default: 'BEAN_TEMP' },
    end_condition_value: { type: 'number', required: true },
    enable_share: { type: 'boolean', default: true },
  },
  output: { profile_id: 'number', share_url: 'string?' }
}
```

### Defaults (Chris's L200 Ultra in counterflow mode)

These are constant across every roast Chris does, so the Tool should hardcode them rather than expose them as inputs:

- `machinetype: 2` (S200L200 enum value)
- `profile_type: 5` (INLET_TEMP — Chris roasts on inlet-temp profiles per ROASTING.md)
- `reversed_drum_direction: true` (counterflow mode — Chris's only mode)
- `is_bbp_profile: false`
- `customer:` resolved at call time from `getRoestCustomerUrl()`

If Chris ever changes machine or profile-type philosophy, surface as inputs then. YAGNI now.

### Implementation

New file `lib/mcp/push-roast-profile.ts` following the shape of existing push tools (mirror [lib/mcp/push-roast.ts](lib/mcp/push-roast.ts)):

1. Validate input shape (zod schema).
2. Validate bezier arrays:
   - At least 2 points each.
   - First msec = 0 (profile starts at charge).
   - Strictly ascending msec.
   - All values within sane range (temperature 50-300°C, fan/rpm/power 0-100).
3. Resolve `customer` URL.
4. POST `/profiles/` with the full payload.
5. If `enable_share: true`, follow up with `PUT /profiles/{id}/enable_share/`.
6. Return `{ profile_id, share_url? }`.

Register in [lib/mcp/server.ts](lib/mcp/server.ts) tool-list block.

### Tool description (this is the high-leverage part)

The Tool description is what teaches claude.ai how to construct a profile. It should:

- **Reference [ROASTING.md](ROASTING.md)** as the source of truth for Chris's roasting methodology.
- **Encode the v1a/v1b/v1c naming convention** explicitly: every profile starts as `<bean-name> v1a`; subsequent iterations on the same bean increment to v1b, v1c.
- **Specify bezier shape conventions**:
  - `temperature_bezier`: typically 4-6 control points covering charge → dry-end → FC → drop. Inlet temp targets in °C.
  - `fan_bezier`: typically 3-4 control points; Chris's pattern is high airflow during drying (75-80%), step down to 50-65% post-FC for development.
  - `rpm_bezier`: usually flat at 55 rpm for the L200 Ultra unless specifically modulating.
  - `power_bezier`: null for inlet-temp profiles (server controls power to hit inlet target).
- **End condition guidance**: Chris's preferred gate is `BEAN_TEMP` per ROASTING.md. Typical values 198-205°C depending on bean development target.
- **Length**: ~60-90 lines of guidance. Long Tool descriptions are fine; this is the load-bearing surface.

Cross-reference: [BREWING.md](BREWING.md) section on prompt v9 + canonicals shows the pattern of long descriptive prompts loaded into Tool descriptions.

### Validation gotchas

- The OpenAPI schema declares bezier fields as `type: string` but the example POST sends them as arrays of `[msec, value]` tuples. Trust the example — the schema is loose-typed (Django serializer accepts either).
- `preheat_temperature` is the **drum preheat target before charge**, not the first bezier point.
- `end_condition_value` semantics depend on `end_condition` enum (the schema description: "Time in milliseconds, Percentage from 0 -> 100 or Temperature in Celsius"). For `BEAN_TEMP` (the default we'll use), it's degrees Celsius.
- `batch_weight` is grams (Chris always 100g for L200 Ultra batch testing).

### Database side effects

**None this phase.** The Tool returns the `profile_id` to claude.ai; claude.ai then uses it in subsequent context. No new column on `green_beans` or `roasts` to capture "Claude pushed this profile."

**Consider for future:** if Phase 1 ships and we want to link "Claude designed a roast for bean X with profile Y → roast happened → log Y came back via pull_roest_log", we'd add a `roest_profile_id integer` column to capture the inverse mapping. But [lib/roest-client.ts:117](lib/roest-client.ts) already captures `profile_link` and `roast_profile_name` as text — sufficient for trace purposes through this sprint.

### Test plan

- Push a profile with claude.ai before merging the PR. Load it on the tablet. Run a real roast against it.
- Confirm `share_url` resolves (paste it in a browser — should show the public share view).
- Push a profile with intentionally invalid bezier (descending msec, out-of-range temp) — confirm validation catches it before hitting the API.

## Phase 2: `push_inventory` + `patch_inventory`

### Why bundle these

Both consume the same `Inventory` schema; same fetcher; same customer URL resolution. Adding both at once is cheaper than adding them sequentially.

### `push_inventory` (POST /inventories/)

Tool shape mirrors `RoestInventory` from [lib/roest-client.ts:145](lib/roest-client.ts) (the existing read shape — same fields, just write direction):

```typescript
{
  name: 'push_inventory',
  inputSchema: {
    name: { type: 'string', required: true },
    producer: { type: 'string', nullable: true },
    farm: { type: 'string', nullable: true },
    region: { type: 'string', nullable: true },
    country: { type: 'string', nullable: true },
    cultivar: { type: 'string', nullable: true },
    bean_process: { type: 'integer', enum: [1, 2, 3, 4, 5], nullable: true },
    moisture: { type: 'number', nullable: true },
    water_activity: { type: 'number', nullable: true },
    elevation: { type: 'number', nullable: true },
    density: { type: 'number', nullable: true },
    initial_weight: { type: 'number', nullable: true },
    current_weight: { type: 'number', nullable: true },
    price: { type: 'number', nullable: true },
    notes: { type: 'string', nullable: true },
    importer: { type: 'string', nullable: true },
    exporter: { type: 'string', nullable: true },
    bean_size: { type: 'integer', nullable: true },
    drying_speed: { type: 'integer', nullable: true },
    green_bean_color: { type: 'integer', nullable: true },
  },
  output: { roest_inventory_id: 'number' }
}
```

**`bean_process` mapping** is already documented in [lib/roest-client.ts:222](lib/roest-client.ts) — re-use the inverse map (1=Natural, 2=Washed, 3=Honey, 4=Co-fermented/XO, 5=Anaerobic).

### `patch_inventory` (PATCH /inventories/{id}/)

Smaller surface — just `{ roest_inventory_id, fields_to_update }`. Use case: claude.ai marks an inventory as archived, updates current_weight after a roast, fixes a typo on producer/notes.

```typescript
{
  name: 'patch_inventory',
  inputSchema: {
    roest_inventory_id: { type: 'integer', required: true },
    fields: {
      // any subset of the push_inventory fields, all optional
      // PLUS:
      is_archived: { type: 'boolean' },
    },
  },
  output: { ok: true, updated_fields: ['array', 'of', 'field', 'names'] }
}
```

### Database link-back

When `push_inventory` succeeds, **also write the resulting `roest_inventory_id` back to our `green_beans.roest_inventory_id`** if the caller passed a `green_bean_id` argument. Chris's flow: bean lands in our app first (via `push_green_bean` MCP Tool), then propagates to Roest. We want both records linked.

This is a 1-column update on a known-existing row — minor, but worth adding to keep the two systems in sync.

```typescript
// optional input
green_bean_id: { type: 'string', nullable: true, description: '...' }
```

### Validation gotchas

- **Weight unit ambiguity.** [lib/roest-client.ts:404](lib/roest-client.ts) (`normalizeRoestInventoryWeightG`) already handles the read-side: Roest returns weights as `grams * 1000` for some inventories. The write side: send raw grams, not multiplied? Confirm during sprint kickoff with one push to a test bean. If Roest expects multiplied units for writes too, mirror the normalization in reverse.
- **Moisture format.** Read side is fraction-or-percentage drift (some lots `0.087`, some `8.7`). Write side: send as percentage (`8.7`)? Confirm.
- **Required fields.** OpenAPI schema only marks `author_name` + `created` as `required` and both are `readOnly` — so technically only `name` is required by the user. But producing a useful inventory entry needs at minimum `name + country + cultivar + bean_process + initial_weight + price`. Surface those as required-in-spirit via Tool description even though API accepts looser input.

## Decisions locked at scoping (2026-05-05)

1. **Idempotency on profile push: create-new, allow duplicates.** Pushing "v1a" twice will produce two profile rows in Roest. Chris deletes duplicates in the Roest UI when they happen. Rejecting at the Tool level is worse — silent failure during an active brewing session is more friction than a duplicate row.

2. **Profile inheritance via `POST /profiles/branch/`: skip.** The branch endpoint links child profiles to parents in Roest's data model, but Chris does his own iteration linking via the `experiments` table on our side. The Roest-side parent relationship doesn't change his workflow. Don't expose `parent_profile_id` on the Tool input.

3. **No Tool-level pre-push confirmation gate.** Pushing a profile is reversible (delete in UI), low-stakes. The Tool description tells claude.ai to print the structured profile to chat before calling the Tool — confirmation lives in conversation, not in the Tool itself.

## Open follow-up questions (not blocking)

4. **What happens to `share_url` after the roast?** The `enable_share` flow gives back a URL like `https://connect.roestcoffee.com/shared_profile/{uuid}/`. Phase 1 just returns it from the Tool call; claude.ai can include it in conversation. Worth storing it on a Resource response (`get_brew` / `get_bean_pipeline`) so claude.ai can link back after the fact — but that's a follow-up sprint, not blocking.

5. **Logs writes — `POST /logs/{id}/weights/` and `POST /logs/{id}/events/` and `POST /logs/{id}/share_uuid/`.** OpenAPI shows these exist. Out of scope for this sprint — none of them are blockers for the roast-planning loop. Worth knowing they exist for a future "post-roast tidy-up" Tool that fixes log weight after weighing roasted beans.

## Sizing

| Phase | Effort | Notes |
|---|---|---|
| Substrate (scope upgrade + authedWrite + customer URL helper) | 0.5 day | Touches one file; small surface |
| Phase 1 (`push_roast_profile`) | 1 day | Most time spent on the Tool description — that's the actual product |
| Phase 2 (`push_inventory` + `patch_inventory`) | 1 day | Mechanical follow-on once substrate exists |
| **Total if both ship together** | **2-2.5 days** | |
| Phase 1 alone | 1.5 days | Ship-able as standalone PR if Phase 2 deferred |

## Risk surface

- **Pushing to a physical machine has real-world consequences.** A bad fan curve (e.g. fan dropping to 0% mid-roast) will likely throw an error on the tablet rather than catch fire — Roest has internal safeties — but worth confirming during the first real test roast that profile validation on Roest's side catches malformed bezier shapes.
- **Roest API stability.** README says explicitly: "The API does not provide any guarantees about stability and will break backwards compatibility." Build defensively — the `authedFetch` / `authedWrite` error path should surface useful error messages so a future API change is debuggable.
- **Rate limits.** Not documented. Don't expect them to bite (Chris is one user pushing maybe 10 profiles a week), but don't loop the Tool either.
- **Token cache invalidation.** If we change scope from `read` to `read write` and the existing cached token in a warm Vercel container has the old scope, the first write attempt will 403. Solution: always include scope in the token mint call, and any scope mismatch invalidates the cache. The current 60-second pre-expiry refresh handles this incidentally — token will rotate within 10h max.

## Sprint cadence reminders

Per [CLAUDE.md § Sprint cadence](CLAUDE.md):

1. **Plan-mode before coding.** Surface the bezier-shape decisions and Tool description outline before writing the Tool file. Don't silently interpret.
2. **End-to-end test against the real Roest before PR.** Push a profile, load it on the tablet, run a roast. Don't ship Phase 1 without this.
3. **`/simplify` after Phase 1.** Likely targets: bezier validators (might consolidate into a shared helper if Phase 2 also validates structured input), `authedWrite` shape (rule-of-1 for now, but might hit rule-of-2 with the inventory tool).
4. **Retro before doc updates.** Note any Roest API quirks discovered during testing — the OpenAPI schema is "incomplete and potentially incorrect" per Roest, so reality might diverge.

## Idea parked: `draft_roast_learnings` Tool (post-roast analysis)

Surfaced 2026-05-05 from a scout of [roastmaster-ai](https://github.com/danielmichaeli89-collab/roastmaster-ai)'s `postRoastAnalysis` shape. Not part of this sprint, but the natural follow-up once Phase 1 ships: a new MCP Tool `draft_roast_learnings(roast_id)` that pulls a completed Roest log + ROASTING.md context and produces a Claude-drafted first pass at `what_worked` / `what_didnt` / `what_to_change` / `next_roast_guidance`. User reviews + edits, then `push_roast_learnings` persists the final version. Closes the iteration loop end-to-end: claude.ai designs profile → Roest roasts → claude.ai drafts learnings → user edits → next iteration.

Output shape worth borrowing (phase-by-phase structured assessment): `maillard_phase` / `first_crack` / `development_phase` / `next_roast_guidance: { charge_temp_adjustment, development_time_adjustment, rationale }`. Maps cleanly to existing `push_roast_learnings` fields.

## Future Phase 3: MQTT live telemetry

**Punt to a separate sprint when there's product appetite.** Notes for that future sprint:

- Channel: `coap.roestcoffee.com:8883` over MQTT TLS.
- Auth: `GET /machines/?slug={machine_slug}` returns a `mqtt_config` block with username + topic + subscribe-only password. Separate from REST API auth.
- Payload shape: `{msec, bt, inlet_temp, drum_temp}` per [live_data.py example](https://github.com/Kaffebrenner/roest-api-example/blob/main/live_data.py) — streamed during a roast.
- Use case: a "Claude watches your roast" mode where the model receives streaming bean temp + inlet + drum, applies BMR pattern recognition, and tells Chris when to drop / when fan should change.
- Lift: bigger than REST writes. Need a long-lived MQTT subscriber (probably a separate service, not Vercel serverless), bidirectional MCP transport (server-side events to claude.ai or polling), and a UI surface for the live recommendations.
- Genuinely new product surface, not a sync improvement. Worth doing eventually; not urgent post-bean-temp-drop-condition.

## File summary (when this sprint ships)

New:
- `lib/mcp/push-roast-profile.ts`
- `lib/mcp/push-inventory.ts` (Phase 2)
- `lib/mcp/patch-inventory.ts` (Phase 2)

Modified:
- `lib/roest-client.ts` (token scope, file-header comment, `authedWrite`, `getRoestCustomerUrl`)
- `lib/mcp/server.ts` (Tool registration)

Possibly modified (Phase 2 only):
- `lib/mcp/push-green-bean.ts` (write `roest_inventory_id` back if `push_inventory` chains in)
