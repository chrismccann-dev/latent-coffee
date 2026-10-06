Use to run a SIMULATED POUROVER for a self-roasted green lot near a
reference-roast call. The roasting thread (log-cupping.md, Simulated Pourover
Gate routing) emits a thin SIMULATED POUROVER PACKET; paste it here into a
fresh brewing thread. This produces ONE non-iterated pourover recipe, applied
identically across the roast finalists, to get a sharper read of what the END
optimized cup would taste like than the xBloom gate gives (the gate cup and the
end-optimized cup carry a large delta on most lots). It is decision support for
picking the reference roast - NOT a brew to archive.

**The recipe is the Latent house style.** Since 2026-10-06 the SPG standing
recipe is not designed per lot: it is the [Latent house style](CONTEXT-brewing.md)
(SWORKS Bottomless Dripper + xBloom Premium paper · 1:16, 15 g · EG-1 6.5 ·
94°C kettle on base · bloom 45 g at Dial 0 for 45 s, then Dial 5 · Pour 1 to
150 g at Dial 5 · Pour 2 at ~1:30 to 240 g at Dial 5, Dial 6 at the end ·
~3:00; home water distilled + MgCl2 concentrate) with at most the roast-level
adjustment row the finalists call for (dark / developed → 88-90°C kettle off
base; very light / dense → 96-100°C). Roasts are evaluated against the house
style, not the reverse: the roaster controls roast level and fits the coffee
into the style ([CONTEXT-roasting.md § SPG standing recipe](CONTEXT-roasting.md),
[ADR-0026](docs/adr/0026-latent-house-style-chassis.md)). No Coffee Brief, no
strategy selection, no bean-specific tuning. Because the chassis is the
cross-lot constant, SPG reads are now comparable across V-sets and across lots
for free.

Input is the thin packet, NOT a coffee URL:

  SIMULATED POUROVER PACKET
  - green_bean_id: <uuid>
  - lot: <name / lot_id>
  - finalist batches: <e.g. 191, 192>
  - intent: <one line - what the operator is trying to judge>

STEP 1 - pull the lot. `get_green_bean(green_bean_id)` for bean identity, AND
`get_bean_pipeline(green_bean_id, roast_id)` once per finalist (scoped - the
unscoped pipeline overflows the tool-result cap on a resolved V-set lot). The
pipeline read is in-bounds: it reads the shared Latent DB, NOT the roasting
thread's context (the project boundary the thin packet protects). From it,
recover:
- the finalists' **ground-Agtron** readings - the authoritative roast-level
  prior over whole-bean for a self-roast (WB over-reads lightness on lots with
  a surface-core development gap). Their job here is ONE decision: does a
  roast-level row apply to the whole finalist set? Pick the row for the set
  (the finalists are usually within a few points of each other); if they
  straddle a row boundary, run the chassis with no row - never a different row
  per finalist.
- each finalist batch's **roast_id** (for the re-entry note in STEP 3).

STEP 2 - output the recipe: the house style verbatim, with the row from STEP 1
applied if any, in the Step 2 Output Format of the operational guide
(`read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md",
anchor="Step 2 — Recipe Output (after strategy is confirmed)")` for the table
shape only). Strategy = Hybrid (Sequential). State in one line which row was
applied and why, or "house style, no row".

Deviating from the house style here is the rare exception, not a design step:
only when the lot's prior SPG or optimized brew already proved the chassis
fails on this coffee (the second rotation trigger). If you deviate, say so in
one line and carry the same deviation to every finalist.

HARD STOPS (this is what makes it a simulated pourover, not a brew):
- NO iteration loop. Do not run Step 3 of the operational guide. One recipe, done.
- NO `push_brew`. The recipe is ephemeral - it lives in this thread, never lands
  in Latent. The cups re-enter as `cuppings` rows (below).
- ONE recipe applied IDENTICALLY across all finalist batches. The only variable
  across the finalist cups is the roast - hold grind, temp, ratio, valve
  sequence and pour cadence byte-for-byte.

STEP 3 - handoff-back block the operator carries to the bench:
- the clean copy-able recipe.
- "Brew identically on <finalist batches>, cup side by side - the delta is the
  roast difference, not the recipe."
- evaluate across the full cooling arc (hot -> warm -> the lot's peak window,
  typically 40-45°C on these lots) - do NOT call the verdict from the hot window.
- per-finalist read-for: phrase the one-line thing to listen for on each finalist
  (drawn from the packet intent), so the operator knows what the gate is deciding.
- re-entry note: each finalist re-enters `log-cupping.md` as its OWN cupping row,
  `eval_method: 'Simulated Pourover'`, one row per finalist roast_id. Include the
  resolved roast_ids from STEP 1 (e.g. `191 -> <roast_id>`, `192 -> <roast_id>`)
  so the re-entry is concrete. Nothing is pushed from this session.

Dose: 15g
Brewing location: Home

[paste the SIMULATED POUROVER PACKET here]
