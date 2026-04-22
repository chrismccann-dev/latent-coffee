# Reference Taxonomies — Dripper

Per-taxonomy feature doc for the Dripper taxonomy. Part of the [Reference Taxonomies umbrella](reference-taxonomies-attribution.md). **Phylum A2 (author new ruleset).** Fourth sprint after Variety + Region + Process.

Written 2026-04-21 from the Reference Taxonomies brainstorm. Pattern reference: [reference-taxonomies-attribution.md](reference-taxonomies-attribution.md) for shared conventions.

---

## Scope

Dripper is the smallest A2 taxonomy by scope. Chris during Part 1: *"probably the 'easiest' and I don't have to be so comprehensive here as I'm not planning on getting a ton more drippers. Just extending what I have and categorizing them a bit would be helpful."*

Scope:
- Canonical list of ~5-10 drippers Chris actually uses + a handful of reference drippers worth preloading even though Chris doesn't own them (because they're common in specialty literature + his corpus sometimes includes brews on them via offices / cafes).
- Per-dripper authored reference content (agitation behavior / flow profile / paper compatibility / when this dripper is Chris's go-to).
- Heavy use of Roberta Sami's dripper taxonomy as primary external reference (https://www.robertasami.com/drippers). Chris authors, cites Sami.
- Enforcement: strict-ish. The set is small, drift risk is low, but canonicalization of `brews.brewer` free-text is the main enforcement win.

**Critical scope decision (from Part 3 Q-J):** Dripper content lives in **BREWING.md**, not a standalone `docs/taxonomies/drippers.md` file. No new `/drippers` top-level page. No `/drippers/[name]` detail. The canonical dripper list still lives in `lib/dripper-registry.ts` (for `/add` enforcement) — but the reader-facing reference content lives with the rest of the brewing guide.

Chris Part 3: *"Dripper - not sure it needs a new page perhaps can be folded into brewing.md."*

Rationale: dripper reference content is brewing-side material. Co-locating with BREWING.md matches how Chris actually uses the content (pasted as context into Claude-project brewing threads), and avoids earning a new top-level app route for a small, slow-moving entity set.

Out of scope:
- New `/drippers` top-level page.
- New `/drippers/[name]` detail pages.
- `brews.brewer` → FK migration to a `drippers` table. The lib registry + `/add` enforcement are sufficient; no schema change this sprint.
- Non-pour-over brewing equipment (espresso, immersion, siphon, cold drip). BREWING.md could extend later, but this sprint stays on drippers.

---

## Starting point — Chris's brewer inventory + Sami + BMR

Starting points:

1. **Chris's actual brewers.** From `memory/user_workflow.md` + BREWING.md: April Brewer Glass, Orea (home), Kalita Wave Tsubame 155, SWORKS Bottomless Dripper, UFO Ceramic. ~5 drippers actively used across home + office.
2. **Roberta Sami's dripper taxonomy** (https://www.robertasami.com/drippers) — primary external reference. Sami's single-page dripper taxonomy is aligned with Chris's framing (agitation / flow / filter-fit).
3. **BREWING.md § Equipment Reference** — the existing section in the brewing master reference that covers brewer behavior per dripper. This sprint extends that section with canonical-list discipline + per-dripper reference content.
4. **`brews.brewer` free-text column** — currently un-canonicalized. This sprint canonicalizes it via `lib/dripper-registry.ts`.

---

## Canonical adoption workflow (for this sprint)

Per [attribution § Canonical adoption workflow](reference-taxonomies-attribution.md#canonical-adoption-workflow):

1. **Research (Chris).** Chris:
   - Drafts the canonical dripper list — the 5 he uses + reference drippers worth preloading (likely V60, Origami, Tricolate, Flower Dripper, April Plastic).
   - For each canonical dripper, drafts per-dripper content pulling from Sami + his own experience.
   - Decides on BREWING.md section placement (likely a new "Dripper Reference" section sibling to the existing Equipment Reference, or a deepening of the existing Equipment Reference).
2. **Draft (Chris).** Shares a proposed BREWING.md diff + proposed `lib/dripper-registry.ts` entries.
3. **Vet (Claude).** Claude checks:
   - Canonical list covers every distinct value currently in `brews.brewer` (or flags aliases for normalization).
   - Per-dripper content is consistent in shape across entries.
   - BREWING.md section fits cleanly with existing structure.
   - Sami citations captured in BREWING.md's existing citation shape.
4. **Iterate.** Loop until list + content are right.
5. **Adopt.** Commit the BREWING.md diff + `lib/dripper-registry.ts`.
6. **Port.** Extract `lib/dripper-registry.ts` via `makeCanonicalLookup`.
7. **Render.** No new app page. BREWING.md renders via the existing sync (which is "paste it into Claude" — BREWING.md is not currently rendered in-app, per the CLAUDE.md "living reference docs" note). If the planned `/roasting-guide/` render pattern ships, a `/brewing-guide/` counterpart could render BREWING.md — but that's out of umbrella scope.
8. **Enforce.** `/add` refuses non-canonical dripper names in the `brewer` field. `/brews/[id]/edit` same. Sync V1 same.

---

## Per-dripper content fields

Each canonical dripper in BREWING.md gets a structured block.

```markdown
### <Dripper Name>

**Geometry:** cone | flat-bottom | hybrid
**Material:** glass | ceramic | plastic | metal | hybrid
**Filter fit:** [which filters fit this dripper — e.g. V60 + V60 paper, Orea + Sibarist]
**Canonical aliases:** [names that resolve to this canonical name]

#### Behavior
- **Flow profile:** fast | medium | slow | variable (valve-controlled)
- **Agitation sensitivity:** high | medium | low
- **Bed stability:** rewards / tolerates high agitation? what happens if over-agitated?
- **Filter compatibility notes:** [paper density / wet behavior quirks]

#### When This Is My Go-To
[Chris's voice — which extraction strategies this dripper fits, which coffees it suits. Short: 2-3 sentences.]

#### Observed Across My Corpus
<Chris's tested claims for this dripper, sample-size-aware voice.>

#### Reference (Sami)
<direct citation from Sami's framing, if relevant to the dripper. Short quotation or paraphrase in tentative voice.>

---
```

**Sizing:** ~8-10 drippers × ~8 fields = ~70 content cells. Smallest of the taxonomies.

---

## Enforcement specifics

**`/add` flow.** The existing `brewer` input on the self-roasted flow (and future purchased flow) wraps `CanonicalTextInput` bound to `lib/dripper-registry.ts`. Refuses non-canonical; suggests via 3-tier classifier.

**`/brews/[id]/edit`** — same `CanonicalTextInput`.

**Sync V1.** Paste-in from Claude project hits the canonical check. Non-canonical brewer triggers a prompt.

**Schema note.** `brews.brewer` stays as a text column. No FK migration. The lib registry is the sole enforcement.

---

## Dependencies

- **Attribution scaffolding sprint** ships first.
- **Variety + Region + Process** ship before — Dripper is 4th in queue.
- **Sync V1** consumes `lib/dripper-registry.ts`.
- **BREWING.md structure** — the brewing master reference already has an Equipment Reference section. The Dripper Reference section either extends or replaces the dripper content in Equipment Reference. Chris's call during the research phase.

## Sizing

- **Chris's research + authoring phase:** 1-2 sessions. Small scope.
- **Claude's port + enforce phase:** half a sprint. BREWING.md edit + `lib/dripper-registry.ts` extract + /add + edit enforcement. No render-on-aggregation-page work (no `/drippers` page).

## Out of scope (this sprint specifically)

- **`/drippers` top-level page + `/drippers/[name]` detail.** Per scope decision.
- **`brews.brewer` FK to a drippers table.** Per scope decision.
- **Non-pour-over equipment in the registry.** Scope stays on drippers.
- **Rendering BREWING.md in-app** as a `/brewing-guide/` route. That's a sibling feature to the planned `/roasting-guide/`, not in this scope.
- **Per-dripper grind-size adjustment tables.** Relevant content, but lives alongside grind (Phylum C), not here.

## Open questions

- **Reference drippers Chris doesn't own.** Include V60 + Origami + Tricolate + Flower Dripper + April Plastic even if Chris doesn't brew on them? Likely yes (preloaded reference is the umbrella's value prop), but Chris decides during research.
- **How to handle office vs home drippers.** The BMR already differentiates office (constrained equipment) from home (full inventory). Reference content stays generic; Chris's "when this is my go-to" section can note office vs home context where it matters.
- **Grind-size table integration.** Chris's grind-size analysis (Phylum C) is scoped to EG-1. Does each dripper's reference content cross-link to "typical grind range on EG-1 for this dripper"? Probably yes — the two Phylum C + Phylum A2 bodies of content compose naturally in BREWING.md. Decide during research phase.

## Sources (for this feature doc)

- [reference-taxonomies-attribution.md](reference-taxonomies-attribution.md)
- Roberta Sami, dripper taxonomy: https://www.robertasami.com/drippers
- BREWING.md (existing Equipment Reference section)
- `memory/user_workflow.md` (Chris's brewer inventory)

Per-dripper authored content sources captured in the new BREWING.md dripper section when authored.
