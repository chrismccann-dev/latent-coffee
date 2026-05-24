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

## Resolved (append-only history)

When the arbiter promotes a candidate, move it here with date + landing target. Format:

```
- **<Candidate name>** — resolved YYYY-MM-DD. Landed as: <CONTEXT.md entry / CCIL pattern at <path> / CCIL SKILL.md convention / dropped>. Source PR: #NNN.
```

(none yet — populated as arbiter passes promote candidates)
