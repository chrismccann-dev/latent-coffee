# Peer-Learning Roasting Archivist

**Tier:** Knowledge / **Domain:** Roasting / **Wave:** 3 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain a corpus of external peer-roaster knowledge specifically for Roest L200 Ultra / counterflow practitioners. **Low-volume, operator-curated** (per Chris's Round 2 reframing) — roasting is too machine-specific and method-specific to warrant broad web-scraping; net additions happen as Chris encounters specific peer content (e.g. Dongzhe livestream) and integrates manually.

## Knowledge cluster contents (target Wave 3)

- `cluster/per-peer/<peer-roaster>.md` — one file per peer roaster (Dongzhe, etc.); authored from livestream transcripts, blog posts, podcasts as Chris encounters them
- `cluster/cross-peer/patterns.md` — cross-peer synthesis when ≥3 peer references converge on the same pattern (low-volume aggregation)
- `cluster/source-index.md` — what's been pulled in, when, and from where (provenance + freshness tracking)

## Inputs

- Operator-watch list (low-volume curation; operator decides when to pull new peer content)
- Specific peer content events (livestream, podcast episode, blog post)

## Outputs

- Per-peer profile docs + cross-peer pattern synthesis when threshold met

## Called by / Calls

- **Called by:** Roasting Assistant (when evaluating novel approaches), CCIL (during cross-domain synthesis)
- **Calls:** None

## MCP Tools in scope

None directly.

## Self-improvement

- **Patterns:** B (external-event refresh when operator surfaces new peer content), I (operator-initiated resource integration — the canonical workflow for this sub-skill) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** operator brings new peer content (e.g. "Dongzhe just dropped a new livestream; pull the transcripts and integrate") → Pattern I session in Claude Code

## Notes for Wave 3 implementation sprint

- **Chris-stubbed cluster** per Round 2 lock — operator does the research + initial format proposal + stub authoring; Claude Code integrates into the architecture and applies.
- **Web-fetch caching NOT needed** per Round 2 Round 4 confirmation — roasting is too machine-specific for broad scraping; peer content arrives episodically (a livestream now, another in 6 months) and is treated as one-off Pattern I events, not autonomous external monitoring.
- **First peer to stub:** Dongzhe (Chris's named example with prior livestream content).
- **Cross-system audit:** Actor 6 (new directory tree), Actor 4 (MCP Resource registration for each new doc), Actor 5 (CLAUDE.md notes the sub-skill exists), Actor 2 (start-lot.md / log-roast.md may reference for novel-approach context once content exists), Actor 3 (catalog refresh), Actor 1 (Roasting Assistant gets peer-pattern anchors during recipe construction).
