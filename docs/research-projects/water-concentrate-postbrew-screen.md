# Water Concentrate Post-Brew Screen — Owned-Concentrate Cohort (Research Project #6, Track 1)

*Coffee Research · Latent · Research Project*

**Version:** 0.2 (Sitting 1 executed - Lane C + Lane A complete; Lane B pending)
**Date drafted:** 2026-06-20
**Date executed:** 2026-06-21 (Sitting 1: Step 0 + Lane C + Lane A, 12 scored cups)
**Status:** 🟢 **Sitting 1 of 2 COMPLETE** - Lane C + Lane A scored + archived. 🟡 **Lane B (dose-ladder threshold hunt, HT2) PENDING** - operator's separate Sitting-2 day. See § Handoff Brief.
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

### Inventory + stock-prep confirmation (Step 0.1 / 0.2) — ✅ COMPLETE (2026-06-21)
**0.1 photo cross-check:** satisfied 2026-06-20 — operator physically handled + photographed every product to build the concentrate TSV (the per-product TSV is the artifact; stronger than a confirm-photo). No re-photo needed. All stocks new/fresh; TWW is the one in-use product (operator's daily water). Stocks confirmed clear + Ca-bearing stored separate from sulfate/bicarb.

| Product | Form | Owned (photo 2026-06-20) | Stock state | Strength | EC60 reading | Date mixed |
|---|---|---|---|---|---|---|
| TWW Classic Light | dry stick → premix | ✅ | premix = 1 packet / 0.8 gal (daily water, Lane C); brewed at 1/3 = 2/3 distilled + 1/3 premix | ~187 ppm premix → ~80 ppm brew water | **490 µS/cm (premix)** → ~163 µS brew water | 2026-06-20 |
| DAK Hydro Drops A+B | liquid 2-part | ✅ | ready | ~10 ppm/drop/L | above EC60 range (n/a) | n/a |
| APAX TONIK | liquid | ✅ | ready | 30,000 ppm | above EC60 range (n/a) | n/a |
| APAX JAMM | liquid | ✅ | ready | 30,000 ppm | above EC60 range (n/a) | n/a |
| APAX LYLAC | liquid | ✅ | ready | 30,000 ppm | above EC60 range (n/a) | n/a |
| KONFLUX | liquid | ✅ | ready | 30,000 ppm | above EC60 range (n/a) | n/a |
| NÉMO | liquid | ✅ | ready | 30,000 ppm | above EC60 range (n/a) | n/a |
| SBL Juicy & Sweet | dry packet → stock | ✅ | mixed + clear | ~48,800 ppm | above EC60 range; fingerprint deferred | 2026-06-20 |
| Sooper | dry packet → stock | ✅ | mixed, cleared overnight | ~25,000 ppm | above EC60 range; fingerprint deferred | 2026-06-20 |

### Base + recipe (Step 0.3) — ✅ COMPLETE (2026-06-21)
- **Distilled EC60: 18.3 µS/cm** · EC60 calibrated against **1413 µS/cm + 12.88 mS/cm only** (84 µS/cm low-range standard not yet arrived → low-end accuracy soft; 18.3 likely inflated by high-range-only cal + atmospheric CO₂ uptake on banked distilled). ~10 ppm TDS — a small fraction of any mineralized water; valid low-and-consistent blank canvas. **Not gating** (every post-brew cup pours from this same pool → the base subtracts out in the A/B-vs-control read). Re-confirm when the 84 µS standard arrives (see Audit items / P6T1-AI-1).
- **Filter LOCKED: Sibarist Cone B3 for ALL cups, no paper variation** (the locked-baseline control paper + the RP5 filter-arc calibration standard). Filter held constant; **water is the sole variable.** Operator-confirmed.
- **Baseline recipe (operator-supplied; distilled-swapped for this experiment):** Hydrangea Pink Bourbon Washed (Finca Inmaculada, Holguin Family, Valle del Cauca, Colombia) · Clarity-First, no modifiers · xBloom (V60 chamber, "Other"/freesolo, grinder OFF / external EG-1) · Sibarist B3 · dose **15 g** · ratio **1:16.5 (247 g)** · grind **EG-1 6.4** · temp **94 / 94 / 93 °C** · Bloom 45 g spiral, 45 s → Pour 2 @ ~0:58 to 150 g @ 94 °C spiral, 30 s pause → Pour 3 @ ~1:58 to 247 g @ 93 °C spiral, 0 pause · flow 3.5 ml/s · target ~3:00–3:15. **Water = plain distilled for the base + control** (the locked baseline normally runs the operator's home-remineralized standard = 2/3 distilled + 1/3 TWW; that standard IS the Lane C TWW entry).
- **Calibration shot:** brew time **3:17** (on target, no drift) · **output 216.7 g (≈ 217 mL) per shot** · tasted OK ✅. Read — aroma: lime / nutty / tomatoey (tomato slightly muted vs the TWW version); palate: lime-lemon front, brown-tea back, slightly flat, a touch more front acidity + a distinct lime note on the phase-3 finish vs the TWW-water cups. Clean Pink Bourbon, lighter-bodied + more acid-forward than the remineralized cup — the expected distilled direction (no bicarbonate buffering acid, no Mg/Ca for body). **Recipe NOT adjusted** (control integrity held); everything calibrated to THIS cup. Caveat: beans rested 1–2 d longer than the RP5 filter session, so the tomato-damping can't be cleanly attributed to water vs rest — **does not threaten validity** (all post-brew cups share this exact base).
- **Cup volume + flight structure LOCKED (off the 216.7 mL output): 200 mL cups, ~1 shot per cup.** Flights of 3 = **1 distilled control + 2 dosed products**, pooled-then-split so the 3 cups in a flight are an identical base, each flight self-anchored to its own fresh control. Lane A's 8 products = **4 flights**. 200 mL chosen over 100 mL so vendor per-200 mL doses land exactly (load-bearing for the low-dose products — DAK 2+2, NÉMO ~5 — where halving to 100 mL makes a single-drop error a large % of the dose) + enough volume to re-sip. Brewing more shots doesn't fatigue the palate (only scored cups do), so 200 mL costs brew time, not discrimination.

### Vendor design-intent (Step 0.4) — ✅ pre-filled from operator TSV (substrate context, NOT prediction; validate post-test)
| Product | Vendor-stated direction | Published per-cup dose | Mineral system (black-box context — NOT a scoring attribution) |
|---|---|---|---|
| TWW Classic Light | SCA-spec light-roast benchmark; "optimize water for light roast" | finished water (1 stick/gal); daily = 1/3 dilution | MgSO₄ + Ca citrate + NaCl (citrate buffers) — sulfate-bearing |
| DAK Hydro Drops | balanced two-part brewing water; equal-dose A+B | 10–12 drops/L pre-brew (post-brew screen: 2+2 / 200 mL) | A = CaCl₂; B = KHCO₃ + MgSO₄ + MgCl₂ |
| APAX TONIK | "vibrant, bright, juicy" — acidity / intensity / crispness / liveliness; **explicitly pairs with washed + high-clarity + Pink Bourbon** | 5–10 drops / 200 mL | MgCl₂ + CaCl₂ + NaCl + NaHCO₃ + KHCO₃ — **chloride-forward** |
| APAX JAMM | "rich, sweet, creamy" — body / sweetness / depth / roundness / lingering sweetness; for thin / sharp / under-sweet | 5–10 drops / 200 mL | MgCl₂ + CaCl₂ + KCl + KHCO₃ + NaHCO₃ — **chloride-forward** |
| APAX LYLAC | "elegant, floral, silky" — floral lift / silky finish / refined softness; **explicitly pairs with Pink Bourbon** | 5–10 drops / 200 mL | MgSO₄ + MgCl₂ + KCl + KHCO₃ + NaHCO₃ + NaCl — **the one sulfate-bearing APAX** |
| KONFLUX | "luscious, harmonious, unctuous" — round / smooth / coating texture, depth without masking | 5–10 drops / 200 mL | CaCl₂ + KCl + NaCl + silica + KHCO₃ + NaHCO₃ — chloride-forward + silica |
| NÉMO | "Heavy & Sweet" — 2025 World AeroPress champ profile; heavy mouthfeel / sweetness / roundness / controlled acidity | 1–10 drops / 200 mL (heavy → start low, ~5) | MgCl₂ + CaCl₂ + KCl + silica + NaCl + KHCO₃ + NaHCO₃ — chloride-forward + silica |
| SBL Juicy & Sweet | "clarity, sweetness, acidity" — soft light-roast pour-over, fruit room to resolve; GH 44 / KH 20 (Soft) | 10 drops / 170 mL (brew-water target) | Epsom MgSO₄ + CaCl₂ + MgCl₂ + NaHCO₃ + KHCO₃ — disclosed, sulfate-bearing (Phase 2 bridge target) |
| Sooper | undisclosed proprietary "house pourover" (Lazy Schnauzer) | 12–12.5 g/L pre-brew (post-brew: empirical-low) | not disclosed — treat fully black-box |

*HT1 convergence-risk grouping (product-level, from the systems above): chloride-forward cluster = TONIK / JAMM / KONFLUX / NÉMO / DAK-A; sulfate-bearing / distinct = LYLAC / SBL / TWW. Discipline reminder: scoring records the **product's** direction, never "this is the magnesium."*

### Predictions (pre-state, HT1–HT4 + per-product) — ✅ LOCKED before scoring (2026-06-21; operator-approved as-stated)

**HT calls:**
- **HT1 (distinct vs converge):** partially distinct — single-character APAX (TONIK-bright / JAMM-body / LYLAC-floral) separate; convergence risk *within* the heavy/round cluster (JAMM / KONFLUX / NÉMO / DAK). Enough distinction for per-product cells; expect 2–3 round ones to blur.
- **HT2 (threshold):** NÉMO injects earliest (heaviest), KONFLUX next (coating masks clarity); sulfate/soft ones (LYLAC, SBL) + TONIK reveal longest. Thresholds expected inside the 3–10 drop ladder.
- **HT3 (built vs natural):** best built (likely JAMM / LYLAC / SBL) beats filtered tap clearly + edges the spring on tuned-to-this-coffee; spring competitive on natural integration. Lean: built wins, not overwhelmingly.
- **HT4 (TWW vs distilled):** TWW (daily 1/3, ~163 µS) clearly beats distilled — restores body, buffers the sharp lime finish, recovers the tomato/savory note distilled dampened. TWW mid-pack vs tuned post-brew winners. TWW > distilled, TWW < best standout.

**Per-product (Lane A):**
| Product | Predicted direction | Predicted reveal→inject threshold |
|---|---|---|
| TONIK | brightens/juices the lime, slight body bump; base already acid-forward → risk of sharp/thin-sour | reveals ~5, tips sharp ~10 |
| JAMM | body + sweetness, rounds the sharp finish, fills distilled's thinness — strong reveal | reveals ~7–10, muddy/heavy past ~12 |
| LYLAC | floral lift + silky texture, softens finish, amplifies florality — strong reveal (vendor pairs it) | reveals ~8–10, too soft/muted past ~10 |
| KONFLUX | coating mouthfeel/weight, little flavor change; texture reveal, coating risks masking clarity | reveals ~5, coats-over-clarity ~8 |
| NÉMO | heavy body + sweetness — most likely to over-weight a clarity coffee → earliest inject | reveals ~3–5, injects/muffles ~7 |
| DAK (2+2) | balanced "complete water" — rounds + structures, no single strong push | broad/mild; injects high |
| SBL | clarity + sweetness + supported acidity; transparent, built for fruit-forward light roast — gentle reveal | reveals broad, hard to over-inject |
| Sooper | unknown (black-box) — likely balanced house sweetness/structure | empirical |

### Per-cup scoring (1–5 each axis; one row per cup; tool-call-per-cup)
| Code | Product | Lane | Dose | Acidity | Sweetness | Body | Clarity | Finish | Bitterness | Astringency | Flavor specificity | Overall | Reveal / Inject | Notes (free-text prose — the payload) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ctrl (known) | Distilled (control) | C | none | 4 | 2 | 3 | 4 | 3.5 | 1.5 | 1 | 3.5 | **3** | baseline/anchor | Aroma lime + vegetal + brown tea; sip lime acidity, brown tea, nutty, less tomato; round body, good clarity, clean finish. Matches the calibration cup (palate stable). **Ranked 1st of C1 (preferred).** Acidity especially nice — the clarity coffee shows best on the zero-mineral canvas. |
| A | TWW 1/3 daily mix (~163 µS) | C | pre-brew finished | 3 | 2.5 | 3 | 3.5 | 3.5 | 1.5 | 1 | 3 | **2.5–3** | **Inject-leaning (mild — mutes)** | More rounded / integrated / muted, less sharp, less acidity (slightly emphasizes sweetness). Mutes the lime clarity he values → suppression-mute, not foreign-flavor injection. Acidity re-emerges as it cools (temp-dependent). **Ranked 2nd.** |
| B | Mountain Valley spring | C | pre-brew finished | 2.5 | 2 | 3 | 3 | 2.5 | 1.5 | 2.5 | 2.5 | **2** | **Inject** | "Materially different." Herbal / green / vegetal forward, less acidity, **a foreign astringent "something else" not present in the others**, short finish, flattens on cooling. Worst of 3 in C1 — the natural water *injected* character rather than revealing the coffee. **Ranked 3rd.** |
| tap (known) | Los Altos Hills filtered tap | C | pre-brew finished | 2 | 2 | 3.5 | 2 | 2.5 | 3 | 2 | 2 | **1.5** | **Inject (strongest)** | "Very different." Acidity much less / *buried* (not in the attack, sits under the body); heavier body; **muddier, blurred clarity**; new bitter **"oversteeped-tea"** quality + a bitter-spice finish the control lacked; darker / richer / fuller, less bright. **Worst of Lane C — ranked last, behind the spring.** Caveat: hot-fresh tap compared vs a much-cooler control (temp mismatch likely inflates the body/acidity delta), but the qualitative inject (foreign bitter-tea + muddied clarity) stands. |
| ctrl-A1 (known) | Distilled (control) | A1 | none | 4 | 2 | 2 | 4 | 2.5 | 1 | 1 | 4 | 2.5 | baseline/anchor | Re-baseline for flight A1 — matches the established distilled control (acidity-forward, thin body, high clarity, crisp, short finish). Palate stable. Flight anchor; not counted in the 8 scored products. |
| A | **JAMM** | A1 | 7 drops | 2.5 | 3.5 | 3 | 3.5 | 2.5 | 1 | 1 | 2.5 | **3** | **Inject (likeable)** | "Very different — very soft, smoothed everything out." Mutes/blends the sharp acidity, **ADDS sweetness the coffee never had** (underlying, across all phases), creaminess, a distinct mouthwatering/salivation sensation; flavor specificity DROPS (rounded / blended / less sharp). **Prefers over control (3 vs 2.5).** Matches vendor "rich/sweet/creamy" (operator independently used those words). Thesis-critical: a *likeable inject* — a better cup via masking. |
| B | **TONIK** | A1 | 7 drops | 4 | 2.5 | 2.5 | 4 | 2.5 | 1 | 1 | 4 | **3** | **Reveal** | Enhances + *structures* the acidity ("sharper but rounder" — boosted, not spiky), keeps clarity + flavor specificity + structure, adds no foreign character. A clean reveal. **Prefers over control (3 vs 2.5).** Matches vendor "vibrant/bright/juicy." Opposite mechanism to JAMM — both beat control. |
| ctrl-A2 (known) | Distilled (control) | A2 | none | 4 | 2 | 2 | 4.5 | 2.5 | 1 | 1 | 4.5 | 2.5 | baseline/anchor | Quick-confirm — matches baseline (acidity-forward, thin, very high clarity + specificity, short clean finish). Palate stable. Flight anchor, not counted. |
| A | **KONFLUX** | A2 | 7 drops | 2 | 3 | 3.5 | 3.5 | 3 | 1 | 1 | 2.5 | **2** | **Inject (wrong-coffee)** | Flattened/muted the acidity, added sweetness, **scaffolded complexity + body + structure + an extended (less-crisp) finish onto a coffee that lacks complexity** — "bells & whistles that don't belong." Clarity held high (the masking came via added flavor + muted acidity, NOT the predicted clouding). **First product to score BELOW control (2 vs 2.5).** Operator: "right technique, WRONG coffee" — would suit a more complex cup. Matches KONFLUX "round/coating/unctuous/depth." |
| B | **LYLAC** | A2 | 7 drops | 4.5 | 3.5 | 3 | 4 | 2.5 | 1 | 1 | 4 | **3.5** | **Reveal (w/ reshaping)** | Accentuates + *elongates* the acidity across all 3 phases; tomato → herbal/floral; pushes a **sweet-tart "little lime"** character with REAL added sweetness; high clarity + specificity; **brown-tea note disappears → sweet-lime.** **Current favorite (3.5).** Reveal-leaning (amplifies the coffee's own lime/acidity axis + adds depth) though it reshapes the profile (loses brown tea). Matches LYLAC "elegant/floral/silky" + sulfate-brightening. |
| ctrl-A3 (known) | Distilled (control) | A3 | none | 4 | 2 | 2 | 4 | 2.5 | 1 | 1 | 4 | 2.5 | baseline/anchor | Quick-confirm — same crisp acid-forward profile but **reads "more bland" now** after 8 dosed cups (mild palate adaptation/fatigue). Flight anchor, not counted. |
| A | **NÉMO** | A3 | 5 drops | 1.5 | 4 | 3.5 | 3 | 3.5 | 1 | 1 | 3 | **3** | **Inject (likeable)** | "Very different." Mutes acidity to near-gone, **big sweetness**, thicker body w/ depth, longer **caramel-honey** finish; flavors readable but TRANSFORMED ("sweetened honey-caramel brown tea + a dash of lime," not the originals). Likeable inject — > control, < LYLAC. Matches "Heavy & Sweet" exactly. **HT2:** acidity already heavily muted at just 5 drops → low reveal→inject threshold (injects below 5). |
| B | **DAK** | A3 | 2+2 drops | 4 | 2.5 | 2 | 4.5 | 2.5 | 1 | 1 | 4 | **3.25** | **Reveal** | Brightens the lime/acidity, dampens the tomato/vegetative, light sweetness bump, keeps thin body + high clarity + specificity ("revealing what's there, not introducing new"). **New #2.** Contradicts the predicted "balanced/broad, no push" — at normal brew-water strength DAK *brightened/revealed*. |
| ctrl-A4 (known) | Distilled (control) | A4 | none | 4 | 2 | 2 | 4 | 2.5 | 1 | 1 | 4 | 2.5 | baseline/anchor | Quick-confirm — same profile, reads "more flat" vs the dosed cups (cumulative adaptation at 10+ cups). Flight anchor, not counted. |
| A | **Sooper** | A4 | 6 drops | 3.5 | 3 | 3 | 4 | 3 | 1 | 1 | 3.5 | **3.25** | **Reveal** | Juicy, rounder acidity, balanced (not artificial) sweetness, more body/bounce, longer lemon-lime finish, high clarity + specificity, + the tongue-watering sensation. "Like LYLAC but **less engineered**." Reveal — "no artificial additions." Ties DAK at #3. |
| B | **SBL Juicy & Sweet** | A4 | 4 drops | 4 | 3.5 | 2 | 4 | 2.5 | 1 | 1 | 4 | **3.5** | **Reveal (focused)** | Crisp/focused **sweet-juicy-lime**: emphasizes acidity + adds a sweet-fruit-lime layer; **suppresses the tomato/herbal/brown-tea** (focused reveal, not inject); thin body, high clarity + specificity. "Sharper, crisper, clearer definition of what it's aiming for." Slightly preferred over Sooper; **co-top with LYLAC (~3.5).** Hit its "Juicy & Sweet" billing exactly. |

### Per-product summary (Lane A complete; sweet-spot dose + threshold = Lane B / Sitting 2)
| Product | Confirmed direction (post-brew, this coffee) | Screening dose | Reveal / Inject | Beats control? | Standout? / Lane B |
|---|---|---|---|---|---|
| **LYLAC** | amplifies + elongates lime/acidity, adds sweet-tart-lime depth (reshapes — loses brown tea) | 7 drops | **Reveal** | ✅ 3.5 (co-#1) | ✅✅ → Lane B (ladder + LYLAC-vs-SBL head-to-head) |
| **SBL Juicy & Sweet** | crisp/focused sweet-juicy-lime; emphasizes acidity, suppresses tomato/herbal/brown-tea | 4 drops | **Reveal (focused)** | ✅ 3.5 (co-#1) | ✅✅ → Lane B (ladder + head-to-head) |
| **DAK Hydro Drops** | brightens lime/acidity, dampens tomato, keeps clarity + thin body | 2+2 drops | **Reveal** | ✅ 3.25 | ✅ Lane B candidate |
| **Sooper** | juicy/round, balanced sweetness, more body/bounce; "like LYLAC, less engineered" | 6 drops | **Reveal** | ✅ 3.25 | ✅ Lane B candidate |
| **TONIK** | structures + boosts acidity (sharper-but-rounder), keeps clarity + specificity | 7 drops | **Reveal** | ✅ 3 | ✅ → Lane B (distinct reveal mechanism) |
| **JAMM** | rounds + mutes acidity, adds foreign sweetness + creaminess + mouthwatering, ↓ specificity | 7 drops | **Inject (likeable)** | ✅ 3 | optional Lane B (likeable-inject threshold) |
| **NÉMO** | heavy; big sweetness, caramel-honey finish, mutes acidity, transforms profile | 5 drops | **Inject (likeable)** | ✅ 3 | screen-only; low threshold (injects <5) |
| **KONFLUX** | scaffolds complexity/body/structure a clarity coffee lacks; mutes acidity | 7 drops | **Inject (wrong-coffee)** | ❌ 2 (below control) | NOT a standout here; try lower dose / a more complex coffee |

---

## Notes / friction (capture inline — the doc IS the archive)

- **[Step 0.3] EC60 low-range cal gap.** Only the 1413 µS + 12.88 mS standards on hand; the 84 µS standard (the low-range anchor for near-zero distilled) hasn't arrived. Distilled read 18.3 µS/cm — treated as low-and-consistent, not gating. Friction: a **low-range (84 µS) standard belongs on the Step 0 equipment checklist** for any distilled-base track.
- **[Step 0.3] Bean-rest confound, acknowledged + bounded.** The distilled control reads slightly more lime-forward / less tomato-vegetative than the operator's memory of the RP5 TWW cup, but the beans rested 1–2 d longer since then, so water-vs-rest can't be separated from memory. Bounded: irrelevant to this track's validity — every post-brew cup shares the one distilled base brewed today.
- **[Step 0 operational] Filter held constant.** Unlike the RP5 filter arc (paper was the variable), this track fixes Sibarist B3 across all cups; water is the sole variable. **Fresh B3 per brew** (single-use), same model every cup.
- **[Step 0.5] Semi-blind scheme.** Operator-experienced (does this for pour-over cuppings). Per flight: **distilled control kept KNOWN as the anchor** (not coded — coding it would break the read-against-control, and "this is plain water" carries no product-expectation bias); the **dosed/test cups blind-coded with tape (A/B/C) + shuffled** so position ≠ identity; score by code against the known control; reveal the key after the flight's scoring completes.
- **[Step 0.6] Skipped primitives — confirmed N/A.** Brewer-capacity sanity (single fixed recipe, known xBloom volume — and the calibration shot measured 216.7 mL output), alias-map audit (no canonical-registry-anchored entries this track), bimodality/no-bed screen (dependent variable is taste, not flow/drawdown). All three explicitly skipped per protocol § 0.6.
- **[Lane C friction] Pre-brew water-switching is operationally intense.** Refilling the xBloom reservoir + re-prepping between each pre-brew Lane C cup is heavy, and the ~3 min/brew stagger it forces creates a temperature differential between cups. Operator confirms **drop-dosing (post-brew, Lane A) will be far easier** → validates the all-post-brew design choice for the concentrate lanes; pre-brew is reserved only for the finished-water arm where it's unavoidable.
- **[Lane C blinding caveat] Temperature-differential identity leak.** Because Lane C cups brew ~3 min apart (water-switch time), they sit at slightly different temps at tasting → operator could partly guess identity by heat signature. Low impact here (genuinely no priors; everything pinned off the known control). For any staggered-brew flight: equalize temp harder, or brew → hold → taste-all-at-once.
- **[Lane C result — C1: HT4 CONTRADICTED, HT3 partial] On the clarity-weighted Pink Bourbon, the DISTILLED control was PREFERRED over both the TWW daily mix and the Mountain Valley spring** (stack rank: **distilled > TWW > spring**). HT4 predicted TWW > distilled → contradicted: TWW rounds/integrates but *mutes the lime clarity* (mild inject), not an improvement on this coffee. HT3 (partial, tap pending): the natural spring performed *worst* — injected a foreign herbal/astringent note + flattened on cooling rather than revealing. Early thesis signal: on a clarity-first coffee, added minerals (even a balanced benchmark) lean toward muting/injecting over revealing — Dashwood-consistent. **NOTE: Lane C is pre-brew (minerals present during extraction), so this is an extraction-valid result, unlike the post-brew Lane A screen.** Result self-confirmed via the cool-down second pass (operator re-ranked, same order) — no separate auto-retest spent.
- **[Lane A — Flight A1: TONIK vs JAMM — thesis crystallized] At 7 drops on the distilled base, TONIK = clean REVEAL (enhances + structures acidity, keeps clarity + flavor specificity, no foreign character) and JAMM = likeable INJECT (mutes acidity, adds foreign sweetness + creaminess + a mouthwatering sensation, drops flavor specificity). BOTH beat the control (3 vs 2.5) via OPPOSITE mechanisms.** The reveal-not-inject thesis made concrete + tasteable in one flight. **HT1 (early):** the two single-character APAX read as clearly DISTINCT directions — no convergence (supports HT1's "distinct" arm). **Vendor intent validated:** both matched their label language (operator independently said "creamy/sweet" for JAMM, "bright/juicy" for TONIK). **Dose calibration:** 7 drops is a good screening dose — clear direction, cup intact (not slammed into mute-mush) → **KEEP 7 drops for flights A2–A4.** Prediction reconciliation: directions called right; reveal/inject calls off — JAMM injects (predicted reveal), TONIK revealed cleanly without the feared sharp/sour tip.
- **[Lane A — Flight A2: KONFLUX vs LYLAC]** At 7 drops: **KONFLUX = inject (wrong-coffee)** — muted acidity + added sweetness + scaffolded complexity/body/structure onto a clarity coffee that has none → "right technique, wrong coffee"; **first product to score BELOW control (2 vs 2.5)**. The masking came via flavor-addition + acidity-muting, NOT the predicted clarity-clouding (prediction nuance — clarity held high). **LYLAC = reveal-leaning, current standout (3.5, operator favorite)** — accentuates + elongates the coffee's own lime/acidity across all phases, adds a sweet-tart-lime sweetness, high specificity, but reshapes (brown-tea → sweet-lime). **HT1:** LYLAC vs KONFLUX clearly distinct — HT1 "distinct" support continues; the predicted JAMM/KONFLUX round cluster both lean round/inject but stay distinguishable (JAMM sweet-creamy-likeable; KONFLUX complex-structured-unwelcome). **Lane B standouts forming: LYLAC (3.5) > TONIK ≈ JAMM (3) > KONFLUX (2, below control).** KONFLUX's "wrong-coffee" read supports the project's per-coffee-water end-game (match water to coffee, not one universal best water). Operator re-endorsed the per-axis scorecard explicitly ("keep this going forward — leading questions help me talk about subjective reads without implanting the answer") → reinforces the graduation-eligible primitive.
- **[Lane A — Flight A3: NÉMO vs DAK]** **NÉMO (5 drops) = likeable inject** — mutes acidity near-gone, big sweetness, thicker body, long caramel-honey finish, flavors transformed (not the originals); overall 3. Matches "Heavy & Sweet"; HT2 — low reveal→inject threshold (injects below 5 drops). **DAK (2+2) = reveal** — brightens lime/acidity, dampens tomato, keeps thin body + high clarity + specificity; overall 3.25, **new #2.** Contradicts predicted "balanced/broad" — DAK *brightened* at normal strength. **HT1:** 6 products now all distinct; **DAK broke from the predicted heavy/round convergence cluster** (revealed, didn't round) → HT1 trending *more distinct, less convergent* than predicted. **Emerging thesis-relevant pattern — on this clarity coffee the REVEALS top the board: LYLAC 3.5 > DAK 3.25 > TONIK 3; likeable INJECTS cluster mid (JAMM 3, NÉMO 3); unwelcome inject KONFLUX 2 sits below control.** So for *this* coffee reveal and "best cup" mostly ALIGN (partial easing of the P6T1-AI-2 tension, this-coffee-specific) — though the injects stay drinkable. **Palate-fatigue note:** operator reports the control "reads more bland" at 8 cups in — mild adaptation, reads still functional; A4 is the last flight before the cap.
- **[Lane A — Flight A4: Sooper vs SBL — Lane A COMPLETE]** Both reveal-leaning. **Sooper (6 drops)** = juicy/rounder, balanced sweetness, more body/bounce, longer lemon-lime finish, tongue-watering; "like LYLAC but less engineered"; 3.25. **SBL (4 drops)** = crisp/focused sweet-juicy-lime, emphasizes acidity + sweet-fruit-lime layer, *suppresses* tomato/herbal/brown-tea (focused reveal, not inject); hit "Juicy & Sweet" exactly; 3.5, slightly > Sooper. **HT1 convergence finding (revises prediction):** the two SULFATE-bearing products (LYLAC + SBL) converge on the same top "sweet-juicy-lime reveal" — convergence on the **sulfate axis, NOT the predicted chloride/heavy axis.** LYLAC vs SBL head-to-head unresolved (both ~3.5) → Lane B. **FINAL Lane A standings (8 + control): LYLAC 3.5 ≈ SBL 3.5 > DAK 3.25 ≈ Sooper 3.25 > TONIK 3 ≈ JAMM 3 ≈ NÉMO 3 > control 2.5 > KONFLUX 2.** Top tier is ALL REVEALS; likeable injects (JAMM, NÉMO) cap at 3; the unwelcome inject (KONFLUX) sits below control. **Board-level thesis result: on this clarity coffee, REVEAL > INJECT.**
- **[Lane C COMPLETE — HT3 RESOLVED] Final Lane C stack rank: distilled > TWW (built) > Mountain Valley spring (natural) > Los Altos Hills tap (natural/treated).** The built water (TWW) beat *both* naturals, so "built > natural" holds — BUT the larger finding is that **nothing beat the zero-mineral distilled control** on this clarity-first coffee, and **both natural waters injected** (spring → herbal/astringent foreign note; tap → bitter oversteeped-tea + muddied clarity + buried acidity, the strongest inject of the lane). So the "natural holds its own" arm of HT3 is contradicted here: the naturals did *not* hold their own; they masked. Coherent thesis read — on this coffee, cleaner water = more clarity; mineral/ion load (built or natural) trends toward mute/inject. **Bounded claim:** one clarity-weighted coffee, pre-brew; says nothing about a thin/hollow coffee that might *need* body. Lane A tests whether any *specific* concentrate direction can reveal rather than mute, and at what dose.

## New lessons (candidate primitives — for the Coordinator's retro)

- **[candidate] Measure exact brewer output on the calibration shot before locking cup volume / flight size.** The xBloom yielded 216.7 mL per 247 g brew; the operator proposed measuring it on the calibration shot before committing to 200 vs 100 mL cups. That single measurement cleanly resolved the cup-volume / flight-size / brew-load tradeoff (1 shot ≈ 1 × 200 mL cup → flights of 3 = 1 control + 2 products). Candidate Step 0 primitive for any post-brew / split-base track: **the calibration shot doubles as the volume-budget measurement.** (Watch for 2nd fire before the Coordinator graduates it.)
- **[candidate — RP5 primitive, 2nd fire] Per-axis tasting-prompt card.** Operator explicitly *requested* a per-cup quick-glance tasting guide (the 9 axes phrased as questions + example descriptors) for the Lane A scoring — the RP5 "per-axis tasting prompts" candidate firing a 2nd time, **operator-pull this time** (not Assistant-push). Provided for Lane A. Flag for the Coordinator retro: this candidate has now fired across RP5 + RP6 → **graduation-eligible** per the cross-project ratification gate.

## Audit items queued

- **P6T1-AI-1** — Re-confirm the distilled base EC on the EC60 once the **84 µS/cm low-range standard** arrives (current 18.3 µS/cm read on high-range-only cal). Non-blocking for this track; matters only for future low-ppm absolute-accuracy work. Phase 2's GH/KH targets run off the LaMotte + API GH/KH, not the EC60, so this does not gate Phase 2.
- **P6T1-AI-2 — Reveal/inject vs "best cup" — operator-stance tension (Coordinator call).** On JAMM (a likeable inject), the operator flagged he is "not religious about revealing vs injecting — I'm going for the optimized, best cup." This is precisely the tension the project's reveal-not-inject thesis ([CONTEXT-taste.md]) is designed to surface, now concrete: an *injected* cup the operator *prefers* over the control. NOT for the Assistant to resolve — flag for the Coordinator retro: how does the reveal-not-inject apex reconcile with the operator's best-cup pragmatism (apex as long-game WBC-mastery value endorsed in principle but traded per-cup, vs apex overriding)? Substrate-relevant — touches the taste apex.

---

## HANDOFF BRIEF FOR COMPILE SESSION (Water Concentrate Post-Brew Screen - Sitting 1 Close-Out)

**Date:** 2026-06-21
**Session role:** execution + handoff brief production (no substrate edits)
**Archive location:** branch `claude/mystifying-tharp-c1b9ec` @ HEAD (latest pushed commit; exact SHA in the session close-out report). The compile session fetches/branches from here - the archive doc is committed; substrate is NOT; not merged to main. See [`role-discipline.md` § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md).
**Track status:** **Sitting 1 of 2 COMPLETE** (Lane C + Lane A, 12 scored cups). **Lane B (the dose-ladder reveal-inject threshold hunt, HT2) is PENDING - the operator's separate Sitting-2 day** (fatigue cap, planned split). This is an interim brief: the per-product dose/threshold deliverable is not complete until Lane B runs.
**Methodology verdict:** ✅ VALIDATES. The post-brew screen cleanly separated reveal vs inject directions and ranked all 8 products. HT3 + HT4 RESOLVED (both AGAINST prediction). HT1 mostly distinct, with one sulfate-axis convergence. HT2 partially addressed (single-dose reveal/inject flags captured; thresholds need Lane B).

This brief closes Sitting 1 only. Consume it to (a) understand the Lane C + Lane A results, (b) spawn the Lane B Sitting-2 session with the carry list below, and (c) hold substrate folding until Lane B + ideally a 2nd coffee (the candidate vocabulary is forming but one coffee is too thin to codify).

### TL;DR
- Sitting 1 (Lane C finished-water flight + Lane A 8-product post-brew screen) complete: 12 scored cups, fatigue cap respected, methodology held.
- **HT4 CONTRADICTED:** on the clarity-weighted Pink Bourbon, plain distilled BEAT the TWW daily mix - TWW rounds but mutes the lime clarity.
- **HT3 RESOLVED, against prediction:** distilled > TWW (built) > Mountain Valley spring > Los Altos Hills tap. Both naturals INJECTED; nothing beat the zero-mineral control. (Lane C is pre-brew, so this is extraction-valid.)
- **Lane A board: reveals top, injects mid, one inject below control.** LYLAC 3.5 ≈ SBL 3.5 > DAK 3.25 ≈ Sooper 3.25 > TONIK 3 ≈ JAMM 3 ≈ NÉMO 3 > control 2.5 > KONFLUX 2.
- **Thesis crystallized + tasteable:** TONIK / DAK / LYLAC / SBL / Sooper REVEAL (amplify the coffee's own lime-acidity, keep clarity); JAMM / NÉMO likeable-INJECT (add sweetness/body, mute acidity); KONFLUX unwelcome-inject ("right technique, wrong coffee").
- **HT1:** mostly DISTINCT (8 distinguishable directions), but the two SULFATE-bearing products (LYLAC, SBL) converge on the top sweet-juicy-lime reveal - convergence on the sulfate axis, NOT the predicted chloride axis.
- **Operator tension (P6T1-AI-2):** operator prioritizes "best cup" over reveal-purity. On this coffee reveal and best-cup mostly align, but the injects stayed drinkable - the thesis vs pragmatism reconciliation is a Coordinator call.
- **Lane B carry list:** LYLAC + SBL (co-leaders - ladder both + the head-to-head this flight left unresolved), TONIK (distinct reveal mechanism); optional JAMM (likeable-inject threshold). KONFLUX drops.

### Execution summary
12 scored cups in one sitting (Lane C = 4: distilled / TWW / spring / tap; Lane A = 8 concentrates), plus the Step-0 calibration shot and 4 per-flight control re-pours (anchors, not counted). Methodology held throughout: tool-call-per-cup pacing, paired-A/B-vs-known-control reading, semi-blind (dosed cups taped + shuffled, control kept known), the per-axis scorecard. Lane A ran at the vendor-mid screening dose (7 drops APAX/KONFLUX, 5 NÉMO, 2+2 DAK, 4 SBL, 6 Sooper); flight A1 confirmed 7 drops as a good screening dose (clear direction, cup intact), so it held for A2-A4. Divergences from protocol: (a) 0.1 photo satisfied via the prior TSV-build session, not a re-shoot; (b) EC60 high-range-cal-only (84 µS standard absent), distilled read 18.3 µS, non-gating; (c) cup volume locked at 200 mL off the measured 216.7 mL/shot. Lane B deferred to Sitting 2 (operator fatigue cap, explicitly planned).

### Equipment / conditions
| Item | Value |
|---|---|
| Coffee | Hydrangea Pink Bourbon Washed (Finca Inmaculada, Holguin Family, Valle del Cauca, Colombia) |
| Brewer / grinder / filter | xBloom (V60 chamber, "Other"/freesolo, grinder off) · external EG-1 @ 6.4 · fresh Sibarist B3 per brew (held constant) |
| Recipe | 15 g · 247 g (1:16.5) · 94/94/93 °C · Bloom 45 g/45 s → P2→150 g/30 s pause → P3→247 g/0 · 3.5 ml/s · ~3:00-3:15 |
| Base water | distilled (Mini Classic), EC60 18.3 µS/cm (high-range-cal-only); output 216.7 mL/shot |
| Tasting temp | ~52-55 °C, equalized per flight |
| Instruments | Apera EC60 (84 µS standard pending); A&D EJ-123 balance; APAX dropper bottles + micropipettes |

### Per-cup raw data
Complete in § Per-cup scoring above - 12 scored cups + 4 flight-anchor control re-pours, with reveal/inject flag + prose per cup. Lane C cups read against the known distilled control; Lane A flights = 1 known control + 2 blind-coded dosed cups (revealed post-scoring). No auto-retest fired (reads decisive); Lane C self-confirmed via the cool-down second pass.

### Analysis
- **Lane C (pre-brew, extraction-valid):** cleaner water = more clarity on this coffee. Mineral load (built OR natural) trended toward mute/inject. Rank distilled > TWW > spring > tap.
- **Lane A (post-brew, perception screen):** the reveal-family (5 products) tops the inject-family (3). **Difference-vocabulary started** - REVEAL = "amplify/structure the coffee's own acidity-lime, keep clarity + specificity, add no foreign character." INJECT = "add sweetness/body/character, mute acidity, drop specificity" (likeable when the addition flatters, unwelcome when it scaffolds onto absent complexity).
- **Sulfate convergence:** LYLAC + SBL (both MgSO₄-bearing) landed on the same sweet-juicy-lime reveal and tied at the top.
- **Caveat (load-bearing):** post-brew shows PERCEPTION direction, not extraction effect. Lane A winners are candidates for a future pre-brew confirmation track, not settled answers.

### Final output (deliverable - PARTIAL; sweet-spot dose + threshold pending Lane B)
The per-product direction + reveal/inject map is in § Per-product summary above. The sweet-spot DOSE and reveal→inject THRESHOLD per product are Lane B's job (HT2).

### Key findings
1. On a distilled-base clarity coffee, REVEAL > INJECT at the board level (data: Lane A standings). Substrate: the reveal-not-inject thesis is operationally tasteable + measurable; difference-vocabulary started.
2. HT4 contradiction: the TWW daily mix mutes vs distilled on this clarity coffee. Substrate: a benchmark water is not universally better; water is per-coffee.
3. HT3: built (TWW) beat both naturals, but distilled beat all; both naturals injected. Substrate: supports the per-coffee-water-recipe end-game.
4. Sulfate-axis convergence (LYLAC, SBL). Substrate: HT1 nuance - convergence is real but on the sulfate axis, not the predicted chloride axis.
5. KONFLUX "right technique, wrong coffee" - first sub-control product. Substrate: water-coffee matching; a coating/complexity profile mismatches a clarity coffee.
6. NÉMO has a low reveal→inject threshold (acidity already muted at 5 drops) - flags it for a lower starting dose in any future ladder.

### Substrate edit specifications for compile session
DO NOT execute in this session. **And these are CANDIDATES to evaluate AFTER Lane B - the track is mid-flight; do not fold yet.**
- **Registry edits:** NONE this track (no canonical-registry-anchored entries - per § 0.6 alias-map skip).
- **Cluster-doc / CONTEXT-taste candidate (DEFER):** the reveal-vs-inject difference-vocabulary is forming and worth eventual codification (likely [CONTEXT-taste.md](CONTEXT-taste.md) + a water sub-skill seed), but one coffee is too thin - hold until Lane B + ideally a 2nd coffee.
- **Per-coffee-water-recipe note (DEFER):** "clarity-first coffees prefer minimal / sulfate-side reveals; coating/heavy chloride profiles mismatch" - candidate, defer pending more coffees.
- **Audit items to carry:** P6T1-AI-1 (84 µS EC standard re-confirm) + P6T1-AI-2 (reveal-vs-best-cup thesis tension - escalate to operator at retro).

### New lessons captured
See § New lessons. Two candidates, both flagged for the cross-project ratification gate:
- Measure exact brewer output on the calibration shot before locking cup volume / flight size (RP6 1st fire).
- Per-axis tasting-prompt card - the RP5 candidate fired a 2nd time AND was explicitly operator-requested + endorsed → **graduation-eligible.**

### Audit items queued
P6T1-AI-1 (EC low-range standard) and P6T1-AI-2 (reveal-vs-best-cup operator-stance tension) - see § Audit items.

### Open data items
- **Lane B - the entire dose-ladder threshold hunt (HT2).** Carry: LYLAC, SBL, TONIK (+ optional JAMM). 3/6/10-drop ladders; the LYLAC-vs-SBL head-to-head (both ~3.5, both sulfate sweet-juicy-lime) is unresolved and should be settled. ~6-9 cups, fresh palate, separate day.
- HT2 only partially addressed: single-dose reveal/inject flags captured; thresholds TBD (NÉMO noted low-threshold; KONFLUX unwelcome at 7 but its lower-dose reveal window untested).
- Pre-brew confirmation of the Lane A post-brew winners (future track) - post-brew shows perception, not extraction.

### Recap map for compile session
**Integrate nothing to substrate yet - the track is mid-flight (Lane B pending).** Coordinator next steps: (1) spawn a Lane B Assistant session (recommended - completes HT2 + the dose/threshold deliverable) before any substrate fold; (2) hold the candidate vocabulary + per-coffee-water specs until Lane B and ideally a 2nd coffee; (3) carry the 2 graduation-eligible primitives to the cross-project ratification gate. Escalate to the operator: the P6T1-AI-2 reveal-vs-best-cup thesis question.

### Protocol-execution friction captured
See § Notes/friction: pre-brew water-switching is operationally intense (validates the all-post-brew design for the concentrate lanes); temperature-differential blinding leak in staggered-brew flights; EC60 low-range cal gap; bean-rest confound (bounded); palate-fatigue at the 12-cup cap.

### Execution Session Termination

```
Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (Lane C + Lane A complete; Sitting 1 of 2)
- ✅ Archive doc committed + pushed to branch claude/mystifying-tharp-c1b9ec (final SHA in the session close-out)
- ✅ Handoff brief produced above; branch in its Archive location: header
- 🛑 Session terminating after this brief. Lane B (Sitting 2) is a fresh Assistant session another day; the Coordinator decides substrate-fold timing.

End of Water Concentrate Post-Brew Screen - Sitting 1 close-out.
```
