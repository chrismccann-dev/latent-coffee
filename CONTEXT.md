# Latent Coffee Research — Glossary (Redirect Stub)

> Split into 3 zone-aligned glossary docs as of 2026-05-24 (Sprint R Phase 4 Step 5). This file is a pointer-only redirect stub so existing `CONTEXT.md` / `docs://context.md` references remain resolvable. Authoritative glossary content now lives in the zone files listed below — open the right one for your workflow rather than this stub.

## Where each former section now lives

| Former CONTEXT.md section (lines, approx) | Now in | URI |
| --- | --- | --- |
| `### Roasting` (9-208) — V-set / Batch slot / Recipe / Roest profile / Anchor profile / Operator-fixed constants / Variable / Lever / Non-factor / Roast→cup trace / Taste-for / Reference roast / Leading slot / Reference candidate / Reference cup / Optimized brew / xBloom / Control experiment / Acceptable roast window / Brewing tolerance / Roasted bean characteristic / Peak inlet / Green spec / BBP / Hopper pre-load / Session position effect / Thermal reset protocol / Fan curve / Peer roaster | [CONTEXT-roasting.md](CONTEXT-roasting.md) | `docs://context-roasting.md` |
| `### Lifecycle states` (209-228) — In inventory / Waiting for next roast / Waiting for next cupping / Resolved | [CONTEXT-roasting.md](CONTEXT-roasting.md) | `docs://context-roasting.md` |
| `### The unit` (229-238) | [CONTEXT-roasting.md](CONTEXT-roasting.md) | `docs://context-roasting.md` |
| `### V-set close synthesis` (239-267) | [CONTEXT-roasting.md](CONTEXT-roasting.md) | `docs://context-roasting.md` |
| `### Lot-close synthesis` (268-364) — Underdev signal / Overdev signal / Maillard % / WB→Gnd Agtron delta / FC audibility / Scope tags / Lot-specific learnings / Carry-forward learnings | [CONTEXT-roasting.md](CONTEXT-roasting.md) | `docs://context-roasting.md` |
| `### Cup character` (365-399) — Aromatic behavior / Structural behavior / Rest behavior / Peer-roasted reference brew / Rest-days drift | [CONTEXT-roasting.md](CONTEXT-roasting.md) | `docs://context-roasting.md` |
| `### Forward design` (400-493) — Anchor profile / Anchor confidence / Signal precedence / Multi-factor weighting / Pre-V1 risk reduction / Adjustment / Tolerance-anchored design / Pre-V_n calibration gate (incl. Simulated Pourover Gate) / Backfilled recipe | [CONTEXT-roasting.md](CONTEXT-roasting.md) | `docs://context-roasting.md` |
| `### Brewing` (494-705) — Extraction Strategy / Two-Axis Framework / Modifier / Strategy promotion / Phase / Phase boundary / Mechanical role / Cup-side target / Coffee Brief / Reference brew / Signature method / Process-Dominant / Named Consideration / Cooling-Curve Target / WBC corpus check / Variety signal / Process signal / Roaster signal / Signal override / Strategy zone / Wrong-zone trap / Extraction Confirmed / Modifiers Confirmed / Resolved brew / Iteration loop / Iteration budget / Diminishing returns / Strategy pivot / Brewer rotation discipline / Hybrid sub-form | [CONTEXT-brewing.md](CONTEXT-brewing.md) | `docs://context-brewing.md` |
| `### MCP / Sync Architecture` (706-927) — Championship-mode / System self-improvement loop / Role separation / Latent MCP server / MCP-only input principle / Cross-system consistency principle / Tool / Resource / Dual-surface pattern / Redirect stub / Cluster path / Operator-guide pattern / Sub-skill tiers + Master Coordinator + Chris's vocabulary aliases / Per-lot directory taxonomy / Three big levers / Pattern F + Pattern J decomposition tripwires / Asymmetric write trust / Drift / Category bloat / State bloat / Skeleton entry / Arbiter / Process pending arbitration / Override flag / Canonical-strictness spectrum / Bearer token auth / OAuth 2.1 + PKCE auth / Roest API integration | [CONTEXT-shared.md](CONTEXT-shared.md) | `docs://context-shared.md` |
| `### Canonical Registries` (928-1179) — Aggregation level / Aggregation-eligibility / Authoritative source / Validation mirror / Alias / Pick-not-author / Hierarchical taxonomy / Composable taxonomy / Coverage strategy / Owned / Reference role / Producer system / Bottoms-up authoring / Substrate gap / Qualifier / Objective bucket / Marketing tag / Auto-created provenance | [CONTEXT-shared.md](CONTEXT-shared.md) | `docs://context-shared.md` |
| `### WBC Reference Materials` (1180-1449) — WBC reference materials / Strategy-zone completeness / Consciously not pursuing / Foundational control axes / Absorption status / Sourcing priority / Skill-maintenance lane / Portfolio lanes / Sourcing constraints / Risk-tier sourcing / Sourcing channel / Competition-grade access trajectory / Calibration pair / Cross-cutting control patterns / Experiment status | [CONTEXT-shared.md](CONTEXT-shared.md) | `docs://context-shared.md` |
| `### Synthesis Pipeline` (1450-1516) — Humanizer Pass / Knowledge capsule / Synthesis Pipeline / Directed-Prompt Adapter / Bottoms-up Synthesis-Prompt Authoring / Cross-coffee Insight Layer / Variety Throughline / Resynthesize Trigger / Corpus tier | [CONTEXT-shared.md](CONTEXT-shared.md) | `docs://context-shared.md` |
| `## Relationships` (1517-1635) | [CONTEXT-shared.md](CONTEXT-shared.md) | `docs://context-shared.md` |
| `## Example dialogue` (1636-1651) | [CONTEXT-shared.md](CONTEXT-shared.md) | `docs://context-shared.md` |
| `## Flagged ambiguities` (1652-1702) | [CONTEXT-shared.md](CONTEXT-shared.md) | `docs://context-shared.md` |

## Why the split

The pre-split CONTEXT.md was ~483KB / ~1702 lines / ~355 bold glossary entries — past the point where claude.ai could load the whole doc into a session context window. Brewing-side and roasting-side sessions only need their own zone + the shared zone; loading the wrong-domain content was pure cost. Per Sprint R Phase 4 Step 4 Group 1 Item 3 grill (Chris-locked 2026-05-23), the Zone vocabulary (roasting / brewing / shared) became the cut line.

Same pattern as the Wave 4 PR 4b stubs for [BREWING.md](BREWING.md) (~3KB) and [ROASTING.md](ROASTING.md) (~6KB) — operational content moved to scoped destinations; original path preserves back-compat for historical refs.

## How to read this stub at session time

- **Routing live work:** open the zone file (or the MCP Resource) matching your workflow — `CONTEXT-roasting.md` for V-set + lot-close + recipe-design; `CONTEXT-brewing.md` for Coffee Brief + iteration loop + extraction strategies; `CONTEXT-shared.md` for MCP / Canonical Registries / WBC framework / Synthesis Pipeline / cross-cutting concerns.
- **Old anchor refs:** `[CONTEXT.md § Foo](CONTEXT.md)` style links across the codebase resolve to this stub. Use the table above to find the correct zone file + the term name remains the same once you arrive there.
- **Historical refs:** sprint retros and audit-prep docs in `docs/sprints/*.md` and `docs/audits/*.md` are intentionally not rewritten — they're frozen records of what the doc looked like at the time. The stub keeps them resolvable.

## Migration discipline

- Net-new glossary entries land in the appropriate zone file directly (never edit this stub).
- Cross-system audits trace through the zone files, not this stub.
- `propose_doc_changes` proposals targeting `context.md` should be rewritten by the proposer to target the right zone file (`context-roasting.md` / `context-brewing.md` / `context-shared.md`). The arbiter rewrites if the proposer didn't.
