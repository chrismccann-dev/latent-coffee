# `lot_status` — build notes (APPLIED at dogfood 2026-06-11)

**Status: BUILT + APPLIED (Lot Coordinator dogfood Phase A, 2026-06-11).** Landed as migration `080_lot_status.sql` + the full wiring: `lib/types.ts` typed; `lib/lifecycle-state.ts` gained `waiting_for_brewing`, `LOT_STATUS_VALUES`, and `resolveLifecycleState(stored, inputs)` (stored-with-derived-fallback — NULL pre-080 rows render unchanged); `/green` index + `/green/[id]` surface the brew-wait (steel-blue `--tile-brewing` tile + teal `Waiting · Brewing` status pill on the reused cupping-actuals view); the single write path lives in `lib/roast-import.ts § lot_status single write path` (mapping below, ratified by Chris at dogfood kickoff: **lockstep** — push tools auto-advance, push_cupping deliberately does NOT advance because the post-cupping route is the Coordinator's decision, `patch_green_bean(lot_status)` is the Coordinator's explicit slot); `check:lifecycle-consistency` + daily CI cron validate, with the one designed exception (stored waiting_for_brewing where derived says waiting_for_next_roast). The CHECK constraint is still deferred until the first live lot confirms the enum. The sections below are the design rationale, kept for provenance.

## The decision

Move from today's **derived** lifecycle (`lib/lifecycle-state.ts` computes state from row presence: `in_inventory → waiting_for_next_roast ⇄ waiting_for_next_cupping → resolved / unresolved`) to a **stored `green_beans.lot_status`** — because the brew-side-wait has no row to derive from (absence of a brew row can't distinguish not-handed-off from handed-off-and-waiting). Once one state needs stored signal, a single stored field beats derive-plus-exception.

## Coarse enum (one new state — keep the existing names)

```
in_inventory → waiting_for_next_roast ⇄ waiting_for_next_cupping → waiting_for_brewing → resolved / unresolved
```

- Reuse the existing state names (`waiting_for_next_roast` / `waiting_for_next_cupping`) so consumers don't churn. (ADR-0024 abbreviated them for brevity; the column uses the existing full names.)
- **One catch-all `waiting_for_brewing`** — do NOT split SPG-wait vs optimized-brew-wait. The Brief holds *which* brewing task; the DB shows the coarse "ball is in the brewing court" signal.
- One-shot variants map onto the same set (an N=1 lot).

## The guardrails (recover derived's can't-drift virtue)

1. **Single write path.** `lot_status` transitions *only* through the MCP Tools that write the rows (`push_roast` → `waiting_for_next_cupping`, `push_cupping` → next state, etc.) + the Coordinator at handoff (`→ waiting_for_brewing`) + close (`→ resolved`). No hand-editing.
2. **`check:lifecycle-consistency`** — a new `check:*` gate + daily CI cron (sibling to `check:migrations` / `check:doc-sizes`) that flags any lot whose stored `lot_status` disagrees with what its rows imply. The derived logic in `lib/lifecycle-state.ts` survives as the **validator** (not the source of truth).

## Migration draft (apply at dogfood)

```sql
-- NNN_lot_status.sql  (NNN >= 076; ends with the self-register line per convention)
ALTER TABLE public.green_beans
  ADD COLUMN IF NOT EXISTS lot_status text;
-- backfill existing rows from the derived state (one-time), then the Tools maintain it:
-- UPDATE public.green_beans SET lot_status = <derived> WHERE lot_status IS NULL;
-- (optional) CHECK constraint on the coarse enum once the live lot confirms the set.
INSERT INTO public.applied_migrations (filename)
  VALUES ('NNN_lot_status.sql') ON CONFLICT (filename) DO NOTHING;
```

Same-PR companions (the six-actor audit): type `green_beans.lot_status` in `lib/types.ts` (standing rule — every modeled column typed); surface `waiting_for_brewing` on the `/green` index + `/green/[id]` (the brew-wait "blocked on me vs blocked on brewing" signal); update the `lib/lifecycle-state.ts` consumers to read the stored value (keeping the derived fn as validator). Also consider the resolution-pointer FKs (`reference_roast_id`, etc.) at the same time — deferred per ADR-0024.

## Why not now

Applying a PROD migration that re-renders existing lots while the operator is away, and minting the enum before the live lot has tested it, are both the wrong order. Net-new (the skills) ships now; shared-behavior schema ships with the operator at dogfood.
