# Filter Textural-Quality Layer — V60 Cone Cohort (Research Project #5, Track 1)

*Coffee Research · Latent · Research Project*

**Version:** 0.1 (DRAFT — Coordinator-authored, pre-execution)
**Date drafted:** 2026-06-18
**Date executed:** 2026-06-19 (Assistant spawned)
**Status:** ✅ **EXECUTION COMPLETE (2026-06-20) — handoff brief produced; awaiting compile session.** All 12 pulls done across 2 sittings (10 V60 cohort + 2 flagged BS). HT1–HT4 resolved; cross-layer table populated; handoff brief at doc bottom (§ HANDOFF BRIEF FOR COMPILE SESSION). NO substrate edits / commits / PRs (Lesson #40). **Next:** compile session integrates substrate per the handoff brief's § Substrate edit specifications (registry `fitsBrewers` correction is the only high-confidence code edit; the `FilterEntry` field shape needs operator sign-off). Coordinator carries § New lessons + § Methodology findings to the retro.
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

**Scope note (BS-fits-xBloom, 2026-06-19):** the *fuller* AI-4 test — HALO-B3 vs CONE-B3 **both in the Sibarist BS** (mirroring RP4's both-in-BS flow comparison, testing whether HALO's design rationale lives in its native *housing*) — keeps the brewer constant at the BS, distinct from the V60 cohort's geometry-split discipline. **[RESOLVED 2026-06-19: Chris folded 1–2 *flagged exploratory* BS pulls into this session for earlier AI-4 closure — see § Open questions item 6. They run at end of session, stay off-cohort/flagged, and are NOT cross-compared against the V60 cells (brewer geometry differs). A full BS-native Track 3 may still follow.]**

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

---

#### ▶ Step 0 Execution Log — LIVE (2026-06-19 session)

*(Assistant-filled during the run. The bullets above are the shape; this is the data.)*

- **Sub-step 0 — V60 × xBloom fit:** ✅ PASS. Chris re-confirmed the V60 seats in the xBloom and the bloom lands in the bed clean (no overflow / no side-channeling) — verified during the reference-recipe dial-in (2026-06-19).
- **Sub-step 1 — physical-photo inventory:** ⏭️ WAIVED (logged, not silently dropped). Chris waived fresh photos: the identical 10-paper cohort was physically photographed + SKU-cross-checked during the filter-drawdown project (RP4), inventory unchanged since, and all 10 read `owned: true` in `lib/filter-registry.ts`. Drift risk judged low on an unchanged, already-verified cohort. *Deviation from Lesson #1 — recorded for the retro (candidate primitive: "prior-project photo inventory carries forward when the cohort is unchanged").*
- **Sub-step 2 — HALO/CONE + CAFEC T-code labels:** ✅ CONFIRMED. CAFEC T-codes (T-83 DC4 / T-90 MC4 / T-92 LC4) match (re-confirmed from RP4). HALO packs (`HALO-B3`, `HALO-FAST`) are labeled distinctly and kept physically separate. **HALO stays IN the V60 cohort** (Chris confirmed) — HT3-in-V60 is live; HALO *also* runs in the end-of-session flagged BS pulls (item 6). 10-paper V60 cohort intact.
  - **Operator prior logged as the HT3 pre-state (Lesson #16):** Chris's strong prior — **HALO-FAST = CONE-FAST and HALO-B3 = CONE-B3 on paper *material/fiber*** (same fiber as their CONE counterparts, only **geometry/sizing tweaked to seat in the Sibarist BS**). Predicted HT3 outcome: **texturally identical → the HALO/CONE distinction is a fit/housing story, not a cup story** (the "if identical" branch of HT3). The cup adjudicates.
  - **Geometry cross-check:** ✅ DONE (2026-06-19, Chris visual on CONE-B3 vs HALO-B3, photos in session). **Bed-contact cone surface — fiber, material, cone shape, and wall angle are IDENTICAL** between CONE-B3 and HALO-B3. Two differences, BOTH confined to the periphery (not the filtration surface): (1) **outer rim / top edge** — HALO's is slightly *elongated* (it hangs/hooks off its own outer rim in the BS, which has no dripper to hold the paper; the V60 CONE is cut shorter because the dripper supports it); (2) **seam strip** — HALO's seam is *much more structured / pronounced*, CONE's is flatter (Chris's read: in the self-supporting BS the seam does structural work keeping the walls from collapsing under the water column; the V60's dripper walls make that role redundant). Same outcome expected for HALO-FAST vs CONE-FAST (not separately inspected; carried by family).
  - **Fiber-vs-fit confounder — RESOLVED FAVORABLY for HT3-in-V60:** because the bed-contact fiber + cone geometry are identical, HALO seats and filters in the V60 essentially like CONE (the elongated rim sits above the bed = cosmetic; the structured seam's job is neutralized by the V60 dripper walls). So an HT3-in-V60 texture difference, if any, can't easily be pinned on fit — it would point to fiber micro-differences (Chris asserts none) or the **seam** (the prime suspect, where the more-structured HALO strip meets the dripper rib). **Sharpened HT3 prediction: HALO-B3 ≈ CONE-B3 in the V60** (and HALO-FAST ≈ CONE-FAST). **Cross-track implication:** the rim + seam differences are *BS-context* features (load-bearing only when the filter is self-supporting); they are the variables for the flagged BS pulls / Track 3 — i.e. if HALO's design rationale shows up anywhere, it's in the BS, not the V60. Refines § Known Confounders "HALO in a V60 is off-design" → off-design only at the rim/seam, which the V60 neutralizes.
  - **Registry-correction candidate confirmed (FLAG, do not apply):** `HALO-B3` + `HALO-FAST` currently carry `fitsBrewers: ["Sibarist Brewing System (cone module)"]` — no `V60`. Empirically they fit a V60. For the execution session to add `V60`.
- **Sub-step 3 — dial-in baseline VERIFY (reproduce, don't re-dial):** ✅ PASS. CONE-B3 brewed at the locked recipe in the xBloom→V60. Cup landed on the reference profile: aroma sweet / tomatoey / lime; hot = sweet, tomatoey, slight alkalinity; light / crisp / clear; flattens mildly on cool (matches the reference's "mild flatten on cool"). **xBloom end-time = 3:15** (within the ~3:00–3:15 target). Water = 1/3 Third Wave Water + 2/3 distilled (Chris's standard remineralized), held constant across the whole cohort. *Note: the slight alkalinity vs the originally-dialed reference is a water-batch nuance — immaterial because this brew IS the baseline cell all papers read against, on identical water.* Baseline reproduces → cleared to score.
- **Sub-step 4 — `structure_tags` vocabulary calibration:** ✅ DONE. **Baseline textural cell (CONE-B3, this coffee / recipe / platform, 2026-06-19):** `["Body:Round", "Clarity:Clean", "Finish:Clean"]` — Chris-confirmed.
  - Body:Round = "middle of the road, not super light, not thick, not creamy, not syrupy" (centered weight). Clarity:Clean = "clear, crisp, well-separated, monotone-not-vivid." Finish:Clean = "disappeared quick and clean" (Chris-confirmed after-swallow read).
  - **HT4 leakage #1 (logged at pull zero):** Chris's strongest texture words — **"flat / monotone / middle-of-the-road / unremarkable"** — have NO clean canonical home. `Body:Round` is the closest but connotes a *pleasant balanced* body, not "nothing remarkable." Also non-canonical: **"crisp"** (mapped to Clean) and **"sparkling"** (used as an absent reference point). Implication: cohort reads may lean on *vs-baseline direction* more than absolute tags.
  - **Single-coffee caveat (Chris-raised) on HT4:** all leakage evidence this track is from ONE coffee (Pink Bourbon Washed, clarity-weighted). Any vocabulary-expansion recommendation is therefore *provisional / coffee-conditioned* — graduates only if a second coffee or track reproduces the leakage. Reinforces "do not resolve generalization here" + § Known Confounders clarity-weighting.
- **Sub-step 5 — platform capacity + pour-pattern / agitation lock:** ✅ CONFIRMED via the baseline brew (no overflow; clean drain to 3:15). LOCKED controls: **pour pattern = spiral (all pours), agitation = none beyond the spiral pour, flow = 3.5 ml/s.** Fixed controlled variables, not per-paper.
- **Sub-step 6 — palate-fatigue watch:** ✅ ACTIVE (no hard cap; one turn per paper, Chris's call). Must-finish-fresh = CONE-B3 (done), HALO-B3, HALO-FAST, CONE-FAST, LC4, DC4. Defer-if-tired = MC4, APC4, METEOR-02, VCF-01. Assistant checks in mid-cohort; offers to split the tail to a second sitting if reads degrade; deferred papers logged, not dropped.
- **PROCESS PRIMITIVE adopted mid-session (Chris-requested) — structured per-axis tasting prompts.** Chris asked the Assistant to PROACTIVELY prompt him before/during each pull with the specific per-axis questions to attend to while tasting (e.g. Finish: "disappear quick & clean? drop off short? dry grip? coat/linger?"). Directing attention per axis sharpens the prose, which sharpens the prose→tag mapping. **Adopted as the per-pull format for the rest of the session.** Candidate methodology primitive for the retro: *structured per-axis tasting prompts guide the operator's attention and improve subjective→taxonomy fidelity* (taste-study execution primitive; graduates if a second taste track uses it).

#### ▶ HT Predictions — pre-stated (2026-06-19, Lesson #16 active mode)

Pre-stated BEFORE scoring; resolved after the cohort. (HT3/HT4 partly pre-stated above at Step 0; consolidated here.)

- **HT1 (do papers differentiate at all?):** PREDICT *modest* differentiation — **strongest on Clarity/Finish, compressed on Body** (the clarity-weighted clean washed coffee gives papers little body range to differ on, § Known Confounders). Plausible partial-null on Body; a clean full-null across all axes is possible and publishable.
- **HT2 (does flow predict texture?):** PREDICT a *weak* flow→texture link at best — the slow CAFEC family (LC4 +16 / DC4 +19 in RP4 BS) *might* read marginally heavier-body / more-coating / lower-clarity, but the compressed body axis likely masks it. Secondary: the realistic xBloom end-times may rank papers differently from the non-realistic prior drawdowns (a finding in itself).
- **HT3 (HALO-B3 vs CONE-B3 in V60):** PREDICT **HALO-B3 ≈ CONE-B3** (and HALO-FAST ≈ CONE-FAST) — identical fiber + cone, seam role neutralized by the V60 dripper (geometry cross-check). If a difference appears, **seam is prime suspect.** Maps to HT3's "identical → fit/housing story, not a cup story" branch.
- **HT4 (vocabulary resolution):** PREDICT *moderate* leakage concentrated on **Body** (no "neutral/unremarkable" descriptor; already 1 leak at calibration), with Clarity/Finish mapping more cleanly. Coffee-conditioned (single-coffee caveat).

**Pull order (palate-fresh HT-critical set first):** 0 CONE-B3 ✅ → 1 HALO-B3 (HT3) → 2 CONE-FAST → 3 HALO-FAST (HT3 ext) → 4 LC4 (HT2) → 5 DC4 (HT2) → *re-anchor CONE-B3* → 6 MC4 → 7 APC4 → 8 METEOR-02 → 9 VCF-01 → *flagged BS pulls (HALO-B3 + CONE-B3 in BS)*.

### Per-paper cupping sheet (one row per scoring pull)

**Pull 0 (baseline / calibration) — CONE-B3:** prose "very light middle of the road, not extremely light, not syrupy, not creamy, flat monotone; clear, crisp; flattens on cool" → `["Body:Round","Clarity:Clean","Finish:Clean"]` · vs-baseline = *is* the baseline · leakage = "flat/monotone/unremarkable body" (HT4 #1) · xBloom end-time 3:15 · prior drawdown 60s P1 / 92s RP4.

**Pull 1 — HALO-B3 (HT3 headline):** end-time **3:10** (vs baseline 3:15 = same). Aroma tomato/lime = same. **Body:** "about the same — but *between Round and Light*: lighter than round, more round than light; not sure Round was the best word, and CONE-B3 felt the same." **Clarity:** "about the same — clear, separated, crisp edge." **Finish:** "pretty clean — no dry grip, no coat/linger." Brewing: no difference; **the thicker HALO seam flattens once the paper is wet.** → `["Body:Round","Clarity:Clean","Finish:Clean"]` · **vs baseline = SAME on all 3 axes** · HT prediction (HALO-B3≈CONE-B3) **HIT** · prior drawdown 134s P3 / 91s RP4 BS.
  - **HT3 read (B3 pair): IDENTICAL in the V60** — confirms the pre-stated prediction + Chris's prior (same fiber/cone; seam neutralized when wet). The "identical → fit/housing story, not a cup story" branch. **Seam suspect CLEARED** (wet seam goes flat). Awaiting HALO-FAST↔CONE-FAST replication.
  - **HT4 leakage #2 (Body axis, strong):** body articulated as **"between Round and Light"** — no canonical descriptor spans that gap. RETROACTIVELY applies to the CONE-B3 baseline (same sensation); Chris flags `Body:Round` may be wrong for both. Tag held at `Body:Round` (closest; "more round than light") + leakage logged. Second Body-axis leak (cf #1 "flat/unremarkable") → the **Body axis is under-resolved for this coffee's middle weight.** Candidate retro descriptor: a Round↔Light intermediate. Coffee-conditioned.

**Pull 2 — CONE-FAST (FIRST REAL DIFFERENTIATOR):** end-time **2:38** (vs baseline 3:15 = **−37s, much faster**; matches fast-paper prediction). Aroma tomato/lime = same. Hot: brighter, more lime-forward, body lighter. **Body:** "much lighter — thins to watery / tea-like throughout, pretty thin by the end; almost too watery." → lighter than baseline. **Clarity:** "more clear and crisper, emphasizing the acidity." → more clear than baseline. **Finish:** "much quicker to drop off, thin at the end, almost too watery on the finish." → shorter than baseline. Operator note: "for real I'd lower the grind to compensate — feels too thin." → `["Body:Light","Clarity:Clean","Finish:Short"]` · **vs baseline: Body LIGHTER (Round→Light) · Clarity MORE clear (Clean, higher intensity) · Finish SHORTER (Clean→Short)** · HT prediction (lighter/clearer/shorter/faster) **HIT** · prior drawdown 45s P1.
  - **HT1: FIRST REAL DIFFERENTIATOR.** Papers DO move texture on this coffee — the FAST paper shifts all three axes vs baseline. HT1 leaning "distinguishable" (at least at the fast end).
  - **HT2 data point (supports a flow→texture link):** fastest flow (2:38 realistic / 45s P1) ↔ lightest body + most clarity + shortest finish. Direction consistent with the HT2 hypothesis (fast→lighter/clearer; slow→heavier predicted). Awaiting the slow CAFEC papers to complete the curve.
  - **HT4 leakage #3 (NEW KIND — temporal/phase dimension):** Chris described the cup in his brewing **"phase" framework** — "front-loaded / phase-one heavy, phase-two-three light; body drops out mid-late; tapers dramatically by the end; feels 'more integrated' only because the body is less present." The `structure_tags` vocabulary is **static (a snapshot)** — `Finish:Short` captures only the back-end taper, not the front-heavy / body-absent-mid *temporal distribution*. A **missing dimension** (temporal/phase evolution), distinct from the Body-axis *descriptor* gaps (#1/#2). Strong retro candidate. Coffee-conditioned.
  - **Body-axis ordering clarified by contrast:** with CONE-FAST clearly Light/thin, the B3 papers' "between Round and Light" now reads as *Round-minus* (heavier than FAST, lighter than a true Round). Relative ordering FAST(Light) < B3(Round-ish) holds; supports FAST=Light, B3=Round + leakage.

**Pull 3 — HALO-FAST (HT3 extension / FAST pair):** end-time **2:40** (vs CONE-FAST 2:38 = tied; both ≫ faster than baseline). Brewing same. Aroma/flavor = same (lime/tomato/tea, acidity-forward). **Body:** "still very thin" = same as CONE-FAST. **Clarity:** "pretty crisp, same." **Finish:** "same quick drop off." → `["Body:Light","Clarity:Clean","Finish:Short"]` · **vs baseline: same deltas as CONE-FAST (Body lighter / Clarity more clear / Finish shorter)** · **vs CONE-FAST (the pair): SAME on all canonical axes** · HT prediction (HALO-FAST≈CONE-FAST) **HIT**.
  - **HT3 read (FAST pair): IDENTICAL on canonical vocab** → with the B3 pair, BOTH HALO/CONE pairs read identical in the V60. **HT3 CONFIRMED (V60 level): the HALO/CONE fiber distinction is NOT a cup story in a V60.** Seam suspect cleared on FAST too (HALO-FAST seam is *thinner* than HALO-B3's — FAST paper-tech caps seam thickness — and flattens when wet).
  - **Low-confidence nuance (the ONLY perceived difference):** Chris thinks the **phase-2→phase-3 taper is *less severe* on HALO-FAST** than CONE-FAST (CONE-FAST went "almost too watery by the end"; HALO-FAST "not as thin to watery by the end"). Phase-1→2 drop big on both; phase-2→3 gentler on HALO-FAST. **Chris explicitly uncertain** ("not sure how much is the paper vs minor variation; probably the same"). 1× replication, no noise floor → treated as **within-noise; does NOT change the tag-level HT3 conclusion.**
  - **Reinforces HT4 leakage #3 (temporal/phase):** the one place a possible HALO≠CONE difference appears is the **late-phase taper** — i.e. in the *temporal dimension the static `structure_tags` cannot represent.* Even the sub-threshold fiber signal, if real, is un-taggable. Strengthens the missing-temporal-dimension finding.
  - Size note: Chris's CONE-FAST = smaller size; HALO-FAST = cone-02 (same as B3). Per Chris, size functionally irrelevant (cf RP4 AI-6 size-variant sub-SKU candidate).

**Pull 4 — LC4 / CAFEC T-92 (HT2 slow end):** end-time **4:09** — LONGEST by far. Bulk of the time came after P2: "almost started to choke, water filled up in the dripper, took a long time to go down"; slower than the others even before the backup. NOT a fine grind → the choke is paper-driven, not grind (parallels RP4-N1 CAFEC buckle-under-load). Aroma same, slightly less citrus; not over-extracted despite the long contact. **Body:** "this is what I think of as round and fully integrated — fuller, rounder, one big put-together blob; more consistency than the FAST papers; NOT coating, NOT syrupy, not a heavy textural coffee, but fuller/rounder/more integrated." → the cohort's clearest **true Round.** **Clarity:** "much less separated — you don't see the cuts of flavors, one big integrated mass; not muddy, but not clean-separated." → LOWER clarity than baseline. **Finish:** "more lingering — not overly, but more than the others; doesn't cut/drop off; heaviness evenly distributed." → `Finish:Lingering`. **Phase shape:** "much more coherent/steady across ALL phases; hard to even detect phases; one integrated mass; lime spikes are part of the whole mass, not isolated to a phase." → even temporal distribution (OPPOSITE of CONE-FAST's front-loaded taper). → `["Body:Round","Finish:Lingering"]` (Clarity left untagged — see leak #4) · **vs baseline: Body FULLER · Clarity LESS clear/separated · Finish LONGER (Clean→Lingering)** · HT prediction (heavier/lower-clarity/longer/slower) **HIT strongly** · prior drawdown 80s P1 / 107s RP4.
  - **HT2: slow→heavy end CONFIRMED.** With CONE-FAST (fast→light/clear/short) + baseline (mid) + LC4 (slow→full/integrated/lingering), flow co-varies *monotonically* with body (heavier), clarity (lower), finish (longer). **HT2 has a real directional spine on this coffee.**
  - **HT2 MEDIATION HYPOTHESIS (key analytical thread — flag for analysis/retro, do NOT resolve here):** LC4's heavier/integrated cup may be driven by its **4:09 contact time** (slow paper → long contact → more extraction → heavier, more-integrated, longer cup), NOT a direct fiber-texture mechanism. If so, **a paper's textural fingerprint is largely a RESTATEMENT of its flow fingerprint (via contact time)** — which would unify HT1/HT2/HT3: HALO≡CONE because same flow→same contact (HT3); CAFEC differ because slow flow→long contact (HT2); and the textural `FilterEntry` field would add little beyond `measuredDrawdownSec`. Counter-check needed against DC4 + the medium papers (does texture track *end-time* across papers, or is there a fiber residual at matched flow?). The HALO/CONE matched-flow identity is the cleanest natural control for this.
  - **HT4 leakage #4 (NEW — Clarity axis is one-directional):** the Clarity axis has only *high-clarity* descriptors (Clean / Transparent / Refined / …) and **no LOW-clarity / "integrated" / "less-separated" descriptor.** LC4 reads *less clear* than baseline but cannot be tagged for it — only recorded as a vs-baseline delta. Distinct from the Body gaps; a missing *direction* on an axis. Coffee-conditioned.
  - **Reinforces leakage #1/#2 (Body gradient compression):** `Body:Round` now spans Round-minus (B3 papers) → true-Round (LC4), with `Light` (FAST). The single Round descriptor absorbs a real, ordered weight gradient; a Round↔Light intermediate would place the B3 papers correctly. Three cohort anchors now evidence the under-resolution.
  - **Reinforces leakage #3 (temporal dimension):** LC4 (even/steady, phases indistinct) is the OPPOSITE temporal shape to CONE-FAST (front-loaded, tapering). Papers visibly differ on *temporal distribution* — a dimension the static vocab cannot express. May be the cohort's strongest differentiation axis, and it's not in the vocabulary.

**Pull 5 — DC4 / CAFEC T-83 (HT2 slow; CAFEC cross-confirm; last of sitting 1):** end-time **3:39** (slower than baseline 3:15, FASTER than LC4 4:09). Same P2 choke as LC4 but **drew down quicker/smoother at the end — less choked.** Aroma tomato/citrus = same. Hot: more clarity + acidity than LC4. **Body:** "rounder, integrated — but LESS full than LC4 (which had longer contact time); less one-big-mass; still integrated but I can still taste phases 1/2/3, still some sharpness; much smoother/rounder than FAST or B3." → Round, **intermediate between B3 and LC4.** **Clarity:** "less one-mass than LC4, more integrated than FAST/B3 — sits BETWEEN B3 and LC4. Separation order: FAST≈B3 (most) > DC4 (mid) > LC4 (least)." **Finish:** "clean lingering — lingers very slightly but still pretty clean; not as much as LC4." → between Clean and Lingering. **Phase shape:** "I CAN see the phases (acidity / tomato / darker tea, lingers); more integrated than FAST/B3 but NOT as even/steady as LC4." → intermediate temporal shape. → `["Body:Round","Clarity:Clean","Finish:Clean"]` · **vs baseline: Body fuller (slight) · Clarity slightly less separated · Finish slightly more lingering — all MILD** · HT prediction (≈LC4, CAFEC-slow→heavy) **PARTIAL HIT** (same direction as LC4 but milder; tracks its shorter contact time) · prior drawdown 68s P1 / 110s RP4.
  - **HT2 MEDIATION HYPOTHESIS — STRONGLY SUPPORTED (Chris's own observation).** DC4's end-time (3:39) is BETWEEN baseline (3:15) and LC4 (4:09), and its texture is BETWEEN them on EVERY axis (body, clarity, finish, phase-integration). Chris directly: "less full than the one before, **although the one before had a much longer contact time than this one**" — reading body off contact time. Cohort now monotonic: **end-time ↔ texture** — CONE-FAST (2:38) < baseline (3:15) < DC4 (3:39) < LC4 (4:09). Texture tracks realistic drawdown. The textural layer looks largely predictable from the flow layer (contact-time-mediated) — *flag for analysis; the deferred mediums + the HALO/CONE matched-flow control finalize it.*
  - **HT2 secondary (realistic re-ranking):** realistic end-time ranks LC4 (4:09) slower than DC4 (3:39), but RP4 BS ranked DC4 (+19) slower than LC4 (+16). Realistic-condition drawdown re-orders the two slow CAFECs vs the non-realistic dump — a data point for the xBloom-end-time layer's distinct value.
  - **HT4 HEADLINE ILLUSTRATION — identical tags, different cup.** DC4's canonical cell `["Body:Round","Clarity:Clean","Finish:Clean"]` is **IDENTICAL to the baseline CONE-B3 cell**, yet DC4 is observably different (slower, fuller, less separated, slight linger, more integrated). All the difference lives in the vs-baseline deltas + the "intermediate/between" leakage — NONE in the absolute tags. Clearest single proof that the vocabulary under-resolves a continuous textural gradient: **the cohort varies on a continuum; the tags are sparse discrete points; most differentiation is captured only by direction-vs-baseline + leakage.** Reinforces leaks #1–#4 simultaneously.

### ▶ SITTING 1 PAUSE — checkpoint & resumption (2026-06-19)

**Stopped at the daily consumption ceiling (6 experiment cups; see § Notes → consumption ceiling). Sitting 1 = pulls 0–5 COMPLETE.**

**Done (6 papers, V60):** CONE-B3 (baseline) · HALO-B3 · CONE-FAST · HALO-FAST · LC4 · DC4.

**Deferred to SITTING 2 (logged, NOT dropped):**
- V60 cohort tail: **MC4** (T-90) · **APC4** (Abaca+) · **METEOR-02** (Hario) · **VCF-01** (Hario commodity).
- Flagged exploratory **BS pulls**: HALO-B3 + CONE-B3 *both in the Sibarist BS* (open-scope item 6; the housing-question test).

**HT status at the pause:**
- **HT3 — RESOLVED (V60 level).** Both HALO/CONE pairs (B3 + FAST) read identical in the V60; fiber distinction is not a cup story in a V60. (BS pulls test the *separate* housing question in sitting 2.)
- **HT1 — leaning DISTINGUISHABLE.** Papers move texture (CONE-FAST light end, LC4 full end, DC4 intermediate). Real but largely flow-ordered + partly in the un-taggable temporal dimension. Mediums (sitting 2) confirm the middle.
- **HT2 — strong directional spine + mediation hypothesis well-supported.** Texture tracks realistic end-time monotonically (FAST<base<DC4<LC4); likely contact-time-mediated. Mediums + the HALO/CONE matched-flow control finalize at analysis.
- **HT4 — accumulating; 4 leakage classes:** (1) Body "neutral/unremarkable" gap; (2) Body Round↔Light intermediate gap; (3) **temporal/phase dimension entirely missing** (strongest); (4) Clarity one-directional (no low-clarity descriptor). Plus the DC4 "identical tags, different cup" illustration. All coffee-conditioned.

**Resumption (fresh session, sitting 2):** read this protocol doc; resume at Pull 6 (MC4) with the SAME locked recipe + per-axis tasting-prompt format; finish the V60 tail (MC4, APC4, METEOR-02, VCF-01); then run the flagged BS pulls; then populate the cross-layer table + resolve HT1/HT2/HT4; then produce the handoff brief + terminate. **Re-anchor on CONE-B3 once at sitting-2 start** (palate drifts across days) — re-verify the baseline cell `["Body:Round","Clarity:Clean","Finish:Clean"]` reproduces before scoring the tail.

**No registry edits / commits / handoff brief this session — track incomplete (Lesson #40 role discipline holds across the pause).**

### ▶ SITTING 2 — resumed 2026-06-20

**Pull 6 — CONE-B3 RE-ANCHOR (cross-day palate reset + reproducibility check):** end-time **3:14** (vs sitting-1 baseline 3:15 = **1s — excellent cross-day reproducibility**). Texture re-read: Round / Clean / Clean — "middle of the road, clear, quick clean finish, flattens mildly on cool," matches the sitting-1 baseline cell exactly. Reference cup (sweet/bright, lime + tomato/herbal, mild flatten) confirmed. → **Baseline reproduces across days; palate re-anchored; cleared to score the tail.**
  - **Methodology win (cross-day reproducibility):** the xBloom realistic end-time reproduced to 1s across a full day (3:15→3:14) — notable vs the filter arc's cross-session ABSOLUTE drift (HALO-B3 134s→91s, RP4 AI-1 unresolved). Strengthens the realistic-drawdown layer's reliability as a flow metric. (Same coffee/recipe/water/platform held; n=1 cross-day point, but clean.)

**Pull 7 — MC4 / CAFEC T-90 (matched-flow mediation control):** end-time **3:20–21** (near baseline 3:14, slightly slower). **Did NOT choke** like LC4/DC4 — drained smoothly, low contact time like baseline. Aroma tomato/earthy/floral/citrus = same. Hot: brighter, more citrus. **Body:** "middle of the road, lighter — not as light as FAST; about the same as B3; that in-between-Light-and-Round zone we don't have a word for — same as B3." → `Body:Round` (Round-minus zone, = B3/baseline). **Clarity:** "more separation, taste acidity more; equivalent to B3, a LOT more separated than the other CAFECs (LC4/DC4)." → `Clarity:Clean` = baseline. **Finish:** "pretty quick clean, no real lingering." → `Finish:Clean` = baseline. **Phase shape:** "clean separation, can taste phases individually but all phases light/consistent, no heaviness in one." → distinct-but-even, baseline zone. **Key read:** "texture tracks the whole time, tastes pretty baseline to me." → `["Body:Round","Clarity:Clean","Finish:Clean"]` · **vs baseline: SAME on all 3 axes (genuinely — tags AND cup)** · HT prediction (matched flow → baseline texture) **HIT** · prior drawdown 60s P1 / 98s RP4.
  - **HT2 MEDIATION — STRONGLY REINFORCED (cross-family matched-flow control).** MC4 is a CAFEC that flows near baseline (no choke, 3:20) and reads near baseline — while its slow-choking CAFEC siblings (LC4 4:09, DC4 3:39) read heavy. **Texture tracks the paper's actual flow, NOT its family/fiber.** Dissociates family from texture: the "CAFEC-family-slow" RP4 finding is a FLOW property; on TEXTURE, fast-flowing MC4 breaks the family pattern and reads baseline. Second matched-flow control (after HALO/CONE), stronger because cross-manufacturer. Mediation now evidenced from both ends (matched-flow→same, varied-flow→varied).
  - **HT1 refinement:** differentiation is **flow-driven, not universal** — papers that flow like baseline (MC4; HALO-B3/FAST at their matched flows) read like baseline; only papers that flow differently (CONE-FAST fast; LC4/DC4 slow) differentiate. Unifies HT1/HT2/HT3.
  - **Reinforces leakage #2 (Body Round↔Light gap):** MC4 is the THIRD paper (with CONE-B3, HALO-B3) Chris places "between Light and Round" with "no great word." Three cohort anchors in the un-named zone — strong evidence for the missing intermediate descriptor.
  - **Contrast with DC4 (clean HT4 illustration):** DC4 tagged baseline but read DIFFERENT (sub-tag leakage); MC4 tagged baseline AND reads same. The vocabulary can't distinguish "true same" (MC4) from "different-but-untaggable" (DC4) — both collapse to the baseline cell. Direction-vs-baseline + leakage carry the distinction.

**Pull 8 — APC4 / CAFEC Abaca+ (slow CAFEC, different fiber; fiber-vs-flow test):** end-time **3:50** (slow; choked in P2 like LC4/DC4 — choking even began at end of P1). Aroma lime/tomato/nutty = same. First sip: "much more pronounced tomatoey/nutty than any cup so far; toward the LC4 integrated-mass direction but not as one-mass — really emphasizes the body/nutty aspects." **Body:** "fuller, heavier — not syrupy/thick, but definitely fuller; similar to LC4." → `Body:Round` (full end). **Clarity:** "way more integrated (not one-mass); emphasizes body/tomato/tea/nutty, DEEMPHASIZES lime/acidity/floral — pushes it one way." → reduced clarity (untagged, leak #4; between DC4 and LC4). **Finish:** "more lingering — tomatoey/nutty linger; not syrupy/coating, still pretty light, but more than the others." → `Finish:Lingering`. **Phase shape:** "very short first phase (acidity cut short on attack), EMPHASIZED second/middle phase (body), third phase short-but-not-as-short → middle/body-heavy." → `["Body:Round","Finish:Lingering"]` (Clarity untagged) · **vs baseline: Body fuller · Clarity less (integrated) · Finish more lingering — LC4-direction** · HT prediction (slow→full/integrated/lingering) **HIT** · prior drawdown 72s P1 / 108s RP4.
  - **HT2 mediation: Body/Clarity/Finish track its slow flow (3:50) — consistent.** APC4 slow → full/integrated/lingering, as predicted.
  - **⚠️ POSSIBLE FIBER RESIDUAL (first candidate against pure mediation) — flag for analysis, LOW confidence.** APC4 is body-forward + acidity-SUPPRESSED + MIDDLE-phase-heavy, whereas LC4 (slower, 4:09) was even/balanced one-mass. So APC4 is *more selectively body-forward at a FASTER flow than LC4* — the extra body-emphasis/acidity-damping may be an **Abaca-fiber signature** not predicted by flow alone. Confound: longer contact also suppresses volatile acidity (extraction chemistry), so it could still be flow/extraction. Can't disambiguate from 1 cup. **The one place the clean mediation story may not fully hold** — note for retro; a matched-flow Abaca-vs-non-Abaca test would settle it.
  - **Reinforces leakage #3 (temporal — FOURTH distinct shape):** APC4 = middle/body-heavy (acidity cut short) — distinct from CONE-FAST (front-loaded), LC4 (even one-mass), DC4 (distinct-declining). FOUR papers now show FOUR temporal profiles the static vocab can't express. Temporal distribution is the cohort's richest differentiation axis and it's entirely absent from `structure_tags`.
  - **Another "same tags, different cup":** APC4's canonical cell = LC4's (`Body:Round` + `Finish:Lingering`, Clarity untagged), but the cups differ (LC4 even-mass; APC4 body-forward/middle-heavy/acidity-suppressed). Reinforces the HT4 collapse.

**Pull 9 — METEOR-02 / Hario (cross-manufacturer matched-flow control #3):** end-time **3:20** (near baseline 3:14, like MC4). Mild P2 choke but passed efficiently. Aroma tomato/tea/nutty = same. First sip bright/lime, tomato body after; "very similar to MC4 (T-90)." **Body:** "baseline middle-ish, that same little-bit-lighter as all the baseline ones." → `Body:Round` (Round-minus zone = baseline). **Clarity:** "pretty clean separation, not super integrated, more on the separation/clarity side." → `Clarity:Clean` = baseline. **Finish:** "quick clean like baseline." → `Finish:Clean`. **Phase shape:** "very similar to baseline — citrus P1, tomato/nutty/tea mid, quick-clean end; nice P1/P2 balance, more acidity, close to baseline." → baseline-like. → `["Body:Round","Clarity:Clean","Finish:Clean"]` · **vs baseline: SAME on all 3 canonical axes** · HT prediction (matched flow → baseline) **HIT** · prior drawdown 65s P1 / 93s RP4.
  - **HT2 mediation: third matched-flow control confirms** (MC4 = CAFEC, METEOR = Hario — both flow≈baseline, read≈baseline). Cross-manufacturer robustness.
  - **⚠️ FIBER RESIDUAL CANDIDATE #2 (does NOT track flow) + NEW LEAKAGE #5.** METEOR has a distinctive **"more FIBROUS / textural feel — you can feel it more, not as smooth, still thin but more textural than any other paper."** This tactile graininess does NOT track flow (METEOR flows ≈ baseline) → a paper-specific signature flow can't explain (2nd residual after APC4). AND it has **no canonical home: the Body axis has only smooth-family descriptors (Creamy/Silky/Milky/Round/Aerated) + weight (Light/Syrupy) — nothing for a grainy/fibrous TACTILE quality.** New leakage class #5 (tactile-grain descriptor gap).
  - **UNIFYING INSIGHT (mediation × HT4):** the canonical 3-axis texture (Body/Clarity/Finish) is well-predicted by flow (mediation); the paper-specific residuals that DON'T track flow (APC4 temporal/body-selectivity, METEOR tactile grain) live precisely in the **dimensions the vocabulary LACKS** (temporal phase, tactile grain). The vocab's blind spots and the papers' non-flow fingerprint are the SAME dimensions.
  - **Reinforces leakage #2:** METEOR = 4th paper in the "between Light and Round" zone (CONE-B3, HALO-B3, MC4, METEOR).
  - **General observation (Chris) — choking is the NORM, Sibarist is the exception.** All non-Sibarist papers (CAFEC, Hario) choke under the structured multi-pour to some degree; only the Sibarist papers (esp. FAST) are engineered NOT to choke. Chris's Sibarist habituation made no-choke feel default; it's the reverse. Bed-behavior-under-load note (cf RP4-N1 CAFEC buckle); explains why Sibarist papers anchor the fast/clean end of the flow→texture curve.

**Pull 10 — VCF-01 Tabbed / Hario commodity (LAST V60 paper):** end-time **3:12** (touch faster than baseline 3:14). Choked in P2 like all non-Sibarist papers but cleared quicker. **Paper obs:** similar to METEOR but LESS textural, less structured, **FLIMSY — hard to hold shape in the V60 even wetted/negotiated; wants to crumble.** Chris's read: likely the same Hario paper-tech as METEOR but the cheap/flimsy version (METEOR = more structured/higher-quality). Aroma lime/tomato/tea = same. First sip: **more acidity-forward** — more lime, less tomato, less brown-tea. **Body:** "a touch thinner/lighter than control — not as thin as FAST, but thinner than baseline." → `Body:Round` (lighter edge, drifting toward Light). **Clarity:** "pretty clean separation." → `Clarity:Clean`. **Finish:** "very quick." → `Finish:Clean` (toward Short). **Phase shape:** "emphasizes FIRST phase (acidity/frontal), deemphasizes body/2nd, really deemphasizes finish/3rd — toward front-loaded, milder than FAST." → `["Body:Round","Clarity:Clean","Finish:Clean"]` · **vs baseline: slightly LIGHTER body · more front-loaded/acidity-forward · quicker finish** · HT prediction (near-baseline flow→baseline texture) **PARTIAL MISS** (flow≈baseline but cup lighter/brighter — bypass) · prior drawdown 65s P1 / 95s RP4.
  - **⚠️ THIRD RESIDUAL — BYPASS / SEATING (a SECOND flow mechanism, distinct from contact-time).** VCF flows ≈ baseline (3:12) yet reads LIGHTER/brighter/more-front-loaded. Chris's causal read: the flimsy paper **doesn't seat → channels → more BYPASS**, lightening + brightening the cup INDEPENDENT of gross drawdown time. End-time (a gross flow metric) misses within-bed **bypass**. Refines mediation: **contact-time is the dominant texture predictor, but bypass/seating is a second flow-related mechanism end-time doesn't capture.**
  - **Paper-property note (registry candidate):** VCF's poor **shape retention / flimsiness** (wants to crumble, won't hold the cone) ties to the filter-registry `bedBehaviorUnderLoad` + RP4-N1 `paperShapeRetention` sub-attribute candidate. Flag (do not apply).
  - **Reinforces leakage #3 (temporal — 5th profile):** VCF mild-front-loaded — a 5th distinct temporal shape (FAST front-loaded / LC4 even / DC4 declining / APC4 middle-heavy / VCF mild-front-loaded). The cohort spreads across a temporal continuum the vocab can't touch.
  - **Hario tactile family:** VCF less fibrous/structured than METEOR — supports METEOR's tactile-grain being a paper-structure property (same tech, VCF = flimsier/cheaper).

---

**✅ V60 COHORT COMPLETE (10/10 papers): CONE-B3, HALO-B3, CONE-FAST, HALO-FAST, LC4, DC4, MC4, APC4, METEOR-02, VCF-01.** Next: flagged exploratory BS pulls (HALO-B3 + CONE-B3 both in the Sibarist BS), then analysis + handoff.

### ▶ FLAGGED BS PULLS (off-cohort exploratory — HALO/CONE in the Sibarist BS; NOT cross-compared to V60 cells)

**Pull 11 — HALO-B3 in the Sibarist BS (at-home housing):** end-time **3:28** (BS; do NOT compare to HALO-B3-in-V60 3:10 — geometry differs). Seating: **"phenomenal — holds really well, feels designed for it (seam, higher lip, structure); less bypass — water MUST go through the whole bed, nowhere to channel."** Aroma lime/tomato/tea = same. **Body:** "baseline middle but a tad FULLER — maybe the less bypass in the BS (full bed contact)." → `Body:Round` (slightly fuller edge). **Clarity:** "separation, but much more INTEGRATED/blended — even separation, high cleanliness, less sharpness." → `Clarity:Clean` (blended/even). **Finish:** "quick clean but with nice BODY/punch — a little more punch at the end." → `Finish:Clean` (fuller). **Phase shape:** "lime P1, body P2, DELICATE between phases — clean separation with high cleanliness, soft transitions." → delicate/even/clean. → cell (BS-context) `["Body:Round","Clarity:Clean","Finish:Clean"]` + BS qualifiers: slightly fuller body + finish punch (less bypass), blended/even/high-cleanliness separation (steady flow).
  - **BS = zero-bypass architecture (confirmed).** No dripper → water can't channel → must pass the full bed. Eliminates the VCF-style bypass mechanism by design; explains the slightly fuller body vs the V60 baseline.

**⭐ EMERGENT FINDING (Pull 11) — FLOW-CONSISTENCY THEORY (3rd flow mechanism; Chris-originated, major).** Watching the BS, Chris's theory: non-Sibarist papers **flow FAST early then CHOKE late** (end of P1/P2), so the cup is a **BLEND of fast-flow + slow-flow components**; Sibarist B3 reaches the SAME end-time via a **CONSISTENT flow rate throughout** → an **evenly-extracted cup.**
  - **Within-brew flow PROFILE (steady vs fast-then-choke) shapes texture/complexity — a 3rd mechanism end-time CANNOT see.** Two papers at the same end-time (B3 3:14 steady vs MC4/METEOR ~3:20 choke-then-clear) can produce different cups: steady → even/clean/high-cleanliness; variable → blended/complex.
  - **"Better paper tech ≠ better cup" (Chris).** Consistent flow (Sibarist) = even-keeled/clean but possibly LESS complex; variable flow (choking papers) = blends differently-extracted components → possibly MORE complex. "Best" paper depends on the goal.
  - **Refines paper-as-lever (HT1):** papers select among **evenness (B3 steady) ↔ complexity (choking papers) ↔ sharpness/clarity (FAST) ↔ body (slow/long-contact).** A real, MULTI-dimensional lever — not a single "texture" scale. (B3 = consistency/even-keel; FAST = pure sharpness — the two Sibarist papers bracket the engineered ends.)
  - **Three flow mechanisms now decompose "texture":** (1) **contact time** (gross end-time → body/integration/finish-length; dominant); (2) **bypass/seating** (poor shape-retention → lighter/brighter; VCF; eliminated by BS); (3) **flow consistency over time** (steady vs choke-blend → evenness vs complexity). End-time captures only (1); (2)+(3) are within-brew properties end-time misses — and they live in the texture dimensions the vocabulary LACKS (tactile, temporal, complexity/evenness). Unifies the cohort.

**Pull 12 — CONE-B3 in the Sibarist BS (off-design; HT3-in-BS / AI-4 head-to-head):** end-time **3:22** (≈ HALO-B3-in-BS 3:28; matches RP4 identical-BS-drawdown 91/92). Aroma lime/tomato/tea = same. First sip: lime/bright/well-blended/tomato/brown-tea — "very similar to all before, and to HALO-B3-in-BS." **Body:** "pretty light but with that blended-together textural quality" — Chris's term **"round light."** **Clarity:** "clean + separated but with the blended quality; no bypass." **Finish:** "pretty clean; same heaviness/weight/brightness/clarity as the HALO one." → `["Body:Round","Clarity:Clean","Finish:Clean"]` (round-light, even/blended) = **SAME as HALO-B3-in-BS** · **vs HALO-B3-in-BS: "can't taste ANY difference between the two."**
  - **HT3-in-BS RESOLVED — HALO ≡ CONE on the CUP even in the BS.** Only difference is STRUCTURAL: HALO's seam/rim gives "a hair more structure / better fit" in the BS ("probably why they made a whole new paper version") — but "even I thought they were the same paper; a normal person wouldn't notice," and CONE-B3 "sat fine, didn't crumple." → **HALO's design rationale = fit / handling / repeatability in its housing, NOT a cup difference.**
  - **DEFINITIVE AI-4 ANSWER (both brewers converge):** V60 HT3 (HALO≡CONE) + BS housing test (HALO≡CONE in cup; HALO better ONLY structurally) → **the HALO/CONE distinction is a fit / handling / repeatability story, NEVER a cup story, in EITHER brewer.** Answers RP4 AI-4 ("what differentiates HALO-B3 if flow is identical?") → nothing in the cup.
  - **BS zero-bypass dominates paper fit:** even off-design CONE-B3 reads even/full with "no bypass" in the BS — the no-dripper architecture forces full-bed flow regardless of paper, neutralizing the VCF-style bypass mechanism.
  - **Operator coined the missing Body descriptor: "round light."** Chris naturally named the between-Light-and-Round zone "round light" — the exact intermediate the cohort kept needing (leaks #1/#2; CONE-B3/HALO-B3/MC4/METEOR all live here). Candidate name for the HT4 vocabulary-expansion recommendation.

**✅ ALL CUPPING COMPLETE (12 pulls: 10 V60 cohort + 2 BS). Data collection closed (Chris out of distilled water — natural stop). → Analysis + handoff.**

### Cross-layer table (HT2 — populated at analysis; V60 cohort, ordered by realistic end-time)
| Paper | Prior drawdown (P1/RP4, non-realistic dump) | xBloom end-time (realistic) | Textural cell (this track) | Flow→texture link |
|---|---|---|---|---|
| CONE-FAST | 45s P1 | **2:38** | `Body:Light · Clarity:Clean · Finish:Short` | fastest → lightest / clearest / shortest ✓ |
| HALO-FAST | 108s RP4 | **2:40** | `Body:Light · Clarity:Clean · Finish:Short` | = CONE-FAST (matched flow → matched texture) ✓ |
| HALO-B3 | 134s P3 / 91s RP4 | **3:10** | `Body:Round · Clarity:Clean · Finish:Clean` | = CONE-B3 (matched flow → matched texture) ✓ |
| VCF-01 | 65s P1 / 95s RP4 | **3:12** | `Body:Round`(light edge)`· Clarity:Clean · Finish:Clean` | near-base flow but LIGHTER/brighter → **BYPASS residual** ⚠ |
| CONE-B3 (baseline) | 60s P1 / 92s RP4 | **3:14 / 3:15** | `Body:Round · Clarity:Clean · Finish:Clean` | mid anchor |
| MC4 | 60s P1 / 98s RP4 | **3:20** | `Body:Round · Clarity:Clean · Finish:Clean` | = baseline (matched flow → matched; cross-family) ✓ |
| METEOR-02 | 65s P1 / 93s RP4 | **3:20** | `Body:Round · Clarity:Clean · Finish:Clean` (+fibrous) | = baseline; **tactile-grain residual** ⚠ |
| DC4 | 68s P1 / 110s RP4 | **3:39** | `Body:Round · Clarity:Clean · Finish:Clean` | intermediate; tracks contact time ✓ |
| APC4 | 72s P1 / 108s RP4 | **3:50** | `Body:Round · Finish:Lingering` (Clarity untagged) | slow → full/integrated/lingering ✓; **possible Abaca fiber residual** ⚠ |
| LC4 | 80s P1 / 107s RP4 | **4:09** | `Body:Round · Finish:Lingering` (Clarity untagged) | slowest → fullest / most-integrated / longest ✓ |

**BS pulls (off-cohort, not cross-compared):** HALO-B3-in-BS (3:28) and CONE-B3-in-BS (3:22) both `Body:Round · Clarity:Clean · Finish:Clean` ("round light", even/blended, zero bypass) — indistinguishable in cup.

**Read of the table:** body/clarity/finish track realistic end-time **monotonically** across the cohort — Light/clear/short at the fast end (2:38) → round-light/clean/clean in the middle (3:10–3:20) → full/integrated/lingering at the slow end (3:39–4:09). The three matched-flow controls (HALO-B3, MC4, METEOR-02 — all ≈ baseline flow) all read ≈ baseline texture. **Flow predicts the bulk of texture.** The two ⚠ off-trend papers (VCF lighter-than-its-time via bypass; METEOR fibrous-feel; APC4 body-selective) are the residuals end-time can't capture (mechanisms 2 + 3).

---

## Analysis

1. **Textural delta vs baseline.** For each paper, summarize how its `structure_tags` differ from the baseline cell (which axes shifted, direction). Classify: *distinguishable* / *indistinguishable* from baseline. (HT1)
2. **Flow × texture cross-layer.** Join each paper's textural cell to its `measuredDrawdownSec`. Does slow flow co-vary with heavier body / more coating / lower clarity, or are the layers independent? Note family-conditional patterns (HT2; watch the CAFEC family per RP4-N4).
3. **HALO vs CONE.** Direct compare HALO-B3↔CONE-B3 (and HALO-FAST↔CONE-FAST) textural cells at matched flow. (HT3)
4. **Fidelity / leakage assessment.** Tally how many prose observations had no clean canonical tag. Characterize the leakage (which axis, what kind of nuance). (HT4) — **report it; do not resolve generalization.**

---

### ▶ HT RESOLUTIONS (2026-06-20 — V60 cohort + BS pulls; single coffee = Pink Bourbon Washed, clarity-weighted)

**HT1 — Do papers differentiate texture at all? → YES, DISTINGUISHABLE, but FLOW-DRIVEN (not universal).** Papers span a real range: Light/clear/short (CONE-FAST) → round-light/clean (middle cluster) → full/integrated/lingering (LC4). BUT differentiation is driven by the paper's **flow**, not an independent fiber property: the 3 matched-flow papers (HALO-B3, MC4, METEOR ≈ baseline flow) read ≈ baseline; only differently-flowing papers differentiate. Paper IS a real textural lever — and a **multi-dimensional** one (evenness ↔ complexity ↔ sharpness ↔ body) — but on this coffee it operates largely *through flow.* Not a null; a real but flow-mediated lever.

**HT2 — Does flow predict texture? → YES, STRONGLY (dominant), via THREE mechanisms.** Texture tracks realistic end-time monotonically (cross-layer table). Core link = **contact-time mediation** (slow → long contact → more extraction → fuller/integrated/lingering; fast → light/clear/short), confirmed both ends + 3 matched-flow controls. **Refinement:** end-time is the dominant predictor but not the whole story — two more flow mechanisms it can't see: **(2) bypass/seating** (VCF: near-baseline time but lighter/brighter from channeling; eliminated in the BS) and **(3) flow-consistency over time** (steady vs fast-then-choke → even/clean vs blended/complex; Chris's theory). **Field implication:** the textural layer is *largely* predictable from flow — a flat `texturalTags` field may add limited info beyond `measuredDrawdownSec` + a realistic-drawdown number; its unique value is the residual mechanisms (bypass, consistency, tactile) flow misses. (Mediation vs pure-fiber not fully separable on one coffee.)

**HT3 — HALO-B3 vs CONE-B3 (paper fiber) → IDENTICAL ON THE CUP, in BOTH brewers. Definitive AI-4 answer.** V60: HALO-B3 ≡ CONE-B3 and HALO-FAST ≡ CONE-FAST (matched flow, same fiber/cone; seam neutralized when wet). BS: HALO-B3 ≡ CONE-B3 on the cup (Chris "can't taste any difference"); HALO better ONLY structurally (seam → cleaner seat). → **The HALO/CONE distinction is a fit / handling / repeatability story, NEVER a cup story.** RP4 AI-4 resolved: identical flow → identical cup; HALO's design earns its keep in seating, not taste.

**HT4 — Does `structure_tags` have enough resolution? → NO; 5 leakage classes + a "same-tags-different-cup" collapse. (Report only — generalization deferred to retro; single-coffee-conditioned.)** Leakage tally (every leak Pink-Bourbon-Washed-only):
  1. **Body "neutral/unremarkable"** — no descriptor for an unremarkable middle body (calibration).
  2. **Body Round↔Light intermediate** — 4 papers (CONE-B3, HALO-B3, MC4, METEOR) live in a no-word zone; Chris coined **"round light."**
  3. **Temporal / phase dimension MISSING (strongest)** — ≥5 distinct temporal shapes (front-loaded FAST / even LC4 / declining DC4 / middle-heavy APC4 / mild-front VCF); `structure_tags` is a static snapshot with no temporal axis. Likely the richest differentiation, entirely un-taggable.
  4. **Clarity one-directional** — only high-clarity descriptors; no LOW-clarity / "integrated / less-separated" word (LC4, APC4 untaggable on clarity).
  5. **Tactile-grain MISSING** — METEOR's "fibrous/grainy feel" has no Body descriptor (Body = smooth-family + weight words only).
  **Collapse illustration:** DC4 and MC4 both get the baseline cell, but MC4 truly ≈ baseline while DC4 is observably different — the vocabulary can't distinguish "true same" from "different-but-untaggable." Most differentiation lived in the **vs-baseline direction + leakage**, not the absolute tags.
  **Verdict:** on this coffee, the 3-axis `structure_tags` under-resolves paper-texture work — captures gross body/clarity/finish but misses the intermediate Body zone, the temporal dimension, low-clarity, and tactile grain. Whether to add descriptors/axes is a **retro** question (needs a 2nd coffee; clarity-weighting compresses Body, so gaps may differ on a heavier coffee).

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
6. **✅ RESOLVED (2026-06-19, at Assistant spawn) — BS texture test FOLDED IN as flagged exploratory pulls.** The Sibarist BS now fits the xBloom (big slot, claw holder removed, 2026-06-19). **Chris's call: add 1–2 *flagged* exploratory BS pulls to this session for earlier AI-4 closure** (the alternative path, NOT the Track-3 default). **Execution:** run the full clean V60 cohort first; THEN — at end of session, palate permitting — run `HALO-B3` and `CONE-B3` **both in the Sibarist BS** (brewer held constant at BS, same coffee + xBloom program), mirroring RP4's both-in-BS flow comparison for the texture axis (HT3's fuller AI-4 form). These are **off-cohort exploratory reads, explicitly flagged** — NOT part of the clean V60 geometry set and NOT cross-compared against the V60 cells (brewer geometry differs). A full BS-native **Track 3** may still follow; this is an early 2-pull probe, not its replacement. The palate-fatigue watch (sub-step 6) governs whether both BS pulls happen — if the palate is gone after the V60 cohort, defer them to a second sitting and log it (don't force fatigued reads on the AI-4 set).

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
- **CONSUMPTION CONSTRAINT (taste study ≠ flow study) — Chris-raised, Pull 4.** Unlike the filter-drawdown study (measure flow, discard), this study is **"to the cup" — Chris drinks every cup.** So recups are **physiologically expensive** (caffeine + volume + palate), not just palate-fatigue expensive. Reinforces why the 1× paired-A/B design is load-bearing here and why recups are operator-discretion-only. Candidate primitive: *a taste study's cohort + replication budget is bounded by cup-consumption (caffeine/volume) — a harder ceiling than palate fatigue alone.*
- **DAILY CONSUMPTION CEILING (record for future experiments) — Chris-stated, Pull 4.** Chris's ceiling ≈ **10 cups/day total.** Today he pre-spent **+4** (≈3 on the AM xBloom baseline dial-in + 1 normal coffee), leaving **≈6 experiment cups today.** → **SESSION SPLITS HERE:** sitting 1 today = CONE-B3, HALO-B3, CONE-FAST, HALO-FAST, LC4, DC4 (6 cups, through Pull 5); **defer to sitting 2** = MC4, APC4, METEOR-02, VCF-01 (+ the flagged BS pulls HALO-B3 / CONE-B3-in-BS). This is sub-step 6's split-the-tail mechanism firing as designed (must-finish-fresh set completed today; defer-if-tired tail + BS pulls carried). **Deferred papers logged, not dropped.** Future-experiment planning rule: starting experiments first thing (no pre-spend) → upper bound ≈10 experiment cups/day.
- **EMERGENT FINDING (Step 0, 2026-06-19) — xBloom end-time = a free realistic-condition drawdown layer.** Chris realized the xBloom marks an exact brew END TIME for each structured-pour recipe (the point where the bed has drained to a drip). Recording it per paper yields a **realistic-condition drawdown comparison** across the cohort — on the same platform/recipe, under *realistic* brewing (vs the filter arc's deliberately non-realistic 250g-at-once dumps that craterized the bed). **Decision: capture xBloom end-time for every pull** (new recording-sheet column added; baseline CONE-B3 = **3:15**). **Value:** (1) enriches HT2 — pair texture against a *realistic* flow number, not only the prior non-realistic drawdown; (2) lets us cross-check whether realistic-condition ranking matches the filter-arc drawdown ranking (bonus comparison); (3) **fallback payload** — if the textural layer reads indistinguishable (HT1 null), this realistic-drawdown layer is the salvage value of the session (Chris's framing: "maybe what this turns into if the texture fields don't work out"). Zero added cost (read off the machine). **Scope discipline:** captured as a byproduct data column + retro candidate; the session's primary DV stays *texture*. Whether realistic-condition xBloom drawdown should become its own `FilterEntry` field (parallel to `measuredDrawdownSec`) is a HANDOFF/retro question — flag, don't decide here. Candidate primitive: *a controlled-pour platform yields a realistic-condition flow metric as a byproduct of any taste study run on it.*

---

---

## HANDOFF BRIEF FOR COMPILE SESSION (Filter Textural-Quality Layer — V60 Cone, Track 1 Close-Out)

**Date:** 2026-06-20
**Session role:** execution + handoff brief production (no substrate edits)
**Methodology verdict:** **MIXED — the textural FIELD is partly redundant with flow, but the METHOD test (HT4) and the cross-layer finding are the real payload.** HT1 distinguishable-but-flow-driven · HT2 strong (texture ≈ flow, 3 mechanisms) · HT3 definitive (HALO≡CONE on cup, fit-story only) · HT4 vocabulary under-resolves (5 leakage classes). Single coffee — all findings clarity-weighted/coffee-conditioned.

This brief closes the V60 cone track (12 pulls: 10-paper cohort + 2 flagged BS pulls). The compile session should integrate the § Substrate edit specifications (registry correction is the only high-confidence code edit; the `FilterEntry` field is a *recommended shape*, not a locked spec); the Coordinator should carry the § New lessons + § Methodology findings to the project retro's cross-project ratification gate. Raw per-pull data + full reasoning live in the doc body above (§ Per-paper cupping sheet, § HT Resolutions, § Cross-layer table, § Notes).

### TL;DR

- **Texture tracks realistic flow (xBloom end-time) monotonically** — Light/clear/short at the fast end (CONE-FAST 2:38) → round-light/clean in the middle (3:10–3:20) → full/integrated/lingering at the slow end (LC4 4:09). The textural layer is **largely predictable from the flow layer** (contact-time mediation).
- **"Texture" decomposes into THREE flow mechanisms:** (1) contact-time (end-time → body; dominant), (2) bypass/seating (VCF lighter-than-its-time; eliminated by the BS), (3) flow-consistency over time (steady vs choke-blend → even/clean vs complex — Chris-originated). End-time captures only #1.
- **HALO-B3 ≡ CONE-B3 on the cup in BOTH brewers** (V60 + BS). HALO's only edge is structural seating (the seam). **RP4 AI-4 resolved: HALO/CONE is a fit/repeatability story, never a cup story.**
- **`structure_tags` under-resolves paper-texture** (HT4): 5 leakage classes — Body "unremarkable", Body Round↔Light intermediate ("round light"), **missing temporal/phase axis (strongest)**, Clarity has no low-clarity word, missing tactile-grain. DC4 got the baseline cell despite an obviously different cup.
- **Registry correction confirmed:** `HALO-B3` + `HALO-FAST` fit a V60 (currently `fitsBrewers` = BS-only).
- **Free byproduct layer:** xBloom realistic end-time is reproducible cross-day (CONE-B3 3:15→3:14) and is the session's *salvage value* if the textural field proves too redundant — a realistic-condition drawdown the filter arc's non-realistic dumps couldn't give.
- **Single-coffee caveat governs everything:** Pink Bourbon Washed is clarity-weighted (compresses Body). A heavier coffee could shift the Body findings + leakage. No generalization until a 2nd coffee/track.

### Execution summary

12 cupping pulls across 2 sittings (6 + 6, split at Chris's daily consumption ceiling). Step 0 ran clean (V60×xBloom fit re-confirmed; photo inventory waived as carried-forward from RP4; baseline reproduced + re-anchored cross-day to 1s). One-pull-per-tool-call held throughout (Lesson #7). Paired-A/B-vs-baseline design held; 0 recups needed (no read was unreliable enough to warrant one; consumption cost made recups expensive). Protocol divergences: (a) photo inventory waived (logged); (b) BS pulls folded in per open-scope-item-6 (Chris chose fold-in over Track-3-defer); (c) session split into 2 sittings (palate/consumption ceiling — the sub-step-6 mechanism firing as designed). No substrate edits, commits, or PRs (Lesson #40).

### Equipment / conditions

| Item | Value |
|---|---|
| Platform | xBloom (programmatic), V60 chamber ("Other"/freesolo); BS pulls = Sibarist Brewing System in xBloom big slot (claw holder removed) |
| Brewer | Hario V60 (10-paper cohort) · Sibarist BS (2 flagged pulls) |
| Grinder | EG-1, ULTRA SSP, **6.4** |
| Coffee | Hydrangea Pink Bourbon Washed (Finca Inmaculada, Holguín family, Valle del Cauca) — single bag, held constant |
| Recipe | 15 g / 247 g (1:16.5) · 94/94/93 °C · spiral · 3.5 ml/s · Bloom 45 g (45 s) → P2→150 g (30 s pause) → P3→247 g · target ~3:00–3:15 |
| Water | Home remineralized (⅓ Third Wave Water + ⅔ distilled), held constant every pull |
| Replication | 1× per paper (paired A/B vs baseline); CONE-B3 brewed 3× (sitting-1 baseline, sitting-2 re-anchor, BS) |

### Per-pull / per-measurement raw data

Complete recording sheet is in the doc body above (§ Per-pular cupping sheet — Pulls 0–12, each with verbatim prose, assigned tags, vs-baseline deltas, leakage, xBloom end-time, prior drawdown). Compact index:

| # | Paper | End-time | Cell | vs baseline |
|---|---|---|---|---|
| 0 | CONE-B3 (baseline) | 3:15 | Round / Clean / Clean | — |
| 1 | HALO-B3 | 3:10 | Round / Clean / Clean | same (HT3 ✓) |
| 2 | CONE-FAST | 2:38 | Light / Clean / Short | lighter/clearer/shorter |
| 3 | HALO-FAST | 2:40 | Light / Clean / Short | = CONE-FAST (HT3 ✓) |
| 4 | LC4 | 4:09 | Round / [Clarity untagged] / Lingering | fuller/less-clear/longer |
| 5 | DC4 | 3:39 | Round / Clean / Clean | mild fuller/less-clear/linger |
| 6 | CONE-B3 re-anchor | 3:14 | Round / Clean / Clean | = baseline (cross-day ✓) |
| 7 | MC4 | 3:20 | Round / Clean / Clean | same (matched-flow ✓) |
| 8 | APC4 | 3:50 | Round / [untagged] / Lingering | fuller/integrated/linger (+fiber? ⚠) |
| 9 | METEOR-02 | 3:20 | Round / Clean / Clean | same (+fibrous feel ⚠) |
| 10 | VCF-01 | 3:12 | Round(light) / Clean / Clean | lighter/brighter (bypass ⚠) |
| 11 | HALO-B3 in BS | 3:28 | Round / Clean / Clean | (off-cohort) |
| 12 | CONE-B3 in BS | 3:22 | Round / Clean / Clean | = HALO-B3-in-BS (HT3-BS ✓) |

### Analysis

Full HT1–HT4 resolutions + the cross-layer table are in the doc body (§ HT Resolutions, § Cross-layer table). Headline: texture co-varies monotonically with realistic end-time; the 3 matched-flow controls (HALO-B3, MC4, METEOR ≈ baseline flow) all read ≈ baseline → flow predicts the bulk of texture (contact-time mediation). Off-trend residuals (VCF bypass, METEOR tactile grain, APC4 body-selectivity) are the parts end-time can't see and live in the dimensions the vocabulary lacks.

### Final output — per-paper textural cells (V60, this coffee/recipe/platform, 2026-06-20)

| Paper | `texturalTags` | Note (leakage / residual) |
|---|---|---|
| CONE-B3 | `Body:Round · Clarity:Clean · Finish:Clean` | "round light" (between Light/Round) |
| HALO-B3 | `Body:Round · Clarity:Clean · Finish:Clean` | ≡ CONE-B3 |
| CONE-FAST | `Body:Light · Clarity:Clean · Finish:Short` | front-loaded; "almost too watery" late |
| HALO-FAST | `Body:Light · Clarity:Clean · Finish:Short` | ≡ CONE-FAST |
| LC4 | `Body:Round · Finish:Lingering` | clarity LOW (no descriptor); even/one-mass |
| DC4 | `Body:Round · Clarity:Clean · Finish:Clean` | intermediate; "clean lingering"; same tags, different cup |
| MC4 | `Body:Round · Clarity:Clean · Finish:Clean` | true baseline match |
| APC4 | `Body:Round · Finish:Lingering` | body-forward, acidity-suppressed, middle-heavy; clarity LOW |
| METEOR-02 | `Body:Round · Clarity:Clean · Finish:Clean` | **fibrous tactile feel (no descriptor)** |
| VCF-01 | `Body:Round · Clarity:Clean · Finish:Clean` | lighter/brighter (bypass); flimsy shape-retention |

### Key findings

1. **Texture ≈ flow (contact-time mediation), dominant.** Body/clarity/finish track realistic end-time monotonically; 3 matched-flow controls confirm. *Implication:* a flat textural field is partly redundant with `measuredDrawdownSec`.
2. **Two flow mechanisms end-time misses: bypass (VCF) + flow-consistency (Chris's theory).** *Implication:* the textural field's unique value (if any) is capturing these, not gross flow.
3. **HALO ≡ CONE on the cup, both brewers; HALO's edge is structural seating only.** *Implication:* resolves RP4 AI-4; registry should not imply a cup difference.
4. **`structure_tags` under-resolves paper texture (5 leakage classes); strongest gap = no temporal/phase axis.** *Implication:* carry prose in a `texturalNote`; defer vocabulary expansion to a 2nd-coffee retro.
5. **xBloom realistic end-time is a reproducible, valuable flow layer** (cross-day 1s). *Implication:* candidate `FilterEntry` field paralleling `measuredDrawdownSec`; the session's salvage value.
6. **Registry `fitsBrewers` wrong for HALO papers** (fit a V60). *Implication:* code correction.

### Substrate edit specifications for compile session

**DO NOT execute these edits in this session — the compile session integrates substrate.**

**Registry edits ([lib/filter-registry.ts](lib/filter-registry.ts)):**
1. `HALO-B3` entry: add `"V60"` to `fitsBrewers` (currently `["Sibarist Brewing System (cone module)"]`). Source: Finding 6 + § Step 0 geometry cross-check (HALO is V60-cone-shaped; ran in a V60 for all of this track). Rationale: empirically fits + brews in a V60.
2. `HALO-FAST` entry: add `"V60"` to `fitsBrewers` (same as above). Source: Finding 6; carried by family (HALO-FAST ran in the V60, Pull 3).
3. *(Optional, retro-gated)* per-paper `texturalTags` + a realistic-drawdown field — see field proposal below; do NOT populate until the field shape is locked.

**`FilterEntry` field proposal (RECOMMENDED SHAPE — needs Coordinator/operator sign-off, not locked):**
- `texturalTags?: string[]` — canonical `"Axis:Descriptor"` keys (the closest-canonical cell). **Keep flat/minimal** — Finding 1 shows it's partly flow-redundant; Finding 4 shows it under-resolves, so don't over-invest.
- `texturalNote?: string` — **load-bearing given heavy HT4 leakage**; carries the prose the tags can't (temporal shape, tactile grain, "round light", bypass).
- `texturalCoffee? / texturalRecipe? / texturalPlatform? / texturalDate? / texturalProject?` — condition metadata (the cell is valid only for this coffee/recipe/platform).
- **Strong recommendation — add a realistic-drawdown field** (e.g. `realisticDrawdownSec?` / `xbloomEndTimeSec?`) paralleling `measuredDrawdownSec`. Finding 5: it's reproducible, realistic-condition, and predicts texture better than the non-realistic dump number. This may be the more durable output of the track than `texturalTags`.
- **Defer:** any temporal-axis / tactile-grain / low-clarity vocabulary extension → retro (single coffee).

**Cluster doc edits ([docs/skills/brewing-equipment-expert/cluster/filters.md](docs/skills/brewing-equipment-expert/cluster/filters.md)):**
4. Surface the textural layer parallel to the flow layer: the 3-flow-mechanism model (contact-time / bypass / flow-consistency), the per-paper cells, the "Sibarist = steady-flow/even vs choking papers = blended/complex" selection guidance, and the "HALO≡CONE in cup, structural-fit-only" note. Source: Findings 1–4.

**ADR work:**
5. *Candidate ADR (Coordinator judgment):* "Paper texture is largely flow-mediated (3 mechanisms); the textural layer is a refinement of the flow layer, not independent." Worth an ADR or a finding-doc if the FilterEntry field ships. Source: Findings 1–2.

**Audit item resolutions:**
6. **RP4 AI-4 → RESOLVED.** "What differentiates HALO-B3 if flow is identical?" → nothing in the cup; fit/repeatability/seating story (HT3, both brewers). 
7. **RP4-N1 `paperShapeRetention` candidate → REINFORCED.** VCF flimsy/won't-hold-shape → bypass; APC4/CAFEC buckle/choke. Strong case for a shape-retention sub-attribute. 
8. **RP4 AI-6 (Sibarist FAST size variants) → TOUCHED.** CONE-FAST (small) vs HALO-FAST (cone-02) size noted; Chris says size functionally irrelevant to cup. Can likely close as "size = handling, not cup."

### New lessons captured (Project #5; continue RP5-N# numbering)

| # | Lesson | Substrate implication |
|---|---|---|
| RP5-N1 | **A controlled-pour platform yields a free realistic-condition flow metric** (xBloom end-time) as a byproduct of any taste study. Reproducible cross-day (1s). | Candidate standing `FilterEntry` field; capture end-time in all future xBloom studies. |
| RP5-N2 | **Texture is largely flow-mediated, via ≥3 mechanisms** (contact-time / bypass / flow-consistency). A single drawdown number captures only contact-time. | The textural layer refines, not replaces, the flow layer. |
| RP5-N3 | **Subjective→taxonomy fidelity leaks in 5 ways here** (Body unremarkable, Body Round↔Light, temporal axis missing, Clarity one-directional, tactile-grain missing). | Carry prose in `texturalNote`; vocabulary expansion is a multi-coffee retro question. |
| RP5-N4 | **Structured per-axis tasting prompts** (operator asked for them) sharpen prose → cleaner tag mapping. | Execution primitive for taste studies. |
| RP5-N5 | **A taste study's budget is bounded by cup CONSUMPTION** (caffeine/volume), a harder ceiling than palate fatigue. Chris ≈ 10 cups/day total, ~6 if pre-spent. | Cohort/replication sizing + session-split planning input. |
| RP5-N6 | **"Better paper tech ≠ better cup"** — steady flow (Sibarist) = even/clean; choke-blend = complex. Paper is a multi-dimensional lever (evenness/complexity/sharpness/body). | Paper-selection guidance in filters.md. |

*(All single-track until the cross-project ratification gate fires at the retro; RP5-N1/N4/N5 are the strongest cluster-primitive candidates if a 2nd taste track repeats them.)*

### Audit items queued

| # | Item | Status | Implication |
|---|---|---|---|
| RP5-AI-1 | Mediation vs pure-fiber not separable on one coffee — APC4 body-selectivity + METEOR tactile feel are candidate fiber residuals. | OPEN | Matched-flow Abaca-vs-non-Abaca test (future track). |
| RP5-AI-2 | Does the textural field add enough beyond `measuredDrawdownSec` + realistic-drawdown to justify shipping `texturalTags`? | OPEN — operator/Coordinator call | Field-scope decision. |
| RP5-AI-3 | Temporal/phase axis + tactile-grain + low-clarity descriptor gaps — expand vocabulary? | DEFERRED to retro | Needs 2nd coffee. |
| RP5-AI-4 | `paperShapeRetention` sub-attribute (RP4-N1 carry) — formalize? | OPEN | Registry shape. |

### Open data items

- **Single coffee only.** Body axis compressed by the clarity-weighted Pink Bourbon Washed; a heavier/natural coffee could re-open the Body findings + change the leakage profile. The whole HT4 result is provisional.
- **No noise floor (1× design).** Sub-threshold reads (HALO-FAST phase-2→3 taper) logged as within-noise, not resolved.
- **APC4 fiber-vs-extraction confound** unresolved (1 cup).
- **Track 2 (Kalita flat) + Track 3 (BS-native full cohort)** still queued — scope at this track's retro.

### Recap map for compile session

**Integrate first:** the registry `fitsBrewers` correction (specs 1–2) — only high-confidence code edit, standalone. **Then:** decide the `FilterEntry` field shape (specs 3 + field proposal) WITH the operator — this is a judgment call (the textural field is partly flow-redundant; the realistic-drawdown field may be the better investment). **Defer:** vocabulary expansion (RP5-AI-3) to the retro. **Escalate to operator:** RP5-AI-2 (ship `texturalTags` at all?) and the realistic-drawdown-field decision — these are scope calls, not derivable from the data alone. **Carry to retro (Coordinator):** § New lessons + § Methodology findings (§ Notes) for the cross-project ratification gate.

### Protocol-execution friction captured

1. **Roadmap seed vocabulary ("thin/syrupy/heavy") collided with canon** — caught at scope time (§ Notes). Candidate: verify seed vocabulary vs registries at scope time.
2. **Photo inventory carried forward from RP4** (waived) — candidate primitive: prior-project photo inventory carries forward when the cohort is unchanged.
3. **Consumption ceiling forced a 2-sitting split** — the sub-step-6 mechanism worked, but the ceiling wasn't pre-budgeted at scope time. Candidate: budget cups-to-be-consumed at scope time for taste studies.
4. **Recipe-lock surfaced unverbalized substrate** (Chris's xBloom-vs-own-pourover water habit) — capture "Chris's per-context water" in brewing/water substrate (execution session / future water project).
5. **The richest findings (flow-consistency, 3 mechanisms) emerged mid-execution, operator-originated** — the protocol's pre-stated HTs didn't anticipate them. Candidate: taste-study protocols should leave explicit room for operator-originated mechanism hypotheses (active-mode HT logging caught them).

---

### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO registry edits made
- ❌ NO commits, no pushes, no PRs opened
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Handoff brief produced above for compile session consumption
- 🛑 Session terminating after this brief lands. The compile session integrates substrate per the design pattern.

End of Filter Textural-Quality Layer — V60 Cone (Track 1) close-out.

---

## PROJECT CLOSE + RETRO (Coordinator, 2026-06-20)

This is now the project's **end-document** — RP5 closed after Track 1, so the protocol doc IS the end-document (per the single-track convention). Substrate fold merged: [PR #494](https://github.com/chrismccann-dev/latent-coffee/pull/494) / main `6b73d22`.

### Project-close decision — Tracks 2/3 dropped as moot

The project was scoped as 3 geometry-split tracks (V60 cone / Kalita flat / Sibarist BS native). **Tracks 2 + 3 are dropped at close.** Operator's call + Coordinator-concurred: Track 1 already answered the project's question. Track 2 (flat-bottom + flat papers) and Track 3 (BS, FAST vs B3) would re-run the same experiment on different geometries and find the same thing, because **the finding is that paper texture is largely flow / contact-time-mediated, not paper-construction-direct.** Re-confirming that across geometries teaches little worth applying. (And the single clarity-weighted coffee compressed the Body axis — a heavier coffee would do more to re-open the question than a different brewer geometry would.) A project closing after one of its planned tracks is legitimate — research scope is fluid (cf. the filter arc, where RP4 was *added* mid-project; here 2/3 were *removed*).

### Retro — methodology (the accumulation payload)

- **Graduated this project:** the **archive-persist commit convention** ([role-discipline.md § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md), [PR #491](https://github.com/chrismccann-dev/latent-coffee/pull/491)). 2nd commit-boundary incident after Lesson #40 (the inverse failure) → cross-project ratification gate met → folded into all 4 pre-bake locations now, not parked.
- **Seeded as candidates (graduate at the water project — the 2nd taste-shaped project):**
  - **xBloom as a single-variable experiment platform** (RP5-N1 + operator's strongest close-out framing): lock the recipe once, change only the target variable, everything else constant, same cup each time. Near-certain to graduate — the water project IS this pattern (change only the water in the back). Works across V60 / flat / Sibarist BS; Chemex/Funnex fit untested (claw-off, likely).
  - **Consumption-ceiling budgeting** (RP5-N5): a taste study's hard cap is cups *consumed* (caffeine/volume ≈ 10/day, ~6 if pre-spent), not palate fatigue. Budget it at scope time; it forced the 2-sitting split here.
  - **Per-axis tasting prompts** (RP5-N4), **paired-A/B-vs-baseline reading**, **dial-in-from-`/brew`** (recipe sourced from the brewing flow, verified-not-derived in-session), **seed-vocab-vs-canon check at scope time** (the "thin/syrupy/heavy" collision), **prior-project photo-inventory carry-forward** (waived when the cohort is unchanged).
- **Friction that held / didn't recur:** role discipline held; the active-mode HT logging (Lesson #16) caught the richest findings (flow-consistency, 3 mechanisms) which were operator-originated mid-run — candidate: taste-study protocols should leave explicit room for operator-originated mechanism hypotheses.

### Retro — the broader insights (operator-originated; captured as research direction, NOT yet folded)

These emerged at close and are **hypotheses, not ratified substrate** — they inform the next projects, they don't fold into operational substrate until tested (sharp-substrate-fold false-precision gate).

1. **Phase modulation is the brewing-side "layered-evolving" lever.** Operator's best brews (layered, evolving complexity over time — the [`CONTEXT-taste.md`](CONTEXT-taste.md) apex) trace to phase-by-phase *flow modulation*: holding the bloom long, restricting then opening pours, holding/releasing phases (not just on/off). The instrument is the **Sworks Bottomless Brewer** ([link](https://sworksdesign.com/Bottomless-Dripper-p605203046)) — a continuous valve that does, more elegantly, what the V60/April Switch do with on/off. This *negates the paper variable* (the operator controls each phase's flow directly), which dovetails with Track 1's "paper modulates flow, flow modulates texture" finding: control flow directly and the paper matters less. **Fold candidate (when tested):** Sworks brewer + phase-modulation framework → brewing-equipment-expert cluster; phase-modulation-as-layered-evolving-lever → CONTEXT-taste.md.
2. **The full-stack apex hypothesis.** The end cup operator is chasing may be the *combination*: engineered/processed high-quality (sometimes exotic) green → roasted at the **high end of light** (light-to-medium-light, for full expressiveness) → **phase-modulating brewer** (Sworks / switch) to push-pull each phase → **optimized water chemistry**. Confound flagged: nearly all his best brews came from the *office* (Sworks brewer + Piccolot beans + **plain Palo Alto tap water, not even remineralized**) — so the water axis is currently *un*-optimized in his best results, implying large remaining upside. **North-Star-level** (ties sourcing→roasting→brewing→water to the layered-evolving apex). Fold candidate (when substantiated): PRODUCT.md meta-thesis / CONTEXT-taste.md.

### Next project — Water chemistry (operator-selected, gate satisfied)

Operator pulled **Water chemistry** (§ Next #5) forward ahead of the queue, over Bloom science and the dropped textural tracks — the highest-order next variable, and the one currently un-optimized in his best (office) brews. The Coordinator gate (no new project until the retro runs) is now satisfied by this retro. Next step: a **water-chemistry intake/scoping session** (operator has implementation thoughts ready; the shared Pink Bourbon Washed coffee + the validated xBloom-as-platform method carry straight over).

End of Research Project #5.
