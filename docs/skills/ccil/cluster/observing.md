# CCIL — Observing list

Candidate structural concepts that have been *named* during grilling but have insufficient N for promotion to confirmed vocabulary (CONTEXT.md entry) or a confirmed CCIL pattern. Surfaced at standard arbitration time (`process pending arbitration`) alongside doc proposals + taxonomy queue + skeleton entries. The arbiter asks per-candidate: promote / convert to CCIL pattern / convert to doc change / defer / drop. Per-item judgment, no upfront promotion rules.

Distinct from [docs/grilling-queue.md](../../../../grilling-queue.md): grilling-queue holds concepts to DISCUSS at the next grill; observing.md holds candidates that have BEEN discussed at a grill, were named, but lack confirming N for promotion.

## Active candidates

### Process throughline
- **Surfaced:** Item 1, Sprint R Phase 4 Step 4 grill (2026-05-23)
- **What it names:** the shared character pattern that holds across both roasting and brewing layers when a PROCESS character is strong enough to dominate variety / terroir signal. The stronger the process, the stronger the throughline signal — heavily co-fermented beans can have a process throughline that overrides variety on both layers. Analogous structure to **Variety throughline** ([CONTEXT.md](../../../../../CONTEXT.md)) but anchored on process family (washed / natural / honey / wet-hulled / heavy-ferment) rather than variety.
- **Current N:** unsystematically observed across brewing-historian/cluster/patterns/by-strategy/ + roasting-historian/cluster/patterns/by-process/washed.md
- **Promotion trigger:** 2+ explicit CCIL patterns surface process throughline as the load-bearing axis (e.g. confirmed heavy-ferment co-ferment pattern where process throughline dominates regardless of variety).
- **Related:** [[variety-throughline]] · [[cross-coffee-insight-layer]]

### Process-scoped vs variety-scoped hypothesis class
- **Surfaced:** 2026-05-21 Sudan Rume CCIL seed pattern (Wave 4 PR 4a) / named at Item 1, Sprint R Phase 4 Step 4 grill (2026-05-23)
- **What it names:** a recurring shape of CCIL working hypothesis. When a brewing or roasting rule surfaces ("X happens under Y condition"), there's a follow-up about which attribute Y is really anchored on — variety / process / terroir / equipment / roast-level. Sudan Rume's vehicle-dependency rule is the N=1 instance: originally variety-scoped (aromatic landraces on fast cones phase-separate), now possibly process-scoped (only naturals separate; washed integrates with Melodrip control).
- **Current N:** 1 (Sudan Rume vehicle-dependency rule)
- **Promotion trigger:** a second CCIL pattern surfaces the same kind of scope question (process-vs-variety, terroir-vs-altitude, equipment-vs-roast-level, etc.) — then name the class and lock as CCIL vocabulary.
- **Related:** [[cross-coffee-insight-layer]] · sudan-rume seed pattern

### Pivot-destination heuristics
- **Surfaced:** Round 11 Wush Wush Brew 2 → Brew 3 pivot (2026-05-22) / locked at Item 19, Sprint R Phase 4 Step 4 grill (2026-05-23)
- **What it names:** the residual-problem-SHAPE → target-strategy mapping in [brewing-assistant operational-guide § Step 3 Pivot-destination heuristics](../../../brewing-assistant/cluster/operational-guide.md). Maps shapes like "single-axis loud" → Suppression; "two-opposing-goals" → Hybrid Intensity-Clarity Split; "aromatic-vs-structural-decoupling" → Hybrid Selective Bloom; "temperature-cliff" → Hybrid Temperature-Staged; "heavy-process-loud" → Suppression; "quiet-buried-under-roast" → Hybrid or Extraction Push.
- **Current N:** 1 lived pivot (Wush Wush Brew 2 → Brew 3 validated the "single-axis loud" → Suppression heuristic for naturals-with-pungent-fermentation)
- **Promotion trigger:** 2-3 more strategy pivots fire that test the heuristics — across different residual-problem shapes — and confirm the mapping holds. Then promote from operational-guide content to a brewing-historian CCIL entry. The mapping is currently advisory; promotion makes it canonical.
- **Related:** [[cross-coffee-insight-layer]] · operational-guide § Step 3

### Cross-domain tension as a CCIL section convention
- **Surfaced:** 2026-05-21 Sudan Rume CCIL seed pattern § "Cross-domain tension to flag" / named at Item 1, Sprint R Phase 4 Step 4 grill (2026-05-23)
- **What it names:** the structural shape inside a CCIL pattern doc where one layer's settled rule contradicts another's. The CCIL entry surfaces the contradiction explicitly, proposes a unified working hypothesis to bridge, and lists what evidence would resolve. Candidate to become a CCIL cluster authoring convention (lives in [SKILL.md](../SKILL.md) if promoted, not CONTEXT.md).
- **Current N:** 1 ("fast cone phase-separates on Sudan Rume" brewing rule vs Latent SR Washed reference brew on UFO Ceramic + Sibarist Fast Cone producing integrated cup)
- **Promotion trigger:** 2-3 more CCIL patterns where cross-domain tension is the structurally interesting part — then promote to CCIL SKILL.md authoring convention.
- **Related:** [[cross-coffee-insight-layer]] · sudan-rume seed pattern

### Temperature primacy extends to traditional natural aromatic landraces
- **Surfaced:** Round 13 CGLE Sudan Rume Natural Batch 187 brewing iteration (2026-05-23) / locked at Item 28, Sprint R Phase 4 Step 4 Group 2 grill (2026-05-24)
- **What it names:** The candidate generalization of the temperature-primacy pattern from anaerobic naturals (and cold-room dehydration naturals) to **traditional (non-anaerobic) natural aromatic landraces**. Today's substrate (brewing-historian/cluster/patterns/cross-coffee-insights.md § Process / Variety Signal Table + § By Process: Anaerobic Natural) locks temperature primacy across 4 origins on the anaerobic/sealed-ferment side — Colombia (Finca Inmaculada), Ethiopia (Basha Bekele Kokose), Panama (Altieri NASD), and Ethiopian-green-Panama-processed (Picolot Simba Cold Room). Round 13 surfaced the rule extending cleanly to a TRADITIONAL Sudan Rume Natural: 91°C over-extracted the aromatic fraction → 89°C single-variable resolve produced the target cup. Generalization candidate: temperature primacy applies wherever an **aromatic landrace meets a natural process**, anaerobic OR traditional.
- **Current N:** 1 (CGLE Sudan Rume Natural at the traditional / non-anaerobic side of the natural axis).
- **Promotion trigger:** 2-3 more traditional-natural aromatic landraces confirm (next candidates: any future SL-lineage / Ethiopian-landrace / 74-series natural lots in the brewing queue). Promote by **broadening** the existing `Anaerobic-Natural Suppression + Temperature-Primacy pattern` section in brewing-historian/cluster/patterns/cross-coffee-insights.md → rename to `Aromatic-landrace + natural process Suppression + Temperature-Primacy pattern` and document both axes (anaerobic + traditional) under the unified pattern.
- **Related:** [[cross-coffee-insight-layer]] · brewing-historian/cluster/patterns/cross-coffee-insights.md § Anaerobic-Natural Suppression + Temperature-Primacy

### Medium-roast specialty natural over-extraction lever
- **Surfaced:** Round 10 Wush Wush brewing iteration (2026-05-22) / locked at Item 15, Sprint R Phase 4 Step 4 Group 2 grill (2026-05-24)
- **What it names:** The brewing lever shift required when a specialty natural is roasted medium or darker. Default brewing framework assumes ultra-light / light roasters (Sey / Substance / Moonwake / Picky Chemist / Big Sur archetypes); pushing harder = unlock more flavor. Medium-roast specialty natural inverts that: over-extraction risk is **roast character** (chocolate / nut / bittering forward of the green's fruit signature), not under-development. The corrective lever is **evaluate cooler + accept a chocolatier register**, NOT temperature / agitation push. Today documented as the **Roaster roast-level hook** in [brewing-assistant operational-guide.md § Step 1](../../brewing-assistant/cluster/operational-guide.md); pattern is observation-only pending more confirming lots.
- **Current N:** 1 (Wush Wush, Untold Coffee Lab, medium-roast specialty natural).
- **Promotion trigger:** **N≥2 more medium-roast specialty naturals where over-extraction-risk-as-roast-character framing LEADS strategy selection at intake** (not just retroactively confirmed at iteration time). Trigger language tightened at Item 20 / Group 5 grill (2026-05-24, audio-ratified) — aligned across this CCIL observing entry + the parallel operational-guide tracking at [docs/grilling-queue.md Item 20](../../../../grilling-queue.md). Chris flagged at the Item 15 grill that he has a couple of inventory lots with darker-than-normal readings expected to land in brewing rotation, so this candidate is likely to advance soon. Promote from operational-guide observation to a brewing-historian CCIL entry once threshold met; coordinate Step 1b signal-table promotion in same sprint.
- **Related:** [[cross-coffee-insight-layer]] · brewing-assistant operational-guide § Roaster roast-level hook

### Wide WB-to-Ground Agtron delta as roast-quality negative signal
- **Surfaced:** Item 8, Sprint R Phase 4 Step 4 Group 2 grill (2026-05-24); seeded by the CGLE Sudan Rume Natural V5A 2026-05-21 fire where delta 15.7 vs prior reference 169's delta 3.1 motivated the Simulated Pourover Gate cup.
- **What it names:** The interpretation framing of the WB-to-Ground Agtron delta as Chris uses it operationally. Chris's lived framing (Item 8 grill audio): thin delta is a positive affirmation that the roast went well (clean internal development); wide delta is a potential negative affirmation that the roast did NOT go well, specifically suggesting the internal beans are underdeveloped relative to the surface and the roast may not be repeatable. Origin story: when Chris switched from non-counterflow regular mode (7-8 min roasts) to counterflow mode, early counterflow roasts ran way too fast — correct end color externally, underdeveloped internally. Measuring whole-bean Agtron immediately after roast + ground Agtron at cupping time made the surface/core split queryable. The magnitude tier table at [roest-knowledge/cluster/machine/counterflow-observations.md § WB-to-Ground Agtron Delta as Development Signal](../../roest-knowledge/cluster/machine/counterflow-observations.md) (≤3 even / 4-6 working / >7 wide) is the substrate-level magnitude framework with directional interpretation split by lot family.
- **Why this is observing rather than locked rule:** Item 8 originally framed the delta as a candidate **Simulated Pourover Gate routing trigger** — V5's wide delta DID trigger the Path C-2 / SPG read. But Chris's framing at the grill clarified that wide delta is primarily a **roast-quality signal**, not a routing-decisive SPG trigger. The lived V5 SPG fire was motivated by the roast-quality concern (V5A's wide delta = internal underdevelopment risk = xBloom gate may be reading something the real pourover won't); the operator's response was an SPG cup to validate or invalidate. Overpromoting "wide delta → SPG" into a deterministic routing rule would conflate a diagnostic signal with a routing trigger.
- **Current N:** 1 V-set lot where wide delta fed into an SPG decision (V5).
- **Promotion trigger:** 2-3 more lived cases where wide delta surfaces as a roast-quality concern AND/OR motivates an SPG read. Two distinct shape options to disambiguate at promotion time: (a) lock as a roast-quality interpretation framing in a CCIL pattern doc (cross-process: applies regardless of process/variety, all counterflow roasts); (b) lock as a recurring SPG motivating-factor in `pod-1-routing.md` § Reactive triggers. Chris's framing suggests (a) — the negative-signal interpretation is the load-bearing concept, the SPG routing is downstream of operator judgment.
- **Related:** [[simulated-pourover-gate]] · [[cross-coffee-insight-layer]] · roest-knowledge WB-to-Ground Agtron Delta substrate

## Resolved (append-only history)

When the arbiter promotes a candidate, move it here with date + landing target. Format:

```
- **<Candidate name>** — resolved YYYY-MM-DD. Landed as: <CONTEXT.md entry / CCIL pattern at <path> / CCIL SKILL.md convention / dropped>. Source PR: #NNN.
```

(none yet — populated as arbiter passes promote candidates)
