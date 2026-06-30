# improve-skill improvement log

Instance 2 of the self-improving skill loop ([ADR-0023](docs/adr/0023-self-improving-skill-loop.md)). Each rule cites the run that forced it. New rules need a lived finding, not a guess (anti-lawyer-redline: make the skill better, not bigger). Sibling of [docs/audits/architecture/improvement-log.md](docs/audits/architecture/improvement-log.md).

## Bootstrap session 2026-06-30 - v0 authored, then hardened by runs 01-03

`improve-skill` v0 was authored from the [writing-great-skills](.claude/skills/writing-great-skills/SKILL.md) rubric, then immediately run on its three siblings. The runs were the derivation (the `architecture-review` pattern - rules are friction-log corrections, not theory).

| Rule | What it says | Forced by |
|---|---|---|
| **IR1** | The skill's own self-description ("just the reliable way in", "minimal") is a *claim, not a finding*. Measure the real line count first; the skill that calls itself minimal often carries the most sediment. | [01-brew](docs/audits/skills/01-brew.md) - brew calls itself a thin spine, runs 210 lines |
| **IR2** | Provenance (dates, PR#, incident attributions, ADR refs) inline in prose = context load every turn for a fact the agent never acts on. Move to an HTML comment. Dogfooded in this skill's own header. | [01-brew](docs/audits/skills/01-brew.md) - `PR #450`, `FanHua / Syrina friction`, `2026-06-09/10` |
| **IR3** | A `description` earns harder pruning than the body: one trigger per branch + a reach clause; cut identity ("how it composes", "NOT a restructure") already in the body. Keep genuine *negative* triggers (the "NOT x" that stops a wrong fire). | [01-brew](docs/audits/skills/01-brew.md), [02-green-inventory](docs/audits/skills/02-green-inventory.md) |
| **IR4** | **Mandatory considered-and-kept.** A fixed output template, a flat rule-set, a load-bearing gate, a strong leading word read as "bloat" to a naive prune and are exactly what a careless cut wrecks. Half the value is the leave-alone. | [03-freezer-stock](docs/audits/skills/03-freezer-stock.md) - the entry-shape template is a contract `brew` matches on |
| **IR5** | **Maintainer-vs-agent test.** For each section ask: does this steer the agent at runtime, or is it rationale for a human reading the file? Maintainer rationale -> comment or external pointer. This is the highest-yield cut on already-tight skills. | [02-green-inventory](docs/audits/skills/02-green-inventory.md), [03-freezer-stock](docs/audits/skills/03-freezer-stock.md) - "Write path" / "asymmetry" sections |
| **IR6** | **Cross-skill consistency (family runs only).** Boilerplate restated near-verbatim across N sibling skills is duplication at the family level even when single-source within each file. Name the shared-snippet candidate; defer the build. | [03-freezer-stock](docs/audits/skills/03-freezer-stock.md) run beside 01 + 02 - the operator-direct / out-of-scope / MCP-only triad |

## Deferred ledger (suggestions without a lived finding yet - hold until N=3)

- A numeric no-op-density score per skill (no-op lines / total). Tempting, but no run yet showed the bare line-budget delta was insufficient. Hold.
- Auto-detecting weak leading words. Needs a lived miss before it earns a rule.

## Open meta-question for after the gated cuts land

Once 01-03's cuts are applied, re-run `improve-skill` on the cut versions to confirm the rubric converges (a second pass should find near-nothing). If it finds a fresh class, that is IR7.
