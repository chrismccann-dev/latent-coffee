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

### Research Project #6 - Water chemistry & mineral concentrates (Codification SHIPPED · verifying)

**Opened:** 2026-06-20. Third project on the Coordinator/Assistant architecture; second taste-shaped project (RP6 retro graduates the RP5-seeded taste-study primitive candidates if they fire again). **Status:** Track 1 (Phase 1 concentrate screen) CLOSED 2026-06-21; **Track 2 (Phase 2 single-mineral isolation) CLOSED 2026-07-03 - all 5 HTs resolved.** Operator called codify-now (2026-07-03): **Codification Phase A SHIPPED 2026-07-04** ([execution plan](docs/research-projects/water-codification-phase-a-plan.md)) - the water knowledge substrate now lives at [water.md](docs/skills/brewing-equipment-expert/cluster/water.md) (recording schema + anion→phase chart + build method + guardrails + the MgCl₂-forward Pink-Bourbon recipe seed, values stamped provisional), registered as an MCP Resource. **Phase B (water wired into `/brew`) SHIPPED 2026-07-04** (PR #541, main `ebd010d`) - at home, Step 2 offers a `water.md`-derived per-brew recipe (offer-not-mandate); office records tap as-is. **The codification arc is closed - water is now a working lever in the routine brew loop.** **The 2nd-coffee VALUES verification COMPLETED 2026-07-17 (Phase 2b, Gesha Natural): the peak generalizes, `water.md` § 6 is de-provisionalized** - see the Phase 2b line below for the full verdict.

**Thesis - reveal-not-inject (operator-locked HOLD BOTH).** Reveal-not-inject is the KNOWLEDGE frame (map what each lever does, at each dose), NOT a purity rule - the objective is the best cup; the value is knowing each lever's effect so the choice is intentional. Working preference: scaffold off what the coffee already has over injecting what isn't there, but likeable injects are valid. Dashwood guardrail × Latent's taste apex ([CONTEXT-taste.md](CONTEXT-taste.md): reveal-not-inject / layered-evolving); Roast Summit chemistry is the mechanism (bicarbonate destroys acid; Ca/Mg bind extraction-active compounds).

**Locked scope:** xBloom + fixed no-modulation V60 · Hydrangea Pink Bourbon Washed (baseline-dialed, clarity-weighted = sensitive masking detector) · distilled base · semi-blind · operator gear complete (A&D EJ-123, Apera EC60 + 84/1413 standards, LaMotte BrewLab + API GH/KH, two micropipettes, stirrer). Single-coffee throughout → the coffee-independent STRUCTURE codifies now (Phase A); the single-coffee VALUES stay provisional + verify on a 2nd coffee later (de-gated per operator call 2026-07-03).

**Track 1 findings (Phase 1 concentrate screen, closed 2026-06-21):**
- **Less is more on this clarity coffee** - in Lane C (pre-brew, extraction-valid) distilled beat TWW + both natural waters; nothing beat the zero-mineral control. Any built water must clear that bar.
- **Sulfate-axis reveal (CONTESTED by Track 2)** - the two sulfate-bearing *blends* (LYLAC, SBL) tied at the top; SBL the single best reveal. BUT those blends also contain chloride, and Track 2's single-salt isolation INVERTED this. Credit may belong to chloride - unresolved pending Track 2 Lane B (pre-brew).
- **Sweet spots are LOW** (~2-3 drops/200 mL; vendor-mid past peak).
- **Reveal vs inject is DOSE-DEPENDENT, not a product property** (JAMM injected @7, revealed @3) - the headline thesis refinement; reframes/resolves P6T1-AI-2.
- **Best cup = a low-dose likeable inject** (JAMM @3) over the cleanest reveal (LYLAC @2). Cooling addendum: a well-cooled LYLAC+SBL+JAMM blend caught/edged JAMM-alone → "JAMM-body + sulfate-acidity" near-miss + tasting temperature is itself a preference variable.
- Archive: [water-concentrate-postbrew-screen.md](docs/research-projects/water-concentrate-postbrew-screen.md).

**Track 2 findings (Phase 2 single-mineral isolation, CLOSED 2026-07-03 - all 5 HTs resolved; PROVISIONAL / single-coffee):**
- **THE resolved mechanism - the anion sets a PHASE, the cation gates it.** SULFATE → body/sweetness/creaminess (cation-agnostic: MgSO₄ 3.0, CaSO₄ 2.5). CHLORIDE → attack/acidity/florality/clarity but cation-GATED (MgCl₂ 3.1 bright peak; CaCl₂ 1.5 muted/lactic). An interaction, not two main effects. Peak cup = **straight MgCl₂ @ GH 44**; no blend/buffer/Ca/sulfate variant beat it.
- **HT3 (pre vs post) DIVERGES = the extraction effect** (the methodology crown). Post-brew is a **bounded proxy** - it got the coarse ranking but inverted the mechanism (MgSO₄ rehabilitated muddy→body; CaCl₂ inverted bright→lactic). Validates the hybrid design; supersedes the Sitting-1 "inversion" framing. Per-axis scoring (the WBC fold) was the key methodological win - anion→phase was only visible because of it.
- **HT4 (buffer):** minimal/zero KH slightly beats KH~15 (small margin); buffer flattens acidity/clarity. Confirms the less-is-more lean. (Sitting-2's "KH brightens" surprise was a brew fault, retired on a clean re-brew.)
- **HT5 (SBL recon vs bottled):** clean stock build > cloudy bottle (precipitation *unbalances* the bottle - ~1 drop GH/KH loss measured + tasted); BOTH < distilled (full 5-salt SBL over-injects on this clarity coffee - real Track-1 replication).
- **WBC reconciliation:** anion-sets-a-phase strongly corroborated; the field's specific role-labels (MgSO₄=florality, CaCl₂=body) did NOT reproduce here (we got sulfate=body, chloride=florality) - coffee-dependent, held as a divergence.
- Archive (Sittings 1-3): [water-single-mineral-isolation.md](docs/research-projects/water-single-mineral-isolation.md).

**Phase shape:**
- **Phase 1 (concentrate screen)** - DONE (Track 1). **Phase 2 (single-mineral isolation)** - DONE (Track 2, all 5 HTs resolved).
- **Codification (operator call 2026-07-03) - the fold, de-gated for STRUCTURE:**
  - **Phase A (SHIPPED 2026-07-04):** the water knowledge substrate as a brewing cluster doc - [water.md](docs/skills/brewing-equipment-expert/cluster/water.md) (taxonomy + the anion→phase chart + build method + guardrails + the MgCl₂-forward Pink-Bourbon recipe seed, values stamped provisional) + MCP registration. [Execution plan](docs/research-projects/water-codification-phase-a-plan.md).
  - **Phase B (water wired into `/brew`) SHIPPED 2026-07-04** (PR #541, main `ebd010d`): at home, `/brew` Step 2 offers a `water.md`-derived per-brew water recipe (offer-not-mandate; the daily crushable comp stays the low-effort default) and fills the existing `water_recipe` field; office records tap as-is. Pure skill-doc wiring (brewing-assistant Step 2 + location-constraints + the brew skill) - no schema/MCP change. [Execution plan](docs/research-projects/water-codification-phase-b-plan.md).
- **Phase 2b (2nd-coffee verification) - EXECUTED + FOLDED 2026-07-17/18** (Gesha Natural, 2 sittings, 19 brews; archive [water-2nd-coffee-verification.md](docs/research-projects/water-2nd-coffee-verification.md) incl. the full handoff brief). **Verdict MIXED, net-positive: the PEAK GENERALIZES - straight MgCl₂ @ GH 44 / KH 0 won on both coffees** (HV2's predicted sulfate flip did NOT happen, reproduced 3 flights). Map REFORMULATED as phase-of-cup: **chloride = front, sulfate = back - complements, not competitors**; amplitude + sulfate-cation behavior are coffee-dependent. **HV3 dead (sulfate→florality 0/2 - WBC label re-scoped to "unsupported at full strength," operator call; low-fraction untested, P6T3-AI-4)**; HV4 demoted (avoid-CaCl₂ generalizes, "lactic" doesn't); **zero-KH verified** as platform default. New: **4:1 MgCl₂:CaSO₄ blend tied the peak** (silky/structured variant). **Folded 2026-07-18:** `water.md` § 2 reformulation + § 3 chart re-scope + **§ 6 DE-PROVISIONALIZED + Gesha row 3** (primary MgCl₂ / variant 4:1, ordering caveat noted) · brewing-assistant operational-guide Step-2 water language · `water-inventory.md` § 3a EC-first verification workflow + fingerprints + gypsum rebuild · freezer-stock "landed, not frozen" convention (P6T3-AI-1) + Gesha entry · calibration-arc primitive 7 (instrument re-cal every sitting, P6T3-N5) + flight-of-3 pacing exception (P6T3-N6/N7). Open: 5:1 + MgCl₂:MgSO₄ blend variants untested; P6T3-AI-3 (chalky-on-zero-KH CaCl₂ mechanism, flag on 3rd-coffee recurrence); P6T3-AI-5 (Kalita-vs-V60, future-track candidate).
- **Modifier minerals screen (KCl / silica / NaCl) - EXECUTED + FOLDED 2026-07-12** (Pink Bourbon, single sitting, 8 cups; archive [water-modifier-minerals.md](docs/research-projects/water-modifier-minerals.md)). Results (single-coffee, PROVISIONAL): **silica = the keeper** but as a **~12 ppm across-the-board amplifier** ("salting food"), NOT the texture modifier the WBC field labels it, ceiling <24 ppm; **NaCl = no workable dose** on the Pink Bourbon (≥5 ppm injects savory/amplifies the tomato note; distilled lane proved it's the NaCl, not chloride stacking); **KCl UNTESTED** - seller shipped K₂CO₃ (wrong/caustic item), so the potassium-vs-buffer question stays open, **remnant arm (2-3 cups) pending real KCl** (re-source needed). Folded to `water.md § 3` (silica + NaCl chart-rows; KCl deferred) + `water-inventory.md` (NaCl stock; K₂CO₃ correction). Silica added to `water.md § 6` as an **optional** amplifier (operator call 2026-07-12); **verify on other coffees** before generalizing (incl. the Gesha in Phase 2b). KCl re-source pending for the remnant potassium-vs-buffer arm.
- **Final screen (modifiers + blend variants on the Gesha) - SCOPED 2026-07-18, sitting 2026-07-19.** The LAST RP6 experimental track before the project retro: one 9-cup / 3-flight sitting closing (1) silica + NaCl generalization on coffee #2 (HF1/HF2), (2) the untested blend variants - 5:1 MgCl₂:CaSO₄ + 4:1 MgCl₂:MgSO₄ sweetness-payload (HF3/HF4), (3) the § 6 row-3 ordering caveat via a fully-blind straight-vs-best-blend flight (HF5). Step 0 executes the food-grade MgCl₂ arrival protocol (fresh stock, fingerprint ~9.3 mS, retire reagent bottles - closes the R5 safety flag). Protocol: [water-final-screen.md](docs/research-projects/water-final-screen.md) + [spawn prompt](docs/research-projects/water-final-screen-spawn-prompt.md). **Official RP6 project retro queued immediately after the fold.** (KCl remnant arm stays independent - runs as a standalone errand whenever the re-order lands, does not gate the retro.)
- **Future RP6 tracks (2026 WBC-seeded, [handoff](docs/research-projects/wbc-2026-water-handoff.md)):** stage-split mineral profiling (Mg-early/Ca-late - native xBloom fit) remains the open future track. Anchor: the **straight-MgCl₂ peak** (the Sitting-1 two-chloride pointer is retired - it rested on CaCl₂'s post-brew artifact, which inverted to lactic pre-brew) → test "+ a touch of sulfate + silica on the MgCl₂ base" ≈ Delgado's formula logic.
- **Water inventory SHIPPED 2026-07-04:** [water-inventory.md](docs/skills/brewing-equipment-expert/cluster/water-inventory.md) - a maintained physical inventory (base / reagents / concentrates / gear) that `water.md` pulls from, so builds + `/brew` suggestions stay in sync with the shelf. Living doc; update on acquisition/depletion (a `/water-inventory` skill is a future option if manual upkeep gets tedious).
- **Queued enhancement (post-codification) - recipe-library fold-back:** let each optimized home brew's water feed back into `water.md`'s §6 recipe library as a new row over time, so the per-coffee library grows from lived brewing (not just research tracks). Surfaced at Phase B close 2026-07-04; a small brewing-flow + `propose_doc_changes` wiring when picked up.
- End game: per-coffee water recipe library (`water.md` seeds it; the fold-back grows it) - huge WBC payoff.

**Carried items / audit:** **P6T2-AI-1** (the anion→phase / cation-gating map) - **CLOSED 2026-07-17**: pre-brew-confirmed (Track 2) + 2nd-coffee-verified (Phase 2b, reformulated as phase-of-cup). P6T1-AI-3 (TONIK roasted-barley confound) - **CLOSED/dropped 2026-07-04** (operator call): off the critical path (blend product; project pivoted to raw salts + codification); informal re-taste only if TONIK is used again. L-c #1-11 method primitives logged in the Track 2 archive for the PROJECT retro (per-axis-scoring, WATER-vs-CONCENTRATE labeling, build-from-stocks, naive-palate-as-asset, pre-brew-variance-needs-reproduce). Candidate CONTEXT-taste pointer to the water mechanism (light, in Phase A).

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

**→ PULLED TO § Now as Research Project #6 on 2026-06-20.** Intake/scoping complete; see § Now for the locked scope + Track 1 protocol pointer. (Was the highest-payoff queue pick; operator pulled it forward at RP5 close over Bloom science #1 and the dropped textural Tracks 2/3.) The remaining § Next entries keep their numbers.

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

### Filter textural-quality layer (Research Project #5, 2026-06-18 → 2026-06-20)

Single track executed (V60 cone); Tracks 2 (Kalita flat) + 3 (Sibarist BS native) **dropped as moot** at close — Track 1 answered the question, and 2/3 would have re-run the same experiment on different geometries. Second project on the Coordinator/Assistant architecture. Closed 2026-06-20.

| Track | Methodology | Closed | End-document |
|---|---|---|---|
| 1 | Filter textural quality, V60 cone — `structure_tags` taste reading via xBloom controlled-pour; paired-A/B vs CONE-B3, 1× per paper | 2026-06-20 | [filter-textural-quality-v60-cone.md](docs/research-projects/filter-textural-quality-v60-cone.md) |

**Headline finding:** **paper texture is largely FLOW-MEDIATED** (contact-time dominant; + bypass + flow-consistency) — the paper doesn't directly modulate texture, it modulates flow / contact-time, which modulates texture. The hypothesized `texturalTags` field proved flow-redundant + vocabulary-under-resolving + single-coffee-conditioned → **deferred, not shipped.** **Durable substrate output instead:** a realistic-condition drawdown field (`realisticDrawdownSec`, the xBloom end-time the filter arc's non-realistic dumps couldn't give) + the HALO `fitsBrewers` += V60 correction + filters.md flow-mediation knowledge ([PR #494](https://github.com/chrismccann-dev/latent-coffee/pull/494) / main `6b73d22`). **RP4 AI-4 resolved:** HALO ≡ CONE in the cup (both brewers) — fit story, never a cup story.

**Methodology output:** the archive-persist commit convention added to role-discipline ([PR #491](https://github.com/chrismccann-dev/latent-coffee/pull/491) — 2nd commit-boundary incident → ratification gate met, graduated). xBloom-as-controlled-platform + consumption-ceiling budgeting + per-axis tasting prompts + paired-A/B reading + dial-in-from-`/brew` seeded as taste-study primitive **candidates** — graduate at the water project (the 2nd taste-shaped project). Full retro in the end-document (§ Project Close + Retro).

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
