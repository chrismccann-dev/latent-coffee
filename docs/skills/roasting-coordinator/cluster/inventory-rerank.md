# Inventory roast-queue re-rank (what to roast next)

The Coordinator's **inventory-level operation** — distinct from the per-lot arc. It answers one question: *of the lots sitting in inventory, which do I roast next?* The answer is a **soft stack-rank** written to `green_beans.roast_priority` (+ `roast_priority_rationale`), which the `/green` inventory section sorts by. Two entry modes share this doctrine: a **full re-rank** ("re-rank my inventory") and an **intake-time insert** (a new lot is added; slot it into the existing order).

This is operator-triggered, Claude-Code-only. No auto-touch on lifecycle transitions; the rank is a deliberate snapshot, the same way `intake_hypothesis` is.

## The ranking model — ranked top + banded tail

The ordering is **soft** — past the first few lots, "roast #7 before #8" is rarely a real opinion. The integer scheme is honest about that:

- **`1..K` — the conviction front.** Sequential, unique. The lots you genuinely have an order for (typically `K ≤ ~6`). `1` is the literal next-up lot. This is the real "what to roast next" answer.
- **`50` — the "soon" band.** Shared across the active middle: in play, no strong order within. `/green` tiebreaks these by `created_at` desc.
- **`90` — the "deferred / blocked" sentinel.** Shared across lots with a hard dependency that can't compete for a roast slot yet (see below).
- **`NULL` — unranked.** A lot that hasn't been through a re-rank (e.g. freshly pushed, pre-insert). Sorts **last** — below even the `90` deferred lots — which is the signal "this needs an insert pass."

The gaps are deliberate. **`7..49` and `51..89` stay empty** so a later insert can drop a lot between bands, or extend the front, without renumbering anything. That gap is what makes the intake-time insert cheap.

**The rationale carries the softness the integer can't.** Every lot you rank gets a one-line `roast_priority_rationale` — "roast next: peak freshness + washed anchor locked", "soon: no strong order within band", "deferred — blocked on Gesha Clouds reference". The integer sorts; the rationale explains.

## Deferred lots — sentinel, not NULL

Lots with a hard dependency (e.g. a Gesha waiting on the Gesha Clouds reference resolution, a lot waiting on a 96B baseline) get `roast_priority = 90` **and** an explicit `"deferred — blocked on <X>"` rationale. **Not NULL.** A `90`-with-rationale records that the deferral was *deliberate*; a NULL is indistinguishable from "never looked at." Both sort low, but only one tells the story. When the blocker clears, a re-rank (or insert) promotes the lot out of `90` into its real slot.

## Inputs

- **The current ranking** — read all in_inventory lots in one call: `list_green_inventory` returns them already sorted (`roast_priority` asc, NULLs last), each row carrying `intake_hypothesis` + green specs (`density` / `process` / `quantity_g`) + `lot_status` + the current `roast_priority` / `roast_priority_rationale`. This is the working set; you reason over it and write each touched lot back.
- **Per-lot signal** — each lot's `intake_hypothesis` already holds the raw ranking inputs (anchor profile + confidence, density/process gating flags, deferral status, PRIORITY callouts, lot size/budget). **Read it; don't re-derive from scratch.**
- **The doctrine** — the operator-couriered green inventory doc (`Green_Coffee_Inventory_Unroasted_V7.md`): its **"Suggested Roasting Order"** + **"Anchor Profile Distribution"** + deferred/gated flags are the governing intent. The DB `intake_hypothesis` mirrors this doc per-lot; the doc holds the cross-lot ordering rationale (freshness windows, anchor-family balance, budget pacing).

## Full re-rank ("re-rank my inventory")

1. `list_green_inventory` → the working set.
2. Reason the complete stack-rank from each lot's `intake_hypothesis` + green specs + the green doc's Suggested Roasting Order / Anchor Profile Distribution.
3. Assign: `1..K` to the conviction front (sequential), `50` to the "soon" middle, `90` + blocker rationale to the deferred lots.
4. Write each lot via `patch_green_bean({ green_bean_id, roast_priority, roast_priority_rationale })`. (Get `green_bean_id` from the `id` in the `list_green_inventory` row — no extra lookup.)

## Intake-time insert (new lot added)

When a new lot enters inventory (`push_green_bean` at lot intake — which deliberately leaves `roast_priority` NULL), slot it in without a full reshuffle:

1. `list_green_inventory` → see the current order.
2. Decide the new lot's slot from its `intake_hypothesis` + green specs + the green doc:
   - **Joins the front at position `p`:** set the new lot to `p`, and shift the existing front lots at `p..K` up by `+1`. Only the small front renumbers (this is the only case that touches sibling lots).
   - **Belongs in "soon":** set `50`. No renumber.
   - **Deferred / blocked:** set `90` + blocker rationale. No renumber.
3. Write only the touched lots via `patch_green_bean`.

The band gaps mean the common cases (soon / deferred) touch exactly one lot, and a front insert touches only `1..K`. This is why the banded scheme beats a strict `1..N` total order, where every insert reshuffles the whole list.

## Hard rules

1. **Operator-triggered only.** Don't re-rank as a side effect of a roast / cupping / close. The rank is a deliberate snapshot.
2. **`roast_priority` is Coordinator-maintained.** `push_green_bean` does not accept it by design — it is only ever written via `patch_green_bean` from this operation. Don't try to set it at intake.
3. **Always pair the integer with a rationale.** A bare integer with no `roast_priority_rationale` loses the softness; never write one without the other.
4. **Deferred = `90` + reason, never NULL.** Reserve NULL for genuinely-unranked lots.
5. **Don't over-precision the tail.** If you don't have a real opinion on the order of two lots, both go in a band — don't manufacture a `1..N` sequence to look decisive.

## Read-path fallback

If `list_green_inventory` is unavailable (e.g. the schema change hasn't deployed yet), the operator pastes the green inventory doc as the lot set + doctrine, and you resolve each lot's `green_bean_id` via `get_green_bean({ lot_id })` before patching. Chattier (one read per lot) and the insert can't cheaply see the current ranking — prefer `list_green_inventory`.

## Where it fits

The re-rank is the **pre-lot** step: it decides which lot the next "start a new lot" intake should pull. It runs inventory-scoped — it does **not** adopt a single lot's Brief (no `docs/lots/<lot>.md` reconstruct). The output feeds the per-lot arc; the per-lot arc never writes the queue rank. See [SKILL.md § Workflow scope](docs/skills/roasting-coordinator/SKILL.md) for where intake slots the new lot in, and [data-model.md](docs/architecture/data-model.md) for the `roast_priority` column.
