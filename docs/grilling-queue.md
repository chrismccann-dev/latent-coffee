# Grilling queue

Standing list of concepts, terminology, and framing questions for the next `/grill-with-docs` session. Append items as they surface during dog-food sessions, sprint reviews, audit work, or anywhere claude.ai shows substrate ambiguity. Drained at each grill pass — landed terminology goes to [CONTEXT.md](CONTEXT.md), decisions go to [docs/adr/](docs/adr/), sub-skill cluster docs absorb operational detail.

Per [feedback_grilling_refresh_at_feature_ship](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_refresh_at_feature_ship.md): grilling fires at the start/end of every feature ship. Between ships, this queue accrues — keeps candidates from being lost to chat scrollback.

## How to use

- **Append** anytime a vocabulary question / framing ambiguity / unlock-decision surfaces. Include the source (which sprint, which lot, which session) so the grill has context.
- **Grade** items by readiness:
  - **READY** — enough data / decisions to lock at the next grill
  - **OBSERVING** — needs more lived data first (count required observations if known)
  - **BRAINSTORM** — concept still fluid; grill explores the shape before naming
- **Drain at grill** — each item lands as a CONTEXT.md entry, ADR, sub-skill cluster doc patch, or "no action — common understanding confirmed." Move to § Resolved with date + landing target.

This is distinct from [feedback_mcp_continuous_log.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md): friction log is bug/fix-shaped per-session journal; grilling queue is concept-clarification-shaped standing list. Different intent, different drain cadence.

---

## Outstanding queue

### From Sprint R Phase 4 kickoff brief (2026-05-21 — Step 4 topics)

1. **CCIL framing** — when is a pattern "cross-domain" vs internal-to-Historian? The Sudan Rume seed pattern in [docs/skills/ccil/cluster/coffee/sudan-rume/across-roasting-and-brewing.md](docs/skills/ccil/cluster/coffee/sudan-rume/across-roasting-and-brewing.md) is the working example. What terms got introduced (variety throughline, per-layer mechanics, vehicle-dependency rule's process-scoped vs variety-scoped split)?
   - **Grade:** READY
   - **Source:** [docs/sprints/post-architecture-validation-kickoff-2026-05-21.md](sprints/post-architecture-validation-kickoff-2026-05-21.md) § Step 4
   - **Suggested landing:** CONTEXT.md entries for the introduced terms

2. **Master-doc redirect stubs** — is `BREWING.md` / `ROASTING.md` still a coherent noun, or do we say "the brewing reference architecture"? CONTEXT.md may need entries for "redirect stub" / "cluster path" / "operator-guide" / "operational-guide" (the per-tier shape distinction matters — coordinator's operator-guide is cross-domain; brewing-assistant's operational-guide is domain-specific).
   - **Grade:** READY
   - **Source:** Sprint R Phase 4 kickoff brief § Step 4
   - **Suggested landing:** CONTEXT.md entries

3. **3-tier sub-skills vocabulary** — Knowledge / Workflow / CCIL tiers + Master Coordinator router. Chris's day-to-day terminology may not match the architectural terms; surface the drift.
   - **Grade:** READY
   - **Source:** Sprint R Phase 4 kickoff brief § Step 4
   - **Suggested landing:** CONTEXT.md entries

4. **Per-lot directory structure** — `cluster/active-lots/<lot>.md` vs `cluster/learnings/<lot>.md` vs `cluster/one-shot-calibrations/<lot>.md`. 3 lifecycle dimensions mapped to 3 directories. Does this match Chris's mental model?
   - **Grade:** READY
   - **Source:** Sprint R Phase 4 kickoff brief § Step 4
   - **Suggested landing:** CONTEXT.md entry on the per-lot directory taxonomy

5. **Pattern F (decomposition) tripwires** — 120KB total cluster / 60KB single doc. When does Chris consider a cluster "too big"? When does decomposition fire?
   - **Grade:** READY
   - **Source:** Sprint R Phase 4 kickoff brief § Step 4
   - **Suggested landing:** ADR (likely amends ADR-0013) or CONTEXT.md threshold entry

6. **Substrate-practice gap audit (Practice-to-substrate)** — is there lived practice from the last 1-2 months that hasn't been captured in any cluster doc? Grill pass should surface it.
   - **Grade:** OBSERVING (needs more dog-food sessions to surface gaps)
   - **Source:** Sprint R Phase 4 kickoff brief § Step 4
   - **Suggested landing:** sub-skill cluster doc patches via `propose_doc_changes` + CONTEXT.md as needed

### From CGLE Sudan Rume Natural V5 cupping (2026-05-21 — feedback log Round 9 / PR #216)

7. **Path C-2 naming post-fire** — Now that POD-1 trigger #4 fired on CGLE Sudan Rume V5 with sound reasoning, is "Path C-2" still the right name, or should we rename to "simulated-pourover gate" now even before the full POD-1 rewrite? The cluster doc framing is currently "preserve C-2 framing pending more data" but the rename could happen at the next vocabulary lock.
   - **Grade:** OBSERVING (1 lived C-2 fire so far; want 2-3 for confidence)
   - **Source:** [feedback_mcp_continuous_log.md Round 9](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md) / [PR #216](https://github.com/chrismccann-dev/latent-coffee/pull/216)
   - **Suggested landing:** [cluster/pod-1-routing.md](skills/cupping-specialist/cluster/pod-1-routing.md) framing update + CONTEXT.md vocabulary entry

8. **WB-to-ground delta as primary signal** — V5 surfaced delta 3.1 (reference 169) vs 15.7 (V5A 187) as the structural anomaly indicator. Is this a locked threshold heuristic or just observation? Want to lock if multi-lot data supports.
   - **Grade:** OBSERVING (1 data point; want 2-3 contrasting cases — both low-delta clean and high-delta anomalous — to calibrate threshold)
   - **Source:** feedback_mcp_continuous_log.md Round 9 / PR #216
   - **Suggested landing:** [roest-knowledge/cluster/machine/counterflow-observations.md](skills/roest-knowledge/cluster/machine/counterflow-observations.md) (under "WB→Ground delta" section) + CONTEXT.md threshold entry

9. **Recipe-noun discipline triple verification** — "recipe" (roast_recipes row) vs "Roest profile" (JSON artifact on tablet) vs "anchor profile" (transferable V1 framework from cluster docs). Claude.ai handled all three cleanly in V5; want to verify the 3-way distinction is locked in CONTEXT.md the way the V5 session used it.
   - **Grade:** READY (3 nouns are well-established; just verify lock)
   - **Source:** feedback_mcp_continuous_log.md Round 9 / PR #216
   - **Suggested landing:** CONTEXT.md (likely already has these — verify against lived V5 usage)

10. **Half-migrated lot taxonomy** — V5 was `push_roast_profile`-pushed but `push_roast_recipe`-never-called. Are there other half-migrated patterns worth named detection criteria? Should STAGE 0 detection expand to a typology (recipe-row-missing / predicted_cup-missing / updated_cup_prediction-missing / taste_for-missing)?
    - **Grade:** BRAINSTORM (single instance; need more half-migrated lots to define the typology)
    - **Source:** feedback_mcp_continuous_log.md Round 9 / PR #216
    - **Suggested landing:** [log-cupping.md](prompts/log-cupping.md) STAGE 0 expansion + cluster/pod-1-routing.md if pattern-shaped

---

## Resolved (append-only history)

When grill items resolve, move them here with date + landing target. Format:

```
- **<Item name>** — resolved YYYY-MM-DD. Landed as: <CONTEXT.md entry / ADR-NNNN / cluster doc patch / no action>. Source PR: #NNN.
```

(none yet — populated as the next grill session drains items)
