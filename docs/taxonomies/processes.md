# Processes

**Enforcement bar:** Strict (enforcement lands sprint 1e.3)
**Canonical registry:** [lib/process-registry.ts](../../lib/process-registry.ts) (authoritative for validation)
**Last adopted:** 2026-04-23
**Adoption path:** Phylum A2 (authored new ruleset). Chris authored canonical list 2026-04-22, revised 2026-04-23, drawing on Roberta Sami's process taxonomy, Robert (Moonwake) producer research, and the 55-brew corpus. First A2 port after Variety + Region A1 ports.

Canonical process reference for the latent-coffee app. Unlike Variety (63 flat strings) and Region (121 flat strings), Process is **composable**: every brew carries a `base_process` (1 of 4) + optional `subprocess` (Honey color tiers only) + up to 4 stackable modifier axes (fermentation / drying / intervention / experimental) + optional `decaf_modifier` + optional `signature_method` (proper-name proprietary technique). This maps real-world variants onto a tight, composable vocabulary instead of a combinatorial flat list.

Worked examples:
- "Anaerobic Washed" = `base:Washed + fermentation:[Anaerobic]`
- "Yeast Anaerobic Natural" = `base:Natural + fermentation:[Anaerobic, Yeast Inoculated]`
- "Tamarind + Red Fruit Co-ferment Washed" = `base:Washed + fermentation:[Yeast Inoculated] + intervention:[Fruit Co-ferment]`
- "Moonshadow" = `base:Natural + drying:[Dark Room Dried, Slow Dry] + signature:Moonshadow`

Additions require a 3-step edit: this doc, `lib/process-registry.ts`, and a DB migration if the addition requires re-decomposing existing brews. Reference content depth is deliberately light in this sprint (1e.1 structural port only); a later content-backfill sub-sprint (mirroring 1a.2 / 1d.2) will expand per-entity extraction framing, pitfalls, and when-delivers-vs-off notes.

---

## Canonical list

Matches the exported constants in [lib/process-registry.ts](../../lib/process-registry.ts) exactly.

### Base processes (4)

Every brew has exactly one.

- **Washed** - wet/fully washed traditions; mucilage removed before drying
- **Honey** - pulp retained; residual mucilage sugars characterize the cup
- **Natural** - whole cherry dried; seed absorbs fruit sugars during drying
- **Wet-hulled** - giling basah; Indonesian specialty, parchment pulled while partially dry

### Subprocesses (Honey color tiers only, 7)

Kept only for truly distinct within-base variants. All other legacy "subprocesses" (Traditional / Fully / Double / Dark Room Dried Natural / etc.) decompose to base + modifiers.

- **White Honey** - very light mucilage retention, shortest drying window
- **Yellow Honey** - light-to-moderate mucilage retention
- **Red Honey** - moderate-to-heavy mucilage retention
- **Black Honey** - heaviest mucilage retention, longest drying window
- **Purple Honey** - purple-pulp cherry variants
- **Generic Honey** - pulp retention without a specified color tier
- **Hydro Honey** - hydrolytic honey variant

### Fermentation modifiers (13)

Multi-value. Stacks on any base.

- **Anaerobic** - sealed/oxygen-free tank fermentation
- **Double Anaerobic** - two sequential anaerobic stages
- **Triple Anaerobic** - three sequential anaerobic stages
- **Aerobic** - oxidative fermentation (oxygen-exposed)
- **Carbonic Maceration** - CO2-saturated whole-cherry fermentation
- **Nitrogen Maceration** - N2-flushed tank fermentation
- **Cold Fermentation** - low-temperature extended fermentation
- **Cryomaceration** - near-freezing pre-ferment hold
- **Thermal Shock** - hot/cold alternation during fermentation
- **Yeast Inoculated** - cultured/selected yeast introduced
- **Lactic Fermentation** - lactic-acid-bacteria dominant ferment
- **Acetic Fermentation** - acetic-acid-bacteria dominant ferment
- **Mossto** - coffee cherry juice reintroduced during ferment

### Drying modifiers (5)

Multi-value. Stacks on any base.

- **Dark Room Dried** - shade-dried under controlled ventilation (DRD / LDE)
- **Slow Dry** - extended drying at low ambient temperature
- **Anaerobic Slow Dry** - ASD; decomposes to `fermentation:[Anaerobic] + drying:[Slow Dry]` in canonical form but preserved here as a recognized composite term
- **Raised Bed** - African-bed drying
- **Patio Dried** - concrete/tile patio drying

### Intervention modifiers (7)

Multi-value. Stacks on any base. Covers co-ferments and infusions.

- **Co-ferment** - generic co-ferment (when the specific category isn't known)
- **Fruit Co-ferment** - fruit pulp/juice added to fermentation
- **Floral Co-ferment** - floral botanicals added (rose, sakura, jasmine)
- **Spice Co-ferment** - spice botanicals added (cardamom, cinnamon, clove)
- **Cascara Co-ferment** - cascara added during fermentation
- **Cascara Infusion** - cascara added post-drying (not during fermentation)
- **Infusion** - generic post-ferment flavor infusion

### Experimental modifiers (4)

Multi-value. Reserved for less-common biological/aging interventions.

- **Koji** - koji mold fermentation
- **SCOBY** - kombucha-style symbiotic culture
- **Enzyme-Assisted** - exogenous enzyme treatment
- **Barrel-Aged** - post-drying barrel rest (whiskey, rum, wine)

### Decaf modifiers (4)

Single-value. Orthogonal to wet-process base — decaf coffee still has an underlying base (usually Washed or Natural).

- **Swiss Water** - SWP; solvent-free water process
- **Mountain Water** - MWP; water-process variant
- **Ethyl Acetate** - EA / sugarcane decaf
- **CO2 Process** - supercritical-CO2 decaffeination

### Signature methods (3)

Single-value. Proper-name proprietary techniques. Each has a canonical decomposition; the signature captures the producer brand that the decomposition alone would lose.

- **Moonshadow** - Alo Coffee, Ethiopia. Decomposition: `base:Natural + drying:[Dark Room Dried, Slow Dry]`. Shade-dried to 20% moisture, then extended LDE drying to 11% moisture over ~57 days.
- **TyOxidator** - Pepe Jijon at Finca Soledad, Ecuador. Decomposition: `base:Washed + fermentation:[Aerobic]`. Aerobic oxidative fermentation protocol designed for Typica Mejorado.
- **Hybrid Washed** - Café Granja La Esperanza (CGLE), Colombia. Decomposition: `base:Washed + fermentation:[Anaerobic, Aerobic]`. Whole-cherry aerobic → sealed anaerobic → depulp → mucilage aerobic finish. Often described as "premium anaerobic washed."

---

## Aliases

Structural mappings to canonical names. Additions are as deliberate as adding a canonical. Aliases do NOT make `isCanonical` return true — `findClosest` surfaces the suggestion so the sync or picker can canonicalize on write.

### Base process aliases
- `Fully Washed`, `Traditional Washed`, `Wet Processed`, `Lavado`, `Lavado Tradicional`, `Classic Washed` → **Washed**
- `Pulped Natural`, `Miel`, `Honey Process`, `Miel Process` → **Honey**
- `Semi-washed` → **Honey** (LATAM context; flag if used elsewhere)
- `Traditional Natural`, `Dry Processed`, `Sun Dried`, `Unwashed`, `Seco` → **Natural**
- `Supernatural` → **Natural** (Robert's research: diluted to "good natural" in practice; no consistent distinct operation)
- `Wet Hulled`, `Wet-hulling`, `Giling Basah` → **Wet-hulled**

### Honey subprocess aliases
- `Blanco` → **White Honey**
- `Amarillo` → **Yellow Honey**
- `Rojo` → **Red Honey**
- `Negro` → **Black Honey**
- `Purple Mucilage` → **Purple Honey**
- `Twice Washed` → (historical Double Honey; flag case-by-case)

### Fermentation modifier aliases
- `Anoxic`, `No Oxygen`, `Zero O2`, `Oxygen Free`, `Sealed Tank`, `Hermetic Fermentation` → **Anaerobic**
- `Double Fermentation Anaerobic`, `Double Fermentation` → **Double Anaerobic**
- `Oxidator`, `Oxidation Fermentation` → **Aerobic**
- `CM`, `Carbonic`, `CO2 Maceration` → **Carbonic Maceration**
- `Nitrogen Flushed`, `N2 Maceration` → **Nitrogen Maceration**
- `Cold Ferment` → **Cold Fermentation**
- `Cryo` → **Cryomaceration**
- `Thermalshock`, `Hot Cold Shock`, `Hot-Cold Fermentation` → **Thermal Shock**
- `Inoculated Yeast`, `Cultured Yeast`, `Selected Yeast`, `Yeast Fermentation` → **Yeast Inoculated**
- `Lactic` → **Lactic Fermentation**
- `Acetic` → **Acetic Fermentation**
- `Mosto`, `Coffee Mosto` → **Mossto**

### Drying modifier aliases
- `DRD`, `Dark Room`, `Shade Dried`, `LDE` → **Dark Room Dried**
- `Slow Dried` → **Slow Dry**
- `ASD` → **Anaerobic Slow Dry**
- `African Bed` → **Raised Bed**

### Intervention modifier aliases
- `Coferment`, `Co Fermented` → **Co-ferment**
- `Fruit Fermented`, `Fruit Coferment` → **Fruit Co-ferment**
- `Cascara Fermented` → **Cascara Co-ferment**
- `Cascara Infused` → **Cascara Infusion**
- `Infused`, `Flavor Infused` → **Infusion**
- `Spice Fermented` → **Spice Co-ferment**

### Experimental modifier aliases
- `Koji Fermentation` → **Koji**
- `Kombucha Fermentation` → **SCOBY**
- `Enzyme Processed`, `Enzymatic` → **Enzyme-Assisted**
- `Barrel Aged`, `Barrel Fermented`, `Whiskey Barrel`, `Rum Barrel`, `Wine Barrel` → **Barrel-Aged**

### Decaf modifier aliases
- `SWP` → **Swiss Water**
- `MWP` → **Mountain Water**
- `EA`, `Sugarcane Decaf`, `Sugarcane EA` → **Ethyl Acetate**
- `CO2 Decaf`, `Carbon Dioxide Decaf` → **CO2 Process**

### Signature-method aliases (proper-name drift)
- `Moonshadow Natural` → **Moonshadow** (signature)
- `Moonshadow Washed` → **Moonshadow** (DB mis-label correction: Alo only produces a Natural variant; see decomposition table below)
- `Tropical Washed` → *not a signature;* decomposes to `base:Washed + fermentation:[Yeast Inoculated] + intervention:[Fruit Co-ferment]` (Monteblanco, Colombia — co-ferment masquerading as a washed per Robert's notes)
- `Gold Washed` → *not a signature;* decomposes to `base:Washed + fermentation:[Mossto]` (Campo Hermoso, Colombia — named for the yellow-ish color from mossto + lactic ferment)

---

## Decomposition of current DB values (for sprint 1e.2)

The 20 distinct `brews.process` values across the 55-brew corpus, mapped to structured fields. Chris fills the 4 bolded cells in sprint 1e.2.

| DB string | count | base | subprocess | fermentation | drying | intervention | signature |
|---|---|---|---|---|---|---|---|
| Washed | 20 | Washed | - | - | - | - | - |
| Natural | 12 | Natural | - | - | - | - | - |
| Anaerobic Washed | 3 | Washed | - | [Anaerobic] | - | - | - |
| White Honey | 2 | Honey | White Honey | - | - | - | - |
| Anaerobic Honey | 2 | Honey | **? (Chris to resolve in 1e.2)** | [Anaerobic] | - | - | - |
| Anaerobic Natural | 2 | Natural | - | [Anaerobic] | - | - | - |
| Cold Fermented Washed | 1 | Washed | - | [Cold Fermentation] | - | - | - |
| Moonshadow Washed | 1 | **Natural (DB mis-label; Alo only produces Moonshadow Natural — Chris to confirm brew row)** | - | - | [Dark Room Dried, Slow Dry] | - | Moonshadow |
| Anoxic Natural | 1 | Natural | - | [Anaerobic] | - | - | - |
| Double Anaerobic Thermal Shock | 1 | **? (Chris to resolve in 1e.2)** | - | [Double Anaerobic, Thermal Shock] | - | - | - |
| Tamarind + Red Fruit Co-ferment Washed | 1 | Washed | - | [Yeast Inoculated] | - | [Fruit Co-ferment] | - |
| Yeast Inoculated Natural | 1 | Natural | - | [Yeast Inoculated] | - | - | - |
| Yeast Anaerobic Natural | 1 | Natural | - | [Anaerobic, Yeast Inoculated] | - | - | - |
| Dark Room Dry Natural | 1 | Natural | - | - | [Dark Room Dried] | - | - |
| Honey | 1 | Honey | Generic Honey | - | - | - | - |
| Double Fermentation Thermal Shock | 1 | **? (Chris to resolve in 1e.2)** | - | [Double Anaerobic, Thermal Shock] | - | - | - |
| ASD Natural | 1 | Natural | - | [Anaerobic] | [Slow Dry] | - | - |
| Washed Sakura Co-ferment | 1 | Washed | - | - | - | [Floral Co-ferment] | - |
| TyOxidator | 1 | Washed | - | [Aerobic] | - | - | TyOxidator |
| Washed Cascara Infused | 1 | Washed | - | - | - | [Cascara Infusion] | - |

4 interpretive cells to resolve in 1e.2. Tamarind + Red Fruit decomposes to generic `Fruit Co-ferment`; specific ingredient detail (tamarind, red fruit, sakura) is lost at decomposition time but can be preserved as a free-text note in 1e.2 if Chris wants ingredient-level fidelity. Ingredient detail is marketing granularity, not a structural property.

---

## Sources

- Chris's Process Taxonomy Registry CSV (authored 2026-04-22, revised 2026-04-23) - canonical base + subprocess organization
- Chris's Process Aliases CSV (authored 2026-04-22) - alias map across all axes
- Roberta Sami, process taxonomy: https://www.robertasami.com/processes - subprocess organization, industry alias conventions
- Robert (Moonwake Coffee Roasters) - producer-level description snippets for Supernatural, Tropical Washed, Gold Washed, Hybrid Washed (received during sprint 1e.1 research turn)
- Moonwake product page for Alo Moonshadow Natural - https://moonwakecoffeeroasters.com/products/alo-coffee-auction-2025-moon-shadow-natural-3-ethiopia (Moonshadow signature decomposition)
- Google AI Overview + modcup Coffee producer notes - CGLE Hybrid Washed decomposition
- Chris's 55-brew corpus (`brews` table) - drift values informing alias map and legacy decomposition table

Per-entity authored reference content (extraction framing, pitfalls, when-delivers-vs-off) sourced in a follow-on content-backfill sub-sprint.
