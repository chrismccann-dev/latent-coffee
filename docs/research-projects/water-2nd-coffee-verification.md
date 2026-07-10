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
- Gesha baseline recipe: dose ___ / ratio ___ / temp ___ / pours ___ / time ___
- Stocks OK? ___ · EC60 cal (84 µS) ___ · GH-44 test water LaMotte read ___ · coffee on hand ___

### Predictions (pre-state HV1-HV4)
| Comparison | Predicted direction | Predicted vs Pink Bourbon |
|---|---|---|

### Per-cup scoring (per-axis; one row per cup)
| Code | Water/ion | GH/KH | Floral | Acidity | Sweetness | Body | Texture | Reveal/Inject | Overall | Notes (prose) |
|---|---|---|---|---|---|---|---|---|---|---|

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
