Use to run the HOUSE-STYLE GATE for a self-roasted green lot: the Day 7
evaluation of a V-set. Since 2026-11-13 ([ADR-0027](docs/adr/0027-house-style-gate.md))
this is the one and only gate - it replaced both the xBloom gate and the
separate Simulated Pourover Gate step (this file keeps its name for the doc
URI). It runs in the roasting thread; there is no packet and no brewing-thread
handoff.

**The recipe is the Latent house style, verbatim, on every slot of the V-set.**
[Latent house style](CONTEXT-brewing.md): SWORKS Bottomless Dripper + xBloom
Premium paper · 1:16, 15 g · EG-1 6.5 · 94°C kettle on base · bloom 45 g at
Dial 0 for 45 s, then Dial 5 · Pour 1 to 150 g at Dial 5 · Pour 2 at ~1:30 to
240 g at Dial 5, Dial 6 at the end · ~3:00; home water distilled + MgCl2
concentrate. Roasts are evaluated against the house style, not the reverse:
the roaster controls roast level and fits the coffee into the style
([ADR-0026](docs/adr/0026-latent-house-style-chassis.md)). No Coffee Brief, no
strategy selection, no bean-specific tuning, and **no roast-level row at the
gate** - every slot brews at 94°C, because a roast note at 94°C is a
development signal worth reading. Because the recipe is the cross-lot
constant, gate reads are comparable across V-sets and across lots.

THE SESSION
- Brew every slot of the V-set (usually three: a / b / c), back to back, one
  sitting. Hold grind, temp, ratio, valve sequence and pour cadence identical -
  the only variable across the cups is the roast.
- A cup that tastes like a brew fault (channelled, stalled drawdown) gets
  rebrewed, not read.
- Evaluate across the full cooling arc (hot -> warm -> cool). Do NOT call the
  verdict from the hot window.
- Taste against each slot's `taste_for_*` / predicted cup from the Latent app.

WHAT IT DECIDES
1. Leading slot of the V-set.
2. Reference call, when the leading slot is BRACKETED: a lighter sibling reads
   underdeveloped and a deeper sibling reads overdeveloped. Bracketed on V1 is
   the expected result on a seen-before lot. Winner at the edge of the ladder =
   not bracketed; the next V-set extends the ladder that direction.
3. Optimized brew. If the winning cup needs nothing, that cup IS the optimized
   brew. If it wants a trim, apply ONE house-style adjustment to the winner
   only (typically 94 -> 92°C for a slight roast note) and brew once more.

TIE-BREAK REBREW (exception, not a stage)
Only when the top two cannot be separated: rebrew those two alone, same
recipe, and call it there. If the gate favorite and the roast-side structural
favorite diverge, both go in. If the rebrew has to wait for another day and
the leading slot is genuinely open, `log-cupping.md` Path C carries the
deferral.

WHAT GETS WRITTEN
- Each slot re-enters `log-cupping.md` as its own cupping row:
  `eval_method: 'Simulated Pourover'`, `recipe_variant: 'house_style_gate'`
  (a tie-break rebrew: `recipe_variant: 'house_style_tiebreak'`).
- The gate recipe itself is never pushed as a brew. Only the optimized brew is,
  through the `/brew` self-roasted carve-out, once the reference is declared -
  the house style as brewed, or with the one trim.

Dose: 15g
Brewing location: Home
