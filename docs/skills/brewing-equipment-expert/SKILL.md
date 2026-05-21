# Brewing Equipment Expert

**Tier:** Knowledge
**Domain:** Brewing
**Wave:** 1 (paired with Master Coordinator as first ship)
**Status:** Wave 1 shipped 2026-05-26 — cluster migration complete (`cluster/{brewers,filters,grinder-eg1,sworks}.md` + `resources/{brewer,filter,grinder,sworks}-registry.md` pointer docs in place; old `docs/taxonomies/{4 axes}.md` paths now redirect stubs).
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain the brewing equipment registry across drippers / filters / grinders / valve-modulated drippers + per-equipment knowledge (xBloom, SWORKS dial behavior, EG-1 setting drift, etc.). Surface equipment-aware recipe constraints to Brewing Assistant during recipe construction. Manage the operator-owned equipment knowledge cluster — what Chris owns, how each piece behaves, observed quirks worth knowing.

## Knowledge cluster contents

**Consolidation play: 8 existing files unify under one sub-skill.**

| Existing asset | Wave 1 migration target | Content |
|---|---|---|
| `lib/brewer-registry.ts` | `cluster/brewers.md` (pointer) + `resources/brewer-registry.ts` (symlink/reference) | 46 canonical brewers, 12 owned, 24 aliases |
| `lib/filter-registry.ts` | `cluster/filters.md` (pointer) + `resources/filter-registry.ts` (symlink/reference) | 64 canonical filters, 22 owned, 34 aliases |
| `lib/grinder-registry.ts` | `cluster/grinder-eg1.md` + `resources/grinder-registry.ts` (symlink/reference) | EG-1 only (single canonical), 51 enumerated settings, 16 with rich content |
| `lib/sworks-registry.ts` | `cluster/sworks.md` + `resources/sworks-registry.ts` (symlink/reference) | SWORKS Bottomless Dripper, 5 useful dials (0/5/6/7/past-7), dial state vocabulary |
| `docs/taxonomies/brewers.md` | `cluster/brewers.md` (target — extended from authored content) | Authoritative brewers taxonomy authored by Chris |
| `docs/taxonomies/filters.md` | `cluster/filters.md` (target — extended from authored content) | Authoritative filters taxonomy authored by Chris |
| `docs/taxonomies/grinders.md` | `cluster/grinder-eg1.md` (target — extended from authored content) | Authoritative grinders taxonomy authored by Chris |
| `docs/taxonomies/sworks.md` | `cluster/sworks.md` (target — extended from authored content) | Authoritative sworks taxonomy authored by Chris |

**Future cluster additions (operator TODO; Wave 1 doesn't include):**
- `cluster/filter-flow-rates.md` — Chris's planned project measuring flow rates across all owned filters (Pattern I — operator-initiated resource integration)
- Per-machine deep knowledge docs as observed quirks accumulate (e.g. `cluster/xbloom-recipes.md`, `cluster/comandante-burr-wear.md`)

## Inputs

- New equipment acquisitions (Chris buys a new dripper/filter/grinder)
- Flow-rate measurements (when Chris does the planned flow-rate-across-filters project)
- Observed equipment quirks (3+ brews logging the same equipment anomaly → flag review)
- Canonical-registry expansion events (new entry promoted via `taxonomy_overrides_queue` + `propose_canonical_addition` MCP Tools)

## Outputs

- Equipment recommendations to Brewing Assistant during brew planning (e.g. "for this clean delicate cup, prefer Origami Glass + Cafec ABACA over SWORKS")
- Constraint envelope: known-bad equipment states (e.g. "EG-1 dial 6.6 is contaminated, prefer 5.6 or 7.0"; "Dial 1-4 on SWORKS are dead zones with real coffee bed")
- Canonical-registry maintenance: aliases for drift variants, deprecations when obsolete

## Called by / Calls

- **Called by:** Brewing Assistant (heavily — equipment selection is half of recipe construction); future Brew Recorder for canonical validation on push_brew
- **Calls:** No other sub-skills (knowledge tier consumes registry-expansion events but doesn't dispatch other sub-skills)

## MCP Tools in scope

None directly held by Brewing Equipment Expert. Brewing Assistant pulls equipment context FROM this sub-skill's cluster; Brew Recorder validates `push_brew` payloads against this sub-skill's canonical registries. The `propose_canonical_addition` Tool (existing) handles registry additions that flow back into this cluster.

## Self-improvement patterns

- **Pattern A — Substrate-event refresh:** when 3+ brews log the same equipment anomaly (e.g. dial 6.6 contamination signal), trigger a flag-for-review event; operator confirms via `propose_doc_changes` whether to add the anomaly to cluster docs
- **Pattern C — Registry-expansion refresh:** new canonical entry lands via `propose_canonical_addition` → cluster taxonomy doc + surrounding prose refresh via `propose_doc_changes`
- **Pattern I (cross-cutting):** operator-initiated additions (e.g. the planned flow-rate-across-filters project) integrate via Claude Code work session

## Self-improvement signal

- New canonical entry promoted via the existing arbiter pipeline → trigger Pattern C refresh
- 3+ brews log same equipment anomaly within a rolling 30-day window → trigger Pattern A flag
- Operator brings new equipment knowledge (Chris's TODO project) → trigger Pattern I session

## Autonomy stage progression

- **Stage 1 (Wave 1+2 default):** every `propose_doc_changes` proposal arbited by operator
- **Stage 1 → 2 advancement:** N=5 consecutive auto-approvals without operator override (default; equipment-side proposals are low-stakes registry expansions, no special graduation rule needed)
- **Stage 2 → 3:** override rate < 10% across 3 consecutive quarters
- **Auto-demote:** override rate ≥ 10% in any quarter → Stage 3 → 2; override rate ≥ 25% → Stage 2 → 1

## Implementation notes for Wave 1 sprint

- **Migration strategy:** existing 8 files stay in place (no DB schema impact). Wave 1 implementation creates `docs/skills/brewing-equipment-expert/cluster/*.md` AS THE NEW SOURCE OF TRUTH; the existing `lib/*-registry.ts` files become *resources* (the validation mirrors stay where they are — they're code, not docs; CLAUDE.md § Canonical registries already documents this 2-file-per-axis discipline).
- **`docs/taxonomies/{brewers,filters,grinders,sworks}.md` MIGRATE INTO `cluster/`** — content moves; original paths get redirect stubs pointing to new locations.
- **MCP Resource registration:** every new `docs/skills/brewing-equipment-expert/cluster/*.md` file must be registered in `lib/mcp/docs.ts` `DOC_FILES` AND covered by `outputFileTracingIncludes['/api/mcp/**']` in `next.config.js`. Run `npm run check:mcp-bundle` before shipping.
- **CLAUDE.md update:** the existing "Brewer + Filter names" / "Grinder taxonomy" / "SWORKS valve flow taxonomy" sections in CLAUDE.md update to reference the new cluster location (don't delete; the lib/*-registry.ts references stay).
- **Cross-system audit at Wave 1 PR time** (6-actor matrix): Actor 6 (file moves), Actor 4 (MCP Resource registration), Actor 5 (CLAUDE.md updates), Actor 2 (no prompt changes — equipment taxonomy isn't referenced in prompts directly), Actor 3 (claude.ai picks up new Resource catalog on next session start), Actor 1 (operator notices nothing — content unchanged, just relocated).
- **Forward investment:** flow-rate-across-filters project (Chris's TODO) will land as `cluster/filter-flow-rates.md` via Pattern I when ready. Brewing Equipment Expert is the natural home for it.

## Related ADRs

- [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) — 3-tier architecture; Brewing Equipment Expert as Knowledge tier
- [ADR-0012](../../adr/0012-master-coordinator-pattern.md) — Master Coordinator dispatch; this sub-skill is one of 18 cataloged
- [ADR-0013](../../adr/0013-self-improvement-primitives.md) — Patterns A + C + I; autonomy ladder
