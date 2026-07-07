# Water Inventory

**Enforcement bar:** Reference / soft. A **maintained, living inventory** of the water gear, reagents, and concentrates Chris owns - the physical counterpart to [water.md](docs/skills/brewing-equipment-expert/cluster/water.md) (which is the *knowledge*: taxonomy + chart + build method). `water.md` reasons about what's *possible*; this doc records what's *on the shelf*, so the `/brew` water suggestions and any build stay in sync with actual stock.

**Maintained by:** Chris, on acquisition/depletion. **Last updated:** 2026-07-05 (§ 2 dry minerals + § 3 liquid stocks corrected against the authoritative `Water Minerals` + `Water Mineral Concentrates` TSVs). **Sync discipline:** update this doc when an item is acquired, runs out, or is replaced; keep it the single source of truth for "what water stock exists." A `/water-inventory` update skill (mirroring `/freezer-stock` / `/green-inventory`) is a candidate if manual upkeep gets tedious - not built yet (prototype-first).

**Two-tier mineral supply (the load-bearing structure for `/brew`):**
- **Tier 1 = dry bulk minerals (§ 2)** - the purchased salts. Used to *make stock*, not to dose per brew.
- **Tier 2 = single-mineral liquid stocks (§ 3)** - the 10,000 ppm (gypsum 1,500 ppm) bottles Chris made in the Track 2 session. **Per-brew water building doses from THESE** (drop/mL into distilled to hit a target recipe); refill a stock from its Tier-1 dry salt when it runs low. Each stock's per-1 g-in-1 L contribution (§ 3) is the dosing key.

*(§ 4 commercial concentrates + § 5 gear are still from the earlier RP6 conversation - the Coffee Water Equipment + Water Concentrates TSVs aren't on hand; spot-check those two sections. §§ 1-3 are now exact.)*

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
| **Magnesium chloride** MgCl₂·6H₂O | flakes | **98%+ reagent (NOT food-grade)** | 4 oz ×2 (Jun 20 backup + Jun 25) | Jun 20/25 | ~120 mg/L Mg + 349 chloride; ~492 ppm GH | **very hygroscopic/deliquescent → desiccant + airtight**; confirm suitability for drinking |
| **Calcium chloride** CaCl₂·2H₂O | USP crystals/powder | USP | 500 g | Jun 22 | ~273 mg/L Ca + 482 chloride; ~680 ppm GH | hygroscopic → desiccant |
| **Calcium sulfate (gypsum)** CaSO₄·2H₂O | North Mountain, food-grade | food | 1.5 lb | Jun 22 | ~233 mg/L Ca + 558 sulfate; ~581 ppm GH | **low solubility** - make a dilute stock, verify by EC/GH, don't assume full dissolution |
| **Potassium bicarbonate** KHCO₃ | Loudwolf-style fine powder | 99% USP food | 1 lb (2 bottles) | Jun 25 | ~391 mg/L K + 610 bicarbonate; ~499 ppm alkalinity | buffer/KH source |
| **Potassium chloride** KCl | fine powder | 99% food | 8 oz | Jun 29 | ~524 mg/L K + 476 chloride; no GH/KH | *K-as-finish* future track; strong taste - tiny doses |
| **Sodium chloride** NaCl | Morton Canning & Pickling | pure food | 12 lb (4 lb ×3) | Jun 27 | ~393 mg/L Na + 607 chloride; no GH/KH | salinity/seasoning - late + low |
| **Silica** (Eidon Liquid Silica) | liquid concentrate, glass dropper | supplement | 2 oz | Jun 29 | ~12.5 mg silica/drop (30 drops = 375 mg); no GH/KH | *silica-as-texture* future track; already liquid - dose by drops, very low; Ca-silica interaction |
| **Sodium bicarbonate** NaHCO₃ | household baking soda *(source/grade unconfirmed - add to this sheet)* | food (assumed) | - | - | ~2.71 mg/L Na + 7.19 bicarbonate per… (see § 3 stock) | used to make the NaHCO₃ stock; not separately tracked as a purchased product |

Storage: airtight, cool, dark; food-safe silica-gel desiccant in the **CaCl₂ + both MgCl₂** jars (the hygroscopic ones). Reagent-grade MgCl₂ ≠ food grade - confirm before drinking.

## § 3 - Tier 2: single-mineral liquid stocks (dose from these per brew)

Made in the Track 2 session, distilled base, 1 g salt in 100 g distilled = **10,000 ppm** (gypsum 0.15 g / 100 g = 1,500 ppm). **Dose from these into distilled to build brew water.** The "per 1 g stock in 1 L" column is the dosing key (e.g. to hit GH 44 from the MgCl₂ stock: 44 / 4.87 ≈ **~9 g (≈9 mL) stock per L**). Shake before use; store cool/sealed; label WATER-vs-CONCENTRATE.

| Stock | Formula basis | Made | ppm | Per 1 g stock in 1 L water | Role |
|---|---|---|---|---|---|
| **MgSO₄ stock** | MgSO₄·7H₂O, 1 g/100 g | 2026-06-28 | 10,000 | ~0.98 mg/L Mg + 3.86 sulfate → **~4.0 ppm GH** | Mg + sulfate (body/sweetness phase) |
| **MgCl₂ stock** | MgCl₂·6H₂O, 1 g/100 g | 2026-07-01 | 10,000 | ~1.18 mg/L Mg + 3.45 chloride → **~4.87 ppm GH** | Mg + chloride (the bright peak) |
| **CaCl₂ stock** | CaCl₂·2H₂O, 1 g/100 g | 2026-07-02 | 10,000 | ~2.70 mg/L Ca + 4.77 chloride → **~6.74 ppm GH** | Ca + chloride |
| **CaSO₄ (gypsum) stock** | CaSO₄·2H₂O, 0.15 g/100 g | 2026-07-03 | 1,500 (dilute) | ~0.35 mg/L Ca + 0.84 sulfate → **~0.87 ppm GH** | Ca + sulfate; **shake - settles invisibly** |
| **KHCO₃ stock** | KHCO₃, 1 g/100 g | 2026-06-29 | 10,000 | ~3.87 mg/L K + 6.03 bicarbonate → **~4.94 ppm KH** | K buffer / alkalinity |
| **NaHCO₃ stock** | NaHCO₃, 1 g/100 g | 2026-06-30 | 10,000 | ~2.71 mg/L Na + 7.19 bicarbonate → **~5.89 ppm KH** | Na buffer (source/grade to confirm) |

Not yet stocked: **KCl / NaCl / silica** - future-track reagents (silica is already liquid; make KCl/NaCl stocks from the § 2 dry salts when a track needs them).

## § 4 - Commercial mineral concentrates

*(From the earlier RP6 conversation - spot-check.)* Blended, black-box (except SBL, which discloses its recipe). Used as finished profiles - see the Track 1 screen for their per-coffee reads.

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

*(From the earlier RP6 conversation - spot-check model numbers.)*

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

- **2026-07-05** - §§ 2-3 corrected against the authoritative `Water Minerals` + `Water Mineral Concentrates` TSVs. Fixes: MgCl₂ is **two 4 oz bottles** (Jun 20 backup + Jun 25) at **reagent grade**; added exact grades / sizes / purchase dates + the 1 g/L contribution factors; **added § 3 = the six single-mineral liquid stocks** (the per-brew dosing tier) with their per-1 g-in-1 L GH/KH keys; flagged NaHCO₃ dry source as unconfirmed. §§ 4-5 (concentrates + gear) still pending their source TSVs.
- **2026-07-04** - Seeded at RP6 codification close (v1, from conversation).
