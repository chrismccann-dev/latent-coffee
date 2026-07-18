# Water Inventory

**Enforcement bar:** Reference / soft. A **maintained, living inventory** of the water gear, reagents, and concentrates Chris owns - the physical counterpart to [water.md](docs/skills/brewing-equipment-expert/cluster/water.md) (which is the *knowledge*: taxonomy + chart + build method). `water.md` reasons about what's *possible*; this doc records what's *on the shelf*, so the `/brew` water suggestions and any build stay in sync with actual stock.

**Maintained by:** Chris, on acquisition/depletion. **Last updated:** 2026-07-17 (Phase 2b fold: gypsum stock rebuilt, EC-first verification workflow + fingerprint keys added as § 3a). **Sync discipline:** update this doc when an item is acquired, runs out, or is replaced; keep it the single source of truth for "what water stock exists." A `/water-inventory` update skill (mirroring `/freezer-stock` / `/green-inventory`) is a candidate if manual upkeep gets tedious - not built yet (prototype-first).

**Two-tier mineral supply (the load-bearing structure for `/brew`):**
- **Tier 1 = dry bulk minerals (§ 2)** - the purchased salts. Used to *make stock*, not to dose per brew.
- **Tier 2 = single-mineral liquid stocks (§ 3)** - the 10,000 ppm (gypsum 1,500 ppm) bottles Chris made in the Track 2 session. **Per-brew water building doses from THESE** (drop/mL into distilled to hit a target recipe); refill a stock from its Tier-1 dry salt when it runs low. Each stock's per-1 g-in-1 L contribution (§ 3) is the dosing key.

*(All sections verified 2026-07-05 against Chris's four source TSVs: Water Minerals, Water Mineral Concentrates, Coffee Water Equipment, Water Concentrates.)*

---

## § 1 - Base water

| Item | Spec | Role |
|---|---|---|
| **Mini Classic CT Countertop Water Distiller** (Pure Water / MyPureWater) | ~0.8 gal (~3 L) per ~3.5 h cycle; glass jar | The ~0-mineral **blank canvas** - source water for every built recipe + every stock. |
| Lumen Water Distiller Cleaner & Descaler | consumable | Distiller maintenance (keeps output consistent). |

## § 2 - Tier 1: dry bulk minerals (for making stock)

Hydration form is load-bearing for the GH/KH math (see [water.md § 4](docs/skills/brewing-equipment-expert/cluster/water.md)).

| Mineral | Product in hand | Grade | Size | Bought | 1 g/L → | Notes |
|---|---|---|---|---|---|---|
| **Magnesium sulfate** MgSO₄·7H₂O | Loudwolf-style Epsom, fine crystals | 99.9% USP food | 1 lb (2 bottles) | Jun 25 | ~99 mg/L Mg + 390 sulfate; ~406 ppm GH | dissolves readily |
| **Magnesium chloride** MgCl₂·6H₂O | flakes | **98%+ reagent (NOT food-grade)** | 4 oz ×2 (Jun 20 backup + Jun 25) | Jun 20/25 | ~120 mg/L Mg + 349 chloride; ~492 ppm GH | **very hygroscopic/deliquescent → desiccant + airtight**; NOT for drinking - **food-grade replacement ordered** (next row) |
| **Magnesium chloride (food grade)** MgCl₂·6H₂O | Alliance Chemical FCC/USP hexahydrate | 99-100.5% FCC/USP food | 2 lb | **ordered Jul 8, in transit** | ~120 mg/L Mg + 349 chloride; ~492 ppm GH | On arrival: make fresh 10,000 ppm stock, EC-fingerprint vs the reagent stock (identity check), retire reagent bottles to non-drinking use. Same desiccant discipline. |
| **Calcium chloride** CaCl₂·2H₂O | USP crystals/powder | USP | 500 g | Jun 22 | ~273 mg/L Ca + 482 chloride; ~680 ppm GH | hygroscopic → desiccant |
| **Calcium sulfate (gypsum)** CaSO₄·2H₂O | North Mountain, food-grade | food | 1.5 lb | Jun 22 | ~233 mg/L Ca + 558 sulfate; ~581 ppm GH | **low solubility** - make a dilute stock, verify by EC/GH, don't assume full dissolution |
| **Potassium bicarbonate** KHCO₃ | Loudwolf-style fine powder | 99% USP food | 1 lb (2 bottles) | Jun 25 | ~391 mg/L K + 610 bicarbonate; ~499 ppm alkalinity | buffer/KH source |
| **Potassium chloride** KCl — ⚠️ **RE-ORDERED, not yet in hand** | first order shipped as **K₂CO₃** (wrong item, return requested 2026-07-12); re-ordered food-grade KCl (Amazon B00IMCGIRW, different seller) 2026-07-12, ETA pending | — | (8 oz K₂CO₃ to return) | Jun 29 | K₂CO₃ is a caustic carbonate buffer, NOT KCl | **Verify the label says "potassium chloride / KCl" on arrival** before making a stock. Do NOT use the K₂CO₃. K-as-finish remnant arm (~2-3 cups) unblocks when the real KCl lands. |
| **Sodium chloride** NaCl | Morton Canning & Pickling | pure food | 12 lb (4 lb ×3) | Jun 27 | ~393 mg/L Na + 607 chloride; no GH/KH | salinity/seasoning - late + low |
| **Silica** (Eidon Liquid Silica) | liquid concentrate, glass dropper | supplement | 2 oz | Jun 29 | ~12.5 mg silica/drop (30 drops = 375 mg); no GH/KH | *silica-as-texture* future track; already liquid - dose by drops, very low; Ca-silica interaction |
| **Sodium bicarbonate** NaHCO₃ | Bob's Red Mill Baking Soda | food grade | - | - | ~2.71 mg/L Na + 7.19 bicarbonate (see § 3 stock) | the source for the NaHCO₃ stock |

Storage: airtight, cool, dark; food-safe silica-gel desiccant in the **CaCl₂ + both MgCl₂** jars (the hygroscopic ones). Reagent-grade MgCl₂ ≠ food grade - confirm before drinking.

## § 3 - Tier 2: single-mineral liquid stocks (dose from these per brew)

Made in the Track 2 session, distilled base, 1 g salt in 100 g distilled = **10,000 ppm** (gypsum 0.15 g / 100 g = 1,500 ppm). **Dose from these into distilled to build brew water.** The "per 1 g stock in 1 L" column is the dosing key (e.g. to hit GH 44 from the MgCl₂ stock: 44 / 4.87 ≈ **~9 g (≈9 mL) stock per L**). Shake before use; store cool/sealed; label WATER-vs-CONCENTRATE.

| Stock | Formula basis | Made | ppm | Per 1 g stock in 1 L water | Role |
|---|---|---|---|---|---|
| **MgSO₄ stock** | MgSO₄·7H₂O, 1 g/100 g | 2026-06-28 | 10,000 | ~0.98 mg/L Mg + 3.86 sulfate → **~4.0 ppm GH** | Mg + sulfate (body/sweetness phase) |
| **MgCl₂ stock** | MgCl₂·6H₂O, 1 g/100 g | 2026-07-01 (+ fresh batch 2026-07-12, EC 9.32 mS ≡ old 9.31) | 10,000 | ~1.18 mg/L Mg + 3.45 chloride → **~4.87 ppm GH** | Mg + chloride (the bright peak) |
| **CaCl₂ stock** | CaCl₂·2H₂O, 1 g/100 g | 2026-07-02 | 10,000 | ~2.70 mg/L Ca + 4.77 chloride → **~6.74 ppm GH** | Ca + chloride |
| **CaSO₄ (gypsum) stock** | CaSO₄·2H₂O, 0.75 g/500 g | **rebuilt 2026-07-17** (old bottle 1401 µS vs new 1375 µS - identity ✓, old retired) | 1,500 (dilute) | ~0.35 mg/L Ca + 0.84 sulfate → **~0.87 ppm GH** | Ca + sulfate; **shake - settles invisibly**. ⚠️ **Fastest-exhausting stock**: dilute 1,500 ppm burns ~25-30 g per 500-600 ml GH-44 build (~10× the 10 k stocks) - **rebuild from § 2 dry when below ~100 g** (0.75 g dry / 500 g distilled, magnetic stir 15-20+ min, EC-fingerprint new vs old within a few %) |
| **KHCO₃ stock** | KHCO₃, 1 g/100 g | 2026-06-29 | 10,000 | ~3.87 mg/L K + 6.03 bicarbonate → **~4.94 ppm KH** | K buffer / alkalinity |
| **NaHCO₃ stock** | NaHCO₃, 1 g/100 g | 2026-06-30 | 10,000 | ~2.71 mg/L Na + 7.19 bicarbonate → **~5.89 ppm KH** | Na buffer (from Bob's Red Mill baking soda) |
| **NaCl stock** | NaCl, 1.002 g/100 g | 2026-07-12 | 10,000 (EC 15.65 mS) | ~3.9 mg/L Na + 6.1 mg/L Cl → no GH/KH | salinity/seasoning (coffee-dependent - no workable dose on the Pink Bourbon; see water.md § 3) |

Not yet stocked: **KCl** - real KCl not in hand (first order shipped as K₂CO₃; food-grade KCl re-ordered 2026-07-12, ETA pending, verify label on arrival). NaCl now stocked (above); silica is already liquid (Eidon, dose by drops - no dilution concentrate; drop-dosing at ~1 drop/L is the standing method).

### § 3a - Built-water verification workflow (EC-first, Phase 2b 2026-07-17)

- **EC60 cal vs the 84 µS low-range standard at EVERY sitting start, no exceptions** - the meter drifted -36% silently in 2 idle days (Phase 2b sitting 1); without the cal the whole session's QC is corrupt.
- **First build of any recipe = LaMotte + EC.** The LaMotte proves the GH; the EC reading becomes the recipe's recorded **fingerprint**.
- **Rebuilds of a known recipe = EC-only vs fingerprint (±5% band).** LaMotte stays mandatory for **multi-salt builds** and **any KH-bearing water**.
- **Why it earns its keep:** EC-vs-fingerprint doesn't just detect a bad build, it **diagnoses the mistake** - 3/3 Phase 2b build errors identified to the gram from the readings alone (settled gypsum under-delivery · crossed water amounts · crossed doses); zero reached a brewed cup.

**EC fingerprints @ GH 44 (built waters, distilled base):** MgCl₂ **146-150 µS** · MgSO₄ **151-154** · CaCl₂ **169.6** · CaSO₄ **148-155** (gypsum characteristically reads a few % low - CaSO₄⁰ ion pairing; don't chase EC parity with the chlorides). KH-12 add on MgCl₂ water: LaMotte alkalinity endpoint ~drop 1-2.

## § 4 - Commercial mineral concentrates

Blended, black-box (except SBL, which discloses its recipe). Used as finished profiles - see the Track 1 screen for their per-coffee reads. **Dosing keys:** APAX concentrates (30,000 ppm) ≈ 1 drop 0.065 g ≈ 2 ppm/L (45 drops / 3 g = 90 ppm/L); DAK ≈ 0.0625 mL/drop ≈ 10 ppm/L (both bottles together); SBL 500 mL conc. dosed 2.5 mL/L → GH 44 / KH 20.

| Product | Form | Composition | Notes |
|---|---|---|---|
| **Third Wave Water — Classic Light Roast** | dry sticks (12; ~1.5 g each) | MgSO₄ + calcium citrate + NaCl (~150 ppm at 1 stick/gal) | Chris brews it at **~1/3 dilution** (house TWW). A *finished water*, not a concentrate. |
| **DAK Hydro Drops** | liquid, 2-part (2×50 mL) | A = CaCl₂ · B = KHCO₃ + MgSO₄ + MgCl₂ | ~10 ppm/drop/L; 10-12 drops each per L. Keep A/B separate (precipitation). |
| **APAX TONIK** | liquid 100 mL (30,000 ppm) | MgCl₂/CaCl₂/NaCl/NaHCO₃/KHCO₃ | "vibrant/bright/juicy." (Roasted-barley confound P6T1-AI-3 dropped 2026-07-04.) |
| **APAX JAMM** | liquid 100 mL (30,000 ppm) | MgCl₂/CaCl₂/KCl/KHCO₃/NaHCO₃ | "rich/sweet/creamy." Track-1 best cup @ ~3 drops/200 mL. |
| **APAX LYLAC** | liquid 100 mL (30,000 ppm) | MgSO₄/MgCl₂/KCl/KHCO₃/NaHCO₃/NaCl | "elegant/floral/silky." Sulfate-bearing. |
| **KONFLUX** (APAX for Monogram/Urnex) | liquid 20 mL (30,000 ppm) | CaCl₂/KCl/NaCl/silica/KHCO₃/NaHCO₃ | texture/body; the lone unwelcome inject on the Pink Bourbon (Track 1). |
| **NÉMO** (Aeropress × APAX) | liquid 20 mL (30,000 ppm) | MgCl₂/CaCl₂/KCl/silica/NaCl/KHCO₃/NaHCO₃ | AeroPress competition profile, "heavy/sweet." |
| **Specialty Brew Labs — Juicy & Sweet** | dry packet → 500 mL conc. | **disclosed:** Epsom 10 g / CaCl₂ 3 g / MgCl₂ 4 g / NaHCO₃ 3.4 g / KHCO₃ 4 g → GH 44 / KH 20 | The reconstruction-bridge recipe (Track 2 HT5). |
| **Sooper Water** (Lazy Schnauzer) | dry packet → 500 mL conc. | undisclosed proprietary | 12-12.5 g/L; pourover/filter house profile. |

## § 5 - Measurement + prep gear

| Item | Spec | Use |
|---|---|---|
| **A&D EJ-123 compact balance** | 120 g cap, **0.001 g** readability | weigh dry salts + concentrate doses by mass |
| **Apera EC60** pocket tester | conductivity / TDS / salinity + temp, ±1% F.S. | stock fingerprinting + water QC |
| **Apera 84 µS/cm** calibration standard | 8 oz | **low-range EC cal** (the load-bearing one for soft coffee water) |
| **Apera 1413 µS/cm** calibration standard | 8 oz | high-range EC cal |
| **Hanna HI7031L 1413 µS/cm** conductivity solution | 500 mL | backup 1413 standard |
| **LaMotte BrewLab Basic** (7189-02) | wet chemistry: Ca hardness + Mg hardness (separate) + alkalinity + total hardness + sulfate + chloride + sodium | **built-water verification** ("measure, don't guess") |
| **API GH & KH Test Kit** (2.5 oz) | drop-count GH/KH | fast daily sanity check |
| **4E's micropipettes** ×2 | 100-1000 µL + 1-5 mL, adjustable | precise multi-salt builds (use over the syringe) |
| **INTLLAB magnetic stirrer** | max 3000 mL, stir-only (no heat) | dissolve stocks / homogenize |
| **Glass dropper bottles** | 4× 30 mL (1 oz, 1 mL dropper) + 4× 120 mL (4 oz), amber/clear | stock + concentrate storage (label: salt · ppm · date; WATER vs CONCENTRATE) |

Full gear-chain rationale + the build discipline (precipitation, WATER-vs-CONCENTRATE labeling, cation-specific drop-locks) live in [water.md § 4](docs/skills/brewing-equipment-expert/cluster/water.md).

---

## Update log

- **2026-07-17** - Phase 2b fold: **gypsum stock rebuilt** (0.75 g dry / 500 g distilled; old 1401 µS vs new 1375 - identity ✓, old bottle retired) + rebuild-threshold note (dilute stock exhausts ~10× faster than the 10 k stocks; rebuild below ~100 g). Added **§ 3a EC-first verification workflow** (cal every sitting · first build = LaMotte+EC fingerprint · rebuilds = EC-only ±5% · LaMotte mandatory for multi-salt + KH) + the GH-44 built-water EC fingerprint keys. Source: RP6 Phase 2b (Gesha verification), lessons P6T3-N2/N5, audit item P6T3-AI-2.
- **2026-07-12** - KCl re-ordered: food-grade KCl (Amazon B00IMCGIRW, different seller than the failed order) ordered after the first shipped K₂CO₃; § 2 row updated to "re-ordered, not yet in hand," verify label on arrival. Silica confirmed drop-dosed neat (no dilution concentrate) per operator preference.
- **2026-07-12** - Modifier-screen fold: added the **NaCl 10 k stock** (§ 3) + a fresh MgCl₂-batch note; **corrected the § 2 KCl row → the ordered item shipped as K₂CO₃** (caustic carbonate, NOT KCl - do not use; real KCl re-source pending). Silica + NaCl findings folded to `water.md § 3` (silica = low-dose amplifier, not texture; NaCl = no workable dose on the Pink Bourbon). KCl-as-finish arm deferred to a remnant re-run.
- **2026-07-08** - Food-grade MgCl₂ ordered (Alliance Chemical FCC/USP hexahydrate, 2 lb) per the second-expert review's R5 safety flag ([review](docs/audits/research/rp6-water-second-expert-review-2026-07-08.md)); reagent-grade bottles marked not-for-drinking, retire on arrival.
- **2026-07-05** - Fully verified against all four source TSVs. §§ 2-3: MgCl₂ is **two 4 oz bottles** (Jun 20 backup + Jun 25) at **reagent grade**; exact grades / sizes / dates + 1 g/L factors; **added § 3 = the six single-mineral liquid stocks** (the per-brew dosing tier) with their per-1 g-in-1 L GH/KH keys. §§ 4-5 (concentrates + gear) confirmed against the Coffee Water Equipment + Water Concentrates TSVs (added concentrate dosing keys). NaHCO₃ source confirmed: **Bob's Red Mill Baking Soda** (food grade). Inventory now fully reconciled.
- **2026-07-04** - Seeded at RP6 codification close (v1, from conversation).
