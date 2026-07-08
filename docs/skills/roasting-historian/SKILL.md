# Roasting Historian

**Tier:** Knowledge / **Domain:** Roasting / **Wave:** 2 / **Status:** Wave 2 PR 3 shipped 2026-05-26
**ADR origin:** [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](docs/adr/0012-master-coordinator-pattern.md) + [ADR-0013](docs/adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain lessons-learned from resolved lots; surface cross-lot patterns to Roasting Assistant during recipe construction. Does *internal-to-domain* cross-lot synthesis (e.g. cross-cultivar within roasting, cross-process within roasting). CCIL above synthesizes cross-domain (roasting + brewing).

## Knowledge cluster contents (Wave 2 PR 3)

- [`cluster/patterns/cross-coffee-insights.md`](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md) — absorbs ROASTING.md § Cross-Coffee Insight Layer verbatim (Confirmed Patterns + FC Floor/Ceiling + WB-to-Ground Delta Norms + Session Position Effect + Green Spec→Starting Hypothesis with Additive + Precedence tables + Varietal Aromatic Fingerprints + Rest Behavior Patterns + FC-Temp Architectural Constraint on Naturals + xbloom Evaluation Gate Misranking + Working Hypotheses Single-Lot Low-Confidence). (ROASTING.md is now a ~6KB redirect-stub pointer table post Wave 4 PR 4b — it points here via its "Former section → Now at" map; it no longer carries a `#cross-coffee-insight-layer` section anchor.)
- [`cluster/patterns/open-questions.md`](docs/skills/roasting-historian/cluster/patterns/open-questions.md) — absorbs ROASTING.md § Open Questions (12 research questions to test on future roasts). (ROASTING.md no longer carries an `#open-questions` section anchor — post Wave 4 PR 4b it is a redirect-stub pointer table; follow its "Former section → Now at" map.)
- [`cluster/patterns/general.md`](docs/skills/roasting-historian/cluster/patterns/general.md) — placeholder for cross-lot patterns that don't scope to a single axis. Forward investment; intentionally sparse at ship time.
- [`cluster/patterns/by-cultivar/<cultivar>.md`](docs/skills/roasting-historian/cluster/patterns/by-cultivar/) — FK-seeded stubs at N≥3. Today: `gesha.md` (3 lots: Oma + Surma + Gesha Clouds, all closed).
- [`cluster/patterns/by-process/<process>.md`](docs/skills/roasting-historian/cluster/patterns/by-process/) — FK-seeded stubs at N≥3. Today: `washed.md` (6 closed lots).
- [`cluster/learnings/<lot>.md`](docs/skills/roasting-historian/cluster/learnings/) — 12 per-lot pointer-plus-brief-synthesis files, one for every closed lot with a `roast_learnings` row. Each cluster file links to the DB substrate (roast_learnings row + `/green/[id]` resolved-view) and carries the cross-lot framing this lot taught the Historian. Substrate-pointer style avoids two-home drift with DB carry-forward fields. The `active-lots/` twin of each closed lot is a ~6-line redirect stub per the close-out convention ([mcp-architecture.md § Per-lot directory taxonomy](docs/reference/mcp-architecture.md)).

**Deferred:**

- `cluster/patterns/by-density-moisture/<bucket>.md` — Dongzhe-livestream green-physics-first framing. Bucket boundaries (low/mid/high cuts on each axis) not yet locked; defer to a follow-up sprint after more lots populate the corpus.

## Inputs

- Closed-lot events (every `push_roast_learnings` execution)
- `roast_learnings` rows (read-only — DB is substrate)
- `scope_tags` array on the carry-forward fields (drives per-axis pattern doc routing once populated; today the arrays are empty across all 7 closed lots — forward-only population per Sprint 12 / ADR-0009)

## Outputs

- Per-lot learning docs + cross-lot pattern docs (the cluster contents above)
- Recommendations consumable by Roasting Assistant during recipe planning

## Called by / Calls

- **Called by:** Roasting Assistant (during recipe planning), CCIL (during cross-domain synthesis)
- **Calls:** None (knowledge tier doesn't dispatch other sub-skills)

## MCP Tools in scope

None directly. The existing `propose_doc_changes` pipeline applies cluster updates via `target_doc='skills/roasting-historian/cluster/patterns/<file>.md'` (ARBITER.md routing accepts the `skills/{path}.md` shape post-Wave 2 PR 1).

## Self-improvement

- **Patterns:** A (substrate-event refresh on push_roast_learnings), D (tier-threshold refresh), F (bloat-tripwire decomposition when cluster grows) — see [ADR-0013](docs/adr/0013-self-improvement-primitives.md)
- **Signal:** new closed lot's `scope_tags` overlap with stale pattern doc > 50% → targeted refresh proposal (once scope_tags populate going forward)

Ship history (Wave 2 PR 3 notes + subsequent waves) lives in [docs/sprints/shipped.md](docs/sprints/shipped.md) + [docs/architecture/sub-skills-status.md](docs/architecture/sub-skills-status.md) (pruned here 2026-07-08, case 011).
