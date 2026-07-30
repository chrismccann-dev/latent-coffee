# Concentrated Pour-Over — Track 1: Full Ratio Ladder (Research Project #8, Office Lane)

*Coffee Research · Latent · Research Project*

**Version:** 1.1 (scoped + coffee locked)
**Date drafted:** 2026-07-29 · coffee locked 2026-07-30
**Status:** SCOPED — operator signed off on all methodology calls (2026-07-30) + track-1 coffee locked: **Moonwake El Oasis 60hr Washed Gesha**
**Location:** Office (Downtown Palo Alto) — first office-lane research track
**Coordinator session:** RP8 Coordinator (this project's persistent Coordinator)

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE — READ THIS FIRST

You (the session executing this protocol) are the **Research Assistant** for this track. Your job is **execution + handoff brief production.** Your job is **NOT substrate integration.**

**DO NOT:**
- Edit `lib/*-registry.ts` files
- Edit `docs/skills/*/cluster/*.md` files
- Edit ADR files
- `git commit` / `git push` SUBSTRATE edits, merge to main, or `gh pr create` (the archive-persist commit of THIS doc is the ONE authorized exception)
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)
- Call `push_brew` — brew-row archival is explicitly DEFERRED for this project (see § What this track does NOT do)
- Continue past the handoff brief to "finish the job"

**DO:**
- Read this doc in full BEFORE Step 0
- Walk the operator through Step 0 sub-steps to completion before any scored brew
- Run scored brews one-at-a-time (tool-call-per-brew pacing; serial cadence — see § Design)
- Re-present the scoring rubric inside EVERY scored brew's tool call (RP6 retro rule — operator never scrolls back)
- Capture friction + new lessons + audit items inline in this doc
- Produce a handoff brief per `docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md`
- Commit + push THIS doc to your session branch at termination; report branch + SHA in the brief's `Archive location:` header (an uncommitted archive is not an archive)
- TERMINATE the session after the handoff brief

Full primitive doc: `docs/skills/research-coordinator/cluster/role-discipline.md`

---

## Project Context

**Research Project #8 — Concentrated Pour-Over / High-Strength Filter.** First occupant of the **office lane** (operator-established 2026-07-29): a second concurrent research slot at the office, structurally separate from the home-lane single slot (RP7 rapid chilling holds home § Now, not yet started; no gating either way).

**Why this project gets extra weight (operator verbatim, 2026-07-29):** "if I truly wanna compete in the World Brewers Cup championship, I'm gonna have to have some unique element to my performance ... if I had a very radically different brewing method that I came up with on my own, this could be a real true point of differentiation." This is a **candidate signature-method / routine-differentiation bet**, not variable refinement. Operator (2026-07-30 scoping interview): "I want to validate there is something really here, because if there is, this might be my new brewing style I optimize towards."

**The question:** can a conventional paper-filtered brewer be pushed toward espresso-like concentration and texture by shortening the brew ratio (down to 1:10, boundary-mapping to 1:8) while preserving filter clarity — "high-strength, high-clarity filter coffee," served undiluted (no bypass), best expression warm-to-cool?

**Prior art (WBC corpus):** exactly one routine in this space — Paprik Liu 2026 Round One, the routine that created the "High-Concentration Push" Extraction Push subtype (1:10 / 1.9 TDS / no-bypass hardware / 200 ppm water / two-way agitation). Hardware-and-water driven. Nobody has finaled or won with the style. The operator's build differs on every lever: conventional dripper + paper, grind-and-contact-driven, locked low-key office water, warm-to-cool dessert framing. Near-virgin territory: prior art validates judge-scoreability while leaving the conventional-dripper lane open.

**Project structure (locked at scoping, 2026-07-30):** **track = coffee.** Track 1 (this doc) runs the ladder on Moonwake El Oasis (60hr washed Gesha) and proves the methodology. Tracks 2+ run abbreviated ladders on contrasting-process freezer coffees (generalization) — shortlist from the 2026-07-30 inventory: Picolot Loud Giants (4 vials) · Picolot Chombi Natural Dry (4) · Moonwake Motta (4) · Moonwake Ngoma Station (4); final picks at track-1 close informed by the H2 verdict. (Picolot Blue Butterfly has NO archived control — it needs a normal `/brew` dial-in before it can ever be a ladder candidate; not this project's job.) The low-pressure branch (AeroPress slow-press percolation approximation, 0.05–0.4 bar) is its own future track, **unlocked only after the gravity series shows the optimum is repeatable across 2+ coffees**. Operator owns no AeroPress — purchase is the unlock's first action. Vocabulary/canon placement (a "Concentrated Pour-Over" format tag? a 7th strategy? brew-row archival shape?) belongs to **grilling-queue item 56**, NOT this track.

## The seed experiment (inherited evidence — Picolot Barbie Beans, Laurina; coffee is gone)

- **Archived control** (brew `63aad474`, Clarity-First): Kalita Wave + xBloom paper, 15 g / 250 g (1:16.7), EG-1 6.8, 90°C; pours 45 g bloom / 130 g at 0:40 / 190 g at 1:25 / 250 g at 2:00. Apple pie + caramel, cinnamon → orange-cinnamon finish, peak warm-to-cool. Its `what_i_learned` lever mapping: **temp = roast/spice side, grind = body/sweetness side.**
- **Exp A (1:10, 93°C, EG-1 6.3, final pour 1:25):** ratio worked, texture/concentration up, but cinnamon blew out and the cup went sour + incoherent cool. Read: temperature pushed the temperature-sensitive spice side; extraction still short/uneven.
- **Exp B (winner): 15 g / 150 g, EG-1 6.2, 90°C; 45 g bloom, 100 g at 0:40, final to 150 g at 1:10–1:15** (earlier final pour keeps the bed hot + wet). Apple pie + chocolate + cinnamon hot; brighter apple warm; dense texture + brighter apple + restrained cinnamon cool. Stable progression.
- **Key finding:** at 1:10 the ratio wasn't the flaw — the extraction lever was. Grind-and-contact-driven beat temperature-driven, independently re-proving the archived dial-in's lever mapping.
- **Derived grind coefficient:** control 6.8 @ 1:16.7 → winner 6.2 @ 1:10 = −0.6 over ~6.7 ratio points ≈ **−0.1 EG-1 per ratio point** (the § Design grind rule's empirical anchor; single-coffee, directional).
- **Exp B archival status (operator call, 2026-07-30):** doc-only for now. All trial records live in protocol docs; durable representation (push_brew? second recipe slot per coffee? format vocabulary?) is decided later depending on how the project goes, jointly with grilling item 56.

## Hypotheses (pre-state before scoring, per Lesson #16)

- **H1 (own-optimum):** a concentrated pour-over has its own optimum, not a shrunken normal recipe — at short ratios, grind + slurry/contact management dominate (no late-stage rinse water). *Test: the best rung cup requires the grind step + earlier-final-pour scaling; a ratio-only cut of the control recipe at the same rung reads under-extracted/thin. (One exploratory ratio-only cup at the 1:10 rung is the budgeted mid-run theory test if doses allow.)*
- **H2 (grind coefficient transfers):** the −0.1 EG-1 per ratio point rule, derived on the Barbie Beans Laurina, lands within ±0.1 of the taste-adjusted optimum on the track-1 coffee. *Directional — single prior coffee.*
- **H3 (warm-to-cool payoff):** the concentrated cup's best expression is warm-to-cool; hot reads dense/muted relative to its warm phase. *Test: staged scoring at every rung.*
- **H4 (1:8 boundary):** open question, no prediction — is 1:8 more interesting than 1:10 or past the collapse point? The boundary rung answers it empirically.
- **H5 (temp is not the lever):** the coffee's reference temperature carries unchanged across all rungs; no rung's flaw is fixed by a temp move. *If a rung presents a roast/spice-side flaw (the temp signature per the lever mapping), log it and fix by grind/contact first; a temp deviation is an operator-approved exploratory move, not a rung default.*

## Track-1 coffee (LOCKED 2026-07-30 — operator call from office freezer inventory)

**Selection requirements:** (a) an **archived optimized control brew** in Latent (no control, no candidacy); (b) enough vials for the ladder + repeat; (c) fits the style profile: sweet / aromatic / low-bitterness.

| Field | Value |
|---|---|
| Coffee | **Moonwake — Fernando Bocanegra El Oasis 60hr Washed Gesha** (Tolima, Colombia, 2150 masl; cold-fermentation washed) |
| Archived control brew ID | `ae628408-0786-4611-8766-92cd3c6b6686` |
| Control recipe | Kalita (155) + xBloom paper · 15 g / 240 g (**1:16**) · **EG-1 6.6** · **96°C** · 45 g bloom (wait to 0:45) / pour 1 to 145 g at 0:45–1:15 / pour 2 to 240 g at 1:45–2:15 · drawdown 2:50–3:05 |
| Control profile | Jasmine / whipped peach / honey / muscat · light silky tea body (variety-intrinsic) · **no drying tannin at any temperature** · peak 40–45°C |
| Vials remaining | **5 × 15 g** |

**Why this coffee (selection rationale, 2026-07-30):** best style-fit in the freezer — sweet / aromatic / zero-tannin, control brewed on the exact locked setup, cool-peaking (warm-to-cool payoff native), and it IS the "too thin but aromatically compelling" category from the seed criteria: light tea body that's variety-intrinsic. Concentration giving this coffee density it can't otherwise have is the sharpest possible demo of the style. The two ≥6-vial candidates were rejected for fit: Project One Peach (7 vials) has a confirmed grind floor at 6.3 and an archive history of relocating astringency under extraction pressure (hostile testbed — a failure would be unattributable); Project One Blue Iris (6 vials) has a SWORKS-valve control, not comparable on the locked Kalita.

**5-vial consequence (operator-accepted):** the 1:11 rung is DROPPED (least informative — the seed already proved 1:10 coherent on another coffee) to preserve the later-day repeat. No buffer; the H1 exploratory ratio-only cup is out of budget unless a vial is spared by the stop rule.

**Coffee-specific cautions (from the archive — Assistant surfaces these at Step 0):**
- **Evaluate below 45°C before any verdict.** This lot read "almost under-extracted" at 50–55°C in BOTH control dial-in brews and did not resolve until 45°C. Staged scoring still runs hot/warm/cool, but rung verdicts weight the cool read.
- **Agitation-sensitive delicate washed Gesha** — keep pour energy gentle at every rung; concentration comes from ratio + grind + contact, not turbulence.
- **Known Gesha caution vs H1:** the cultivar corpus says chasing body via grind on Gesha usually hollows the mid-palate — at NORMAL ratios. The ladder tests whether short-ratio concentration is the exception (H1's sharpest form on this cultivar). If a rung reads hollow-mid + tannin, that's the collapse signature here.

## Locked equipment + conditions (office lab)

| Variable | Locked value |
|---|---|
| Brewer | **Kalita Wave 155, manual** (matches seed experiments + most archived office controls; SWORKS held-contact is a deliberate later-track lever with trigger "grind-only fails to hold extraction") |
| Filter | xBloom Premium Paper (only office paper) |
| Grinder | Weber EG-1 (office; calibrated identical to home) |
| Kettle | Fellow Stagg EKG Pro Studio (0.9 L; identical at home + office) |
| Water | **LOCKED office baseline:** PA tap + 1 TONIK + 1 JAMM per 200 mL finished cup; DAK kettle-only. No water variables in this track — the RP6 break stays respected. |
| Dose | 15 g (one vial per brew) |
| Temperature | **96°C** (El Oasis archived reference temp), all rungs (H5) |
| TDS | **VST LAB Coffee III** (operator brings to office for ladder sittings) |
| Serving | Staged tasting hot → warm → cool; no bypass, undiluted |

## Step 0 (run to completion BEFORE any scored rung)

1. **Coffee + control verification:** confirm the track-1 coffee's vial count physically; pull the archived control brew row; transcribe control recipe into the table above. Verify grind/temp/pour structure are complete on the row.
2. **Equipment physical check:** Kalita 155 + xBloom paper stock on-site; kettle temp set to reference; EG-1 setting confirmed against the control's recorded grind.
3. **VST LAB III on-site + zeroed** against distilled/office water blank at sitting start — **every sitting, no exceptions** (calibration-arc primitive 7; instruments drift silently). Record the blank.
4. **Sample-handling convention for TDS:** filtered/cooled sample per VST practice; note whether syringe-filtered; keep the convention identical across all rungs (comparability beats absolute accuracy).
5. **Control re-brew = the calibration shot (1 vial):** brew the archived control recipe once, exactly as archived. Dual purpose: (a) pre-rung-1 calibration shot (surfaces operator/equipment drift before scoring); (b) **fresh control reference** — staged hot/warm/cool notes + TDS recorded, so every rung compares against a same-week lived cup, not a months-old memory. This control cup IS scored on the recording sheet as rung 0.
6. **Grind purge** between setting changes (2–3 g).

## Design — the ladder

**Rungs (tight ladder, operator-locked "big move" framing — 1:13 territory skipped; 1:11 dropped 2026-07-30 to fit the 5-vial budget while preserving the repeat):**

| Rung | Ratio | Water (15 g dose) | Starting grind (rule: 6.6 − 0.1 × (16 − rung ratio)) | Pour scaling |
|---|---|---|---|---|
| 0 | control 1:16 | 240 g | 6.6 (per archive) | per archive |
| 1 | 1:10 | 150 g | **6.0** | Exp B pattern, from control pours |
| 2 | 1:9 | 135 g | **5.9** | Exp B pattern, scaled |
| 3 | 1:8 (boundary map) | 120 g | **5.8** | Exp B pattern, scaled |
| R | repeat of winning rung (later day) | per winner | winner's final adjusted grind | per winner |

**Grind rule (H2):** each rung STARTS at the rule value; micro-adjust ±0.1 from taste is allowed WITHIN a rung (log start + final). This deliberately moves ratio + grind together — we are mapping the style's optimum (H1), not isolating ratio.

**Pour scaling (the Exp B pattern, adapted from the El Oasis control):** bloom 45 g (~3× dose, unchanged from control); mid pour to ~⅔ total (~100 g at 1:10) around 0:40–0:45; **final pour EARLY** (~1:10–1:15 territory vs the control's 1:45) so the bed stays hot + wet through drawdown. Keep the control's gentle concentric low-height pour energy (agitation-sensitive Gesha); log actual pours per rung.

**Temperature:** 96°C, all rungs (H5).

**Cadence (operator-locked):** **serial, one cup at a time, up to ~3 per office day.** These are the operator's actual office cups, not side-by-side flights — no back-to-back triads. Comparison across rungs is memory + notes mediated, anchored by the rung-0 fresh control. **Acknowledged limitation:** cross-rung ordering claims are unblinded and serial → any "rung X beats rung Y" carries an **unblinded-serial tag**, and the track's final optimum claim is **anecdote-until-reproduced** (RP6-ratified) until the repeat brew confirms it.

**Rung order:** 1 → 2 → 3 (monotonic descent — each rung informs the next grind micro-adjust; randomization is deliberately traded away since the operator brews + scores solo and the ladder's point is trajectory, not blind ranking).

**Stop rule:** if a rung collapses (sour-incoherent / dry-astringent past rescue by ±0.1 grind), the boundary is found — remaining lower rungs are optional operator's-call; budget shifts to the repeat.

**Repeat (planned — the 5th vial):** winning rung re-brewed on a LATER DAY at its final adjusted grind. If the stop rule spares a rung vial, it may fund the H1 exploratory ratio-only cup at 1:10 (operator's call) — otherwise that test waits for a later track.

**Budget: 5 vials exactly** — rung 0 control + 3 rungs + repeat. No buffer.

## Scoring — per-rung record (rubric re-presented in EVERY rung's tool call)

Per rung, capture:

1. **Build:** ratio / water g / grind (start → final) / temp / actual pours with timestamps / drawdown end / total time.
2. **TDS** (VST, logged with sample-handling note) + calculated strength vs rung-0 control.
3. **Staged sensory — the load-bearing read (H3):** at **hot**, **warm**, and **cool**, prose across aroma / attack / mid-palate / body+texture / finish. Texture gets explicit language at every stage (dense? syrupy? espresso-adjacent? thin?).
4. **Flags:** sour-collapse (Y/N + stage) · dryness/astringency (Y/N + stage) · clarity-loss/muddiness (Y/N).
5. **Vs-control call (unblinded-serial tag):** is this rung more interesting than rung 0? Than the prior rung? Operator verbatim preserved.
6. **Peak window:** which temp stage was the cup's best expression?
7. Friction / lesson candidates / audit items inline.

## Exit conditions (track close)

1. Ladder run to completion or stop-rule boundary found.
2. Winning rung named, with final grind + pour structure + TDS + staged profile recorded.
3. Repeat executed (or explicitly skipped with reason) — anecdote tag resolved or carried.
4. H1–H5 each resolved / contradicted / left-open with evidence pointers.
5. Handoff brief produced (template), including: track-2 coffee-selection guidance, whether the grind coefficient transferred (H2 verdict feeds the abbreviated-ladder design), low-pressure-branch unlock assessment, and any candidate substrate observations FOR THE COORDINATOR (not applied).
6. This doc committed + pushed to the session branch; branch + SHA in the brief header.

## What this track does NOT do

- **No push_brew.** All records live in this doc. Durable brew-row representation is a post-project decision (operator call 2026-07-30, jointly with grilling item 56).
- **No vocabulary locking.** "Concentrated Pour-Over" is a working title; format/strategy placement is grilling item 56's.
- **No water variables.** Locked office baseline throughout; constrained probes are a possible deliberate later track, not this one.
- **No SWORKS / valve work.** Named later-track lever with trigger "grind-only fails to hold extraction at short ratio."
- **No low-pressure work.** Separate future track; unlock = gravity optimum repeatable across 2+ coffees; first action = buy an AeroPress.
- **No substrate edits of any kind** (registry / cluster / ADR / MCP).

## Known confounders & limitations

- Serial unblinded tasting (see § Design) — ordering claims tagged; optimum claim anecdote-until-reproduced.
- Ratio + grind move together by design (H1 mapping choice) — this track cannot attribute deltas to ratio alone.
- Single coffee — every finding is single-coffee-conditioned until tracks 2+ (the filter arc's Lesson #36 over-generalization is the cautionary precedent).
- Freezer-vial rest state varies across sittings; the rung-0 fresh control partially absorbs this, and relative reads are more trustworthy than absolute ones (RP6 N7 analog).
- Office environment: shared space, limited dedicated time — protocol tolerates rungs spread across days; each day's first scored cup should note any equipment re-setup.

## Notes / friction / lessons / audit items (Assistant fills inline during execution)

*(empty at scoping)*

---

## SESSION RECORD

*(Assistant appends per-rung records + handoff brief here at execution)*
