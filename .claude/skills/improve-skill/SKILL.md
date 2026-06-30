---
name: improve-skill
description: Read-only audit of ONE skill against the writing-great-skills rubric, then a report. User-invoked only (type "improve-skill <skill-name>"); zero context load. Runs the four-axis pass (trigger / structure / steering / pruning), tags each finding to a glossary failure mode, runs the no-op + deletion tests sentence-by-sentence, and emits a decisive cut-list + a mandatory considered-and-kept + a line-budget delta. Stops at the report; never edits the target skill.
disable-model-invocation: true
---

<!--
  Bootstrapped 2026-06-30 by running it on its own three siblings: brew (rich),
  green-inventory (multi-operation), freezer-stock (short). Worked records:
  docs/audits/skills/01-brew.md / 02-green-inventory.md / 03-freezer-stock.md.
  Every IR-rule below cites the run that forced it (the architecture-review
  derivation pattern, ADR-0023). Provenance / dates / PR# live in comments like
  this one ON PURPOSE - that is IR2, dogfooded. All links here are root-relative
  (ADR-0021), so unlike writing-great-skills this folder needs no link skip-list.
-->

<what-this-is>

`improve-skill <skill-name>` runs one read-only audit of a single skill's `SKILL.md` against the [`writing-great-skills`](.claude/skills/writing-great-skills/SKILL.md) rubric and produces a cut-ready report. It is the **skill-substrate sibling** of [`architecture-review`](.claude/skills/architecture-review/SKILL.md) (code) and [`design-review`](.claude/skills/design-review/SKILL.md) (visual): operator-invoked, judgment-heavy, report-then-stop. It operationalizes the **manual post-tripwire pruning exercise** (Pattern J, [ADR-0013 amendment](docs/adr/0013-self-improvement-primitives.md)) for the skill-doc surface specifically - `check:doc-sizes` says *when*, `writing-great-skills` says *what to cut*, this skill is the *procedure* that was missing between them.

**Compose, do not restate.** The rubric and its vocabulary live in [`writing-great-skills`](.claude/skills/writing-great-skills/SKILL.md) + its [`GLOSSARY.md`](.claude/skills/writing-great-skills/GLOSSARY.md). Read both at Step 0; this skill never re-states predictability / leading words / no-op / sediment - it *applies* them. If the rubric and this skill disagree, the rubric wins.

**The two guardrails that define the skill's character (borrowed verbatim from `architecture-review`):**
- **It kills bad cut ideas.** A `Considered-and-kept` section is mandatory (IR4). A fixed output template, a flat rule-set, a load-bearing gate, a strong leading word - these read as "bloat" to a naive prune and are exactly what a careless cut wrecks. Half the value is the leave-alone.
- **It pushes the real ones.** The report is not a neutral menu. It opens with a decisive lead recommendation and a concrete **line-budget delta** (current -> projected), and states the cost of leaving each no-op in place (context load every turn). But it **never edits the target skill** (the cut is a separate, gated pass).

</what-this-is>

<the-process>

## Step 0 - Load the rubric, then the target (read-only)

Read [`writing-great-skills/SKILL.md`](.claude/skills/writing-great-skills/SKILL.md) + [`GLOSSARY.md`](.claude/skills/writing-great-skills/GLOSSARY.md) for the lens, then the target `SKILL.md` end to end. The skill's own description / self-description ("this file is just the reliable way in") is a **claim, not a finding** (IR1) - a skill that calls itself minimal is often the one carrying the most sediment. Measure the real line count; it is the baseline for the budget delta.

## Step 1 - The four-axis pass

Walk the four axes in order. For each finding, name the **glossary failure mode** it instances (no-op / sediment / sprawl / duplication / premature-completion) so the cut is justified by the rubric, not taste.

1. **Trigger (invocation + description).** Is the invocation choice right - model-invoked (pays context load every turn) only when the agent or another skill must reach it on its own, else user-invoked (`disable-model-invocation: true`, zero context load)? Then audit the `description`: keep **one trigger per branch** + an optional reach clause; **cut identity already in the body** (the "what this is / how it composes / NOT a restructure" framing is a per-turn no-op at the description level - IR3).

2. **Structure (information hierarchy + branches).** Map the skill into **steps** vs **reference**. For each section ask the **maintainer-vs-agent test (IR5):** does this steer the agent at *runtime*, or is it rationale for a human reading the file? Runtime-steering stays; maintainer rationale moves to an HTML comment or an external pointer. Then the **branch test:** inline what every branch needs; push single-branch material behind a context pointer. Composition already done well (`read_doc_section` instead of restating a cluster doc) is a **keep**, not a target.

3. **Steering (leading words + completion criteria).** Find the leading words and confirm they earn their keep (a word that recruits real priors - `apex`, `tracer bullets`). Flag weak ones (`be thorough` when the agent already is) as no-ops to *strengthen*, not delete. Check each step's **completion criterion** is checkable; a fuzzy one invites premature completion.

4. **Pruning (the sentence-level passes).** Two tests, every section:
   - **No-op test, sentence by sentence:** would deleting this sentence change behavior vs the model's default? If no, cut the whole sentence (do not trim words from it).
   - **Provenance-delete (IR2, as corrected by IR7):** dates, PR#, friction-incident attributions, ADR provenance inline in prose are read on every load and the agent never acts on them. **Delete them** - git history + [`docs/sprints/shipped.md`](docs/sprints/shipped.md) are their home (the project policy, set 2026-06-30). Do *not* inline-comment them as a "fix": a `<!-- -->` block is still file text the agent reads at invocation, so commenting is a *legibility* move (it marks "not an instruction"), never a size one. **Per-turn vs per-invocation (IR7):** for a model-invoked skill only the `description` loads every turn; the body loads on invocation. The always-loaded saving is the description trim - body cuts only pay back when the skill is invoked.

## Step 2 - Cross-skill consistency (only when auditing a family member)

The operator-direct skills (`brew`, `green-inventory`, `freezer-stock`, ...) share boilerplate triads: an **Operator-direct** blockquote, an **Out of scope** section, a **MCP-only / write-path** section. Run the **shared-snippet check (IR6):** the same paragraph restated across N siblings is `duplication` at the family level even when it is single-source within each file. Flag it as a candidate for one shared pointer - but **do not** invent the shared file in this report; name the pattern and defer the build (this report stops at findings).

## Step 3 - The report (then STOP)

Open with the **decisive lead recommendation** ("Do this now: ...") and the **line-budget delta** (`<current> -> ~<projected> lines`). The projected number is the **sum of the cut-list savings only (IR8)** - never a wishful total that implicitly cuts the considered-and-kept. A skill that is mostly load-bearing steps barely shrinks, and that is the correct result (brew's honest floor was 199, not the ~150 the first pass over-projected by counting kept mass as cuttable). Then:

```
### Cut N: <section / sentence>   [CUT | RELOCATE | STRENGTHEN | COLLAPSE]
- Where: <line range / heading>
- Failure mode: <no-op | sediment | sprawl | duplication | premature-completion>
- Why: <the test it fails - deletion test result, default-obeyed, identity-in-description>
- Move to: <delete | HTML comment | external pointer | shared snippet>   (RELOCATE/COLLAPSE only)
- Saves: <approx lines / what stops being paid every turn>
```

Then the **mandatory `Considered-and-kept` (IR4):** each entry names the section a naive prune would flag, and why it stays (legitimate flat reference, fixed output template, load-bearing gate, strong leading word, composition-done-right). Then **open questions** for the operator before any edit lands.

</the-process>

<stop-condition>

The audit **stops at the report. Never edit the target skill.** The cut is a separate, operator-approved pass. After sign-off, apply the report's cuts, then run `check:doc-sizes` + `check:doc-links` to confirm no tripwire or link regressed. A skill whose cut changes substrate (a renamed trigger other docs reference, a removed gate) carries a six-actor follow-up; say so in open questions.

</stop-condition>

<worked-example-corpus>

The three bootstrap runs are the worked examples - read the closest one when auditing a similar skill:

- [docs/audits/skills/01-brew.md](docs/audits/skills/01-brew.md) - **rich workflow skill, provenance-heavy.** Source of IR2 (provenance-delete) and IR3 (description identity is a no-op). Applied: 210 -> 199 (the floor: its bulk is load-bearing and kept).
- [docs/audits/skills/02-green-inventory.md](docs/audits/skills/02-green-inventory.md) - **multi-operation skill.** Source of IR5 (maintainer-vs-agent test) - "MCP-only write path" and "Out of scope" were mostly maintainer rationale. Applied: 81 -> 72.
- [docs/audits/skills/03-freezer-stock.md](docs/audits/skills/03-freezer-stock.md) - **short skill with a fixed entry template.** Source of IR4 (the template is legitimate reference - the mandatory leave-alone) and, run alongside 01/02, IR6 (the operator-direct boilerplate triad is family-level duplication). Applied: 95 -> 84.
- The bootstrap *application* (2026-06-30) forced IR7 (comments don't shrink the body; per-turn vs per-invocation load) and IR8 (the budget delta excludes kept mass) - the cuts' premise (relocate-to-comment shrinks the file) was false on execution. The recursion catching its own author's wrong assumption is the loop working.

The improvement log ([docs/audits/skills/improvement-log.md](docs/audits/skills/improvement-log.md)) records every IR-rule with the run that forced it; new rules need a lived finding (anti-lawyer-redline: make the skill better, not bigger).

</worked-example-corpus>

<relationship-to-the-rest>

- **Composes [`writing-great-skills`](.claude/skills/writing-great-skills/SKILL.md)** (the rubric/vocabulary) - the reference layer; this skill is the steps layer over it. Same compose-don't-restate move `brew` makes over its operational guide.
- **Boundary vs [`architecture-review`](.claude/skills/architecture-review/SKILL.md):** that skill audits code structure + doc-substrate *navigability* (links, sizes, staleness) across the repo. This one audits a *single skill's predictability* against the writing-great-skills rubric (leading words, no-ops, description triggers, premature completion). Different lens; route a structural smell there, a skill-prose smell here.
- **Instance 2 of the self-improving skill loop** ([ADR-0023](docs/adr/0023-self-improving-skill-loop.md)): each run re-reads the worked corpus and may amend this skill; every amendment cites the run that motivated it.
- **No CI gate.** `check:doc-sizes` fires the *when* (a skill over cap); the prune itself is interpretive and operator-led (Pattern J). User-invoked only - it never auto-fires and pays no context load.

</relationship-to-the-rest>
