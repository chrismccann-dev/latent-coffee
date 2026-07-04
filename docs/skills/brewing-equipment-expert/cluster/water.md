# Water

**Enforcement bar:** Reference / soft. This is a **knowledge doc, not a strict registry** (yet) - no `lib/water-registry.ts` validation mirror, no write-time gate. It codifies the *shape* of water chemistry (the recording schema, the mineral→role mechanism, the build method, the recipe library) so future work has a stable substrate to hang values on.
**Provenance:** Derived from Research Project #6 (water chemistry), 2026-06 → 2026-07 - [Track 1: concentrate post-brew screen](docs/research-projects/water-concentrate-postbrew-screen.md) + [Track 2: single-mineral isolation, Lane B, all 5 HTs resolved](docs/research-projects/water-single-mineral-isolation.md), corroborated by the [2026 WBC water handoff](docs/research-projects/wbc-2026-water-handoff.md).
**Last adopted:** 2026-07-04 (RP6 codification Phase A + Phase B `/brew` wiring).

**Not a comprehensive registry / values are single-coffee-provisional.** Two things live in this doc and they carry **different confidence**:
- **The framework is validated** - the anion→phase mechanism (§ 2), the recording schema (§ 1), the build method (§ 4), and the guardrails (§ 5) are coffee-independent and confirmed pre-brew (Track 2 Lane B, all five hypothesis tests resolved).
- **The specific directional values + the recipe seed (§ 6) are Pink-Bourbon-only** - one coffee, pending a 2nd-coffee replication. Which *phase you want* is coffee-dependent (a clarity coffee wants the chloride attack; a body-wanting coffee may flip toward sulfate). The structure codifies now; the recipe values verify later. Do not port the § 6 seed to a new coffee without re-tasting.

**Consumed by the `/brew` flow (RP6 Phase B, 2026-07-04):** at **home**, `/brew` Step 2 consults this doc (the § 3 chart + the § 6 recipe library) to **suggest a per-brew water recipe** for the coffee + confirmed extraction strategy, framed as an offer (the standing daily comp stays the low-effort default). Office brews just record `water_recipe` as-is. Built water is a **home-context lever** (needs the home gear in § 4). Entry points: [brewing-assistant/cluster/operational-guide.md § Step 2](docs/skills/brewing-assistant/cluster/operational-guide.md) + [.claude/skills/brew/SKILL.md](.claude/skills/brew/SKILL.md).

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

## § 2 - The mineral→role mechanism (the resolved Track 2 finding)

The crown-jewel model, confirmed pre-brew on the Pink Bourbon:

> **The anion sets the phase; the cation gates it.**

- **SULFATE → body / sweetness / creaminess / texture.** Roughly **cation-agnostic** - MgSO₄ and CaSO₄ both deliver the back/body phase (MgSO₄ a touch cleaner; CaSO₄ adds a savory/umami "component" quality). Sulfate's phase role is stable across the cation.
- **CHLORIDE → attack / acidity / florality / clarity** (light body) - but **cation-GATED**, not a fixed phase:
  - **Mg + chloride = the bright peak.** MgCl₂ was the single best pre-brew cup on this coffee (the "fresh lime" first-phase attack).
  - **Ca + chloride = muted / lactic / oily.** CaCl₂ was the *worst* cup - a lactic/cheesy quality + an oily-water film, below even distilled. Same anion, opposite outcome, set by the cation.
- **It is an interaction, not two clean main effects.** Magnesium flips sign with its anion (MgCl₂ great, MgSO₄ a pleasant body agent; Ca is safe on sulfate but a liability on chloride). **Attribute a result to the pairing, never to the lone ion** - "the sulfate effect" or "the magnesium effect" in isolation is a category error.
- **Cation, net:** **Mg is the safer/better cation** here - decisive with chloride (Mg ≫ Ca), a slight edge with sulfate (Mg ≳ Ca).
- **Buffer (KH):** bicarbonate **mutes acidity / flattens clarity** (small margin at low levels; the effect is real but not a cliff). Minimal/zero KH is favored on a clarity coffee. Na-bicarbonate and K-bicarbonate both mute; RP6 found no clean advantage to either at low KH.

**Cross-reference the 2026 WBC field (a held divergence).** Seven uncoordinated competitors converged on *the anion matters as much as the cation* - the same structure RP6 isolated, strong corroboration. **BUT the field's specific role-labels did not reproduce on the Pink Bourbon:** the field assigns MgSO₄ = florality and CaCl₂ = body; RP6 got the **reverse assignment** - sulfate = body, chloride = florality/attack (and CaCl₂ = lactic, not clean body). The *mechanism* (anion sets a phase) agrees; the *role-labels are coffee-dependent*. Bounded further by the Pink Bourbon being a lime/brown-tea profile, not a heavily floral one (the florality axis is under-expressed on this base). Logged as a divergence to **hold, not resolve** - a genuinely floral coffee may adjudicate it.

---

## § 3 - The water chart (the decision artifact)

The "grind chart" analog: given the direction you want, what you build. Levels are rough starting points (GH ~44 unless noted); verify + tune on the LaMotte (§ 4). **Cation-gating caveats are inline - read them; the chloride rows are cation-specific.**

| Desired direction | Build with | Rough level | Caveats (load-bearing) |
|---|---|---|---|
| **More body / sweetness / creaminess** | **Sulfate** - MgSO₄ *or* CaSO₄ | GH ~44 | Cation-agnostic. MgSO₄ slightly cleaner; CaSO₄ adds a savory/umami note. Must be present **during** extraction (dosing sulfate post-brew only muddies - § 5). |
| **More acidity / attack / clarity / florality** | **Chloride on magnesium** - MgCl₂ | GH ~44 | **Cation-GATED - use Mg, not Ca.** MgCl₂ is the bright peak; **Ca+chloride goes muted/lactic/oily** (avoid CaCl₂ solo). |
| **Smoother / rounder texture** | *Silica (~10 ppm)* | ~10 ppm add | **Hypothesis - WBC-seeded, NOT Latent-tested.** 4 competitors used silica for "smooth/creamy/round" (→ "violet"). Not in the RP6 kit yet. |
| **Longer finish / "peach"** | *Potassium (KCl / K-citrate)* | field-typical | **Hypothesis - WBC-seeded, NOT Latent-tested.** The field uses **K as a salt (KCl / K-citrate)** for finish. Distinct from the K-**bicarbonate** buffer RP6 tested and disliked - different role, do not conflate. Not in the kit. |
| **Mute acidity / add buffer (less bright)** | **Bicarbonate (KH)** - NaHCO₃ | KH low | Flattens acidity/clarity. On a clarity coffee, **minimal/zero KH** is better. KH ~20 reads as a soapy/chalky note on this coffee. |
| **Smoother, balanced amplifier of both axes** | **Blend** MgCl₂ + MgSO₄ | GH ~44 total | Pairs the bright attack (MgCl₂) with the body (MgSO₄) - the best *blend*, but on a clarity coffee it did **not** beat MgCl₂ alone. MgCl₂ also **rescues** CaCl₂'s lactic edge in-blend. |

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

- **Less is more.** On the clarity Pink Bourbon, **distilled beat every built + natural water** in the extraction-valid arm (Track 1 Lane C: distilled > TWW > spring > tap). A built water must clear a real bar: **beat distilled.** Most builds don't.
- **Post-brew is a bounded proxy.** Dosing a salt into a finished brew gets the *coarse ranking* but **inverts the mechanism** (HT3): MgSO₄ read "muddy/worst" post-brew yet is a pleasant body agent pre-brew (sulfate must be present *during* extraction to express body); CaCl₂ read "bright/clear" post-brew yet goes lactic/oily pre-brew. **Judge a mineral pre-brew for its true role** - the post-brew screen bounds, it does not equal, extraction.
- **Water seasons, it doesn't fix.** It reveals or amplifies a phase the coffee already carries; it can't add complexity the bean lacks. Injecting an absent phase is the high-variance path toward the anti-target.
- **Precipitation unbalances a cloudy concentrate.** A cloudy commercial concentrate (Ca + sulfate/bicarbonate precipitating) delivers *less* Ca + carbonate than nominal **and** the wrong ion ratios - it tastes "not mixed in the right proportion," not merely weaker (HT5: bottled SBL measured ~1 drop GH/KH low + tasted off vs a clean stock build). A clean single-salt build > a cloudy bottle.
- **The failure modes:** over-Mg **over-sharpens** acidity; over-Ca **over-weights** body; **Ca+chloride** turns lactic/oily; **KH flattens** acidity/clarity (and reads soapy/chalky at ~20 on a clarity coffee); over-dosing anything **injects** fast on a clarity coffee (sweet spots are LOW - Track 1 found ~2–3 drops/200 mL, vendor-mid was past peak). Reveal-vs-inject is **dose-dependent**, not a product property.

---

## § 6 - Recipe library (SEED)

Per-coffee custom-water recipes. **The end-state is a library**; this is row one. Values are **PROVISIONAL - single-coffee (RP6, one coffee)**; the coffee-dependence gate holds. Future coffees append as rows.

| Coffee | Water direction | GH | KH | Sulfate | Cation notes | Peak cup | Confidence |
|---|---|---|---|---|---|---|---|
| **Hydrangea Pink Bourbon Washed** (clarity / lime / brown-tea) | **MgCl₂-forward** | ~44 | zero / minimal | minimal / zero | **Avoid calcium**; magnesium is the safe cation | **Straight MgCl₂ @ GH 44** - nothing beat it (best blend 3.0; MgCl₂ solo 3.1; every buffer / Ca / sulfate / full-SBL variant scored lower) | **PROVISIONAL - single-coffee** |

**Coffee-dependence gate (why this stays provisional):** the Pink Bourbon is a clarity/citrus coffee, so the **chloride attack** plays to its strength. A **body-wanting coffee could flip** toward sulfate or a MgCl₂+MgSO₄ blend - the anion→phase *mechanism* (§ 2) is a physical constant, but *which phase you want* is set by the coffee. That is exactly what a 2nd-coffee replication (ideally a body-wanting coffee) verifies. Do not generalize this row.

---

*Related: the taste-side framing (reveal-not-inject / layered-evolving) lives in [CONTEXT-taste.md](CONTEXT-taste.md); RP6 status + the Phase B queue + the 2nd-coffee verification live in the [research roadmap](docs/skills/research-coordinator/cluster/roadmap.md). Internal links are root-relative per [ADR-0021](docs/adr/0021-root-relative-doc-links.md).*
