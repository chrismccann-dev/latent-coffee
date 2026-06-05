# Sub-sprint 4c — Brews polish bundle — kickoff 2026-05-28

**Series**: Read-path surface polish series (PRODUCT.md § Active Sprints #4) — third sub-sprint, opened immediately after Sub-sprint 4b (Roasters polish) closed 2026-05-28 (2 PRs: [#281](https://github.com/chrismccann-dev/latent-coffee/pull/281) Bundle A / [#283](https://github.com/chrismccann-dev/latent-coffee/pull/283) Bundle B).

## Why brews is next

Per Chris audio 2026-05-26 ("which ones I view most often naturally on my own"): `/brews` is the third most-visited surface after green beans + roasters. Sub Pages 1 (2026-05-09) re-ordered `/brews/[id]` around the "about to brew/serve" job and shipped the recipe-anchor reorder + CollapsibleBlock pattern. The polish sprint is lived-use sharpening on that foundation, not substrate redesign.

## How this differs from 4a + 4b

| Dimension | 4a Green-bean | 4b Roasters | 4c Brews |
|---|---|---|---|
| Pages | Index + detail with 5 state-dispatched view-shapes | Index + detail (one shape) | Index + detail (one shape) |
| Lines | 1936 in `[id]/page.tsx` alone | 349 in `[slug]/page.tsx` + 118 in `page.tsx` | 349 in `[id]/page.tsx` + 180 in `page.tsx` + 331 in `BrewsFilterBar.tsx` |
| Lifecycle state | Yes, derived helper | None | None |
| Major recent investment | Sub Pages 6 series (6.1-6.8) + 4a | Sub Pages 5 (2026-05-11) | Sub Pages 1 (2026-05-09) + design-polish PR #14 + cross-dim filters + mobile polish |
| Substrate touched | lifecycle helper + new view-shape + 3 mockups + 4 PRs | New 3-state field + render gate + 5 PRs (kickoff + plan + Bundle A + handoff + Bundle B) | Likely 1-2 PRs of UI tweaks + maybe component-extraction cleanup |
| Sizing estimate | 1-2 stacked sprints (took 5 PRs in one session) | ~1 sprint, 2 bundles | ~1 sprint, narrower — could plausibly be 1-2 bundles |

## ⚠️ NOT a planned-execution sprint

Same rule as 4a + 4b: **default mode = LISTEN, DO NOT EXECUTE.** The autonomy rule does NOT apply until you've done your audit + Claude's complementary pass + a bundled plan + ratified the open decisions. Treat as a grilling-shaped session per [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md).

**Failure mode to avoid**: opening the session, glancing at the radar items below, and starting to fix "Pour-structure rendering on small screens" because it looks mechanical. Wait for the full bundle.

## Process — 3 phases, strictly sequential

### Phase 1 — Chris's page-by-page audit (Chris-driven, single session likely sufficient)

Walk the index + detail page line-by-line. Brews is the simplest read surface in scope — one shape per page, no lifecycle dispatch — so one focused pass should cover it.

**Pages to walk:**

1. **`/brews` (index)** — [app/(app)/brews/page.tsx](app/%28app%29/brews/page.tsx) (180 lines). Grid of book-cover cards; all content sits on the cover (variety / process / producer / region top-left, extraction-strategy chip top-right, flavor notes bottom). Strategy filter pills above the grid. Server-side filtering via `searchParams.strategy`. Responsive: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`.
2. **`/brews` filter bar** — [components/BrewsFilterBar.tsx](components/BrewsFilterBar.tsx) (331 lines). Cross-dim filters (added Sprint 1, 2026-04-21). Below `md:` (768px) collapses behind a single "FILTERS (N) ▾" `<FilterTrigger>` button; 4 dimension rows + popovers render fully at `md:` and up. `FilterPopover` dropdown anchors `right-0 md:left-0` with `max-w-[calc(100vw-3rem)]` for 375px viewport safety.
3. **`/brews/[id]` (detail)** — [app/(app)/brews/[id]/page.tsx](app/%28app%29/brews/%5Bid%5D/page.tsx) (349 lines). 7 sections top-to-bottom (post Sub Pages 1 rethink 2026-05-09):
   1. **Header** — cover + title + ROASTED/PURCHASED badge + Variety/Roaster/Producer meta + Batch # for self-roasted. Edit button removed in Writing-path Sub-sprint 4 (2026-05-27).
   2. **Reference Brew Recipe** (page anchor) — `<RecipeTable>` (Brewer/Filter/Dose/Water/Grind/Temp) + Bloom subblock + `<PourStructureList>` + Drawdown footer + `<StrategyPill variant="row">` + Modifier pills + Modifier Detail subblock.
   3. **Presentation Overview** — flavor + structure pills (`Axis:` prefix stripped on structure tags).
   4. **Peak Expression** — high-contrast dark card.
   5. **Coffee Overview** — 4 leaf-level tag rows with breadcrumbs (Roast Level / Cultivar with `species → genetic_family → leaf` / Process / Terroir with `country → admin_region → leaf`). Deep hierarchies live on aggregation pages.
   6. **What I Learned** — high-contrast dark card, promoted up the page.
   7. **Full Brew Notes** (renamed from "Additional Information") — `<CollapsibleBlock>` mobile-collapsed catch-all. Contains Sensory Notes / Temperature Evolution / Key Takeaways always; renders strategy_notes / cooling_curve_target / terroir_connection / cultivar_connection / classification conditionally.

**Walk a representative sample.** 79 brews as of 2026-05-09. Walk at minimum: 1 purchased + 1 self-roasted (Latent) + 1 Hybrid (multi-phase recipe / hybrid_subform) + 1 with `extraction_confirmed` divergence + 1 with rich modifiers + 1 with deep flavor notes. Sparse-data brews (missing pour structure / missing cooling curve / no terroir_connection) should auto-hide gracefully — verify.

**For each surface, note:**
- **Info design** — is this the right data here?
- **UX design** — is anything front-and-center that should be demoted / vice versa?
- **IA** — does the section order match the "about to brew/serve, what do I do?" job framing?
- **Noise** — anything rendering that you never read?
- **Missing** — any column in `brews` populated but not rendered? (Check against `lib/types.ts Brew` shape.)
- **Filter bar** — is the cross-dim filter set still right? Anything you wish you could filter on?
- **Mobile** — `/brews` index hits 1-col below `sm:` (640px) post PR #14; the all-content-on-cover stack tested OK then but may have drifted. Same check on `/brews/[id]` header wrap behavior + `<RecipeTable>` 2-col grid + Pour Structure bullets.

**Format**: same as 4a + 4b — screenshot + annotation per section, organized by surface. Tags optional (`[info design]` / `[UX]` / `[IA]` / `[noise]` / `[missing]` / `[fine, keep]`). "Fine, keep" notes welcome — they let Phase 2 defend held positions.

**Handoff signal**: "OK that's my full audit pass" or equivalent. Until then, do not advance.

### Phase 2 — Claude's complementary pass (single session)

Same shape as 4a + 4b Phase 2. Output: a single doc at `docs/sprints/sub-sprint-4c-brews-polish-complementary-pass-<date>.md` (mirror of 4a + 4b complementary passes).

Categorization buckets (per 4a + 4b Phase 2):
- (A) Chris flagged this — agree, skip
- (B) Chris didn't flag — recommend adding
- (C) Chris flagged this — pushback / scope different
- (D) Cross-cutting pattern across multiple notes
- (E) Substrate gap (field exists, render missing or stale data)
- (F) Bug root cause (for a flagged bug)
- (G) Out-of-scope for polish — defer

**Substrate cross-check checklist:**
- `brews` schema — verify every populated column has a render path. Common drift surfaces:
  - `extraction_confirmed` (renders only when divergent from `extraction_strategy`)
  - `cooling_curve_target` (rendered in Full Brew Notes when present)
  - `terroir_connection` / `cultivar_connection` / `roast_connection` — `roast_connection` was dropped from the read view (0/79 populate); verify the other two
  - `classification` — conditional render in Full Brew Notes
  - `hybrid_subform` — Hybrid strategy requires it; render in Reference Brew Recipe?
  - `fermentation_qualifiers text[]` (Sprint T3, 2026-05-18) — currently displayed?
  - `signature_method` (15 canonicals post Sprint T1, 2026-05-18) — rendering as part of process display?
  - `structure_tags text[]` — `Axis:` prefix stripped on render; verify all 7 axes present
  - 9 structured process columns (`base_process` / `subprocess` / 4 modifier text[] arrays / `fermentation_qualifiers` / `decaf_modifier` / `signature_method`) — verify Coffee Overview's process leaf renders the composed display via `composeProcess` or the leaf alone
- `lib/extraction-strategy.ts` — 6 canonicals post v8.4 (Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid); verify pill colors on the cover and pill variant on detail
- `lib/extraction-modifiers.ts` — 4 canonical modifier types (`output_selection` / `inverted_temperature_staging` / `aroma_capture` / `role_based_pulse`); verify badge render via `<ModifierBadges>` + Modifier Detail subblock
- `lib/brew-colors.ts` — single source of truth for cover color; verify usage on cover + detail
- `lib/pour-structure.ts` — `parsePourSteps` cascade (newline > semicolon > middle-dot > period+marker > arrow-chain); verify rendering of brews with each cascade pattern. Drawdown segment extraction via `extractDrawdown(total_time, pour_structure)` — verify total_time preference
- `components/RecipeTable.tsx` (18 lines) + `components/PourStructureList.tsx` (21 lines) — load-bearing primitives; verify shape stability
- `components/StrategyPill.tsx` — `row` variant on detail, `card` variant on index
- `components/ModifierBadges.tsx` — display-only render on detail; empty state shows muted "None". Companion `ModifierComposer.tsx` deleted in Writing-path Sub-sprint 4 — verify no residue
- `components/FlavorNotesByFamily.tsx` — Common Flavor Notes on aggregation pages but NOT used on `/brews/[id]` — verify intent (raw chips on cover only?)
- `components/BrewsFilterBar.tsx` (331 lines) — 4 dimension rows: Strategy / Process / Roaster / Family. Anything missing? (Producer / Cultivar / Terroir / Roast Level filter rows?)

**Render-gate audit:** are any conditional render paths broken or stale, similar to the `brewGuideLink ? <link> : "No official brew guide"` false-negative bug 4b fixed? Spot-check by writing a small fetch script (mirror of the 4b verification eval) against representative brews.

**Categorize** all of Chris's items + your additions into buckets above. Recommend a Phase 3 bundle structure (Bundle A / Bundle B / etc. — likely fewer bundles than 4b given simpler substrate).

### Phase 3 — Plan-mode bundled implementation (single session)

Same shape as 4a + 4b Phase 3. Enter plan mode (`ExitPlanMode`). Present the bundle structure, get Chris's ratification, ship.

**Files likely to touch (substrate work):**
- `app/(app)/brews/[id]/page.tsx` — section reorders / render-gate fixes / new field surfacing
- `app/(app)/brews/page.tsx` — index cover content / sort / new filter UI tie-in
- `components/BrewsFilterBar.tsx` — new filter rows if any added
- `components/RecipeTable.tsx` / `PourStructureList.tsx` — primitive shape stability
- `components/StrategyPill.tsx` / `ModifierBadges.tsx` — variant additions if needed
- `lib/types.ts` Brew shape — if any new field surfaces require typing
- `CLAUDE.md § Brews` — drift fixes inline with substrate changes
- `docs/sprints/shipped.md` + `PRODUCT.md § Active Sprints #4` — sprint-close housekeeping
- `lib/synthesis/adapters/` — if substrate-fold affects synthesis prompts (unlikely — brew adapter is `process` adapter via `green_beans` join; no per-brew adapter)

**Likely NOT in scope** (defer per Phase 2 § Bucket G):
- Schema migrations — 4a / 4b avoided these; 4c should too unless a column is genuinely missing
- MCP Tool surface changes — `push_brew` + `patch_brew` Zod schemas + canonical lookups are stable
- Synthesis prompt rewrites — separate sprint when triggered

## Locked decisions from prior sprints (do NOT re-litigate)

These came up during 4a + 4b and are settled:
1. ✓ Desktop is the primary design target (mobile gets phone-scope sub-sprints separately)
2. ✓ The 3-phase sequencing pattern (Chris audit → Claude complementary pass → plan-mode bundle)
3. ✓ Single PR per bundle (Bundle A = its own PR, Bundle B = its own PR)
4. ✓ MCP-only writes — no form deprecation needed (already shipped Sub-sprint 4)
5. ✓ Six-actor audit before every PR (CLAUDE.md sprint cadence #4)

## Verification spec template (for Phase 3)

Mirror 4b's pattern:
- TS strict-build check via worktree `node_modules` symlink (`ln -sf ../../../node_modules node_modules && npx tsc --noEmit; rm node_modules`)
- `npm run check:mcp` + `npm run check:mcp-bundle` even if no MCP changes (sanity)
- Preview spot-check: at minimum 5 brews covering each branch of any new render-gate
- Console-error check via `preview_console_logs` `level=error`

## Open questions to surface in the kickoff conversation

1. Is the "about to brew/serve, what do I do?" job framing still right for `/brews/[id]`, or has lived practice shifted? (e.g. has the read job become more "archive recall" since claude.ai now drives brewing iteration in-thread?)
2. The Reference Brew Recipe block is page-anchor on `/brews/[id]`. Is it still the right page-front, given brewing-strategy work has moved to claude.ai?
3. Sub Pages 1 (2026-05-09) promoted "What I Learned" up the page. Has the relative weight of "What I Learned" vs the recipe block shifted again?
4. Index page filters — is the current 4-dimension set right (Strategy / Process / Roaster / Family)? Anything missing that lived practice now wants?
5. Mobile pass — full scope, or spot-check only (per "desktop is the primary design target" convention)?

## Where the autonomy gate lives

Per [feedback_autonomy.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_autonomy.md): the autonomy rule applies post-Phase-3-plan-approval. Until plan-mode `ExitPlanMode` accept, default = ask, don't ship. Same gate that worked cleanly on 4a + 4b.

## Reference

- [Sub-sprint 4b kickoff brief](docs/sprints/sub-sprint-4b-roasters-polish-kickoff-2026-05-27.md) — precedent for the 3-phase shape
- [Sub-sprint 4b complementary pass](docs/sprints/sub-sprint-4b-roasters-polish-complementary-pass-2026-05-28.md) — precedent for Phase 2 structure
- [Sub-sprint 4b Bundle B handoff doc](docs/sprints/sub-sprint-4b-bundle-b-handoff-2026-05-28.md) — precedent for the fresh-session execution playbook shape
- [Sub-sprint 4a kickoff brief](docs/sprints/sub-sprint-4a-green-bean-polish-kickoff-2026-05-27.md) — 3-phase template originator
- [Sub-sprint 4a complementary pass](docs/sprints/sub-sprint-4a-green-bean-polish-complementary-pass-2026-05-27.md) — Phase 2 template originator
- [PRODUCT.md § Active Sprints #4](PRODUCT.md) — series-level scope + sub-sprint queue
- [CLAUDE.md § Brews](CLAUDE.md) — read this for the post-Sub-Pages-1 detail-page shape + post Writing-path Sub-sprint 4 form-deprecation state
