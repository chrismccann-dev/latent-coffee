# CONTEXT.md patch — 2026-05-14 prompt-rewrite sprint

Apply these edits to `CONTEXT.md` in the `elegant-ardinghelli-05c4e2` worktree. Three changes — all locked decisions from the 2026-05-14 dogfood / prompt-rewrite session.

## 1. Add explicit V-number bands to the "Adjustment" definition

The current "Adjustment" entry already says "Scale-dependent: big and often multi-variable in early V-sets... small and typically single-variable in late V-sets" but doesn't pin V-numbers to the bands. The new prompts make the V-number mapping explicit; CONTEXT.md should match.

**Find:**

```
**Adjustment**:
The deliberate design move from V_n to V_{n+1} that changes one or more variable levels with the intent of moving the cup in a specific direction. Informed by V_n's cupping deltas + carry-forward learnings of prior lots + the producer-notes ballpark check. **Scale-dependent**: big and often multi-variable in early V-sets (exploring the response map, finding the zones), small and typically single-variable in late V-sets (converging on the reference roast, fine-tuning). The unit of forward design between V-sets — authored by claude.ai as part of the post-cupping update.
_Avoid_: "tweak" (too casual, implies small), "iteration" (V-set is the iteration), "variation"
```

**Replace with:**

```
**Adjustment**:
The deliberate design move from V_n to V_{n+1} that changes one or more variable levels with the intent of moving the cup in a specific direction. Informed by V_n's cupping deltas + carry-forward learnings of prior lots + the producer-notes ballpark check. **Scale-dependent — concretely mapped to V-number bands**:
- **V1 (and often V2)**: wide-variance, multi-variable exploratory. Spread can be wide on multiple axes simultaneously (lower / medium / higher peak AND faster / slower decline across the same three slots). The point is to *find the response surface*, not to narrow on it. ~5°C+ peak inlet spread is fine and often correct.
- **V2 → V3**: narrow on V2's leading slot, usually single-variable. 1-2°C peak spread is typical, or replicate V2's leading slot with two slight adjustments (a control experiment). V2 stays wide-ish when V1's signal was ambiguous (still in search space).
- **V3+**: probe a NEW variable held constant in V_1…V_3 (fan curve through development, drop temp ceiling at fixed peak inlet, charge temperature, hopper pre-load), or run a control experiment to lock in the reference roast.

Override: if V_n's `open_questions` explicitly demand re-bracketing ("we don't know if the window is in this range at all"), widen the spread regardless of V number. The unit of forward design between V-sets — authored by claude.ai as part of the post-cupping update.
_Avoid_: "tweak" (too casual, implies small), "iteration" (V-set is the iteration), "variation"
```

## 2. Add "Leading slot" as a new entry

The V-set-level winner is named distinctly from the lot-level reference roast — Chris flagged the ambiguity himself during the 2026-05-14 session. "Leading slot" is the locked term.

**Insert** between the "Lever" and "Non-factor" entries (or wherever flows naturally — alphabetical isn't enforced):

```
**Leading slot**:
The winner of one V-set's batch-slot comparison — the single batch slot within V_n that came out on top at Day 7 cupping. Lives in `experiments.winner` (one per V-set). Phrased as `V<n><letter> (Batch <Roest#>)` so it's unambiguous and distinguishable from the lot-level reference roast. Changes V-set to V-set as the iteration progresses; the leading slot of V1 may or may not also be the leading slot of V2.

**Distinct from reference roast**: the leading slot is V-set-scoped. The reference roast is lot-scoped — designated exactly once at lot close-out, can be (and often is) the leading slot of the final V-set, but the two concepts must not be conflated. The lifecycle has *N* leading slots (one per V-set) and exactly 1 reference roast.
_Avoid_: "winner" (ambiguous against reference roast), "best batch", "V-set winner" (the schema column name; vocabulary preference is "leading slot")
```

## 3. Add the "distinct from leading slot" clarifier to "Reference roast"

The existing "Reference roast" entry is solid but doesn't explicitly disambiguate against the V-set-level leading slot.

**Find** (the existing Reference roast entry, last sentence):

```
Deliberately called "reference" not "best" because tasting is subjective and there is no objective best.
_Avoid_: "best roast", "winning batch", "final roast", "optimal roast"
```

**Replace with:**

```
Deliberately called "reference" not "best" because tasting is subjective and there is no objective best. **Distinct from leading slot**: the leading slot is V-set-scoped (winner of one V-set's batch-slot comparison); the reference roast is lot-scoped (one per lot, declared at close-out). The reference roast is typically the leading slot of the final V-set, but the concepts are not interchangeable — a control experiment V-set can confirm a leading slot from a prior V-set as the reference roast, in which case the leading slot of the control V-set may or may not be the same.
_Avoid_: "best roast", "winning batch", "final roast", "optimal roast", "leading slot" (V-set-scoped, see separate entry)
```

## 4. Update Relationships section

**Find:**

```
- A **reference roast** emerges from a V-set when the cup matches expectations + diminishing returns set in, and is typically locked via one final **control experiment**.
```

**Replace with:**

```
- Each V-set produces a **leading slot** (the V-set-scoped winner; lives in `experiments.winner`). The leading slot of the final V-set is typically (but not always) promoted to the lot-level **reference roast** at close-out.
- A **reference roast** emerges from a V-set when the cup matches expectations + diminishing returns set in, and is typically locked via one final **control experiment** (which replicates the prior V-set's leading slot with two slight adjustments to confirm).
```

## What this doesn't fix

These are schema-naming gaps CONTEXT.md already flags; they remain follow-ups for future sprints, not this patch:

- `roast_learnings.elasticity` → rename to `brewing_tolerance` (column rename + downstream UI)
- `roast_learnings.roast_window_width` → relabel `acceptable_roast_window` in UI
- Add `roast_learnings.terroir_takeaway` column (the 4th carry-forward axis missing from schema)
- Audit underdev/overdev rows for roast-side intermixing
- Relocate `aromatic_behavior` + `structural_behavior` off `roast_learnings`

The new `close-lot.md` prompt writes to existing schema field names with the rename caveat inline. When the rename sprint lands, the prompt updates with it.
