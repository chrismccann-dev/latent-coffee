Use to run a SIMULATED POUROVER for a self-roasted green lot near a
reference-roast call. The roasting thread (log-cupping.md, Simulated Pourover
Gate routing) emits a thin SIMULATED POUROVER PACKET; paste it here into a
fresh brewing thread. This produces ONE non-iterated best-stab pourover recipe,
applied identically across the roast finalists, to get a sharper read of what
the END optimized cup would taste like than the xBloom gate gives (the gate cup
and the end-optimized cup carry a large delta on most lots). It is decision
support for picking the reference roast - NOT a brew to archive.

Input is the thin packet, NOT a coffee URL:

  SIMULATED POUROVER PACKET
  - green_bean_id: <uuid>
  - lot: <name / lot_id>
  - finalist batches: <e.g. 191, 192>
  - intent: <one line - what the operator is trying to judge>

STEP 1 - pull the lot. `get_green_bean(green_bean_id)` for bean identity, AND
`get_bean_pipeline(green_bean_id)` for the full V-set history. The pipeline read
is the load-bearing input for a self-roast and it is in-bounds: it reads the
shared Latent DB, NOT the roasting thread's context (the project boundary the
thin packet protects). From the pipeline, recover:
- the finalists' **ground-Agtron** readings - the **authoritative extraction
  prior over whole-bean** for a self-roast (WB over-reads lightness on lots with
  a surface-core development gap). Use ground-Agtron to LOCATE the lot (is the
  standing deficit under-expression / under-development, or over-extraction /
  dark-tail?), which sets whether the prior is push or protect.
- the **lot's confirmed extraction lane** - which strategy + brewer/filter has
  been winning the cup across V-sets (and any reference-cup-defining brew like a
  prior breakthrough batch). This is a far stronger prior than a generic
  cultivar pattern.
- each finalist batch's **roast_id** (for the re-entry note in STEP 4).

STEP 2 - Coffee Brief. Build it from bean identity + the lot history via
`read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md",
anchor="Step 1 — Coffee Brief (Claude runs this automatically)")`; consult the
brewing-historian / WBC / brewing-equipment clusters as that step directs.
Assume the operator's standard light / ultra-light self-roast for the bean.

STEP 3 - output ONE initial best-stab recipe (Step 2 Recipe Output format:
strategy + modifiers + dose + water + grinder + grind setting + temp + pour
structure), in the lot's confirmed extraction lane.

**The recipe is a lot-level STANDING recipe, not a per-finalist discriminator.**
This is the rule that makes a simulated pourover useful: target the lot's
end-state direction (confirmed lane + bean identity), close to what the eventual
optimized recipe will be. Use ground-Agtron to locate the lot, but do NOT
over-fit grind/temp to the current V-set's exact composites - the same recipe
should be reusable as THE lot's simulated-pourover recipe across the next V-set
or two, so the SPG read stays comparable as finalists change. A recipe tuned
tightly to "this batch reads 70.9 so calibrate to that" discriminates the
current pair but won't carry forward; a recipe aimed at the lot's end-state
both discriminates AND generalizes. When the two pull against each other, favor
generalization - this is a directional stab, not full optimization.

HARD STOPS (this is what makes it a simulated pourover, not a brew):
- NO iteration loop. Do not run Step 3 of the operational guide. One recipe, done.
- NO `push_brew`. The recipe is ephemeral - it lives in this thread, never lands
  in Latent. (The flagged trade-off: no attribution trace, no strict cross-V-set
  SPG comparability - accepted per the spec; the standing-recipe rule above is
  the partial mitigation.)
- ONE recipe applied IDENTICALLY across all finalist batches. The lot history
  informs the single recipe; never tune per-finalist. The only variable across
  the finalist cups is the roast - hold grind, temp, ratio, and pour cadence
  byte-for-byte.

STEP 4 - handoff-back block the operator carries to the bench:
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
