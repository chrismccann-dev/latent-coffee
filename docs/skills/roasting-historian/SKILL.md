# Roasting Historian

**Tier:** Knowledge / **Domain:** Roasting / **Wave:** 2 / **Status:** Wave 2 PR 3 shipped 2026-05-26
**ADR origin:** [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](docs/adr/0012-master-coordinator-pattern.md) + [ADR-0013](docs/adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain lessons-learned from resolved lots; surface cross-lot patterns to Roasting Assistant during recipe construction. Does *internal-to-domain* cross-lot synthesis (e.g. cross-cultivar within roasting, cross-process within roasting). CCIL above synthesizes cross-domain (roasting + brewing).

## Knowledge cluster contents (Wave 2 PR 3)

- [`cluster/patterns/cross-coffee-insights.md`](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md) — absorbs ROASTING.md § Cross-Coffee Insight Layer verbatim (Confirmed Patterns + FC Floor/Ceiling + WB-to-Ground Delta Norms + Session Position Effect + Green Spec→Starting Hypothesis with Additive + Precedence tables + Varietal Aromatic Fingerprints + Rest Behavior Patterns + FC-Temp Architectural Constraint on Naturals + xbloom Evaluation Gate Misranking + Working Hypotheses Single-Lot Low-Confidence). (ROASTING.md is now a ~6KB redirect-stub pointer table post Wave 4 PR 4b — it points here via its "Former section → Now at" map; it no longer carries a `#cross-coffee-insight-layer` section anchor.)
- [`cluster/patterns/open-questions.md`](docs/skills/roasting-historian/cluster/patterns/open-questions.md) — absorbs ROASTING.md § Open Questions (12 research questions to test on future roasts). (ROASTING.md no longer carries an `#open-questions` section anchor — post Wave 4 PR 4b it is a redirect-stub pointer table; follow its "Former section → Now at" map.)
- [`cluster/patterns/general.md`](docs/skills/roasting-historian/cluster/patterns/general.md) — placeholder for cross-lot patterns that don't scope to a single axis. Forward investment; intentionally sparse at ship time.
- [`cluster/patterns/by-cultivar/<cultivar>.md`](docs/skills/roasting-historian/cluster/patterns/by-cultivar/) — FK-seeded stubs at N≥3. Today: `gesha.md` (3 lots: Oma + Surma + Gesha Clouds active).
- [`cluster/patterns/by-process/<process>.md`](docs/skills/roasting-historian/cluster/patterns/by-process/) — FK-seeded stubs at N≥3. Today: `washed.md` (6 closed lots).
- [`cluster/learnings/<lot>.md`](docs/skills/roasting-historian/cluster/learnings/) — 7 per-lot pointer-plus-brief-synthesis files for every lot with a `roast_learnings` row (CGLE Mandela XO, CGLE Sudan Rume Hybrid Washed, GV Oma, GV Surma, GUA El Socorro Java, GUA Libertad, Rancho Tio Emilio). Each cluster file links to the DB row + `/green/[id]` resolved-view + archive.md prose + ROASTING.md reference summary; cluster body carries the cross-lot framing this lot taught the Historian. Substrate-pointer style avoids two-home drift with DB carry-forward fields.

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

## Wave 2 PR 3 ship notes (2026-05-26)

- **Source migration:** ROASTING.md § Cross-Coffee Insight Layer (lines 776-982) + § Open Questions (lines 984-1011) extracted into 12 cluster files. ROASTING.md shrunk from 147,083 bytes → ~80-90KB at this extraction, then further to a ~6KB redirect-stub pointer table in Wave 4 PR 4b (2026-05-21). The back-compat section anchors (`#cross-coffee-insight-layer`, `#open-questions`) did NOT survive that final compaction — the stub is a "Former section → Now at" map with no section anchors.
- **Scope boundary decision (Chris-locked at session start):** Move CCIL + Open Questions; keep § Roast-to-Brew Translation in ROASTING.md. Roast-to-Brew is the bridge between this doc and BREWING.md; stays here until Wave 4. Counterflow methodology + Roest L200 specifics also stay through Wave 3 (Roest Knowledge cluster). **OVERRIDDEN 2026-05-26 by Wave 3 PR 1:** Chris re-locked R-to-B to extract into this cluster as [cluster/patterns/roast-to-brew-translation.md](docs/skills/roasting-historian/cluster/patterns/roast-to-brew-translation.md) (not Roest Knowledge) — the content is cross-coffee pattern aggregation including 2 working hypothesis stubs, structurally identical to the existing CCIL doc; living next to it is the right home. See [feedback_recommend_prior_lock_as_default.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_recommend_prior_lock_as_default.md) for the override-vs-honor-lock procedural rule the session surfaced.
- **Per-lot learnings decision (Chris-locked):** Pointer + brief synthesis style — each `cluster/learnings/<lot>.md` is ~150-250 lines; links to roast_learnings DB row + green_beans page + archive.md + ROASTING.md reference summary, plus 1-paragraph cross-lot framing. DB is substrate; cluster adds pattern context. Avoids two-home drift on the 14-field carry-forward block.
- **scope_tags seeding gap (DB pre-flight finding):** All 4 `scope_tags` columns returned empty rows — forward-only population per Sprint 12 / ADR-0009, no historical backfill. Substituted FK-based seeding from `green_beans` for the by-cultivar / by-process stubs (Gesha at N=3, Washed at N=6).
- **MCP Resources:** 12 new cluster files registered in [lib/mcp/docs.ts](lib/mcp/docs.ts) `DOC_FILES` + `DOC_DESCRIPTIONS` + `listDocs`. Existing `./docs/skills/**/*.md` glob in [next.config.js](next.config.js) covers all new paths (Wave 1 work); no glob change needed.
- **Cross-system propagation:** CLAUDE.md Documentation Index updated; CONTEXT-{roasting,brewing,shared}.md cross-refs intact; PRODUCT.md § Active Sprints Wave 2 closed; `docs/sprints/shipped.md` row added; 6 prompts referencing CCIL anchors verified (top-level anchor preserved); ARBITER.md § CCIL consolidation pass updated to point at cluster file.

## Subsequent waves

- **Wave 3** — operator-stub clusters (Peer-Learning Roasting Archivist absorbs Dongzhe-livestream content; Roest Knowledge cluster absorbs counterflow methodology + Roest L200 specifics from ROASTING.md residual) + 9 Workflow tier sub-skills (POD-1 absorbs into Cupping Specialist).
- **Wave 4** — CCIL + redirect-stub rewrite of BREWING.md + ROASTING.md once cross-domain authoring stabilizes.
