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
| **IR7** | **Comments don't shrink the body; per-turn vs per-invocation load.** For a model-invoked skill only the `description` loads every turn; the body (HTML comments included) loads on invocation. A `<!-- -->` block is still file text the agent reads on load, so relocating provenance into a comment is a *legibility* move (marks "not an instruction"), not a size one. To actually shrink a body you **delete** (provenance home = git history + [shipped.md](docs/sprints/shipped.md), per the policy below) or push to an external file (progressive disclosure). | The bootstrap *application* - line counts went UP (brew 210->212) when v0's IR2 said comment-to-save-load; falsified on execution |
| **IR8** | **The line-budget delta is the sum of the cut-list only - never a wishful total.** Do not project a number that implicitly cuts the considered-and-kept. A skill that is mostly load-bearing steps barely shrinks, and that is correct. | The bootstrap application - brew's honest floor was 199, not the ~150 run 01 over-projected by counting kept mass (the gate, the arc, the running-state block) as cuttable |

## Decisions

- **IR6 resolution (2026-06-30): no shared-snippet doc.** For ~2-line operator-direct blockquotes, a shared doc behind a `read_doc` pointer adds a hot-path fetch + indirection that costs more than the drift risk on short, stable text. The COLLAPSE cuts shrank the triad's bulk directly (Out-of-scope and MCP-only dropped to one-liners / deletions); the Operator-direct blockquote stays inline and identically worded across the three so drift is visible. The N=3 "extract on the third copy" dial is overridden here by the indirection-cost judgment (the architecture-review considered-and-kept discipline).
- **Provenance policy (2026-06-30): delete, keep skills lean.** Pure historical provenance (PR#, dates, incident narratives) is deleted from skill bodies, not inline-commented. git history + [shipped.md](docs/sprints/shipped.md) are its home. Chris's call; diverges from Latent's cite-inline doc culture deliberately, because a skill body is loaded into a working session and every token competes with the task.

## Deferred ledger (suggestions without a lived finding yet - hold until N=3)

- A numeric no-op-density score per skill (no-op lines / total). Tempting, but no run yet showed the bare line-budget delta was insufficient. Hold.
- Auto-detecting weak leading words. Needs a lived miss before it earns a rule.

## Applied 2026-06-30 + convergence check

01-03's cut-lists were applied (descriptions trimmed, restated sections deleted, provenance deleted per the policy above): **brew 210 -> 199, green-inventory 81 -> 72, freezer-stock 95 -> 84** (-31 total); considered-and-kept items untouched; `check:doc-links` 0 live misses. A second `improve-skill` pass over the cut versions converges - no fresh CUT-class findings, only the IR7/IR8 corrections already folded above. The rubric is hardened enough for use beyond the bootstrap trio.
