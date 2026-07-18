# 2nd-Coffee Verification — Gesha Natural (Research Project #6, Phase 2b)

*Coffee Research · Latent · Research Project*

**Version:** 1.0 (EXECUTED — Assistant-archived)
**Date drafted:** 2026-07-05
**Date executed:** 2026-07-10 (sitting 1, day 12 rest: Step 0 + flights 1-3, 10 brews) + 2026-07-17 (sitting 2, day 19 rest: flights 4-6, 9 brews + 2 exploratory mixes)
**Status:** ✅ **EXECUTED — scoring complete, handoff brief below. Substrate fold DEFERRED to Coordinator/execution session.**
**Platform:** xBloom (controlled-pour) driving a Hario V60, fixed no-modulation recipe
**Coffee:** Hydrangea Gesha Natural DRD, El Burro Lot 15 (rested) — the body-forward, floral CONTRAST to Track 1/2's clarity-weighted Pink Bourbon
**Materials:** the six single-mineral liquid stocks + gear already owned — see [water-inventory.md](docs/skills/brewing-equipment-expert/cluster/water-inventory.md) (dose from the § 3 stocks)

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE (Lesson #40)

**You are the Research Assistant for this track. Your job is execution + handoff brief production. NOT substrate integration.**

**DO NOT:** edit `lib/*-registry.ts` · edit `docs/skills/*/cluster/*.md` (incl. `water.md` / `water-inventory.md`) · edit ADR files · `git commit`/`push` SUBSTRATE edits, merge to main, or `gh pr create` — **EXCEPT** the one authorized archive-persist commit of THIS protocol doc · run `npx tsc --noEmit` against substrate · continue past the handoff brief.

**DO:** read this doc in full BEFORE Step 0 · walk Chris through Step 0 · run cups one-at-a-time (tool-call-per-cup) · capture friction + lessons + audit items inline (the doc IS the archive) · produce a handoff brief per [`handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md) · commit + push the archive doc to your session branch (record branch + SHA in the brief) · TERMINATE after the brief.

Full primitive: [`role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md).

---

## Project context — what this track is FOR

RP6's water knowledge is codified and shipped ([water.md](docs/skills/brewing-equipment-expert/cluster/water.md) + `/brew` wiring). Its **framework is validated**; its **specific values are single-coffee-provisional** (Pink Bourbon only). **This track is the values verification** — the one thing that de-provisionalizes `water.md § 6`.

**What Track 2 resolved (on the Pink Bourbon, pre-brew):**
- **The anion sets a phase, the cation gates it.** SULFATE → body/sweetness (cation-agnostic); CHLORIDE → attack/acidity/florality, cation-GATED (MgCl₂ bright peak; CaCl₂ lactic/oily).
- **Peak cup = straight MgCl₂ @ GH 44**; nothing beat it. Recipe seed: MgCl₂-forward, minimal sulfate, avoid Ca, minimal KH.
- **The desired phase is coffee-dependent** — a clarity coffee wanted the chloride attack; a body-wanting coffee *may flip toward sulfate*. That prediction is what this track tests.

**Why the Gesha Natural is the right 2nd coffee:** it's the body-forward, floral contrast to the clarity Pink Bourbon. It probes two open questions at once — the **phase-flip** (does a body coffee prefer sulfate?) and the **WBC florality label** (does sulfate→florality show up on a floral coffee, the label Pink Bourbon under-expressed?).

**Deliberately single-variable / verification-scoped:** re-run Track 2's *core* pre-brew anion→phase comparisons on the new coffee. Do NOT re-run the full Phase-1 concentrate screen. Same platform, same GH-44 targets, same six liquid stocks, same per-axis discipline.

---

## Verification hypotheses (pre-state before scoring, per Lesson #16)

- **HV1 — Does the anion→phase map hold?** On the Gesha, does sulfate still read body/sweetness and chloride still read attack/acidity/florality? Does the cation-gating hold (MgCl₂ bright; CaCl₂ lactic)?
- **HV2 — The phase-flip (the headline prediction).** Does the preferred cup flip toward **sulfate** on this body-forward coffee (vs the Pink Bourbon's chloride/MgCl₂ peak)? Or does MgCl₂ still win?
- **HV3 — WBC florality label.** Does **MgSO₄ → florality** appear on this floral Gesha (the 2026 WBC role-label our non-floral Pink Bourbon didn't reproduce)?
- **HV4 — Is "CaCl₂ goes lactic" general or Pink-Bourbon-specific?** Re-test whether Ca+chloride reads lactic/oily here.

**Fold consequence:** if the map holds + the phase-flip confirms → the structure generalizes; de-provisionalize `water.md § 6` and add a Gesha recipe-library row (a Coordinator/execution-session job, NOT this session). If it diverges → the map is more coffee-specific than hoped; log exactly how.

---

## Step 0 — calibration (run to completion BEFORE scoring)

1. **Dial-in the Gesha** to a baseline `/brew` recipe on the xBloom V60 (dose/ratio/temp/pours/time) — capture it here; it's the fixed recipe every cup inherits. (If already dialed, record it + run one confirming brew.)
2. **Stocks check:** confirm the six § 3 liquid stocks are still clear/good (no precipitation); re-fingerprint on the EC60 if in doubt. Gypsum stock — shake (settles invisibly).
3. **Rig check:** EC60 cal vs the 84 µS standard; build one GH-44 test water and verify on the LaMotte before scoring (measure, don't guess; GH drop-count is cation-specific — match within a pair).
4. **Coffee budget:** ~15-20 brews / ~300 g planned (dial-in + the core comparisons + retests). Confirm enough Gesha; trim from the bottom of the comparison list if short.
5. **Semi-blind:** code + shuffle cups.
6. Skip (be explicit): capacity / alias-map / bimodality — N/A.

---

## Experiment design — pre-brew core replication (dose from the § 3 liquid stocks; build to GH 44; A/B vs distilled control)

Priority order (trim from the bottom if coffee/palate is short):
1. **MgCl₂ vs MgSO₄ @ GH 44** — the anion test on Mg + the HV2 phase-flip pivot.
2. **CaCl₂ vs CaSO₄ @ GH 44** — anion on Ca + HV4 (does CaCl₂ go lactic here?).
3. **MgCl₂ vs CaCl₂ @ GH 44** — cation on chloride.
4. **The Pink-Bourbon peak head-to-head:** straight MgCl₂ @ GH 44 vs the best sulfate/body option from #1-2 — does the peak flip? (HV2.)
5. **Minimal-KH check** (operator's less-is-more lean): zero KH vs low ~10-15 KH on the best base.
6. *(if coffee allows)* complete the 2×2: MgSO₄ vs CaSO₄.

**Scoring — PER-AXIS directional reads** (floral/aromatics · acidity · sweetness · body · texture, each scored separately; + a reveal/inject flag), never a single overall verdict. Florality is load-bearing here (HV3) — score it explicitly on every cup. Each water read A/B against the distilled control. Tool-call-per-cup; auto-retest ambiguous reads; ~2 exploratory cups for mid-run theory. Cap ~10-12 scored cups/sitting; split across sittings with a palate reset.

**Dosing reminder:** to hit GH 44 from a stock, use its per-1 g-in-1 L key (water-inventory § 3) — e.g. MgCl₂ stock ≈ 9 g (~9 mL)/L; MgSO₄ stock ≈ 11/L; CaCl₂ stock ≈ 6.5/L; gypsum stock is dilute (large volume or dose dry-adjacent). Verify every built water on the LaMotte.

---

## Recording Sheet

### Step 0
- **Coffee identity confirmed (2026-07-10):** Hydrangea Coffee Roasters — Gesha Natural DRD, El Burro Lot 15 (Lamastus Family Estates, Potrerillos/Dolega, Chiriquí, Panama, 1550-1800 m). Notes: mango, violet, strawberries; DRD = darkroom-dried ~30 days ("riper fruit sweetness, deeper aromatics, tea-like structure"). NOT the Helm El Burro Lot 16 in freezer-stock — different roaster + lot + process; bag just arrived, never entered freezer-stock. Same estate as Helm Lot 16, so the archive prior (very-light El Burro under-extracts on a clarity default → lean extraction-forward) transfers as a dial-in prior only.
- **Gesha baseline recipe (LOCKED 2026-07-10, dialed in one cup on distilled):** xBloom V60 · 15 g dose / 248 ml (1:16.5) · EG-1 grind 6.2 · BP (~95°C) consistent across all pours, no degrade · flow 3 ml/s (lowest) throughout · bloom 45 ml SPIRAL + 30 s pause · pour 1: 68 ml SPIRAL + 30 s pause · pour 2: 68 ml SPIRAL + 30 s pause · pour 3: 66 ml CENTER, no pause · total time 3:36. Rationale: extraction-forward per the same-estate archive prior (Helm Lot 16 under-extracted on a clarity default); consistent-BP not declining (declining temp = clarity move, wrong direction here).
- **Dial-in / distilled-control read (2026-07-10, NOT blind — this is the reference character for every A/B):** aroma very sweet, strawberry. Hot: very sweet, pungent, body slightly darker than preferred but in-bounds. Warm: strawberry + violet florals on the attack; slight creaminess; "idea of mango" but wouldn't call it mango; some flatness (attributed to distilled); body tamped down. Cool: strawberry, floral, smoothed, lots of body sweetness; darker-brown-tea body; flat at the end + flat finish; volume turned down as it cooled. Verdict: complete cup, right zone, good control.
- **Rest caveat (logged):** roasted 6/28 → 12 days at session start. A/B-vs-distilled same-sitting reads stay valid (shared bean state), but if florality reads muted across ALL cups, HV3 nulls are ambiguous (closed bean vs no effect) — push MgSO₄-bearing retests to sitting 2 (~day 16-18). Note: violet already showing on the dial-in cup, so the bean is not fully closed.
- **Brewer note:** Chris asked for the Kalita metal brewer; declined — platform-locked to xBloom V60 for cross-track comparability (Track 2 values were read through the V60). Kalita-vs-V60 on this coffee logged as a future-track candidate.
- Stocks OK? **YES (visual, Chris 2026-07-10; all six made Jun 28-Jul 3, inventory verified Jul 8)** · EC60 cal (84 µS): **FAILED first check — read 53.4 (-36%); recalibrated on the 84 µS standard** (post-cal read: **85.8** on fresh standard; distilled sanity read **3.3 µS** — PASS) · GH-44 built-water verification (comparison-1 pair, fresh 500 ml builds from stock — 4.5 g MgCl₂ stock / 5.5 g MgSO₄ stock per 500 g distilled): **MgCl₂ water: hardness endpoint almost-blue @ 5 drops, clean blue @ 6 · EC 146.4 µS. MgSO₄ water: same endpoint (almost 5 / clean 6) · EC 154.3 µS. Matched within pair — PASS** (kit: LaMotte hardness titration) · coffee on hand **456 g (~30 cups @ 15 g — full comparison list incl. #6 fits)**
- **Step 0 catch (friction log):** the EC60 was reading -36% low at session start. The cal-check step caught it before any build verification ran; an uncaught bias this size would have silently corrupted every EC QC read in the track. Reinforces "measure, don't guess" + cal-before-every-session as a candidate lesson.
- **Reagent-grade MgCl₂ stock decision (Chris, 2026-07-10):** run this track on the existing reagent-grade-derived MgCl₂ stock; the food-grade replacement (ordered Jul 8) is in transit. Accepted-risk call, logged per the R5 safety flag. On arrival: fresh stock + EC fingerprint per water-inventory § 2.

### Predictions (pre-state HV1-HV4 — recorded 2026-07-10 BEFORE any scored cup)
| Comparison | Predicted direction | Predicted vs Pink Bourbon |
|---|---|---|
| 1. MgCl₂ vs MgSO₄ @ GH 44 | Anion map holds (HV1): MgCl₂ → bright attack/acidity, MgSO₄ → body/sweetness. **Preference flips to MgSO₄** on this body-forward coffee (HV2) | REVERSAL predicted — PB preferred MgCl₂ |
| 2. CaCl₂ vs CaSO₄ @ GH 44 | CaCl₂ reads lactic/oily again (HV4 = general); CaSO₄ clean body/sweetness → CaSO₄ preferred | Same direction as PB |
| 3. MgCl₂ vs CaCl₂ @ GH 44 | Cation gate holds (HV1): MgCl₂ bright, CaCl₂ lactic | Same as PB |
| 4. Peak head-to-head (MgCl₂ vs best sulfate) | **Sulfate option wins** (HV2 headline) | REVERSAL — PB peak was straight MgCl₂ |
| 5. Zero KH vs ~10-15 KH | Zero-KH preferred or tie (operator less-is-more lean); low KH rounds acidity slightly, may dull florals | Same as PB lean |
| 6. MgSO₄ vs CaSO₄ @ GH 44 | Sulfate phase cation-agnostic on body/sweetness (HV1); **MgSO₄ adds a florality lift CaSO₄ lacks** (HV3, WBC label — moderate confidence, the genuinely open one) | PB read cation-agnostic, no floral signal |

HV-level pre-statements: **HV1** holds (map + gating reproduce). **HV2** flips to sulfate (the headline bet). **HV3** appears — violet is present in this bean (confirmed on the dial-in cup), so if sulfate→florality is real it has something to reveal here. **HV4** general — CaCl₂ goes lactic again.

### Per-cup scoring (per-axis; one row per cup)
| Code | Water/ion | GH/KH | Floral | Acidity | Sweetness | Body | Texture | Reveal/Inject | Overall | Notes (prose) |
|---|---|---|---|---|---|---|---|---|---|---|
| A (flight 1, 2026-07-10) | distilled control | 0/0 | baseline (violet present) | baseline (some brightness) | very high, fruity | higher end, oversteep darker-brown, flat | thick/creamy, sticky-adjacent | — | ranked 3rd of 3 | Fruity, sweet, "idea of mango"; Chris correctly guessed control. NOTE: control read CREAMIER/heavier than both mineral cups — inversion vs expectations. ~55°C reads. |
| B (flight 1) | MgSO₄ | 44/0 | **aroma slightly MORE violet than A** (weak HV3 positive) | UP vs A (sharper) | sharper/more defined (initially read "little less," head-to-head read "more") | less oversteep, less harsh than A | LOST A's creaminess (thinner) | Reveal (explicitly not injecting) | ranked 2nd, close to C | "Sharper both on acidity and sweetness; body doesn't feel as harsh." |
| C (flight 1) | MgCl₂ | 44/0 | aroma LESS/flatter than A and B | UP vs A (brighter) | slightly up vs A; slightly less than B | less dark-tea than A | LOST A's creaminess | Reveal | **ranked 1st, narrowly over B** | "Brighter, doesn't feel as flat." B-vs-C contrast SUBTLE — "much sharper contrast on the other coffee [Pink Bourbon]; this is a lot of subtlety." |

**Flight 1 head-to-heads (Chris, direct):** A-vs-C: C brighter/more acid/slightly sweeter, A creamier but flat. A-vs-B: B sharper on acidity AND sweetness, body less harsh. B-vs-C: hard to separate; B a touch sweeter, C a touch more acid; both preferred over A; C slightly preferred over B. Comparison-1 verdict is therefore AMBIGUOUS on the HV2 pivot (retest folds into comparison #4, which repeats B-vs-C as the head-to-head anyway).
| A (flight 2, 2026-07-10) | distilled control | 0/0 | violet present | baseline | fruity-sweet | flatter side, body-centric | heavier | — | ranked 2nd of 3 | Chris again identified the control correctly. |
| B (flight 2) | CaSO₄ (gypsum) | 44/0 | a little MORE floral | tad more | **LOT more — juicy, mouthwatering** | juicy sweetness, not flat/monotone | held its own, more blended/integrated, a bit heavier | Reveal (explicit) | **ranked 1st "by a long shot"; possibly best cup of the session incl. flight 1** | "Way more fruity, juicy. Sweeter, nicer, rounder, juicier, preserved the texture." Upper-warm read. |
| C (flight 2) | CaCl₂ | 44/0 | hard to read under the chalk | attacks more but STOPS SHORT; turns slightly sour | trying to form, stops short | weird jumbled blend | **CHALKY, alkaline-tasting** (no KH in this water — noted) | **INJECT, "too much"** | ranked 3rd, BELOW control | Improves slightly as it cools but stays "not quite right." NOT the Pink Bourbon lactic/oily read — a different failure mode. |

**Flight 2 head-to-heads:** A-vs-B: B juicier/fruitier/mouthwatering, more acidity, lot more sweetness, more integrated, more weight — B decisively. A-vs-C: C "trying to boost acidity but turns sour," not fully formed. B-vs-C: B "really wonderful"; C never catches up. Re-run A-vs-B: "B wins by a long shot," texture preserved. Chris: "I didn't like gypsum on the other coffee but on this one it works."
**Flight-2 structural observations:** (1) **HV2 phase-flip signal is LIVE:** the best cup of the session is a SULFATE water on the body-forward coffee — the exact reversal predicted, and gypsum specifically was a nothing-water on the Pink Bourbon. (2) **HV4 result is divergence, not confirmation:** CaCl₂ is bad here too, but the failure mode CHANGED — PB read lactic/oily; the Gesha reads chalky/sour/stops-short/injecting. Ca+chloride = reject on both coffees, for different reasons. (3) Tentative cross-flight read (needs same-flight confirmation in #6): sulfate may NOT be cation-agnostic on this coffee — CaSO₄ ("long shot" over control) ≫ MgSO₄ (subtle edge over control), whereas PB read sulfate cation-agnostic. (4) The chalky/alkaline note on a ZERO-KH CaCl₂ water is unexplained — logged.
| Ctrl (flight 3, 2026-07-10) | distilled control | 0/0 | violet present | baseline | fruity-sweet, mango idea | flat-ish, body-centric, tapers at end | — | — | 3rd of 3 | Chris now "dialed in" on the control's character. |
| A (flight 3) | CaSO₄ (same bottle as flight 2's winner) | 44/0 | similar | tad more than control | a little more | a little better, less flat | similar to control | Reveal | 2nd | "Everything improved a little... lifting all the good things about the control." **The flight-2 'long shot' magnitude did NOT reproduce** — this read is a modest lift. |
| B (flight 3) | MgCl₂ | 44/0 | similar profile | — | tad more than A | kept up nicely, rounder/softer edges | **mouthwatering JUICINESS — the texture element A lacks; kept textural quality** | Reveal ("feels like part of it, just emphasized") | **1st** | "Softer, sweeter, rounded-out edge, juicier." Gaps SMALL — "much closer in nature than the other coffee, less one-is-miles-ahead." |

**Flight 3 (comparison #4, the head-to-head) verdict:** MgCl₂ > CaSO₄ > control, all gaps narrow. The Pink Bourbon peak (straight MgCl₂ @ GH 44) SURVIVES on the body-forward coffee — HV2's predicted phase-flip did NOT occur at the peak-preference level. Sulfate is competitive (clear lift over control both flights) but does not take the crown.
**Flight-3 structural observations:** (1) The auto-retest rule earned its keep: flight 2's "wins by a long shot" gypsum read shrank to "modest lift" on same-bottle reproduction, and the signature juiciness descriptor MIGRATED to the MgCl₂ cup. Pre-brew single-water comparisons carry real brew-to-brew + read-to-read variance; magnitude claims need 2+ reproductions before they're data. (2) Consistent across all 3 flights: EVERY GH-44 water improves on distilled, differences between waters are second-order on this coffee ("less one-is-miles-ahead" — verbatim contrast vs the Pink Bourbon). (3) Chris identified the control blind in all 3 flights — the distilled character (flat, body-centric, tapering) is a reliable anchor.
| Ctrl (flight 4, 2026-07-17, day 19) | distilled control | 0/0 | violet + strawberry up front — MORE open than sitting 1 | bright start | sweeter/rounder than sitting-1 control; mango idea stronger | less generic-brown-tea; back-half + finish still FLAT (the coffee's weak spot) | — | — | 3rd of 3 | "Quite a pleasant cup even on pure distilled" — rest opened the bean; the day-19 wait validated. |
| A (flight 4) | MgCl₂ | 44/0 | about the same as control | about the same | MORE — via EXTENDING the first phase ("elongates the attack") | almost compressed; does nothing to the back half | about the same | **Reveal** (explicit) | **1st** | "Amplifying the control... punchier, sweeter. Accentuating what's there." |
| B (flight 4) | CaSO₄ | 44/0 | not noted (body-forward aroma) | — | not much added — "more structural than sweet" | **scaffolds the BODY/back-half** — props up exactly the control's weak spot | — | **leaning INJECT — "a little overdone... could use less of whatever's going on"** | 2nd | "Doing a very different thing than A." Chris: "A plus maybe a half or quarter of B would be a really interesting cup." |
| A+B mix (flight 4, exploratory) | MgCl₂ + splash CaSO₄ (~uncontrolled ratio) | ~44/0 | — | — | sweeter than A alone | holds up more of the cup's construction | — | — | promising | Chris's spontaneous blend. His read: proportion of B too high even at "a few splashes" — wants **4:1 or 5:1 MgCl₂:CaSO₄**. |

**Flight 4 (the #4 REMATCH) verdict:** MgCl₂ > CaSO₄ > control, REPRODUCED — the crown question is closed. **HV2: the phase-flip did NOT happen**; the Pink Bourbon peak (straight MgCl₂ @ GH 44) survives on the body-forward coffee.
**Flight-4 structural observations — the variance explained:** (1) The flight-2/flight-3 disagreement resolves: **the two anions work DIFFERENT PHASES OF THE CUP** — chloride extends/amplifies the front (attack/sweetness), sulfate scaffolds the back (body/structure). They're complements, not competitors; single-preference reads wobbled because attention shifted between phases. This is the anion→phase map's cleanest formulation yet — phase-of-cup, not flavor-axis. (2) At GH 44 FULL-STRENGTH, sulfate tips into inject on this coffee ("could use less") — dose-dependence of the reveal/inject boundary, new to the map. (3) Chris spontaneously prototyped a **4:1-5:1 MgCl₂:CaSO₄ blend** — candidate recipe-library row. (4) Day-19 control is markedly better than day-12 control — rest-state caveat on sitting-1 absolute reads confirmed real. (5) HV3 watch: at day 19 with violet fully open, CaSO₄ did NOT read floral — the WBC sulfate→florality label still unreproduced; #6 (MgSO₄) is its last chance this track.
| Ctrl (flight 5, 2026-07-17) | distilled control | 0/0 | consistent | good attack | fruity-sweet | back-half flat (stable weakness) | — | — | baseline | "Tastes like all the controls before — good baseline." MgSO₄ build EC verified 151.4 ✓ (band 147-162). |
| A (flight 5) | MgSO₄ | 44/0 | **about the SAME — no floral lift at day 19 with violet fully open** | about the same (not an acidic coffee) | **adds an underlying sweet note INSIDE the body — placed exactly where the control flattens; accentuates mango** | late body still flat-ish but sweetened | about the same | slight inject, "not morally opposed" | liked | "Not like [flight 4's MgCl₂] extending the front — this ADDS sweetness in the body itself." |
| B (flight 5) | CaSO₄ | 44/0 | a little less | neutral; on re-taste a subtle underlying acidity tinge | slightly less sweet | **much more structure — held up in the second phase, doesn't drop/flatten** | more elegant | some inject | liked-as-component | Chris blind-recognized it as flight-4's B. "Something that needs to be added to something else, not something in and of itself." |
| A+B mix (flight 5, exploratory #2) | MgSO₄ + splash CaSO₄ | ~44/0 | — | — | sweet | structurally held up | — | — | **"really interesting cup"** | Splash-sized B dose much better than flight-4's over-pour — dose-response on the sulfate confirmed from both directions. |

**Flight 5 (#6) verdicts:** (1) **HV3 IS DEAD ON THIS TRACK** — MgSO₄ produced zero florality lift on a floral Gesha at day-19 rest with violet fully open in the control. The 2026 WBC sulfate→florality role-label has now failed to reproduce on BOTH coffees (non-floral PB, floral Gesha). (2) **Sulfate is NOT cation-agnostic on this coffee** (it was on PB): the anion targets the body/back-half on both salts, but the CATION picks the payload — **MgSO₄ deposits SWEETNESS into the body; CaSO₄ builds STRUCTURE under it.** Same phase, different material. (3) CaSO₄'s "component, not a cup" character reproduced 3× (flights 2 magnitude aside, 4, 5).
| A (flight 6, 2026-07-17) | MgCl₂ + KHCO₃ | 44/~12 | aroma slightly fruitier | bright start | nice bright sweetness up front | **sacrifices the richer body/fuller fruit — "has the front part, not the back part"; flattens further as it cools** | — | — | 3rd of 3 | "One-dimensional... shortens everything else." KH verdict: compression. |
| B (flight 6) | straight MgCl₂ (anchor) | 44/0 | — | a little more than A | more, esp. cooling ("really taste the sweet note") | fuller/rounder than A; back-half dull like control | cleaner, crisper | Reveal | **1st (post-reveal lean, "3.5")** | "Amplified control, sweeter. Cleaner, more straightforward, trying to induce less." |
| C (flight 6) | 4:1 MgCl₂:CaSO₄ blend | 44/0 | similar to B | — | sweeter | **holds up the back half; more structure** | **SILKIER — "a silkiness I haven't experienced in anything else"**; more complex | mild | **2nd, near-tie ("3.6 vs 3.5" pre-reveal, B preferred post-reveal cooling)** | Chris blind-guessed the gypsum correctly. "Doing very different things; very close in preference." |

**Flight 6 (#5 KH + blend) verdicts:** (1) **KH 12 REJECTED — prediction confirmed:** the bicarbonate bought nothing and cost the back half ("front part, not the back part"); zero-KH stands. (2) **The 4:1 blend and straight MgCl₂ are a preference TIE with different characters** — blend adds silkiness + back-half structure + complexity; straight MgCl₂ is cleaner/crisper/sweeter cooling. Chris's pre-reveal number: 3.6 vs 3.5 blend; post-reveal cooling lean: straight MgCl₂ (self-flagged as possibly reveal-biased). Both go to the recipe row: straight MgCl₂ primary, 4:1 blend as the documented structured/silky variant.
**Flight-1 structural observations:** (1) The anion CONTRAST that was sharp on the Pink Bourbon is much smaller on this coffee — direction weakly holds (sulfate→sweeter, chloride→brighter) but magnitude is way down. (2) Inversion: distilled carried the most body/creaminess; BOTH GH-44 Mg waters traded texture for brightness on this body-forward coffee. Not predicted anywhere in the Track 2 map. (3) Weak HV3 positive: MgSO₄ nudged violet on the nose.

### Sitting 1 close (2026-07-10, 10 cups: 1 dial-in + 3 flights of 3) — interim HV state
- **HV1 (anion→phase map):** axes survive DIRECTIONALLY (sulfate→sweet/juicy, chloride→bright) but the amplitude collapsed — the sharp PB phase divide reads as subtlety here. Cation-gating on chloride: holds (MgCl₂ good, CaCl₂ reject).
- **HV2 (phase-flip):** NOT confirmed at peak level — MgCl₂ narrowly retains the crown in the direct head-to-head. Sulfate is more competitive than on PB (gypsum went from nothing-water to clear-#2), so a WEAK partial flip in sulfate's direction, but no crown change.
- **HV3 (sulfate→florality):** two weak positives (MgSO₄ violet nudge flight 1; CaSO₄ "little more floral" flight 2). Not conclusive; rest caveat still applies — recheck in sitting 2.
- **HV4 (CaCl₂ lactic?):** DIVERGED — Ca+chloride rejects on both coffees but the failure mode changed (PB lactic/oily → Gesha chalky/sour/stops-short/inject). "Avoid CaCl₂" generalizes; "goes lactic" does not.
- **Sitting 2 queue (few days out, ~day 15-16 rest — also serves the HV3 rest caveat):** (a) **#4 REMATCH** MgCl₂ vs CaSO₄ (two flights disagree on gypsum's magnitude; the crown needs a reproduced margin), (b) **#6** MgSO₄ vs CaSO₄ same-flight (promoted to must-run: sulfate cation-agnosticism is in question here, unlike PB), (c) **#5** KH check (zero vs ~10-15 KH) on the winner. **#3 (MgCl₂ vs CaCl₂) TRIMMED** — CaCl₂ decisively rejected twice-over; the cup buys no information. **Before sitting 2: rebuild the gypsum stock from § 2 dry** (current stock near-exhausted): 0.75 g dry CaSO₄·2H₂O into 500 g distilled, magnetic stir 15-20+ min, EC-fingerprint new stock vs the old bottle's remainder (match within a few %), label CONCENTRATE, retire old bottle. Budget: ~150 g used, ~300 g remains (~20 cups) — ample.
- **Sitting 2 scheduled: Fri/Sat 2026-07-17/18** (day 19-20 rest). Chris offered Sunday 7/12 (day 13); Assistant recommended waiting — day-13 rest would inherit the same HV3 closed-bean caveat as sitting 1, day 19-20 puts the Gesha properly in its window and doubles as a read on whether sitting-1 florality was rest-suppressed.

### Sitting 2 (2026-07-17, day 19 rest) — Step 0-lite
- EC60 cal (84 µS standard): **85.2 — PASS** (no drift this time) · distilled sanity: **4.3 µS** ✓
- Gypsum stock rebuilt during the week (0.75 g dry CaSO₄·2H₂O / 500 g distilled): old-stock remainder EC **1401 µS** vs new stock **1375 µS** — within ~2%, identity confirmed; old bottle retired.
- Flight-4 builds at 600 ml (×1.2 scale: 5.4 g MgCl₂ stock / 30 g fresh gypsum stock per 600 g distilled); EC-only verification vs fingerprints 146.4 / 155.3 per the sitting-1 refinement.
- **Verification catch #3 (sitting 2):** first builds read 175.1 (MgCl₂, +20%) and 130.8 (CaSO₄, -16%) — EC arithmetic diagnosed a CROSSED recipe scale (new 5.4 g dose into old 500 g water; old 25 g dose into new 600 g water); Chris confirmed. Fixed by +100 g distilled / +5 g stock. Post-fix: **MgCl₂ 148.6 ✓ · CaSO₄ 148.2 ✓** (both in ±5% band; gypsum characteristically reads a few % low — ion pairing). Third build error in three build sessions caught by instrument verification; zero reached a brewed cup. EC-fingerprint-vs-known-recipe now diagnoses not just THAT a build is off but WHICH mistake was made.

- **Flight-6 prep:** leftover flight-4 MgCl₂ water (~400 g) pooled with a fresh 400 g batch (3.6 g stock) — pooled EC **150.3 ✓**. Fresh 150 g CaSO₄ water minibatch (7.5 g fresh stock) for the blend's 50 g. KH cup: 300 g MgCl₂ water + 0.72 g KHCO₃ stock → GH 44 / KH ~12; LaMotte ALKALINITY titration endpoint: almost at drop 1, clean at drop 2 — consistent with ~12 ppm target, recorded as the KH-12 fingerprint. Three cups: straight MgCl₂ anchor · MgCl₂+KH12 · 4:1 MgCl₂:CaSO₄ blend (198 g + 50 g finished waters). No distilled control this flight — straight MgCl₂ is the anchor since both test cups are variations on it.

### Verification summary (final, 2026-07-17)
| HV | Verdict on the Gesha | Holds vs Pink Bourbon? |
|---|---|---|
| HV1 anion→phase + cation-gating | **PARTIAL, and REFORMULATED.** Anion→phase holds directionally but is cleanest as phase-of-CUP: chloride works the FRONT (extends attack/sweetness), sulfate works the BACK (body/structure). Amplitude collapsed vs PB ("less one-is-miles-ahead"). Chloride cation-gate holds (MgCl₂ good / CaCl₂ reject). Sulfate is NOT cation-agnostic here: MgSO₄ deposits sweetness-in-body, CaSO₄ builds structure-under-body. | Structure yes; amplitude and sulfate-cation behavior are coffee-dependent |
| HV2 phase-flip (sulfate on body coffee?) | **NO FLIP.** Straight MgCl₂ @ GH 44 retained the crown in the direct head-to-head, reproduced (flights 3+4+6). Sulfate upgraded from PB's nothing-water to a genuine complement (4:1 blend ties the peak) but never took the crown. | The PEAK generalizes — stronger than predicted |
| HV3 sulfate→florality | **DEAD.** Zero floral lift from MgSO₄ at day-19 rest with violet fully open in the control. | Label now failed on BOTH coffees (0/2) — WBC role-label unsupported on this platform |
| HV4 CaCl₂ lactic? | **DIVERGED.** CaCl₂ rejected here too, but chalky/sour/stops-short/inject — NOT the PB lactic/oily read. | "Avoid Ca+chloride" generalizes; the lactic mechanism label does not |
| #5 KH (bonus) | **Zero-KH confirmed** — KH 12 kept the front, killed the back ("shortens everything"), one-dimensional. | Same as PB less-is-more lean |

---

## Notes / friction · New lessons · Audit items

_(Assistant: capture inline. Candidate primitives stay logged for the PROJECT retro — do NOT promote mid-session.)_

- **Process deviation (flight 1, logged as lesson candidate, NOT promoted):** Chris brewed the comparison as a 3-cup FLIGHT (control + both waters, tasted round-robin with direct head-to-heads) rather than the protocol's tool-call-per-cup pacing. It worked well — same-flight temperature parity + direct A/B/C triangulation produced cleaner relative reads than remembered-control comparison would have. Candidate refinement for the protocol template: "flight-of-3 with a fresh in-flight control" as the sanctioned unit for pre-brew water comparisons.
- **Verification catch (comparison 2, 2026-07-10):** first CaSO₄ build came in ~17% under target (EC 140.9 vs CaCl₂'s 169.6; expected parity-or-above per the Mg-pair pattern where sulfate > chloride). Classic settled-gypsum under-delivery, from a LOW stock bottle no less. The LaMotte titration only hinted (3-4 drops vs a clean 4); the EC convicted. Fixed by shake + ~5 g stock top-up + re-verify.
- **Protocol refinement (granted in-session, lesson candidate):** EC60-first verification. First build of any recipe = LaMotte + EC (LaMotte proves GH; EC becomes the recipe's recorded fingerprint). Rebuilds of a known recipe = EC-only vs fingerprint (±5%). LaMotte stays mandatory for multi-salt builds + any KH-bearing water. Session fingerprints @ GH 44: MgCl₂ 146.4 · MgSO₄ 154.3 · CaCl₂ 169.6 · CaSO₄ **155.3** post top-up (clean 4-drop LaMotte match with CaCl₂; reads ~8% below CaCl₂ at equal GH — attributed to CaSO₄⁰ ion pairing, so 155.3 IS the fingerprint, don't chase EC parity with the chloride).
- **Inventory flag (comparison 2, 2026-07-10):** gypsum (CaSO₄) stock running LOW — the dilute 1,500 ppm stock burns ~25 g per 500 ml GH-44 build. Refill from § 2 dry gypsum needed before comparison #6 / sitting 2. Audit item for water-inventory.md: dilute-stock consumption rate makes the 1,500 ppm gypsum bottle the first stock to exhaust; consider a standing "rebuild when below N g" line.
- **Friction (Step 0, 2026-07-10):** the protocol header's coffee ("Hydrangea ... El Burro Lot 15") was un-verifiable against inventory — the bag had just arrived and was never entered in freezer-stock, while a *different* El Burro (Helm Lot 16) WAS in freezer-stock. The Assistant initially flagged the header as a possible drafting error. **Audit item:** just-arrived / not-yet-frozen bags have no inventory surface, so a protocol doc naming one can't be verified; consider a "landed, not frozen" holding convention in freezer-stock.md (or an explicit "not in inventory yet" line in protocol docs).

## HANDOFF BRIEF FOR COMPILE SESSION (2nd-Coffee Verification — Gesha Natural Close-Out)

**Date:** 2026-07-17
**Session role:** execution + handoff brief production (no substrate edits)
**Archive location:** branch `claude/2nd-coffee-gesha-natural-d432ac` @ `<FINAL-SHA — see final commit, recorded in session close message>`, pushed to origin (sitting-1 interim commit `83dec5d`; the compile session fetches/branches from the branch tip — archive doc committed, substrate NOT, not merged to main)
**Methodology verdict:** **MIXED — the MAP's STRUCTURE VALIDATES, its headline flip prediction FAILS, and two Track-2 labels (sulfate→florality, CaCl₂-lactic) are dead or demoted. Net: water.md § 6 CAN de-provisionalize, with re-scoped language.**

This brief is self-contained. Consume top-down: TL;DR → Key findings → Substrate edit specifications. Raw per-cup data + full prose reads live in the Recording Sheet above in this same doc; the raw-data table below is the condensed canonical index into it.

### TL;DR

- **The peak generalizes: straight MgCl₂ @ GH 44 / KH 0 won on BOTH coffees** — the clarity Pink Bourbon AND the body-forward Gesha Natural. The predicted phase-flip toward sulfate (HV2) did not happen; reproduced across 3 head-to-head flights.
- **The anion→phase map survives but reformulates: it's phase-of-CUP, not flavor-axis.** Chloride extends/amplifies the FRONT (attack, sweetness); sulfate scaffolds the BACK (body, structure). They're complements, not competitors.
- **Effect amplitude is coffee-dependent:** the sharp PB phase divide read as subtlety on the Gesha ("less one-is-miles-ahead" — operator verbatim).
- **Sulfate is NOT universally cation-agnostic:** on the Gesha, MgSO₄ deposits sweetness INTO the body while CaSO₄ builds structure UNDER it (PB read them equivalent).
- **The 2026 WBC sulfate→florality label is 0/2 and should be marked unsupported** — no floral lift from MgSO₄ even on a floral Gesha at day-19 rest.
- **CaCl₂ is a reject on both coffees but by different failure modes** (PB lactic/oily vs Gesha chalky/sour/stops-short) — keep "avoid," drop "lactic" as the general mechanism.
- **New recipe candidate: 4:1 MgCl₂:CaSO₄ @ GH 44 tied the straight-MgCl₂ peak** with a distinct silky/structured character (operator: "a silkiness I haven't experienced in anything else").

### Execution summary

19 brews + 2 exploratory in-cup mixes across two sittings (2026-07-10, day-12 rest, 10 brews: dial-in + flights 1-3; 2026-07-17, day-19 rest, 9 brews: flights 4-6), ~285 g of the 456 g budget. Methodology held: semi-blind coding on every scored flight (operator correctly blind-identified the distilled control in all flights and blind-recognized gypsum twice), per-axis scoring throughout, all built waters instrument-verified before brewing. Two protocol deviations, both logged and both improvements: (1) flights-of-3 with an in-flight control replaced tool-call-per-cup pacing; (2) EC-first verification replaced LaMotte-every-build after the fingerprint set was established. The comparison list ran 1, 2, 4, 4-rematch, 6, 5; **#3 (MgCl₂ vs CaCl₂) was deliberately trimmed** after CaCl₂'s decisive two-flight rejection. Three water-build errors occurred across the two sittings; instrument verification caught all three before any reached a brewed cup.

### Equipment / conditions

| Item | Value |
|---|---|
| Coffee | Hydrangea Coffee Roasters — Gesha Natural DRD, El Burro Lot 15 (Lamastus, Chiriquí, Panama, 1550-1800 m; mango/violet/strawberries; darkroom-dried ~30 d). Roasted 2026-06-28. NOT in freezer-stock (never frozen). |
| Fixed brew recipe (locked at dial-in, all 19 brews) | xBloom driving Hario V60 · 15 g / 248 ml (1:16.5) · EG-1 grind 6.2 · BP (~95°C) all pours, no decline · 3 ml/s flow · bloom 45 ml spiral + 30 s · 68 ml spiral + 30 s · 68 ml spiral + 30 s · 66 ml center · ~3:36 |
| Water platform | Six single-mineral liquid stocks (water-inventory § 3), dosed into distilled; GH-44 targets; gypsum stock REBUILT 2026-07-17 (0.75 g dry/500 g; old 1401 µS vs new 1375 µS, identity ✓) |
| Verification instruments | Apera EC60 (calibrated vs 84 µS standard each sitting — sitting 1 caught -36% drift, post-cal 85.8; sitting 2 clean at 85.2) · LaMotte BrewLab (hardness titration on first builds; alkalinity titration on the KH water) |
| Built-water EC fingerprints @ GH 44 | MgCl₂ 146.4-150.3 · MgSO₄ 154.3/151.4 · CaCl₂ 169.6 · CaSO₄ 155.3/148.2 (gypsum characteristically reads a few % low — ion pairing) |
| MgCl₂ stock caveat | Reagent-grade-derived (food-grade replacement was in transit); operator accepted risk 2026-07-10, logged per the R5 safety flag |

### Per-cup raw data (condensed index — full per-axis prose in the Recording Sheet above)

| # | Flight | Water | Outcome |
|---|---|---|---|
| 1 | dial-in (S1) | distilled | Baseline locked; complete cup; control character: fruity-sweet, violet+strawberry, flat back-half/finish |
| 2-4 | F1 (S1, comparison #1) | ctrl / MgSO₄ / MgCl₂ | Both waters > control; B-vs-C subtle; MgCl₂ narrow preference. Weak violet nudge on MgSO₄ |
| 5-7 | F2 (S1, #2) | ctrl / CaSO₄ / CaCl₂ | CaSO₄ "long shot" over control (did NOT reproduce at that magnitude); CaCl₂ rejected below control (chalky/sour/inject) |
| 8-10 | F3 (S1, #4) | ctrl / CaSO₄ / MgCl₂ | **MgCl₂ > CaSO₄ > ctrl**, gaps narrow; gypsum flight-2 magnitude shrank on same-bottle retest |
| 11-13 | F4 (S2, #4 rematch) | ctrl / MgCl₂ / CaSO₄ | **REPRODUCED: MgCl₂ > CaSO₄ > ctrl.** Phase-of-cup formulation emerges (chloride=front, sulfate=back); full-GH sulfate tips to inject; +exploratory mix #1 → 4:1 instinct |
| 14-16 | F5 (S2, #6) | ctrl / MgSO₄ / CaSO₄ | **HV3 dead** (no floral lift, day 19); sulfate cation-gating found (MgSO₄=sweetness-in-body, CaSO₄=structure); +exploratory mix #2 (splash dose better) |
| 17-19 | F6 (S2, #5+blend) | MgCl₂+KH12 / MgCl₂ / 4:1 blend | **KH rejected** (front-only, one-dimensional); **blend ties straight MgCl₂** (3.6-vs-3.5 pre-reveal; straight preferred post-reveal cooling) — different characters (silky/structured vs clean/crisp) |

### Analysis

Cross-flight resolution of the flight-2/3 disagreement: the two anions act on different phases of the cup, so single-preference reads wobble with attention. Once read per-phase, all sitting-2 results are internally consistent and reproduce. Preference chain (reproduced): straight MgCl₂ ≈ 4:1 blend > CaSO₄ alone > MgSO₄ alone ≈ control+ > control > KH-12 variant > CaCl₂. Dose-response on sulfate confirmed from both directions (full GH-44 share = inject; splash = reveal). Rest-state effect confirmed: the day-19 distilled control was markedly better than day-12's, validating the sitting-2 delay and bounding sitting-1 absolute reads (relative reads unaffected — same-flight design).

### Final output — proposed Gesha recipe-library row (for the Coordinator to fold; NOT applied)

> **Hydrangea Gesha Natural DRD El Burro Lot 15** (body-forward floral natural) · xBloom V60 fixed recipe: 15 g/248 ml 1:16.5 · EG-1 6.2 · BP no-decline · 3 ml/s · 45sp/30 + 68sp/30 + 68sp/30 + 66ctr (~3:36) · **Primary water: straight MgCl₂ @ GH 44 / KH 0** (~9 g stock/L) — clean, crisp, extends the front, sweet note blooms as it cools · **Variant: 4:1 MgCl₂:CaSO₄ @ GH 44 / KH 0** (blend finished GH-44 waters 198:50) — silky, structured, holds the back half; preference-tied with primary, distinct character · **Avoid:** CaCl₂ (chalky/sour/inject), any KH (kills the back half), full-strength sulfate solo (inject) · Rest: markedly better at day 19 than day 12.

### Key findings

1. **The GH-44 straight-MgCl₂ / zero-KH peak generalizes across opposite coffee types** (clarity washed PB; body-forward natural Gesha). Data: flights 3, 4, 6 reproduced head-to-heads. Substrate: de-provisionalize water.md § 6's peak recipe — it's now 2-coffee-verified.
2. **Anion→phase reformulates as phase-of-cup:** chloride = front (extends attack/sweetness), sulfate = back (scaffolds body/structure). Data: flight 4-6 per-axis reads + operator verbatims. Substrate: rewrite § 6's anion language in phase-of-cup terms.
3. **Amplitude is coffee-dependent:** the PB's sharp divide reads as subtlety on the Gesha. Data: operator flight-1/3 verbatims. Substrate: § 6 scope note.
4. **Sulfate cation-gating is coffee-dependent:** cation-agnostic on PB; on the Gesha MgSO₄ = sweetness-in-body, CaSO₄ = structure-under-body. Data: flight 5 same-flight comparison. Substrate: § 6 note + removes "sulfate is cation-agnostic" as a general claim.
5. **WBC sulfate→florality label: 0/2, unsupported.** No floral lift on a floral coffee at open-rest. Data: flight 5 explicit per-cup florality reads at day 19. Substrate: mark the label unsupported wherever water.md/wbc-materials cite it.
6. **CaCl₂ reject generalizes; the lactic mechanism does not** (Gesha failure mode: chalky/sour/stops-short/inject). Data: flight 2. Substrate: § 6 keeps "avoid Ca+chloride," drops "goes lactic" as general.
7. **Reveal/inject is dose-dependent, not salt-intrinsic:** full GH-44 sulfate injects; a 20% fraction reveals. Data: flights 4-6 + both exploratory mixes. Substrate: new § 6 principle; underwrites the blend row.
8. **KH-free confirmed for this platform:** KH 12 preserved the front and killed the back. Data: flight 6. Substrate: § 6 minimal-KH lean → verified default.

### Substrate edit specifications for compile session

DO NOT execute these edits in this session — the compile session integrates substrate.

**Cluster doc edits:**
1. `docs/skills/brewing-equipment-expert/cluster/water.md § 6` — de-provisionalize: replace the "single-coffee-provisional (Pink Bourbon only)" framing with "verified on 2 contrasting coffees (clarity washed PB 2026-06/07; body-forward Gesha Natural 2026-07, this doc's track)." Rewrite the anion→phase section per findings 2-4 (phase-of-cup formulation; amplitude coffee-dependent; sulfate cation-gating coffee-dependent). Add the dose-dependence principle (finding 7) and the verified zero-KH default (finding 8). Keep "avoid CaCl₂," re-scope lactic per finding 6. Source: Verification summary table + Key findings above.
2. `water.md` recipe library — add the Gesha row verbatim from § Final output above.
3. `water.md` / `docs/skills/wbc-roasting-archivist or wbc-brewing-archivist` wherever the 2026 WBC sulfate→florality role-label is cited — annotate "unsupported in Latent testing, 0/2 coffees incl. a floral Gesha (RP6 Phase 2b, 2026-07-17)." Source: finding 5.
4. `docs/skills/brewing-equipment-expert/cluster/water-inventory.md` — § 3: gypsum stock row: rebuilt 2026-07-17 (fresh 500 g bottle, EC 1375 µS vs old 1401, old retired); add built-water EC fingerprint keys (MgCl₂ 146-150 · MgSO₄ 151-154 · CaCl₂ 169.6 · CaSO₄ 148-155 @ GH 44) + the EC-first verification workflow (first build = LaMotte+EC fingerprint; rebuilds = EC-only ±5%; LaMotte mandatory for multi-salt + KH-bearing). Add a gypsum low-stock rebuild note (dilute stock burns ~25-30 g per 500-600 ml build). Source: findings + friction log + sitting-2 Step 0-lite records above.
5. Freezer-stock or protocol-template convention (Coordinator's pick of home): "landed, not frozen" holding entries for just-arrived bags, per audit item P6T3-AI-1.

**Protocol-template edits (research-coordinator cluster):**
6. `templates/` protocol template — sanction "flight-of-3 with in-flight distilled control + post-hoc head-to-heads" as the standard unit for pre-brew water comparisons (replaces tool-call-per-cup for this track shape); add "EC60 cal vs low-range standard at EVERY sitting start" as a hard Step-0 line. Source: lessons P6T3-N5/N6.

**ADR work:** none required (no hard-to-reverse decision made; the reagent-grade MgCl₂ acceptance is time-bounded and already logged in water-inventory § 2's retirement plan).

### New lessons captured

| # | Lesson | Substrate implication |
|---|---|---|
| P6T3-N1 | A single blind read's MAGNITUDE is an anecdote — flight 2's "long shot" shrank to "modest" on same-bottle reproduction. Reproduce before recording magnitude claims. | Protocol template: magnitude claims need 2+ reproductions |
| P6T3-N2 | EC-fingerprint-vs-known-recipe doesn't just detect a bad build, it DIAGNOSES the mistake (3/3 build errors identified to the gram: settled gypsum, crossed water amounts, crossed doses; 0 reached a cup). | water-inventory workflow edit (spec #4) |
| P6T3-N3 | Anion→phase is phase-of-CUP (front vs back), not a flavor-axis mapping. | water.md § 6 rewrite (spec #1) |
| P6T3-N4 | Reveal-vs-inject is dose-dependent, not salt-intrinsic. | water.md § 6 principle (spec #1) |
| P6T3-N5 | Instrument cal drifts silently between sessions (-36% on the EC60 in 2 days idle). Cal at every sitting start, no exceptions. | Protocol template hard line (spec #6) |
| P6T3-N6 | Flight-of-3 with in-flight control + head-to-heads beats cup-at-a-time for pre-brew water reads (temperature parity + direct triangulation). | Protocol template (spec #6) |
| P6T3-N7 | Rest-state gates ABSOLUTE reads; same-flight A/B design makes relative reads rest-robust (day-12 vs day-19 controls differed markedly; relative rankings held). | Protocol template scheduling note |

### Audit items queued

| # | Item | Status | Implication |
|---|---|---|---|
| P6T3-AI-1 | Just-arrived / never-frozen bags have no inventory surface; protocol docs naming them can't be verified (this track's coffee looked like a drafting error at kickoff). | open → compile session (spec #5) | freezer-stock convention |
| P6T3-AI-2 | Dilute gypsum stock exhausts ~10× faster than the 10,000 ppm stocks; no rebuild-threshold convention. | open → compile session (spec #4) | water-inventory note |
| P6T3-AI-3 | Chalky/ALKALINE taste on a ZERO-KH CaCl₂ water is unexplained (flight 2). | open | mechanism unknown; flag if it recurs on a 3rd coffee |
| P6T3-AI-4 | WBC sulfate→florality is 0/2 — deprecate outright, or re-scope (concentration-dependent? platform-dependent?) before killing the label in wbc materials. | open — operator adjudication | spec #3 wording |
| P6T3-AI-5 | Kalita-metal-vs-V60 on this coffee (operator requested, declined for platform lock). | open — future-track candidate | none now |

### Open data items

- The 4:1 blend ratio was tested ONCE at one ratio; 5:1 and a MgCl₂+MgSO₄ blend variant (sweetness-payload instead of structure) are untested — operator's flight-5 mix suggests the latter is live.
- HV3 was tested only at GH 44 full-strength MgSO₄; a florality effect at lower sulfate fractions can't be excluded (feeds AI-4).
- Flight-6 post-reveal preference lean (straight over blend) is self-flagged as possibly reveal-biased; if the recipe row's primary/variant ordering ever matters, re-run that pair blind.

### Recap map for compile session

Integrate first: specs #1-2 (water.md § 6 de-provisionalization + recipe row — the track's entire purpose). Then #4 (water-inventory workflow, self-contained). Then #6 (protocol template). Defer #3 pending operator adjudication of AI-4 (deprecate vs re-scope the WBC label). Escalate to operator: AI-4, and the recipe row's primary/variant ordering caveat (open data item 3).

### Protocol-execution friction captured

1. Kickoff coffee-identity check false-alarmed because the bag wasn't in any inventory surface (→ AI-1).
2. Sitting-1 EC60 cal caught -36% drift; without the Step-0 cal line the whole track's QC would have been silently corrupt (→ N5).
3. Gypsum settled/low-stock under-delivery on first CaSO₄ build; LaMotte only hinted, EC convicted (→ N2, spec #4).
4. Sitting-2 crossed-recipe build error (new dose in old water amount + vice versa) — EC arithmetic diagnosed both from the readings alone (→ N2).
5. Operator preference for EC over LaMotte (speed) drove the EC-first refinement — granted mid-session with the LaMotte boundary conditions (first builds, multi-salt, KH).
6. Tool-call-per-cup pacing was abandoned by the operator in flight 1 in favor of flights-of-3; the deviation outperformed the protocol and was sanctioned (→ N6).
7. Protocol doc's 15-20 brew / ~300 g budget was accurate (19 brews / ~285 g).

---

### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Archive doc committed + pushed to branch `claude/2nd-coffee-gesha-natural-d432ac` (sitting-1 commit `83dec5d`; final SHA in the session close message — the branch tip is the archive)
- ✅ Handoff brief produced above; branch + SHA in the `Archive location:` header for the compile session
- 🛑 Session terminating after this brief lands. The compile session integrates substrate per the design pattern.

End of 2nd-Coffee Verification (Gesha Natural) close-out.
