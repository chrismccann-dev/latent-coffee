# Filter Paper Taxonomy

Authoritative authored content for the filter paper canonical registry.
Mirror file: [lib/filter-registry.ts](../../../../lib/filter-registry.ts).

Total canonical filters: **66** (22 owned, post Research Project #2 inventory cross-check 2026-05-24 — net +2 from 2 net-new FLAT 2 entries + 1 FLAT B3 ownership flip).
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

**9 substrate-practice gap audit items queued** in the protocol doc — flowRate-as-context-dependent-triple, paperShape-vs-wallStructure decomposition, Booster-as-registry-concept, Orea variant canonicalization, alias-collapse historical audit, grind-comp table band revision, fiber-vs-size confound resolution. None blocking; surface when triggered.

---

## April

### April Paper Filter — Owned

*Project #2 measurement deferred (2026-05-24): oversized for Orea v4 (would have required forced compression), AND no peer April-fit paper in the Project #2 scope to compare against (cohort-of-one problem). Re-measurement candidate when (a) second April-fit paper enters inventory, OR (b) Project #3 native-brewer protocol covers it via the April brewer with peer papers. See [docs/research-projects/flat-bottom-filter-drawdown.md](../../../research-projects/flat-bottom-filter-drawdown.md) Notes section.*

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

### April x Sibarist Filter

- SKU: `APRIL-FAST`
- Link: <https://www.aprilcoffeeroasters.com/collections/april-brewing-accessories/products/april-x-sibarist>
- Paper shape: Flat
- Size standard: Kalita-155
- Fits brewers: April, Orea
- Seal/fit: Tight (low bypass)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Stability flat

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

### CAFEC T-83 - Cup 1 Dark Roast Paper Filter — Owned

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
- Location: Home
- Primary use case: Extraction push via resistance (increase contact time without grind change)

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

### CAFEC T-90 - Cup 1 Medium Roast Paper Filter — Owned

- SKU: `MC1-100W`
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-cup-1-pour-over-coffee-paper-filter-by-roasting-type-flow-rate-differences-for-specialty-coffee-medium-roast-faster-flow-rate-1-cup-size-v60-01>
- Paper shape: Conical
- Size standard: V60-01
- Fits brewers: V60, Origami, Cafec
- Seal/fit: Standard
- Material: Wood pulp
- Thickness: Medium
- Flow rate: Medium-fast
- Flow consistency: Stable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Stability flat (cone variant)
- Location: Home
- Primary use case: Balanced cone extraction (softens acidity, rounds profile)

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
- Fits brewers: April brewer
- Seal/fit: Tight (low bypass)
- Material: Specialty fiber (B3)
- Thickness: Medium
- Flow rate: Medium
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Stability flat (controlled)

### April FAST

- SKU: `APRIL-FAST`
- Link: <https://sibarist.coffee/en-es/products/april>
- Paper shape: Flat
- Size standard: Kalita-155
- Fits brewers: April brewer
- Seal/fit: Tight (low bypass)
- Material: Specialty fiber (FAST)
- Thickness: Ultra-thin
- Flow rate: Very fast
- Flow consistency: Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Stability flat

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
