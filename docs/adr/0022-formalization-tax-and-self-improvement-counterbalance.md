# ADR-0022: The formalization tax + the self-improvement counterbalance

**Date:** 2026-06-05 · **Status:** Accepted

This is the **why** behind the anti-bloat half of [ADR-0013](docs/adr/0013-self-improvement-primitives.md) (which is the *what* — the 10 self-improvement patterns + Pattern J). Named in the post-Cluster-B grilling session (2026-06-05), generalizing the lessons of the doc-pruning arc + the architecture-review build into one governing principle.

## Decision

Latent's self-improvement is governed by a single principle — **the formalization tax** — implemented by **two counter-oriented mechanisms**: a **graduation threshold** that *delays* formalization until it has earned its place, and an **arbiter-shaped clawback** that *strips out* formalization that stopped earning it. Every system-level skill, prompt, doc, and registry inherits this principle.

## The principle: formalization tax

Every formalization — a rule, a doc section, a registry row, a skill instruction, a law — carries a **standing cost**: it is loaded into context every time its surface is served (and on the claude.ai surface, context is the binding constraint). It also carries **risk**: a formalization minted from a single observation may be a fluke, or may have second-order effects the one example never revealed. So the rule is: **formalize as late as you defensibly can.** A rule is good only once it *deserves* to be there — once enough lived edge cases have been seen that the rule is shaped right, not clean-but-wrong.

Chris's framing (2026-06-05): like designing products, bureaucracy, or law — "the more you put things into rules and laws and code and system, the more bloat and friction you introduce for everything else. Rules and systems are good, but you want to make sure they deserve to be there, because every one you introduce instills a tax on the system." A downside of unmanaged rule-making (his democracy analogy): "there's nothing looking back at these rules and stripping them out or editing them through lived examples."

## Mechanism 1 — Graduation threshold (N=3): the delay

An observation may be **acted on** at N=1, but may not graduate into a **reusable abstraction** (a rule / a CONTEXT term / a canonical registry entry / a main-doc or main-skill section) until it has recurred **three times**. "Once is a fluke, two is a pattern forming, three is graduate it." The value of waiting for the third is not just confidence — three sightings reveal the rule **plus its edge cases and the messiness of real life**, so the formalization is shaped correctly and doesn't spawn an unconsidered second-order effect (which would be more tax).

N=3 is the **universal dial** across every surface that was previously running its own number: case-study generalization (the doc-pruning arc), CCIL capsule graduation (n≥3), canonical-registry promotion, the grilling-queue accumulate-then-grill, skeleton / observing lists. Three parameters vary by surface; the threshold does not: **(a) trigger unit** (what you count), **(b) graduation target** (where it lands), **(c)** the threshold is always 3.

**Two-tier — N=1 is for *acting*, not *abstracting*.** You may act on a single sighting when **waiting makes it worse**: (1) an obvious bug (fix now or it gets lost / never re-logged); (2) an **edge case around an *existing* rule** (the rule already exists; you are handling a case of it, not minting a new rule); (3) a **structural doc fix** — missing headings / no index / not section-readable — because the longer you wait the more accumulates and the harder the refactor gets (and section-readability is a direct formalization-tax win: `read_doc_section` against an anchor beats loading the whole doc). What is *gated* on N=3 is only the **birth of a new reusable abstraction**.

**Graduation is provisional, not terminal.** A graduated rule is itself a formalization, so it is taxed too. Keep collecting examples 4, 5, 6+; if the later evidence diverges, the rule is subject to **edit / prune / delete**. Nothing is promoted-and-forgotten — the clawback mechanism (below) applies to rules, not just docs.

**The human-facing generative twin of this gate is concrete-example-first.** The graduation threshold is the *gate on the substrate* (when an abstraction may promote); **concrete-example-first** is the *generative reasoning method* Chris runs to feed it (walk and actually build/run ≥3 whole lived instances, then generalize up from what actually happened, not from a guessed general). Feeder → gate; both share the N=3 dial. Definition + `_Avoid_` line live as a headword in [docs/reference/mcp-architecture.md](docs/reference/mcp-architecture.md) (no standalone ADR — it is vocabulary, not a hard-to-reverse decision); see also its interrelated sibling **prototype-as-input-not-canon** (the debate method below).

## Mechanism 2 — Arbiter-shaped clawback: the cleanup (prescriptive template)

The clawback half (pruning / deleting / refactoring / archiving) reclaims the bloat that accretes as the system formalizes. **Every clawback mechanism MUST be built to one prescribed shape** — because a clawback mechanism that *auto-acts* is itself a heavy formalization (an autonomous agent editing substrate is a big standing rule with big second-order risk). The mechanism keeps its own footprint cheap by splitting into:

1. **A cheap mechanical trigger** — a deterministic gate that costs ~nothing and only *surfaces* candidates (`check:doc-sizes`, `check:hotspots`, recurrence counts, a tripwire firing).
2. **Multi-perspective arbitration** — the actual prune/refactor judgment, debated between actors from different principles (see the debate method below). **Not** an operator-as-higher-power gate on a machine — the *combination* of perspectives produces the result.
3. **Stops-at-report** — the mechanism never auto-commits the irreversible part; it surfaces and hands over packets. The not-auto-committing is itself a trigger-for-judgment.

This shape is not new with Cluster B — **ARBITER**, the skeleton review, and the observing-list walk were already this shape; **doc-pruning** ([ADR-0013](docs/adr/0013-self-improvement-primitives.md) Pattern J) and **architecture-review** made it explicit twice. Hence "arbiter-shaped." Build the next clawback mechanism the same way; do not reach for an auto-acting agent.

**Autonomy split.** The gate is on **intent, not execution**. Principal direction + intent + canonical language are agreed between actors; then execution autonomy *scales with how technical-vs-subjective the work is* — high autonomy on technical/system/code/doc-parsing work, more human judgment on subjective coffee-domain calls. Narrow, low-risk *mechanical* classes (provenance shrapnel, dead anchors, over-cap detection) may graduate up the [ADR-0013](docs/adr/0013-self-improvement-primitives.md) autonomy ladder to autonomous; the *abstraction-level* judgment (what to prune, how to re-home) stays multi-perspective by design. A subagent debate-panel (replacing operator+Claude Code with multiple agents) is a **parked future option**, tax-gated — not worth its footprint while two actors suffice.

## The debate method: prototype-as-input-not-canon

The multi-perspective arbitration runs through a specific, recurring practice: when Chris hands over a prototype (a refactored doc, a design system, a CCIL reorganization), the instruction is explicitly **"this is my interpretation — do not copy it; treat Latent as the source of truth, apply your own judgment, and pull what's useful from the prototype into what we already have."** The prototype is an *input*, never *canon*. The result is produced by the operator's prototype + Claude Code's independent judgment + the lived examples/data, all argued against the existing system as the canonical baseline. (Clears its own graduation threshold — done 3+ times: the design-system reconciliation, the PRODUCT.md refactor, the CCIL re-architecture.)

## Why this works: constraint as forcing function

The formalization tax is *enforced by* the binding constraint — claude.ai's limited session context window. This is a **healthy forcing function**, not just a cost: limited context forces first-principles prioritization of what truly belongs at the moment a surface is served. It is the **same principle, on a second surface**, as **"mobile as forcing function"** ([ADR-0018](docs/adr/0018-per-surface-mobile-pattern.md)): the smaller mobile surface forced sharper thinking about primary/secondary/tertiary, and the sharper-thought mobile composition *superseded* the desktop one as the default. Constrained resources (screen space; context window) produce the first-principled right design. If context were unbounded, the tax would not bite and the discipline would not pay off.

## Relationship to ADR-0013

[ADR-0013](docs/adr/0013-self-improvement-primitives.md) catalogs the **ADD-shaped** patterns (A-E compound substrate) + Pattern J (pruning) + the autonomy ladder — the *what*. This ADR is the *why*: the formalization tax is the principle those ADD patterns are taxed by, the graduation threshold formalizes ADR-0013's "case-study-driven generalization" into the universal N=3 dial, and the arbiter-shaped clawback generalizes Pattern J's mechanism into the required shape for *any* future counterbalance. ADR-0013 § Amendment 2026-06-03 (Pattern J defined) is the first instance; architecture-review ([ADR-0021](docs/adr/0021-root-relative-doc-links.md) era) is the second.
