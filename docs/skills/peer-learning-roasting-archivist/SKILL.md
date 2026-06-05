# Peer-Learning Roasting Archivist

**Tier:** Knowledge / **Domain:** Roasting / **Wave:** 3 / **Status:** ACTIVE (Wave 3 PR 1 shipped 2026-05-26)
**ADR origin:** [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](docs/adr/0012-master-coordinator-pattern.md) + [ADR-0013](docs/adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain a corpus of external peer-roaster knowledge specifically for Roest L200 Ultra / counterflow practitioners. **Low-volume, operator-curated** (per Chris's Round 2 reframing) — roasting is too machine-specific and method-specific to warrant broad web-scraping; net additions happen as Chris encounters specific peer content (e.g. Dongzhe livestream) and integrates manually.

**Two content types** (Cluster A, 2026-06-01 added the second):
1. **Peer-roaster technique** — external practitioners Chris learns method from (Dongzhe livestreams etc.). `cluster/per-peer/` + `cluster/cross-peer/`.
2. **Peer-variant handoffs** — an external roaster's version of one of Chris's *own* green lots, bought as a calibration anchor (~25-30%+ of lots), assessed brewing-side at completion via `peer-variant-completion.md` and consumed here. `cluster/peer-variant-handoffs.md`. This skill owns the consumption reasoning (§ Peer-variant handoff consumption) and is the durable home for filed (green-lot-exists) handoffs.

## Knowledge cluster contents (target Wave 3)

- `cluster/per-peer/<peer-roaster>.md` — one file per peer roaster (Dongzhe, etc.); authored from livestream transcripts, blog posts, podcasts as Chris encounters them
- `cluster/cross-peer/patterns.md` — cross-peer synthesis when ≥3 peer references converge on the same pattern (low-volume aggregation)
- `cluster/source-index.md` — what's been pulled in, when, and from where (provenance + freshness tracking)
- `cluster/peer-variant-handoffs.md` — durable home for filed peer-variant handoffs (the 5-field calibration assessment per green lot that has a peer-roasted variant + an existing green row); seeded Cluster A 2026-06-01 with Fazenda Um Wush Wush Natural + CGLE Sudan Rume Natural

## Peer-variant handoff consumption

A *peer-variant handoff* is a calibration anchor distinct from peer-roaster technique: an external roaster's version of one of *my own* green lots, assessed brewing-side at completion (5 fields: pairing+provenance / info-value rating / bean-vs-roast split / roast-design takeaway / discount list), written via `peer-variant-completion.md`. This skill owns how to *consume* it.

**Weight by info-value rating (the dial):**
- **High** (same lot, roast near my light / ultra-light window) → lean on the roast-design takeaway; most of the cup is bean signal.
- **Medium** (roast somewhat off window) → partial; treat the takeaway as a hypothesis, discount the roast-developed register, and watch for hypothesis-*confirmation* (e.g. "roasts fast / dark, bias lighter").
- **Low** (roast overtakes everything — variety / origin / process stop mattering) → mostly a discount list; design fresh. The one transferable signal is usually "the green carries enough aromatic reserve to survive even a brutal roast."

**The discount list is always load-bearing**, regardless of rating — it names the roast-contaminated notes that must NOT drive roast design ("if my own roast produces this, I overshot").

**Consult per lifecycle stage:**
- *Pre-V1 (green in inventory, not started)* → fold the handoff into `start-lot.md` V1 design (the locked requirement that peer learnings reach V1 before the first recipes are generated). Janson case.
- *About to design V2 (V1 cupping ambiguous)* → use it to set the adjustment direction. Wush Wush case.
- *Deep in V-sets* → cross-check the handoff against accumulating cup data. Sudan Rume case.
- *Cycle already done, peer variant found after* → philosophy comparison only, no roast action; file for future similar lots.

**Filed vs courier-carried (operator preference, Cluster A):**
- **Green lot exists** → set `green_beans.peer_reference_brew_id` + file the handoff in `cluster/peer-variant-handoffs.md` (its durable home).
- **Green lot doesn't exist yet** (not-yet-started peer lot) → the operator carries the handoff (saves it, pastes at `start-lot.md`); do NOT require a pre-lot check-in here — low volume, the operator knows which are peer-for-future. It can be filed here once the lot actually starts and the learning folds into V1. Janson is the canonical courier-carried case.

## Inputs

- Operator-watch list (low-volume curation; operator decides when to pull new peer content)
- Specific peer content events (livestream, podcast episode, blog post)

## Outputs

- Per-peer profile docs + cross-peer pattern synthesis when threshold met

## Called by / Calls

- **Called by:** Roasting Assistant (when evaluating novel approaches), CCIL (during cross-domain synthesis), `start-lot.md` (peer-variant pickup → V1 design) + Cupping Specialist / `log-cupping.md` (consult a filed peer-variant handoff when setting V_n adjustment direction)
- **Calls:** None

## MCP Tools in scope

None directly.

## Self-improvement

- **Patterns:** B (external-event refresh when operator surfaces new peer content), I (operator-initiated resource integration — the canonical workflow for this sub-skill) — see [ADR-0013](docs/adr/0013-self-improvement-primitives.md)
- **Signal:** operator brings new peer content (e.g. "Dongzhe just dropped a new livestream; pull the transcripts and integrate") → Pattern I session in Claude Code

## Notes for Wave 3 implementation sprint

- **Chris-stubbed cluster** per Round 2 lock — operator does the research + initial format proposal + stub authoring; Claude Code integrates into the architecture and applies.
- **Web-fetch caching NOT needed** per Round 2 Round 4 confirmation — roasting is too machine-specific for broad scraping; peer content arrives episodically (a livestream now, another in 6 months) and is treated as one-off Pattern I events, not autonomous external monitoring.
- **First peer to stub:** Dongzhe (Chris's named example with prior livestream content).
- **Cross-system audit:** Actor 6 (new directory tree), Actor 4 (MCP Resource registration for each new doc), Actor 5 (CLAUDE.md notes the sub-skill exists), Actor 2 (start-lot.md / log-roast.md may reference for novel-approach context once content exists), Actor 3 (catalog refresh), Actor 1 (Roasting Assistant gets peer-pattern anchors during recipe construction).
