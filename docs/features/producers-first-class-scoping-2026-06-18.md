# Producers as a first-class citizen — scoping doc (2026-06-18)

**Status:** scoped + mockup-validated; ready for a build sprint. Output of a Claude Code brainstorm session (2026-06-18) over Chris's "producer brainstorming" prototype brief. The prototype was treated as a premise to deliver on, not canon; Latent's live registry + DB are the ground truth.

**Supersedes / consolidates** three previously-fragmented roadmap entries, all gated on a corpus signal that is now met:
- [roadmap.md](docs/product/roadmap.md) On deck — "Producers aggregation starting point" (the mechanical copy-/roasters framing).
- [roadmap.md](docs/product/roadmap.md) On deck — the `/producers` leg of the "Product surface trio".
- [roadmap.md](docs/product/roadmap.md) Future Directions — "Producers as a first-class citizen" + [issues.md](docs/product/issues.md) "Producer index gap".

**Gate (now met).** The deferral was "2+ producers with 3+ brews each (only Pepe Jijón qualifies)." Live count (2026-06-18): **9 producers have 3+ brews** (Rigoberto & Luis Eduardo Herrera 5, Pepe Jijón 4, Tamiru Tadesse 4, Lamastus Family 4, Mama Cata Estate 4, Janson Farms 3, Peterson Family 3, Diego Samuel Bermúdez 3, Sebastián Ramírez 3); 13 have 2+; 67 distinct producers across 97 brews. The stale "only Pepe Jijón" note must be corrected in the same PR that ships this (roadmap + issues.md).

---

## Problem

The sourcing philosophy names **producer reputation as acquisition signal #1 — "proxy for the engineered process"** — and the **process signature as the hard gate** ([CONTEXT-taste.md § Sourcing philosophy](CONTEXT-taste.md), [sourcing/strategy.md § 0](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md)). The substrate to act on that already exists: `lib/producer-registry.ts` holds ~152 canonical producers with ~28 fields each (tier, `producerSystem`, `processingStyleTags`, `knownFor`, `typicalFlavorProfile`, `roasterReferences`, `marketTier`, cultivars, drying, importers/exporters/contact). But producers render **inline only** (brew detail, green detail) — there is no index, no detail page, and the reputation/process-signature signal that drives buying has nowhere to live. The "known-for engineered process" attribute flagged homeless in [issues.md](docs/product/issues.md) is exactly this gap.

## Goal

Ship `/producers` (index) + `/producers/[slug]` (detail) as a **buy / learn / remember surface** — a forward-looking sourcing page with the personal archive underneath as evidence. The detail page answers, top-down: *what is this producer's production signature → why does it matter to Latent → what evidence do I have → what should I do next.* Roaster-page-sized build; no new DB table, no migration.

## Core decision

The producer page is **not a profile**. It is sourcing-forward: optimized for "is this producer's system likely to generate the Latent cup, and what evidence do I have so far?" The archive (brews / lots / roast learnings) serves the decision, it does not lead.

This diverges from `/roasters` (whose job is brew-recall, so it leads with the coffees list). Producers lead with the **process signature**.

---

## Resolved forks

### Fork 1 — Page job + headline
- **Forward sourcing, archive as evidence.** Page hierarchy: production signature → why it matters → evidence → next action.
- **Headline = a synthesized one-line process signature.** Not tier (a badge), not flavor (an output), not country (context). The top-line job is to explain the system producing the cup.
- **New field `processSignature` + `processSignatureConfidence`** (`'hand-authored' | 'generated' | 'needs-review'`). Editorial, hand-authored first, optionally AI-draftable via the arbiter enrichment pass. Three drafts validated on the mockup:
  - Pepe Jijón — "Ecuador Mejorado clarity estate: wave processing, controlled fermentation, biodynamic farming, and clean high-tone Typica Mejorado / Sidra expression."
  - Milton Monroy — "Tolima Gesha-focused experimental natural system: extended fermentation, covered-canopy drying, high-density lots, and clean tropical/floral expression when development is sufficient."
  - Wilton Benitez — "Colombia processing-lab benchmark: thermal shock, double anaerobic, yeast, and carbonic methods for high-intensity engineered tropical/floral profiles."

### Fork 2 — Index scope
- **Include aspirational / target-only producers** (Wilton Benitez is the proof case: zero brews/lots, but exactly what the sourcing system is built to remember).
- **One page shell, sections collapse on data availability** — no separate "stub" type (that creates dead-end IA). Target-only producers show full header / process signature / sourcing lens / roaster signal, and empty states for brews / lots / roast learnings.
- **Skeleton producers hidden from the default index.** `enrichmentStatus` (`complete | usable | skeleton | needs-review`) gates visibility: default index shows `complete` + `usable`; `skeleton` / `needs-review` live behind a "Needs enrichment" view. Keeps the default index high-signal.

### Fork 3 — Grouping spine
- **Spine = relationship state + sourcing priority**, NOT `producerSystem` (only 7 enum values, many nulls → a weak "Ungrouped" bucket; Milton Monroy is `producerSystem: null` and proves it can't carry the index).
- Top-level tabs: **In inventory · Roasted by me · Brewed · Target producer · All producers · Needs enrichment** (a producer can appear in more than one; tabs are views, not partitions).
- `producerSystem` becomes a **facet/filter**, alongside: tier, country, process tags, cultivars, sourcing lane, roaster references, market tier, has-contact/importer/exporter, has-personal-evidence.
- Country is a strong filter, not the spine (sourcing doc: "geography is density, not a gate" — the signature is portable). Tier is too coarse (all three examples are Tier 1 but need different treatment).

### Fork 4 — Producer synthesis
- **Dropped, not deferred.** No producer AI-synthesis adapter. There is no distinct producer-level insight the per-brew notes + terroir/cultivar synthesis don't already cover, and most producers have 1-3 brews (thin corpus). Synthesis stays on terroir / cultivar / roaster.

### Decision strip (the most important detail-page element)
Five cells: **Latent fit · Buy posture · Primary risk · Evidence level · Next action.**
- **Rule-derived for v1** (validated on the mockup — Chris accepted the rule-derived output and removed the "author vs derive" caveat). Authored per-producer override fields stay a **future option**, revisited only if the rule-derived values read generic on producers beyond the three examples.
- Derivation rules (v1):
  - `Latent fit` ← tier + process-signature/apex alignment (engineered-or-clarity system at Tier 1 → High).
  - `Buy posture` ← relationship state + inventory (target_only → "find a clean disclosed lot"; resolved_reference → "compare future lots to the reference"; brewed_purchased → "watch for green {primary cultivar} lots"; in-inventory → "roast the held lot").
  - `Primary risk` ← process tags / sourcing lane (Lane-C tags: heavy anaerobic / thermal shock / co-ferment / yeast → "process-forward / stylized"; clean clarity → "low").
  - `Evidence level` ← derived counts.
  - `Next action` ← composed from buy posture + primary risk.

### Roaster signal (Fork: cross-link without the relationship graph)
- Render `roasterReferences` as chips on card + detail, labeled **"Roaster signal"**.
- A **✓ tick** marks roasters present in `brews.roaster` (derivable). **Drop the "followed" indicator** — there is no "follow roasters" concept in Latent and no substrate for it.
- Not a relationship graph; just evidence.

---

## Information architecture

### Index (`/producers`)
- Cap "Producers" + relationship-state tabs (spine) + facet filters.
- **Card shape** (per the validated mockup): producer name + farm · `[tier badge]` `[relationship badge]` · country/region · system (or "System unknown") · process-signature one-liner · known-for chips · cultivar chips · evidence line (`N brews · N roasters · N lots · N learnings`) · roaster-signal chips (✓ where brewed) · next-action line.
- Relationship badge colors: Brewed = blue, Roasted by me = teal, Target producer = amber.

### Detail (`/producers/[slug]`) — 7 sections
1. **Header** — name · farm · country · region · macro terroir · tier · reference role · relationship badge.
2. **Decision strip** — the 5 cells above. No caption line (mockup tweak).
3. **Process signature** — the one-liner, then rows: system · processing tags · drying · known for.
4. **Sourcing lens** (where producer pages diverge from roaster pages) — buy priority · target lots/cultivars · process fit · known risks · importer · exporter · direct contact · channel type · roaster validation. (Channel type / small-format availability are not in the registry today — v1 rough-derives channel from importer presence; small-format deferred. See open questions.)
5. **My evidence** — three subsections, each links out: **Brewed coffees** (coffee · roaster · variety/process · strategy · peak → `/brews/[id]`); **Green lots** (lot · importer · kg · elevation · density · status → `/green/[id]`); **Roast learnings** (summary only — reference roast · primary lever · underdev signal · overdev signal · rest behavior · brewing tolerance — link to the lot/roast, do not dump the full record).
6. **Roaster signal** — `roasterReferences` chips with the ✓-brewed tick. No caption line (mockup tweak).
7. **Registry facts** (below the fold) — grouped: identity · geography · farm model · cultivars · processing · drying · flavor profile · market/sourcing · contacts.

---

## Data-model reconciliation (Latent ground truth)

**No `producers` DB table, no FK, no migration.** Aggregation is text-equality on `brews.producer` / `green_beans.producer` (canonicalized via `PRODUCER_LOOKUP`), exactly like `brews.roaster` on `/roasters`.

**Derivable now — no stored field, computed at query time:**
- `relationshipState` (`target_only | brewed_purchased | sourced_green | self_roasted | resolved_reference`): ladder from (has purchased brews) + (has green_beans) + `green_beans.lot_status` + (roast_learnings present). `resolved_reference` = `lot_status='resolved'` and/or a `roast_learnings` row.
- `enrichmentStatus`: `skeleton` ← `skeleton===true`; `needs-review` ← `processSignatureConfidence==='needs-review'|'generated'`; `complete` ← hand-authored signature + rich fields populated; else `usable`.
- Evidence layer (brewed coffees, green lots, roast-learnings summary, all counts) — joins on existing rows.
- Roaster-signal ✓ — `roasterReferences` ∩ distinct `brews.roaster`.
- Tabs + every facet filter.
- Decision strip (v1) — rules above.

**New authored substrate (the only schema-ish change):**
- `ProducerEntry.processSignature: string` + `ProducerEntry.processSignatureConfidence: 'hand-authored' | 'generated' | 'needs-review'`. Registry-only (these live in `lib/producer-registry.ts` + mirrored prose in [docs/taxonomies/producers.md](docs/taxonomies/producers.md)); they are **not** DB columns, so no migration, no `check:types-vs-schema` impact. Write path = registry edit / arbiter enrichment, **not** MCP (producers are a canonical taxonomy, not an MCP-written entity).
- Author lazily — at minimum the producers that surface in a non-target tab plus the active target roster. Backlog-author the long tail via the arbiter skeleton-review pass.

**Explicitly out (v1):** authored decision-strip override fields; `channelType` / `smallFormatAvailability` as registry fields (live in [sourcing/strategy.md § 11](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md)); producer AI synthesis (Fork 4); "follow roasters"; the parked `producer_name`/`farm_name` split; a producer FK / DB table; a full relationship graph.

---

## Build sequence

1. **Registry + derivation layer.** Add the two `ProducerEntry` fields; author `processSignature` for the live-state producers. New `lib/producers.ts` (or `lib/producer-aggregation.ts`): `relationshipState`, `enrichmentStatus`, evidence aggregation by producer name, decision-strip derivation. Reuse `confidenceFor` ([lib/confidence.ts](lib/confidence.ts)) and country/system colors.
2. **Index route** `app/(app)/producers/page.tsx` — tabs + facet filters + card grid, server-rendered from registry + DB.
3. **Detail route** `app/(app)/producers/[slug]/page.tsx` — 7 sections, data-availability collapsing. Match the `/roasters` slug scheme for consistency (see open questions).
4. **Cross-system + currency.** Header nav slot ([components/Header.tsx](components/Header.tsx)); [page-ia.md](docs/architecture/page-ia.md) § Producers; CLAUDE.md § Page structure pointer; [registries.md](docs/architecture/registries.md) note the new fields; roadmap currency (move the three producer entries out of On deck / Future Directions, correct the stale gate in roadmap + issues.md, add a [shipped.md](docs/sprints/shipped.md) row).

## Six-actor audit (run at build, not before)
- **Actor 6 (schema/UI):** new `ProducerEntry` fields are registry-only → no migration, no `lib/types.ts` DB-column change, no `check:types-vs-schema`. New routes + `lib/` helpers. `npm run build` (tsc proxy in the main repo) before push since routes + lib change.
- **Actor 4 (MCP):** no new Tool. `read_canonical(axis='producers')` / `list_canonicals` will additively carry `processSignature` — harmless, no schema/description change required.
- **Actor 5 (Claude Code):** CLAUDE.md § Page structure + [page-ia.md](docs/architecture/page-ia.md) § Producers + [registries.md](docs/architecture/registries.md). No CONTEXT-zone change (no new glossary term).
- **Actor 2 (prompts):** none (producers not written via prompts).
- **Actor 3 (claude.ai):** none — same registry claude.ai already reads via the sourcing docs.
- **Actor 1 (Chris):** rendered `/producers` index + detail.

## Verification plan
- `preview_start`; render `/producers`; screenshot. Click into Pepe Jijón (brewed) / Milton Monroy (roasted) / Wilton Benitez (target) — verify relationship states, empty-state collapsing on Wilton, decision-strip values, evidence links resolve.
- `preview_resize` 390 + 1024 (desktop-primary; spot-check mobile reflow).
- Cross-check index aggregation counts against the DB (9 producers ≥3 brews, 13 ≥2).
- `npm run check:doc-links` + `check:doc-sizes` for the new docs entries; `npm run build` for the route/lib changes.

## Open questions (genuine, with leans)
- **Sourcing-lens channel type / small-format:** v1 rough-derive channel from importer presence (generalist vs competition-grade) and defer small-format, OR omit both until the registry tracks them. Lean: rough-derive channel, defer small-format.
- **Index default sort within a tab:** by evidence depth, then tier, then brew count. Lean: yes.
- **Slug scheme:** match `/roasters` (`encodeURIComponent(name)`) for consistency, vs a kebab slug (`/producers/wilton-benitez`). Lean: match roasters.

---

## Kickoff brief (build sprint)

- **Problem:** the sourcing acquisition signal (producer reputation / process signature) has no home in the app; producers render inline only.
- **Goal:** ship `/producers` + `/producers/[slug]` as a sourcing-forward buy/learn/remember surface, archive underneath.
- **Scope in:** index (relationship-state tabs + facets + cards), detail (7 sections, data-availability collapsing), `processSignature(+confidence)` registry fields + lazy authoring, derivation layer, Header nav, page-ia + roadmap currency. **Scope out:** authored decision-strip overrides, channel/small-format registry fields, producer synthesis, follow-roasters, producer FK/table.
- **Entry surface:** operator-direct Claude Code build sprint (no skill); this scoping doc is the plan.
- **Files likely to touch:** `lib/producer-registry.ts`, `lib/producers.ts` (new), `app/(app)/producers/page.tsx` (new), `app/(app)/producers/[slug]/page.tsx` (new), `components/Header.tsx`, `docs/taxonomies/producers.md`, `docs/architecture/page-ia.md`, `docs/architecture/registries.md`, `CLAUDE.md`, `docs/product/roadmap.md`, `docs/product/issues.md`, `docs/sprints/shipped.md`.
- **Verification:** as above (preview the three relationship states, DB count cross-check, build + doc-link gates).
- **Open questions:** the three above (channel derivation, default sort, slug scheme) — all have leans, none block start.
- **Validated by:** the 2026-06-18 mockup (`producers_index_and_detail_mockup`) — real data for all three producers; Chris approved with three tweaks now folded in (drop the decision-strip caveat line, drop the roaster-signal caption, rename "Target roster" → "Target producer").
