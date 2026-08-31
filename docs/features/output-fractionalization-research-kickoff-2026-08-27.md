# Research project kickoff - Output Selection / Fractionalization (Office Lane, Research Project #9)

**MODE:** Research Coordinator scoping session. You are becoming the Coordinator for this project per [docs/skills/research-coordinator/SKILL.md](docs/skills/research-coordinator/SKILL.md). This is **not** a talk-through and **not** an execution session - it's project intake + scoping per Steps 1-3 of the Coordinator workflow.

Rendered 2026-08-27 by the RP8 Coordinator session at the post-RP8 roadmap talk-through (operator pick, two-option framing: this was the momentum pick; the payoff pick - AeroPress Championship 2027 prep - is queued as the NEXT office-lane occupant immediately after). Paste-ready, or open with "Read docs/features/output-fractionalization-research-kickoff-2026-08-27.md and proceed."

## 1. Role declaration (LOAD-BEARING)

⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE - READ THIS FIRST

You are the Research Coordinator for this project. Your job is **substrate reads + operator interview + protocol-doc drafting + Assistant spawn-prompt drafting.** Your job is **NOT substrate integration** and **NOT track execution.**

**DO NOT:**
- Run track execution from inside this session (Assistants spawned per [`spawn-prompt-template.md`](docs/skills/research-coordinator/cluster/templates/spawn-prompt-template.md) run tracks)
- Apply substrate-fold edits to `lib/*-registry.ts` or `docs/skills/*/cluster/*.md` from inside this session (fold plans go to fresh execution sessions)
- Pre-bake the methodology before Step 0 of the first track
- Open a parallel Coordinator session for this project (one Coordinator per project; this is it)
- Push AskUserQuestion pickers when the operator is using long-form audio

**DO:**
- Read substrate in full BEFORE the first interview question
- Interview the operator long-form; capture framing verbatim
- Draft the protocol doc at `docs/research-projects/<slug>.md` per precedent
- Draft the first track's spawn prompt per the template
- Get operator audio sign-off on every load-bearing scope call
- Stay across session breaks (multi-day Coordinator continuity is the design)

## 2. Context (why this project, why now)

- **Roadmap § Next #9, trigger FIRED 2026-07-21** (operator bought the VST LAB Coffee III - the competition-reference instrument); picked into the office lane 2026-08-27 at the post-RP8 talk-through as the **momentum pick**. WBC payoff: medium; effort: medium; fold-in: medium (extends the existing modifier taxonomy).
- **This is the office lane's SECOND occupant.** RP8 (concentrated pour-over, 5 tracks) closed 2026-08-27 with retro complete; the lane charter it produced is [cluster/office-lane.md](docs/skills/research-coordinator/cluster/office-lane.md) - ≤15-min-per-cup design budget, standing capture trims, split-cup blind pair, per-vial weigh, shared-freezer volatility rules, low-inventory budget rule. **Bake the charter into every protocol; do not re-negotiate the trims.**
- **Sequencing note (soft gate):** the operator intends to run the **grilling item 56 drain first** (concentrated pour-over vocabulary; a `/grill-with-docs` session with a prepared spawn prompt). Its verdicts on vocabulary + representation may touch this project only lightly (fraction vocabulary is separate), but if the grill has NOT yet run when this session starts, ask the operator whether to proceed or wait.
- **Queued after this project:** AeroPress Championship 2027 preparation ("WAC recipe R&D") - already operator-committed as the next office occupant. Where a scoping choice in THIS project could serve or obstruct that one (e.g. fraction knowledge feeding comp-recipe design), surface it.

## 3. What's already scoped (the roadmap entry)

**Scope (from § Next #9):** Separate bloom / body / tail fractions. Understand each fraction's composition vs perception. Recombine portions to understand effects across coffees. Output: **fractionalization taxonomy** - which coffees reward output selection, which don't.

## 4. What this session is for

Coordinator workflow Steps 1-3: project intake (operator long-form audio) → project scoping (substrate reads + interview; single vs multi-track) → track scoping (protocol doc draft + first-track spawn prompt + operator audio sign-off). Steps 4-10 out of scope for the first session.

## 5. First reads (in this order)

1. [docs/skills/research-coordinator/SKILL.md](docs/skills/research-coordinator/SKILL.md)
2. [cluster/roadmap.md](docs/skills/research-coordinator/cluster/roadmap.md) - esp. § Now office-lane entry + the RP8 § Closed entry
3. **[cluster/office-lane.md](docs/skills/research-coordinator/cluster/office-lane.md)** - the lane charter; this project inherits it wholesale
4. The methodology primitives: `role-discipline.md`, `sharp-substrate-fold.md`, `calibration-arc.md` (NOTE: primitives 9-11 - per-vial weigh, split-cup blind pair, one-bench-free-parameter - graduated at the RP8 retro and apply here), `process-retro.md`
5. [RP8 end-document](docs/research-projects/concentrated-pourover-project-end-document.md) - the prior office project; its mechanism map + lesson ledger (RP8-N1..N17) are this project's inherited craft
6. Project-specific substrate:
   - [CONTEXT-brewing.md](CONTEXT-brewing.md) **Modifier** headword - `output_selection` is a canonical Axis 2 modifier (`lib/extraction-modifiers.ts`); this project deepens an EXISTING canonical axis, not a new one. Also the Two-Axis Framework + Named Consideration headwords.
   - [docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md](docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md) - the **Output Selection family** (Bypass / Post-Brew Dilution · Yield Cutoff subtypes + boundary notes) - the WBC prior art this project's taxonomy extends.
   - RP8 crossover findings that bear directly: **"no dilution past optimum"** (T5 - bypass as strength-targeting) and the **yield-slack lesson** (RP8-N16, press-to-target-yield) - fraction work is yield work; the operator's recombination interest connects to both.
   - [docs/brewing/freezer-stock.md](docs/brewing/freezer-stock.md) - coffee supply; every candidate needs an archived optimized control + enough vials (office charter: physical count + weigh at Step 0; counts are volatile).
7. [PRODUCT.md § Purpose](PRODUCT.md) - WBC North Star framing.

## 6. Interview question groups (let operator drive cadence)

**Group A - Fraction-capture mechanics (load-bearing):** how to physically capture fractions at the office within the ≤15-min budget - swapped cups under the dripper at pour boundaries? At timed intervals? At weight marks? Which brewer (Kalita gravity flow vs SWORKS valve - the valve can HOLD flow between fractions, which may make it the natural fractionation instrument)? How many fractions is realistic per cup (bloom/body/tail = 3? or 2 splits?)?

**Group B - Instrumentation:** per-fraction TDS is the whole point of owning the VST for this project (concentration varies BY DESIGN across fractions - the office charter's "TDS when concentration varies" rule fires affirmatively). Sample handling per fraction; single read per fraction per the trims.

**Group C - Tasting + recombination design:** taste fractions straight, or recombine-and-compare? The **split-cup blind pair** (calibration-arc primitive 10) seems purpose-built for recombination comparisons (full recombination vs tail-cut, blind) - probe whether the operator agrees. Staged hot/warm/cool or simplified (fractions are small volumes that cool fast)?

**Group D - Coffee selection:** taxonomy breadth wants coffee variety (the project's output is "which coffees reward output selection") - but office inventory is finite. How many coffees; which; per-coffee vial budget under the low-inventory rule.

**Group E - Structure:** track = coffee (RP8's shape, absorbed 4 re-scopes cleanly) or track = question (capture-method validation first, then per-coffee)? What does track 1 prove?

**Group F - WAC coupling:** the next project is AeroPress Championship prep; WAC recipes historically use yield cutoff (press-to-X) and bypass. Should this project's later tracks deliberately include an AeroPress fraction read, or stay dripper-side and let WAC prep inherit the taxonomy?

## 7. Outputs expected from this session

1. Sharpened roadmap § Now office-lane entry (minor edits only).
2. Protocol doc draft at `docs/research-projects/<slug>.md`.
3. Open-questions block in the protocol doc.
4. First-track Assistant spawn prompt, paste-ready.

## 8. Discipline / what NOT to do

- Standard Coordinator discipline (no substrate edits, no pre-baked methodology, no parallel Coordinator, no pickers, no ship without audio sign-off).
- **Office-lane charter is settled** - do not re-litigate trims, budgets, or the split-cup protocol; inherit them.
- **Do NOT touch concentrated-pour-over vocabulary** - that's grilling item 56's (possibly drained by the time you read this; check `docs/grilling-queue.md` § Resolved).
- **No push_brew during the project** unless the item-56 grill has established the representation pattern and the operator explicitly opts in - default remains doc-only trial records.
- The `output_selection` modifier + WBC Output Selection family are EXISTING canon - this project generates evidence about them, it does not redefine them mid-project (redefinitions route to the grilling queue).

## 9. Open questions the operator is chewing on (carry into the interview)

- Recombination is the operator's stated interest from the original scoping ("recombine portions to understand effects") - and RP8's bypass finding reframes it: bypass-to-optimum is sanctioned strength-targeting. Is recombination-after-fractionation just bypass with extra steps, or a genuinely different lever (selective REMOVAL of a fraction, not dilution)? This distinction may become the project's central question.
- The operator dreamed about this project the night before picking it (2026-08-27). Momentum is real.

## 10. First action when you start this session

1. `git pull` to confirm main is current; confirm the roadmap § Now office-lane entry names this project.
2. Check `docs/grilling-queue.md` item 56 status (Resolved vs open) - apply § 2's soft gate accordingly.
3. Read § 5 First reads in order.
4. Acknowledge to operator: one line confirming the reads; frame the project in one sentence; open the interview at whichever Group the operator picks.
5. Let operator drive cadence + topic order. Capture framing verbatim.

## 11. Sign-off block

When the protocol doc draft + first-track spawn prompt are paste-ready, summarize back and ask for explicit audio sign-off before treating the project as scoped.
