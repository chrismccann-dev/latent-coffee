# Filter Paper Archive — Not-Owned Candidates

Preserves the **not-owned** filter-paper entries that used to live inline in
[docs/skills/brewing-equipment-expert/cluster/filters.md](../skills/brewing-equipment-expert/cluster/filters.md).
Split out 2026-06-03 (pruning case 004) so the live equipment registry loads
only what Chris actually owns.

**Do NOT load this file for live brewing filter selection.** The brewing expert
selects from the owned registry in `filters.md`. Use this archive only when the
operator explicitly asks about a not-owned paper, or buys one and wants it
promoted.

`lib/filter-registry.ts` remains the full canonical validator for **all** 58
filter papers (owned + not-owned), so every value below still resolves for
`brews.filter`. This archive is the *prose* home for the not-owned rows — the
doc↔registry mirror is preserved across the two doc files.

**Changelog**

- **2026-06-04 (filter reconciliation, case-004 follow-up):** registry collapsed
  67→58 canonical filters (35 not-owned remain here). Removed from this archive:
  the 3 pure duplicate-SKU rows (`AC4-100W` variant, `AB-101-100W` variant,
  `AB-102-100W` Alt SKU → aliased to their survivors); the `AC4-40B` brown 40-pack
  (pack-size collapse → brown 100); and the 5 CAFEC Cup-1 rows (Abaca / Abaca+ /
  T-83 / T-90 / T-92) — Chris brews single cups only, so Cup-1 vs Cup-4 is paper
  SIZE he treats as functionally identical; each collapsed into its Cup-4 twin
  (T-codes preserved across twins). The Abaca+ Cup-1 (`APC1-100W`) collapsed into
  the owned **Abaca+ Cup 4** paper, which was simultaneously renamed from the
  mislabeled "CAFEC Abaca Cup 4 ... (40 pack)" / `APC4-40W` to
  `CAFEC Abaca+ Cup 4 Cone Paper Filter` / `APC4-100W` (its true SKU + line). The
  2 legacy "Abaca+ Cup 1" brews were really that Abaca+ Cup-4 paper — remapped via
  migration 077. `CAFEC Traditional Cup 1 Filter` (CC1) stays distinct (no Cup-4
  twin).

**Promotion procedure** (a not-owned paper enters inventory): set `owned: true`
on its `lib/filter-registry.ts` row, move the entry from here into `filters.md`
under its fit-geometry group (V60 cone / Flat-bottom + wave / Specialty), add a
measured-drawdown line if measured, and remove it from this archive. Aliases in
`filters.md` need no change (they already point at the canonical name).

---

## Cafec

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
- *Ownership corrected 2026-05-24 (Research Project #2 inventory cross-check): Chris owns the FLAT 2 B3 successor (pre-folded v2), not this hand-fold v1 variant.*

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
