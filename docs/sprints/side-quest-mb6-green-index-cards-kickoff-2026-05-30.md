# `side-quest` MB-6 — green index card treatment (session 5 of 5) — kickoff brief

Redesign-polish punch-list, bucket 5 — the **final** bucket. Hand-off from the
`data-model` session ([punch-list § Data-model session outcomes](docs/features/redesign-polish-punchlist.md)).
Buckets run **one per session, sequentially**: `data-audit` ✅ → `naming` ✅ →
`cleanup` ✅ → `data-model` ✅ → **`side-quest` MB-6 (this one)**.

After MB-6 ships, the explicit capstone is the **product roadmap review / brainstorm**
(the deferred /producers · /experiments · homepage trio + the systemic
cultivar-skeleton backfill + the attach-resolved-brew affordance all stay parked
behind it).

## ⚠️ THIS IS OPTIONAL + DESIGN-INTERPRETIVE. WAIT FOR CHRIS'S MOCK. ⚠️

MB-6 is explicitly **"optional design sprint in side quests, not critical"**
(Chris's words, punch-list MB-6). Chris said **he'll mock it up**. So this is a
capture-first session like `data-model` / WC-2 / `cleanup`: **do NOT design the
card shape cold** — wait for Chris's mock (or audio) of what the green card grid
should look like, then build to it. Default to **ask-don't-ship on the card
shape**; the autonomy rule applies only AFTER Chris signs off the design.

## Goal

MB-6 — give the `/green` index a **brew-card-style card grid** treatment
(optionally; Chris likes the `/brews` book-cover card look on mobile and wonders
about giving `/green` a similar card grid instead of the flat lifecycle list).
The open question Chris's mock resolves: **does the lifecycle-list IA survive
inside cards, or does the card grid reshape it?**

## The starting point (what exists today)

- `/green` index is a **flat lifecycle list** (Redesign Sprint 6 PR1 kept it flat,
  NOT the v2 lot-card grid, per Chris's call at the time — see CLAUDE.md § Green
  Bean Index). It renders 4 lifecycle sections top-to-bottom (Waiting for next
  roast → Waiting for next cupping → Resolved → Unresolved) via `<IndexCap>` +
  `<LotStage>` section headers + `<GrlRow>` rows in their `.simple` variant
  (44px state-color tile + lot name + ellipsized `origin · variety · process`
  meta + right-aligned stage/status label). Tile color signals lifecycle state
  via the `TILE_COLOR` map (`--tile-next-roast` sage / `--tile-next-cupping`
  olive-bronze / `--tile-resolved` roasted-brown / `--subtle` gray unresolved).
- The `/brews` card it'd emulate is `components/BrewCard.tsx` (Redesign Sprint 6
  PR3): a colored cover **face** (big mono title + process + flavor + strategy
  pill) + warm-paper **foot** (producer / region / via-roaster), in a
  `grid-cols-1 sm:2 md:3 lg:4 xl:5` responsive grid.

## The tension to resolve with Chris (don't pre-pick)

The v2 redesign's §04 actually specified a **lot-card grid with experiment-frame
payload** for `/green`, and Redesign Sprint 6 PR1 *deliberately rejected it* in
favor of the flat list (Chris's call: the lifecycle list reads cleaner than cards
carrying V-set/experiment payload). MB-6 reopens that — so the real question for
the mock is:
- **What does a green lot card show on its face?** A `/brews` card's face is
  identity + flavor; a green lot has no single "flavor" — it has a lifecycle
  state, a reference/leading batch, a primary question, V-set progress. Which of
  those is the face, which is the foot?
- **Does the card grid keep the 4 lifecycle sections** (cards grouped under
  Waiting-for-roast / cupping / Resolved / Unresolved headers) **or flatten to
  one grid** with state shown per-card (tile color / a state pill)?
- **Mobile-first?** Chris flagged this as a *mobile* observation ("I like the brew
  index card look on mobile"). The `/brews` grid is `1→2→3→4→5`; green has far
  fewer lots (~13), so a card grid may look sparse on desktop — confirm whether
  this is mobile-primary with a desktop fallback, or both.

## Files likely to touch (render-layer; confirm after the mock)

- `app/(app)/green/page.tsx` — the index render (currently flat list).
- `components/IndexList.tsx` — `GrlRow` / `LotStage` (the flat-list primitives);
  a green card would either extend these or get a new `GreenCard` primitive
  parallel to `BrewCard.tsx`.
- `components/BrewCard.tsx` — the reference card shape to emulate (read, don't
  necessarily reuse — a green lot's data model differs).
- `app/globals.css` — `.brew-card` / `.grl-*` / `--tile-*` lifecycle gradient
  tokens (already exist; a green card likely reuses the tile gradient).
- New `components/GreenCard.tsx` likely, if the shape diverges enough from
  `BrewCard` (parallel primitive, per the index-family pattern).

## Likely NOT in scope (flag, don't fold in)

- The v2 experiment-frame payload on the card (V-set progress, primary question
  on the face) — Chris rejected that complexity once already; only revisit if his
  mock explicitly brings it back.
- `/green/[id]` detail views — untouched (those are all `Ssp*` post Redesign
  Sprint 4). MB-6 is index-only.
- Lifecycle-state derivation logic (`lib/lifecycle-state.ts`) — the card grid is a
  render of the same computed states; no state-machine change.

## Verification

Preview `/green` index @1024 + 390 — the card grid renders all lifecycle states
correctly (tile/state color per card, reference batch on resolved, no clipped
content), matches Chris's mock, and the flat-list → card-grid swap doesn't lose
the 4-section IA (or intentionally flattens it per the signed-off design). tsc via
the worktree node_modules symlink trick (`ln -sf ../../../node_modules
node_modules`, `npx tsc --noEmit`, `rm node_modules`); `npm run build` if a route
or shared lib changed. `/simplify`. Squash-merge per autonomy **once the card
design is signed off** + the build is done. Update punch-list (MB-6 outcomes +
mark the bucket sequence complete) + shipped.md same PR.

## Six-actor

Almost certainly **render-layer only** (Actor 6 UI + Actor 5 docs: CLAUDE.md §
Green Bean Index + punch-list + shipped.md). Actors 1-4 no-op unless the mock
surprisingly pulls in new data the card needs (then trace it). MB-6 closes the
redesign-polish punch-list — note that in the outcomes block.

## End-of-session

MB-6 is the LAST bucket. End the session by writing the **product roadmap review /
brainstorm** kickoff (the capstone) — pull the parked items together: the deferred
/producers · /experiments · homepage trio, the systemic cultivar-skeleton backfill
(Mokka / Wush Wush / SL28 / Khun Lao / Mandela + an MCP cultivar-content write
path), and the "attach resolved brew to lot" affordance. That brainstorm is a
roadmap-shaping session, not an execution one — frame it as such (grilling/spec
posture, not the autonomy rule).
