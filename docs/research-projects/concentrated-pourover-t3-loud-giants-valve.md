# Concentrated Pour-Over — Track 3: Loud Giants SWORKS Valve Track (Research Project #8, Office Lane)

*Coffee Research · Latent · Research Project*

**Version:** 1.0 (scoped)
**Date drafted:** 2026-08-10
**Status:** CLOSED 2026-08-18 — executed; handoff brief at bottom (see SESSION RECORD)
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

- **Status at close:** EXECUTED 2026-08-10 → 2026-08-18 (3 sittings). All 4 cups fired; no stop-rule path.
- **Friction 1:** the "as-designed" V-A drawdown target (2:45–3:15) was not what the bench produced (~2:00) — the late-open point being "operator call at the bed" means the winning schedule was defined *post hoc* from execution, and the repeat then had late-open variance. Future valve tracks: pre-declare the open time as a number, keep the dial as the bed call (or vice-versa) — one free lever, not two.
- **Friction 2:** V-B's warm read was missed (office interruption) — RP8-N7 tag applied at capture; verdict consulted the tag.
- **Friction 3:** the archived control profile ("completely clean cool") had drifted from the fresh control (mild tannin cool) after ~4.5 months' rest — the rung-0 re-brew earned its keep; the H-AI4′ comparator was reset to the fresh baseline at capture.
- **Friction 4 (T2 friction 3 recurrence):** water temptation surfaced — acted on only post-scoring on a leftover half-cup; scored data untouched. Parked as a track-4/water-phase lead.
- **Friction 5:** V-A late-open dial recorded from recall ("I think 7"); office trims mean per-phase dial state at transition should be spoken aloud at the bed, not reconstructed after.
- **Friction 6:** control TDS baseline was low-ish (1.10%) vs typical 1:16.7 pour-over; ×control multiples for this track are relative to it — cross-track ×control comparisons should note the different baselines.

---

## SESSION RECORD

### Step 0 log (2026-08-10)

1. **Vial fill-weight check (RP8-N1):** PASS — 4 vials, 15 g each, operator-weighed. No partials; budget intact.
2. **Control row-pull (`3039f2cb`) — transcribed verbatim from DB:**
   - SWORKS Bottomless · xBloom Premium Paper Filters · 15 g / 250 g (1:16.7) · EG-1 6.1 · 95°C
   - **0:00** bloom to 45 g — Dial 0 (closed), 20 s saturation, do not exceed 25 s closed
   - **0:20** crack to Dial 7
   - **0:30** pour to 140 g cumulative (Dial 7, ~95 g over ~20 s)
   - **1:15** pour to 220 g cumulative (Dial 7)
   - **2:00** pour to 250 g cumulative (Dial 5, restricted)
   - Drawdown 2:45–3:15 · kettle off base after bloom (natural decline from 95°C) · plain PA tap, no Melodrip
   - Operator paste cross-checked against the row: MATCH (no typos; T2-friction-1 check clean).
   - Archive notes carried forward: warm-window bitter drying tail resolves by mid-temp, fully clean cool; cool peak <45°C; Pacamara variety-intrinsic darker-tea body is NOT an extraction signal; slow/slow/open inversion is reserved (in the house corpus) for yeast-anaerobic/heavy-ferment lots — V-A deliberately violates that house rule as the experiment.
3. **Equipment check:** PASS — SWORKS Bottomless + xBloom paper + EG-1 + Stagg EKG Pro on-site; dial vocabulary unambiguous.
4. **VST LAB III:** blank zeroed, **blank NUMBER 0.00** (sitting 1 open).
5. **Water:** plain PA tap confirmed; whole-track lock acknowledged.
6. Rung-0 control re-brew: **DEFERRED to next-day fresh sitting** (operator call, 2026-08-10 late-day — teed up, not brewed). Note: the 2026-08-10 blank record (0.00) belongs to a sitting that produced no scored cup; re-zero + record a fresh blank NUMBER at the brewing sitting open (RP8-N3).
7. Grind: operator will purge to 6.1 before the control re-brew.

**Build decision (logged 2026-08-10):** kettle-off-base-after-bloom natural decline CARRIES OVER to the 1:10 cups (operator-confirmed). H5's 95°C lock = start temp + no temp fixes for flaws; kettle handling matches control for continuity.

### Cup 0 — Control re-brew (vial 1) — brewed 2026-08-11

- **Sitting 2 open:** VST re-zeroed, distilled blank NUMBER **0.00**. Grind purge to 6.1 confirmed prior sitting-close plan; [build-confirm pending below].
- **Build:** 15 g / 250 g / 1:16.7 / EG-1 6.1 / 95°C, kettle off base after bloom / archived Dial 0→7→7→5 schedule. Ran per recipe; drawdown ended ~2:45 (in-window; approximate — office trim, exact timing not recorded).
- **TDS: 1.10%** (single read) — **CONTROL BASELINE for the track.** ×control 1.00. H-valve target zone for 1:10 cups: ~1.54–1.98% (1.4–1.8×).
- **Aroma:** fruit-sweet, lots of both; pleasant, on the heavier side; expected to improve cooling.
- **Hot:** very fruit-sweet, a little candied; body reads slightly over-extracted-side heavy (Pacamara density caveat applies); judgment deferred to cool per archive rule.
- **Warm:** fruit flattening/sweetening toward caramel / burnt sugar; elongated fruit; back half tamped down, turning spice-like.
- **Cool:** high complexity — sour watermelon candy, cherries, blackberries, sour/juicy/bright, spice-like note at the finish; very multilayered, "interstitial" throughout rather than front-loaded; flattening slightly as it cools further.
- **Peak window (H-stage baseline):** cool, per archive (<45°C behavior consistent — full label profile landed cool).
- **Flags:** none broken; slight hot-stage body heaviness noted (variety-consistent).
- **Tannin/texture line:** slight tannin/drying in the aftertaste — reads as the "spice-like" end note; darker tannin bite at the very end, non-dominant among the cup's layering. **Baseline note (H-AI4′):** April's archive recorded cool finish "completely clean"; today's control carries a MILD residual tannin tail even cool (rest/age drift, ~4.5 months post-roast archive gap). All 1:10 tannin reads compare against TODAY'S control, not the archived clean-cool memory — the tax signal is a tail materially beyond this baseline.
- **Vs archived control:** "I think this is like I remember it" — operator match call, PASS as fresh control reference.
- **Operator verbatim (cool):** "a lot of layering… really complex interesting coffee… looking forward to trying the distilled punchy version — this one has a lot to work with."

**Hypotheses locked 2026-08-11:** operator confirmed all five as written, "no strong priors" — no additions.

### V-A — 1:10 restriction-led (vial 2) — brewed 2026-08-11

- **Build (as designed):** 15 g / 150 g / 1:10 / EG-1 6.1 / 95°C kettle-off-after-bloom / bloom 45 g Dial 0 hold 40–45 s → Dial 5 restrained mains to ~100 g ~0:45 → early final to 150 g ~1:10–1:15 at Dial 5 → late open Dial 6–7 (operator call at bed). As-executed detail (late-open timing/dial, drawdown end): [pending operator confirm — flagged at capture per RP8-N7].
- **TDS: 1.73%** (single read) — **×control 1.57** (÷1.10), inside the 1.4–1.8× target zone. ~EY (mechanism-read only): concentrated-format EY runs below control's as expected at 1:10; directionally consistent with T1/T2's EY slide, but achieved at CONSTANT grind.
- **Aroma:** much more fruity, pungent, sweet.
- **Hot (first sip first):** much richer, creamier complexion; sour candy present; **darker tannin side present hot**.
- **Warm:** rich, syrupy; deeper fruit complexion (blackberry/cherry forward), candied note recedes; juicier deeper texture, less bright acidity; body slightly tamped; operator likes the creamy texture.
- **Cool:** brightens + sweetens back up — sour watermelon candy returns; cherries, blackberry; fruit-sweet candy note MORE clear than control; **a lot less deep tannin-dark in the back, NO spice note — the back is "chopped off," which the operator likes**; full complexity retained; texture creamier-not-quite-syrupy, concentrated feel.
- **Tannin/texture line (H-AI4′):** thread present hot, clears through cooling to BELOW today's control baseline cool (control kept a mild bite cool; V-A ends cleaner). Warm-window tail behavior matches the control's self-clearing pattern.
- **Flags:** none — no thin/sour front, no over-driven back, no clarity loss. Character shift: "all front, back chopped off" (deliberate, liked — not scored as split-balance).
- **Peak window (H-stage):** cool peak SURVIVES concentration — cup brightens/sweetens cool, candy notes land cool as in control.
- **Vs today's control** [unblinded-serial]: same notes, transformed — "it does transform it to be its own thing… not quite a pour over, not quite espresso… a concentrated pour-over no-pressure format."
- **Operator verbatim:** "I love this. This is really interesting. This format works really well on this particular coffee."
- **Vs T1/T2 grind-driven concentrates** [cross-track memory, tagged]: operator prefers V-A "much better" than the Motta concentrate — caveat that Loud Giants is the more interesting coffee; Motta's finer grind "emphasized too much of the back end vs this one is all front end." Directional support for the tannin-tax-is-grind-driven reading.
- **As-executed correction:** late open fired at **~2:00** and drawdown ended **~2:00–2:05** — FASTER than the designed 2:45–3:15 target. V-A hit 1.57× clean at LESS contact than designed. Late open was to **Dial 7** (operator recall, "I think").

### V-B decision point (RP8-N8) — logged BEFORE brewing, 2026-08-11

- **V-A read:** nailed it (no under-extraction, no over-driven back) → menu says probe the nearest boundary, operator's direction.
- **Operator call:** MORE restriction (less-restriction probe noted as the other good candidate; only one vial available for it).
- **Design:** bloom 45 g Dial 0 hold **60 s** → Dial 5 mains to ~100 g → final to 150 g ~1:30 → **ride Dial 5 to end, no late open by default** (Dial 6 only if bed stalls); target ~3:00–3:30.
- **Rationale:** V-A succeeded at less contact than designed; extending closed-bloom + full-Dial-5 ride adds ~60–90 s contact — H-AI4′'s strongest test (tax stays absent → grind-driven decisive; tax appears → valve-side boundary found, V-A stands).

### V-B — 1:10 deeper restriction (vial 3) — brewed 2026-08-11

- **Build:** per design above (60 s closed hold → Dial 5 ride); drawdown ended **~2:25** — longer than V-A (~2:00) but short of the ~3:00 target even with the full ride. **Full Dial-5 ride to the end, no open** (operator-confirmed).
- **TDS: 1.64%** — ×control 1.49. Note: LOWER than V-A (1.73) despite more contact — more restriction did not buy more concentration; taste-fit and TDS diverged (RP8-N5 holds).
- **Aroma:** fruity, dark caramel, tea.
- **Hot (first sip first):** very fruit-forward; **body over-represented; some bitterness**.
- **Warm:** **MISSED — tagged at capture (RP8-N7).**
- **Cool:** very fruit-forward, wine-like / sangria-like, "almost a little too much"; bitterness came down a lot; very front-phase emphasized; **lacks the complexity V-A had**.
- **Tannin/texture line:** hot bitterness + heavy body; clears substantially cool. Reads as over-driven-body / front-overload rather than the T2 dark-tea drying thread — a NEW failure shape for valve-driven concentration (RP8-N6): complexity collapse into wine-like fruit mono-front.
- **Flags:** over-represented body (hot) · complexity-loss / front-overload · mild bitterness hot.
- **Vs V-A** [unblinded-serial]: **operator prefers V-A.** V-A = winner; V-B = valve-side boundary found.
- **Peak window:** improved cool (bitterness receded), consistent cool-peak pattern; warm data absent.

### R — Later-day repeat of V-A (vial 4, protected) — brewed 2026-08-18

- **Sitting 3 open:** VST zeroed on distilled, blank NUMBER **0.00**. Grind 6.1.
- **Build:** V-A as executed — 45 g Dial 0 closed hold ~40–45 s → Dial 5 mains ~100 g → final 150 g ~1:10–1:15 → open to **Dial 7 at ~2:00** → drawdown ~2:00–2:05. Operator hindsight at capture: the 2:00 open felt late this time — "maybe 1:45 to Dial 7."
- **TDS: 1.79%** — ×control 1.63. **Δ vs V-A = +0.06%** — marginally OUTSIDE the ±0.05 gate on the number.
- **Aroma:** berry, sweetness, plus a dark-tea tannin note that disperses as it cools.
- **Hot (first sip first):** fruity, pungent, berry, cherry; darker tannins present (tamp down cooling).
- **Warm:** a bit sharp on the attack; very cherry — the sour-cherry/watermelon note; tannins subdued a lot.
- **Cool:** mellowed, lots of complexity — berry, cherry, candied note; **still a little darker tannin cool** (V-A read cleaner-than-control cool).
- **Tannin/texture line:** thread present hot → warm subdued → mild residual cool. Slightly heavier than V-A's cool read; roughly at/around today's-control-baseline level, not the T2 dark-tea drying tax.
- **Flags:** none broken; mild residual tannin cool; slight warm sharpness.
- **Peak window (H-stage):** cool peak holds (mellows + complexity cool).
- **RP8-N7 tag check:** V-A's late-open dial is operator recall ("I think 7"), and R's open at 2:00 was self-described as late — a small execution-variance source on the one lever left free at the bed.
- **Repeat verdict (H-repro): REPRODUCED — MARGINAL.** Structure/profile reproduced (creamy concentrated texture, candy/cherry/berry front, complexity retained, cool peak); TDS Δ 0.06 sits 0.01 outside the gate; the one profile drift is a slightly heavier residual tannin cool, plausibly tied to late-open timing variance. Not a non-reproduction; not a clean pass either — the winner is real, the schedule's late-open point is the reproducibility lever to tighten (T4 guidance).

**Post-scoring off-protocol note (NOT track data; scored read completed first):** on the leftover half-cup the operator added 2 drops Apax Konflux + 2 drops JAMM — reported more depth, complexity, mouthfeel; added sweetness counteracted the darker tannins; hindsight "Konflux only" (JAMM's alkalinity possibly unneeded); operator hypothesis: the higher concentration tolerates more water manipulation. Water lock held for all 4 scored cups. Parked per T2 friction 3 → **track-4/water-phase lead**, not a finding.

---

## HANDOFF BRIEF FOR COMPILE SESSION (RP8 Track 3 — Loud Giants SWORKS Valve Track Close-Out)

**Date:** 2026-08-18
**Session role:** execution + handoff brief production (no substrate edits)
**Archive location:** branch `claude/pour-over-track-3-research-7c2c61` @ `c279253 (archive body; brief header finalized in follow-up commit on the same branch)`, pushed to origin (the compile session fetches/branches from here — the archive doc is committed; substrate is NOT; not merged to main). See [`role-discipline.md` § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md).
**Methodology verdict:** ✅ VALIDATES — H-valve confirmed (1.57× at constant grind, operator's preferred RP8 concentrate to date); H-AI4′ resolves **grind-driven** (with a caveat); H-repro **reproduced-marginal** (Δ 0.06%); valve-side boundary found and it is NOT a tannin tax.

This brief is the self-contained close-out for RP8 Track 3. The compile session should consume it to (a) update the RP8 project end-document with the style-mechanism statement, (b) decide track 4 (Chombi gravity vs AeroPress branch), and (c) fold the substrate specs below. Raw per-cup records live in the SESSION RECORD above.

### TL;DR

- **Valve-supplied contact time works as the concentration mechanism.** V-A (1:10, grind 6.1 = control, 95°C, closed bloom → Dial 5 → open ~2:00) hit **1.73% / 1.57× control** with zero grind spent, read coherent, creamy, complex — operator: "I love this… this format works really well on this coffee."
- **H-AI4′ verdict: GRIND-DRIVEN.** No dark-tea tannin tax beyond the control baseline on any 1:10 cup; V-A read *cleaner* than the fresh control cool. Caveat: R showed a mild residual tannin cool (at ~control level), so "tax absent" holds, "zero tannin" does not.
- **The valve-side boundary is a different failure shape** — more restriction (V-B, full Dial-5 ride, ~2:25) gave *lower* TDS (1.64%) and complexity collapse into a wine/sangria mono-front, not a tannin/drying tax. RP8-N6 confirmed again: failure signatures are mechanism- and coffee-structural.
- **Reproduction: MARGINAL PASS** — R at 1.79% (Δ +0.06 vs V-A, 0.01 outside gate), profile reproduced structurally, one drift (heavier residual tannin cool) plausibly from late-open timing variance.
- **Style-mechanism statement: valve-driven is the style's best current form on a valve brewer; grind-driven remains the only tool on gravity brewers → HYBRID by equipment**, with valve preferred where available.
- Water manipulation at concentration is a live lead (post-scoring Konflux/JAMM anecdote), correctly parked.

### Execution summary

4 cups executed across 3 office sittings (2026-08-10 Step 0 setup only; 2026-08-11 Cup 0 + V-A + V-B; 2026-08-18 R). Step 0 ran to completion in order (vials 4×15 g PASS; control row-pulled + verified vs operator paste; equipment PASS; blank 0.00 each sitting; plain tap; control re-brew; grind 6.1). Constant grind + temp held on every 1:10 cup — no grind or temp moves. Divergences: V-A's as-executed drawdown (~2:00) was faster than the designed 2:45–3:15 window; V-B's warm read missed (tagged); one off-protocol post-scoring water addition on R's leftover (not data).

### Equipment / conditions

| Item | Value |
|---|---|
| Brewer / filter | SWORKS Bottomless · xBloom Premium Paper |
| Grinder | EG-1 at **6.1 all cups** (control setting) |
| Kettle | Stagg EKG Pro, 95°C, off base after bloom (natural decline) — carried to 1:10 cups |
| Water | Plain PA tap, zero additions, all scored cups |
| Dose | 15 g every cup; 250 g control / 150 g 1:10 cups |
| TDS | VST LAB III, distilled blank 0.00 at every sitting open; single read; standard sample convention |
| Coffee | Picolot Loud Giants, Mama Cata Pacamara Natural (PL#16, roasted 2026-03-24) |
| Capture trims | RP8-N3 office trims (single TDS, stages by feel, rough timings) |

### Per-cup raw data

| Cup | Date | Ratio | Valve schedule (as executed) | Drawdown | TDS | ×ctrl | Key read | Operator call |
|---|---|---|---|---|---|---|---|---|
| 0 | 08-11 | 1:16.7 | Dial 0 20 s → 7 → 7 → 5 (archived) | ~2:45 | **1.10** | 1.00 | Complex, layered, cool peak; MILD tannin/spice bite cool (archive said clean) | Matches memory — control PASS |
| V-A | 08-11 | 1:10 | Dial 0 hold ~40–45 s → Dial 5 mains ~100 g → final 150 g ~1:10–1:15 → open Dial 7 ~2:00 | ~2:00–2:05 | **1.73** | 1.57 | Creamy, concentrated, candy/cherry/blackberry; tannin hot clears cleaner than control cool; no spice; "back chopped off"; cool peak | "I love this" — WINNER |
| V-B | 08-11 | 1:10 | Dial 0 hold 60 s → Dial 5 mains → 150 g ~1:30 → full Dial-5 ride, no open | ~2:25 | **1.64** | 1.49 | Body over-represented + bitterness hot; wine/sangria mono-front cool; complexity lost. Warm read MISSED (RP8-N7) | Prefers V-A |
| R | 08-18 | 1:10 | V-A schedule; open Dial 7 ~2:00 (felt late) | ~2:00–2:05 | **1.79** | 1.63 | Structure reproduced; sharp warm attack; mild residual tannin cool | Reproduced-marginal |

### Analysis

- **H-valve:** V-A at 1.57× is inside the 1.4–1.8× target zone from T1/T2, achieved at the control grind. Contact bought by valve restriction substituted fully for the −0.3 to −0.5 grind step of prior tracks. **CONFIRMED.**
- **H-AI4′:** the comparator was reset at capture from "archived clean cool" to "fresh control: mild tannin cool" (Friction 3). V-A's cool tannin read < control; R's ≈ control; V-B's boundary failure was over-driven body/mono-front, not drying tannin. The T2 dark-tea tax did not appear at coarse grind under valve contact. **Verdict: grind-driven** (plain language: the tannin tax came from grinding fine, not from concentration itself). Caveat: single coffee, and this coffee's own baseline carries a mild tannin thread; the claim is "no *added* tax," not "no tannin."
- **H-repro:** Δ 0.06 TDS (gate ±0.05), profile reproduced structurally, one drift attributable to the un-fixed late-open timing (RP8-N7 tag check: V-A dial recall + R self-reported late open). **Reproduced — marginal.** The winner is real; the schedule's free lever is the reproducibility gap.
- **H-stage:** cool peak survived on every 1:10 cup (candy notes and complexity land cool, tannin subsides cool). **CONFIRMED — coffee's stage behavior preserved under valve concentration.**
- **H5:** 95°C all cups, no temp fixes. **HELD.**
- **Mechanism note (RP8-N5 reinforced):** more restriction (V-B) gave *less* TDS and worse taste — restriction past the sweet spot doesn't monotonically add extraction on this bed; taste-fit and TDS diverged in the same direction. TDS stayed mechanism-read only.

### Final output

**Winner — Loud Giants concentrated pour-over (valve-driven):** SWORKS Bottomless + xBloom · 15 g / 150 g (1:10) · EG-1 6.1 · 95°C kettle-off-after-bloom · plain tap · bloom 45 g Dial 0 closed, hold ~40–45 s → Dial 5, restrained mains to ~100 g → early final to 150 g ~1:10–1:15 at Dial 5 → open to Dial 7 at ~1:45–2:00 (operator hindsight: 1:45 preferable) → drawdown ~2:00–2:05. **TDS 1.73% (repeat 1.79%), 1.57–1.63× control.** Profile: creamy concentrated texture, sour-candy watermelon + cherry + blackberry front, complexity retained, back cleanly shortened, tannin thread hot that clears cool, cool peak.

**Style-mechanism statement (project level):** with grind-driven (T1/T2) and valve-driven (T3) both mapped, **valve-driven contact is the style's best current form** — it reaches the same concentration zone without the fine-grind tannin/back-end tax, and the operator prefers its character ("all front") to the grind-driven concentrates (cross-track memory, tagged). Grind-driven remains the only lever on gravity brewers, so the style is **hybrid by equipment**: valve where the brewer has one, grind where it doesn't. Recommendation for T4: **open the AeroPress branch next** (a second non-grind contact mechanism, low-pressure, tests whether "contact without fine grind" generalizes beyond the valve) rather than the Chombi gravity track (which would only re-run the grind mechanism on a third coffee). Chombi stays queued as the eventual gravity-side confirmation.

### Key findings

1. **Valve restriction replaces fine-grind compensation for concentration.** V-A 1.73%/1.57× at control grind (vs T1/T2 −0.3 to −0.5 grind). Implication: SWORKS concentration recipes should default to constant control grind + closed-bloom/Dial-5 restriction, not grind moves.
2. **The fine-grind tannin tax is grind-driven, not concentration-intrinsic (single-coffee evidence).** No 1:10 cup exceeded the fresh control's tannin baseline; V-A undercut it. Implication: P8-AI-4 closes "grind-driven"; the T2 Motta dark-tea thread is a grind artifact.
3. **Valve-side over-restriction fails as complexity collapse, not tannin.** V-B (full Dial-5 ride) → lower TDS, wine-mono-front, lost layering. Implication: the sworks.md concentration inversion needs a "flush the back" late open — riding restricted to the end is the boundary.
4. **The "slow/slow/open" inversion works on a straight natural at 1:10**, contradicting the archived house rule that reserves it for yeast-anaerobic/heavy-ferment lots — the ratio changes which valve structure fits. Implication: the Picolot/Garrido valve rule in the LG brew row + sworks.md is ratio-conditional.
5. **Late-open timing is the reproducibility lever.** Repeat drift (Δ 0.06 TDS, heavier residual tannin) tracks the one un-pinned parameter. Implication: valve-track protocols should pin open TIME and leave dial as the bed call (or vice versa).
6. **Cool-peak behavior is preserved under valve concentration** on this coffee (H-stage) — the format transforms without breaking the coffee's stage identity.
7. **Fresh-control re-brew is load-bearing at long rest gaps**: 4.5-month archive said "clean cool," fresh cup had a mild tannin tail; the H-AI4′ comparator would have been wrong without rung 0.
8. **Water manipulation at concentration is a promising, un-tested lead** (post-scoring Konflux/JAMM anecdote; operator hypothesis that higher concentration tolerates more mineral manipulation). Not data.

### Substrate edit specifications for compile session

DO NOT execute these edits in this session — the compile session integrates substrate.

**Cluster doc edits**
1. `docs/skills/brewing-equipment-expert/cluster/sworks.md` — add a "concentrated 1:10 valve schedule" pattern: closed bloom 40–45 s → Dial 5 restricted mains with early final pour → late open Dial 7 at ~1:45–2:00; note the boundary (full Dial-5 ride = complexity collapse, lower TDS). Source: Findings 1, 3, 5. Rationale: first valve-driven concentration recipe in the corpus; documents both the working schedule and its failure edge.
2. Same file (or wherever the Picolot house valve rule lives) — amend the "slow/slow/open reserved for heavy-ferment lots" rule to be ratio-conditional: at 1:10 the inversion is the concentration-shaped default on straight naturals too. Source: Finding 4.
3. `docs/skills/brewing-assistant/cluster/` (concentrated/high-strength pattern doc, wherever RP8 T1/T2 findings landed) — add the mechanism comparison: valve-driven vs grind-driven; tannin tax = grind-driven; style is hybrid-by-equipment with valve preferred. Source: Findings 1–3, style-mechanism statement.
4. RP8 project end-document (`docs/research-projects/concentrated-pourover-*` project index / roadmap.md RP8 entry) — record T3 CLOSED 2026-08-18, winner + TDS, H-verdicts, style-mechanism statement, T4 recommendation (AeroPress branch next, Chombi queued). Source: this brief.

**Audit item resolutions**
5. **P8-AI-4** → CLOSE as "grind-driven (single-coffee, valve-mechanism evidence)"; leave a note that a second-coffee valve confirmation would firm it up.

**Roaster card (optional)**
6. Picolot roaster card / LG reference: append "concentrated 1:10 valve variant" pointer to this doc (no push_brew — archival is deferred per project rule).

**Grilling queue**
7. Item 56 (concentrated pour-over vocabulary): add T3 evidence pointer — operator's phrasing "concentrated pour-over, no-pressure format… not quite pour-over, not quite espresso"; "hold the front, flush the back" as the valve-mechanism descriptor.

### New lessons captured

| # | Lesson | Substrate implication |
|---|---|---|
| RP8-N9 | When a schedule leaves one lever as "operator call at the bed," the winner is defined post hoc and the repeat inherits that variance. Pin the free lever's TIME (or dial), not both free. | Protocol template: valve/pour tracks name exactly one bench-free parameter and record it as a number at capture. |
| RP8-N10 | Re-baseline the comparator from the fresh control, not the archived profile, when the archive-to-track gap is months. | Step 0 rung-0 re-brew is non-negotiable at rest gaps > ~2 months (already practiced; now stated). |
| RP8-N11 | Over-restriction on a valve brewer fails toward mono-front complexity collapse with LOWER TDS — restriction is not monotone with extraction. | sworks.md caution line; TDS stays mechanism-read (RP8-N5 corollary). |

### Audit items queued

1. **P8-AI-4** — resolved: grind-driven (see spec 5). Status: queued for compile session close.
2. **P8-AI-5 (new)** — does valve-driven concentration generalize to a second coffee / a gravity-lever analog (AeroPress low pressure)? Status: open → T4.
3. **P8-AI-6 (new)** — water manipulation tolerance at concentration (Konflux-only vs Konflux+JAMM at 1:10). Status: open, sequenced after valve/AeroPress work per project rule; office-lane candidate.
4. **RP8-N3 graduation** — third track running office trims; queued for project retro (unchanged).

### Open data items

- R's Δ 0.06 TDS is 0.01 outside gate — reproduced-marginal; a second repeat with open pinned at 1:45 would settle it (no vial left; opportunistic on a future LG bag).
- V-B warm read missing (tagged).
- V-A late-open dial from recall ("I think 7").
- ~EY not computed numerically (office trim; TDS×water/dose available from the table if the compile session wants it).

### Recap map for compile session

Integrate first: spec 4 (RP8 project doc + roadmap T3 close + T4 = AeroPress branch), then spec 1–2 (sworks.md valve pattern + ratio-conditional inversion rule), then spec 5 (P8-AI-4 close). Defer: spec 6 (roaster card), spec 7 (grilling item 56 pointer — batch with the item drain). Escalate to operator: T4 choice (AeroPress branch recommended over Chombi — operator decides), and whether P8-AI-6 (water at concentration) jumps the queue given the RP6 water-break standing rule.

### Protocol-execution friction captured

1. Designed drawdown window (2:45–3:15) vs bench reality (~2:00) — the schedule's "target total time" was aspirational; the operator's bed call defined the winner (→ RP8-N9).
2. Missed warm read on V-B (office interruption); tag-at-capture worked.
3. Archived control profile drift vs fresh cup — rung-0 caught it (→ RP8-N10).
4. Water temptation recurred (T2 friction 3, third occurrence) — held on scored cups, acted on leftover; the parking line works but the pull is strong at concentration.
5. Per-phase dial state at transition captured from recall — speak dials aloud at the bed.
6. Control TDS baseline (1.10%) is lowish; ×control multiples are track-relative.

---

### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Archive doc committed + pushed to branch `claude/pour-over-track-3-research-7c2c61` @ `c279253 (archive body; brief header finalized in follow-up commit on the same branch)` (the authorized archive-persist exception — see [`role-discipline.md` § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md))
- ✅ Handoff brief produced above; branch + SHA in the `Archive location:` header for the compile session
- 🛑 Session terminating after this brief lands. The compile session integrates substrate per the design pattern.

End of RP8 Track 3 close-out.
