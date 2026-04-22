# Reference Taxonomies — Process

Per-taxonomy feature doc for the Process taxonomy. Part of the [Reference Taxonomies umbrella](reference-taxonomies-attribution.md). **Phylum A2 (author new ruleset, same discipline).** Third sprint after Variety + Region.

Written 2026-04-21 from the Reference Taxonomies brainstorm. Pattern reference: [reference-taxonomies-attribution.md](reference-taxonomies-attribution.md) for shared conventions.

---

## Scope

Process sits in Phylum A2: Chris is willing to do the upfront authoring work because long-term it saves time. Chris during Part 1: *"the high level process taxonomy should be more straight forward, but the downstream process tags expand fairly quickly. Similar to region names there are no set names for a lot of these things. But I think trying to capture 20% of the processes that matter 80% will have high leverage."*

Scope:
- Canonical 2-level hierarchy: **Process Family → Process**. Family-level is already stable (Washed / Natural / Honey / Anaerobic / Experimental, per `lib/process-families.ts`). Process-level is the authoring work.
- **20/80 coverage target.** Not exhaustive. The ~20-25 processes that account for 80% of Chris's buying patterns + the ones that differ enough to warrant distinct roasting / brewing framing.
- Per-process authored reference content (see [Per-process content fields](#per-process-content-fields) below).
- Reference to external work from Roberta Sami's process taxonomy (www.robertasami.com/processes) — Chris authors, cites Sami where applicable.
- Enforcement: strict. `/add` refuses non-canonical process names (with "did you mean X?" warning for close matches).

Out of scope:
- Fermentation-science depth (bacteria strains, pH curves, mucilage biochemistry). Reference content stays at the level Chris uses operationally: what does this process tell me about extraction + roast behavior, what are the common pitfalls, what's the fingerprint.
- Experimental sub-variants below the 20% threshold. Edge cases can be added post-adoption via deliberate registry edits.
- Per-process detail pages beyond the existing `/processes/[slug]`.

---

## Starting point — `lib/process-families.ts` + Sami's taxonomy

Unlike Variety + Region, Process has **no existing authored ruleset in Chris's Google Doc.** The starting points are:

1. **`lib/process-families.ts`** — the current canonical list (~20 processes across 5 families) + family color palette + `getProcessFamily` classifier. This is the existing registry that gets wrapped with richer reference content.
2. **Roberta Sami's process taxonomy** (https://www.robertasami.com/processes) — the primary external reference Chris will draw from. Sami's taxonomy is single-page, visually organized, and aligned with Chris's framing.
3. **Brew corpus experience** — Chris's 55-brew corpus covers a meaningful range of process variants (Washed / Anaerobic Washed / Natural / Anoxic Natural / White Honey / Double Anaerobic Thermal Shock / Tamarind Co-ferment / etc.). Tested claims live in "Observed Across My Corpus" per-process sections.

**The authoring work is the first canonical adoption cycle.** Unlike A1 (port existing doc), A2 has research + draft + vet as substantive thinking, not mechanical translation.

---

## Canonical adoption workflow (for this sprint)

Per [attribution § Canonical adoption workflow](reference-taxonomies-attribution.md#canonical-adoption-workflow):

1. **Research (Chris).** Chris:
   - Audits Sami's process taxonomy for coverage + framing.
   - Reviews his 55-brew corpus for which processes have earned preloaded reference content.
   - Drafts a canonical process list — likely 20-25 entries.
   - Drafts per-process content for each, authoring in his voice + citing Sami where relevant.
   - Decides the 20% cutoff: which processes are canonical, which are experimental / edge-case / not included.
2. **Draft (Chris).** Shares `docs/taxonomies/processes.md` draft.
3. **Vet (Claude).** Claude checks:
   - Every process in the canonical list has Family assignment + reference content.
   - Family assignments are consistent with `lib/process-families.ts` (or diffs are deliberate).
   - Sami citations are per-section where relevant; general influence captured in `## Sources` block.
   - Every distinct `brews.process` value currently in DB is either (a) in the new canonical list, (b) aliased to a canonical name, or (c) flagged as an intentional exclusion.
   - No behavioral fingerprint is overriding process-family classification (a process that tastes natural-like but is washed stays in Washed).
4. **Iterate.** Loop until coverage + naming are right.
5. **Adopt.** Commit `docs/taxonomies/processes.md`.
6. **Port.** Extend `lib/process-families.ts` to export a richer `PROCESS_REGISTRY` with the canonical list + per-process metadata stub. The family map + family colors stay. Add a `CanonicalLookup` wrapper via `makeCanonicalLookup` so `/add` + sync V1 can enforce.
7. **Render.** `/processes/[slug]` renders a REFERENCE block above the existing synthesis. Content = per-process section from `processes.md` + `## Sources` at page bottom.
8. **Enforce.** `/add` refuses non-canonical process names. `/brews/[id]/edit` same. Sync V1 same.

---

## Per-process content fields

Each canonical process in `docs/taxonomies/processes.md` gets a structured block.

```markdown
### <Process Name>

**Family:** Washed | Natural | Honey | Anaerobic | Experimental
**Common aliases normalized here:** [list of variants that resolve to this canonical name]

#### What This Process Is
- **Short description:** [1-2 sentence description of the method]
- **Fermentation style:** [aerobic / anaerobic / sealed / inoculated / thermal-shock / etc.]
- **Drying method:** [patio / raised bed / mechanical / parchment-on / parchment-off]
- **Handling detail:** [any notable differences from family norm]

#### Reference Content — Extraction & Brewing
- **Typical cup fingerprint:** [what this process commonly produces]
- **Extraction tendency:** [clarity-first / balanced / full expression fit]
- **Common pitfalls:** [over-fermentation / mute / astringency / uneven ferment]
- **When this style delivers:** [conditions under which it's at its best]
- **When it goes off:** [failure modes to watch for]

#### Reference Content — Roasting
- **Density / moisture tendency:** [what greens from this process typically behave like]
- **FC-floor / roast-temp tendency:** [if process meaningfully affects roasting]
- **Notes:** [other roasting-side framing]

#### Observed Across My Corpus
<Chris's tested claims for this process, sample-size-aware voice. Absent if zero own brews.>

---
```

**Framing rule.** Per `memory/user_taste_evolution.md` (taste widened 2026-04-16): process reference content frames "when this style delivers vs. when it goes off" — NOT good/bad scoring. Chris's palate now appreciates controlled naturals, co-ferments, red-wine profiles; per-process content cannot read as if the clean-washed style is the "correct" reference. The existing `/processes/[slug]` synthesis prompt already enforces this framing; per-process reference content inherits the rule.

**Sizing:** 20-25 processes × ~12 fields = ~250 content cells. Similar weight to Region.

---

## Enforcement specifics

**`/add` flow.** `CanonicalTextInput` bound to `lib/process-families.ts` (with new canonical wrapper). Refuses non-canonical; 3-tier classifier suggests close matches.

**New process submission.** A `/add` submission with a non-canonical process triggers a validation prompt — but processes differ from macros (there's no universal validation checklist like the 4-question macro check). Instead: the prompt asks Chris to either pick an existing family + normalize the name, or flag it for taxonomy expansion. No silent insert.

**Family assignment.** Every process in the canonical list has an explicit family. The family classifier in `lib/process-families.ts` becomes driven by the registry, not a separate lookup map.

**Sync V1.** Paste-in from Claude project hits the canonical check. Non-canonical process triggers the same prompt as `/add`.

---

## Dependencies

- **Attribution scaffolding sprint** ships first.
- **Variety + Region sprints** ship before. No hard data dependency, but Process's research phase benefits from being after the A1 sprints have established the adoption cadence.
- **Sync V1** — coordinate so `lib/process-families.ts` gets extracted with canonical wrapper once, not multiple times.

## Sizing

- **Chris's research + authoring phase:** likely 3-5 sessions. A2 is heavier than A1 because there's no existing doc to port from.
- **Claude's port + render + enforce phase:** 1 sprint.

## Out of scope (this sprint specifically)

- **Second-level process hierarchy** (e.g. Washed → Fully Washed / Semi-Washed / Kenyan). If the 20% canonical list needs sub-process detail, it lives in the per-process section as handling-detail content, not a separate hierarchy layer.
- **Reclassification of in-DB brew rows to canonical process names.** If `brews.process` has drift-y values (e.g. "Anaerobic Natural Washed" vs canonical "Anaerobic Washed"), reclassify as a cleanup task inside the port, not a parallel migration sprint.
- **Process × Cultivar cross-aggregation pages.** The reference-roast doc's cultivar × process primary aggregation is roasting-side, not a brewing surface.
- **Fermentation-temperature tracking.** Not in this scope.

## Open questions

- **Where to draw the 20% line.** Chris's corpus has ~20 distinct processes today; Sami's taxonomy likely has 30-50. The canonical list is Chris's judgment call during research.
- **How to represent composite processes** (e.g. "Double Anaerobic Thermal Shock"). One canonical entry with the composite name, or nested under Anaerobic with variant detail? Decide during research phase. Current `lib/process-families.ts` treats them as flat canonical entries — continue that pattern unless the research surfaces a reason to change.
- **Sami attribution scope.** Is Sami cited once at the bottom of `processes.md` (per umbrella convention), or is each Sami-influenced section noted? Default is umbrella convention (single `## Sources` block). Revisit only if Chris wants finer granularity for this specific taxonomy.
- **Experimental family.** By its nature this family has the most drift risk — every new co-ferment is a new entry candidate. Needs the tightest "deliberate edit, not drift" discipline.

## Sources (for this feature doc)

- [reference-taxonomies-attribution.md](reference-taxonomies-attribution.md)
- `lib/process-families.ts` (existing canonical starting point)
- Roberta Sami, process taxonomy: https://www.robertasami.com/processes
- Chris's 55-brew corpus (brews table)

Per-process authored content sources captured in `docs/taxonomies/processes.md` when that file is authored.
