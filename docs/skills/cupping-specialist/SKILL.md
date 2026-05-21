# Cupping Specialist

**Tier:** Workflow / **Sub-tier:** Executing / **Domain:** Roasting / **Wave:** 3 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Execute Day-7 xBloom cupping evaluation + V-set Path A/B/C routing on the resolved V-set. **Absorbs POD-1's scope** per ADR-0011 sequencing collapse — simulated-pourover-as-3rd-cup-read (per `docs/sprints/pod-1-scoping-draft-2026-05-26.md`) lands inside this sub-skill, NOT as a separate sprint.

## Workflow scope

- Read Day-7 cupping data (xBloom Brian Quan recipe; comparative across V-set batches)
- Read per-roast `is_reference_candidate` signals from Roasting Historian
- Execute push_cupping for each cupped batch
- Apply Path routing:
  - **Path A** — leading slot is reference-quality → spawn cross-domain handoff Chain 1 (dispatch Brewing Assistant for optimized brew dial-in)
  - **Path B** — design V_(n+1), iterate → dispatch Roasting Assistant for next V-set
  - **Path C** — (currently substrate as C-1 / C-2; POD-1 rewrites this) — pre-V_(n+1) calibration OR back-to-back dual cupping; **POD-1 work: replace with "simulated pourover gate" path** when approaching reference
- Future POD-1 path: when nearing reference (~V3+), execute simulated pourover (non-optimized pourover-shape recipe in actual brewing setup) as a 3rd cup read

## Inputs

- Day-7 cupping data + roast + cup observations (per batch in the V-set)
- Roasting Historian (is_reference_candidate signals + cross-lot patterns)
- (Future POD-1) Brewing Assistant for simulated-pourover recipe construction

## Outputs

- `push_cupping` row(s) per cupped batch
- V-set routing decision: Path A → Chain 1 dispatch; Path B → Roasting Assistant dispatch; Path C (POD-1-rewritten) → simulated-pourover gate
- (When Path A) `is_reference_candidate` and `is_reference` flags on the leading slot's roast

## Called by / Calls

- **Called by:** Master Coordinator (via `log-cupping.md`)
- **Calls:** Roasting Historian; Path A → Brewing Assistant; Path B → Roasting Assistant; Path C (POD-1) → Brewing Assistant for simulated-pourover construction

## MCP Tools in scope

- `push_cupping` — primary write
- `patch_cupping` — post-push corrections
- `patch_roast` — when setting `is_reference_candidate` or `is_reference` flag
- (POD-1) potentially new `push_brew` shape for simulated pourover OR a new `eval_method: 'Simulated Pourover'` on `cuppings` — schema decision is a Cupping Specialist implementation concern

## Self-improvement

- **Patterns:** A (substrate-event refresh on push_cupping), E (workflow-execution refresh — Path routing accuracy measured against actual lot outcomes) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** POD-1 landing → Path C-1/C-2 substrate revision happens inside this sub-skill's implementation; observed routing-decision overrides → Pattern E retro

## Notes for Wave 3 implementation sprint

- **POD-1 scope absorbed.** The POD-1 scoping DRAFT (`docs/sprints/pod-1-scoping-draft-2026-05-26.md`) becomes input to this sub-skill's design — specifically the Path C-1/C-2 deprecation + simulated-pourover-as-3rd-cup-read + cross-project handoff lifecycle states ("optimized brew pending / in progress / resolved").
- **Schema decisions deferred to Cupping Specialist sprint:** whether simulated pourover earns a `cuppings.eval_method = 'Simulated Pourover'` row, OR a `brews.is_simulated_pourover` flag, OR stays in claude.ai thread context. Decision happens during sprint planning, not now.
- **Migration source:** today's `docs/prompts/log-cupping.md` STAGES 1-4 cover the workflow. New Cupping Specialist absorbs + rewrites Path C-1/C-2 sections.
- **Substrate-writing executor — Stage 1 longer.** N=10 for Stage 1 → 2 graduation.
- **Cross-system audit:** Actor 6 (potential schema additions per POD-1 schema decision), Actor 4 (MCP Resource registration + potential new Tool surface for simulated pourover), Actor 5 (CLAUDE.md updates including PRODUCT.md POD-1 status — moved from "parked" to "absorbed"), Actor 2 (log-cupping.md updates), Actor 3 (catalog refresh), Actor 1 (cupping flow streamlined — operator no longer needs to remember which Path C variant).
