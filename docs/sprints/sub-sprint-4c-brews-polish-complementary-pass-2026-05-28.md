# Sub-sprint 4c — Brews polish — Claude complementary pass — 2026-05-28

Mirror of the 4a + 4b Phase 2 docs. Chris's Phase 1 audit (2026-05-28, audio + `Brew Pages Feedback (1).md` + `Brew Recipe Data Structure - Claude Brainstorm.md`) reframed 4c away from render-polish toward **forward data-model design**. The pages are good as-is; every item is about how to *structure and future-proof* the recipe substrate without (a) over-building, (b) creating a future cleanup migration, or (c) churning the claude.ai→MCP write surface.

## The optimization Chris named (read this first)

> "I wanna think forward in the future... I also don't wanna put myself in a situation that will need a whole lot of cleanup work if we do this migration in the future. So what is the best way to capture some of these things now? Future-proof some of these things now... but keep it simple. And this also really affects the surface layer of how claude.ai inserts stuff into Latent."

Total cost to minimize = **build-now** + **future-cleanup/backfill** + **write-surface churn**. The three costs trade off differently per item, which gives a clean decision rule:

- **Fields Chris already captures today** (just crammed into free-text with no home): adding a structured home now has *negative* marginal cost over time — every brew written from now lands clean, so there's nothing to backfill later. **Ship now.**
- **Behaviors Chris is NOT doing the structured version of yet**: building the rich schema now is speculative and risks a double-migration once real examples reveal the right shape. **Reserve the seam cheaply, defer the structure.**

This rule maps the four items + the index feedback onto a clean Bundle A (ship) / defer split. Detail below.

## Job framing (confirmed, sharper than the kickoff brief assumed)

`/brews/[id]` is the *end* of a roaster-first chain: roaster index → roaster card → the specific brew → here. On arrival Chris is in **repeat mode** — he single-doses into 15g frozen tubes, pulls one (usually phone-in-hand at the office), and the #1 question is "what recipe did I optimize last time so I can recreate it exactly." Priority stack, locked:

1. **Reference Brew Recipe** — the whole reason he's here. Page anchor. ✓ correct today.
2. **Flavor + structure notes** — "what did I taste last time." ✓ correct (Presentation Overview, position 3).
3. **Peak Expression** — "when's a good time to serve." ✓ correct (position 4).
4. everything else — appendix.

**Consequence for this sprint:** any new recipe field (water, equipment, temperature) belongs **inside the Reference Brew Recipe block**, not in the Full Brew Notes appendix. The recipe block IS the job; demoting a recipe input to the appendix would be an IA regression.

**Mobile is first-class for this one page** (his most phone-first surface). Any new render must hold at 375px in the recipe block specifically.

---

## Item-by-item

### Item 2 — Water recipe — **(B) recommend adding — Bundle A**

**Today:** no home. Chris cracks it into the recipe prose sometimes ("Third Wave Water Light Roast ~1:3 concentrate:distilled", "Palo Alto office tap"). He does this *now* and a near-future research project is explicitly water-formula testing.

**Lowest-cost item in scope.** Single `water_recipe text` column. No enum, no registry — he wants free-form, and his future "own mixtures + other people's formulas" would explode any enum anyway. Free-text is also the correct future-proof choice: if water later becomes a canonical research axis, promote to a registry then (same lazy-promotion pattern as every other axis), with zero structured commitment to undo.

- **Schema:** `ALTER TABLE brews ADD COLUMN water_recipe text` (nullable).
- **Render:** new row inside `RecipeTable` (or a labeled line directly under it). In the recipe block per the priority stack — NOT appendix.
- **Write surface:** one optional nullable string on `push_brew` + `patch_brew`. Trivial — mirrors `bloom` / `pour_structure` exactly.
- **Six-actor trace:** types.ts Brew + migration + RecipeTable render + push/patch Zod + prompt mention (`bundled-brewing-completion.md`) + CLAUDE.md § Brews. ~6 small touches, all additive.

### Item 3 — Equipment modifiers — **(B) recommend adding — Bundle A — via the existing `modifiers[]` infra**

**Today:** half-built and mis-named. The `aroma_capture` modifier already stores "Paragon ball on bloom + Pour 1" as free-text `application`. But `aroma_capture` only fits the Paragon/aroma case — it's semantically wrong for Melodrip (flow control) or a booster (agitation). Chris uses all three *now*.

**Recommendation: add an `equipment` modifier type to the existing `brews.modifiers` jsonb array.** Shape: `{ type: 'equipment', name: string, scope?: string }` where `scope` is free-text ("throughout" | "bloom + P1" | "bloom + P1, removed at P2"). This:

- Reuses ALL existing infrastructure: `cleanModifiers` / `splitModifierLabel` / `composeModifierLabel` / `<ModifierBadges>` / the "Modifier Detail" render subblock / the `modifierEntry` Zod schema on `push_brew`. **Zero schema migration.**
- Is the exact proven template of the v8.5 `role_based_pulse` addition (1 entry in `MODIFIER_TYPES`, 1 `TYPE_LABELS` entry, 1 `composeModifierLabel` branch, 1 `cleanModifiers` branch, 1 `emptyModifier` branch, 1 push_brew enum value, 1 doc note).
- Keeps **scope as free-text** deliberately. Per-step structured scoping ("Melodrip on steps [bloom, P1]") is inherently coupled to Item 4's structured pour array; until that exists there's nothing to attach a structured scope to. Free-text scope now, structured scope folds in when/if Item 4 lands.

**Rejected alternatives:**
- *Reuse `aroma_capture`* — semantically wrong for flow/agitation gear; would muddy the modifier's meaning.
- *Dedicated `equipment[] jsonb` brew-level column* — new column + new render + new schema, when `modifiers[]` already handles "optional, stackable, type + free-text detail" perfectly. Not warranted.

**Open call for Chris:** does the Paragon usage currently logged under `aroma_capture` get migrated to `equipment`, or does `aroma_capture` stay for the aroma-specific intent and `equipment` cover the rest? (Lean: leave existing `aroma_capture` rows alone; use `equipment` going forward for flow/agitation gear. The two can coexist — Paragon is arguably genuinely aroma-capture intent.)

### Item 1 — Temperature evolution / kettle thermal stance — **(C) flagged, but needs disambiguation — partial Bundle A pending a grill call**

**Three distinct concepts are getting conflated. Separating them is the whole job here:**

1. `temp_c` (static number) — keep, untouched.
2. `temperature_evolution` (existing field) — per the brainstorm doc this is **the cup's cooling arc on the palate** (how it tastes as it cools in the cup), renders in Full Brew Notes. **Do NOT repurpose for kettle behavior.**
3. **NEW (no home today): kettle thermal stance during the brew** — kettle-on/constant vs kettle-off-after-bloom/natural-drop (Chris does these *simple* versions today) vs future active ramps (start hot→cool, or cool bloom→hot — NOT doing yet).

The future active-ramp case (#3 future) already has a loose home: the **`inverted_temperature_staging` modifier** with its free-text `phases` field ("86°C → 92°C across two phases"). But the name is wrong for the *today* case — "off after bloom, natural drop" is cooling in the *normal* direction, the opposite of "inverted."

**Three options for Chris (this is the one real grill call in 4c):**

- **1a — Generalize the existing modifier.** Broaden `inverted_temperature_staging` → a `thermal_staging` type whose free-text detail absorbs both "kettle off after bloom, natural cooling" (today) and "86→92 active ramp" (future). One modifier type owns the whole temperature-variation axis. *Cost:* renames a canonical type — touches push_brew enum + any existing rows using it (need to verify count; comments suggest rare). Cleanest conceptually; small migration risk.
- **1b — Add a sibling `thermal_staging` type, leave `inverted_temperature_staging` as-is.** No rename, no data touch. *Cost:* two modifier types for one axis = mild clutter; risk claude.ai picks the wrong one.
- **1c — Defer entirely.** Chris is barely doing #3-today; the simple kettle stance can ride in the recipe prose or `strategy_notes` for now, structure it when active-temp experiments actually start. *Cost:* zero now; the kettle stance stays unqueryable.

**Recommendation: 1a if the existing-row count is ≤ ~3 (verify first); else 1b.** Either way the *rich* per-pour temperature target is an Item-4 concern (lives in the structured pour array), so whatever we pick here only needs to carry the brew-level stance + free-text future ramps. Do NOT build per-pour temperature in 4c.

### Item 4 — Structured `pour_structure` (bloom + pours as step objects) — **(G) out of scope for 4c — defer to a dedicated sprint**

This is the big one, and the one Chris was explicitly tentative about ("I'm not sure if I should bite the bullet... let's not just implement it right away"). **Recommendation: do NOT do this in 4c.** Reasons:

1. **The seam is already reserved.** `lib/pour-structure.ts` is free-text + a forward-compat parser with a `ParsedPourStep` interface and an explicit comment: "swap the parse source from text → structured rows; the render layer stays the same." The cheap future-proofing already exists.
2. **The brainstorm doc's schema is good but has unresolved design calls** that shouldn't be decided without accumulated real examples: the valve `state` enum-vs-free-text question (the doc itself flags this as *the* open call), cumulative `target_g`, per-step `kettle`/`device` overrides, the `drain.reclose` immersion mechanic. Deciding these cold risks a double migration — exactly the cleanup cost Chris wants to avoid.
3. **Heaviest write-surface impact in scope.** claude.ai would author a step-object array per brew on every `push_brew` — the precise thing Chris flagged caution about.
4. **Full render rewrite** of `RecipeTable` + `PourStructureList`.

**Cheap prep worth doing now (near-zero risk, reduces future backfill cost):** codify Chris's preferred free-text bloom/pour convention (the "I tried to rewrite it below" format in `Brew Pages Feedback (1).md` — `Bloom:` / `Switch:`/`Sworks Valve:` / `Pour structure:` / `Pour N:` with cumulative targets + times) as the canonical free-text shape in `docs/prompts/bundled-brewing-completion.md` + `start-brew.md`. When the structured migration eventually lands, legacy text authored to a consistent convention parses cleanly. This is a prompt/docs change only — no schema, no write-surface change. **Candidate for Bundle A or a 1-file follow-up; optional.**

---

## Index page + filters — **(C) Chris flagged; recommend a deliberate simplify**

**Index itself:** good as-is. Pagination/infinite-scroll is a real future need (grows with brew count) but not yet — defer, note in PRODUCT.md watch-items.

**Filters (answers open question #4):** Chris does not use them. His recall path is roaster-first (roaster index → roaster card → the coffee), not index-filter. Critical substrate finding: **the current Roaster filter row filters by roaster *family* (Clarity-First / Balanced / System / etc.), not by individual roaster.** So "show me all Picolot coffees" — Chris's actual mental model — *isn't possible today*. The 4 rows are Strategy / Process family / Roaster family / Origin (Lineage + Macro).

Chris floated three options: (1) keep as-is, (2) deprecate completely, (3) replace with a single "by roaster" entity filter. His steer: "let's simplify more than anything else... I don't necessarily want to do a bunch of excess work for the sake of doing excess work."

**Recommendation — a blend of (2) + (3): collapse the 4 family-level rows to a single by-roaster filter.** Rationale:
- It's *not* redundant with the roaster page: option 3 filters the book-cover grid he likes (visual recall) by the entity he actually thinks in (the specific roaster), whereas the roaster page is a list. Different surface, same mental model.
- It replaces 4 underused family-level filters with 1 used entity-level filter — a net *simplification* (BrewsFilterBar drops from 331 lines substantially), honoring "simplify more than anything else."
- Family-level filtering (Strategy / Process family / Origin) is exactly what the aggregation pages (`/processes`, `/terroirs`, `/cultivars`) already do better.

**But this is Chris's call** — he said no strong opinion and explicitly doesn't want make-work. Three live options for Phase 3 ratification:
- **3-collapse (recommended):** replace the 4 rows with one by-roaster filter. Moderate work (rebuild BrewsFilterBar's data + server filter), net line reduction.
- **2-deprecate:** delete the filter bar entirely, lean fully on the roaster page for entity recall + aggregation pages for family recall. Lowest work, biggest simplification.
- **1-keep:** leave as-is. Zero work; the underused filters persist.

---

## Categorization summary (buckets per 4a/4b Phase 2)

| Item | Bucket | Disposition |
|---|---|---|
| Water recipe | (B) recommend add | **Bundle A** — `water_recipe text`, render in recipe block |
| Equipment modifiers | (B) recommend add | **Bundle A** — new `equipment` modifier type, reuse `modifiers[]` |
| Temperature stance | (C) needs disambiguation | **Bundle A pending grill** — option 1a/1b/1c (recommend 1a if rare, else 1b) |
| Structured pour_structure | (G) defer | Dedicated future sprint; optional cheap prompt-convention prep now |
| Index filters | (C) simplify | **Bundle B or A** — recommend 3-collapse to by-roaster; Chris's call (1/2/3) |
| Index pagination | (G) defer | PRODUCT.md watch-item; not yet |
| `temperature_evolution` reuse | (E) substrate clarity | Do NOT repurpose — it's the palate cooling arc, distinct from kettle stance |

## Recommended Phase 3 bundle structure

- **Bundle A — additive recipe fields (the "already doing it" set):** `water_recipe` column + render; `equipment` modifier type + render; temperature-stance home (1a/1b per grill); all three land in the Reference Brew Recipe block. One PR. Six-actor trace per field. ~Migration 0NN for water_recipe (+ thermal type if 1a renames).
- **Bundle B — index filter simplify:** whichever of 1/2/3 Chris ratifies. Separate PR (different file surface, independent risk). Could fold into A if Chris picks 2-deprecate (smallest).
- **Deferred — structured pour_structure:** its own sprint, brainstorm doc as starting point, dedicated grill on the valve enum question, designed against accumulated real examples. Optional 4c prep: free-text convention in the brewing prompts.

## Decisions needing Chris's ratification before Phase 3 plan-mode

1. **Item 1 thermal stance:** 1a (generalize `inverted_temperature_staging` → `thermal_staging`) / 1b (add sibling type) / 1c (defer)? — recommend 1a pending a count check on existing `inverted_temperature_staging` rows.
2. **Item 3:** migrate existing Paragon-under-`aroma_capture` rows to `equipment`, or leave them and use `equipment` going forward? — recommend leave + go-forward.
3. **Item 4:** confirm defer to a dedicated sprint? Want the cheap prompt-convention prep done in 4c, or fully punt? — recommend defer + do the prep.
4. **Filters:** 1-keep / 2-deprecate / 3-collapse-to-by-roaster? — recommend 3.
5. **`water_recipe` render:** inside RecipeTable as a 7th row, or a labeled line under the 6-var grid? — recommend a labeled line under (keeps the clean 6-var grid; water is a "recipe context" line, not one of the 6 canonical brewing variables).

## Verification plan (Phase 3)

- TS strict-build via worktree `node_modules` symlink (`ln -sf ../../../node_modules node_modules && npx tsc --noEmit; rm node_modules`).
- `npm run check:mcp` + `npm run check:mcp-bundle` (sanity even with no new Resource).
- Preview spot-check: a brew with water_recipe set, a brew with an equipment modifier, a brew with a thermal modifier, a sparse brew (all three null → no orphan rows), at 375px + desktop.
- `preview_console_logs level=error` clean.
