---
name: green-inventory
description: >-
  Manage the green coffee bean inventory in Claude Code: re-rank the in_inventory
  "what to roast next" queue, or add a new green lot to inventory. Use when Chris says
  "re-rank my inventory", "re-rank my green inventory", "what should I roast next",
  "add a green bean to my inventory", "I have a new green bean to add", "log this green
  lot", or pastes a green-coffee spec sheet to add. NOT the full per-lot roast arc —
  designing V-sets / roasting a lot is the roasting coordinator ("start a new lot").
---

# Green Inventory (Claude-Code-native inventory entry)

The **operator-direct entry** for the two green-inventory operations that aren't a full
roast: **re-ranking the roast queue** and **adding a lot to inventory**. This is the clean
trigger surface so "re-rank my inventory" (or "add a green bean") just works in a fresh
Claude Code session — no "read the doctrine first" needed.

> **Operator-direct, like the [roasting coordinator](docs/skills/roasting-coordinator/SKILL.md)** ([ADR-0017](docs/adr/0017-research-assistant-architecture.md) Exception 1) and the [`brew`](.claude/skills/brew/SKILL.md) skill. Not Master-Coordinator-dispatched, not MCP-registered. Chris triggers it directly.

This skill does **not** restate the ranking doctrine — it composes
[`cluster/inventory-rerank.md`](docs/skills/roasting-coordinator/cluster/inventory-rerank.md)
(the roasting coordinator's inventory-level operation). Read that doc in full at the start
of either operation: on desktop CC read the file directly; the substantive how-to lives
there, this file is just the reliable way in.

## The ranking model (one-paragraph recap — full version in the doctrine)

`roast_priority` is a **soft** stack-rank: lower = roast sooner. **Ranked-top + banded-tail** —
`1..K` is the genuine conviction front (sequential, the real "roast next" answer), `50` is the
"soon" band (shared, no strong order within), `90` is the "deferred/blocked" sentinel (shared,
with a blocker rationale), `NULL` is unranked (sorts last). Band gaps (`7..49` / `51..89`) stay
empty so inserts are cheap. Every ranked lot pairs `roast_priority` with a one-line
`roast_priority_rationale` that carries the softness. The `/green` inventory section renders in
this order.

## Operation A — Re-rank my inventory

Full re-pass over every in_inventory lot.

1. **Read the doctrine** — [`cluster/inventory-rerank.md`](docs/skills/roasting-coordinator/cluster/inventory-rerank.md) § Full re-rank.
2. **Read the current ranking** — call `list_green_inventory` (returns every in_inventory lot already sorted, each with `intake_hypothesis` + green specs + the current `roast_priority` / rationale). This is the working set; you reason over it and write each touched lot back.
3. **Pull the cross-lot doctrine** — ask Chris for the green inventory doc (`~/Dropbox (Personal)/Mac/Downloads/Green_Coffee_Inventory_Unroasted_V7.md`) if he has an updated "Suggested Roasting Order" / "Anchor Profile Distribution" to anchor on; otherwise reason from each lot's `intake_hypothesis` (already in the DB) + green specs.
4. **Reason the stack-rank** — assign `1..K` to the conviction front (sequential), `50` to the "soon" middle, `90` + a blocker rationale to the deferred lots.
5. **Write** each lot via `patch_green_bean({ green_bean_id, roast_priority, roast_priority_rationale })` (the `id` from the `list_green_inventory` row is the `green_bean_id` — no extra lookup).
6. **Confirm** the new top-of-queue order back to Chris; `/green` reorders to match.

## Operation B — Add a green bean to inventory

Log a newly-acquired green lot so it lands in inventory and slots into the queue. This is the
**light intake** — the lot sits `in_inventory`; it does NOT start the roast arc. (When Chris is
ready to roast it, that's the [roasting coordinator](docs/skills/roasting-coordinator/SKILL.md):
"start a new lot" authors the Brief + designs V1.)

1. **Gather the lot info** from Chris (or a pasted spec sheet / URL): name, lot_id, origin (country / region / macro terroir), cultivar, process, producer, density / moisture / elevation, quantity, price, link. Optionally an `intake_hypothesis` (anchor profile + confidence, gating flags) if Chris has a pre-roast read — it's a starting snapshot, not canon.
2. **Push it** — `push_green_bean(...)` resolves terroir + cultivar FKs against the canonical registries (lazy find-or-create) and lands the row `in_inventory`. UPSERT on `lot_id`, so a re-run is safe. (`push_green_bean` deliberately does NOT accept `roast_priority` — that's set in the next step.)
3. **Slot it into the ranking** — per [`cluster/inventory-rerank.md`](docs/skills/roasting-coordinator/cluster/inventory-rerank.md) § Intake-time insert: `list_green_inventory` to see the current order, decide the new lot's slot from its `intake_hypothesis` + specs + the green doc, then write only the touched lots via `patch_green_bean`. A lot that joins the ranked front at position `p` shifts `p..K` up by one (touches only the small front); a lot that drops into the `50` or `90` band touches nothing else.
4. **Confirm** placement ("landed in inventory, ranked #N / Soon / Deferred"), and remind Chris that starting the roast (V1 design) is a separate Coordinator session.

## Out of scope

Stops at "the lot is in inventory and ranked." Roasting it (V-sets, recipes, cuppings, declaring a
reference) is the [roasting coordinator](docs/skills/roasting-coordinator/SKILL.md) ("start a new
lot"). The queue is the `in_inventory` set only; the roasted-bean side is
[`freezer-stock`](.claude/skills/freezer-stock/SKILL.md).

## Cross-references

- [docs/skills/roasting-coordinator/cluster/inventory-rerank.md](docs/skills/roasting-coordinator/cluster/inventory-rerank.md) — the full ranking doctrine (composed, not restated)
- [docs/skills/roasting-coordinator/SKILL.md](docs/skills/roasting-coordinator/SKILL.md) — the roasting coordinator (the full per-lot roast arc; its step-1 intake is the heavy sibling of Operation B)
- [docs/architecture/data-model.md](docs/architecture/data-model.md) — the `roast_priority` / `intake_hypothesis` column notes
- [.claude/skills/brew/SKILL.md](.claude/skills/brew/SKILL.md) — the brewing-side operator-direct entry this mirrors
