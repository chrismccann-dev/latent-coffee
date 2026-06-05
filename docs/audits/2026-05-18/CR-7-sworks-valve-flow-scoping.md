# CR-7 — SWORKS valve flow taxonomy promotion scoping

**Source**: [grilling-2026-05-16-canonical-registries-followups.md item #7](docs/sprints/grilling-2026-05-16-canonical-registries-followups.md)
**Sprint**: T5 (2026-05-18)
**Decision at kickoff**: **Scope + ship the promotion this sprint.**

## Question

Per round 7 of the 2026-05-16 canonical-registries grilling: Chris's SWORKS Bottomless Dripper Dial 1-7 flow taxonomy is structurally a **self-only canonical sub-taxonomy** (same shape as EG-1 grinder settings) but lives inside [BREWING.md § Valve Position Reference](../../../BREWING.md) rather than promoted to a `docs/taxonomies/sworks.md` + validation mirror pair. Should it join the canonical-registries cluster as a self-only axis?

## Why promote

The SWORKS valve flow vocabulary is doing four jobs that warrant canonical status:

1. **Per-dial canonical names** (`Closed` / `Restricted` / `Half-Open` / `Open`) are used in brew authoring + cross-coffee analysis. Today the vocabulary lives in BREWING.md prose; cross-brew aggregation requires LLM-read of the prose.
2. **Per-dial flow calibration** (Dial 5 = ~60 sec/100g, Dial 6 = ~45 sec/100g, Dial 7 = ~30 sec/100g at EG-1 6.0 + xBloom Premium Paper) is reference content claude.ai needs at brief time. Today this requires fetching BREWING.md.
3. **Dead-zone protocol** (Dial 1-4 = dead with real coffee bed; use Dial 5+ only) is a self-only operational rule that future claude.ai sessions need to know. Today it's prose-only.
4. **Same shape as EG-1 grinder taxonomy** — single owned instrument with per-setting enumerated entries + per-setting rich content (flow rate / use case / notes). The grinder pattern is the precedent; SWORKS should mirror it.

## Why this is the right shape (vs. extending BrewerEntry)

Two structural alternatives considered:

**Option A: Stretch `BrewerEntry` to include valve settings on the SWORKS row only.**
- Pro: smaller surface (no new file). Aligns with EG-1's `GrinderEntry.validSettings`.
- Con: `BrewerEntry` shape is generic across 46 canonical brewers. Only SWORKS has dial settings; adding optional `validValveSettings?: SworksDialEntry[]` carries dead structure on 45 other brewers.

**Option B: Standalone `lib/sworks-registry.ts` + `docs/taxonomies/sworks.md`.**
- Pro: matches grinder taxonomy precedent. Self-only axis stays self-only. Authoritative-source / validation-mirror pair lands clean.
- Con: net-new file + net-new registry. Net-new entry in `lib/mcp/docs.ts` (catalog + URL routing).

**Decision: Option B.** The grinder precedent already exists; replicating it for SWORKS keeps the per-axis self-only pattern consistent. The valve dial vocabulary is also conceptually distinct from brewer identity (the dial isn't a brewer attribute, it's a per-brew control state) — separating cleanly avoids future confusion.

## What ships in T5

1. `docs/taxonomies/sworks.md` — authoritative authored content. Per-dial entry (0 / 1-4 dead / 5 / 6 / 7 / past-7) with state name + flow rate + use case + protocol notes.
2. `lib/sworks-registry.ts` — validation mirror. `SworksEntry` shape (analogous to `GrinderEntry`) with `validDials: SworksDialEntry[]`.
3. `lib/mcp/docs.ts` — add `'docs://taxonomies/sworks.md'` to `TAXONOMY_AXES` + matching `DOC_DESCRIPTIONS` entry.
4. CLAUDE.md update — mention the 11th canonical axis under § Canonical registries.
5. CONTEXT.md flagged-ambiguity close at line 1519 inline.

## What does NOT ship in T5

- **No schema column on `brews`.** Today the SWORKS dial structure persists in `brews.pour_structure` free-text. The registry exists as a vocabulary anchor; brew-side persistence stays free-text. A future structured-pour-structure sprint may promote per-pour valve-dial to a column; that's beyond T5 scope.
- **No migration.** No existing data needs reshaping.
- **No `push_brew` Tool wiring change.** The vocabulary is canonical-only; writes don't need to validate against `validDials` because the field doesn't exist yet.

## Pairs with

- [WBC-2 Time Distribution Playbook scoping](docs/audits/2026-05-18/WBC-2-time-distribution-playbook-scoping.md) — both T5 items consider promoting an existing prose vocabulary to a canonical surface. WBC-2 deferred until population threshold; CR-7 ships because population is already real (12 brews use SWORKS today).
- [CR-13 + MCP-3 strictness mapping](docs/audits/2026-05-18/CR-13-MCP-3-canonical-strictness-mapping.md) — SWORKS joins the self-only tier alongside EG-1 grinder. Tier policy: validation-only registry; rare net-new entries via deliberate edit only.

## Future triggers

Re-visit the structured-pour-structure question IF either:

1. Chris adds a second SWORKS-class brewer (different valve mechanics). Today the SWORKS is the only valve-modulated brewer he owns; if a SWORKS v2 or a similar product enters the rotation, the brewer-aware dispatch question becomes real.
2. Cross-brew aggregation queries about valve-dial patterns become common ("which Restricted-through-Pours-1-2 brews are Clarity-First vs Balanced Intensity?"). That signal triggers the per-pour structured-column promotion.

Neither trigger active today.

## Out of scope for T5

- Per-pour valve-dial schema column.
- `push_brew` Tool validation against `validDials`.
- Multi-brewer valve taxonomy (no other valve-modulated brewers exist).
