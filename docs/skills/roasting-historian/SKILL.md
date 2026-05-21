# Roasting Historian

**Tier:** Knowledge / **Domain:** Roasting / **Wave:** 2 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain lessons-learned from resolved lots; surface cross-lot patterns to Roasting Assistant during recipe construction. Does *internal-to-domain* cross-lot synthesis (e.g. cross-cultivar within roasting, cross-process within roasting). CCIL above synthesizes cross-domain (roasting + brewing) above this.

## Knowledge cluster contents (target Wave 2)

- `cluster/learnings/<lot>.md` — per-lot deep-dive learnings (richer than today's `roast_learnings` rows)
- `cluster/patterns/by-cultivar/<cultivar>.md` — cross-lot patterns scoped by `scope_tags` cultivar tag
- `cluster/patterns/by-process/<process>.md` — cross-lot patterns scoped by `scope_tags` process tag
- `cluster/patterns/by-density-moisture/<bucket>.md` — cross-lot patterns scoped by density+moisture pairs
- `cluster/patterns/general.md` — patterns that don't scope to a single axis
- `cluster/patterns/cross-coffee-insights.md` — internal cross-lot synthesis (absorbs ROASTING.md's equivalent section to BREWING.md's "Cross-Coffee Insight Layer")

## Inputs

- Closed-lot events (every `push_roast_learnings` execution)
- `roast_learnings` rows (read-only — DB is substrate)
- `scope_tags` array on the carry-forward fields (drives per-axis pattern doc routing)

## Outputs

- Per-lot learning docs + cross-lot pattern docs (the cluster contents above)
- Recommendations consumable by Roasting Assistant during recipe planning

## Called by / Calls

- **Called by:** Roasting Assistant (during recipe planning), CCIL (during cross-domain synthesis)
- **Calls:** None (knowledge tier doesn't dispatch other sub-skills)

## MCP Tools in scope

None directly. The existing `propose_doc_changes` pipeline applies cluster updates.

## Self-improvement

- **Patterns:** A (substrate-event refresh on push_roast_learnings), D (tier-threshold refresh), F (bloat-tripwire decomposition when cluster grows) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** new closed lot's `scope_tags` overlap with stale pattern doc > 50% → targeted refresh proposal

## Notes for Wave 2 implementation sprint

- **Migration source:** ROASTING.md has a section parallel to BREWING.md's "Cross-Coffee Insight Layer" (confirmed by Chris in Round 2 batch 1; also evidenced by PR #200 landing "2 new CCIL hypotheses" in ROASTING.md). That section absorbs into `cluster/patterns/cross-coffee-insights.md`.
- **Closed-lot count today:** 6 resolved lots in `green_beans` (CGLE Sudan Rume Hybrid Washed, CGLE Mandela XO, GV Surma, GV Oma, GUA Libertad, GUA El Socorro). Initial cluster authoring works from these.
- **Cross-system audit at PR time:** Actor 6 (no DB schema change; pure file authoring), Actor 4 (register new cluster docs in `lib/mcp/docs.ts`), Actor 5 (CLAUDE.md updates if any), Actor 2 (`close-lot.md` STAGE 3 references Roasting Historian as the carry-forward home), Actor 3 (claude.ai picks up new Resources on next session start), Actor 1 (operator sees richer lessons-learned surface).
