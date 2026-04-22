# Reference Taxonomies — Variety

Per-taxonomy feature doc for the Variety / Cultivar taxonomy. Part of the [Reference Taxonomies umbrella](reference-taxonomies-attribution.md). **Phylum A1 (port existing ruleset).** Sprint-1 deliverable after the attribution scaffolding sprint.

Written 2026-04-21 from the Reference Taxonomies brainstorm. Pattern reference: [reference-taxonomies-attribution.md](reference-taxonomies-attribution.md) for shared conventions (adoption workflow, citation format, enforcement mechanics).

---

## Scope

Variety is the most-knowable of the five Phylum A taxonomies. Chris said during Part 1: *"there is a defined set of varieties out there (at least the top ones) and more of a defined relationship between species → family → lineage → cultivar."* Plus in Part 4: *"the cultivar taxonomy is fixed (once i do all of this homework together) and then it really has to be an exception or something truly new to add it to the taxonomy."*

Scope:
- Canonical 4-level hierarchy: **Species → Genetic Family → Lineage → Cultivar (named selection)**.
- ~20 canonical cultivars covering 80-90% of what Chris buys + wants preloaded reference content for. Additions post-adoption are deliberate registry edits, not drift.
- Per-cultivar authored reference content with ~15-18 attributes (see [Per-cultivar content fields](#per-cultivar-content-fields) below).
- Enforcement: strict. `/add` refuses non-canonical cultivar names.

Out of scope (per the umbrella):
- Scraping cultivar databases. All content Chris-curated.
- Per-cultivar detail pages beyond the existing `/cultivars/[id]`. The current aggregation page gains a REFERENCE block; no new route.
- Behavioral traits (flavor profile / roast behavior) influencing genetic classification. Genetics layer stays clean; behavior is the layer that renders against it.

---

## Starting point — three inputs

The sprint draws from three existing artifacts:

1. **`lib/cultivar-registry.ts`** (exists as of 2026-04-21, PR #30). 26 canonical cultivar names + 13 lineages as flat `CanonicalLookup` bundles, extracted from DB snapshot. Factory supports an `aliases` map (tier-0 resolution) — currently `Geisha → Gesha`. This is the registry the umbrella enriches.
2. **Chris's ChatGPT context doc** (`context for chatgpt on coffee info, terroir, cultivar, best brew`). The Cultivar section is the ruleset + per-cultivar attribute template; the authoritative source for structure. Its canonical cultivar list overlaps with `lib/cultivar-registry.ts` but is a separate artifact — reconciliation is part of Chris's research.
3. **Chris's 55-brew corpus** — tested claims per cultivar live in the "Observed Across My Corpus" per-cultivar sub-sections, sample-size-aware voice.

The Cultivar section of Chris's Google Doc is already:

- **Core Principles** (5 rules) — Family = genetic root; Lineage = branch within family; Cultivar = named selection; Blends are cultivars, not lineages; Marketing names never define lineage.
- **Species Registry** — 4 species (Arabica / Robusta / Liberica / Eugenioides).
- **Genetic Family Registry** — 5 families (Ethiopian Landrace Families / Typica Family / Bourbon Family / Typica × Bourbon Crosses / Modern Hybrids).
- **Lineage Registry** — 12 lineages, grouped under families. Already normalized post-migration 016 (Gesha collapse, JARC blend rename, Garnica moved to Modern Hybrids).
- **Canonical Cultivar Registry** — ~20 approved cultivar names (Gesha variants, Ethiopian landrace population, 74110/74112/74158, Mejorado, Sidra, Pacamara, Laurina, Mokkita, Garnica, Castillo, Marsellesa, Caturra, Catuaí, Bourbon variants, Pink Bourbon).
- **Per-cultivar attributes** — 15+ fields per cultivar (Genetic Background / Typical Origins / Altitude Sensitivity / Terroir Transparency / Common Processing / Typical Flavor Notes / Acidity Style / Body Style / Aromatics / Extraction Sensitivity / Roast Tolerance / Roast Behavior / Resting Behavior / Brewing Tendencies / Common Pitfalls / Market Context / Limiting Factors).
- **Validation checklist** — 5 questions before adding a new cultivar.
- **Ethiopian quick classification rule** — JARC number → JARC lineage; Gesha/Geisha → Gesha lineage; heirloom/landrace → Ethiopian landrace population.

**The port is mechanical for structure + framework, interpretive for per-cultivar content.** The doc currently has the ruleset but does not have the 15+ per-cultivar attribute content filled in for all ~20 cultivars. Chris's research phase (step 1 of the canonical adoption workflow) fills that in.

---

## Canonical adoption workflow (for this sprint)

Per [attribution § Canonical adoption workflow](reference-taxonomies-attribution.md#canonical-adoption-workflow):

1. **Research (Chris).** Chris works through the ~20 canonical cultivars and drafts per-cultivar content. For each cultivar, fill the ~15-18 attributes. External sources likely to inform: Rob Hoo's *Cultivar: A Practical Guide for Coffee Roasters*, World Coffee Research's cultivar database, SCA resources, specific roaster cultivar pages. Chris authors in his voice, citing external sources in the per-taxonomy `## Sources` block.
2. **Draft (Chris).** Chris shares the draft `docs/taxonomies/varieties.md` inline or via branch.
3. **Vet (Claude).** Claude checks:
   - Every cultivar in the canonical list has content for every attribute (or explicit "insufficient data" marker).
   - No behavioral trait is leaking into genetic classification.
   - Marketing names are normalized (e.g. "Geisha" → "Gesha (Panamanian selection)").
   - All cultivars in the current DB (`cultivars` table) are covered OR flagged as candidates to drop/merge.
   - Naming matches `lib/cultivar-family-colors.ts` and any existing `lib/*-registry.ts` that touches cultivars.
4. **Iterate.** Loop until coverage + naming are right.
5. **Adopt.** Commit `docs/taxonomies/varieties.md`.
6. **Port / enrich.** `lib/cultivar-registry.ts` already exists (PR #30). This step reconciles the canonical list in the registry with the adopted taxonomy markdown. Differences are resolved case-by-case: add to registry, add an alias, or drop from markdown. Lineage list in the registry reconciles the same way. Aliases map gets extended for any trade-name drift surfaced during research.
7. **Render.** `/cultivars/[id]` renders a REFERENCE block above the existing synthesis block. Content is the per-cultivar section from `varieties.md` plus external citations.
8. **Enforce.** `/add` refuses non-canonical cultivar names (`CanonicalTextInput` with `CULTIVAR_LOOKUP`). `/brews/[id]/edit` uses the same input. Sync V1 already consumes `CULTIVAR_LOOKUP` per `SYNC.md`; no additional integration needed.

---

## Per-cultivar content fields

Each canonical cultivar in `docs/taxonomies/varieties.md` gets a structured block. Fields come from Chris's Google Doc, reordered slightly for rendering coherence.

```markdown
### <Cultivar Name>

**Species:** Arabica | Robusta | Liberica | Eugenioides
**Genetic Family:** <family from registry>
**Lineage:** <lineage from registry>

#### Genetics
- **Genetic Background:** [origin + breeding history]
- **Market names normalized here:** [list of common misnomers that resolve to this canonical name]

#### Agronomy
- **Typical Origins:** [regions where commonly grown]
- **Altitude Sensitivity:** [optimal elevation range]
- **Limiting Factors:** [yield / disease / wind / maturation quirks]
- **Market Context:** [specialty premium / experimental / volume stable / competition-driven]

#### Reference Content — Brewing & Cup Profile
- **Typical Flavor Notes:** [characteristic flavors across terroirs]
- **Acidity Style:** [citric linear / malic rounded / phosphoric sparkling / low muted]
- **Body Style:** [tea-like / medium silky / dense syrupy]
- **Aromatics:** [aromatic profile]
- **Terroir Transparency:** [how much terroir shows through]
- **Extraction Sensitivity:** [forgiving / demanding]
- **Brewing Tendencies:** [pour-over / omni / espresso fit]

#### Reference Content — Roasting
- **Roast Tolerance:** [optimal roast range]
- **Roast Behavior:** [shorter dev / extended dev / mutes easily]
- **Resting Behavior:** [fast opener / improves long rest / volatile early]
- **Common Pitfalls:** [underdevelopment risk / over-fermentation amplification / roast flattening]

#### Observed Across My Corpus
<Chris's tested claims for this cultivar, sample-size-aware voice. Absent if zero own brews.>

---
```

**Sizing:** 20 cultivars × ~18 fields each = ~360 content cells. A substantial research exercise. Not a single-evening task.

**Rendering on `/cultivars/[id]`:** The REFERENCE block surfaces the Genetics + Brewing + Roasting content. The "Observed Across My Corpus" block renders alongside, same visual weight. External citations appear at the bottom of the page via `## Sources` (per attribution spec).

---

## Enforcement specifics

**`/add` flow.** The self-roasted 9-step wizard + the (not-yet-built) purchased flow both consume `lib/cultivar-registry.ts`. `CanonicalTextInput` refuses a non-canonical name with the standard 3-tier lookup: exact → substring → 3-char prefix. "Did you mean X?" warning surfaces when input doesn't resolve.

**`/brews/[id]/edit`.** Same `CanonicalTextInput` primitive.

**Sync V1.** Paste-in from Claude project thread hits the canonical check. New cultivar in paste-in triggers the 5-question validation checklist (from Chris's Google Doc):
1. Do I know its genetic root?
2. Is this a true cultivar or a marketing name?
3. Is it a landrace selection, mutation, cross, or hybrid?
4. Does it fit within an existing lineage?
5. Am I mixing genetics with cup behavior?

If all 5 pass and Chris confirms, the registry accepts a new canonical entry. If any fail, sync paused with a decision prompt — no silent insert.

**Schema note.** The `cultivars` table already uses canonical-name-as-unique-key (per migration 016 + the feedback memory). This sprint does not change the schema; it wraps the existing column in a `lib/cultivar-registry.ts` that the app reads against. The DB and the markdown are canonical together. Sprint-1 of this feature snapshots the current DB list as the initial `lib/` export, then iterates to match the adopted taxonomy markdown.

---

## Dependencies

- **[Attribution scaffolding sprint](reference-taxonomies-attribution.md#canonical-adoption-workflow)** — ships first. Produces `docs/taxonomies/` directory, header-block template, `## Sources` convention. This sprint assumes those artifacts exist.
- **Sync V1 sub-sprint 1 steps (b) + (c)** — already shipped (PR #30, 2026-04-21). `lib/cultivar-registry.ts` exists with 26 canonical names + 13 lineages from DB snapshot. This sprint enriches the registry with curated canonical content + authored reference material, not greenfield extraction.
- **Sync V1 step (d) dog-food** — has Mokka-cultivar pre-req flagged. Chris's Variety research resolves this. The two work in the same cycle.
- **No hard dependency on Region.** Region can ship before or after Variety — they're independent A1 ports. Both register extracts exist; both get enriched.

## Sizing

- **Chris's research phase:** unbounded. Chris drives. Likely 2-5 focused sessions depending on depth of per-cultivar authoring.
- **Claude's port + render + enforce phase:** 1 sprint after Chris hands over the final `varieties.md` draft.
  - Extract `lib/cultivar-registry.ts`.
  - Render REFERENCE block on `/cultivars/[id]`.
  - Update `/add` + `/brews/[id]/edit` canonical inputs.
  - Verify in preview against 2-3 existing `/cultivars/[id]` pages (Gesha lineage, Bourbon lineage, Modern Hybrids).

## Out of scope (this sprint specifically)

- **Per-cultivar pages beyond `/cultivars/[id]`.** No route split.
- **Cultivar hierarchy navigation** (`/cultivars/families/<family>` etc.). The existing index already groups by Genetic Family → Lineage.
- **Auto-suggest from partial paste-in in sync V1.** Sync uses the registry; smart suggestions are deferred until sync V1 is running on real paste-ins.
- **Pedigree graph visualization.** Out of umbrella scope entirely.
- **Retroactive re-render of AI-generated cultivar syntheses** against the new reference content. Old synthesis text stays; new content surfaces alongside, not replacing.

## Open questions

- **Coverage threshold for "done."** Is 20 canonical cultivars enough, or does Chris want to extend to ~30-40 for a truly preloaded library? Defer to research phase — Chris will know when the list feels closed.
- **How to represent blends.** Chris's doc says blends are cultivars, not lineages. For a JARC 74110/74112 blend: render under "Blends" section, or as a separate cultivar entry with parent-cultivar links? Decide during research phase.
- **Ethiopian landrace population content depth.** It's a catch-all for un-identified Ethiopian coffees — does it earn the same ~18 attribute coverage as a named selection? Probably less, since "by definition unidentified" caps what can be claimed. Decide during research phase.

## Sources (for this feature doc)

- Chris's ChatGPT context doc: `context for chatgpt on coffee info, terroir, cultivar, best brew`
- [reference-taxonomies-attribution.md](reference-taxonomies-attribution.md) (umbrella meta)
- [CLAUDE.md § Cultivar Registry Rules](../../CLAUDE.md) (existing repo convention)
- Migration 016 (Gesha collapse, JARC blend, Garnica relocation)

Per-cultivar authored content sources will be captured in `docs/taxonomies/varieties.md` `## Sources` block when that file is authored. Likely primary external reference: Rob Hoo, *Cultivar: A Practical Guide for Coffee Roasters*.
