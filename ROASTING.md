# ROASTING.md

Content migrated to the composable sub-skills architecture per [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) (Wave 4 PR 4b, 2026-05-21).

**Where to find what was here:**

| Former section | Now at |
|---|---|
| Roasting Philosophy + What Good Looks Like For Each Coffee + What I Am Not Trying To Do + V-set methodology + Reference-cup vs optimized-brew distinction | [docs/skills/coordinator/catalog.md § roasting-domain-principles](docs/skills/coordinator/catalog.md) |
| Schema model + Canonical taxonomy lookups + Working with the Latent MCP server + How to Use This Document + Data Capture Per Step + Per-Coffee Threads + Session Debrief Template | [docs/skills/coordinator/operator-guide.md](docs/skills/coordinator/operator-guide.md) |
| Standard Workflow (Between Batch Protocol + Hopper Pre-Load Timing) | [docs/skills/roest-knowledge/cluster/protocols/between-batch-protocol.md](docs/skills/roest-knowledge/cluster/protocols/between-batch-protocol.md) |
| Equipment + Roest L200 Ultra hardware | [docs/skills/roest-knowledge/cluster/machine/l200-ultra.md](docs/skills/roest-knowledge/cluster/machine/l200-ultra.md) |
| Evaluation Protocol (Day 7 pourover gate + xbloom Brian Quan recipe + Ground Agtron measurement) | [docs/skills/roest-knowledge/cluster/protocols/evaluation.md](docs/skills/roest-knowledge/cluster/protocols/evaluation.md) |
| Standard Inlet Curve Template + Fan Strategy (Counterflow shaped curves) | [docs/skills/roest-knowledge/cluster/protocols/fan-strategy.md](docs/skills/roest-knowledge/cluster/protocols/fan-strategy.md) |
| Key Counterflow Observations (Machine-Specific) — TP, FC temp targeting, drop signal, WB→Ground delta | [docs/skills/roest-knowledge/cluster/machine/counterflow-observations.md](docs/skills/roest-knowledge/cluster/machine/counterflow-observations.md) |
| FC Marking Protocol | [docs/skills/roest-knowledge/cluster/protocols/fc-marking.md](docs/skills/roest-knowledge/cluster/protocols/fc-marking.md) |
| Green Bean Storage Protocol | [docs/skills/roest-knowledge/cluster/protocols/green-storage.md](docs/skills/roest-knowledge/cluster/protocols/green-storage.md) |
| New Coffee Onboarding Protocol (Steps 1-4 + Naming Conventions + Parallel Experiment Considerations) | [docs/skills/roasting-assistant/cluster/onboarding-protocol.md](docs/skills/roasting-assistant/cluster/onboarding-protocol.md) |
| Naturals — Roasting Framework | [docs/skills/roasting-historian/cluster/patterns/by-process/natural.md](docs/skills/roasting-historian/cluster/patterns/by-process/natural.md) |
| Honey Process — Roast Direction Fork | [docs/skills/roasting-historian/cluster/patterns/by-process/honey.md](docs/skills/roasting-historian/cluster/patterns/by-process/honey.md) |
| Lot Knowledge § Active Lots (per-lot working hypotheses) | [docs/skills/roasting-historian/cluster/active-lots/](docs/skills/roasting-historian/cluster/active-lots/) |
| Lot Knowledge § One-Shot Calibrations in Process | [docs/skills/roasting-historian/cluster/one-shot-calibrations/](docs/skills/roasting-historian/cluster/one-shot-calibrations/) |
| Lot Knowledge § Reference Roasts + Brews (Closed Lots) | [docs/skills/roasting-historian/cluster/learnings/](docs/skills/roasting-historian/cluster/learnings/) + [docs/roasting/archive.md](docs/roasting/archive.md) |
| Cross-Coffee Insight Layer (Confirmed Patterns + FC Floor & Ceiling + WB→Ground Delta Norms + Session Position + Green Spec → Starting Hypothesis + Varietal Aromatic Fingerprints + Rest Behavior + FC-Temp Architectural Constraint + xbloom Misranking + Working Hypotheses) | [docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md) |
| Open Questions | [docs/skills/roasting-historian/cluster/patterns/open-questions.md](docs/skills/roasting-historian/cluster/patterns/open-questions.md) |
| Roast-to-Brew Translation (Reading Roast Parameters + Pushed vs Standard Recipe Decision + Processing-Method Starting Hypotheses + Brew-Reveals-Roast Principle) | [docs/skills/roasting-historian/cluster/patterns/roast-to-brew-translation.md](docs/skills/roasting-historian/cluster/patterns/roast-to-brew-translation.md) |
| Reference Roast Target (Peer's Batch #249) + Peer Insights — Counterflow L200 Ultra | [docs/skills/peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md](docs/skills/peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md) |
| Archive (full per-lot prose, experiment history) | [docs/roasting/archive.md](docs/roasting/archive.md) |
| WBC Roasting Reference + Sourcing Strategy | [docs/skills/wbc-roasting-archivist/cluster/](docs/skills/wbc-roasting-archivist/cluster/) |
| Cross-domain (roasting + brewing) patterns | [docs/skills/ccil/cluster/coffee/](docs/skills/ccil/cluster/coffee/) |

**Entry surface unchanged.** Roast sessions still start with [docs/prompts/start-lot.md](docs/prompts/start-lot.md) (V-set lots) or [docs/prompts/one-shot.md](docs/prompts/one-shot.md) (one-shot calibration lots) and loop through [docs/prompts/log-roast.md](docs/prompts/log-roast.md) ⇄ [docs/prompts/log-cupping.md](docs/prompts/log-cupping.md) to [docs/prompts/close-lot.md](docs/prompts/close-lot.md) or [docs/prompts/one-shot-closeout.md](docs/prompts/one-shot-closeout.md). The prompts compose over the cluster docs above via `read_doc`.

See [docs/skills/coordinator/catalog.md](docs/skills/coordinator/catalog.md) for the full sub-skill catalog and [docs/architecture/master-doc-transition-plan.md](docs/architecture/master-doc-transition-plan.md) for the wave-by-wave migration history. The pre-redirect content is preserved in git history.
