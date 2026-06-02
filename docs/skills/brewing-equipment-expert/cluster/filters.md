# Filter Paper Taxonomy

Authoritative authored content for the filter paper canonical registry.
Mirror file: [lib/filter-registry.ts](../../../../lib/filter-registry.ts).

Total canonical filters: **67** (23 owned, post Research Project #3 inventory cross-check 2026-05-25 — net +1 from FS-100 Chemex Pre-folded Squares net-new entry surfaced at Step 0).
Source CSV had 69 rows; 5 dropped as same-name duplicates.

Sizes (S/M) and Cafec roast-pack-size duplicates intentionally not surfaced as separate canonical entries. **Exception (Project #2 finding):** Sibarist's FLAT 2 family is a distinct paper line from FLAT (pre-folded v2 vs hand-fold v1) and IS surfaced as separate canonical entries — the pre-fold scoring + Negotiator-compressed design intent materially differentiates them.

---

## Measured Drawdown Reference — Research Project #1 (2026-05-23)

[Cone Filter Drawdown Characterization](../../../research-projects/cone-filter-drawdown.md) executed 2026-05-23 produced loaded-bed drawdown measurements for 8 V60-compatible cone filters, anchored at Sibarist CONE B3 (median ~60s at 15g / EG-1 6.5 / Hario V60 Glass V60-01). 8s noise floor; 3 real deltas, 4 indistinguishable. Per-paper measurements + bed-behavior axis surfaced in each entry's bullet block below; protocol + raw data in the project doc.

**Key registry-contradiction finding:** The Cafec roast-specific paper pair (LC4 light, DC4 dark) inverts the registry's qualitative `flowRate` ordering. LC4 measured +20s slower than B3 (registry says "Fast"); DC4 measured indistinguishable from B3 (registry says "Slow"). Community-stated design philosophy validated empirically — light paper engineered slow → extend extraction on hard-to-extract light roasts; dark paper engineered fast → shorten extraction on easy-to-extract dark roasts. Cafec's product labels describe extraction **outcome** not flow physics; the registry transcribed those literally. **Use `measuredDrawdownSec` instead of `flowRate` for brewing decisions on this paper family.**

The `FilterEntry` extension shipped in [lib/filter-registry.ts](../../../../lib/filter-registry.ts) carries 6 new fields: `measuredDrawdownSec` + `measurementDose` + `measurementBaseline` + `measurementDate` + `measurementProject` + `bedBehaviorUnderLoad` (4-value enum: `stable` / `late-forming-crater` / `pour-impact-crater` / `mixed`).

Project #2 closed 2026-05-24 (see next section). Project #3 (specialty/paired filter drawdown) queued.

---

## Measured Drawdown Reference — Research Project #2 (2026-05-24)

[Flat-Bottom Filter Drawdown Characterization](../../../research-projects/flat-bottom-filter-drawdown.md) executed 2026-05-24 produced loaded-bed drawdown measurements for 5 flat-bottom papers, anchored at Sibarist **FLAT 2 B3** (median 127.5s at 15g / EG-1 6.5 / Orea Type-A Glass + Negotiator). **6s noise floor** (tighter than Project #1's 8s); all 4 non-baseline deltas REAL. Per-paper measurements + Project #2-specific bullets in each entry below.

**Headline finding — geometry/compression dominates fiber by far.** Two clean clusters with no overlap:
- **Negotiator-compressed cluster (no Booster):** FLAT 2 B3 (127.5s) + FLAT 2 FAST (117s) + FLAT FAST hand-fold (117s) — 117-131s band
- **Free-seating cluster:** xBloom Premium (50s) + WAVE B3 (48.5s) — 48.5-50s band

70+ second gap between clusters. Seating-state is the dominant variable; fiber differences within the compressed cluster account for ≤14s. **The registry's `flowRate` cells understate context-dependence** — same B3 fiber family drains at 127.5s compressed vs ~48s free-seating, a 2.6× speed difference under one qualitative `flowRate: "Medium"` label.

**Sibarist FLAT 2 design intent (substrate context, not noise):** Sibarist markets FLAT 2 as *"The Next Evolution in Zero-Bypass Brewing"* — paper engineered for Negotiator-compressed configuration prioritizing bypass elimination over flow speed. Micro-folds friction (~70-80s vs free-seating) is a known tradeoff of the design intent, not a defect.

**Exploratory finding — Sibarist Booster 45 effect is paper-specific (or paper-size-specific; confounded):**
- FLAT 2 B3 (size S) + Booster: 52s drawdown (-75.5s vs no-Booster) — Booster effectively converts B3 to free-seating-cluster speed
- FLAT 2 FAST (size M) + Booster: 105s drawdown (-12s vs no-Booster) — Booster barely affects FAST
- Cannot cleanly separate fiber vs size effect with current data (see audit item #9)

**Registry-relevant findings worth surfacing:**
- New field shipped: `measurementNote` (optional string) — captures size variants, accessory context, hand-fold provenance, size-confound flags that pure data fields can't
- 2 net-new entries: FLAT 2 B3 + FLAT 2 FAST (Sibarist's pre-folded v2 line)
- FLAT B3 (v1 hand-fold) flipped to `owned: false` (Chris owns FLAT 2 successor)
- FLAT FAST (v1 hand-fold) flowRate revised from "Very fast" → "Medium (Negotiator-compressed)"
- WAVE B3 flowRate revised to dual context-dependent ("Medium (Negotiator-compressed) / Fast (free-seating in Orea)")
- WAVE B3 `paperShape: "Wave"` flagged for audit — functionally a flat-bottom paper with cupcake walls

**Project #1 lesson #8 reproduced:** band-vs-noise-floor mismatch (tight 6s noise floor + coarse ±15s comp band) fires on BOTH FAST family papers. The ±15s "functionally equivalent" band is too coarse for tight baselines. Queued for grind-comp table revision (audit item #8).

**Deferred:** April Paper Filter (cohort-of-one in Orea baseline; rolls into Project #3 native-brewer protocol). Geometry-check pair (FLAT 2 B3 size M vs FLAT 2 FAST size S) deferred to next acquisition cycle.

**Update 2026-06-01:** the cohort-of-one trigger is now satisfied — two April-fit papers are owned (April Paper Filter `APRIL-STD` + April FAST `APRIL-FAST`), so the April STD vs FAST peer comparison can run on the April brewer (standard or Hybrid). Still deferred by priority, not by blocker — Chris isn't prioritizing this measurement project yet.

**9 substrate-practice gap audit items queued** in the protocol doc — flowRate-as-context-dependent-triple, paperShape-vs-wallStructure decomposition, Booster-as-registry-concept, Orea variant canonicalization, alias-collapse historical audit, grind-comp table band revision, fiber-vs-size confound resolution. None blocking; surface when triggered.

---

## Measured Drawdown Reference — Research Project #3 (2026-05-25)

[Specialty Cone Filter Drawdown Characterization](../../../research-projects/specialty-cone-filter-drawdown.md) executed 2026-05-25 as **two mini-projects in one session** with deliberately contrasting brewer architectures, **closing the 3-project trifecta arc**:

- **#3a Funnex** (4 papers including 1 net-new): anchored at Sibarist CONE 28 FAST in Chemex Funnex glass at **10g/150g revised protocol** (per Funnex capacity ceiling, Lesson #20). **BIMODAL drawdown** — slow regime ~131s (4 reps, 36s range), fast regime ~31.5s (2 reps, 3s range), ~80/20 split empirically.
- **#3b Sibarist Brewing System** (2 papers): anchored at Sibarist HALO CONE B3 at 15g/250g. **4s baseline range** — tightest of any project in the entire arc (Project #1 = 8s, Project #2 = 6s, Project #3a = 36s bimodal). HALO-FAST classified Moderately faster (-26s real delta, 0.3 finer grind comp). Cleanest single-paper classification of the arc.

**Headline finding — paper "self-choke" is paper-brewer-interaction artifact (Lesson #36, deepest insight of arc).** Initial #3a interpretation of self-choke as paper-fiber-intrinsic was wrong. HALO-B3 paper-only test (no bed, no grounds, fresh paper held in BS, water poured) showed no choke whatsoever. The choke observed in #3a was fold mismatches + apex gaps + pinch points specific to V60-geometry-paper-in-Funnex-deep-cone, not paper property. **Paper engineered for its brewer doesn't choke.** Refines Lessons #27, #29, #30, #31 (all real phenomena, but mechanism is paper-brewer-interaction not paper-fiber).

**Bed-shape from fold geometry (Lesson #26).** Same Chemex bonded pulp fiber + same thickness produced 73s drawdown spread in Funnex: CHEMEX-HM-W (manual cone-fold) 118s vs FS-100 (factory fan-fold) 45s. Fold geometry → effective bed shape → throughput. Cone-fold = deep narrow bed; fan-fold = wider shallower bed.

**Manual creasing as Negotiator-equivalent (Lesson #22).** Funnex has no Negotiator-equivalent — pre-rinse seal technique itself becomes the seating mechanism. Seal-aggressiveness has 36s dynamic range on same paper (CONE28-FAST: 117s light / 132s moderate / 153s heavy). Continuous variable of large effect, not noise.

**Sibarist BS as brewer-as-paper-housing architectural class (Lesson #35).** New architectural category — paper IS the dripper, brewer is just housing. No brewer walls to seal against, no Negotiator/Booster needed, system handles seating natively. Distinct from V60/cone, Orea/flat, Funnex/deep-cone.

**Sibarist BS unlocks paper-only measurement methodology (Lesson #39).** By eliminating paper-brewer-fit variability, the BS functions as a "control brewer" for isolating paper-fiber-only effects. Research Project #4 (re-measure Project #1 V60 papers in BS) queued as methodology-validation project.

**20 new lessons (#20-39) extracted** in the protocol doc (plus #40 — role-discipline lesson from the compile-loop process side). 7 new substrate-practice gap audit items queued (AI-1 paperFitsBrewerRim + AI-2 foldGeometry + AI-3 brewerRole + AI-4 bedBehaviorUnderLoad enum extension + AI-5 CHEMEX-HM-W flowRate revision + AI-6 ADR-0015 Funnex/Booster fit = NONE empirically + AI-7 ADR-0015 flowRate-triple mechanism via Lesson #27 → #36 refinement). AI-6 and AI-7 shipped in this PR; the rest remain queued.

**Funnex/Booster compatibility empirically resolved as NONE.** None of Chris's 3 owned Sibarist Boosters (BOOSTER 45 flatbed / BOOSTER CONE V60 / BOOSTER UFO) fit Funnex deep-cone geometry. Updates ADR-0015's Implementation trigger language (AI-6).

**Research Assistant SKILL.md scaffolding unlocks.** 3-project trifecta complete + 40 lessons + 16 audit items + 3 closed projects = substrate strong enough to scaffold with high confidence.

---

## Measured Drawdown Reference — Research Project #4 (2026-05-26)

[Paper-Only V60 Cohort Drawdown Re-Measurement in Sibarist BS](../../../research-projects/paper-only-v60-cohort-drawdown.md) executed 2026-05-26 as a **methodology-validation project** that empirically tests Lesson #36. Re-measures Project #1's V60 cohort in Sibarist BS to isolate paper-fiber-only effects from paper-brewer-fit artifacts. Closes the substrate input for Research Assistant SKILL.md scaffolding.

**Methodology verdict: ✅ VALIDATES.** Paper-only measurement in Sibarist BS is a sound research mode. 4s baseline range matched #3b precedent exactly. Cross-project Δ-in-deltas analysis produced substantive substrate-extraction findings invisible to single-project measurement.

**Headline finding — Lesson #36 is FAMILY-CONDITIONAL, not universal (RP4-N4).** The "deepest insight of arc" framing was an over-generalization:
- **Hario + Sibarist families: Lesson #36 VALIDATES.** Paper-brewer-interaction dominates. CONE-B3 / METEOR-02 / VCF-01 all converged to baseline in BS (Δ +1 / +2 / +4) — paper-fiber signal is negligible, paper-brewer-fit was the dominant variable in P1.
- **CAFEC Cup 4 family: Lesson #36 PARTIALLY CONTRADICTED.** Paper-fiber signal dominates. LC4 / APC4 / MC4 / DC4 ALL REAL slow in BS (+16 / +17 / +7 / +19) regardless of P1 classification. Paper-fiber-real slowness, not paper-brewer-interaction artifact.

**Secondary findings:**
- **P1's wider noise floor (8s) systematically UNDERESTIMATED CAFEC family slowness.** Three CAFEC papers (DC4, MC4, APC4) showed hidden slowness revealed by BS's tighter 4s noise floor. Noise-floor-driven classification has measurement-precision bias toward indistinguishable.
- **Project #1 Headline #1 conclusion HOLDS AND EXTENDS.** CAFEC's registry labels (LC4 "Fast", DC4 "Slow") describe extraction outcome not flow physics. Now extended to full T-series (T-83 / T-90 / T-92) + Abaca APC4 — entire CAFEC Cup 4 family is paper-fiber-slow.
- **APC4 noise-floor-edge classification STABILIZES REAL.** P1 +12s edge → RP4 +17s strongly REAL.

**HALO-B3 baseline drift between #3b and RP4 (RP4 AI-1, UNRESOLVED).** Protocol referenced #3b's HALO-B3 baseline as 134s; RP4 measured 91s. **43s absolute gap** despite identical protocol (15g/250g, EG-1 6.5, Sudan Rume Natural blend continuity, BS). Both measurements internally consistent within their own session 4s noise floor; cross-session absolute reproducibility appears non-trivial. Candidate causes: paper batch drift / coffee blend-mix proportion / ambient state / operator technique drift between sessions. Compile-session decision: HALO-B3's `measuredDrawdownSec` retains #3b's 134s as the P3 archive; RP4's 91s recorded as a separate measurement context. Relative classifications within each session (HALO-FAST -26 REAL faster within P3) remain internally valid.

**Cohort:** 7 of 8 V60 papers tested. **CONE-FAST dropped at Step 0** — small size variant Chris owns doesn't fit BS (RP4 AI-6 queued: Sibarist FAST size variants worth registry sub-SKU treatment).

**9 new lessons (RP4-N1 through RP4-N9) + 7 new audit items (RP4 AI-1 through AI-7) captured.** Notable:
- RP4-N4: **Lesson #36 family-conditional refinement** (locked as ADR-0016)
- RP4-N5: Cross-project Δ-in-deltas as substrate-extraction primitive (defer to SKILL.md scaffolding)
- RP4-N8: CAFEC T-code as registry-relevant identifier (RP4 AI-3 queued: `productCode` field)
- RP4-N9: HALO-B3 vs CONE-B3 functional equivalence on drawdown in BS raises design-intent question (RP4 AI-4: follow-up brewing-quality test recommended)

**ADR-0015 (`flowRateContexts` schema) trigger condition MET** (P1 + P3 + RP4 = three independent context-dependence confirmations). Implementation can ship as separate PR.

**ADR-0016 NEW** (family-conditional flow-rate classification framework) — locks the RP4-N4 refinement as architectural decision.

After RP4 close-out: 4-project filter arc CLOSED. Outstanding work covered in total recap (separate compile-session output).

---

## April

### April Paper Filter — Owned

*Project #2 measurement deferred (2026-05-24): oversized for Orea v4 (would have required forced compression), AND no peer April-fit paper in the Project #2 scope to compare against (cohort-of-one problem). Re-measurement candidate when (a) second April-fit paper enters inventory, OR (b) Project #3 native-brewer protocol covers it via the April brewer with peer papers. See [docs/research-projects/flat-bottom-filter-drawdown.md](../../../research-projects/flat-bottom-filter-drawdown.md) Notes section.*

*PaperShape audit note (Project #3 prep 2026-05-24): April paper has flat bottom + fluted walls — same geometric pattern as Sibarist WAVE B3. Both would benefit from `paperShape: 'flat'` + `wallStructure: 'fluted'` per Project #2 audit item #3 (paperShape vs wallStructure decomposition). UNIQUE pattern: April's bottom diameter is brewer-specific large, so it operationally fits only the April brewer (like UFO paper only fits UFO dripper). Geometric class (flat-bottom-fluted) ≠ brewer-fit class.*

- SKU: `APRIL-STD`
- Link: <https://www.aprilcoffeeroasters.com/collections/april-brewing-accessories/products/april-paper-filter>
- Paper shape: Flat
- Size standard: Kalita-155
- Fits brewers: April, Orea, Kalita
- Seal/fit: Standard
- Material: Wood pulp
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Stable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Stability flat
- Location: Home
- Primary use case: Balanced flat extraction (moderate flow, neutral profile)

(The April x Sibarist FAST filter — same SKU `APRIL-FAST` — lives under **## Sibarist → April FAST**, since it's a Sibarist-manufactured collab. The former duplicate "April x Sibarist Filter" entry here was merged into it 2026-06-01.)

## Cafec

### CAFEC Abaca Cup 1 Cone Paper Filter

- SKU: `AC1-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-abaca-coffee-paper-filter-for-specialty-coffee-1-cup>
- Paper shape: Conical
- Size standard: V60-01
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Standard
- Material: Abaca + pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone

### CAFEC Abaca Cup 4 Cone Paper Filter

- SKU: `AC4-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-abaca-coffee-paper-filter-for-specialty-coffee>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Cafec, Orea Apex
- Seal/fit: Standard
- Material: Abaca + pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone

### CAFEC Abaca Cup 4 Cone Paper Filter (40 pack) — Owned

- SKU: `APC4-40W`
- Link: <https://cafecusa.com/collections/filter-papers/products/copy-of-cafec-abaca-cup-4-cone-paper-filter-v60-02-apc4-40w>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Standard
- Material: Abaca + pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone
- Location: Home
- Primary use case: Fast clarity baseline (standard high-flow reference; owned in both 40-pack assortment and 100-pack standalone variants)
- Measured drawdown (Research Project #1): 72s at 15g / EG-1 6.5 / Hario V60 Glass V60-01, vs B3 baseline 60s (2026-05-23). REAL slower (+12s outside 8s noise floor).
- Bed behavior under load: `late-forming-crater`
- **Measured drawdown (Research Project #4 BS, 2026-05-26):** 108s in Sibarist BS vs HALO-B3 baseline 91s = **+17 STRONGLY REAL slow**. Δ-in-deltas vs P1 V60 = +5 (P1 +12 edge → RP4 +17 — hidden slowness MASKED by P1's 8s noise floor; tighter BS 4s floor disambiguates). **Test 3 RESOLVED REAL** — APC4 has genuine paper-fiber slowness, not noise-floor-edge artifact. CAFEC family pattern per **Lesson #36 family-conditional refinement (RP4-N4, ADR-0016)**. Buckled under load like other CAFEC papers (RP4-N1).

### CAFEC Abaca Cup 4 Cone Paper Filter (brown 100)

- SKU: `AC4-100B`
- Link: <https://cafecusa.com/collections/filter-papers/products/abaca-cup-4-cone-paper-filter-ac4-100b>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Standard
- Material: Abaca + pulp (unbleached)
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone

### CAFEC Abaca Cup 4 Cone Paper Filter (brown 40)

- SKU: `AC4-40B`
- Link: <https://cafecusa.com/collections/filter-papers/products/abaca-cup-4-cone-paper-filter-ac4-40b>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Standard
- Material: Abaca + pulp (unbleached)
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone

### CAFEC Abaca Cup 4 Cone Paper Filter (variant)

- SKU: `AC4-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/copy-of-cafec-abaca-cup-4-cone-paper-filter-v60-02-ac4-100w-3>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Standard
- Material: Abaca + pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone

### CAFEC Abaca Trapezoid Filter 101

- SKU: `AB-101-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-101-abaca-trapezoid-paper-filter-for-1-3-cups-100pcs-pack-disposable-pour-over-drip-coffee-paper-filter-made-of-eco-friendly-refined-virgin-pulp-for-better-tasting-brewing-pour-over-dripper-white>
- Paper shape: Trapezoid
- Size standard: 101
- Fits brewers: Clever, Melitta (small), Cafec Oval
- Seal/fit: Standard
- Material: Abaca + pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Stability flat

### CAFEC Abaca Trapezoid Filter 101 (variant)

- SKU: `AB-101-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-trapezoid-101-abaca-trapezoid-paper-filter-for-1-2-cups-100pcs-pack-ab-101-100w-copy>
- Paper shape: Trapezoid
- Size standard: 101
- Fits brewers: Clever, Melitta (small), Cafec Oval
- Seal/fit: Standard
- Material: Abaca + pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Stability flat

### CAFEC Abaca Trapezoid Filter 102

- SKU: `AB-102-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-102-abaca-trapezoid-paper-filter-for-3-5-cups-100pcs-pack-disposable-pour-over-drip-coffee-paper-filter-made-of-eco-friendly-refined-virgin-pulp-for-better-tasting-brewing-pour-over-dripper-white>
- Paper shape: Trapezoid
- Size standard: 102
- Fits brewers: Clever, Melitta, OXO, Cafec Oval
- Seal/fit: Standard
- Material: Abaca + pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Stability flat

### CAFEC Abaca Trapezoid Filter 102 (Alt SKU)

- SKU: `AB-102-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/copy-of-cafec-trapezoid-102-cup-3-5-abaca-trapezoid-paper-filter-ab-102-100w>
- Paper shape: Trapezoid
- Size standard: 102
- Fits brewers: Clever, Melitta, OXO, Cafec Oval
- Seal/fit: Standard
- Material: Abaca + pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Stability flat

### CAFEC Abaca+ Cup 1 Cone Paper Filter

- SKU: `APC1-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/copy-of-cafec-abaca-cup-1-cone-paper-filter-v60-01-ac1-100w>
- Paper shape: Conical
- Size standard: V60-01
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Standard
- Material: Abaca + pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone
- *Ownership corrected 2026-05-23 (Research Project #1 inventory cross-check): not physically present in drawer. Chris owns Cup 4 Abaca+ (APC4-40W + APC4-100W standalone) not Cup 1.*

### CAFEC Abaca+ Deep 27 Coffee Filter (white) — Owned

- SKU: `AFD27-100W`
- Link: <https://cafecusa.com/products/copy-of-cafec-abaca-cup-4-cone-paper-filter-v60-02-ac4-100w-3>
- Paper shape: Conical (deep)
- Size standard: Deep27
- Fits brewers: Cafec Deep27, Funnex
- Seal/fit: Tight (deep fit)
- Material: Abaca+ (refined blend)
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Very stable
- Clarity / Body / Sweetness: High / Medium / Clean but weighted
- Best archetype: Clarity cone (deep extraction)
- Location: Home
- Primary use case: Deep extraction clarity (increase contact time via bed depth, not resistance)
- Measured drawdown (Research Project #3a): **144s** at 10g / EG-1 6.5 / Funnex (Sibarist CONE 28 FAST baseline; bimodal — slow regime 131s, fast regime 31.5s) (2026-05-25). Landed in slow regime; +13s vs slow-regime baseline = FE within regime.
- Bed behavior under load: `late-forming-crater`
- ⚠️ All three #3a non-baseline papers were FE to baseline within their respective regimes — practical paper-paper differentiation in Funnex is which regime each lands in (paper-geometry × brewer-geometry interaction, Lesson #26 fold-geometry → bed-shape).

### CAFEC Arita Ware Paper Filter

- SKU: `DDF-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/copy-of-cafec-arita-ware-paper-filter-ddf-100w>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Tight (low bypass)
- Material: Refined pulp
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Very stable
- Clarity / Body / Sweetness: High / Medium / Clean
- Best archetype: Clarity cone (controlled)

### CAFEC T-83 - Cup 1 Dark Roast Paper Filter

- SKU: `DC1-40W`
- Link: <https://cafecusa.com/collections/filter-papers/products/cup-1-dark-roast-paper-filter-dc1-40w>
- Paper shape: Conical
- Size standard: V60-01
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Standard
- Material: Wood pulp
- Thickness: Thick
- Flow rate: Slow
- Flow consistency: Stable
- Clarity / Body / Sweetness: Low / High / Muted
- Best archetype: Immersion hybrid (cone assist)
- *Ownership corrected 2026-05-24 (Research Project #3 prep): Chris owns CAFEC papers only via the [Cup 4 (V60-02) 4-pack assortment](https://cafecusa.com/products/copy-of-cafec-4p-paper-filter-assortment-v60-02-cup4-cfa4-40w-4p). Cup 1 (V60-01) variants like this DC1 entry are not owned — same Project #1 SKU naming-convention drift (1/4 digit encodes paper SIZE, not roast spec).*

### CAFEC T-92 - Cup 1 Light Roast Paper Filter (slow)

- SKU: `LC1-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-cup-1-pour-over-coffee-paper-filter-by-roasting-type-flow-rate-differences-for-specialty-coffee-light-roast-slower-flow-rate-1-cup-size-v60-01>
- Paper shape: Conical
- Size standard: V60-01
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Standard
- Material: Wood pulp
- Thickness: Thin
- Flow rate: Medium
- Flow consistency: Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone
- *Ownership corrected 2026-05-23 (Research Project #1 inventory cross-check): not physically present in drawer. Chris owns no Cup-1 CAFEC papers; killed the LC4-vs-LC1 geometry-check pair (deferred until any Cup-1 CAFEC paper enters inventory).*

### CAFEC T-90 - Cup 1 Medium Roast Paper Filter

- SKU: `MC1-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-cup-1-pour-over-coffee-paper-filter-by-roasting-type-flow-rate-differences-for-specialty-coffee-medium-roast-faster-flow-rate-1-cup-size-v60-01>
- Paper shape: Conical
- Size standard: V60-01
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Standard
- Material: Wood pulp
- Thickness: Medium-fast
- Flow rate: Medium-fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Stability flat (cone variant)
- *Ownership corrected 2026-05-24 (Research Project #3 prep): Chris owns CAFEC papers only via the [Cup 4 (V60-02) 4-pack assortment](https://cafecusa.com/products/copy-of-cafec-4p-paper-filter-assortment-v60-02-cup4-cfa4-40w-4p). Cup 1 (V60-01) variants like this MC1 entry are not owned — same Project #1 SKU naming-convention drift.*

### CAFEC Cup 4 Dark Roast Paper Filter — Owned (assortment pack)

- SKU: `DC4-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/copy-of-cafec-cup-4-dark-roast-paper-filter-v60-02-dc4-100w>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Standard
- Material: Wood pulp
- Thickness: Thick
- Flow rate: Slow
- Flow consistency: Stable
- Clarity / Body / Sweetness: Low / High / Muted
- Best archetype: Immersion hybrid (cone assist)
- Location: Home
- Primary use case: Owned via Cafec 4-pack assortment (40-pack variant); dark-roast specific
- Measured drawdown (Research Project #1): 68s at 15g / EG-1 6.5 / Hario V60 Glass V60-01, vs B3 baseline 60s (2026-05-23). Indistinguishable from B3 (+7-8s within 8s noise floor; reclassified REAL → indistinguishable after re-test).
- Bed behavior under load: `late-forming-crater`
- ⚠️ **Measurement CONTRADICTS registry `flowRate: "Slow"` + `thickness: "Thick"` cells.** Measured speed: indistinguishable from B3 (medium); paper did not feel thicker than LC4 in hand. Cafec's product labels describe extraction outcome ("Slow extraction for dark roast") not flow physics. See Research Project #1 headline finding #1.
- **Measured drawdown (Research Project #4 BS, 2026-05-26):** 110s in Sibarist BS vs HALO-B3 baseline 91s = **+19 REAL slow**. Δ-in-deltas vs P1 V60 = **+11 — MAJOR REVEAL**: DC4 read as P1 indistinguishable (+7-8) but tighter BS floor exposed +11s of hidden paper-fiber slowness. **Test 2 REINFORCED** — CAFEC Cup 4 family uniformly paper-fiber-slow. P1 Headline #1 conclusion EXTENDS to T-83 dark roast. **Lesson #36 family-conditional per RP4-N4 (ADR-0016).** T-code: T-83.

### CAFEC T-92 - Cup 4 Light Roast Paper Filter — Owned

- SKU: `LC4-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-pour-over>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Standard
- Material: Wood pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone
- Location: Home
- Primary use case: Peak clarity (max separationm, high-acid coffees)
- Measured drawdown (Research Project #1): 80s at 15g / EG-1 6.5 / Hario V60 Glass V60-01, vs B3 baseline 60s (2026-05-23). REAL slower (+20s outside 8s noise floor; 0.3 notch coarser grind compensation recommended).
- Bed behavior under load: `late-forming-crater`
- ⚠️ **Measurement CONTRADICTS registry `flowRate: "Fast"` + `thickness: "Thin"` cells.** Measured speed: +20s slower than B3 (real). Paper felt noticeably thinner in hand than other Cafec papers — but loaded-bed flow is slower, not faster. Cafec's product labels describe extraction outcome ("Fast extraction for light roast") not flow physics. See Research Project #1 headline finding #1.
- **Measured drawdown (Research Project #4 BS, 2026-05-26):** 107s in Sibarist BS vs HALO-B3 baseline 91s = +16 REAL slow. Δ-in-deltas vs P1 V60 = -4 (~80% of P1 slowness persists in paper-only context). **Test 2 HOLDS** — CAFEC family is paper-fiber-real slow, NOT paper-brewer-interaction artifact. **Lesson #36 family-conditional per RP4-N4** (see ADR-0016). Paper buckled under load without V60 dripper support (RP4-N1 — `paperShapeRetention` sub-attribute candidate). T-code: T-92 (RP4-N8 / RP4 AI-3 queued: add `productCode` registry field).

### CAFEC Cup 4 Medium Roast Paper Filter — Owned (assortment pack)

- SKU: `MC4-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/copy-of-cafec-cup-4-medium-roast-paper-filter-v60-02-mc4-100w-2>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Standard
- Material: Wood pulp
- Thickness: Medium
- Flow rate: Medium-fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Stability flat (cone variant)
- Location: Home
- Primary use case: Owned via Cafec 4-pack assortment (40-pack variant); medium-roast specific
- Measured drawdown (Research Project #1): 60s at 15g / EG-1 6.5 / Hario V60 Glass V60-01, vs B3 baseline 60s (2026-05-23). Indistinguishable from B3 (0s delta).
- Bed behavior under load: `mixed`
- **Measured drawdown (Research Project #4 BS, 2026-05-26):** 98s in Sibarist BS vs HALO-B3 baseline 91s = **+7 REAL slow (modest)**. Δ-in-deltas vs P1 V60 = +7 — **third CAFEC noise-floor reveal** (P1 read MC4 as 0 baseline-equivalent; BS reveals +7 paper-fiber slowness was hidden). CAFEC family slow pattern confirmed at 3-of-4 sample (DC4 +11 / MC4 +7 / APC4 +5; LC4 -4 already-classified-real in P1). T-code: T-90.

### CAFEC SFP Cup 4 Cone Paper Filter

- SKU: `SFP4-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/sfp-cup-4-cone-paper-filter-sfp4-100w>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Tight (low bypass)
- Material: Refined pulp
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Very stable
- Clarity / Body / Sweetness: High / Medium / Clean
- Best archetype: Clarity cone (controlled)

### CAFEC TH-1 Light Roast Paper Filter

- SKU: `TH1-4-100`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-th-1-cup-4-light-roast-paper-filter-v60-02-th14-100-copy>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Tight (low bypass)
- Material: Refined pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Very stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone (controlled)

### CAFEC TH-2 Dark Roast Paper Filter

- SKU: `TH2-4-100`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-th-2-cup-4-dark-roast-paper-filter-v60-02-th24-100-copy>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Tight (low bypass)
- Material: Refined pulp
- Thickness: Thick
- Flow rate: Slow
- Flow consistency: Very stable
- Clarity / Body / Sweetness: Low / High / Muted
- Best archetype: Immersion hybrid (cone assist)

### CAFEC TH-3 Medium Roast Paper Filter

- SKU: `TH3-4-100`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-th-3-cup-4-medium-roast-paper-filter-v60-02-th34-100-copy>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Tight (low bypass)
- Material: Refined pulp
- Thickness: Medium
- Flow rate: Medium-fast
- Flow consistency: Very stable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Stability flat (cone variant)

### CAFEC Traditional Cup 1 Filter

- SKU: `CC1-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-cup-1-traditional-paper-filter-cc1-100w>
- Paper shape: Conical
- Size standard: V60-01
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Loose
- Material: Wood pulp
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Variable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Clarity cone (classic)

### CAFEC Wave Paper Filter 250

- SKU: `WF250-250W`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-wave-paper-filters-250-no-250-wave-filter-250-sheets-bag-4-bags-per-carton-wf250-250w>
- Paper shape: Wave
- Size standard: Kalita-185
- Fits brewers: Kalita, Orea, April, Stagg
- Seal/fit: Standard
- Material: Wood pulp
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Stable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Stability flat

## Chemex

### Chemex Bonded Filter (Half Moon Natural)

- SKU: `CHEMEX-HM-N`
- Link: <https://chemexcoffeemaker.com/products/chemex-bonded-filters-unfolded-half-moon-natural>
- Paper shape: Conical (folded)
- Size standard: Chemex
- Fits brewers: Funnex, Chemex
- Seal/fit: Loose (thick seal via paper)
- Material: Bonded pulp (unbleached)
- Thickness: Very thick
- Flow rate: Slow
- Flow consistency: Very stable
- Clarity / Body / Sweetness: High / Very high / Heavy
- Best archetype: Clarity cone (low bypass)

### Chemex Bonded Filter (Half Moon White) — Owned

- SKU: `CHEMEX-HM-W`
- Link: <https://chemexcoffeemaker.com/products/chemex-bonded-filters-unfolded-half-moon>
- Paper shape: Conical (folded)
- Size standard: Chemex
- Fits brewers: Funnex, Chemex
- Seal/fit: Loose (thick seal via paper)
- Material: Bonded pulp
- Thickness: Very thick
- Flow rate: Slow
- Flow consistency: Very stable
- Clarity / Body / Sweetness: High / Very high / Heavy
- Best archetype: Clarity cone (low bypass)
- Location: Home
- Primary use case: Use as immersion-like cone (max body + filtration, suppresses brightness)
- Measured drawdown (Research Project #3a): **118s** at 10g / EG-1 6.5 / Funnex (Sibarist CONE 28 FAST baseline, bimodal) (2026-05-25). Landed in slow regime; -13s vs slow-regime baseline = FE within regime.
- Bed behavior under load: `late-forming-crater`
- ⚠️ **REGISTRY-DRIFT AUDIT (AI-5):** registry flowRate "Slow" but measured FE to baseline in Funnex — partial-seal confound possible (thicker paper may have produced lighter seal than CONE28-FAST baseline).
- ⚠️ **Paper-above-brewer-rim physical constraint (Lesson #25):** paper sits ABOVE Funnex rim — hard limit, not procedural. Queued as audit item #1 (`paperFitsBrewerRim` registry field proposal).
- 🆕 **Fold geometry contrast with FS-100 (Lesson #26):** cone-fold (manual) creates deep narrow bed in Funnex; FS-100's fan-fold (factory pre-folded squares) creates wider shallower bed and drains **73s faster (45s vs 118s) on same Chemex bonded pulp fiber**. Strongest single signal in #3 for bed-shape as underexplored axis.

### Chemex Bonded Pre-folded Squares (White) — Owned

*Net-new entry surfaced at Project #3 Step 0 photo confirmation (2026-05-25). Single most impactful Step 0 finding in #3.*

- SKU: `FS-100`
- Link: <https://chemexcoffeemaker.com/products/chemex-bonded-pre-folded-squares-100ct>
- Paper shape: Square (pre-folded)
- Size standard: Chemex
- Fits brewers: Funnex, Chemex
- Seal/fit: Loose (factory fan-fold; paper sits ABOVE Funnex rim per Project #3 Lesson #25 physical constraint)
- Material: Bonded pulp
- Thickness: Very thick
- Flow rate: Fast (in Funnex; 73s faster than CHEMEX-HM-W cone-fold on same fiber per Project #3 Lesson #26)
- Flow consistency: Very stable
- Clarity / Body / Sweetness: High / Medium / Clean
- Best archetype: Clarity cone (fast)
- Location: Home
- Primary use case: Fan-fold flat-bed alternative to Chemex cone-fold; faster drawdown in deep cone brewers (Funnex) due to wider/shallower bed geometry
- Measured drawdown (Research Project #3a): **45s** at 10g / EG-1 6.5 / Funnex (Sibarist CONE 28 FAST baseline, bimodal) (2026-05-25). Landed in fast regime; +13.5s vs fast-regime baseline = FE within regime.
- Bed behavior under load: `late-forming-crater`
- 🆕 **Fold geometry demonstrates Lesson #26:** fan-fold factory pre-folded squares create wider shallower bed in Funnex vs CHEMEX-HM-W's manual cone-fold deep narrow bed. Same Chemex bonded pulp fiber + same thickness but 73s drawdown spread (45s vs 118s).

## Hario

### Hario Flow Paper Filters

- SKU: `FLOW-50`
- Link: <https://www.hario-usa.com/products/flow-paper-filters-50ct>
- Paper shape: Wave
- Size standard: Kalita-155
- Fits brewers: Hario Flow, flat brewers
- Seal/fit: Tight (center-supported)
- Material: Refined pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Very stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Stability flat

### Hario V60 Meteor Filter 02 — Owned

- SKU: `METEOR-02`
- Link: <https://www.hario-usa.com/products/v60-meteor-filters-02>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami
- Seal/fit: Standard (improved seal)
- Material: Refined pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: More stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone
- Location: Home
- Primary use case: Improved clarity baseline (faster, more stable than standard Hario)
- Measured drawdown (Research Project #1): 65s at 15g / EG-1 6.5 / Hario V60 Glass V60-01, vs B3 baseline 60s (2026-05-23). Indistinguishable from B3 (+4-5s within 8s noise floor).
- Bed behavior under load: `late-forming-crater` (mild, less pronounced than Abaca+ APC4)
- **Measured drawdown (Research Project #4 BS, 2026-05-26):** 93s in Sibarist BS vs HALO-B3 baseline 91s = +2 indistinguishable. Δ-in-deltas vs P1 V60 = -3 — tracks baseline both contexts (Test 1 convergence). Paper sat well above BS rim but **no drawdown impact** — strengthens **RP4-N7 (above-rim seating non-impacting on flow in BS architecture)** and Lesson #39 (BS as paper-only measurement platform). **Hario family validates Lesson #36 paper-brewer-INTERACTION dominance.**

### Hario V60 Paper Filter 01 (Tabbed) — Owned

- SKU: `VCF-01-100W`
- Link: <https://www.hario-usa.com/products/paper-filter-for-01-drippers>
- Paper shape: Conical
- Size standard: V60-01
- Fits brewers: V60, Origami
- Seal/fit: Loose
- Material: Wood pulp
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Variable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Clarity cone (classic)
- Location: Home
- Primary use case: Baseline cone reference (introduces variability intentionally)
- Measured drawdown (Research Project #1): 65s at 15g / EG-1 6.5 / Hario V60 Glass V60-01, vs B3 baseline 60s (2026-05-23). Indistinguishable from B3 (+4-5s within 8s noise floor).
- Bed behavior under load: `pour-impact-crater`
- **Measured drawdown (Research Project #4 BS, 2026-05-26):** 95s in Sibarist BS vs HALO-B3 baseline 91s = +4 indistinguishable (edge). Δ-in-deltas vs P1 V60 = -1 — tracks baseline both contexts; cross-confirms METEOR-02. **Hario family validates Lesson #36 paper-brewer-INTERACTION dominance.** **Egg-shape bed asymmetry observed but no flow-rate impact** — surfaces `'asymmetric-stable'` enum value candidate distinct from `'stable'` (RP4-N6 / RP4 P3 AI-4 extension). Buckled under load (RP4-N1, same pattern as CAFEC family) but still baseline.

### Hario V60 Paper Filter 01 (Untabbed)

- SKU: `VCF-01-100M`
- Link: <https://www.hario-usa.com/products/copy-of-paper-filter-for-01-drippers>
- Paper shape: Conical
- Size standard: V60-01
- Fits brewers: V60, Origami
- Seal/fit: Loose
- Material: Wood pulp
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Variable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Clarity cone (classic)
- *Ownership corrected 2026-05-23 (Research Project #1 inventory cross-check): not physically present in drawer; never owned.*

### Hario V60 Paper Filter 03

- SKU: `VCF-03-100W`
- Link: <https://www.hario-usa.com/products/paper-filter-for-03-drippers>
- Paper shape: Conical
- Size standard: V60-03
- Fits brewers: V60 (large brews)
- Seal/fit: Loose
- Material: Wood pulp
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Variable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Clarity cone (classic)

## Kalita

### Kalita Wave 155 Filter

- SKU: `KW155-100`
- Link: <https://kalitausa.com/products/kalita-wave-155-filter-100ct>
- Paper shape: Wave
- Size standard: Kalita-155
- Fits brewers: Kalita, Orea, April
- Seal/fit: Standard
- Material: Wood pulp
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Moderately stable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Stability flat

## Sibarist

### April B3

- SKU: `APRIL-B3`
- Link: <https://sibarist.coffee/en-es/products/april>
- Paper shape: Flat
- Size standard: Kalita-155
- Fits brewers: April, April Hybrid Brewer
- Seal/fit: Tight (low bypass)
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Stability flat (controlled)

### April FAST — Owned

(The April×Sibarist FAST collab — one product, two vendor pages: <https://www.aprilcoffeeroasters.com/products/april-x-sibarist> + <https://sibarist.coffee/en-es/products/april>. Acquired 2026-06-01. Merged with the former duplicate "April x Sibarist Filter" entry, same SKU `APRIL-FAST`.)

- SKU: `APRIL-FAST`
- Link: <https://sibarist.coffee/en-es/products/april>
- Paper shape: Flat
- Size standard: Kalita-155
- Fits brewers: April, April Hybrid Brewer, Orea
- Seal/fit: Tight (low bypass)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Stability flat
- Location: Home
- Primary use case: High-clarity flat extraction (fine grind / high dose, controlled flow)

### CONE 28 B3

- SKU: `CONE28-B3`
- Link: <https://sibarist.coffee/en-es/products/cone-28-30%C2%BA>
- Paper shape: Conical
- Size standard: Low-angle cone
- Fits brewers: Deep cone brewers
- Seal/fit: Tight
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Clarity cone (controlled)

### CONE 28 FAST — Owned

- SKU: `CONE28-FAST`
- Link: <https://sibarist.coffee/en-es/products/cone-28-30%C2%BA>
- Paper shape: Conical
- Size standard: Low-angle cone
- Fits brewers: Deep cone brewers
- Seal/fit: Tight
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Clarity cone
- Location: Home
- Primary use case: Extreme extraction clarity (deep cone + high flow, high extraction yield)
- Measured drawdown (Research Project #3a): **131s slow regime / 31.5s fast regime** at 10g / EG-1 6.5 / Funnex (2026-05-25). **Baseline / anchor — BIMODAL** under Funnex without Negotiator-equivalent. Slow regime: 4-rep median 131s, 36s range (Pulls 1+2+4 spanning seal-aggressiveness ladder, Pull 3 reclassified outlier). Fast regime: 2-rep median 31.5s, 3s range (Pulls B1+B2). ~80/20 split empirically.
- Bed behavior under load: `mixed` (bimodal regime selection)
- ⚠️ **BIMODAL DRAWDOWN** — paper-brewer-interaction artifact per Lesson #36 (initially interpreted as paper-fiber-intrinsic self-choke per Lesson #27; refined post-#3b after HALO-B3 paper-only test showed no choke in Sibarist BS architecture). Regime selection driven by pour rate × bed throughput interaction (Lesson #31).
- ⚠️ **Manual creasing as Negotiator-equivalent procedural primitive (Lesson #22):** seal-aggressiveness 36s dynamic range on same paper (117s light / 132s moderate / 153s heavy). Continuous variable, not noise.
- ⚠️ **Funnex/Booster fit = NONE empirically** (V60-geometry Boosters don't seat on Funnex deep cone). Updates ADR-0015 Implementation trigger (AI-6).

### CONE B3 — Owned

- SKU: `CONE-B3`
- Link: <https://sibarist.coffee/en-es/products/cone>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Orea Apex
- Seal/fit: Tight (precision fit)
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Clarity cone (controlled)
- Location: Home
- Primary use case: Structured clarity (adds body without sacrificing cleanliness)
- Measured drawdown (Research Project #1): 60s at 15g / EG-1 6.5 / Hario V60 Glass V60-01 (2026-05-23). **Baseline / anchor** — 3-replicate median, 8s range across pulls. Sibarist's "Extremely stable" `flowConsistency` registry cell measured up: noise floor tighter than the protocol's ≤15s forecast.
- Bed behavior under load: `late-forming-crater`
- **Measured drawdown (Research Project #4 BS, 2026-05-26):** 92s in Sibarist BS vs HALO-B3 baseline 91s = +1s indistinguishable. Δ-in-deltas vs P1 V60 = +1 — cleanly tracks baseline both contexts. **Validates Lesson #36 paper-brewer-INTERACTION dominance for Sibarist-family papers (RP4-N4 / ADR-0016).** Cleanest Test 1 (convergence) anchor in RP4.

### CONE BS B3

- SKU: `CONE-BS-B3`
- Link: <https://sibarist.coffee/en-es/products/cone-bs>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami
- Seal/fit: Tight
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Clarity cone (controlled)

### CONE BS FAST

- SKU: `CONE-BS-FAST`
- Link: <https://sibarist.coffee/en-es/products/cone-bs>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami
- Seal/fit: Tight
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Clarity cone

### CONE FAST — Owned

- SKU: `CONE-FAST`
- Link: <https://sibarist.coffee/en-es/products/cone>
- Paper shape: Conical
- Size standard: V60-02
- Fits brewers: V60, Origami, Orea Apex
- Seal/fit: Tight (precision fit)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Clarity cone
- Location: Home
- Primary use case: Maximum clarity ceiling (fastest stable cone extraction)
- Measured drawdown (Research Project #1): 45s at 15g / EG-1 6.5 / Hario V60 Glass V60-01, vs B3 baseline 60s (2026-05-23). REAL faster (-15 to -16s outside 8s noise floor; 0.3 notch finer grind compensation recommended). Only paper tested that aligned with its registry `flowRate: "Very fast"` cell.
- Bed behavior under load: `pour-impact-crater`
- **Research Project #4 (2026-05-26): NOT TESTED in Sibarist BS** — small size variant (Chris's owned variant) doesn't fit BS; cohort dropped 8→7 at Step 0. **RP4 AI-6 queued:** Sibarist FAST size variants (small vs large) worth registry sub-SKU treatment (`sizeVariant` field OR split SKUs).

### FAST Trapezoid

- SKU: `TRAP-FAST`
- Link: <https://sibarist.coffee/en-es/products/fast-trapezoid>
- Paper shape: Trapezoid
- Size standard: 102
- Fits brewers: Clever, Melitta
- Seal/fit: Tight
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Stability flat

### FLAT B3

- SKU: `FLAT-B3`
- Link: <https://sibarist.coffee/en-es/products/flat>
- Paper shape: Flat
- Size standard: Kalita-155/185
- Fits brewers: Orea, Kalita, April
- Seal/fit: Tight (low bypass)
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Stability flat (controlled)
- *Ownership corrected 2026-05-24 (Research Project #2 inventory cross-check): Chris owns the FLAT 2 B3 successor (pre-folded v2), not this hand-fold v1 variant. See FLAT 2 B3 entry below.*

### FLAT 2 B3 — Owned

- SKU: `FLAT2-B3`
- Link: <https://sibarist.coffee/en-es/products/flat-2>
- Paper shape: Flat
- Size standard: Kalita-155/185 (Chris owns size S)
- Fits brewers: Orea, Kalita, April
- Seal/fit: Tight (zero-bypass per Sibarist design intent)
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium (Negotiator-compressed)
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Stability flat (controlled)
- Paper technology: B3 (pre-folded v2)
- Location: Home
- Primary use case: Pre-folded structured flat extraction; Chris's active workhorse flat baseline
- Measured drawdown (Research Project #2): **127.5s** at 15g / EG-1 6.5 / Orea Type-A Glass V60-01 + Negotiator (2026-05-24). **Baseline / anchor** — 3-replicate median, 6s range across pulls (tightest noise floor in either project).
- Bed behavior under load: `late-forming-crater`
- ⚠️ Sibarist markets FLAT 2 as **"The Next Evolution in Zero-Bypass Brewing"** — paper engineered for Negotiator-compressed configuration; micro-folds friction is a known tradeoff of the design intent, not a defect.
- Exploratory: + Sibarist Booster 45 → 52s drawdown (-75.5s vs no-Booster). Booster effectively converts B3 to free-seating-cluster speed. Effect is paper-specific (or paper-size-specific; confounded — see audit item #9).

### FLAT 2 FAST — Owned

- SKU: `FLAT2-FAST`
- Link: <https://sibarist.coffee/en-es/products/flat-2>
- Paper shape: Flat
- Size standard: Kalita-155/185 (Chris owns size M)
- Fits brewers: Orea, Kalita, April
- Seal/fit: Tight (zero-bypass per Sibarist design intent)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Medium (Negotiator-compressed; measurement-revised from inherited "Very fast")
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Stability flat
- Paper technology: FAST (pre-folded v2)
- Location: Home
- Primary use case: Pre-folded clarity-forward flat extraction; FAST fiber in v2 pre-folded format
- Measured drawdown (Research Project #2): **117s** at 15g / EG-1 6.5 / Orea Type-A Glass V60-01 + Negotiator (2026-05-24). REAL faster than FLAT 2 B3 (-10.5s outside 6s noise floor). Cross-confirmed with FLAT FAST hand-fold (both at 117s exact).
- Bed behavior under load: `late-forming-crater`
- ⚠️ Tested in size M; baseline FLAT 2 B3 tested in size S. The 10.5s delta cannot be cleanly attributed to fiber alone (size confound). Queued as Project #2 audit item #9.
- Exploratory: + Sibarist Booster 45 → 105s drawdown (-12s vs no-Booster). Booster barely affects FAST — much less sensitive than FLAT 2 B3's -75.5s response. Effect is fiber-specific OR size-specific (confounded).
- ⚠️ Band-vs-noise-floor mismatch: REAL delta by Step 2 but No-Comp recommendation by Step 3 (Δ -10.5s within ±15s "functionally equivalent" band). Project #1's APC4 edge case reproduces. See audit item #8.

### FLAT FAST — Owned

- SKU: `FLAT-FAST`
- Link: <https://sibarist.coffee/en-es/products/flat>
- Paper shape: Flat
- Size standard: Kalita-155/185
- Fits brewers: Orea, Kalita, April
- Seal/fit: Tight (low bypass)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Stability flat
- Location: Home
- Primary use case: Hand-folded maximum clarity flat bed; behaviorally indistinguishable from FLAT 2 FAST factory-fold per Project #2 measurement
- Measured drawdown (Research Project #2): **117s** at 15g / EG-1 6.5 / Orea Type-A Glass V60-01 + Negotiator (2026-05-24). REAL faster than FLAT 2 B3 baseline (-10.5s). Cross-confirmed with FLAT 2 FAST factory-fold (both at 117s exact) — strong evidence hand-fold quality is a non-factor with paper scoring + Negotiator compression. Chris's first hand-fold attempt.
- Bed behavior under load: `late-forming-crater`
- ⚠️ Paper size used in measurement: unknown — see Project #2 open data items. If size M (matching Pull 6), the 117s match is clean fiber-confirmation; if size S (matching baseline), cross-confirmation has a size component.
- ⚠️ Flow rate revised from "Very fast" → "Medium (Negotiator-compressed)" per measurement. Like FLAT 2 papers, this paper's flowRate is context-dependent — would likely measure much faster free-seating.

### HYBRID FAST

- SKU: `HYB-FAST`
- Link: <https://sibarist.coffee/en-es/products/hybrid>
- Paper shape: Hybrid
- Size standard: Multi
- Fits brewers: Orea, hybrid systems
- Seal/fit: Tight
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Hybrid system

### Orea B3

- SKU: `OREA-B3`
- Link: <https://sibarist.coffee/en-es/products/orea>
- Paper shape: Flat
- Size standard: Kalita-185
- Fits brewers: Orea V3, V4
- Seal/fit: Tight (low bypass)
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Stability flat (controlled)

### Orea FAST

- SKU: `OREA-FAST`
- Link: <https://sibarist.coffee/en-es/products/orea>
- Paper shape: Flat
- Size standard: Kalita-185
- Fits brewers: Orea V3, V4
- Seal/fit: Tight (low bypass)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Stability flat

### Orea O1 B3

- SKU: `O1-B3`
- Link: <https://sibarist.coffee/en-es/products/orea-o1>
- Paper shape: Flat
- Size standard: Kalita-155
- Fits brewers: Orea V1, small brewers
- Seal/fit: Tight (low bypass)
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Stability flat (controlled)

### Orea O1 FAST

- SKU: `O1-FAST`
- Link: <https://sibarist.coffee/en-es/products/orea-o1>
- Paper shape: Flat
- Size standard: Kalita-155
- Fits brewers: Orea V1, small brewers
- Seal/fit: Tight (low bypass)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Stability flat

### Orea Z1 B3

- SKU: `Z1-B3`
- Link: <https://sibarist.coffee/en-es/products/orea-z1>
- Paper shape: Round
- Size standard: 70mm
- Fits brewers: Orea Z1 (zero-bypass)
- Seal/fit: Perfect seal (zero bypass)
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Zero-bypass push (controlled)

### Orea Z1 FAST

- SKU: `Z1-FAST`
- Link: <https://sibarist.coffee/en-es/products/orea-z1>
- Paper shape: Round
- Size standard: 70mm
- Fits brewers: Orea Z1 (zero-bypass)
- Seal/fit: Perfect seal (zero bypass)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Zero-bypass push

### Origami B3

- SKU: `ORIGAMI-B3`
- Link: <https://sibarist.coffee/en-es/products/origami>
- Paper shape: Hybrid
- Size standard: V60-02 / Wave 155
- Fits brewers: Origami (cone + wave)
- Seal/fit: Adaptive (tightens seal)
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Hybrid (controlled)

### Origami FAST

- SKU: `ORIGAMI-FAST`
- Link: <https://sibarist.coffee/en-es/products/origami>
- Paper shape: Hybrid
- Size standard: V60-02 / Wave 155
- Fits brewers: Origami (cone + wave)
- Seal/fit: Adaptive (tightens seal)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Hybrid (clarity + flat)

### Sibarist HALO CONE B3 — Owned

- SKU: `HALO-B3`
- Link: <https://sibarist.coffee/en-es/products/cone-bs>
- Paper shape: Conical (system-specific)
- Size standard: BS cone
- Fits brewers: Sibarist Brewing System (cone module)
- Seal/fit: Perfect seal (system-integrated)
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Clarity cone (controlled system)
- Location: Home
- Primary use case: System-level structured clarity (max repeatability cone system)
- Measured drawdown (Research Project #3b): **134s** at 15g / EG-1 6.5 / Sibarist Brewing System (2026-05-25). **Baseline / anchor** — 3-replicate median, **4s range across pulls — tightest of any project in the entire 3-project arc** (vs Project #1's 8s, Project #2's 6s, Project #3a's 36s bimodal).
- Bed behavior under load: `stable` (first 'stable' entry in the arc; validates the enum value's design intent)
- 🆕 **Sibarist Brewing System architecture (Lesson #35):** system-integrated paper-as-dripper; no Negotiator needed, no brewer walls to seal against. Distinct architectural class from V60/cone, Orea/flat, Funnex/deep-cone.
- 🆕 **Lesson #36 (REFINED by RP4):** no-bed paper-only test (post-Pull-B5 Part Ba/Bb decomposition) in #3b showed NO self-choke whatsoever. **RP4-N4 refines:** Lesson #36 is FAMILY-CONDITIONAL, not universal. Hario + Sibarist families validate (paper-brewer-interaction dominant); CAFEC family contradicts (paper-fiber signal dominant). See ADR-0016.
- 🆕 **First-use brewer signal (Lesson #38):** clean baseline on Chris's never-opened-box brewer. Well-engineered brewers reproduce on first use.
- ⚠️ **Measured drawdown (Research Project #4 BS, 2026-05-26):** 91s baseline (median 90/91/94, range 4s — matches #3b noise floor precedent exactly). **43s ABSOLUTE GAP from #3b's 134s** with identical setup (15g/250g, EG-1 6.5, Sudan Rume Natural blend continuity, BS). **RP4 AI-1 UNRESOLVED** — candidate causes: paper batch drift / coffee blend-mix proportion / ambient state / operator technique drift between sessions. Both measurements internally consistent within session noise floors (4s + 4s); cross-session absolute reproducibility appears non-trivial. **#3b's 134s retained as primary `measuredDrawdownSec`** (P3 archive); RP4's 91s recorded as separate measurement context. Relative classifications within each session remain internally valid.

### Sibarist HALO CONE FAST — Owned

- SKU: `HALO-FAST`
- Link: <https://sibarist.coffee/en-es/products/cone-bs>
- Paper shape: Conical (system-specific)
- Size standard: BS cone
- Fits brewers: Sibarist Brewing System (cone module)
- Seal/fit: Perfect seal (system-integrated)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Clarity cone (system-level)
- Location: Home
- Primary use case: System-level peak clarity (eliminate fit + bypass variability)
- Measured drawdown (Research Project #3b): **108s** at 15g / EG-1 6.5 / Sibarist Brewing System (HALO-B3 baseline 134s) (2026-05-25). **REAL faster (-26s vs HALO-B3 baseline, clears 4s noise floor)**. Moderately faster band (Step 3 grind comp: **0.3 finer**, EG-1 6.5 → ~6.2).
- Bed behavior under load: `stable`
- 🆕 **Cleanest single-paper classification of the entire 3-project arc** — small-N cohort (2 papers) with tight noise floor (4s) produces unambiguous classification.
- 🆕 **Within-fiber-family consistency:** Same FAST fiber family as Project #1 CONE FAST + Project #2 FLAT 2 FAST. Within-fiber-family consistency holds when paper-brewer-fit is eliminated by BS architecture (Lesson #35).
- ⚠️ **Research Project #4 (2026-05-26): NOT RE-MEASURED** — RP4 focused on V60-cohort papers, not HALO family re-test. HALO-B3 baseline DRIFT in RP4 (91s vs P3 134s, RP4 AI-1) raises question whether HALO-FAST's P3 absolute (108s) would replicate; relative Δ vs baseline within P3's session is internally consistent (108-134 = -26 REAL faster classification holds within P3 context).

### UFO B3

- SKU: `UFO-B3`
- Link: <https://sibarist.coffee/en-es/products/ufo>
- Paper shape: Conical
- Size standard: Custom 80°
- Fits brewers: UFO dripper
- Seal/fit: Perfect fit (custom)
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Clarity cone (controlled)

### UFO FAST — Owned

- SKU: `UFO-FAST`
- Link: <https://sibarist.coffee/en-es/products/ufo>
- Paper shape: Conical
- Size standard: Custom 80°
- Fits brewers: UFO dripper
- Seal/fit: Perfect fit (custom)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Clarity cone
- Location: Home
- Primary use case: Extreme clarity expression (max bypass cone behavior)

### WAVE B3 — Owned

- SKU: `WAVE-B3`
- Link: <https://sibarist.coffee/en-es/products/wave>
- Paper shape: Wave
- Size standard: Kalita-155/185
- Fits brewers: Orea, Kalita, Stagg
- Seal/fit: Tight (structured fit)
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Stability flat (controlled)
- Location: Home
- Primary use case: Controlled flat extraction; functionally a flat-bottom paper in Orea (cupcake walls free-seat without Negotiator)
- Measured drawdown (Research Project #2): **48.5s** at 15g / EG-1 6.5 / Orea Type-A Glass V60-01 (NO Negotiator — free-seating cupcake walls; zero bypass observed) (2026-05-24). REAL faster than FLAT 2 B3 baseline (-79s; 0.5 notch finer grind compensation recommended). Same drawdown cluster as xBloom Premium (48.5s vs xBloom's 50s) — geometry dominates fiber.
- Bed behavior under load: `late-forming-crater`
- ⚠️ Flow rate is context-dependent: ~48s free-seating in Orea vs ~120-130s if Negotiator-compressed (inferred from FLAT 2 B3 baseline). Single `flowRate: "Medium"` label understates massively.
- ⚠️ `paperShape: "Wave"` is misleading — functionally a flat-bottom paper with cupcake-walled geometry. Wave naming describes paper wall structure (fluted) but the bottom is FLAT. Queued as Project #2 audit item #2 (paperShape vs wallStructure decomposition).

### WAVE FAST

- SKU: `WAVE-FAST`
- Link: <https://sibarist.coffee/en-es/products/wave>
- Paper shape: Wave
- Size standard: Kalita-155/185
- Fits brewers: Orea, Kalita, Stagg
- Seal/fit: Tight (structured fit)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Stability flat

### Weber Bird B3

- SKU: `BIRD-B3`
- Link: <https://sibarist.coffee/en-es/products/weber-workshops-bird>
- Paper shape: Round
- Size standard: Custom
- Fits brewers: Weber Bird (vacuum)
- Seal/fit: Perfect seal (zero bypass)
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Zero-bypass push (controlled)

### Weber Bird FAST

- SKU: `BIRD-FAST`
- Link: <https://sibarist.coffee/en-es/products/weber-workshops-bird>
- Paper shape: Round
- Size standard: Custom
- Fits brewers: Weber Bird (vacuum)
- Seal/fit: Perfect seal (zero bypass)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Zero-bypass push

## Weber Workshops

### Weber Bird Paper Filters — Owned

- SKU: `BIRD-FILTER`
- Link: <https://weberworkshops.com/products/bird-paper-filters>
- Paper shape: Round (system-specific)
- Size standard: Bird standard
- Fits brewers: Weber Workshops Bird
- Seal/fit: Perfect seal (zero-bypass)
- Material: Refined pulp
- Thickness: Medium
- Flow rate: Medium-fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / High / Structured-clean
- Best archetype: Zero-bypass push
- Location: Home
- Primary use case: Maximum extraction without bypass (pressure-driven saturation extraction)

## xBloom

### xBloom Premium Paper Filters — Owned

- SKU: `XBLOOM-STD`
- Link: <https://xbloom.com/products/xbloom-premium-paper-filters>
- Paper shape: Flat
- Size standard: Kalita-155/185
- Fits brewers: xBloom, Kalita, Orea
- Seal/fit: Standard
- Material: Refined pulp
- Thickness: Thin
- Flow rate: Fast
- Flow consistency: Very stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Stability flat
- Location: Home, Office
- Primary use case: Automated stability baseline (fast, consistent flat extraction)
- Measured drawdown (Research Project #2): **50s** at 15g / EG-1 6.5 / Orea Type-A Glass V60-01 (NO Negotiator — cupcake walls free-seat cleanly; zero bypass observed) (2026-05-24). REAL faster than FLAT 2 B3 baseline (-77.5s; 0.5 notch finer grind compensation recommended). Same drawdown cluster as WAVE B3 — geometry dominates fiber.
- Bed behavior under load: `late-forming-crater (scaled-down due to fast drawdown)`
- Note: tested in Orea v4 (per Project #2 protocol), not in xBloom's native semi-automated brewer. xBloom's automation may produce different drawdown when used as designed.

## Aliases

Drift variants observed in legacy DB rows. Note: ambiguous Sibarist drift (e.g. `Sibarist FAST Cone` paired with UFO brewer = `UFO FAST`, paired with Hario V60 = `CONE FAST`) is handled per-row in migration 032 with (brewer, filter) WHERE clauses; only unambiguous variants live in the runtime alias map.

- `Espro Bloom` → **xBloom Premium Paper Filters**
- `Espro Bloom (flat bottom)` → **xBloom Premium Paper Filters**
- `Espro Bloom Flat` → **xBloom Premium Paper Filters**
- `Espro Bloom - flat bottom` → **xBloom Premium Paper Filters**
- `Espro Bloom flat-bottom filter` → **xBloom Premium Paper Filters**
- `Espro Bloom (rinsed)` → **xBloom Premium Paper Filters**
- `Sibarist UFO Fast Cone` → **UFO FAST**
- `Filter: Sibarist UFO Fast Cone` → **UFO FAST**
- `Sibarist B3 cone` → **CONE B3**
- `Sibarist B3 flat, Size S` → **FLAT B3**
- `Sibarist B3 Wave (size S)` → **WAVE B3**
- `April brewer filter paper` → **April Paper Filter**
- `April Brewer Paper` → **April Paper Filter**
- `April Flat Bottom Paper` → **April Paper Filter**
- `April paper filter` → **April Paper Filter**
- `April x Sibarist Filter` → **April FAST**
- `April x Sibarist` → **April FAST**
- `April Fast Filter` → **April FAST**
- `April Fast Filters` → **April FAST**
- `Hario V60 paper` → **Hario V60 Paper Filter 01 (Tabbed)**
- `Hario V60 Paper` → **Hario V60 Paper Filter 01 (Tabbed)**
- `Hario V60 white paper` → **Hario V60 Paper Filter 01 (Tabbed)**
- `CAFEC Abaca Plus` → **CAFEC Abaca+ Cup 1 Cone Paper Filter**
- `Standard flat filter (no puck screen)` → **xBloom Premium Paper Filters**
- `Sibarist FAST Flat` → **FLAT FAST**
- `Sibarist FAST flat` → **FLAT FAST**
- `Sibarist FAST - flat bottom` → **FLAT FAST**
- `Sibarist FAST - flat, size S` → **FLAT FAST**
- `Sibarist FAST Flat - Size S` → **FLAT FAST**
- `Sibarist FAST - Flat (Size S)` → **FLAT FAST**
- `Sibarist FAST - Flat S` → **FLAT FAST**
- `Sibarist FAST Flat 2 - Size S` → **FLAT FAST**
- `Sibarist FAST - Flat 2, Size S` → **FLAT FAST**
- `Sibarist FAST - Flat, Size M` → **FLAT FAST**
- `Sibarist FAST (flat bottom, imperfect fit)` → **FLAT FAST**
- `Sibarist FAST (flat bottom)` → **FLAT FAST**
- `Sibarist FAST` → **FLAT FAST**
- `Sibarist FAST Cone` → **CONE FAST**

## Sources

- Chris's authored CSV: `Registry - Taxonomy - Drippers and filter papers - Papers.csv` (69 rows pre-dedupe, 80% comprehensive per Chris's framing).
- 'Espro Bloom' in legacy DB strings was a misnaming of xBloom Premium Paper Filters; aliased on canonicalize.

## Changelog

- 2026-04-26 — initial registry built from authored CSV (Sprint 1f).
  - Same-name dedupes (5): CAFEC Abaca Cup 1 Cone Paper Filter, CAFEC Cup 4 Dark Roast Paper Filter, CAFEC Cup 4 Medium Roast Paper Filter, CAFEC Traditional Cup 1 Filter.
- 2026-04-27 — Cafec packaging-name update (migration 034). Five owned papers gain the T-XX codes printed on their packaging: T-92 (light, LC4 + LC1 slow), T-90 (medium, MC1), T-83 (dark, DC1), plus the "+" on Abaca+ (APC1). Re-introduces the owned APC1 entry that was deduped in 1f when it shared a canonical name with the not-owned AC1; renaming to "Abaca+" lets both coexist as distinct canonicals. 1 DB row affected (the APC1 brew aliased through "CAFEC Abaca Plus" in 1f migration 032).
