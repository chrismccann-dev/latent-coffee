# Kickoff brief — Lifecycle-gate reconciliation (SPG) [GRILLING]

**THIS IS A GRILLING SESSION. DO NOT EXECUTE.** Interview Chris in long-form prose on every
substrate-altering call. Default to "ask, don't ship" - the autonomy rule does NOT apply to
grilling sessions. Emitted by the 2026-07-15 plan-feedback pass (Chris selected this cluster).

## Problem

Every time a calibration gate fires mid-V-set (SPG) or a one-shot defers its verdict, the lot
sits in a state the schema half-models: the migration-080 `waiting_for_brewing` stored state is
the de-facto home, but it conflates SPG-confirmation with optimized-brew, the
`"deferred pending SPG"` winner sentinel fools the derived-state computation, and log-cupping
Path C-2's prose still tells the session to leave `lot_status` at `waiting_for_next_cupping` -
which reddens the `check:lifecycle-consistency` cron on every SPG handoff today.

## Goal

Resolve the lifecycle-gate-not-modeled meta-pattern: decide the canonical modeling of the SPG /
calibration-gate state (SPG-specific vs the existing `waiting_for_brewing` conflation), define
the partial-proposal rule + deferred-proposals concept for gated sessions, and reconcile
log-cupping Path C-2's prose with the schema that actually exists.

## Member backlog items

- **#22** SPG / calibration-gate not a first-class lifecycle state (recurrence 5+, high;
  partial build 2026-06-20: `waiting_for_brewing` end-to-end wired)
- **#23** deferred-proposals queue + partial-proposal gap during a gate (recurrence 2, high)
- **#58** log-cupping Path C-2 schema-reconciliation - two facets: (1) the `lot_status` flip to
  `waiting_for_brewing` at SPG handoff (mechanical - the state exists, the prose predates it);
  (2) the SPG-note field: Path C-2 names a `cuppings.additional_notes` column that does not
  exist (recurrence 2, med)

## Scope

**In:**
- Whether SPG deserves its own stored state / gate record vs riding `waiting_for_brewing`
  (candidates from the backlog: `lifecycle_state` enum value on experiments, or a lightweight
  `gates` table `(green_bean_id, gate_type, status)`)
- The winner-sentinel (`"deferred pending SPG"`) vs derived-state interaction
- The real-time partial-write rule: which doc proposals land during a gate vs defer, and where
  the deferred set is recorded so the re-entry session doesn't re-derive it
- #58 facet 2: pick the SPG-note home - (a) experiment `additional_notes` + `eval_method` as
  the grep key (what the AN10 session actually did), (b) add `cuppings.additional_notes`,
  or (c) name a real cupping prose field (`overall` / `structural_behavior`)
- #58 facet 1 may be EXECUTED inside this session once ratified - it catches the prompt up to
  already-shipped schema (grill output -> immediate prompt edit is fine per the arbiter path)
- Related tag-alongs if the grill naturally reaches them: #36 (inference-overridden-by-cup,
  observing at N=2) as a lifecycle-adjacent pattern; #34/#55 doc-write-ergonomics residuals
  only if the deferred-proposals design touches them

**Out:**
- Building the schema migration in-session (grill output = decision + ADR + a follow-on
  execution brief)
- The #57 MCP required-axis fix (separate execution sprint, running in parallel)
- One-shot prompt hygiene items (separate batch sprint)

## Entry surface

Start a fresh `/grill-with-docs` session with this brief. Relevant substrate to load:
CONTEXT-roasting.md (§ Simulated Pourover Gate, § Lifecycle), docs/architecture/page-ia.md
§ Green (5-state derivation + `waiting_for_brewing` exception), docs/prompts/log-cupping.md
Path C-2, migration 080 + `lib/roast-import.ts` (single lot_status write path),
`check:lifecycle-consistency`, ADR-0024 § 6.

## Files likely to touch (post-ratification)

- docs/prompts/log-cupping.md (Path C-2 both facets)
- CONTEXT-roasting.md (SPG / lifecycle glossary entries)
- docs/adr/ (new ADR for whatever modeling wins)
- Possibly: supabase/migrations/ + lib/types.ts + lib/roast-import.ts +
  scripts/check-lifecycle-consistency (if a new state/gate record is ratified - likely a
  follow-on execution brief, not in-grill)

## Verification plan

For anything executed in-session (#58 facet 1): six-actor trace - Actor 2 (prompt edit),
Actor 5 (CONTEXT-roasting.md § SPG entry consistency), Actor 6 (confirm
`check:lifecycle-consistency` goes green on the next SPG handoff; the AN10 lot is the live
test case). Schema decisions get their ADR + a follow-on execution brief with its own
migration gate check.

## Open questions (the grill agenda)

1. Is `waiting_for_brewing`'s SPG/optimized-brew conflation acceptable ("the lot is with the
   brew side, reason legible from experiment prose") or does querying "all lots awaiting SPG
   resolution" earn a dedicated gate record?
2. Should the winner sentinel `"deferred pending SPG"` stay prose, or become a structured
   field the derivation reads?
3. Partial-write rule: exactly which proposal classes are cupping-INDEPENDENT (safe during a
   gate)? The Round-17 candidates: V_n status flip, SPG-independent cup findings, CCIL
   violations.
4. Where does the deferred-proposals set live so re-entry is mechanical (experiment
   `additional_notes` convention vs a real queue)?
5. #58 facet 2: which SPG-note home - (a)/(b)/(c) above? (a) is what lived practice already
   chose on AN10.

## Completion handoff

When the grill closes (and any in-session edits merge), write a completion report to
`docs/sprints/lifecycle-spg-reconciliation-completion.md` that (1) restates this plan so the
report stands alone, (2) recaps each decision + divergences and why, (3) gives PR URL(s) +
merge SHA(s) for anything shipped, (4) reports actual verification results (what was run and
seen, not "should work"), and (5) flags anything deferred, surprising, or newly surfaced.
Tell Chris the report is ready to bring back to a plan-feedback/close-out session: flip #22 /
#23 / #58 in `docs/product/feedback-backlog.md` per outcome (`planned → shipped`, or back to
`open` with the follow-on execution brief queued), confirm the `docs/sprints/shipped.md` row,
and `route-feedback` any new friction the grill surfaced.
