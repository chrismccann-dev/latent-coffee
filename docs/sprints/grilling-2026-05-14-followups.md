# Grilling 2026-05-14 — Roasting cluster follow-ups

## Session summary

First /grill-with-docs session, audit-grilling the roasting cluster of implicit Latent terminology. 12 grilling rounds over one sitting. Outputs:

- [CONTEXT.md](CONTEXT.md) — 31 glossary terms across 7 sub-sections (V-set anatomy / trace / endpoint / character / lifecycle / lot-close synthesis / forward design); 14 relationships; 8 flagged ambiguities.
- `.claude/skills/grill-with-docs/` — Matt Pocock's skill installed verbatim, runs as `/grill-with-docs` project-scoped slash command.
- [CLAUDE.md:11-13](CLAUDE.md) — new "Shared language + decisions" group in Documentation Index pointing at CONTEXT.md + docs/adr/.
- [lib/mcp/docs.ts](lib/mcp/docs.ts) — CONTEXT.md registered at `docs://context.md` so claude.ai can read the glossary during workflows.

Shipped as commit `c498e27` on branch `claude/elegant-ardinghelli-05c4e2`.

## Standing decision: dogfood does not block on follow-ups

None of the 8 follow-ups below are correctness blockers for the green-bean workflow dogfood Chris is about to run. All are post-hoc fixable without data loss. Recommendation: **proceed with dogfood as planned**, schedule the follow-ups after dogfood completes.

## 8 follow-up actions

### Sprint candidates (bundle 1-3, 4-5, 6-7 as appropriate)

**1. Rename `roast_learnings.elasticity` → `brewing_tolerance`** [ADR-worthy]
- Why: original name was a physics metaphor with confusing polarity (high elasticity = forgiving? sensitive?). The concept is "how well the cup holds up when brewing variables are pushed". Rename to match the mental model.
- Surface: migration + UI label + push_roast_learnings tool description + patch_roast_learnings tool description + closed-bean-full-fill prompt
- ADR needed: hard to reverse once data lands; surprising-without-context; real trade-off (rename churn vs leaving misleading name forever)
- Migration shape: `ALTER TABLE roast_learnings RENAME COLUMN elasticity TO brewing_tolerance;` — data carries through

**2. UI relabel `roast_learnings.roast_window` → "Acceptable Roast Window"** [cosmetic]
- Why: bare "roast window" is under-specified; the qualifier is load-bearing
- Surface: ResolvedView label only; column name can stay as `roast_window` (no migration)

**3. Add `roast_learnings.terroir_takeaway` column** [schema gap]
- Why: Chris's mental model has 4 carry-forward axes (cultivar / terroir / general / starting-hypothesis); schema today only has 3
- Surface: migration (ADD COLUMN nullable text) + push/patch_roast_learnings tool fields + UI render in carry-forward card + closed-bean-full-fill prompt
- Past lots: NULL — same as if the field had never existed; no backfill needed

**4. Audit `docs/prompts/` for new vocabulary** [prompts]
- Files: `new-bean-intake.md`, `in-process-bean-incremental-sync.md`, `design-next-experiment-set.md`, `closed-bean-full-fill.md`
- What to update: ensure claude.ai uses the new vocabulary (brewing_tolerance, acceptable_roast_window, terroir_takeaway, etc.) when writing roast_learnings
- Couple with sprint 1 + 3 (do not ship prompt vocab updates before schema renames land)

**5. Audit existing underdev/overdev data for cup/roast intermix** [data audit]
- Chris flagged that existing roast_learnings.underdev_signal / overdev_signal data may have intermixed cup-side signals (correct) with roast-side observations (wrong category, e.g. "the roast stalled at the end")
- Surface: read-only DB inspection + judgment call on whether to relocate roast-side observations to a new field (`roast_anomalies`?) or leave as-is
- Possibly couple with sprint 6 (character-descriptor relocation) since both are schema-corrective

**6. Relocate `aromatic_behavior` + `structural_behavior` from `roast_learnings` to cuppings** [ADR-worthy]
- Why: these describe what a CUP IS, not what a LOT TAUGHT. Misplaced in roast_learnings; conceptually belong on `cuppings` records (per-tasting) or the reference-cup synthesis view
- Surface: migration to move data via `best_roast_id` → roast_id → cupping rows; tool description updates; UI changes on ResolvedView
- ADR needed: hard to reverse once data lands again; surprising-without-context; real trade-off (clean schema vs migration churn)
- Migration shape: one-shot data move + drop columns from roast_learnings + add columns to cuppings (or a synthesis field)

**7. Decide whether to keep or drop `rest_behavior`** [scoping]
- Why: field currently unused (Chris targets day-7 xBloom universally); will become useful if/when rest-time-as-variable enters scope (WBC-style work)
- Decision: keep as forward-investment, or drop until needed?
- Low priority — can sit indefinitely

### Next grilling session

**8. Brewing-cluster grilling** [/grill-with-docs]
- Trigger: after dogfood completes (so dogfood data informs the grilling)
- Likely terms: 6 brewing strategies (Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid), 4 modifiers (Output Selection / ITS / Aroma Capture / Immersion), Two-Axis Framework, Hybrid subform, signature methods (Moonshadow / TyOxidator / Hybrid Washed), canonical / alias / override / find-or-create, all the brewing-side equipment + workflow vocab
- Expected scale: probably ~30-50 more terms; multiple sessions

## Suggested sequencing

```
[ now ]
  ↓ Chris runs green-bean dogfood (no waiting on this brief)
  ↓
[ post-dogfood ]
  Sprint A: ADR-driven schema refactor (items 1, 3, 6) + prompt updates (item 4)
  Sprint B: Data audits (items 2, 5) + scoping decision (item 7)
  Session 2: Brewing-cluster grilling (item 8)
```

Sprint A is the most coupled — schema rename + new column + data relocation + prompt vocab all need to land together to keep claude.ai writes coherent. Sprint B is read-mostly cleanup. Session 2 is independent grilling.

## Open questions for next session

- Do we want a `docs://context.md#Section` anchor convention to let claude.ai reference specific glossary terms? (e.g. `docs://context.md#V-set`)
- Should new feedback memories be cross-linked from CONTEXT.md, or kept separate per Matt's strict-glossary rule?
- The ADR format directory `docs/adr/` is empty — first ADR (either for sprint 1 or sprint 6) is the seed.

## Audio dictation note

Chris began using audio dictation for replies during this session (2026-05-14). Saved as a memory ([feedback_audio_dictation.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_audio_dictation.md)) so future sessions adjust cadence — expect long multi-fact audio replies, keep my own responses tight and well-structured.
