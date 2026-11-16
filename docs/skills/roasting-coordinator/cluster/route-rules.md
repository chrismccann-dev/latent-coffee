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

**Route B — deferred tie-break rebrew (the exception).** The house-style gate left the top two slots inseparable and the rebrew cannot happen the same day. Name the two finalists (gate favorite + roast-side structural favorite when they diverge), set `winner = 'deferred pending SPG'`, flip `lot_status → waiting_for_brewing`. **Do NOT** design the next V-set while waiting. No packet, no brewing thread - the recipe is the house style. A same-day rebrew is not a route: log the rows and pick A or C.

**Route C — declare reference.** One slot clearly wins the house-style gate and is **bracketed** (a lighter sibling reads underdeveloped, a deeper one overdeveloped); no structural unresolved issue. On a seen-before lot this is the expected V1 outcome, not a suspect one. "Wins" = best reveals the **layered-evolving** apex (a cup that develops across the temperature + structural arcs), **not** the loudest or sweetest first sip and **not** an Agtron number — the ceiling is the apex ([SKILL.md § Apex anchor](docs/skills/roasting-coordinator/SKILL.md) / [CONTEXT-taste.md § Roasting philosophy](CONTEXT-taste.md)). Patch the winning roast `is_reference`, emit the Optimized-Brew Packet (the winning gate cup as-is when it needed nothing; otherwise the house style plus the one adjustment found on the winner). The optimized brew is the Latent house style + roast-level row by default ([ADR-0026](docs/adr/0026-latent-house-style-chassis.md)); the roaster fits the coffee into the standard recipe, and a brew that has to leave it is a roast-side signal worth a line in the learnings.

**Route D — hold.** Real blockers only (missing logs, unknown slot mapping, duplicate-row conflict).

## Gate verdict consumption

The Day-7 gate is the house style on every slot ([evaluation.md](docs/skills/roest-knowledge/cluster/protocols/evaluation.md)), so the gate is itself the **express-then-clarify couple's** diagnostic (roasting and brewing are coupled, not independent — [SKILL.md § Apex anchor](docs/skills/roasting-coordinator/SKILL.md)): the brew clarifies what the roast expressed, so a cup that won't clarify points back at expression.

- **Bracketed winner at the apex** → Route C (declare reference + optimized brew).
- **Winner at the edge of the ladder** → Route A, extending the ladder that direction on the same curve.
- **No slot reaches the apex** → Route A (design V_(n+1)). If the house style has to be fought to make any cup work, that is evidence the **roast** didn't develop enough latent layers, a **roasting** problem - go back to the drawing board rather than squeezing the brew. (Lived precedent: Gesha Clouds — 192 beat 191 but wasn't finishable as a reference, so V4 with more core development.)

## One-shot lots

A one-shot (single ~100-120g batch, no iteration) is an **N=1 lot**: same Coordinator, one V-Set Assistant spawn, then straight to optimized-brew + close. No tie-break, no V_(n+1). Don't build a parallel structure — it's a lot with one V-set.
