# Roasting Brief — template + discipline

The **Roasting Brief** is the durable lot plan at `docs/lots/<lot>.md`. It is the Coordinator's **source of truth** (Model B, [ADR-0024 § 2](docs/adr/0024-lot-coordinator-claude-code-native.md)) — any fresh Coordinator session reconstructs the lot from it + a `get_bean_pipeline` pull. Mirror of the brewing-side Coffee Brief.

## Discipline

- **Narrative + state, not numbers.** The Brief holds the strategic arc + the current plan-state + the *why* behind each decision. All numbers (recipe settings, roast actuals, cup deltas) live in the DB — the Brief *points*, it does not duplicate. This keeps it small enough to stay complete.
- **Written at every natural break.** Intake, each V-set design, each route decision, each Brief-state change. The forcing function: because the next session reconstructs from it, the Brief *must* be current. A warm session that hasn't serialized its reasoning to the Brief is a fragility, not a feature.
- **One Brief per lot.** Lives at `docs/lots/<lot-slug>.md`. Survives weeks of session churn.

## Template

```markdown
# Roasting Brief — <Lot Name> (<lot-slug>)

**green_bean_id:** <uuid> · **lot_status:** <state> · **Started:** <date> · **Roest inventory:** <id>

## Anchor
- Variety / process / producer / terroir: …
- Density (g/L) / moisture (%): …
- Producer tasting notes (the verify-on-track anchor): …
- Closest prior lot / cross-coffee hypothesis (from Roasting Historian): …

## Strategic arc
What is this lot trying to resolve? The lever(s) under test across V-sets. The forward-design intent (not just V1).

## V-set log (the plan-state)
- **V1** — design intent: … · status: <designed | roasting | cupping | resolved> · leading slot: … · what it proved / failed to prove: … · delta resolution (design → roast-actual → cup): … · route taken: …
- **V2** — …
- (one block per V-set; append as the lot iterates)

## Current state + next step
Where the lot is right now + what the Coordinator's next action is. The single most important "reconstruct here" pointer.

## Open questions / carry-forward
Unresolved threads; what a future session needs to remember that isn't in the DB. (Lot knowledge only — friction about the WORKFLOW itself goes to [process-friction-log.md](docs/skills/roasting-coordinator/cluster/process-friction-log.md), appended at the same natural breaks.)

## Cross-domain handoffs
- SPG: <not-run | packet-emitted <date> | verdict: …>
- Optimized brew: <not-started | packet-emitted | brew_id: …>

## Close-out (when resolved)
Reference roast id + why it won · roast_learnings id · optimized brew_id · substrate-fold plan pointer · inventory archived.
```

## Reconstruct checklist (start of every Coordinator session)

1. Read this Brief in full.
2. Pull `get_bean_pipeline` (incremental `since:` once that prerequisite lands) for the current DB numbers.
3. Confirm `lot_status` matches the Brief's stated current state (the `check:lifecycle-consistency` gate guards this once live).
4. Proceed to the next-step pointer.
