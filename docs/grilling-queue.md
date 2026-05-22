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

### From Round 10 dog-food haul (2026-05-22 — Sudan Rume Path A close + Higuito first full close-lot.md + Wush Wush first start-brew)

11. **Slug-convention drift between active-lots/ and learnings/** — active-lots/ uses lot-code-style slugs (`cos-hig-bor-2026.md` / `cgle-srume-natural-2026.md`); learnings/ uses producer/cultivar-readable slugs (`cgle-mandela-xo.md` / `gv-oma-lot-25-035.md`). Higuito learnings landed at `cos-hig-bor-2026.md` (lot-code style, pragmatic match-the-active-lot choice). Three lock-in options: (a) lot-code across both = uniform + trivial cross-ref, (b) producer/cultivar across both = more readable + matches existing 7 learnings files, (c) formalize the split (active-lots = lot-code, learnings = producer/cultivar).
    - **Grade:** READY (3 lock-in options, all defensible)
    - **Source:** Round 10 / PR landing this entry
    - **Suggested landing:** CONTEXT.md entry on slug-convention + close-lot.md STAGE 5 update + ARBITER.md routing note

12. **Candidate run-off pourover concept needs a name** — between Path C-2 discriminator (resolves leading-slot identity) and close-lot.md optimized brew (full dial-in), there's an undefined intermediate "candidate run-off" step where 2-3 finalists are brewed at a confirmed-but-not-optimized recipe to break a tie. Currently both the discriminator cupping and the run-off cupping share `recipe_variant: real_pourover`. Schema scoping options: (a) `is_run_off: bool` flag on cuppings; (b) dedicated `recipe_variant: 'run_off'` value; (c) `run_off_brew_recipe text` field; (d) leave as-is (no formal concept, just thread prose).
    - **Grade:** OBSERVING (1 lived instance — Sudan Rume V5A vs 169; want 2-3 more to lock the shape)
    - **Source:** Sudan Rume V5A vs 169 session / Round 10
    - **Suggested landing:** CONTEXT.md vocabulary entry + cluster/pod-1-routing.md schema scoping update + possible cuppings schema migration

13. **Rest-days drift as structured field vs prose-only** — currently flagged via `additional_notes` prefix `REST_DAYS_DRIFT: ...` per protocol. Not queryable. When comparing candidates across multiple V-sets at different ages (Sudan Rume V5A Day 9 vs 169 Day 17), the rest drift becomes a confounding variable that should be filter-able in cross-lot SQL queries. Schema candidate: `cupping_age_days` (derived) + `rest_drift_flag` (boolean or magnitude) on cuppings.
    - **Grade:** OBSERVING (1 lived instance with large drift, +10 days; want a few more before locking thresholds)
    - **Source:** Sudan Rume V5A vs 169 session / Round 10
    - **Suggested landing:** cuppings schema migration + close-lot.md / log-cupping.md prompt update

14. **Brewer-rotation tiebreaker logic** — operational-guide's rotation table maps cup-goal categories ("balanced fruit sweetness") to multiple brewers ("April / Kalita") with no tiebreaker. Wush Wush session broke tie on rotation-debt + integration pattern (April for round mid-palate; Kalita for body+sweetness extension), which was sound but discretionary. Suggested fix: tiebreaker column or one-liner ("April when integration / round mid-palate is the goal; Kalita when body / sweetness extension is wanted").
    - **Grade:** READY
    - **Source:** Wush Wush start-brew / Round 10 / item 10
    - **Suggested landing:** brewing-assistant operational-guide rotation table update OR brewing-equipment-expert operational-reference rotation framework update

15. **Medium-roast specialty natural pattern promotion** — Wush Wush is the first archived medium-roast specialty natural. operational-guide now has a "Roaster roast-level hook" but the pattern is observation-only (1 lot). When 2-3 medium-roast specialty naturals confirm the over-extraction-risk-is-roast-character lever (evaluate cooler, accept chocolatier register), promote from operational-guide observation to a brewing-historian CCIL entry.
    - **Grade:** OBSERVING (1 lot; want 2-3 confirming)
    - **Source:** Wush Wush start-brew / Round 10 / item 8
    - **Suggested landing:** brewing-historian/cluster/patterns/cross-coffee-insights.md new entry; promote when threshold met

16. **CONTEXT.md split-or-anchor-fetch** — 437KB exceeds context window on `read_doc`; claude.ai falls back to grep. The file has a Brewing section at line 444. Two options: (a) split into context-brewing.md + context-roasting.md + shared, OR (b) update session-start prompts to use `read_doc_section` against the relevant anchor only.
    - **Grade:** READY (option (b) is the quick mitigation; option (a) is the proper fix)
    - **Source:** Wush Wush start-brew / Round 10 / item 9
    - **Suggested landing:** docs sprint OR session-start prompt fix in start-brew.md / start-lot.md / log-cupping.md / log-roast.md / close-lot.md / one-shot.md / one-shot-closeout.md / bundled-brewing-completion.md / propose-doc-changes-from-brew.md

17. **Roasted-variant-of-same-green workflow modeling** — Chris buys the roasted variant of ~25-30% of his green-bean lots from the same source as a calibration anchor for the roasting side. Currently lives outside the data model. His instinct: keep separate. Worth grilling once 2-3 more such pairs exist (Wush Wush is one; Untold's roasted Fazenda Um is the discriminator pair). Decision space: (a) keep fully separate (current); (b) FK link on green_beans pointing at the external roasted brew's `brew_id`; (c) a `peer_reference_brews` join table.
    - **Grade:** BRAINSTORM (1-2 lived instances; concept still fluid)
    - **Source:** Wush Wush start-brew (peer-roasted Untold variant as roasting-side calibration anchor) / Round 10 / item 14
    - **Suggested landing:** schema design decision; logged separately as future roadmap item in PRODUCT.md § Longer Term Items

### From Round 11 Wush Wush full brewing iteration + bundled-brewing-completion (2026-05-22)

18. **Switch open-drawdown coarsen-for-faster-rinse — generalizes beyond Intensity-Clarity Split?** — Wush Wush session surfaced the counterintuitive lever "coarsen the bed so the open phase drains as a true fast rinse — on Hybrid the open phase is a rinse, not an extraction." Documented in hybrid.md for Intensity-Clarity Split. Open question: does this lever apply to other Hybrid sub-forms (Sequential, Phase-Mapped, Selective Bloom) or is it specific to Intensity-Clarity Split? If general, it belongs in `brewers.md § Hario Switch` (or the broader hybrid.md operating section) as a Switch operating note rather than a per-sub-form callout.
    - **Grade:** OBSERVING (1 lived data point on 1 sub-form; want 2-3 more brews across other sub-forms)
    - **Source:** Round 11 / Wush Wush Brew 4
    - **Suggested landing:** brewing-equipment-expert/cluster/brewers.md § Hario Switch operating note (if general) OR hybrid.md per-sub-form callout (if specific)

19. **Strategy-pivot pivot-destination heuristics — promote to CCIL?** — operational-guide Step 3 now has a "Pivot-destination heuristics" block mapping residual-problem SHAPE to target strategy (single-axis loud → Suppression; two-opposing-goals → Hybrid Intensity-Clarity Split; aromatic-vs-structural-decoupling → Hybrid Selective Bloom; temperature-cliff → Hybrid Temperature-Staged; heavy-process-loud → Suppression; quiet-buried-under-roast → Hybrid or Extraction Push). Shipped as operational-guide content but may belong in CCIL (Cross-Coffee Insight Layer) once 2-3 more strategy pivots fire that test the heuristics.
    - **Grade:** OBSERVING (1 lived pivot validated the heuristics; want 2-3 more pivots — across different residual-problem shapes — to confirm the mapping holds)
    - **Source:** Round 11 / Wush Wush Brew 2 → Brew 3 pivot
    - **Suggested landing:** brewing-historian/cluster/patterns/cross-coffee-insights.md CCIL entry; promote when threshold met

20. **Medium-roast handling — load-bearing OR "named consideration"?** — Round 10 shipped a medium-roast hook in operational-guide Step 1 as a "named consideration." Round 11's Wush Wush iteration showed it should have LED strategy selection, not been a footnote. Question for grilling: is the hook prominent enough in its current form, OR should "roast level" be promoted to a Process / Variety / Roast-Level signal flag at Step 1b (parallel to the existing Process and Variety signals) so claude.ai weights it as a first-class driver rather than discretionary?
    - **Grade:** OBSERVING (1 lot + 1 strong iteration-time validation; want 1-2 more medium-roast specialty naturals to confirm the load-bearing framing)
    - **Source:** Round 11 / Wush Wush iteration / item 9
    - **Suggested landing:** operational-guide Step 1b signal-table promotion OR keep as Step 1 named consideration (decision is the grill's)

21. **tool_search ranking collision pattern — substrate convention?** — Round 11's BLOCKING bug surfaced a general convention question: when Tool A describes itself as "Sibling of Tool B" or otherwise embeds Tool B's name in its description, Tool A ranks for queries containing Tool B's name. Lesson: every Tool description should be SELF-CONTAINED (describe what the Tool DOES, not what its siblings do or how it relates to them). Currently shipped: patch_brew + list_canonicals descriptions de-cross-referenced from push_brew. Open question: are there other cross-references in the Tool description corpus that haven't fired yet but could? Worth a sweep + a convention lock.
    - **Grade:** READY (one-shot description audit; convention lock is the substrate output)
    - **Source:** Round 11 / push_brew BLOCKING bug
    - **Suggested landing:** ARBITER.md or operator-guide.md description-writing convention + audit-pass sprint to sweep all Tool descriptions

## Resolved (append-only history)

When grill items resolve, move them here with date + landing target. Format:

```
- **<Item name>** — resolved YYYY-MM-DD. Landed as: <CONTEXT.md entry / ADR-NNNN / cluster doc patch / no action>. Source PR: #NNN.
```

(none yet — populated as the next grill session drains items)
