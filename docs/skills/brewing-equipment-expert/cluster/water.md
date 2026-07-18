# Water

**Enforcement bar:** Reference / soft. This is a **knowledge doc, not a strict registry** (yet) - no `lib/water-registry.ts` validation mirror, no write-time gate. It codifies the *shape* of water chemistry (the recording schema, the mineral→role mechanism, the build method, the recipe library) so future work has a stable substrate to hang values on.
**Provenance:** Derived from Research Project #6 (water chemistry), 2026-06 → 2026-07 - [Track 1: concentrate post-brew screen](docs/research-projects/water-concentrate-postbrew-screen.md) + [Track 2: single-mineral isolation, Lane B, all 5 HTs resolved](docs/research-projects/water-single-mineral-isolation.md), corroborated by the [2026 WBC water handoff](docs/research-projects/wbc-2026-water-handoff.md).
**Last adopted:** 2026-07-17 (RP6 Phase 2b fold - 2nd-coffee verification on the Gesha Natural; § 6 de-provisionalized).

**Not a comprehensive registry.** Two things live in this doc and they carry **different confidence**:
- **The framework is validated** - the recording schema (§ 1), the build method (§ 4), and the guardrails (§ 5) are coffee-independent, and the anion→phase *interaction structure* (§ 2) is corroborated pre-brew (Track 2 Lane B) AND independently by the 2026 WBC field, **and now replicated on a second, opposite coffee** (Phase 2b, Gesha Natural, 2026-07). The cleanest formulation post-Phase-2b: **chloride works the FRONT of the cup, sulfate scaffolds the BACK - complements, not competitors** (§ 2).
- **The § 6 peak recipe is verified on 2 contrasting coffees** (clarity washed Pink Bourbon + body-forward Gesha Natural): straight MgCl₂ @ GH 44 / KH 0 won on both. What stays coffee-dependent: effect **amplitude** (the PB's sharp divide read as subtlety on the Gesha), **sulfate's cation behavior** (agnostic on PB; split on the Gesha), and *which phase you want to emphasize*. New coffees still re-taste before locking a row - but the peak is a validated default starting point, no longer a single-coffee guess.

**Consumed by the `/brew` flow (RP6 Phase B, 2026-07-04):** at **home**, `/brew` Step 2 consults this doc (the § 3 chart + the § 6 recipe library) to **suggest a per-brew water recipe** for the coffee + confirmed extraction strategy, framed as an offer (the standing daily comp stays the low-effort default). Office brews just record `water_recipe` as-is. Built water is a **home-context lever** (needs the home gear in § 4). Entry points: [brewing-assistant/cluster/operational-guide.md § Step 2](docs/skills/brewing-assistant/cluster/operational-guide.md) + [.claude/skills/brew/SKILL.md](.claude/skills/brew/SKILL.md).

**Physical inventory:** what water gear / reagents / concentrates are actually on the shelf lives in the sibling [water-inventory.md](docs/skills/brewing-equipment-expert/cluster/water-inventory.md) (maintained on acquisition/depletion) - check it before building or suggesting a recipe so both stay in sync with actual stock.

---

## § 1 - Water taxonomy (the recording schema)

The vocabulary for describing/recording any water. This is what a structured `water_recipe` will use (Phase B); today it structures the free-text field.

| Descriptor | What it is | Unit | How measured |
|---|---|---|---|
| **Base** | The starting liquid: distilled / RO / spring / tap | - | label / source |
| **Total ppm (TDS)** | Total dissolved solids | ppm (µS/cm × ~0.5) | Apera **EC60** conductivity meter (calibrate vs the 84 µS/cm standard for the low range built waters sit in) |
| **GH** (general / total hardness) | Divalent-cation load (Ca²⁺ + Mg²⁺) | ppm as CaCO₃ | LaMotte BrewLab titration (Total Hardness) |
| **KH** (alkalinity / buffer) | Bicarbonate buffer capacity | ppm as CaCO₃ | LaMotte BrewLab titration (Total Alkalinity) |
| **Cation split** | Ca²⁺ vs Mg²⁺ within the GH | ratio / ppm each | LaMotte Calcium Hardness; Mg = Total − Ca (see § 5 caveat on high-Mg waters) |
| **Anion split** | Sulfate (SO₄²⁻) vs chloride (Cl⁻) | ppm each | LaMotte Sulfate (turbidimetric) + Chloride (titration) |
| **Buffer source** | Which bicarbonate carries the KH: Na (NaHCO₃) vs K (KHCO₃) | - | by construction |

**GH arithmetic:** a divalent cation contributes GH = (mmol/L) × 100 as CaCO₃. GH 44 ≈ 0.44 mmol/L cation; KH 20 ≈ 0.4 mmol/L bicarbonate. **The anion carries no GH** - GH is a cation measure, so a MgSO₄ water and a MgCl₂ water at the same GH hold the *same cation load* and differ only in anion (that is what makes an isolation test clean).

**Why the split matters more than the total.** Most home setups dial only Mg:Ca ratio + total ppm. RP6 (and the 2026 WBC field) both land on the **sulfate-vs-chloride anion axis** as the lever that actually moves sensory phase - see § 2. Record the anion split, not just the hardness.

---

## § 2 - The mineral→role mechanism (the resolved Track 2 finding, reformulated by Phase 2b)

The crown-jewel model, confirmed pre-brew on the Pink Bourbon and replicated (with reformulation) on the Gesha Natural:

> **The anion sets the phase; the cation gates it.**
> **Phase-of-cup refinement (Phase 2b, 2026-07-17): chloride works the FRONT of the cup (extends attack / sweetness); sulfate scaffolds the BACK (body / structure). They are complements, not competitors.**

- **SULFATE → the BACK of the cup: body / sweetness / structure.** Cation behavior is **coffee-dependent**: agnostic on the Pink Bourbon (MgSO₄ ≈ CaSO₄, MgSO₄ a touch cleaner, CaSO₄ savory/umami); **split on the Gesha** (MgSO₄ deposits sweetness INTO the body; CaSO₄ builds structure UNDER it). Don't carry "sulfate is cation-agnostic" as a general claim - read the pair per coffee.
- **CHLORIDE → the FRONT of the cup: attack / acidity / clarity** (light body) - but **cation-GATED**, not a fixed phase:
  - **Mg + chloride = the bright peak.** MgCl₂ was the single best pre-brew cup on BOTH verification coffees (PB "fresh lime" attack; Gesha clean/crisp with the sweet note blooming as it cools).
  - **Ca + chloride = reject on both coffees, by different failure modes.** PB: lactic/cheesy + oily film. Gesha: chalky/sour/stops-short/inject. **"Avoid Ca+chloride" generalizes; the lactic mechanism label does not** - it's a per-coffee failure expression, not the universal signature.
- **Effect amplitude is coffee-dependent.** The PB's sharp one-is-miles-ahead phase divide read as subtlety on the Gesha. Expect the map's *directions* to hold and its *magnitudes* to vary.
- **It is an interaction, not two clean main effects.** Magnesium flips sign with its anion (MgCl₂ great, MgSO₄ a pleasant body agent; Ca is safe on sulfate but a liability on chloride). **Attribute a result to the pairing, never to the lone ion** - "the sulfate effect" or "the magnesium effect" in isolation is a category error.
- **Cation, net:** **Mg is the safer/better cation** here - decisive with chloride (Mg ≫ Ca), a slight edge with sulfate (Mg ≳ Ca).
- **Buffer (KH): zero-KH is the verified platform default** (Phase 2b upgraded this from a lean to a confirmed result). KH 12 on the Gesha kept the front but **killed the back** ("shortens everything," one-dimensional); KH ~20 read soapy/chalky on the PB. Na-bicarbonate and K-bicarbonate both mute; no clean advantage to either at low KH.

**Cross-reference the 2026 WBC field (divergence now adjudicated, 2026-07-17).** Seven uncoordinated competitors converged on *the anion matters as much as the cation* - the same structure RP6 isolated, strong corroboration. But the field's specific role-labels did not reproduce: the field assigns MgSO₄ = florality and CaCl₂ = body. **Phase 2b ran the adjudicating test the held divergence asked for - a genuinely floral coffee (Gesha Natural, violet fully open at day-19 rest) - and sulfate→florality FAILED again: 0/2 coffees, zero floral lift from MgSO₄ with violet expressing in the control.** The label is **re-scoped, not deprecated outright**: unsupported at full GH-44 strength in Latent testing; a low-fraction (splash-dose) florality effect was never tested and can't be excluded (audit item P6T3-AI-4). CaCl₂ = body also failed on both coffees (reject both times). The *mechanism* (anion sets a phase) agrees with the field; the field's *role-labels* do not transfer to this platform.

---

## § 3 - The water chart (the decision artifact)

The "grind chart" analog: given the direction you want, what you build. Levels are rough starting points (GH ~44 unless noted); verify + tune on the LaMotte (§ 4). **Cation-gating caveats are inline - read them; the chloride rows are cation-specific.**

| Desired direction | Build with | Rough level | Caveats (load-bearing) |
|---|---|---|---|
| **More back-of-cup: body / sweetness / structure** | **Sulfate** - MgSO₄ *or* CaSO₄ | **Splash-dose fraction of GH** (full GH-44 sulfate solo tips to inject - Phase 2b) | Cation behavior is **coffee-dependent** (PB: agnostic; Gesha: MgSO₄ = sweetness-in-body, CaSO₄ = structure-under-body). Best used as a **complement to a chloride front** (the 4:1 blend pattern), not solo. Must be present **during** extraction (§ 5). |
| **More front-of-cup: acidity / attack / clarity** | **Chloride on magnesium** - MgCl₂ | GH ~44 | **Cation-GATED - use Mg, not Ca.** MgCl₂ @ GH 44 / KH 0 is the verified 2-coffee peak; **avoid CaCl₂ solo** (reject on both coffees - PB lactic/oily, Gesha chalky/sour; the failure mode varies, the reject doesn't). |
| **More florality** | **No supported mineral route.** The 2026 WBC field's sulfate→florality label is **0/2 in Latent testing** (incl. a floral Gesha at open rest, full GH strength) | - | **Re-scoped, not dead:** unsupported at full strength; low-fraction sulfate florality untested (P6T3-AI-4). Florality in practice rode overall cup quality (the MgCl₂ peak let the Gesha's violet express), not a dedicated mineral. Don't promise florality from any build. |
| **Amplify the whole cup (subtle lift + finish)** | **Silica** (1 Eidon drop/L) | ~12 ppm; ceiling **<24 ppm** | **RP6-tested (Pink Bourbon, single sitting, PROVISIONAL).** Reads as a low-dose across-the-board *amplifier* ("salting food") + lingering finish - **NOT** the smooth/creamy texture the WBC field labels it (no texture delta on a deliberate hunt). >24 ppm turns harsh/almost-salty. Works on peak + distilled base. |
| **Savory / salinity seasoning** | **NaCl** (very low) | - | **RP6-tested (Pink Bourbon, PROVISIONAL): NO workable dose here.** ≥5 ppm injects savoriness that amplifies the coffee's latent tomato note + lowers perceived sweetness/acidity (the predicted sweetness/roundness did not appear; base-independent - not chloride stacking). Retest only on a savory-compatible coffee. |
| **Longer finish / "peach"** | *Potassium (KCl / K-citrate)* | field-typical | **Hypothesis - NOT Latent-tested; DEFERRED** (wrong mineral — K₂CO₃ — shipped 2026-07-12; remnant arm pending real KCl). The field uses **K as a salt (KCl / K-citrate)** for finish, distinct from the K-**bicarbonate** buffer RP6 disliked - different role, do not conflate. |
| **Mute acidity / add buffer (less bright)** | **Bicarbonate (KH)** - NaHCO₃ | KH low | Flattens acidity/clarity. On a clarity coffee, **minimal/zero KH** is better. KH ~20 reads as a soapy/chalky note on this coffee. |
| **Smoother, balanced amplifier of both axes** | **Blend** chloride-forward + sulfate fraction (MgCl₂+MgSO₄ for sweetness-payload; **4:1 MgCl₂:CaSO₄** for structure) | GH ~44 total | Pairs the bright front (MgCl₂) with a back-of-cup scaffold. Coffee-set: on the clarity PB no blend beat MgCl₂ solo; on the body-wanting Mystic the MgSO₄ blend WON; on the Gesha the 4:1 CaSO₄ blend **tied** the peak with a distinct silky/structured character. MgCl₂ also **rescues** CaCl₂'s lactic edge in-blend. |

**The governing rule for the chart:** *water seasons, it doesn't fix a coffee that lacks the note.* Reach for a row to **reveal** a phase the bean already carries; injecting a phase the coffee doesn't have is the high-variance path (§ 5). And **less is more** - on the clarity Pink Bourbon, the single best cup was a lone bright chloride, not any multi-salt build.

---

## § 4 - Build method

**Single-salt stocks.** Make a **10,000 ppm** stock of each soluble salt (1 g in 100 mL distilled). **Gypsum (CaSO₄) is the exception** - it is low-solubility (~2 g/L), so make a **dilute ~1–2 g/L stock** and **shake it hard before every dose** (it settles invisibly - "looks clear" ≠ "homogeneous"). Fingerprint each stock on the EC60 against its predicted conductivity when first mixed (a reproducibility + reagent-identity check). Keep calcium stocks physically separate from sulfate/bicarbonate stocks.

**Starter recipes - GH 44 / KH 20 per 1 L distilled** (computed starting points; **measure and tune**):

| Target water | Salt for GH 44 (≈0.44 mmol/L cation) | + KH 20 |
|---|---|---|
| Mg-sulfate | MgSO₄·7H₂O ≈ **108 mg/L** | NaHCO₃ ≈ 34 mg/L (or KHCO₃ ≈ 40 mg/L) |
| Mg-chloride | MgCl₂·6H₂O ≈ **90 mg/L** | " |
| Ca-sulfate | CaSO₄·2H₂O ≈ **76 mg/L** (dissolves slow) | " |
| Ca-chloride | CaCl₂·2H₂O ≈ **65 mg/L** | " |

Hydration form is load-bearing - the molar math above assumes the hydrates named (heptahydrate MgSO₄, hexahydrate MgCl₂, dihydrate CaSO₄/CaCl₂). An anhydrous form needs a recompute.

**Precipitation discipline.** Calcium **never shares a concentrate** with sulfate or bicarbonate (it precipitates as gypsum / chalk). With single-salt stocks this is automatic (one salt per bottle). To build a **multi-salt** water, add each salt **sequentially to the dilute brewing water**, never at concentrate strength. This is why a **clean single-salt stock build beats a cloudy commercial concentrate** - precipitation in the bottle selectively strips Ca + carbonate and *unbalances* the recipe's ion ratios (measured in HT5, § 5).

**WATER vs CONCENTRATE labeling (non-negotiable).** Tag every built liquid: a **WATER** is brewed **directly**; a **CONCENTRATE** is **dosed at X mL/L** into distilled. Dosing a finished water as if it were a concentrate re-dilutes it ~400× (this cost RP6 a whole comparison - a finished GH-40 water dosed at the bottled rate ended ≈ distilled). Any cross-product A/B must **match strength** (both finished waters, or both concentrates) - never the dosing *gesture*.

**Measure, don't guess.** Verify every built water on the LaMotte before brewing. **The GH drop-count is cation-specific** - the LaMotte endpoint sharpness differs by cation (Ca titrates clean earlier than Mg), so **do NOT port a drop-lock across cations**; instead require the two waters *within a comparison pair* to read the same drop count on the same kit. Relative constancy across the swap > absolute calibration. Sub-mL doses are the error-prone step - use a fine pipette (0.1–1 mL / 1–5 mL), not the 10 mL syringe, for anything under ~5 mL.

**Gear chain (home):** distiller (base water) → A&D 0.001 g balance (weigh salts) → Apera EC60 conductivity meter + 84/1413 µS standards → LaMotte BrewLab Plus (GH/KH/Ca/sulfate/chloride) + API GH/KH → two micropipettes (0.1–1 mL, 1–5 mL) + 10 mL syringe → magnetic stirrer.

---

## § 5 - Guardrails

- **Less is more.** In the extraction-valid arms, **distilled beat every commercial/finished water tested** (Track 1 Lane C: distilled > TWW > spring > tap; Track 2 Sitting 3: both SBL forms). A built water must clear a real bar: **beat distilled.** Clean single-salt Mg builds are the only waters that have cleared it (MgCl₂ 3.1, MgSO₄ 3.0 vs control 2.0); CaCl₂ and the full 5-salt blends failed it.
- **Post-brew is a bounded proxy.** Dosing a salt into a finished brew gets the *coarse ranking* but **inverts the mechanism** (HT3): MgSO₄ read "muddy/worst" post-brew yet is a pleasant body agent pre-brew (sulfate must be present *during* extraction to express body); CaCl₂ read "bright/clear" post-brew yet goes lactic/oily pre-brew. **Judge a mineral pre-brew for its true role** - the post-brew screen bounds, it does not equal, extraction.
- **Water seasons, it doesn't fix.** It reveals or amplifies a phase the coffee already carries; it can't add complexity the bean lacks. Injecting an absent phase is the high-variance path toward the anti-target.
- **Precipitation unbalances a cloudy concentrate.** A cloudy commercial concentrate (Ca + sulfate/bicarbonate precipitating) delivers *less* Ca + carbonate than nominal **and** the wrong ion ratios - it tastes "not mixed in the right proportion," not merely weaker (HT5: bottled SBL measured ~1 drop GH/KH low + tasted off vs a clean stock build). A clean single-salt build > a cloudy bottle.
- **The failure modes:** over-Mg **over-sharpens** acidity; over-Ca **over-weights** body; **Ca+chloride** turns lactic/oily; **KH flattens** acidity/clarity (and reads soapy/chalky at ~20 on a clarity coffee); over-dosing anything **injects** fast on a clarity coffee (sweet spots are LOW - Track 1 found ~2–3 drops/200 mL, vendor-mid was past peak). Reveal-vs-inject is **dose-dependent**, not a product property.
- **Water freshness is a real variable - re-boiled / days-old kettle water reads flat.** On Helm Mystic (2026-07-10, brew ac916f61), topping a fresh GH44 build onto leftover days-old kettle water of the *same* mix and re-boiling produced a fully flat cup at correct mineral strength - body + finish collapsed, acidity gone. Minerals held (~GH44, since the leftover was the same blend), so the cause was **water freshness (dissolved gas), not concentration**. Build fresh + heat once; dump leftover kettle water. Diagnostic: a flat cup with a *correct* GH read is a freshness tell, not an under-dose - don't chase it with more mineral.

---

## § 6 - Recipe library (VERIFIED)

Per-coffee custom-water recipes. **De-provisionalized 2026-07-17 (Phase 2b):** the straight-MgCl₂ @ GH 44 / KH 0 peak is now **verified on 2 contrasting coffees** (clarity washed Pink Bourbon, 2026-06/07; body-forward Gesha Natural, 2026-07 - reproduced across 3 head-to-head flights), with the Helm Mystic blend row bracketing the body-wanting case. New coffees still get a re-taste before locking a row (amplitude + sulfate-cation behavior are coffee-dependent), but the peak is the validated default starting water.

| Coffee | Water direction | GH | KH | Sulfate | Cation notes | Peak cup | Confidence |
|---|---|---|---|---|---|---|---|
| **Hydrangea Pink Bourbon Washed** (clarity / lime / brown-tea) | **MgCl₂-forward** | ~44 | zero / minimal | minimal / zero | **Avoid calcium**; magnesium is the safe cation | **Straight MgCl₂ @ GH 44** - nothing beat it (best blend 3.0; MgCl₂ solo 3.1; every buffer / Ca / sulfate / full-SBL variant scored lower) | **PROVISIONAL - single-coffee** |
| **Helm Colombia Los Nogales Mystic** (Yellow Bourbon, Anaerobic Washed; clarity/citrus/peach-tea, **body-wanting**) | **MgCl₂ + MgSO₄ blend** | ~44 total | zero | ~half of GH (50/50 cation split) | Magnesium on both axes; **sulfate earns its place here** (unlike the Pink Bourbon) | **Blend @ GH44 > straight MgCl₂ (bright but slightly over-minted/alkaline) > distilled (flat in phase 2)** - velvety, round, more complex; 3-way brewed side-by-side on a fixed recipe (brew ac916f61) | **PROVISIONAL - single-coffee; acidity-pop A/B not isolated** |
| **Hydrangea Gesha Natural DRD El Burro Lot 15** (Lamastus, Chiriquí, Panama; body-forward floral natural, mango/violet/strawberries) | **Primary: straight MgCl₂** · **Variant: 4:1 MgCl₂:CaSO₄** | ~44 | **zero** (KH 12 killed the back - verified) | zero (primary) / 20% share (variant, as CaSO₄) | **Avoid CaCl₂** (chalky/sour/inject here); Mg the safe cation | **Straight MgCl₂ @ GH 44 / KH 0** - clean, crisp, extends the front, sweet note blooms as it cools (reproduced flights 3+4+6). **Variant 4:1 blend** (finished waters 198:50) - silky, structured, holds the back half; **preference-TIED pre-reveal** (3.6 vs 3.5), distinct character. *Ordering provisional - post-reveal lean possibly reveal-biased; re-run blind if it ever matters.* Xbloom V60 fixed recipe: 15 g/248 ml 1:16.5 · EG-1 6.2 · BP no-decline · ~3:36. Rest: markedly better day 19 than day 12 | **VERIFIED (Phase 2b, 19 brews, 2 sittings, semi-blind)** |

**Optional amplifier (single-sitting; verify on other coffees):** +1 drop/L silica (~12 ppm; ceiling <24) lifted the Pink Bourbon's whole cup + finish (§ 3 silica row) - an **optional** add, NOT baked into the peak. Test on other coffees before generalizing.

**Coffee-dependence gate (RESOLVED 2026-07-17, replaced by a scope note):** the predicted phase-flip toward sulfate on a body coffee **did not happen** - straight MgCl₂ retained the crown on the body-forward Gesha (the formal Phase 2b verification track, 19 brews, reproduced). Sulfate upgraded from the PB's nothing-water to a genuine complement (the 4:1 blend tied the peak) but never took it. What remains coffee-dependent: **amplitude** (PB sharp / Gesha subtle), **sulfate cation behavior** (PB agnostic / Gesha split), and blend-vs-solo preference (Mystic's blend WIN vs the Gesha's blend TIE - the informal Mystic row leaned further sulfate than the formal verification did). **Dose-dependence principle (Phase 2b, generalizes § 5's reveal/inject line):** full GH-44 sulfate solo injects; a ~20% fraction reveals - reveal-vs-inject is set by dose, not by which salt.

**Row 2 added 2026-07-10 (Helm Mystic, brew ac916f61):** body-wanting clarity coffee where the MgCl₂+MgSO₄ blend beat straight MgCl₂ (informal single-session read, stays provisional). **Row 3 added 2026-07-17 (Gesha Natural - the formal Phase 2b verification).** The three rows bracket the range: clarity-pure PB → MgCl₂-solo · body-wanting Mystic → sweetness blend · body-forward floral Gesha → MgCl₂-solo primary with a structure-blend variant tied.

---

*Related: the taste-side framing (reveal-not-inject / layered-evolving) lives in [CONTEXT-taste.md](CONTEXT-taste.md); RP6 status + the Phase B queue + the 2nd-coffee verification live in the [research roadmap](docs/skills/research-coordinator/cluster/roadmap.md). Internal links are root-relative per [ADR-0021](docs/adr/0021-root-relative-doc-links.md).*
