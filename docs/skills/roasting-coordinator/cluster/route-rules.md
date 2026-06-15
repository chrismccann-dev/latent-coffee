# Route rules + delta resolution

What the Coordinator does on consuming a V-set Results Packet. **Canonical:** [ADR-0024 § 4-5](docs/adr/0024-lot-coordinator-claude-code-native.md).

## Step 1 — resolve the three-point delta chain

Before routing, resolve the deltas (the Assistant captured #2 and #3 in-cycle; the Coordinator resolves them against #1):

1. **Design prediction** (Coordinator, pre-roast) — what the plan expected.
2. **Roast-actual re-prediction** (Assistant, post-roast, durable) — what the actual roast (after drop rules fired) led us to expect.
3. **Cup actual** (Assistant) — what we got.

Resolve three gaps and record them in the Brief:
- **design → roast-actual**: did the roast behave? (drop rules fired? ran long/fast? never cracked?)
- **roast-actual → cup**: did the actual roast predict the cup? (this is the *honest* model-quality signal — the design prediction is judged generously because the roast diverged by design)
- **design → cup**: did the plan work overall?

This pairing is the substrate the Predicted-vs-Actual roast delta surface renders.

## Step 2 — choose the route

The Results Packet's route recommendation is **input**; the Coordinator decides, because routing *is* the plan.

**Route A — design the next V-set.** No reference yet; a roast-side question is open; the cupping points at a clear next variable. Treat the Assistant's next-step hypothesis as input-not-canon; author V_(n+1) with cross-V-set context. → back to SKILL.md step 2.

**Route B — Simulated Pourover Gate.** Two finalists are plausible but the table cup isn't decisive; an optimized-brew stab might flip or confirm it; you don't want to burn full V-sets yet. Emit the thin SPG packet (claude.ai), flip `lot_status → waiting_for_brewing`. **Do NOT** advance lifecycle or design the next V-set while waiting. The SPG is the **roasting-vs-brewing-problem discriminator**: it's a *stab* at the optimized brew, not the answer.

**Route C — declare reference.** One slot clearly wins; real-pourover / SPG validation is acceptable; no structural unresolved issue. "Wins" = best reveals the **layered-evolving** apex (a cup that develops across the temperature + structural arcs), **not** the loudest or sweetest first sip and **not** an Agtron number — the ceiling is the apex ([SKILL.md § Apex anchor](docs/skills/roasting-coordinator/SKILL.md) / [CONTEXT-taste.md § Roasting philosophy](CONTEXT-taste.md)). Patch the winning roast `is_reference`, emit the Optimized-Brew Packet (claude.ai).

**Route D — hold.** Real blockers only (missing logs, unknown slot mapping, duplicate-row conflict).

## SPG verdict consumption

The SPG is the **express-then-clarify couple's** diagnostic (roasting and brewing are coupled, not independent — [SKILL.md § Apex anchor](docs/skills/roasting-coordinator/SKILL.md)): the brew clarifies what the roast expressed, so a cup that won't clarify points back at expression.

- **Pass** → Route C (declare reference + optimized brew).
- **Fail** → Route A (design V_(n+1)). The SPG failing means you were *fighting too hard brewing-side to make the cup work* — that's evidence the **roast** didn't develop enough latent layers (the develop-fully-for-expression move came up short), a **roasting** problem, so go back to the drawing board rather than squeezing the optimized brew. (Lived precedent: Gesha Clouds — 192 beat 191 but wasn't finishable as a reference, so V4 with more core development.)

## One-shot lots

A one-shot (single ~100-120g batch, no iteration) is an **N=1 lot**: same Coordinator, one V-Set Assistant spawn, then straight to optimized-brew + close. No SPG, no V_(n+1). Don't build a parallel structure — it's a lot with one V-set.
