# Reference Taxonomies — Flavor

Per-taxonomy feature doc for the Flavor-note taxonomy. Part of the [Reference Taxonomies umbrella](reference-taxonomies-attribution.md). **Phylum A2 (author new ruleset, loose enforcement bar).** Fifth sprint or deferred.

Written 2026-04-21 from the Reference Taxonomies brainstorm. Pattern reference: [reference-taxonomies-attribution.md](reference-taxonomies-attribution.md) for shared conventions.

---

## Scope

Flavor is the **only taxonomy in the umbrella with a loose enforcement bar.** Chris during Part 1: *"subjective by nature. This one will have the most grey area. Similar to process I might have to settle for 20% of the major words that cover 80% of the cases and not try to go for full completion here."* And closing Part 1: *"Flavor - I should probably do the painful work of collecting it myself across a bunch of different sources. But this one unlike region or cultivar could enforce more weakly. Flavor is subjective by default so more freeform text or multi select or slight variations is totally OK here."*

Scope:
- Extend the existing `lib/flavor-registry.ts` (132 canonical tags, 8 families + Other, 3-tier classifier) with richer authored reference content.
- Content at **family level**, not per-tag. 8 families + Other = 9 authored sections, not 132.
- Extensions to the canonical tag list sourced from roaster offered-coffees pages (Leaves, Substance, Noma Kaffe, Heart, Hydrangea) + Chris's own vocabulary over time.
- Enforcement: **loose**. `/add` may warn ("did you mean X?") but does NOT refuse non-canonical tags. Subjective nature of flavor vocabulary + "keep data, classify on render" pattern means loose tolerance is correct.

Out of scope:
- **Per-tag detail pages.** Loose enforcement + family-level content = no `/flavor-notes/<tag>` routes.
- **Flavor wheel visualization.** Useful someday; not in umbrella scope.
- **Retroactive canonicalization of all existing `brews.flavor_notes`**. The 3-tier substring classifier already handles composite tags ("Floral sweetness" → Floral) at render time. No migration required.
- **Cross-family tag relationships** (e.g. "Stone fruit sweetness" in both Stone Fruit and Sweet & Confection). Single-family assignment per tag; render-time family resolution already in place.

---

## Starting point — `lib/flavor-registry.ts`

Unlike Process + Dripper, Flavor has a substantial existing canonical registry:

- **132 canonical tags** across 8 families + Other (Citrus / Stone Fruit / Berry / Tropical / Grape & Wine / Floral / Tea & Herbal / Sweet & Confection).
- **3-tier classifier** — exact → case-insensitive → longest canonical substring. The substring tier is the "keep data, classify on render" pattern: composite tags like "Floral sweetness" resolve to Floral family without a migration.
- **Hue-separated family palette** already defined.
- **`aggregateFlavorNotes(brews)`** helper for family aggregation.

**The authoring work is extending the tag list + adding family-level reference content.** Per-tag classification is already solved.

---

## Canonical adoption workflow (for this sprint)

Per [attribution § Canonical adoption workflow](reference-taxonomies-attribution.md#canonical-adoption-workflow):

1. **Research (Chris).** Chris:
   - Reviews current 132-tag list for gaps.
   - Pulls additional canonical tags from roaster offered-coffees pages (Leaves, Substance, Noma Kaffe, Heart, Hydrangea) — these are the roasters whose tasting-note vocabularies are worth absorbing.
   - Drafts family-level reference content: what does "Stone Fruit" mean in his vocabulary, where does "Grape & Wine" typically show up, what's the distinction between "Floral" and "Tea & Herbal" at the boundary.
   - Decides on tag-level extensions. Likely ~20-30 new tags to cover common roaster vocabulary gaps.
2. **Draft (Chris).** Shares `docs/taxonomies/flavors.md` draft + proposed `lib/flavor-registry.ts` additions.
3. **Vet (Claude).** Claude checks:
   - New tags classify correctly via the 3-tier classifier. If not, family assignment is explicit.
   - No new tag duplicates an existing tag's semantic range (avoid "Yellow Peach" when "Peach" already covers it).
   - Family-level reference content framing is consistent — what the family means + where it shows up + when it's a signal vs. noise.
   - Citations captured in `## Sources` block (roaster websites as primary external sources).
4. **Iterate.** Loop.
5. **Adopt.** Commit `docs/taxonomies/flavors.md` + `lib/flavor-registry.ts` updates.
6. **Port.** Extend `lib/flavor-registry.ts` (already exists; this sprint grows the tag list + family descriptions). No new lib file.
7. **Render.** No new app page. Family-level reference content excerpts into the existing FLAVOR NOTES blocks on aggregation detail pages (terroirs / cultivars / processes / roasters). The `FlavorNotesByFamily` component already groups; this sprint adds a one-line family definition under the family label when the family has authored content.
8. **Enforce.** `/add` warns but does not refuse non-canonical tags (loose bar). `/brews/[id]/edit` same.

---

## Per-family content fields

Each of the 8 families + Other in `docs/taxonomies/flavors.md` gets a structured block. Content is at family level, not per-tag.

```markdown
### <Family Name>

**Canonical tags in this family:** [list of tags that classify to this family, from lib/flavor-registry.ts]
**Family color:** [hex from lib/flavor-registry.ts]

#### What This Family Means in My Vocabulary
[Chris's voice, 3-5 sentences. What the family covers, what it doesn't, where the boundaries sit.]

#### Where This Family Typically Shows Up
[Cross-references: which macro terroirs + cultivars + processes typically produce this family. Plain text, not linked per umbrella default.]

#### Signal vs. Noise
[When this family is a meaningful tasting claim vs. when it's a catch-all. E.g. "Berry" on a Gesha often means specific strawberry / blueberry; on a darker roast it can be a catch-all for any red-fruit expression.]

#### Observed Across My Corpus
<Chris's tested claims about this family, sample-size-aware voice.>

---
```

**Sizing:** 9 sections × ~4 content cells = ~36 content cells. By far the smallest of the five A taxonomies by authoring volume, because content is family-level rather than per-entity.

**Rendering.** The `FlavorNotesByFamily` component on aggregation pages already groups tags by family and colors the label. This sprint adds:
- A one-line family definition under each family label when authored content exists.
- A link to `docs/taxonomies/flavors.md` family section if Chris wants more depth.

No new `/flavor-notes/` top-level page in this sprint. If a flavor reference page earns its keep later (post-adoption, based on reader friction), it's a small follow-up — rendering `flavors.md` as a server component, same pattern as the planned `/roasting-guide/`.

---

## Enforcement specifics

**`/add` flow (loose bar).** The existing `FlavorNotesInput` chip component already does 3-tier classification. This sprint:
- Keeps the existing warn-don't-refuse behavior.
- Adds the family label to the warning ("Did you mean 'Peach' (Stone Fruit)?")
- Does NOT add a hard refusal even for completely novel tags.

**`/brews/[id]/edit`** — same.

**Sync V1.** Paste-in from Claude project routes flavor tags through the 3-tier classifier. Non-canonical tags get added with a warning logged, not refused. Sync V1 surfaces the warning for Chris to review post-insert.

**Schema note.** `brews.flavor_notes` is `text[]` (not FK'd). The registry is a lib-level validator, not a schema constraint. No migration.

---

## Dependencies

- **Attribution scaffolding sprint** ships first.
- **Variety + Region + Process + Dripper** ship before — Flavor is 5th in queue and may be deferred indefinitely if higher-priority work comes up.
- **Sync V1** consumes the existing + extended `lib/flavor-registry.ts`. Already compatible.

## Sizing

- **Chris's research + authoring phase:** 1-2 sessions. Family-level content is less volumetric than per-entity authoring.
- **Claude's port + render + enforce phase:** half a sprint. Mostly lib additions + one small rendering change to `FlavorNotesByFamily`.

## Out of scope (this sprint specifically)

- **Per-tag detail pages.** Loose bar doesn't earn per-entity depth.
- **Flavor wheel visualization.** Separate feature if earned.
- **Retroactive canonicalization of `brews.flavor_notes`.** Already handled by render-time classifier.
- **Cross-family tag assignment.** Tags stay mono-family.
- **Flavor × process or flavor × cultivar co-occurrence analysis.** Data exists but rendering is a separate feature.
- **`/flavor-notes/` top-level page.** Deferred; revisit post-adoption if reader friction emerges.

## Open questions

- **Tag list growth rate.** If sync V1 + /add paste-ins from roasters introduce new non-canonical tags at ~1-2 per week, does the registry grow by Chris editing `lib/flavor-registry.ts` or is there a lightweight accept-into-canonical flow? Current design is "deliberate edit, not drift" — Chris reviews and commits. Revisit if volume overwhelms.
- **Substance / Noma / Heart vocabulary absorption depth.** Some roasters use highly specific poetic notes ("alpine strawberry jam", "morning dew", "peach iced tea"). Do those get canonical absorption or stay as render-time substring classifications? Probably the latter — per the "keep data, classify on render" principle. Chris's research phase decides.
- **Family boundaries.** Does "Grape & Wine" absorb "Red Wine" as a sub-family, or stay flat? Currently flat (single 8-family hierarchy). No hierarchy change in this sprint.
- **Rendering priority.** If this sprint deprioritizes, does the reference content still get authored into `docs/taxonomies/flavors.md` and left un-rendered in-app until a later sprint? Probably yes — the markdown is useful as reference even without render. Chris's call.

## Sources (for this feature doc)

- [reference-taxonomies-attribution.md](reference-taxonomies-attribution.md)
- `lib/flavor-registry.ts` (existing canonical starting point, 132 tags, 8 families)
- Roaster offered-coffees pages: Leaves, Substance, Noma Kaffe, Heart, Hydrangea (primary external sources for tag extension)
- `memory/project_flavor_canonicalization.md` (2026-04-17 prior sprint — "keep data, classify on render" principle)

Per-family authored content sources captured in `docs/taxonomies/flavors.md` when that file is authored.
