# Roasters

**Enforcement bar:** Strict (enforcement lands sprint 1h.2)
**Canonical registry:** [lib/roaster-registry.ts](../../lib/roaster-registry.ts) (validation mirror)
**Last adopted:** 2026-04-24
**Adoption path:** Authored taxonomy (Chris, 2026-04-23 CSV pass + 2026-04-24 enrichment) drawing on roaster-published brew guides, BMR roaster reference cards, and the 55-brew corpus. First taxonomy port without a DB FK column — `brews.roaster` is text-only; canonical enforcement is code-and-validation only, no migration to a `roasters` table.

Canonical roaster reference for the latent-coffee app. **70 canonical roasters** across **6 families** (5 BMR strategy families + Latent self-roasted). Strategy tags collapse to families via `STRATEGY_TAG_FAMILY` in [lib/roaster-registry.ts](../../lib/roaster-registry.ts). Part of the [Reference Taxonomies umbrella](../features/reference-taxonomies-attribution.md), sprint 1h structural port.

**Composition:** Each roaster is a single canonical name (no nested hierarchy like Region's Country → Macro). The rich shape captures 29 fields per entry: location/country, roast style + development bias + rest curve, strategy tag + family, primary driver / extraction purpose, house style + brew guide link, recipe baseline (temp / dose / water / ratio / time / agitation), brewer + filter type, extraction intent + failure mode + tolerance, process sensitivity, brew adjustment method, calibration role, confidence level, and free-text notes. Plus optional `displayName` for tight UI surfaces (brew cards) and `bmrHouseStyle` / `bmrNotes` authored prose preserved verbatim from the prior 21-entry registry where richer than CSV.

Additions require a 2-step edit: this doc + `lib/roaster-registry.ts` (no DB migration unless you're renaming an existing canonical, in which case a 3rd file is the migration). New canonicals are deliberate decisions, not drift. Sprint 1h.2 will land enforcement on `/add` + `/brews/[id]/edit` with an "add new" escape hatch when a roaster legitimately doesn't fit the canonical list.

External claims in this doc are sourced at authoring time from the CSV; Chris's own tested observations live in the `bmrHouseStyle` / `bmrNotes` fields preserved from the prior registry (used by `/roasters` detail HOUSE STYLE block + `/api/roasters/synthesize` prompt).

---

## Canonical list

Matches the `ROASTERS` array in [lib/roaster-registry.ts](../../lib/roaster-registry.ts) exactly. 70 entries grouped by family (5 BMR-derived strategy families + Self-Roasted).

### Clarity-First (26)

Roasters whose default is to protect clarity. Low-agitation, conservative pour structures, restrained extraction. Calibrate Chris's default 6.8-6.5 grind range without aggressive push. 26 entries.

- **April Coffee**
- **Bean & Bean Coffee Roasters**
- **Center Coffee**
- **Coffee Collective**
- **Dongzhe**
- **Drop Coffee Roasters**
- **Exposure Therapy Coffee**
- **Finca Coffee (Coffee Libre)**
- **Goût & Co**
- **Heart Coffee Roasters**
- **Hydrangea Coffee** — CLARITY-FIRST → BALANCED
- **ILSE Coffee** — CLARITY-FIRST → BALANCED
- **Koppi Coffee Roasters**
- **Kurasu**
- **Leaves Coffee**
- **Market Lane Coffee**
- **Mok Coffee**
- **normlppl/minmax**
- **Onibus Coffee**
- **Swerl Coffee Roasters**
- **Tanat Coffee**
- **Terraform Coffee Roasters**
- **Tim Wendelboe**
- **TM Coffee**
- **VWI by CHADWANG**
- **XLIII Coffee Roasters**

### Balanced (15)

Roasters who target moderate extraction (20-22% EY) as the home position. Some skew toward clarity on cooling (BALANCED → CLARITY); most are stable around the center. 15 entries.

- **Café Estelar**
- **Coava Coffee Roasters**
- **Coffee Supreme**
- **Colibri Coffee Roasters**
- **Father’s Coffee Roastery**
- **Five Elephant Coffee** — BALANCED → CLARITY
- **Friedhats Coffee**
- **Glitch Coffee**
- **Little Wolf Coffee** — BALANCED → CLARITY
- **Olympia Coffee**
- **Oma Coffee Roaster**
- **Prodigal Coffee**
- **Shoebox Coffee**
- **Simple Kaffa** — BALANCED → CLARITY
- **The Barn Coffee Roasters** — BALANCED → CLARITY

### Extraction-Forward (19)

Roasters who intentionally push extraction. Includes BALANCED → FULL (most), FULL EXPRESSION (Sey, Dak, Flower Child, Big Sur, Luminous), and BALANCED → HIGH (Nomad, Manhattan, Proud Mary — synonymous with FULL EXPRESSION). Default Clarity-First will under-extract. Start at 6.3-6.0, higher temp, more agitation. 19 entries.

- **Apollon’s Gold** — BALANCED → FULL
- **Aviary** — BALANCED → FULL
- **Big Sur Coffee** — FULL EXPRESSION
- **Botz Coffee** — BALANCED → FULL
- **Dak Coffee Roasters** — FULL EXPRESSION
- **Datura Coffee** — BALANCED → FULL
- **Flower Child Coffee** — FULL EXPRESSION
- **H&S Coffee Roasters** — BALANCED → FULL
- **Luminous Coffee** — FULL EXPRESSION
- **MAME Coffee** — BALANCED → FULL
- **Manhattan Coffee Roasters** — BALANCED → HIGH
- **Nomad Coffee** — BALANCED → HIGH
- **Picolot (Brian Quan)** — BALANCED → FULL
- **Proud Mary Coffee** — BALANCED → HIGH
- **Rogue Wave Coffee** — BALANCED → FULL
- **September Coffee** — BALANCED → FULL
- **Sey Coffee** — FULL EXPRESSION
- **Substance Café** — BALANCED → FULL
- **Thankfully Coffee** — BALANCED → FULL

### System (5)

**SYSTEM = a roaster whose identity is built around repeatable control logic, not a fixed recipe or extraction style.** They define success using targets (EY %, TDS, flavor balance windows), recipes change per coffee, and variables are interdependent. CLARITY = "don't over-extract"; FULL = "push extraction"; SYSTEM = "control extraction precisely." Without SYSTEM, you misclassify Subtext as "balanced" → wrong; Ona as "balanced" → wrong, because they are not aiming for a level, they are aiming for control. Use SYSTEM when a structured framework exists; VARIES when there's no clear framework, just flexibility. 5 entries.

- **Noma Coffee**
- **Ona Coffee**
- **Rose Coffee**
- **Subtext Coffee**
- **The Picky Chemist**

### Varies (4)

Roasters whose strategy depends on the specific coffee's process and variety. No fixed center; flexibility without a control-loop framework (vs SYSTEM, which has one). Check Process Signal Table in BMR before brewing. 4 entries.

- **Moonwake Coffee Roasters**
- **Scenery Coffee**
- **Strait Coffee** — BALANCED / VARIES
- **Switch Coffee** — BALANCED / VARIES

### Self-Roasted (1)

Chris's own roast lots from the Roest sample roaster. Roast for elasticity, brew for intensity. 1 entry.

- **Latent**

---

## Aliases

Structural mappings to canonical names. Additions are as deliberate as adding a canonical. Aliases do NOT make `isCanonical` return true — `findClosest` surfaces the suggestion so the picker / sync canonicalizes on write.

### Short-form aliases (pre-1h DB shape)

Migration 027 renames the 20 short-form entries to canonical full names. Aliases preserve resolvability for legacy paste-ins, search-bar typos, and external Claude write API drift.

- `Moonwake` → **Moonwake Coffee Roasters**
- `Hydrangea` → **Hydrangea Coffee**
- `Strait` → **Strait Coffee**
- `Sey` → **Sey Coffee**
- `Shoebox` → **Shoebox Coffee**
- `Colibri` → **Colibri Coffee Roasters**
- `Flower Child` → **Flower Child Coffee**
- `Heart` → **Heart Coffee Roasters**
- `Picolot` → **Picolot (Brian Quan)**
- `Rose` → **Rose Coffee**
- `Substance` → **Substance Café**
- `T&M / TM` → **TM Coffee**
- `Bean & Bean` → **Bean & Bean Coffee Roasters**
- `Leaves` → **Leaves Coffee**
- `Luminous` → **Luminous Coffee**
- `Noma Kaffe` → **Noma Coffee**
- `Olympia` → **Olympia Coffee**
- `Oma` → **Oma Coffee Roaster**
- `Scenery` → **Scenery Coffee**

### Structural drift / spelling variants

- `Daturra Coffee` → **Datura Coffee** (xlsx research-pass spelling)
- `Datura` → **Datura Coffee** (short form)
- `Coffee with Dongze` → **Dongzhe**
- `normlppl` / `minmax` → **normlppl/minmax** (the canonical preserves the dual-name slash convention)

---

## Per-entry reference

Rich attribute content for each canonical roaster. Field names match `RoasterEntry` in [lib/roaster-registry.ts](../../lib/roaster-registry.ts).

### Clarity-First

#### April Coffee
_Copenhagen, Denmark_ · **CLARITY-FIRST**

- **Roast style:** Ultra-light (Nordic, brewer-optimized)
- **Development bias:** Low external development, low solubility; relies on brewer geometry for even extraction
- **Rest curve:** 3-5 weeks typical; improves with extended rest
- **Primary driver:** Brewer design (flat-bottom geometry)
- **Extraction purpose:** Maximize even extraction and clarity via controlled flow and low agitation
- **House style:** April Brewer recipes; low agitation, structured pours, designed around flat-bottom flow dynamics
- **Brew guide:** [Official (Website)](https://www.aprilcoffeeroasters.com/pages/coffee-inf-recipes)
- **Recipe baseline:** temp=92-95, dose=15, water=240, ratio=1:16, time=2:15-2:45, agitation=Low
- **Primary brewer:** April Brewer
- **Filter type:** Flat-bottom (April filters)
- **Extraction intent:** Clarity (19-20%)
- **Failure mode:** Under-extraction presents as thin and overly tea-like; over-extraction presents as loss of clarity and slight dryness rather than harsh bitterness
- **Over-extraction tolerance:** Low-Medium
- **Process sensitivity:** Washed: ideal clarity; Natural: can feel thin unless adjusted via ratio; Processed: requires careful grind/ratio adjustment rather than temp increase
- **Brew adjustment method:** Grind + pour structure
- **Calibration role:** Flat-Bottom Clarity Benchmark
- **Confidence:** High
- **Notes:** Core idea is extraction evenness via brewer geometry; per-coffee recipes are common; does not rely on high temp or agitation; flow rate and bed geometry do most of the work

#### Bean & Bean Coffee Roasters
_New York, NY, USA_ · **CLARITY-FIRST** · archive: 1 brew

- **Roast style:** Light (approachable specialty)
- **Development bias:** Moderate development; high accessibility
- **Rest curve:** 2-3 weeks typical; relatively forgiving
- **Primary driver:** Baseline recipe
- **Extraction purpose:** Provide simple, consistent brewing guidance for clean and balanced cups
- **House style:** V60 baseline recipes; standard pours, moderate temp, low agitation; minimal complexity
- **Brew guide:** [Official (Website)](https://beannbeancoffee.com/blogs/beansider/brew-guides)
- **Recipe baseline:** temp=90-94, dose=15, water=240, ratio=~1:16, time=2:15-2:45, agitation=Low-Medium
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Clarity→Balanced (20-21%)
- **Failure mode:** Under-extraction presents as mild flatness; over-extraction uncommon due to conservative approach
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: clarity; Natural: balanced; Processed: handled within same baseline with minor adjustments
- **Brew adjustment method:** Grind
- **Calibration role:** Baseline Reference
- **Confidence:** High
- **Notes:** Consumer-friendly guidance; not optimized for high extraction or competition-style brewing; similar to Kurasu/ILSE but slightly more simplified; good reference for “default café-style” brewing

#### Center Coffee
_Seoul, South Korea_ · **CLARITY-FIRST**

- **Roast style:** Light (Korean precision clarity)
- **Development bias:** Low development; controlled solubility
- **Rest curve:** 2-3 weeks typical; stable
- **Primary driver:** Grind + pour control
- **Extraction purpose:** Maximize clean, structured clarity through controlled pours and minimal disturbance
- **House style:** Kalita/V60 structured pours; staged pulses (40g → 80g → 80g → 50g); low agitation
- **Brew guide:** Official
- **Recipe baseline:** temp=93, dose=16, water=250, ratio=~1:15.6, time=2:30-3:00, agitation=Low
- **Primary brewer:** Kalita / V60
- **Filter type:** Flat + Cone
- **Extraction intent:** Clarity (19.5-20.5%)
- **Failure mode:** Over-agitation reduces clarity; uneven pours cause imbalance
- **Over-extraction tolerance:** Low-Medium
- **Process sensitivity:** Washed: ideal clarity; Natural: balanced; Processed: sensitive to over-extraction
- **Brew adjustment method:** Grind + pour timing
- **Calibration role:** Korean Precision Benchmark
- **Confidence:** High
- **Notes:** Very structured pulse system; tighter ratio than Nordic; emphasizes even extraction and clarity; more controlled than Onibus; sits near Tanat but slightly more procedural

#### Coffee Collective
_Copenhagen, Denmark_ · **CLARITY-FIRST**

- **Roast style:** Light (classic Nordic clarity)
- **Development bias:** Low development, clean solubility; not extreme
- **Rest curve:** 2-3 weeks typical; relatively stable
- **Primary driver:** Grind + flow control
- **Extraction purpose:** Maximize clarity and balance through controlled flow and minimal agitation
- **House style:** Kalita/V60 recipes; even pours, low agitation, stable flow, moderate temp
- **Brew guide:** [Official (Website)](https://coffeecollective.dk/pages/brew-guide/kalita-wave)
- **Recipe baseline:** temp=92-94, dose=15, water=240, ratio=~1:16, time=2:30-3:00, agitation=Low
- **Primary brewer:** Kalita / V60
- **Filter type:** Flat + Cone
- **Extraction intent:** Clarity→Balanced (19-21%)
- **Failure mode:** Over-agitation reduces clarity; under-extraction presents as thin but clean
- **Over-extraction tolerance:** Low-Medium
- **Process sensitivity:** Washed: clarity-first; Natural: balanced; Processed: handled conservatively without aggressive push
- **Brew adjustment method:** Grind
- **Calibration role:** Nordic Clarity Benchmark
- **Confidence:** High
- **Notes:** Foundational Nordic style; emphasizes even extraction and clarity without pushing EY; less extreme than Sey; highly repeatable and forgiving within clarity-first range

#### Dongzhe
_Mountain View, CA, USA_ · **CLARITY-FIRST**

- **Roast style:** Ultra-light (rest-driven expressive clarity)
- **Development bias:** Low development, high sensitivity to resting phase
- **Rest curve:** Multi-phase: 0–10d intense → 17–21d peak → 24–27d muted → 40–60d clean/balanced
- **Primary driver:** Rest phase
- **Extraction purpose:** Allow coffee to express different profiles across rest phases using a stable Clarity-First baseline
- **House style:** Simple V60 recipe; low temp (92°C), 4 even pours (30/70/70/30), minimal agitation. Default-Clarity-First mechanics: 12.5g / 200g / V60 + Sibarist B3 / EG-1 6.5 / 93–94°C confirmed across 4 brews (washed + natural).
- **Brew guide:** Direct (brew card)
- **Recipe baseline:** temp=92, dose=12-15, water=200-240, ratio=~1:16, time=2:30-3:00, agitation=Low-Medium
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Clarity→Balanced (19-21%)
- **Failure mode:** Brewing during muted phase (~24–27d) leads to flat cups; early brews may taste roasty or unstable. Note: 92°C label under-extracts at 12.5g bed depth; correct upward to 93–94°C by process.
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: expressive across phases; Natural: more forgiving; Processed: phase behavior amplified
- **Brew adjustment method:** Rest + grind
- **Calibration role:** Clarity-First default + Rest Phase Model Benchmark
- **Confidence:** High
- **Notes:** Unique model: brew method remains constant while coffee evolves; does not encourage aggressive extraction changes; emphasizes observing flavor across time rather than forcing outcomes; 4-pour structure provides stable, repeatable extraction baseline. Promoted from VARIES to CLARITY-FIRST 2026-04-28 — 4 confirmed brews across washed and natural converge on Clarity-First mechanics.

#### Drop Coffee Roasters
_Stockholm, Sweden_ · **CLARITY-FIRST**

- **Roast style:** Light (Scandinavian clarity)
- **Development bias:** Low development; moderate solubility vs ultra-light peers
- **Rest curve:** 2-3 weeks typical; stable
- **Primary driver:** Flow + pour consistency
- **Extraction purpose:** Maximize clarity and sweetness through steady flow and even extraction
- **House style:** Kalita-focused pulse pours; consistent increments; moderate-high temp
- **Brew guide:** Official
- **Recipe baseline:** temp=96, dose=15, water=250, ratio=~1:16.7, time=2:45-3:00, agitation=Low-Medium
- **Primary brewer:** Kalita
- **Filter type:** Flat-bottom
- **Extraction intent:** Clarity→Balanced (20-21%)
- **Failure mode:** Uneven pours cause inconsistency; under-extraction presents as light and muted
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: clarity; Natural: balanced; Processed: tolerates slight push but not extreme
- **Brew adjustment method:** Pour structure
- **Calibration role:** Swedish Clarity Benchmark
- **Confidence:** High
- **Notes:** More energetic than Wendelboe; structured pulse system (50g increments); encourages continuous flow without drying bed; sits between strict Nordic and modern balanced styles

#### Exposure Therapy Coffee
_Singapore_ · **CLARITY-FIRST**

- **Roast style:** Ultra-light (extreme Nordic-adjacent)
- **Development bias:** Very low development, low early solubility; requires extended rest to unlock
- **Rest curve:** 30-60 days typical; peak varies by lot (~30-60+ days)
- **Primary driver:** Rest
- **Extraction purpose:** Achieve full aromatic expression and sweetness only after extended degassing; avoid premature extraction
- **House style:** No fixed house recipe; expected to use clarity-first approaches post-rest
- **Brew guide:** [Indirect (FAQ) (FAQ)](https://www.exposuretherapycoffee.com/faqs)
- **Recipe baseline:** temp=92-96, dose=15, water=240, ratio=~1:16, time=2:30-3:15, agitation=Low
- **Primary brewer:** V60
- **Filter type:** Cone (Hario/Cafec)
- **Extraction intent:** Clarity→Balanced (19-21%)
- **Failure mode:** Under-rested coffee presents as vegetal, sharp, or closed; brewing too early leads to misleading results
- **Over-extraction tolerance:** Low-Medium
- **Process sensitivity:** Washed: clarity-first; Natural: balanced; Processed: benefits significantly from extended rest before dialing
- **Brew adjustment method:** Rest + grind
- **Calibration role:** Extreme Rest Benchmark
- **Confidence:** Medium
- **Notes:** Strongest rest dependency in dataset; recommends opening bag prior to brewing (oxygen exposure); extraction strategy only valid after sufficient rest; similar to Shoebox/minmax but with longer and more variable peak window

#### Finca Coffee (Coffee Libre)
_Seoul, South Korea_ · **CLARITY-FIRST**

- **Roast style:** Light (Korean clarity tradition)
- **Development bias:** Low development; low solubility; requires restraint
- **Rest curve:** 2-3 weeks typical; stable
- **Primary driver:** Grind + restraint
- **Extraction purpose:** Preserve clarity and delicate structure with minimal interference
- **House style:** Likely V60/Kalita simple pours; low agitation; moderate temp; classic Korean clarity execution
- **Brew guide:** Inferred
- **Recipe baseline:** temp=90-94, dose=15, water=240, ratio=~1:16, time=2:30-3:00, agitation=Low
- **Primary brewer:** V60 / Kalita
- **Filter type:** Cone + Flat
- **Extraction intent:** Clarity (19-20%)
- **Failure mode:** Over-extraction reduces clarity quickly; under-extraction presents as light but clean
- **Over-extraction tolerance:** Low
- **Process sensitivity:** Washed: ideal clarity; Natural: lighter expression; Processed: sensitive to over-extraction
- **Brew adjustment method:** Grind
- **Calibration role:** Korean Clarity Baseline
- **Confidence:** Medium
- **Notes:** Coffee Libre (Finca) represents early Korean specialty style; similar to Onibus/Tanat in restraint; emphasizes clarity over extraction; less aggressive than modern competition-style roasters

#### Goût & Co
_Chengdu, China_ · **CLARITY-FIRST**

- **Roast style:** Light (modern clarity-focused)
- **Development bias:** Moderate-low development; balanced solubility
- **Rest curve:** 2-3 weeks typical; relatively stable
- **Primary driver:** Pour structure
- **Extraction purpose:** Achieve clean, even extraction through structured multi-pour sequencing with minimal disturbance
- **House style:** 5-pour V60 structure (30/40/40/50/40); consistent timing and flow; low agitation emphasis
- **Brew guide:** [Official (Website + Video)](https://goutandco.com/)
- **Recipe baseline:** temp=90-96, dose=12.5, water=200, ratio=1:16, time=2:30-3:00, agitation=Low-Medium
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Clarity→Balanced (20-21%)
- **Failure mode:** Over-agitation leads to loss of clarity; uneven pours reduce consistency
- **Over-extraction tolerance:** Low-Medium
- **Process sensitivity:** Washed: clarity-first; Natural: balanced; Processed: requires careful pour discipline to avoid muddiness
- **Brew adjustment method:** Pour structure
- **Calibration role:** Structured Pour Benchmark
- **Confidence:** High
- **Notes:** Strong emphasis on consistent pour sequencing (timed pulses); counterclockwise early pours then center finishing; similar to Tanat but slightly more structured and procedural; water TDS (60–120ppm) explicitly defined

#### Heart Coffee Roasters
_Portland, Oregon, USA_ · **CLARITY-FIRST** · archive: 2 brews

- **Roast style:** Light (Nordic-influenced US style)
- **Development bias:** Low development; relatively approachable solubility
- **Rest curve:** 2-3 weeks typical; stable
- **Primary driver:** Grind + temp
- **Extraction purpose:** Deliver clean, bright cups with accessible clarity and sweetness
- **House style:** V60 recipes with simple pours, moderate temps, low agitation
- **Brew guide:** [Official (Website)](https://www.heartroasters.com/pages/v60)
- **Recipe baseline:** temp=92-96, dose=15, water=240, ratio=~1:16, time=2:30-3:00, agitation=Low
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Clarity→Balanced (19.5-21%)
- **Failure mode:** Over-agitation reduces clarity; under-extraction presents as soft/flat
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: clarity; Natural: balanced; Processed: slight temp increase needed
- **Brew adjustment method:** Grind
- **Calibration role:** US Nordic Baseline
- **Confidence:** High
- **Notes:** One of the earliest US adopters of Nordic roasting; more forgiving than Wendelboe; strong baseline for clarity-first brewing in US context

#### Hydrangea Coffee
_Berkeley, CA, USA_ · **CLARITY-FIRST → BALANCED** · archive: 7 brews

- **Roast style:** Ultra-light (Nordic-adjacent, fast development)
- **Development bias:** Low external development, moderate internal structure; slightly more soluble than Nordic but still clarity-leaning
- **Rest curve:** 2-3 weeks minimum; peaks ~4-6 weeks
- **Primary driver:** Clarity style with process adjustment
- **Extraction purpose:** Preserve florals and clarity; selectively increase extraction to recover body when needed
- **House style:** V60, structured 4-pour recipe, soft water (~50ppm), low agitation baseline
- **Brew guide:** [Official (Website)](https://hydrangea.coffee/pages/faq)
- **Recipe baseline:** temp=92-95, dose=15, water=250, ratio=1:16.7, time=2:15-2:45, agitation=Low-Medium
- **Primary brewer:** V60
- **Filter type:** Cone (Cafec/Hario; sensitive to filter speed)
- **Extraction intent:** Clarity (19-20%) baseline; Balanced (20-22%) when pushed
- **Failure mode:** Under-extraction presents as thin, hollow, or overly tea-like; especially on processed or thermal shock lots
- **Over-extraction tolerance:** Medium (can become slightly astringent if over-pushed)
- **Process sensitivity:** Washed: Clarity-first; Natural: Clarity→Balanced; Thermal shock/advanced process: requires push toward Balanced (finer grind and/or higher temp)
- **Brew adjustment method:** Grind + temp (secondary)
- **Calibration role:** Clarity Benchmark with Adjustment Range
- **Confidence:** High
- **Notes:** House recipe: 50g bloom, 130g at 0:30, 190g at 1:05, 250g at 1:35, target ~2:30; expects longer times for washed, shorter for naturals; thermal shock coffees often need grind/temperature push to avoid hollow cups; very sensitive to water chemistry (~50ppm target)

#### ILSE Coffee
_North Canaan, CT, USA_ · **CLARITY-FIRST → BALANCED**

- **Roast style:** Light (Nordic-adjacent, clean and expressive)
- **Development bias:** Low development, moderate solubility; slightly more forgiving than extreme Nordic
- **Rest curve:** 2-5 weeks; peak ~3-5 weeks
- **Primary driver:** Grind + temp
- **Extraction purpose:** Highlight clarity and sweetness while maintaining drinkability across coffees
- **House style:** V60 baseline; moderate temp, simple pours, low-to-medium agitation; not highly prescriptive
- **Brew guide:** [Indirect (FAQ + collab) (Website + Collab)](https://ilsecoffee.com/pages/faq)
- **Recipe baseline:** temp=92-96, dose=15, water=240, ratio=~1:16, time=2:30-3:00, agitation=Low-Medium
- **Primary brewer:** V60
- **Filter type:** Cone (Hario/Cafec)
- **Extraction intent:** Clarity→Balanced (20-21.5%)
- **Failure mode:** Under-extraction presents as soft/flat rather than sharp; early brews may feel slightly closed
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: clarity-first; Natural: balanced; Processed: responds to slight temp increase but not aggressive push
- **Brew adjustment method:** Grind + temp
- **Calibration role:** Accessible Nordic Benchmark
- **Confidence:** High
- **Notes:** Cleaner and more forgiving than Sey; does not require extreme extraction; rest matters but not hypersensitive; good reference for ‘modern clean light roast’ without needing push

#### Koppi Coffee Roasters
_Helsingborg, Sweden_ · **CLARITY-FIRST**

- **Roast style:** Light (foundational Nordic)
- **Development bias:** Low development; low solubility; requires restraint
- **Rest curve:** 2-3 weeks typical; stable
- **Primary driver:** Grind + restraint
- **Extraction purpose:** Preserve origin clarity and structure with minimal interference
- **House style:** Simple V60/Kalita recipes; low agitation; moderate temp; classic Nordic execution
- **Brew guide:** [Official (Website)](https://koppi.se/pages/brew-guides)
- **Recipe baseline:** temp=92-94, dose=15, water=240, ratio=~1:16, time=2:30-3:00, agitation=Low
- **Primary brewer:** V60 / Kalita
- **Filter type:** Cone + Flat-bottom
- **Extraction intent:** Clarity (19-20%)
- **Failure mode:** Over-extraction quickly reduces clarity; under-extraction presents as thin but clean
- **Over-extraction tolerance:** Low
- **Process sensitivity:** Washed: ideal clarity; Natural: light unless adjusted; Processed: sensitive to over-extraction
- **Brew adjustment method:** Grind
- **Calibration role:** Foundational Nordic Reference
- **Confidence:** High
- **Notes:** One of the earliest modern Nordic clarity systems; emphasizes restraint over optimization; similar to Wendelboe but slightly less technical; strong baseline for clarity-first brewing

#### Kurasu
_Kyoto, Japan_ · **CLARITY-FIRST**

- **Roast style:** Light (clean, approachable clarity)
- **Development bias:** Moderate development, accessible solubility; not extreme Nordic
- **Rest curve:** 2-3 weeks typical; relatively forgiving
- **Primary driver:** Baseline recipe
- **Extraction purpose:** Provide a consistent, neutral starting point for dialing rather than optimizing extraction
- **House style:** Simple V60/Kalita recipes; low agitation, even pours, moderate temp, standard ratios
- **Brew guide:** [Official (Website)](https://kurasu.kyoto/blogs/recipe/kurasu-coffee-basic-recipe)
- **Recipe baseline:** temp=90-93, dose=15, water=240, ratio=1:16, time=2:15-2:45, agitation=Low
- **Primary brewer:** V60 / Kalita
- **Filter type:** Cone + Flat-bottom
- **Extraction intent:** Clarity→Balanced (~20%)
- **Failure mode:** Under-extraction presents as thin; over-extraction presents as slight bitterness but generally forgiving
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: clarity; Natural: balanced; Processed: handled within same baseline with minor grind/temp adjustments
- **Brew adjustment method:** Grind
- **Calibration role:** Baseline Reference
- **Confidence:** High
- **Notes:** Designed as a starting point rather than a fixed philosophy; emphasizes repeatability and ease; recipes are intentionally simple to allow user-driven dialing; not optimized for extreme clarity or extraction

#### Leaves Coffee
_Japan_ · **CLARITY-FIRST** · archive: 1 brew

- **Roast style:** Light (Nordic-inspired, slightly more developed than strict Nordic)
- **Development bias:** Moderate external development, lower internal density than Nordic; relatively easy to extract
- **Rest curve:** ~2-4 weeks typical; earlier accessible than Nordic but still benefits from rest
- **Primary driver:** Clarity style
- **Extraction purpose:** Preserve clarity and separation; avoid over-extraction at all costs
- **House style:** Low agitation, conservative pour structure, restrained extraction; minimal intervention brewing
- **Brew guide:** [Official (Printed/Shared Recipe)](https://beanbook.app/recipes/e25c42c4-7ca8-4601-8c25-2f84d9424a70)
- **Recipe baseline:** temp=90-92, dose=15, water=240, ratio=1:16, time=2:15-2:30, agitation=Low
- **Primary brewer:** V60
- **Filter type:** Cone (Hario/Cafec; sensitive to flow rate)
- **Extraction intent:** Clarity (19-20%)
- **Failure mode:** Over-extraction presents quickly as bitterness, muddiness, or loss of definition; cups collapse fast when pushed
- **Over-extraction tolerance:** Low
- **Process sensitivity:** Washed: strict clarity; Natural: slight tolerance toward balanced but still clarity-first; Processed: avoid pushing extraction, adjust via ratio or grind instead
- **Brew adjustment method:** Grind + ratio
- **Calibration role:** Strict Clarity Anchor
- **Confidence:** Medium
- **Notes:** Lower temp and low agitation are intentional; coarsen grind rather than increase temp if thin; prefers controlling extraction via restraint, not push; behaves differently from Nordic in that it extracts slightly easier so over-extraction risk appears earlier

#### Market Lane Coffee
_Melbourne, Australia_ · **CLARITY-FIRST**

- **Roast style:** Light (clean specialty baseline)
- **Development bias:** Moderate development; high consistency
- **Rest curve:** 1-2 weeks typical
- **Primary driver:** Simplicity + consistency
- **Extraction purpose:** Produce clean, repeatable, balanced clarity
- **House style:** Simple V60 / pour-over; bloom + 2-3 pours; minimal complexity
- **Brew guide:** [Official (Website)](https://marketlane.com.au/pages/how-to-brew-pour-over-coffee)
- **Recipe baseline:** temp=92-96, dose=15, water=250, ratio=~1:16.7, time=2:30-3:00, agitation=Low-Med
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Clarity (20-21%)
- **Failure mode:** Under-extraction if too coarse; over-extraction adds dryness
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: ideal; Natural: balanced; Processed: moderate
- **Brew adjustment method:** Grind
- **Calibration role:** Baseline Reference
- **Confidence:** High
- **Notes:** Clean, approachable system; less extreme than Nordic; strong calibration baseline for balanced clarity without complexity

#### Mok Coffee
_Addis Ababa, Ethiopia_ · **CLARITY-FIRST**

- **Roast style:** Light (Nordic-inspired)
- **Development bias:** Low development
- **Rest curve:** 2-4 weeks typical
- **Primary driver:** Simple structured pours
- **Extraction purpose:** Clean clarity with light body
- **House style:** V60-style multi-pour; moderate bloom; structured pulses
- **Brew guide:** [Official / Secondary (Mixed)](https://mokstore.shop/)
- **Recipe baseline:** temp=92-96, dose=15, water=250, ratio=~1:16.7, time=2:30-3:00, agitation=Low-Med
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Clarity (20-21%)
- **Failure mode:** Too fine = dryness; too coarse = hollow
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: excels; Natural: controlled; process-sensitive
- **Brew adjustment method:** Grind
- **Calibration role:** Clarity Reference (Lite)
- **Confidence:** Medium
- **Notes:** Sits between Nordic and baseline; less extreme than Sey/Apollon’s Gold

#### normlppl/minmax
_Berkeley, CA, USA_ · **CLARITY-FIRST**

- **Roast style:** Ultra-light (Nordic-inspired, extended rest clarity)
- **Development bias:** Very low development, low solubility early; improves significantly over time
- **Rest curve:** 2-5 weeks baseline; often peaks later and remains stable up to ~3 months
- **Primary driver:** Rest
- **Extraction purpose:** Achieve clarity and sweetness through patience and minimal intervention rather than extraction force
- **House style:** Small-dose V60 (12.5g), repeated pulse pours (~40g every ~30s), low agitation, coarse grind, soft-to-moderate water
- **Brew guide:** [Archived (Wayback)](https://web.archive.org/web/20250114135008/https://minmaxcoffee.com/brew-guide/)
- **Recipe baseline:** temp=91-93, dose=12.5, water=200, ratio=1:16, time=2:45-4:00, agitation=Low
- **Primary brewer:** V60
- **Filter type:** Cone (Cafec Abaca / V60 01)
- **Extraction intent:** Clarity (19-20%)
- **Failure mode:** Brewing too early (before ~2 weeks) results in muted or declining cups; under-extraction presents as thin but still clean
- **Over-extraction tolerance:** Low
- **Process sensitivity:** Washed: ideal clarity; Natural: still clarity-first; Processed: relies on rest rather than extraction adjustments
- **Brew adjustment method:** Rest + grind
- **Calibration role:** Extended Rest Clarity Benchmark
- **Confidence:** High
- **Notes:** Explicitly discourages brewing between day 1 and ~2-3 weeks; favors long rest (4-5+ weeks); coarse grind + fast pours maintain clarity; highly tolerant system over time once rested; emphasizes taste over strict adherence to recipe

#### Onibus Coffee
_Tokyo, Japan_ · **CLARITY-FIRST**

- **Roast style:** Light (Japanese clarity-focused)
- **Development bias:** Moderate-low development; accessible solubility
- **Rest curve:** 2-3 weeks typical; stable
- **Primary driver:** Flow + restraint
- **Extraction purpose:** Achieve clean, sweet cups through controlled pours and minimal disturbance
- **House style:** Multiple brew methods (V60, Switch, Aeropress); low agitation, structured pours, moderate temps
- **Brew guide:** [Official (Website)](https://onibuscoffee.com/pages/brewing_guide/driphot)
- **Recipe baseline:** temp=90-94, dose=15, water=240, ratio=~1:16, time=2:15-2:45, agitation=Low
- **Primary brewer:** V60 / Switch / Aeropress
- **Filter type:** Cone + Immersion
- **Extraction intent:** Clarity→Balanced (20-21%)
- **Failure mode:** Over-agitation leads to muddiness; under-extraction presents as soft/flat
- **Over-extraction tolerance:** Low-Medium
- **Process sensitivity:** Washed: clarity; Natural: balanced; Processed: requires slight temp/grind adjustment but not aggressive push
- **Brew adjustment method:** Grind + pour control
- **Calibration role:** Japanese Clarity Baseline
- **Confidence:** High
- **Notes:** Emphasizes restraint and consistency; broader method coverage than most roasters; less rigid than Tanat, less baseline than Kurasu; sits as a flexible clarity-first system with strong fundamentals

#### Swerl Coffee Roasters
_Sweden_ · **CLARITY-FIRST**

- **Roast style:** Ultra-light (Scandinavian clarity-focused)
- **Development bias:** Low development; low solubility; requires careful extraction restraint
- **Rest curve:** 3-5 weeks typical; improves with rest
- **Primary driver:** Restraint + grind
- **Extraction purpose:** Preserve clarity and delicate structure through minimal intervention
- **House style:** V60/Kalita recipes; low agitation, moderate temp, simple pours; emphasis on clean cup
- **Brew guide:** [Official (Website)](https://swerl.se/blogs/brewing-guides/hand-brewing-tips-and-trix)
- **Recipe baseline:** temp=92-94, dose=15, water=240, ratio=~1:16, time=2:30-3:00, agitation=Low
- **Primary brewer:** V60 / Kalita
- **Filter type:** Cone + Flat-bottom
- **Extraction intent:** Clarity (19-20%)
- **Failure mode:** Over-extraction quickly reduces clarity and introduces dryness; under-extraction presents as thin but clean
- **Over-extraction tolerance:** Low
- **Process sensitivity:** Washed: ideal clarity; Natural: may feel light unless adjusted slightly; Processed: sensitive to over-extraction
- **Brew adjustment method:** Grind
- **Calibration role:** Scandinavian Clarity Benchmark
- **Confidence:** High
- **Notes:** Very similar to Wendelboe/April style but slightly more approachable; emphasizes restraint over push; relies heavily on grind for dialing; not designed for high extraction ceilings

#### Tanat Coffee
_Paris, France_ · **CLARITY-FIRST**

- **Roast style:** Ultra-light (modern clarity-focused)
- **Development bias:** Low development, low solubility; requires controlled extraction to maintain clarity
- **Rest curve:** ~2-4 weeks typical; improves with rest
- **Primary driver:** Flow control (no agitation)
- **Extraction purpose:** Maximize clarity and separation by minimizing turbulence and ensuring even extraction
- **House style:** V60/Orea recipes with even pours, no agitation, stable water column; relies on flow consistency
- **Brew guide:** [Official (Website)](https://tanat.coffee/en/recette-extraction-orea/)
- **Recipe baseline:** temp=92-94, dose=12-15, water=200-240, ratio=~1:16, time=2:15-2:45, agitation=Low
- **Primary brewer:** V60/Orea
- **Filter type:** Cone + Flat-bottom
- **Extraction intent:** Clarity (19-20%)
- **Failure mode:** Over-extraction presents as loss of clarity and slight dryness; under-extraction presents as thin but clean
- **Over-extraction tolerance:** Low
- **Process sensitivity:** Washed: ideal clarity; Natural: may require slight grind adjustment; Processed: sensitive to over-extraction if agitation introduced
- **Brew adjustment method:** Pour structure + grind
- **Calibration role:** Flow-Control Clarity Benchmark
- **Confidence:** High
- **Notes:** Strictly avoids agitation; even pours maintain flat bed and consistent flow; similar to April but without brewer dependence; clarity achieved through stability rather than restriction or push

#### Terraform Coffee Roasters
_Shanghai, China_ · **CLARITY-FIRST**

- **Roast style:** Light (modern clarity-focused)
- **Development bias:** Moderate development, accessible solubility
- **Rest curve:** 2-3 weeks typical; relatively stable
- **Primary driver:** Pour structure
- **Extraction purpose:** Achieve clean, even extraction through simple, repeatable multi-pour structure
- **House style:** V60/Kalita recipes with even pours, moderate temp, low agitation
- **Brew guide:** [Official (archived) (Website (Wayback))](https://web.archive.org/web/20260221111636/https://www.terraformcoffee.com/pages/brew-guides)
- **Recipe baseline:** temp=90-93, dose=14-15, water=210-255, ratio=~1:16-1:17, time=2:10-2:30, agitation=Low
- **Primary brewer:** V60 / Kalita
- **Filter type:** Cone + Flat-bottom
- **Extraction intent:** Clarity (19-20%)
- **Failure mode:** Over-agitation leads to muddiness; uneven pours reduce clarity
- **Over-extraction tolerance:** Low-Medium
- **Process sensitivity:** Washed: clarity-first; Natural: balanced; Processed: requires slightly tighter control to avoid muddiness
- **Brew adjustment method:** Pour structure
- **Calibration role:** Structured Baseline Clarity Benchmark
- **Confidence:** Medium-High
- **Notes:** Very similar to Kurasu/Goût baseline systems; emphasis on repeatability and consistency; not designed for high extraction ceilings; short brew times reinforce clarity-first approach

#### Tim Wendelboe
_Oslo, Norway_ · **CLARITY-FIRST**

- **Roast style:** Ultra-light (canonical Nordic)
- **Development bias:** Very low development, low solubility, dense structure; requires precise extraction
- **Rest curve:** 3-5 weeks typical; some coffees improve beyond
- **Primary driver:** Grind control (extraction via particle size)
- **Extraction purpose:** Achieve clean, sweet, structured cups through precise extraction and minimal interference
- **House style:** V60 / filter baseline; simple pours, light agitation (stir bloom), focus on grind and dose consistency
- **Brew guide:** [Official (Website)](https://timwendelboe.no/pages/how-to-brew-pourover-and-filter-coffee)
- **Recipe baseline:** temp=92-96, dose=15, water=240, ratio=1:16, time=3:00-3:30, agitation=Low (bloom stir only)
- **Primary brewer:** V60
- **Filter type:** Cone (Hario; standard paper filters)
- **Extraction intent:** Clarity (19-20%)
- **Failure mode:** Under-extraction presents as sour, thin, and undeveloped; over-extraction presents as astringent and drying but rarely harsh
- **Over-extraction tolerance:** Low
- **Process sensitivity:** Washed: ideal expression; Natural: often requires slightly higher extraction (finer grind); Dense coffees require finer grind and/or higher temp
- **Brew adjustment method:** Grind
- **Calibration role:** Canonical Clarity Benchmark
- **Confidence:** High
- **Notes:** Uses ~65g/L baseline; boiling water acceptable due to heat loss; bloom stirred for saturation; grind is primary variable; emphasizes taste + time feedback loop over strict recipe adherence

#### TM Coffee
_Okinawa, Japan_ · **CLARITY-FIRST** · archive: 2 brews

- **Roast style:** Ultra-light
- **Development bias:** Low development
- **Rest curve:** 3-6 weeks (inferred)
- **Primary driver:** Roast transparency
- **Extraction purpose:** Clean, high clarity
- **House style:** Minimal intervention
- **Brew guide:** None
- **Recipe baseline:** temp=92-94, dose=15, water=240, ratio=1:16, time=~2:30, agitation=Low
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** 19-20%
- **Failure mode:** Thin if under-extracted
- **Over-extraction tolerance:** Low
- **Process sensitivity:** Washed > all
- **Brew adjustment method:** Grind-first
- **Calibration role:** Simple baseline
- **Confidence:** Low
- **Notes:** Inferred from style; no official guide

#### VWI by CHADWANG
_Bangkok, Thailand_ · **CLARITY-FIRST**

- **Roast style:** Light (competition-derived)
- **Development bias:** Low development; requires fine grind for extraction
- **Rest curve:** 2-3 weeks typical; stable
- **Primary driver:** Grind + agitation control
- **Extraction purpose:** Maximize acidity and clarity through minimal agitation and fine grind
- **House style:** V60 center-pour technique; minimal agitation; fast drawdown; fine grind
- **Brew guide:** Direct / Competition
- **Recipe baseline:** temp=93, dose=15, water=250, ratio=~1:16.7, time=2:00-2:15, agitation=Very Low
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Clarity (20-21%)
- **Failure mode:** Too coarse grind leads to under-extraction; agitation quickly muddies cup
- **Over-extraction tolerance:** Low
- **Process sensitivity:** Washed: ideal clarity; Natural: lighter expression; Processed: sensitive to imbalance
- **Brew adjustment method:** Grind
- **Calibration role:** Low-Agitation Benchmark
- **Confidence:** High
- **Notes:** Chad Wang WBrC system; fine grind + low agitation is core; faster brew times than most; unique approach vs multi-pour systems; emphasizes center pour and minimal disturbance

#### XLIII Coffee Roasters
_Da Nang, Vietnam_ · **CLARITY-FIRST**

- **Roast style:** Light (modern clarity-focused, educational baseline)
- **Development bias:** Moderate development, accessible solubility; not extreme Nordic
- **Rest curve:** 2-3 weeks typical; relatively forgiving
- **Primary driver:** Baseline + technique education
- **Extraction purpose:** Provide structured, repeatable clarity while teaching core variables (pouring, grind, timing)
- **House style:** V60 baseline recipes; even pours, moderate bloom, standard ratios; emphasis on consistency and technique
- **Brew guide:** [Official (Website)](https://xliiicoffee.com/en/coffee-guides/filter-2/)
- **Recipe baseline:** temp=90-94, dose=15, water=240, ratio=1:16, time=2:30-3:00, agitation=Low-Medium
- **Primary brewer:** V60
- **Filter type:** Cone (Hario)
- **Extraction intent:** Clarity→Balanced (20-21%)
- **Failure mode:** Under-extraction presents as thin; over-extraction presents as mild bitterness but generally forgiving
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: clarity; Natural: balanced; Processed: handled with minor grind/temp adjustments
- **Brew adjustment method:** Grind + pour structure
- **Calibration role:** Educational Baseline Benchmark
- **Confidence:** High
- **Notes:** Focuses on teaching fundamentals (grind, pouring, timing) rather than extreme optimization; similar to Kurasu but slightly more modern in presentation; not designed for high extraction ceilings

---

### Balanced

#### Café Estelar
_Guadalajara, Mexico_ · **BALANCED**

- **Roast style:** Light (fruit-forward specialty)
- **Development bias:** Moderate development vs ultra-light
- **Rest curve:** Short (7-15 days typical)
- **Primary driver:** Temp + grind
- **Extraction purpose:** Highlight fruit and acidity with moderate extraction
- **House style:** Flat-bottom + V60; staged pours; slightly coarser grind; moderate bloom (~40s)
- **Brew guide:** [Unofficial / Aggregated (Secondary)](https://estelar.coffee/)
- **Recipe baseline:** temp=94-96, dose=21, water=320, ratio=~1:15.2, time=3:00-4:00, agitation=Medium
- **Primary brewer:** Stagg X / V60
- **Filter type:** Flat + Cone
- **Extraction intent:** Balanced (20-22%)
- **Failure mode:** Over-extraction mutes fruit; too fine creates heaviness
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Natural: emphasized; Washed: balanced; Processed: performs well
- **Brew adjustment method:** Grind
- **Calibration role:** Fruit-forward Reference
- **Confidence:** Medium
- **Notes:** Not ultra-light system; shorter rest window; slightly higher dose; tuned for fruit expression over clarity purity

#### Coava Coffee Roasters
_Portland, Oregon, USA_ · **BALANCED**

- **Roast style:** Light-medium (early third wave)
- **Development bias:** Moderate development; higher solubility
- **Rest curve:** 1-2 weeks typical; earlier peak than Nordic styles
- **Primary driver:** Grind + flow
- **Extraction purpose:** Produce balanced cups with body and sweetness rather than strict clarity
- **House style:** Kalita and V60 recipes; moderate pours, moderate agitation, slightly lower temp emphasis
- **Brew guide:** [Official (Website)](https://coavacoffee.com/brew-methods/kalita-wave)
- **Recipe baseline:** temp=90-94, dose=15, water=240, ratio=~1:16, time=2:30-3:00, agitation=Medium
- **Primary brewer:** Kalita / V60
- **Filter type:** Flat + Cone
- **Extraction intent:** Balanced (20-21%)
- **Failure mode:** Over-extraction leads to bitterness; under-extraction presents as hollow
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: balanced; Natural: balanced→fuller; Processed: handled conservatively
- **Brew adjustment method:** Grind
- **Calibration role:** Third Wave Baseline
- **Confidence:** High
- **Notes:** Represents earlier US third wave style; more body tolerance and less strict clarity than modern Nordic-influenced roasters; useful baseline for contrast against modern light-roast systems

#### Coffee Supreme
_Wellington, New Zealand_ · **BALANCED**

- **Roast style:** Light-medium (approachable specialty)
- **Development bias:** Moderate development
- **Rest curve:** Not specified (standard freshness)
- **Primary driver:** Golden ratio + grind
- **Extraction purpose:** Consistent, repeatable extraction
- **House style:** Simple brew frameworks across methods; medium grind baseline
- **Brew guide:** [Official (PDF)](See attached PDF)
- **Recipe baseline:** temp=96, dose=15, water=250, ratio=1:16.7, time=2:00-2:30, agitation=Low-Med
- **Primary brewer:** V60 / Cone
- **Filter type:** Cone
- **Extraction intent:** Balanced (20-21%)
- **Failure mode:** Too fine = bitterness; too coarse = sour
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: ideal; Natural: balanced; general-purpose
- **Brew adjustment method:** Grind
- **Calibration role:** Baseline Reference
- **Confidence:** High
- **Notes:** Golden ratio anchor (60g/L) :contentReference[oaicite:0]{index=0}; simple system for consistency, not optimization

#### Colibri Coffee Roasters
_Everett, WA, USA_ · **BALANCED** · archive: 2 brews

- **Roast style:** Light-medium
- **Development bias:** Balanced development
- **Rest curve:** 2-4 weeks (inferred)
- **Primary driver:** General extraction
- **Extraction purpose:** Broad accessibility
- **House style:** Standard specialty
- **Brew guide:** None
- **Recipe baseline:** temp=92-96, dose=15, water=240, ratio=1:16, time=~3:00, agitation=Medium
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** 20-21%
- **Failure mode:** Muddled if over-agitated
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** All-purpose
- **Brew adjustment method:** Grind + ratio
- **Calibration role:** Generalist baseline
- **Confidence:** Low
- **Notes:** Limited data; avoid overfitting

#### Father’s Coffee Roastery
_Prague, Czech Republic_ · **BALANCED**

- **Roast style:** Light (modern specialty)
- **Development bias:** Moderate
- **Rest curve:** Not specified
- **Primary driver:** Standard pour-over fundamentals
- **Extraction purpose:** Clean, aromatic cup
- **House style:** Simple V60/Chemex style; medium-fine grind; steady pours
- **Brew guide:** [Unofficial / Aggregated (Secondary)](https://fathers.cz/en)
- **Recipe baseline:** temp=93-96, dose=24, water=360, ratio=1:15, time=3:30-4:00, agitation=Medium
- **Primary brewer:** V60 / Chemex
- **Filter type:** Cone
- **Extraction intent:** Balanced (20-22%)
- **Failure mode:** Over-extraction = harshness; under = weak aromatics
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Natural: works well; Washed: clean; general-purpose
- **Brew adjustment method:** Grind
- **Calibration role:** Baseline Reference
- **Confidence:** Low-Med
- **Notes:** More generic; not a tightly defined system; ratio-driven approach

#### Five Elephant Coffee
_Berlin, Germany_ · **BALANCED → CLARITY**

- **Roast style:** Light (modern European clarity)
- **Development bias:** Moderate-low development; slightly more sweetness than strict Nordic
- **Rest curve:** 2-3 weeks typical; stable
- **Primary driver:** Pour structure + grind
- **Extraction purpose:** Achieve clean cups with slightly more sweetness and body than Nordic baseline
- **House style:** V60 multi-stage pours with full drawdowns between phases; light agitation via swirl
- **Brew guide:** Official
- **Recipe baseline:** temp=96, dose=14, water=250, ratio=~1:18, time=3:00-3:10, agitation=Low-Medium
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Clarity→Balanced (20-21.5%)
- **Failure mode:** Uneven drawdowns lead to imbalance; under-extraction presents as muted sweetness
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: clarity; Natural: balanced; Processed: tolerates moderate push
- **Brew adjustment method:** Grind
- **Calibration role:** European Balanced Clarity
- **Confidence:** High
- **Notes:** Structured full-drawdown brewing (90g → 180g → 250g); emphasizes even extraction and sweetness; sits between Coffee Collective and The Barn; slightly more forgiving than strict Nordic styles :contentReference[oaicite:0]{index=0}

#### Friedhats Coffee
_Amsterdam, Netherlands_ · **BALANCED**

- **Roast style:** Light (balanced modern clarity)
- **Development bias:** Moderate-low development; accessible solubility
- **Rest curve:** 2-3 weeks typical; relatively forgiving
- **Primary driver:** Pour structure + grind
- **Extraction purpose:** Deliver clean, balanced cups with repeatable, simple brewing approach
- **House style:** V60 single main recipe; structured pours, moderate temp, low-to-medium agitation
- **Brew guide:** [Official (Website)](https://friedhats.com/blogs/news/the-definitive-friedhats-brew-recipe)
- **Recipe baseline:** temp=92-96, dose=15, water=240, ratio=~1:16, time=2:30-3:00, agitation=Low-Medium
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Balanced (20-21.5%)
- **Failure mode:** Under-extraction presents as mild flatness; over-extraction rare due to conservative approach
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: clarity; Natural: balanced; Processed: handled within same framework with minor tweaks
- **Brew adjustment method:** Grind
- **Calibration role:** Baseline Reference
- **Confidence:** High
- **Notes:** One of the cleanest ‘single recipe’ roasters; prioritizes repeatability over optimization; sits between Coffee Collective and Kurasu; approachable but still high-quality clarity

#### Glitch Coffee
_Tokyo, Japan_ · **BALANCED**

- **Roast style:** Light (Japanese clarity, slightly more developed than Nordic)
- **Development bias:** Moderate development, relatively accessible solubility; designed for lower-temp extraction
- **Rest curve:** ~2-3 weeks typical; relatively forgiving across rest
- **Primary driver:** Temperature (downward control)
- **Extraction purpose:** Reduce harshness and highlight sweetness/clarity by lowering extraction temperature
- **House style:** V60 with low temperature, moderate pours, controlled flow; avoids boiling water to prevent over-extraction
- **Brew guide:** [Official (Website)](https://shop.glitchcoffee.com/en/pages/brew-guide)
- **Recipe baseline:** temp=84-90, dose=15, water=260, ratio=1:17, time=2:15-2:45, agitation=Medium
- **Primary brewer:** V60
- **Filter type:** Cone (Hario)
- **Extraction intent:** Balanced (20-21%)
- **Failure mode:** Under-extraction presents as muted or dull; over-extraction presents quickly as bitterness if temp too high
- **Over-extraction tolerance:** Low-Medium
- **Process sensitivity:** Washed: balanced; Natural: benefits from slightly higher temp; Processed: requires careful temp increase to avoid thinness
- **Brew adjustment method:** Temp
- **Calibration role:** Low-Temp Extraction Benchmark
- **Confidence:** High
- **Notes:** Core identity is using lower temperature (~85-88°C common) to control extraction; opposite of Sey/Dak approach; temp is primary dial, not grind or agitation; raising temp increases both intensity and risk quickly

#### Little Wolf Coffee
_Massachusetts, USA_ · **BALANCED → CLARITY**

- **Roast style:** Light (modern US clarity)
- **Development bias:** Low development; moderate solubility; slightly more forgiving than Nordic
- **Rest curve:** 2-3 weeks typical; stable
- **Primary driver:** Temp + pour structure
- **Extraction purpose:** Enhance sweetness and roundness while maintaining clarity
- **House style:** V60 recipes; moderate pours, slightly higher temps, gentle agitation
- **Brew guide:** Indirect
- **Recipe baseline:** temp=94-98, dose=15, water=240, ratio=~1:16, time=2:45-3:15, agitation=Medium
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Clarity→Balanced (20.5-22%)
- **Failure mode:** Under-extraction presents as thin/acidic; over-extraction introduces mild dryness
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: clarity; Natural: balanced→fuller; Processed: responds well to higher temp and slight push
- **Brew adjustment method:** Temp + grind
- **Calibration role:** Modern US Clarity
- **Confidence:** Medium
- **Notes:** Sits near Hydrangea but less process-reactive; slightly more sweetness-driven than strict clarity systems; approachable high-quality light roast profile

#### Olympia Coffee
_Olympia, WA, USA_ · **BALANCED** · archive: 1 brew

- **Roast style:** Light
- **Development bias:** Balanced development
- **Rest curve:** 2-3 weeks
- **Primary driver:** Even extraction
- **Extraction purpose:** Sweetness + balance
- **House style:** Structured recipes
- **Brew guide:** [Official (Website)](https://www.olympiacoffee.com/pages/brewing)
- **Recipe baseline:** temp=93-96, dose=15, water=250, ratio=~1:16-1:17, time=~3:00, agitation=Medium
- **Primary brewer:** V60 / Kalita
- **Filter type:** Both
- **Extraction intent:** 20-21%
- **Failure mode:** Flat if under-agitated
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** All
- **Brew adjustment method:** Grind + pour structure
- **Calibration role:** Balanced reference
- **Confidence:** High
- **Notes:** Classic US specialty profile

#### Oma Coffee Roaster
_Hong Kong, China_ · **BALANCED** · archive: 1 brew

- **Roast style:** Light (modern clarity with slight richness bias)
- **Development bias:** Moderate development; balanced solubility
- **Rest curve:** 2-3 weeks typical (inferred); stable across window
- **Primary driver:** Ratio + pour timing
- **Extraction purpose:** Enhance sweetness and body through tighter ratio and controlled pour timing
- **House style:** Origami Wave recipes; low dose (~10g), tighter ratio (~1:15), 3-pour structure with gentle flow
- **Brew guide:** Direct (community)
- **Recipe baseline:** temp=92-94, dose=10-15, water=150-240, ratio=~1:15, time=2:00-2:45, agitation=Low-Medium
- **Primary brewer:** Origami
- **Filter type:** Flat-bottom (Wave)
- **Extraction intent:** Balanced (20-21%)
- **Failure mode:** Under-extraction presents as overly light/thin due to low dose; over-extraction can compress clarity due to tighter ratio
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: balanced; Natural: balanced→slightly richer; Processed: benefits from careful control of pour timing
- **Brew adjustment method:** Ratio + grind
- **Calibration role:** Low-Dose Ratio Benchmark
- **Confidence:** Medium
- **Notes:** Notable for low dose (10g) and tighter ratio which increases perceived body without pushing extraction aggressively; simpler pour structure (3 pours) vs typical 4–5; sits between clarity-first and light body-building approaches

#### Prodigal Coffee
_Boulder, CO, USA_ · **BALANCED**

- **Roast style:** Light (modern Rao-style, process-aware)
- **Development bias:** Moderate development with high solubility; optimized for extraction efficiency and sweetness
- **Rest curve:** 2-4 weeks typical; stable across window
- **Primary driver:** Extraction methodology (Rao system)
- **Extraction purpose:** Maximize sweetness and balance through controlled extraction using grind, agitation, and pour technique
- **House style:** V60 baseline with Rao-style bloom (stir), controlled pours, moderate agitation, boiling or near-boiling water acceptable
- **Brew guide:** [Indirect (Rao) (Blog)](https://www.scottrao.com/blog/2024/2/26/how-to-approach-brewing-different-coffees)
- **Recipe baseline:** temp=94-100, dose=15, water=240, ratio=1:16, time=2:45-3:15, agitation=Medium
- **Primary brewer:** V60
- **Filter type:** Cone (Hario/Cafec)
- **Extraction intent:** Balanced (21-22%)
- **Failure mode:** Under-extraction presents as sour or hollow; over-extraction presents as drying/astringent but rarely harsh
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Washed: balanced; Natural: high; Processed: responds well to increased extraction but within controlled range
- **Brew adjustment method:** Grind + agitation
- **Calibration role:** Rao Methodology Benchmark
- **Confidence:** High
- **Notes:** Uses Rao principles: bloom stir, even saturation, controlled pours; emphasizes extraction efficiency over minimal intervention; dialing is iterative via taste and extraction behavior rather than fixed recipe; sits between Hydrangea flexibility and Subtext structure

#### Shoebox Coffee
_Chicago, Illinois, USA_ · **BALANCED** · archive: 3 brews

- **Roast style:** Ultra-light (Nordic-adjacent, extended development curve)
- **Development bias:** Low development, relatively low solubility early; improves significantly with rest
- **Rest curve:** 4-8 weeks typical; many coffees peak ~6-7 weeks, some longer
- **Primary driver:** Rest + clarity style
- **Extraction purpose:** Achieve clarity and sweetness through sufficient rest and gentle extraction rather than pushing
- **House style:** UFO primary, small cone V60 secondary; low agitation, soft water, moderate pours
- **Brew guide:** Unofficial
- **Recipe baseline:** temp=92-95, dose=12-15, water=200-250, ratio=~1:16-1:16.7, time=2:30-3:15, agitation=Low-Medium
- **Primary brewer:** UFO
- **Filter type:** Cone (small V60 / Cafec)
- **Extraction intent:** Clarity→Balanced (19-21%)
- **Failure mode:** Under-rested coffee presents as vegetal, grassy, or hollow; under-extraction presents as thin
- **Over-extraction tolerance:** Low-Medium
- **Process sensitivity:** Washed: clarity-first; Natural: balanced; Processed: benefits from rest more than extraction push
- **Brew adjustment method:** Rest + grind
- **Calibration role:** Rest Curve Benchmark
- **Confidence:** Medium
- **Notes:** Key variable is rest, not extraction force; small dose (12g) + equal pours (4x50g style) common; softer water (~1/3 TWW) used; UFO increases evenness; pushing extraction too early leads to poor results

#### Simple Kaffa
_Taipei, Taiwan_ · **BALANCED → CLARITY**

- **Roast style:** Light (competition-style clarity)
- **Development bias:** Moderate-low development; good solubility
- **Rest curve:** 2-3 weeks typical; stable
- **Primary driver:** Pour structure + temp
- **Extraction purpose:** Achieve clean, expressive cups with both clarity and sweetness
- **House style:** V60 multi-pour; balanced pours; moderate temp; controlled agitation
- **Brew guide:** [Official (Website)](https://simplekaffa.com/journal/simple-kaffa-how-to-hand-brewed-coffee-tutorial)
- **Recipe baseline:** temp=92-96, dose=15, water=240, ratio=~1:16, time=2:30-3:00, agitation=Low-Medium
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Clarity→Balanced (20-21%)
- **Failure mode:** Under-extraction presents as muted; over-extraction reduces vibrancy
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: clarity; Natural: balanced; Processed: moderate push acceptable
- **Brew adjustment method:** Grind + temp
- **Calibration role:** Competition Clarity Baseline
- **Confidence:** High
- **Notes:** World-class competition lineage; more expressive than strict Nordic; less aggressive than Sey-style systems; strong reference for balanced high-level clarity brewing

#### The Barn Coffee Roasters
_Berlin, Germany_ · **BALANCED → CLARITY**

- **Roast style:** Light (modern European clarity)
- **Development bias:** Moderate-low development; slightly higher solubility than Nordic peers
- **Rest curve:** 2-3 weeks typical; stable
- **Primary driver:** Pour structure + temp
- **Extraction purpose:** Achieve clean, expressive cups with slightly more body than strict Nordic styles
- **House style:** V60 multi-pour; structured increments; moderate-high temp; balanced agitation
- **Brew guide:** [Official (Website)](https://thebarn.de/blogs/the-barn-blog/v60-drip)
- **Recipe baseline:** temp=94-98, dose=15, water=250, ratio=~1:16-1:17, time=2:45-3:15, agitation=Medium
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Clarity→Balanced (20-21.5%)
- **Failure mode:** Over-agitation reduces clarity; under-extraction presents as muted sweetness
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: clarity; Natural: balanced; Processed: handles moderate push
- **Brew adjustment method:** Grind + temp
- **Calibration role:** Modern European Clarity Baseline
- **Confidence:** High
- **Notes:** Bridges Nordic clarity and modern extraction; slightly more forgiving and fuller than Scandinavian peers; sits near Nomad but less extraction-driven

---

### Extraction-Forward

#### Apollon’s Gold
_Tokyo, Japan_ · **BALANCED → FULL**

- **Roast style:** Ultra-light (competition-level precision clarity)
- **Development bias:** Low development, high clarity, moderate solubility when properly extracted
- **Rest curve:** 2-4 weeks typical; stable after rest
- **Primary driver:** Pour structure + flow control
- **Extraction purpose:** Maximize clarity and sweetness with precise, repeatable pour sequencing and controlled flow
- **House style:** Highly structured V60 recipes; multiple pours, tight timing, careful flow control, minimal disturbance
- **Brew guide:** [Official (Website)](https://shop.apollons-gold.com/pages/2024-pourover-guide)
- **Recipe baseline:** temp=92-96, dose=15, water=250, ratio=~1:16-1:17, time=2:30-3:30, agitation=Low-Medium
- **Primary brewer:** V60
- **Filter type:** Cone (Hario)
- **Extraction intent:** Balanced→High (21-23%)
- **Failure mode:** Over-agitation or flow inconsistency reduces clarity; under-extraction presents as light and underdeveloped
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Washed: clarity with push; Natural: balanced→high; Processed: requires controlled push without turbulence
- **Brew adjustment method:** Pour structure + grind
- **Calibration role:** Japanese Precision Benchmark
- **Confidence:** High
- **Notes:** Emphasizes repeatability and control; sits between Tanat (stability) and Subtext (precision); not extreme like Dak/Sey but still capable of high extraction with control; flow consistency is critical

#### Aviary
_Cleveland, OH, USA_ · **BALANCED → FULL**

- **Roast style:** Ultra-light (modern high-clarity, high-solubility)
- **Development bias:** Low development but engineered for easy extraction across wide range
- **Rest curve:** 2-8 weeks depending on coffee; peak often later; stable long-term
- **Primary driver:** extraction targets + water chemistry (secondary)
- **Extraction purpose:** Achieve high clarity and articulation with flexible brewing while targeting consistent EY/TDS
- **House style:** Flexible V60-style brewing; no strict recipe; emphasizes grind (~500µm), soft water, and extraction targets
- **Brew guide:** [Official (Website)](https://aviary.coffee/)
- **Recipe baseline:** temp=92-96, dose=15, water=255, ratio=~1:17, time=2:30-3:30, agitation=Medium
- **Primary brewer:** V60 / multi
- **Filter type:** Cone + Flat
- **Extraction intent:** Balanced→High (21.5-23%)
- **Failure mode:** Under-extraction presents as lack of articulation; poor water chemistry reduces clarity significantly
- **Over-extraction tolerance:** High
- **Process sensitivity:** Washed: clarity-focused; Natural: high extraction; Processed: responds well to higher EY without harshness
- **Brew adjustment method:** Grind + water
- **Calibration role:** Extraction Target + Water Benchmark
- **Confidence:** High
- **Notes:** Strong emphasis on water chemistry (≈58 GH / 27 KH); coffees designed to extract easily across styles; targets (EY/TDS) matter more than recipe; behaves like a more flexible Subtext; long shelf stability compared to typical ultra-light roasters

#### Big Sur Coffee
_Shanghai, China_ · **FULL EXPRESSION**

- **Roast style:** Ultra-light (Nordic-influenced)
- **Development bias:** Low development; relatively dense; requires higher temp to extract fully
- **Rest curve:** ~3-4 weeks typical; benefits from rest but not as long as Sey-style coffees
- **Primary driver:** Temperature
- **Extraction purpose:** Increase extraction to avoid thin cups while preserving clarity
- **House style:** V60 with high temp, moderate agitation, standard ratios; simple structure with elevated temp
- **Brew guide:** [Unofficial (Website + YouTube)](https://bigsurcafe.com/pages/brewing-tips)
- **Recipe baseline:** temp=96-100, dose=15, water=255, ratio=1:17, time=2:45-3:15, agitation=Medium
- **Primary brewer:** V60
- **Filter type:** Cone (Hario/Cafec)
- **Extraction intent:** High (22-24%)
- **Failure mode:** Under-extraction presents as thin, sharp, and hollow; requires higher temp to unlock sweetness
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: requires higher temp; Natural: more forgiving; Processed: can handle push but not to Dak-level extremes
- **Brew adjustment method:** Temp + grind
- **Calibration role:** High-Temp Clarity Reference
- **Confidence:** Medium
- **Notes:** Relies on temperature rather than extreme grind or agitation; sits between Nordic clarity and high-extraction styles; pushing temp increases sweetness without fully entering extreme extraction territory; simpler system than Sey/Dak

#### Botz Coffee
_Minnesota, USA_ · **BALANCED → FULL**

- **Roast style:** Light (modern structured clarity)
- **Development bias:** Low development; engineered solubility
- **Rest curve:** 2-3 weeks typical; stable
- **Primary driver:** Grind + extraction targeting
- **Extraction purpose:** Achieve consistent, optimized extraction with measurable targets
- **House style:** Multi-brewer recipes; structured pours; explicit EY/TDS targeting; moderate-high temps
- **Brew guide:** [Official (Website)](https://botz-coffee.com/pages/botz-brews)
- **Recipe baseline:** temp=94-98, dose=15, water=240, ratio=~1:16, time=2:45-3:30, agitation=Medium
- **Primary brewer:** V60 / Kalita
- **Filter type:** Cone + Flat
- **Extraction intent:** Balanced→High (21-23%)
- **Failure mode:** Missing target extraction leads to imbalance; under-extraction = hollow; over-extraction = slight dryness
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Washed: clarity with push; Natural: balanced→high; Processed: benefits from controlled higher extraction
- **Brew adjustment method:** Grind + ratio
- **Calibration role:** Data-Driven Extraction Benchmark
- **Confidence:** High
- **Notes:** Similar philosophy to Subtext but slightly less extreme; emphasizes hitting extraction targets rather than purely sensory dialing; bridges practical brewing and quantitative approach

#### Dak Coffee Roasters
_Netherlands_ · **FULL EXPRESSION**

- **Roast style:** Light (competition-style, process-driven)
- **Development bias:** High internal development (high solubility despite light color)
- **Rest curve:** 3–4 weeks is correct but: many coffees open earlier due to solubility
- **Primary driver:** Processing
- **Extraction purpose:** Amplify process
- **House style:** High extraction,  long brew, high temp; bloom-heavy,  extended contact time
- **Brew guide:** [Unofficial (Reddit + Collab Recipes)](https://www.reddit.com/r/pourover/comments/1j89aw7/dak_recipes_on_pourovers/)
- **Recipe baseline:** temp=98-100, dose=15, water=270, ratio=1:18, time=3:30-4:30, agitation=Medium-High
- **Primary brewer:** V60
- **Filter type:** Cone (fast papers like T-90/T-92 preferred)
- **Extraction intent:** Extreme (24%+)
- **Failure mode:** Under-extraction presents as sour, thin, or hollow; requires pushing extraction to unlock sweetness
- **Over-extraction tolerance:** Very high
- **Process sensitivity:** Washed: High extraction; 
Natural: High→Extreme; 
Anaerobic/thermal shock/co-ferment: Extreme extraction required
- **Brew adjustment method:** Everything
- **Calibration role:** High Extraction Anchor
- **Confidence:** High
- **Notes:** Default Clarity or even Balanced approaches will under-extract; bloom ratios often 4-5x dose; designed for high EY with long brews and near-boiling water

#### Datura Coffee
_Paris, France_ · **BALANCED → FULL**

- **Roast style:** Light (modern precision clarity)
- **Development bias:** Low-to-moderate development; relatively high control over extraction via technique
- **Rest curve:** 2-4 weeks typical; stable across rest window
- **Primary driver:** Pour structure + agitation
- **Extraction purpose:** Balance clarity and sweetness through controlled agitation and structured pours
- **House style:** V60/Origami recipes; bloom + controlled pours with light agitation; slightly higher temps than strict Nordic
- **Brew guide:** [Official (Website)](https://daturacoffee.com/blogs/recipes/pour-over-hario-v60)
- **Recipe baseline:** temp=93-97, dose=15, water=240, ratio=~1:16, time=2:45-3:15, agitation=Medium
- **Primary brewer:** V60 / Origami
- **Filter type:** Cone + Flat-bottom
- **Extraction intent:** Balanced→High (21-23%)
- **Failure mode:** Under-extraction presents as muted sweetness; over-extraction presents as light dryness if agitation too high
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: balanced; Natural: high; Processed: responds to increased agitation and temp but within controlled range
- **Brew adjustment method:** Agitation + grind
- **Calibration role:** Modern Precision Clarity Benchmark
- **Confidence:** High
- **Notes:** Sits between Hydrangea and Substance; uses agitation intentionally but not aggressively; extraction is pushed slightly higher than Nordic but not extreme; emphasizes balance over pure clarity or intensity

#### Flower Child Coffee
_Oakland, CA, USA_ · **FULL EXPRESSION** · archive: 2 brews

- **Roast style:** Ultra-light (competition-style, extremely high clarity)
- **Development bias:** Low external development but highly soluble when pushed; requires aggressive extraction to unlock sweetness
- **Rest curve:** 2-4 weeks typical; many coffees improve through 6-8 weeks
- **Primary driver:** Structure + extraction intensity
- **Extraction purpose:** Maximize sweetness and saturation at very high extraction while maintaining clarity
- **House style:** V60 with fast filters (T-92), boiling water, long brew times, heavy agitation, high ratio
- **Brew guide:** [Official (Website)](https://flowerchildcoffee.com/blogs/brewing-tips-guides-extrapolation/brew-guides)
- **Recipe baseline:** temp=98-100, dose=16, water=288, ratio=1:18, time=4:00-5:00, agitation=High
- **Primary brewer:** V60
- **Filter type:** Cone (Cafec T-92 fast filter preferred)
- **Extraction intent:** Extreme (25-27%)
- **Failure mode:** Under-extraction presents as thin, sharp, and lacking sweetness; requires pushing extraction to reach balance
- **Over-extraction tolerance:** Very high
- **Process sensitivity:** Washed: Extreme extraction; Natural: Extreme; Anaerobic: Extreme but cleaner than Dak due to roast control
- **Brew adjustment method:** Temp + agitation + grind
- **Calibration role:** Upper Extraction Limit Benchmark
- **Confidence:** High
- **Notes:** Among the highest extraction roasters; boiling water + long contact time + fast filters are required; cups remain clean even at very high EY due to roast approach; narrower grind window than Dak but more tolerant at high extraction

#### H&S Coffee Roasters
_Laramie, WY, USA_ · **BALANCED → FULL**

- **Roast style:** Ultra-light (Nordic-adjacent)
- **Development bias:** Low development, relatively low solubility; may require higher extraction to unlock
- **Rest curve:** 3-5 weeks typical (inferred); likely improves with extended rest
- **Primary driver:** Extraction push (inferred)
- **Extraction purpose:** Increase extraction to recover sweetness and structure from very light roasts
- **House style:** No official guide; community reports suggest higher temp, finer grind, and moderate agitation needed
- **Brew guide:** Unofficial
- **Recipe baseline:** temp=94-100, dose=15, water=240, ratio=1:16, time=2:45-3:30, agitation=Medium
- **Primary brewer:** V60
- **Filter type:** Cone (Hario/Cafec)
- **Extraction intent:** Balanced→High (21-23%)
- **Failure mode:** Under-extraction presents as thin, hollow, or weak; common issue due to low solubility
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Washed: requires push; Natural: more forgiving; Processed: likely benefits from higher extraction but not fully characterized
- **Brew adjustment method:** Temp + grind
- **Calibration role:** Unspecified Nordic Variant
- **Confidence:** Low
- **Notes:** Lack of official guidance; behaves like a more difficult-to-extract Nordic roast; dialing resembles early Sey-like approach but with less defined system; treat as requiring cautious extraction increase

#### Luminous Coffee
_Las Vegas, NV, USA_ · **FULL EXPRESSION** · archive: 1 brew

- **Roast style:** Ultra-light (modern, system-driven)
- **Development bias:** Low external development, engineered solubility via grind + flow control
- **Rest curve:** 3-5 weeks typical; improves with rest
- **Primary driver:** Grind size (µm standardization)
- **Extraction purpose:** Achieve high, repeatable extraction via fixed particle size and controlled pulse structure
- **House style:** V60 multi-pour (5 pours), fixed µm range (490–575µm), moderate agitation, structured pulses
- **Brew guide:** [Official (Website + Tool)](https://www.loveluminous.coffee/pages/coffee-extraction-calculator)
- **Recipe baseline:** temp=92-95, dose=17, water=288, ratio=1:17, time=3:15-3:45, agitation=Medium
- **Primary brewer:** V60
- **Filter type:** Cone (flow consistency important)
- **Extraction intent:** High→Extreme (23-25%)
- **Failure mode:** Under-extraction occurs when grind too coarse or pulse structure not followed; cups taste thin and incomplete
- **Over-extraction tolerance:** High
- **Process sensitivity:** Washed: high extraction; Natural: high→extreme; Processed: responds well to system without needing separate approach
- **Brew adjustment method:** Grind + pour structure
- **Calibration role:** µm Standardization Benchmark
- **Confidence:** High
- **Notes:** Core identity is fixed grind size rather than grinder setting; pulse structure (5x50g style) maintains even extraction; similar to Picky Chemist but slightly more flexible and less water-dependent; extraction is systematized rather than intuitive

#### MAME Coffee
_Zurich, Switzerland_ · **BALANCED → FULL**

- **Roast style:** Light (competition-level precision)
- **Development bias:** Low development; high clarity with engineered extraction layering
- **Rest curve:** 2-4 weeks typical; stable
- **Primary driver:** Temperature staging + hybrid extraction
- **Extraction purpose:** Maximize clarity and sweetness by separating extraction phases via temperature and immersion/percolation control
- **House style:** Switch/GINA hybrid recipes; alternating low-temp immersion and high-temp percolation phases
- **Brew guide:** [Direct (competition/official) (Collab / Competition)](https://europeancoffeetrip.com/easy-hario-switch-recipe-emi-fukahor/)
- **Recipe baseline:** temp=80-95, dose=17, water=220, ratio=~1:13, time=2:45-3:00, agitation=Medium
- **Primary brewer:** Switch / GINA
- **Filter type:** Cone (hybrid)
- **Extraction intent:** High (21-23%)
- **Failure mode:** Incorrect temp staging collapses structure; too much agitation reduces clarity; mis-timed valve leads to imbalance
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Washed: clarity with layering; Natural: high but controlled; Processed: benefits from staged extraction rather than brute force
- **Brew adjustment method:** Temp + valve timing
- **Calibration role:** Temperature Layering Benchmark
- **Confidence:** High
- **Notes:** Unique system: low-temp immersion (≈80°C) + high-temp percolation (≈95°C); separates extraction phases (acids vs sugars); one of the most controlled hybrid systems; sits beyond Apollon in technical precision

#### Manhattan Coffee Roasters
_Rotterdam, Netherlands_ · **BALANCED → HIGH**

- **Roast style:** Light (modern high-extraction clarity)
- **Development bias:** Low development but high solubility when pushed
- **Rest curve:** 2-4 weeks typical; improves with rest
- **Primary driver:** Temp + grind
- **Extraction purpose:** Maximize clarity, sweetness, and intensity through higher extraction without losing structure
- **House style:** V60 recipes with high temp, fine grind, structured pours; extraction pushed but controlled
- **Brew guide:** [Official (Website)](https://manhattancoffeeroasters.com/brewing-guide/?v=1a13105b7e4e)
- **Recipe baseline:** temp=96-100, dose=15, water=250, ratio=~1:16-1:17, time=2:45-3:30, agitation=Medium-High
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** High (22-24%)
- **Failure mode:** Under-extraction presents as hollow or sharp; insufficient push leads to flat cups
- **Over-extraction tolerance:** High
- **Process sensitivity:** Washed: high extraction; Natural: high→extreme; Processed: benefits from aggressive extraction but requires control
- **Brew adjustment method:** Temp + grind
- **Calibration role:** High Extraction European Benchmark
- **Confidence:** High
- **Notes:** Sits between Sey and Nomad; pushes extraction but maintains structure; less extreme than Dak but clearly beyond Nordic baseline; designed for expressive, high-clarity cups with intensity

#### Nomad Coffee
_Barcelona, Spain_ · **BALANCED → HIGH**

- **Roast style:** Light (modern European clarity with slight extraction push)
- **Development bias:** Moderate-low development; relatively good solubility
- **Rest curve:** 2-4 weeks typical; stable across window
- **Primary driver:** Pour structure + temp
- **Extraction purpose:** Enhance sweetness and body slightly beyond strict clarity while maintaining cleanliness
- **House style:** V60 recipes with structured pours, moderate agitation, slightly higher temp than Nordic baseline
- **Brew guide:** [Official (Website)](https://nomadcoffee.es/en/blogs/at-home/v60)
- **Recipe baseline:** temp=94-98, dose=15, water=240, ratio=~1:16, time=2:45-3:15, agitation=Medium
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Balanced→High (21-22.5%)
- **Failure mode:** Under-extraction presents as muted sweetness; over-extraction presents as light dryness rather than harshness
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Washed: clarity with push; Natural: balanced→high; Processed: responds well to higher temp and controlled agitation
- **Brew adjustment method:** Temp + pour structure
- **Calibration role:** Modern European Benchmark
- **Confidence:** High
- **Notes:** Sits between Prodigal (method-driven) and Hydrangea (adaptive); not extreme like Sey/Dak; pushes slightly beyond Nordic for sweetness and body; good reference for modern European roasting style

#### Picolot (Brian Quan)
_Palo Alto, CA, USA_ · **BALANCED → FULL** · archive: 2 brews

- **Roast style:** Light (modern expressive light roast)
- **Development bias:** Moderate development; relatively high solubility compared to Nordic; designed for expressive cups
- **Rest curve:** ~2-3 weeks typical; accessible earlier than Nordic
- **Primary driver:** Pour structure (flow sequencing)
- **Extraction purpose:** Shape flavor progression (acidity → sweetness → clarity) through staged extraction
- **House style:** Orea Z1 3-pour method; fast-fast-slow pours; long bloom; declining temp; water chemistry baseline
- **Brew guide:** Official
- **Recipe baseline:** temp=93-96, dose=15, water=250, ratio=1:16.7, time=2:30-3:00, agitation=Medium
- **Primary brewer:** Orea Z1
- **Filter type:** Flat-bottom / low-bypass brewer
- **Extraction intent:** Balanced→High (21-23%)
- **Failure mode:** Under-extraction presents as muted sweetness and lack of structure; over-extraction presents as slight astringency but rarely harsh
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Washed: balanced; Natural: benefits from push; Processed: responds strongly to pour structure changes rather than temp
- **Brew adjustment method:** Pour structure + temp
- **Calibration role:** Pour Sequencing Reference
- **Confidence:** High
- **Notes:** Fast-fast-slow structure maps to acidity (first), sweetness (second), clarity (final); final pour controls body vs extension; temperature naturally declines during brew; water is softened (diluted TWW) to allow post-brew adjustment :contentReference[oaicite:0]{index=0}

#### Proud Mary Coffee
_Melbourne, Australia_ · **BALANCED → HIGH**

- **Roast style:** Light (modern specialty)
- **Development bias:** Moderate-low development
- **Rest curve:** 1-3 weeks typical
- **Primary driver:** Pour structure + agitation
- **Extraction purpose:** Drive sweetness and body while maintaining clarity
- **House style:** V60 multi-pour; structured bloom + staged pours; moderate agitation
- **Brew guide:** [Official (Website)](https://proudmarycoffee.com/blogs/coffee-talk/the-best-v60-brew-method)
- **Recipe baseline:** temp=94-96, dose=15, water=250, ratio=~1:16.7, time=2:30-3:00, agitation=Medium
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** Balanced→Sweetness (21-22.5%)
- **Failure mode:** Too coarse = hollow; too fine = bitterness
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Washed: balanced; Natural: strong; Processed: handles higher extraction
- **Brew adjustment method:** Grind
- **Calibration role:** Modern Balanced Benchmark
- **Confidence:** High
- **Notes:** More extraction-forward than Nordic; closer to Prodigal than Sey; designed for sweetness and accessibility vs strict clarity

#### Rogue Wave Coffee
_Edmonton, AB, Canada_ · **BALANCED → FULL**

- **Roast style:** Light (modern process-aware)
- **Development bias:** Moderate development; good solubility across styles
- **Rest curve:** 2-4 weeks typical; stable across window
- **Primary driver:** pour structure + process-adaptive system (secondary) 
- **Extraction purpose:** Adjust extraction based on processing style to maximize clarity or fruit expression
- **House style:** Origami/V60 recipes; variable pours depending on process; moderate agitation; slightly longer brews for naturals
- **Brew guide:** [Official (Website)](https://roguewavecoffee.ca/blogs/brew-guide/recipe-for-natural-processed-coffees)
- **Recipe baseline:** temp=92-96, dose=15, water=240, ratio=~1:16, time=2:45-3:30, agitation=Medium
- **Primary brewer:** Origami / V60
- **Filter type:** Cone + Flat
- **Extraction intent:** Balanced→High (21-23%)
- **Failure mode:** Under-extraction presents as muted fruit (especially naturals); incorrect recipe choice for process leads to imbalance
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Washed: clarity-first; Natural: higher extraction + longer brews; Processed: requires adjusted pour structure and temp
- **Brew adjustment method:** Pour structure + temp
- **Calibration role:** Process-Adaptive Benchmark
- **Confidence:** High
- **Notes:** One of the clearer “process-adaptive” roasters; publishes different recipes per processing style; sits between Hydrangea flexibility and Prodigal methodology; not extreme but intentionally variable

#### September Coffee
_Stittsville, ON, Canada_ · **BALANCED → FULL**

- **Roast style:** Ultra-light (modern high-extraction leaning)
- **Development bias:** Low external development but relatively soluble when pushed; responds strongly to agitation and temp
- **Rest curve:** Highly rest-sensitive; typically improves after ~2-4 weeks, unstable earlier
- **Primary driver:** Rest + agitation
- **Extraction purpose:** Use higher agitation and temperature to unlock sweetness once coffee is sufficiently rested
- **House style:** V60 with high agitation, moderate-to-high temp, standard ratios; extraction scaled based on rest level
- **Brew guide:** Unofficial
- **Recipe baseline:** temp=93-98, dose=15, water=250, ratio=1:16.7, time=2:45-3:15, agitation=High
- **Primary brewer:** V60
- **Filter type:** Cone (Hario/Cafec)
- **Extraction intent:** Balanced→High (22-24%)
- **Failure mode:** Under-rested coffee presents as sharp, harsh, or unintegrated; under-extraction presents as thin despite agitation
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Washed: balanced→high; Natural: high; Processed: responds well to agitation once rested
- **Brew adjustment method:** Temp + agitation
- **Calibration role:** Rest-Sensitive Extraction Benchmark
- **Confidence:** Medium
- **Notes:** Key variable is timing: extraction strategy only works once coffee has degassed; temperature often increased with rest; behaves poorly if pushed too early; sits between Hydrangea flexibility and Sey-style push

#### Sey Coffee
_Brooklyn, NY, USA_ · **FULL EXPRESSION** · archive: 3 brews

- **Roast style:** Ultra-light (Nordic-adjacent)
- **Development bias:** Low external development, high internal clarity; requires extraction to unlock
- **Rest curve:** 3-4 weeks (minimum; often peaks 4-5 weeks)
- **Primary driver:** Structure
- **Extraction purpose:** Reveal structure
- **House style:** Fine grind, boiling water, long bloom, high agitation; designed to push extraction ceiling
- **Brew guide:** [Unofficial (Collab/Reddit)](https://pullandpourcoffee.com/brew-guide/victor-dota-mejorado-ecuador-sey-coffee/)
- **Recipe baseline:** temp=99-100, dose=20, water=340, ratio=1:17, time=3:30-4:30, agitation=High
- **Primary brewer:** Aeropress
- **Filter type:** Immersion or cone (fast filters)
- **Extraction intent:** Extreme (24%+)
- **Failure mode:** Under-extraction presents as sharp, vegetal, hollow, or overly acidic; cups collapse quickly below target EY
- **Over-extraction tolerance:** High but cleaner
- **Process sensitivity:** Washed: Extreme extraction; Natural: High→Extreme; Anaerobic: High (less aggressive than Dak on heavy processing)
- **Brew adjustment method:** Temp + grind
- **Calibration role:** Extraction Ceiling Benchmark
- **Confidence:** High
- **Notes:** Requires rest before evaluation; boiling water and very fine grind are mandatory, not optional; designed to maximize clarity at high EY rather than intensity

#### Substance Café
_Paris, France_ · **BALANCED → FULL** · archive: 2 brews

- **Roast style:** Light (precision-developed, technique-driven)
- **Development bias:** Moderate development with high control; designed to respond to agitation and water chemistry
- **Rest curve:** 2-4 weeks typical; stable across rest window
- **Primary driver:** Agitation + water chemistry
- **Extraction purpose:** Control extraction through agitation patterns and mineral composition rather than temp or grind extremes
- **House style:** V60 with Abaca filters, multi-pour with large spiral agitation, controlled mineral water (GH/KH specific)
- **Brew guide:** [Official (Website)](https://www.substancecafe.com/our-techniques/)
- **Recipe baseline:** temp=90-92, dose=12, water=200, ratio=1:16.7, time=3:00-3:15, agitation=High
- **Primary brewer:** V60
- **Filter type:** Cone (Cafec Abaca; flow consistency important)
- **Extraction intent:** Balanced→High (21-23%)
- **Failure mode:** Under-extraction presents as flat and muted; over-extraction presents as structured dryness rather than bitterness
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Washed: Balanced with agitation; Natural: Balanced→High; Processed: responds strongly to agitation increases
- **Brew adjustment method:** Agitation + water chemistry
- **Calibration role:** Agitation-Control Benchmark
- **Confidence:** High
- **Notes:** One of the most technique-driven roasters; agitation pattern (large spirals to bed edge) is primary lever; mineral water composition (GH/KH) is part of the brew system; does not rely on high temp or extreme grind but achieves high extraction through controlled turbulence

#### Thankfully Coffee
_Auburn, AL, USA_ · **BALANCED → FULL**

- **Roast style:** Light (modern high-extraction leaning)
- **Development bias:** Moderate development, relatively high solubility when pushed
- **Rest curve:** 2-4 weeks typical; bloom length adjusted for freshness
- **Primary driver:** Agitation + time (extended bloom + long brews)
- **Extraction purpose:** Increase sweetness, acidity, and viscosity via long bloom and extended contact time
- **House style:** Origami brewer with cone/flat flexibility; long bloom (1:00–2:00), Melodrip pulses, long total brew times
- **Brew guide:** Direct (social)
- **Recipe baseline:** temp=94-96, dose=18, water=284, ratio=~1:15.8, time=4:00-6:30, agitation=Medium-High
- **Primary brewer:** Origami
- **Filter type:** Cone + Flat-bottom
- **Extraction intent:** High (22-24%)
- **Failure mode:** Under-extraction presents as weak or lacking body; insufficient bloom reduces acidity clarity
- **Over-extraction tolerance:** High
- **Process sensitivity:** Washed: high extraction; Natural: high; Processed: responds strongly to bloom duration and agitation
- **Brew adjustment method:** Agitation + pour structure
- **Calibration role:** Long-Contact Extraction Benchmark
- **Confidence:** Medium
- **Notes:** Bloom duration scales with freshness (longer for fresher coffee); very long brews (up to ~6:45) used to increase extraction; Melodrip reduces harshness while allowing high EY; viscosity intentionally emphasized via tighter ratio

---

### System

#### Noma Coffee
_Copenhagen, Denmark_ · **SYSTEM** · archive: 1 brew

- **Roast style:** Ultra-light
- **Development bias:** Low development
- **Rest curve:** 2-4 weeks
- **Primary driver:** Extraction optimization
- **Extraction purpose:** High clarity + sweetness
- **House style:** Experimental / adaptive
- **Brew guide:** [Official (Website)](https://nomaprojects.com/blogs/journal/noma-kaffe-brew-guide)
- **Recipe baseline:** temp=92-96, dose=15, water=250, ratio=~1:16, time=~3:00, agitation=Medium
- **Primary brewer:** V60 / Kalita
- **Filter type:** Both
- **Extraction intent:** 21-22%
- **Failure mode:** Unstable if poorly dialed
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Varies
- **Brew adjustment method:** Variable control
- **Calibration role:** System reference
- **Confidence:** High
- **Notes:** Flavor-first but method-driven

#### Ona Coffee
_Canberra, Australia_ · **SYSTEM**

- **Roast style:** Light (competition-influenced)
- **Development bias:** Moderate-low; tuned per coffee
- **Rest curve:** 2-4 weeks typical
- **Primary driver:** Per-coffee recipe design
- **Extraction purpose:** Maximize sweetness + structure with clarity
- **House style:** Highly specific recipes per coffee; varied pours, temps, agitation
- **Brew guide:** [Official (Website)](https://onacoffee.com.au/blogs/brewguides)
- **Recipe baseline:** temp=92-98, dose=15-20, water=240-300, ratio=Varies, time=2:30-3:30, agitation=Medium
- **Primary brewer:** V60 / Kalita
- **Filter type:** Cone + Flat
- **Extraction intent:** Balanced→High (21-23%)
- **Failure mode:** Too coarse = weak; too fine = bitterness; recipe-sensitive
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Highly process-sensitive; recipes vary per coffee
- **Brew adjustment method:** Recipe-specific
- **Calibration role:** Competition System Reference
- **Confidence:** High
- **Notes:** Closest to full system design; similar to Subtext but more accessible; wide parameter ranges

#### Rose Coffee
_Zurich, Switzerland_ · **SYSTEM** · archive: 2 brews

- **Roast style:** Ultra-light
- **Development bias:** Low development
- **Rest curve:** 10-30 days
- **Primary driver:** Flow control + pour sequencing
- **Extraction purpose:** Maximize clarity + structure
- **House style:** Competition-derived method
- **Brew guide:** [Official (Competition/Website)](https://honestcoffeeguide.com/brew-recipes/matt-winton-v60-five-pour/)
- **Recipe baseline:** temp=94-96, dose=15, water=250, ratio=1:16-1:17, time=~3:00, agitation=Medium
- **Primary brewer:** V60
- **Filter type:** Cone
- **Extraction intent:** 21-22%
- **Failure mode:** Harsh if over-agitated
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed focus
- **Brew adjustment method:** Pour structure + flow
- **Calibration role:** System calibration
- **Confidence:** High
- **Notes:** Winton 5-pour = core identity

#### Subtext Coffee
_Toronto, ON, Canada_ · **SYSTEM**

- **Roast style:** Ultra-light (data-driven modern Nordic)
- **Development bias:** Low development, moderate solubility; optimized through extraction targets rather than fixed recipes
- **Rest curve:** 3-5 weeks typical; stable across window
- **Primary driver:** Extraction targets (EY/TDS)
- **Extraction purpose:** Hit precise extraction windows (≈21–22%) across different brewers and formats
- **House style:** Multi-brewer recipes (V60, flat-bottom, immersion); structured pours, moderate agitation, explicit EY/TDS targets
- **Brew guide:** [Official (Website)](https://www.subtext.coffee/en-us/pages/brew-guide)
- **Recipe baseline:** temp=96-97, dose=14-16, water=230-265, ratio=Varies, time=2:50-3:30, agitation=Medium
- **Primary brewer:** Multi
- **Filter type:** Cone + Flat + Immersion
- **Extraction intent:** Balanced→High (21-22.5%)
- **Failure mode:** Missing target EY leads to either flat (under) or slightly drying (over) cups; system breaks when variables drift from target window
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Washed: balanced→high; Natural: high; Processed: handled within same EY framework with minor adjustments
- **Brew adjustment method:** Grind + ratio
- **Calibration role:** Extraction Target Benchmark
- **Confidence:** High
- **Notes:** Defines success via TDS (≈1.4–1.45) and EY (≈21–22%); recipes are flexible but targets are fixed; grind ranges are provided per brewer; uses agitation and ratio to converge on target rather than fixed method; most explicitly quantitative roaster in dataset

#### The Picky Chemist
_Chaudfontaine, Belgium_ · **SYSTEM** · archive: 1 brew

- **Roast style:** Ultra-light (precision-driven, lab-style roasting)
- **Development bias:** Low external development, high internal solubility engineered through roast + process alignment
- **Rest curve:** 3-6 weeks; designed to improve with extended rest
- **Primary driver:** Extraction mechanics (grind size + water chemistry + flow control)
- **Extraction purpose:** Maximize extraction efficiency and repeatability through controlled variables
- **House style:** High EY V60 with strict grind target (~450µm), controlled water chemistry, structured pours, moderate agitation
- **Brew guide:** [Official (Product Pages + Visual Brew Cards)](https://en.thepickychemist.com/)
- **Recipe baseline:** temp=94-96, dose=15, water=250, ratio=1:16.7, time=3:30-4:00, agitation=Medium
- **Primary brewer:** V60
- **Filter type:** Cone (Cafec Abaca; optimized for flow + uniformity)
- **Extraction intent:** Extreme (24%+)
- **Failure mode:** Under-extraction presents as sharp, thin, or incomplete; failure occurs when grind is too coarse or temp too low to reach target EY
- **Over-extraction tolerance:** High (but becomes drying/astringent if over-pushed beyond optimal window)
- **Process sensitivity:** Washed: Extreme extraction; Natural: Extreme; Anaerobic/advanced process: Extreme but cleaner than Dak due to controlled variables
- **Brew adjustment method:** Grind + water chemistry + temp
- **Calibration role:** Extraction System Benchmark
- **Confidence:** High
- **Notes:** Core signal is fixed grind size (~450µm) rather than grinder setting; relies on temp, agitation, and water chemistry to hit target EY; water spec (~70-80ppm hardness, low alkalinity) is part of extraction design; brew cards show tight control of time, pours, and grind; unlike Sey/Dak, variability is reduced via system rather than intuition

---

### Varies

#### Moonwake Coffee Roasters
_San Jose, CA, USA_ · **VARIES** · archive: 10 brews

- **Roast style:** Light
- **Development bias:** Moderate
- **Rest curve:** Fruit-forward/Nova: typically 4+ weeks; 
advanced process: sometimes ~2 weeks; 
cocoa-forward: 2 weeks minimum, ideally 3-4+ weeks
- **Primary driver:** Processing
- **Extraction purpose:** Reveal process character while preserving clarity and sweetness
- **House style:** Clarity→Balanced house V60; multi-pour with bed exposure; process-sensitive temp guidance
- **Brew guide:** [Official (Website)](https://moonwakecoffeeroasters.com/pages/brew-guide)
- **Recipe baseline:** temp=90-96, dose=15, water=240, ratio=1:16, time=2:30-3:00, agitation=Medium
- **Primary brewer:** V60
- **Filter type:** Cone (Hario/Cafec)
- **Extraction intent:** Balanced (20-22%) baseline; High (22-24%) for some processed lots
- **Failure mode:** Under-extraction on processed lots at clarity-first settings; washed coffees can read flat if brewed too cool
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: balanced with higher temp bias; 
Processed: lower temp but often still higher extraction need; 
Advanced process lots can shift toward full-expression behavior
- **Brew adjustment method:** Grind + temp
- **Calibration role:** Process Sensitivity Anchor
- **Confidence:** High
- **Notes:** Official guide recommends 90-94°C for light roast, with lower temps for processed coffees and higher temps for washed coffees; house recipe is 60g bloom for 45s then 110g, 180g, 240g; guide also includes more extraction-forward alternate recipes, so the roaster is better treated as process-reactive than fixed-style

#### Scenery Coffee
_London, UK, UK_ · **VARIES** · archive: 1 brew

- **Roast style:** Ultra-light (modern Nordic, adaptive roasting)
- **Development bias:** Low development, moderate solubility; varies by coffee and process
- **Rest curve:** 3-5 weeks typical; many coffees peak ~4 weeks
- **Primary driver:** grind + ratio
- **Extraction purpose:** Match extraction approach to each coffee’s density, process, and roast behavior
- **House style:** Low agitation baseline, long bloom, flat-bottom preference; recipes vary per lot
- **Brew guide:** [Official (Website)](https://scenery.coffee/blogs/behind-the-scenes/the-scenery-filter-recipe)
- **Recipe baseline:** temp=92-96, dose=15, water=240, ratio=~1:16, time=3:00-3:30, agitation=Low
- **Primary brewer:** Flat-bottom brewer
- **Filter type:** Flat-bottom (Orea / Kalita)
- **Extraction intent:** Varies (19-22%)
- **Failure mode:** Mismatch between recipe and coffee leads to either thin (under-extracted) or slightly drying cups
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: clarity-first; Natural: often requires slightly higher extraction; Processed: varies significantly and requires adjustment
- **Brew adjustment method:** Grind + ratio
- **Calibration role:** Adaptive Clarity Benchmark
- **Confidence:** High
- **Notes:** Core philosophy is per-coffee dialing; not a fixed system; long bloom and low agitation are baseline but adjusted; encourages adapting grind and ratio rather than pushing temp or agitation aggressively

#### Strait Coffee
_San Jose, CA, USA_ · **BALANCED / VARIES** · archive: 6 brews

- **Roast style:** Light (balanced modern light roast)
- **Development bias:** Moderate development; more soluble than Nordic, less aggressive than competition-style
- **Rest curve:** ~2-3 weeks typical; accessible earlier than Nordic
- **Primary driver:** Brewer system (immersion + percolation hybrid)
- **Extraction purpose:** Stabilize extraction and improve consistency; use immersion to avoid uneven extraction rather than pushing intensity
- **House style:** Switch-first approach; hybrid immersion + percolation; coarse grind, staged extraction with late agitation
- **Brew guide:** [Direct (Shared (YouTube + site))](https://www.thestraitcoffee.com/v60)
- **Recipe baseline:** temp=92-95, dose=15, water=250, ratio=1:16.7, time=3:30-4:00 (Switch), agitation=Low-Medium (localized agitation during immersion)
- **Primary brewer:** Hario Switch
- **Filter type:** Cone (V60 filters; flow control via valve)
- **Extraction intent:** Balanced (20-22%)
- **Failure mode:** Under-extraction presents as weak or lacking structure; over-extraction presents as dull or slightly muddy rather than harsh
- **Over-extraction tolerance:** Medium-High
- **Process sensitivity:** Washed: balanced via percolation or hybrid; Natural: benefits from immersion for roundness; Dense/high-elevation: hybrid helps avoid channeling; Slow-drawdown coffees benefit from coarser grind and immersion control
- **Brew adjustment method:** Brewer + grind
- **Calibration role:** Hybrid Extraction Reference
- **Confidence:** High
- **Notes:** Core method splits dose and uses staged immersion to control extraction; bloom with partial dose then add remainder and steep; agitation is controlled and intentional (stir/swirl) rather than continuous; designed to reduce channeling and variability rather than maximize extraction; target ~3:30-4:00 with cutoff at 4:00 to avoid over-steeping

#### Switch Coffee
_Tokyo, Japan_ · **BALANCED / VARIES**

- **Roast style:** Light (Japanese modern)
- **Development bias:** Moderate-low development; likely clarity-oriented
- **Rest curve:** 2-3 weeks typical (inferred)
- **Primary driver:** Brewer (hybrid)
- **Extraction purpose:** Leverage immersion + percolation to balance clarity and body
- **House style:** Switch-style brewing emphasis; likely mix of immersion phases with controlled drawdown
- **Brew guide:** Indirect
- **Recipe baseline:** temp=92-96, dose=15, water=240, ratio=~1:16, time=2:30-3:30, agitation=Low-Medium
- **Primary brewer:** Switch
- **Filter type:** Cone (with valve)
- **Extraction intent:** Balanced (20-21%)
- **Failure mode:** Uncontrolled valve timing leads to uneven extraction; under-extraction if percolation phase too short
- **Over-extraction tolerance:** Medium
- **Process sensitivity:** Washed: balanced; Natural: balanced→slightly richer; Processed: benefits from immersion phase control
- **Brew adjustment method:** Valve timing + grind
- **Calibration role:** Hybrid Brewer Baseline
- **Confidence:** Low
- **Notes:** No official recipe; identity tied to Switch-style brewing; sits near Strait but less defined; brewing approach likely determines outcome more than roast style

---

### Self-Roasted

#### Latent
_Home (Roest sample roaster, 100g batches)_ · **SELF-ROASTED** · archive: 4 brews

- **Roast style:** Variable (per-bean, sample-roast experiments)
- **House style:** Roast for elasticity, brew for intensity. Roasts designed to contain many possible cups, not demand one narrow set of conditions.
- **Notes:** Self-roasted lots only; canonical entry preserved across taxonomy refreshes.

---

## Sources

1. **Chris's authored taxonomy CSV** (Google Sheets, 2026-04-23 → 2026-04-24): `Roaster Taxonomy - Roaster Taxonomy.csv` (64 rows × 29 cols) + 5-row addendum (TM / Colibri / Olympia / Rose / Noma) for currently-brewed roasters not in the original CSV pass.
2. **`Roaster Taxonomy - SYSTEM.csv`** (Chris's authored taxonomy supplement, 2026-04-24): definition of the SYSTEM family and contrast with VARIES — the 6th family added in sprint 1h.
3. **Prior `lib/roaster-registry.ts` (21-entry shape, sprints 1h-precursor 2026-04-18 + producer-roaster canonicalization 2026-04-22)**: 21 currently-brewed roasters' `bmrHouseStyle` / `notes` prose preserved verbatim where richer than CSV (Hydrangea El Paraíso lot guidance, Sey Aeropress collab specifics, etc.).
4. **Roaster-published brew guides** (linked per-entry in the Brew guide field): canonical recipe parameters per roaster.
5. **`Roaster_Reference_v3.docx`** (BMR companion, 2026-04-03): authored house-style blurbs that informed the 21-entry rich registry.
6. **55-brew corpus**: archive observations confirm or push back on roaster-published guides (e.g. Shoebox washed lots performing Clarity-First despite BALANCED tag; Hydrangea El Paraíso thermal-shock lots needing 6.4 / 94°C push).

## Changelog

- **2026-04-24 (sprint 1h.1):** First adoption. 70 canonical roasters across 6 families. SYSTEM added as a 6th family per Chris + ChatGPT review. 4 reclassifications from prior 21-entry registry: Rose / Noma / Picky Chemist (→ SYSTEM), TM Coffee (→ CLARITY-FIRST). 20-rename migration 027 collapses short-form DB values to canonical full names. Aliases preserve short-form resolvability.
