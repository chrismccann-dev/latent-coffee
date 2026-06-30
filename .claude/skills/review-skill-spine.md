# Review-skill spine

The shared doctrine of Latent's read-only review skills: [architecture-review](.claude/skills/architecture-review/SKILL.md) (code structure), [design-review](.claude/skills/design-review/SKILL.md) (visual/UX), [improve-skill](.claude/skills/improve-skill/SKILL.md) (skill prose). Each skill **follows this spine** and adds only its domain-specific rules (arch-review's R1-R13, design-review's D1-D8, improve-skill's IR-rules). The spine is the genus; each skill is the species. Single source of truth: change the doctrine here and all three inherit it (extracted 2026-06-30, [improvement-log IR11](docs/audits/skills/improvement-log.md)).

These skills are **operator-invoked** (a human triggers them, never a cron or feature-ship hook) and **user-invoked** (`disable-model-invocation: true`, zero context load until you type the name). Judgment-heavy by design: the keep/cut calls can't be automated.

## The five invariants

1. **READ-ONLY. Stop at the report. Never edit.** The skill audits and recommends; the actual change is a separate, later, operator-approved session. The push is in the recommendation, not the keyboard.
2. **Re-measure the seed first.** The brief, the prior counts, the "looks off" hunch are *hypotheses, not findings* - wrong in nearly every lived run. Measure live before trusting any seed claim.
3. **A considered-and-kept / -rejected / -left-alone section is mandatory.** On a mature surface the leave-alone calls are half the value - they stop a later session from "fixing" something deliberate. Kill the bad ideas explicitly.
4. **Open with a decisive lead recommendation.** "Do this first: ..." as a stance, not a neutral menu. For what survives the gates, take a side and state the cost of inaction. Decisiveness lives *between* the guardrails - the considered-and-kept still kills the bad ideas.
5. **Compose sibling skills, don't restate them.** Reuse `/simplify`, `/grill-with-docs`, `design:design-critique`, `writing-great-skills`; this family scopes and hands off, it does not duplicate their loops.

## What stays in each skill

Everything domain-specific: the mechanical detection (gates / preview / the rubric), the smell taxonomy, the scoring, the card format, the worked-example corpus, the verification net. The spine is only the shared *character*; the skill is where the actual audit lives. Keep each skill legible standalone - a pointer here replaces a restatement of the doctrine, never the domain rules.
