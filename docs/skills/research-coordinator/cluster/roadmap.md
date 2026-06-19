# Research roadmap

**Owner:** Research Coordinator
**Cadence:** Updated at every project close + during process retro + ad-hoc when operator surfaces a new idea
**Locked in:** Research Assistant Step 2 scaffolding (Step 1 grilling, 2026-05-26); populated via roadmap talk-through (2026-05-27)

---

## Why these research projects exist

Latent's research arc is in service of one specific goal: **participating in and winning the World Brewers Cup championship.** Without that frame, the depth + cadence of these projects would be wildly over-scoped for a personal brewing journal. With it, each project is a deliberate investment in a capability the operator currently lacks (water chemistry, blending taxonomy, pour kinematics intuition, routine construction) or in deepening an existing substrate (WBC corpus, sourcing strategy) toward competition-grade fluency.

Sequencing reflects this: projects that close known champion-routine blind spots (water chem, blending, roast blending) precede projects that refine variables already in the toolkit (bloom science, temp profiling).

---

## Roadmap structure

Five sections, in priority order. Each entry is a one-or-two-line pointer with optional one-paragraph context.

| Section | Meaning |
|---|---|
| **Now** | Single-slot. The research project the Coordinator is actively running. Empty when between projects (between retro completion + next-project scoping). Per [`process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md), the Coordinator does not scope a new project until the prior project's retro has completed. |
| **Next** | Queued, ordered. The next research project to start after the current one closes. Order reflects priority + sequencing constraints. May be empty when nothing is queued. Entries marked **Trigger:** are conditionally gated — they pull into § Now when triggers fire, regardless of queue position. |
| **Extensions of completed** | Things flagged during a closed project's retro that are worth a follow-up project but aren't on the critical path. |
| **Side quests** | Smaller research ideas that aren't full projects — measurement campaigns, registry sanity checks, single-day investigations, ongoing substrate deepening. May graduate to § Next if they grow scope. |
| **Closed** | Closed projects with pointers to their end-documents (or to the canonical archive at `docs/research-projects/<track-slug>.md` when the project was single-track and the protocol doc IS the end-document). Reverse-chronological. |

Each candidate carries three implicit axes used for sequencing:

- **Effort** — small / medium / large scope (time + energy required)
- **Fold-in** — extends existing corpus ↔ builds whole new corpus from scratch
- **WBC payoff** — how close to a known champion-routine blind spot

§ Now selection at project close balances these axes per the two-option framing in § Roadmap update discipline.

---

## Now

### Filter textural-quality layer (Research Project #5)

*Roadmap slot formerly "Track 5"; renamed at scoping — "track" is a Coordinator/Assistant sub-unit, not a project. This project is geometry-split into multiple tracks (below).*

**Effort:** small. **Fold-in:** high (extends filter-arc substrate). **WBC payoff:** medium.

**Status (2026-06-19):** Track 1 (V60 cone) scoped, protocol drafted, dial-in recipe locked — READY to spawn (pending one scope confirm: BS→Track 3). Protocol: [filter-textural-quality-v60-cone.md](docs/research-projects/filter-textural-quality-v60-cone.md). **Three-track geometry split:** Track 1 V60 cone (now) · Track 2 Kalita flat (queued) · Track 3 Sibarist BS native (candidate — the BS fits the xBloom big slot with the claw holder removed).

**Scope:** Adds a textural-quality field to `FilterEntry` (drawn from the canonical `structure_tags` Body/Clarity/Finish vocabulary), extending the filter arc's `measured` substrate. *(The earlier "thin/syrupy/heavy" seed is NOT canonical — "thin"=`Body:Light`, "heavy"=`Body:Syrupy`; the field reuses the brew vocabulary rather than inventing one.)* Uses xBloom as controlled-pour platform to isolate paper-as-variable under realistic brewing conditions (center / spiral / circular pour patterns; pre/post agitation; programmatic temp + flow), unlike the filter arc which deliberately measured paper-only flow under non-realistic 250g-at-once dumps that produced craters and bypassed bed-uniformity considerations.

**Brewer compatibility (forcing function):** xBloom drives a **Kalita** flat (confirmed; Chris's cupping brewer) and a **V60** (confirmed 2026-06-18) via its dripper-holder ("claw"). Funnex / Cypress don't fit the claw. The **Sibarist Brewing System** doesn't fit the claw either, BUT it fits the xBloom **big slot directly with the claw removed** (confirmed 2026-06-19, at ~V60 height) — so it's a usable platform after all. HALO papers are also V60-shaped (fit a V60). This validates which brewers xBloom can drive — downstream signal for § Next #1 (Bloom science) — and yields the three-track geometry split above.

**Why this slot:** Smallest effort × highest fold-in × short effort-to-result loop. Extends existing filter substrate (one new track + one new column), not a new corpus. **Prototypes the subjective-into-taxonomy mechanism that every future project will need** (bloom feel, routine evaluation, blending sensory output, sourcing cup signals all involve subjective data getting compressed into sharp substrate). Second project for the new Coordinator + Assistant architecture — battle-tests the methodology primitives forged in the filter arc.

**Methodology refinement focus:** how to convert subjective cupping prose into structured taxonomy fields without losing fidelity. **Method locked at scoping: reuse the existing canonical `structure_tags` enum** (Body/Clarity/Finish) — a borrow, not a build, so the paper's textural reading speaks the same language as every brew. The prototype question (HT4) is whether the 29-descriptor vocabulary has enough resolution for paper-texture work or whether prose leaks — capture both prose and tags, the gap is the data. First substantial sharp-substrate-fold test of subjective → structured; whether the method generalizes is deferred to the project retro per the cross-project ratification gate.

---

## Next

Ordered queue. Order reflects priority + sequencing constraints derived from the three-axis framework. Entries marked **Trigger:** are conditionally gated — they pull into § Now when triggers fire, regardless of queue position. At every project close, Coordinator surfaces trigger-conditional entries and asks operator whether trigger conditions have been met (see § Roadmap update discipline).

### 1. Bloom science

**Effort:** medium. **Fold-in:** medium (extends Track 5's xBloom platform if compatible). **WBC payoff:** medium.

**Scope:** Bloom water-to-coffee ratio, bloom temperature, bloom duration, bloom agitation (swirl / stir / jiggle / none), double-bloom technique, bloom temperature gradients (hot / same-as-main / cold), held-switch bloom. Vary bloom alone, hold everything else constant.

**Sequencing rationale:** Precursor to § Next #6 (Temperature profiling) per operator call — bloom alone is scoped first, temp-trajectory expansion second. Inherits Track 5's xBloom platform validation. Methodology mostly inherited from filter arc + Track 5.

### 2. Routine construction & rehearsal as research

**Effort:** medium. **Fold-in:** medium (Track 1 reads existing wbc-brewing-archivist substrate; subsequent tracks build new). **WBC payoff:** high.

**Scope (Track 1):** Decompose 2022-2025 WBC champion + finalist routines into component pieces — recipe / presentation structure / verbal framing / serving choice / judging-rubric anchors. Output: routine-component taxonomy + identification of operator's blind spots. **Subsequent tracks:** actual rehearsal arc against the rubric — recording sessions, iterating, capturing feedback.

**Sequencing rationale:** Builds performance-side muscle that purely-upstream variable research can't provide. Operator-acknowledged WBC-must-have. Track 1 is cheap (corpus already exists in wbc-brewing-archivist cluster); later tracks are the real lift.

### 3. Degassing curves

**Effort:** medium. **Fold-in:** low (new substrate). **WBC payoff:** medium.

**Scope:** Rest-time experiments — 1d / 5-7d / 2w / 3w / 6w. Effect on drawdown time, recipe, end flavor. Test whether "optimal rest time" is a real shaping variable or operator folklore. Materials axis (sealed bag vs single-dose freezer vs open bag) folds into this project — including the prior RP4 AI-1 baseline-drift question (HALO-B3 134s P3 vs 91s RP4, plastic-bag-degassing hypothesis untested at filter-arc close).

**Sequencing rationale:** Roasting-side equipment platform (different from brewing-side projects); scoped to one variable axis. Subsumes the RP4 AI-1 single-session investigation that was previously parked in § Extensions.

### 4. Pour kinematics

**Effort:** large. **Fold-in:** low (new platform). **WBC payoff:** medium.

**Scope:** Pour height, pour rate, pour pattern (center / spiral / edge-circular) — effect on extraction across coffees. Build pour intuition that current operator recipes ("pour 1/2/3 sometimes spiral, sometimes faster/slower") lack underneath.

**Sequencing rationale:** Needs non-xBloom platform (xBloom's 3.0-3.5 mL/s pour-rate range + physical height constraints insufficient — exactly why operator moved off xBloom for own brewing). Custom pouring rig investment. Depends on Track 5's subjective-taxonomy template being battle-tested for the cup-level effects measurement.

### 5. Water chemistry & mineral concentrates

**Effort:** large. **Fold-in:** none (whole new corpus, possibly own sub-skill). **WBC payoff:** huge.

**Scope:** Phase 1 — comparative tasting of formulated mineral concentrates vs tap water vs distilled, building the difference vocabulary. Phase 2 — build own controlled mineral system independently varying Ca / Mg / Na / K / bicarbonate. End game: per-coffee water recipe library. Operator-flagged as "honestly probably the most important one" — most WBC champions arrive at custom water.

**Sequencing rationale:** The big rock. Earlier projects' methodology refinements (Track 5's subjective-taxonomy work + Routine construction's WBC framing) sharpen the scoping. Chunking strategy TBD at scope time — phase 1 + phase 2 likely span multiple tracks. Could be argued earlier in the queue; operator's call at the next project-close sequencing pass.

### 6. Cross-coffee blending

**Effort:** large. **Fold-in:** medium (inherits roast-blending taxonomy if § Next #11 fires first). **WBC payoff:** huge.

**Scope:** 2-3 component blends across varieties / terroirs / same-variety-different-terroir. Categorize per-component contribution — e.g. what does 10% washed component X do to 90% natural-anaerobic component Y. Output: cross-coffee blending taxonomy.

**Sequencing rationale:** Champion-routine blind spot identified via wbc-brewing-archivist corpus analysis. Inherits the blending taxonomy shape from § Next #11 (Roast blending) when that project fires — single-coffee roast blending is the smaller-scope prototype for the larger cross-coffee taxonomy.

### 7. Temperature profiling

**Effort:** large. **Fold-in:** medium (inherits Bloom science). **WBC payoff:** medium.

**Scope:** Single brew temp → temp trajectory. Starting hot & dropping (kettle off stand), reheating between pours, prewarming, chilling brewer, going cool-to-hot. Multi-kettle work (2 home kettles, 1 office). Underexplored area.

**Sequencing rationale:** After § Next #1 (Bloom science) sets the bloom-temp scope. The two projects are sibling thermal axes but Bloom is the precursor + smaller-scoped first cut.

### 8. Serving vessel

**Effort:** small/medium. **Fold-in:** low (new substrate). **WBC payoff:** medium.

**Scope:** Cup material / shape / wall-thickness / pre-warm temp. Effect on perceived aromatics, mouthfeel, temperature evolution. Operator-flagged blind spot — hadn't experimented at this layer.

**Sequencing rationale:** Focused small project; could move up as a palate cleanser between large rocks at any sequencing pass.

### 9. Output selection / fractionalization

**Effort:** medium. **Fold-in:** medium (extends existing modifier taxonomy). **WBC payoff:** medium.

**Trigger:** TDS + EY meter purchased (operator flagged "been meaning to get one for a while").

**Scope:** Separate bloom / body / tail fractions. Understand each fraction's composition vs perception. Recombine portions to understand effects across coffees. Output: fractionalization taxonomy — which coffees reward output selection, which don't.

### 10. Rapid chilling at drawdown / post-brew

**Effort:** small. **Fold-in:** low. **WBC payoff:** medium.

**Scope:** Chill selections (bloom only / pour 1 / pour 2 / whole brew) or whole brew using Paragon (Nucleus Coffee Tools — [link](https://nucleuscoffeetools.com/products/paragon/)) with ice chill bowl. Different temperature gradients. Effect on aromatics. Broader question: coffees taste best at 45-50°C — is rapid-cool-from-hot better than natural drop?

**Sequencing rationale:** Most constrained scope. Paragon already owned. Small experimental surface — fits as a focused project between larger investments.

### 11. Roast blending of a single coffee

**Effort:** large. **Fold-in:** low (builds blending taxonomy shape). **WBC payoff:** huge.

**Trigger:** (a) operator reaches a reference roast they really enjoy AND (b) excess beans available to play with. Nothing in current inventory meets this; chunkier lots in pipeline are candidates as they go through the roasting process.

**Scope:** Take one green in volume. Develop deliberately varied roast profiles (Maillard-forward / development-forward / fast / slow / counterflow / drum / regular). Blend at different ratios. Latent's drum-vs-counterflow setup uniquely suited for this. Output: roast palette framework, intersects with § Next #6 (Cross-coffee blending).

**Sequencing rationale:** Floats — runs whenever triggers fire, regardless of queue position. Single-coffee roast blending is the smaller-scope prototype for the larger cross-coffee blending taxonomy; if this project fires before § Next #6, it sharpens the downstream scoping.

### 12. Sourcing

**Effort:** large. **Fold-in:** low (extends existing wbc-roasting-archivist + sourcing/strategy.md substrate). **WBC payoff:** huge.

**Trigger:** (a) roasting-mechanics confidence builds enough that operator feels comfortable moving beyond mechanics-learning into sourcing-strategy work AND (b) wbc-roasting-archivist depth approaches wbc-brewing-archivist parity (§ Side quests C-prime).

**Scope:** What cultivars / processes / producers consistently land at the WBC table. What that tells the operator about sourcing for competition. Builds on existing wbc-roasting-archivist + sourcing/strategy.md substrate.

**Sequencing rationale:** Floats. Operator-flagged: "still learning the mechanical basics of roasting" — sourcing research benefits from prior roasting-mechanics fluency + a deeper wbc-roasting-archivist corpus.

---

## Extensions of completed

*Empty post 2026-05-27 talk-through. Previous entries absorbed:*

- *Track 5 — promoted to § Now with sharpened scope (textural-quality layer for FilterEntry; xBloom platform; subjective-into-taxonomy prototype).*
- *RP4 AI-1 — subsumed by § Next #3 (Degassing curves), which folds the materials-axis question into a broader degassing project rather than running it as an isolated single-session.*

---

## Side quests

### C-prime — Deepen wbc-roasting-archivist toward wbc-brewing-archivist parity

Ongoing/opportunistic substrate work. wbc-roasting-archivist is currently smaller in scope than wbc-brewing-archivist. Lands as substrate fold whenever operator surfaces new WBC roasting context — not project-shaped, not a discrete arc. **Couples to § Next #12 (Sourcing)** — richer roasting corpus is a trigger condition for sourcing research moving from § Next-queued to § Now-eligible.

### Sensory training & vocabulary

Non-brew-related. Le Nez du Café 60-aroma kit calibration ([link](https://www.lenez.com/en/aroma-kits/coffee/)). 30-min ongoing chunks rather than a discrete research arc. Operator-flagged: the descriptive ceiling raises every other research project's ceiling — better aromatic vocabulary = better sensory output on every brewing-quality + blending + routine project downstream. Lives in § Side quests because the work is opportunistic + cumulative rather than project-bounded; may graduate to § Next if a sensory-research arc takes structured shape.

---

## Closed

### Filter arc (4 tracks, 2026-05-21 → 2026-05-26)

The 4-track filter arc that produced the substrate for Research Assistant Step 2 scaffolding. Closed 2026-05-26 ([PR #264](https://github.com/chrismccann-dev/latent-coffee/pull/264) + main `451935d`).

| # | Track | Methodology | Closed | End-document |
|---|---|---|---|---|
| 1 | Cone Filter Drawdown | Paper-brewer-combo (V60 Glass + Sibarist CONE B3 baseline) | 2026-05-23 | [cone-filter-drawdown.md](docs/research-projects/cone-filter-drawdown.md) |
| 2 | Flat-bottom Filter Drawdown | Paper-brewer-combo (Orea Type-A + Negotiator + BOOSTER 45 exploratory pulls) | 2026-05-24 | [flat-bottom-filter-drawdown.md](docs/research-projects/flat-bottom-filter-drawdown.md) |
| 3 | Specialty Cone Filter Drawdown | Paper-brewer-combo (Funnex + Sibarist BS, 2 sub-projects) | 2026-05-25 | [specialty-cone-filter-drawdown.md](docs/research-projects/specialty-cone-filter-drawdown.md) |
| RP4 | Paper-Only V60 Cohort Re-Measurement in Sibarist BS | Paper-only methodology validation | 2026-05-26 | [paper-only-v60-cohort-drawdown.md](docs/research-projects/paper-only-v60-cohort-drawdown.md) |

**Substrate output:** ~49 lessons (numbered #1-#40 + RP4-N1 through RP4-N9) · 23 audit items (P2 AI-1 through RP4 AI-7) · 2 ADRs ([ADR-0015](docs/adr/0015-accessory-aware-flowrate-and-booster-registry.md) FilterEntry.flowRateContexts + BoosterEntry registry, [ADR-0016](docs/adr/0016-family-conditional-flow-rate-classification.md) family-conditional flow-rate classification framework). Both ADRs locked; implementation deferred to a future sprint (trigger conditions met).

**Project-level retro:** The filter-arc retro WAS the Step 1 grilling session (2026-05-26) that locked the Research Assistant Step 2 scope. The outputs of that retro are the cluster docs in this directory + ADR-0017 + the Step 2 scaffolding ship itself. The filter arc is the canonical "first project" that the methodology primitives were forged on.

---

## Roadmap update discipline

Per [`process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md): the Coordinator updates this roadmap at every project close + at every retro. Mid-project, the Coordinator may update § Side quests with emergent ideas, but should NOT add to § Next mid-project (that's the retro's job — premature queuing causes scope drift).

When updating § Closed: add the new entry at the TOP (reverse-chronological) with a brief project description + closed date + end-document pointer. Don't summarize the project's findings here — those live in the end-document.

When moving a project from § Now to § Closed: § Now becomes empty until the retro runs and the next project scopes in.

### Sequencing convention at project close

When the current § Now project closes, before pulling the next project from § Next, Coordinator runs this three-step pass:

1. **Trigger-conditional check.** Coordinator surfaces every § Next entry marked **Trigger:** and asks operator whether trigger conditions have been met. If met → entry becomes eligible for the next-slot framing alongside other top-of-queue candidates. If not met → entry stays in § Next at its current position; queue shifts up.

2. **Two-option framing.** Coordinator surfaces two candidates for the next § Now slot:
   - **Highest-payoff option** — biggest WBC-payoff candidate eligible at this moment
   - **Highest-momentum option** — smallest-effort × highest-fold candidate that maintains research-craft momentum

   Operator picks based on time / bandwidth / energy. Both are legitimate research strategies — neither dominates the other.

3. **Talk-through, not auto-pick.** Coordinator does not pre-select. Surfaces candidates with reasoning; operator locks the slot via audio sign-off. Same discipline as the original roadmap talk-through that populated this doc.
