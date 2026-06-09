# Drop-rule authoring standard (read-at-the-machine)

Synthesized from 3 lived lots / 9 slots — Gesha Clouds V4, Wush Wush V2, El Paraiso Red Plum V3 — operator real-time read-through 2026-06-09. **The governing constraint:** a drop rule is read by the operator *in real time at the roaster, eyes on the Roest readout, mid-roast.* It must answer two questions in **one short imperative line each, with zero explanation.** Today's rules fail this — they bury the action inside margin-math and stall-risk prose, branch into "two cases (a)/(b)," and condition on FC timing the operator can't track while roasting. All three made them unparseable at the machine.

## The format (fixed, two branches)

**IF RUNNING FAST** — on pace to hit the drop/end condition *before* the slot's lower time bound (~4:30). The operator's question: *it's about to drop early — let it, or hold it?* Answer with ONE archetype:
- **Stick to drop temp (default):** `Let it auto-drop at <X°C>. Don't intervene.`
- **Hold to a floor (only when FC integration / a dev floor matters):** `Hold to <FC audible | 4:30>, then drop within 10s.`

**IF RUNNING SLOW** — hasn't hit the drop condition by its window. The operator's question: *it didn't hit drop temp — what time do I drop?* Answer is ALWAYS a single clock time:
- `Drop at <M:SS> regardless.`

The slow-drop time is per-slot (5:00 / 5:30 / 6:00 — the designer picks it to match the slot's intent). The fast floor + the drop temp are per-slot too. The *format* never varies.

## Hard rules

1. **No explanation in the rule.** No stall-risk analysis, no margin math, no comparison to prior slots, no "this slot tests the upper bound." All of that moves to the recipe **rationale** field. The drop rule is the action, nothing else.
2. **No FC-timing conditionals.** Never "if FC arrives later than 4:50…". The operator cannot reliably track FC timing mid-roast. Anchor **only** on the two numbers always on the Roest readout: **clock time + bean/drop temp.**
3. **One action per branch.** No "two cases (a)/(b)." Collapse to the single most-likely action.
4. **One short line per branch.** If it doesn't fit in a line, it's too complex to read at the machine.

## Before / after (Chris's v4a, verbatim, 2026-06-09)

**Before (unusable mid-roast):** *"Auto-drop is most likely to fire correctly on this slot — 211°C target sits 2.5°C above v3c's observed FC temp (208.5°C)… Two cases: (a) auto-drop fires post-FC within 4:30-4:42 — let it ride… (b) auto-drop fires pre-FC… short-end manual hold per manual-override protocol… If FC doesn't appear by 4:50, scrap as data point. Operator should be ready at the 4:30 mark."*

**After:**
- **If running fast:** `Let it auto-drop at 211°C. Don't intervene.`
- **If running slow:** `Drop at 5:00.`

The scrap-as-data-point / margin reasoning → recipe rationale, not the drop rule.

## What the Coordinator/Assistant writes into the fields

- `drop_rule_if_fast` → one imperative: `Let it auto-drop at <X°C>, don't intervene.` **or** `Hold to <FC | M:SS>, drop within 10s.`
- `drop_rule_if_slow` → `Drop at <M:SS>.`

That's the whole field. The render is the two-row "Drop Rules" card on `/green/<id>` (V_na/b/c columns × If-running-fast / If-running-slow rows) — keep each cell a glanceable line.

## Why this is load-bearing for the architecture

Drop rules are the mechanism that opens the **design-prediction → roast-actual** gap in the three-point delta chain ([ADR-0024 § 4](docs/adr/0024-lot-coordinator-claude-code-native.md)): when the operator follows a clean rule, the roast-actual is a faithful execution of the design, so the Assistant's post-roast re-prediction is trustworthy. When the rule is unparseable, the operator improvises, the divergence is uncontrolled, and the delta chain's middle point is noise. A readable drop rule is a prerequisite for clean predicted-vs-actual.
