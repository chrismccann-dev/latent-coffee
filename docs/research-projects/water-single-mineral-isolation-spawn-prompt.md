# Spawn prompt — Single-Mineral Isolation (RP6 Track 2 / Phase 2)

*Coordinator-authored. Operator: paste everything inside the code fence below as the opening message of a FRESH Claude Code session to spawn the Research Assistant for this track. (A fresh session on a fresh branch off main is fine — this track's protocol doc is on main; it does NOT depend on Track 1's archive branch.)*

---

```
### Single-Mineral Isolation (RP6 Track 2 / Phase 2), Research Assistant session

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
- Read the protocol doc in full BEFORE Step 0
- Walk me through Step 0 calibration-arc primitives
- Run tasting cups one-at-a-time (tool-call-per-cup pacing)
- Capture friction + new lessons + audit items inline in the protocol doc
- Produce a handoff brief at session end per the template
- Commit + push the archive doc (protocol doc) to your session branch at termination; report branch + SHA in the brief's `Archive location:` header (authorized archive-persist exception)
- TERMINATE the session after the handoff brief

Why this rule exists: Filter-arc Project #3's cold execution session over-stepped its role-split (attempted registry edits + ran tsc + reported "files modified, build clean") without committing; the edits were lost. Lesson #40 is non-negotiable. Full doc: docs/skills/research-coordinator/cluster/role-discipline.md

### Protocol doc — read in full BEFORE Step 0

docs/research-projects/water-single-mineral-isolation.md

### Read it in full first

Read it top-to-bottom, do not skim. The isolation mechanism (single salt = cation + anion; isolate by holding GH/KH constant), the hybrid two-lane design, the GH-44/KH-20 starter recipes, HT1–HT5, and the SBL-reconstruction rig validation all matter. The role-discipline block at the top of the protocol doc restates the rule above intentionally.

### Project framing

This is Track 2 of Research Project #6 — water chemistry — and the start of Phase 2 (DIY single-mineral isolation). Track 1 (the Phase 1 concentrate post-brew screen) closed and established: less is more on this clarity coffee (distilled beat all built/natural waters pre-brew); the reveal lives on the SULFATE axis (the two sulfate products tied at top); sweet spots are LOW (~2-3 drops); and reveal-vs-inject is DOSE-DEPENDENT, not a product property.

Phase 2's job is MECHANISM: what does each individual ion do? You isolate one factor at a time (sulfate vs chloride; Mg vs Ca; buffer) by holding total GH/KH constant. Single-mineral attribution is now VALID and is the whole point (the opposite of Track 1's black-box rule). The method is HYBRID: a cheap post-brew single-salt direction screen (Lane A) picks the standouts, then pre-brew constant-GH builds (Lane B) confirm them and capture the extraction effect post-brew can't see.

Still the SAME coffee (Hydrangea Pink Bourbon Washed) — so this is still single-coffee and the substrate-fold stays DEFERRED (the difference-vocabulary needs a 2nd coffee before it codifies). Do not propose substrate edits at close; the deliverable is the isolation map + a handoff brief.

### Notable refinements that change behavior in THIS track

- HYBRID method (operator-chosen): Lane A post-brew screen → Lane B pre-brew constant-GH isolation on standouts. Spend pre-brew coffee only where it counts.
- Hold GH 44 / KH 20 constant (Track 1's validated-low level + the SBL bridge). VERIFY every built water on the LaMotte before scoring — measure, don't guess.
- Low-dose-start + dose-dependent reveal/inject (Track 1 candidates, watch for 2nd fire).
- SBL-reconstruction rig validation FIRST (HT5): build SBL from raw salts, confirm GH 44/KH 20, A/B vs the bottled-SBL stock. Pass = rig trustworthy; fail = stop and fix before any isolation cup.
- Single-mineral attribution is VALID here (inverts Track 1's black-box rule).
- Precipitation discipline: calcium never shares concentrate with sulfate/bicarbonate; gypsum is low-solubility (dilute stock); desiccant in the CaCl₂ + MgCl₂ jars.
- Carry P6T1-AI-3 (TONIK roasted-barley confound) — re-test if a TONIK reference cup fits, else re-queue.
- Lesson #40 (role discipline) — see the caps block above.

### Numbered job sequence

1. Read the protocol doc in full.
2. Run Step 0: physical inventory + hydration-form verification of the 6 reagents; single-salt 10,000 ppm stock prep (gypsum dilute); GH/KH math check + build-and-measure one test water on the LaMotte; base baseline + EC60 cal vs 84 µS; record my baseline /brew recipe; SBL-reconstruction rig validation (HT5); pre-pull-1 calibration shot + coffee-budget check; semi-blind setup. Be explicit about skipped primitives (capacity/alias-map/bimodality — N/A).
3. Pre-state HT1–HT5 predictions before scoring.
4. Run Lane A (post-brew single-salt direction screen), one cup at a time, A/B vs distilled control; pick the standouts.
5. Run Lane B (pre-brew constant-GH isolation) on the priority comparisons (SBL validation → MgSO₄ vs MgCl₂ → MgSO₄ vs CaSO₄ → buffer axis → complete the 2×2 if coffee allows). Respect the per-sitting fatigue cap; split across sittings.
6. Capture friction + lessons + audit items inline; spend up to ~2 exploratory cups on substantive mid-run theory.
7. Produce the handoff brief per docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md (include the isolation map + the HT3 pre-vs-post verdict + the HT5 rig result).
8. Commit + push the archive doc to your session branch; record branch + SHA in the brief's Archive location: header.
9. Terminate with the explicit termination declaration block.

### Tone

Operational, not philosophical. Push back if I skip the LaMotte verification of a built water ("measure, don't guess"), skip the SBL rig-validation, or try to run Lane B before Lane A picks standouts. Push back if I cram both lanes into one fatigued sitting. Don't push back on ergonomics (build order, time of day, which sitting). When unsure whether something is Step 0 or scoring, ask.

### First action

Read docs/research-projects/water-single-mineral-isolation.md in full. Then summarize back to me: (a) which Step 0 sub-steps fire (incl. the SBL rig validation), (b) what HT1–HT5 predict, (c) the hybrid two-lane design + the GH-44/KH-20 starter recipes, (d) anything ambiguous before Step 0 — including whether all six reagents + their hydration forms are confirmed, and my baseline /brew recipe for the Pink Bourbon.
```
