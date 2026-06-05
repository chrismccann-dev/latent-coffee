# Grilling 2026-05-16 — Synthesis pipeline + miscellaneous cleanup follow-ups

## Session summary

Sixth `/grill-with-docs` session, paired audit-grilling: (A) the synthesis pipeline subsystem in `lib/synthesis/` (4 adapters + scaffolding + vendored humanizer skill, ~1050 lines across 9 files); (B) a miscellaneous cleanup sweep across the 5 prior cluster followups for unresolved open questions. Shorter-than-typical session per design (synthesis is structurally compact; misc cleanup is variable). 6 grilling rounds.

Outputs:
- [CONTEXT.md](CONTEXT.md) — **7 new glossary entries** under a new "Synthesis Pipeline" sub-section (peer to Roasting / Brewing / MCP / Canonical Registries / WBC Reference Materials). Plus **8 new flagged ambiguities**, **3 misc-cleanup resolutions** (one prior flagged ambiguity retired + two prior open questions locked), and **2 new relationships** in the Relationships section. CONTEXT.md now ~130 entries total across 6 sub-sections (31 roasting + 23 brewing + 27 MCP + 23 canonical registries + 19 WBC + 7 synthesis).
- [docs/adr/0002-two-call-synthesis-pipeline.md](docs/adr/0002-two-call-synthesis-pipeline.md) — **second ADR in the repo**. Documents the humanizer-as-separate-call decision (cognitively distinct tasks, vendored-skill resync, humanizer reusability for non-synthesis surfaces) and the accepted cost (2x latency + credit spend per generation, bounded by lazy resynthesize).
- [~/.claude/projects/.../memory/feedback_grilling_refresh_at_feature_ship.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_refresh_at_feature_ship.md) — **new standing operating rule**: Claude must proactively force a short `/grill-with-docs` refresh at the start or end of every feature ship before agreeing to move on. Cross-system sync depends on CONTEXT.md currency; Chris-explicit 2026-05-16.

The 7 new entries fall into 3 thematic groups:

**Pipeline mechanics (3 entries)** — Humanizer pass → Synthesis pipeline → Resynthesize trigger.

**Output + design discipline (3 entries)** — Knowledge capsule (with sub-properties: living-at-time-of-creation, cross-source-by-intent, origin lineage) → Directed-prompt adapter (with 5-slot contract + 2 adapter shapes) → Bottoms-up synthesis-prompt authoring.

**Cross-coffee surface positioning (1 entry)** — Cross-coffee insight layer (the canonical noun for cross-coffee patterns living in BREWING.md / ROASTING.md, complementing per-anchor knowledge capsules).

## Standing decisions locked

- **Knowledge capsule is the canonical noun** for the human-facing prose output of the synthesis pipeline (matches existing `capsuleNoun` field on every adapter). **Living at time of creation** — regenerates from scratch on every new data point (multiplicative not additive). **Terminal output, not input** — read by Chris only, not consumed by any downstream workflow.
- **Two-call synthesis pipeline is a deliberate design decision** (ADR-0002) — cognitively distinct tasks, vendored-skill resync property, humanizer reusability outside synthesis.
- **Lazy corpus-delta resynthesize is correct, not an implementation accident** — three load-bearing properties: cost-bounded (Anthropic credits per call, billed to Chris's pay-as-you-go account), single-user-of-one (staleness only matters when Chris visits), terminal output not input (staleness has no propagation cost).
- **Per-entity adapter pattern with up to 5 contributing slots** (anchor / weighting / output format / extra rules / learning-row formatter) is the canonical synthesis architecture; per-aggregation-kind sub-dispatch within an adapter file is allowed (process is the precedent — 5 sub-shapes via `getProcessAdapter(kind)`), inlining a 5th per-entity prompt outside the adapter shape is NOT allowed.
- **Cross-entity capsules (axis × axis) are out-of-scope by design today** — combinatorial explosion + per-axis capsules already absorb cross-axis signal naturally. Ad-hoc one-off combination drilling is acceptable; systematic cross-entity page surfaces are not. Cross-coffee generalizations that span multiple axes live in the **Cross-coffee insight layer** (BREWING.md / ROASTING.md cross-coffee sections), not as code-driven capsules.
- **No anchor-level URL convention on `docs://context.md`** — the existing doc-section MCP layer is sufficient; anchor-URL coupling brittles claude.ai prompts.
- **Memory files are not cross-linked from CONTEXT.md** — strict-glossary discipline preserved; CONTEXT.md is terminology, memory is operating instructions.

## 11 follow-up actions

### Sprint candidates (highest priority first)

**1. Synthesis pipeline subsystem-wide revisit umbrella** [SCOPING — DEFERRED]
- Why: Chris-flagged 2026-05-16 — "I probably need to revisit all of this at some point in time. This isn't the perfect final form. I think this was just better than two sentences and good enough." The 3 specific criticisms below (#2 + #3 + #4) are concrete instances; the umbrella reserves space for broader rethinks.
- Surface: scoping doc weighing the directed-prompt design vs alternatives (one-prompt-fits-all, per-question dispatch, structured-output instead of prose, etc.). Deferred until the corpus growth exposes more limitations OR one of the 3 concrete criticisms becomes pressing.
- Effort: deferred; future-scope.

**2. Confidence + length modulation by corpus size** [PROMPT REFINEMENT]
- Why: Today's `earlyData` flag ([buildPrompt.ts:65](lib/synthesis/buildPrompt.ts)) is binary (`learningRows.length < 3`). Chris wants a 3-4 tier gradient: 1-coffee Catimor capsule shouldn't sound as authoritative or be as long as a 30-coffee Gesha capsule.
- Surface: replace the binary flag with tiered logic (e.g. < 3 / 3-7 / 8-15 / 15+) driving both confidence language AND target paragraph count + takeaway count. Modify [buildPrompt.ts](lib/synthesis/buildPrompt.ts) + adapter weighting + SHARED_RULES.
- Effort: small (prompt + scaffolding refinement, no schema change).
- Pairs with #4 — large-corpus capsules at risk of degrading to append-lists need the same enforcement layer.

**3. Mobile capsule short-form variant** [UX + PROMPT]
- Why: Knowledge capsules are "really, really long" on mobile. Chris wants a short-form variant ("synthesis of the synthesis") rendered alongside the long form.
- Surface: scoping decision — (a) 3rd LLM call (digest the long form to 1-2 paragraphs + 2-3 takeaways), cached in a separate column / table; (b) client-side truncate-with-expand pattern that doesn't lose the bullets. (a) adds latency + cost; (b) is cheaper but doesn't summarize. Likely (a) given Chris's framing of "synthesis of the synthesis".
- Effort: medium (3rd LLM call shape + schema column + render component).

**4. Re-synthesize-don't-append discipline as a stronger prompt rule** [PROMPT REFINEMENT]
- Why: `SHARED_RULES` currently says "extract recurring patterns across the corpus and write a human-readable field note" + "do not summarize each coffee one by one" — aspirational. Chris wants it stronger ("it shouldn't just append this stuff and be one big long list of things I've learned from each one. This would be synthesizing").
- Surface: [buildPrompt.ts:10-18](lib/synthesis/buildPrompt.ts) `SHARED_RULES` — promote the multiplicative-not-additive language to a non-negotiable directive (top of the rules block, with concrete instruction that the model should produce one narrative not N per-coffee notes).
- Effort: small (prompt-only).

**5. Humanizer vocabulary grounding** [INVESTIGATION + POSSIBLE REFINEMENT]
- Why: Today's preservation list is hardcoded in `USER_OVERRIDE` ([humanizer.ts:23](lib/synthesis/humanizer.ts:23)) — covers the 6 strategy names + 4 modifier types + named gear + proper nouns + cultivar / process terms + numbers + structure. Chris-flagged: "I'm not sure if it keeps all of our vocabulary... maybe it can pull from this context file to look at these things."
- Surface: scoping — should the humanizer have CONTEXT.md awareness? Options: (a) extract canonical-vocabulary terms from CONTEXT.md at build time + inject into the USER_OVERRIDE list; (b) give the humanizer tool-use access to read CONTEXT.md on demand; (c) leave as-is (hardcoded list is a meaningful subset). Investigate before refactoring.
- Effort: small investigation; possibly medium implementation.

**6. Cross-source brewing+roasting unified capsule** [ARCHITECTURE]
- Why: Largest substrate gap surfaced — all 4 synthesis adapters read `brews` rows only; roasting-side `roast_learnings` + carry-forward learnings are NOT in the synthesis corpus. Chris's design intent (Chris-explicit 2026-05-16): "the knowledge capsule should be pulling in both all of the brewing and roasting lessons altogether in one big knowledge capsule, encapsulating all of the various data points."
- Surface: scope a cross-source adapter shape — terroir / cultivar / process adapters should query both `brews` AND `roast_learnings` (joined through `green_beans.{terroir_id, cultivar_id, signature_method}` for matching lots); roaster adapter is roughly cross-source via `roaster = 'Latent'` self-roasted brews but doesn't pull `roast_learnings` directly. Schema-wise the data is there; the change is adapter-level (new `formatLearningRow` shapes for roast-side rows) + synthesize-route-level (corpus query expansion).
- Effort: medium. Requires careful design to keep the two source shapes coherent in a single prompt — brews carry brewing-vocabulary (extraction_strategy, modifiers, what_i_learned); roast_learnings carry roasting-vocabulary (primary_lever, acceptable_roast_window, brewing_tolerance). The synthesis voice has to bridge both.

**7. Resynthesize trigger gap — content-change-without-count-change** [ENHANCEMENT — LOW-PRIORITY]
- Why: Current `cached_count !== current_count` trigger misses 4 scenarios: brew anchor FK reassigned post-arbiter; `what_i_learned` rewritten on existing brew; `roast_learnings` filled in for existing lot (matters once #6 ships); registry rich anchor edited. Chris-acknowledged as acceptable today because >95% of corpus changes are append-only `push_brew` calls.
- Surface: replace `count` heuristic with `max(brew.updated_at)` comparison (plus anchor-entry updated_at if/when registry-rev tracking lands).
- Effort: small. Tighten when (a) #6 ships, (b) registry edits to existing anchors become frequent.

**8. BREWING.md ↔ ROASTING.md cross-coffee section naming asymmetry** [DOC EDIT]
- Why: ROASTING.md uses **Cross-Coffee Insight Layer**; BREWING.md uses **Archive Patterns** (Section 3) for the structurally identical function. Chris also wants to "be a little bit more structured at exactly what I'm trying to pull out here." Cosmetic + structural cleanup.
- Surface: either promote BREWING.md to "Cross-Coffee Insight Layer" to match ROASTING.md, or pick a third umbrella name applied to both.
- Effort: small (doc edit).

### Carried forward to the mega-cleanup grilling session (Session 7)

This session adds to the running mega-cleanup backlog. **Session 7 sequencing constraint (Chris-locked 2026-05-16): defer roasting + MCP-touching items to a Part 2 mega-cleanup**, after Chris's green-bean dogfood completes (one cupping session remaining as of this writing, ~couple days out). Part 1 mega-cleanup focuses on **brewing / canonical-registries / WBC / synthesis-pipeline / misc** items.

**Part 1 candidates (immediate session 7 — non-roasting / non-MCP-touching):**
- Brewing followups: items #2 (BREWING.md doc-edit Phase-Mapped vocab), #3 (WBC systematic-review), #4 (Extraction Confirmed retirement evaluation), #7 / #8 / #9 (open question re-test triggers)
- Canonical registries followups: #1 (processes.md qualifier doc-edit), #3 (importer/exporter scope), #6 (strategy tag ↔ extraction strategy coherence audit), #7 (SWORKS valve flow taxonomy promotion scoping), #8 (filter flow-rate measurements scoping), #11 (95-96% pick-not-author saturation audit)
- WBC followups: #1 (BREWING.md single-variable orthodoxy softening), #2 (Time Distribution Playbook promotion scoping), #6 / #7 / #8 (wbc-sourcing.md doc-edit bundle)
- Synthesis followups (this session): #2 (confidence modulation), #3 (mobile capsule short-form), #4 (re-synthesize discipline), #5 (humanizer vocab grounding), #8 (BREWING.md ↔ ROASTING.md cross-coffee naming asymmetry)

**Part 2 candidates (deferred — roasting + MCP-touching):**
- Roasting followups: items #1 (`elasticity` → `brewing_tolerance` rename), #3 (terroir_takeaway column), #4 (prompts vocab audit), #5 (underdev/overdev data audit), #6 (aromatic/structural relocation), #7 (rest_behavior keep-or-drop)
- MCP followups: #1 + #2 (signature method registry + queue), #3 (canonical-strictness audit), #4 (xBloom API check)
- Canonical registries followups: #2 (Nordic Approach alias removal), #4 (skeleton-entry arbiter extension), #5 (fermentation_qualifiers schema column), #9 (water taxonomy bootstrap), #10 (roaster skeleton-flag extension)
- WBC followups: #4 (Water Strength experiment), #10 (Same-green blending + Rest curve protocol execution)
- Synthesis followups (this session): #6 (cross-source brewing+roasting unified capsule — touches roasting-side `roast_learnings`), #7 (resynthesize trigger content-change gap — partly tied to #6)

## Combined backlog after this session

Prior session totals + this session:
- Roasting (2026-05-14): **7 open items**
- Brewing (2026-05-15): **9 open items**
- MCP (2026-05-15): **8 open items**
- Canonical registries (2026-05-16 morning): **11 open items**
- WBC reference materials (2026-05-16 afternoon): **10 open items**
- Synthesis pipeline (this session): **8 new items**

**Combined backlog: 53 items** across six clusters. Sequencing constraint (Chris-locked 2026-05-16): Part 1 mega-cleanup focuses on brewing / canonical-registries / WBC / synthesis-pipeline / misc; Part 2 handles roasting + MCP-touching items after the green-bean dogfood completes.

## Audio dictation note

Audio dictation mode held as default cadence — 6 grilling rounds produced **7 entries + 8 flagged ambiguities + 3 resolutions + 1 new memory rule + 1 ADR**. Ratio is light on glossary entries (1.2:1) but heavy on derived artifacts (ADR / memory rule / cross-session resolutions). Per Matt's strict-glossary rule, the count is healthy — load-bearing entries only. Multiple per-turn implicit-term extractions paid off (the bottoms-up synthesis-prompt authoring exercise + the multiplicative-not-additive design philosophy + the cross-source design intent all came from audio context beyond the literal answer).

## Open questions for the next grilling session

Per Chris's standing rule from this session (`feedback_grilling_refresh_at_feature_ship.md`), the next `/grill-with-docs` session is **trigger-based** (run at feature ship) rather than scheduled. No specific cluster queued.

The mega-cleanup session 7 ahead (per Chris's 2026-05-15 + 2026-05-16 flagging) is **sprint sequencing, not vocabulary tightening** — Part 1 first (non-roasting / non-MCP-touching), Part 2 after dogfood.

## Session close-out notes

- **CONTEXT.md is ~85-90% complete on load-bearing architectural terminology** post-session-6. The 6 sub-sections cover the 6 major architectural clusters of Latent cleanly. Remaining ~10-15% is future-scope terminology that will get glossary entries as the features ship, not via cluster grilling.
- **No obvious 7th cluster pending.** Page-surface / UI-architecture is too implementation-specific (CLAUDE.md territory); Roest API + workflow surfaces are absorbed into existing clusters.
- **Cross-system sync mechanism is healthy** — CONTEXT.md is exposed as `docs://context.md` MCP Resource; new entries propagate to claude.ai automatically on Vercel deploy. The new standing rule (force grilling refresh at feature ship) is the discipline that keeps the loop tight.
