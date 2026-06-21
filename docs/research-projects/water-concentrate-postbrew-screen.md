# Water Concentrate Post-Brew Screen — Owned-Concentrate Cohort (Research Project #6, Track 1)

*Coffee Research · Latent · Research Project*

**Version:** 0.1 (DRAFT — Coordinator-authored, pre-execution)
**Date drafted:** 2026-06-20
**Date executed:** _(Assistant fills)_
**Status:** 🟡 **DRAFT — awaiting Assistant-session execution.** Coordinator-scoped; not yet run.
**Platform:** xBloom (controlled-pour) driving a Hario V60 dripper, fixed no-modulation recipe
**Home setup:** distilled base from the Mini Classic countertop distiller; A&D EJ-123 balance; Apera EC60; LaMotte BrewLab + API GH/KH; 4E's micropipettes; INTLLAB magnetic stirrer; amber dropper bottles

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
- Apply "what changed" file edits as part of close-out
- Continue past the handoff brief to "finish the job"

**DO:**
- Read this protocol doc in full BEFORE Step 0
- Walk Chris through Step 0 (inventory + stock-prep verification + base-water baseline + pre-pull-1 calibration + semi-blind setup + vendor design-intent capture)
- Run tasting cups one-at-a-time (Lesson #7 tool-call-per-cup pacing)
- Capture friction + new lessons + audit items inline in this protocol doc's Notes section (the doc IS the archive — Lesson #12)
- Produce a handoff brief at the end (per [`handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md))
- **Commit + push the archive doc (this protocol doc) to your session branch at termination; record branch + SHA in the brief's `Archive location:` header** (the authorized archive-persist exception — an uncommitted archive isn't an archive)
- **TERMINATE the session after the handoff brief.** Do not continue to substrate commits.

**Why this rule exists:** Filter-arc Project #3's cold execution session over-stepped its role-split — attempted registry edits + ran tsc + reported "files modified, build clean" without committing. When the compile session checked, the claimed edits were not present in any branch (working state was ephemeral and lost). The compile session had to re-do all substrate integration. Lesson #40 is non-negotiable. Full primitive doc: [`role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md).

---

## Project Context

This is **Research Project #6** of the Latent research arc — water chemistry, flagged in the [research roadmap](docs/skills/research-coordinator/cluster/roadmap.md) as "honestly probably the most important one" (huge WBC payoff: most WBC champions arrive at custom water). It is the **THIRD research project overall** and the **SECOND taste-shaped project** (filter arc = flow-shaped; RP5 filter-textural-quality = first taste-shaped). Per the cross-project ratification gate in [`process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md), RP6's retro is where the RP5-seeded taste-study primitive candidates **graduate** if they fire a second time (see § Inherited methodology).

**The project thesis — reveal-not-inject.** The goal is NOT "find the best built water." It is to **learn what each mineral move does to a known coffee, including the threshold where it stops *revealing* the coffee and starts *injecting* a flavor that masks origin / process / variety.** This frame is the **Dashwood guardrail** — built waters let you "play within a box" of high-chloride / high-sulfate results; over-dosing minerals behaves like high-intervention processing or a dark roast (an intense, likeable signal that masks provenance) — reconciled with Latent's taste apex ([CONTEXT-taste.md](CONTEXT-taste.md): `reveal-not-inject` / `layered-evolving`). The Roast Summit chemistry supplies the mechanism: bicarbonate is engineered to destroy acid molecules (mutes acidity), and Ca/Mg bind extraction-active compounds, so the "built-water box" is real and measurable.

**Project phase shape:**
- **Phase 1 (concentrate screen — THIS track + any siblings):** post-brew mineralization of the owned commercial concentrates against a distilled control + a built-vs-natural water arm. Build the difference-vocabulary; map each product's direction + sweet-spot dose + masking threshold. Treat concentrates as **finished black-box profiles, not clean mineral variables.**
- **Phase 2 (DIY isolation — later tracks):** clean single-reagent system (MgSO₄ / MgCl₂ / CaSO₄ / CaCl₂ / NaHCO₃ / KHCO₃ — ordered at this intake, in transit) independently varying Ca / Mg / Na / K / buffer at constant GH/KH. **Bridge to Phase 2:** reconstruct the *disclosed* SBL Juicy & Sweet recipe from raw salts (Epsom 10 g / CaCl₂ 3 g / MgCl₂ 4 g / NaHCO₃ 3.4 g / KHCO₃ 4 g → GH 44 / KH 20) and confirm the rig hits GH 44 / KH 20 on the LaMotte before varying one ion at a time. End game: per-coffee water recipe library, possibly its own sub-skill.

**This track (Track 1) is Phase 1's opening screen.** It does not touch raw salts (not yet arrived). It screens the seven owned commercial concentrates by **post-brew mineralization** — the operator's chosen method, because it perfectly controls the coffee base (one brew, many cups) and sidesteps the method-mismatch problem (NÉMO is an AeroPress competition profile, not a V60 water).

**Locked scope (RP5 close + this intake's scoping conversation):**
- **Platform:** xBloom, **fixed no-modulation V60.** Single-variable isolation — change only the water, everything else constant. (Phase-modulation drippers are deliberately OUT.)
- **Coffee:** Hydrangea Pink Bourbon Washed, operator baseline-dialed. A **clarity-weighted coffee is a sensitive masking detector** — exactly what the reveal/inject threshold hunt wants. Known-baseline is what lets subtle water deltas read.
- **Base water:** distilled (Mini Classic distiller), the ~0-mineral blank canvas.
- **Built-vs-natural arm:** IN (Dashwood guardrail) — see Lane C.
- **Blinding:** **semi-blind** — operator codes/shuffles the cups; bias risk is low because the outcomes are genuinely unknown to the operator.
- **Method:** all **post-brew** mineralization for the concentrate lanes; pre-brew only for the finished-water arm (Lane C), because a finished water can't be simulated by dropping it into a cup.

**The platform-vs-best-cup tension (carry as a caveat, do not try to resolve here).** The xBloom-fixed-V60 answers "how water affects a *controlled* cup," not "how water affects my best Sworks cup." That is deliberate — reproducibility requires the single-variable lock. The Sworks "best-cup" question is a separate non-experiment thread, not this project.

---

## The Post-Brew Screening Mechanism (load-bearing — read carefully)

There are two ways minerals can meet the coffee:

- **Pre-brew:** build the brew water (distilled + minerals), then brew. Minerals are present during extraction, so they change BOTH what is extracted AND how the cup tastes. Comparing N waters means N full brews — coffee-expensive, and brew-to-brew pour/grind/temp wobble muddies the water comparison.
- **Post-brew (post-mineralization):** brew ONE distilled batch, split into cups, dose concentrate INTO the already-brewed cup. Every cup is the same coffee, so any difference IS the mineral, not brewing noise.

**This track uses post-brew for the concentrate lanes.** Why it's the right screening tool here:
- One brew feeds many comparisons — cheap on coffee and time.
- Perfectly controlled base — zero brew-to-brew variability, so the data is the mineral.
- Fast at learning **direction** ("LYLAC rounds + adds florality, TONIK lifts acidity, JAMM adds weight") and **dose** (a 3/6/10-drop ladder finds the point where a mineral tips from revealing into masking — the Dashwood threshold made testable).
- Method-agnostic: drop-dosing NÉMO into a cup is fairer than judging it brewed on a V60 it wasn't designed for.

**The one caveat (Roast Summit chemistry).** Post-brew tells you the mineral's **flavor / perception** direction but **NOT its extraction effect**, because the minerals weren't present during the brew. So this is a **screening tool, not final proof.** A concentrate that wins post-brew is a candidate for a future pre-brew confirmation track, not a settled answer. Record this distinction; don't over-claim from a post-brew win.

**Concentrate vs finished-water distinction (drives lane assignment).** A true concentrate (30,000+ ppm: APAX TONIK/JAMM/LYLAC, KONFLUX, NÉMO, DAK Hydro Drops, plus the SBL + Sooper dry-mix stocks) is strong enough to drop-dose into a finished cup. **TWW is NOT a concentrate** — one stick into ~0.8 gal is a *finished* ~150 ppm brew water (and the operator brews it at 1/3 dilution, ~50 ppm). You cannot meaningfully drop a finished water into a cup. So **TWW lives in the pre-brew finished-water arm (Lane C) alongside the natural waters**, not in the post-brew lanes.

---

## Inherited methodology (filter arc → RP5 → this taste study)

This track's dependent variable is **taste**, so flow-specific filter-arc primitives don't fire. What transfers, plus the RP5-seeded taste-study primitive **candidates** that graduate at this project's retro if they fire again:

| Primitive | Source | Applies here? |
|---|---|---|
| Physical-photo inventory in Step 0 | Filter #1 Lesson #1 | ✅ Photograph every owned concentrate + the mixed stocks; catch inventory/label drift before scoring |
| SKU / label-convention notes | Filter #1 Lesson #2 | ✅ The chloride-forward vs sulfate pattern; TWW concentration (1 stick/~0.8 gal, brewed at 1/3); SBL disclosed recipe; Sooper undisclosed |
| Tool-call-per-cup pacing | Filter #1 Lesson #7 | ✅ One tasting cup per tool call; the per-cup prose IS the payload — never batch |
| The doc IS the archive | Filter #2 Lesson #12 | ✅ All readings + prose + leakage captured inline here |
| Pre-stated hypothesis tests (active mode) | Filter #4 Lesson #16 | ✅ HT1–HT4 below; log the prediction before each cup |
| Auto-retest / cross-confirmation | Filter #1 Lesson #5 | ✅ (repurposed) Ambiguous read → re-taste; two same-family concentrates reading identically cross-confirms |
| **xBloom-as-controlled-platform** | RP5 candidate | ✅ (watch — 2nd fire) Lock recipe, change only the water |
| **Consumption-ceiling / palate-fatigue budgeting** | RP5 candidate | ✅ (watch — 2nd fire) Taste discrimination degrades fast with cup count — see § Sample size + fatigue |
| **Per-axis tasting prompts** | RP5 candidate | ✅ (watch — 2nd fire) The 9 sensory axes below are scored per cup |
| **Paired-A/B-vs-baseline reading** | RP5 candidate | ✅ (watch — 2nd fire) Every dosed cup is read A/B against the distilled control |
| **Dial-in-from-`/brew`** | RP5 candidate | ✅ (watch — 2nd fire) The baseline recipe comes from the operator's `/brew` dial-in of this coffee |

Do NOT pre-generalize the candidates into cluster primitives mid-session. Log whether each fired cleanly; graduation is the **Coordinator's retro call**, not the Assistant's.

**New for the water study (no prior precedent — candidate primitives for the retro):**
- **Reveal-vs-inject flag:** every dosed cup gets a binary read — did this dose *reveal* the coffee (more of what's already there) or *inject/mask* (a flavor that coats over the coffee)? This is the project thesis operationalized.
- **Concentrate-as-black-box discipline:** do NOT attribute a concentrate's effect to a single mineral. These are blended products (most are 5-7 salts). Record the *product's* direction, never "this is the magnesium." Single-mineral attribution is Phase 2's job.

---

## Hypothesis Tests (pre-state per Lesson #16 active mode)

Log each prediction in the recording sheet BEFORE the relevant cup; log the actual reading + diagnosis after.

### HT1 — Do the concentrates produce distinguishable directions on this coffee?
On the clarity-weighted Pink Bourbon, post-brew, do the owned concentrates read as *distinct* directions, or do they converge (e.g. all the chloride-forward APAX/DAK/NÉMO read the same "salty-round-finish")?
- **If distinct:** the difference-vocabulary is real and worth building per-product cells.
- **If convergent:** the owned set under-samples the map (the chloride-forward bias), and the finding is "buy/build sulfate-side waters to get range" — which is exactly what Phase 2's clean kit provides.

### HT2 — Where is each product's reveal→inject threshold?
For the dose-laddered standouts (Lane B), at what dose does each tip from revealing the coffee into masking it? Predict a threshold dose per product before laddering.
- This is the Dashwood guardrail as a measurement. The clarity coffee should make the threshold visible earlier than a heavy natural would.

### HT3 — Built vs natural (the Dashwood question)
Does the best post-brew built cup beat the Pink Bourbon brewed with a good natural water (bottled spring) and with filtered tap (Lane C)? Or does a natural water reveal the coffee at least as well with less "injected" character?
- **If built wins clearly:** the build-your-own enterprise is justified for this coffee.
- **If natural holds its own:** Dashwood's caution lands, and the project's emphasis shifts toward "minimal, revealing" builds over "maximal, flavoring" ones.

### HT4 — Does TWW (the known commercial benchmark) beat the distilled control?
TWW Classic Light is the SCA-spec benchmark. Brewed at the operator's house 1/3 dilution, does it clearly beat distilled-control on this coffee, and where does it sit vs the post-brew concentrate winners?
- Anchors the whole screen against a widely-used reference.

---

## Step 0 — Calibration arc (run to completion BEFORE any scoring)

Step 0 is not optional. Selected primitives from [`calibration-arc.md`](docs/skills/research-coordinator/cluster/calibration-arc.md); the ones that fire must fire fully before tasting begins.

### 0.1 Physical-photo inventory cross-check (LOAD-BEARING)
Photograph every owned concentrate + every mixed stock. Confirm against the inventory table in § Recording Sheet. Catch: which dry stocks are mixed vs pending (Sooper was unmixed at intake), bottle fill levels, any spoiled/separated stock. **An owned-but-unmixed dry packet is not yet a testable stock** — note its state.

### 0.2 Stock-prep verification (the three dry products)
TWW, SBL Juicy & Sweet, and Sooper are dry; they must be mixed to liquid stocks first.
- **Mixing discipline:** room-temp distilled + the magnetic stirrer, 5–10 min, is the default. For a stubborn packet, warm distilled (~50–60 °C) speeds dissolution; **do not hold at a rolling boil** (sustained boiling slowly converts bicarbonate → carbonate, shifting the buffer). **Cool to room temp before dosing/storing; let the stock go clear** (Sooper says overnight). Read each finished stock on the EC60 once and log it (batch-to-batch reproducibility check).
- **Stock-strength + storage:** keep the **calcium-bearing concentrate stocks physically separate** from any sulfate/bicarbonate stocks (precipitation risk). Label each stock: product + ppm-est + date mixed.
- **TWW caveat:** TWW is a *finished water*, not a concentrate → it goes to Lane C (brewed), not the post-brew lanes. Record the operator's house dilution (1/3 TWW : 2/3 distilled) as the Lane C TWW recipe.
- Sooper: if unmixed at session start, mix it first (or run Lane C + the other concentrates and add Sooper once clear).

### 0.3 Base-water baseline + pre-pull-1 calibration shot
- Verify distilled base on the EC60 (expect near-0 µS/cm; calibrate the EC60 against the 84 µS/cm low standard first).
- **Record the operator's baseline-dialed `/brew` recipe for this coffee** here (dose / ratio / temp / pour structure / total time). This is data capture, not a placeholder — it's the fixed recipe every cup inherits.
- **Run one full xBloom V60 brew at that recipe with plain distilled and taste it.** This is the calibration shot + the distilled control. Confirm the baseline-dialed Pink Bourbon brews as expected (no grinder/temp drift). If it's off, fix before scoring. This distilled brew also becomes the base batch the post-brew lanes are split from — brew enough volume (pool 2 brews of the same distilled recipe if one xBloom batch is too small; pooling identical-recipe brews keeps the base identical).

### 0.4 Vendor design-intent capture
Before scoring, record each concentrate's vendor-stated direction (from the operator's concentrate TSV) — e.g. TONIK "vibrant/bright/juicy," JAMM "rich/sweet/creamy," LYLAC "elegant/floral/silky," KONFLUX "round/coating texture," NÉMO "heavy/sweet," SBL "clarity/sweetness/acidity," DAK house profile, Sooper "house pourover." **Substrate context, not prediction** — used post-test to validate or contradict, not to bias the read. Capture each product's published per-cup dose too (most APAX: 5–10 drops/200 mL).

### 0.5 Semi-blind setup
The operator codes the cups (random letters/numbers) and shuffles so the cup-to-product mapping is hidden during tasting; the operator un-blinds only when recording. Because outcomes are genuinely unknown, this is sufficient — no second person required. Decide the coding scheme here and keep the key sealed until scoring of a flight completes.

### 0.6 Skipped primitives (be explicit)
- **Brewer-capacity sanity** — N/A (single fixed recipe, known xBloom volume). Skip.
- **Alias-map audit** — N/A (no canonical-registry-anchored entries this track). Skip.
- **Bimodality / no-bed screen** — N/A (dependent variable is taste, not flow/drawdown). Skip.

---

## Experiment design — three lanes

Hold constant across everything: the coffee, the grind, the xBloom V60 recipe, water temperature at tasting (cool every cup to the same drinking temp before scoring — temperature is a confound), the cup volume (200 mL), and one dropper/pipette per product.

### Lane C — Pre-brew finished-water flight (the built-vs-natural arm + benchmark)
Four small brews of the Pink Bourbon, no additives, read side-by-side:
1. **Distilled** (control — reuse the Step 0.3 calibration brew)
2. **TWW** at the operator's house 1/3 dilution
3. **Bottled spring** (published-mineral, e.g. Castle Rock / a soft spring)
4. **Filtered tap**

Answers HT3 + HT4. This is the one lane that brews more than the distilled base. Keep it to these four.

### Lane A — Post-brew concentrate direction screen
From the distilled base batch, fill 200 mL cups; dose each TRUE concentrate at its **vendor-mid single dose**; read each **A/B against the distilled control** (paired-A/B primitive):

| Product | Vendor-mid post-brew dose (per 200 mL) |
|---|---|
| APAX TONIK | ~7 drops |
| APAX JAMM | ~7 drops |
| APAX LYLAC | ~7 drops |
| KONFLUX | ~7 drops |
| NÉMO | ~5 drops (heavy profile — start lower) |
| DAK Hydro Drops | ~2 drops Bottle A + 2 drops Bottle B |
| SBL Juicy & Sweet (stock) | start ~3 drops; adjust to ~brew-equiv |
| Sooper (stock) | start low (undisclosed) — find empirically |

Goal: rank the products + capture each one's **direction** + the **reveal-vs-inject flag** at the mid dose. Identify the 2–3 standouts to carry to Lane B.

### Lane B — Dose ladder on the standouts (the threshold hunt)
For the 2–3 Lane A standouts, run a **3 / 6 / 10-drop ladder** (scale per product) to find the **sweet-spot dose** and the **reveal→inject threshold** (HT2). Each ladder step read A/B against the distilled control.

### Sample size + palate fatigue (consumption-ceiling budgeting)
Taste discrimination degrades fast — far faster than flow measurement. **Cap each sitting at ~10–12 scored cups**, cleanse between cups (plain water + a neutral cracker), and take a real break between lanes. Recommended split: **Sitting 1 = Lane C (4) + Lane A (~8)** with a mid-break; **Sitting 2 (fresh palate) = Lane B (~6–9).** Do not push all three lanes into one fatigued sitting — a fatigued palate manufactures noise that reads as signal.

### Mid-run hypothesis budget (~2 exploratory cups, Lesson #16)
If a substantive theory emerges (e.g. "Tonik + Lylac blended reveals better than either alone," or "a 2x-over-threshold dose confirms the masking direction"), spend up to ~2 exploratory cups testing it in-session. Don't defer — operator + Assistant context is where this is cheapest.

---

## Recording Sheet

### Inventory + stock-prep confirmation (Step 0.1 / 0.2)
| Product | Form | Owned? (photo-confirmed) | Stock state | Stock ppm-est | EC60 reading | Date mixed |
|---|---|---|---|---|---|---|
| TWW Classic Light | dry stick | | finished-water (Lane C) | ~150 (1/3 = ~50) | | |
| DAK Hydro Drops A+B | liquid 2-part | | ready | ~10 ppm/drop/L | | n/a |
| APAX TONIK | liquid | | ready (30k) | 30,000 | | n/a |
| APAX JAMM | liquid | | ready (30k) | 30,000 | | n/a |
| APAX LYLAC | liquid | | ready (30k) | 30,000 | | n/a |
| KONFLUX | liquid | | ready (30k) | 30,000 | | n/a |
| NÉMO | liquid | | ready (30k) | 30,000 | | n/a |
| SBL Juicy & Sweet | dry packet | | _(mixed? )_ | ~48,800 | | |
| Sooper | dry packet | | _(mixed? — pending at intake)_ | ~25,000 | | |

### Base + recipe (Step 0.3)
- Distilled EC60: _____ µS/cm · EC60 calibrated against 84 µS/cm: _____
- Baseline `/brew` recipe (operator-supplied): dose ___ g · ratio ___ · temp ___ · pours ___ · total time ___
- Calibration-shot distilled brew tasted OK? _____

### Predictions (pre-state, HT1–HT4 + per-product)
| Cup / product | Predicted direction | Predicted reveal/inject @ dose |
|---|---|---|
| | | |

### Per-cup scoring (1–5 each axis; one row per cup; tool-call-per-cup)
| Code | Product | Lane | Dose | Acidity | Sweetness | Body | Clarity | Finish | Bitterness | Astringency | Flavor specificity | Overall | Reveal / Inject | Notes (free-text prose — the payload) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | | | | |

### Per-product summary (fill after scoring)
| Product | Confirmed direction | Sweet-spot dose | Reveal→inject threshold | Beats distilled control? | Standout? |
|---|---|---|---|---|---|

---

## Notes / friction (capture inline — the doc IS the archive)

_(Assistant: log friction, surprises, ergonomic issues here as they happen.)_

## New lessons (candidate primitives — for the Coordinator's retro)

_(Assistant: log candidate lessons. Do NOT promote them to cluster docs — that's the retro's job.)_

## Audit items queued

_(Assistant: log anything that needs a follow-up track, a substrate edit, or a Coordinator decision.)_

---

## HANDOFF BRIEF FOR COMPILE / COORDINATOR (fill at session end)

_(Assistant: produce this per [`handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md): TL;DR · execution summary · equipment/conditions · per-cup raw data · analysis · final output (per-product direction + dose map) · key findings · substrate-edit specifications (if any) · new lessons · audit items · open data items · recap map · `Archive location:` branch + SHA · termination declaration.)_

### Execution Session Termination (template — fill + keep)

```
Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive
- ✅ Archive doc committed + pushed to branch <branch> @ <SHA>
- ✅ Handoff brief produced above; branch + SHA in its Archive location: header
- 🛑 Session terminating after this brief. The Coordinator decides Track 2 / substrate-fold.

End of Water Concentrate Post-Brew Screen close-out.
```
