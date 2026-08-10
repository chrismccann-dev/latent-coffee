# Concentrated Pour-Over — Track 3: Loud Giants SWORKS Valve Track (Research Project #8, Office Lane)

*Coffee Research · Latent · Research Project*

**Version:** 1.0 (scoped)
**Date drafted:** 2026-08-10
**Status:** SCOPED — coffee locked by operator (Picolot Loud Giants); design consumes the Track-2 handoff brief
**Location:** Office (Downtown Palo Alto)
**Coordinator session:** RP8 Coordinator (persistent)
**Prior tracks:** [T1 — El Oasis Full Ladder](docs/research-projects/concentrated-pourover-t1-full-ladder.md) (CLOSED 2026-08-03) · [T2 — Motta Abbreviated Ladder](docs/research-projects/concentrated-pourover-t2-motta-abbreviated-ladder.md) (CLOSED 2026-08-10, reproduction gate MET)

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE — READ THIS FIRST

You (the session executing this protocol) are the **Research Assistant** for this track. Your job is **execution + handoff brief production.** Your job is **NOT substrate integration.**

**DO NOT:**
- Edit `lib/*-registry.ts` files
- Edit `docs/skills/*/cluster/*.md` files
- Edit ADR files
- `git commit` / `git push` SUBSTRATE edits, merge to main, or `gh pr create` (the archive-persist commit of THIS doc is the ONE authorized exception)
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)
- Call `push_brew` — brew-row archival is explicitly DEFERRED for this project
- Continue past the handoff brief to "finish the job"

**DO:**
- Read this doc in full BEFORE Step 0
- Walk the operator through Step 0 sub-steps to completion before any scored brew
- Run scored brews one-at-a-time (tool-call-per-brew pacing; serial cadence)
- Re-present the scoring rubric inside EVERY scored brew's tool call
- Capture friction + new lessons + audit items inline in this doc
- Produce a handoff brief per `docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md`
- Commit + push THIS doc to your session branch at termination; report branch + SHA in the brief's `Archive location:` header
- TERMINATE the session after the handoff brief

Full primitive doc: `docs/skills/research-coordinator/cluster/role-discipline.md`

---

## Project Context

Track 3 of **Research Project #8 — Concentrated Pour-Over / High-Strength Filter** (office lane; WBC routine-differentiation bet). State of the project entering this track:

- **The style is real and reproduced:** 1:10 is the optimum on both coffees tested (El Oasis delicate washed Gesha; Motta extraction-demanding anaerobic washed Gesha); 1:9 is the boundary on both (location leans ratio-intrinsic; failure *signature* is coffee-structural). T2's 1:10 winner reproduced later-day at Δ 0.01% TDS — **the reproduction gate is MET**, the low-pressure branch is formally unlocked (AeroPress acquired 2026-08-10), and the branch is sequenced BEHIND this track as T4+.
- **The mechanism has a known tax:** both tracks bought concentration with grind. T1: taste optimum coarser than iso-extraction. T2: −0.07/pt taste-adequate but EY slid down the ladder, and the winner carried a dark-tea tannin thread the operator hypothesizes is grind-driven (fine + high temp), not concentration-intrinsic (P8-AI-4, reframed here — Motta itself is sold out, so the generic version runs on this coffee).
- **This track is the operator's stated next lever (stated twice, T2 rungs 2 + R): "hold the front, flush the back" — SWORKS valve experimentation at 1:10, constant temp + constant grind, contact time supplied by the valve instead of by grinding finer.** Water experimentation stays explicitly sequenced after valve work.

**Why Loud Giants:** its archived control IS a SWORKS valve recipe (the Picolot house fast/fast/slow, Dial 7→7→5) — the comparability that disqualified it from Kalita tracks (T1/T2) is exactly what qualifies it here. Full Expression Pacamara natural: the extraction-demanding lane where a contact-time lever should matter most. Chombi (Suppression SWORKS control) is the natural T4 gravity-side candidate.

Vocabulary stays grilling item 56's (T1 + T2 evidence pointers already filed). Trial records live in this doc — **no push_brew.** P8-AI-2 (H1 ratio-only cup): **RETIRED** by operator call 2026-08-10 (transformation evidence on 2 coffees suffices; revivable opportunistically on a future Kalita-track coffee with spare vials).

## Inherited from Tracks 1–2 (operative amendments)

| # | Lesson / finding | What it changes in THIS track |
|---|---|---|
| T2 Key finding 7 | Valve, not grind, is the operator-identified next lever. | The track's design center — see § Design. |
| P8-AI-4 (reframed) | Is the fine-grind tannin/texture tax avoidable at 1:10 when the valve supplies contact time? | Constant CONTROL grind across all 1:10 cups; tannin/texture read is a first-class scoring line. |
| RP8-N5 | A taste-fit coefficient is not iso-extraction; TDS/EY is mechanism-read only. | TDS logged every cup; never arbitrates the winner. |
| RP8-N6 | Failure signatures are coffee-structural — capture whatever this coffee's actually is. | Standing caution; Pacamara natural under valve-driven concentration is unmapped. |
| RP8-N7 | Tag missed/compromised stage reads at capture time; repeat verdicts consult the tags. | Standing rubric line. Also: FIRST SIP BEFORE ANYTHING ELSE (T2 friction 2 — don't lose the hot read). |
| RP8-N8 | Pre-plan rule-vs-adjust decision points between cups. | The V-B cup is explicitly adaptive — its design is an operator decision point, pre-planned (§ Design). |
| RP8-N1 | Weigh every vial before trusting the budget. | Step 0 item 1. |
| RP8-N2 | Archived control may predate the office water baseline. | **Resolved at scoping: plain PA tap, zero additions, whole track** (T1/T2 continuity + control-era match). |
| RP8-N3 | Office-lane capture trims (pre-declared, third track running; graduation queued for the project retro). | Single TDS read · no thermometer, stages by feel · no pour timestamps beyond count + rough timing · blank NUMBER recorded at every sitting open. |
| T2 friction 3 | Water-treatment temptation recurs mid-track. | Standing parking line: water is locked whole-track; ideas get logged, not brewed. |
| T2 friction 4 | Per-rung records capture the actual brew date at brew time. | Recording-sheet field. |

## Track-3 coffee (LOCKED 2026-08-10)

| Field | Value |
|---|---|
| Coffee | **Picolot — Loud Giants, Mama Cata Estate Pacamara Natural** (Boquete, Panama; Garrido family) |
| Archived control brew ID | `3039f2cb-1b4a-44dd-a343-7f4ef4b2475f` |
| Control recipe | **SWORKS Bottomless** + xBloom paper · 15 g / 250 g (**1:16.7**) · **EG-1 6.1** · **95°C** · Full Expression · Picolot house valve structure **fast/fast/slow (Dial 7 → 7 → 5)** · drawdown 2:45–3:15 (Assistant pulls full pour/valve structure from the row at Step 0) |
| Control profile | Silky body, bright/juicy acidity, complex clarity, clean finish · label fruit lands cool (<45°C); warm-window bitter tail is a known artifact that clears on its own |
| Vials | **4 × 15 g** (fill-weight verify at Step 0 — RP8-N1) |
| Water | Plain PA tap, zero additions, whole track (RP8-N2 scoping-resolved) |

**Coffee-specific cautions:**
- The control's **warm-window bitter tail** is documented as a self-clearing artifact on this coffee — do NOT read it as the tannin-tax signal at 1:10 without checking whether it clears cool exactly as the control's does.
- Grind stays at **6.1 (control) for every 1:10 cup** — that constancy IS the experiment (P8-AI-4′). If a cup fails, the levers are valve schedule and pour placement, not grind, not temp.
- Bean-density note from the archive: Pacamara runs one click coarser than the Garrido Mokka siblings — 6.1 is already density-adjusted; trust it.

## Hypotheses (pre-state before scoring)

- **H-valve (the track's headline):** at 1:10 and CONSTANT control grind (6.1) + temp (95°C), valve-restricted contact time can replace fine-grind compensation — producing a concentrated cup (TDS meaningfully above control; target zone ~1.4–1.8× based on T1/T2) that reads coherent, not under-extracted. *T1/T2 needed −0.3 to −0.5 of grind to get there; this track spends zero.*
- **H-AI4′ (the tannin-tax test):** the dark-tea tannin / texture tax that rode the grind-driven concentrates does NOT appear when contact is valve-supplied at coarse grind. *If a tannin thread appears anyway, concentration-intrinsic gains the upper hand; if absent, grind-driven is confirmed.*
- **H-repro:** the winning valve schedule reproduces later-day (profile + TDS ±0.05%) — protected vial, same discipline as T2.
- **H-stage:** coffee-dependent stage behavior (T2 Key finding 5) — no prediction; record whether the valve-driven concentrate keeps this coffee's cool peak (its control peaks <45°C).
- **H5:** 95°C unchanged all cups; no flaw gets a temp fix by default.

## Step 0 (run to completion BEFORE any scored brew)

1. **Vial fill-weight check (RP8-N1) — FIRST.** Weigh all 4 vials; stop + re-plan with operator if any is partial.
2. **Coffee + control verification:** pull brew `3039f2cb` via MCP; transcribe the FULL pour + valve structure (per-phase dial states) into this doc. The row-pull is mandatory (T2 friction 1 — memory carries typos).
3. **Equipment physical check:** SWORKS Bottomless + xBloom paper stock + EG-1 + Stagg EKG Pro on-site. Confirm the SWORKS dial vocabulary against [sworks.md](docs/skills/brewing-equipment-expert/cluster/sworks.md) dial states if any ambiguity.
4. **VST LAB III:** distilled blank (standing office equipment), zero at sitting start, **record the blank NUMBER** every sitting. Sample convention unchanged (syringe filter / first drops to waste / cooled / single read).
5. **Water:** plain PA tap confirmed at the kettle; whole-track lock; temptations get parked in the notes, not brewed.
6. **Rung-0 control re-brew (vial 1):** exactly per the archived row — 1:16.7 / 6.1 / 95°C / Dial 7→7→5. Calibration shot + fresh control reference + control TDS baseline. Fully scored; first sip while hot.
7. **Grind purge** if the grinder was left on another setting (all this track's cups run 6.1).

## Design — valve schedules at constant grind (4 vials exactly, no buffer)

All concentrated cups: **1:10 · 15 g / 150 g · EG-1 6.1 · 95°C · plain tap.** The only variables are valve schedule and pour placement.

| Cup | What | Valve schedule | Notes |
|---|---|---|---|
| 0 | Control re-brew, 1:16.7 | Archived Dial 7→7→5 | Step 0 item 6 |
| V-A | 1:10, restriction-led | **Bloom 45 g at Dial 0 (closed), hold 40–45 s → crack to Dial 5 (Restricted) → mains restrained-gentle to ~100 g ~0:45 and early final to 150 g ~1:10–1:15, held at Dial 5 → open to Dial 6–7 late (operator call at the bed, target total time in the control's 2:45–3:15 zone or slightly past)** | The purest "valve supplies the contact" opening move: closed-bloom immersion start + restricted mains ≈ the contact a −0.4 grind step bought in T1/T2. Inverts the control's fast/fast/slow to slow/slow/open — the known concentration-shaped inversion in the SWORKS corpus. |
| V-B | 1:10, adaptive | **Designed at the bench from V-A's read** (pre-planned decision point per RP8-N8): if V-A under-extracts → longer closed-bloom hold or full Dial-5 ride with later open; if V-A over-drives the back → earlier/wider late open ("hold the front, flush the back" literally); if V-A nails it → V-B probes the nearest boundary (operator's call which direction) | One structured iteration, operator-led, logged with explicit rationale before brewing. |
| R | Repeat of the winning schedule (LATER DAY) | Per winner | **Protected — not skippable, not same-day-able.** H-repro gate. |

**Scoring context lines (memory-based, tagged):** each 1:10 cup gets a vs-control call AND a "vs the grind-driven concentrates (T1/T2 character)" impression — the latter is explicitly cross-track memory, tag it as such.

**Stop rule:** if V-A produces something undrinkable-broken (not merely flawed), V-B becomes a conservative retreat (shorter restriction) rather than a probe; the repeat vial stays protected no matter what.

**Cadence:** serial, ≤3/office day, unblinded [unblinded-serial tags on all ordering claims]; actual brew date recorded per cup; first sip before anything else on every cup.

## Scoring — per-cup record (rubric re-presented in EVERY cup's tool call)

1. **Build:** ratio / water g / grind 6.1 confirm / 95°C confirm / valve schedule AS EXECUTED (per-phase dials + rough transition timing) / pour count + rough final-pour time / drawdown end / actual date.
2. **TDS** (single read) + ×control + ~EY (mechanism-read only).
3. **Staged sensory** hot / warm / cool (by feel): aroma / attack / mid-palate / body+texture / finish. **Tannin/texture line is first-class every stage** (H-AI4′): dark-tea thread present? drying? and does the warm-window bitter tail clear cool like the control's does?
4. **Flags:** under-extraction (thin/sour front) · over-driven back · split-balance · clarity-loss · any NEW failure shape (RP8-N6).
5. **Vs-control + vs-grind-driven-concentrate calls** [unblinded-serial; cross-track memory tagged], operator verbatim.
6. **Peak window** + cooling effect (H-stage).
7. Friction / lessons / audit items inline; tag any missed stage read at capture time (RP8-N7).

## Exit conditions (track close)

1. Cups 0, V-A, V-B, R executed (or stop-rule path documented).
2. Winner named with full valve schedule + TDS + staged profile; **repeat verdict explicit** (reproduced / not, ±0.05% + profile with RP8-N7 tag check).
3. H-valve / H-AI4′ / H-repro / H-stage / H5 each resolved with evidence pointers. H-AI4′ gets a plain-language verdict: grind-driven, concentration-intrinsic, or unresolved.
4. **Style-mechanism statement for the project:** with grind-driven (T1/T2) and valve-driven (T3) both mapped, the brief states which mechanism (or hybrid) is the style's best current form — this feeds the T4 decision (Chombi gravity track vs low-pressure AeroPress branch opening) and the eventual grilling item 56 drain.
5. Handoff brief per template, incl. track-4 guidance + any RP8-N candidates.
6. This doc committed + pushed to the session branch; branch + SHA in the brief header.

## What this track does NOT do

No push_brew · no vocabulary locking (grilling item 56's) · no water variables (plain tap locked; temptations parked) · no grind or temp moves on 1:10 cups (that constancy IS the experiment) · no low-pressure/AeroPress work (T4+ decision) · no substrate edits of any kind.

## Known confounders & limitations

- Serial unblinded tasting; single operator; stages by feel (pre-declared trims).
- V-A/V-B change valve schedule AND (vs T1/T2) brewer geometry — cross-track mechanism comparisons are directional, tagged cross-track memory, not same-bench data.
- Two valve schedules is a scout, not a map — a full valve-schedule ladder is future-track territory if this one hits.
- 4-vial budget: one adaptive iteration only; the repeat is protected over any second probe.

## Notes / friction / lessons / audit items (Assistant fills inline)

*(empty at scoping)*

---

## SESSION RECORD

*(Assistant appends per-cup records + handoff brief here at execution)*
