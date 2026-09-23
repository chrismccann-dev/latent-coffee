# Output Fractionalization — Track 2: Tabaco Pata SL9, SWORKS valve fractions

*Research Project #9 (RP9) — Output Selection / Fractionalization · OFFICE LANE*
**Status:** DRAFT — pending operator audio sign-off at scoping
**Coordinator:** persistent RP9 Coordinator session
**Protocol authored:** 2026-09-15

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE — READ THIS FIRST

You (the session reading this at execution time) are the **Research Assistant** for this track. Your job is **execution + handoff brief production.** Your job is **NOT substrate integration.**

**DO NOT:**
- Edit `lib/*-registry.ts` files
- Edit `docs/skills/*/cluster/*.md` files
- Edit ADR files
- `git commit` / `git push` SUBSTRATE edits, merge to main, or `gh pr create` (the archive-persist commit of THIS doc is the ONE authorized exception)
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)
- Continue past the handoff brief to "finish the job"
- Call `push_brew` — RP9 default is doc-only trial records (opt-in has NOT been given)

**DO:**
- Read this doc in full BEFORE Step 0
- Walk the operator through Step 0 primitives
- One tool call per scored cup/condition (tool-call-per-pull pacing)
- Capture friction + lessons + audit items inline in this doc (the doc IS the archive)
- Produce a handoff brief per `docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md`
- Commit + push THIS doc to your session branch at termination; report branch + SHA in the brief's `Archive location:` header
- Terminate with the explicit termination declaration block

Full primitive doc: `docs/skills/research-coordinator/cluster/role-discipline.md`

---

## Office-lane charter (inherited wholesale — do not re-negotiate)

Per [`office-lane.md`](docs/skills/research-coordinator/cluster/office-lane.md): ≤15 min per experiment cup all-in · serial cadence, ≤~3 cups/office day, sessions span calendar days · single TDS read per sample · no thermometer (stages by feel) · no pour timestamps beyond count + rough final-pour timing · blank NUMBER recorded at every instrumented sitting open · one bench-free parameter max · actual brew date recorded per cup · per-vial weigh + physical count at Step 0 (shared freezer volatile; coffee lock PRESUMPTIVE until the physical check).

**TDS instrumentation fires AFFIRMATIVELY** — VST LAB III at every sitting, re-zeroed with recorded blank number.

## Track-1-graduated bench refinements (BAKED IN — these are the track's operating defaults)

- **Per-pour tared recipe, never cumulative** (RP9-N1): TARE between pours; recipe stated as per-pour weights below.
- **Sample vials + batched TDS reads at end of brew** (RP9-N2): collect a labeled sample per fraction during the brew; run all VST reads in one batch afterward (one re-zero, no mid-brew meter churn).
- **Expect a ~0.05-0.08 downward offset** on measured vs predicted TDS over long bench sequences (RP9-N3); treat as offset, not scatter (P9-AI-1 open on its cause).
- **Own-brew tail is the splash source** (T1 Key finding 7: tail TDS is bed-state-dependent).
- **Schedule verdict-bearing reads BEFORE free tasting of remainders** (T1 friction 4) — the protocol'd read runs first, then play.
- **Matched-TDS side-by-sides are the cleanest character-vs-strength instrument** (RP9-N4): if two conditions land at equal TDS, exploit it explicitly in the read.

## Project framing (why this track)

Track 1 (Blue Iris, yeast-anaerobic honey Catimor) closed 2026-09-14: method validated (H-artifact PASS), gradient + recombination arithmetic confirmed (H2), the operator thesis held (H1: 1:10 ≈ front retention), removal vs concentration read as distinct levers at matched TDS (H3 directional), and the preference peak was **front-weighted re-proportion with trace tail (~5-8% of cup mass)** — not a hard front-cut. Blue Iris: REWARDS output selection.

**Track 2's job is the generalization test.** Tabaco Pata is the deliberate contrast: clean washed SL9 (Ethiopian-landrace selection, Peru/Cusco) vs Blue Iris's process-heavy honey. The taxonomy question in its sharpest form: **does a clean, tea-like, bright coffee also peak at front-weighted re-proportion — or is its tail pleasant enough that the full cup wins?** Either answer is the taxonomy doing its job: if the SL9's full cup wins, "rewards output selection" genuinely splits by coffee.

## Hypotheses (pre-state predicted outcomes before scoring)

- **H1-t2 (front-retention generalizes):** a fresh 1:10 concentrated valve cup reads closer in character + strength to the B+P1 recombination than to the full cup, on this coffee too. *Test: sitting 3 side-by-side, temp-matched; exploit matched TDS if it lands (RP9-N4).*
- **H2-t2 (gradient + arithmetic replicate):** monotonic TDS decline F-B > F-P1 > F-P2; recombination TDS predicted by weight arithmetic within the standing ~0.05-0.08 offset. *Cheap confirm — the arithmetic is now the design tool, not the question.*
- **H3-t2 (the taxonomy fork — this track's verdict-bearing question):** does the SL9 reward output selection? Candidate outcomes to adjudicate: (a) front-weighted re-proportion wins again (pattern generalizes); (b) full cup wins (taxonomy splits by coffee — the tail is a contributor here, not a tax); (c) some other proportion wins (e.g. tail-forward never, but a bigger tail share than Blue Iris's trace). *The straight F-P2 read is the leading indicator: archive says this coffee is tea-like + bright with NO archived bitter-tail history — the tail may be pleasant.*
- **H-artifact-confirm (cheap, day-fresh):** full recombination reads as the control cup. The method is validated (T1); this is a per-coffee confirm with an unusually strong comparator — the control was brewed 2026-09-15, so the comparison is same-week memory, not cross-months. *Single read at sitting 1; a FAIL here is surprising and pauses the track.*

## Track-2 coffee (LOCKED at scoping 2026-09-15 — PRESUMPTIVE until Step 0 physical count)

| Field | Value |
|---|---|
| Coffee | **Moonwake — Tabaco Pata — Juanito Navarro — Washed SL9 — Peru** (Juan Peña producer row; Inkawasi, Cusco/Puno; first SL9 in the archive) |
| Archived control brew ID | `10c46241-00d0-40fb-8c7e-54fb32e4f97e` (2026-09-15, converged brew 1, locked deliberately without optimization passes AS the RP9 control) |
| Control recipe (per-pour, tared) | **SWORKS Bottomless** + xBloom Premium paper · 15 g / 240 g (**1:16**) · **EG-1 6.2** · **96°C** (boil + ~60-90 s off-base) · office PA tap + Apax cup-dosing · **Graduated Taper:** Bloom 45 g, Dial 0 → TARE, Pour 1 to **105 g** (Dial 5, front-building, = 150 g cumulative) → TARE, Pour 2 to **90 g** (Dial 6, = 240 g cumulative) → Dial 7 drawdown flush · total ~3:00-3:30 |
| Control profile | Cranberry / lime / raspberry / black tea · light + tea-like · **hot-cup oversteep read is a TRANSIENT that integrates on cooling** — do not misread it as a flaw hot; peaks cool |
| Vials | **11 × 15 g** (12 at dial-in minus the control; weigh + count at Step 0) |
| Track budget | **5 vials for the track** (mirrors T1's proven shape); the remaining ~6 stay normal office stock — the track does NOT expand to consume them |

**Fraction boundaries** = the recipe's own pour boundaries: **F-B** (bloom, expect ~15-20 g out), **F-P1** (the Dial-5 front-building window to 150 g cumulative), **F-P2** (the Dial-6 pour through the Dial-7 flush — the flush belongs to F-P2). Valve close (Dial 0) + cup swap + TARE at each boundary; drain-to-trickle wins over the pour schedule (T1 pin, carried).

**Timing gap (known):** the archived row carries dials + weights but not pour start times. Transcription-verify at cup 1 (RP8-N17) reconstructs the lived timeline with the operator — capture it in this doc as the canonical restatement.

**Coffee-specific cautions:**
- **Cool-weighted verdicts, strictly** — the archive shows this cup integrating only in the cool window (hot reads oversteeped-transient). Fraction reads hot will exaggerate the front's intensity and the tail's flatness; wait for cool on anything verdict-bearing.
- **No archived bitter-tail history** (unlike Blue Iris). If F-P2 straight tastes *good*, that is the H3-t2 fork showing itself — record it carefully, it is the track's most taxonomy-relevant single read.

## Sitting plan (5 track vials; sittings span office days; ≤15 min/cup; serial)

| Sitting | Vials | What happens |
|---|---|---|
| **1 — Straight fractions + full recombination** | 1 | Fraction brew (sample vials per fraction, batched TDS after) → weigh each fraction → **protocol'd reads FIRST:** full recombination built ratio-true from fractions → TDS + taste vs the day-fresh control memory (H-artifact-confirm) → then straight fraction tastes, cool-weighted (F-P2 read is the H3-t2 leading indicator) → mass balance (H2-t2). Free remainder tasting only after all protocol'd reads. |
| **2 — Pairwise combos + proportion probe** | 1 | Fraction brew → confirm gradient → build **B+P1**, **P1+P2**, and (replacing T1's B+P2, which read muted and is low-information here) a **front-weighted re-proportion cup** approximating the T1 winner shape (concentrated front + trace tail, Assistant computes from actual weights; predicted TDS pre-build). Preference-order all three + remainder full recomb. This sitting gives H3-t2 its first direct answer. |
| **3 — H1-t2 head-to-head + splash ladder** | 2 | Back-to-back: fraction brew → B+P1 cup (all of F-B + F-P1); fresh **1:10 concentrated valve cup** (15 g / 150 g; grind starting point **~5.8** per the −0.07 to −0.1/pt rule from 6.2, taste-fit sanctioned, record actual; Graduated-Taper-shortened structure — operator's call at bench, record it). Temp-match, side-by-side (H1-t2; exploit matched TDS if it lands). Then the splash ladder on whichever cup wins: +~5 g / +~10 g own-tail steps, predicted TDS each — does the trace-tail peak generalize (H3-t2 confirm)? |
| **(reserve)** | 1 | Repeat of the verdict-bearing claim (protected if it gates the taxonomy read; droppable-with-anecdote-tag otherwise). |

**Budget-conditional waivers (conscious, logged):**
- **Pre-pull-1 calibration shot WAIVED** — control brewed on this bench 2026-09-15 by the operator; substitute: RP8-N17 transcription-verify at cup 1 (which also fills the timing gap).
- **Rung-0 control re-brew WAIVED** — sitting 1's full recombination is the in-cup control, compared against same-week control memory (strongest comparator any RP9 track has had; still tagged memory-based).

## Step 0 (run to completion before any scoring)

1. **Physical count + per-vial weigh** (primitive 9) — 11 presumptive vials; log count + grams; confirm 5 allocated to the track.
2. **VST re-zero + blank number recorded** (primitive 7) — EVERY sitting open.
3. **Transcription-verify** (RP8-N17) — walk the Graduated Taper timeline (pour start times, dial transition points, flush behavior) back with the operator; record the canonical per-pour restatement in this doc.
4. **Cup logistics check** — labeled fraction cups + sample vials for batched TDS; swap cleanliness on the SWORKS.
5. **Pre-state predicted outcomes** for H1-t2 / H2-t2 / H3-t2 / H-artifact-confirm in this doc before the first scored read.

## Recording sheet (per fraction / per combo)

`sitting # · brew date · vial weight · fraction/combo ID · weight (g) · TDS (blank #) · predicted TDS (combos) · taste note (cool-weighted; aroma / structure / finish) · preference position · flags (RP8-N7)`

## Inherited lessons that change behavior in this track

- **RP9-N1 / N2 / N3 / N4** — baked into the refinements section above; they are defaults, not options.
- **RP9-N5** — a displaced protocol read can be re-homed via remainder recombination; prefer not to need it (verdict reads run first).
- **RP8-N7** — tag missed/compromised reads at capture. **RP8-N13** — weigh every capture. **RP8-N15** — unblinded by design; weight ordering claims accordingly. **Lesson #7** — tool-call-per-cup pacing.

## Exit conditions

Track closes when sittings 1-3 complete (or consciously curtailed with reason), H1-t2/H2-t2/H3-t2/H-artifact-confirm each carry a verdict or an explicit "unresolved because X," the SL9 taxonomy entry is drafted in the brief (rewards / doesn't reward / conditional — with the winning proportion), and the handoff brief lands. If H-artifact-confirm FAILS, pause and surface to the operator.

## Open questions (carried from Track 1 + scoping)

- **The taxonomy fork (H3-t2)** — the project's output hangs on whether the T1 pattern generalizes.
- P9-AI-1 (offset cause) + P9-AI-2 (sample-temperature TDS reads) remain open watch-items — note any evidence either way, don't chase them.
- "Down-weight" vocabulary is grilling item 58 — generate evidence, don't resolve vocabulary in-track.
- Track 3 shape (if any): decided by the Coordinator after this brief — candidates include a third contrast coffee or project close if two coffees give the taxonomy its shape.

---

## Notes / friction / lessons / audit items (Assistant: append inline during execution)

### Step 0 record (2026-09-16, operator at bench)

1. **Physical count + per-vial weigh:** **15 vials × 15 g** counted. ⚠️ **AUDIT ITEM P9-AI-3:** presumptive was 11 (12 at dial-in minus control); physical count is +4. Physical count is ground truth — track runs on 5 vials, ~10 remain office stock. Cause unconfirmed (likely dial-in ledger undercount); operator to confirm if known.
2. **VST re-zero:** done; **blank = 0.00**.
3. **Transcription-verify (RP8-N17) — canonical Graduated Taper restatement (fills the timing gap):**
   - 0:00 **Bloom** → 45 g, gentle spiral to full saturation, **Dial 0 (closed)** throughout bloom
   - 0:30 **Pour 1** → to 150 g cumulative (105 g tared), slow center-out spiral, **Dial 5** opens as the pour starts (front-building window)
   - 1:30 **Pour 2** → to 240 g cumulative (90 g tared), gentle spiral once bed drops, **Dial 6** as the pour starts; at 240 g in, **Dial 7 (Open)** drawdown flush, undisturbed to dry bed
   - Drawdown complete ~3:00-3:30 · EG-1 6.2 · 96°C · SWORKS Bottomless + xBloom Premium paper · PA tap + Apax (1 JAMM + 1 TONIK per ~200 mL finished cup)
4. **Cup logistics:** confirmed (labeled fraction cups + sample vials; SWORKS swap cleanliness).
5. **Pre-stated predictions:**
   - H-artifact-confirm: **PASS** predicted (recombination ≈ control; TDS within ~0.05-0.08 offset of arithmetic).
   - H2-t2: monotonic F-B > F-P1 > F-P2; arithmetic holds within offset.
   - H1-t2: 1:10 valve cup reads closer to B+P1 than to full cup.
   - H3-t2: **lean toward outcome (c)** — F-P2 straight reads pleasant; winning proportion carries a larger tail share than Blue Iris's trace, but a front-weighted build still edges the full cup. Recorded as a lean, not a call.

**Step 0 COMPLETE 2026-09-16.**

### Sitting 1 (2026-09-16, vial 1/5, blank 0.00)

| Fraction | Weight (g) | TDS | Note |
|---|---|---|---|
| F-B | 24.5 | 1.77 | slightly above expected 15-20 g out |
| F-P1 | 79.0 | 1.47 | |
| F-P2 | 98.8 | 0.74 | |

- **H2-t2 gradient: CONFIRMED** — monotonic F-B > F-P1 > F-P2.
- Mass balance: 202.3 g out / 240 g in → 37.7 g retained (~2.5 g/g on 15 g dose, plausible).
- Full-recombination predicted TDS (weight-arithmetic): **1.15**; with RP9-N3 offset, expect measured ~**1.07-1.10**.
- **Recombination measured TDS: 1.03** — offset **0.12**, slightly LARGER than the standing 0.05-0.08 band. Logged as P9-AI-1 evidence (noted, not chased). Arithmetic + direction hold; H2-t2 substantively confirmed.
- **H-artifact-confirm: PASS.** Warm: raspberry, lime acidity, brown tea. Cool (verdict window): raspberry, lime, tart, earthy brown tea — "kind of how I remember it… pretty much like I remember it" vs the same-week control. Aroma: slightly sweet, nutty, earthy.
- **Straight fractions (cool-weighted):** F-B "strong and pungent… a little intense" · F-P1 "concentrated, nice acidity" — operator's favorite fraction · F-P2 "more tea-like, very light" — pleasant, no bitterness.
- **⭐ H3-t2 leading indicator — the fork shows, in a NOVEL direction:** on this coffee the candidate tax is the **FRONT (bloom)**, not the tail. Operator's hypothesized winning build, unprompted: **remove the bloom, keep P1, splash in a little P2.** Inverts the T1 shape (T1 kept bloom, cut to trace tail). Tail is a contributor here (consistent with the pre-stated outcome-(c) lean, but bloom-removal is a new axis the T1 taxonomy didn't have).
- Sitting 1 protocol'd reads complete; sitting closed. Vials remaining: 4 track.

### Sitting 2 plan (LOCKED with operator post-sitting-1)

Single sitting, 1 vial, all combos from one fraction brew (side-by-side beats cross-day memory; 5-vial budget honored — operator floated spacing across sittings using spare stock, declined for comparability + budget discipline; spare-stock use is a Coordinator call, noted for the brief). Third cup SWAPPED from the T1-winner re-proportion shape to the operator's hypothesized winner (bloom-cut + trace tail) per the sitting-1 fork:
1. Fraction brew → weights only. **Adjustment (2026-09-17, operator-proposed, accepted):** per-fraction TDS SKIPPED at sitting 2 — gradient already confirmed sitting 1 and not verdict-bearing here; TDS reads go to the three builds + remainder recombination instead. Build predictions therefore use sitting-1 fraction TDS with sitting-2 weights (tagged RP8-N7: softer predictions, within tolerance).
2. **B+P1** (~1.54 predicted, pre-offset) · 3. **P1+P2** (~1.06 — **RP9-N4 matched-TDS exploit vs full recombination (1.03): pure bloom-character read**, call out explicitly) · 4. **P1 + ~12% P2 trace** (~1.38).
5. Preference-order all three + remainder recombination, cool-weighted.

### Sitting 2 record (2026-09-17, vial 2/5, blank 0.00, **run BLIND by operator choice** — exceeds RP8-N15)

Fractions (weights only per adjustment): F-B 24.0 g · F-P1 90.9 g · F-P2 86.5 + 2.6 flush = 89.1 g (flush barely produced — bed near-dry at Dial 7; front-heavier split than sitting 1, drain-to-trickle variance).

| Cup (blind position) | Build | Predicted TDS (day-1 fraction TDS) | Measured | Taste (no hot/cool ladder — long bench, tasted as-is) |
|---|---|---|---|---|
| Left = **B+P1** | 9.5 B + 35.5 P1 | 1.53 | **1.40** | Pungent, sour-leaning; improves as it cools ("kind of like this") but head-to-head "just a little too pungent" |
| Middle = **P1+P2** | 22.5 + 22.5 | 1.11 | **1.40** ⚠️ | "Much softer, more citrusy, juicy… opened up" — acid-forward, raspberry-forward, lots going on |
| Right = **P1-trace** | 33 P1 + 4.5 P2 | 1.38 | **1.20** | "A little more off… more tart" |

Extras: F-B straight 1.81 TDS (vs 1.77 day 1) · F-P2 straight 0.60 (vs 0.74 day 1) · P1 fully consumed, no straight read.

- **Preference order: P1+P2 > B+P1 > P1-trace.** Blind.
- **RP9-N4 matched-TDS exploit LANDED literally:** B+P1 and P1+P2 both measured 1.40 — a pure bloom-vs-tail character read at identical strength. **At matched TDS, the bloom-in cup LOST to the tail-in cup.** This is the sitting's verdict-bearing read.
- ⚠️ **Consistency flag (RP8-N7):** implied same-day P1 TDS from B+P1 (1.29) and P1-trace (1.28) agree; the P1+P2 measured 1.40 is arithmetically inconsistent with both (implies P1 ≈ 2.20). One of the three reads (most likely P1+P2, under-mixed or read error) is off. The PREFERENCE read is unaffected (blind, character-based); the matched-TDS framing carries this caveat. Logged, not chased (P9-AI-1 adjacent).
- **H3-t2 first direct answer: outcome beyond the pre-stated lean** — not trace tail, the FULL tail: bloom-cut + full P2 wins. On this coffee the bloom is the tax and the tail is a genuine contributor. P1-trace (Assistant's pre-stated pick) finished LAST — possibly confounded by its lower strength (1.20).
- Vials remaining: 3 track.
- **As-run notes (post-sitting debrief):** (1) operator collected the Dial-7 flush as a separate 4th cup (2.6 g) — folded into F-P2 per protocol; standing correction: flush drains into the P2 cup, three fraction cups only. (2) **CONFIRMED lived practice, not a one-off (operator, 2026-09-17): pour 2 runs Dial 5 until 240 g in, then Dial 6 to finish — on ALL brews of this coffee including the archived control.** The archived control row's recipe card (Dial 6 → Dial 7 flush at 240) is a transcription drift from lived execution. Track-internal comparisons unaffected (fraction brews and control share the lived recipe). **AUDIT ITEM P9-AI-4:** control brew `10c46241` recipe restatement needs correction to the lived timeline (Coordinator/substrate action, outside Assistant role). The canonical Graduated Taper restatement in Step 0 above is AMENDED accordingly: pour 2 = Dial 5 → Dial 6 at 240 g in → drawdown to dry bed (no Dial 7 step in lived practice). (3) Terminology clarified with operator: "flush" (brew step, part of P2) ≠ "P1-trace" (built tasting cup, now retired after last-place finish).

### Sitting 3 plan (LOCKED with operator 2026-09-17)

2 vials, back-to-back, next office day:
1. **Brew A** — fraction brew, 3 cups (flush into P2), weights only. Build **full recombination** (~45 g ratio-true) vs **P1+P2** (~45 g) → cool head-to-head = **the taxonomy verdict read**. B+P1 dropped from preference (lost twice).
2. **Brew B** — fresh **1:10 valve cup** (15 g / 150 g, grind ~5.8 start, structure operator's call, record actuals).
3. **Winner of (1) vs the 1:10**, temp-matched.
4. Optional cheap H1-t2 preserver: small **B+P1 comparator** (~30 g) from Brew A leftovers alongside the 1:10; if skipped, H1-t2 logged as adapted-to-winner.
5. Reserve vial (5th) stays protected for a repeat of whichever read ends up gating the taxonomy entry.

### Sitting 3 record (2026-09-23, vials 3+4/5, blank 0.00, **4-way FULLY BLIND** — operator re-cupped the 1:10 to kill the volume tell)

Brew A fractions: F-B 21.5 g · F-P1 87.3 g · F-P2 94.4 g (lived pour-2 recipe: Dial 5 → 6 at 240 g). Builds: FULL 4.8/19.3/20.9 · P1+P2 21.6/23.4 · B+P1 5.9/24.1. Brew B: fresh 1:10 valve cup (15 g/150 g, grind ~5.8; structure as-run TBD from operator).

Blind positions + reads:
1. **FULL recomb** — "too pungent, too acidic… my guess is this is the bloom-centric one… don't like this as much." (Operator surprised at reveal: did NOT pick the full cup as the full cup.)
2. **1:10 concentrated** — "nice, sweet, pungent, concentrated… I like this one." Head-to-head vs 3: "more front-weighted, more punch."
3. **P1+P2** — "more elegant… more balanced… more depth of flavors." WINNER of 2-vs-3: "if I'm going for elegance, delicateness, layers of flavors, I'd go number three."
4. **B+P1** — "also a little too front pungent… don't like this one as much."

- **H3-t2 VERDICT: P1+P2 (bloom-cut, full tail) beats the FULL cup, blind.** Tabaco Pata SL9 REWARDS output selection — by bloom removal, the inverse of Blue Iris's tail-cut. Operator's apex vocabulary ("layers of flavors", elegance, balance) attached to the bloom-cut build.
- **H1-t2: front-retention generalizes as a method property** — the fresh 1:10 read as front-weighted punch, character-family of B+P1, distinct from bloom-cut elegance. Preference is conditional: 1:10 when wanting punch, P1+P2 when wanting elegance.
- TDS (blank 0.00): FULL **1.02** (pred 1.16) · 1:10 **1.36** · P1+P2 **0.98** (pred 1.09) · B+P1 **1.47** (pred 1.53).
- **Matched-TDS verdict clean:** FULL vs P1+P2 within 0.04 — the blind win is character, not strength. FULL 1.02 replicates sitting-1 recombination (1.03).
- Offsets 0.06-0.14, again above the 0.05-0.08 band — further P9-AI-1 evidence (predictions used sitting-1 fraction TDS; softness expected).
- 1:10 as-run structure (captured): 15 g / grind ~5.8 / **45 g bloom 30 s (valve closed) → Dial 5, +100 g → Dial 5 to end** (~145 g total in vs 150 nominal).
- Sittings 1-3 complete.

### Sitting 4 — verdict replicate (LOCKED with operator 2026-09-23)

Operator-designed upgrade: **two fresh brews, head-to-head** — vial A brewed as the straight control recipe (a REAL full cup, not a recombination) vs vial B fraction-brewed with the bloom cup discarded/held out (a lived bloom-cut P1+P2, no rebuild). This tests the actual practice claim: "brew it and cut the bloom." **Uninstrumented by conscious waiver — no TDS reads** (RP8-N7 tag; taste-only replicate; strength-matching evidence already on file from sitting 3's 1.02 vs 0.98).
- **Budget note:** uses 2 vials where 1 reserve remained → track total 6 vials, a conscious +1 expansion authorized by the operator (spare stock ample at 15-count; logged for the Coordinator).
- Blindness: pour both into matched cups at equal volume (full brew yields ~200 g vs bloom-cut ~180 g — trim to match, or the volume tell returns).

### Sitting 4 record (2026-09-23, vials 5+6, uninstrumented by waiver, blind 2-cup)

- Left = **FULL** (lived control brew): "a little astringency, off balance, muddledness… strong acidity, rest of cup feels off balance because of that pungentness." Cooler: opens a little, some nuttiness.
- Right = **bloom-cut P1+P2** (lived): "clear, crisper, more clarity of flavor, less muddledness." Cooler: "brighter, juicier, crisper." Head-to-head: "the right one just feels much more cleaner and crisper."
- Operator guessed right = no-bloom BEFORE reveal. **REPLICATED: bloom-cut beats full cup, blind, on fresh lived brews (not rebuilds).**
- Operator close note: "I do think this one is a bit more because of this coffee specifically — seems like the bloom is the tax on this one." (Per-coffee taxonomy framing, operator's own words.)
- New observation both cups: a nuttiness the operator isn't sure belongs — noted, not chased.

## TRACK CLOSE (2026-09-23) — verdicts

- **H-artifact-confirm: PASS** (sitting 1; recomb ≈ same-week control; FULL TDS replicated 1.03/1.02 across sittings 1/3).
- **H2-t2: CONFIRMED** — monotonic gradient; arithmetic predictive, with offsets running 0.06-0.14 (above the 0.05-0.08 band; P9-AI-1 evidence).
- **H1-t2: CONFIRMED as method property** — fresh 1:10 reads front-weighted/punchy, character-family of B+P1; preference conditional (punch vs elegance).
- **H3-t2 VERDICT: outcome (b)-adjacent, novel axis — Tabaco Pata SL9 REWARDS output selection via BLOOM REMOVAL (full tail kept), the inverse of Blue Iris's tail-cut.** Winning build: P1+P2 (bloom-cut, everything else). Replicated blind ×2 (sitting 3 rebuild + sitting 4 lived brews). Trace-tail shape (T1 winner) finished last on this coffee.
- **SL9 taxonomy entry draft: REWARDS output selection — conditional/per-coffee, tax fraction = BLOOM.** Winning proportion: cut F-B entirely (~10% of cup mass), keep P1+P2 in full. The taxonomy now splits not just on WHETHER a coffee rewards selection but on WHICH fraction is the tax (Blue Iris: tail · Tabaco Pata: front).

---

## HANDOFF BRIEF FOR COMPILE SESSION (RP9 Track 2 — Tabaco Pata SL9 Valve Fractions Close-Out)

**Date:** 2026-09-23
**Session role:** execution + handoff brief production (no substrate edits)
**Archive location:** branch `claude/output-fractionalization-research-d6c46a` @ `<SHA-filled-at-commit>`, pushed to origin (archive doc committed; substrate is NOT; not merged to main). See [`role-discipline.md` § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md).
**Methodology verdict:** ✅ VALIDATES — method artifact-clean on a second coffee; H3-t2 resolved with a NOVEL taxonomy axis (tax fraction is per-coffee).

This brief is the standalone consumption artifact for the RP9 Coordinator and the compile session. All raw data lives in the sitting records above in this doc; the brief distills verdicts, substrate edit specs, lessons, and audit items. Consume without the Assistant-session conversation.

### TL;DR

- **Tabaco Pata SL9 REWARDS output selection — via BLOOM REMOVAL, the inverse of Blue Iris's tail-cut.** Winning build: cut F-B entirely (~10% of cup mass), keep P1+P2 in full.
- Verdict replicated blind ×2: sitting 3 (4-way blind rebuild, matched TDS 1.02 vs 0.98) and sitting 4 (2-cup blind on fresh LIVED brews — real full brew vs real bloom-cut brew).
- The taxonomy gains a second dimension: not just WHETHER a coffee rewards selection, but WHICH fraction is the tax (Blue Iris: tail · Tabaco Pata: bloom/front).
- H1-t2 confirmed: a fresh 1:10 valve cup reads front-weighted/punchy (character family of B+P1) on this coffee too — front-retention is a method property; preference for it is conditional (punch vs elegance).
- H2-t2 confirmed: monotonic gradient, arithmetic predictive; measured offsets ran 0.06-0.14, consistently ABOVE the standing 0.05-0.08 band (P9-AI-1 evidence).
- T1's winning shape (front + trace tail) finished LAST here; the archived control's recipe card has a transcription drift from lived practice (P9-AI-4).
- Track spent 6 vials (conscious +1 over the 5-vial budget, operator-authorized, for the sitting-4 lived-brew replicate).

### Execution summary

4 sittings, 6 vials, 2026-09-16 → 2026-09-23. Sitting 1: fraction brew + full-recombination confirm + straight fractions. Sitting 2: three combo builds, run blind (exceeds RP8-N15). Sitting 3: 4-way fully blind (rebuilds + fresh 1:10). Sitting 4: 2-cup blind replicate on lived brews, uninstrumented by conscious waiver. Methodology held throughout; divergences all conscious + logged (per-fraction TDS skipped at sitting 2; flush-cup mishap folded at sitting 2; +1 vial at sitting 4). Both scoping waivers honored (no calibration shot, no rung-0 re-brew); transcription-verify substitute ran and caught a real drift (P9-AI-4).

### Equipment / conditions

| Item | Value |
|---|---|
| Coffee | Moonwake Tabaco Pata, washed SL9, Peru (Juan Peña) — 15 g vials |
| Brewer | SWORKS Bottomless + xBloom Premium paper |
| Grinder | EG-1 6.2 (1:10 cup: ~5.8) |
| Water | 96°C, PA office tap + Apax cup-dosing (1 JAMM + 1 TONIK / ~200 mL) |
| Recipe (LIVED, canonical) | 45 g bloom Dial 0, drain ~0:30 → Pour 1 to 150 g cum Dial 5 → Pour 2 to 240 g cum **Dial 5, → Dial 6 at 240 g in**, to dry bed |
| TDS | VST LAB III, blank 0.00 at every instrumented sitting |
| Control | brew `10c46241` (2026-09-15) — recipe-card dial sequence is transcription-drifted, see P9-AI-4 |

### Per-pull / per-measurement raw data

Complete recording sheets live in the sitting records above (§ Sitting 1-4). Summary extract:

| Read | Weight (g) | TDS | Sitting |
|---|---|---|---|
| F-B / F-P1 / F-P2 (s1) | 24.5 / 79.0 / 98.8 | 1.77 / 1.47 / 0.74 | 1 |
| Full recombination (s1) | 202.3 | **1.03** (pred 1.15) | 1 |
| F-B / F-P1 / F-P2 (s2) | 24.0 / 90.9 / 89.1 | 1.81 / — / 0.60 (straight extras) | 2 |
| B+P1 / P1+P2 / P1-trace (s2, blind) | 45 / 45 / 37.5 | 1.40 / 1.40⚠ / 1.20 | 2 |
| F-B / F-P1 / F-P2 (s3) | 21.5 / 87.3 / 94.4 | — (weights only) | 3 |
| FULL / 1:10 / P1+P2 / B+P1 (s3, blind) | 45 / ~145 in / 45 / 30 | 1.02 / 1.36 / 0.98 / 1.47 | 3 |
| FULL vs bloom-cut lived brews (s4, blind) | ~240 in each | uninstrumented (waiver) | 4 |

⚠ s2 P1+P2 read internally inconsistent (implies P1 ≈ 2.2 vs 1.28-1.29 from sibling builds); preference read unaffected (blind, character-based).

### Analysis

- **Gradient:** monotonic F-B > F-P1 > F-P2 every measured brew. Front-heavy split varies with drain-to-trickle boundaries (P1 79-91 g) without disturbing verdicts.
- **Arithmetic:** recombination/combo TDS predictable by weight-average; measured offsets 0.06-0.14 below prediction (larger than the 0.05-0.08 band — P9-AI-1 evidence; sittings 2-3 predictions used day-1 fraction TDS, adding softness).
- **Matched-TDS reads:** landed twice (s2 B+P1 vs P1+P2 both 1.40, caveated; s3 FULL 1.02 vs P1+P2 0.98) — both times the bloom-in cup lost on character at equal strength.
- **Preference chain:** s2 blind P1+P2 > B+P1 > P1-trace; s3 blind P1+P2 > {1:10, FULL, B+P1}; s4 blind lived bloom-cut > lived full. Fully consistent: the bloom is the tax; the tail contributes.

### Final output

**SL9 taxonomy entry (draft, for the RP9 output-selection taxonomy):**

> **Tabaco Pata SL9 (washed, Peru): REWARDS output selection — tax fraction = BLOOM/front.** Winning build: discard the bloom fraction entirely (~21-25 g, ~10% of cup mass), keep pour 1 + pour 2 in full. Character delta: full cup reads pungent/astringent/muddled; bloom-cut reads clear, crisp, elegant, balanced, "layers of flavors" (apex vocabulary). Replicated blind ×2 incl. lived brews. Per-coffee, per operator: "seems like the bloom is the tax on this one." Contrast: Blue Iris (yeast-anaerobic honey) — tax = tail, winner = front-weighted + trace tail. Taxonomy is 2-dimensional: rewards-selection? × which-fraction-is-the-tax.

### Key findings

1. **Bloom-cut wins on this coffee, replicated blind ×2** (s3 matched-TDS rebuild; s4 lived brews). Substrate implication: taxonomy entry above; candidate signature-method note for this coffee's remaining ~9 office vials.
2. **The tax fraction is per-coffee** — T1 tail vs T2 bloom. Substrate implication: the RP9 project output is a 2-axis taxonomy, not a binary.
3. **T1's winning proportion does not transfer** — P1-trace (T1 shape) finished last (s2, blind). Substrate implication: no default winning proportion; per-coffee probe required.
4. **Front-retention (H1) is a method property** — fresh 1:10 reads as the front-family on both coffees. Substrate implication: 1:10 valve cup is a reliable "front preview" instrument for future tracks.
5. **Method artifact-clean on coffee #2** — recombination ≈ control (s1 taste PASS; FULL TDS 1.03/1.02 across s1/s3).
6. **Offset runs larger than the standing band** (0.06-0.14 vs 0.05-0.08) — P9-AI-1 evidence, cause still open.
7. **Archived control recipe card is transcription-drifted from lived practice** (pour 2 lived: Dial 5 → 6 at 240 g; card: Dial 6 → 7 flush) — operator confirmed lived sequence applies to ALL brews of this coffee incl. the control (P9-AI-4).
8. **Freezer count drift**: 15 vials found vs 11 presumptive (P9-AI-3). Track consumed 6; ~9 remain office stock.

### Substrate edit specifications for compile session

DO NOT execute these edits in this session — the compile session integrates substrate.

1. **RP9 project end-document / taxonomy table** (path per Coordinator's project doc): add the SL9 taxonomy entry verbatim from § Final output; restructure the taxonomy to 2 axes (rewards-selection × tax-fraction). Source: Findings 1-3.
2. **Control brew row `10c46241` correction** (via `patch_brew` or arbiter path, Coordinator's choice): pour-2 recipe restatement → "Dial 5 to 240 g in, then Dial 6 to dry bed" (no Dial 7 flush step). Source: Finding 7 / P9-AI-4. Rationale: operator-confirmed lived practice on all brews of this coffee; card text was aspirational, not lived.
3. **freezer-stock doc, Tabaco Pata entry** (`docs/brewing/freezer-stock.md`): update vial count (15 found − 6 consumed = ~9), and append a brew note: "bloom-cut preferred — discard bloom fraction (~10% cup mass), RP9 T2 verdict 2026-09-23." Source: Findings 1, 8.
4. **P9-AI-1 evidence append** (RP9 project doc watch-item ledger): add T2's offset observations (0.06-0.14 band, incl. cross-day-prediction softness caveat). Status stays open. Source: Finding 6.
5. **P9-AI-3 log** (RP9 ledger): freezer count drift +4 vs presumptive; cause unconfirmed. Open.
6. **Concentrated Pour-Over canon note (optional, Coordinator judgment)**: Finding 4 (1:10 as front-preview instrument) may merit a line in the Concentrated Pour-Over canon doc shipped at RP8 close. Source: Finding 4.

### New lessons captured

(Provisional numbering; Coordinator canonicalizes at fold.)

| # | Lesson | Substrate implication |
|---|---|---|
| RP9-N6 | The tax fraction is per-coffee: probe straight fractions BEFORE assuming the prior track's winning shape. The prior winner can finish last. | Future track protocols: sitting 1 straight-fraction reads are the shape-picker; combo designs follow them, not the prior track. |
| RP9-N7 | A lived-brew replicate (brew the winner directly, not a rebuild) is a cheap, higher-ecological-validity verdict confirm — 2 vials, no TDS needed when strength-match is already on file. | Candidate closing move for future verdict-bearing tracks. |
| RP9-N8 | Skipping per-fraction TDS after gradient confirmation is a sound friction cut; predictions from prior-day fraction TDS stay within decision tolerance. | Protocol default candidate: fraction TDS at sitting 1 only unless verdict-bearing. |
| RP9-N9 | Blind position-shuffle is operator-executable solo (incl. re-cupping to kill volume tells) and materially strengthened every verdict this track. | Upgrade RP8-N15 stance: blind is achievable in office lane; recommend for all preference-ordering sittings. |

### Audit items queued

| # | Item | Status | Implication |
|---|---|---|---|
| P9-AI-1 | TDS offset cause; T2 adds 0.06-0.14 observations (above band) | open, evidence appended | none yet; watch |
| P9-AI-2 | Sample-temperature TDS reads | open, no new evidence | — |
| P9-AI-3 | Freezer vial count +4 vs presumptive (15 vs 11) | open | freezer-stock doc count correction (edit spec 3) |
| P9-AI-4 | Control `10c46241` recipe-card transcription drift from lived practice | **queued for compile session** (edit spec 2) | corrects canonical brew row |

### Open data items

- s2 P1+P2 TDS read (1.40) internally inconsistent — most likely under-mixed/misread; no re-run needed (verdict unaffected) but excluded from offset statistics if P9-AI-1 is ever analyzed quantitatively.
- No same-day P1 straight TDS after sitting 1 (consumed s2, skipped s3) — day-to-day P1 strength drift only inferable (implied 1.28-1.29 s2 vs 1.47 s1).
- A "nuttiness" note appeared in BOTH s4 cups (operator unsure it belongs) — possibly rest/freeze evolution of this coffee; anecdote only.

### Recap map for compile session

Integrate first: the taxonomy entry + 2-axis restructure (edit spec 1) — it is the project's payload. Then the control-row correction (spec 2) and freezer-stock update (spec 3), both mechanical. Defer: the Concentrated Pour-Over canon note (spec 6) to Coordinator judgment. Escalate to operator: none — all verdicts were operator-blind-confirmed; Track 3 vs project close is the Coordinator's call (two coffees now give the taxonomy both poles; a third coffee would test the middle, e.g. a washed Ethiopia with mild bloom AND mild tail).

### Protocol-execution friction captured

1. Flush-as-separate-cup confusion at s2 (operator collected the Dial-7 flush as a 4th cup) — protocol prose said "flush belongs to F-P2" but the bench cue wasn't explicit. Fix: state cup count ("three cups only") in the brew steps, not just fraction definitions. (Moot for coffees on the lived no-flush recipe, but the cue pattern generalizes.)
2. "Trace" name collision (flush vs P1-trace build) — name built cups after their contents, not size adjectives.
3. Recipe-card vs lived-practice drift surfaced only because transcription-verify ran — reaffirms RP8-N17 as a mandatory Step 0 primitive.
4. Long bench sequences erase the hot/warm/cool ladder (s2: "not really going to be a hot, warm, cool") — cool-weighted verdicts survived, but protocols should assume combos are tasted warm-to-cool only.
5. Assistant pre-stated H3-t2 lean (trace tail) was wrong — pre-stating remains valuable precisely because it was falsified blind; keep the primitive.

---

### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Archive doc committed + pushed to branch `claude/output-fractionalization-research-d6c46a` @ `<SHA-filled-at-commit>` (the authorized archive-persist exception)
- ✅ Handoff brief produced above; branch + SHA in the `Archive location:` header for the compile session
- 🛑 Session terminating after this brief lands. The compile session integrates substrate per the design pattern.

End of RP9 Track 2 close-out.
