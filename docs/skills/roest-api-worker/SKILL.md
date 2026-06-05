# Roest API Worker

**Tier:** Workflow / **Sub-tier:** Executing / **Domain:** Roasting / **Wave:** 3 / **Status:** ACTIVE (Wave 3 PR 3 shipped 2026-05-26)
**ADR origin:** [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](docs/adr/0012-master-coordinator-pattern.md) + [ADR-0013](docs/adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Push roast profiles to the Roest L200 Ultra via the Roest API. Owns `push_roast_profile`. **Symmetry-split from Roest Knowledge** (knowledge tier) per ADR-0011 — Roest Knowledge holds documentation about the machine + API; Roest API Worker is the executor that calls the API.

## Workflow scope

1. **Read approved roast recipe** from Roasting Assistant (typed structure matching `roast_recipes` schema columns) OR from operator paste if not coming through the planner.
2. **Pull Roest Knowledge API surface.** Load `cluster/api/write-surface.md` for current Roest API write contract + `cluster/api/quirks.md` for known retry patterns / firmware-specific behavior + `cluster/observed-quirks.md` for live-issue tracking.
3. **Translate recipe → push_roast_profile payload.** Map bezier curves (`temperature_bezier` / `fan_bezier` / `rpm_bezier` / `power_bezier`) + drop rules + end-condition + charge + hopper temps into the Roest API's expected JSON shape. Server-side autofill handles current-weight injection (Sprint 2.7.5 — replaced the manual `current_weight` workaround).
4. **`push_roast_profile`.** Returns `profile_id` + `share_url` + `created_at`. `enable_share: true` for the share-URL artifact.
5. **Validation gap (Sprint 11 / forward investment).** The current Tool returns success on API acceptance, NOT on machine confirmation. This sub-skill's spec calls out the gap; a future `verify_roast_profile_landed` Tool may land if validation requires a separate API call. Today: surface the gap to the operator as part of confirmation output — "profile_id returned; manually verify the recipe is on the Roest tablet before roasting."
6. **Patch `roast_recipes`** to link the Roest profile back: `patch_roast_recipe(recipe_id, roest_profile_id, roest_share_url, roest_profile_name, pushed_to_roest_at)`. This closes the design-intent ↔ Roest-profile linkage so Roast Recorder's post-roast `push_roast` has a clean `recipe_id` FK target.

## Failure-mode handling

- **API rejection** (Roest API returns non-2xx) — surface the error message + suggest retry; if persistent across consecutive calls, flag as API drift signal (Pattern B → Roest Knowledge `cluster/observed-quirks.md` refresh)
- **Bezier shape rejection** — Roest API's accepted bezier shape can drift across firmware versions; pull `cluster/firmware/README.md` for current accepted shape ranges + retry with adjusted bezier
- **Power-curve constraint** — INLET_TEMP profiles MUST have `power_bezier` null per Roest API contract; validate before push, not after rejection
- **Persistent landing failure** (recipe appears to push but isn't on the machine) — escalate to operator with verification steps; this is the validation gap above

## Inputs

- Roast recipe proposal (from Roasting Assistant, typed; from operator paste otherwise)
- [Roest Knowledge](docs/skills/roest-knowledge/) cluster — `cluster/api/{read-surface,write-surface,quirks}.md` for API contract + drift patterns; `cluster/firmware/README.md` for firmware-version constraints; `cluster/observed-quirks.md` for live-issue tracking

## Outputs

- `push_roast_profile` API call returning `profile_id` + `share_url` + `created_at`
- `patch_roast_recipe` linking the design-time recipe row to the Roest profile artifact
- Confirmation output: profile_id + share_url + validation-gap reminder
- Side effect: lot remains in `waiting_for_next_roast` state until physical roast executes (state transition happens at Roast Recorder push, not here)

## Called by / Calls

- **Called by:** Roasting Assistant (when operator approves the recipe proposal) OR Master Coordinator (via `start-lot.md` orchestration); Chain 3 hop between Roasting Assistant and Roast Recorder
- **Calls:** Roest Knowledge

## MCP Tools owned

- `push_roast_profile` — primary API push (Roest API write)
- `patch_roast_recipe` — Roest profile linkage post-push (co-owned with Roast Recorder; Roast Recorder uses it for `was_backfilled` recipe rows, this sub-skill uses it for `roest_profile_id` linkage)
- (Future) potentially `verify_roast_profile_landed` if validation requires a separate API call

Tool descriptions in `lib/mcp/push-roast-profile.ts` carry an "Owned by Roest API Worker per ADR-0011" pointer. `patch_roast_recipe.ts` pointer reflects co-ownership.

## Self-improvement

- **Patterns:** B (external-event refresh — Roest API drift events / firmware updates → Roest Knowledge `cluster/api/*` refresh, which this sub-skill consumes on next push)
- **Stage:** 1 (in-loop). N=10 for Stage 1 → 2 graduation per substrate-writer rule (writes are irreversible at the Roest API level — once a profile lands on the machine, it's tangible state).
- **Signal:** `push_roast_profile` failure rate spikes → Pattern B trigger → Roest Knowledge `cluster/observed-quirks.md` + `cluster/api/quirks.md` refresh via operator-arbited `propose_doc_changes`. The reverse signal (Roest API behavior stabilizes) → autonomy graduation candidate.

## Wave 3 PR 3 ship notes (2026-05-26)

- **No cluster authored.** SKILL.md only per PR 2/3 precedent. Future `cluster/error-patterns.md` if Roest API failure-mode signatures accrue across lived use.
- **Validation gap acknowledged.** Today's `push_roast_profile` returns success on API acceptance, not machine confirmation. Validation Tool surface is a forward investment; whether to add it is a future sprint decision.
- **Roest Knowledge dependency ACTIVE** (Wave 3 PR 1). 10-file cluster covers machine/L200 + machine/counterflow-observations + protocols/{evaluation,fan-strategy,fc-marking} + api/{read,write,quirks} + firmware + observed-quirks.
- **Chain 3 hop ACTIVE.** Roasting Assistant → **Roest API Worker** → physical roast → Roast Recorder. Promoted in `coordinator/handoff-rules.md` Chain 3 at PR 3 ship time.
- **Migration source:** Sprint Roest API write Phase 1+2 (2026-05-06) already shipped `push_roast_profile` Tool with server-side autofill. This sub-skill SKILL.md is the operator-facing knowledge of how/when to call it.
- **Cross-system audit:** Actor 6 (no schema change), Actor 4 (MCP Resource registration + Tool description pointer), Actor 5 (CLAUDE.md notes ACTIVE), Actor 2 (start-lot.md mentions Roest API Worker as the executor between Roasting Assistant + Roast Recorder; prompt unchanged otherwise per scope decision 2), Actor 3 (catalog refresh), Actor 1 (workflow unchanged in feel; structured underneath via dispatch).
