# Active lots — working hypotheses on lots currently in the V1/V2/V3 loop

*Coffee Research · Latent · Roasting Historian cluster*

Per-lot working hypotheses for lots currently iterating through V-sets. Migrated from ROASTING.md § Lot Knowledge > Active Lots in Wave 4 PR 4b (2026-05-21).

`propose_doc_changes` citations should target one lot block (`active-lots/<lot-slug>.md`), not the whole directory.

Once a lot resolves (reference roast confirmed + `roast_learnings` row pushed via `close-lot.md`), its working-hypothesis content moves to [`../learnings/<lot>.md`](../learnings/) and the active-lots entry becomes a **redirect stub** pointing at the learnings file. The stub carries title + Status + close date + one-line reference-roast summary + redirect link (~6 lines total). Convention revised at Item 4 of Sprint R Phase 4 Step 4 grill (2026-05-23) from the prior "delete" rule — keeping stubs maintains the lifecycle audit trail (which lots closed recently visible in the dir listing) while keeping per-stub bloat minimal. See [docs/reference/mcp-architecture.md § Per-lot directory taxonomy](../../../../../docs/reference/mcp-architecture.md) for the full convention.

The lifecycle dimensions are kept separate: **active vs one-shot vs closed = 3 directories** mirroring the lifecycle-state model in [`lib/lifecycle-state.ts`](../../../../../lib/lifecycle-state.ts) (`waiting_for_next_roast` / `waiting_for_next_cupping` route through active-lots; one-shot lots route through [`one-shot-calibrations/`](../one-shot-calibrations/); `resolved` routes through [`learnings/`](../learnings/)).

## Current roster

- [cgle-srume-natural-2026.md](./cgle-srume-natural-2026.md) — CGLE Sudan Rume Natural V5 (V5 roasts complete, Day 7 pourover pending)
- [cgle-gesha-clouds-2026.md](./cgle-gesha-clouds-2026.md) — CGLE Gesha Clouds (V1+V2 complete, V3 needed)
- [cos-hig-bor-2026.md](./cos-hig-bor-2026.md) — Costa Rica Anaerobic Dry Process Higuito (V2 winner v2b, V3 not yet designed)
- [bra-fazendaum-wushwush-nat-2026.md](./bra-fazendaum-wushwush-nat-2026.md) — Fazenda Um Wush Wush Natural Dark Room Dried (V1 cupped, V2 blocked on reference cup)
- [rwa-nova-nat21-rb-2026.md](./rwa-nova-nat21-rb-2026.md) — Bukure Natural Lot 21 Red Bourbon (V2 pushed to Roest, not yet roasted)
- [redplum-cas-2026.md](./redplum-cas-2026.md) — El Paraiso Red Plum Castillo (V2 designed and pushed)

## Related

- [`../patterns/by-process/`](../patterns/by-process/) — per-process roll-ups; each active lot links back to its process roll-up
- [`../patterns/cross-coffee-insights.md`](../patterns/cross-coffee-insights.md) — cross-lot patterns
- [`../learnings/`](../learnings/) — closed-lot deep-dives
- [`../one-shot-calibrations/`](../one-shot-calibrations/) — one-shot calibration lots currently in process (today empty)
