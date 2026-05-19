# Processes

**Enforcement bar:** Strict (enforcement lands sprint 1e.3)
**Canonical registry:** [lib/process-registry.ts](../../lib/process-registry.ts) (authoritative for validation)
**Last adopted:** 2026-04-23
**Adoption path:** Phylum A2 (authored new ruleset). Chris authored canonical list 2026-04-22, revised 2026-04-23, drawing on Roberta Sami's process taxonomy, Robert (Moonwake) producer research, and the 55-brew corpus. First A2 port after Variety + Region A1 ports.

Canonical process reference for the latent-coffee app. Unlike Variety (63 flat strings) and Region (120 flat strings), Process is **composable**: every brew carries a `base_process` (1 of 4) + optional `subprocess` (Honey color tiers only) + up to 4 stackable modifier axes (fermentation / drying / intervention / experimental) + optional `decaf_modifier` + optional `signature_method` (proper-name proprietary technique). This maps real-world variants onto a tight, composable vocabulary instead of a combinatorial flat list.

**Qualifiers** (optional, free-text-bounded but enumerated): orthogonal annotations on a modifier that preserve a structural distinction without forking a new modifier. Currently defined: `Anoxic` on `Anaerobic` (sealed-container, no-headspace execution). **Aggregation level stays at the modifier, not the qualifier** — `Anoxic Natural` and plain `Anaerobic Natural` both group under the `Anaerobic` modifier-index page; the qualifier is a record-when-known annotation, not a strategy-decision layer. The same logic applies to honey subprocesses: aggregate at the `Honey` base and record the sub-tier (`White Honey` / `Black Honey` / etc.) only when known. Don't read a qualifier alone as dictating brewing strategy — the modifier + base + cultivar + the producer's actual fermentation execution carry the strategy signal; the qualifier just preserves a structural distinction the canonical modifier alone would lose, so it stays available for future cross-cup analysis. (Locked via Round 9 grilling 2026-05-16; prior wording overstated qualifier-as-strategy-driver.) **Storage** — qualifier metadata lives on `brews.fermentation_qualifiers text[]` (Sprint T3 / CR-5 migration 059, shipped 2026-05-18). MCP write surface: `push_brew.fermentation_qualifiers[]` + `patch_brew.fermentation_qualifiers[]`. Validation: strict-canonical against `FERMENTATION_QUALIFIERS` (`['Anoxic']` today) via `FERMENTATION_QUALIFIER_LOOKUP`; aliases `No Oxygen` / `Zero O2` / `Oxygen Free` resolve to `Anoxic` on canonicalize. Display: the legacy `brews.process` display string deliberately excludes the qualifier (record-when-known column-only); the `/brews/[id]` detail page surfaces it inline next to the Process tag.

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

- **Anaerobic** - sealed / oxygen-restricted fermentation. Optional qualifier: `Anoxic` = fully sealed, no-headspace or near-zero-oxygen execution. Canonical modifier remains `[Anaerobic]`; the qualifier is preserved when present as a record-when-known annotation, not a strategy-decision layer (per the Qualifiers note above). Qualifier storage: `brews.fermentation_qualifiers text[]` (Sprint T3 / CR-5, migration 059, 2026-05-18) — strict-canonical via `FERMENTATION_QUALIFIER_LOOKUP`.
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

### Signature methods (15)

Single-value. Proper-name proprietary techniques - branded under a proper-noun name AND mechanically opaque (the producer markets the brand without fully disclosing the underlying recipe). Each has a canonical decomposition; the signature captures the producer brand that the decomposition alone would lose. The picker surfaces the decomposition as a **hint, not auto-fill** - rare variants (Moonshadow Washed at a known Moonshadow Natural producer) are legitimate.

Registry expanded from 3 to 15 entries in Sprint T1 / BR-1 (2026-05-18) to match Chris's working canonical list ([CONTEXT.md § Signature method](../../CONTEXT.md)). Producer + country populated only where attribution is confirmed; the rest land skeleton-pending-verification (synthesis content also deferred per Sub Pages 4's per-signature prompt-variant plan). Non-canonical descriptors in the parenthetical decompositions (Dynamic Cherry as a fermentation token, Biological Fermentation, Thermal Control, Zeolite Drying) are intentionally omitted from the modifier arrays rather than approximated - promotion of any of those terms to a canonical modifier is a separate deliberate edit.

- **Moonshadow** - Alo Coffee, Ethiopia. Decomposition: `base:Natural + drying:[Dark Room Dried, Slow Dry]`. Shade-dried to 20% moisture, then extended LDE drying to 11% moisture over ~57 days. Typically Natural; a rare Washed variant exists (MSW1 Airworks x Shoebox x Alo special lot, 2024 — same drying protocol applied to a washed ferment).
- **TyOxidator** - Pepe Jijon at Finca Soledad, Ecuador. Decomposition: `base:Washed + fermentation:[Aerobic]`. Aerobic oxidative fermentation protocol designed for Typica Mejorado.
- **Alchemy** - producer pending. Decomposition: `base:Washed + fermentation:[Carbonic Maceration, Yeast Inoculated]`.
- **TIM** - producer pending. Decomposition: `base:Washed + fermentation:[Yeast Inoculated, Mossto]`.
- **XO** - Café Granja La Esperanza (CGLE), Colombia. Decomposition: `base:Natural + fermentation:[Anaerobic]` (extended-anaerobic dynamic-cherry stack; CGLE Mandela XO is the reference example).
- **Enzyflow** - producer pending. Decomposition: `base:Washed + fermentation:[Aerobic] + experimental:[Enzyme-Assisted]`.
- **Bio-innovation** - producer pending. Decomposition: `base:Washed + fermentation:[Anaerobic]` (biological-fermentation descriptor in the parenthetical is non-canonical, omitted).
- **Sous-vide** - producer pending. Decomposition: `base:Washed + experimental:[Enzyme-Assisted]` (thermal-control descriptor is non-canonical, omitted).
- **Amazake** - producer pending. Decomposition: `base:Natural + fermentation:[Yeast Inoculated] + experimental:[Koji]`.
- **Anti-maceration** - producer pending. Decomposition: `base:Natural + fermentation:[Anaerobic]` (vacuum / ozone / zeolite-drying descriptors are non-canonical, omitted).
- **Dynamic cherry** - producer pending. Decomposition: `base:Natural + fermentation:[Anaerobic]`.
- **Dry fermentation** - producer pending. Decomposition: `base:Natural + fermentation:[Mossto, Cold Fermentation]`.
- **Splash** - producer pending. Decomposition: `base:Washed + fermentation:[Anaerobic, Lactic Fermentation]`.
- **Symbiotic** - producer pending. Decomposition: `base:Washed + fermentation:[Mossto]` (cross-varietal descriptor is non-canonical, omitted).
- **Wave Hybrid** - Pepe Jijón at Finca Soledad, Ecuador. Decomposition: `base:Washed + fermentation:[Aerobic]`. Pepe Jijón's hybrid follow-on to TyOxidator at the same facility.

**Hybrid Washed deprecated** in Sprint T1 / BR-1 (2026-05-18). CGLE markets the term but publicly discloses the mechanical decomposition (`Whole-cherry aerobic -> sealed anaerobic -> depulp -> mucilage aerobic finish`), which fails the signature-method "mechanically opaque" criterion. Migration 058 re-maps the one affected brew row to `signature_method=NULL + base:Washed + fermentation:[Anaerobic, Aerobic]`; the green_beans lot name keeps the producer-marketing term ("CGLE Sudan Rume Hybrid Washed") as free-text in the lot label. The signature is removed from the canonical list and the alias map - any future write of `signature_method='Hybrid Washed'` now fails the canonical check, surfacing the deprecated term explicitly.

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
- `Anoxic` → **Anaerobic** + qualifier: `Anoxic`
- `No Oxygen` → **Anaerobic** + qualifier: `Anoxic`
- `Zero O2` → **Anaerobic** + qualifier: `Anoxic`
- `Oxygen Free` → **Anaerobic** + qualifier: `Anoxic`
- `Sealed Tank` → **Anaerobic**
- `Hermetic Fermentation` → **Anaerobic**
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
- `Moonshadow Washed` → **Moonshadow** (alias — legitimate rare variant. Moonshadow is typically Natural, but the MSW1 Airworks x Shoebox x Alo special lot is the Washed variant: same signature drying protocol applied to a washed ferment.)
- `Hybrid Washed` -> **not a signature** (deprecated Sprint T1 / BR-1 2026-05-18). CGLE markets the term but publicly decomposes it as `base:Washed + fermentation:[Anaerobic, Aerobic]` - fails the "mechanically opaque" criterion. Migration 058 re-mapped the one affected brew row to the structured decomposition. No alias entry: a fresh write of `signature_method='Hybrid Washed'` now fails canonical resolution and surfaces in the override queue, which is the right place to catch any future drift.
- `Tropical Washed` → *not a signature;* decomposes to `base:Washed + fermentation:[Yeast Inoculated] + intervention:[Fruit Co-ferment]` (Monteblanco, Colombia — co-ferment masquerading as a washed per Robert's notes)
- `Gold Washed` → *not a signature;* decomposes to `base:Washed + fermentation:[Mossto]` (Campo Hermoso, Colombia — named for the yellow-ish color from mossto + lactic ferment)

---

## Decomposition of current DB values (applied in migration 025)

The 20 distinct `brews.process` values across the 55-brew corpus, mapped to structured fields. Migration 025 (sprint 1e.2) applied this decomposition to `brews.base_process` / `subprocess` / `*_modifiers` / `decaf_modifier` / `signature_method` on all 55 rows. `brews.process` text column is retained unchanged (legacy display string; dropped in 1e.4 when /processes is redesigned).

| DB string | count | base | subprocess | fermentation | drying | intervention | signature |
|---|---|---|---|---|---|---|---|
| Washed | 20 | Washed | - | - | - | - | - |
| Natural | 12 | Natural | - | - | - | - | - |
| Anaerobic Washed | 3 | Washed | - | [Anaerobic] | - | - | - |
| White Honey | 2 | Honey | White Honey | - | - | - | - |
| Anaerobic Honey | 2 | Honey | Generic Honey | [Anaerobic] | - | - | - |
| Anaerobic Natural | 2 | Natural | - | [Anaerobic] | - | - | - |
| Cold Fermented Washed | 1 | Washed | - | [Cold Fermentation] | - | - | - |
| Moonshadow Washed | 1 | Washed | - | - | [Dark Room Dried, Slow Dry] | - | Moonshadow |
| Anoxic Natural | 1 | Natural | - | [Anaerobic] (qualifier: Anoxic — storage pending) | - | - | - |
| Double Anaerobic Thermal Shock | 1 | Washed | - | [Double Anaerobic, Thermal Shock, Yeast Inoculated] | - | - | - |
| Tamarind + Red Fruit Co-ferment Washed | 1 | Washed | - | [Yeast Inoculated] | - | [Fruit Co-ferment] | - |
| Yeast Inoculated Natural | 1 | Natural | - | [Yeast Inoculated] | - | - | - |
| Yeast Anaerobic Natural | 1 | Natural | - | [Anaerobic, Yeast Inoculated] | - | - | - |
| Dark Room Dry Natural | 1 | Natural | - | - | [Dark Room Dried] | - | - |
| Honey | 1 | Honey | Generic Honey | - | - | - | - |
| Double Fermentation Thermal Shock | 1 | Washed | - | [Double Anaerobic, Thermal Shock, Yeast Inoculated] | - | - | - |
| ASD Natural | 1 | Natural | - | [Anaerobic] | [Slow Dry] | - | - |
| Washed Sakura Co-ferment | 1 | Washed | - | - | - | [Floral Co-ferment] | - |
| TyOxidator | 1 | Washed | - | [Aerobic] | - | - | TyOxidator |
| Washed Cascara Infused | 1 | Washed | - | - | - | [Cascara Infusion] | - |

Post-migration base_process distribution: Washed 31, Natural 19, Honey 5, Wet-hulled 0 (55 total).

Four interpretive reads were resolved via pre-sprint DB audit evidence (full rationale in migration 025 header comment):

- **Anaerobic Honey** (×2 Finca La Reserva Gesha) — subprocess defaulted to Generic Honey; color tier unspecified in brew rows.
- **Moonshadow Washed** (×1 Alo Tamiru Tadesse) — legitimate rare Washed variant of Moonshadow. The MSW1 Airworks x Shoebox x Alo special-release collab lot (no public product page; confirmed via Airworks Instagram). Same Moonshadow drying signature (Dark Room Dried + Slow Dry) applied to a washed ferment. Decomposes as `base:Washed + drying:[Dark Room Dried, Slow Dry] + signature:Moonshadow`. Note: sprint 1e.2's initial audit over-read the coffee_name ("Alo Village - Tamiru Tadesse - Washed 74158", no Moonshadow mentioned) and reclassified as plain Washed; post-ship correction from Chris reinstated the signature in migration 026.
- **Double Anaerobic Thermal Shock** (×1 El Paraiso Lychee) + **Double Fermentation Thermal Shock** (×1 Letty Bermudez) — both Finca El Paraiso house protocol: base Washed with fermentation [Double Anaerobic, Thermal Shock, Yeast Inoculated]. Chris's key_takeaways on both brews explicitly name "yeast inoculation" and "wash process". Identical structured shape; 1e.4 redesign merges them into one faceted tile with 2 brews.

Tamarind + Red Fruit decomposes to generic `Fruit Co-ferment`; specific ingredient detail (tamarind, red fruit, sakura) is lost at decomposition time but could be preserved as a free-text note if Chris wants ingredient-level fidelity. Ingredient detail is marketing granularity, not a structural property.

---

## Authored content (Sub Pages 4 Tier B — 2026-05-11)

Per-entity reference content mirrored into `lib/process-registry.ts` rich exports (`BASE_PROCESS_ENTRIES` + `MODIFIER_ENTRIES` + `SignatureEntry.overview`/`observedCupProfile`) and consumed by `/processes/{base}` hubs + `/processes/modifiers/{modifier}` pages + `/processes/signatures/{name}` pages. Authored by Chris; both this doc and the registry stay in sync — edits land in both files via a small follow-up commit.

### Base processes

#### Washed
**Process Summary:** One of the base processes of processing coffee where the mucilage is fully removed before drying. Historically, washed coffees were considered higher quality due to a separation of the bad floating cherries and cleaner, even, predictable results.

**Brew Archetype:**
- Best archetype: Clarity-First
- Common failure mode: too much agitation flattens nuance
- When to deviate: denser / more developed washed coffees may need more intensity
- Typical strength: Transparent, structured, clean
- What usually helps: low agitation, careful cooling-window evaluation

#### Natural
**Process Summary:** One of the base processes of processing coffee where the whole cherry is dried with the fruit still intact around the seed. Historically, natural coffees were associated with heavier fruit expression and more variability, but careful drying has made them capable of high sweetness, intensity, and aromatic complexity.

**Brew Archetype:**
- Best archetype: Full Expression
- Common failure mode: too much extraction can turn fruit into ferment, heaviness, or drying finish
- When to deviate: cleaner / lighter naturals may benefit from Clarity-First structure
- Typical strength: Fruity, sweet, aromatic, expressive
- What usually helps: controlled extraction, moderate agitation, cooling-window evaluation

#### Honey
**Process Summary:** One of the base processes of processing coffee where some mucilage is left on the seed during drying. Historically, honey coffees sat between washed and natural styles, offering more sweetness and body than washed coffees while retaining more structure and clarity than full naturals.

**Brew Archetype:**
- Best archetype: Balanced Intensity
- Common failure mode: too much agitation can blur sweetness and create sticky heaviness
- When to deviate: very clean yellow / white honey lots may work better as Clarity-First
- Typical strength: Sweet, rounded, structured, medium-bodied
- What usually helps: moderate agitation, steady extraction, careful finish control

#### Wet-hulled
**Process Summary:** One of the base processes of processing coffee where parchment is removed while the coffee is still at high moisture before final drying. Historically, wet-hulled coffees were tied to Indonesian production needs and often produce earthy, herbal, savory, lower-acid profiles with heavier body.

**Brew Archetype:**
- Best archetype: Suppression
- Common failure mode: too much extraction can emphasize earth, spice, bitterness, or woody finish
- When to deviate: cleaner / high-elevation wet-hulled coffees may tolerate more intensity
- Typical strength: Heavy, earthy, low-acid, savory
- What usually helps: lower agitation, restrained extraction, avoiding tail-end bitterness

### Modifier Index entries

#### Anaerobic

Anaerobic is sealed-vessel fermentation — the cherry or seed is held in an oxygen-restricted environment, usually a hermetic tank, during the wet phase. It's the highest-traffic fermentation modifier in my corpus (16 coffees across Natural, Washed, and Honey), and the most likely to shift cup behavior away from what the base process alone would suggest.

The directional signal: anaerobic amplifies sweetness, intensifies aromatics, and produces denser, more structured cups — but risks crossing into lactic, fermenty, or booze-forward territory when uncontrolled. Strategy implications differ by base: on Naturals it usually calls for Suppression (low temp + low agitation, hold the volatile fruit back); on Washes it calls for Balanced Intensity or Full Expression depending on cultivar density. Record the `Anoxic` qualifier when the producer documents fully-sealed no-headspace execution — it preserves a structural distinction worth tracking across cups, but it doesn't on its own flip the strategy call; the modifier + base + cultivar + how the lot actually tastes carry that decision.

#### Yeast Inoculated

Yeast Inoculated is controlled fermentation with selected yeast introduced into the cherry or seed environment to guide fermentation rather than relying only on ambient microbes. In the corpus, it usually appears as a precision modifier layered onto Washed, Natural, or more complex experimental processes, and it often signals producer intent to shape aromatics, sweetness, or flavor direction more deliberately.

The directional signal: yeast inoculation tends to sharpen aromatic identity, increase fruit definition, and make the cup feel more designed - but risks becoming too flavor-forward, perfumed, or confectionary if the fermentation signature overtakes terroir and cultivar. Strategy implications differ by base: on Washed coffees it often supports Clarity-First or Balanced Intensity because the structure is still clean; on Naturals it often needs Suppression to keep fruit density from turning heavy. Watch for yeast plus thermal shock or anaerobic stacking - once layered, the modifier becomes less about precision alone and more about volatility management.

#### Dark Room Dried

Dark Room Dried is a drying modifier where coffee is dried away from direct sunlight, often in a shaded or controlled dark environment, to slow drying and reduce UV / heat exposure. It usually signals an attempt to preserve volatile aromatics, stabilize fruit expression, and create a more layered drying curve than standard exposed drying.

The directional signal: dark room drying tends to increase aromatic preservation, deepen sweetness, and create a more polished fruit profile - but risks density, heaviness, or a slightly closed cup if the coffee also carries a strong fermentation load. Strategy implications differ by base: on Naturals it often calls for Suppression or Balanced Intensity to avoid over-thick fruit; on Washed coffees it can support Clarity-First because the drying method may protect florals and nuance. Watch for dark room drying stacked with anaerobic or yeast modifiers - the cup may look clean on paper but behave like a high-volatility coffee in brewing.

#### Cold Fermentation

Cold Fermentation is a temperature-controlled fermentation modifier where the cherry or seed is fermented at lower temperatures to slow microbial activity and extend the wet phase. It usually signals a producer trying to preserve aromatics, create cleaner fermentation, and stretch complexity without letting the process run hot or chaotic.

The directional signal: cold fermentation tends to produce cleaner sweetness, brighter aromatics, and more composed fruit than warmer or more aggressive fermentation - but risks tasting muted, tight, or overly delicate if extraction is too restrained. Strategy implications differ by base: on Washed coffees it usually supports Clarity-First with slightly more extraction headroom; on Naturals or Honeys it can allow Balanced Intensity because the cold phase helps control ferment pressure. Watch for cold fermentation paired with high-density cultivars - those coffees often need enough energy to open the cup rather than pure suppression.

#### Raised Bed

Raised Bed is a drying modifier where coffee is dried on elevated beds that improve airflow around the cherry or parchment. It is one of the most common drying signals in specialty coffee, and by itself it usually indicates cleaner, more even drying rather than a strong flavor intervention.

The directional signal: raised bed drying tends to support cleaner sweetness, better airflow, and more even moisture reduction - but it is usually a quality-control modifier, not a primary cup-shaping modifier. Strategy implications differ by base: on Washed coffees it reinforces Clarity-First because it supports clean structure; on Naturals and Honeys it helps keep fruit expression cleaner but does not automatically remove the need for Suppression. Watch for raised bed listed alone versus raised bed plus shade, dark room, or slow drying - alone it is mostly baseline quality language, while stacked drying terms carry more brew-behavior signal.

#### Slow Dry

Slow Dry is a drying modifier where coffee is dried over an extended period, usually through lower heat, shade, thicker layers, controlled airflow, or more careful moisture reduction. It usually signals a producer trying to preserve aromatics, deepen sweetness, and avoid the harshness or instability that comes from drying too quickly.

The directional signal: slow drying tends to create more integrated sweetness, smoother fruit, and a more composed finish - but risks heaviness, muted acidity, or a slightly "held back" cup if paired with dense fermentation or darker development. Strategy implications differ by base: on Naturals and Honeys it often calls for Balanced Intensity or Suppression to keep fruit and body from getting too thick; on Washed coffees it can support Clarity-First with a little more extraction tolerance. Watch for slow dry stacked with dark room or shade drying - that usually means aromatic preservation, but also a higher chance the coffee needs enough energy to open fully.

#### Double Anaerobic

Double Anaerobic is a fermentation modifier where the coffee goes through two sequential oxygen-restricted fermentation stages. It usually signals a more intensive producer intervention than standard Anaerobic, and it often pushes the cup further away from what the base process alone would suggest.

The directional signal: double anaerobic tends to amplify sweetness, deepen fruit, increase structure, and create a more layered fermentation signature - but risks becoming lactic, boozy, heavy, or flavor-stacked if extraction is too aggressive. Strategy implications differ by base: on Naturals it usually calls for Suppression because the second anaerobic stage can make volatile fruit feel dense fast; on Washed coffees it often calls for Balanced Intensity because the washed base still gives some structural clarity. Watch for double anaerobic plus thermal shock or yeast inoculation - that combination usually behaves less like a clean base process and more like a high-intervention coffee needing volatility control.

#### Thermal Shock

Thermal Shock is a fermentation modifier where hot and cold temperature shifts are used during processing, often to influence microbial activity, stabilize fermentation, or change how compounds move through the cherry or seed. It usually signals a deliberate attempt to create high aromatic intensity and vivid fruit structure rather than a passive fermentation style.

The directional signal: thermal shock tends to sharpen aromatics, brighten acidity, and create a high-definition fruit profile - but risks becoming angular, artificial, or overly intense if the coffee is already heavily fermented. Strategy implications differ by base: on Washed coffees it often supports Full Expression or Balanced Intensity because the clean base can carry the extra intensity; on Naturals and Honeys it may need Suppression to prevent the fruit from turning loud or candy-like. Watch for thermal shock paired with anaerobic or yeast inoculation - the cup often rewards careful cooling-window evaluation because the warm cup may feel intense while the cooler cup shows whether the structure is integrated.

### Signature methods

**Deliberately deferred** (2026-05-11). Chris flagged at Phase A delivery that signature method content "needs a bit of a 'what I learned from this XYZ' prompt modifier to get what I need and to be able to evolve with experiences here" — i.e. signatures shouldn't be statically authored Overview prose; they should be synthesis-driven and update as the corpus grows. Punted to a follow-up sprint that adds a per-signature-method synthesis variant with a "what I learned from this signature" framing baked into the prompt. Until then, signature pages render empty-state messaging for Process Overview + Observed Cup Profile blocks; the canonical SignatureEntry decomposition (producer / country / base / modifier stack) still renders correctly via Process Breakdown chips.

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
