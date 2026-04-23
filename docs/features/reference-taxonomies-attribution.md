# Reference Taxonomies — Attribution Architecture

Meta-architecture document for the "Reference Taxonomies" umbrella. Scoping only. No implementation proposal.

Written 2026-04-21 after a four-part interpretive brainstorm session. Sibling per-taxonomy docs (Region / Variety / Process / Dripper / Flavor) reference this one for shared conventions. Grind-size analysis is Phylum C (placement-only) and lives as a sprint-queue line item, not a feature doc.

Pattern reference: [reference-roast-and-guide.md](reference-roast-and-guide.md) — same four-part session shape (purpose / architecture / surface / phasing), same "authored, not computed" framing, same "retro before docs" sprint cadence.

---

## Vision — the umbrella's why

> **Preload canonical knowledge. Compound observations against it.**

Today Chris's taxonomies compound *as he accumulates brews* — his 14-brew Gesha corpus teaches him what Gesha is, iteration by iteration. That works, but it means the app has nothing to say about a cultivar until he's tried it.

The umbrella flips this. Each canonical entity (a macro terroir, a cultivar, a process, a dripper, a flavor family) gets **authored reference content preloaded** before the first brew lands. When Chris buys his first Pacas, `/cultivars/pacas` already renders genetic background, typical origins, roast tolerance, flavor character, extraction sensitivity. His first Pacas brew then adds observations *against* that preloaded framework — not from zero.

Two structural wins:

1. **Drift prevention.** The ChatGPT context doc Chris uses today (`context for chatgpt on coffee info, terroir, cultivar, best brew`) is a working taxonomy ruleset, but unenforced. As of 2026-04-21 his doc lists 14 macro terroirs; the DB has 21 (post-migration 015). That ~1-month drift in his own canonical artifact is Exhibit A. Porting the doc into the repo and making it the enforcement contract eliminates the drift source.
2. **Pre-brew utility.** Today the app is empty for an entity with zero brews. Post-umbrella, the app is useful from day one of a new bean — preloaded reference content frames the first brew instead of waiting for it.

---

## Phyla map

The 7 original candidates contracted and clustered into three kinds of work. The shapes are genuinely different — worth preserving the distinction when a taxonomy sprint fires.

| Phylum | What it is | Candidates | Enforcement bar |
|---|---|---|---|
| **A1 — port existing ruleset** | The ruleset already exists in Chris's Google Doc. Work is mechanical: port to markdown, lock the registry, enforce on entry. | Region, Variety | Strict |
| **A2 — author new ruleset, same discipline** | No complete ruleset yet. Chris authors, drawing on external sources where relevant. Needs research + vet cycles before port. | Process, Dripper, Flavor | Strict (Process, Dripper) / Loose (Flavor) |
| **C — placement / maintenance** | Not taxonomy-building. Either existing work needs a home, or it's a cleanup affordance. | Grind size (EG-1 only) | Narrow scope |

**Dropped from scope:**
- **Tag cleanup mechanism** — eliminated by Phylum A enforcement. A merge/rename UI is a symptom of unenforced registries. With A locked down, cleanup doesn't earn its own feature.
- **Equipment beyond grind** — not a taxonomy. If equipment reference content earns a home, it's a BREWING.md extension, not a canonical registry.

---

## Attribution architecture — seven decisions

Resolved during Part 2 of the brainstorm. These apply to every taxonomy doc in the umbrella.

### 1. Single-pipeline authoring
Chris is always the author. External sources (Roberta Sami, Rob Hoo, Dongzhe, boutique roaster websites) are inputs to his authoring, not first-class content in the app. The taxonomy markdown reads in Chris's voice throughout; citations name the sources that informed his authoring.

### 2. Citation format — bottom-of-page `## Sources` block
Each taxonomy markdown file ends with a `## Sources` block listing the external sources that fed it. One-line entries with author + URL. No inline citation markers — they'd be noise at Chris's source volume.

Example:
```markdown
## Sources

- Roberta Sami — dripper taxonomy (www.robertasami.com/drippers)
- Rob Hoo — *Cultivar: A Practical Guide for Coffee Roasters* (book)
- Hacienda La Esmeralda — El Velo "NC" climate-controlled natural offerings page
```

### 3. Tested vs untested claim signal — voice-only
External-sourced claims use tentative voice: *"Hoo notes Gesha shows jasmine / bergamot / stone fruit aromatics."* Chris's tested observations use confirmed voice: *"Observed across my Gesha corpus (5 brews, Apr 2026): aromatic intensity rests out at day 10-12."* No badges, no schema separation, no row-level provenance tracking. Voice carries the signal.

Mirrors the `/roasters/[id]` precedent: roasters with fewer than 3 brews render a "early data — patterns will firm up" framing. Same sample-size-aware voice principle, applied to taxonomy claims.

### 4. Graduation — never
External claims do **not** graduate to "Chris's tested claim." They stay cited forever. When Chris accumulates his own corpus on an entity, the new observations live in a separate section alongside the external claims, in his own voice, with their own mini-header ("Observed across my corpus"). Reader sees both. No state machine, no N-threshold auto-upgrade, no conscious-audit cadence.

This is the most attribution-honest option. It also has zero tracking infrastructure, which is the right cost at this scale.

### 5. Peer tier — roasting-only
The reference-roast doc established Dongzhe as a peer whose data transfers closely because he uses the same Roest L200 Ultra in counterflow mode. Machine-specificity makes roasting-side peer attribution tight. **That pattern does not extend to brewing.** On the brewing side, all external sources — Sami, Hoo, boutique roasters — sit in the same "influence, not tested" tier regardless of who they are. Brewers transfer across setups in a way roasters don't.

### 6. Curation gate — no whitelist
Chris curates per-claim at authoring time. There is no approved-source registry. The `## Sources` block on each page is implicitly the per-page source list — a new source appearing means a deliberate authoring edit, visible in git diff.

Rationale: low volume (~5-10 sources total across all taxonomies), hand-picked by Chris, makes registry overhead unjustified. The macro-terroir registry gate exists because the set is large (21+) and entries are easy to drift on; the source list is small and entries are deliberate.

### 7. Enforcement bar — varies per taxonomy
Each taxonomy doc declares its own enforcement bar in a header block (see [Header-block template](#header-block-template) below). Bars:

- **Strict.** Closed canonical list. New entries require deliberate doc edit + validation check. `/add` refuses non-canonical values. Sync V1 refuses to create new entries without an approve/decline gate. Applies to: Region, Variety, Process, Dripper.
- **Loose.** Canonical list exists but free-form variation is acceptable (subjective domain). `/add` may warn ("did you mean X?") but does not refuse. Applies to: Flavor.

---

## Canonical adoption workflow

Every taxonomy sprint follows the same cadence. Chris named this during Part 4: *"go do a bunch of research, come back with a canonical list you vet, go back and forth before we adopt."*

1. **Research (Chris).** Chris drafts the canonical list and per-entity authored content. A1 taxonomies (Region, Variety) start from the Google Doc; A2 taxonomies (Process, Dripper, Flavor) start from scratch, drawing on external sources.
2. **Draft (Chris).** Chris commits a draft markdown to a working branch or shares it inline.
3. **Vet (Claude).** Claude reviews for coverage gaps, naming inconsistency with existing `lib/*-registry.ts` files, drift risk, missing validation rules. Surfaces concerns with concrete examples.
4. **Iterate.** Chris + Claude loop until the list is right.
5. **Adopt.** Chris commits the final draft to `docs/taxonomies/`.
6. **Port.** Claude ports to `lib/*-registry.ts` (or extends existing), updates relevant aggregation pages to render the reference content, updates `/add` flow to enforce.
7. **Render.** Reference content surfaces on the existing aggregation detail page (Region → `/terroirs/[macro]`, Variety → `/cultivars/[id]`, Process → `/processes/[slug]`) as a new REFERENCE block above the existing synthesis block.
8. **Enforce.** `/add` refuses non-canonical values (or warns, for Flavor). Claude-authored sync V1 (when it ships) consumes the same contract.

**Research scope is Chris's to own** — Claude can surface known gaps but can't author the canonical list from training data without drifting into hallucinated authority. Vetting is Claude's job. Porting is Claude's job. The thinking is Chris's.

Mirrors the "plan before coding when scope is interpretive" CLAUDE.md rule, applied to taxonomy authoring.

---

## File layout convention

```
docs/
  features/
    reference-taxonomies-attribution.md     ← this doc (meta)
    reference-taxonomies-region.md          (A1 port)
    reference-taxonomies-variety.md         (A1 port, sprint-1 deliverable)
    reference-taxonomies-process.md         (A2 author)
    reference-taxonomies-dripper.md         (A2 author, BREWING.md integration)
    reference-taxonomies-flavor.md          (A2 author, loose bar)
  taxonomies/
    regions.md                              (rendered content, single file per taxonomy)
    varieties.md
    processes.md
    flavors.md
BREWING.md                                  (gains dripper + grind sections)
```

**Single file per taxonomy, not per entity.** `regions.md` contains ~21 per-macro sections; `varieties.md` contains ~20 per-variety sections. Rationale: 65+ per-entity files is overkill, BREWING.md and the planned ROASTING_GUIDE.md already work at this scale, git diffs on authored prose don't need per-entity granularity.

**Dripper + Grind live in BREWING.md.** No standalone `docs/taxonomies/drippers.md` and no `docs/equipment/eg-1-grind-analysis.md`. The canonical dripper list still exists in `lib/` (for `/add` enforcement), but the authored reference content is a new BREWING.md section. Same for grind. Rationale: dripper/grind content is brewing-side reference material; co-locating with BREWING.md matches how Chris actually uses the content (pasted as context into Claude-project brewing threads).

---

## Header-block template

Every `docs/taxonomies/*.md` file opens with a standard header block declaring the taxonomy's enforcement bar, sources, and adoption date. Mirrors the `/roasting-guide/` scope banner pattern from the reference-roast doc.

```markdown
# <Taxonomy Name>

**Enforcement bar:** Strict | Loose
**Canonical registry:** `lib/<taxonomy>-registry.ts` (authoritative for validation)
**Last adopted:** YYYY-MM-DD
**Adoption path:** Port from Chris's Google Doc | Authored new (Chris, informed by [sources])

<one-paragraph scope banner explaining what the taxonomy covers and what's out of scope>

---

## Canonical list

[enumerated list — matches lib/<taxonomy>-registry.ts exactly]

---

## Reference content

### <Entity 1>

[per-entity authored content — varies per taxonomy]

### <Entity 2>

...

---

## Sources

- [External source 1 — URL]
- [External source 2 — URL]
```

---

## Surface integration

Reference content surfaces on the existing aggregation detail pages. Regions / Varieties / Processes already have `/terroirs/[macro]`, `/cultivars/[id]`, `/processes/[slug]` respectively — those pages gain a new REFERENCE block.

**Rendering pattern:**

1. Existing aggregation pages render as-is (synthesis + flavor notes + coffee list + confidence).
2. Above the synthesis, a new REFERENCE block renders from the taxonomy markdown. Looked up by the page's slug → per-entity section in `docs/taxonomies/<taxonomy>.md`.
3. Markdown → HTML at request time (Next.js server component, no runtime fetch). Same pattern as the planned `/roasting-guide/` render.
4. If no reference content exists for a slug, the block silently omits. No placeholder.

**Dripper + Flavor exceptions:**

- **Dripper** does not earn a new top-level aggregation page (`/drippers` is explicitly out of scope). Reference content lives in BREWING.md only.
- **Flavor** does not earn per-tag detail pages. Reference content stays at family-level. May excerpt into the existing FLAVOR NOTES blocks on aggregation pages, or render at a new `/flavor-notes/` index — deferred to the flavor feature doc.

**Cross-references between taxonomies — plain text by default.** Mentions of "Gesha" in `regions.md` render as plain text, not linked. Render-time autolinking (the ROASTING_GUIDE.md pattern) is a nice-to-have but not in scope. Revisit if reader friction emerges.

---

## Enforcement mechanics

Three enforcement surfaces, all consuming the same `lib/*-registry.ts` contract:

1. **`/add` flow** (self-roasted + eventual purchased). Uses `makeCanonicalLookup` from `lib/canonical-registry.ts` — the 3-tier classifier (exact → substring → prefix match) already in production for producer/roaster/flavor. Strict bars refuse non-canonical values; loose bars warn.
2. **`/brews/[id]/edit`** uses the same `CanonicalTextInput` component plus registry — already the pattern for producer + roaster.
3. **Claude-authored sync V1** reads the registries and refuses to silently create new entries; surfaces the validation check defined in the taxonomy doc; asks Chris to approve or decline.

**Adding a new entry to a strict registry** is a deliberate 4-step process:
1. Edit the taxonomy markdown (`docs/taxonomies/<taxonomy>.md`) — add to canonical list + per-entity section.
2. Edit `lib/<taxonomy>-registry.ts` — add to the exported array.
3. If database schema is coupled (e.g. `terroirs.macro_terroir` is a text column validated by the registry), run migration or update existing rows.
4. Commit. The registry is now effective at next deploy.

This is the same discipline already in force for the macro-terroir registry (CLAUDE.md rule), extended to every taxonomy.

---

## Relationship to Claude-authored sync V1

**The taxonomy docs are the contract. The Claude-authored sync pipeline is the enforcer.** Two sides of the same coin, not separate projects.

**Coordination state as of 2026-04-21:**

Sync V1 sub-sprint 1 has already shipped steps (b) + (c):

- `lib/terroir-registry.ts` — 13 countries / 19 macros / 22 mesos as 3 independent `CanonicalLookup` bundles, extracted from DB snapshot.
- `lib/cultivar-registry.ts` — 26 canonical names + 13 lineages as flat `CanonicalLookup` bundles, extracted from DB snapshot. Factory gained an optional `aliases` map (tier-0 resolution) for trade-name drift (e.g. `Geisha` → `Gesha`).
- `SYNC.md` at repo root — validator-table-driven playbook with block/warn semantics, decision-prompt shapes, 6-phase procedure, rollback runbook. Has an "Open taxonomy questions" section explicitly hedging this brainstorm.

**This means the umbrella's Phylum A sprints ENRICH rather than CREATE the registries.** Specifically:

- The lib files exist with DB-snapshot canonical lists. The umbrella's Variety + Region sprints add per-entity authored reference content (`docs/taxonomies/varieties.md`, `docs/taxonomies/regions.md`) and may adjust the canonical name sets per the adoption workflow.
- The `makeCanonicalLookup` factory + `aliases` map + `CanonicalTextInput` component are the enforcement substrate. The umbrella does not need to build them.
- Sync V1 step (d) dog-food has pre-reqs flagged that overlap with the Variety research (Mokka not in cultivar registry — Chris's Variety research resolves this). So Variety research is not just a taxonomy sprint, it's also a sync V1 pre-req.

**Adding a new canonical entry post-umbrella:**
1. Chris edits `docs/taxonomies/<taxonomy>.md` — adds to canonical list + per-entity section.
2. Chris edits `lib/<taxonomy>-registry.ts` — adds the name to the array.
3. Commit. Effective at next deploy.

Same discipline already in force; the umbrella formalizes the markdown-level authored content alongside the registry.

This umbrella does not implement any sync pipeline. It defines what sync must read.

---

## Out of scope

Explicitly out of scope for the umbrella:

- **Auto-sync from app DB back to Chris's Google Doc.** Canonical direction is doc → repo → DB → app. Never reverse.
- **Scraping any external source.** Every citation is Chris-curated. No crawler, no automated ingest.
- **Flavor per-tag detail pages.** Loose enforcement bar doesn't earn per-entity depth.
- **Dripper as a first-class `/drippers` top-level page.** Reference content lives in BREWING.md.
- **`brews.brewer` FK migration** — dripper canonicalization runs through `lib/` registry + `/add` enforcement, not a schema change in this scope.
- **Grind-size analysis for non-EG-1 grinders.** Chris owns one reference grinder; scope stays there.
- **Tag cleanup UI / merge-rename affordance.** Eliminated by Phylum A enforcement.
- **Retroactive migration of reference-style content from PRODUCT.md or `lib/roaster-registry.ts`** into the new `docs/taxonomies/` structure. Leave existing content where it is unless a clean co-location emerges.
- **Claude-authored sync V1 execution.** This umbrella defines the contract. Sync V1 (PRODUCT.md queue #1) consumes it.
- **Methodology-era or schema-level versioning of taxonomy content.** The git history is the version record.

---

## Open questions

Deferred to when the use case fires.

- **Cross-taxonomy autolinking** (ROASTING_GUIDE.md's render-time autolink pattern). Nice-to-have. Not scoped in any per-taxonomy doc; revisit if reader friction from plain-text cross-references emerges.
- **Per-entity confidence banners.** Today the aggregation pages carry a "confidence" signal derived from brew count. Should REFERENCE blocks carry their own confidence indicator (e.g. "authored from Hoo only, untested" vs "authored from Hoo + 5 own brews")? Probably yes; defer to per-taxonomy doc specifics.
- **Adoption staleness.** If a taxonomy's adoption date drifts more than N months without review, does the app flag it? Probably not at current scale — Chris reviews when editing. Revisit when any taxonomy reaches 12 months since last review without an update.
- **Shared reference-block component.** Each per-taxonomy REFERENCE block on the aggregation pages likely renders identical JSX shape. Worth a shared component after 2+ taxonomies ship, not before (YAGNI first pass).
- **Archival snapshots of Chris's Google Doc.** Post-port, the Google Doc becomes a legacy artifact. Snapshot it into `docs/archive/` for historical reference, or let it live externally? Probably externally — Chris uses it for ongoing ChatGPT sessions.

---

## Retro (from the brainstorm session)

Preserved so the next umbrella-scale brainstorm starts better.

**What didn't work:**
- Opened Part 1 treating the 7 candidates as equivalent-shape siblings. The phyla split (A1 / A2 / C) emerged only after Chris attached his ChatGPT context doc. Ask for existing authored artifacts at turn 1, not wait for organic surfacing.
- Initial attribution model was dual-pipeline ("external claims coexist with internal"). Single-pipeline-with-citation was always the right frame; extra complexity was my framing.
- Probed whether Flavor was Phylum A or B when Chris's original rank already answered it.

**What surprised us:**
- Umbrella contracted significantly mid-session. Started at 7; landed at 5 Phylum A taxonomies + 1 tiny Phylum C.
- Preloaded-reference was the most important insight and didn't surface until Part 3. It belongs at the top of this doc, not buried.
- The drift between Chris's Google Doc (14 macros) and the DB (21 macros) is concrete Exhibit A for the enforcement problem. Real, not theoretical.

**What we'd do differently:**
- Ask for existing authored artifacts at turn 1 of any brainstorm.
- Open with a "what's the value prop" frame, not the candidate list.
- Surface sync-pipeline coupling earlier — it reshapes Part 4 phasing.

---

## Retro (from Phylum A1 ports: Variety + Region, shipped 2026-04-22)

Preserved for Phylum A ports still to land (Process / Dripper / Flavor).

**Scope calibration — feature-doc estimates consistently under-estimate by ~4-6×.**
- Variety feature doc estimated ~20 cultivars. Chris's CSV research returned 72 entries; canonical post-vet landed at **63** (3.6× the feature doc).
- Region feature doc estimated ~21 macros. CSV research returned 126 rows + 1 hand-authored extension; canonical landed at **121** across 38 countries / 127 country-scoped entries (5.8× the feature doc).
- **Pattern:** feature-doc estimates run at ~17-28% of final canonical count. For Process / Dripper / Flavor, budget for the CSV to expand meaningfully during Chris's research phase. Don't re-size the sprint off the original feature-doc number once the CSV arrives.

**Pre-sprint dual-registry audit is mandatory, not spot-check.** Variety found 7+ inconsistencies between `lib/cultivar-registry.ts` and `lib/brew-import.ts` `CULTIVAR_REGISTRY` (en-dash vs hyphen, stale Garnica family, divergent 74110/74112 lineage, Gesha 5 vs 1). Region found the same class of drift between `lib/terroir-registry.ts` (3-bundle) and `lib/brew-import.ts` `TERROIR_REGISTRY` (flat 22-entry). Every future port runs `rg "<X>_REGISTRY|<X>_LOOKUP"` before first edit and collapses any dual-registry drift as part of the port.

**Exhaustive DB-cross-check before presenting rename tables** — see [memory/feedback_exhaustive_db_cross_check.md](../../memory/feedback_exhaustive_db_cross_check.md). Region 1d.1 surfaced 2 additional reclassifications in follow-up turns that a systematic pass against the CSV would have caught in round 1 (Colombia Antioquia `Western` → `Central`; Burundi Kayanza `Lake Kivu` → `Mumirwa Escarpment`). Cost of the systematic pass is ~5 minutes of SQL; cost of missing it is 2-3 extra approval round-trips.

**Python generators for CSV → markdown + TS scale past ~50×12 cells.** Hand-authoring Region's 127 × 14 attribute-cells (~1780 cells) + 127 TS registry entries would have been 2 orders of magnitude more error-prone than running a small generator script. Scripts currently live in `/tmp/` (ephemeral); if Process / Dripper / Flavor follow the same CSV-research shape, see [PRODUCT.md § Side-quests](../../PRODUCT.md#side-quests-logged-do-not-auto-queue) for the "commit generator scripts to `scripts/taxonomy-ports/`" candidate.

**Structural vs content migrations always split.** Variety: migration 021 (structural renames + lineage shifts) + migration 022 (content backfill). Region: migration 023 (structural, shipped) + 024 (content, queued for 1d.2). Keeps PRs reviewable and lets the enforcement sub-sprint (1b / 1d.3) run against canonically-named rows even if content hasn't backfilled yet. Codify: rename / reclassify / lineage shifts in one migration, field backfills in a separate migration.

**Trust the user's domain instinct early.** Chris's meso/micro deprecation proposal during Region vet ("maybe I should deprecate meso/micro and roll that into producer attribute — open to your thoughts") was CSV-confirmed within one turn of cross-checking the attribute fields. Interpretive calls the user offers upfront often compress multiple rounds of research. Vet the proposal against evidence, but don't bury it under speculative alternatives.

**Meta-lesson on sub-sprint structure.** Both A1 ports shipped as **1a.1 / 1a.2 / 1b** (structural port / content backfill / enforcement) for Variety and **1d.1 / 1d.2 / 1d.3** for Region. Each sub-sprint is ~1 PR; each has a distinct review shape (structural = registry + migration; content = single SQL migration; enforcement = 3-file UI + API pattern). Codify this as the default shape for remaining A1/A2 ports: don't compress into a single mega-PR, don't split finer than 3 sub-sprints.
