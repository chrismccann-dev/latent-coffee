# Roest API — Read Surface

Roest API read endpoints used by Latent MCP server. Knowledge anchor for Roast Recorder + Roest API Worker (Workflow tier sub-skills, Wave 3 PRs 2-3); they execute the calls, this doc holds the *knowledge* of how the API behaves.

Operator-stub scope per [Roest Knowledge SKILL.md](../../SKILL.md) — Chris-stubbed-Claude-integrates pattern. Today's content seeded from Sprint 2.5 (Roasting MCP + ROASTING.md) + Sprint 2.7.5 (workflow walkthrough + Roest API write dogfood) + Roest API write Phase 1+2 (2026-05-06) + Sprint 3.5 (pull-side audit + /datapoints/ unlock, 2026-05-26). Patterns A + B (substrate-event + external-event refresh) flow content here as new endpoints land or behavior drifts.

---

## Endpoints in scope

| Endpoint | Latent MCP Tool / Resource | Implementation |
|---|---|---|
| `/logs/{id}/` — per-roast summary (event timestamps, discrete temps, weights, profile linkage) | `pull_roest_log` Tool | [lib/mcp/pull-roest-log.ts](../../../../../lib/mcp/pull-roest-log.ts) |
| `/profiles/{id}/?customer={id}` — as-designed bezier curves (temperature, fan, rpm, power) + end-condition trigger | `pull_roest_log` Tool (linked fetch) | [lib/roest-client.ts](../../../../../lib/roest-client.ts) `getRoestProfile` |
| `/datapoints/?log={log_id}&page_size=1000` — raw temperature time-series (bt / et / inlet_temp / drum_temp + msec); paginated via `next` | `pull_roest_log` Tool (linked fetch, Sprint 3.5) | [lib/roest-client.ts](../../../../../lib/roest-client.ts) `getRoestDatapoints` |
| `/inventories/{id}/?customer={id}` — green-bean lot metadata + price + notes | `list_roest_inventory` Tool | [lib/mcp/list-roest-inventory.ts](../../../../../lib/mcp/list-roest-inventory.ts) |
| `/inventories/?customer={id}&search=&is_archived=&limit=` — paginated inventory index | `list_roest_inventory` Tool | same |
| `/logs/?inventory={id}&limit={n}` — paginated log index per inventory lot | `list_roest_logs` Tool | [lib/mcp/list-roest-logs.ts](../../../../../lib/mcp/list-roest-logs.ts) |
| `/users/self/` — customer info (id + URL) for the bearer token | internal `getRoestCustomerInfo` (cached) | [lib/roest-client.ts](../../../../../lib/roest-client.ts) `getRoestCustomerInfo` |

---

## /datapoints/ shape (Sprint 3.5 unlock)

`/datapoints/?log={log_id}` exposes the raw time-series the Roest UI graphs but the `/logs/{id}/` summary doesn't carry. Each row carries `msec` offset since charge + sensor readings + a discriminator:

| Field | Type | Notes |
|---|---|---|
| `data_type` | enum int | `0` = event marker (event_type set), `1` = sensor reading (bt/inlet_temp/etc set) |
| `event_type` | enum int (nullable) | `0`=Charge, `1`=Drop, `2`=Name, `3`=Manual, `4`=Dryend, `5`=Firstcrack, **`6`=Auto-detected Firstcrack, `7`=Auto-detected Dryend, `8`=Auto-detected Drop** |
| `msec` | int (nullable) | Ms since charge |
| `bt` | float °C (nullable) | Bean temperature — the canonical curve for TP / yellowing_temp / RoR compute |
| `et` | float °C (nullable) | Exhaust temperature |
| `inlet_temp` | float °C (nullable) | As-recorded inlet — diverges from `RoestProfile.temperature_bezier` (as-designed) when operator nudges mid-roast |
| `drum_temp` | float °C (nullable) | Drum temp at sample time |
| `target` | float (nullable) | Setpoint at sample time |
| `fan` / `heat` / `rpm` | int (nullable) | Operator-set actuator values |

**Pagination**: `next` is an absolute URL on each page response. `getRoestDatapoints` requests `page_size=1000` and follows `next` until exhausted. A typical 7-minute roast at 1Hz sampling fits in a single page; higher-resolution roasts span multiple pages.

**Sprint 3.5 server-side compute**:

| Field on `roasts` | Computation |
|---|---|
| `tp_time` + `tp_temp` | `bt` local min within first half of roast (cap: 180s). Surfaces the canonical "turning point" — bt cools from charge-drum heat-soak before the hopper-load heats it back up. |
| `yellowing_temp` | `bt` interpolated at `log.dryend_event_msec`. |
| `ror_at_2_30` / `ror_at_4_00` / `ror_at_fc_minus_30s` | 30-second-window centered RoR: `(bt at target+15s - bt at target-15s) × 2` = °C/min. NULL when the window straddles charge OR the curve doesn't span past target+15s. fc_minus_30s uses `firstcrack_event_msec - 30000` as target. |
| `inlet_curve_recorded` | `inlet_temp` interpolated at the same msec keys as the as-designed `RoestProfile.temperature_bezier` (so the two display strings line up for visual diffing). Falls back to 30-second uniform sampling when no designed bezier is supplied. |

---

## What the Roest API does NOT expose

Audit findings from Sprint 3.5 (against the Kaffebrenner/roest-api-example OpenAPI schema as of 2026-05-26):

- **`hopper_load_temp`** — the bean-probe reading at hopper-load (V4 standard ~125°C) does not appear on `/logs/`, `/profiles/`, or `/datapoints/`. `RoestProfile.preheat_temperature` is the air-preheat target (~210°C), a DIFFERENT signal. `pull_roest_log` returns `null` and surfaces an inference hint; `push_roast` callers augment from session memory.
- **`fc_total_cracks`** — total cracks count is visible in the Roest UI but not exposed on the API. `push_roast.fc_total_cracks` is operator-augmented.
- **`fc_audibility`** — Roest tracks event timestamps + an auto-detection flag (event_type 5=manual / 6=auto-detected) but no audible/subtle/silent/ambiguous classification. Operator-augmented.

---

## R66 orphan reconciliation

When `pull_roest_log` returns a log whose `inventory_id` does NOT match an existing `green_beans.roest_inventory_id`, the caller must reconcile manually. `push_roast` emits a warning in `warnings[]` when `roest_log_id` is supplied AND parent green_bean has `roest_inventory_id = null`; reconcile via `patch_green_bean({green_bean_id, roest_inventory_id: <id>})`. We don't auto-mutate the FK on inferred match per the `external_drift_ok_latent_canonical_required` standing rule.

---

## R65 timezone handling

Roest API returns ISO-8601 timestamps in UTC. `pull_roest_log` converts to the user's local timezone via the `ROEST_USER_TIMEZONE` env var (IANA TZ name, e.g. `America/Los_Angeles`); falls back to `America/Los_Angeles` when unset. The payload returns both `roast_date` (local) and `roast_date_utc` for callers who want both. An inference hint surfaces when the default is in use.

---

## Authentication

Bearer-token auth via OAuth 2.0 client_credentials. Token cached in-memory for the Vercel container lifetime (~10h between mints). Customer info (id + URL for write paths) cached on first call to `/users/self/`. Credentials never leave the server — claude.ai cannot reach api.roestcoffee.com directly.

---

## Cross-links

- [cluster/api/write-surface.md](write-surface.md) — Roest API write endpoints (profile push + inventory write).
- [cluster/api/quirks.md](quirks.md) — observed API quirks (drift, retry patterns, edge cases). Placeholder today.
- [SYNC_V2.md](../../../../../SYNC_V2.md) — full MCP transport / auth / Resources / Tool catalog.
- [docs/features/roest-api-parity-phase-3.md](../../../../features/roest-api-parity-phase-3.md) — Sprint 3.5 audit scoping doc (post-shipping notes inline).
