# Roest Knowledge

**Tier:** Knowledge / **Domain:** Roasting / **Wave:** 3 / **Status:** ACTIVE (Wave 3 PR 1 shipped 2026-05-26)
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain everything about the Roest L200 Ultra machine + its read/write API + quirks. Surface machine-aware roast constraints to Roasting Assistant during recipe design and to Roest API Worker during push validation. **Symmetry-promoted from Knowledge tier** per ADR-0011 — analogous to Brewing Equipment Expert on the brewing side. The Roest API Worker (Workflow Executing tier) handles the API push; this sub-skill holds the documentation about how the API behaves.

## Knowledge cluster contents (target Wave 3)

- `cluster/machine/l200-ultra.md` — Roest L200 Ultra machine docs (capabilities, controls, thermal behavior)
- `cluster/api/read-surface.md` — Roest API read endpoints (log pulls, profile fetches, inventory reads)
- `cluster/api/write-surface.md` — Roest API write endpoints (profile push, inventory write — already shipped via Sprint Roest API write Phase 1+2)
- `cluster/api/quirks.md` — observed API quirks worth knowing (drift, retry patterns, edge cases)
- `cluster/firmware/<version>.md` — per-firmware-version notes when behavior changes across versions
- `cluster/observed-quirks.md` — machine-side quirks (e.g. "FC audibility is silent at end-bean-temp 207°C + color 90.8 — protocol-stack triggers")

## Inputs

- Roest API behavior drift (detected at push_roast_profile validation time)
- Observed roast anomalies (e.g. silent FC; bean-temp end conditions)
- Roest firmware updates (annual or operator-watched)
- Operator-integrated learnings (Pattern I session when Chris discovers something worth documenting)

## Outputs

- Machine-aware roast planning constraints (e.g. "this drop rule won't fire at this charge_temp on current firmware")
- API quirk catalogs + troubleshooting docs
- Per-firmware compatibility notes

## Called by / Calls

- **Called by:** Roasting Assistant (during recipe design), Roest API Worker (during push validation)
- **Calls:** None

## MCP Tools in scope

None directly. Roest API Worker is the executor; this sub-skill is the reference.

## Self-improvement

- **Patterns:** A (substrate-event refresh on observed quirks accumulating from multiple roasts), B (external-event refresh on firmware updates / API drift), I (operator-initiated integration) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** API drift detected → trigger refresh; observed-quirk threshold (3+ roasts logging same anomaly) → flag review

## Notes for Wave 3 implementation sprint

- **Chris-stubbed cluster** per Round 2 lock — operator does the research + initial format proposal + stub authoring; Claude Code integrates.
- **Migration source:** CLAUDE.md + ROASTING.md + dev notes currently hold scattered Roest knowledge; consolidate into cluster.
- **Existing assets to absorb:**
  - `lib/mcp/push-roast-profile.ts` (Roest API write endpoint implementation; not migrating the code, but the *knowledge* of how it behaves)
  - `lib/mcp/pull-roest-log.ts` (Roest API read endpoint)
  - CLAUDE.md sections on Roest behavior (Sprint Roest API write Phase 1+2 documented behavior here)
- **Cross-system audit:** Actor 6 (new cluster directory), Actor 4 (MCP Resource registration), Actor 5 (CLAUDE.md updates — Roest-specific sections become pointers to cluster), Actor 2 (`log-roast.md` references Roest Knowledge for log interpretation; `start-lot.md` references for recipe design constraints), Actor 3 (catalog refresh), Actor 1 (Roasting Assistant + Roest API Worker get richer Roest context).
