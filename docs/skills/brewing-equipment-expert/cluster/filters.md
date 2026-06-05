# Filter Paper Registry — Owned

Agent-facing registry of the filter papers **Chris owns**, what brewers each
fits, and the brewing role each plays. Mirror file:
[lib/filter-registry.ts](lib/filter-registry.ts).

## Purpose

This is what the Brewing Equipment Expert pulls from when the Brewing Assistant
needs a brewer + filter pair for a recipe. It exists to make **owned** equipment
and its real behavior unambiguous. Not-owned candidates live in
[docs/taxonomies/filters-not-owned-archive.md](docs/taxonomies/filters-not-owned-archive.md)
(promotion pool — do not load for live selection). `lib/filter-registry.ts`
stays the full canonical validator for **all** 67 papers (owned + not-owned), so
every `brews.filter` value still resolves; this doc is the prose home for the 23
owned rows.

## Selection rules (for the agent)

1. **Select only from this doc** unless the operator explicitly asks about a
   not-owned paper.
2. **Brewer-fit first, then flow/behavior.** Shape compatibility is the first
   gate — the groups below (V60 cone / Flat-bottom + wave / Specialty + paired)
   map to that gate.
3. **Measured drawdown beats the marketing `flow rate` label** whenever they
   conflict. The flow-rate field is the inherited/marketing label; the measured
   line is observed loaded-bed behavior and is the operative number.
4. **CAFEC Cup 4 papers are physically slower than their labels imply.** CAFEC
   roast labels ("Fast" light / "Slow" dark) describe extraction *intent*, not
   flow physics.
5. **Sibarist FLAT / FLAT 2 / WAVE flow is context-dependent** — much slower
   Negotiator-compressed in Orea than free-seating.

Measured-drawdown provenance + full research is in the
[Research measurement appendix](#research-measurement-appendix) — not inline.

---

## V60 cone filters

### CONE B3 — `CONE-B3`

- Fits: V60 (-02), Origami, Orea Apex
- Shape / size: Conical / V60-02
- Material / thickness: Specialty fiber (B3) / Medium
- Flow rate (label) / consistency: Medium / Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Clarity cone (controlled)
- Use case: Structured clarity (adds body without sacrificing cleanliness)
- Measured drawdown: 60s @ 15g (Research Project #1 baseline/anchor) — the V60 cone reference. Bed: late-forming-crater.
- Link: <https://sibarist.coffee/en-es/products/cone>

### CONE FAST — `CONE-FAST`

- Fits: V60 (-02), Origami, Orea Apex
- Shape / size: Conical / V60-02
- Material / thickness: Specialty fiber (FAST) / Ultra-thin
- Flow rate (label) / consistency: Very fast / Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Clarity cone
- Use case: Maximum clarity ceiling (fastest stable cone extraction); the true fast-rinse paper for a Hybrid open phase
- Measured drawdown: 45s @ 15g (Project #1, -15s vs CONE B3) — fastest stable cone in the cohort; the *only* paper that matched its "Very fast" label (0.3 finer grind comp). Bed: pour-impact-crater.
- Link: <https://sibarist.coffee/en-es/products/cone>

### Hario V60 Meteor Filter 02 — `METEOR-02`

- Fits: V60 (-02), Origami
- Shape / size: Conical / V60-02
- Material / thickness: Refined pulp / Thin
- Flow rate (label) / consistency: Fast / More stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone
- Use case: Improved clarity baseline (faster, more stable than standard Hario)
- Measured drawdown: 65s @ 15g (Project #1, ~CONE B3). NOT a fast-rinse paper despite the "Fast" label — in a Hybrid open-phase rinse it kept pulling roast bitterness; use CONE FAST (45s) for a true rinse. Bed: late-forming-crater.
- Link: <https://www.hario-usa.com/products/v60-meteor-filters-02>

### Hario V60 Paper Filter 01 (Tabbed) — `VCF-01-100W`

- Fits: V60 (-01), Origami
- Shape / size: Conical / V60-01
- Material / thickness: Wood pulp / Medium
- Flow rate (label) / consistency: Medium / Variable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Clarity cone (classic)
- Use case: Baseline cone reference (introduces variability intentionally)
- Measured drawdown: 65s @ 15g (Project #1, ~CONE B3). Bed: pour-impact-crater.
- Link: <https://www.hario-usa.com/products/paper-filter-for-01-drippers>

### CAFEC T-92 - Cup 4 Light Roast Paper Filter — `LC4-100W`

- Fits: V60 (-02), Origami, Cafec
- Shape / size: Conical / V60-02
- Material / thickness: Wood pulp / Thin
- Flow rate (label) / consistency: Fast / Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone
- Use case: Peak clarity (max separation, high-acid coffees)
- Measured drawdown: 80s @ 15g (Project #1, +20s vs CONE B3) — REAL slow despite the "Fast" label (0.3 coarser grind comp); CAFEC label = extraction intent, not flow. Bed: late-forming-crater.
- Link: <https://cafecusa.com/collections/filter-papers/products/cafec-pour-over>

### CAFEC Cup 4 Medium Roast Paper Filter — `MC4-100W`

- Fits: V60 (-02), Origami, Cafec
- Shape / size: Conical / V60-02
- Material / thickness: Wood pulp / Medium
- Flow rate (label) / consistency: Medium-fast / Stable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Stability flat (cone variant)
- Use case: Owned via Cafec Cup 4 4-pack assortment; medium-roast specific
- Measured drawdown: 60s @ 15g (Project #1, =CONE B3) — baseline; mild paper-fiber slowness surfaces in tighter-floor re-tests. Bed: mixed.
- Link: <https://cafecusa.com/collections/filter-papers/products/copy-of-cafec-cup-4-medium-roast-paper-filter-v60-02-mc4-100w-2>

### CAFEC Cup 4 Dark Roast Paper Filter — `DC4-100W`

- Fits: V60 (-02), Origami, Cafec
- Shape / size: Conical / V60-02
- Material / thickness: Wood pulp / Thick
- Flow rate (label) / consistency: Slow / Stable
- Clarity / Body / Sweetness: Low / High / Muted
- Best archetype: Immersion hybrid (cone assist)
- Use case: Owned via Cafec Cup 4 4-pack assortment; dark-roast specific
- Measured drawdown: 68s @ 15g (Project #1, ~CONE B3) — measured near-baseline despite the "Slow" + "Thick" labels; CAFEC label = extraction intent, not flow. Bed: late-forming-crater.
- Link: <https://cafecusa.com/collections/filter-papers/products/copy-of-cafec-cup-4-dark-roast-paper-filter-v60-02-dc4-100w>

### CAFEC Abaca+ Cup 4 Cone Paper Filter — `APC4-100W`

- Fits: V60 (-02), Origami, Cafec
- Shape / size: Conical / V60-02
- Material / thickness: Abaca+ (refined blend) / Thin
- Flow rate (label) / consistency: Fast / Stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Clarity cone
- Use case: Fast clarity baseline — Chris's workhorse Abaca+ cone ("the Abaca+ filter by Cafec"). Owns the 100-sheet standalone (APC4-100W, in use) + the Cup-4 variety-pack copy (APC1-40W); same paper, pack quantity is the only difference. Chris brews single cups only, so Cup-1 vs Cup-4 SIZE is functionally identical to him.
- Measured drawdown: 72s @ 15g (Project #1, +12s vs CONE B3) — REAL slower than its "Fast" label; select by measured drawdown. Bed: late-forming-crater.
- Link: <https://cafecusa.com/collections/filter-papers/products/copy-of-cafec-abaca-cup-4-cone-paper-filter-v60-02-apc4-40w>

## Flat-bottom + wave filters

### FLAT 2 B3 — `FLAT2-B3`

- Fits: Orea / Kalita / April flat brewers (Negotiator-style compression)
- Shape / size: Flat / Kalita-155/185 (Chris owns size S)
- Material / thickness: Specialty fiber (B3) / Medium
- Flow rate (label) / consistency: Medium (Negotiator-compressed) / Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Stability flat (controlled)
- Use case: Chris's active workhorse flat baseline; pre-folded v2
- Measured drawdown: 127.5s @ 15g in Orea + Negotiator (Project #2 baseline/anchor) — zero-bypass design is intentionally slow when compressed. Bed: late-forming-crater.
- Link: <https://sibarist.coffee/en-es/products/flat-2>

### FLAT 2 FAST — `FLAT2-FAST`

- Fits: Orea / Kalita / April flat brewers (Negotiator-style compression)
- Shape / size: Flat / Kalita-155/185 (Chris owns size M)
- Material / thickness: Specialty fiber (FAST) / Ultra-thin
- Flow rate (label) / consistency: Medium (Negotiator-compressed; revised from "Very fast") / Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Stability flat
- Use case: Pre-folded clarity-forward flat; FAST fiber in v2 format
- Measured drawdown: 117s @ 15g in Orea + Negotiator (Project #2, -10.5s vs FLAT 2 B3) — still medium under compression, not truly very-fast in that context. Bed: late-forming-crater.
- Link: <https://sibarist.coffee/en-es/products/flat-2>

### FLAT FAST — `FLAT-FAST`

- Fits: Orea / Kalita / April flat brewers (Negotiator-style compression)
- Shape / size: Flat / Kalita-155/185
- Material / thickness: Specialty fiber (FAST) / Ultra-thin
- Flow rate (label) / consistency: Very fast (context-dependent; ~Medium compressed) / Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Stability flat
- Use case: Hand-folded maximum-clarity flat bed
- Measured drawdown: 117s @ 15g in Orea + Negotiator (Project #2) — behaviorally identical to FLAT 2 FAST factory-fold (hand-fold quality is a non-factor with scoring + Negotiator). Bed: late-forming-crater.
- Link: <https://sibarist.coffee/en-es/products/flat>

### WAVE B3 — `WAVE-B3`

- Fits: Orea / Kalita / Stagg (wave / cupcake-wall flat)
- Shape / size: Wave (functionally flat-bottom) / Kalita-155/185
- Material / thickness: Specialty fiber (B3) / Medium
- Flow rate (label) / consistency: Medium / Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Stability flat (controlled)
- Use case: Controlled flat extraction; cupcake walls free-seat in Orea without a Negotiator
- Measured drawdown: 48.5s @ 15g in Orea, free-seating no Negotiator (Project #2) — context-dependent: ~48s free-seating vs ~120-130s compressed. Same fast cluster as xBloom. Bed: late-forming-crater.
- Link: <https://sibarist.coffee/en-es/products/wave>

### xBloom Premium Paper Filters — `XBLOOM-STD`

- Fits: xBloom; also Orea / Kalita as a fast free-seating flat paper
- Shape / size: Flat / Kalita-155/185
- Material / thickness: Refined pulp / Thin
- Flow rate (label) / consistency: Fast / Very stable
- Clarity / Body / Sweetness: High / Low / Clean
- Best archetype: Stability flat
- Use case: Automated stability baseline (fast, consistent flat extraction). Location: Home, Office
- Measured drawdown: 50s @ 15g in Orea, free-seating (Project #2) — fast free-seating cluster with WAVE B3 (geometry dominates fiber). Bed: late-forming-crater (scaled-down due to fast drawdown).
- Link: <https://xbloom.com/products/xbloom-premium-paper-filters>

## Specialty + paired-brewer filters

*These fit one brewer (or one architectural class) and should not be selected outside it.*

### April Paper Filter — `APRIL-STD`

- Fits: **April brewer only** — the paper's bottom diameter is brewer-specific large, so it does NOT fit Orea or Kalita despite the shared Kalita-155 size standard. (Corrected 2026-06-03; prior `fitsBrewers` listing Orea/Kalita was wrong.)
- Shape / size: Flat / Kalita-155
- Material / thickness: Wood pulp / Medium
- Flow rate (label) / consistency: Medium / Stable
- Clarity / Body / Sweetness: Medium / Medium / Rounded
- Best archetype: Stability flat
- Use case: Balanced flat extraction (moderate flow, neutral profile)
- Link: <https://www.aprilcoffeeroasters.com/collections/april-brewing-accessories/products/april-paper-filter>

### April FAST — `APRIL-FAST`

- Fits: April / April Hybrid Brewer (also Orea per registry; the April×Sibarist FAST collab)
- Shape / size: Flat / Kalita-155
- Material / thickness: Specialty fiber (FAST) / Ultra-thin
- Flow rate (label) / consistency: Very fast / Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Stability flat
- Use case: High-clarity flat extraction (fine grind / high dose, controlled flow)
- Link: <https://sibarist.coffee/en-es/products/april>

### UFO FAST — `UFO-FAST`

- Fits: UFO dripper only (custom 80° geometry)
- Shape / size: Conical / Custom 80°
- Material / thickness: Specialty fiber (FAST) / Ultra-thin
- Flow rate (label) / consistency: Very fast / Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Clarity cone
- Use case: Extreme clarity expression (max bypass cone behavior)
- Link: <https://sibarist.coffee/en-es/products/ufo>

### CAFEC Abaca+ Deep 27 Coffee Filter (white) — `AFD27-100W`

- Fits: Cafec Deep27; Funnex (deep cone)
- Shape / size: Conical (deep) / Deep27
- Material / thickness: Abaca+ (refined blend) / Thin
- Flow rate (label) / consistency: Fast / Very stable
- Clarity / Body / Sweetness: High / Medium / Clean but weighted
- Best archetype: Clarity cone (deep extraction)
- Use case: Deep-extraction clarity (increase contact time via bed depth, not resistance)
- Measured drawdown: 144s @ 10g in Funnex (Project #3a, slow regime). Bed: late-forming-crater.
- Link: <https://cafecusa.com/products/copy-of-cafec-abaca-cup-4-cone-paper-filter-v60-02-ac4-100w-3>

### CONE 28 FAST — `CONE28-FAST`

- Fits: Deep cone brewers (Funnex)
- Shape / size: Conical / Low-angle cone
- Material / thickness: Specialty fiber (FAST) / Ultra-thin
- Flow rate (label) / consistency: Very fast (BIMODAL in Funnex) / Extremely stable within-regime
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Clarity cone
- Use case: Extreme extraction clarity (deep cone + high flow). Treat as a specialty paper, not a generic V60 paper.
- Measured drawdown: Funnex BIMODAL — ~131s slow regime / ~31.5s fast regime @ 10g (Project #3a). Seating-dependent; manual crease is the Negotiator-equivalent (36s dynamic range). Bed: mixed.
- Link: <https://sibarist.coffee/en-es/products/cone-28-30%C2%BA>

### Chemex Bonded Filter (Half Moon White) — `CHEMEX-HM-W`

- Fits: Chemex / Funnex
- Shape / size: Conical (manual fold) / Chemex
- Material / thickness: Bonded pulp / Very thick
- Flow rate (label) / consistency: Slow / Very stable
- Clarity / Body / Sweetness: High / Very high / Heavy
- Best archetype: Clarity cone (low bypass)
- Use case: Immersion-like cone (max body + filtration, suppresses brightness)
- Measured drawdown: 118s @ 10g in Funnex (Project #3a, slow regime) — manual cone-fold = deep/narrow bed; drains much slower than FS-100's fan-fold on the same bonded pulp. Bed: late-forming-crater.
- Link: <https://chemexcoffeemaker.com/products/chemex-bonded-filters-unfolded-half-moon>

### Chemex Bonded Pre-folded Squares (White) — `FS-100`

- Fits: Chemex / Funnex
- Shape / size: Square (factory fan-fold) / Chemex
- Material / thickness: Bonded pulp / Very thick
- Flow rate (label) / consistency: Fast in Funnex / Very stable
- Clarity / Body / Sweetness: High / Medium / Clean
- Best archetype: Clarity cone (fast)
- Use case: Fan-fold flat-bed alternative to the Chemex cone-fold; faster drawdown in deep-cone brewers
- Measured drawdown: 45s @ 10g in Funnex (Project #3a, fast regime) — factory fan-fold = wider/shallower bed; 73s faster than CHEMEX-HM-W on the same fiber (fold geometry sets bed shape). Bed: late-forming-crater.
- Link: <https://chemexcoffeemaker.com/products/chemex-bonded-pre-folded-squares-100ct>

### Sibarist HALO CONE B3 — `HALO-B3`

- Fits: Sibarist Brewing System (cone module) only — paper IS the dripper
- Shape / size: Conical (system-specific) / BS cone
- Material / thickness: Specialty fiber (B3) / Medium
- Flow rate (label) / consistency: Medium / Extremely stable
- Clarity / Body / Sweetness: High / Medium / Structured
- Best archetype: Clarity cone (controlled system)
- Use case: System-level structured clarity (max repeatability); also the paper-only measurement control
- Measured drawdown: 134s @ 15g in Sibarist BS (Project #3b baseline/anchor; tightest noise floor in the arc). Note a 43s cross-session drift in Project #4 (91s, unresolved). Bed: stable.
- Link: <https://sibarist.coffee/en-es/products/cone-bs>

### Sibarist HALO CONE FAST — `HALO-FAST`

- Fits: Sibarist Brewing System (cone module) only
- Shape / size: Conical (system-specific) / BS cone
- Material / thickness: Specialty fiber (FAST) / Ultra-thin
- Flow rate (label) / consistency: Very fast / Extremely stable
- Clarity / Body / Sweetness: Very high / Low / Clean
- Best archetype: Clarity cone (system-level)
- Use case: System-level peak clarity (eliminate fit + bypass variability)
- Measured drawdown: 108s @ 15g in Sibarist BS (Project #3b, -26s vs HALO B3; 0.3 finer comp). Bed: stable.
- Link: <https://sibarist.coffee/en-es/products/cone-bs>

### Weber Bird Paper Filters — `BIRD-FILTER`

- Fits: Weber Workshops Bird only
- Shape / size: Round (system-specific) / Bird standard
- Material / thickness: Refined pulp / Medium
- Flow rate (label) / consistency: Medium-fast / Extremely stable
- Clarity / Body / Sweetness: High / High / Structured-clean
- Best archetype: Zero-bypass push
- Use case: Maximum extraction without bypass (pressure-driven saturation extraction)
- Link: <https://weberworkshops.com/products/bird-paper-filters>

---

## Research measurement appendix

The `Measured drawdown` lines above come from a four-project loaded-bed drawdown
research arc (2026-05-23 → 2026-05-26). **Treat the measured numbers as the
result** — the full protocols, raw data, replicate ranges, and lesson extraction
live in the research-project docs; the agent does not need to read them to select
a filter.

- Research Project #1: [Cone Filter Drawdown Characterization](docs/research-projects/cone-filter-drawdown.md)
- Research Project #2: [Flat-Bottom Filter Drawdown Characterization](docs/research-projects/flat-bottom-filter-drawdown.md)
- Research Project #3: [Specialty Cone Filter Drawdown Characterization](docs/research-projects/specialty-cone-filter-drawdown.md)
- Research Project #4: [Paper-Only V60 Cohort Drawdown Re-Measurement in Sibarist BS](docs/research-projects/paper-only-v60-cohort-drawdown.md)

Registry-level takeaways that change selection (encoded in the rules above):

- **CAFEC Cup 4 family measures slower than its marketing labels** imply — select by measured drawdown, not the "Fast"/"Slow" roast label.
- **Sibarist FLAT / FLAT 2 / WAVE flow depends on seating state** — Negotiator-compressed in Orea is far slower than free-seating.
- **Chemex / Funnex: fold geometry sets effective bed shape** (cone-fold deep/narrow vs fan-fold wide/shallow) more than pulp fiber does.
- **Sibarist BS works as a paper-only measurement control** because the paper acts as the dripper.

## Aliases

Drift variants observed in legacy DB rows. Ambiguous Sibarist drift (e.g.
`Sibarist FAST Cone` paired with UFO brewer = `UFO FAST`, paired with Hario V60 =
`CONE FAST`) is handled per-row in migration 032 with (brewer, filter) WHERE
clauses; only unambiguous variants live in the runtime alias map. Targets are the
canonical names in `lib/filter-registry.ts` (some resolve to not-owned papers in
the [archive](docs/taxonomies/filters-not-owned-archive.md)).

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
- `CAFEC Abaca Plus` → **CAFEC Abaca+ Cup 4 Cone Paper Filter**
- `CAFEC Abaca+ Cup 1 Cone Paper Filter` → **CAFEC Abaca+ Cup 4 Cone Paper Filter** *(Cup-1→Cup-4 collapse 2026-06-04; Chris brews single cups, treats both sizes as the same paper)*
- `CAFEC Abaca+` → **CAFEC Abaca+ Cup 4 Cone Paper Filter**
- `CAFEC Abaca+ filter` → **CAFEC Abaca+ Cup 4 Cone Paper Filter**
- `Abaca+ filter` → **CAFEC Abaca+ Cup 4 Cone Paper Filter**
- `CAFEC Abaca Cup 1 Cone Paper Filter` → **CAFEC Abaca Cup 4 Cone Paper Filter** *(Cup-1→Cup-4 collapse 2026-06-04; not-owned)*
- `CAFEC T-83 - Cup 1 Dark Roast Paper Filter` → **CAFEC Cup 4 Dark Roast Paper Filter** *(=T-83)*
- `CAFEC T-90 - Cup 1 Medium Roast Paper Filter` → **CAFEC Cup 4 Medium Roast Paper Filter** *(=T-90)*
- `CAFEC T-92 - Cup 1 Light Roast Paper Filter (slow)` → **CAFEC T-92 - Cup 4 Light Roast Paper Filter**
- `CAFEC Abaca Cup 4 Cone Paper Filter (variant)` → **CAFEC Abaca Cup 4 Cone Paper Filter** *(dup SKU AC4-100W)*
- `CAFEC Abaca Trapezoid Filter 101 (variant)` → **CAFEC Abaca Trapezoid Filter 101** *(dup SKU AB-101-100W)*
- `CAFEC Abaca Trapezoid Filter 102 (Alt SKU)` → **CAFEC Abaca Trapezoid Filter 102** *(dup SKU AB-102-100W)*
- `CAFEC Abaca Cup 4 Cone Paper Filter (brown 40)` → **CAFEC Abaca Cup 4 Cone Paper Filter (brown 100)** *(pack-size collapse)*
- `Standard flat filter (no puck screen)` → **xBloom Premium Paper Filters**
- `Sibarist FAST Flat` → **FLAT FAST**
- `Sibarist FAST flat` → **FLAT FAST**
- `Sibarist FAST - flat bottom` → **FLAT FAST**
- `Sibarist FAST - flat, size S` → **FLAT FAST**
- `Sibarist FAST Flat - Size S` → **FLAT FAST**
- `Sibarist FAST - Flat (Size S)` → **FLAT FAST**
- `Sibarist FAST - Flat S` → **FLAT FAST**
- `Sibarist FAST Flat 2 - Size S` → **FLAT 2 FAST** *(re-pointed from FLAT FAST in Project #2 — Flat 2 is a distinct product line)*
- `Sibarist FAST - Flat 2, Size S` → **FLAT 2 FAST**
- `Sibarist FAST Flat 2 - Size M` → **FLAT 2 FAST**
- `Sibarist B3 Flat 2 - Size S` → **FLAT 2 B3**
- `Sibarist B3 - Flat 2, Size S` → **FLAT 2 B3**
- `Sibarist B3 Flat 2 - Size M` → **FLAT 2 B3**
- `Sibarist Flat 2 FAST` → **FLAT 2 FAST**
- `Sibarist Flat 2 B3` → **FLAT 2 B3**
- `Sibarist FAST - Flat, Size M` → **FLAT FAST**
- `Sibarist FAST (flat bottom, imperfect fit)` → **FLAT FAST**
- `Sibarist FAST (flat bottom)` → **FLAT FAST**
- `Sibarist FAST` → **FLAT FAST**
- `Sibarist FAST Cone` → **CONE FAST**

## Sources

- Chris's authored CSV: `Registry - Taxonomy - Drippers and filter papers - Papers.csv` (69 rows pre-dedupe, 80% comprehensive per Chris's framing).
- 'Espro Bloom' in legacy DB strings was a misnaming of xBloom Premium Paper Filters; aliased on canonicalize.

## Changelog

- 2026-06-04 — **filter reconciliation** (case-004 follow-up). Registry collapsed 67→58 canonical filters (23 owned unchanged; 35 not-owned). Executed the dedups case 004 flagged: 3 pure duplicate-SKU rows (AC4-100W variant / AB-101-100W variant / AB-102-100W Alt SKU), the AC4-40B brown pack-size variant, and the 5 CAFEC Cup-1 papers (Abaca / Abaca+ / T-83 / T-90 / T-92) collapsed into their Cup-4 twins (Chris brews single cups → Cup-1 vs Cup-4 is paper SIZE he treats as identical; T-codes preserved across twins). The owned Abaca+ Cup-4 paper was renamed from the mislabeled "CAFEC Abaca Cup 4 ... (40 pack)" / APC4-40W → **CAFEC Abaca+ Cup 4 Cone Paper Filter** / APC4-100W (its true SKU + line); the 2 legacy "Abaca+ Cup 1" brews were really this paper (migration 077 remap). All collapsed names aliased to survivors. `CAFEC Traditional Cup 1 Filter` (CC1) kept distinct (no Cup-4 twin). 56 aliases total.
- 2026-06-03 — **pruning case 004** (70.4 KB → owned-only). Added Purpose + agent selection-rules; moved the four `## Measured Drawdown Reference` research blocks + per-entry RP/lesson citation chains out to the [research appendix](#research-measurement-appendix) (full data already in `docs/research-projects/*.md`); pruned the live doc to the **23 owned** papers, grouped by fit geometry (V60 cone / Flat-bottom + wave / Specialty + paired); moved the **44 not-owned** papers to [docs/taxonomies/filters-not-owned-archive.md](docs/taxonomies/filters-not-owned-archive.md); corrected April Paper Filter fit to **April-only**. `lib/filter-registry.ts` unchanged except the April fit fix (still the full 67-entry validator). Pack-size / cup-size / duplicate-SKU registry dedups flagged for a follow-up reconciliation pass (see pruning case 004 handoff).
- 2026-04-27 — Cafec packaging-name update (migration 034). Owned Cup 4 papers gain T-XX codes printed on packaging: T-92 (light, LC4), T-90 (medium, MC4), T-83 (dark, DC4), plus the "+" on Abaca+ (APC4). (The not-owned Cup 1 T-code variants now live in the archive.)
- 2026-04-26 — initial registry built from authored CSV (Sprint 1f). Same-name dedupes (5) recorded at build.
