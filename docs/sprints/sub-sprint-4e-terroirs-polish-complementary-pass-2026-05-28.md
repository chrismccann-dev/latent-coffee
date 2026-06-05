# Sub-sprint 4e — Terroirs polish — Claude's complementary pass — 2026-05-28

Companion to [the kickoff brief](docs/sprints/sub-sprint-4e-terroirs-polish-kickoff-2026-05-28.md). Phase 2 of the 3-phase grilling sequence (Chris audit → this pass → plan-mode bundle). Mirrors the 4a–4d complementary-pass artifacts.

## Outcome up front

**The bundle is a single change: collapse `CollapsibleBlock` by default at all breakpoints (component-level).** Terroir confirmed as an informational surface (Chris's prior held). No schema work, no new render paths, no synthesis-prompt changes. Lightest bundle of the series alongside 4d.

## Chris's Phase 1 audit (captured)

Walked `/terroirs/[id]` (Northern Indian Highlands, Ecuador — 6 coffees) + `/terroirs` index.

- **Detail page §1–8 + §10 Confidence:** right ordering, right placement. Summary → meso → context → character → typical production → synthesis (6 coffees) → coffees brewed. Happy.
- **Index:** ordered by country, brew counts via FK join, coloring liked (Thailand now showing 2 coffees). Happy, no changes.
- **§9 Additional Information — the one fix:** content placement fine, but it must be **collapsed by default**. Chris noticed the asymmetry — collapsed on mobile, fully open on desktop — and explicitly extended it: *"that should also be there for the cultivar too… we should always have that bar be collapsed."* → component-level fix.
- **Brew-list/card inconsistency (deferred):** "Coffees Brewed From This Region" (terroir) renders differently from "Coffees I Have Brewed From This Roaster" (roaster) and the cultivar/process equivalents — same underlying thing, re-done per page. Chris wants one shared brew-list/card component, but flagged it as **low-priority, defer to a broader design exercise / later side-quest**. Not in 4e.

## Phase 2 substrate cross-check

`execute_sql` is not exposed on this MCP server (only PostgREST read tools), so the render-path audit was run statically against `lib/types.ts` `Terroir` + `app/(app)/terroirs/[id]/page.tsx`.

### Render-path audit — clean (no 4d-style unrendered column)

Every content column on the `Terroir` interface has a render path:

| Column | Renders in |
|---|---|
| `country` / `admin_region` / `macro_terroir` | Hero (title + breadcrumb + country color) |
| `meso_terroir` | §3 Meso Terroirs (comma-split → union-merged) |
| `elevation_min` / `elevation_max` / `climate_stress` | Hero meta line |
| `context` | §2 High Level Summary |
| `soil` / `cup_profile` / `why_it_stands_out` | §4 Terroir Context |
| `acidity_character` / `body_character` / `farming_model` | §5 Terroir Character |
| `dominant_varieties` / `typical_processing` | §6 Typical Production |
| `synthesis` / `synthesis_brew_count` / `short_form_capsule` / `synthesis_input_max_updated_at` | §7 SynthesisCard |
| `user_id` / `created_at` / `updated_at` | internal (correctly unrendered) |

The `Terroir` type is **leaner than `Cultivar`** — there is no `terroir_notes` / `terroir_confidence` / `terroir_raw` / `terroir_source` analog to the 4d catch (`cultivar_notes` + `cultivar_confidence` populated-but-unrendered). Provenance fields (`terroir_provenance`, `canonicals_updated_at`) live on `green_beans` / `brews`, NOT on the `terroirs` table, so there is no terroir-table provenance render to consider.

### Merge logic — drops nothing

`mergeMacroTerroirContext(terroirs)` aggregates all rows sharing `macro_terroir + country`: first-non-null for scalars (`context` / `soil` / `cup_profile` / `why_it_stands_out` / `climate_stress` / `acidity_character` / `body_character` / `farming_model`), comma-split union for `meso_terroir`, set-union for `dominant_varieties` / `typical_processing`, min-of-mins / max-of-maxes for elevation. Covers every content column; no populated field is dropped.

- **Cosmetic note (no action):** the hero's `admin_region` reads from the *clicked* terroir row, not the merge. If two rows in a macro have divergent admin_regions, the hero shows the clicked one. Same country, admin_region rarely diverges within a macro — not a bug for Chris's use. Flagged for completeness.

### Synthesis gate — pre-existing cross-page inconsistency (flag only)

Terroir renders the SynthesisCard at `brewList.length > 0` (≥1 brew). Cultivar gates at `brewList.length >= 2` (1-brew cultivars hide the card; LOW confidence carries the message). The two informational surfaces differ. Chris is happy with the terroir page as-is → **no action in 4e**; candidate for the deferred design exercise if cross-page consistency ever matters.

## The fix — `components/CollapsibleBlock.tsx`

Current behavior: renders two trees — desktop (`hidden md:block`) is an always-open SectionCard with **no toggle**; mobile (`md:hidden`) is a `<details>` collapsed by default. So on desktop the block is always expanded.

Planned change: collapse the dual-tree into a **single `<details>` element, closed by default, at all breakpoints** — styled as the SectionCard (the existing mobile-tree styling: mono-uppercase `text-xxs` title, `group-open:rotate-180` ▾ chevron, white card + `latent-border`). This:
- Collapses by default on desktop (the fix) AND keeps mobile collapsed (unchanged).
- Renders children once (removes the "children re-mount across the breakpoint" caveat in the current JSDoc).
- Is a single component edit that propagates to all 7 consumers.

**Propagation — all 7 consumers (all pass static prose/links, safe inside `<details>`):**
- `app/(app)/terroirs/[id]/page.tsx` — §9 Additional Information (the audited page)
- `app/(app)/cultivars/[id]/page.tsx` — §8 Additional Information (Chris's explicit "fix cultivar too")
- `app/(app)/roasters/[slug]/page.tsx` — §8 Additional Information
- `app/(app)/brews/[id]/page.tsx` — §7 Full Brew Notes
- `app/(app)/processes/[base]/page.tsx`
- `app/(app)/processes/modifiers/[modifier]/page.tsx`
- `app/(app)/processes/signatures/[name]/page.tsx`

This matches Chris's stated intent ("always have that bar be collapsed") and is the cleaner code path.

## Six-actor audit (substrate-change trace)

This is a **UI-only component behavior change** — no schema, no canonical, no Tool, no prompt vocabulary. Most hops are no-ops:

- **Actor 6 (schema/UI):** `components/CollapsibleBlock.tsx` behavior change. Touches 7 page render outputs. ✓ in scope.
- **Actor 4 (MCP):** no Tool/Resource change. N/A.
- **Actor 5 (Claude Code):** CLAUDE.md mentions `CollapsibleBlock` as "pure-CSS responsive disclosure… renders two trees… `hidden md:block` for desktop + `md:hidden` `<details>` for mobile." That description goes stale with this change — **must update the brews-detail-primitives bullet in CLAUDE.md § Brews** to reflect the single-`<details>` collapsed-by-default shape. ✓ in scope.
- **Actor 2 (prompts):** no prompt references the component. N/A.
- **Actor 3 (claude.ai):** no Tool/Resource catalog change. N/A.
- **Actor 1 (Chris):** the rendered Additional Information blocks across terroir / cultivar / roaster / brews / processes now collapse by default on desktop. ✓ the intended outcome.

## Verification plan

- `preview_start` + screenshot `/terroirs/[id]` (Northern Indian Highlands) — confirm Additional Information renders collapsed on desktop with a toggle bar; click to expand.
- Spot-check `/cultivars/[id]` + `/roasters/[slug]` + `/brews/[id]` + one `/processes/*` — confirm the same collapsed-by-default behavior, no layout regression.
- `preview_resize` to mobile — confirm mobile behavior unchanged (still collapsed).
- `npx tsc --noEmit` in main repo (per build-hygiene rule).

## Sprint-close housekeeping

- Update CLAUDE.md § Brews `CollapsibleBlock` description (Actor 5 above).
- Add `docs/sprints/shipped.md` row.
- Move/annotate PRODUCT.md § Active Sprints #4 (Read-path series) — 4e is the 5th sub-sprint; 6th (processes) likely next.
- Add the **brew-list/card unification** deferred item to PRODUCT.md § Side Quests.
- Roadmap currency per `feedback_sprint_closeout_roadmap_currency.md`.

## Out of scope (deferred)

- Brew-list/card component unification (cross-page; broader design exercise / side-quest).
- Synthesis-gate cross-page consistency (terroir ≥1 vs cultivar ≥2).
- Any schema / MCP / synthesis-prompt change.
