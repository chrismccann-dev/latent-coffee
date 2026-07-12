# Modifier Minerals Screen — KCl / Silica / NaCl on the Pink Bourbon (Research Project #6, side-track)

*Coffee Research · Latent · Research Project*

**Version:** 0.1 (DRAFT — Coordinator-authored, pre-execution)
**Date drafted:** 2026-07-08
**Date executed:** _(Assistant fills)_
**Status:** 🟡 **DRAFT — awaiting Assistant-session execution.** Runs during the Phase-2b (Gesha) rest interval; separate coffee + session, no interaction with 2b.
**Platform:** xBloom (controlled-pour) driving a Hario V60, fixed no-modulation recipe
**Coffee:** Hydrangea Pink Bourbon Washed (the known-baseline coffee — Chris has extra)
**Materials:** the six § 3 liquid stocks + the three unused modifiers (KCl, Eidon silica, Morton NaCl) — see [water-inventory.md](docs/skills/brewing-equipment-expert/cluster/water-inventory.md)

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE (Lesson #40)

**You are the Research Assistant. Job = execution + handoff brief. NOT substrate integration.**

**DO NOT:** edit `lib/*-registry.ts` · edit `docs/skills/*/cluster/*.md` (incl. `water.md` / `water-inventory.md`) · edit ADRs · `git commit`/`push` SUBSTRATE, merge to main, `gh pr create` — EXCEPT the one archive-persist commit of THIS doc · run `npx tsc --noEmit` on substrate · continue past the handoff brief.
**DO:** read this doc in full BEFORE Step 0 · Step 0 with Chris · cups one-at-a-time · capture inline (doc IS the archive) · handoff brief per [`handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md) · commit + push the archive to your branch (branch + SHA in the brief) · TERMINATE. Full primitive: [`role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md).

---

## Context — what this side-track is FOR

RP6's core is done (anion→phase map codified in [water.md](docs/skills/brewing-equipment-expert/cluster/water.md); Gesha verification is Phase 2b, mid-rest). This is the **three WBC-seeded modifier tracks, combined into one session** while the Gesha rests — on the **Pink Bourbon**, the coffee we know best (peak = straight MgCl₂ @ GH 44). It closes out the last three unused minerals.

These are **additive modifiers, not GH sources** (none contributes hardness) — so the design is "add a low dose to a known base and score the axis it's supposed to move," not the anion→phase 2×2.

- **KCl (potassium-as-finish).** The 2026 WBC field uses K (KCl / K-citrate) for **finish / length / peach**. Important: Track 2 disliked potassium — but that was **KHCO₃ (the bicarbonate buffer)**, which flattened acidity. **KCl is a different role** (K + chloride, no buffering). This disambiguates "we disliked potassium" from "we disliked the buffer."
- **Silica (silica-as-texture).** The field loves it for **smooth / creamy / round texture**. Eidon liquid, dose very low.
- **NaCl (salinity / seasoning).** Small chloride/salinity → perceived **sweetness / roundness / finish**, late + low. Punishes overdose fastest.

Single-coffee / provisional (like all RP6 values) — extends the map with three new modifier axes on the known coffee; other coffees verify later. **Substrate-fold DEFERRED** — if a modifier earns a `water.md` chart-row or recipe-modifier note, that's a post-track Coordinator/execution job, not this session.

---

## Hypotheses (pre-state before scoring, per Lesson #16)

- **HM1 — KCl → finish?** Does KCl add finish/length/peach on the Pink Bourbon? And is it *pleasant* (unlike the KHCO₃ buffer)? Disambiguates the Track-2 potassium result.
- **HM2 — Silica → texture?** Does silica change mouthfeel (smoother/creamier/rounder) without moving flavor? At what dose does it start to dull?
- **HM3 — NaCl → salinity/sweetness/roundness?** Does a tiny NaCl addition read as perceived sweetness/roundness, and where does it tip into "salty/dominant"?

---

## Step 0 — calibration

1. **Pink Bourbon baseline recipe** — use the established Track-1/2 baseline (record it here); run one confirming brew.
2. **Make the two missing stocks** (for precise low dosing): **KCl 10,000 ppm** (1 g/100 g distilled) + **NaCl 10,000 ppm** (1 g/100 g). Silica is already liquid (Eidon; ~12.5 mg/drop). EC60-fingerprint the two new stocks. *(These become new § 3 inventory rows — the Coordinator folds them post-track.)*
3. **The peak base:** build the Pink Bourbon peak = **straight MgCl₂ @ GH 44** from the § 3 MgCl₂ stock (~9 g/L); verify on the LaMotte. This is the primary base.
4. **Rig check:** EC60 cal vs the 84 µS standard.
5. **Coffee budget:** ~11 scored cups planned; confirm enough Pink Bourbon.
6. **Semi-blind:** code + shuffle.

---

## Experiment design — modifier additions (pre-brew; A/B vs the matching base; per-axis scoring)

**Two baselines:** (a) plain **peak** (MgCl₂ @ GH 44), (b) plain **distilled**.

**Lane 1 — on the peak base** (the realistic use — seasoning a good water). Each modifier at a **2-step low ladder**, A/B vs the plain peak:
| Modifier | Low | Higher | Watch axis |
|---|---|---|---|
| **KCl** | ~10 ppm (1 g stock/L) | ~25 ppm (2.5 g/L) | finish / length; is it pleasant? |
| **Silica** | ~1 drop/L (~12 ppm) | ~2 drops/L (~25 ppm) | texture / mouthfeel; dulling? |
| **NaCl** | ~5 ppm (0.5 g stock/L) | ~15 ppm (1.5 g/L) | salinity → sweetness/roundness; tip point |

**Lane 2 — distilled isolation** (pure modifier signal). Each modifier at its **low** dose in plain distilled (1 cup each), A/B vs plain distilled. Isolates the modifier with no MgCl₂ confound.

Total ≈ 2 baselines + 6 (Lane 1) + 3 (Lane 2) = **~11 cups** → one sitting.

**Scoring — PER-AXIS directional reads** (finish · texture/mouthfeel · sweetness · salinity · acidity · body · florality), each scored separately vs the matching base; + reveal/inject flag. Never a single overall verdict. Tool-call-per-cup; auto-retest ambiguous reads; keep doses LOW (NaCl/KCl punish overdose fast). Note: neither base carries calcium, so the silica-calcium interaction is not in play here.

---

## Recording Sheet

### Step 0
- Pink Bourbon baseline recipe: ___ · KCl stock EC ___ · NaCl stock EC ___ · peak LaMotte GH/KH ___ · coffee on hand ___

### Predictions (pre-state HM1-HM3)
| Modifier | Predicted effect | Predicted tip/dulling point |
|---|---|---|

### Per-cup scoring (per-axis; one row per cup)
| Code | Base | Modifier + dose | Finish | Texture | Sweetness | Salinity | Acidity | Body | Floral | Reveal/Inject | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|

### Modifier summary (fill after scoring)
| Modifier | Effect confirmed? | Sweet-spot dose | Pleasant / worth keeping? | Peak-base vs distilled-isolation |
|---|---|---|---|---|
| KCl | | | | |
| Silica | | | | |
| NaCl | | | | |

---

## Notes / friction · New lessons · Audit items

_(Assistant: capture inline. Candidate primitives stay logged for the PROJECT retro.)_

## HANDOFF BRIEF (fill at session end)

_(Per [`handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md): TL;DR · per-cup raw data · the 3 HM verdicts · does KCl-for-finish vindicate potassium (vs the KHCO₃ buffer)? · proposed water.md additions — new chart-rows for any modifier that earned its place + the two new § 3 stock rows (KCl, NaCl) — DEFERRED to a Coordinator/execution fold · new lessons · `Archive location:` branch + SHA · termination declaration.)_

```
Execution Session Termination — Lesson #40
- ❌ NO substrate edits (registry / cluster docs incl. water.md/water-inventory.md / ADR / MCP)
- ❌ NO merge to main, NO substrate PR, NO tsc
- ✅ Protocol doc updated in-place as canonical archive
- ✅ Archive committed + pushed to branch <branch> @ <SHA>
- ✅ Handoff brief produced; branch + SHA in its Archive location: header
- 🛑 Terminating. The Coordinator folds any water.md/inventory updates.
End of Modifier Minerals Screen close.
```
