# `cleanup` session (session 3 of 5) — kickoff brief

Redesign-polish punch-list, bucket 3. Hand-off from the `naming` session
([punch-list § Naming session outcomes](docs/features/redesign-polish-punchlist.md)).
Buckets run **one per session, sequentially**: `data-audit` ✅ → `naming` ✅ →
**`cleanup` (this one)** → `data-model` → `side-quest` MB-6.

## Session posture

**THIS IS A NORMAL EXECUTION SESSION, but every item is an interpretive "make it
cleaner — mostly by *removing* things" call. Capture-first: Chris will paste the
specific case he's seeing into THIS thread per area. Do NOT pre-decide which
elements to strip. The autonomy rule applies only AFTER Chris signs off on each
specific change.** All three areas are **page-local polish, no data work.**

## Goal

The `cleanup` bucket — three index/card surfaces that should read cleaner, all by
subtraction. Ship as one PR (or split if an area gets fiddly).

## Scope (in) — high-level only; wait for Chris's pasted specifics per area

1. **`/brews` card heights** — cards still load at inconsistent heights. This was
   **BI-1**, marked shipped in PR1 (#317) via [components/BrewCard.tsx](components/BrewCard.tsx)
   equal-height work — so this is a **reopen / residual**, not net-new. Chris will
   specify the exact case (likely a foot-height or grid-row-height mismatch). The
   v2 paper-foot split (face + warm-paper foot) shipped Redesign Sprint 6 PR3; the
   equal-height intent (longer producer info sizes the whole grid's cards up, a
   little negative space is fine) is the BI-1 spec. Likely `flex` column +
   `min-height` / CSS-grid `auto-rows`, in `.brew-card` ([app/globals.css](app/globals.css)).
2. **Cultivar index spine** — declutter the genealogical spine. **Note the
   history:** CI-1 was originally LOCKED to "build the ├ └ │ tree spline" but
   Redesign Sprint 6 PR2 **reversed that** and kept the **grl grouped-row list**
   (Species spine label + Family group header + `.grl-lineage` indented mono
   sub-label + cultivar `GrlRow`s). So the deployed index is NOT a ├└│ tree — it's
   grouped rows with an indented lineage label. **Confirm what Chris is seeing
   before editing** — the "declutter the spine" likely means the Species spine
   label and/or the `.grl-lineage` indent treatment, not a literal tree. Files:
   [app/(app)/cultivars/page.tsx](../../app/%28app%29/cultivars/page.tsx) + the
   `.grl-*` / `.grl-lineage` CSS in [globals.css](app/globals.css), possibly
   [components/IndexList.tsx](components/IndexList.tsx).
3. **Terroir index** — small removal-oriented cleanup on the grl grouped-row list
   ([app/(app)/terroirs/page.tsx](../../app/%28app%29/terroirs/page.tsx) + `.grl-*`
   CSS). Chris will specify.

## Scope (out)

- **`data-model`** (pour-structure parsing/storage) — session 4. **Opens with
  Chris's FULL AUDIO RECIPE READOUT** of several recipes, deliberately spanning
  complex + simplistic pour structures. **Do NOT start the parser/storage fix
  before that audio lands** — the storage-shape decision depends on seeing the
  real range. Treat it as a grilling/spec session first, build second (same
  capture-first pattern that made WC-2 land right).
- **MB-6** (green index card treatment) — session 5 side-quest, Chris will mock.
- `naming` + `data-audit` — shipped.
- The systemic cultivar-skeleton backfill + attach-resolved-brew feature — roadmap
  capstone after all 5 buckets ship.

## Files likely to touch

`components/BrewCard.tsx`, `app/globals.css` (`.brew-card` + `.grl-*`),
`app/(app)/cultivars/page.tsx`, `app/(app)/terroirs/page.tsx`, possibly
`components/IndexList.tsx`. **No `lib/`, no migrations, no MCP — render-layer only.**

## Verification

Preview at **1024 + 390** on `/brews` (card heights), `/cultivars`, `/terroirs`.
`/simplify`. tsc via the worktree node_modules symlink trick (`ln -sf
../../../node_modules node_modules`, `npx tsc --noEmit`, `rm node_modules` before
commit). `npm run build` if the symlink is in place. Squash-merge per autonomy
once each call is signed off. Update the punch-list (mark `cleanup` shipped + a
short outcomes block) + add a `shipped.md` row, same PR.

## End-of-session

Write the **`data-model` (pour-structure) kickoff brief** — and explicitly carry
the reminder that data-model opens with Chris's audio recipe readout; do not start
the parser before it lands. Then the only remaining bucket is `side-quest` MB-6,
after which the **product roadmap review / brainstorm capstone** runs.
