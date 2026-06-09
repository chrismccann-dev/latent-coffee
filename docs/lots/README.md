# `docs/lots/` — Roasting Briefs (one per green-bean lot)

Each file here is a **Roasting Brief** at `docs/lots/<lot-slug>.md` — the durable, source-of-truth lot plan for the [Roasting Coordinator](docs/skills/roasting-coordinator/SKILL.md) ([ADR-0024](docs/adr/0024-lot-coordinator-claude-code-native.md), Model B). The Brief is what makes the Coordinator **session-transient**: any fresh Claude Code session reconstructs the lot by reading its Brief + pulling `get_bean_pipeline`.

Mirror of the Research side's `docs/research-projects/<track-slug>.md`.

- **Template + discipline:** [roasting-coordinator/cluster/roasting-brief-template.md](docs/skills/roasting-coordinator/cluster/roasting-brief-template.md).
- **Rule:** narrative + plan-state, never numbers (those live in the DB); written at every natural break; one Brief per lot.
- Lots populate event-driven, starting with the first dogfood lot (the Lot Coordinator build is trigger-gated on a fresh green). This directory is empty until then.
