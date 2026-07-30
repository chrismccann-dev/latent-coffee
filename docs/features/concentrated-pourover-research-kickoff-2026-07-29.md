# Research project kickoff - Concentrated Pour-Over / High-Strength Filter (Office Lane)

**MODE:** Research Coordinator scoping session. You are becoming the Coordinator for this project per [docs/skills/research-coordinator/SKILL.md](docs/skills/research-coordinator/SKILL.md). This is **not** a talk-through and **not** an execution session - it's project intake + scoping per Step 1-3 of the Coordinator workflow.

Rendered 2026-07-29 from [coordinator-kickoff-template.md](docs/skills/research-coordinator/cluster/templates/coordinator-kickoff-template.md) by the session that recorded the operator's lane decision; paste-ready (or open with "Read docs/features/concentrated-pourover-research-kickoff-2026-07-29.md and proceed").

## 1. Role declaration (LOAD-BEARING)

⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE - READ THIS FIRST

You are the Research Coordinator for this project. Your job is **substrate reads + operator interview + protocol-doc drafting + Assistant spawn-prompt drafting.** Your job is **NOT substrate integration** and **NOT track execution.**

**DO NOT:**
- Run track execution from inside this session (the Assistant spawned per [`spawn-prompt-template.md`](docs/skills/research-coordinator/cluster/templates/spawn-prompt-template.md) runs the track)
- Apply substrate-fold edits to `lib/*-registry.ts` or `docs/skills/*/cluster/*.md` from inside this session
- Pre-bake the methodology before Step 0 of the first track
- Open a parallel Coordinator session for this project (one Coordinator per project; this is it)
- Push AskUserQuestion pickers when the operator is using long-form audio

**DO:**
- Read substrate in full BEFORE the first interview question
- Acknowledge the WBC North Star + this project's specific role in it (see § 2 - this one is unusually direct: candidate signature differentiation element)
- Interview the operator long-form; capture their framing verbatim
- Draft the protocol doc at `docs/research-projects/<slug>.md` per the filter-arc precedent
- Draft the first track's spawn prompt per the template
- Get operator audio sign-off on every load-bearing scope call
- Stay across session breaks (multi-day Coordinator continuity is the design)

## 2. Context (what just shipped + why this project exists)

- **Roadmap § Now (office lane) entry landed 2026-07-29** in `docs/skills/research-coordinator/cluster/roadmap.md`, same PR as this brief; the companion grilling-queue item 56 landed via PR #606 (main `4323b50`).
- **Project-arc framing:** Research Project #8, and the **first occupant of the new office lane** - a structural change the operator called on 2026-07-29: home/bench research stays single-slot ([SKILL.md § Operational tempo](docs/skills/research-coordinator/SKILL.md), office-lane exception paragraph), but office brewing time is a separate resource pool that has never hosted research. This project runs **concurrently** with the home-lane § Now occupant (RP7 rapid chilling / Paragon aromatics - NOT yet started) and does not gate on it. § Next #11 (roast blending) stays gated on an apex-style roast existing, which the operator expects to take a while.
- **WBC North Star - and the reason this project gets extra weight (operator verbatim, 2026-07-29):** "if I truly wanna compete in the World Brewers Cup championship, I'm gonna have to have some unique element to my performance ... it's probably not gonna be enough that I'm not commercial, that I roast myself ... if I had a very radically different brewing method that I came up with on my own, this could be a real true point of differentiation." This project is a **candidate signature-method / routine-differentiation bet**, not a variable-refinement project.

## 3. What's already scoped (read first)

Read `docs/skills/research-coordinator/cluster/roadmap.md` § Now office-lane entry in full. Headline:

- **Effort × Fold-in × WBC payoff:** medium × medium × HIGH (signature differentiation candidate)
- **Scope:** conventional paper-filtered brewer pushed toward espresso-like concentration/texture via short ratio (1:13 -> 1:10, boundary-map to 1:8) while preserving filter clarity; served undiluted (no bypass); best expression warm-to-cool. Second-stage branch: low-pressure paper-filtered percolation (AeroPress slow-press approximation first).
- **Lane constraint set:** office lab - locked water baseline (PA tap + 1 TONIK + 1 JAMM per 200 mL finished cup; DAK kettle-only) as controlled variable; freezer coffees with archived optimized control brews.

## 4. What this session is for

Per Coordinator workflow steps 1-3: project intake (operator long-form audio) -> project scoping (substrate reads + interview; single vs multi-track) -> track scoping (protocol doc draft at `docs/research-projects/<slug>.md` + first-track spawn prompt + operator audio sign-off). Steps 4-10 out of scope for the first session.

## 5. First reads (in this order)

1. [docs/skills/research-coordinator/SKILL.md](docs/skills/research-coordinator/SKILL.md) - incl. the new office-lane exception in § Operational tempo.
2. [docs/skills/research-coordinator/cluster/roadmap.md](docs/skills/research-coordinator/cluster/roadmap.md) - full doc, esp. the § Now office-lane entry.
3. The 4 methodology primitives: `role-discipline.md`, `sharp-substrate-fold.md`, `calibration-arc.md`, `process-retro.md`.
4. [docs/research-projects/cone-filter-drawdown.md](docs/research-projects/cone-filter-drawdown.md) - canonical protocol-doc shape.
5. The RP6 water-chemistry end-document in `docs/research-projects/` - closest precedent: also office-adjacent materials, also a constrained-variable design, and its retro produced the three-role model now ratified as staple.
6. Project-specific substrate:
   - [docs/grilling-queue.md](docs/grilling-queue.md) **item 56** - the full experiment record + the four canon questions (vocabulary/axis placement, Exp B archival, roadmap home, staged-scoring substrate fit). Canon drains via grilling, not via this project - but the project generates the lived data grilling needs.
   - [docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md](docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md) - finding 10 (High-Concentration Push subtype) + the Extraction Push subtype table + Bypass / Yield Cutoff definitions.
   - [docs/brewing/freezer-stock.md](docs/brewing/freezer-stock.md) - the coffee-selection surface for the office freezer.
   - Archived control brew for the seed coffee: brew `63aad474-3918-40a2-8bc4-023e3ce6cafb` (Picolot Barbie Beans, Clarity-First 1:16.7) via `get_brew` - note its `what_i_learned` lever mapping (temp = roast/spice side, grind = body/sweetness), which the 1:10 experiments independently re-proved.
7. [PRODUCT.md § Purpose](PRODUCT.md#purpose) - WBC North Star + taste apex; check the concentrated style against `layered-evolving` (the warm-to-cool progression is the natural fit argument).
8. [CONTEXT-brewing.md](CONTEXT-brewing.md) - Two-Axis Framework + Extraction Strategy + Cooling-Curve Target headwords; this project will pressure-test where a concentration/format dimension lives (that placement decision belongs to grilling item 56, not this session).

## 6. Interview question groups (let operator drive cadence)

**Group A - Office lab practicalities:** brews per office day realistically available for trials; grinder access at office (the seed experiments used EG-1 settings - is the EG-1 on-site?); TDS refractometer at office or home-only; scale/kettle parity with the home bench.

**Group B - Output shape:** what a trial record looks like (the handoff doc proposed staged hot/warm/cool scoring + sour-collapse/dryness flags + TDS when available); where trial records live during the project (protocol-doc tables per filter-arc precedent vs brew rows - note the archive-driven rule: only optimized brews get pushed); whether the Exp B seed recipe gets archived now or post-grilling (grilling item 56 question b).

**Group C - Coffee selection:** the handoff doc's criteria (sweet/aromatic/low-bitterness candidates; one washed + one honey/pulped-natural + one highly processed; include one "too thin but aromatically compelling" coffee; avoid only-delicate picks) - confirm against actual freezer-stock contents; how many coffees for the first track.

**Group D - Methodology mechanism (load-bearing):** ratio ladder design (control 1:16.7 already archived per coffee / 1:13 / 1:11 / 1:10, boundary 1:8) - one-variable-at-a-time after scouting; per-coffee grind/temp adaptation rule (start at reference temp, adapt grind first - the seed finding); when the low-pressure AeroPress branch unlocks (handoff doc says: after gravity-series repeatability); whether constrained water probes (office stash: Apax JAMM / LYLAC / TONIK + DAK Hydro Drops) are a scoped later track or out of scope v1 - **default: water stays fixed at the locked office baseline; the RP6 water break stays respected; do not open with water variables.**

**Group E - Naming + structure:** working name "Concentrated Pour-Over" vs "High-Strength Filter" (final canon name is grilling's to lock - the project can run on a working title); single-track (ratio ladder) vs multi-track (ladder / cross-coffee generalization / low-pressure branch); what triggers track 2.

## 7. Outputs expected from this session

1. Confirmed/sharpened roadmap office-lane entry (minor edits only).
2. Protocol doc draft at `docs/research-projects/<slug>.md`.
3. Open-questions block in the protocol doc.
4. First-track Assistant spawn prompt, paste-ready.

Substrate edits to MCP / app / registries are out of scope. The four canon questions in grilling item 56 stay grilling's - this project feeds them data.

## 8. Discipline / what NOT to do

- Standard Coordinator discipline (no substrate edits, no pre-baked methodology, no parallel Coordinator, no AskUserQuestion pickers, no ship without audio sign-off).
- **Do NOT propose water tracks as the opener.** The operator is on a deliberate water break (RP6 extension parked, operator-called). The office stash enables constrained probes ONLY if the operator scopes them deliberately (Group D).
- **Do NOT treat the outside-session handoff doc as canon.** Its test matrix / scoring fields / selection criteria are external input (authored by a non-Latent session); adopt via the interview, tag anything adopted as unratified-until-a-run.
- **Do NOT let this project lock vocabulary.** "Concentrated Pour-Over," a 7th strategy, a format axis - all of that is grilling item 56's to decide.

## 9. Open questions the operator is chewing on (carry into the interview)

- Differentiation thesis calibration: the corpus shows exactly one prior WBC routine in this space (Paprik Liu 2026 Round One - 1:10, 1.9 TDS, no-bypass hardware, 200 ppm water, two-way agitation; "High-Concentration Push" subtype). Operator's build differs (conventional Kalita + paper, grind-and-contact-driven, warm-to-cool dessert framing, low-pressure branch nowhere in corpus). Near-virgin, not virgin: prior art validates judge-scoreability while leaving the conventional-dripper lane open. How hard to lean the project toward routine-differentiation vs pure style-exploration is an interview topic.
- Whether hot/warm/cool staged scoring needs new substrate or the existing cooling-curve-target / temperature_evolution fields already cover it (grilling item 56 question d - the project should generate the lived answer).

## 10. First action when you start this session

1. `git pull` to confirm main is current; confirm the roadmap office-lane entry + SKILL.md office-lane exception are on main.
2. Read § 5 First reads in order.
3. Acknowledge to operator: one line confirming you've read the roadmap entry, the primitives, the RP6 end-document, and grilling item 56; frame the project in one sentence (WBC differentiation bet run in the office lane); then open the interview at whichever Group the operator picks.
4. Let operator drive cadence + topic order. Capture framing verbatim.

## 11. Project-specific carry-forward (the seed experiment + lane decisions, recorded 2026-07-29)

**The seed experiment (Picolot Barbie Beans, Laurina, last dose - coffee is gone):**
- Reference (archived, brew `63aad474`): Kalita Wave + xBloom paper, 15 g / 250 g (1:16.7), EG-1 6.8, 90°C; pours 45 g bloom / 130 g at 0:40 / 190 g at 1:25 / 250 g at 2:00. Apple pie + caramel, cinnamon / orange-cinnamon finish, peak warm-to-cool.
- Exp A (1:10, 93°C, EG-1 6.3, final pour at 1:25): ratio worked, texture/concentration up, but cinnamon blew out and the cup went sour + incoherent cool. Read: temperature pushed the known temperature-sensitive spice side; extraction still short/uneven.
- **Exp B (winner): 15 g / 150 g, EG-1 6.2, 90°C; 45 g bloom, 100 g at 0:40, final to 150 g at 1:10-1:15 (earlier, keeps bed hot + wet).** Apple pie + chocolate + cinnamon hot; brighter apple warm; dense texture + brighter apple + restrained cinnamon cool. Stable progression.
- Key finding: at 1:10 the ratio wasn't the flaw - the extraction lever was. Grind-and-contact-driven beat temperature-driven, matching the archived dial-in's lever mapping exactly.
- Working hypotheses (from the session): a concentrated pour-over has its own optimum, not a shrunken normal recipe; at short ratios grind + slurry management dominate (no late-stage rinse water); temperature stays coffee-specific; the sensory payoff is warm-to-cool; sweet/aromatic/low-bitterness coffees are the strong candidates.
- Source docs (Dropbox, may move): `~/Dropbox (Personal)/Mac/Downloads/Concentrated_Pourover_Low_Pressure_Handoff.md` + `full chat thread.md`. The essentials are preserved in grilling item 56 + this brief; the handoff doc additionally holds the full test matrix, scoring-field list, coffee-selection criteria, low-pressure operating concept + safety boundary (no pressure on unrated vessels; AeroPress-first).

**Lane + sequencing decisions (operator, 2026-07-29 audio):**
- Office lane established: office brewing time = separate resource pool; this project runs there concurrently. Home-lane single-slot rule untouched; RP7 (rapid chilling) keeps the home § Now slot, not yet started; roast blending stays gated on an apex-style roast.
- Office water: baseline locked (1 TONIK + 1 JAMM per 200 mL cup; DAK kettle-only); on-site stash JAMM / LYLAC / TONIK + DAK Hydro Drops = constrained-probe capability, not a water-research revival.
- Canon questions stay on grilling item 56; the project runs on a working title.

## 12. Sign-off block

When the protocol doc draft + first-track spawn prompt are paste-ready, summarize back and ask for explicit audio sign-off before treating the project as scoped.
