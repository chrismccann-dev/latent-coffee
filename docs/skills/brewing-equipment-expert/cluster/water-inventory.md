# Water Inventory

**Enforcement bar:** Reference / soft. A **maintained, living inventory** of the water gear, reagents, and concentrates Chris owns - the physical counterpart to [water.md](docs/skills/brewing-equipment-expert/cluster/water.md) (which is the *knowledge*: taxonomy + chart + build method). `water.md` reasons about what's *possible*; this doc records what's *on the shelf*, so the `/brew` water suggestions and any build stay in sync with actual stock.

**Maintained by:** Chris, on acquisition/depletion. **Last updated:** 2026-07-04 (RP6 codification close - seeded from the compiled water-equipment + concentrate records + the arrived raw-reagent kit). **Sync discipline:** update this doc when an item is acquired, runs out, or is replaced; keep it the single source of truth for "what water stock exists." A `/water-inventory` update skill (mirroring `/freezer-stock` / `/green-inventory`) is a candidate if manual upkeep gets tedious - not built yet (prototype-first).

**⚠️ Verify against records.** This v1 was seeded from the RP6 conversation (the original `Coffee Water Equipment` + `Water Concentrates` TSVs are no longer on hand). The roster is complete + confident; exact model numbers / sizes / SKUs should be spot-checked against your own records and corrected inline.

---

## § 1 - Base water

| Item | Spec | Role |
|---|---|---|
| **Mini Classic CT Countertop Water Distiller** (Pure Water / MyPureWater) | ~0.8 gal (~3 L) per ~3.5 h cycle; glass jar | The ~0-mineral **blank canvas** - source water for every built recipe. |
| Lumen Water Distiller Cleaner & Descaler | consumable | Distiller maintenance (keeps output consistent). |

Distilled is the base for all mineral builds. (Bottled spring / filtered tap are the "natural-water arm" reference points from Track 1, not standing stock.)

## § 2 - Raw single-mineral reagents (the isolation + seasoning kit)

Hydration form is load-bearing for the GH/KH math (see [water.md § 4](docs/skills/brewing-equipment-expert/cluster/water.md)). All food/USP grade.

| Reagent | Form | MW | Role | Notes |
|---|---|---|---|---|
| **Magnesium sulfate** | Epsom, **MgSO₄·7H₂O** (heptahydrate), 99.9% USP | 246.5 | sulfate → body/sweetness phase | stable |
| **Magnesium chloride** | mag flakes, **MgCl₂·6H₂O** (hexahydrate), 98%+ | 203.3 | chloride → bright attack (Mg-gated peak) | **hygroscopic → silica desiccant in jar** |
| **Calcium sulfate** | food-grade **gypsum, CaSO₄·2H₂O** (North Mountain) | 172 | sulfate phase (Ca) | low-solubility → dilute ~1-2 g/L stock, shake before dosing |
| **Calcium chloride** | **CaCl₂·2H₂O** (dihydrate), USP | 147 | chloride (Ca → lactic on this coffee) | **very hygroscopic → silica desiccant in jar** |
| **Sodium bicarbonate** | baking soda, NaHCO₃ (food-grade) | 84 | KH / buffer (Na) | use a fresh box (absorbs odors) |
| **Potassium bicarbonate** | KHCO₃, 99% USP | 100 | KH / buffer (K) | |
| **Potassium chloride** | KCl, 8 oz, 99% food-grade | 74.55 | *K-as-finish* (WBC-seeded track) | arrived 2026-07; mildly hygroscopic |
| **Sodium chloride** | Morton Canning & Pickling salt (pure NaCl) | 58.4 | salinity / seasoning (late + low) | arrived 2026-07 |
| **Silica** | Eidon Liquid Silica Mineral Concentrate, 2 oz | - | *silica-as-texture* (WBC-seeded track) | arrived 2026-07; **already liquid** (dose by drops, very low ~2-4 drops/gal); calcium-silica interaction ("can't go hard on silica with Ca") |

Storage: airtight, cool, dark; food-safe silica-gel desiccant in the **CaCl₂ + MgCl₂** jars (the two hygroscopic salts). Single-salt 10,000 ppm stocks per [water.md § 4](docs/skills/brewing-equipment-expert/cluster/water.md); calcium stocks kept separate from sulfate/bicarbonate.

## § 3 - Commercial mineral concentrates

Blended, black-box (except SBL, which discloses its recipe). Used as finished profiles - see the Track 1 screen for their per-coffee reads.

| Product | Form | Composition | Notes |
|---|---|---|---|
| **Third Wave Water — Classic Light Roast** | dry sticks (12; ~1.5 g each) | MgSO₄ + calcium citrate + NaCl (~150 ppm at 1 stick/gal) | Chris brews it at **~1/3 dilution** (house TWW). A *finished water*, not a concentrate. |
| **DAK Hydro Drops** | liquid, 2-part (2×50 mL) | A = CaCl₂ · B = KHCO₃ + MgSO₄ + MgCl₂ | ~10 ppm/drop/L; 10-12 drops each per L. Keep A/B separate (precipitation). |
| **APAX TONIK** | liquid 100 mL (30,000 ppm) | MgCl₂/CaCl₂/NaCl/NaHCO₃/KHCO₃ | "vibrant/bright/juicy." (Roasted-barley confound P6T1-AI-3 was dropped 2026-07-04.) |
| **APAX JAMM** | liquid 100 mL (30,000 ppm) | MgCl₂/CaCl₂/KCl/KHCO₃/NaHCO₃ | "rich/sweet/creamy." Track-1 best cup @ ~3 drops/200 mL. |
| **APAX LYLAC** | liquid 100 mL (30,000 ppm) | MgSO₄/MgCl₂/KCl/KHCO₃/NaHCO₃/NaCl | "elegant/floral/silky." Sulfate-bearing. |
| **KONFLUX** (APAX for Monogram/Urnex) | liquid 20 mL (30,000 ppm) | CaCl₂/KCl/NaCl/silica/KHCO₃/NaHCO₃ | texture/body; the lone unwelcome inject on the Pink Bourbon (Track 1). |
| **NÉMO** (Aeropress × APAX) | liquid 20 mL (30,000 ppm) | MgCl₂/CaCl₂/KCl/silica/NaCl/KHCO₃/NaHCO₃ | AeroPress competition profile, "heavy/sweet." |
| **Specialty Brew Labs — Juicy & Sweet** | dry packet → 500 mL conc. | **disclosed:** Epsom 10 g / CaCl₂ 3 g / MgCl₂ 4 g / NaHCO₃ 3.4 g / KHCO₃ 4 g → GH 44 / KH 20 | The reconstruction-bridge recipe (Track 2 HT5). |
| **Sooper Water** (Lazy Schnauzer) | dry packet → 500 mL conc. | undisclosed proprietary | 12-12.5 g/L; pourover/filter house profile. |

## § 4 - Measurement + prep gear

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

- **2026-07-04** - Seeded at RP6 codification close. Added the arrived raw-reagent kit (6 isolation salts + KCl + NaCl + Eidon silica) alongside the pre-existing concentrates + gear. KCl / NaCl / silica are for the WBC-seeded future tracks (K-finish / seasoning / silica-texture); not yet used in a track.
