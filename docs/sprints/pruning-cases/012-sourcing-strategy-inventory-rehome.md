# Pruning case 012 — sourcing/strategy.md (inventory snapshot re-home)

> Structured handoff doc for a post-tripwire pruning exercise. Executed 2026-07-08 from the read-only prep report [docs/audits/pruning-prep-2026-07-08.md § 4](docs/audits/pruning-prep-2026-07-08.md); Chris ratified every cut 2026-07-08.

## Header

- **Doc pruned:** [docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md) 48.6 KB → 37.2 KB (new sibling [inventory-snapshot.md](docs/skills/wbc-roasting-archivist/cluster/sourcing/inventory-snapshot.md) 8.6 KB; wbc-roasting-archivist cluster 92.2 → 89.5 KB / 200)
- **Trigger:** ⚠️ approaching watcher on the cluster's largest-doc row (48.6 / 60 KB single-doc cap, [doc-tripwires.md](docs/architecture/doc-tripwires.md)) + a proven refresh-burden growth vector (full snapshot rewrite in the doc's 6-week life; the doc is full-read by start-lot.md at every V-set lot start, so every KB is per-session load)
- **Shape(s) used:** **re-home + split** primary (case-009 growth-vector isolation: live per-lot state → DB via `list_green_inventory`, lane-lens → fast-refresh sibling carrying the refresh mandate alone) + consolidate (palate section rewritten in apex voice, absorbing the 2026-06-14 supersession blockquote; § 7 roster → producers.md pointer) + delete (History section, 6 stale in-inventory sentences)
- **Judgment calls:** (1) the tier-table T3 row's quoted "VERY expressive + Suppression" cell was reworded to express-then-clarify voice despite the "keep table intact" instruction — keeping the retired framing verbatim would have re-required the supersession note the consolidation removed; (2) stale sentences were converted to timeless past-tense where the observation survives (Red Plum "cleaner expression of the network", Sudan Rume "has roasted both", the L256 density → FC-temp worked contrast) rather than deleted whole; (3) L256's stale `ROASTING.md § Cross-Coffee Insight Layer` reference was repointed to the roasting-historian CCIL path in passing; (4) the GESHA CLOUDS mention in § 1 (also stale-ish) was NOT cut — not in the ratified list.
- **Heuristic learned:** when a doc's fast half is mostly a restatement of DB state, re-home the *state* to the DB read and keep only the analytical residue (here: the lane lens — the one view the schema can't hold) in a sibling that owns the refresh mandate; the slow framework doc then never re-trips on inventory churn.

## Shape-coverage note

Deliberately not a reflex-extract: the lead move is re-home-to-DB (the section itself declared `list_green_inventory` authoritative), with the sibling holding only the DB-unrepresentable lane mapping + gap analysis + posture. The Recently-closed table was *deleted to a pointer*, not moved — each row already linked its archive/learnings home, so moving it would have created a third copy.

## Delete flags (if any)

None outstanding — all deletes were pre-ratified in the prep report. Out-of-scope observation carried forward: the fuller placeholder-trim of `priority-targets.md` / `portfolio-lanes.md` (re-grown substantive tables duplicating § 7 / § 10 + wbc-materials.md) stays a grilling-queue candidate per the prep report's out-of-scope list.

## Result

- strategy.md 48.6 → **37.2 KB** (60 KB cap; watcher flag cleared); inventory-snapshot.md born at **8.6 KB**; cluster **89.5 / 200 KB**. Estimate was ~13.4 KB cut to ~35 KB; actual 11.4 KB — the delta is the pointer block + timeless-half preservation + the new cross-reference lines.
- Snapshot data moved **as-is at its 2026-06-18 as-of date** (38 in_inventory then; DB now shows 38 rows on 2026-07-08 but per-lot composition has moved) — refreshing is the operator's workflow, and the sibling header states the as-of date + mandate.
- **§ 0 Sourcing philosophy byte-identical** (verified by section diff — the CONTEXT-taste-linked canonical operational home, untouchable per the considered-and-kept list).
- Six-actor hops: `lib/mcp/docs.ts` strategy.md description updated + inventory-snapshot.md registered (listed, mirroring siblings); SYNC_V2.md Resource table row added; CLAUDE.md § Documentation Index clause updated; start-lot.md L87 read instruction now names both reads; inbound textual refs rewired (portfolio-lanes.md, priority-targets.md, wbc-roasting.md x2, wbc-materials.md x3). Zero `strategy.md#` anchor links existed (re-verified).
- Verification: `npx tsc --noEmit` clean · `check:mcp-bundle` 139 paths covered · `check:doc-sizes` all Tier-1 within cap · `check:doc-links` 0 live misses.
- PR: see [docs/sprints/shipped.md](docs/sprints/shipped.md) 2026-07-08 row.

## Transcript / detailed log

Executed as a planned single-session prune from the ratified prep report (short ratification-session model working as designed — no interpretive forks required beyond the judgment calls above).
