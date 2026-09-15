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

*(empty at authoring)*
