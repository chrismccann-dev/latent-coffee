# Sub-sprint 4a — Phase 2 Complementary Pass (Claude)

**Pairs with**: [Phase 1 audit](docs/sprints/sub-sprint-4a-green-bean-polish-kickoff-2026-05-27.md) + Chris's annotated PDF (`Green Bean Polish (1).pdf`) + the two mockup screenshots for Roast Hypothesis + Roast Actuals + Chris's voice-memo clarifications.

**Mode**: Read-only synthesis per kickoff brief § Phase 2. No implementation specifics; categorized findings only. Phase 3 will bundle these + Chris's notes into a plan.

---

## Categorization key

- **(A)** Chris flagged this — agree, no value-add. Skip.
- **(B)** Chris didn't flag — recommend adding to bundle.
- **(C)** Chris flagged this — pushback / scope differs from his framing.
- **(D)** Cross-cutting pattern across multiple of Chris's notes.
- **(E)** Substrate gap (field exists, render missing or stale data).
- **(F)** Bug root-cause diagnosis (for a Chris-flagged bug).
- **(G)** Out-of-scope for polish — defer to future design sprint.

---

## 1. Bug root cause — Higuito + CGLE Sudan Rume Natural rendering as Resolved (F)

**Cause**: Both lots have `roast_learnings` rows. The lifecycle helper at [lib/lifecycle-state.ts:101-105](lib/lifecycle-state.ts) routes any lot with a `roast_learnings` row to `resolved`, full stop — no further discriminator.

**DB state** (pulled via `get_bean_pipeline`):

| Lot | `best_batch_id` | `why_this_roast_won` | `primary_lever` | `cultivar_takeaway` | `general_takeaway` | `starting_hypothesis_for_similar` |
|---|---|---|---|---|---|---|
| Higuito (`79d0f814-…`) | `185` | **NULL** | populated | populated | populated | **NULL** |
| Sudan Rume Natural (`1cf02eb8-…`) | `187` | **NULL** | populated | populated | populated | **NULL** |
| Sudan Rume Hybrid Washed (`0d3212f8-…`) | (clean resolved baseline — Chris said "page is good as-is") | populated | populated | populated | populated | populated |

**Diagnosis confirmed**: these are partially-closed lots. Carry-forward prose got pushed; the verdict + the "starting hypothesis for similar lots" did not. They are exactly the "we did learn something, but we did not get to resolved state" shape Chris's voice memo described.

**Why this is one bug not two**: Chris's "Resolved bug (Higuito + SRN)" finding (page 8 of the PDF) and his "Unresolved Green Bean Lot" finding (Rancho Tio, pages 9-10) collapse into a single fix in `computeLifecycleState`. The discriminator Chris hypothesized (`why_this_roast_won IS NULL` → Unresolved) is correct: routing Higuito + SRN + Rancho Tio to a new `unresolved` state simultaneously fixes the bug AND surfaces the missing index section.

**Caveat — Rancho Tio**: MCP `get_bean_pipeline(b0cf57d5-…)` returned "not found" against this api_key's user scope. Either the UUID is from a different env or my lookup permissions don't match yours. Not blocking — Higuito + SRN tell the full story. Worth a 1-line confirm at Phase 3 kickoff that Rancho Tio actually has a `roast_learnings` row in production (if no — then Rancho Tio is a separate "pre-framework legacy" case routed via lifecycle helper rule (c), and the `unresolved` discriminator above wouldn't catch it; a second discriminator rule would be needed).

**Triage**: keep in the polish bundle. This is a 1-line change to the helper + the new view-shape work in §2 absorbs it cleanly.

---

## 2. The Unresolved state is a 4th view shape, not a new index section (C — bigger than Chris first scoped)

Chris's audit framed Unresolved as primarily an index-side addition ("There should be an unresolved field… include this one in particular"). His voice memo then expanded the scope by walking the lot page itself: badge changes, no reference card, "Reference" → "Leading" vocabulary rotation, careful handling of carry-forward learnings.

The lifecycle helper today has 4 states (in_inventory / waiting_for_next_roast / waiting_for_next_cupping / resolved). Adding `unresolved` makes it 5, and dispatches a new view-shape at `/green/[id]`.

**Page-shape diff (Resolved → Unresolved)**:

| Section | Today on ResolvedView | What Chris asked for on Unresolved |
|---|---|---|
| Hero badge | "Resolved" | "Unresolved" |
| Hero tile color | `latent-resolved-emphasis` (green) | TBD — needs a 4th temporal-salience token? Or reuse `latent-mid` (gray) to signal "incomplete answer"? |
| "Closed without identifying a reference roast" disambiguator | Renders conditionally above the Reference Roast card ([page.tsx:1316-1328](../../app/(app)/green/%5Bid%5D/page.tsx)) | **Demoted / removed** — the badge + view shape carry this signal; the disambiguator card is no longer needed |
| `REFERENCE ROAST · BATCH #N` card | Renders unconditionally even when `why_this_roast_won = NULL` (line 1331) — the "Why this roast won" sub-block renders the "Not yet populated. patch_roast_learnings…" placeholder | **Does NOT render**. The bug Chris flagged via the Batch #179 screenshot. |
| Reference Recipe Design Intent disclosure | "Reference Recipe Design Intent" label | **Renamed "Leading Recipe Design Intent"** |
| `REFERENCE CUP` card | Title literal "REFERENCE CUP"; "Best cup synthesis" prose label | **Renamed "LEADING CUP"**; **renamed "Leading cup synthesis"** |
| `ROASTING LEARNINGS · {lot}` | Renders today: 3 character cards + 4 detail rows | Renders the same — Chris said "fine, keep" but with a caveat note. See §3 below. |
| `ROASTING LEARNINGS · TO CARRY FORWARD` | Renders today | Renders — but `starting_hypothesis_for_similar` is reliably NULL on Unresolved lots (confirmed on both samples). Carry-forward block may render as 2-of-3 rows in practice. |
| `GreenBeanInfoCard` / `RoastLogTable` / `PerRoastReflections` / All Cuppings / Experiment Journey | All render | All render the same |

**One-shot nuance** (per Chris voice memo): one-shot Unresolved lots have a "leading-by-default since N=1" semantics. Chris said "for simplicity's sake we could still call it the leading one" — i.e. don't fork the vocabulary for one-shot. The page shape is the same; the prose just lands differently (one row instead of three).

**Triage**: keep in polish bundle. This is the single highest-leverage piece of the entire sprint — collapses the resolved bug, the Unresolved index addition, and Chris's "Reference → Leading" rename into one coordinated change. Surfaces multiple Phase 3 decisions (token choice for hero tile; what threshold of carry-forward prose makes a lot "Unresolved" rather than "Waiting for next cupping" forever — see §11 below).

---

## 3. Carry-forward learnings caution flag on Unresolved lots (B — Chris mentioned in voice memo, surfacing for ratification)

Chris's voice memo: "We did learn something from doing this, but we should just be careful of the learnings we pull out of this to truly carry forward because we did not get to a resolved state."

On Higuito + SRN, the `ROASTING LEARNINGS · TO CARRY FORWARD` block has rich prose (cultivar_takeaway + general_takeaway both well-populated; `starting_hypothesis_for_similar` NULL).

The question: does the Unresolved view-shape render a visual signal — a muted top border on the carry-forward card, a small "from an unresolved lot" annotation — to remind the reader that these learnings come from a lot that didn't reach a verdict?

Two framings:
- **Light-touch**: a single-line annotation under the `ROASTING LEARNINGS · TO CARRY FORWARD` header on the Unresolved view-shape only ("These takeaways come from a lot that closed without a confirmed reference. Read as working hypotheses, not validated rules.").
- **No-touch**: the badge + missing reference cards above already carry the signal; trust the reader.

Phase 3 decision. Surfacing here so it doesn't fall off the bundle.

---

## 4. Cross-cutting pattern — section-reorder + collapse-default (D)

Both V-set waiting views share this rule shape:

| Lifecycle state | Front-load | Demote / collapse |
|---|---|---|
| Waiting for next roast | `ROASTS · V_n` (Drop temp / Expected total / End condition / Predicted Agtron WB / Drop Rules) | Hypothesis (truncate-with-expander OR move below Drop Rules); ExperimentFrame (collapsed); RoastLog (collapsed) |
| Waiting for next cupping | `CUPPING HYPOTHESIS · V_n` (Producer notes / Previous Leading Slot cup notes / Taste For / Predicted Cup) + `ROAST ACTUALS · V_n` | Original prediction (drop entirely; keep delta in actual→delta cells); ExperimentFrame (collapsed); RoastLog (collapsed); Recipe Design Intent (already collapsed today, keep) |

The shared rule is "front-load the V_n-specific question, demote cross-cutting context." This matches the kickoff brief's catalogue items 12 + 13 word-for-word. The audit confirms both.

**Forward investment**: the Unresolved view-shape inherits the same pattern (front-load the "what did we learn" surface, demote the context cards). And once Reference Roasts becomes its own entity (§8), the Resolved view-shape may want a parallel reorder pass — but that's outside Sub-sprint 4a scope.

**Triage**: keep both view reorders in the polish bundle. They're a single coordinated rendering pass.

---

## 5. Cupping Hypothesis "Taste For" sharpening — this is an Actor 2 (prompt) problem, not just Actor 6 (render) (B + C)

Chris flagged this on page 4-5 of his audit ("we may need to sharpen on what is stored in these fields") and gave a Bukure V2a example via clarifying voice memo. The example shows:

**Today's prose** (verbose, 3-clause structured citation):
> v2a (234°C, NO FC - underdeveloped floor marker). (1) Producer notes (cranberry/honeycomb/lingonberry): almost certainly absent - don't expect them through underdevelopment. (2) vs V1 memory: this will be markedly worse/rawer than any V1 slot - all of which at least reached FC. (3) The adjustment tested: 6°C below v1a was meant to surface brightness; instead it fell below FC. Taste only to calibrate what sub-FC underdevelopment tastes like on this lot (green/hay/sour reference point) - it's a diagnostic data point, not a candidate. Fine to skip if bandwidth is tight.

**Chris's target shape** (compact, action-anchored):
> The producer's notes will almost certainly be absent — don't expect them because of the underdeveloped roast. Taste only to calibrate what underdevelopment tastes like on this lot.

**Substrate location**: the prose is authored by claude.ai during cupping sessions and pushed via `push_experiment(taste_for_a/b/c/d)`. Look at `docs/prompts/log-cupping.md` STAGE 2 (where the experiment patch payload is composed) to find where the structured 3-clause framing comes from.

**Two framings for Phase 3**:

- **Actor 2 fix (preferred)**: tighten the prompt's instructions for what `taste_for_<slot>` should contain. Drop the structured "(1) producer notes / (2) V_(n-1) memory / (3) adjustment tested" framing — that's still useful as Claude's *internal reasoning structure*, but the *stored prose* should be 1-2 sentences max: a single tasting expectation + a single action ("taste for X / skip if Y"). The producer notes + V_(n-1) cup notes already render as their own boxed sub-cards on the mockup; redundant inclusion in the per-slot prose is the source of the bloat.
- **Actor 6 fix (fallback)**: render-time truncate the existing prose to first sentence + "expand" disclosure. Cheaper but doesn't solve the storage bloat long-term, and the truncation point would have to be heuristic.

**Compounding signal**: the same problem applies to `experiments.observed_outcome_<slot>` (the V_(n-1) winner cup notes block today renders observed_outcome prose, also generated by claude.ai at log-cupping time, also potentially verbose). If we tighten `taste_for` we should consider tightening `observed_outcome` in the same prompt pass — the field has the same lifecycle and the same render surface.

**Recommended Phase 3 path**: Actor 2 fix + Chris's "I can give you a bunch of examples" offer becomes the input. Bring 3-5 representative examples (current verbose form + Chris's preferred tight form) and a corresponding `log-cupping.md` patch.

**Triage**: keep in polish bundle (it's directly UX-facing). May get scoped to "first pass = prompt tightening + Phase 3 review of the rendered output; second pass = render-truncate if the prompt fix isn't enough."

---

## 6. Roast Actuals "actual → delta" format — confirm the delta source (B — small)

Chris confirmed via voice memo that `delta_from_roast_<slot>` is fine as the source for the secondary half. Substrate spot-check: this field is populated on `experiments` rows that went through the new log-roast.md prompt (verified on Higuito V3 via the feedback log). For experiments that pre-date the prompt rewrite (Round 1, 2026-05-14), the field may be NULL.

Phase 3 consideration: when `delta_from_roast_<slot>` is NULL but the recipe has a populated prediction, the render could compute the delta on the fly from raw actual vs recipe prediction. Cheap fallback that lights up the format on older lots.

**Triage**: keep in polish bundle (Chris's mockup #2). Minor sizing.

---

## 7. Dormant substrate inventory — corrected after code re-read (E)

The kickoff brief listed 8 dormant fields. After reading the resolved view + the All Cuppings rendering carefully, the actual dormant set is smaller than the brief suggested:

| Field | Listed by brief as | Actual state | Sub-sprint scope? |
|---|---|---|---|
| `cuppings.sweetness` | Render wiring needed | **Actually NOT rendered** — All Cuppings rendering at [page.tsx:1622](../../app/(app)/green/%5Bid%5D/page.tsx) reads `cup.sweetness` for the labeled-rows fallback (only when `cup.overall` is NULL). Cuppings with `overall` populated never surface sweetness. Pourover sub-card on Resolved view also renders it in labeled-rows fallback. **Partial — needs Phase 3 decision: render as own row when populated, regardless of `overall`?** | Probably yes |
| `cuppings.temperature_behavior` | Render wiring needed | Actually renders today on All Cuppings ([line 1644-1649](../../app/(app)/green/%5Bid%5D/page.tsx)) AND on the Resolved-view pourover sub-card (line 1447). NOT dormant. | No |
| `cuppings.aromatic_behavior` / `structural_behavior` | Render wiring needed | Actually renders today on Resolved-view pourover sub-card ([lines 1454-1469](../../app/(app)/green/%5Bid%5D/page.tsx)). NOT dormant. Does NOT render on All Cuppings list; uncertain whether that's intentional. | Confirm with Chris |
| `cuppings.recipe_variant` | "lightweight summary" callout asked in Round 7 #4 | Renders inline today on All Cuppings ([line 1640](../../app/(app)/green/%5Bid%5D/page.tsx)) as `· {recipe_variant}` in the mono meta line. Possibly not the "lightweight summary" Chris had in mind. Worth confirming. | Maybe |
| `cuppings.wb_to_ground_delta` | Schema sprint S1 generated column | Renders today on All Cuppings ([line 1650-1655](../../app/(app)/green/%5Bid%5D/page.tsx)). NOT dormant. | No |
| `green_beans.canonicals_updated_at` + `*_provenance` | Footer added Sprint 3.2 #8 | Spot-checked Higuito + SRN: `terroir_provenance = 'canonical'`, `cultivar_provenance = 'canonical'`, `canonicals_updated_at = NULL`. Footer code is in `GreenBeanInfoCard` but never fires on today's data. Dormant by lack of trigger event, not by missing render. | Probably defer — see §11 |
| `roasts.inlet_curve_recorded` + 3 RoR cols + `fc_audibility` + `tp_time` + `tp_temp` | Sprint 3.5 / 11 fields | Spot-checked Higuito's reference roast (Batch #185): all NULL. The Sprint 3.5 backfill on existing roasts requires a re-pull via `pull_roest_log`; the backfill hasn't been run. **Real dormant**, but the gap is on the **data side**, not the render side. | See §10 |
| `roasts.color_description` | R57 rewire — coalesces Roest UI Notes | Higuito's reference roast has a populated `color_description` ("Light color - whole bean…"). Verified the field exists and renders nowhere on the resolved view today. **Real dormant**. | Probably yes — small render add |

**Net**: ~3 real "render missing" items + 2 "data missing" items + 3 "renders today, contrary to brief framing" corrections.

**Triage**: keep `cuppings.sweetness` standalone render + `color_description` render in the polish bundle. Defer Sprint 3.5 data backfill to the §10 thread. Defer provenance UI per §11.

---

## 8. Reference Roasts entity — out of polish scope (G — recommend deferring to its own sub-sprint)

The kickoff brief lists this as part of Sub-sprint 4a, citing [docs/features/reference-roast-and-guide.md](docs/features/reference-roast-and-guide.md) Sprint B. Chris's audit does NOT mention it once. He treated the existing `roast_learnings.best_batch_id` + `roasts.is_reference` substrate as fine — the only render changes he asked for are within the existing schema.

**Recommendation**: defer the Reference Roasts entity work to its own sub-sprint (4a.2 or push into 4b's order). Reasoning:
- Schema entity creation, new MCP Tools, migration, and a corresponding read-side rewrite is a multi-day chunk.
- Bundling it with the polish work risks making the polish bundle un-shippable.
- The polish bundle as Chris scoped it is self-contained at the read level.

Phase 3 sizing call. If Phase 3 disagrees and wants Reference Roasts in-scope, the resolved-bug fix in §1 + the Unresolved view-shape in §2 + the Reference Roasts entity all touch the same `learnings.best_batch_id` substrate and should be sequenced explicitly so they don't trip over each other.

**Triage**: surface to Phase 3 as a scope decision. Default = defer.

---

## 9. POD-1 absorption — defer (G)

Kickoff brief: "1 of 4 promotion triggers fired; Path C-2 framing validated 2026-05-21. Confirm trigger conditions before pulling in."

Round 13 #7 (CGLE Sudan Rume Natural close-out, 2026-05-23) advances POD-1 trigger conditions — Path C-2 → Path A transition completed cleanly via real-pourover discriminator. That's 1.x of 4 triggers; not enough for promotion.

**Triage**: defer. Out of polish scope; revisit at next sub-sprint planning when trigger count crosses threshold.

---

## 10. Sprint 3.5 RoR + inlet_curve_recorded rendering — data side blocks the render side (E + G partial)

The Sprint 3.5 migration (070, 2026-05-26) populates `roasts.inlet_curve_recorded` + the 3 RoR columns + `tp_time` + `tp_temp` + `yellowing_temp` for **new pulls only** OR via re-pull of existing roast logs. Spot-checked Higuito's reference roast: all NULL post-migration.

This means render work alone won't surface these on existing closed lots — a re-pull pass via `pull_roest_log` for the ~6 resolved lots + ~10 in-flight lots is needed to light up the data. The re-pull is server-trivial (the API endpoint is live and tested), but it's a workflow concern (which lots get re-pulled, by whom, when).

**Two scope splits**:
- **Polish-scope** (small, render-only): wire the render path for the new fields on the WaitingForNextCuppingView roast actuals card + ResolvedView reference roast card. Renders em-dash on lots whose data isn't backfilled. Forward investment.
- **Out-of-polish-scope** (workflow-side): the actual re-pull pass to light up the data on existing lots. This is a one-off claude.ai session per lot (or a batched MCP-side operation).

Chris's audit does NOT mention Sprint 3.5 fields. So neither track is strictly in his scope. But the polish-scope render is cheap forward investment that pairs naturally with the Roast Actuals reformat (§6). Worth surfacing.

**Triage**: polish-scope (render only) — surface for Phase 3 decision (include or defer to 4a.2 / a later sprint). Out-of-polish-scope re-pull pass — defer to a separate Workflow track.

---

## 11. Provenance UI surfacing — defer (G)

Higuito + SRN + every existing lot has `*_provenance = 'canonical'` and `canonicals_updated_at = NULL`. The footer added Sprint 3.2 #8 never fires today.

The kickoff brief asked: "Decide: is this still worth surfacing pre-emptively, or wait until first auto-created provenance lands?"

**Recommendation**: defer. Render-side trigger is dormant by lack of data, not by missing code. Lights up automatically when the first auto-created provenance row lands.

**Triage**: defer.

---

## 12. Round 11 #11 — candidate run-off pourover concept (B — small schema question)

Chris flagged this in Round 11 of the feedback log (CGLE Sudan Rume V5, 2026-05-22): today both candidate run-off pourover AND post-optimization brew use `recipe_variant: "real_pourover"`. Suggests `is_run_off: bool` or a split `recipe_variant` enum (e.g. `candidate_run_off` vs `optimized_pourover`).

Chris's audit doesn't mention it directly. But it's a small schema question that nicely intersects the ResolvedView's REFERENCE CUP rendering (the "Optimized Brew · #N retasted" sub-card currently picks via FK match on `brews.roast_id = best_roast_id`, which would NOT disambiguate run-off vs optimized).

**Triage**: surface for Phase 3 decision. If included, it's a 1-column migration + a small render-side tweak. If excluded, the existing surface continues to silently conflate the two phases.

---

## 13. Round 10 #12 — rest-days drift in REFERENCE CUP (B — small)

Round 10 (CGLE Sudan Rume V5): "Rest-days drift not queryable as a structured field — currently prose-only via `additional_notes` prefix `REST_DAYS_DRIFT:`. UI surface implication: should the resolved view's REFERENCE CUP block surface rest-days drift?"

ResolvedView today renders `rest_days` on the pourover sub-card as `{rest_days}d rest`. Doesn't surface a "drift from intended rest" signal.

**Triage**: low-priority polish. Surface for Phase 3 decision. Could be deferred to a schema-side sprint where `cuppings.rest_days_intended` becomes a column.

---

## 14. Round 14 #12 (Mt Elgon) — drop rules disappearing on state-flip (C — already addressed, confirm)

Kickoff brief: "Drop rules disappear from waiting-for-roast page view after roast logged. Verify whether Sub Pages 6.8 already addressed this."

Sub Pages 6.8 (2026-05-24) shipped a `<CollapsibleSection title="Recipe Design Intent">` wrapper around `<DropRulesCard>` on the waiting-for-next-cupping view + ResolvedView. So drop rules ARE surfaced after the state flip — just collapsed.

**Triage**: already addressed by 6.8 (verified in code at lines 1409-1414 for ResolvedView + similar block on the cupping view). No new work required. Worth a 1-line confirmation in Phase 3 plan.

---

## 15. Mobile layout (B — surface for Phase 3 decision)

The transposed per-batch tables on both V-set waiting views (Roast Hypothesis + Cupping Hypothesis + Roast Actuals) can hit horizontal overflow at narrower viewports. Chris's mockup #1 (Cupping Hypothesis) shows tightened column widths that fit within the viewport without scroll — that's actually a mobile-friendliness signal as much as a desktop polish signal.

Chris's standing rule (CLAUDE.md § Design / UX conventions): "Desktop is the primary design target. Tablet spot-check via `preview_resize` on every UI sprint; phone-scope lives in its own sprint."

**Triage**: keep tablet spot-check in scope. Defer phone-scope to a dedicated mobile sprint per Chris's design conventions.

---

## 16. PerRoastReflections — already adopted, may be dense (B — small)

The kickoff brief flagged "verify it renders correctly on all 3 view shapes and that the prose density isn't overwhelming."

Verified: `<PerRoastReflections>` is present on both V-set waiting views + the Resolved view, all 3 times defaultCollapsed via the component's own logic. Chris's audit didn't flag density. Treating as resolved.

**Triage**: skip.

---

## 17. Empty-state copy consistency (B — micro)

`/green` index empty-state ("Lots land here once a roasting session in claude.ai writes…") and `/brews` empty-state (post-Sub-sprint 4 update: "Brews land here once a brewing session…") should match in voice / typography. Quick spot-check during Phase 3.

**Triage**: micro-polish, fold in.

---

## Summary of Phase 3 decisions surfaced

For your decisioning when you walk into Phase 3:

1. **Hero tile color for Unresolved view-shape** — new 4th token, or reuse gray? (§2)
2. **Carry-forward learnings caution annotation** — light-touch annotation on Unresolved view, or no-touch? (§3)
3. **Taste For prompt tightening** — preferred Actor 2 path (need Chris's examples). Same pass for observed_outcome? (§5)
4. **Reference Roasts entity** — in-scope for 4a, or defer to its own sub-sprint? Default recommend: defer. (§8)
5. **POD-1 absorption** — confirm defer (1.x of 4 triggers fired). (§9)
6. **Sprint 3.5 RoR + inlet_curve_recorded render** — include polish-scope render? Re-pull pass = separate Workflow track. (§10)
7. **Provenance UI** — confirm defer until first auto-created row lands. (§11)
8. **Run-off pourover concept** — `is_run_off: bool` schema-level disambiguation? Or defer? (§12)
9. **Rest-days drift surface** — defer (schema work first)? (§13)
10. **Mobile / tablet scope** — tablet spot-check only; phone-scope = its own sprint. (§15)
11. **Rancho Tio confirm** — does it have a `roast_learnings` row in production? (§1 caveat — affects discriminator design)

---

## Bundle-shape preview (for Phase 3 — not a plan, just a sketch)

Reading the audit + this pass, the natural bundle split looks like:

- **Bundle A** (substrate + biggest UX win): Unresolved state + view-shape + bug fix (§1, §2, §3). Touches lifecycle helper, /green index, all 4 view-shape dispatch.
- **Bundle B** (V-set view reorders): WaitingForNextRoastView + WaitingForNextCuppingView section reorder + collapse-defaults + Roast Actuals reformat (§4, §6). Mockups #1 + #2 land here.
- **Bundle C** (Cupping prompt tightening): `docs/prompts/log-cupping.md` patch + experiment payload prose review (§5).
- **Bundle D** (small render adds): `color_description` surface + cuppings.sweetness standalone render + Sprint 3.5 render-only wiring + empty-state copy unification (§7, §10, §17).
- **Out-of-bundle**: Reference Roasts entity, POD-1, run-off pourover, rest-days drift, provenance UI (deferred to future sprints).

Bundle A ships first (substrate underneath everything else). Bundles B + C + D are independently shippable in any order after that.

---

*End of complementary pass.*
