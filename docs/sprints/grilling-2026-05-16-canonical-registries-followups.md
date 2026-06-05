# Grilling 2026-05-16 — Canonical registries cluster follow-ups

## Session summary

Fourth `/grill-with-docs` session, audit-grilling the canonical-registries cluster — the 10 taxonomy axes that drive Latent's validation pipeline (cultivar / terroir / producer / roaster / brewer / filter / grinder / roast level / flavor / process). 12 grilling rounds; richer-than-typical density because the cluster cuts across all 10 axes simultaneously.

Outputs:
- [CONTEXT.md](CONTEXT.md) — **23 new glossary entries** under a new "Canonical Registries" sub-section (peer to "Roasting", "Brewing", "MCP / Sync Architecture"). Plus **~16 new relationships** in the Relationships section + **~10 new flagged ambiguities**. CONTEXT.md now ~104 entries total (31 roasting + 23 brewing + 27 MCP + 23 canonical registries).

The 23 new entries fall into 5 thematic groups:

**Meta-concepts (6 entries)** — aggregation level → aggregation-eligibility → coverage strategy → bottoms-up authoring → substrate gap → pick-not-author principle.

**Per-axis structure (8 entries)** — hierarchical taxonomy → parent level → composable taxonomy → reference role → producer system → producer sourcing surface → qualifier → strategy tag.

**Operational mechanism (5 entries)** — authoritative source → validation mirror → 2-step deliberate edit → alias (with 3 sub-shapes) → auto-created provenance.

**Render + maintenance (3 entries)** — family palette → owned → skeleton entry.

**Roast-level distinctive structure (2 entries)** — marketing tag vs objective bucket.

## Standing decisions locked

- **Aggregation level** is per-axis with 3 criteria (legible / enough samples / transferable). Terroir = macro, cultivar = individual, process = composable, etc.
- **Aggregation-eligibility trichotomy**: page-bearing (terroir / cultivar / process / roaster) / page-deferred (producer) / validation-only (brewer / filter / grinder / roast level / flavor).
- **Coverage strategy is 4-way**: comprehensive (cultivar / terroir / roast level / flavor-with-arbiter-caveat) / tier-scoped (producer / roaster / signature method) / owned-comprehensive (brewer / filter) / self-only (grinder + future SWORKS + future filter-flow + future water).
- **Authoritative source ↔ validation mirror** is the canonical-pair architecture; markdown wins on disagreement; 2-step deliberate edit is the maintenance discipline.
- **Pick-not-author principle**: claude.ai picks from a pre-resolved canonical surface, never authors / researches at runtime. 95-96% asymptotic completeness target.
- **Provenance + override-flag are dual mechanisms** for recording canonical-vs-lazy-materialized; differ by axis storage shape.
- **Qualifier aggregation level stays at the modifier, not the qualifier** — corrective on `processes.md`; same logic applies to honey subprocess (aggregate at base, record sub-tier only when known).
- **Producer system is NOT a future aggregation surface** — stays typed metadata only.
- **Skeleton entries should surface in the arbiter procedure as a third queue type**.

## 11 follow-up actions

### Sprint candidates (highest priority first)

**1. `processes.md` qualifier-strategy doc-edit pass** [DOC EDIT]
- Why: `processes.md` Round 9 grilling corrective — the line "Anoxic Natural typically calls for Full Expression mechanics while plain Anaerobic Natural typically calls for Suppression" overstates the qualifier's strategy implications. Chris-locked: aggregation level stays at the modifier (Anaerobic); qualifier is record-when-known annotation, NOT strategy-decision layer. Same logic applies to honey subprocesses.
- Surface: `docs/taxonomies/processes.md` qualifier paragraph (line ~10) + lookup at `composeProcess` strategy-derivation logic if any. No schema change.
- Effort: small (doc edit only).

**2. `Nordic Approach → Mekuria Mergia & Elias Rooba` alias removal** [REGISTRY EDIT]
- Why: Chris-flagged 2026-05-16 — Nordic Approach is an importer/exporter, NOT a producer. The current structural alias is a data error.
- Surface: `lib/producer-registry.ts` PRODUCER_ALIASES removal + `docs/taxonomies/producers.md` alias-section edit + DB audit of any rows with `producer = "Nordic Approach"` (verify alias-resolution didn't lose ground truth) + re-identify underlying producers per affected brew.
- Effort: small (alias edit + DB audit) but requires brew-by-brew producer re-identification for affected rows. Pairs with Sprint 3 (importer/exporter scope).

**3. Importer / exporter as a future canonical axis — scope decision** [SCOPING]
- Why: Round 4 grilling surfaced that Latent currently doesn't model importers/exporters. Chris: "maybe in some sense I probably should, but I don't." The Nordic Approach alias error (#2) is the concrete pain — at minimum, importers/exporters need a place to live so they don't get mis-aliased to producers.
- Surface: scoping doc weighing options (new canonical axis with its own registry / `ProducerEntry.importers` + `.exporters` already-existing fields elevated to typed canonicals / unmodeled-forever-but-flagged). Pair with the producer sourcing surface — importer relationships are part of the championship-mode sourcing pipeline.
- Effort: scoping doc small; implementation deferred to follow-up sprint.

**4. Skeleton-entry review extension to the arbiter procedure** [ARBITER + SCHEMA]
- Why: Chris-locked 2026-05-16 — skeleton entries (today only `ProducerEntry.skeleton: true`) should surface in the arbiter procedure as a third queue type alongside `doc_proposals` + `taxonomy_overrides_queue`. The arbiter sweeps + decides "promote to full / alias retroactively / reject"; collaborative rich-field fill follows for promoted entries.
- Surface: `ARBITER.md` § Skeleton review (new section) + Tool surface `list_skeleton_entries` (or extension of existing list_taxonomy_queue) + `lib/producer-registry.ts` query helper for `skeleton: true` rows.
- Effort: small-medium. ARBITER.md edit + one new Tool + ~10 lines of registry filter logic.

**5. `fermentation_qualifiers` schema column** [SCHEMA + MIGRATION]
- Why: Qualifier is defined in `processes.md` + decompositional alias map, but `brews` has no `fermentation_qualifiers text[]` column today, so qualifier data only persists on inputs that explicitly preserve it. The data silently loses qualifier signal across all writes.
- Surface: migration adding `brews.fermentation_qualifiers text[]` + `push_brew` Tool wiring + `composeProcess`/`decomposeProcess` updates.
- Effort: small-medium. Standard schema migration pattern.

**6. Strategy tag ↔ extraction strategy vocabulary-coherence audit** [AUDIT + ALIGNMENT]
- Why: Round 12C grilling — strategy tag vocabulary on roaster should align with extraction strategy canonical names on brews ("my Clarity-First when I brew should match Clarity-First on a roaster's house style"). Today's alignment is partial: `CLARITY-FIRST` ↔ `Clarity-First` and `FULL EXPRESSION` ↔ `Full Expression` align; brew `Suppression` / `Extraction Push` / `Hybrid` have no direct roaster equivalent; roaster `SYSTEM` / `VARIES` / `SELF-ROASTED` have no brew equivalent. Plus case-style divergence (`UPPERCASE-DASH` vs `Title Case`).
- Surface: audit doc listing roaster strategy tags vs brew extraction strategies + alignment proposal. Possibly drives a registry rename (with migration) on one side or the other.
- Effort: small audit, potentially medium implementation depending on rename direction.

**7. SWORKS valve flow taxonomy registry-promotion candidate** [SCOPING]
- Why: Round 7 grilling — Chris's SWORKS Bottomless Dripper Dial 1-6 flow taxonomy is structurally a self-only canonical sub-taxonomy (same shape as EG-1 grinder settings) but lives inside BREWING.md, not promoted to `docs/taxonomies/sworks.md` + a validation mirror. Would benefit from joining the canonical-registries cluster as a self-only axis, with the same authoritative-source + validation-mirror shape.
- Surface: scoping decision (promote? keep in BREWING.md?) + if promoted, new taxonomy file + new lib registry mirror.
- Effort: scoping small; promotion medium (new file, registry, possibly a schema column on brews for per-dial-setting capture).

**8. Filter flow-rate measurement exercise** [CONTENT BACKFILL]
- Why: Round 7 grilling — today's filter taxonomy carries fast / medium / slow tagging that is approximate-not-measured. Chris's TODO to measure real flow rates across his owned filters with a calibrated dose + timer.
- Surface: measurement session (Chris physical work) + `lib/filter-registry.ts` content update per measured filter + `docs/taxonomies/filters.md` enrichment.
- Effort: medium (physical measurement time) + small (registry update).

**9. Water taxonomy as the next self-only axis** [FUTURE SPRINT]
- Why: Round 7 grilling — water + water chemistry flagged as the next self-only taxonomy to land. Structurally analogous to the EG-1 grinder taxonomy (Chris's specific tap + filter + remineralization setup, with per-instance measurements).
- Surface: future sprint scope — bottoms-up authoring exercise (collect Chris's current water profile + variations he wants to track) + `docs/taxonomies/water.md` + `lib/water-registry.ts` + schema column on brews.
- Effort: medium-large. Bottoms-up authoring takes time; the self-only shape keeps registry size small.

**10. Roaster skeleton-flag extension** [REGISTRY SHAPE]
- Why: The `skeleton: true` flag is producer-only today. Roaster has the same "promote-with-thin-content" pattern (Latent roaster entry is effectively a skeleton; several Tier-1h entries had minimal initial content).
- Surface: `lib/roaster-registry.ts` `RoasterEntry.skeleton?: true` type addition + back-fill existing thin entries.
- Effort: small. Type addition + a one-pass audit of which roasters qualify.

**11. The 95-96% pick-not-author saturation check** [AUDIT]
- Why: The Pick-not-author principle's target is asymptotic 95-96%; Chris's expected NET-NEW saturation projection from the MCP cluster says rates decay over time. Worth an audit periodically to confirm registry coverage actually meets the target in practice — measure recent push-brew / push-green-bean writes for canonical-resolution hit rate per axis.
- Surface: audit script (or one-off SQL) computing per-axis canonical-resolution rate over the last N writes; report gaps.
- Effort: small audit; potentially feeds back into per-axis arbiter sweep priorities.

### Carried forward to the mega-cleanup grilling session

Already enumerated in the prior 3 cluster followup files. This session adds:
- **`Aggregation scope` flagged ambiguity from the MCP session is RESOLVED** — was deferred to this session; now glossary-locked as **Aggregation level** with the 3-criteria framework.
- **The 4-tier canonical-strictness audit (MCP follow-up #3) is partially satisfied** — this session articulated coverage strategy as 4 named strategies; canonical-strictness tiers from MCP map approximately onto coverage strategy (strict-static ≈ comprehensive; self-owned ≈ owned-comprehensive + self-only; closed-objective ≈ comprehensive (roast level); open-loose ≈ tier-scoped). The audit follow-up still has value for confirming queue coverage uniformity, but the conceptual mapping is now clearer.

## Suggested sequencing

```
[ Sprint A ] processes.md qualifier doc-edit (#1)
              [trivial doc edit; bundle with the producer Nordic Approach fix (#2)]

[ Sprint B ] Skeleton review in arbiter procedure (#4)
              + Roaster skeleton-flag extension (#10)
              [coupled — both touch skeleton-flag plumbing; bundle in one PR]

[ Sprint C ] fermentation_qualifiers schema column (#5)
              [standard migration; small footprint]

[ Sprint D ] Importer/exporter scoping (#3)
              [scoping doc; decision feeds future sprint]

[ Sprint E ] Strategy tag ↔ extraction strategy vocabulary audit (#6)
              [audit + alignment proposal; output may drive a rename sprint]

[ Sprint F ] SWORKS valve flow taxonomy promotion scoping (#7)
              [scoping; promotion is medium-effort]

[ Sprint G ] Filter flow-rate measurements (#8)
              [physical measurement + content update; Chris-side time]

[ Sprint H ] Water taxonomy bottoms-up authoring (#9)
              [larger; future sprint]

[ Sprint I ] 95-96% pick-not-author saturation audit (#11)
              [periodic audit; runs after sprints A-C move the needle]

[ Future grilling session ] WBC reference docs cluster (per MCP followups #8)
[ Mega cleanup grilling session ] Bundle all 11 new + 8 MCP + 9 brewing + 7 roasting = 35 items total
```

Sprints A + B are most time-sensitive (correctness/visibility); C-D-E are medium-priority; F-G-H-I are forward-investment.

## Combined backlog after this session

Prior session totals + this session:
- Roasting (2026-05-14): **7 open items** (#8 was "do brewing grilling" — completed)
- Brewing (2026-05-15): **9 open items**
- MCP (2026-05-15): **8 open items**
- Canonical registries (this session): **11 new items above**

**Combined backlog: 35 items** across four clusters. Per Chris's standing rule: bundle by sprint affinity, not by cluster origin. Sprint A (processes.md qualifier + Nordic Approach) already cross-cuts processes + producer registries within this cluster.

## Audio dictation note

Audio dictation mode held as default cadence — 12 rounds produced 23 entries (1.9:1 ratio), in line with brewing (~1.9:1) and slightly lighter than MCP (2.7:1) + roasting (~2.6:1). The lighter ratio is structural rather than discipline-related: the canonical-registries cluster has more per-axis specificity per concept (each entry tied to a specific axis's behavior) and less cross-cluster vocabulary overlap to absorb into existing entries. The discipline of extracting every implicit term per turn continued to pay off — round 4's Nordic Approach error, round 5's "parent level" naming, round 7's water-taxonomy future-scope, round 8's aggregation-layer switch as a named pattern, and round 9's qualifier corrective all came from audio context beyond the literal answer.

## Open questions for the next grilling session

Carried forward to the WBC docs cluster (session 5):
- Where wbc-reference.md sits vs BREWING.md vs CONTEXT.md (reference layer vs master reference vs glossary)
- The 102-recipe WBC corpus as a structured artifact — is the per-recipe schema worth canonicalizing?
- WBC sourcing tier framework (Tier 1 / 2 / 3 priority targets) — is this implicit canonical taxonomy that should surface?

Carried to a possible synthesis-pipeline session (session 6):
- The `lib/synthesis/` directed-prompt adapter pattern (4 per-entity adapters today)
- Humanizer pass + buildPrompt / runSynthesis scaffolding
- Per-entity anchor weighting + extra-rules + formatLearningRow patterns
