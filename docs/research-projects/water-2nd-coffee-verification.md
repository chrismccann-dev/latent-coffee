# 2nd-Coffee Verification — Gesha Natural (Research Project #6, Phase 2b)

*Coffee Research · Latent · Research Project*

**Version:** 0.1 (DRAFT — Coordinator-authored, pre-execution)
**Date drafted:** 2026-07-05
**Date executed:** _(Assistant fills)_
**Status:** 🟡 **DRAFT — awaiting Assistant-session execution.**
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
**Flight-1 structural observations:** (1) The anion CONTRAST that was sharp on the Pink Bourbon is much smaller on this coffee — direction weakly holds (sulfate→sweeter, chloride→brighter) but magnitude is way down. (2) Inversion: distilled carried the most body/creaminess; BOTH GH-44 Mg waters traded texture for brightness on this body-forward coffee. Not predicted anywhere in the Track 2 map. (3) Weak HV3 positive: MgSO₄ nudged violet on the nose.

### Sitting 1 close (2026-07-10, 10 cups: 1 dial-in + 3 flights of 3) — interim HV state
- **HV1 (anion→phase map):** axes survive DIRECTIONALLY (sulfate→sweet/juicy, chloride→bright) but the amplitude collapsed — the sharp PB phase divide reads as subtlety here. Cation-gating on chloride: holds (MgCl₂ good, CaCl₂ reject).
- **HV2 (phase-flip):** NOT confirmed at peak level — MgCl₂ narrowly retains the crown in the direct head-to-head. Sulfate is more competitive than on PB (gypsum went from nothing-water to clear-#2), so a WEAK partial flip in sulfate's direction, but no crown change.
- **HV3 (sulfate→florality):** two weak positives (MgSO₄ violet nudge flight 1; CaSO₄ "little more floral" flight 2). Not conclusive; rest caveat still applies — recheck in sitting 2.
- **HV4 (CaCl₂ lactic?):** DIVERGED — Ca+chloride rejects on both coffees but the failure mode changed (PB lactic/oily → Gesha chalky/sour/stops-short/inject). "Avoid CaCl₂" generalizes; "goes lactic" does not.
- **Sitting 2 queue (few days out, ~day 15-16 rest — also serves the HV3 rest caveat):** (a) **#4 REMATCH** MgCl₂ vs CaSO₄ (two flights disagree on gypsum's magnitude; the crown needs a reproduced margin), (b) **#6** MgSO₄ vs CaSO₄ same-flight (promoted to must-run: sulfate cation-agnosticism is in question here, unlike PB), (c) **#5** KH check (zero vs ~10-15 KH) on the winner. **#3 (MgCl₂ vs CaCl₂) TRIMMED** — CaCl₂ decisively rejected twice-over; the cup buys no information. **Before sitting 2: rebuild the gypsum stock from § 2 dry** (current stock near-exhausted): 0.75 g dry CaSO₄·2H₂O into 500 g distilled, magnetic stir 15-20+ min, EC-fingerprint new stock vs the old bottle's remainder (match within a few %), label CONCENTRATE, retire old bottle. Budget: ~150 g used, ~300 g remains (~20 cups) — ample.
- **Sitting 2 scheduled: Fri/Sat 2026-07-17/18** (day 19-20 rest). Chris offered Sunday 7/12 (day 13); Assistant recommended waiting — day-13 rest would inherit the same HV3 closed-bean caveat as sitting 1, day 19-20 puts the Gesha properly in its window and doubles as a read on whether sitting-1 florality was rest-suppressed.

### Verification summary (fill after scoring)
| HV | Verdict on the Gesha | Holds vs Pink Bourbon? |
|---|---|---|
| HV1 anion→phase + cation-gating | | |
| HV2 phase-flip (sulfate on body coffee?) | | |
| HV3 sulfate→florality | | |
| HV4 CaCl₂ lactic? | | |

---

## Notes / friction · New lessons · Audit items

_(Assistant: capture inline. Candidate primitives stay logged for the PROJECT retro — do NOT promote mid-session.)_

- **Process deviation (flight 1, logged as lesson candidate, NOT promoted):** Chris brewed the comparison as a 3-cup FLIGHT (control + both waters, tasted round-robin with direct head-to-heads) rather than the protocol's tool-call-per-cup pacing. It worked well — same-flight temperature parity + direct A/B/C triangulation produced cleaner relative reads than remembered-control comparison would have. Candidate refinement for the protocol template: "flight-of-3 with a fresh in-flight control" as the sanctioned unit for pre-brew water comparisons.
- **Verification catch (comparison 2, 2026-07-10):** first CaSO₄ build came in ~17% under target (EC 140.9 vs CaCl₂'s 169.6; expected parity-or-above per the Mg-pair pattern where sulfate > chloride). Classic settled-gypsum under-delivery, from a LOW stock bottle no less. The LaMotte titration only hinted (3-4 drops vs a clean 4); the EC convicted. Fixed by shake + ~5 g stock top-up + re-verify.
- **Protocol refinement (granted in-session, lesson candidate):** EC60-first verification. First build of any recipe = LaMotte + EC (LaMotte proves GH; EC becomes the recipe's recorded fingerprint). Rebuilds of a known recipe = EC-only vs fingerprint (±5%). LaMotte stays mandatory for multi-salt builds + any KH-bearing water. Session fingerprints @ GH 44: MgCl₂ 146.4 · MgSO₄ 154.3 · CaCl₂ 169.6 · CaSO₄ **155.3** post top-up (clean 4-drop LaMotte match with CaCl₂; reads ~8% below CaCl₂ at equal GH — attributed to CaSO₄⁰ ion pairing, so 155.3 IS the fingerprint, don't chase EC parity with the chloride).
- **Inventory flag (comparison 2, 2026-07-10):** gypsum (CaSO₄) stock running LOW — the dilute 1,500 ppm stock burns ~25 g per 500 ml GH-44 build. Refill from § 2 dry gypsum needed before comparison #6 / sitting 2. Audit item for water-inventory.md: dilute-stock consumption rate makes the 1,500 ppm gypsum bottle the first stock to exhaust; consider a standing "rebuild when below N g" line.
- **Friction (Step 0, 2026-07-10):** the protocol header's coffee ("Hydrangea ... El Burro Lot 15") was un-verifiable against inventory — the bag had just arrived and was never entered in freezer-stock, while a *different* El Burro (Helm Lot 16) WAS in freezer-stock. The Assistant initially flagged the header as a possible drafting error. **Audit item:** just-arrived / not-yet-frozen bags have no inventory surface, so a protocol doc naming one can't be verified; consider a "landed, not frozen" holding convention in freezer-stock.md (or an explicit "not in inventory yet" line in protocol docs).

## HANDOFF BRIEF (fill at session end)

_(Per [`handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md): TL;DR · execution summary · per-cup raw data · the 4 HV verdicts · does the map generalize? · the Gesha recipe-library row (proposed, for the Coordinator to fold) · substrate-fold spec (de-provisionalize water.md § 6 IF the map holds — DEFERRED to a Coordinator/execution session, not this one) · new lessons · `Archive location:` branch + SHA · termination declaration.)_

```
Execution Session Termination — Lesson #40
- ❌ NO substrate edits (registry / cluster docs incl. water.md / ADR / MCP)
- ❌ NO merge to main, NO substrate PR, NO tsc
- ✅ Protocol doc updated in-place as canonical archive
- ✅ Archive committed + pushed to branch <branch> @ <SHA>
- ✅ Handoff brief produced; branch + SHA in its Archive location: header
- 🛑 Terminating. The Coordinator decides the water.md § 6 fold.
End of 2nd-Coffee Verification (Gesha Natural) close.
```
