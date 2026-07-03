# Single-Mineral Isolation — Clean-Reagent Cohort (Research Project #6, Track 2 / Phase 2)

*Coffee Research · Latent · Research Project*

**Version:** 0.1 (DRAFT — Coordinator-authored, pre-execution)
**Date drafted:** 2026-06-21
**Date executed:** 2026-06-28 (Sitting 1 in progress — Step 0)
**Status:** 🟢 **EXECUTING — Assistant session, Sitting 1.** Step 0 calibration arc underway.
**Platform:** xBloom (controlled-pour) driving a Hario V60 dripper, fixed no-modulation recipe
**Method:** HYBRID — post-brew single-salt direction screen (Lane A) → pre-brew constant-GH isolation on standouts (Lane B)
**Coffee:** Hydrangea Pink Bourbon Washed (same coffee as Track 1 — still single-coffee; codification stays gated on a 2nd coffee)

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE (Lesson #40, Filter-arc Project #3 substrate)

**This protocol has a non-negotiable role split. Read this BEFORE Step 0.**

You are the **Research Assistant** for this track. Your job is **execution + handoff brief production.** Your job is **NOT substrate integration.**

**DO NOT:**
- Edit `lib/*-registry.ts` files
- Edit `docs/skills/*/cluster/*.md` files
- Edit ADR files
- `git commit` / `git push` SUBSTRATE edits, merge to main, or `gh pr create` — **EXCEPT** the one authorized archive-persist commit of this protocol doc (see DO list + [`role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md) § Archive persistence)
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)
- Continue past the handoff brief to "finish the job"

**DO:**
- Read this protocol doc in full BEFORE Step 0
- Walk Chris through Step 0 (inventory + hydration-form verification + single-salt stock prep + GH/KH math check + base baseline + SBL-reconstruction rig-validation + coffee-budget check + semi-blind)
- Run tasting cups one-at-a-time (Lesson #7 tool-call-per-cup pacing)
- Capture friction + new lessons + audit items inline (the doc IS the archive — Lesson #12)
- Produce a handoff brief at the end (per [`handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md))
- **Commit + push the archive doc (this protocol doc) to your session branch at termination; record branch + SHA in the brief's `Archive location:` header** (the authorized archive-persist exception)
- **TERMINATE the session after the handoff brief.** Do not continue to substrate commits.

**Why this rule exists:** Filter-arc Project #3's cold execution session over-stepped its role-split — attempted registry edits + ran tsc + reported "files modified, build clean" without committing; the edits were lost. Lesson #40 is non-negotiable. Full primitive doc: [`role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md).

---

## Project Context

This is **Track 2 of Research Project #6 (water chemistry)** and the start of **Phase 2 — DIY single-mineral isolation.** Track 1 (the Phase 1 concentrate post-brew screen) closed 2026-06-21; its archive is [water-concentrate-postbrew-screen.md](docs/research-projects/water-concentrate-postbrew-screen.md).

**What Track 1 established (carry these in):**
- **Less is more on this clarity coffee.** In Lane C (pre-brew, extraction-valid), plain distilled beat TWW + both natural waters — nothing beat the zero-mineral control. Any built water has to clear a real bar: beat distilled.
- **The reveal lives on the sulfate axis.** The two sulfate-bearing products (LYLAC, SBL) tied at the top; SBL was the single best reveal. The owned concentrate set is chloride-forward, which is exactly why Phase 2's clean kit matters — it's the only way to drive the sulfate side.
- **Sweet spots are LOW** (~2–3 drops/200 mL; vendor-mid was past peak). Phase 2 ladders + GH targets start low.
- **Reveal vs inject is DOSE-DEPENDENT, not a product property** (JAMM injected at 7, revealed at 3). Phase 2 inherits this: an ion's "direction" is dose-zoned.
- **Best cup = a low-dose likeable inject** (JAMM @ 3) over the cleanest reveal (LYLAC @ 2).

**Operator-locked thesis (HOLD BOTH).** Reveal-not-inject is the KNOWLEDGE frame (map what each move does, at each dose), NOT a purity rule. The objective is the best cup; the value is knowing each lever's effect so the choice is intentional. Working preference: scaffold off what the coffee already has over injecting what isn't there — but likeable injects are valid. (P6T1-AI-2 was reframed by the dose-dependence finding; the candidate CONTEXT-taste refinement "reveal/inject is dose-zoned, not product-typed" is parked until a 2nd coffee confirms it.)

**Why Phase 2 now (operator call, 2026-06-21):** all six raw reagents arrived; the 2nd-coffee replication needs a purchase + rest, so it's deferred. Phase 2 runs on the same Pink Bourbon — still single-coffee, so the **substrate-fold stays gated**. Phase 2's payoff is **mechanism** (what each individual ion does), not cross-coffee codification.

**Phase shape from here:** Phase 2 = single-ion isolation (this track + siblings) → eventually a 2nd-coffee replication to codify the difference-vocabulary → per-coffee water recipe library. The end game is competition-grade custom water (huge WBC payoff — most champions arrive at custom water).

---

## The Isolation Mechanism (load-bearing — read carefully)

**A single salt is not a single ion.** Every salt dissolves into a cation + an anion (Arrhenius). MgSO₄ = Mg²⁺ + sulfate; CaCl₂ = Ca²⁺ + chloride. So to isolate the effect of ONE factor you hold everything else constant and vary that one factor:

- **Isolate the anion** (sulfate vs chloride): same cation, same GH, swap the anion. E.g. MgSO₄ water vs MgCl₂ water, both at GH 44.
- **Isolate the cation** (Mg vs Ca): same anion, same GH, swap the cation. E.g. MgSO₄ vs CaSO₄, both at GH 44.
- **Isolate the buffer** (Na vs K bicarbonate; KH level): hold GH constant, vary KH source / KH amount.

This is the **2×2 (cation × anion) at constant GH**, plus a **buffer sub-axis**. Holding **total GH constant** is what makes it an ion-identity test instead of a dose test (Track 1 already mapped dose; Phase 2 maps identity).

**Single-mineral attribution is now VALID** — the opposite of Track 1's concentrate-as-black-box rule. In Track 1 you could never say "that's the magnesium" because the products were 5–7-salt blends. Here each stock is one salt, so attributions like "sulfate reveals more than chloride at equal GH" are exactly what the track produces.

**The hybrid (operator-chosen):**
- **Lane A — post-brew single-salt direction screen (cheap, perceptual).** Dose each single-salt stock into cups from one distilled base brew; learn each ion's perceptual direction fast. Caveat: post-brew shows perception, not extraction.
- **Lane B — pre-brew constant-GH isolation (rigorous, extraction-valid).** Build proper GH 44 / KH 20 waters for the priority comparisons and brew with them. This is where the real isolation + extraction effect lives. The hybrid spends pre-brew coffee only on the comparisons that matter (Lane A picks them), keeping the Pink Bourbon budget low.

**Two-part / precipitation discipline.** Calcium can't share a concentrate with sulfate or bicarbonate (precipitates gypsum/carbonate). With single-salt stocks this is automatic (one salt per bottle). When BUILDING a multi-salt water (e.g. the SBL reconstruction), add each salt to the dilute brewing water sequentially — never combine calcium + sulfate/bicarbonate at concentrate strength. **Gypsum (CaSO₄) is low-solubility (~2 g/L)** — it can't be a 10,000 ppm stock; make a dilute (~1–2 g/L) stock or dose tiny masses direct, and give it time + stirring to dissolve.

---

## Inherited methodology (Track 1 → this track)

| Primitive | Applies here? |
|---|---|
| Tool-call-per-cup pacing | ✅ One tasting cup per tool call; the prose IS the payload |
| The doc IS the archive | ✅ All readings + prose inline |
| Pre-stated hypothesis tests (active mode) | ✅ HT1–HT5 below; log predictions before scoring |
| Paired-A/B-vs-control reading | ✅ Every cup read A/B against the distilled control |
| Reveal-vs-inject flag (dose-zoned) | ✅ Every cup; an ion's direction is dose-dependent |
| Low-dose-start ladder | ✅ (Track 1 candidate, 2nd fire) Start GH/dose LOW; vendor-mid was past peak |
| Palate-fatigue cap (~10–12/sitting) + break reset | ✅ (Track 1 candidate, 2nd fire) Split across sittings; the lunch-break reset held in Track 1 Sitting 2 (~17 cups) |
| Concentrate-as-black-box | ❌ INVERTED — single-salt attribution is the point here |

These are candidate primitives that **graduate at the PROJECT retro** (after Phase 2 + the 2nd coffee), not at this track close. Log whether each fired cleanly; don't promote to cluster docs mid-session.

---

## Hypothesis Tests (pre-state per Lesson #16 active mode)

### HT1 — Sulfate vs chloride (the Track-1 sulfate lead, now isolated)
At equal GH + same cation, does **sulfate reveal more than chloride**? Track 1 predicts yes (LYLAC/SBL sulfate lead). Test MgSO₄ vs MgCl₂ at GH 44 first (priority), then CaSO₄ vs CaCl₂.
- If yes: sulfate is the reveal anion for this coffee — the core Phase-2 finding, and it points the recipe library sulfate-forward.

### HT2 — Mg vs Ca (the cation direction)
At equal GH + same anion, what's the direction difference? BAC community read: Mg "energetic/intense," Ca "rounder/sweeter/more muted." Test MgSO₄ vs CaSO₄ at GH 44.

### HT3 — Does pre-brew confirm post-brew? (the hybrid's methodology spine)
For the standouts, does the Lane B pre-brew result confirm the Lane A post-brew direction, or diverge? Divergence IS the extraction effect (the half post-brew can't see). This validates/bounds the post-brew screening method for the whole project.

### HT4 — Buffer: where does KH flatten the lime clarity?
Roast Summit chemistry: bicarbonate is engineered to destroy acid. At GH 44, vary KH (0 vs ~20) and KH source (NaHCO₃ vs KHCO₃). At what KH does the Pink Bourbon's lime clarity start to flatten, and does Na- vs K-bicarbonate taste different at equal KH?

### HT5 — Rig validation: reconstructed SBL ≡ bottled SBL?
Build SBL Juicy & Sweet from raw salts (its disclosed recipe → GH 44 / KH 20), verify on the LaMotte, brew it, and compare to the bottled-SBL stock from Track 1 on the same coffee. If they match, the rig (math + balance + stocks + measurement) is validated end-to-end and every later build is trustworthy. If they diverge, fix the rig before trusting any isolation.

---

## Step 0 — Calibration arc (run to completion BEFORE any scoring)

### 0.1 Physical inventory + hydration-form verification (LOAD-BEARING)
Photograph + confirm all six reagents. **Verify the hydration form on each label** — the molar math depends on it:
- MgSO₄·7H₂O (heptahydrate, MW 246.5) · MgCl₂·6H₂O (hexahydrate, MW 203.3) · CaSO₄·2H₂O (dihydrate, MW 172) · CaCl₂·2H₂O (dihydrate, MW 147) · NaHCO₃ (MW 84) · KHCO₃ (MW 100).
- If a form differs from the above (e.g. anhydrous MgSO₄, anhydrous CaCl₂), recompute that salt's mg/L — flag it before building.
- Confirm silica-gel desiccant is in the CaCl₂ + MgCl₂ jars (hygroscopic — absorbed moisture corrupts the mass→ppm math).

### 0.2 Single-salt stock prep (10,000 ppm, except gypsum)
Make a 10,000 ppm stock of each soluble salt (1 g in 100 mL distilled = 10,000 ppm; or 10 g/L). **Gypsum (CaSO₄) is the exception** — make a ~1–2 g/L dilute stock or plan to dose tiny masses direct.
- Room-temp distilled + magnetic stirrer, 5–10 min; cool + clarify before use; **read each stock on the EC60 and log it** (reproducibility check). Keep calcium stocks physically separate from sulfate/bicarbonate stocks.

### 0.3 GH/KH math check + base baseline
- Confirm the GH 44 / KH 20 starter recipes (§ Starter recipes) and verify against the LaMotte BrewLab (calcium hardness + magnesium hardness + alkalinity + sulfate + chloride) and the API GH/KH. **Build one test water, measure it, tune to target before scoring.** This is the "measure, don't guess" discipline (Roast Summit) — the LaMotte is exactly the right tool.
- EC60 calibrated against the 84 µS standard; distilled base near-0.
- Record the operator's baseline `/brew` recipe (dose / ratio / temp / pours / time) — the fixed recipe every cup inherits.

### 0.4 SBL-reconstruction rig validation (HT5 — the opening pre-brew)
Build SBL from raw salts (its disclosed recipe), verify GH 44 / KH 20 on the LaMotte, brew it, and A/B against the bottled-SBL stock from Track 1 on the Pink Bourbon. Pass = rig validated; proceed. Fail = stop and fix (recheck masses / hydration forms / measurement) before any isolation cup.

### 0.5 Pre-pull-1 calibration shot + coffee-budget check
- One distilled-base calibration brew at the baseline recipe; confirm the dial-in holds; this becomes the distilled control + the base batch Lane A is split from.
- **Confirm enough Pink Bourbon** for Lane A (one base brew) + the Lane B pre-brew waters (the priority comparisons — see § Sample size). If short, trim Lane B to the highest-priority cells (sulfate-vs-chloride + SBL validation) and log the cut.

### 0.6 Semi-blind setup + skipped primitives
- Semi-blind: operator codes/shuffles cups, un-blinds at recording.
- Skip (be explicit): brewer-capacity (N/A), alias-map (N/A), bimodality (N/A — taste not flow).

---

## Experiment design — two lanes (hybrid)

Hold constant: coffee, grind, xBloom V60 recipe, tasting temperature, 200 mL cup volume, one dropper/pipette per stock.

### Lane A — post-brew single-salt direction screen
From one distilled base brew, dose each single-salt stock into 200 mL cups at a LOW, roughly ion-matched level (start ~0.4 mmol/L of the varying ion ≈ the GH-44-equivalent masses in § Starter recipes, delivered as stock drops/µL); read each A/B against the distilled control; reveal/inject flag + the 9 sensory axes. Goal: each ion's perceptual direction + the standouts to confirm pre-brew.

| Stock | Ion focus | Note |
|---|---|---|
| MgSO₄ | Mg + sulfate | |
| MgCl₂ | Mg + chloride | |
| CaSO₄ | Ca + sulfate | dilute stock (low solubility) |
| CaCl₂ | Ca + chloride | |
| NaHCO₃ | buffer (Na) | expect acid-muting |
| KHCO₃ | buffer (K) | expect acid-muting; cleaner than Na? |

### Lane B — pre-brew constant-GH isolation (the rigorous core)
Build GH 44 / KH 20 waters and brew with them. Priority order (trim from the bottom if coffee is short):
1. **SBL reconstruction** (Step 0.4 — already a pre-brew; the rig anchor).
2. **MgSO₄ vs MgCl₂** at GH 44 (HT1 — sulfate vs chloride, the Track-1 lead).
3. **MgSO₄ vs CaSO₄** at GH 44 (HT2 — Mg vs Ca on sulfate).
4. **Buffer axis:** GH 44 with KH 0 vs KH 20 (NaHCO₃), then KH 20 NaHCO₃ vs KHCO₃ (HT4).
5. *(if coffee allows)* complete the 2×2: CaSO₄ vs CaCl₂; MgCl₂ vs CaCl₂.
Each Lane B water also read A/B against the distilled control (which won Track 1's Lane C — the bar to beat).

### Sample size + fatigue
~10–12 scored cups/sitting; cleanse between; break-reset between lanes (Track 1 Sitting 2 ran ~17 across a lunch break — defensible with the reset). Recommended split: **Sitting 1** = Step 0 + Lane A (~8 cups). **Sitting 2** = Lane B pre-brew (~8–10). Don't cram both lanes fatigued.

### Mid-run hypothesis budget (~2 exploratory cups)
If theory emerges (e.g. "sulfate at GH 60 over-reveals into sharpness," or "Mg+sulfate at low KH is the best-cup candidate"), test it in-session.

---

## Starter recipes — GH 44 / KH 20 (per 1 L distilled; VERIFY + tune on the LaMotte)

GH as ppm CaCO₃; a divalent cation contributes GH = (mmol/L) × 100. KH 20 ≈ 0.4 mmol/L bicarbonate. **These are computed starting points — measure each built water and tune.**

| Target water | Salt for GH 44 (≈0.44 mmol/L cation) | + KH 20 |
|---|---|---|
| Mg-sulfate | MgSO₄·7H₂O ≈ **108 mg/L** | NaHCO₃ ≈ 34 mg/L (or KHCO₃ ≈ 40 mg/L) |
| Mg-chloride | MgCl₂·6H₂O ≈ **90 mg/L** | " |
| Ca-sulfate | CaSO₄·2H₂O ≈ **76 mg/L** (dissolves slow) | " |
| Ca-chloride | CaCl₂·2H₂O ≈ **65 mg/L** | " |
| SBL reconstruction | make SBL's disclosed concentrate (Epsom 10 g / CaCl₂ 3 g / MgCl₂ 4 g / NaHCO₃ 3.4 g / KHCO₃ 4 g into 500 g distilled), dose **2.5 mL/L** | (recipe already includes its buffer → GH 44 / KH 20) |

KH-only variations: NaHCO₃ ≈ 34 mg/L or KHCO₃ ≈ 40 mg/L per 20 ppm KH. Dose buffer into the dilute brewing water, not the concentrate (precipitation discipline).

---

## Recording Sheet

### Inventory + hydration + stock prep (Step 0.1 / 0.2)
| Salt | Hydration form confirmed | Stock ppm | EC60 reading | Date mixed |
|---|---|---|---|---|
| MgSO₄·7H₂O | ✅ Heptahydrate, MW 246.5 — 2× 8 oz jars (Epsom). Matches assumed MW. | 10,000 (1.000 g / 100 mL) | 4.45 mS ✅ (matches predicted ~4.4-4.5) | 2026-06-28 |
| MgCl₂·6H₂O | ✅ Hexahydrate 98+% reagent grade flakes, MW 203.3 — 1× 4 oz. Matches. Desiccant present ✅. | 10,000 (1.003 g / 100 mL) | 9.28 mS ✅ (matches predicted ~9-10) | 2026-06-28 |
| CaSO₄·2H₂O | ✅ Food-grade gypsum (dihydrate), MW 172 — 1× 1.5 lb. Matches. Dilute stock only (low solubility). | ~1,520 (0.152 g / 100 mL) | 1308 µS ✅ (matches predicted ~1.3-1.4 mS w/ ion-pairing); fully clear/dissolved | 2026-06-28 |
| CaCl₂·2H₂O | ✅ Dihydrate USP grade, MW 147 — 1× 500 g. Matches. Desiccant present ✅. | 10,000 (1.001 g / 100 mL) | 13.10 mS ✅ (matches predicted ~14; slightly above top cal point 12.88 mS so absolute value approximate — gravimetric prep is source of truth) | 2026-06-28 |
| NaHCO₃ | ✅ Baking soda on hand (MW 84). Matches. | 10,000 (1.000 g / 100 mL) | 8.32 mS ✅ (just under KHCO₃, as expected) | 2026-06-28 |
| KHCO₃ | ✅ 99% USP food-grade fine powder, MW 100 — 2× 8 oz. Matches. | 10,000 (1.001 g / 100 mL) | 8.88 mS ✅ (matches predicted ~9) | 2026-06-28 |

**0.1 verdict (2026-06-28):** All 6 reagents confirmed on-hand; all hydration forms match the protocol's assumed MWs → **no molar-math recompute; GH-44 starter masses (§ Starter recipes) stand as written.** Desiccant present in both chloride jars. Control water = distilled (confirmed). NaCl (sodium chloride, 3× 4 lb) is on the shelf but **OUT OF SCOPE** for this track — see friction F2. **Step 0.1 CLOSED.**

**0.2 verdict (2026-06-28):** All 6 stocks mixed + EC60-fingerprinted; every reading matched its predicted conductivity (workflow + scale + reagent identities all cross-validated). 5 soluble salts at 10,000 ppm (1 g / 100 mL); gypsum at 1,520 ppm dilute (clear, fully dissolved). EC60 recalibrated 86→84 µS. **Step 0.2 CLOSED.** Next: 0.3 build-and-measure on the LaMotte.

### LaMotte BrewLab Plus — kit reference (confirmed from booklet 2026-06-28)
- **Total Hardness** (tube 4488): fill to **upper line** (1 drop = **10 ppm**, finest resolution) → 5 drops Reagent #5 [4483] → 1 Reagent #6 tablet [4484A] → **Blue = 0 hardness; Red = hardness present** → titrate Reagent #7 [4487WT] Red→Blue, count drops × 10. → GH 44 ≈ **4-5 drops**. (Mg²⁺ ppm = result × 0.24.)
- **Calcium Hardness** (tube 4488, upper line, ×10): 6 drops Sodium Hydroxide w/Metal Inhibitors [4259] → 1 Ca Indicator tablet [5250A] → Red/Blue same logic → titrate Reagent #7 Red→Blue × 10. (Ca²⁺ ppm = result × 0.4.) **Magnesium Hardness = Total − Calcium.**
- **Total Alkalinity** (tube 0715): fill to **25 mL line** (1 drop = **10 ppm**, finer than the 10 mL/25-ppm option) → 1 BCG-MR tablet [2311A] (turns **Green**) → titrate Sulfuric Acid 0.12N [7748WT] Green→Red, count drops × 10. → KH 20 = **2 drops**. (HCO₃ ppm = result × 1.2.)
- **Chloride** (tube 0715, 25 mL line, 1 drop = 10 ppm): 5 drops Chloride Reagent A [4069] (turns **Yellow**) → titrate Silver Nitrate 0.171N [3824WT] Yellow→Orange-Brown × 10. Record ppm Chloride.
- **Sulfate** (tube 0715, **5 mL line** only): 1 Sulfate Turb Tablet [6456] → cap + shake to disintegrate → remove cap → set tube bottom on a black target on the Sulfate Color Chart [7188-01-CC], look down through, match grayness to the gray scale (0/50/100/150/200 ppm). Turbidimetric, not a titration. If more turbid than 200: 5 mL sample + fill to 10 mL distilled, repeat, × 2.
- **Sodium (by calculation):** A = Cl/35 + Sulfate/48 + Alkalinity/50; B = Total Hardness/50; **Na ppm = (A − B) × 23.** (We know Na by construction — only NaHCO₃ buffer adds it — so this is confirmatory.)
- Resolution caveat: GH reads in 10 ppm steps (within one drop of target = pass); KH 20 is a clean 2-drop target.
- **Distilled blank (2026-06-28) — PASS.** Total Hardness = 0 (dark blue, 0 drops). Total Alkalinity = 1 drop (= kit resolution floor, ≤10 ppm, effectively zero — distilled has no acid-neutralizing capacity). Distilled + kit both validated. **Account for the ~1-drop alkalinity floor when reading low KH** (a built KH-20 water should read ~2-3 drops: 2 real + the 1-drop floor). This also coarsens the KH-0-vs-KH-20 buffer-axis read (HT4) — detectable but only ~2 drops apart over a 1-drop floor.

**Operational GH lock (2026-06-28):** the MgSO₄ test water titrated Total Hardness to **5 drops (50 ppm reading)** — a pass for GH 44 within the 10-ppm/drop resolution (a true-44 water needs the 5th drop to flip; 4 drops = 40 = still red). For ISOLATION, hold **"5 drops total hardness" constant across every Lane B comparison water** on this same kit — relative constancy across the swap is what makes it a clean ion test; absolute accuracy is secondary. KH lock = 2 real drops (expect ~2-3 incl. the 1-drop floor).

### Built-water verification (Step 0.3 / Lane B — LaMotte)
| Water | Target GH/KH | Measured GH (Ca/Mg split) | Measured KH | Sulfate/Cl | Tuned? |
|---|---|---|---|---|---|
| MgSO₄ test (0.3) | 44 / 20 | TH **5 drops = 50 ✅**; Ca = **0 by construction** (Ca-hardness test muddy-purple, see F5); Mg = TH = 50 (all-Mg ✅) | **4 drops = 40 gross / ~30 net** (~1 drop high vs target; likely titration-speed overshoot, see F6 — NOT tuned, math dose is correct) | skipped on test water (confirmatory; known by construction) | **rig PASS** (GH ✅ / all-Mg ✅ / KH within 1 drop) |
| SBL reconstruction (0.4) | 44 / 20 | TH **6 drops = 60 ✗** (2 drops over its ~40 target — SBL-build dosing-precision artifact, see F9; NOT a single-salt-rig failure) | **4 drops** (slow careful titration — SAME as MgSO₄ test across a different buffer recipe → F6 RESOLVED: stable +1-drop method offset, hold recipe) | (pending) | GH off-target; bottled-SBL reference compromised (F8) — see fork |

### Predictions (pre-state HT1–HT5) — locked 2026-06-28 before Lane A scoring
| Comparison | Predicted direction |
|---|---|
| HT1 — sulfate vs chloride | **Sulfate reveals** (lifts clarity / brightness / aromatic lift); **chloride bodies/rounds/mutes.** Track 1's sulfate lead (LYLAC/SBL) predicts the sulfate cups (MgSO₄, CaSO₄) read cleaner/brighter than the chloride cups (MgCl₂, CaCl₂) at equal level. |
| HT2 — Mg vs Ca | **Mg = energetic / intense / more structured; Ca = rounder / sweeter / more muted** (BAC community read). On the sulfate pair: MgSO₄ sharper-brighter, CaSO₄ rounder-sweeter. |
| HT4 — buffer (Na vs K bicarb) | Both **flatten the lime / mute acidity** (bicarbonate kills acid). KHCO₃ possibly **cleaner** than NaHCO₃ at equal level; the Pink Bourbon's lime clarity is the thing at risk. |
| HT3 — pre vs post | (decided after Lane B — does the pre-brew confirm Lane A's directions or diverge? divergence = the extraction effect) |
| HT5 — rig (recon vs bottled SBL) | Downgraded to bonus (F8). Recon is visibly cleaner; a real taste difference is plausible since dissolved-ion content differs. |
| Operator prior | **Neutral / no strong priors** — operator's only prior water experience is pre-mixed multi-salt concentrates, so no single-ion expectations to bias toward. Methodologically clean: a naive palate can't unconsciously score toward the predicted directions. The above predictions are literature/Track-1 derived, NOT the operator's. |

### Per-cup scoring (1–5; one row per cup) — Lane A, Sitting 1, 2026-06-28 (semi-blind, control overall = 2)
| Code | Water/ion | Lane | GH/KH | Acidity | Sweetness | Body | Clarity | Finish | Bitter | Astring | Flavor spec | Overall | Reveal/Inject | Notes (prose — the payload) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 7 | distilled control | A | 0 | base | base | base | base | base | base | base | base | **2** | — | Reference. Opens up as it cools (lime/tomato/brown tea). |
| 1 | **MgSO₄** | A | GH44-eq | ↓ | ↓ | ↑ slt | ↓ | ↑ slt longer | = | ↑ slt drying | ↓ generic brown tea | **1.5** | neither (but worse) | **Muddied/flattened everything; lost sharpness, went generic brown tea. Worst cup. Sulfate+Mg did NOT reveal — it muted.** |
| 2 | **MgCl₂** | A | GH44-eq | ↓ slt | **↑↑ way more** | ↑ creamier | ↓ | ↑ longer | = | none | — | **3.5** | reveal-ish (the "sweet part of the lime") | The SWEET axis. Creamy, sweet-lime. Wants to blend with #3. |
| 3 | **CaCl₂** | A | GH44-eq | **↑↑ very pleasant** | ↑ | = | **↑↑ high** | ↓ short/clean | none | none | **↑↑ very high** | **3.5** | **reveal** (amplifies what's there) | The ACID axis. Lemon-lime sweetness, bright + clean. Standout. |
| 4 | **CaSO₄** | A | GH44-eq (⚠ ~5% extra dilution, F-note) | ↑ slt | ↑ slt | ↑ slt | good | clean | none | little | present | **3** | reveal (mild) | Balanced mild amplifier of BOTH acid + sweet, less extreme. Middle of pack. (Dilution caveat may have softened it.) |
| 5 | **NaHCO₃** | A | KH-eq | ↓ | **↑ liked it** | = | ↑ slt | ↑ slt | = | ↑ slt | = | **2.5** | slight inject | Muted acidity (as predicted) BUT added a pleasant sweet note — net liked. The nicer of the two buffers. |
| 6 | **KHCO₃** | A | KH-eq | ↓ | ↓ | = | =/↓ | = | = | = | = | **<2** | neither | Flattened/muted everything. Worse than control. The worse buffer. |
| 2+3 | MgCl₂+CaCl₂ (explor.) | A | — | ↑ | ↑ | thin | **↑↑ very high** | short | none | none | **↑↑ very high** | **4** | slight inject | **Best cup of the sitting.** Lemon-lime-Sprite; CaCl₂ acid + MgCl₂ sweet combined > either alone. |
| (2+3)+4 | +CaSO₄ (explor.) | A | — | ↑ | ↑ | ↑ | high | — | none | none | high | ~3.5 | inject | "Fruit juice" — too much; over-eggs it. 2+3 stays the favorite. |
| A | **bottled SBL** (Juicy&Sweet concentrate @ 2.5 mL/L = 0.75 mL/300 mL) | bonus pre-brew | ~GH44 nominal (actual uncertain — precip) | ↑ not super accentuated | ↑ slt | = | ↑ pretty high | present | none | **↑ a little** | ↑ pretty high | **> control** | reveal-ish (not injecting) | Sweet lime, better than control, but slightly astringent + "trying to do too much, needs a lower dose." Correctly dosed = real SBL water. |
| B | **≈ DISTILLED** (mis-dose, F10 — our finished GH-40 recon water re-diluted ~400× by treating it as if it were a concentrate: 0.75 mL into 300 mL) | bonus pre-brew | **~GH 0.1 (≈ distilled, NOT the GH-60 recon)** | ↑ | ↑ | = (as A) | **↑↑ MUCH higher than A** | shorter | none | **none** | **↑↑ much higher than A** | **> control AND ≫ A** | not injecting | Much cleaner / brighter / crisper, no astringency, "real material difference." **Preferred — but B was ≈ distilled, so this is DISTILLED ≫ bottled SBL (Track-1 replication), NOT recon-vs-bottled.** |

### Per-axis summary (Lane A post-brew, 2026-06-28 — pre-brew columns pending Lane B)
| Factor isolated | Direction (Lane A, post-brew) | Sweet-spot GH/dose | Pre-brew confirms post-brew? | Beats distilled? |
|---|---|---|---|---|
| Sulfate vs chloride | **CHLORIDE reveals/amplifies; SULFATE muddies (esp. w/ Mg).** Inverts Track 1's sulfate lead. MgCl₂(3.5) ≫ MgSO₄(1.5); CaCl₂(3.5) > CaSO₄(3). | GH-44-eq worked well for chlorides | **PENDING — the key HT3 test (Lane B)** | Chlorides YES (3.5); CaSO₄ marginally (3); MgSO₄ NO (1.5) |
| Mg vs Ca | **Interacts with the anion.** On chloride: Ca→acid+clarity, Mg→sweet+body (both win, different axes). On sulfate: Ca→balanced-ok, Mg→muddy-bad. Mg's sign FLIPS with anion. | low ok | PENDING | Ca: yes both anions. Mg: yes w/ chloride, no w/ sulfate |
| KH level / source | Both ↓ acidity. **NaHCO₃ added a liked sweet note (2.5); KHCO₃ flattened (<2).** Na > K as buffer here — OPPOSITE of the "K cleaner" prediction. | very low | PENDING | NaHCO₃ marginally (2.5); KHCO₃ no |

---

## Notes / friction (capture inline — the doc IS the archive)

_(Assistant: log friction, surprises, ergonomics here.)_

**F1 — NaHCO₃ gap (2026-06-28) — RESOLVED.** Baking soda located on-hand; all six reagents present before 0.2. No sequencing impact; Step 0.4 SBL rig validation + HT4 buffer-source leg both unblocked for Sitting 1.

**F2 — NaCl is out of scope for this track.** Chris has sodium chloride (3× 4 lb) on the shelf. It is NOT one of the protocol's six reagents: Na⁺ is monovalent (contributes zero GH), and NaCl sits outside the 2×2 cation(Mg/Ca)×anion(sulfate/chloride) isolation. No NaCl stock mixed. Possible future axis (salinity / perceived-sweetness lever) — re-queue for a later track; do not fold here.

**F3 — control water is DISTILLED, not the locked recipe's "home remineralized."** Chris's locked baseline `/brew` recipe names "home remineralized" as its control water. For Phase 2 the experimental control is plain DISTILLED (Track 1 Lane C winner; the bar every built water must beat). The recipe GEOMETRY (15 g / 247 g / EG-1 6.4 / 94-94-93 / the 3-pour structure) is held constant; only the WATER is swapped — distilled for the control + Lane A base brew, built/dosed waters for the test cups. Logged so the control is not accidentally brewed on remineralized water.

**F4 — build size dropped 1 L → 500 mL (waste reduction, operator call 2026-06-28).** A brew only consumes 247 g; building a full liter per Lane B cell and discarding the remainder is wasteful. 500 mL gives a brew + LaMotte headroom + margin at half the distilled. All Lane B doses halved (per-500 mL table below). Only the KH-20 buffer dose gets tight (~1.7 mL NaHCO₃ / 2.0 mL KHCO₃) — LaMotte KH verification catches dosing slop and we tune. One reused 1 L jug, serial build-brew-rinse.

**Per-500 mL GH-44/KH-20 dose table (from 10,000 ppm stocks; gypsum from the 1,500 ppm dilute stock):** MgSO₄ 5.4 mL · MgCl₂ 4.5 mL · CaCl₂ 3.25 mL · CaSO₄ ~25.4 mL · NaHCO₃ buffer 1.7 mL · KHCO₃ buffer 2.0 mL.

**EC60 cal (2026-06-28):** pre-check read 86 µS on the 84 µS standard (~2 µS high); recalibrated to 84. Matters because built waters are read in the tens-of-µS range where a 2 µS offset is material.

**F10 — concentrate-vs-finished-water mix-up made the SBL-bonus B ≈ distilled (2026-06-28; resolved P6T2-AI-2).** The operator treated today's *finished* GH-40 reconstruction water as if it were a *concentrate* and dosed it at the bottled SBL's rate (0.75 mL / 300 mL), re-diluting it ~400× to ≈GH 0.1. So the SBL bonus A/B was bottled-SBL vs ≈distilled, NOT recon vs bottled. Root cause: ambiguous instruction — the brief said "brew the recon water you already built" but the operator pattern-matched it to the bottled "dose 0.75 mL of concentrate" gesture. Fix going forward: explicitly label each built liquid WATER (brew directly) vs CONCENTRATE (dose X mL/L). The corrected result (≈distilled ≫ bottled SBL) usefully replicates Track 1; the intended recon-vs-bottled A/B is re-queued. See L-c #6.

**F8 — bottled SBL is a precipitating, ill-defined reference (2026-06-28) — confirms F7's prediction; compromises HT5.** Operator reports the Juicy & Sweet powder concentrate ([specialtybrewlabs.com](https://specialtybrewlabs.com/products/pour-over-profile-juicy-and-sweet)) does NOT dissolve cleanly into 500 mL even with warm water + long stirring — stays cloudy, must be manually agitated, and is used from the cloudy bottle. That cloudiness is the Ca²⁺ + sulfate/bicarbonate precipitation (gypsum + chalk) predicted in F7. Consequence: bottled SBL's true dissolved-ion content is variable (depends on agitation) and below nominal — so it is NOT a clean yardstick. **HT5's design assumption (bottled SBL = trustworthy reference) is broken.** The rig is better validated by confirming a clean single-salt build reads its target (already done: MgSO₄ test = GH 44 ✓). The bottled A/B downgrades from rig-gate to confounded-but-informative ("does a clean reconstruction differ from the cloudy bottled product?"). **Qualitative observation (operator, 2026-06-28):** the single-salt-stock reconstruction WATER is visibly clear/stable vs the bottled cloudy CONCENTRATE. ⚠️ Caveat (added post-F10): this compares a dilute *finished water* to a *concentrate* — different strengths — so it only says "our dilute water is clear, their concentrate is cloudy," not a like-for-like clarity claim. The build-from-stocks path (F7) does sidestep precipitation chemically, but the *taste* A/B that would prove it cup-side was NOT achieved this sitting (see SBL synthesis — B was mis-dosed near-distilled, F10). Real recon-vs-bottled A/B re-queued.

**F9 — multi-salt (SBL) builds need finer dosing than a 10 mL syringe; single-salt isolation waters do not (2026-06-28).** The 5-component SBL recon read GH 60 vs its ~40 target — traced to the two sub-mL doses (CaCl₂ 0.75 mL, NaHCO₃ 0.85 mL) being unplaceable with a 10 mL/0.1 mL syringe (a ±0.1 mL slip on 0.75 mL is ±13%, compounding across 5 doses). The Lane B isolation waters are immune: each is a single hardness salt at 4.5–5.4 mL + one buffer, both precise on the 10 mL syringe. Mitigation if precise multi-salt builds are needed: a 1 mL fine syringe, or build at 1 L (2× dose volumes), then tune to the LaMotte GH/KH lock. **RESOLVED 2026-06-28:** operator has two pipettes on hand — **1–5 mL and 0.1–1 mL** — the 0.1–1 mL covers exactly the sub-mL doses (CaCl₂ 0.75 / NaHCO₃ 0.85) that the 10 mL syringe mis-placed. Going-forward rule: use the pipettes for any dose under ~5 mL (1–5 mL pipette for 1–5 mL, 0.1–1 mL pipette for sub-mL); reserve the 10 mL syringe for the 4.5–5.4 mL single-salt hardness doses. The right tool was on hand — the F9 error was tool-selection, not a missing instrument.

**F7 — SBL reconstruction built from single-salt stocks, NOT the disclosed concentrate (operator-confirmed 2026-06-28).** The protocol's SBL concentrate (Epsom 10 g / CaCl₂ 3 g / MgCl₂ 4 g / NaHCO₃ 3.4 g / KHCO₃ 4 g into 500 g distilled) combines calcium + sulfate + bicarbonate at full strength → Ca²⁺ would precipitate as gypsum + chalk, so the concentrate is not the recipe-as-written. Per the protocol's own precipitation discipline ("add each salt to the dilute brewing water sequentially"), we build the final SBL water directly from the existing 10,000 ppm single-salt stocks at the SBL-equivalent ion profile. Cleaner, precipitation-free, and a more rigorous rig test (our stocks + our math reproducing the SBL profile). **Build per 500 mL distilled: MgSO₄ 2.5 mL · MgCl₂ 1.0 mL · CaCl₂ 0.75 mL (last, stir) · NaHCO₃ 0.85 mL · KHCO₃ 1.0 mL** → nominal ~GH 44 / KH 20. Confound to hold in mind on the A/B: if bottled SBL's own concentrate precipitated some Ca, bottled water carries less Ca than nominal while our reconstruction carries full nominal Ca — a divergence there would be precipitation-loss, not rig error.

**F6 — KH read ~1 drop high on the 0.3 test water; held the recipe, not tuned (2026-06-28).** Built MgSO₄/KH-20 water titrated alkalinity to a stable 4 drops (40 gross / ~30 net) vs the ~3-expected (2 real + 1 floor). The 3-drop red-then-faded flicker is the signature of titrating too fast (endpoint flashes locally, re-mixes away). Buffer math is exact (1.7 mL stock / 500 mL = 20 ppm as CaCO₃), so the +10 is most likely speed overshoot, not over-dose. Decision: do NOT tune (one ambiguous read shouldn't override correct math); titrate slowly on the SBL build and re-check; trim buffer only if a careful slow titration still reads 4 on a math-20 dose. Coaching: count only the drop that holds red 30 s.

## LANE A SYNTHESIS (post-brew direction screen, 2026-06-28)

**Headline — the sulfate/chloride axis INVERTED vs Track 1.** Track 1 (pre-brew, multi-salt concentrates) put sulfate at the top (LYLAC/SBL). Lane A, on isolated single salts post-brew, says the opposite: **chloride is the reveal/amplify direction; sulfate muddies — especially with magnesium.** Ranking: 2+3 blend (4) > CaCl₂ (3.5) ≈ MgCl₂ (3.5) > CaSO₄ (3) > NaHCO₃ (2.5) > control (2) > KHCO₃ (<2) > MgSO₄ (1.5, muddiest).

**The two single-salt standouts split by axis:**
- **CaCl₂ = the ACID axis** — bright, very pleasant acidity + high clarity + high flavor specificity, clean short finish. A clarity revealer.
- **MgCl₂ = the SWEET axis** — "the sweet part of the lime," creamier body, longer finish.
- **Best cup = MgCl₂ + CaCl₂ blended (2+3, scored 4)** — acid + sweet combined beats either alone ("lemon-lime-Sprite"). Adding CaSO₄ on top ((2+3)+4) over-eggs it. (Blend = beyond single-mineral isolation, but a strong recipe-library pointer: a two-chloride Ca+Mg water for this clarity coffee.)

**Cation × anion INTERACTION (the subtle finding).** Magnesium's sign flips with its anion: **MgCl₂ is great (sweet/creamy), MgSO₄ is the worst cup (muddy/flat).** Calcium is good with both but better with chloride (CaCl₂ 3.5 > CaSO₄ 3). So you cannot talk about "the magnesium effect" or "the sulfate effect" in isolation — it's the pairing. This is exactly the kind of attribution Phase 2 was built to make (and that Track 1's black-box rule forbade).

**Buffer split.** Both bicarbonates cut acidity (as predicted). But **NaHCO₃ added a liked sweet note (2.5, slight inject); KHCO₃ just flattened (<2).** Na > K as the buffer here — the reverse of the "K cleaner" prediction.

**THE open question for Lane B (HT3 — now the centerpiece).** Is chloride's post-brew lead REAL (extraction-valid) or a post-brew perceptual artifact? Two outcomes, both valuable:
- If Lane B pre-brew **confirms** chloride > sulfate → Track 1's sulfate lead was a multi-salt/product effect, not the isolated sulfate ion, and the recipe library points chloride-forward for this coffee.
- If Lane B **flips back** to sulfate → post-brew screening diverges from extraction (HT3 bounds the screening method), and the divergence itself is the extraction effect.

**Revised Lane B priority (given Lane A):** (1) **MgCl₂ vs MgSO₄** — the biggest Lane A gap (3.5 vs 1.5), the hardest HT1+HT3 test; (2) **CaCl₂ vs CaSO₄** — the calcium anion pair; (3) **MgCl₂ vs CaCl₂** — the two winners, sweet-vs-acid axis, the 2+3 basis. Buffer axis (HT4) and the full 2×2 fill in after.

## SBL BONUS A/B SYNTHESIS (HT5 downgraded — 2026-06-28, CORRECTED post-provenance-check)

**⚠️ CORRECTION (P6T2-AI-2 RESOLVED).** The first write of this section recorded B as "the home reconstruction" and concluded "clean recon ≫ bottled — DIY beats commercial." **That conclusion is WRONG.** Provenance check revealed B was **mis-dosed near-distilled** (F10): the operator treated our *finished* GH-40 reconstruction WATER as if it were a *concentrate* and dosed 0.75 mL of it into 300 mL distilled — a ~400× re-dilution → B ≈ GH 0.1 ≈ distilled. The corrected reading is below.

**A = bottled SBL, correctly dosed (concentrate @ 2.5 mL/L → ~GH 44, real minerals, cloudy/precipitated). · B = ≈ DISTILLED** (the 400× mis-dose). Both brewed on the standard recipe; no fresh control (operator referenced control from memory).

**Corrected verdict: B (≈distilled) ≫ A (bottled SBL) — which REPLICATES Track 1's headline, it does NOT compare reconstruction vs bottled.** B was much cleaner/brighter/crisper, no astringency; A was decent but slightly astringent + "trying to do too much." Track 1 found distilled beats every built/natural water on this clarity coffee — and here near-distilled beat real SBL again. A nice independent re-confirmation of "less is more / distilled wins," from a completely different (accidental) route.

**What this bonus did NOT establish:** the actual reconstruction-vs-bottled question (HT5's intent). B was never the recon water at brewing strength — it was ~distilled. The real test (brew our GH-40 recon water DIRECTLY vs bottled SBL) is **outstanding → re-queued.**

**What still stands:** (1) the bottled SBL concentrate IS cloudy/precipitating (F8, direct observation) — but note F8's "recon visibly cleaner" was comparing a dilute *water* to a *concentrate* (different strengths), so it's only "our dilute water is clear, their concentrate is cloudy," not a like-for-like. (2) "Less is more" reinforced: operator preferred the single-salt Lane A cups (esp. the 2+3 blend) over the SBL blend, and A "needs a lower dose."

**The methodology lesson (F10/L-c #6):** a *concentrate* and a *finished water* are NOT interchangeable — dosing them at the same rate gives a ~400× difference. Any future "build-from-stocks vs bottled" A/B must match STRENGTH (brew both as finished waters, or make both as matched concentrates), not match the dosing *gesture*.

## New lessons (candidate primitives — for the Coordinator's PROJECT retro)

_(Assistant: log candidates. Do NOT promote to cluster docs — that's the retro's job, after Phase 2 + the 2nd coffee.)_

**L-candidate #1 — LaMotte calcium-hardness titration is unreliable on near-zero-Ca / high-Mg waters.** The Ca-hardness test raises pH (NaOH) to precipitate Mg(OH)₂; on a pure-magnesium water (~50 ppm Mg, 0 Ca) the precipitate haze + incomplete masking gives a muddy purple that never resolves to a clean red→blue endpoint, even past 5 titrant drops. **Operational rule for this kit:** read Calcium Hardness as clean only on the calcium waters (CaSO₄, CaCl₂, SBL reconstruction); on the magnesium waters (MgSO₄, MgCl₂) expect muddy-purple = "Ca ≈ 0" and rely on Total Hardness + by-construction composition (Mg = TH). Don't over-titrate chasing blue (wastes Reagent #7). Caught at Step 0.3, 2026-06-28.

**L-candidate #2 — build multi-salt waters from single-salt stocks (sequential dilute dosing), NOT a calcium-bearing concentrate (precipitation-avoidance).** The F7 build-from-stocks method sidesteps the Ca + sulfate/bicarbonate precipitation that clouds commercial concentrates. ⚠️ The "makes a better cup" half of this claim is **NOT yet supported** — the SBL bonus that was meant to show it was invalidated by the F10 mis-dose (B was ≈distilled, not the recon). The chemistry rationale stands; the cup-side proof is re-queued.

**L-candidate #6 — a CONCENTRATE and a FINISHED WATER are not interchangeable; dosing them at the same rate gives a ~400× difference.** F10: the operator dosed our finished GH-40 recon water at 0.75 mL/300 mL (the bottled concentrate's rate), re-diluting it ~400× to ≈distilled. Candidate primitive: label every built liquid as WATER (brew directly) or CONCENTRATE (dose at X mL/L); any cross-product A/B must match STRENGTH (both finished waters, or both concentrates), never the dosing gesture.

**L-candidate #3 — "measure don't guess" for ISOLATION means locking the OPERATIONAL drop-count on your own kit, then holding it constant.** At low GH/KH the LaMotte's 10-ppm/drop resolution can't resolve 44 from 50, and KH carries a stable ~+1-drop method offset. What makes the isolation valid is not absolute accuracy but every comparison water reading the SAME drop count on the SAME kit (GH lock = 5 drops; KH lock = 4 drops). Relative constancy across the ion swap > absolute calibration.

**L-candidate #4 — match the measuring tool to the dose; the 10 mL syringe's imprecision compounds across many small doses.** Single-salt isolation waters (1 hardness dose at 4.5–5.4 mL) are fine on the syringe; the 5-dose SBL build went GH 60 vs 40 target because two sub-mL doses were unplaceable. Use the 0.1–1 mL / 1–5 mL pipettes for multi-component builds (F9).

**L-candidate #5 (methodological) — a naive-palate operator is an ASSET for blind single-operator tasting.** No single-ion priors → can't unconsciously score toward the predicted directions. Worth preserving in active-mode design: state predictions from literature/prior-track, not from the taster, when the taster is naive.

## Audit items queued

_(Assistant: carry P6T1-AI-3 — the TONIK roasted-barley confound re-test — into this track if a TONIK reference cup fits; otherwise re-queue it. Log anything needing Coordinator decision or substrate-fold.)_

- **P6T1-AI-3 (TONIK roasted-barley confound) — RE-QUEUED, not tested.** No TONIK reference cup fit this Step-0 + Lane-A sitting (the track ran distilled-base + single-salt isolation; no roasted-grain product in scope). Carry forward to a future sitting where a TONIK cup fits, else keep parked.
- **P6T2-AI-1 (NEW) — the sulfate/chloride inversion needs Lane B before ANY substrate-fold.** Lane A (post-brew, single-salt) flipped Track 1's sulfate lead: chloride revealed, sulfate (esp. Mg) muddied. This is single-coffee + post-brew only. It MUST be confirmed pre-brew (Lane B / HT3) before it touches CONTEXT-taste or any recipe-library substrate. Status: OPEN — gates the substrate-fold (which is already DEFERRED on the single-coffee rule anyway).
- **P6T2-AI-2 — RESOLVED (F10).** Provenance check showed B was NOT the GH-60 recon — the operator dosed the finished recon water at the bottled concentrate's rate (0.75 mL/300 mL), re-diluting it ~400× to ≈distilled. The SBL bonus was therefore bottled-SBL vs ≈distilled (Track-1 replication), and the intended recon-vs-bottled A/B was not performed → re-queued.

---

## HANDOFF BRIEF FOR COMPILE / COORDINATOR (fill at session end)

## HANDOFF BRIEF FOR COMPILE SESSION (Single-Mineral Isolation — Sitting 1 Close-Out)

**Date:** 2026-06-28
**Session role:** execution + handoff brief production (no substrate edits)
**Archive location:** branch `claude/focused-fermat-1352f2` @ `827e529` (corrected brief content; fetch branch HEAD for latest), pushed to origin (archive doc committed; substrate NOT touched; not merged to main). See [`role-discipline.md` § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md).
**Methodology verdict:** **MIXED — PARTIALLY CONTRADICTS Track 1.** Lane A (post-brew, single-salt) INVERTS Track 1's sulfate lead — chloride reveals, sulfate (esp. Mg) muddies — but this is single-coffee + post-brew only and GATES on Lane B (HT3) before any fold. The HT5 bonus was invalidated by a concentrate-vs-finished-water mis-dose (B ended ≈distilled, F10); its corrected reading re-confirms Track 1's distilled-wins, and the real reconstruction-vs-bottled test is re-queued.

This brief covers **Sitting 1 = Step 0 (full calibration) + Lane A (post-brew screen) + the SBL bonus A/B.** Lane B (pre-brew isolation — the rigorous core) was deliberately deferred to a fresh sitting per the fatigue discipline. The compile session should treat all findings as single-coffee → substrate-fold stays DEFERRED; the value here is the mechanism map + a sharpened Lane B plan.

### TL;DR
- **Sulfate/chloride axis inverted vs Track 1.** Post-brew, on isolated single salts: **chloride reveals/amplifies, sulfate muddies** — worst cup was MgSO₄ (1.5), best singles were both chlorides (CaCl₂ 3.5 acid-axis, MgCl₂ 3.5 sweet-axis). Gates on Lane B before it's real.
- **Cation × anion INTERACTION is real:** magnesium flips sign with its anion (MgCl₂ great, MgSO₄ worst). You can't attribute to "the Mg effect" or "the sulfate effect" alone — it's the pairing. (Phase 2's whole thesis, landing.)
- **Best cup of the sitting = MgCl₂ + CaCl₂ blended (2+3, scored 4)** — acid + sweet combined > either alone. A two-chloride Ca/Mg water is the recipe-library pointer for this clarity coffee.
- **Buffer split:** NaHCO₃ added a liked sweet note (2.5); KHCO₃ flattened (<2). Na > K here — reverse of prediction.
- **HT5 bonus (CORRECTED):** B was mis-dosed to ≈distilled (finished recon water re-diluted ~400×, F10), so the A/B was really bottled-SBL vs ≈distilled — and ≈distilled won. That REPLICATES Track 1's distilled-wins, it is NOT a recon-vs-bottled result. Real recon-vs-bottled re-queued.
- **Rig validated** for single-salt isolation work: MgSO₄ test water read GH 44 / KH 20 (operational locks: 5 drops GH, 4 drops KH).
- **"Less is more" reinforced** (Track 1 carry): operator preferred targeted single-salt cups over both 5-salt SBL blends; SBL "trying to do too much."

### Execution summary
Full Step 0 calibration ran to completion (inventory + hydration verification of all 6 reagents; 6 single-salt stocks mixed + EC60-fingerprinted, every reading matching prediction; EC60 recal 86→84; LaMotte trained from zero + distilled blank; rig validated via a clean MgSO₄ GH-44/KH-20 build). Step 0.4 (SBL rig validation) was reshaped mid-session: the disclosed SBL concentrate precipitates calcium, so per the protocol's own precipitation discipline we built from single-salt stocks instead (F7) — operator-confirmed. The bottled-SBL reference then turned out to be cloudy/precipitating (F8), which broke HT5's "clean reference" assumption, so HT5 downgraded to a confounded-but-informative bonus. 9 Lane A cups scored (6 single salts + 2 exploratory blends + control), then the 2-cup SBL bonus. Methodology held; deviations (F7 build path, HT5 downgrade) were flagged + operator-confirmed before execution.

### Equipment / conditions
| Item | Value |
|---|---|
| Coffee | Hydrangea Pink Bourbon Washed (same as Track 1) |
| Brewer / recipe | xBloom → Hario V60, locked baseline: 15 g / 247 g (1:16.5) / Sibarist B3 / EG-1 6.4 / 94-94-93 °C / bloom 45 g 45 s → P2 150 g @0:58 30 s pause → P3 247 g @1:58 / 3.5 ml/s / ~3:10 |
| Control water | DISTILLED (not the recipe's "home remineralized" — F3) |
| Stocks | 6 single-salt @ 10,000 ppm (gypsum 1,520 ppm dilute); EC60-verified |
| Measurement | LaMotte BrewLab Plus (GH/KH/sulfate/chloride/Na-by-calc); EC60 (recal'd to 84 µS); 0.01 g scale; 0.1–1 mL + 1–5 mL pipettes + 10 mL syringe |
| Lane A dose | GH-44-equivalent into ~60 mL cups, semi-blind (coded + shuffled) |

### Per-measurement raw data
Complete recording sheets are in the doc body above: § Inventory + stock prep (all 6, with EC60 fingerprints), § LaMotte kit reference + distilled blank, § Built-water verification (MgSO₄ test + SBL recon), § Predictions (locked pre-scoring), § Per-cup scoring (9 Lane A rows + 2 SBL-bonus rows). Not duplicated here to keep the brief tight — the compile session should read those tables for verification.

### Analysis
- **Lane A ranking:** 2+3 blend (4) > CaCl₂ (3.5) ≈ MgCl₂ (3.5) > CaSO₄ (3) > NaHCO₃ (2.5) > control (2) > KHCO₃ (<2) > MgSO₄ (1.5).
- **Anion (sulfate vs chloride), post-brew:** chloride wins on both cations — MgCl₂(3.5)≫MgSO₄(1.5); CaCl₂(3.5)>CaSO₄(3). Direction: chloride = clarity/brightness/sweetness reveal; sulfate = mute/mud (Mg) or mild-balanced (Ca).
- **Cation (Mg vs Ca), post-brew:** axis-dependent, not a clean "Mg intense / Ca round." On chloride: Ca→acid+clarity, Mg→sweet+body. On sulfate: Ca→ok-balanced, Mg→muddy-bad.
- **Buffer:** both ↓acidity; Na adds sweetness (net-liked), K flattens (net-disliked).
- **SBL bonus:** B (clean recon) ≫ A (cloudy bottled) on clarity + specificity + absence of astringency; B's higher GH rules out concentration as the cause → precipitation is the cause.

### Final output — the isolation map (Lane A / post-brew, single coffee, PROVISIONAL)
| Factor | Post-brew direction | Reveal/Inject | Beats distilled? | Pre-brew confirmed? |
|---|---|---|---|---|
| Sulfate vs chloride | **Chloride reveals; sulfate muddies (esp. Mg)** | chloride = reveal | chlorides yes; CaSO₄ marginal; MgSO₄ no | **PENDING (HT3)** |
| Mg vs Ca | Interacts w/ anion (Mg flips sign) | mixed | Ca both; Mg only w/ Cl | PENDING |
| Buffer (Na vs K) | Both mute acid; Na adds sweetness, K flattens | Na slight inject | Na marginal; K no | PENDING |
| Recon vs bottled SBL (HT5) | NOT TESTED — B mis-dosed ≈distilled (F10); got ≈distilled ≫ bottled (Track-1 replication) | — | distilled yes | **re-queued** |

### Key findings
1. **Post-brew, chloride is the reveal anion and sulfate muddies — inverting Track 1's sulfate lead.** Data: MgCl₂ 3.5 vs MgSO₄ 1.5; CaCl₂ 3.5 vs CaSO₄ 3. Implication: if Lane B confirms, Track 1's sulfate lead was a multi-salt/product artifact, and the recipe library points chloride-forward for this coffee. **Gated on Lane B (single-coffee + post-brew).**
2. **Cation effect is anion-dependent (interaction term).** Mg flips from best-paired (chloride) to worst (sulfate). Implication: single-ion attribution must always be stated as a pairing, not a lone ion — validates the Phase-2 isolation premise.
3. **A two-chloride Ca+Mg blend is the standout cup (4).** CaCl₂ (acid/clarity) + MgCl₂ (sweet/body) combine. Implication: candidate custom-water direction for the Pink Bourbon; carry to Lane B + eventual recipe library.
4. **Distilled beat bottled SBL again — Track-1 replication via an accidental near-distilled B (F10).** The intended recon-vs-bottled A/B was NOT achieved: B was mis-dosed (finished recon water re-diluted ~400× to ≈distilled). The F7 build-from-stocks method is sound chemically (precipitation-avoidance) but its claimed cup-side advantage is UNPROVEN. Implication: re-run the real recon-vs-bottled at matched strength before any "DIY beats commercial" claim.
5. **Buffer: Na > K for this coffee, both mute acidity.** Implication: if a buffer is wanted, NaHCO₃; but the operator's "less is more" preference suggests minimal/zero KH for this clarity profile.

### Substrate edit specifications for compile session
**NONE this track — substrate-fold DEFERRED per the single-coffee rule.** Every finding above is on one coffee (Pink Bourbon) + mostly post-brew; the difference-vocabulary cannot codify until a 2nd coffee replicates. No registry / cluster-doc / ADR edits are specified. **Candidates to hold for the post-2nd-coffee fold** (do NOT apply now): (a) a CONTEXT-taste refinement on dose-zoned reveal/inject + the chloride-vs-sulfate-by-coffee finding; (b) a recipe-library seed (two-chloride Ca/Mg water); (c) an L-candidate graduation pass (see below). The compile session should record these as deferred, not execute them.

### New lessons captured
| # | Lesson | Substrate implication |
|---|---|---|
| L-c #1 | LaMotte Ca-hardness titration unreliable on near-zero-Ca/high-Mg waters (muddy purple) | Operational kit rule; not a cluster primitive yet |
| L-c #2 | Build multi-salt waters from single-salt stocks (precipitation-avoidance) — the "better cup" half is UNPROVEN (F10 invalidated the test) | Candidate method primitive; cup-side claim re-queued |
| L-c #3 | "Measure don't guess" for isolation = lock the operational drop-count on your own kit, hold constant | Candidate measurement primitive |
| L-c #4 | Match measuring tool to dose; syringe imprecision compounds across multi-salt builds | Equipment-discipline note |
| L-c #5 | A naive-palate operator is an asset for blind tasting; state predictions from literature not the taster | Candidate active-mode design primitive |
| L-c #6 | A CONCENTRATE and a FINISHED WATER are not interchangeable — same dose rate = ~400× difference (F10) | Label built liquids WATER vs CONCENTRATE; match strength in cross-product A/Bs |

All stay logged for the cross-project ratification gate (process-retro) — none promoted mid-session.

### Audit items queued
- **P6T1-AI-3 (TONIK confound):** RE-QUEUED, not tested — no TONIK cup fit this sitting.
- **P6T2-AI-1 (NEW):** the sulfate/chloride inversion MUST be confirmed pre-brew (Lane B / HT3) before any substrate-fold. OPEN; gates the fold (already deferred on single-coffee).
- **P6T2-AI-2:** RESOLVED — B was mis-dosed near-distilled (finished recon water re-diluted ~400×, F10), not the GH-60 recon. Consequence: the recon-vs-bottled A/B was not actually performed → re-queued (see open data).

### Open data items
- **Lane B not run** — the entire pre-brew isolation (HT1 confirm / HT2 / HT3 / HT4) is outstanding. Revised priority: (1) MgCl₂ vs MgSO₄, (2) CaCl₂ vs CaSO₄, (3) MgCl₂ vs CaCl₂, then buffer axis + full 2×2. ~5 brews core, ~8 with buffer. Fresh sitting.
- **HT3 unresolved** (the pre-vs-post centerpiece) — depends entirely on Lane B.
- **Recon-vs-bottled SBL A/B NOT achieved** (F10 mis-dose — B was ≈distilled) — re-run brewing the GH-40 recon water DIRECTLY against bottled SBL at matched strength, before any "DIY beats commercial" claim.
- **SBL recon GH-60** off its target (F9) — re-build precise (pipettes) if an exact-GH SBL is wanted later.

### Recap map for compile session
Integrate FIRST: nothing into substrate (deferred). DO record: the provisional isolation map + the Lane B priority + the L-candidates + the 3 audit items into the project end-document so the next sitting/session starts hot. DEFER: all substrate-fold candidates to post-2nd-coffee. ESCALATE to operator: scheduling Lane B (fresh sitting) + whether to pursue HT4 buffer axis given the operator's strong "less is more / minimal KH" lean.

### Protocol-execution friction captured
F1–F10 logged inline in § Notes/friction. The load-bearing ones for protocol-doc refinement: **F7** (the SBL concentrate recipe contradicts the protocol's own precipitation discipline — the protocol should specify build-from-stocks for SBL up front), **F8** (HT5 assumed bottled SBL was a clean reference; it precipitates — the rig-validation design needs a non-precipitating reference or should lean on the single-salt-target-confirmation already in 0.3), **F9** (the protocol should specify pipettes for multi-salt builds), **F10** (the instruction to "brew the recon water you already built" was pattern-matched by the operator to the bottled "dose 0.75 mL of concentrate" gesture, mis-diluting B ~400× to ≈distilled — protocol/instructions must explicitly tag each built liquid WATER vs CONCENTRATE), and the **Lane A cup-volume vs "200 mL" tension** (the protocol's 200 mL/cup × 7 cups implies ~6 base brews; real run used ~60 mL cups from 2 brews — protocol should state "hold concentration, scale cup volume to brew budget").

### Execution Session Termination

```
Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Archive doc committed + pushed to branch claude/focused-fermat-1352f2 @ 827e529 (corrected brief; fetch branch HEAD for latest, incl. this stamp commit)
- ✅ Handoff brief produced above; branch + SHA in its Archive location: header
- 🛑 Session terminating after this brief lands. The Coordinator decides the next track / substrate-fold; Lane B runs as a fresh sitting.

End of Single-Mineral Isolation Sitting-1 close-out.
```

---

# SITTING 2 — LANE B PRE-BREW ISOLATION (2026-07-02)

**Session role:** execution + handoff brief production (no substrate edits; archive-persist commit only). Research Assistant.
**Plan:** the superseding Lane B plan (spawn prompt) — isolation waters at **GH 44 / KH 0 (buffer-free)**, per-axis directional scoring (2026 WBC fold), one cup per turn, each A/B vs the distilled control.
**Budget:** ~3 lb Pink Bourbon on hand → non-constraint; full plan #1–7 live (incl. #6 2×2 completion + #7 recon-vs-bottled SBL).

## Step 0 abbreviated (2026-07-02)
- **Stocks:** all 6 visually clear, no precipitation after 4-day rest → no EC60 re-fingerprint. Good.
- **Recipe:** baseline holds (15 g / 247 g / Sibarist B3 / EG-1 6.4 / 94-94-93 / bloom 45 g 45 s → P2 150 g @0:58 30 s pause → P3 247 g @1:58 / ~3:10).
- **Distilled control:** brewed fresh (ended 3:15); lime / tomato-y / brown tea, improves on cooling — consistent with every prior sitting. The bar to beat. Overall = 2.
- **Rig re-verify + Sitting-2 GH lock:** MgSO₄ water (5.4 mL stock / 500 mL) titrated **5 drops transitional / 6 drops clean-blue**; MgCl₂ water (4.5 mL / 500 mL) read the **same** band. Both math-dosed to GH 43.8 by construction → NOT tuned (tuning down would push under 44). **Sitting-2 GH lock = "5 transitional / 6 clean" on a careful titrate; the correctly-dosed band is 5–6 drops.** A water reading ≤4 clean or ≥7 flags a build error. KH 0 by construction (no titration). Both arms landing the same band = GH constant across the anion swap → clean isolation.
- **Semi-blind:** coded + shuffled per comparison.

## Predictions — locked 2026-07-02 BEFORE Lane B tasting (Mg pair)
| Axis | My pre-brew prediction |
|---|---|
| Florality/aromatics | **MgSO₄ recovers floral lift** (WBC prized role; extraction-mediation) — THE decisive axis |
| Acidity | Toss-up; watch if MgSO₄ lifts acidity |
| Sweetness | MgCl₂ holds the lead |
| Body/texture | MgCl₂ bodies over MgSO₄ |
| Most-likely shape | **Per-axis SPLIT** — MgSO₄ wins florality/acidity, MgCl₂ wins sweetness/body |

## Comparison #1 — MgSO₄ vs MgCl₂ @ GH44/KH0 (HT1 + HT3 centerpiece) — semi-blind, control=2
| Code | Water | Aromatics | Acidity | Sweetness | Body | Texture | Finish/Astr | Overall | Reveal/Inject | Beats distilled? | Notes (prose — the payload) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ctrl | distilled | base | base | base | base | base | base | **2** | — | — | Lime / tomato-y / brown tea. **Tasted noticeably FLATTER after the mineral cups** (palate recalibration). |
| A | **MgCl₂** | flat at sniff, but **florals + citrus on the attack** | **↑** | **↑ (lime sweetness)** | **↓ lighter** | = | clean, no astringency | **3.1** | **reveal** | **YES** | "Fresh lime." The **ATTACK / first-phase** agent — emphasizes lime/green-citrus. Lifts everything incl. the tomato/vegetal side BUT transforms it toward green-citrus, not deep tomato. |
| B | **MgSO₄** | steeped / slightly over-steeped note | = (**more clarity** on acidity, not more) | **↑↑** | **↑ creamier / elongated** | **↑** | — | **3.0** | **reveal (body-side)** | **YES** | Sweet-creamy. The **BODY / second-phase** agent — adds creaminess / body / texture + sweetness. Does **NOT** add florality. |

**Operator coffee-dependence read (2026-07-02):** A (MgCl₂) 3.1 > B (MgSO₄) 3.0 — but "both good, they change different axes." A **wins for THIS coffee** because the Pink Bourbon is a lime/citrus/clarity profile and chloride's attack plays to that strength; **B could win on a different coffee** (one wanting body/sweetness). This is precisely why the fold stays gated on a 2nd coffee — the anion→phase mapping is a physical constant, but *which phase you want* is coffee-dependent. Points straight at the per-coffee water-recipe-library end game.
| A+B | MgCl₂+MgSO₄ equal parts (exploratory) | — | ↑ (not over the top) | ↑ | creamy but not overdone | present | — | **> ctrl (strong)** | **reveal** ("reveals what's there vs injects") | YES | More structure / complexity / elegance. Control tastes very flat beside it. **Wants a little MORE A (MgCl₂).** A 2nd candidate blend (distinct from Sitting 1's MgCl₂+CaCl₂). Counts against the ~2 exploratory-cup budget. |

**⚠️ Florality-read caveat (operator, 2026-07-02):** the Pink Bourbon "is not a heavily floral coffee — more lime / brown-tea," so the florality axis is under-expressed on this base. The WBC "MgSO₄ = florality" claim may need a genuinely floral coffee to adjudicate. Bounds how hard we can lean on the florality axis here. → audit item.

## Comparison #1 read — HT1 / HT3 / WBC reconciliation (Mg pair)
**My locked predictions were PARTIALLY WRONG in an informative way — the per-axis SPLIT landed, but the axis ASSIGNMENTS flipped:**
- Predicted MgSO₄ = florality → **WRONG.** MgCl₂ carried the florality/citrus/acidity (the attack).
- Predicted MgCl₂ = body → **WRONG.** MgSO₄ is the body/creaminess/texture/sweetness agent.
- Predicted a per-axis split → **RIGHT.** They ARE complementary, not one-beats-the-other.

**Emerging rule (the real finding): the ANION sets the PHASE.** Chloride → attack / acidity / florality / clarity (light body); sulfate → body / sweetness / creaminess / texture. The cation (here both Mg) rides within. This is cleaner than BOTH prior frames (Track-1 "sulfate leads" and Lane-A "chloride reveals") — both collapsed a per-axis split into one number. The WBC per-axis discipline is what surfaced it.

**HT3 verdict (Mg pair) — pre-brew DIVERGES from post-brew, and the divergence IS the extraction effect.** Post-brew (Lane A) scored MgSO₄ muddy/worst (1.5); pre-brew, MgSO₄ is NOT muddy — it's a pleasant body/sweetness agent that beats distilled. So **the "sulfate muddies" post-brew finding was largely a POST-BREW ARTIFACT** — MgSO₄ must be present DURING extraction to express its body/sweetness contribution; dosed onto a finished brew it only muddies. This validates the hybrid method's whole premise (post-brew screening bounds, doesn't equal, extraction).

**WBC reconciliation (Mg pair):** our pre-brew does NOT put sulfate on florality the way the 2026 field does — it puts **sulfate on BODY, chloride on florality/acidity** (the reverse assignment). The field's convergence on "anion matters as much as cation" is CORROBORATED (the anion clearly sets the phase); the specific "MgSO₄ = florality" role is NOT reproduced on this coffee (bounded by the florality caveat above + single-coffee). Logged as a divergence to hold, not resolve.

**Substrate-fold:** still DEFERRED (single coffee). This is mechanism, per plan.

## Sitting 2 friction

**F11 (2026-07-02) — dilute gypsum stock settles; shake before dosing + GH-match the pair, don't port the drop-lock across cations.** CaSO₄ water first titrated **clean-on-4** (~1 drop under GH 44) while CaCl₂ read **clean-on-5** (on target) — a real GH mismatch that would have confounded the sulfate-vs-chloride read (a "lighter" CaSO₄ could be lower mineral, not the anion). Root cause: the 1,520 ppm dilute gypsum stock had **settled** over the 4-day rest — gypsum is barely soluble and drops out of a dilute stock **without visible cloudiness** (so "stocks look clear" did NOT guarantee the gypsum stock was homogeneous). Fix: re-shake the gypsum stock hard, top the CaSO₄ water +2–3 mL, re-titrate → **both calcium waters now clean-on-5, GH-matched.** Caught pre-brew. Two going-forward rules: (a) **SHAKE the dilute gypsum stock before every dose**; (b) the "5–6 drop band" was set on a **magnesium** water — endpoint sharpness is cation-dependent (L-c #1), so **do NOT port a drop count across cations**; instead require the two waters *within a pair* to match each other. Operational anchor: **true GH 44 flips clean-on-5** (Mg waters read clean-on-6 = the Mg endpoint dragging, F6).

## Predictions — locked 2026-07-02 BEFORE Comparison #2 tasting (Ca pair)
| Axis | Prediction (from the #1 "anion sets the phase" rule) |
|---|---|
| CaCl₂ | the ATTACK — acidity, clarity, citrus/lime (Sitting-1 "acid axis"); lighter body |
| CaSO₄ | the BODY — sweetness, roundness, creaminess, texture |
| Cation shift | Ca may read rounder/sweeter than Mg within each phase (HT2) |

## Comparison #2 — CaCl₂ vs CaSO₄ @ GH44/KH0 (calcium anion pair; both GH-matched clean-on-5 post-F11) — semi-blind, control=2
| Code | Water | Aromatics | Acidity | Sweetness | Body | Texture | Finish | Overall | Reveal/Inject | Beats distilled? | Notes (prose — the payload) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ctrl | distilled | lime/tomato | base | base | base | base | base | **2** | — | — | Consistent with prior controls; **feels flatter each round** as the palate recalibrates to the mineral cups. |
| A | **CaSO₄** | ~same as ctrl | **↓ muted** | **↑ deeper (brown-sugar)** | **↑ thicker, integrated (not creamy)** | **↑ thicker** | back-weighted | **2.5** | reveal (body-side) | **YES** | Brown-sugar/deeper sweetness, roundness, an **umami-ish** savory note that "makes you want to taste more." The **BACK / body phase.** "An interesting **component of something**, a little less in and of itself." |
| B | **CaCl₂** | ~same as ctrl | **↓ less** | ↑ but with an off-note | **↑ richer, oily-film** | **oily film** (like oil sitting on water) | — | **1.5** | inject (unpleasant) | **NO (below ctrl)** | **Lactic / cheesy quality (disliked)** + an oily-water-film mouthfeel. Worst cup of the sitting. No blend attempted ("don't like this B component"). |

## Comparison #2 read — the anion rule QUALIFIED; big HT3 divergence on CaCl₂
**Predictions half-right again — and the pattern of what broke is the finding.** Predicted CaSO₄ = body → **RIGHT** (brown-sugar sweetness, roundness, thicker body — the back phase). Predicted CaCl₂ = attack/acidity → **WRONG**, and not neutral-wrong: CaCl₂ went **muted + lactic/cheesy + oily**, the worst cup, *below* distilled.

**REVISED rule (supersedes the clean "anion sets the phase" from #1):**
- **SULFATE = a reliable body/sweetness agent, roughly cation-agnostic** — MgSO₄ (3.0) and CaSO₄ (2.5) both deliver the back/body phase (Mg a touch cleaner; Ca adds a savory-umami "component" quality). Sulfate's phase role is stable across the cation.
- **CHLORIDE = cation-GATED, not a fixed phase** — Mg+Cl is the bright attack/acidity/florality star (MgCl₂ 3.1, best cup); Ca+Cl turns muted/lactic/oily (CaCl₂ 1.5, worst cup). Same anion, opposite outcome, set by the cation.
- **Net: this is a cation×anion INTERACTION, not two independent main effects** — exactly Sitting 1's "attribute to the pairing, never a lone ion," now demonstrated on the chloride side. The #1 "anion sets the phase" framing holds for sulfate but breaks for chloride; don't over-generalize it.

**HT2 (Mg vs Ca) — now has strong signal.** On **chloride** the cation is decisive: **Mg ≫ Ca** (3.1 vs 1.5) — Mg+Cl bright, Ca+Cl lactic. On **sulfate** both work, **Mg slightly > Ca** (3.0 vs 2.5). Takeaway for this coffee: **Mg is the safer/better cation, especially with chloride.**

**HT3 (pre vs post) — the biggest divergence yet, on CaCl₂.** Post-brew (Lane A) CaCl₂ was the **bright acid/clarity standout (3.5, "the acid axis")**; pre-brew (Lane B) CaCl₂ is **muted/lactic/oily/unpleasant (1.5)** — opposite direction. Strong extraction effect: **Ca+chloride during extraction produces a lactic/oily quality that post-brew dosing cannot see.** This is a hard caution on the post-brew screen for Ca-chloride specifically — and it directly **undercuts Sitting 1's "two-chloride blend = best cup / candidate custom water" pointer**, which rested on CaCl₂ being the bright acid axis (a post-brew artifact).

**WBC reconciliation (Ca pair):** pre-brew, CaCl₂ moved **body-ward** (richer body + oily film) — closer to the 2026 field's "CaCl₂ = body" read than our own Lane A "CaCl₂ = acid/clarity." So pre-brew reconciles our CaCl₂ *toward* the field direction, but on this clarity coffee that body arrives with an unpleasant lactic/oily edge. Corroborates the field's cation/anion-both-matter thesis; the specific pleasantness is coffee-dependent.

**Recipe-library implication (shifts vs Sitting 1):** the candidate custom water moves **away from** Sitting 1's MgCl₂+CaCl₂ two-chloride blend (CaCl₂ is now a pre-brew liability) **toward MgCl₂ + MgSO₄** — the two best pre-brew singles, both on the good Mg cation, pairing the bright attack (MgCl₂) with the body (MgSO₄). → test head-to-head at #4.

**Comparisons #3 (MgCl₂ vs CaCl₂) + #6 (MgSO₄ vs CaSO₄) are now effectively answered** by #1+#2 (cation-on-chloride: Mg 3.1 ≫ Ca 1.5; cation-on-sulfate: Mg 3.0 ≳ Ca 2.5). Optional fresh cross-flight to confirm; otherwise the sequential reads stand.

**Substrate-fold:** still DEFERRED (single coffee).

## Build note — 300 mL switch (2026-07-02, from Comparison #4 on)
Operator switched built-water volume **500 mL → 300 mL**: 300 mL = one xBloom brew pool (247 g) + LaMotte headroom, near-zero waste. Doses scale ×0.6 from the per-500 table. GH lock (clean-on-5) is concentration-based → unchanged by build volume.

**F12 (2026-07-02) — blend (a) first-titrated GH~65 on exactly-correct doses; diluted to target.** Blend (a) = MgCl₂ 1.35 + CaCl₂ 0.98 / 300 mL (operator-confirmed exact; math = GH 44) first read **clean-on-7 (~GH 65)**. Blend (b) with the SAME MgCl₂ dose read clean-on-5 (on target) → the overshoot localizes to the sub-mL **CaCl₂ dose on the 0.1–1 mL pipette** (F9 small-dose imprecision) or a fast first titration. Fixed by +140 mL distilled → clean-on-4 (a hair under (b)'s clean-on-5, within kit resolution; the under-dose direction is harmless to the (b)>(a) hypothesis). Reinforces: verify EVERY built water; sub-mL fine-pipette doses are the error-prone step.

## Predictions — locked BEFORE Comparison #4 (blend showdown)
**(b) MgCl₂+MgSO₄ beats (a) MgCl₂+CaCl₂** — the Mg-blend pairs the two best singles cleanly; the two-chloride blend carries CaCl₂'s lactic liability (only partly masked by MgCl₂). If (a) shines instead, MgCl₂ rescues CaCl₂ in-blend.

## Comparison #4 — candidate-custom-water showdown @ GH44/KH0 — semi-blind, control=2
Semi-blind codes: **A = MgCl₂+MgSO₄ = blend (b)** · **B = MgCl₂+CaCl₂ = blend (a)**.
| Code | Blend | Aromatics | Acidity | Sweetness | Body | Texture | Overall | Reveal/Inject | Beats distilled? | Notes (prose — the payload) |
|---|---|---|---|---|---|---|---|---|---|---|
| ctrl | distilled | lime / tomato / brown tea | base | base | base | base | **2** | — | — | Benchmark, no change from prior controls. |
| A | **MgCl₂+MgSO₄** (blend b) | **more lemon / lime** | **↑ sharp, bright** | **↓ (not much)** | slightly ↑ / blended | slightly ↑ | **3** | **reveal** | **YES** | Bright lemon-lime, sharp; **focuses the front / attack, cleans up the back.** "Transforms the cup but still reveals what's there, doesn't interject too much." Even better cool. **WINNER.** (Operator aside: would pair interestingly with a clarity/intensity split brew method.) |
| B | **MgCl₂+CaCl₂** (blend a) | rounder, body / tea-centric | ↑ | **↑↑ (more than A)** | ↑ more textured | ↑ | **2.5** | **inject** | YES (> ctrl) | More sweet + body, but an **over-steeped TEA quality**; "emphasizing the back," "**interjecting too much**" of a sweet-complex side this coffee doesn't have. **NO lactic/cheese** — MgCl₂ masked CaCl₂'s edge. Liked less *for this coffee.* |

## Comparison #4 read
- **Prediction CONFIRMED: (b) MgCl₂+MgSO₄ (3.0) > (a) MgCl₂+CaCl₂ (2.5).** The Mg-blend is the better candidate custom water for this coffee.
- **MgCl₂ RESCUES CaCl₂'s lactic edge in-blend (new finding).** Pure CaCl₂ was lactic/cheese/oily (1.5, #2); in the MgCl₂+CaCl₂ blend that quality is **gone** — replaced by sweet/body/over-steeped-tea. So Sitting 1's two-chloride "best cup" pointer isn't dead — MgCl₂ redeems CaCl₂ — but for THIS clarity coffee the two-chloride blend **over-interjects** a back-sweetness the coffee lacks.
- **The best BLEND (3.0) does NOT beat the best SINGLE — MgCl₂ solo (3.1) is the pre-brew PEAK.** Adding MgSO₄ body or Ca to MgCl₂ doesn't improve it on this clarity/citrus coffee. "Less is more" reinforced: the bright chloride attack, alone, wins.
- **Reveal/inject mapping is clean:** A (Mg-blend) reveals what's there; B (two-chloride) injects a back-sweetness the coffee doesn't have.
- **Full pre-brew ranking (Lane B, single coffee):** **MgCl₂ 3.1** > MgCl₂+MgSO₄ 3.0 ≈ MgSO₄ 3.0 > MgCl₂+CaCl₂ 2.5 ≈ CaSO₄ 2.5 > control 2.0 > CaCl₂ 1.5.
- **Recipe-library pointer (this coffee, PROVISIONAL, single-coffee):** **MgCl₂-forward, minimal/zero sulfate, avoid Ca.** Coffee-dependence caveat holds — a body-wanting coffee could flip toward MgSO₄ / blends.

**Substrate-fold:** still DEFERRED (single coffee).

## Predictions — locked BEFORE #5 (buffer on MgCl₂ peak base)
KH ~13 **slightly flattens the lime brightness** (bicarbonate mutes acid; clarity is this coffee's win); watch for a Lane-A-style *liked* sweet lift instead. NaHCO₃ (Na), not K.

## #5 build note (2026-07-02)
Both MgCl₂ arms = 2.7 mL / 300 mL. Hardness both **clean-on-7** (MgCl₂ endpoint drag on a correct GH-44 dose; matched to each other). Alkalinity: **KH0 arm = 1 drop (floor ✓)**, **KH~15 arm = clean-on-3 (≈KH 15 ✓)**. GH+KH tests depleted ~30–35 mL/arm → both **topped back to 300 mL with distilled equally** (→ ~GH 40 / KH ~13, still matched). F13: the 25 mL alkalinity draw + hardness draw left a 300 mL build too close to the 247 g brew volume — going forward, build ~330–350 mL when a comparison needs a full KH titration, or top back to a matched volume (done here).

## #5 — buffer check @ MgCl₂ base, KH0 vs KH~13 — semi-blind, control=2
Semi-blind codes: **A = MgCl₂ / KH 0** · **B = MgCl₂ / KH ~13**.
| Code | Water | Aromatics | Acidity | Sweetness | Body | Texture | Overall | Beats distilled? | Notes (prose — the payload) |
|---|---|---|---|---|---|---|---|---|---|
| ctrl | distilled | flat; lime/tomato/brown tea | base | base | base | base | **2** | — | Benchmark, unchanged. |
| A | **MgCl₂ / KH 0** | **burnt / oversteeped** | **↓ muted** | **↓** | **↑ dominant** (dark brown-tea over-steep) | = | **~2 (≈ ctrl or slightly less)** | ~no | "Burnt/oversteeped; body takes over; generic brown-nutty-tea to the front." **⚠️ burnt = a brew-fault descriptor — see read.** |
| B | **MgCl₂ / KH ~13** | clean (no burnt note) | **↑** | **↑** | = | = | **3** | **YES** | Lighter, brighter, tasty acidity + citrus; "much preferred." ≈ the original MgCl₂/KH0 peak (3.1). |

## #5 read — SURPRISING as-tasted, but CONFOUNDED → HT4 NOT cleanly answered
**As tasted:** B (KH~13) > A (KH0) — the *buffered* arm brighter/sweeter, inverting both the locked prediction and the bicarbonate-mutes-acid premise. Operator flagged it as surprising.

**⚠️ DO NOT FOLD THIS. The read is confounded by an apparent brew fault on A:**
- A = MgCl₂/KH0 is the **same water that was our bright PEAK at 3.1** (#1/#4). It cannot be both the 3.1 citrus peak and a ~2 burnt-flat cup. **"Burnt/oversteeped" is a brew-fault (over-extraction) descriptor, not a property 0-vs-13 ppm KH imparts.** → A's brew most likely over-extracted.
- B (KH~13) scored **3 ≈ the original MgCl₂/KH0 peak (3.1)** → B is where MgCl₂ *should* land; **A is the anomaly.** Parsimonious reading: A was a bad brew, NOT "KH0 < KH13."
- Operator's tasting is trustworthy (he correctly *detected* the burnt fault on A); it's the causal attribution to KH that the fault breaks.
- **Methodological note (candidate primitive):** pre-brew single-water comparisons are exposed to **brew-to-brew variance** — each cup is a separate full brew — unlike Lane A post-brew dosing off one base brew. A surprising *secondary-axis* pre-brew result must **reproduce on a clean re-brew** before folding. (The auto-retest / cross-confirmation primitive, earning its keep.)

**HT4 VERDICT: INCONCLUSIVE this sitting** — confounded by a probable over-extraction on the KH0 arm. The "KH brightens" direction is a **flag to retest**, not a finding. The operator's standing **"less is more / minimal KH"** lean is neither confirmed nor overturned; it stands as the working assumption. Clean retest = rebuild both arms, brew both carefully (watch extraction), re-taste; claim the direction only if it reproduces.

**Cooling cross-check (operator, 2026-07-02) - clinches the confound:** as the two #5 cups cooled further, **A brightened and CONVERGED toward B** (they became "much harder to tell apart"). If KH were genuinely flattening acid, the gap would WIDEN as they opened; instead it closed. That is the signature of a *temperature / over-extraction* artifact on A, not a KH effect. Operator also self-reported back-to-back-brewing fatigue and elected to pause and re-run #5 fresh. HT4 remains INCONCLUSIVE; re-queued to a fresh sitting.

**Substrate-fold:** still DEFERRED (single coffee).

---

# TRACK 2 HANDOFF BRIEF - Sittings 1 + 2 (Lane A + Lane B core)

**Date:** 2026-07-02
**Session role:** execution + handoff brief production (no substrate edits; archive-persist commit only). Research Assistant.
**Archive location:** branch `claude/beautiful-merkle-2e5a59` @ `6565a13` (content commit; fetch branch HEAD for latest incl. this stamp commit). Archive doc committed + pushed; substrate NOT touched; NOT merged to main.
**Methodology verdict:** **Lane B pre-brew REFRAMES the binary inversion into a cleaner mechanism.** The Lane A post-brew "chloride reveals / sulfate muddies" did NOT hold as-stated pre-brew; the real finding is **anion-sets-a-phase + cation-gating** (below). HT3 (pre-vs-post) DIVERGES, and the divergence is the extraction effect - validating the hybrid's whole premise. Two secondary items (HT4 buffer, HT5 SBL) are re-queued to a short 3rd sitting.

## Scope
- **Sitting 1 (2026-06-28):** Step 0 full calibration + Lane A post-brew single-salt screen + SBL bonus (invalidated by F10). Its close-out brief is above.
- **Sitting 2 (2026-07-02):** Step 0 abbreviated + **Lane B pre-brew isolations #1-4 (the rigorous core)**: MgSO₄ vs MgCl₂ (#1), CaCl₂ vs CaSO₄ (#2), the candidate-water blend showdown (#4), and the buffer check (#5, inconclusive). #3/#6 answered by #1+#2. **Tail (3rd sitting):** #5 buffer retest + #7 SBL recon-vs-bottled.

## TL;DR - the resolved mechanism (Lane B pre-brew, single coffee, PROVISIONAL)
- **The ANION sets a PHASE; the CATION gates it.** SULFATE -> body / sweetness / creaminess / texture, roughly **cation-agnostic** (MgSO₄ 3.0, CaSO₄ 2.5). CHLORIDE -> attack / acidity / florality / clarity, but **cation-GATED**: Mg+Cl is the bright star (MgCl₂ **3.1, pre-brew peak**), Ca+Cl turns muted / lactic / oily (CaCl₂ **1.5, worst**). It is an interaction, not two clean main effects - "attribute to the pairing, never the lone ion."
- **HT3 (pre vs post) DIVERGES = the extraction effect.** MgSO₄: post-brew muddy/worst (1.5) -> pre-brew a pleasant body agent (3.0) - sulfate must be present DURING extraction to express body/sweetness. CaCl₂: post-brew bright acid standout (3.5) -> pre-brew lactic/oily/worst (1.5) - the biggest divergence. Post-brew screening is a **bounded proxy**: it caught the coarse chloride-good / sulfate-muddy *ranking* but inverted the *mechanism* and mis-called specific pairings.
- **MgCl₂ RESCUES CaCl₂ in-blend.** Pure CaCl₂ lactic/oily (1.5); MgCl₂+CaCl₂ blend has NO lactic note (2.5) - just over-interjects a back-sweetness this clarity coffee lacks. Sitting 1's two-chloride "best cup" pointer survives but is not the top pick here.
- **Best BLEND (MgCl₂+MgSO₄ 3.0) does NOT beat the best SINGLE (MgCl₂ 3.1).** "Less is more" reinforced: on this clarity/citrus coffee the bright chloride attack, alone, is the peak.
- **Full pre-brew ranking:** **MgCl₂ 3.1** > MgCl₂+MgSO₄ 3.0 ≈ MgSO₄ 3.0 > MgCl₂+CaCl₂ 2.5 ≈ CaSO₄ 2.5 > control 2.0 > CaCl₂ 1.5.

## HT verdicts
- **HT1 (sulfate vs chloride):** REFRAMED - not "one reveals," but anion=phase + chloride cation-gating (above). The binary inversion framing is superseded.
- **HT2 (Mg vs Ca):** **Mg is the safer/better cation** on this coffee - decisive with chloride (MgCl₂ 3.1 ≫ CaCl₂ 1.5), slight edge with sulfate (MgSO₄ 3.0 ≳ CaSO₄ 2.5).
- **HT3 (pre vs post - the centerpiece):** **DIVERGES; the divergence IS the extraction effect** (above). Validates the hybrid design.
- **HT4 (buffer):** **INCONCLUSIVE** - confounded by a probable over-extraction on the KH0 arm (burnt/oversteeped; cups converged on cooling). Re-queued. Operator's minimal-KH lean stands as the working assumption.
- **HT5 (SBL rig / recon-vs-bottled):** **NOT RUN** this sitting; re-queued to the 3rd sitting (#7, done right = brew the recon WATER directly vs bottled SBL at matched strength).

**Did the inversion hold pre-brew?** (the spawn-prompt centerpiece) - **Partially, and reframed.** Pre-brew, sulfate is NOT muddy (rehabilitated to a body agent) and chloride is NOT uniformly the reveal (cation-gated). The practical "chloride-forward for THIS coffee" conclusion SURVIVES (MgCl₂ is the peak), but the mechanism is richer than "chloride reveals" - it is anion->phase + cation-gating.

## WBC-field reconciliation (ref: [wbc-2026-water-handoff.md](docs/research-projects/wbc-2026-water-handoff.md))
- **CORROBORATED (strongly):** the field's "the anion matters as much as the cation" - our anion clearly sets a phase.
- **NOT reproduced on this coffee:** the field's specific role labels (MgSO₄ = florality; CaCl₂ = body). We got **sulfate = body, chloride = florality/attack**, and CaCl₂ = lactic (not clean body). Bounded by single-coffee + the Pink Bourbon is not a floral coffee (florality axis under-expressed - operator caveat). Mechanism agrees; the specific role-labels are coffee-dependent. Logged as a divergence to hold, not resolve.

## Recipe-library pointer (this coffee, PROVISIONAL, single-coffee)
**MgCl₂-forward, GH ~44, minimal/zero sulfate, avoid calcium, minimal KH** (pending the clean #5 retest). Peak cup = straight MgCl₂ @ GH 44. Coffee-dependence caveat: a body-wanting coffee could flip toward MgSO₄ / blends.

## New lessons captured (Sitting 2 - candidate primitives; do NOT promote mid-session)
| # | Lesson | Note |
|---|---|---|
| L-c #7 | **Per-axis directional scoring (WBC fold) surfaces complementary splits a single overall-score collapses.** It is the reason anion->phase was visible at all; Track 1 + Lane A both hid it inside one number. | Candidate active-mode primitive |
| L-c #8 | **Pre-brew single-water comparisons carry brew-to-brew variance** (each cup is a separate full brew) unlike post-brew dosing off one base brew; a surprising *secondary-axis* pre-brew result must reproduce on a clean re-brew before folding. | The #5 confound; auto-retest primitive earning its keep |
| L-c #9 | **LaMotte GH drop-count is salt/cation-specific** (Ca ≈ clean-on-5, Mg ≈ clean-on-6/7 for true GH 44) - do NOT port the drop-lock across cations; match the two waters *within a pair* instead. | Refines F11 / L-c #3 |
| L-c #10 | **Shake dilute low-solubility stocks (gypsum) before every dose** - they settle without visible cloudiness ("looks clear" is not "homogeneous"). | F11 |
| L-c #11 | **WATER-vs-CONCENTRATE labeling held clean all sitting** (every built liquid tagged WATER, brewed direct) - the F10 fix worked, no repeat. | Confirms L-c #6 |

## Friction (Sitting 2)
- **F11** - dilute gypsum stock settles; shake before dosing + GH-match the pair (don't port the drop-lock across cations). Caught pre-brew.
- **F12** - blend (a) first-titrated GH~65 on exactly-correct doses (sub-mL CaCl₂ pipette imprecision / fast first titration); fixed by dilution. Verify EVERY built water.
- **F13** - a 300 mL build is too tight for a comparison needing a full 25 mL KH titration + hardness draw; build ~330-350 mL when a full alkalinity read is planned, or top back to a matched volume.

## Open tail (3rd sitting - short, fresh palate)
1. **#5 buffer retest (HT4)** - rebuild MgCl₂/KH0 vs MgCl₂/KH~13, brew BOTH carefully (watch extraction - the confound was a brew fault), re-taste per-axis; claim a direction only if it reproduces. Let cups cool fully before the final read (they converged on cooling this time).
2. **#7 SBL recon-vs-bottled (HT5)** - build the SBL-equivalent WATER from single-salt stocks (F7 profile), brew it DIRECTLY, A/B vs bottled SBL at matched strength (both finished waters - the F10 discipline). The Sitting-1 attempt was invalidated (B ended ≈distilled).

## Substrate edit specifications
**NONE. Substrate-fold DEFERRED per the single-coffee rule.** Every finding is on one coffee (Pink Bourbon). Candidates to hold for the post-2nd-coffee fold (do NOT apply now): (a) a CONTEXT-taste refinement on anion->phase + cation-gating + the coffee-dependence of the phase you want; (b) the MgCl₂-forward recipe-library seed for this coffee; (c) an L-candidate graduation pass (L-c #1-11) at the PROJECT retro. The Coordinator/compile session records these as deferred, does not execute them.

### Execution Session Termination (Sitting 2)

```
Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive")
- ✅ Archive doc committed @ 6565a13 + pushed to branch claude/beautiful-merkle-2e5a59 (this stamp commit is HEAD; fetch branch HEAD for latest)
- ✅ Track 2 handoff brief (Sittings 1+2) produced above; branch + SHA in its Archive location: header
- 🛑 Session pausing after this brief. Tail = #5 buffer retest (HT4) + #7 SBL recon-vs-bottled (HT5), both re-queued to a short fresh 3rd sitting per operator fatigue call. The Coordinator decides substrate-fold (DEFERRED on single-coffee) + schedules the 3rd sitting.

End of Single-Mineral Isolation Sitting-2 (Lane B core) handoff.
```
