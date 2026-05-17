# Grilling 2026-05-17 — Roasting cross-party audit follow-ups

## Session summary

Cross-party `/grill-with-docs` audit pair — paired Claude Code with `claude.ai/projects/roasting` via Chris as a pure message relay. 7 rounds over one sitting, surfaced drift / missing terms / cross-project asymmetries in the roasting cluster of CONTEXT.md against the lived practice of the roasting-side claude.ai project.

Outputs:

- [CONTEXT.md](../../CONTEXT.md) — **21 new glossary entries** primarily in the `### Roasting` / `### V-set close synthesis` (new sub-section) / `### Forward design` / inter-cluster sections: WB→Gnd Agtron delta / Anchor profile / Anchor confidence / V-set close-out narrative / FC floor / Drop ceiling / Dev headroom / FC audibility state / Signal precedence / Multi-factor weighting / Peak inlet / Green spec / BBP / Hopper pre-load / Maillard % / Experiment (umbrella) / Peer roaster / Session position effect / Thermal reset protocol / Fan curve / Pre-V1 risk reduction. **9 existing entries edited** (V-set cardinality bug + Experiment-umbrella sub-shape positioning; Roast→cup trace rewrite around asymmetric layer structure; Taste-for reframe as principled non-articulation; Lever + Non-factor lot-close ordering clarified; Carry-forward learnings upstream/downstream cross-reference; Tolerance-anchored design canonical noun; Resolved three-event handoff sequence; Anchor confidence layered redirect on expensive lots; Signal precedence rule #6 layering). **6 new flagged ambiguities** capturing schema-vs-writing seams + cross-project asymmetries + open vocabulary gaps.
- [docs/adr/0003-anchor-vocabulary-canonicalization.md](../adr/0003-anchor-vocabulary-canonicalization.md) — locks the "anchor profile" canonical + 6-level confidence ladder + Anchor profile ↔ Carry-forward learning upstream/downstream relationship.
- [docs/adr/0004-vset-close-schema-writing-seam.md](../adr/0004-vset-close-schema-writing-seam.md) — locks option (c) "document the gap and accept it" for the per-slot cup schema vs V-set-wide cup narrative mismatch.
- [docs/adr/0005-parameter-type-conditional-signal-arbitration.md](../adr/0005-parameter-type-conditional-signal-arbitration.md) — locks the parameter-type-conditional model (precedence on categorical / weighting on continuous) and the anchor-confidence × lot-value layered structure.

## Substrate-practice gap finding

The audit surfaced a repeating pattern across all 7 rounds: **lived practice diverges from the substrate (schema / prompts / ROASTING.md) in many directions**. Seven cases documented (six-field roast→cup trace not operational; taste-for non-articulation principled; lever-promotion-at-lot-close; ROASTING.md additive-only table; "experiment" overload; peer-roaster storage gap; carry-forward scope-tag gap). The roasting-side claude.ai named this **"substrate-practice gap"** — captured at audit-output level (here), not as a CONTEXT.md entry, because it's an architectural / process observation about how Latent's substrate and practice relate over time, not a Latent-specific term used in workflow authoring.

Downstream consequence worth naming: `propose_doc_changes` closes the **substrate-to-substrate** direction (claude.ai → arbiter → doc); cross-party audits like this one are the closest analog for the **practice-to-substrate** direction. If repeatable, "substrate-practice gap audit" might earn a name as the canonical mechanism for the reverse direction.

## Standing decision: roasting follow-ups do not block dogfood

None of the 9 follow-ups below are correctness blockers for routine roasting workflows. The substrate-practice gaps are documentation gaps, not execution gaps — the practice runs fine without the substrate being repaired; the substrate just becomes more honest about what the practice actually does. **Chris-locked 2026-05-17**: major roasting changes (especially to MCP server / prompts) wait until the in-flight green-bean dogfooding session completes; the items below are scoped for after that.

## 9 follow-up actions

### Sprint candidates (bundle 1-3 together; 4-6 separately)

**1. ROASTING.md additive-vs-precedence table split** [DOC EDIT]
- Why: ROASTING.md's Green-Spec → Starting-Hypothesis table currently operates additively ("read every row whose Signal applies; combine guidance"). The round-5 audit confirmed this is correct-but-incomplete — additive works for continuous adjustments (density / moisture / altitude contributions stack cleanly) but fails on (i) parameters where multiple signals conflict on the same continuous output and (ii) parameters where one signal categorically rules out a regime another suggests. The parameter-type-conditional model from ADR-0005 needs to surface in the doc.
- Surface: [ROASTING.md](../../ROASTING.md) § Green-Spec → Starting-Hypothesis
- Migration shape: split into two tables — additive table for continuous adjustments (current table, untouched) + new precedence table for categorical decisions (process-family → anchor-selection, FC-audibility-expectation → end-condition, fruit-layer-presence → energy-direction-inversion). Cross-link both to the **Signal precedence** + **Multi-factor weighting** entries in CONTEXT.md.

**2. Development entry framing edit** [DOC EDIT]
- Why: ROASTING.md's existing **Development** framing says "A large WB→Gnd delta means the bean looked roasted on the outside but stalled inside." Round 1 audit established that polarity flips by lot family — conventional-case (washed) has Gnd lighter than WB ("stalled inside" reading is correct); heavy-ferment / fruit-layer case has WB lighter than Gnd (Mandela XO #139 = WB 76 / Gnd 72.4 is the case study; interior actually develops more uniformly than surface implies). The current line is convention-1-specific and reads wrong on heavy-ferment lots.
- Surface: [ROASTING.md](../../ROASTING.md) § Development (or wherever the line appears)
- Edit shape: soften the framing to "typically, in conventional / washed roasts" or split into two lot-family-specific readings. The CONTEXT.md `WB→Gnd Agtron delta` entry already documents the two patterns cleanly — ROASTING.md can cross-reference rather than restate.
- Coupled with #1 (both ROASTING.md doc edits); bundle in one PR.

**3. Add FC audibility state field to roast schema** [SCHEMA]
- Why: Round 4 audit surfaced the 4-value enum (audible / subtle / silent / ambiguous) plus "inaudible" as a synonym. Three of the four values trigger the same downstream protocol response (bean-temp end condition + drop-ceiling-primary + delta + Agtron as proxies), but the distinction matters for cause attribution and future predictability. Today the audibility state is captured as free-text in roast prose; structuring it as an enum field on `roasts` (or `roast_recipes`) would let the Roest profile expectation be set programmatically and the cupping evaluation be filtered correctly.
- Surface: `roasts.fc_audibility` enum (proposed); `lib/types.ts`; `push_roast` Tool schema validation; ROASTING.md updates noting the field is recorded per batch
- Migration shape: ADD `fc_audibility` column with the 4-value enum + backfill from existing `fc_total_cracks` (0 → silent or ambiguous depending on context; >0 → audible). Defer until in-flight dogfood completes per Chris's standing decision.

### Field retirement / re-evaluation (cluster 4-6)

**4. Peer roaster framework structured storage**
- Why: Round 6 audit confirmed peer-roaster framework is operationally load-bearing (acidity-vs-sweetness axis framework is a primary V2 design lever) but lives entirely in Chris's head + scattered intake notes. No canonical home in the system; peer's resolved roasts aren't in the Roest log and don't get batch numbers. Also missing: canonical phrase for "this peer observation conflicts with my own anchor-derived data" — currently operator-judgment with no documented precedence rule.
- Decision needed: scope structured storage (separate `peer_observations` table? structured `notes` field on `green_beans`? `peer_reference` field on `roasts` for citing a peer's resolved roast on the same green?), or accept the prose-only state.
- Surface: schema design + canonical `lib/peer-registry.ts` if peer roasters become canonical surface

**5. Carry-forward scope-tag mechanism**
- Why: Round 6 audit surfaced the roasting equivalent of brewing's `process_dominant` — at the **carry-forward learning** layer, not the aggregation-page layer. Today scope is prose-encoded ("for Sudan Rume Natural" qualifier in `roast_learnings.cultivar_takeaway`) with inconsistent tightness. The Sudan Rume Washed → Sudan Rume Natural transition already hit this in practice (FC-temp-architectural-constraint hypothesis emerged exactly because some washed-anchor carry-forwards didn't transfer).
- Decision needed: per-carry-forward scope tag (structured field — Chris's instinct), per-lot scoping flag (mirrors brewing's process_dominant), extend round-5 precedence framework to handle cross-process learning transfer, or accept prose-encoded scope at current corpus size.
- Surface: `roast_learnings` schema; `push_roast_learnings` Tool; ROASTING.md carry-forward formatting conventions
- Not urgent at ~5-10 closed lots; revisit when carry-forward corpus crosses a volume threshold.

**6. Roast recipe specification canonical noun**
- Why: Round 7 surfaced the gap — the bundle of inlet curve + fan curve + drop temp + hopper pre-load + end condition + charge temp doesn't have a unified noun in Chris's prose. Drifts between "profile" (Roest machine's term), "recipe" (mirrors `roast_recipes` schema entity), and "spec" (context-dependent). Each component has its own canonical noun but the aggregate is ambiguous.
- Decision needed: canonicalize "recipe" (aligns with schema), "profile" (aligns with Roest machine vocabulary), or accept the context-driven drift because components are distinct enough that the aggregate noun is rarely load-bearing.
- Surface: CONTEXT.md glossary edit; prompt language consistency in `docs/prompts/*.md`
- Mild ambiguity; not urgent.

### Cross-project / cross-doc follow-ups (cluster 7-9)

**7. roast_learnings `terroir_takeaway` column gap**
- Why: This was flagged in CONTEXT.md before the round-7 audit — Chris articulated four carry-forward-learning axes (cultivar / terroir / general / starting-hypothesis); the schema today only has three (cultivar / general / starting-hypothesis). Surfaced again in round 2's Carry-forward learning edit.
- Surface: `roast_learnings` migration + `push_roast_learnings` Tool schema + ROASTING.md formatting conventions
- Migration shape: ADD `roast_learnings.terroir_takeaway` text column; backfill optional (existing rows can stay NULL or have terroir-specific content extracted from `general_takeaway` prose if a script lands).

**8. roast_learnings underdev/overdev cup-side strictness**
- Why: Pre-existing flagged ambiguity (2026-05-14) — existing rows may intermix roast-side observations into cup-side signal fields. Round 4's FC audibility entry strengthens this concern: silent-FC roast-side observations should NOT live in `underdevelopment_signal` / `overdevelopment_signal` (cup-side fields by glossary definition).
- Surface: data audit on existing `roast_learnings` rows + prompt update in `close-lot.md` / `one-shot-closeout.md` to enforce cup-side strictness on future writes
- Coupled with #7 (both `roast_learnings` schema concerns); bundle if practical.

**9. Skeleton ADR for substrate-practice gap audit mechanism**
- Why: The audit itself instantiated a pattern worth naming — cross-party grilling sessions are the closest mechanism today for closing the **practice-to-substrate** direction (whereas `propose_doc_changes` closes the substrate-to-substrate direction). If this becomes repeatable, the mechanism deserves explicit framing alongside the existing arbiter / queue tooling.
- Decision needed: skeleton an ADR documenting the audit-as-mechanism, or leave as session-output-only?
- Surface: `docs/adr/0006-*.md` if scoped; alternatively a section in [ARBITER.md](../../ARBITER.md) or a new `docs/audits/` directory pattern.
- Lowest priority; surface only if the pattern repeats in 2026-Q3/Q4.

## Round-by-round summary

For session-completeness — what each round produced:

- **Round 1** — WB→Gnd Agtron delta. Polarity is fuzzy by lot family; locked **magnitude-first** convention with directional patterns named in prose when relevant. Threshold vocabulary (tight / wide / shrinking) is anchor-relative, not table-driven. Single biggest acknowledged glossary gap closed.
- **Round 2** — Anchor profile + Anchor confidence. Upstream parametric reference (canonical: "anchor profile" / conversational: "anchor") with 6-level confidence ladder + distinct Deferred field state. Documented the asymmetry: glossary previously crystallized carry-forward (downstream) but left anchor (upstream) undefined.
- **Round 3** — Roast→cup trace as discipline. Asymmetric layer structure (roast-side per-slot field-structured; cup-side V-set-wide narrative); taste-for deliberately non-articulated to preserve single-palate honesty; lever/non-factor promotion at lot-close, not V-set close. New **V-set close-out narrative** lemma with 5-component canonical order. Schema-vs-writing seam locked as option (c) accept-the-gap → ADR-0004.
- **Round 4** — FC vocabulary cluster. FC floor (soft statistical) vs drop ceiling (hard cup-quality bound) with dev headroom as paired window. 4-value FC audibility enum (audible / subtle / silent / ambiguous) resolves the three-word fuzz vocabulary from working prose. Full operational protocol stack captured (8 changes when FC not audible).
- **Round 5** — Signal precedence vs Multi-factor weighting. Parameter-type-conditional model: precedence on categorical decisions, weighting on continuous adjustments. Cross-project asymmetry: brewing-side is pure-precedence; roasting has both → ADR-0005. ROASTING.md doc-layer gap flagged (follow-up #1).
- **Round 6** — Structural batch: peer roaster (3 framings with vocabulary moves), reference-roast → optimized-brew handoff (leveraged existing brewing iteration loop noun; no new lemma needed), "experiment" overload (V-set is one shape; experiment is umbrella with 6+ sub-shapes), process_dominant equivalent (gap at carry-forward layer, not aggregation layer → follow-up #5).
- **Round 7** — Three lemmas (session position effect / thermal reset protocol / fan curve with shaped + heavy-ferment variants) + round-5 tension resolution (anchor confidence × lot value is LAYERED not competing; widening pressure redirects to **Pre-V1 risk reduction**) + meta substrate-practice gap captured at audit-output level.
