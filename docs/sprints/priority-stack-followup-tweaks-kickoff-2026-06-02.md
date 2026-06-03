# Kickoff — Priority-stack recount follow-up (standalone tweaks)

> Paste-ready brief for a fresh Claude Code session. Small, independent IA tweaks from
> the 2026-06-02 design-system priority-stack recount. Each is low-risk and stands
> alone — do them as one session or cherry-pick. **Execution session** (not grilling):
> the autonomy rule applies. All are visual, so preview each touched surface at 390 +
> 1024 and screenshot before merge. One item (#4) is bigger than the rest — see note.

## Background

These came out of the page-by-page priority recount that produced the **priority stack**
model. See [docs/design-system.md § Detail-page grammar](../design-system.md) for the
model. Doc PR: #354 (main `5eef651`). The green-view files are
`app/(app)/green/[id]/page.tsx` + its view components; the lifecycle states + per-view
shapes are documented in `docs/architecture/page-ia.md § Green`.

## Goal

Knock out the small IA adjustments the recount surfaced. None change data or schema —
they change default-collapse state, block placement, and one section's composition.

---

## Tweak 1 — Collapse `green-bean-info` by default on all `/green` detail views

The green-bean info card renders **open** on some views; across the recount Chris
flagged on every green surface that it's informational and should be collapsed by
default. Make it a collapsed `details.ssp-coll` / `CollapsibleSection` on
waiting-for-roast, waiting-for-cupping, resolved, and unresolved.
**File:** the `GreenBeanInfoCard` consumers in `app/(app)/green/[id]/page.tsx` + view
components. Recurring rule — apply uniformly.

## Tweak 2 — Collapse Anchor Baseline by default (waiting-for-roast)

On the waiting-for-next-roast view, the "Anchor baseline we're moving from" block should
collapse by default (Chris: less important than the recipe/drop-rules + primary
question). **File:** `WaitingForNextRoastView` (the `.ssp-anchor-line` / anchor block in
`app/(app)/green/[id]/page.tsx`).

## Tweak 3 — Relocate the out-of-place "Reference Recipe Design Intent" block (resolved)

On the resolved `/green` view, the "Reference Recipe Design Intent" block feels out of
place — it's really just that roast's drop rules. **Decide with Chris:** cut it, or move
it into the Additional Information collapse / directly under the reference-roast recipe.
**File:** `ResolvedView` / `ArchiveLotBody` in `app/(app)/green/[id]/page.tsx`.
**Open question:** keep-but-relocate vs cut.

## Tweak 4 — Recompose the resolved Reference Cup section *(bigger — consider splitting out)*

Chris's most substantive resolved-view ask. The Reference Cup section should mirror
`/brews/[id]` more closely:
- Pull in the **optimized-brew recipe card** (the actual brew on the winning roast).
- Surface the **tasted flavor notes + structure** + **peak expression** from that brew.
- Present a clear contrast: **cupping-table taste vs optimized-brew taste vs producer
  notes**.
- Group the **best-cup-synthesis** *with* the optimized brew (currently reads as
  separate/out-of-order).

**Files:** `ResolvedView` / `ArchiveLotBody` in `app/(app)/green/[id]/page.tsx`; reuse
`/brews/[id]` recipe + flavor + peak primitives (`SspKVStrip`/`SspRecipeHead`,
`SspFlavorAxis`/`FlavorNotesByFamily`, the peak-expression block) rather than
reinventing. **Verification:** preview a rich resolved lot — Costa Rica Higuito (lot
`79d0f814-8682-43ff-b6e0-6906aa8dd1a0`) or CGLE Sudan Rume — at 1024 + 390.
**Note:** this is the heaviest tweak; if it grows, split it into its own mini-sprint and
ship 1–3 + 5–6 first.

## Tweak 5 — Paginate / cap `/brews` index + per-roaster Coffees list

Both lists grow unbounded (89 brews today; per-roaster lists compound). Add
pagination or infinite-scroll, cut at ~20–50 with "show more". **Files:**
`app/(app)/brews/page.tsx` + `components/BrewCard` grid; `components/CoffeesList.tsx`
(the per-roaster list — it already has a 10+`<details>` expander, so confirm whether
that's sufficient or wants real pagination). Lowest urgency of the five.

## Tweak 6 — Short "what is this process" description on `/processes` variant pages

Base-process pages have a description; **variant** pages (e.g. darkroom-dried natural)
don't. Add a short "what this process is" line. **Nice-to-have, low priority — IA-nicer,
not urgent** (Chris's framing). **Files:** `app/(app)/processes/modifiers/[modifier]/page.tsx`
+ the variant/combo pages.
**Open question:** source of the description text — process registry
(`lib/process-registry.ts`), a new authored field, or claude.ai-written via
`propose_doc_changes`? Decide the source before building.

---

## Close-out

- Preview every touched surface at 390 + 1024; screenshot before merge.
- `npm run build` / `tsc --noEmit` (main repo) before push — all touch TSX.
- Move the resolved items out of `PRODUCT.md § Longer Term Items § Small /
  opportunistic` and add a `shipped.md` row for whatever ships.
- Six-actor: Actor 6 (UI only). No schema / MCP / prompt. (Tweak 6 may touch a registry
  or trigger a `propose_doc_changes` depending on the text-source decision.)
