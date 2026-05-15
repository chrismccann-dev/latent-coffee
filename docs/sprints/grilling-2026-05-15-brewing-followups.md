# Grilling 2026-05-15 — Brewing cluster follow-ups

## Session summary

Second `/grill-with-docs` session, audit-grilling the brewing cluster of implicit Latent terminology. 12 grilling rounds over one sitting. Outputs:

- [CONTEXT.md](../../CONTEXT.md) — **23 new glossary entries** under a "Brewing" sub-section: Extraction Strategy / Two-Axis Framework / Modifier / Strategy promotion / Hybrid sub-form / Phase / Phase boundary / Mechanical role / Cup-side target / Strategy zone / Coffee Brief / Iteration loop / Reference brew / Resolved brew / Variety signal / Process signal / Roaster signal / Signal override / Extraction Confirmed / Modifiers Confirmed / Cooling-Curve Target / Signature method / Process-Dominant. **1 updated entry** (Optimized brew — now cross-pointed to Reference brew). **~40 new relationships** capturing the framework structure, signal arbitration, and lifecycle connections. **7 new flagged ambiguities** for future review. **Example dialogue section seeded** with the Picolot Simba Coffee Brief substrate.
- [docs/adr/0001-two-axis-brewing-framework.md](../adr/0001-two-axis-brewing-framework.md) — **first ADR in the repo**. Documents the WBC 5-axis → Latent 2-axis compression as a hard-to-reverse, learning-stage architectural decision with an explicit promotion path (v8.4 Hybrid promotion is the canonical precedent).

## Standing decision: brewing-followups do not block dogfood

None of the 9 follow-ups below are correctness blockers for routine brewing workflows. The signature method registry gap (#1) is the highest-priority because it affects every brew with a proprietary process — but existing brews tagged with the 3-entry registry continue to validate without it. **Proceed with routine brewing**, schedule follow-ups as sprint capacity allows.

## 9 follow-up actions

### Sprint candidates (bundle 1-3 together; 4-6 separately)

**1. Signature method registry gap — critical** [REGISTRY SYNC]
- Why: Chris's working canonical list has **14 signatures** (Moonshadow / TyOxidator / Alchemy / TIM / XO / Enzyflow / Bio-innovation / Sous-vide / Amazake / Anti-maceration / Dynamic cherry / Dry fermentation / Splash / Symbiotic) + **Wave Hybrid** flagged as a 15th candidate. The Latent registry currently encodes **3** (Moonshadow / TyOxidator / Hybrid Washed). Two-direction gap: **11 missing signatures** + **Hybrid Washed possibly deprecated** (not in Chris's working list).
- Surface: [lib/process-registry.ts](../../lib/process-registry.ts) + [docs/taxonomies/processes.md](../taxonomies/processes.md)
- Migration shape: ADD 11+ canonical entries; verify Hybrid Washed status with Chris before any removal. If deprecated, query `brews.signature_method = 'Hybrid Washed'` + `green_beans.signature_method = 'Hybrid Washed'` for re-mapping candidates.
- Highest priority of the 9 follow-ups — affects future Coffee Brief authoring for every proprietary-process coffee.

**2. BREWING.md doc-edit pass — Phase-Mapped + Role-Based Pulse vocabulary** [DOC EDIT]
- Why: BREWING.md uses `saturation / body / clarity / finish` as a "sensory target" set in both the Phase-Mapped Hybrid definition and the Role-Based Pulse modifier definition. Per round 4 grilling, this collapses **mechanical role** + **cup-side target** into one mixed vocabulary; canonical resolution is the **formal split**: mechanical role is open-ended (names a WBC axis being engaged on that phase), cup-side target is the **fixed 5-attribute set** `aroma / attack / mid-palate / body / finish`.
- Surface: [BREWING.md](../../BREWING.md) § Phase-Mapped Hybrid sub-form description (in Hybrid strategy section) + Role-Based Pulse modifier description (in Modifiers section)
- Coupled with #1 because both update brewing canonical content; bundle in one PR.

**3. WBC systematic-review** [SCOPING]
- Why: Chris asked round 3 for a systematic review of the WBC 5 foundational control axes + ~9 strategy families + per-family subtypes against the current Latent set (6 strategies + 4 modifiers + 5 Hybrid sub-forms), to confirm the chosen subset is the right starting point or whether anything should be promoted next.
- Surface: [docs/brewing/wbc-reference.md](../brewing/wbc-reference.md) + [docs/brewing/wbc-recipes.md](../brewing/wbc-recipes.md) + [BREWING.md](../../BREWING.md)
- Output: a report (not a code change) flagging promotion candidates + deferrals + new modifier or sub-form proposals. Could feed into a future ADR-0002 if promotion lands.

### Field retirement / re-evaluation (cluster 4-6)

**4. Extraction Confirmed — legacy field retirement evaluation**
- Why: Per round 8, Chris said the field is "probably a little dated at this point" because the Coffee Brief's upstream wrong-zone prevention has subsumed its original gut-check role. Today the field fires rarely.
- Decision needed: retain as legacy-but-useful (when it fires, it's a real signal worth keeping), or remove?
- Surface: `brews.extraction_confirmed` column + BREWING.md Step 4 description + `push_brew` Tool description

**5. process_dominant — load-bearing-at-current-corpus evaluation**
- Why: Per round 11, was invented for small-corpus aggregation-skew protection (pre-Latent claude.ai-local-app era). With 79+ brews today, a single Lord-Voldemort-tier brew probably doesn't move cultivar / terroir / roaster aggregations enough to justify the flag.
- Decision needed: retain, retire, or generalize ("constrained generalizability" flag rather than process-specific)?
- Surface: `brews.process_dominant` column + BREWING.md Step 4 description + aggregation logic on `/cultivars`, `/terroirs`, `/roasters` pages

**6. Brewing iteration-trace recording asymmetry**
- Why: Per round 6, brewing only records the final reference brew today; the roasting side records every batch slot within a V-set. Chris flagged he's open to reconsidering the recording asymmetry — there's a clear compounding-knowledge case for capturing the failed-attempts trace.
- Decision needed: scope a brewing-side iteration-trace schema (new table? jsonb on brews?) if dogfood / cross-coffee learning calls for it.
- Surface: schema design + push_brew Tool expansion + claude.ai prompt updates for capturing intermediate-brew tasting deltas

### Open questions for future grilling sessions

**7. Selective Bloom ↔ Output Selection boundary re-test trigger**
- Current resolution: Selective Bloom stays in Hybrid sub-form (role assignment); Output Selection stays in modifiers (fraction discarding). Per round 3 — Chris flagged near-merge but doc-side reasoning (Ferket pattern is structural, not discard-only) preserved the split.
- Re-test trigger: if a future Selective Bloom brew lands where the bloom is just discarded with no recombination (no role assignment to the bloom), revisit the boundary.

**8. Intensity-Clarity Split sub-form ↔ Phase-Mapped sub-form collapsibility**
- Per round 3 — Chris flagged Intensity-Clarity Split as "probably a subclass of Phase-Mapped." Currently kept distinct because phase order matters (intensity first, clarity second), which Phase-Mapped doesn't enforce.
- Re-evaluate trigger: if cross-brew evidence shows Intensity-Clarity Split brews are always re-expressible as Phase-Mapped, collapse to a single sub-form.

**9. Roasting-side process_dominant analog**
- Per round 11 — does roasting need a process_dominant flag on `green_beans` / `roast_learnings` to protect carry-forward aggregations from Lord-Voldemort-tier green-bean lots? Or is per-cultivar / per-terroir aggregation robust enough at current roasting corpus sizes (13 green lots as of 2026-05-13)?
- Trigger: if Chris ever buys a Lord-Voldemort-tier green-bean lot and the carry-forward aggregations skew, revisit. Low priority today (no such lot in current inventory).

## Suggested sequencing

```
[ Sprint A ] Signature method registry sync (#1)
              + BREWING.md doc-edit pass (#2)
              [coupled — both touch brewing canonical content; bundle in one PR]

[ Sprint B ] WBC systematic-review (#3)
              [reflective, low-risk; output is a report, not code]

[ Sprint C ] Field-retirement triage (#4, #5)
              [judgment-driven; bundle in one PR; possibly an ADR-0002 if both retire]

[ Sprint D ] Brewing iteration-trace schema scope (#6)
              [larger / forward-investment; future-scope]

[ Future grilling session ] Re-grill if #7 / #8 / #9 become friction points
```

Sprint A is the most time-sensitive (registry gap is affecting authoring TODAY). Sprint B-D are low-urgency and can wait for sprint capacity.

## Combined with roasting-side followups

Roasting-side grilling on 2026-05-14 surfaced 7 follow-ups (#1-#7 in [grilling-2026-05-14-followups.md](grilling-2026-05-14-followups.md); item #8 was "brewing-cluster grilling" which this session completed). Combined backlog: **16 items across roasting + brewing clusters**. Bundle by sprint affinity, not by cluster origin.

## Open questions for the next grilling session

- The brewing cluster is mostly covered. Remaining narrower terms (Roaster brew guide, Strategy drift, the canonical-picker pattern — canonical / alias / override / NET-NEW / drift) are deferred — they're not load-bearing today and the picker pattern overlaps with code-side terminology that isn't brewing-specific.
- Next likely grilling targets: the **synthesis pipeline** (the 4-entity directed synthesis system in [lib/synthesis/](../../lib/synthesis/) — terroir / cultivar / process / roaster adapters), or the **MCP architecture** (32 Tools, OAuth 2.1 + PKCE, claude.ai vs Claude Code asymmetric trust model). Both have implicit Latent-specific terminology worth crystallizing.

## Audio dictation note

Audio dictation mode confirmed as default cadence for grilling sessions. Long multi-fact replies remain the norm; the discipline of extracting every implicit term per turn (rather than just the literal answer to my question) is the right tempo and produced ~23 entries from 12 questions — close to 2:1, vs ~31 entries from 12 questions in the roasting session, partly because brewing clusters are more deeply interrelated.
