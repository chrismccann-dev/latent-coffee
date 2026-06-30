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

`improve-skill <skill-name>` runs one read-only audit of a single skill's `SKILL.md` against the [`writing-great-skills`](.claude/skills/writing-great-skills/SKILL.md) rubric and produces a cut-ready report. It is the **skill-substrate sibling** of [`architecture-review`](.claude/skills/architecture-review/SKILL.md) (code) and [`design-review`](.claude/skills/design-review/SKILL.md) (visual), and **follows the [review-skill spine](.claude/skills/review-skill-spine.md)** (READ-ONLY stop-at-report · re-measure the seed · mandatory considered-and-kept · decisive lead · compose-don't-duplicate); the IR-rules below are its **skill-prose specialization**. It operationalizes the **manual post-tripwire pruning exercise** (Pattern J, [ADR-0013 amendment](docs/adr/0013-self-improvement-primitives.md)) for the skill-doc surface - `check:doc-sizes` says *when*, `writing-great-skills` says *what to cut*, this skill is the *procedure* that was missing between them.

**Compose, do not restate.** The rubric and its vocabulary live in [`writing-great-skills`](.claude/skills/writing-great-skills/SKILL.md) + its [`GLOSSARY.md`](.claude/skills/writing-great-skills/GLOSSARY.md). Read both at Step 0; this skill never re-states predictability / leading words / no-op / sediment - it *applies* them. If the rubric and this skill disagree, the rubric wins.

Two spine invariants take a sharp form here:
- **Considered-and-kept (IR4) - it kills bad cut ideas.** A fixed output template, a flat rule-set, a load-bearing gate, a strong leading word read as "bloat" to a naive prune and are exactly what a careless cut wrecks. Half the value is the leave-alone.
- **Decisive lead + line-budget delta - it pushes the real ones.** Opens with a stance and a concrete `current -> projected` line delta (the sum of the cut-list only, IR8), states the cost of each no-op, never edits the target skill.

</what-this-is>

<the-process>

## Step 0 - Load the rubric, then the target (read-only)

Read [`writing-great-skills/SKILL.md`](.claude/skills/writing-great-skills/SKILL.md) + [`GLOSSARY.md`](.claude/skills/writing-great-skills/GLOSSARY.md) for the lens, then the target `SKILL.md` end to end. The skill's own description / self-description ("this file is just the reliable way in") is a **claim, not a finding** (IR1) - a skill that calls itself minimal is often the one carrying the most sediment. Measure the real line count; it is the baseline for the budget delta.

## Step 1 - The four-axis pass

Walk the four axes in order. For each finding, name the **glossary failure mode** it instances (no-op / sediment / sprawl / duplication / premature-completion) so the cut is justified by the rubric, not taste.

1. **Trigger (invocation + description).** Is the invocation choice right - model-invoked (pays context load every turn) only when the agent or another skill must reach it on its own, else user-invoked (`disable-model-invocation: true`, zero context load)? **Watch the operator-invoked trap (IR9):** "operator-invoked" in Latent's docs means *human-triggered, not cron* - it is **orthogonal** to `disable-model-invocation`. A skill can be operator-invoked AND model-invoked (firing from natural language, like `brew` on "brew a coffee"). Don't flag model-invocation as wrong just because the body says "operator-invoked"; ask whether **natural-language triggering is actually used**, or the operator always types the exact command (then disable it and strip the description, as the review-family did 2026-06-30). Then audit the `description`: keep **one trigger per branch** + an optional reach clause; **cut identity already in the body** (IR3).

2. **Structure (information hierarchy + branches).** Map the skill into **steps** vs **reference**. For each section ask the **maintainer-vs-agent test (IR5):** does this steer the agent at *runtime*, or is it rationale for a human reading the file? Runtime-steering stays; maintainer rationale moves to an HTML comment or an external pointer. Then the **branch test:** inline what every branch needs; push single-branch material behind a context pointer. Composition already done well (`read_doc_section` instead of restating a cluster doc) is a **keep**, not a target.

3. **Steering (leading words + completion criteria).** Find the leading words and confirm they earn their keep (a word that recruits real priors - `apex`, `tracer bullets`). Flag weak ones (`be thorough` when the agent already is) as no-ops to *strengthen*, not delete. Check each step's **completion criterion** is checkable; a fuzzy one invites premature completion.

4. **Pruning (the sentence-level passes).** Two tests, every section:
   - **No-op test, sentence by sentence:** would deleting this sentence change behavior vs the model's default? If no, cut the whole sentence (do not trim words from it).
   - **Provenance-delete (IR2, as corrected by IR7):** dates, PR#, friction-incident attributions, ADR provenance inline in prose are read on every load and the agent never acts on them. **Delete them** - git history + [`docs/sprints/shipped.md`](docs/sprints/shipped.md) are their home (the project policy, set 2026-06-30). Do *not* inline-comment them as a "fix": a `<!-- -->` block is still file text the agent reads at invocation, so commenting is a *legibility* move (it marks "not an instruction"), never a size one. **Per-turn vs per-invocation (IR7):** for a model-invoked skill only the `description` loads every turn; the body loads on invocation. The always-loaded saving is the description trim - body cuts only pay back when the skill is invoked. **Decorative vs evidence (IR10):** the delete rule is for *decorative* provenance (a bare date / PR# the agent never uses). A citation that is a rule's **evidence/warrant**, or a **calibration example that IS the lesson** (arch-review's "Session 03: docs.ts 1342 -> refactor, brew-import.ts 1459 -> keep"), is load-bearing reference - keep it. Distinguish before cutting.

## Step 2 - Cross-skill consistency (only when auditing a family member)

The operator-direct skills (`brew`, `green-inventory`, `freezer-stock`, ...) share boilerplate triads; the review skills (`architecture-review`, `design-review`, `improve-skill`) share a doctrine spine. Run the **shared-snippet check (IR6):** the same paragraph restated across N siblings is `duplication` at the family level even when it is single-source within each file. **The extraction decision is `shared-mass x N`, not N alone (IR11):** a 2-line blockquote repeated 3x does not earn a shared file (indirection costs more than the drift - run 03 left it inline); a 15-20 line spine repeated 3x does (runs 04-06 -> [review-skill-spine.md](.claude/skills/review-skill-spine.md)). Weigh both dials, name the candidate, and **defer the build** (this report stops at findings).

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
- [docs/audits/skills/04-architecture-review.md](docs/audits/skills/04-architecture-review.md) + [05-design-review.md](docs/audits/skills/05-design-review.md) - **heavy mature skills.** Source of IR9 (operator-invoked is orthogonal to user-invoked) and IR10 (evidence-citation is not decorative provenance). Both barely shrink (189->~183, 134->~129) - the IR8 lesson lived: a skill that is mostly lived rules is mostly considered-and-kept.
- [docs/audits/skills/06-review-family-cross-skill.md](docs/audits/skills/06-review-family-cross-skill.md) - **the review-family spine.** Source of IR11; led to extracting [review-skill-spine.md](.claude/skills/review-skill-spine.md) (Chris's call, 2026-06-30) - the doctrine these three skills now inherit instead of restating.
- [docs/audits/skills/07-route-feedback.md](docs/audits/skills/07-route-feedback.md) + [08-plan-feedback.md](docs/audits/skills/08-plan-feedback.md) + [09-feedback-pair-cross-skill.md](docs/audits/skills/09-feedback-pair-cross-skill.md) - **the model-invoked feedback pipeline pair.** No new rule - **confirmations:** IR9 keep-direction (model-invocation is correct when natural-language IS the entry; never disable it here) + IR11 leave-direction (the cross-skill check correctly declines to extract at N=2 / small mass). After 9 runs across three families (operator-direct, review, feedback-pipeline), IR1-IR11 cover what shows up - the rubric has converged.

The improvement log ([docs/audits/skills/improvement-log.md](docs/audits/skills/improvement-log.md)) records every IR-rule with the run that forced it; new rules need a lived finding (anti-lawyer-redline: make the skill better, not bigger).

</worked-example-corpus>

<relationship-to-the-rest>

- **Composes [`writing-great-skills`](.claude/skills/writing-great-skills/SKILL.md)** (the rubric/vocabulary) - the reference layer; this skill is the steps layer over it. Same compose-don't-restate move `brew` makes over its operational guide.
- **Boundary vs [`architecture-review`](.claude/skills/architecture-review/SKILL.md):** that skill audits code structure + doc-substrate *navigability* (links, sizes, staleness) across the repo. This one audits a *single skill's predictability* against the writing-great-skills rubric (leading words, no-ops, description triggers, premature completion). Different lens; route a structural smell there, a skill-prose smell here.
- **Instance 2 of the self-improving skill loop** ([ADR-0023](docs/adr/0023-self-improving-skill-loop.md)): each run re-reads the worked corpus and may amend this skill; every amendment cites the run that motivated it.
- **No CI gate.** `check:doc-sizes` fires the *when* (a skill over cap); the prune itself is interpretive and operator-led (Pattern J). User-invoked only - it never auto-fires and pays no context load.

</relationship-to-the-rest>
