# Active lots — working hypotheses on lots currently in the V1/V2/V3 loop

*Coffee Research · Latent · Roasting Historian cluster*

Per-lot working hypotheses for lots currently iterating through V-sets. Migrated from ROASTING.md § Lot Knowledge > Active Lots in Wave 4 PR 4b (2026-05-21).

`propose_doc_changes` citations should target one lot block (`active-lots/<lot-slug>.md`), not the whole directory.

Once a lot resolves (reference roast confirmed + `roast_learnings` row pushed via `close-lot.md`), its working-hypothesis content moves to [`../learnings/<lot>.md`](docs/skills/roasting-historian/cluster/learnings/) and the active-lots entry becomes a **redirect stub** pointing at the learnings file. The stub carries title + Status + close date + one-line reference-roast summary + redirect link (~6 lines total). Convention revised at Item 4 of Sprint R Phase 4 Step 4 grill (2026-05-23) from the prior "delete" rule — keeping stubs maintains the lifecycle audit trail (which lots closed recently visible in the dir listing) while keeping per-stub bloat minimal. See [docs/reference/mcp-architecture.md § Per-lot directory taxonomy](docs/reference/mcp-architecture.md) for the full convention.

The lifecycle dimensions are kept separate: **active vs one-shot vs closed = 3 directories** mirroring the lifecycle-state model in [`lib/lifecycle-state.ts`](lib/lifecycle-state.ts) (`waiting_for_next_roast` / `waiting_for_next_cupping` route through active-lots; one-shot lots route through [`one-shot-calibrations/`](docs/skills/roasting-historian/cluster/one-shot-calibrations/); `resolved` routes through [`learnings/`](docs/skills/roasting-historian/cluster/learnings/)).

## Current roster

- [cgle-srume-natural-2026.md](docs/skills/roasting-historian/cluster/active-lots/cgle-srume-natural-2026.md) — CGLE Sudan Rume Natural — **CLOSED 2026-05-23** (ref roast #187 / V5A); deep dive at [learnings/cgle-srume-natural-2026.md](docs/skills/roasting-historian/cluster/learnings/cgle-srume-natural-2026.md). Entry is now a redirect stub.
- [cgle-gesha-clouds-2026.md](docs/skills/roasting-historian/cluster/active-lots/cgle-gesha-clouds-2026.md) — CGLE Gesha Clouds — **CLOSED 2026-06-14** (ref roast V4A / #200); deep dive at [learnings/cgle-gesha-clouds-2026.md](docs/skills/roasting-historian/cluster/learnings/cgle-gesha-clouds-2026.md). Entry is now a redirect stub.
- [cos-hig-bor-2026.md](docs/skills/roasting-historian/cluster/active-lots/cos-hig-bor-2026.md) — Costa Rica Anaerobic Dry Process Higuito — **CLOSED 2026-05-23** (ref roast v3b / #185); deep dive at [learnings/cos-hig-bor-2026.md](docs/skills/roasting-historian/cluster/learnings/cos-hig-bor-2026.md). Entry is now a redirect stub.
- [bra-fazendaum-wushwush-nat-2026.md](docs/skills/roasting-historian/cluster/active-lots/bra-fazendaum-wushwush-nat-2026.md) — Fazenda Um Wush Wush Natural Dark Room Dried (live — mid-V3)
- [rwa-nova-nat21-rb-2026.md](docs/skills/roasting-historian/cluster/active-lots/rwa-nova-nat21-rb-2026.md) — Bukure Natural Lot 21 Red Bourbon — **CLOSED 2026-06-06** (ref roast v2b / #194); deep dive at [learnings/rwa-nova-nat21-rb-2026.md](docs/skills/roasting-historian/cluster/learnings/rwa-nova-nat21-rb-2026.md). Entry is now a redirect stub.
- [redplum-cas-2026.md](docs/skills/roasting-historian/cluster/active-lots/redplum-cas-2026.md) — El Paraiso Red Plum Castillo — **RESOLVED 2026-06-22** (ref roast v4b / #212); deep dive at [learnings/redplum-cas-2026.md](docs/skills/roasting-historian/cluster/learnings/redplum-cas-2026.md). Entry is now a redirect stub.

## Related

- [`../patterns/by-process/`](docs/skills/roasting-historian/cluster/patterns/by-process/) — per-process roll-ups; each active lot links back to its process roll-up
- [`../patterns/cross-coffee-insights.md`](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md) — cross-lot patterns
- [`../learnings/`](docs/skills/roasting-historian/cluster/learnings/) — closed-lot deep-dives
- [`../one-shot-calibrations/`](docs/skills/roasting-historian/cluster/one-shot-calibrations/) — one-shot calibration lots currently in process (today empty)
