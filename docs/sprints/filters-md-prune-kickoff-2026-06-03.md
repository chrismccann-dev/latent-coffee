# KICKOFF — filters.md pruning exercise (pruning case 004)

**THIS IS AN INTERPRETIVE PRUNING SESSION.** Chris's steer is load-bearing on every shape call. Default to "ask, don't ship" on what-to-prune; once a call is steered, execute the mechanical part (operator owns the interpretive restructure + shape steer; Claude Code owns the mechanical prune + fidelity verification — the division of labor that worked on cases 001-003). Do NOT drop a canonical filter value the registry / brews depend on without flagging it.

Fourth dogfood of the doc-pruning protocol ([scope doc](docs/features/doc-pruning-mechanism-brainstorm-2026-06-03.md); [Pattern J, ADR-0013 Amendment](docs/adr/0013-self-improvement-primitives.md)). Coverage is already complete (all 5 shapes worked in 001-003), so this is a **normal prune, not a shape-hunt** — reach for the honest shape, no deliberate-hunt mandate.

## Why this doc, why now

`docs/skills/brewing-equipment-expert/cluster/filters.md` is **70.4 KB / 60 KB** — over the single-doc cap ([doc-tripwires.md](docs/architecture/doc-tripwires.md), surfaced by the first `npm run check:doc-sizes` run, 2026-06-03). It is also **the lever for the cluster tripwire**: filters.md is 70.4 of the brewing-equipment-expert cluster's 157.8 KB, so this prune alone likely takes the whole cluster back under its 150 KB cap (see the companion conditional kickoff `brewing-equipment-expert-cluster-kickoff-2026-06-03.md` — run THIS first).

## Doc shape → likely prune shapes

filters.md is **registry-catalog shape** (a long per-SKU enumeration) with an embedded **research log** at the top. That predicts:

- **consolidate** (likely primary) — the catalog has heavy variant sprawl: many CAFEC SKUs that are not owned ("brown 40", "Alt SKU", "(variant)", duplicate trapezoid 101/102 alts). Collapse the non-owned variant noise into a tighter reference; keep owned filters + canonical reference entries at full fidelity.
- **extract / archive** — the four `## Measured Drawdown Reference — Research Project #1-4 (2026-05-2x)` sections at the top are chronological research-experiment results, not filter taxonomy. They're archive/extract-shaped (the content has a historical character). Candidate home: a filter-drawdown research doc (check whether `docs/features/` or a research-coordinator/cluster surface already holds the filter-drawdown experiment series before authoring a new destination).
- **delete-flag (flag-only)** — any SKU that is neither owned nor reference-worthy (a pure catalog duplicate with no measured data and no canonical-registry entry). Flag for Chris; do not delete autonomously.

## The load-bearing safety constraint (registry consistency)

filters.md is the **rich prose reference**; `lib/filter-registry.ts` is the **canonical validation mirror** (brews validate `brews.filter` against it). A back-compat redirect stub also points at the original pre-Wave-1 path. So:

- **Do NOT drop a filter value from the doc that still exists as a canonical entry in `lib/filter-registry.ts`** without reconciling both — that would desync the reference from the validator. If a consolidate/delete removes a SKU's prose entry, confirm whether the registry still lists it (keep them consistent, or flag the registry entry for removal too — a 2-step deliberate edit).
- Run a **concept-set / filter-family diff** after any restructure (cases 002/003's safety step): every filter *family* (April / CAFEC / Chemex / Hario / Sibarist / xBloom / …) and every *owned* filter must survive.

## Procedure (mirrors 002/003)

1. Size-map filters.md by section (families + research blocks) so the weight is visible.
2. Propose a shape per block: consolidate the variant sprawl / extract-or-archive the drawdown research / delete-flag dead SKUs / keep owned + canonical. Present forks in long-form prose; wait for audio steer.
3. Apply only steered calls. Preserve every family + owned filter; keep doc↔`lib/filter-registry.ts` consistent.
4. Re-measure; confirm filters.md < 60 KB. Run `npm run check:doc-sizes` — confirm the cluster also dropped under 150 (it likely did; if not, the companion cluster kickoff fires).

## Output

- filters.md under the 60 KB single-doc cap (target ~45 KB to also clear the cluster).
- **Case-004 handoff** at `docs/sprints/pruning-cases/004-filters-md.md` using `_template.md` — header filled (shape(s) / judgment calls / heuristic learned), delete-flag list if any.
- `npm run check:doc-sizes -- --write` to refresh the registry live block + update the Live queue.
- Return the handoff to the Cluster B doc-pruning thread.

## Six-actor

- Actor 6 (`lib/filter-registry.ts`) — the consistency constraint above; verify no canonical filter value is orphaned.
- Actor 3 (claude.ai) — filters.md is loaded by the Brewing Equipment Expert cluster in claude.ai brewing sessions; picks up new headings via `list_doc_sections` next session.
- Actor 2 (prompts) — check no brewing prompt cross-references a filter SKU heading by anchor before renaming/removing.
- Actor 5 (the cluster doc) — primary surface. Keep the SKILL.md cluster manifest accurate if a doc is added (e.g. an extracted drawdown doc).
- Grilling posture: no content-removal ship without Chris's sign-off on the pruned result.

BRANCH: own branch off latest main.
