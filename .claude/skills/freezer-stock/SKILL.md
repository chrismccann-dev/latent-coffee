---
name: freezer-stock
description: >-
  Add or update a PURCHASED roasted-coffee bag in the freezer-stock inventory
  (docs/brewing/freezer-stock.md), the brewing-side roasted-bean lookup. Use when Chris
  says "add a roasted bag to my freezer", "add this to my freezer stock", "I have a new
  roasted coffee to log", "I just froze a bag", "mark <coffee> as frozen", or pastes a
  roaster spec sheet / URL for a bag he's resting or freezing. Appends/updates an entry in
  the canonical field shape (whole-bean Agtron is load-bearing). PURCHASED roasted coffees
  only — self-roasted beans live in the DB as their green_beans lot, NOT here.
---

# Freezer Stock (roasted-bean inventory entry)

The **operator-direct entry** for the brewing-side roasted-bean inventory: adding (or
updating) a **purchased roasted bag** in [`docs/brewing/freezer-stock.md`](docs/brewing/freezer-stock.md).
This is the clean trigger surface so "add a roasted bag to my freezer" just works in a
fresh Claude Code session — the roasted-bean parallel of the [`green-inventory`](.claude/skills/green-inventory/SKILL.md)
skill.

> **Operator-direct, like [`green-inventory`](.claude/skills/green-inventory/SKILL.md) + [`brew`](.claude/skills/brew/SKILL.md).** Not Master-Coordinator-dispatched, not MCP-registered. Chris triggers it directly.

## The asymmetry (why this is a doc, not the DB)

Green inventory is the `green_beans` **table** (tracked from intake). Roasted inventory is a
**markdown lookup doc** — because brewing is **resolution-only** (the upload-on-resolution
rule, [feedback_upload_on_resolution.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_upload_on_resolution.md)):
a brew row only lands in the DB when it's the *optimized* brew. So freezer-stock is a
pre-brew **convenience cache**, not source of truth. Its whole job: at brew time the
[`brew`](.claude/skills/brew/SKILL.md) skill matches a purchased coffee by `Roaster — Coffee`
and pulls the whole-bean Agtron + specs, so Chris isn't asked to re-measure.

**Purchased coffees only.** A self-roasted bean is NOT logged here — it's already in the DB
as the output (roasts) of its `green_beans` lot. If Chris is describing something he roasted
himself, redirect: that's the roasting side, not freezer stock.

## The entry shape (match it exactly)

Every entry is a `##` block in this fixed shape — copy a neighbor's formatting (middle dots
`·`, bold labels):

```
## <Roaster> — <Coffee>
**Country:** <country> · **Region/Farm:** <region / farm> · **Producer:** <producer>
**Variety:** <variety> · **Process:** <process> · **Elevation:** <elev> m
**Agtron:** <NN.N (color descriptor)> · **Status:** <Frozen (15g doses) | Resting>
**URL:** <spec / purchase URL>
**Notes:** <rest window, collab, anything brew-relevant>
```

**Agtron is the load-bearing field** (whole-bean, taken at dose-out):
- `NN.N (color descriptor)` — measured; authoritative; this is what the brew skill uses.
- `pending` — paired with **Status:** `Resting` (purchased + resting, not yet dosed → no reading yet).
- `(reading lost — not saved)` — measured but not captured; treat as unknown.

**Status:** `Frozen (15g doses)` = dosed into 15g vials + frozen, Agtron taken · `Resting` =
purchased, resting out of the freezer, not yet dosed (Agtron `pending`).

## Operation A — Add a bag

1. **Confirm it's purchased** (not self-roasted — see the asymmetry above). If self-roasted, redirect to the roasting side and stop.
2. **Gather the fields** from Chris (or a pasted spec sheet / URL): roaster, coffee name, country, region/farm, producer, variety, process, elevation, URL, notes. And the **state**: is it **Frozen** (dosed + Agtron read now — get the whole-bean Agtron reading) or still **Resting** (Agtron `pending`)?
3. **Append the entry** to [`docs/brewing/freezer-stock.md`](docs/brewing/freezer-stock.md) in the exact shape above (edit the file directly; entries are append-order, newest is fine at the end). **Bump the `**Total coffees:**` count** at the top by one.
4. **Confirm** back to Chris (`<Roaster> — <Coffee>` logged, Frozen/Resting, Agtron `<value>`).

## Operation B — Update a bag (Resting → Frozen, or a late Agtron)

Common: a bag was logged `Resting / pending`, then Chris doses + freezes it and takes the
reading. Find the entry by `Roaster — Coffee` (substring match, tolerate drift), flip
**Status** to `Frozen (15g doses)`, and replace `Agtron: pending` with the measured value.
No count change (the entry already exists).

## Write path

This is a **doc edit**, not an MCP entity write — freezer-stock is reference substrate, not a
DB table, so a CC session edits the markdown directly (consistent with how living docs are
maintained; the MCP-only-input rule governs *entities* — brews / green_beans / roasts — not
this lookup doc). On a client without repo filesystem write (mobile), format the entry in the
exact shape and either land it via `propose_doc_changes(uri="docs://brewing/freezer-stock.md", ...)`
or hand the formatted block to Chris to commit. The brew row still carries the authoritative
data — a freezer-stock miss is expected and harmless (it's a cache).

## Out of scope

- **Self-roasted beans** — those live in the DB as their `green_beans` lot's roasts; never logged here.
- **Brewing the coffee** — that's the [`brew`](.claude/skills/brew/SKILL.md) skill (which *reads* this doc at Step 1).
- **A "what to brew next" ordering** — the roasted-bean analog of the green roast-queue stack-rank is parked (future).
- **Backfill** — the doc is complete going forward (pack-time), intentionally not backfilled; a missing older coffee is normal.

## Cross-references

- [docs/brewing/freezer-stock.md](docs/brewing/freezer-stock.md) — the inventory doc itself (its header documents the field shape + Agtron/Status semantics in full)
- [.claude/skills/brew/SKILL.md](.claude/skills/brew/SKILL.md) — the brewing entry that consumes this doc at brew time (the reason the Agtron is load-bearing)
- [.claude/skills/green-inventory/SKILL.md](.claude/skills/green-inventory/SKILL.md) — the green-bean parallel (the DB-side inventory; this is the doc-side inventory)
- [feedback_upload_on_resolution.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_upload_on_resolution.md) — why roasted inventory is a doc, not the DB
