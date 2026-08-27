# Concentrated Pour-Over — Track 5: AeroPress Low-Pressure Branch (Research Project #8, Office Lane)

*Coffee Research · Latent · Research Project*

**Version:** 1.0 (scoped)
**Date drafted:** 2026-08-25
**Status:** SCOPED — coffee PRESUMPTIVE (Moonwake Project One Peach; operator verifies vials at office; substitutes: Guadalupe Hill / Project One Blue Iris — ping Coordinator before spawn if swapped)
**Location:** Office (Downtown Palo Alto)
**Coordinator session:** RP8 Coordinator (persistent)
**Prior tracks:** [T1 El Oasis](docs/research-projects/concentrated-pourover-t1-full-ladder.md) · [T2 Motta](docs/research-projects/concentrated-pourover-t2-motta-abbreviated-ladder.md) · [T3 Loud Giants valve](docs/research-projects/concentrated-pourover-t3-loud-giants-valve.md) · [T4 Chombi drops](docs/research-projects/concentrated-pourover-t4-chombi-postbrew-drops.md) (all CLOSED)

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
- Walk the operator through Step 0 sub-steps to completion before any scored cup
- Run scored cups one-at-a-time (tool-call-per-cup pacing; serial cadence)
- Re-present the scoring rubric inside EVERY scored cup's tool call
- Capture friction + new lessons + audit items inline in this doc
- Produce a handoff brief per `docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md`
- Commit + push THIS doc to your session branch at termination; report branch + SHA in the brief's `Archive location:` header
- TERMINATE the session after the handoff brief

Full primitive doc: `docs/skills/research-coordinator/cluster/role-discipline.md`

---

## Project Context

Track 5 of **Research Project #8 — Concentrated Pour-Over / High-Strength Filter** (office lane; WBC routine-differentiation bet), and the **low-pressure branch** — formally unlocked at T2's reproduction gate, hardware acquired, sequenced here by operator call. State of the project: 1:10 is the gravity/valve optimum on three coffees with the boundary at 1:9; valve-driven contact is the style's best current form (T3; tannin tax = grind-driven); the concentrate tolerates and benefits from finished-cup drops, with the locked office TONIK+JAMM dose winning blind at ~4× intensity (T4). This is the LAST mechanism track before project close-out shape (end-document → process retro → grilling item 56 drain).

**What this track tests:** the third non-grind contact mechanism — **immersion + slow press**. The operator has already run ~15+ home AeroPress brews in preparation (uncontrolled, no water optimization — deliberate play), which settled the platform decisions below and produced a lived seed recipe. This track transfers that recipe to a controlled office read on a track coffee with an archived control profile, TDS instrumentation, and the project's comparison discipline.

**Operator platform decisions (lived practice — these are settled, not up for re-litigation):**
- **Inverted brewing.** Upright leaks brew water. (Assistant: re-invert carefully; the Premium is the glass-chamber model — stable wide vessel, gentle press, stop if anything flexes.)
- **No flow-control cap.** Owned, tried several times, rejected on taste/feel. Parked.
- **Soup-style method:** tried, technique admired, cup not preferred. Parked.
- **Paper micro-filter** (project identity is paper-filtered clarity); gold-tone metal filter parked.
- **Seed recipe (operator's best, 3 brews on 2026-08-25 morning):** 20 g · EG-1 **7.0** · **89°C** · 150 g all at once (1:7.5) · stir just enough to wet the whole bed · **1 minute total steep** · re-invert · **very slow press lasting ~2 minutes** (the press IS contact time; total ~3 min). Read: "delicateness of a pourover with the concentrated intensity of a concentrated pour-over / soup shot without being too much." Operator note: 93–94°C over-extracted at home (likely the agitation), 90→89°C better.

**Championship prior art (external input, operator-reviewed — context, not contract):** 2022–2025 World AeroPress Champions share one architecture: 18 g / ~100 g chamber (≈1:5.5) / coarse / long immersion / gentle 20–40 s press / 60–80 g concentrate / **bypass to ~150–170 g (≈1:8–1:9 final)**. Pressure is secondary — press SPEED is the reproducible control (Ahrend 2025: 1–2 g/s output). **The sharpest differentiation fact in the whole project: every recent champion bypasses; RP8's style is defined as no-bypass undiluted.** The operator's build is closer to a percolation-adjacent full-volume press than the champion concentrate-and-bypass. This track's dilution arm (cup 3) tests that identity boundary EXPLICITLY — its answer feeds grilling item 56, whichever way it goes.

**~0.3–1.0 bar territory; force sanity:** chamber ≈ 26 cm², so 0.25 bar ≈ 6.6 kg of hand force. The 2-minute press is far below that. No pressure targeting — press speed by feel, output time recorded.

Vocabulary stays grilling item 56's. **No push_brew.** P8-AI-7/8 stay parked (low priority). Shimmy sieve (fines removal) explicitly OUT of this track — grind-distribution confound; it belongs to a future probe or the routine-construction project.

## Track-5 coffee (PRESUMPTIVE — verify at office before spawn)

| Field | Value |
|---|---|
| Coffee | **Moonwake — Project One Peach** (Catimor yeast-anaerobic natural, Yunnan; "Peach Oolong") — presumptive |
| Archived control brew ID | `7aef16d6-2ea3-482f-ac52-d7b9e31e7162` |
| Control (reference profile, DIFFERENT brewer — comparison is cross-mechanism, not same-bench) | Kalita + xBloom · 15 g / 225 g (1:15) · EG-1 6.3 · 96°C · Balanced Intensity · peach candy / pu'er / milky jasmine tea · peak cool <45°C ("any decision above 50°C would have been wrong") |
| Why this coffee | Most vials remaining (7 at 2026-07-30 inventory); dessert-register profile; **it PUNISHES fine-grind extraction pressure** (grind floor 6.3; pushing separated components + added astringency) — the ideal stress test for a coarse (7.0), cool (89°C), pressure-gentle mechanism. The coffee that vetoed the grind mechanism auditions the press mechanism. |
| Vials | **verify ≥4 true 15 g vials at Step 0** (RP8-N1 — and freezer stock is shared-space volatile: a coworker consumed Ngoma stock; physical count only) |
| Water | Plain PA tap, zero additions, whole track (mechanism baseline; T4's drops verdict is a separate serving-side layer, not re-tested here) |

**Coffee-specific cautions:** cooling-dependent integration is this coffee's defining trait — hot it reads disjointed/broken and that is NOT a mechanism failure; rung verdicts weight the cool read (<45°C). Watch whether the immersion-press concentrate compresses that (T1's stage-compression appeared on one coffee, not the other — coffee-dependent per T2).

## Hypotheses (pre-state before scoring)

- **H-press (mechanism baseline):** the operator's immersion-press recipe, scaled to 15 g, produces a coherent liked concentrate on the track coffee — the third non-grind contact mechanism validates on a controlled read.
- **H-boundary-m (the track's sharpest question):** 1:7.5 immersion-press is coherent where 1:9 collapsed under percolation — i.e., **the concentration boundary is mechanism-dependent, not ratio-intrinsic.** Cup 1 directly tests territory below the gravity boundary.
- **H-ratio (within-mechanism):** which ratio wins under immersion-press — 1:7.5 (lived recipe) or 1:10 (the project optimum)? Serial unblinded call, cup 1 vs cup 2.
- **H-dilution (the identity test):** blind split-cup — undiluted half vs diluted-back half (+~30% hot water, moving 1:7.5→~1:10-strength or 1:10→~1:13-strength). Does the no-bypass identity hold under blind tasting, or does the champion architecture have a point? *Answer feeds item 56 either way.*
- **H-fixed:** grind 7.0 · 89°C · 1-min steep · ~2-min slow press held constant on every cup — ratio and dilution are the ONLY variables. (This is the H5 analog: no flaw gets a grind/temp/steep fix by default; a deviation is an explicit logged exploratory decision.)

## Step 0 (run to completion BEFORE any scored cup)

1. **Vial count + fill-weight check (RP8-N1) — FIRST.** Physical count, weigh each; need ≥4 true doses. Under 4 → stop, re-plan with operator (coffee may swap; Coordinator patches).
2. **Coffee + control verification:** pull brew `7aef16d6` via MCP; confirm the reference profile above. (Reference only — different brewer; there is no rung-0 re-brew on this track: the comparison is cross-mechanism vs the archived profile + the T1–T4 concentrate corpus, both memory/record-based and tagged as such. RP8-N10 consciously waived — logged here, don't re-litigate.)
3. **Equipment:** AeroPress Premium + paper micro-filters on-site (gold-tone + flow-control cap stay in the drawer) · stable wide press vessel · EG-1 at 7.0 · Stagg EKG Pro at 89°C · timer.
4. **VST LAB III:** distilled blank, zero, record the NUMBER. Single read per cup (pre-split on cup 3). Sample convention unchanged.
5. **Water:** plain PA tap at the kettle, nothing added, whole track. Drops temptation → parked note (T4 already answered the drops question; don't re-run it inside this track).
6. **Method lock (walk it once verbally with the operator before cup 1):** invert · 15 g at 7.0 · pour target water at 89°C in one continuous pour · stir just to wet the bed (count the stirs, record) · steep to 1:00 total · cap with rinsed paper filter · re-invert onto the vessel · press very slowly, ~2:00 press duration target, stop at first sustained hiss · record actual press duration + liquid yield (RP8-N12 — yield at press stop, and per-half at split on cup 3).

## Design — 4 cups (5th = buffer if vials allow)

All cups: **15 g · EG-1 7.0 · 89°C · plain tap · inverted · wet-the-bed stir · 1:00 steep · ~2:00 slow press.** Only ratio and dilution vary.

| Cup | Vial | What | Purpose |
|---|---|---|---|
| 1 | 1 | **1:7.5** (15 g / 112 g) — the lived recipe, scaled | H-press + H-boundary-m (below the gravity boundary!) · TDS + yield |
| 2 | 2 | **1:10** (15 g / 150 g), same method | H-ratio — the project-optimum ratio under the new mechanism · TDS + yield |
| 3 | 3 | **Winner of 1-vs-2, split-cup blind:** undiluted half vs diluted-back half (+~30% hot same-kettle water to the treatment half; operator codes; forced pre-reveal pick; T4 split protocol verbatim — equal halves by weight, first sip both, reveal after pick) | H-dilution — the no-bypass identity test |
| R | 4 | **Later-day repeat of the overall winner** (undiluted form) | Reproduction discipline (protected vial — not skippable, not same-day-able) |
| (5) | buffer | If a 5th vial exists: operator's-call exploratory (press-speed contrast OR a 1:9 mid-rung) — rationale logged before brewing | Optional |

**Cross-mechanism scoring context (memory-based, tagged):** each cup gets a vs-archived-control impression AND a "vs the gravity/valve concentrates (T1–T4 character)" impression — explicitly cross-track memory, tag it.

**Cadence:** serial, ≤3/office day, unblinded except cup 3's split; actual brew date per cup; first sip before anything else (then park the cup and RE-READ COOL — this coffee's verdicts live <45°C); missed reads tagged (RP8-N7). Office capture trims pre-declared (single TDS read · no thermometer, stages by feel · press duration + yield ARE captured — they're this mechanism's load-bearing numbers, not ceremony).

## Scoring — per-cup record (rubric re-presented in EVERY cup's tool call)

1. **Build:** ratio / water g / 7.0 + 89°C confirm / stir count / steep end time / press duration (actual) / liquid yield / date.
2. **TDS** + ×archived-control-strength estimate + ~EY (mechanism-read only, RP8-N5).
3. **Staged sensory** hot / warm / cool (cool is the verdict stage on this coffee): aroma / attack / mid / body+texture / finish; texture explicit (the "delicate + concentrated" duality is the thing to describe); astringency/dryness line explicit (this coffee's known failure mode).
4. **Cup 3 split:** T4 protocol — grams per half, codes, dilution amount, forced pre-reveal pick + reason, reveal, post-reveal flagged.
5. **Flags:** disjointed-hot (expected, not a failure) · astringency · thinness · component separation (this coffee's pressure signature) · any new failure shape (RP8-N6).
6. Friction / lessons / audit items inline.

## Exit conditions (track close)

1. Cups 1–3 + R executed (buffer optional).
2. H-press / H-boundary-m / H-ratio / H-dilution / H-fixed each resolved with evidence pointers; H-boundary-m gets a plain-language verdict (boundary mechanism-dependent: yes / no / unresolved).
3. Winner named (recipe + TDS + yield + staged profile); repeat verdict explicit (±0.05% + profile, RP8-N7 tag check).
4. **Project-level mechanism map statement:** with grind (T1/T2), valve (T3), drops (T4), and press (T5) all read — the brief states the style's best form(s) and where each mechanism belongs. This is the close-out-shaping paragraph: it feeds the end-document, the retro, and item 56's drain.
5. Handoff brief per template, incl. candidate substrate specs (SPECIFIED, not applied), close-out guidance (end-doc → retro → item 56), and RP8-N candidates.
6. This doc committed + pushed; branch + SHA in the brief header.

## What this track does NOT do

No push_brew · no vocabulary locking · no water variables or drops (T4 closed that) · no flow-control cap, gold-tone filter, soup method, or Shimmy sieve (all parked) · no grind/temp/steep/press-speed moves on scored cups (H-fixed; buffer cup is the sanctioned exception) · no pressure targeting (speed by feel, duration recorded) · no substrate edits.

## Known confounders & limitations

- Cross-mechanism comparisons are memory/record-based (different brewer than every prior track) — directional, tagged.
- The archived control is a different brewer AND this track skips a fresh control re-brew (budget + no same-brewer control exists) — RP8-N10 waived, logged.
- Press "slow" is by feel; duration + yield are the reproducibility anchors (RP8-N9 analog: ONE bench-free parameter, recorded as a number).
- This coffee's cooling-dependence means early reads mislead by design — the cool re-read is mandatory before any verdict.
- Single coffee; single reads except the split pair and the repeat.

## Notes / friction / lessons / audit items (Assistant fills inline)

*(empty at scoping)*

---

## SESSION RECORD

### Step 0 — COMPLETE (2026-08-25)

1. **Vials:** physical count + weigh confirmed by operator — **5 true vials × 15 g** Project One Peach. ≥4 gate passed; a true 5th vial exists → buffer cup available (operator's call, rationale logged before brewing).
2. **Control:** brew `7aef16d6` pulled via MCP; reference profile confirmed (Kalita + xBloom · 15/225 · EG-1 6.3 · 96°C · Balanced Intensity · Pu'er / Peach Candy / Milky Jasmine Tea · verdicts <45°C). No fresh control re-brew (RP8-N10 waived per scoping).
3. **Equipment:** confirmed on-site — AeroPress Premium + paper micro-filters; flow-control cap + gold-tone in drawer; stable wide vessel; EG-1 at 7.0; EKG Pro at 89°C.
4. **VST LAB III:** distilled blank = **0.00**, zeroed.
5. **Water:** plain PA tap, zero additions, whole track.
6. **Method lock:** walked verbally with operator, LOCKED — inverted · 15 g @ 7.0 · one continuous 89°C pour · wet-the-bed stir (count recorded) · steep to 1:00 total · cap rinsed paper filter · re-invert · very slow press ~2:00 target, stop at first sustained hiss (every cup incl. cup-3 re-brew) · capture actual press duration + yield + TDS + date. Cup 1 water = 112 g (operator confirmed vs 112.5). Cup-3 dilution = +~30% of treatment-half weight, same kettle 89°C, computed live from actual half weight.

**Hypothesis priors (pre-scoring):** operator states **no strong priors** on H-press / H-boundary-m / H-ratio / H-dilution. H-fixed acknowledged.

---

### Cup 1 — 1:7.5 (15 g / 112 g), lived recipe scaled — 2026-08-25

**Build:** 15 g @ EG-1 7.0 · 112 g plain tap @ 89°C · stir = 2 (one N–S, one E–W, saturation only, no heavy agitation) · steep to 1:00 · flip+adjust ~10 s · press ~1:10 → 2:00 = **actual press duration ≈ 50 s** · **total brew ~2:00** · **liquid yield 70.8 g** (41.2 g retained).

**METHOD-LOCK AMENDMENT (operator clarification, cup 1):** the scoping doc's "~2-minute press" mis-transcribed the lived recipe — the operator's target is **~2:00 TOTAL brew** (1:00 steep + ~10 s flip + ~50 s slow press). Amended here; held constant for all remaining cups. Audit item: seed-recipe transcription in § platform decisions says "press ~2 min / total ~3 min" — wrong; lived = press ~50 s / total ~2 min.

**TDS 1.44%** · ~EY ≈ 1.44 × 70.8 / 15 ≈ **6.8%** (mechanism-read only, RP8-N5 — the huge bed retention at 1:7.5 makes classic EY math mostly a retention read).

**Sensory (operator, dictated):**
- Aroma: very intense, many flavors — "super interesting."
- Hot attack: intense, fruity, very forward. Operator's instinct: "could use a little bit of dilution."
- vs T1–T4 concentrates [cross-track memory, tagged]: similar family, but **more balanced at this concentration than the gravity/valve concentrates** — balance holding below the gravity boundary.
- Cool read (cup cooled at bench): very fruit-forward, many flavors, "very layered texturally — I like this, really good so far."
- Astringency/dryness line: **none — "I didn't notice any astringency or dryness at all"** (this coffee's known failure mode: absent under this mechanism at 1:7.5).
- Cool read confirmed genuinely cool (~45°C by feel, no thermometer — pre-declared office trim).

**Unscored exploratory (flagged, NOT a scored read):** operator added a splash of 89°C kettle water to the leftover — unmeasured, self-described "not scientific." Result: markedly more aromatic, "opens things up a lot" — orange-berry, peach, candied sweets. Operator's direction: bypass/dilution helps this cup. **Recorded as a directional prior for cup 3 (H-dilution), not evidence** — cup 3's blind split is the controlled test.

**Flags:** disjointed-hot NOT observed (notable — this coffee's hot reads usually mislead; here the hot cup was coherent — possible stage-compression analog) · zero astringency/dryness (confirmed explicitly) · no component separation · press duration resolved as method-lock amendment, not a deviation.

### Cup 2 — 1:10 (15 g / 150 g), project-optimum ratio — 2026-08-25

**Build:** 15 g @ EG-1 7.0 · 150 g plain tap @ 89°C · amended method lock (2 stirs · 1:00 steep · slow press) · press ~1:10 → 2:05 = **≈55 s press, total 2:05** · **liquid yield: MISSED READ — consumed before weighing (RP8-N7 tagged; repeat-verdict consults this)** · **TDS 1.13%**.

**Sensory (operator, dictated):**
- Aroma: fruity, sweet, pungent — a lot going on.
- Hot: reads more diluted than cup 1 — "a little bit more on the pour-over side"; cup 1 in retrospect "a little too concentrated." Operator instinct: something in the middle.
- Warm: creaminess emerging — creamy milk punch / milk tea, peach.
- Cool (verdict stage): fruit punch · peach/fruit/sweet/candy · melon, stone fruit · creaminess = the jasmine milk-tea structure. Reading MORE fruit-sweet than the bag notes portray. "Extremely interesting coffee."
- **Dilution-direction asymmetry (key observation):** cup 1 wanted dilution; cup 2 wants NO dilution — if anything a tad MORE concentration. Operator's implied optimum sits BETWEEN 1:7.5 and 1:10.
- Astringency/dryness line: **none at any stage** (explicit).

**H-ratio call (serial unblinded, forced): CUP 2 (1:10) WINS.** Reason: "more pleasant on its own — the first was a little too pungent." Caveat logged: operator would NOT dilute cup 2; if anything wants a tad more concentration — the felt optimum sits between 1:7.5 and 1:10. Cup 3 re-brews 1:10; the split's diluted half (→~1:13-strength) runs AGAINST the operator's stated prior, which makes the blind pick a clean test.

**Flags:** disjointed-hot again NOT observed · no component separation dictated · thinness: mild lean toward "pour-over side" hot, not flagged as a defect cool.

### Cup 3 — 1:10 re-brew → split-cup blind (H-dilution identity test) — 2026-08-26 (day 2)

**Build:** 15 g @ EG-1 7.0 · 150 g @ 89°C · amended method lock · total 2:05 · **yield 124.1 g** · **TDS 1.13% pre-split** — an exact CROSS-DAY replicate of cup 2's TDS (cup 2 = 2026-08-25, cup 3 = 2026-08-26). Strong reproducibility signal for the mechanism, ahead of the formal repeat rung.
**Split:** 62 g + 62 g by weight · treatment half **A = +18 g same-kettle 89°C water (29% — on target)** → ~1:13-strength (~0.87% est.) · **B = undiluted**.

**⚠️ Protocol compromises (RP8-N7 tagged, verdict weighting reduced):**
1. **Blind partially broken:** the diluted half was warmer (fresh hot water added), and the operator inferred identity mid-taste ("pretty sure this is the one with added bypass"). Temperature differential is a structural leak in this split design when dilution water is hot — RP8-N candidate: equal-temp dilution water or a rest-to-temp-parity step.
2. **Forced pick sequencing:** identities were stated in the same report as the tasting notes; no clean pre-reveal pick was captured. Directional preference WAS expressed before identity naming (right/A "thin"), but the formal forced-pick-then-reveal sequence did not occur. Operator asked to ratify the pick explicitly post-hoc (flagged as such).

**Sensory (operator, dictated):**
- Left = **B (undiluted 1:10)**: fruit-sweet, slightly bitter edge hot; sweetens as it cools.
- Right = **A (diluted ~1:13)**: reads **thin**. Operator's mechanism read: "I'm bypassing the slightly-less-concentrated form already — it was more special when I was bypassing the super-concentrated one [cup 1's 1:7.5]."
- **Pick RATIFIED (post-hoc, flagged): B — undiluted 1:10 — preferred.**
- Astringency/dryness: **none, either half** (explicit).
- Cool read: B genuinely cool; **A (diluted, warmer from hot bypass water) likely did not reach ~45°C** — cool stage on A tagged compromised. Operator process note: future bypass halves need extra cool-down time before the verdict read (pairs with the temp-parity RP8-N candidate above).

**H-dilution shape emerging:** dilution helped the BELOW-boundary concentrate (cup 1, 1:7.5 → opened up) but HURT the at-optimum concentrate (1:10 → thin). Bypass value appears concentration-dependent, not architecture-intrinsic — the champion bypass architecture works FROM a much stronger concentrate (~1:5.5) than RP8's optimum. Feeds item 56.

### Rung R — protected repeat of winner, 1:10 undiluted — 2026-08-26 (day 2)

**Build:** 15 g @ EG-1 7.0 · 150 g @ 89°C · amended method lock · **yield 115.3 g** · **TDS 1.20%** · press timing not dictated (queried).

**Sensory (operator, dictated):**
- Aroma: fruit-sweet, a lot of complexity — "reminds me of the smell of the other one."
- Hot: fruit-sweet, intense; a tad bitter/astringent at the end — hot-stage only.
- Warm: the bitter edge resolves — re-read as the milk-tea note expressing as "more developed tea," sweetening out into milk tea. Not true bitterness.
- Cool (verdict): fruit, sweet, peach, complex, milk tea at the end, loosening up. "I like the concentration here… a really good cup, reminds me of the one I had before."
- Astringency/dryness: transient hint hot only, re-identified as tea character; **none at verdict stage**.
- Forward instinct (logged for buffer + brief): to make it more unique, go tighter ratio, then diluted-back or straight.

**REPRODUCTION VERDICT (tags consulted: cup 2 missed yield · cup 3 broken blind · TDS chain 1.13/1.13/1.20):**
- **Numeric gate: FAILED narrowly** — 1.20% vs 1.13% = +0.07%, outside the ±0.05% gate by 0.02. Consistent with the lower yield (115.3 vs 124.1 g — less press-through = slightly stronger cup); the mechanism's TDS spread across three 1:10 brews is 1.13–1.20%.
- **Profile gate: PASSED** — same cup character at every stage, verdict-stage read explicitly "reminds me of the one before," zero astringency, no new failure shapes.
- **Overall: REPRODUCED ON PROFILE, MARGINAL ON TDS.** Recorded as a qualified pass: the mechanism reproduces the *cup*; the press's yield variance (±~9 g) moves TDS by ~±0.05–0.07% — yield control is the mechanism's reproducibility lever (RP8-N candidate: press-to-target-yield rather than press-to-hiss for tighter TDS repeats).

### Buffer cup — vial 5 · 1:9 split (operator's-call exploratory) — design locked BEFORE brewing, 2026-08-26

**Operator rationale (verbatim, logged pre-brew):** "I really like this cup (1:10) but if we're going for a concentrated pourover via an aeropress - I'd rather opt to make it more unique - going a little further on the concentration to differentiate it between a pourover experience. I also liked the other version where it opened up with bypass - I think trying that in a more structured version is good."

**Design:** 1:9 (15 g / 135 g), amended method lock, split by weight → half 1 undiluted 1:9 · half 2 **+20% same-kettle bypass** (→ ~1:10.8-strength, deliberately landing next to the liked 1:10 — assistant endorsed 20% over cup 3's 30%, which overshot to thin). **Blind fixes from cup 3's leaks:** diluted half rests to temperature parity before any comparison sip; forced pick BY CODE stated before identities are named.

**Record — 2026-08-26:**

**Build:** 15 g / 135 g (1:9) · amended method lock · **yield 119.7 g** · **TDS 1.30% pre-split**. Split ≈59.9 g/half · **A = undiluted 1:9 · B = +20% same-kettle water** (≈12 g if on target — exact grams queried) → B ≈ ~1.08%-strength, i.e. right at the 1:10 cups' band.

**TDS ladder now coherent and monotone across the mechanism:** 1:7.5 → 1.44% · 1:9 → 1.30% · 1:10 → 1.13–1.20%.

**Sensory (operator, dictated; positions Left=B, Right=A):**
- Left (B, bypassed): fruity, pungent, milk tea; reads "a little watered down" hot (operator guessed identity mid-taste — blind leaked again; dilution is organoleptically tell-y at this delta) — but side-by-side: **more open, more bright, lighter, "sparkliness," bright-light-fruit-sweet, still holds interesting texture.**
- Right (A, undiluted 1:9): more concentration, more punch, more pungent — **"a little bit more of that tannins," heavier, lacks the left's sparkle.** (First tannin note of the track, mild, on the undiluted 1:9.)
- **Pick: B — the bypassed half — explicitly WITH identity known:** "even though I know the left one is the more diluted one, I actually kinda like the left one better." Not a clean blind (flagged), but an against-identity-bias pick — operator preferred the bypass DESPITE knowing, which cuts against the no-bypass prior, not with it.
- Post-pick note (flagged): ~10% bypass might land "a little more in the middle" — untestable, vials exhausted.

**Flags:** blind leaked (identity guessed from strength delta — 2nd occurrence; RP8-N candidate stands) · mild tannin/heaviness on undiluted 1:9 (first appearance of this coffee's pressure signature in the track, at the tightest undiluted ratio scored) · no astringency dictated on B.

**What the buffer answered:** 1:9 undiluted does NOT earn the extra concentration on this coffee — it buys pungency + a first tannin edge and loses sparkle. The winner shape is **~1:10-strength arrived at via concentrate + bypass (1:9 + 20%)** — the champion architecture's value showed up exactly when the bypass landed AT the style's known optimum strength rather than past it (cup 3's +30% overshot → thin → lost). Bypass is a targeting tool, not a dilution tax.

**Closing captures (operator):** bypass ≈12 g on ≈59 g halves (20% by intent; exact grams not recorded — minor RP8-N7 tag) · temp parity achieved before side-by-side ✓ · press timings same shape as prior cups (~1:10 → ~2:05) ✓ · 2 stirs ✓ · astringency: none on either half (explicit).

### Rung R closing captures (operator, post-hoc): press timing same shape (~1:10 → ~2:05) ✓ · 2 stirs ✓.

---

## HANDOFF BRIEF FOR COMPILE SESSION (RP8 Track 5 — AeroPress Low-Pressure Branch Close-Out)

**Date:** 2026-08-26
**Session role:** execution + handoff brief production (no substrate edits)
**Archive location:** branch `claude/aeropress-low-pressure-research-e7bad7` @ `fa977d0cc179aa89c3b7073baf42967545d747cf (archive commit; SHA header finalized in follow-up commit)`, pushed to origin (archive doc committed; substrate NOT; not merged to main). See `role-discipline.md` § Archive persistence.
**Methodology verdict:** ✅ VALIDATES — H-press and H-boundary-m both confirmed; H-dilution returns a NUANCED verdict that amends the style's no-bypass identity rather than upholding or rejecting it.

This brief is the canonical consumption artifact for the RP8 Coordinator (end-document + retro + item-56 drain) and the compile session (substrate fold). It is self-contained; the Assistant-session conversation is not needed.

### TL;DR

- **The concentration boundary is MECHANISM-DEPENDENT, not ratio-intrinsic (H-boundary-m: YES).** 1:7.5 immersion-press produced a coherent, layered, liked, zero-astringency cup — well below the 1:9 boundary where every percolation ladder collapsed.
- **The press mechanism validates (H-press: YES)** — 5/5 coherent cups on the coffee that punishes extraction pressure; astringency essentially absent across the whole track (one mild tannin note, on undiluted 1:9 only).
- **1:10 wins within-mechanism (H-ratio)** — 1:7.5 read "a little too pungent"; the felt optimum sits at ~1:10-strength.
- **H-dilution is the track's headline nuance: bypass is a strength-targeting tool, not a dilution tax.** Bypass-to-optimum WON (buffer: 1:9 + 20% beat undiluted 1:9, with the operator picking against his own known-identity prior); bypass PAST optimum LOST (cup 3: 1:10 + 30% → thin).
- **Cross-day TDS reproduction:** three 1:10 brews = 1.13% / 1.13% / 1.20% across two days; profile reproduced cleanly; TDS ladder monotone (1.44 / 1.30 / 1.13–1.20 at 1:7.5 / 1:9 / 1:10).
- **H-fixed held** on all scored cups; the only method change was a transcription correction (press ≈50 s, total ~2:00 — not a 2-minute press).

### Execution summary

5 cups executed 2026-08-25/26 (cups 1–2 day 1; cup 3, rung R, buffer day 2 — at the 3/day cap), consuming all 5 verified 15 g vials of Moonwake Project One Peach. Methodology held with three capture misses (cup 2 yield consumed unweighed; buffer bypass grams approximate; stray captures backfilled post-hoc) and two blind leaks on split cups (temperature tell on cup 3; strength tell on buffer — dilution deltas this size are organoleptically identifiable, see lessons). The protocol's seed-recipe press-duration transcription was corrected at cup 1 (method-lock amendment, § Cup 1). No fresh control re-brew per scoping (RP8-N10 waived, tagged); cross-mechanism comparisons memory/record-based, tagged throughout.

### Equipment / conditions

| Item | Value |
|---|---|
| Coffee | Moonwake Project One Peach (Catimor yeast-anaerobic natural, Yunnan) — 5 × 15 g vials, physically verified |
| Brewer | AeroPress Premium, inverted, paper micro-filter (flow-control cap + gold-tone excluded) |
| Grinder / grind | EG-1 @ 7.0 (all cups) |
| Water | Plain PA tap, 89°C, zero additions, whole track |
| Method (amended lock) | one continuous pour · 2 stirs (N–S, E–W, saturation only) · steep to 1:00 · flip ~10 s · slow press to first sustained hiss · **~2:00–2:05 TOTAL** (press ≈50–55 s) |
| TDS | VST LAB III, distilled blank 0.00, single read per cup (pre-split on splits) |
| Control | Archived brew `7aef16d6` (Kalita/xBloom 1:15 · 6.3 · 96°C), different brewer — reference only |

### Per-cup raw data

| Cup | Date | Ratio | Water | Yield (g) | TDS | Press | Verdict-stage read | Astringency |
|---|---|---|---|---|---|---|---|---|
| 1 | 08-25 | 1:7.5 | 112 | 70.8 | 1.44% | ≈50 s | Coherent, layered, liked; "a little too pungent"; unscored bypass splash opened it up | None |
| 2 | 08-25 | 1:10 | 150 | MISSED | 1.13% | ≈55 s | Fruit punch / peach candy / melon / jasmine milk-tea structure; H-ratio WINNER | None |
| 3 | 08-26 | 1:10 split | 150 | 124.1 | 1.13% pre-split | ~2:05 total | 62 g + 62 g; A +18 g (30%) → thin, LOST; B undiluted WON (pick post-hoc ratified, blind leaked via temp) | None either half |
| R | 08-26 | 1:10 | 150 | 115.3 | 1.20% | ~2:05 total | Same cup character, "reminds me of the one before"; qualified reproduction pass | Hot-stage hint only, re-read as tea note; none cool |
| Buf | 08-26 | 1:9 split | 135 | 119.7 | 1.30% pre-split | ~2:05 total | ≈59.9 g halves; B +≈12 g (20%, →~1.08%) WON on openness/sparkle vs A undiluted (mild tannin, heavier); operator picked B knowing identity | None either half |

### Analysis

- **TDS ladder (monotone, mechanism-coherent):** 1:7.5 → 1.44% · 1:9 → 1.30% · 1:10 → 1.13/1.13/1.20%. Yield 70.8–124.1 g (bed retention ~30–41 g); yield variance (±~9 g at 1:10) moves TDS ~±0.07% — the press-stop-at-hiss rule is the reproducibility slack.
- **Reproduction (rung R):** numeric gate ±0.05% FAILED by 0.02 (1.20 vs 1.13); profile gate PASSED cleanly; cross-day 1.13→1.13 replicate (cups 2→3) independently supports mechanism stability. **Verdict: reproduced on profile, marginal on TDS; qualified pass.** Tags consulted: cup-2 missed yield, cup-3 broken blind — neither undermines the profile verdict.
- **Dilution response is concentration-dependent:** below-boundary concentrate (1:7.5) improved with dilution (unscored but directional); at-optimum (1:10) degraded with +30% (thin); above-optimum (1:9) improved with +20% landing AT the optimum band. One consistent model fits all three: **~1.1% (~1:10-strength) is where this coffee's press-mechanism cup lives; bypass is valuable exactly insofar as it lands there.**
- **Astringency:** essentially absent track-wide on the coffee whose defining failure mode is extraction-pressure astringency. First and only tannin note appeared on undiluted 1:9 — the tightest undiluted ratio scored.
- **Hot-read behavior:** disjointed-hot NEVER appeared (5/5 cups coherent hot) — the immersion-press concentrate compresses this coffee's cooling-dependent integration (stage-compression analog, coffee-dependent per T2, now observed on a second mechanism).

### Final output

**Track winner:** **1:10 (15 g / 150 g) immersion-press, undiluted** — TDS 1.13–1.20%, yield ~115–124 g, ~2:00–2:05 total, zero astringency, fruit punch / peach candy / melon / jasmine milk-tea profile, reproduced cross-day on profile. **Co-equal serving form (buffer evidence):** 1:9 concentrate + ~20% bypass to ~1:10-strength — trades a little punch for openness/sparkle/brightness; operator preference in direct comparison. Repeat verdict: qualified pass (profile ✓, TDS +0.02 outside gate, yield-variance-explained).

### Key findings

1. **Boundary is mechanism-dependent (H-boundary-m: YES).** 1:7.5 immersion-press coherent + liked where 1:9 percolation collapsed on three coffees. Data: cup 1 full record. Substrate implication: the style's concentration boundary must be stated per-mechanism, not as a ratio constant (item 56 vocabulary).
2. **Immersion + slow press is the gentlest contact mechanism in the project (H-press: YES).** Zero verdict-stage astringency in 5 cups on the pressure-punishing coffee; the tannin tax that T3 attributed to grind does not appear at 7.0 under press contact. Data: astringency line, every cup.
3. **~1:10-strength (~1.1% TDS) is the style optimum under the press mechanism too (H-ratio).** The project's gravity/valve optimum re-emerges under a different mechanism — optimum strength appears mechanism-independent even though the boundary is mechanism-dependent. Data: cups 1/2 serial call + buffer.
4. **Bypass amends the no-bypass identity (H-dilution: NUANCED).** Bypass-to-optimum won (buffer, against-known-identity pick); bypass-past-optimum lost (cup 3). The champion concentrate+bypass architecture is right about bypass as a *strength-targeting* tool from a stronger concentrate; RP8's no-bypass identity survives only as "no dilution past optimum," not as an architecture principle. Data: cup 3 + buffer records. **This is the item-56 feed.**
5. **Mechanism reproduces on profile; TDS repeatability is yield-limited.** Press-to-hiss leaves ±~9 g yield slack → ±~0.07% TDS. Data: rung R vs cups 2/3. Implication: press-to-target-yield if tighter repeats ever matter.
6. **Stage-compression on a second mechanism:** disjointed-hot absent 5/5 on the poster-child cooling-dependent coffee. Data: flags, every cup.
7. **Project-level mechanism map (close-out-shaping paragraph):** With all four mechanisms read — **grind (T1/T2)** sets the gravity ladder and its 1:9 boundary and carries the tannin tax; **valve (T3)** is percolation's best form (contact control without grind pressure); **drops (T4)** is a serving-side layer on the finished cup (locked office dose, blind-verified); **press (T5)** is the boundary-breaker and the astringency-free form, reaching below 1:9 coherently and reproducing on profile — the style's best forms are now two: **valve-driven percolation at 1:10** (percolation clarity character) and **immersion-press at 1:10-strength** (round, layered, astringency-free; arrived at directly at 1:10 or via 1:9 + ~20% bypass), with drops available on either as serving-side enhancement. Mechanism choice is a character choice, not a quality ranking; the boundary and the failure modes, not the optimum strength, are what change with mechanism.

### Substrate edit specifications for compile session

DO NOT execute these edits in this session — the compile session integrates substrate.

1. **Protocol-doc scoping correction (this file, § Operator platform decisions):** the seed-recipe line "very slow press lasting ~2 minutes (… total ~3 min)" is a transcription error — lived method is press ≈50 s, **~2:00 total**. Corrected operationally at cup 1 (method-lock amendment); the scoping paragraph itself left unedited by the Assistant to preserve the audit trail. Compile session may annotate.
2. **Grilling item 56 (docs/grilling-queue.md — drain input, not an edit yet):** feed Finding 4 verbatim — the style's identity statement should become "no dilution past optimum" (bypass-to-optimum sanctioned as a serving form) rather than "no-bypass." Also feed Finding 1 (boundary is per-mechanism) and Finding 7 (mechanism map) as vocabulary inputs. Data source: cup 3 + buffer records above.
3. **RP8 end-document (Coordinator-authored at close-out):** Finding 7's mechanism-map paragraph is the close-out-shaping statement — carry it as drafted.
4. **Brewing-cluster candidate (defer to Coordinator triage — likely docs/skills/brewing-assistant or CONTEXT-brewing after item 56 drains):** an AeroPress immersion-press method card (amended method lock, § Equipment/conditions table) IF the style graduates to routine use. Not before item 56 resolves vocabulary.
5. **Audit items P8-AI-7/8:** remain parked (low priority) — no new evidence this track.

### New lessons captured

| # | Lesson | Substrate implication |
|---|---|---|
| RP8-N13 (cand.) | Hot bypass water breaks split-cup blinds twice over: temperature tell + the strength delta itself is organoleptically identifiable at ≥20%. Temp-parity rest fixes the first; nothing fixes the second — weight split verdicts accordingly, and treat an against-known-identity pick as the strongest available signal shape. | Split-protocol refinement (T4 protocol amendment candidate) |
| RP8-N14 (cand.) | Press-to-hiss leaves ±~9 g yield slack → ±~0.07% TDS at 1:10. Press-to-target-yield is the fix when numeric reproduction matters. | Repeat-gate methodology for press-mechanism tracks |
| RP8-N15 (cand.) | A protocol's transcription of a lived recipe is itself a claim to verify at cup 1 — walk the timeline numbers back with the operator before the first scored cup (the "~2-min press" was really "~2-min total"). | Spawn-prompt / Step-0 method-walk-through refinement |

### Audit items queued

1. Seed-recipe press-duration transcription error in this doc's scoping § (status: **resolved operationally** at cup 1; compile session may annotate the scoping text — spec 1).
2. P8-AI-7 / P8-AI-8 — parked, unchanged.

### Open data items

1. Cup 2 liquid yield — permanently missed (consumed unweighed). Non-blocking; cup 3/R yields bracket it.
2. Buffer exact bypass grams (~12 g by intent) — approximate. Non-blocking.
3. Operator's post-pick "~10% bypass might land more in the middle" — untested, vials exhausted. Candidate probe if the style graduates; not a track gap.
4. H-boundary-m tested at one below-boundary ratio (1:7.5) on one coffee — verdict YES stands on this evidence but is single-coffee; the end-document should carry that scope note.

### Recap map for compile session

Integrate first: item-56 feed (spec 2 — Findings 1/4/7 are its inputs) and the end-document mechanism map (spec 3). Defer: the method-card candidate (spec 4) until item 56 drains. Escalate to operator: nothing — all in-track calls were made and ratified live; the only operator decision outstanding at project level is close-out sequencing (end-doc → process retro → item 56), which is the Coordinator's queue.

### Protocol-execution friction captured

1. Seed-recipe press-duration transcription error surfaced only at cup 1's timeline numbers (→ RP8-N15).
2. Two capture misses under bench flow (cup 2 yield; buffer bypass grams) — both first-class numbers per RP8-N12; the "weigh before you drink" prompt needs to fire at press-stop, not at report time.
3. Split blinds leaked twice (→ RP8-N13); the forced-pick-before-reveal sequencing also failed once (cup 3) under dictation flow — the pick prompt should be extracted as its own numbered bench step, not folded into the tasting dictation.
4. Cup 3's brew date was initially mis-logged as day 1; corrected on operator report. Per-cup date should be asked at build capture, not inferred.

---

### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Archive doc committed + pushed to branch `claude/aeropress-low-pressure-research-e7bad7` @ `fa977d0cc179aa89c3b7073baf42967545d747cf (archive commit; SHA header finalized in follow-up commit)` (authorized archive-persist exception)
- ✅ Handoff brief produced above; branch + SHA in the `Archive location:` header for the compile session
- 🛑 Session terminating after this brief lands. The compile session integrates substrate per the design pattern.

End of RP8 Track 5 close-out.
