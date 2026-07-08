# Glossary — writing-great-skills

<!-- Vendored from mattpocock/skills (productivity/writing-great-skills). The full definitions
     tier for the bold terms in SKILL.md. -->

## Language

**Predictability**
The degree to which a skill makes the agent behave the same _way_ on every run — the same process, not the same output. The foundational virtue every other term serves.

**Model-Invoked**
A skill that keeps its `description`, so the agent can discover and fire it autonomously and other skills can reach it. Pays permanent **context load** in exchange for autonomous reach.

**User-Invoked**
A skill stripped of its description (`disable-model-invocation: true`) — invisible to the agent, reachable only when a human types its name; no other skill can invoke it. Pays no context load.

**Description**
The skill's machine-readable trigger, and the one **context pointer** a **model-invoked** skill is forced to keep loaded at all times. The axis that determines invocation mode.

**Context Pointer**
A reference held in the agent's context that names some out-of-context material and encodes the condition for reaching it. Its _wording_ — not its target — decides when and how reliably the agent reaches the material.

**Context Load**
The cost a **model-invoked** skill imposes on the agent's context window through its always-loaded description — both tokens and attention.

**Cognitive Load**
The burden on the _human_ of remembering which **user-invoked** skills exist and when to use them. The price paid for keeping a skill out of the agent's context.

**Granularity**
How finely you divide skills. Each cut spends one of the two loads (context or cognitive), so split only when the cut earns it.

**Router Skill**
A **user-invoked** skill whose job is to point at your other user-invoked skills — naming each and when to reach for it. The cure for piled-up **cognitive load**.

**Information Hierarchy**
A skill's content ranked by how immediately the agent needs it: in-skill **steps** (primary) → in-skill **reference** (secondary) → disclosed / **external reference** behind a **context pointer**.

**Co-location**
Keeping the material an agent needs at once in one place — a concept's definition, rules, and caveats under one heading rather than scattered — so reading one part brings its neighbours with it.

**Branch**
A distinct way a skill can be invoked — a case it handles — so different runs take different paths through it. The cleanest test for what to disclose: inline what every branch needs, push behind a pointer what only some reach.

**Progressive Disclosure**
Moving **reference** down the ladder — out of `SKILL.md` and behind a **context pointer** — so the top stays legible while the information hierarchy is preserved.

**Steps**
The ordered actions the agent performs — when a skill has them, the primary tier of its content. Not required in every skill. Each ends on a **completion criterion**.

**Completion Criterion**
The condition that tells the agent a unit of work is done — the target it judges against. Clarity resists **premature completion**; its demand sets how much **legwork** is required.

**Post-Completion Steps**
The **steps** that follow the current one. Their visibility creates a forward pull that triggers **premature completion** unless hidden by a sequence split.

**Legwork**
The work an agent does behind the scenes within a single step. Controlled through **leading words** and completion-criterion demand — never written out as separate steps.

**Reference**
Material the agent refers to on demand — definitions, facts, parameters, examples, conditional instructions. Secondary when steps exist; the entire content when they don't.

**External Reference**
**Reference** that lives outside the skill system — a plain file, no description, no steps, not invocable. The shared home for non-autonomous reference any skill can point at.

**Leading Word**
A compact concept (a _Leitwort_) already living in the model's pretraining that the agent thinks _with_ while running the skill. Carried as a token, not a sentence; it anchors both execution and invocation.

**Single Source of Truth**
The desired state where each meaning lives in exactly one authoritative place, so changing the skill's behaviour is a one-place edit.

**Relevance**
Whether a line still bears on what the skill does — the lens for what to keep. Lost through irrelevance or staleness; distinct from a **no-op**.

## Failure modes

**Premature Completion**
Ending the current step before it is genuinely done, because attention slips to _being done_ rather than to the work. Defend by sharpening the **completion criterion** first; only then, if it is irreducibly fuzzy and you observe the rush, hide the **post-completion steps** by splitting.

**Duplication**
The same meaning given more than one **single source of truth**. Costs maintenance and tokens, and inflates a meaning's prominence on the ladder past its real rank. Distinct from the intentional repetition of a **leading word**.

**Sediment**
Stale layers of old content that settle in a skill and are never cleared — the default fate of any skill without a pruning discipline.

**Sprawl**
A skill simply too long — too many lines in `SKILL.md` — independent of whether they are stale or repeated. Cured by the information hierarchy: disclose **reference** behind pointers and split by **branch** or sequence.

**No-Op**
An instruction that changes nothing because the model already does it by default — you pay load to say nothing. The test: does it alter behaviour versus the default? A weak **leading word** is a no-op; the fix is a stronger word, not a different technique.

**Negation**
Steering by prohibition — telling the agent what _not_ to do — which drags the forbidden behaviour into context and makes it _more_ available, not less. "Don't think of an elephant, and the elephant is all there is." The negation is a weak modifier the strongly-activated concept overruns, so the ban half-reads as an instruction to do the thing. Its leading word is the _elephant_: whatever a prohibition names into the frame. Cure: prompt the positive — describe the target behaviour ("write one-line comments") so the banned one is never spoken. A prohibition earns its place only as a hard guardrail on a behaviour you cannot phrase positively; even then, pair it with the positive target so attention lands on what to do.

**Negative Space**
Blindness to the steering done by what you leave _out_. A skill's silences are not neutral: every decision it declines to make is delegated to the agent's priors, which fill the gap their own way on every run — the opposite of **predictability**. Its leading word is the _void_: the unwritten decisions the agent must fill. Distinct from **Negation** — that is steering by what you say; this is steering by what you don't. Cure: read a draft for its silences and decide each omission deliberately — fill it with the behaviour you want, or leave it open on purpose as a real **branch** the agent is free to choose.
