# Grilling 2026-05-16 — WBC reference materials cluster follow-ups

## Session summary

Fifth `/grill-with-docs` session, audit-grilling the WBC reference materials cluster — the four research-derived docs (`docs/brewing/wbc-reference.md` + `docs/brewing/wbc-recipes.md` + `docs/roasting/wbc-roasting.md` + `docs/roasting/wbc-sourcing.md`) that project the World Brewers Cup competitor corpus onto Latent's worldview. Second `/grill-with-docs` session run on 2026-05-16 (after the canonical-registries cluster earlier the same day). 8 grilling rounds; sourcing-side concepts dominated mid-session because Chris's audio context surfaced operational frames the docs hadn't articulated explicitly.

Outputs:
- [CONTEXT.md](CONTEXT.md) — **19 new glossary entries** under a new "WBC Reference Materials" sub-section (peer to "Roasting", "Brewing", "MCP / Sync Architecture", "Canonical Registries"). CONTEXT.md now ~123 entries total (31 roasting + 23 brewing + 27 MCP + 23 canonical registries + 19 WBC).

The 19 new entries fall into 5 thematic groups:

**Umbrella + principle layer (4 entries)** — WBC reference materials → Strategy-zone completeness → Consciously not pursuing → Full-map workflow accessibility.

**Foundational decomposition (2 entries)** — Foundational control axes (5-axis taxonomy + per-axis Latent absorption status) → Absorption status (fully absorbed / partially absorbed / out-of-scope).

**Sourcing-side cluster (8 entries)** — Sourcing priority → Skill-maintenance lane → Portfolio lanes → Sourcing constraints → Risk-tier sourcing (+ familiarity de-risking) → Sourcing channel → Competition-grade access trajectory → Calibration pair.

**Awareness-gradient middle states (2 entries)** — Cross-cutting control patterns → Experiment status (renamed from Tier 1/2/3 to break the cumulative tier-naming clash).

**Roasting-side experiment shapes (3 entries)** — Same-green blending (3 variants) → Rest curve protocol → Long-run experiment (future-scope architectural concept).

## Standing decisions locked

- **Strategy-zone completeness** = the principle behind the WBC corpus existing at all — Motta-prevention proactive map. Adoption deliberately selective; awareness universal.
- **Foundational control axes mapping is comprehensive** (cultivar / terroir / roast level / flavor coverage shape) — saturation projection same asymptotic 95-96% as Pick-not-author.
- **Don't bite the bullet to adopt the 5-axis system directly** (Chris-locked 2026-05-16) — keep the 2-axis framework + modifiers; lock the absorption mapping as canonical vocabulary instead. 3 of the 5 WBC axes would produce empty / single-valued schema columns under direct adoption — category bloat. Strategy promotion already exists as the operational mechanism for incremental axis expansion.
- **The translation layer IS the architecture, not a hack** — Latent's 4 modifier types map structurally 1:1 onto WBC axes 2-5; same information content, different schema granularity.
- **Promotion authority is Chris-driven, not system-driven** — claude.ai may surface candidate-promotions as proposals, but the promotion timing is Chris's per-sprint scoping call.
- **Full-map workflow accessibility is a system mandate** — claude.ai's Coffee Brief construction must have MCP read access to the FULL WBC awareness surface, including Consciously-not-pursuing sections, not a pre-filtered view.
- **Producer Reference role tier ≠ Sourcing priority ≠ Experiment status** — three different "Tier 1/2/3" systems disambiguated; Experiment status was renamed from Tier 1/2/3 to break the clash. **Future schemes surfacing 3-tier patterns should use descriptive names, not Tier 1/2/3.**
- **Same-green blending is Latent's adapted form of WBC blend stagecraft** — single-lot, three variants (roast layering / Agtron-paired / rest split); multi-origin blending stays in Consciously not pursuing.
- **Rest curve protocol lives on the existing `cuppings` table** — no schema change; 4 cupping rows with shared `roast_id` and `rest_days` derived from `cupping_date - roast_date`. Freeze decision rule: freeze when two consecutive tastings show the cup is no longer improving.
- **Long-run experiment is a future-scope architectural container** — Same V-set state machine (Waiting for next batch / Waiting for next cupping / Resolved) but experiment-scoped, not lot-scoped. Not operationalized today; identified for future formalization.

## 10 follow-up actions

### Sprint candidates (highest priority first)

**1. BREWING.md single-variable orthodoxy softening** [DOC EDIT]
- Why: Round 7 grilling — Chris disagrees with BREWING.md's "pick one variable, hold rest constant" iteration framing, specifically for early-search-state (wide-variance V1-equivalent) brewing iteration. The right framing mirrors the existing roasting-side **Adjustment** entry's scale-dependent rule: wide-variance multi-variable early, narrowing to single-variable late. Chris's verbatim: "you have the world map. You have to pick the continent and then the country and then the state and then the city... in the beginning when you don't even know what country you're in, it's fine adjusting more things."
- Surface: BREWING.md Step 3 iteration framing (locate the specific "pick one variable" passages) + cross-reference to the existing roasting-side Adjustment scale-dependent rule. The brewing equivalent would be: Brew 1 = wide-variance exploratory acceptable; Brews 2-3 = narrowing convergence; Brew 4+ rare and should probe new variable.
- Effort: small (doc edit) but interpretive — the existing "one variable" rule has Motta-prevention value, the softening needs to preserve that while allowing early-iteration multi-variable exploration.

**2. Time Distribution Practical Playbook → canonical Axis 2 modifier promotion review** [STRATEGY PROMOTION SCOPING]
- Why: Round 7 grilling — Chris feels he's already practicing the Time Distribution Playbook patterns (especially via SWORKS valve work + Phase-Mapped Hybrid sub-form). The playbook may earn promotion to a canonical Axis 2 modifier in a future sprint. The Role-Based Pulse modifier (v8.5) already captures part of the surface; remaining patterns (fixed pulse / drain-based pulse / double bloom / short-long-short) live at doc-layer.
- Surface: scoping doc weighing whether to promote the broader Time Distribution Playbook as a canonical modifier vs continue with Role-Based Pulse + free-text strategy_notes for the rest. If promoted, new modifier type + form enum + composer updates.
- Effort: medium scoping + medium-large implementation if promotion goes ahead.

**3. Filter behavior measurement plan** [TAXONOMY ENRICHMENT — parallel to EG-1 enumeration]
- Why: Chris-explicit commitment 2026-05-16 — measure true output flow per owned filter, parallel to the EG-1 grinder's 51-enumerated-settings approach. Closes the long-standing approximate-not-measured filter taxonomy gap (also flagged in canonical-registries cluster followup #8).
- Surface: physical measurement exercise (per-filter flow rate, sediment retention, etc.) + `lib/filter-registry.ts` rich-content backfill on `FilterEntry` shape + `docs/taxonomies/filters.md` per-entry content update.
- Effort: medium (physical measurement + content update); Chris-side time.

**4. Water Strength experiment + Water taxonomy bootstrap** [EXPERIMENT + FUTURE-SCOPE TAXONOMY]
- Why: Chris's short-medium-term active experiment plan. Cross-cutting Control Pattern not yet executed; closes the Active Experiment-status item. Pairs with the broader Water taxonomy future-scope axis flagged in canonical-registries cluster followup #9.
- Surface: experiment scoping (same recipe at ~50 / ~90 / ~120 ppm; A/B against straight cup); future-scope water taxonomy authoring as a self-only axis structurally analogous to the EG-1 grinder taxonomy.
- Effort: small experiment; large future-scope taxonomy effort.

**5. Calibration pair as standing sourcing-prompt practice** [PROMPT UPDATE]
- Why: Chris-flagged 2026-05-16 — Calibration pair seeking should become part of the explicit green-bean sourcing routine, not just opportunistic. The triple-anchor calibration (producer notes + known roaster's interpretation + Chris's brewing of that interpretation) collapses V1 design search space substantially.
- Surface: update `docs/prompts/start-lot.md` (and / or a future sourcing-specific prompt if one is created) to include the calibration-pair availability check before lot intake — explicit search for "did any roaster I trust buy this same lot?" before committing to a green-only purchase.
- Effort: small (prompt edit).

**6. Portfolio lanes 5th lane formalization** [DOC EDIT]
- Why: The gap analysis section of `wbc-sourcing.md` introduces a **Value / roast-practice lane** (sub-$30/kg cheap experiment substrate) that isn't in the original § 10 4-lane authored frame. The 5th lane is load-bearing per the gap analysis but unformalized in the authored section.
- Surface: `wbc-sourcing.md § 10` update to lock the 5-lane shape (Reference clarity / Fruit-tea expression / Process learning / Roast-learning hybrids / Value-practice).
- Effort: small (doc edit only).

**7. Geisha Village classification correction in wbc-sourcing.md** [DOC EDIT]
- Why: Round 6 grilling — Geisha Village was initially classified as a generalist retailer but is structurally a direct-from-farm channel (high-end farm itself, sells 1kg sample bags directly via website). Same pattern as CGLE (now WhatsApp post-relationship-building) and Forest Coffee.
- Surface: `wbc-sourcing.md` doc-edit pass to surface the direct-from-farm-with-1kg-sample-bag sub-pattern explicitly and reclassify Geisha Village correctly.
- Effort: small (doc edit only).

**8. Direct-from-auction Sourcing channel addition in wbc-sourcing.md** [DOC EDIT]
- Why: Round 6 grilling — Chris articulated a sixth Sourcing channel (direct purchase of full auction lots through friends who participate in auctions) that's awareness-only today but worth documenting. Highest-end access path; auction-lot quantities incompatible with the 1-5lb window today; future scope as relationship network grows.
- Surface: `wbc-sourcing.md` doc-edit adding direct-from-auction as a sixth channel kind alongside the existing 5 (generalist retailer / specialty importer / competition-grade importer / direct-from-farm / auction-sample channel).
- Effort: small (doc edit only).

**9. Long-run experiment architectural review** [SCOPING — DEFERRED]
- Why: Chris's 2026-05-16 audio articulated long-run experiments (Same-green blending + Rest curve protocol + future structured experiments) as occupying a third architectural surface alongside roasting and brewing — same V-set-style state machine but experiment-scoped rather than lot-scoped. If/when formalized, would benefit from an `/experiments` page surface parallel to `/green`.
- Surface: scoping doc weighing schema implications (reuse `experiments` + `cuppings` with new `experiment_kind` discriminator vs new entity), page-surface design, lifecycle helper extension. Deferred per Chris's framing ("I have so many other things going on right now... if and when I did take this on").
- Effort: deferred. Locked architecturally; future-scope.

**10. Same-green blending + Rest curve protocol execution on the next reference roast** [EXPERIMENT]
- Why: Both protocols are Active in Experiment status, queued for the next lot that produces a reference roast (likely CGLE-SRUME-NATURAL-2026 or GESHA CLOUDS). Would produce the first formal blend matrix data point + first formal rest curve in `docs/roasting/archive.md`.
- Surface: physical roasting + cupping at the protocol's prescribed cadence; close-out as part of the standard `close-lot.md` STAGE 4 with the new structured data as roast_learnings rest-curve summary + same-green blending winner annotation.
- Effort: physical roasting time + cupping discipline. Coordinated with green-quantity gating (`list_roest_inventory` check before scoping the ladder).

### Carried forward to the mega-cleanup grilling session

This session adds to the running mega-cleanup backlog:
- All 10 items above
- Plus 3 items already covered by canonical-registries followups but cross-referenced here (filter flow measurements, water taxonomy bootstrap, importer/exporter scope decision)

## Suggested sequencing

```
[ Sprint A ] Quick doc-edit batch — bundle items #6 + #7 + #8 (Portfolio lanes 5th
              lane formalization + Geisha Village correction + Direct-from-auction
              channel addition). All wbc-sourcing.md doc-edits, single PR.

[ Sprint B ] BREWING.md single-variable orthodoxy softening (#1)
              [doc-edit only but interpretive — preserve Motta-prevention while
              allowing early-iteration multi-variable. Cross-reference Adjustment
              entry's scale-dependent rule.]

[ Sprint C ] Calibration pair sourcing-prompt update (#5)
              [start-lot.md edit; small surface; high operational value]

[ Sprint D ] Time Distribution Playbook promotion scoping (#2)
              [scoping doc; medium-effort; output may drive a v8.6 brewing taxonomy
              expansion sprint]

[ Sprint E ] Filter behavior measurement (#3)
              [Chris-side physical measurement; pairs with canonical-registries
              followup #8 Filter flow-rate measurements + #9 SWORKS valve flow]

[ Sprint F ] Water Strength experiment (#4 small) + Water taxonomy bootstrap
              (#4 large + canonical-registries followup #9 future-scope)
              [start with the experiment; bootstrap taxonomy if signal earns it]

[ Sprint G ] Same-green blending + Rest curve protocol execution (#10)
              [physical roasting on next reference roast; close-out via standard
              close-lot.md flow]

[ Sprint H ] Long-run experiment architectural review (#9)
              [scoping doc; deferred — runs when long-run experiments earn
              dedicated tooling]

[ Future grilling session ] Synthesis pipeline cluster (session 6)
              + miscellaneous open-question cleanup
```

Sprints A–C are quick wins (doc-edits / prompt-edits); D–F are medium-priority research / measurement; G is physical execution gated on the next reference-roast cycle; H is deferred future-scope.

## Combined backlog after this session

Prior session totals + this session:
- Roasting (2026-05-14): **7 open items**
- Brewing (2026-05-15): **9 open items**
- MCP (2026-05-15): **8 open items**
- Canonical registries (2026-05-16 morning): **11 open items**
- WBC reference materials (this session): **10 new items above**

**Combined backlog: 45 items** across five clusters. Per Chris's standing rule: bundle by sprint affinity, not by cluster origin. Sprint A (3 wbc-sourcing.md doc edits) is the first all-WBC-cluster bundle; Sprint E (Filter behavior measurement) cross-cuts with canonical-registries cluster cleanly.

## Audio dictation note

Audio dictation mode held as default cadence — 8 rounds produced 19 entries (2.4:1 ratio), in line with MCP (2.7:1) and roasting (~2.6:1) clusters. Three sources of implicit-term extraction beyond the literal answer:

- **Round 2 origin context** — Chris's 3-thread origin story (Motta-prevention + bottoms-up taxonomy parallel + V2 MCP wait-time research) became the WBC reference materials entry's body, not a separate concept.
- **Round 4 Tier 1 producer access paradox** — Chris articulated that the producer registry's Reference role Tier 1 producers are mostly inaccessible at his scale; became a load-bearing sub-section in Sourcing constraints.
- **Round 6 Calibration pair** — Chris said "I should probably include that as part of my green bean sourcing. It's a good thing to remember to include" — surfacing a NEW operational practice mid-session, locked as its own canonical entry + flagged as a sourcing-prompt update follow-up.
- **Round 7 single-variable orthodoxy disagreement** — Chris's pushback on BREWING.md's iteration rule didn't fit a glossary entry directly but became a BREWING.md doc-edit follow-up (#1 above) that connects to the existing Adjustment entry's scale-dependent rule.

## Open questions for the next grilling session

Carried forward to the synthesis-pipeline cluster + misc cleanup (session 6):
- The `lib/synthesis/` directed-prompt adapter pattern (4 per-entity adapters today: terroir / cultivar / process / roaster)
- `buildPrompt.ts` + `runSynthesis.ts` scaffolding shape
- Humanizer pass (vendored `humanizer-skill.md`) — what does it strip, what does it preserve?
- Per-entity anchor weighting + extra-rules + formatLearningRow patterns
- Sample-output prompts (4-6 paragraphs + 4-6 practical-takeaway bullets per the spec)
- The two-LLM-call pattern (raw → humanizer polish) — cache invalidation rules?
- Cross-cutting: per-entity vs cross-entity synthesis (today only per-entity; could brews aggregate into producer / terroir / cultivar combinations at the doc layer?)
- Cross-cutting: synthesis ↔ propose_doc_changes interaction — synthesis output is per-page cached; propose_doc_changes writes target living docs, not synthesis caches. Do they ever cross?

Plus the miscellaneous open-questions sweep (across all 5 prior clusters):
- The mega-cleanup grilling session ahead (per Chris's 2026-05-15 flag) — 45 backlog items across 5 clusters
- Any flagged-ambiguities that have NOT been resolved by a subsequent session (audit before mega-cleanup launches)
