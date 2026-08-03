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
| Water | **AMENDED at Step 0 (operator call, 2026-07-30): plain PA tap, nothing added, whole track.** The El Oasis archived control (2026-05-04) predates the 2026-07-16 office-baseline lock and was brewed on plain tap; matching it exactly beats matching the newer standard, and it avoids inventing a cup-dosing rule for sub-200 mL concentrate cups. Water still held constant across all rungs — no water variables, RP6 break respected. Original doc value ("PA tap + 1 TONIK + 1 JAMM per 200 mL finished cup; DAK kettle-only") superseded for this track only; flagged for Coordinator. |
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

### Step 0 progress (sitting 1 — 2026-07-30)

- **0.1 Coffee + control verification: DONE.** Operator physically confirmed 5 × 15 g vials (freezer inventory stock check). Archived control brew `ae628408` pulled via MCP; doc table verified accurate against the live row. Extra pour detail carried into rung 0: drain to bed-just-covered (~1:45) between pours; gentle concentric spiral ~5 ml/s kettle-close; pour 2 finishes with a center pour to settle the bed. Row's brewer field reads "Kalita Tsubame" vs takeaways' "Kalita Wave 155" — operator confirmed the physical brewer is the Wave 155 (same unit; naming drift on the row, noted as an audit item below). No TDS on the archived row — rung 0 establishes the control TDS baseline.
- **0.2 Equipment physical check: DONE.** Kalita Wave 155 + xBloom paper + EG-1 + Stagg EKG Pro on-site, operator confirmed.
- **0.3 VST blank/zero: IN PROGRESS.** Operator has never used the VST LAB III before — full first-use walkthrough delivered (lens cleaning, blank application, zero, per-sample routine). **Blank medium LOCKED: distilled water** (operator buying a bottle as the standing office blank). Blank reading to be recorded on return.
- **0.4 TDS sample-handling convention: PROPOSED, awaiting operator confirm.** Proposed lock: VST syringe filter per sample, first ~5–10 drops to waste, sample cooled to near room temp, two readings (redo if Δ > 0.05), fresh filter per brew, lens cleaned between samples.
- **0.3 UPDATE — VST zeroed: DONE.** Distilled bottle acquired (standing office blank); blank zeroed at 0.00. **0.4 UPDATE — sample convention CONFIRMED by operator** (VST syringe filter, first drops to waste, cooled sample, two readings, fresh filter per brew).
- **Water amendment (Step 0 catch, operator call):** archived control was plain PA tap (predates the 2026-07-16 office-baseline lock) → **whole track runs plain PA tap, nothing added** (see amended Locked equipment table). Coordinator flag: track-level water deviation from the office baseline, deliberate, held constant. Also: TDS samples drawn pre-any-cup-dosing rule is moot under plain-tap amendment.
- **0.5 Control re-brew (rung 0): DONE — see Rung 0 record below. Calibration PASS.**
- **0.6 Grind purge discipline: acknowledged** (2–3 g between setting changes).
- **Operator ergonomics amendments (sitting 1, held for the whole track):**
  1. **Single TDS reading per brew** (not two) — operator call; accepted. Consequence: per-brew TDS carries more single-read noise; convention held constant so cross-rung comparability survives. Same syringe-filter handling every time.
  2. **No thermometer at the office** — hot/warm/cool stages are estimated by feel, not measured. Stage labels are approximate; the cool read (the verdict-bearing one) is anchored by "cooled to near room-temp-adjacent," consistent across rungs.
  3. **No pour timestamps / drawdown / total-time logging** — office-context constraint (this is work-hours brewing, unlike home). Build is recorded as-designed; operator notes deviations only if something visibly went off-pattern.

### Rung 0 record — control re-brew (sitting 1, 2026-07-30)

1. **Build:** 1:16 · 15 g / 240 g · EG-1 6.6 · 96°C · plain PA tap · archived pour pattern followed (timestamps not logged per ergonomics amendment 3; no deviations reported).
2. **TDS:** **0.88%** (single read, VST syringe filter, first drops wasted, cooled sample). This is the control strength baseline for all rungs.
3. **Staged sensory:**
   - **Hot:** aroma grape + a little honey + a little tea. Attack really bright; body-centric read, "honey brown tea." Texture pretty light, not much texture, thin into a nice finish.
   - **Warm:** about the same — brightness, honey, tea, body-centric. Operator: "I wish I had a little bit more in front... this is before my paradigm of all the hybrid brewing, so I probably would have pushed the front a little more." Very light, very tea-like, not a lot of texture.
   - **Cool (verdict stage):** much more grape up front — darker grape, muscat-like, "not bright sweet grape, more a darker tannic grape, but not wine-like." More texture now, a bit silkier. Honeyed tea + grape + jasmine reading as green-tea-adjacent. Clean finish, no drying, no tannin.
4. **Flags:** sour-collapse N · dryness/astringency N · clarity-loss/muddiness N.
5. **Vs archive (calibration check):** profile matches the archived control (jasmine / honey / muscat-grape, light silky tea body, clean finish, cool peak). Operator: "without a question I prefer this as it cools... I actually didn't really like this one as hot as much." **Calibration PASS — fresh control reference established.**
6. **Peak window:** cool. Consistent with archive (40–45°C peak) and with H3's premise on this coffee.
7. **Notes / observations:** operator's warm-stage "wish there was more in front" is a post-archive palate shift (hybrid-brewing paradigm arrived after this control was optimized) — worth remembering when judging whether a concentrated rung beats the control: the control itself now reads slightly front-thin to the operator at hot/warm. Friction: VST first use went clean; distilled-blank routine took one store trip.
- **Cadence re-confirmed by operator:** strictly serial, one cup at a time, up to ~3/office day; notes carry cross-cup truth (unblinded-serial tagging applies).
- **H1–H5 confirmation: DONE (operator, 2026-07-30).** All five confirmed as pre-stated, with operator-added priors:
  - **H1 (confirmed +):** "need to adjust contact time slightly so it doesn't get too thin because you are dealing with a lot less liquid solvent" — operator frames the mechanism as solvent-volume scarcity → contact-time management.
  - **H2 (confirmed +):** if grind reduction alone can't manage contact time, SWORKS valve control is the escalation — "might be a good part 2 of this research." Matches the protocol's pre-named later-track lever (trigger: "grind-only fails to hold extraction at short ratio"). NOT this track's job.
  - **H3 (confirmed):** no added prior.
  - **H4 (confirmed):** open, no prediction — "didn't touch that."
  - **H5 (confirmed +):** "temp doesn't change the contact time at all here — it's going to be grind size, and if I can't really mess with that then valve control." Operator's causal frame: the style's lever is contact time; temp is orthogonal to it.

**Audit item (inline):** brew row `ae628408` `brewer` field says "Kalita Tsubame" while its own key_takeaways say "Kalita Wave 155" — same physical brewer, naming drift within the row. For the Coordinator: possible brewer-vocabulary normalization candidate (NOT applied here).

### Rung 1 record — 1:10 (sitting 1, 2026-07-30)

1. **Build:** 1:10 · 15 g / 150 g · EG-1 **6.0 start → 6.0 final** (no re-brew; see H2 note) · 96°C · plain PA tap · Exp B pour pattern (45 g bloom → ~100 g at ~0:40–0:45 → final EARLY ~1:10–1:15). Timestamps not logged per ergonomics amendment; no off-pattern deviations reported. Operator sanity-checked the 6.6→6.0 jump before brewing; Assistant confirmed it as the H2 rule value under test.
2. **TDS:** **1.50%** (single read, standard handling) — **1.70× the rung-0 control (0.88%)**.
3. **Staged sensory:**
   - **Hot:** aroma more syrupy grape, sweeter smell, still brown tea. Attack very rich, more caramelly — caramel / honey / brown tea, "much darker in complexion." More body + texture — not syrupy, but definite denseness. Finish lingers longer.
   - **Warm:** brighter grape + brighter caramel — "wine grape plus caramel-of-honey tea" vs the control's pure honey; more caramel sweetness. Body denser. Real nice sweet note at the end, **but a little sharpness at the end** — operator: "I wish I maybe didn't go all the way down to 6.0, maybe like 6.2... could have been a little better. But hard to tell without tasting."
   - **Cool (verdict stage):** grape, caramel, honey, a bit more fresh grape. More body, more denseness — "slightly denser," not overly textured. **A little spice note at the end.** "It's a much more concentrated form and the flavors have transformed a little... a much more interesting cup."
4. **Flags:** sour-collapse **N** · dryness/astringency **borderline** — end-of-cup "sharpness" (warm) / "spice note" (cool), mild, not drying-tannin per se · clarity-loss/muddiness **N**. No hollow mid-palate (the Gesha collapse signature did NOT appear).
5. **Vs-control call [unblinded-serial]:** rung 1 > rung 0 — "a much more interesting cup." Flavor transformation, not just intensification: honey→caramel shift, grape moves toward wine-grape, darker complexion. Operator verbatim: "very curious to see what this will taste like on even higher concentration."
6. **Peak window:** less stage-differentiated than the control — the cup was compelling from hot onward (rich attack hot; sweetness peak warm; densest read cool). No stage read muted. H3's "hot reads dense/muted" did not obviously hold on this rung — hot was rich, not muted. Watch at rungs 2–3.
7. **Notes / H2 evidence:** rule-value start (6.0) produced a coherent, winning-quality cup with a mild too-fine signal (end sharpness; operator taste-guess 6.1–6.2 optimum). Read: **rule value within ~0.1–0.2 of taste optimum — H2 borderline-supported pending rungs 2–3.** Budget note: no vial exists for a within-rung re-brew, so the micro-adjust learning carries FORWARD (rung-2 starting-grind decision) instead of resolving in-rung.

**Sitting 1 close + rung-2 grind decision (operator, 2026-07-30):** rung 2 starts at the **rule value 5.9** — operator: "keep the test going till the end." H2 stays cleanly falsifiable at every rung; micro-adjust learning stays within-rung/carry-noted rather than pre-corrected. Sitting 1 closed: 2 cups (rung 0 + rung 1), 3 vials remain (rung 2, rung 3, repeat).

### Rung 2 record — 1:9 (sitting 2, 2026-08-03)

0. **Sitting 2 open:** VST re-zeroed on distilled at sitting start (operator confirmed; blank reading not spoken aloud — recorded as 0.00 per operator's "lets just go with zero." Friction note: blank *reading* capture slipped once; re-zero itself held. No equipment re-setup deviations reported.)
1. **Build:** 1:9 · 15 g / 135 g · EG-1 **5.9 start → 5.9 final** (rule value per operator's sitting-1 lock) · 96°C · plain PA tap · Exp B pattern scaled (45 g bloom → ~90 g mid → final early to 135 g). No off-pattern deviations reported.
2. **TDS:** **1.71%** (single read, standard handling) — **1.94× control** (0.88). Ladder TDS so far: 0.88 → 1.50 → 1.71.
3. **Staged sensory:**
   - **Hot:** aroma intense — intense tea sweetness. Attack "woah... a bit more aggressive," more acidity up front, less mid-palate body relative to the attack. Texture higher, more dense. A little more bitterness. Operator early call: "probably prefer this one less than the other one."
   - **Warm:** acidity/sourness coming forward; balance off — lacking sweetness, tipping into acidity + "deeper darker body tea side" simultaneously. "Definitely unique... does not taste like a normal typical cup of coffee." Denser — **"more espresso-adjacent."**
   - **Cool (verdict stage):** much more acidity-forward, still intense/concentrated ("I like that aspect"), but off-balance: more thick, acid-forward, **"a little bit too darker tannins in the back end."**
4. **Flags:** sour-collapse **N** (acid-forward, not sour-incoherent) · dryness/astringency **Y — dark-tannin back end, cool** (mild-moderate, not past-rescue) · clarity-loss/muddiness **N**.
5. **Collapse-signature check (operator clarified on direct question):** NOT hollow-mid. The mid isn't missing — it's overloaded dark: "all attack, all darker body." Reads as over-extraction character (too fine), not the Gesha grind-chase hollowing. The named collapse signature (hollow mid + tannin) has still not appeared.
6. **Vs-control / vs-rung-1 call [unblinded-serial]:** rung 1 > rung 2 > (interest-wise) rung 0. Rung 2 keeps the concentration virtues (dense, espresso-adjacent, unique) but loses balance — attack + dark body up, sweetness down, tannin in.
7. **Peak window:** none clean — the cup degraded slightly through the arc (acidity grew as it cooled). First rung where cooling did NOT improve the cup.
8. **H2 evidence (now a trend):** second consecutive rung where rule value reads too fine, and worse at 1:9 than 1:10 (rung 1: mild end-sharpness; rung 2: dark tannin + off balance). Operator's instinct both times: coarser. **Read: the −0.1/ratio-point coefficient is too steep on El Oasis as the ratio shortens** — taste optimum at 1:9 likely ≥ 6.0. H2 trending toward "does not transfer within ±0.1" on this coffee.
9. **Notes:** operator thought aloud about "water stuff to rebalance" — flagged and closed: water is locked out of this track (operator acked, "just thinking out loud"). Grind/contact remain the only in-track levers.

**Rung-3 go decision (operator, 2026-08-03):** stop rule NOT fired (rung 2 degraded, didn't collapse). Operator: "keep going forward towards rung 3 and see if there is a wall and what that wall is." Rung 3 runs at rule value 5.8 per the sitting-1 keep-the-test-clean lock.

### Rung 3 record — 1:8 boundary map (sitting 2, 2026-08-03)

1. **Build:** 1:8 · 15 g / 120 g · EG-1 **5.8 start → 5.8 final** (rule value) · 96°C · plain PA tap · Exp B pattern scaled (45 g bloom → ~80 g mid → final early to 120 g). No off-pattern deviations reported. Cup 2 of sitting 2 (same-sitting zero applies).
2. **TDS:** **1.87%** (single read, standard handling) — **2.13× control**. Full ladder TDS: 0.88 → 1.50 → 1.71 → 1.87 (monotonic). Approximate extraction yields (TDS × ratio, retention ignored): 14.1% / 15.0% / 15.4% / 15.0% — the grind rule held extraction roughly constant across the ladder; the boundary failure at 1:8 is a balance/character failure, not an extraction-quantity failure. *(Corrected at close-out: an earlier draft of this line claimed falling extraction efficiency — the computed yields contradict that.)*
3. **Staged sensory:**
   - **Hot:** aroma more pungent, body-centric, "can kinda smell the darker tea tannins." Attack a little sour, "almost feels a little under-extracted." Balance pretty off. Operator early call: least preferred so far.
   - **Warm:** **"under-extracted and over-extracted both at the same time"** — and "not really gaining anything in terms of concentration... this feels more concentrated but you're not really gaining anything in return." Mid-arc operator ranking: **1:10 best so far.**
   - **Cool (verdict stage):** improves slightly but still a little sour / under-extracted up front, **"the mid body feels a little emptier, and the later body feels too over-extracted."** Balance really off. "Not my cup of tea with this particular coffee."
4. **Flags:** sour-collapse **Y (mild-moderate — sour + balance-incoherent, all stages, worst hot)** · dryness/astringency **Y (dark-tannin late body, warm/cool)** · clarity-loss/muddiness **N** (still a clean-reading cup structurally; the failure is balance, not mud).
5. **Collapse-signature check:** **PRESENT.** Empty mid + tannic overdriven back end = the pre-named Gesha collapse signature ("hollow-mid + tannin"), arriving at 1:8 after being explicitly absent at 1:10 and only half-present (dark mid, not hollow) at 1:9. Textbook boundary progression.
6. **Vs-ladder call [unblinded-serial]:** operator ranking after 4 cups: **rung 1 (1:10) > rung 2 (1:9) > rung 0 (control, least *interesting* but coherent) vs rung 3 (1:8) = least preferred outright.**
7. **Peak window:** none — cooling only slightly softened a cup that was off at every stage. Second consecutive rung where the cooling arc didn't deliver a peak.
8. **H4 verdict (empirical):** **1:8 is past the collapse point on El Oasis at rule-value grind.** The wall's taste: simultaneous under/over-extraction — sour underdeveloped front + empty mid + tannic overdriven back — with concentration gains no longer buying cup interest. Caveat for the record: boundary mapped at rule grind 5.8, which the H2 trend says is too fine at short ratios — a coarser 1:8 might soften the wall, but that cup doesn't exist in this budget; H4 is answered *for the ladder as designed*.
9. **Stop rule:** boundary found at the final descent rung — no rungs below remain; budget shifts to the repeat as planned. No vial spared (all 3 descent rungs brewed) → **the H1 exploratory ratio-only cup is out of budget for this track**, as pre-accepted at scoping.

**Sitting 2 close:** 2 cups (rungs 2 + 3). **Winning rung: rung 1 (1:10, EG-1 6.0, 1.50% TDS) — anecdote-until-reproduced until the later-day repeat lands.** 1 vial remains (repeat).

### Repeat — SKIPPED (recorded per exit condition 3; 2026-08-03)

**Reason:** the repeat vial does not exist. Step 0's inventory check counted 5 vials, but on re-inspection the 5th is a ~5 g bag-excess, not a 15 g dose — not enough for a legitimate reproduction (a 5 g / 50 g mini-brew changes bed geometry and dose-mass entirely; it would muddy the tag, not resolve it). Coffee is otherwise exhausted; no later-day repeat is possible on this lot, ever.

**Consequence:** the winning rung (rung 1, 1:10, EG-1 6.0, 1.50% TDS) **carries its anecdote-until-reproduced tag UNRESOLVED at track close.** The reproduction burden transfers to tracks 2+ (cross-coffee: does a 1:10-region optimum recur?), which is also the low-pressure-branch unlock condition — so nothing structurally changes in the project plan; track 1 simply closes one confirmation short.

**Lesson fired (RP8-N1, § brief):** Step 0 coffee verification must confirm per-vial fill weight, not vial count.

---

## HANDOFF BRIEF FOR COMPILE SESSION (Concentrated Pour-Over Track 1 Close-Out)

**Date:** 2026-08-03
**Session role:** execution + handoff brief production (no substrate edits)
**Archive location:** branch `claude/concentrated-pourover-t1-ladder-962b18` @ `207ca6a4a04dd69aad073c01bbd357780358dd3b` (content commit; a follow-up SHA-record commit sits at branch tip), pushed to origin (archive doc committed; substrate is NOT; not merged to main). See [`role-discipline.md` § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md).
**Methodology verdict:** MIXED — ✅ the ladder methodology VALIDATES (own-style optimum found + boundary mapped in 4 cups on a 5-vial budget); ⚠️ H2's grind coefficient only holds at the first rung; ❌ the repeat was lost to an inventory miss, so the optimum closes unreproduced.

This brief is the canonical close-out for RP8 Track 1. Coordinator: consume § Key findings + § Recap map for the project end-doc + track-2 protocol design; the substrate-edit specs are deliberately thin (this track pre-committed to doc-only records). Compile session: nothing to integrate beyond the specs listed — trial data stays in this doc by design (operator call 2026-07-30, jointly with grilling item 56).

### TL;DR

- **The style is real on a second coffee:** 1:10 concentrated pour-over (15 g / 150 g, EG-1 6.0, 96°C, early-final-pour) beat the operator's optimized 1:16 control on El Oasis Gesha — richer, denser, caramel-honey flavor *transformation* (not mere intensification), 1.50% TDS vs 0.88% control [unblinded-serial; anecdote-unreproduced].
- **The boundary exists and was mapped: 1:8 collapses** (sour front + empty mid + tannic back = the pre-named Gesha collapse signature); 1:9 is the degradation zone (balance slipping, tannin arriving).
- **H2's −0.1 EG-1/ratio-point coefficient is too steep on this coffee:** right within ~0.1–0.2 at 1:10, clearly too fine by 1:9–1:8. Implied El Oasis coefficient ≈ −0.07/pt.
- **The grind rule held extraction yield ~flat (14–15.4%) across the whole ladder** — collapse at 1:8 is a balance/character failure, not an extraction-quantity failure.
- **H3 did not hold at short ratio:** the winning concentrated cup was compelling from hot onward; stage-differentiation shrank as ratio shortened. Cool-peak discipline is a control-cup trait, not (on this evidence) a concentrate trait.
- **Repeat skipped — 5th vial was a ~5 g bag excess.** Winner carries the anecdote tag; reproduction burden moves to tracks 2+.
- Low-pressure branch: **NOT unlocked** (requires the optimum repeatable across 2+ coffees; current count: 1, unreproduced).

### Execution summary

4 scored brews executed (rung 0 control re-brew + rungs 1–3), serial cadence across 2 sittings (2026-07-30, 2026-08-03), one tool call per scored brew, rubric re-presented every rung. Step 0 ran to completion including the rung-0 calibration re-brew (PASS — archived profile reproduced). Methodology held throughout; divergences from protocol as drafted: (1) water amended to plain PA tap whole-track (archived control predates the office-baseline lock), (2) three operator ergonomics amendments (single TDS read; no thermometer — temp stages by feel; no pour timestamps), (3) planned repeat skipped — vial 5 was a ~5 g excess, not a dose. The H1 exploratory ratio-only cup never ran (no spared vial). Operator sanity-challenged the 6.6→6.0 grind jump pre-rung-1 (upheld as the H2 test) and thought aloud about water rebalancing at rung 2 (closed — water locked).

### Equipment / conditions

| Variable | As run |
|---|---|
| Coffee | Moonwake El Oasis 60hr Washed Gesha (Tolima, 2150 masl), frozen 15 g vials |
| Brewer / filter | Kalita Wave 155 + xBloom Premium Paper |
| Grinder | Weber EG-1 (purge 2–3 g at each setting change) |
| Water | **Plain PA tap, nothing added — whole track** (amended from office baseline at Step 0; matches archived control) |
| Temp | 96°C all rungs (H5 held — zero temp moves made) |
| TDS | VST LAB III, distilled-water blank zeroed each sitting; syringe-filtered, first drops wasted, cooled sample, **single reading** (ergonomics amendment) |
| Dose | 15 g per brew |
| Cadence | Serial, one cup at a time, ≤3/office day; unblinded |

### Per-pull raw data

| Rung | Ratio | Grind (start→final) | TDS | ×control | ~EY | Verdict [unblinded-serial] |
|---|---|---|---|---|---|---|
| 0 | 1:16 (240 g) | 6.6→6.6 | 0.88% | 1.00× | 14.1% | Calibration PASS — archive profile reproduced; cool-peak confirmed; operator notes control now reads slightly front-thin to his current palate |
| 1 | 1:10 (150 g) | 6.0→6.0 | 1.50% | 1.70× | 15.0% | **WINNER.** Rich caramel/honey/wine-grape transformation, denser, longer finish; mild end-sharpness (taste-guess: 6.1–6.2 optimum); compelling at every temp stage |
| 2 | 1:9 (135 g) | 5.9→5.9 | 1.71% | 1.94× | 15.4% | Degradation zone: unique + espresso-adjacent but off-balance — acid-forward, sweetness down, dark-tannin back end; first rung where cooling didn't improve the cup |
| 3 | 1:8 (120 g) | 5.8→5.8 | 1.87% | 2.13× | 15.0% | **COLLAPSE (boundary found):** "under- and over-extracted at the same time" — sour front, empty mid, tannic overdriven back (the named Gesha collapse signature); concentration no longer buying interest |
| R | — | — | — | — | — | SKIPPED — repeat vial was a ~5 g bag excess (see § Repeat record) |

Full staged hot/warm/cool prose per rung in § SESSION RECORD above (the raw sheet of record).

### Analysis

- **Optimum location:** operator serial ranking 1:10 > 1:9 > control(1:16) ≥ 1:8. The interest peak sits at/near 1:10 with taste-optimum grind ~6.1–6.2 (slightly coarser than rule).
- **Boundary shape:** failure arrives progressively (sharpness at 1:10 → dark imbalance at 1:9 → collapse at 1:8), and its signature is the cultivar's pre-named one (hollow mid + tannin) — absent at 1:10, half-formed at 1:9, full at 1:8. The ladder's monotonic-descent design captured the trajectory exactly as intended.
- **Grind coefficient (H2):** rule start-values produced EY ≈ flat, so the coefficient is extraction-correct but taste-wrong as ratio shortens — the taste optimum drifts coarser than iso-extraction. Implied taste-fit coefficient on El Oasis ≈ −0.07/pt (6.6 @ 1:16 → ~6.15 @ 1:10).
- **Stage behavior (H3):** control cool-peaked hard (archive-consistent); rung 1 read rich hot through cool with no muted stage; rungs 2–3 had no peak (cooling neutral-to-harmful). Stage-differentiation appears to compress as concentration rises — single-coffee observation.
- **TDS trajectory:** 0.88 → 1.50 → 1.71 → 1.87%. The style's espresso-adjacency threshold (operator's own word first appears at 1:9/1.71%) sits above the interest optimum — texture alone doesn't carry the cup once balance goes.

### Final output

**Track-1 winning recipe (anecdote-unreproduced):** Moonwake El Oasis · 15 g / 150 g (1:10) · EG-1 6.0 (taste-suggested refinement: 6.1–6.2) · 96°C · plain PA tap · Kalita Wave 155 + xBloom paper · 45 g bloom, ~100 g at 0:40–0:45, final pour early ~1:10–1:15, gentle concentric throughout · 1.50% TDS (1.70× the coffee's optimized control) · profile: caramel/honey/wine-grape, dense but not syrupy, long finish, coherent at every temp stage. **Boundary: 1:8 = collapse; 1:9 = degradation zone.**

### Key findings

1. **A grind-and-contact-driven 1:10 concentrate beat an optimized 1:16 control on a delicate washed Gesha** — the style's second coffee, first on a zero-tannin/agitation-sensitive testbed. Data: rungs 0–1 records. Substrate implication: strengthens the RP8 bet; feeds grilling item 56's format-vocabulary case. [unblinded-serial; unreproduced]
2. **The collapse boundary is real, near, and cultivar-legible:** 1:8 collapsed with the exact hollow-mid + tannin signature the Gesha corpus predicts for grind-chasing — meaning existing cultivar collapse-vocabulary transfers to the concentrated regime. Data: rungs 2–3. Implication: track-2 ladders don't need rungs below 1:9 unless the coffee is structurally sturdier.
3. **H2 fails as stated, but informatively:** −0.1/pt is iso-extraction (EY flat 14–15.4%) yet taste-too-fine below 1:10. The taste optimum is coarser than iso-extraction as ratio shortens. Implied El Oasis coefficient ≈ −0.07/pt. Implication: track-2 abbreviated ladders should start rungs at rule-value +0.1 (or adopt −0.07/pt) — and that choice is itself the H2 retest.
4. **H3 (warm-to-cool payoff) did not survive contact with the style:** the winning concentrate was excellent hot; the control's cool-peak discipline didn't govern it. Implication: staged scoring stays (it's how we know), but "concentrate peaks warm-to-cool" should NOT be written into style substrate yet — single-coffee counter-evidence against the founding assumption.
5. **H5 held trivially:** 96°C rode unchanged, no rung flaw demanded a temp move, no temp move was made. Untested counterfactual — held-by-default, not proven.
6. **H1 remains open:** the ratio-only control cup never ran (budget). The flavor *transformation* at 1:10 (honey→caramel, grape→wine-grape) is directional support that this is its own style, not a shrunken control — but the direct test transfers to track 2's budget.
7. **The office-lane execution model works:** serial cadence across sittings, ergonomics-trimmed capture (single TDS read, no timestamps, no thermometer), doc-current-after-every-rung — full ladder + boundary in 4 cups with zero wasted vials. Implication: pre-declare these trims in the office-lane protocol template rather than re-negotiating per session.

### Substrate edit specifications for compile session

DO NOT execute these edits in this session — the compile session integrates substrate.

1. **Audit-item fix (data hygiene, small):** brew row `ae628408-0786-4611-8766-92cd3c6b6686` has `brewer: "Kalita Tsubame"` while its own key_takeaways say "Kalita Wave 155" (operator-confirmed physical brewer = Wave 155). Change: normalize the row's `brewer` field via `patch_brew` to the canonical brewer name per `docs/skills/brewing-equipment-expert/cluster/` brewers doc (check the canonical spelling there first). Source: rung 0 verification, P8-AI-1. Rationale: same-row internal contradiction; trivial but it's the control row future tracks will re-pull.
2. **Track-2 protocol inputs (Coordinator-authored, not a file edit per se):** carry into the track-2 protocol doc: (a) starting-grind rule amended per Key finding 3 (rule +0.1, or −0.07/pt, framed as the H2 retest); (b) abbreviated ladder shape suggestion: 1:10 + 1:9 + later-day repeat (boundary rung optional per Key finding 2); (c) Step 0 verification must include **per-vial fill-weight check** (RP8-N1); (d) budget one vial for the H1 ratio-only cup — it's now the oldest open hypothesis test; (e) water decision surfaced explicitly at Step 0 when the archived control predates the office-baseline lock (RP8-N2).
3. **Grilling item 56 evidence pointer (queue annotation only):** append a one-line evidence pointer to `docs/grilling-queue.md` item 56: "RP8-T1 closed 2026-08-03: 1:10 beat optimized control on 2nd coffee (El Oasis), boundary at 1:8; brief in `docs/research-projects/concentrated-pourover-t1-full-ladder.md`." Source: Key findings 1–2. Rationale: item 56 owns the vocabulary/representation decision; it should know the evidence moved.
4. **No registry edits. No ADR work. No cluster-doc pattern writes.** Trial data stays in this doc by design (operator call 2026-07-30); durable representation is grilling item 56's call.

### New lessons captured

| # | Lesson | Substrate implication |
|---|---|---|
| RP8-N1 | Vial-count verification is not dose verification — a "vial" can be a bag-excess partial. Step 0 must confirm per-vial fill weight when the budget has no buffer. | Protocol template Step 0 wording (spec 2c) |
| RP8-N2 | An archived control can predate a later-locked environmental baseline (water, here). "Brew the control exactly as archived" and "use the current locked baseline" can silently conflict — surface + resolve at Step 0, hold the winner constant all track. | Protocol template Step 0 (spec 2e) |
| RP8-N3 | Office-lane capture trims (single TDS read, no thermometer, no pour timestamps) are the lane's real operating shape — pre-declare them in office-lane protocols instead of discovering them mid-sitting. | Office-lane protocol template (Key finding 7) |
| RP8-N4 | Iso-extraction grind scaling ≠ taste-optimal grind scaling at short ratios: EY can hold flat while the cup degrades. TDS/EY confirms mechanism but cannot arbitrate the ladder. | Track-2 design framing (Key finding 3) |

### Audit items queued

| # | Item | Status | Implication |
|---|---|---|---|
| P8-AI-1 | Brew row `ae628408` brewer-field naming drift ("Kalita Tsubame" vs "Kalita Wave 155") | Queued for compile session (spec 1) | Control-row hygiene |
| P8-AI-2 | H1 direct test (ratio-only cut at 1:10) never run | Open — transfers to track-2 budget (spec 2d) | Oldest open hypothesis test in the project |
| P8-AI-3 | Track-1 optimum unreproduced (repeat lost) | Open — reproduction burden folded into tracks 2+ cross-coffee test | Gates the low-pressure branch unlock |

### Open data items

- Winning-rung reproduction: impossible on this lot (coffee exhausted); resolves only as cross-coffee recurrence in tracks 2+.
- 1:8 boundary mapped at rule grind (5.8) only — whether a coarser 1:8 softens the wall is unknown and out of budget; note for track 2 only if a coffee shows an unusually late boundary.
- Temp stages estimated by feel (no thermometer) — stage labels across all rungs are approximate.

### Recap map for compile session

Integrate first: spec 1 (control-row fix, 2 minutes) + spec 3 (grilling-queue evidence pointer). Then Coordinator work: track-2 protocol draft consuming spec 2 (grind-rule amendment as the H2 retest, per-vial weight check, H1 cup budgeted, repeat preserved) + project end-doc update with the H-verdicts (H1 open-directional / H2 fails-as-stated / H3 counter-evidenced / H4 answered / H5 held-by-default). Escalate to operator: track-2 coffee pick (shortlist in § Project Context; H2 verdict argues for a sturdier, less delicate coffee to test whether the boundary moves), and whether RP8-N3's office-lane trims graduate to the lane template now or after track 2. Nothing else pends.

### Protocol-execution friction captured

1. VST LAB III first use consumed a store trip (distilled blank) + full walkthrough mid-session — fine once, but the office-lane template should list "distilled blank bottle on-site" as standing equipment.
2. Blank *reading* capture slipped at sitting 2 (re-zero itself held; reading recorded as 0.00 on operator's word) — the rubric's sitting-open line should demand the number, not the act.
3. Water-baseline conflict discovered only when the operator questioned the kettle protocol at rung 0 (RP8-N2) — cheap to catch at scoping instead.
4. The 6.6→6.0 jump read as alarming to the operator at rung 1 — future spawn prompts should pre-explain the rule's cumulative arithmetic at rung presentation, not on challenge.
5. Inventory miss (RP8-N1) discovered at the worst moment — after the ladder, before the repeat.

---

### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Archive doc committed + pushed to branch `claude/concentrated-pourover-t1-ladder-962b18` @ `207ca6a4a04dd69aad073c01bbd357780358dd3b` (the authorized archive-persist exception)
- ✅ Handoff brief produced above; branch + SHA in the `Archive location:` header for the compile session
- 🛑 Session terminating after this brief lands. The compile session integrates substrate per the design pattern.

End of Concentrated Pour-Over Track 1 close-out.
