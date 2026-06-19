# Filter Textural-Quality Layer — V60 Cone Cohort (Research Project #5, Track 1)

*Coffee Research · Latent · Research Project*

**Version:** 0.1 (DRAFT — Coordinator-authored, pre-execution)
**Date drafted:** 2026-06-18
**Date executed:** TBD
**Status:** READY-TO-SPAWN (pending one open scope confirm — BS→Track 3, see § Open questions). Scope signed off; V60×xBloom fit CONFIRMED; dial-in baseline recipe LOCKED (2026-06-19, § Step 0 sub-step 3).
**Platform:** xBloom (controlled-pour) driving a Hario V60 dripper
**Home EG-1**

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE (Lesson #40, Filter-arc Project #3 substrate)

**This protocol has a non-negotiable role split. Read this BEFORE Step 0.**

You are the **Research Assistant** for this track. Your job is **execution + handoff brief production.** Your job is **NOT substrate integration.**

**DO NOT:**
- Edit `lib/filter-registry.ts`
- Edit `docs/skills/brewing-equipment-expert/cluster/filters.md`
- Edit `lib/flavor-registry.ts` (the `structure_tags` vocabulary — even if a gap surfaces; log it, don't change it)
- Edit ADR files
- Run `git commit`, `git push`, or `gh pr create`
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)
- Apply "what changed" file edits as part of close-out
- Continue past the handoff brief to "finish the job"

**DO:**
- Read this protocol doc in full BEFORE Step 0
- Walk Chris through Step 0 (V60×xBloom fit HARD GATE + photo inventory + coffee dial-in baseline + structure_tags vocabulary calibration)
- Run cupping pulls one-at-a-time (Lesson #7 tool-call-per-pull pacing)
- Capture friction + new lessons + audit items inline in this protocol doc's Notes section (the doc IS the archive — Lesson #12)
- Produce a handoff brief at the end (per `docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md`) for the execution session to integrate into substrate
- **TERMINATE the session after the handoff brief.** Do not continue to commits.

**Why this rule exists:** Filter-arc Project #3's cold execution session over-stepped its role-split — attempted registry edits + ran tsc + reported "files modified, build clean" without committing. When the compile session checked, the claimed edits were not present in any branch (working state was ephemeral and lost). The compile session had to re-do all substrate integration from the handoff brief. Lesson #40 is non-negotiable. Full primitive doc: `docs/skills/research-coordinator/cluster/role-discipline.md`.

---

## Project Context

This is **Research Project #5** of the Latent research arc and the **SECOND research project overall** — the first real test of the Research Coordinator / Assistant methodology primitives in a fresh project context (the filter arc was the project they were forged on). Per `docs/skills/research-coordinator/cluster/process-retro.md`, the cross-project ratification gate fires on this project's retro: anything that fired in BOTH the filter arc AND this project graduates from project-specific lesson to cluster primitive.

**The project:** "Filter textural-quality layer." It adds a **textural-quality field to `FilterEntry`** — what body / clarity / finish a paper tends to produce — extending the filter arc's *flow* substrate (`measuredDrawdownSec` + `bedBehaviorUnderLoad`) with a *taste* layer. The filter arc measured how fast water leaves the bed; this project measures how the cup tastes through the paper.

**Two tracks, geometry-split** (same reasoning as the filter arc: cone vs flat can't share a brewer without bed-geometry confounds):

| Track | Brewer (under xBloom) | Cohort | Status |
|---|---|---|---|
| **1 — V60 cone (this doc)** | Hario V60 | Owned V60-compatible cone papers | READY |
| 2 — Kalita flat | Kalita Wave | Owned Kalita/flat papers | Queued (scope at this track's retro) |
| 3 — Sibarist BS native | Sibarist Brewing System | HALO papers (HALO-B3 / HALO-FAST) in their designed housing | Candidate (enabled 2026-06-19 — the BS *does* fit the xBloom big slot with the claw holder removed; this is the proper home for the AI-4-faithful "HALO-B3 vs CONE-B3 both in BS" texture test) |

**Why xBloom as the platform:** The filter arc measured paper-only flow under deliberately *non-realistic* conditions — 250g-at-once dumps that produced craters and bypassed bed uniformity. That was correct for isolating flow, wrong for tasting a cup. xBloom gives **programmatic temperature + flow-rate + pour-pattern control** (center / spiral / circular; pre/post agitation), so the paper is isolated as the variable under *realistic brewing* conditions. Chris uses a Kalita on the xBloom today for pour-over cupping; the V60 holder fit is the one open prerequisite (Step 0 hard gate below).

**The load-bearing methodological contribution** (not the textural field — the *method* behind it): how to convert subjective operator cupping prose into structured taxonomy fields **without losing fidelity.** Every future research project hits this (bloom feel, blending sensory output, routine evaluation, sourcing cup signals). This track is the first substantial test of subjective → structured. Whether the method generalizes into a cluster primitive is **deferred to the project retro** per the cross-project ratification gate — do not pre-generalize it here.

---

## The Subjective-into-Taxonomy Mechanism (load-bearing — read carefully)

The textural reading does **not** invent a new vocabulary. It reuses the **canonical `structure_tags` enum** already used on every brew (`lib/flavor-registry.ts`, stored as `"Axis:Descriptor"`). This is Chris's explicit call — a paper's textural reading speaks the same language as every brew, so the substrate doesn't fork.

**The texture-relevant axes** (the 3 of 7 that describe mouthfeel/texture, not flavor):

- **Body:** Aerated · Creamy · Light · Milky · Round · Silky · Syrupy
- **Clarity:** Clean · Complex · Delicate · Expressive · Layered · Refined · Subtle · Transparent
- **Finish:** Clean · Coating · Drying · Lingering · Short

**⚠️ The roadmap seed vocabulary is NOT canonical.** The § Now roadmap entry seeded the axis as "thin / syrupy / heavy." Of those, **only Syrupy exists** in the canon — there is **no "Thin"** (= `Body:Light`) and **no "Heavy"** (folded into `Body:Syrupy`, whose definition is literally "Heavy, viscous, coating"). Do not record "thin" / "heavy" as tags; map operator prose onto the canonical descriptors above. (`close-lot.md` flags this exact slip.)

**Paper-attributed but condition-bound.** A paper has no body — the *coffee* does, and the paper *shapes* it. So a paper's textural cell records: "this paper, brewing **this** coffee on **this** platform/recipe, produced these Body/Clarity/Finish tags." This is paper-attributed exactly the way `measuredDrawdownSec` is — the value is a paper property; the conditions of measurement (coffee, recipe, platform) are protocol-doc metadata. Hold the coffee + recipe constant across all papers; the paper is the only variable.

**The fidelity prototype (the real research question of the method):** For every paper, capture BOTH (a) the operator's free-text cupping prose AND (b) the canonical `structure_tags` it maps to. **The gap between them is the data.** If prose detail consistently fails to fit a canonical descriptor (e.g. "this one has a grippy, chalk-edged finish that isn't quite Drying or Coating"), that leakage is the finding — it tells the retro whether the 29-descriptor vocabulary has enough resolution for paper-texture work, or whether a future descriptor/axis is warranted. **Record leakage; do not patch the vocabulary mid-session** (role discipline — `lib/flavor-registry.ts` is off-limits to this session).

---

## Inherited methodology lessons from the filter arc (transferability to a TASTE study)

The filter arc produced ~49 lessons against a *flow* dependent variable. This track's dependent variable is *taste*, so many flow-specific primitives don't fire. The ones that transfer:

| Lesson | Transfers? | How it applies here |
|---|---|---|
| #1 Physical-photo inventory in Step 0 | ✅ | Photograph every cohort paper; catch owned-flag drift before scoring |
| #2 SKU naming-convention notes | ✅ | CAFEC T-codes (T-83/T-90/T-92) + HALO-vs-CONE distinction surfaced explicitly |
| #3 / #6 Pre-pull-1 calibration + equipment-cross-check granularity | ✅ (repurposed) | Becomes the **coffee dial-in baseline** on xBloom — lock a known-good recipe before scoring |
| #5 Auto-retest / cross-confirmation | ✅ (repurposed) | If a paper's textural read is ambiguous, re-cup; if two same-family papers read identically, that cross-confirms |
| #7 Tool-call-per-pull pacing | ✅ | One cupping pull per tool call; the per-pull prose IS the payload — never batch |
| #12 The doc IS the archive | ✅ | All readings + prose + leakage captured inline here |
| #16 Pre-stated hypothesis tests (active mode) | ✅ | HT1–HT4 below; log the prediction before each scoring pull |
| #36 / RP4-N4 Family-conditional signal | ✅ (watch) | Does the CAFEC family that read paper-fiber-*slow* on flow also read distinct on *texture*, or does the flow/texture link break by family? |
| #7-bimodality / no-bed screen | ❌ | Flow-shaped; the dependent variable here is taste, not drawdown |
| Grind-comp table / drawdown deltas | ❌ | No flow scoring this track |

**New for a taste study (no filter-arc precedent — candidate primitives for the retro):**
- **Cupping-vocabulary calibration** at Step 0: before scoring, the operator tastes the dial-in baseline and assigns its `structure_tags` — calibrating the prose→tag mapping against a known cup before paper variants enter.
- **Palate-fatigue ceiling:** taste discrimination degrades with cup count far faster than flow measurement does. The cohort size is capped by this (see § Sample size). This is the taste-study analog of the filter arc's "noise floor is the most expensive setup."
- **Paired A/B-vs-baseline reading:** textural differences are read far more reliably in direct side-by-side comparison than in absolute scoring. The comparison design (below) reflects this.

---

## Hypothesis Tests (pre-state per Lesson #16 active mode)

Log each prediction in the recording sheet BEFORE the relevant scoring pull; log the actual reading + diagnosis after.

### HT1 — Do papers differentiate texture at all? (the reframed-AI-4 core)
**Question:** On a clean washed coffee, on an xBloom-controlled V60, do the cohort papers produce *distinguishable* `structure_tags`, or do they all read the same?
- **If distinguishable:** paper choice is a real textural lever, not just a flow lever. Populate the FilterEntry textural field.
- **If indistinguishable:** the textural layer adds little on this geometry/coffee — a real (and publishable) null result. The flow layer stays the dominant paper-selection signal.

### HT2 — Does the flow layer predict the textural layer? (the cross-layer spine)
**Question:** Every V60 cone paper already has a measured drawdown (P1/RP4). Do the *slower* papers (CAFEC family, +7 to +19s in BS) read heavier-body / more-coating / lower-clarity, or is flow textural-neutral?
- This is the analytical spine only the V60 cohort can offer (the flat cohort has no comparable flow layer). Pair each paper's new textural cell against its `measuredDrawdownSec`.

### HT3 — HALO-B3 vs CONE-B3 (the near-literal RP4 AI-4)
**Question:** RP4 found HALO-B3 (BS-native) and CONE-B3 (V60-shape) functionally *identical on drawdown* in the BS (91s vs 92s). AI-4 asked: what differentiates HALO-B3 if flow is identical? In THIS track, both HALO-B3 and CONE-B3 run **in the same V60** (HALO papers are V60-shaped), holding the brewer constant — so this is the **paper-fiber** version of the question. Do the two B3 fibers differ on **texture / clarity** in a V60?
- **If they differ:** the HALO B3 fiber is texturally distinct from the CONE B3 fiber.
- **If identical on texture too:** the HALO/CONE fiber distinction may be a fit/repeatability story, not a cup story.

**Scope note (BS-fits-xBloom, 2026-06-19):** the *fuller* AI-4 test — HALO-B3 vs CONE-B3 **both in the Sibarist BS** (mirroring RP4's both-in-BS flow comparison, testing whether HALO's design rationale lives in its native *housing*) — belongs to the candidate **Track 3 (Sibarist BS native)**, NOT here. This track keeps the brewer constant at V60 (geometry-split discipline); mixing the BS architecture into the V60 cohort reintroduces the confound the split guards against. See § Open questions for the Track-3-vs-fold-in-now decision.

### HT4 — Does `structure_tags` have enough resolution? (the methodology meta-test)
**Question:** Does operator cupping prose map cleanly onto the 29-descriptor vocabulary, or does fidelity leak (prose detail with no canonical home)?
- This is the subjective-into-taxonomy prototype. Quantify leakage (how many prose observations had no clean tag). Feeds the retro's "does this method generalize" question — **do not resolve generalization here.**

---

## Scope

**Single brewer geometry:** Hario V60 cone, driven by xBloom (programmatic pour). Flat-bottom (Kalita) papers are out of scope — that's Track 2.

**Cohort (candidate — Step 0 + palate-fatigue cap will trim):** owned V60-compatible cone papers. Now includes the HALO papers (V60-shaped per Chris; fit a V60 despite registry's "BS-only" listing — see § Open questions / registry note).

| # | Paper | SKU / Code | Measured drawdown (prior) | Role in cohort |
|---|---|---|---|---|
| 1 | Sibarist CONE B3 | `CONE-B3` | 60s (P1) / 92s (RP4 BS) | Textural **baseline** ✅ confirmed (also the P1 cone-drawdown baseline — anchors both layers at the same paper) |
| 2 | Sibarist HALO CONE B3 | `HALO-B3` | 91s (RP4 BS) | **HT3 partner** — BS-native B3 fiber, run in V60 |
| 3 | Sibarist CONE FAST | `CONE-FAST` | 45s (P1) | Fast end of cohort; clarity-ceiling paper |
| 4 | Sibarist HALO CONE FAST | `HALO-FAST` | 108s (RP4 BS) | FAST fiber, BS-native, run in V60 (HT3 extension) |
| 5 | CAFEC T-92 LC4 | `LC4-100W` | 80s (P1) / 107s (RP4) | **HT2** — slowest CAFEC; does slow flow = heavy texture? |
| 6 | CAFEC T-83 DC4 | `DC4-100W` | 68s (P1) / 110s (RP4) | **HT2** — CAFEC dark; flow/texture link |
| 7 | CAFEC T-90 MC4 | `MC4-100W` | 60s (P1) / 98s (RP4) | CAFEC medium; cohort completion |
| 8 | CAFEC Abaca+ APC4 | `APC4-100W` | 72s (P1) / 108s (RP4) | Chris's workhorse Abaca+ cone |
| 9 | Hario Meteor 02 | `METEOR-02` | 65s (P1) / 93s (RP4) | Cross-manufacturer reference |
| 10 | Hario VCF-01 Tabbed | `VCF-01-100W` | 65s (P1) / 95s (RP4) | Commodity low-engineering reference |

**Single coffee:** Hydrangea Pink Bourbon Washed (Finca Inmaculada / Fellow Farms Project), purchased, 5 lb. Held constant across all papers. Shared stock with the future water-chemistry project (§ Next #5). One dial-in baseline recipe locked at Step 0.

**Out of scope:** flat/Kalita papers (Track 2); flow re-measurement (filter arc already covered it); grind-compensation work; any non-xBloom platform.

---

## Step 0 — Calibration (LOAD-BEARING; runs before any scoring)

Selected from the calibration-arc primitive menu (`docs/skills/research-coordinator/cluster/calibration-arc.md`) for a taste study. Photo confirmation required per Lesson #1.

### Sub-step 0 — V60 × xBloom FIT (✅ CONFIRMED pre-spawn — re-verify at setup)
The Hario V60 seats in the xBloom dripper holder and dispenses correctly — **Chris confirmed this 2026-06-18** before the project. At session setup, re-seat it once and eyeball that the pour lands in the bed with no overflow (one-line sanity check, not a blocker).
- The original FAIL→re-anchor-on-Kalita path is now moot (fit confirmed). Retained for the record: had the V60 not seated, this track would have swapped to the Kalita flat geometry (Track 2's brewer).

### Sub-step 1 — Physical-photo inventory cross-check (Lesson #1)
Photograph every cohort paper. Confirm owned-flag + that the physical paper matches the registry SKU. Catch drift before scoring (the filter arc caught 6 drifts this way at P1).

### Sub-step 2 — HALO-vs-CONE + CAFEC T-code SKU notes (Lesson #2)
- Confirm which Sibarist papers are HALO (BS-native, but V60-fitting per Chris) vs CONE (V60-native). Both run in the V60 here; label each correctly so HT3 reads cleanly.
- CAFEC papers carry T-codes (T-92 / T-90 / T-83) separate from cup-size; reference by T-code.

### Sub-step 3 — Coffee dial-in baseline (sourced from Chris's brewing flow — NOT derived here)
The dial-in baseline recipe is **dialed in by Chris ahead of the project through his own brewing flow** (the `/brew` skill), on the research platform (xBloom + V60 + the CONE-B3 baseline paper), and **pasted into the Coordinator session → locked into this protocol doc before the Assistant spawns.** It is a fixed input by the time scoring starts.

**The Assistant's job at Step 0 is to VERIFY the baseline reproduces, not to re-derive it:** brew the baseline recipe on CONE-B3, confirm the cup tastes as Chris expects, and proceed. Do NOT re-dial the recipe — separation of brewing craft (the `/brew` flow) from measurement (this session) is deliberate. If the baseline does not reproduce (tastes off), STOP and flag to Chris before scoring any paper.

**Locked baseline recipe (2026-06-19, dialed in by Chris via his brewing flow):**

| Field | Value |
|---|---|
| Coffee | Hydrangea Pink Bourbon Washed — Finca Inmaculada (Holguin Family), Valle del Cauca, Colombia |
| Strategy / modifiers | Clarity-First / none |
| Brewer | xBloom (V60 chamber, "Other"/freesolo), grinder OFF / external EG-1 |
| Filter (baseline) | Sibarist **CONE B3** (the control paper; the cohort varies this axis) |
| Dose | 15 g |
| Water | 247 g (**1:16.5**) |
| **Water recipe** | **Home remineralized — Chris's standard (Third Wave Water + distilled at his standard dilution).** Held constant across all papers. See § Controlled Variables + § Known Confounders for the tap-vs-remineralized decision. |
| Grind | EG-1 **6.4** |
| Temp | 94 / 94 / 93 °C |
| Bloom | 45 g, spiral, wait 45 s |
| Pour 2 | at ~0:58 → to 150 g @ 94 °C, spiral, flow 3.5 ml/s, 30 s pause after |
| Pour 3 | at ~1:58 → to 247 g @ 93 °C, spiral, flow 3.5 ml/s, 0 s pause after |
| Target total time | ~3:00–3:15 |

**xBloom app program:** Bloom 45 ml / 94 °C / 3.5 ml/s / 45 s pause · Pour 2 +105 ml (cum 150) / 94 °C / 3.5 ml/s / 30 s pause · Pour 3 +97 ml (cum 247) / 93 °C / 3.5 ml/s / 0 s pause.

**Reference cup (the control's baseline taste, per Chris):** sweet / bright, lime + tomato/herbal + light brown tea, integrated, mild flatten on cool. The Assistant's Step 0 baseline verification should land roughly here.

### Sub-step 4 — `structure_tags` vocabulary calibration (NEW — taste-study primitive)
Before scoring papers: Chris cups the **dial-in baseline** (on the baseline paper) and assigns its `structure_tags` (Body / Clarity / Finish). This calibrates the prose→tag mapping against a known cup, and establishes the **baseline textural cell** every other paper is read against. Capture both prose and tags here too (HT4 leakage tracking starts at Step 0).

### Sub-step 5 — Platform capacity + recipe-shape lock (Lesson #20 analog)
Confirm xBloom can run the locked recipe on a V60 without capacity/overflow issues. Lock pour pattern (center / spiral / circular) + agitation (pre/post) as fixed controlled variables — these are part of the constant, not per-paper variables this track.

### Sub-step 6 — Palate-fatigue watch (NEW — taste-study primitive)
Chris has the papers in stock and wants **one turn per paper** across the full cohort (~10 papers). No hard pre-cap — but palate fatigue is real for fine textural discrimination, so this is a **mid-session watch, not a pre-imposed limit:** the Assistant checks in as the cohort progresses ("are the late reads still discriminating, or getting mushy?") and offers to **split the tail to a second sitting** if fatigue sets in. **Tier-split priority if it does:** must-finish-fresh = CONE-B3 (baseline) + HALO-B3 + HALO-FAST + CONE-FAST (HT3 set) + LC4 + DC4 (CAFEC slow); defer-if-tired = MC4, APC4, METEOR-02, VCF-01. **Log any papers deferred to a second sitting — don't silently drop the tail.**

---

## Equipment Required

- **xBloom** (controlled-pour platform; programmatic temp + flow + pour-pattern)
- **Hario V60** dripper (seated in the xBloom holder — pending Sub-step 0)
- EG-1 grinder, ULTRA SSP burrs (setting locked at dial-in)
- Scale (0.1g), cups for side-by-side cupping
- Test coffee: Hydrangea Pink Bourbon Washed, ~enough for (cohort size × cups-per-paper) + baseline + retests — confirm sufficient at Step 0
- Camera (Step 0 photo confirmation)
- Cohort papers: output of Step 0 sub-steps 1 + 6

---

## Controlled Variables (locked at Step 0 dial-in; held across all papers)

| Variable | Setting (locked at 2026-06-19 dial-in) |
|---|---|
| **Platform** | xBloom, programmatic (V60 chamber, "Other"/freesolo) |
| **Brewer** | Hario V60 |
| **Coffee** | Hydrangea Pink Bourbon Washed (single bag, held constant) |
| **Dose / ratio** | 15 g / 1:16.5 (247 g water) |
| **Water** | **Home remineralized — Chris's standard (Third Wave Water + distilled).** Held constant across every paper + every sitting. NOT tap (see § Known Confounders for why). |
| **Grind** | EG-1 6.4 |
| **Temperature** | 94 / 94 / 93 °C (bloom / P2 / P3) |
| **Flow rate** | 3.5 ml/s, all pours (xBloom programmatic) |
| **Pour pattern** | Spiral, all pours |
| **Bloom / pour structure** | Bloom 45 g (45 s) → P2 to 150 g (30 s pause) → P3 to 247 g; target ~3:00–3:15 |
| **Agitation** | None beyond the spiral pour |
| **The ONLY variable** | **The paper** |

---

## Sample Size + Comparison Design

**Comparison design — paired A/B vs baseline** (taste-study primitive, not absolute scoring):
- The **baseline paper** (proposed `CONE-B3`) is brewed and cupped as the reference cell at Step 0.
- Each cohort paper is cupped and read **directly against the baseline** ("vs CONE-B3: more coating? lower clarity? same?"), then assigned its own `structure_tags`.
- Re-brew the baseline periodically through the session so the palate reference doesn't drift (analog of the filter arc's "don't run baseline 3× back-to-back").

**Replication: 1 scoring cup per paper, including the baseline** (Chris's call). No 3× control like the drawdown test — the **paired comparison design replaces the replication-derived noise floor.** A direct comparative judgment ("this reads more coating than CONE-B3") doesn't need a noise floor the way comparing two absolute drawdown numbers did. Recup is **operator-discretion only** — re-taste a single paper if a read feels genuinely unreliable; not a default. Cross-confirmation: if two same-family papers (CONE-B3 + HALO-B3, or two CAFEC) read identically, that's corroboration.

**Baseline palate-drift anchor (operator-discretion):** re-taste the baseline (CONE-B3) **once or twice distributed through the session** — not for precision, purely to re-anchor the palate as it tires across the cohort. ~1-2 extra cups, not a 3× control.

**Cohort:** full owned V60 cone cohort (~10 papers), one turn each; palate-fatigue watch per Step 0 sub-step 6 (split the tail to a second sitting if reads degrade, don't force a fatigued palate through the full list).

---

## Recording Sheet (shape — Assistant fills during execution)

### Step 0 calibration log
- Sub-step 0 V60×xBloom fit: PASS / FAIL (+ escalation if FAIL)
- Sub-step 1 photo inventory: per-paper owned/drift
- Sub-step 2 HALO/CONE + T-code labels confirmed
- Sub-step 3 dial-in baseline recipe (full: dose/ratio/grind/temp/flow/pattern/agitation)
- Sub-step 4 baseline textural cell: prose + assigned `structure_tags` + any leakage
- Sub-step 5 platform capacity + locked pour pattern/agitation
- Sub-step 6 session budget / cohort cap / papers dropped (if any)

### Per-paper cupping sheet (one row per scoring pull)
| Pull # | Paper | SKU/Code | HT prediction | Cupping prose (verbatim) | Assigned `structure_tags` | vs baseline (more/less/same per axis) | Prose→tag leakage? | Recup? | Drawdown (prior) | Diagnosis |
|---|---|---|---|---|---|---|---|---|---|---|

### Cross-layer table (HT2 — populate at analysis)
| Paper | Measured drawdown (P1/RP4) | Textural cell (this track) | Flow→texture link? |
|---|---|---|---|---|

---

## Analysis

1. **Textural delta vs baseline.** For each paper, summarize how its `structure_tags` differ from the baseline cell (which axes shifted, direction). Classify: *distinguishable* / *indistinguishable* from baseline. (HT1)
2. **Flow × texture cross-layer.** Join each paper's textural cell to its `measuredDrawdownSec`. Does slow flow co-vary with heavier body / more coating / lower clarity, or are the layers independent? Note family-conditional patterns (HT2; watch the CAFEC family per RP4-N4).
3. **HALO vs CONE.** Direct compare HALO-B3↔CONE-B3 (and HALO-FAST↔CONE-FAST) textural cells at matched flow. (HT3)
4. **Fidelity / leakage assessment.** Tally how many prose observations had no clean canonical tag. Characterize the leakage (which axis, what kind of nuance). (HT4) — **report it; do not resolve generalization.**

---

## Output (filled at close-out — PROPOSAL only; the execution session applies)

1. **Per-paper textural cell** for each cohort paper: the assigned `structure_tags` + condition metadata (coffee, recipe, platform, date).
2. **`FilterEntry` field proposal** (shape TBD at handoff, informed by the fidelity result). Candidate flat fields paralleling the `measured*` pattern:
   - `texturalTags?: string[]` — canonical `"Axis:Descriptor"` keys (Body/Clarity/Finish)
   - `texturalCoffee?: string` / `texturalRecipe?: string` / `texturalPlatform?: string` / `texturalDate?: string` / `texturalProject?: string` — condition metadata
   - `texturalNote?: string` — free-text (incl. the prose that leaked the vocabulary)
   - **Whether this is flat tags or a richer nested cell is a handoff decision** — if HT4 shows heavy leakage, the field may need to carry prose more prominently; if leakage is low, flat tags suffice.
3. **Candidate registry correction:** `HALO-B3` / `HALO-FAST` `fitsBrewers` should add `V60` (they fit a V60 despite the "BS-only" listing). Flag for the execution session — **do not apply here.**
4. **`filters.md` cluster-doc update** surfacing the textural layer (parallel to how it surfaces measured drawdown). Execution session.
5. **Methodology findings for the retro:** the HT4 fidelity result + any new taste-study Step-0 primitives (vocabulary calibration, palate-fatigue cap, paired-A/B reading) — logged in § Notes, evaluated at the project retro for graduation.

---

## Close-Out (Exit Conditions)

Track closes when ALL pass:
1. ✅ Sub-step 0 V60×xBloom fit resolved (PASS, or FAIL → escalated + track re-anchored)
2. ✅ Step 0 photo inventory + SKU labels resolved
3. ✅ Dial-in baseline recipe locked + recorded in full
4. ✅ `structure_tags` vocabulary calibration done; baseline textural cell captured
5. ✅ Session budget / cohort cap locked; dropped papers logged
6. ✅ All in-scope papers cupped + assigned `structure_tags` (or explicit "couldn't test" note)
7. ✅ Paired-A/B-vs-baseline reading + auto-recups applied as needed
8. ✅ 4 hypothesis tests resolved (HT1–HT4), incl. the fidelity/leakage tally
9. ✅ Cross-layer (flow × texture) table populated
10. ✅ This protocol doc filed with full data (the doc IS the archive)
11. ✅ Handoff brief produced for the execution session
12. 🛑 **Assistant session TERMINATES after the handoff brief.** No registry edits, no commits, no PRs. (Lesson #40)

---

## Known Confounders & Limitations

- **Clean washed coffee is clarity-weighted.** Pink Bourbon Washed reads clearest on the **Clarity** axis (bypass / fines / sediment differences show up best on a clean cup) but may **compress the Body axis** — papers have less body range to differentiate on than a heavy natural would. The textural signal this track produces is therefore clarity-leaning. Read findings accordingly; a future track on a heavier coffee could re-test the Body axis. (Chris-confirmed coffee; logged, not relitigated.)
- **Taste is operator-subjective + single-palate.** Unlike drawdown seconds, there's no objective instrument. The paired-A/B-vs-baseline design + vocabulary calibration mitigate but don't eliminate this.
- **Palate fatigue caps the cohort.** Discrimination degrades with cup count. The Step 0 budget cap is load-bearing; a too-large cohort produces a long tail of low-confidence reads.
- **Paper-attributed but condition-bound.** The textural cell is valid only for this coffee + recipe + platform. A different coffee or recipe could shift it. The condition metadata carries this caveat (same as `measuredBaseline` does for drawdown).
- **HALO papers in a V60 are off-design.** They're meant for the Sibarist BS; running them in a V60 is the paper-fiber comparison's whole point (HT3) but means HALO readings here are not "HALO as designed-to-be-used." The designed-housing reading is Track 3's job. Note it.
- **Registry says HALO fits BS-only.** Empirically false per Chris (V60-shaped — they fit a V60). This track surfaces the `fitsBrewers` correction but doesn't apply it (role discipline).
- **Water source: remineralized, not tap.** Chris normally fills the xBloom from Los Altos Hills **tap** (the xBloom pour-over cupping is his rough *control* context, not his optimized cup); his own pour-overs use **Third Wave Water + distilled**. For this research measurement we lock the **remineralized** water — *not* because the paper comparison needs it (any water works if held constant), but because (a) remineralized is reproducible across sittings where municipal tap drifts, (b) it's his real optimized-brew water so readings transfer, and (c) it sets a consistent foundation for the shared-coffee water-chemistry project (§ Next #5), where water becomes the variable. **Hard requirement either way: identical water for every paper + every sitting.** If Chris prefers tap for simplicity, that's valid *only* if it's the same tap throughout (ideally one sitting). [Substrate note: Chris's xBloom-vs-own-pourover water habit was previously unverbalized — flagged for capture, see § Notes.]

---

## Open Questions (Chris resolves at home before Assistant spawn)

Status at 2026-06-19:

1. **V60 × xBloom fit** — ✅ **CONFIRMED.** Track runs on V60.
2. **xBloom dial-in baseline recipe** — ✅ **LOCKED** (2026-06-19; full recipe in § Step 0 sub-step 3).
3. **Water source** — ✅ **RESOLVED: home remineralized** (Chris's standard), held constant. (Decision rationale in § Known Confounders.)
4. **Replication / cohort** — ✅ **RESOLVED.** 1 turn per paper (no 3× control); full ~10-paper cohort with a mid-session palate-fatigue watch (sub-step 6).
5. **Baseline paper** — ✅ **CONFIRMED `CONE-B3`** (continuity with the P1 cone-drawdown baseline; HALO-B3 is a cohort challenger, not the baseline).
6. **⏳ THE ONE OPEN ITEM — BS texture test placement.** The Sibarist BS now fits the xBloom (big slot, claw holder removed, 2026-06-19). **Recommendation: keep this track V60-only; route the AI-4-faithful "HALO-B3 vs CONE-B3 both in BS" texture test to a future Track 3** (own brewer, geometry-split discipline). Alternative if Chris wants AI-4 closure sooner: add 1–2 *flagged* exploratory BS pulls to this session (Lesson #16 budget). **Chris confirms before spawn.** Default = Track 3.

---

## Notes for Future Research-Project Pattern (friction → process retro)

*(Assistant fills during execution. Seed observations from Coordinator scoping below.)*

**Coordinator-scoping observations (pre-execution):**
- **Roadmap seed vocabulary collided with canonical substrate** ("thin/syrupy/heavy" not in `structure_tags`). Caught at Coordinator scoping by reading `lib/flavor-registry.ts`, not at protocol time. Friction signal: roadmap entries that seed *example vocabulary* should be checked against canonical registries before the protocol doc inherits them. (Candidate primitive: "verify seed vocabulary against substrate at scope time.")
- **The AI-4 tension softened mid-scoping** when the HALO-fits-V60 fact surfaced. The reframe (broad "do papers differentiate") + the literal (HALO-B3 vs CONE-B3) are now BOTH addressable in one V60 cohort. Worth noting how a single platform-fit fact reshaped the project's relationship to its originating audit item.
- **Taste study needed three Step-0 primitives the flow arc never produced** (vocabulary calibration / palate-fatigue watch / paired-A/B reading). These are calibration-arc *extension candidates* — but per the cross-project gate, they graduate only if a SECOND taste-shaped project (Track 2 = Kalita flat, or a future bloom/sensory project) fires them too. Logged here for the retro, not folded into `calibration-arc.md` yet.
- **Dial-in baseline sourced from the brewing workflow, not derived in-session** (Chris's call). When a research track needs a "good recipe" as a controlled input, it comes from the `/brew` skill (brewing craft), and the measurement session only *verifies it reproduces*. Candidate primitive: *separation of brewing craft from measurement — measurement sessions consume recipes, they don't derive them.* Graduates if a second recipe-dependent track repeats it.
- **Unverbalized substrate surfaced at recipe-lock: Chris's xBloom water habit.** Dialing in the recipe made Chris realize he normally fills the xBloom from **Los Altos Hills tap** (treating xBloom pour-over cupping as a rough control context), whereas his own optimized pour-overs use **Third Wave Water + distilled**. This is brewing substrate that was never written down. **Candidate fold-out for the execution session / future water project:** capture "Chris's per-context water" somewhere durable (brewing-equipment / water substrate). Pattern note: *recipe-lock at Step 0 surfaces controlled-variable substrate that casual brewing never forced explicit* — a reason the dial-in step earns its keep beyond just producing a recipe.
- **The BS-fits-xBloom fact arrived AFTER the freeze and opened a third track.** A platform-fit discovery (the Sibarist BS sits in the xBloom big slot with the claw holder removed) reshaped the project's track structure mid-scoping (added candidate Track 3) and re-opened how faithfully AI-4 can be answered. Friction signal: platform-capability facts are load-bearing scope inputs and surface late (they need the operator physically at the machine) — a reason the at-home platform-validation items (§ Open questions) deserve their own pre-spawn pass rather than being assumed at scope time.

**Assistant-execution friction (fill during run):**
- *(TBD)*

---

End of Research Project #5 Track 1 v0.1 DRAFT. Awaiting Chris sign-off + at-home platform validation, then Assistant spawn.
