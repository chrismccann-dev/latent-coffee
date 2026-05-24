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

2a. **Workflow-sub-skill file rename to "process" framing** — `brewing-assistant/cluster/operational-guide.md` covers the FULL brewing process (intake + iteration + archive); `roasting-assistant/cluster/onboarding-protocol.md` covers only STAGE 1 of the roasting process (green-bean intake → first 3 roasts). The asymmetry reflects real structural differences (brewing short-cycle / roasting state-heavy multi-stage), but the naming would benefit from Chris's umbrella mental model: "the roasting process" / "the brewing process," with onboarding-protocol becoming a stage section under a `roasting-process.md` umbrella. Defer until the roasting-assistant cluster grows additional stage docs (cupping-protocol.md / iteration-protocol.md / close-protocol.md) — at that point the rename becomes more obvious. **Today's path forward:** keep current names, lock the vocabulary distinction in CONTEXT.md (done 2026-05-23 grill, Item 2), revisit rename when the multi-stage roasting cluster fills in.
   - **Grade:** OBSERVING (deferred pending additional roasting-stage cluster docs)
   - **Source:** Item 2, Sprint R Phase 4 Step 4 grill (2026-05-23)
   - **Suggested landing:** rename sprint when triggered; updates Operator-guide / operational-guide / onboarding-protocol / operational-reference CONTEXT.md entry to retire the "open rename question" flag

5a. **PRODUCT.md compaction sprint** — Chris-flagged at Item 5 grill (2026-05-23): PRODUCT.md is at 140 KB > 120 KB root-level living doc threshold per ADR-0014. Standing offer from Chris: "if you notice that, and this is a big limitation, you can kinda make a note of that for me. And then I'm happy to spin up a parallel session to go fix it." This is the flag — PRODUCT.md compaction is a parallel-session candidate independent of the main grilling pass. Sprint scope: identify highest-leverage sections (likely Active Sprints / Roadmap / Scaling Watch-Items duplication with PRODUCT.md elsewhere), compact / split into per-zone sections if needed, ship under 120KB.
    - **Grade:** READY (Chris-blessed parallel session, can fire any time)
    - **Source:** Item 5, Sprint R Phase 4 Step 4 grill (2026-05-23) + lived audit
    - **Suggested landing:** dedicated parallel compaction session — separate from the grilling-pass main session

5b. **Empirical claude.ai context-window measurement (cross-party grill)** — Chris-offered at Item 5 grill (2026-05-23): "if we need to do another claude.ai grilling session between you, Claude, and claude.ai, to figure out how much it could accurately retain and what the context scope creep is on it, I'm okay to do that." The 50% context-window heuristic that anchors ADR-0014's pattern-aware tier thresholds is a best-guess; lived measurement (instrument a typical brewing + roasting session, capture substrate-pull totals via Tool-call logs, observe quality degradation patterns at specific token thresholds) would replace the heuristic with calibrated numbers. Could shift any of the 7-tier thresholds up or down materially.
    - **Grade:** READY (cross-party session needed; Chris-offered, not yet scheduled)
    - **Source:** Item 5, Sprint R Phase 4 Step 4 grill (2026-05-23) — Chris-offered cross-party session
    - **Suggested landing:** dedicated cross-party grilling session — Chris + Claude Code + claude.ai instrumented; outputs ADR-0014 amendment with empirical thresholds

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


10. **Half-migrated lot taxonomy** — V5 was `push_roast_profile`-pushed but `push_roast_recipe`-never-called. Are there other half-migrated patterns worth named detection criteria? Should STAGE 0 detection expand to a typology (recipe-row-missing / predicted_cup-missing / updated_cup_prediction-missing / taste_for-missing)?
    - **Grade:** BRAINSTORM (single instance; need more half-migrated lots to define the typology)
    - **Source:** feedback_mcp_continuous_log.md Round 9 / PR #216
    - **Suggested landing:** [log-cupping.md](prompts/log-cupping.md) STAGE 0 expansion + cluster/pod-1-routing.md if pattern-shaped

---

### From Round 10 dog-food haul (2026-05-22 — Sudan Rume Path A close + Higuito first full close-lot.md + Wush Wush first start-brew)


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

16. **CONTEXT.md zone split (promoted to next-sprint candidate at Item 3 grill, 2026-05-23)** — 437KB exceeds context window; claude.ai falls back to grep. **Chris re-flagged at Item 3 grill:** "we probably need to plan to break these things up... I'm about to do a brewing side, here's the context around the brewing side." Locks option (a) — split into `context-roasting.md` + `context-brewing.md` + `context-shared.md` (aligned to the **Zone** vocabulary locked in Item 3). Each session-start prompt loads only the relevant zone(s) + shared, dropping ~half the context-window cost per session. Sprint scope: re-organize CONTEXT.md by zone, update all references (CLAUDE.md / MCP catalog / docs/prompts/*.md / sub-skill SKILL.md), shipped as a single docs sprint. Probably the highest-priority post-grilling sprint candidate.
    - **Grade:** READY → **next-sprint candidate** (promoted from option (b) deferred fix to option (a) full split at Item 3 grill, 2026-05-23)
    - **Source:** Wush Wush start-brew / Round 10 / item 9 + Item 3 Sprint R Phase 4 Step 4 grill / 2026-05-23
    - **Suggested landing:** dedicated docs sprint — re-organize CONTEXT.md by zone + propagate refs across MCP catalog + prompts + SKILL.md files

16c. **Substrate pruning discipline** — Chris-flagged at Item 4 grill (2026-05-23): "we probably need to also actively take away things from these documents... we're not just getting big to get too big sake, only the things that are most important... that's the thing that surfaces at the right time, not just a bunch of unnecessary stuff." The compounding-knowledge loop has both ADDS and REMOVES; without pruning, compounding becomes bloat. Today every sub-skill / cluster doc grows monotonically — no formal section-level pruning mechanism. Candidate pruning mechanisms: (a) periodic pruning pass in the arbiter (analog to skeleton review) where Claude Code surfaces stale / over-detailed sections and Chris decides delete/archive/keep; (b) per-cluster size tripwires beyond Pattern F's 120KB / 60KB (e.g. per-section recency markers — "no edits in 90 days + no read references = prune candidate"); (c) hard-cap policy per cluster doc with forcing function to compress when exceeded; (d) section-recency metadata stored in frontmatter to enable mechanical "last-touched > N days" queries. Distinct from Pattern F (which is cluster-level decomposition); pruning is section-level removal.
    - **Grade:** BRAINSTORM (mechanism design needed; pruning candidates exist today but no formal process; possibly amends ADR-0013's self-improvement primitives)
    - **Source:** Item 4, Sprint R Phase 4 Step 4 grill (2026-05-23)
    - **Suggested landing:** future sprint scoping the pruning mechanism + ADR (likely amends ADR-0013)

16b. **Sub-skill rename to `<X> Expert` framing** — Chris's lived speech collapses all sub-skills into "experts" (roasting expert / brewing expert / equipment expert / cupping expert / Roest expert / etc.) with implicit parent-child relationships. Architecturally substrate uses formal names (Roasting Assistant / Brewing Assistant / Cupping Specialist / Roest API Worker / etc.). Vocabulary alias locked in CONTEXT.md (Item 3 grill, 2026-05-23). **Full rename candidate:** flatten all sub-skill substrate names to `<X> Expert` if lived speech consistently outweighs architectural distinctions. **Defer because:** rename touches 18 SKILL.md headers + MCP catalog Resource URIs + propose_doc_changes target_doc allow-list + every cross-doc reference in CONTEXT.md / CLAUDE.md / PRODUCT.md / ARBITER.md / sub-skill clusters / prompts (~150+ refs). Promote only if Chris's lived speech persistently uses Expert and the architectural names create friction.
    - **Grade:** OBSERVING (defer pending sustained lived-speech evidence)
    - **Source:** Item 3, Sprint R Phase 4 Step 4 grill (2026-05-23)
    - **Suggested landing:** dedicated rename sprint when triggered; updates CONTEXT.md § Sub-skill tiers entry to retire the "future rename candidate" flag

17. **Roasted-variant-of-same-green workflow modeling** — Chris buys the roasted variant of ~25-30% of his green-bean lots from the same source as a calibration anchor for the roasting side. Currently lives outside the data model. His instinct: keep separate. Worth grilling once 2-3 more such pairs exist (Wush Wush is one; Untold's roasted Fazenda Um is the discriminator pair). Decision space: (a) keep fully separate (current); (b) FK link on green_beans pointing at the external roasted brew's `brew_id`; (c) a `peer_reference_brews` join table.
    - **Grade:** BRAINSTORM (1-2 lived instances; concept still fluid)
    - **Source:** Wush Wush start-brew (peer-roasted Untold variant as roasting-side calibration anchor) / Round 10 / item 14
    - **Suggested landing:** schema design decision; logged separately as future roadmap item in PRODUCT.md § Longer Term Items

### From Round 11 Wush Wush full brewing iteration + bundled-brewing-completion (2026-05-22)

18. **Switch open-drawdown coarsen-for-faster-rinse — generalizes beyond Intensity-Clarity Split?** — Wush Wush session surfaced the counterintuitive lever "coarsen the bed so the open phase drains as a true fast rinse — on Hybrid the open phase is a rinse, not an extraction." Documented in hybrid.md for Intensity-Clarity Split. Open question: does this lever apply to other Hybrid sub-forms (Sequential, Phase-Mapped, Selective Bloom) or is it specific to Intensity-Clarity Split? If general, it belongs in `brewers.md § Hario Switch` (or the broader hybrid.md operating section) as a Switch operating note rather than a per-sub-form callout.
    - **Grade:** OBSERVING (1 lived data point on 1 sub-form; want 2-3 more brews across other sub-forms)
    - **Source:** Round 11 / Wush Wush Brew 4
    - **Suggested landing:** brewing-equipment-expert/cluster/brewers.md § Hario Switch operating note (if general) OR hybrid.md per-sub-form callout (if specific)


20. **Medium-roast handling — load-bearing OR "named consideration"?** — Round 10 shipped a medium-roast hook in operational-guide Step 1 as a "named consideration." Round 11's Wush Wush iteration showed it should have LED strategy selection, not been a footnote. Question for grilling: is the hook prominent enough in its current form, OR should "roast level" be promoted to a Process / Variety / Roast-Level signal flag at Step 1b (parallel to the existing Process and Variety signals) so claude.ai weights it as a first-class driver rather than discretionary?
    - **Grade:** OBSERVING (1 lot + 1 strong iteration-time validation; want 1-2 more medium-roast specialty naturals to confirm the load-bearing framing)
    - **Source:** Round 11 / Wush Wush iteration / item 9
    - **Suggested landing:** operational-guide Step 1b signal-table promotion OR keep as Step 1 named consideration (decision is the grill's)

21. **tool_search ranking collision pattern — substrate convention?** — Round 11's BLOCKING bug surfaced a general convention question: when Tool A describes itself as "Sibling of Tool B" or otherwise embeds Tool B's name in its description, Tool A ranks for queries containing Tool B's name. Lesson: every Tool description should be SELF-CONTAINED (describe what the Tool DOES, not what its siblings do or how it relates to them). Currently shipped: patch_brew + list_canonicals descriptions de-cross-referenced from push_brew. Open question: are there other cross-references in the Tool description corpus that haven't fired yet but could? Worth a sweep + a convention lock.
    - **Grade:** READY (one-shot description audit; convention lock is the substrate output)
    - **Source:** Round 11 / push_brew BLOCKING bug
    - **Suggested landing:** ARBITER.md or operator-guide.md description-writing convention + audit-pass sprint to sweep all Tool descriptions

### From Round 11 continuation (2026-05-22) — Wush Wush push retry

22. **Terroir resolver cross-country fuzzy-match bug** — when `push_brew` receives an unregistered `macro_terroir`, the resolver fuzzy-matches against ALL canonical macros globally rather than scoping to the supplied `country`. Round 11 continuation caught: input `macro_terroir: "Minas Gerais"` for Brazil cross-matched to `"Mindanao Highlands"` (Philippines — alphabetically adjacent "Min..." string) and the error message reported the wrong-country macro as the "did you mean?" suggestion. Fix: scope fuzzy-match candidates to (country, macro) pairs so a Brazil macro can only fuzzy-match against Brazil macros. Lib path likely `lib/brew-import.ts findOrCreateTerroir` or the underlying canonical resolver.
    - **Grade:** READY (clear fix scope, single lib file change)
    - **Source:** Round 11 continuation / 2026-05-22 push_brew retry on Wush Wush
    - **Suggested landing:** lib/brew-import.ts (or wherever terroir fuzzy-match lives) + add test case for cross-country rejection + propose_canonical_addition pointer in the error message

23. **Tool description vs runtime behavior accuracy convention** — push_brew's description previously said "FK-resolves terroir + cultivar via lazy find-or-create" without qualification. Runtime behavior is asymmetric per axis: terroir lazy-find-or-creates at the (admin_region, macro, meso) tuple level WHERE macro is registered; strict-canonical at the macro level. Description-vs-runtime drift confused claude.ai's expectation in Round 11 continuation. Convention candidate: every Tool description should accurately reflect the strictest validation path, not the most permissive. Audit candidate: sweep all `push_*` / `patch_*` descriptions for accuracy against the actual validation behavior in `lib/brew-import.ts` / `lib/mcp/push-*.ts` / `lib/mcp/patch-*.ts`.
    - **Grade:** READY (audit + convention lock)
    - **Source:** Round 11 continuation / 2026-05-22
    - **Suggested landing:** ARBITER.md or operator-guide.md description-writing convention; sweep all 9 push_* + 9 patch_* descriptions for accuracy against runtime

24. **Pre-shipped substrate during active dog-food session — coordination process** — Round 11 shipped the hybrid.md Intensity-Clarity Split entry as part of the BLOCKING-fix PR, derived from the in-progress Wush Wush session. When claude.ai later reached propose_doc_changes STAGE 2, the content was already there — claude.ai correctly paused rather than file a duplicate. Process lesson: when Claude Code pre-ships substrate updates derived from an active dog-food session (rather than waiting for claude.ai's natural propose_doc_changes path), flag the pre-populated cluster doc paths explicitly to Chris so claude.ai's session doesn't get confused at proposal time. Consider: does PR commit-message convention need a "Pre-populated substrate paths (will collide with active claude.ai proposals)" callout?
    - **Grade:** BRAINSTORM (1 lived instance; need to see if pattern repeats before locking convention)
    - **Source:** Round 11 continuation / 2026-05-22 hybrid.md proposal pause
    - **Suggested landing:** commit-message / PR-description convention update OR an operational-guide note in the bundled-brewing-completion / close-lot prompts about checking propose_doc_changes targets for recent commits

### From Round 12 — first lived one-shot lot run (2026-05-23, MH Elgon Ladies' Lot)

25. **Inventory doc roast-strategy bullets vs CCIL — substrate cleanup sprint** — V5 inventory doc has roast-strategy guidance bullets for the 10 MH Paradigm Shift lots + the 3 Taza Dorada lots that prescribe stale numeric guidance (notably "120°C hopper, trim peak 2°C if lower-density" on multiple lots — directly contradicting the Rancho Tio Emilio one-shot canonical correction of "full anchor energy, no altitude downhedge, 125°C hopper"). The "CCIL wins on numeric conflict" rule landed in one-shot.md STAGE 2 (this round) is the runtime safeguard, but the inventory doc itself still carries the stale bullets. Cleanup: propose_doc_changes pass updating each lot's hopper + peak-trim guidance to match the canonical correction. **HOLD until Day 7 Mount Elgon cupping confirms** that #133-full-energy actually lands on Ugandan terroir — if the cup confirms, the propose_doc_changes pass is backed by lived evidence; if the cup misses, the doc may need terroir-scoped guidance rather than a verbatim CCIL match.
    - **Grade:** OBSERVING (waiting on Day 7 Elgon Day 7 cup, expected ~2026-05-30)
    - **Source:** Round 12 / Mount Elgon Ladies' Lot intake (MH Paradigm Shift 2026 Uganda sample pack)
    - **Suggested landing:** propose_doc_changes pass on the V5 inventory doc lots (MH 10 + Taza Dorada 3) after Day 7 Elgon cup confirms direction

26. **Blend-cultivar formal schema modeling** — Multi-cultivar blends with some net-new members (Mount Elgon Ladies' Lot = SL28 + SL14 + Nyasaland; common pattern for East African washed lots) currently coordinated via a 4-step operator-driven pattern (representative canonical + free-text variety + propose_canonical_addition + comma-string to Roest inventory). Convention now documented in one-shot.md + start-lot.md STAGE 1. Open schema question: should `green_beans.cultivar` evolve to support multi-cultivar arrays natively (cultivar_ids[] FK array) rather than a single FK + free-text fallback? Trade-off: cleaner data model for blends vs. complexity of cultivar-aggregation queries (the current model "1 lot → 1 representative cultivar" makes by-cultivar analytics trivial).
    - **Grade:** BRAINSTORM (1 lived blend instance; need 2-3 more blends to see if pattern repeats often enough to warrant schema change)
    - **Source:** Round 12 / Mount Elgon Ladies' Lot intake
    - **Suggested landing:** schema design decision after 2-3 more blend lots accumulate; meanwhile the 4-step operator-driven convention works

27. **SL14 + Nyasaland canonical promotion** — both net-new from Round 12 intake, filed to taxonomy_overrides_queue via propose_canonical_addition. Classic East African varieties (not exotic) — likely worth direct promotion to the canonical registry rather than waiting for repeat hits. The arbiter pass on the taxonomy queue could process these together with the Untold Coffee Lab roaster + Stefano Um producer entries from Round 11.
    - **Grade:** READY (direct registry promotion via lib/cultivar-registry.ts edit + docs/taxonomies/varieties.md update)
    - **Source:** Round 12 / Mount Elgon Ladies' Lot intake (cultivar gap)
    - **Suggested landing:** lib/cultivar-registry.ts + docs/taxonomies/varieties.md when Chris runs "process pending arbitration"; can land in the same arbiter pass as Round 11's roaster/producer queue items

### From Round 13 — first full V-set lifecycle close (2026-05-23, CGLE Sudan Rume Natural)

28. **Temperature primacy extends to traditional natural aromatic landraces — CCIL promotion candidate** — Round 13 surfaced that the temperature-primacy pattern (originally documented for anaerobic naturals across 4 origins: Colombia / Ethiopia / Panama / Costa Rica) extended cleanly to a TRADITIONAL (non-anaerobic) natural Sudan Rume. The brewing iteration: 91°C over-extracted the aromatic fraction → 89°C single-variable resolve produced the target cup. claude.ai extracted this as a generalizable rule. Generalization candidate: temperature primacy applies wherever an aromatic landrace meets a natural process, anaerobic OR traditional. Promote to brewing-historian CCIL entry once 2-3 more traditional-natural aromatic landraces confirm (next candidates: any future SL-lineage / Ethiopian-landrace / 74-series natural lots in the brewing queue).
    - **Grade:** OBSERVING (1 lived data point on traditional natural; want 2-3 more for confidence)
    - **Source:** Round 13 / CGLE Sudan Rume Natural Batch 187 brewing iteration
    - **Suggested landing:** brewing-historian/cluster/patterns/cross-coffee-insights.md § Anaerobic-Natural Suppression + Temperature-Primacy pattern (broaden the section to "Aromatic-landrace + natural process" rather than anaerobic-specific) once threshold met

29. **Ground-Agtron-not-WB rule for extraction prior — documentation candidate** — Round 13's Step 1d hedged finer/warmer based on WB Agtron 78.7 (lighter-roast prior); Brew 1 over-extracted; ground Agtron at dose-out (68.1, medium-light) was the correct prior — over-extraction risk was live, not under. New rule: ground Agtron (not whole-bean) sets the over-vs-under extraction prior. Applies anywhere a brewing brief reasons about extraction direction based on roast level. Should land in brewing-assistant/cluster/operational-guide.md Step 1 OR brewing-equipment-expert/cluster/grinder-eg1.md (since Agtron measurement is dose-out equipment-side).
    - **Grade:** READY (clear rule, single lived instance + matches the established whole-bean-vs-ground physical reality)
    - **Source:** Round 13 / CGLE Sudan Rume Natural brewing iteration / claude.ai's own framing
    - **Suggested landing:** brewing-assistant/cluster/operational-guide.md Step 1c Brief Summary OR Step 1d strategy gate (add to "Roaster roast-level hook" section from R10)

30. **One-shot kickstart prompt symmetry — formalize the 3-prompt analog?** — V-set has 4 named kickstart prompts (Chris's pattern: New Bean - First Roasts → start-lot.md; Log Roast Prompt → log-roast.md; Log Cupping Prompt → log-cupping.md; Resolved Bean - Close Lot → close-lot.md). One-shot has 2 prompt files (one-shot.md covers STAGES 1-4; one-shot-closeout.md covers STAGE 5) but Chris's lived workflow needs 4 entry points (intake + log-roast + log-cupping + close) matching the V-set pattern. Currently Chris re-enters one-shot.md with different paste payloads per stage; STAGE 0 reconciliation (R12) auto-detects entry point. Question: should we formalize Log One-Shot Roast / Log One-Shot Cupping as separate prompt files (would mirror the V-set kickstart symmetry but duplicate one-shot.md's content) OR document the 3 kickstart messages in a README near docs/prompts/ as standing operator templates? Round 13 surfaced the gap via Chris's question "do I just use log-roast for one-shot?".
    - **Grade:** BRAINSTORM (design decision; pros/cons of separate files vs README documentation)
    - **Source:** Round 13 / Chris's one-shot log-roast question (2026-05-23)
    - **Suggested landing:** docs/prompts/README.md operator template section OR separate prompt files (log-one-shot-roast.md + log-one-shot-cupping.md) with the same docs://prompts/one-shot.md fetch underneath

### From Round 14 — four log-roast sessions / Step 3 dog-food close (2026-05-23)

31. **`fc_audibility` enum extension — add "no FC / sub-threshold" value** — Bukure v2a topped out at 199.9°C with 0 cracks; chose `ambiguous` as least-wrong canonical pick. Actual situation: bean demonstrably did not reach FC (well below 200-205°C FC window). The enum's `ambiguous` is about operator-property uncertainty ("couldn't tell whether FC happened"); it doesn't cover "near-certainty FC didn't happen — underdeveloped below threshold." Candidate new value: `no_fc` or `sub_threshold` or `did_not_fire`. Will recur on any underdeveloped low-energy probe.
    - **Grade:** READY (clear semantic gap; enum extension is mechanical)
    - **Source:** Round 14 / Bukure v2a (Batch 193) + Mt Elgon (Batch 199)
    - **Suggested landing:** schema migration adding 5th enum value + CONTEXT.md § FC audibility state update + log-roast.md / one-shot.md STAGE 2-3 prompt updates

32. **Maillard% / dev% schema rule — null when fc_start is null** — Bukure v2a: 61.4% Maillard despite no FC. Phase calculator attributes all of yellowing→end to Maillard when there's no FC marker to split dev out. Schema accepts the garbage value silently. Cross-batch Maillard% aggregations will include the artifact. Fix candidates: (a) computed/generated column that nulls Maillard%/dev% when fc_start is null; (b) check constraint preventing non-null Maillard% when fc_start is null; (c) explicit `phase_calc_validity` flag on roasts to filter analytics.
    - **Grade:** READY (clear data-quality rule)
    - **Source:** Round 14 / Bukure v2a
    - **Suggested landing:** schema migration adding the null-on-no-FC rule + roasts table check constraint or generated column

33. **`subtle` FC dev_time handling — trust the timestamp or null it?** — Bukure v2b: 1 crack logged, FC marked at 5:27, dev computed as 18s. Prompt frames subtle as "operationally treated as not-audible" (would imply nulling dev_time_s). But machine recorded a specific fc_start + 1 crack happened. claude.ai trusted the value; might be wrong. Clarify whether subtle FC timestamps should drive dev computation or be nulled.
    - **Grade:** READY (clarification, not implementation)
    - **Source:** Round 14 / Bukure v2b
    - **Suggested landing:** log-roast.md / one-shot.md STAGE 2 fc_audibility section + CONTEXT.md § FC audibility state clarification

34. **`is_reference_candidate` timing convention — log-roast or log-cupping?** — Gesha Clouds: claude.ai set `is_reference_candidate: true` on v3a (roast-structure grounds — closest to #172 control) but flagged "that was a guess." Prompt's definition ("leading slot per V-set when it's plausibly the lot reference at close-out") implies cup data. log-roast.md doesn't explicitly say whether to set the flag at roast-time (on roast-structure grounds) or defer to log-cupping (on cup grounds). Currently ambiguous.
    - **Grade:** READY (clarification — pick one convention and document)
    - **Source:** Round 14 / Gesha Clouds v3a
    - **Suggested landing:** log-roast.md STAGE 3 push_roast section + log-cupping.md STAGE 3 patch_roast section — explicitly say which prompt owns setting the flag

35. **Drop rules UI persistence in Latent app — view changes after roast logged** — Mt Elgon: Chris couldn't re-find the drop rules mid-session because the lot's page flipped from "waiting for next roast" view (which surfaces the design-intent panel) to "waiting for next cupping" view (which hides it). The operator needs drop rules AT the machine DURING the roast; the view that surfaces them disappears the moment the prior roast was logged. App UX issue, not prompt: `/green/[id]` page should keep drop rules accessible during active roasting OR persist them in a way the operator can grab mid-roast (Roest profile notes field already serves as durable backup, but the app's own surface should match).
    - **Grade:** READY (Latent app feature — render drop rules persistently across lifecycle states OR add a "show recipe design intent" toggle on the resolved-pending / waiting-for-cupping views)
    - **Source:** Round 14 / Mt Elgon batch 199 session feedback
    - **Suggested landing:** Latent app sprint — `/green/[id]` page UX work + possibly a dedicated "active roast" view that pulls the recipe design intent + drop rules into a roast-time HUD

36. **push_roast_profile + push_roast_recipe + push_experiment silently decoupled — Tool coordination gap** — Gesha Clouds: push_roast_profile pushed Roest profiles 2 sessions ago without creating paired DB experiment/recipe rows. STAGE 1(b) inline backfill handled it but the gap is structurally recurring. Fix candidates: (a) push_roast_profile optionally accepts experiment_id + batch_slot + creates paired roast_recipes row in the same call (transactional); (b) explicit note in design-time prompts (start-lot.md STAGE 4, log-cupping.md STAGE 5 V_(n+1) design) that profile pushes must be followed by push_roast_recipe to land the DB rows; (c) a dedicated push_v_set_design Tool that bundles experiment + recipes + profiles into one atomic operation.
    - **Grade:** BRAINSTORM (3 fix options; design choice depends on architectural preference for transactional vs separated Tools)
    - **Source:** Round 14 / Gesha Clouds STAGE 1(b) backfill
    - **Suggested landing:** future Tool sprint scoping the right architectural answer

## Resolved (append-only history)

When grill items resolve, move them here with date + landing target. Format:

```
- **<Item name>** — resolved YYYY-MM-DD. Landed as: <CONTEXT.md entry / ADR-NNNN / cluster doc patch / no action>. Source PR: #NNN.
```

- **Item 1 — CCIL framing vocabulary** — resolved 2026-05-23 (Sprint R Phase 4 Step 4 grill). Landed as: (a) new CONTEXT.md entry **Variety throughline** (per-layer mechanics folded in); (b) source-diversity refinement appended to existing **Cross-coffee insight layer** entry (self-roasted lots count as N=1 source per bean); (c) new file `docs/skills/ccil/cluster/observing.md` holding 3 candidate structural concepts (process throughline, process-scoped-vs-variety-scoped hypothesis class, cross-domain tension as CCIL section convention); (d) ARBITER.md § CCIL observing list review extending standard `process pending arbitration` to walk the observing list. Source PR: TBD this session.
- **Item 2 — Master-doc redirect stub vocabulary** — resolved 2026-05-23 (Sprint R Phase 4 Step 4 grill). Landed as 3 new CONTEXT.md entries in § MCP / Sync Architecture: (a) **Redirect stub** (what BREWING.md / ROASTING.md / docs/taxonomies/sworks.md are post-Wave-4-PR-4b — h1 + pointer table, permanent state, anchor back-compat preserving); (b) **Cluster path** (`docs/skills/<sub-skill>/cluster/<file>.md` URI shape used in `docs://` Resources + `propose_doc_changes` target_doc); (c) **Operator-guide / operational-guide / onboarding-protocol / operational-reference** (four cluster-leaf file names + their tier+domain scoping, with the operational-guide vs onboarding-protocol asymmetry explained as a real structural difference reflecting Chris's roasting-state-heavy vs brewing-sequential framing). Open rename question for workflow-sub-skill files split out to grilling-queue item 2a (OBSERVING). Source PR: TBD this session.
- **Item 3 — 3-tier sub-skills vocabulary** — resolved 2026-05-23 (Sprint R Phase 4 Step 4 grill). Landed as: (a) one consolidated CONTEXT.md entry **Sub-skill tiers + Master Coordinator + Chris's vocabulary aliases** locking the 3 tiers + plan/execute Workflow split + Chris's "Expert" / "Zone" lived-speech aliases + Master Coordinator role + 4 forbidden conflations; (b) temporal constraint appended to existing **Cross-coffee insight layer** entry — CCIL fires only AFTER complete cycles (lot close / brew archive), never during in-flight workflows; (c) promoted grilling-queue item 16 (CONTEXT.md zone split) from OBSERVING to next-sprint candidate, locking option (a) — split into `context-roasting.md` + `context-brewing.md` + `context-shared.md` aligned to Zone vocabulary; (d) new outstanding queue item 16b (sub-skill rename to `<X> Expert` framing, OBSERVING, defer pending sustained lived-speech evidence). Source PR: TBD this session.
- **Item 4 — Per-lot directory structure** — resolved 2026-05-23 (Sprint R Phase 4 Step 4 grill). Landed as: (a) new CONTEXT.md entry **Per-lot directory taxonomy** (active-lots / one-shot-calibrations / learnings 3-dir model + redirect-stub close-out convention; brewing zone scoped out — no per-lot dirs there); (b) new CONTEXT.md entry **Three big levers** — major load-bearing concept Chris articulated this turn: production lever (biggest, Chris can't touch) / roasting lever (medium, V-set iterative reach) / brewing lever (smaller, final polish); explains why one-shot lots pull the brewing lever harder; (c) updated `docs/skills/roasting-historian/cluster/active-lots/README.md` to flip the "delete on close" convention to "redirect stub on close" per lived practice; (d) new outstanding grilling-queue item 16c — **Substrate pruning discipline** (Chris-flagged meta-pattern; section-level pruning mechanism design; BRAINSTORM, future sprint). Source PR: TBD this session.
- **Item 5 — Pattern F decomposition tripwires** — resolved 2026-05-23 (Sprint R Phase 4 Step 4 grill). Landed as: (a) new ADR-0014 — Pattern F pattern-aware threshold tiers (amends ADR-0013); 7-tier table with Historian 250KB / Archivist 200KB / Equipment 150KB / Workflow 100KB / Coordinator 80KB / CCIL 150KB / root-doc 120KB caps; resolves ADR-0013 internal ambiguity (120KB vs 60KB cluster threshold); locks the claude.ai-context-window-as-binding-constraint reasoning; (b) new CONTEXT.md entry **Pattern F decomposition tripwires (pattern-aware tiers)** with the threshold table + pointer at ADR-0014; (c) 2026-05-23 lived audit: 3 previously-"exceeded" clusters now compliant under pattern-aware tiers (roasting-historian 192/250, brewing-historian 188/250, brewing-equipment-expert 144/150); PRODUCT.md (140KB / 120KB root) flagged as parallel-session compaction candidate; 4 clusters approaching tripwire surfaced as watch-items; (d) new outstanding queue items 5a (PRODUCT.md compaction parallel session) + 5b (empirical claude.ai context-window measurement cross-party grill). Source PR: TBD this session.
- **Item 9 — Recipe-noun discipline triple verification** — resolved 2026-05-23 (Sprint R Phase 4 Step 4 grill). **No action — common understanding confirmed.** CONTEXT.md lines 33-43 already lock the triple (Recipe = roast_recipes row / Roest profile = JSON machine artifact / anchor profile = curve-shape transferable framework) with `_Avoid_` directives against the known drift patterns. Spot-check of CGLE SR Natural V5 closed-lot learnings shows "profile" prose hewing to the canonical curve-shape sense per CONTEXT.md line 42-43's preserved curve-shape references (CF-Light profile / washed profile / natural profile). V5 lived usage validates the lock — no drift, no edits needed.
- **Item 11 — Slug-convention drift active-lots vs learnings** — resolved 2026-05-23 (Sprint R Phase 4 Step 4 grill). Chris locked Option (a): **canonical lot code (lowercase-kebab) across all 3 per-lot directories** (active-lots/ + learnings/ + one-shot-calibrations/). Same slug across all dirs means trivial cross-ref + matches substrate identifiers (Roest profile names, batch IDs, experiment_ids) + year suffixes prevent collision on re-purchase. Landed as: (a) 7 file renames via `git mv` in `docs/skills/roasting-historian/cluster/learnings/` — cgle-mandela-xo.md → cgle-mandela-xo-2026.md; cgle-sudan-rume-hybrid-washed.md → cgle-srume-washed-2026.md; gua-el-socorro-java.md → gua-soc-java-2024.md; gua-libertad-aurelio-del-cerro.md → gua-lib-adc-2024.md; gv-oma-lot-25-035.md → gv-oma-25-035.md; gv-surma-lot-25-039.md → gv-surma-25-039.md; rancho-tio-emilio.md → ecu-td24-ranchotio-tm-washed.md; (b) 14 cross-file ref updates across `lib/mcp/docs.ts` (Resource catalog) + 6 cluster docs (siblings + patterns/by-process/washed.md + patterns/by-process/honey.md + patterns/by-cultivar/gesha.md + active-lots/redplum-cas-2026.md + one-shot-calibrations/README.md); (c) **Slug convention** section appended to CONTEXT.md § Per-lot directory taxonomy locking the convention. shipped.md + grilling-queue.md historical references intentionally left as-is (audit-trail integrity — descriptive prose of past sprints reflects what was named at the time). Source PR: TBD this session.
- **Item 19 — Pivot-destination heuristics CCIL promotion** — resolved 2026-05-23 (Sprint R Phase 4 Step 4 grill). **OBSERVING — relocated to CCIL observing list, no substantive grilling decision needed.** Current state: heuristics correctly housed in brewing-assistant operational-guide Step 3; N=1 lived pivot (Wush Wush Brew 2 → Brew 3) validates the "single-axis loud" → Suppression heuristic. Promotion fires once N≥2-3 strategy pivots across different residual-problem shapes confirm the mapping holds. Landed as: new entry in [docs/skills/ccil/cluster/observing.md § Pivot-destination heuristics](docs/skills/ccil/cluster/observing.md) so the standard `process pending arbitration` arbiter walk surfaces this candidate alongside the other observing-list items. No code/doc edits to operational-guide; the candidate lives in observing.md until promotion threshold met.
