# Reference Taxonomies — Region

Per-taxonomy feature doc for the Region / Terroir taxonomy. Part of the [Reference Taxonomies umbrella](reference-taxonomies-attribution.md). **Phylum A1 (port existing ruleset).** Second sprint after Variety.

Written 2026-04-21 from the Reference Taxonomies brainstorm. Pattern reference: [reference-taxonomies-attribution.md](reference-taxonomies-attribution.md) for shared conventions.

---

## Scope

Region is Chris's **biggest pain point** (Part 1 rank #2, flagged as "highest leverage going forward"). The pain is concrete: *"macro region is the main point of synthesis and if I don't get that right cross lessons don't work. I had to come up with a lot of rules in my context to try to force consistent macro categories. As I'm importing more and more coffees into here I'm afraid this is going to drift."*

Exhibit A for the drift problem: Chris's Google Doc lists **14 macro terroirs** (last modified 2026-03-17). The DB has **21 macros** (post-migration 015, 2026-04-20). `lib/terroir-registry.ts` (PR #30, 2026-04-21) extracted **19 macros** from a DB snapshot — the registry, the doc, and the DB all diverge slightly. That three-way drift in artifacts that were supposed to be synchronized is the concrete case for enforcement.

Scope:
- Canonical 5-level hierarchy: **Country → Admin Region → Macro Terroir → Meso Terroir → Micro Terroir**.
- **Macro Terroir is the behavioral unit.** That's where aggregation + synthesis happen in the app today (`/terroirs/[macro]` pages). Country + Admin are traceability-only; Meso + Micro are sub-units within a Macro.
- ~21 canonical macros covering 80-90% of Chris's buying patterns. Chris during Part 1: *"coffee tends to come from specific countries, and specific places within those countries. So I should be able to extend my region taxonomy map to cover 80% of the regions."*
- Per-macro authored reference content (see [Per-macro content fields](#per-macro-content-fields) below).
- Enforcement: strict. `/add` refuses non-canonical macro names.

Out of scope:
- Browsing by elevation band, climate zone, or any dimension that isn't already modeled as a terroir hierarchy layer.
- Per-meso or per-micro rendering in the app. Meso + Micro stay as sub-unit context within a Macro's aggregation. No new routes.
- Reference content for country-level or admin-region-level entities. Those are traceability-only per Chris's framework.

---

## Starting point — three inputs

The sprint draws from three existing artifacts:

1. **`lib/terroir-registry.ts`** (exists as of 2026-04-21, PR #30). 13 countries + 19 macros + 22 mesos as 3 independent `CanonicalLookup` bundles (mirroring how the archive-format `Country / Macro / Meso` field parses positionally), extracted from DB snapshot. This is the registry the umbrella enriches.
2. **Chris's ChatGPT context doc** (`context for chatgpt on coffee info, terroir, cultivar, best brew`). The Terroir section is the ruleset + 5-level hierarchy rules + per-macro attribute template; the authoritative source for structure. Its macro list drifts from the registry and the DB (14 vs 19 vs 21) — reconciliation is the first research task.
3. **Chris's 55-brew corpus** — tested claims per macro live in "Observed Across My Corpus" per-macro sub-sections.

The Terroir section of Chris's Google Doc is the source of truth for structure + framework. It already contains:

- **5-level hierarchy** with explicit rules per level (Country / Admin / Macro / Meso / Micro).
- **Macro Validation Check** — 4 behavioral questions before creating a new macro (extraction behavior / acidity shape / roast differently / consistent environmental pattern).
- **Macro Terroir Registry Rule** — macros must come from the predefined list; new macros can't be created freely.
- **Current Macro list** (14 macros in the Google Doc as of 2026-03-17; 21 in DB post-015). The port reconciles these.
- **Per-macro attributes** (template) — Context / Elevation Band / Climate / Soil / Farming Model / Dominant Varieties / Typical Processing / Cup Profile / Acidity Character / Body Character / Why It Stands Out.
- **Red-flag rules** — if two macros share identical elevation band + rainfall + soil, you're splitting too much; admin names must never be used as ecological labels; marketing zones must never be meso units.

**The port is mechanical for structure, interpretive for per-macro content.** The Google Doc has the template, not the filled-in content for all ~21 macros.

---

## Drift reconciliation (the first research task)

Before Chris authors per-macro content, the first task is **reconciling the 14-macro Google Doc list against the 21-macro DB list.**

The DB diff:
- **In DB, not in Google Doc as of 2026-03-17:** Huehuetenango Highlands, Acatenango Volcanic Highlands (both added migration 015), Sierra Sur Highlands, Southern Andean Cordillera, Volcán Barú Highlands (already present in DB but may need verification in the doc list), plus 2-4 others depending on the exact 2026-03-17 doc state.

Reconciliation is part of Chris's research phase. For each DB macro not in the doc:
1. Does it pass the 4-question Macro Validation Check?
2. If yes, add to the canonical list with full per-macro content.
3. If no, either (a) find the correct existing macro and reclassify the DB rows, or (b) leave as a known exception pending deeper review.

The reconciliation itself is a decision to lock — once done, Chris's Google Doc becomes a legacy reference and `docs/taxonomies/regions.md` is the canonical source.

---

## Canonical adoption workflow (for this sprint)

Per [attribution § Canonical adoption workflow](reference-taxonomies-attribution.md#canonical-adoption-workflow):

1. **Research (Chris).** Reconcile 14 vs 21. Draft per-macro content for all ~21 canonical macros. Extend list if buying patterns suggest additional macros (e.g. Kenya Nyeri Highlands, Yirgacheffe Highlands). External sources likely: Sweet Maria's origin pages, SCA / specialty coffee origin references, Hacienda / producer-published location descriptions.
2. **Draft (Chris).** Share draft `docs/taxonomies/regions.md`.
3. **Vet (Claude).** Claude checks:
   - Every macro in the canonical list has content for every attribute (or explicit "insufficient data").
   - No admin name is being used as an ecological label.
   - No marketing zone is being used as a meso unit.
   - Every DB row in the `terroirs` table resolves to a canonical macro in the new list.
   - The 4-question validation check is retroactively applied to each existing macro — flag any that fail.
4. **Iterate.** Loop until reconciliation holds + coverage is complete.
5. **Adopt.** Commit `docs/taxonomies/regions.md`.
6. **Port / enrich.** `lib/terroir-registry.ts` already exists (PR #30) with 13 countries + 19 macros + 22 mesos as 3 independent `CanonicalLookup` bundles. This step reconciles the adopted taxonomy markdown against the registry: add missing macros (currently 2 DB macros absent from registry per the 19-vs-21 gap), add meso subunits that emerged during research, tighten country list if needed. Aliases map extended for any geographic naming drift (e.g. `Huehue` → `Huehuetenango Highlands` if surfaced).
7. **Render.** `/terroirs/[macro]` renders a REFERENCE block above the existing synthesis block, with per-macro content from `regions.md`.
8. **Enforce.** `/add` refuses non-canonical macro names via `TERROIR_MACRO_LOOKUP`. For a submission where `macro_terroir` doesn't resolve, UI surfaces the validation check questions inline. `/brews/[id]/edit` same. Sync V1 already consumes the registry per `SYNC.md`.

---

## Per-macro content fields

Each canonical macro in `docs/taxonomies/regions.md` gets a structured block. Fields come from Chris's Google Doc.

```markdown
### <Macro Terroir Name>

**Country:** <country>
**Admin Regions it overlaps:** <list of admin regions within this macro>
**Typical Meso Terroirs:** <list of meso clusters within this macro>

#### Environmental System
- **Elevation Band:** <min>-<max> m
- **Climate Regime:** [cool / temperate / warm; include rainfall behavior]
- **Soil Base:** [dominant soil + structure]
- **Farming Model:** [smallholder / estate / mixed; hand-picked / strip-picked]

#### What Comes Out of This System
- **Dominant Varieties:** [canonical cultivars common here]
- **Typical Processing:** [washed / natural / honey / anaerobic — what's common]
- **Cup Profile (structural):** [core pattern across lots]
- **Acidity Character:** [citric linear / malic rounded / phosphoric sparkling / low muted]
- **Body Character:** [tea-like / medium silky / dense syrupy]

#### Why This Macro Stands Out
[How this macro differs structurally from adjacent ecological systems. Climate regime / rainfall / soil base / maturation speed / acidity structure. No repetition of elevation or general geography.]

#### Observed Across My Corpus
<Chris's tested claims for this macro, sample-size-aware voice. Absent if zero own brews.>

---
```

**Sizing:** 21 macros × ~12 fields each = ~250 content cells. Less than Variety's ~360, but each field carries more interpretive weight (what makes this macro *distinct* from its neighbors is a harder question than what cultivar X is like).

**Rendering on `/terroirs/[macro]`:** The REFERENCE block surfaces the Environmental System + What Comes Out + Why This Stands Out content. Observed Across My Corpus renders alongside, same visual weight.

---

## Enforcement specifics

**`/add` flow.** Macro terroir input uses `CanonicalTextInput` bound to `lib/terroir-registry.ts`. Refuses non-canonical macros. For inputs that partially match, the 3-tier classifier suggests ("Huehue Highlands?" → "Huehuetenango Highlands").

**New macro submission.** A `/add` submission with a non-canonical macro triggers the 4-question validation check inline:
1. Does this change extraction behavior?
2. Does this change the acidity shape?
3. Would I roast this differently at scale?
4. Does this system show a consistent environmental pattern distinct from adjacent zones?

If all 4 answer yes, the submission marks the macro as a candidate for registry addition — but it does NOT auto-add. Chris must commit the taxonomy markdown edit as a deliberate registry expansion.

**Sync V1.** Paste-in from Claude project hits the canonical check. New macro in paste-in triggers the same 4-question validation inline + the submission does not silent-insert. Chris approves or declines with the markdown edit as the source of truth.

**Schema note.** `terroirs.macro_terroir` is a text column (not FK'd to a macro table). This sprint does not change the schema. The `lib/terroir-registry.ts` export wraps the text column with validation.

---

## Dependencies

- **Attribution scaffolding sprint** ships first (provides `docs/taxonomies/` + conventions).
- **Variety sprint** ships before or in parallel — Region is sprint 2 after Variety. No hard data dependency; the sprints are independent.
- **Sync V1 sub-sprint 1 step (b)** — already shipped (PR #30, 2026-04-21). `lib/terroir-registry.ts` exists. This sprint enriches the registry, not greenfield extraction.

## Sizing

- **Chris's research + reconciliation phase:** unbounded. Likely 2-4 focused sessions. Reconciliation of 14 vs 21 may surface additional drift to fix.
- **Claude's port + render + enforce phase:** 1 sprint after the final `regions.md` draft lands.

## Out of scope (this sprint specifically)

- **New `/terroirs/countries/<country>` routes.** Country-level aggregation already happens on the index page grouped by country; no detail page.
- **Rendering reference content at meso or micro level.** Meso + Micro stay as sub-units within a macro's aggregation.
- **Terroir autolink across taxonomies.** Macro name mentions in `varieties.md` / `processes.md` render as plain text per umbrella default.
- **Map / geospatial rendering.** Useful someday, not in umbrella scope.
- **Elevation band as a first-class filter dimension** on `/brews`. Separate feature if it earns its keep.

## Open questions

- **Country + admin canonical lists.** Chris's Google Doc says admin is "traceability only, never defines flavor." Does the Region taxonomy doc also canonicalize country + admin names (e.g. "Huila" not "Departamento del Huila"), or leave those as free-text? Probably canonicalize for data hygiene, but no reference content. Decide during research phase.
- **What to do with in-DB rows that resolve to "unknown macro" after reconciliation.** Likely a one-off audit query + manual reclassification. Not a sprint shape, more like a cleanup task inside the port.
- **Handling Kenya.** Chris's DB does not currently have Kenya Highlands as a macro but he's likely to buy Kenyan coffees. Include as preloaded macro during research phase? Chris's call — fits the "preload for first encounter" value prop.

## Sources (for this feature doc)

- Chris's ChatGPT context doc, Terroir section
- [reference-taxonomies-attribution.md](reference-taxonomies-attribution.md)
- CLAUDE.md § Canonical Registries (macro terroir rules)
- Migration 015 (Guatemala macros Huehuetenango + Acatenango)
- `feedback_terroir_cultivar_registry.md` memory (canonical registry discipline)

Per-macro authored content sources captured in `docs/taxonomies/regions.md` when that file is authored.
