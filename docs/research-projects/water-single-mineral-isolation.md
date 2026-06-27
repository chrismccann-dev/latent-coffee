# Single-Mineral Isolation — Clean-Reagent Cohort (Research Project #6, Track 2 / Phase 2)

*Coffee Research · Latent · Research Project*

**Version:** 0.1 (DRAFT — Coordinator-authored, pre-execution)
**Date drafted:** 2026-06-21
**Date executed:** _(Assistant fills)_
**Status:** 🟡 **DRAFT — awaiting Assistant-session execution.** Coordinator-scoped; not yet run.
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
| MgSO₄·7H₂O | | 10,000 | | |
| MgCl₂·6H₂O | | 10,000 | | |
| CaSO₄·2H₂O | | ~1–2 g/L (dilute) | | |
| CaCl₂·2H₂O | | 10,000 | | |
| NaHCO₃ | | 10,000 | | |
| KHCO₃ | | 10,000 | | |

### Built-water verification (Step 0.3 / Lane B — LaMotte)
| Water | Target GH/KH | Measured GH (Ca/Mg split) | Measured KH | Sulfate/Cl | Tuned? |
|---|---|---|---|---|---|

### Predictions (pre-state HT1–HT5)
| Comparison | Predicted direction |
|---|---|

### Per-cup scoring (1–5; one row per cup)
| Code | Water/ion | Lane | GH/KH | Acidity | Sweetness | Body | Clarity | Finish | Bitterness | Astringency | Flavor specificity | Overall | Reveal/Inject | Notes (prose — the payload) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

### Per-axis summary (fill after scoring)
| Factor isolated | Direction | Sweet-spot GH/dose | Pre-brew confirms post-brew? | Beats distilled? |
|---|---|---|---|---|
| Sulfate vs chloride | | | | |
| Mg vs Ca | | | | |
| KH level / source | | | | |

---

## Notes / friction (capture inline — the doc IS the archive)

_(Assistant: log friction, surprises, ergonomics here.)_

## New lessons (candidate primitives — for the Coordinator's PROJECT retro)

_(Assistant: log candidates. Do NOT promote to cluster docs — that's the retro's job, after Phase 2 + the 2nd coffee.)_

## Audit items queued

_(Assistant: carry P6T1-AI-3 — the TONIK roasted-barley confound re-test — into this track if a TONIK reference cup fits; otherwise re-queue it. Log anything needing Coordinator decision or substrate-fold.)_

---

## HANDOFF BRIEF FOR COMPILE / COORDINATOR (fill at session end)

_(Assistant: produce per [`handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md): TL;DR · execution summary · equipment/conditions · per-cup raw data · analysis · final output (the isolation map: sulfate-vs-chloride, Mg-vs-Ca, buffer) · key findings · HT3 pre-vs-post verdict · HT5 rig-validation result · substrate-edit specs (likely still DEFERRED — single coffee) · new lessons · audit items · open data items · `Archive location:` branch + SHA · termination declaration.)_

### Execution Session Termination (template — fill + keep)

```
Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive
- ✅ Archive doc committed + pushed to branch <branch> @ <SHA>
- ✅ Handoff brief produced above; branch + SHA in its Archive location: header
- 🛑 Session terminating. The Coordinator decides the next track / substrate-fold.

End of Single-Mineral Isolation close-out.
```
