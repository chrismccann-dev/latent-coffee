# KICKOFF — grill: "concrete-example-first reasoning" (grilling-queue item 49)

**THIS IS A SHORT GRILLING SESSION.** Use the `grill-with-docs` skill. Ask-don't-ship; Chris's audio is load-bearing; do not pre-pick the definition. Goal: **name + define one concept, lock its relationships, decide its home.** Small — one headword, not a sweep.

## The concept (from [grilling-queue item 49](docs/grilling-queue.md))

Chris flagged it 2026-06-05 ("before I forget... may be its own concept"): he consistently prefers to **walk an entire specific lived example rather than the abstract concept**, accumulate **3+** such worked examples, then promote the generalized concept across them as the thing to plan + build + execute against. *"Let's not talk about the general concept — let's talk about the specific lived examples, accumulate them, then generalize."* He has no word for it yet.

## What the grill must resolve

1. **Name it.** It's the *reasoning method* (the HOW of Chris's design thinking — insist on concrete before abstract). Candidates to put up + let Chris pick/veto: "concrete-example-first," "example-first design," "walk-the-example," "lived-example-first." (Apply the formalization tax to the naming — reuse/short over coined.)
2. **Lock the relationship to the [graduation threshold (N=3)](docs/adr/0022-formalization-tax-and-self-improvement-counterbalance.md).** They're twins but distinct: the graduation threshold is *when an abstraction is allowed to promote* (a gate on the substrate); concrete-example-first is *how Chris reasons toward it* (a gate on his own thinking — refuse to design from the abstract; demand the worked examples). Same number (3), different object. Make the distinction crisp or decide they're one thing.
3. **Lock the relationship to [prototype-as-input-not-canon](docs/adr/0022-formalization-tax-and-self-improvement-counterbalance.md).** They compose — the prototype is *a* concrete example offered as input; concrete-example-first is the broader insistence on ≥3 of them before generalizing. Is concrete-example-first the parent, or a sibling?
4. **Decide the home.** A `docs/reference/mcp-architecture.md` method headword (joining the formalization-tax family), or a short ADR-0022 amendment, or both. Apply the tax — it likely earns a headword (Chris invokes it constantly; clears its own N=3 by inspection) but probably not its own ADR.

## Output

- One ratified headword (+ its _Avoid_ line) in the agreed home.
- grilling-queue item 49 → § Resolved.
- If it changes claude.ai-facing substrate materially, note the claude.ai grilling review (likely minor — it's a Claude-Code/design-process concept).

Self-aware note: this grill is *itself* a concrete example of concrete-example-first (Chris walked the lived instances — the design-system reconciliation, the PRODUCT.md refactor, the CCIL re-architecture, this whole session — before naming it). Lampshade it in the headword if it helps.
