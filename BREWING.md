# BREWING.md

Content migrated to the composable sub-skills architecture per [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) (Wave 4 PR 4b, 2026-05-21).

**Where to find what was here:**

| Former section | Now at |
|---|---|
| Brew Prompt operational guide (Steps 1-4 + Coffee Brief + Recipe Output + Iteration Loop + Resolved Brew Output Format) | [docs/skills/brewing-assistant/cluster/operational-guide.md](docs/skills/brewing-assistant/cluster/operational-guide.md) |
| Two-Axis Framework (Axis 1 + Axis 2 + Strategy + Modifier notation + Brewer rotation discipline) framing | [docs/skills/coordinator/catalog.md § brewing-domain-principles](docs/skills/coordinator/catalog.md) |
| Per-strategy substrate (Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid + sub-forms) | [docs/skills/brewing-historian/cluster/patterns/by-strategy/](docs/skills/brewing-historian/cluster/patterns/by-strategy/) |
| Process / Variety Signal Table | [docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md § Process / Variety Signal Table](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md) |
| Location Constraints (Office + Home) + Equipment Reference + Valve Position Reference + Filter System + Example Outputs | [docs/skills/brewing-equipment-expert/cluster/operational-reference.md](docs/skills/brewing-equipment-expert/cluster/operational-reference.md) |
| Per-brewer / per-filter / per-grinder / per-sworks taxonomies | [docs/skills/brewing-equipment-expert/cluster/](docs/skills/brewing-equipment-expert/cluster/) |
| Canonical taxonomy lookups + Working with the Latent MCP server + How to Use This Document | [docs/skills/coordinator/operator-guide.md](docs/skills/coordinator/operator-guide.md) |
| Cross-Coffee Insight Layer (By Strategy / By Modifier / By Process / By Variety / Cooling Behavior / Office Brewing / Open Questions) | [docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md) |
| Per-cultivar + per-coffee-family deep dives | [docs/skills/brewing-historian/cluster/patterns/by-cultivar/](docs/skills/brewing-historian/cluster/patterns/by-cultivar/) + [by-coffee-family/](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/) |
| WBC Reference (Section 4) + 154-recipe corpus (2022-2026) | [docs/skills/wbc-brewing-archivist/cluster/](docs/skills/wbc-brewing-archivist/cluster/) |
| Roaster Reference (Section 2) | [docs/brewing/roasters.md](docs/brewing/roasters.md) |
| Cross-domain (roasting + brewing) patterns | [docs/skills/ccil/cluster/coffee/](docs/skills/ccil/cluster/coffee/) |

**Entry surfaces.** Brew sessions are **Claude-Code-native** via the operator-direct [`.claude/skills/brew/SKILL.md`](.claude/skills/brew/SKILL.md) skill (trigger "brew a coffee"; brewing→CC migration GRADUATED roadmap #4, **claude.ai brewing retired 2026-06-18**). If a fresh mobile session does not surface the skill, [docs/prompts/start-brew.md](docs/prompts/start-brew.md) is the fallback entry; completion runs through [docs/prompts/bundled-brewing-completion.md](docs/prompts/bundled-brewing-completion.md) (the shared completion engine the skill hands off to). All compose over the cluster docs above via `read_doc`; the write path is `push_brew` via the Latent MCP server regardless of client. (The former `log-brew.md` + `propose-doc-changes-from-brew.md` redirect stubs were removed at retirement.)

See [docs/skills/coordinator/catalog.md](docs/skills/coordinator/catalog.md) for the full sub-skill catalog and [docs/architecture/master-doc-transition-plan.md](docs/architecture/master-doc-transition-plan.md) for the wave-by-wave migration history. The pre-redirect content is preserved in git history.
