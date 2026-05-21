# Roest API — Write Surface

Roest API write endpoints used by Latent MCP server. Knowledge anchor for Roest API Worker (Workflow tier, Wave 3 PR 3) + Roast Recorder. The Workflow tier sub-skill executes the push; this doc holds the *knowledge* of how the API behaves.

Operator-stub scope per [Roest Knowledge SKILL.md](../../SKILL.md). Today's content seeded from Sprint Roest API write Phase 1+2 (2026-05-06) — 3 Tools shipped (`push_roast_profile` + `push_inventory` + `patch_inventory`); 32 Tools live at MCP catalog after the Phase 1+2 ship.

---

## Endpoints in scope

| Endpoint | Latent MCP Tool | Implementation | Notes |
|---|---|---|---|
| Roest profile push (V_n batch recipe → Roest tablet) | `push_roast_profile` | [lib/mcp/push-roast-profile.ts](../../../../../lib/mcp/push-roast-profile.ts) | Bezier curve format: `[msec, value]` tuples; 4-7 control points per axis; per-axis validation (inlet °C / fan % / rpm / power) |
| Roest inventory push (new green-lot row → Roest tablet) | `push_inventory` | [lib/mcp/](../../../../../lib/mcp/) (inventory write) | Lot-spec metadata: producer / region / cultivar / process / moisture / density / purchase date |
| Roest inventory patch (update an existing green-lot row) | `patch_inventory` | [lib/mcp/](../../../../../lib/mcp/) (inventory patch) | Archive on close-out: `patch_inventory(state: 'archived')` |

---

## Profile push — curve format

The Roest tablet accepts profiles as bezier control points per axis. Latent's `push_roast_profile` validates:

- **Inlet curve** `[msec, °C]` — Chris's Standard Inlet Curve Template fixes 7 timestamps for V1 experiments (00:00 / 01:15 / 02:30 / 03:15 / 04:00 / 05:00 / 06:00). First msec must be 0; msec strictly ascending; °C in [50, 300]. See [cluster/protocols/fan-strategy.md § Standard Inlet Curve Template](../protocols/fan-strategy.md#standard-inlet-curve-template).
- **Fan curve** `[msec, %]` — counterflow shaped curves required; Chris's pattern is high airflow during drying (75-80%), step down to 50-65% post-FC for development. See [cluster/protocols/fan-strategy.md § Fan Strategy](../protocols/fan-strategy.md#fan-strategy-counterflow--shaped-curves-required). First msec must be 0; msec strictly ascending; values in [0, 100].
- **RPM curve** `[msec, rpm]` — drum rotation. Typically constant on this machine; multi-point variation is rare.
- **Power curve** `[msec, %]` — heating element power. Counterflow uses fixed power with inlet/fan as the dynamic controls.

---

## Inventory write — schema fields

The `push_inventory` and `patch_inventory` Tools mirror the Roest tablet's new-inventory form. Field set: Green Lot ID / Coffee Name / Variety / Producer / Region / Origin / Seller/Importer / Process / Moisture % / Density g/L / Purchase Date / optional Altitude / Source Type / Price per kg. Field shape mirrors the Roest form, not a fixed canonical list — don't block writes on missing optional fields.

---

## Authentication + auth state

Bearer-token auth; same chain as the read surface.

---

## Behavioral notes

Today: placeholder beyond per-axis curve validation. Pattern A refresh expected as Chris accumulates push validation failures / Roest acceptance quirks. Pattern B refresh expected at firmware updates that change accepted formats.

---

## Cross-links

- [cluster/api/read-surface.md](read-surface.md) — Roest API read endpoints.
- [cluster/api/quirks.md](quirks.md) — observed API quirks. Placeholder today.
- [docs/features/roest-write-integration.md](../../../../../docs/features/roest-write-integration.md) — full bidirectional Roest sync spec (push + pull endpoints).
- [SYNC_V2.md](../../../../../SYNC_V2.md) — full MCP transport / auth / Resources / Tool catalog.
