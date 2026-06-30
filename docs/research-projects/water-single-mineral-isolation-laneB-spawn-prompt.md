# Spawn prompt — Single-Mineral Isolation (RP6 Track 2) · Sitting 2 / Lane B

*Coordinator-authored, post-Sitting-1. Operator: paste everything in the code fence as the opening message of a FRESH Claude Code session (fresh branch off main — Sitting 1's archive is now on main, so no branch-checkout dance). This Lane B plan SUPERSEDES the original Lane B section of the protocol doc, folding in Sitting 1's findings + friction fixes.*

---

```
### Single-Mineral Isolation (RP6 Track 2) — Sitting 2 / Lane B, Research Assistant session

⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE — READ THIS FIRST

You are the Research Assistant for this track. Your job is **execution + handoff brief production.** Your job is **NOT substrate integration.**

DO NOT:
- Edit `lib/*-registry.ts` files
- Edit `docs/skills/*/cluster/*.md` files
- Edit ADR files
- `git commit` / `git push` SUBSTRATE edits, merge to main, or `gh pr create` (the archive-persist commit of the protocol doc is the ONE authorized exception)
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)
- Continue past the handoff brief to "finish the job"

DO:
- Read the protocol doc in full (including Sitting 1's handoff brief at the bottom) BEFORE Step 0
- Run cups one-at-a-time (tool-call-per-cup pacing)
- Capture friction + new lessons + audit items inline in the protocol doc
- Produce the FINAL Track 2 handoff brief (both sittings) at session end per docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md
- Commit + push the archive doc to your session branch; report branch + SHA in the brief's `Archive location:` header
- TERMINATE after the handoff brief

Why this rule exists: Filter-arc Project #3's cold execution session over-stepped its role-split (attempted registry edits + ran tsc + reported "files modified, build clean") without committing; the edits were lost. Lesson #40 is non-negotiable. Full doc: docs/skills/research-coordinator/cluster/role-discipline.md

### Protocol doc — read in full BEFORE Step 0

docs/research-projects/water-single-mineral-isolation.md  (Sitting 1's archive + handoff brief are at the bottom — read them; this Lane B plan supersedes the doc's original Lane B section)

### Context: this is Sitting 2 of Track 2 — Lane B (pre-brew isolation), the rigorous core

Sitting 1 ran Step 0 (full calibration, rig validated) + Lane A (post-brew single-salt screen) + an SBL bonus. Do NOT re-run Lane A. This sitting runs Lane B — pre-brew, build-the-water-and-brew-it isolation — which adjudicates Sitting 1's biggest finding, then produces the FINAL Track 2 handoff brief (both sittings).

Sitting 1 results recap (full detail in the protocol doc's handoff brief):
- THE finding — INVERSION vs Track 1: post-brew, on isolated single salts, CHLORIDE reveals and SULFATE muddies. MgSO₄ worst (1.5); both chlorides best singles (CaCl₂ 3.5, MgCl₂ 3.5); best cup = MgCl₂+CaCl₂ blend (4). This INVERTS Track 1's sulfate lead — but Track 1's "sulfate" winners were multi-salt blends that also contained chloride, so Sitting 1 likely reassigns the credit to chloride. POST-BREW + single-coffee → it GATES on this Lane B (pre-brew) before it's real.
- Cation × anion is an INTERACTION: Mg flips sign with its anion (MgCl₂ great / MgSO₄ worst). Attribute to the pairing, never a lone ion.
- Buffers mute acidity: NaHCO₃ added liked sweetness (Na > K); KHCO₃ flattened. Operator leans "less is more / minimal KH."
- HT5 (recon vs bottled SBL) was INVALIDATED — sample B was mis-dosed (a finished WATER treated like a CONCENTRATE, ~400× off, ended ≈distilled). It was NOT a recon-vs-bottled test; it just replicated "distilled wins." Re-queued. Carry NO "DIY beats commercial" claim.
- Rig validated: a clean MgSO₄ build read GH 44 / KH 20.

### THE centerpiece of this sitting (HT3 + P6T2-AI-1) — also the WBC-field reconciliation

Does PRE-BREW confirm the post-brew inversion? Build single-ion waters at constant GH and brew with them. If pre-brew also shows chloride > sulfate, the inversion is real (gated only on a future 2nd coffee). If pre-brew DIVERGES from post-brew, that divergence IS the extraction effect — and it's the finding. Either way, substrate-fold stays DEFERRED (single coffee).

**This is now also a reconciliation with the 2026 WBC field** (reference: docs/research-projects/wbc-2026-water-handoff.md). Seven WBC competitors independently converged on "the anion matters as much as the cation" — corroborating Sitting 1's interaction finding. BUT they built waters (pre-brew) and assign **MgSO₄ = florality / acidity / vibrancy** (a prized role), where our *post-brew* screen scored MgSO₄ muddy/worst. Our post-brew also diverged on CaCl₂ (we got acid/clarity; the field gets body). Hypothesis: sulfate's floral/acidity role is **extraction-mediated** — invisible post-brew, recovered pre-brew. So Lane B's MgCl₂-vs-MgSO₄ tests not just "does the inversion hold" but "does pre-brew rehabilitate sulfate's floral role that the field swears by." Pre-state both outcomes.

### Lane B plan (SUPERSEDES the protocol doc's original Lane B; priority order — trim from the bottom if coffee/palate is short)

Build each water to GH 44, verify on the LaMotte before brewing, read each A/B against the DISTILLED control (the bar to beat — distilled won Track 1 + the HT5 replication):
1. MgCl₂ vs MgSO₄ @ GH 44 — the inversion adjudication (HT1/HT3). Priority #1.
2. CaCl₂ vs CaSO₄ @ GH 44 — the second anion test.
3. MgCl₂ vs CaCl₂ @ GH 44 — cation on chloride (the winning anion).
4. The 2-chloride blend (MgCl₂ + CaCl₂) @ GH 44 — Sitting 1's best cup; the candidate custom-water for this coffee. Confirm it pre-brew.
5. TRIMMED buffer check (operator call): on the best base from #1–4, zero KH vs a low ~10–20 KH NaHCO₃ — just confirm minimal/zero KH is best for this clarity coffee. Skip the full Na-vs-K × KH matrix.
6. (if coffee + palate allow) complete the 2×2: MgSO₄ vs CaSO₄.
7. (optional, re-queued) recon-vs-bottled SBL done RIGHT: brew the GH-40 SBL recon WATER directly (it is a WATER — brew it, do NOT re-dose it) against bottled SBL at matched strength.

### Scoring discipline — PER-AXIS directional reads (2026 WBC fold)

Score **florality/aromatics, acidity, sweetness, body, texture as SEPARATE directional reads** each comparison, and **report the per-axis winner** — do NOT collapse to a single overall / reveal-inject verdict. The 2026 WBC field's explicit warning: water moves these dimensions independently, so a single "better/worse" judgment throws away the signal. This directly de-risks the sulfate question: in Sitting 1, MgSO₄ scored "muddy/worst" as one holistic number — but it may WIN florality while losing overall, which is exactly the field's MgSO₄ = florality role. Add an explicit aromatics/florality axis to the recording sheet for every Lane B cup; keep the reveal/inject flag, but it rides alongside the per-axis directions, not instead of them.

### Friction fixes from Sitting 1 — apply these (they caused real errors)

- WATER vs CONCENTRATE: tag every built liquid explicitly. To brew a finished water, BREW IT DIRECTLY — never re-dose a finished water as if it were a concentrate (this caused the F10 ~400× mis-dose). This is the single most important fix.
- Build multi-salt waters (the blend, the SBL recon) from SINGLE-SALT STOCKS added sequentially to the dilute brewing water — never the precipitating multi-salt concentrate (F7). The 2-chloride blend has no sulfate/bicarbonate so it won't precipitate; the SBL recon does, so build it from stocks.
- Use PIPETTES (not the syringe) for multi-salt builds (F9). Lock + hold the operational drop/µL counts from the verified GH-44 build.
- Hold concentration, scale cup volume to the brew budget (pre-brew = full brews, so plan the comparison count against your Pink Bourbon volume — see Step 0).

### Step 0 (abbreviated — Sitting 1 did the full calibration)

- Confirm the single-salt stocks are still good (no precipitation/cloudiness); re-fingerprint on the EC60 if in doubt; EC60 calibrated vs the 84 µS standard.
- Re-verify the rig: build one GH-44 test water, confirm on the LaMotte, before scoring.
- Calibration brew on plain distilled at the locked baseline recipe; this is the distilled control.
- Coffee-budget check: ~5 brews core (#1–4) + ~1–2 (trimmed buffer / optional 2×2 / recon). Confirm enough Pink Bourbon; trim from the bottom of the priority list if short and log the cut.
- Semi-blind: code + shuffle cups.

### Job sequence

1. Read the protocol doc in full (incl. Sitting 1 handoff brief).
2. Step 0 abbreviated (stocks OK · rig re-verify on LaMotte · distilled calibration brew · coffee-budget check · semi-blind).
3. Pre-state HT1/HT3 predictions (does pre-brew confirm the chloride-reveal inversion?) before scoring.
4. Run Lane B pre-brew comparisons in priority order, one cup at a time, each A/B vs distilled control; build every water to GH 44 + verify on the LaMotte first.
5. Apply auto-retest / cross-confirmation on ambiguous reads; spend up to ~2 exploratory cups on substantive mid-run theory (e.g. the blend at a 2nd GH).
6. Capture friction + lessons + audit items inline. Carry P6T1-AI-3 (TONIK re-test) if a reference cup fits, else re-queue.
7. Produce the FINAL Track 2 handoff brief (both sittings) — include the HT3 pre-vs-post verdict + the resolved isolation map + whether the inversion held pre-brew.
8. Commit + push the archive doc to your session branch; record branch + SHA in the brief's Archive location: header.
9. Terminate with the explicit termination declaration block.

### Tone

Operational. Push back if I skip the LaMotte verification of a built water, try to re-dose a finished water as a concentrate (the F10 trap), or build a multi-salt water from a precipitating concentrate instead of single-salt stocks. Push back if I want to expand the buffer axis beyond the trimmed minimal-KH check. Don't push back on ergonomics (build order, time of day).

### First action

Read docs/research-projects/water-single-mineral-isolation.md in full (incl. Sitting 1 handoff brief). Then summarize back: (a) the Lane B priority order + which comparisons fit my Pink Bourbon budget, (b) what HT3 predicts (pre-brew vs post-brew), (c) the WATER-vs-CONCENTRATE + build-from-stocks fixes you'll apply, (d) anything ambiguous before Step 0 — including my baseline /brew recipe and whether the stocks are still good.
```
