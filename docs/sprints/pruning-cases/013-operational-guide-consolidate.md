# Pruning case 013 — brewing-assistant operational-guide.md (consolidate pass)

> Structured handoff doc for a post-tripwire pruning exercise. Lead with the 5-line header so lessons aggregate across cases toward the eventual systematization decision (see [docs/features/doc-pruning-mechanism-brainstorm-2026-06-03.md](docs/features/doc-pruning-mechanism-brainstorm-2026-06-03.md)).

## Header

- **Doc pruned:** [docs/skills/brewing-assistant/cluster/operational-guide.md](docs/skills/brewing-assistant/cluster/operational-guide.md), 54.2 → 51.0 KB (55,527 → 52,215 B) against the 60 KB single-doc cap.
- **Trigger:** ⚠️ approaching-band watcher (≥80% of the 60 KB cap) flagged in the [pruning-prep-2026-07-08 report § 3](docs/audits/pruning-prep-2026-07-08.md); Chris ratified every § 3 cut candidate 2026-07-08. Suggested-order item 4 ("fold into the next brewing-side pass").
- **Shape(s) used:** `consolidate` (primary — internal triplication + pointer-izing stale enumerations to canonical owners) + `delete` (case-002 provenance class: grill stamps, sprint stamps, version-history tails) + one `re-home` (CCIL promotion gate → brewing-historian CCIL). No split — the report explicitly found a case-009 growth-isolation split does NOT apply.
- **Judgment calls:** (1) Step 4 write-contract enums (Base Process 4-value, Extraction Strategy 6-value, Hybrid Sub-form 5-value, Modifiers 5-type list with sub-fields) kept inline per the "would the completion engine still produce identical output reading read_canonical?" test — those are code-side strict enums the completion engine needs stated; the Signature Method roster, filter alias history, honey tiers, experimental list, and roast-level bucket roster were pointer-ized because `read_canonical` returns identical values and the inline copies had already drifted (15-vs-16 signature methods was the live proof). (2) The re-homed CCIL gate turned out to already have a verbatim ledger home in [ccil/cluster/observing.md § Medium-roast specialty natural over-extraction lever](docs/skills/ccil/cluster/observing.md); the gate was still appended verbatim to [cross-coffee-insights.md § Open Questions § Roast Level](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md) per the ratified spec, with a pointer to the fuller observing-ledger entry (which carries the 2026-06-03 operator clarification). (3) lib/mcp/docs.ts Resource description left unchanged — it enumerates only kept content (strategy table, adjustment-width framework, Step 4 schema), none of the removed provenance/enumerations, so no Actor-4 hop fired.
- **Heuristic learned:** the case-008 2x discount needs a second application on consolidate-heavy passes over live procedure docs — the prep report's 8.3-8.8 KB gross / 5-6 KB "actual" estimate materialized as **3.3 KB** once the considered-and-kept list was respected byte-for-byte, because most of each flagged block's mass IS the rule substance that must survive once. A consolidate pass on a doc whose residual is all decision instruments cannot clear an 80%-band watcher; only a split or a kept-material renegotiation can.

## Shape-coverage note

Deliberately consolidate/delete-led (not reflex-extract). The one structural alternative the report named — extracting Step 4 to a `resolved-brew-format.md` sibling — was considered and rejected in the prep report itself ("consolidation alone clears the cap, so it's not the lead"). Note post-hoc: consolidation did NOT clear the ≥80% watcher band (48 KB), only reduced pressure to 85%; the Step 4 extraction remains the natural seam if the watcher must fully clear later (sole Step-4 consumer is bundled-brewing-completion.md's hardcoded anchor).

## Delete flags (if any)

None outstanding — all deletes in this case were Chris-ratified in the prep report before execution (v8.4 Immersion note, 4c rename changelog tail, preamble migration history, provenance stamps).

## Result

- operational-guide.md 54.2 → 51.0 KB / 60 cap (watcher stays ⚠️ approaching at 85%, down from 90%; ledger note in [doc-tripwires.md](docs/architecture/doc-tripwires.md) states why the residual is untouchable).
- Per-cut actuals vs report estimates (gross est → actual): dark-roast override + Item-29 carve-out 2.5 → ~1.5; Step 4 enumerations 2.5-3 → ~1.3; apex default 0.6 → ~0.5; whole-arc + restatement 0.7 → ~0.4; v8.4 note + changelog tail 0.6 → ~0.7; strategy-table status clauses 0.4 → ~0.35; preamble 0.5 → ~0.45; ground-Agtron lived case 0.3 → ~0.3; CCIL trigger tail 0.2 → ~0.35 (net of the pointer left behind).
- Cross-file move: CCIL promotion gate appended verbatim to [cross-coffee-insights.md § Open Questions § Roast Level](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md) (+0.7 KB there, brewing-historian cluster 190.1 / 250).
- **Behavior survival (case-006 standard):** dark-roast rule substance stated exactly once, complete (CM200 home-only + 15g dose + visual alternative + cup-side tell + not-blocking + purchased-lot fallback + carve-out); measurement-availability asymmetry rule body untouched; Axis-1 strategy table / pivot-destination heuristics / iteration-width ladder / Step 4 field skeleton + Output Format + pours/valve conventions / Water Recipe block / archive lookup paths all byte-identical.
- **h2 load-anchor check:** heading-set diff vs origin/main EMPTY; the 4 anchors pinned by [.claude/skills/brew/SKILL.md](.claude/skills/brew/SKILL.md) (Steps 1-3) + [docs/prompts/bundled-brewing-completion.md](docs/prompts/bundled-brewing-completion.md) (Step 4) all verified verbatim (em-dashes in headings preserved).
- **Inbound checks:** repo-wide `operational-guide.md#` grep — one inbound anchor (`#step-4--resolved-brew-output-format` from roast-to-brew-translation.md), heading unchanged, still resolves; no external doc quotes the removed provenance stamps (grep clean outside the prep report + the ccil observing ledger, both correct).
- **Verification:** `npm run check:doc-sizes` all Tier-1 within cap (51.0/60 approaching-band only); `npm run check:doc-links` 0 live misses (425 files).

## Transcript / detailed log

Executed 2026-07-08 in a single Claude Code session from the ratified prep report; no operator forks beyond the pre-ratified spec (judgment calls above resolved within its stated criteria).
