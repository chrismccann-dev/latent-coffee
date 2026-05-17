# Grilling 2026-05-17 — Brewing cross-party audit follow-ups

## Session summary

First **cross-party** `/grill-with-docs` session — a new audit flavor where Claude Code (auditor) and brewing-side claude.ai (auditee) interrogate CONTEXT.md against claude.ai's lived workflow vocabulary, with Chris as pure human relay. The standard grilling shape audits Claude Code's read of the codebase against Chris's audio context; this flavor audits **claude.ai's input-layer surface** (project system prompts, MCP Tool descriptions, accumulated thread patterns, operational doc usage) for terminology drift invisible from the Claude-Code side.

**Mechanics**:

- 7 grilling rounds (1 calibration + 6 substantive)
- ~2 hours wall-clock (audit-style turns, grep-first discipline locked in by Round 2)
- Chris was pure relay — no context-addition, no re-framing — verifying the audit surfaces claude.ai's view rather than his

**Outputs**:

- [CONTEXT.md](../../CONTEXT.md) — **7 new glossary entries** under the Brewing sub-section: Named Consideration, WBC corpus check, Wrong-zone trap, Iteration budget, Diminishing returns, Strategy pivot, Brewer rotation discipline. **1 cluster note appended** to the Iteration loop entry naming the three iteration-termination paths.
- [BREWING.md](../../BREWING.md) — **1 byproduct edit**: line 250 "strategy shift" → "strategy pivot" for cross-doc vocabulary coherence.
- [next.config.js](../../next.config.js) — **bundle fix** (separately merged as [latent-coffee#164](https://github.com/chrismccann-dev/latent-coffee/pull/164)): added `./CONTEXT.md` + `./docs/roasting/*.md` to `outputFileTracingIncludes` for `/api/mcp/**`. Surfaced when claude.ai tried to `read_doc(uri="docs://context.md")` and ENOENT'd — the docs were registered as Resources in [lib/mcp/docs.ts](../../lib/mcp/docs.ts) but never added to the Vercel bundle glob. Recurring pattern of `feedback_vercel_bundle_static_files.md`; cross-party grilling is the only workflow shape that forces claude.ai to actually fetch CONTEXT.md cold, which is why this bug surfaced now.

## The 7 new headwords (iteration-cluster taxonomy + workflow stance)

The session converged on a coherent **iteration-cluster** in CONTEXT.md's Brewing sub-section. All six iteration-related entries cross-reference each other:

| Entry | Role | Cluster position |
|---|---|---|
| **Named Consideration** | Step 1d gate item orthogonal to Axis 1 / Axis 2 | Upstream of iteration (Coffee Brief sub-step) |
| **WBC corpus check** | 2nd Named Consideration instance (v8.5 BREWING.md) | Upstream of iteration |
| **Wrong-zone trap** | Post-hoc failure-mode noun, N=1 by design (Motta event) | Failure shape of the loop |
| **Iteration loop** | (already headworded) The dial-in cycle | Pre-existing anchor |
| **Iteration budget** | Consumable resource bound — physical × cognitive × pragmatic, floor-of-three | Resource bound on the loop |
| **Diminishing returns** | Success terminator — signal-content side of the pragmatic cap | Loop termination path 1 |
| **Strategy pivot** | Mid-loop course correction — active prevention surface | Loop termination path 2 |
| **Brewer rotation discipline** | Workflow-stance: deliberate-choice on a different axis (vehicle) | Sibling cluster to iteration termination |

Plus the **inter-side observation** load-bearing across the session: **diminishing returns + Iteration budget's pragmatic cap are the same event viewed from two sides** — the budget framing names the resource consumed, the diminishing-returns framing names the signal content. Both framings answer different questions (resource consumption vs signal quality) about the same decision moment.

## Standing decision: brewing cluster audit complete

No further high-conviction drift remaining in the brewing-side glossary cluster after Round 7's final-scan pass. The iteration-cluster taxonomy is structurally complete (6 entries + cluster note); Brewer rotation discipline closes the workflow-stance vocabulary on the deliberate-choice axis. Lower-conviction lingering items (`what_i_learned`, Suppression mechanics drift, Optimized brew cross-side load, Cooling Behavior Observations) are parked — flagged as defensible-omission or low-priority by claude.ai's own assessment.

**Proceed with routine brewing**; the audit's outputs ship via this PR.

## 3 permanent methodology rules for cross-party grilling

Distilled from claude.ai's Round 7 retrospective + the session's confabulation pattern. These earn permanent status as standing audit discipline for future cross-party grilling sessions:

**R1. Grep-first, write-second** *(locked Round 2; extended this session)*. Every "missing X" claim must be grep-verified before recording. **Extension**: grep operational docs (BREWING.md, prompts, sub-docs) BEFORE CONTEXT.md, not after — operational docs constrain what the canonical noun should be. CONTEXT.md vocabulary should follow lived authoring, not lead it.

**R2. Operational-vs-analytical boundary classification**. Before drafting any "missing term" headword, classify the term: is this **analytical** (CONTEXT.md candidate — names a meta-concept the operational docs operate on procedurally) or **operational** (BREWING.md / prompts territory — defensible omission from CONTEXT.md)? The classification gates whether to draft at all. This rule ruled out **6 of 8** of claude.ai's pre-audit "missing term" claims this session (Step 1a-d / Brew 1/2/N / SWORKS valve mapping / Process-Variety Signal Table / Strategy+Modifier Notation / equipment instances like Melodrip + Paragon).

**R3. Confabulation ledger as session artifact**. Record every grep-against-existing-headword that revealed a confabulation. **Three landed this session**: Coffee Brief (existed at CONTEXT.md line 204), Signal override (existed at line 246), Roaster signal (existed at line 242 combined with House style). Pattern: confabulations all came from impression-based chunk-reading without verified indexing. **Methodology rule**: for any doc over ~500 lines, build a headword index (`grep '^\*\*<term>\*\*:'` once, cache the list) before any "is X headworded?" claim. The ledger surfaces the pattern of confabulation under impression-reading and forces the disciplined-grep correction that defines the rest of the audit's reliability.

## 8 follow-up actions

### Sprint candidates (Sprint A bundles 2-3; sequencing below)

**1. lib/mcp/docs.ts CONTEXT.md description update** [DOC EDIT — low-effort, high-value for claude.ai discoverability]

The current description enumerates roasting-side concepts (V-set, batch slot, experiment frame, etc.) but doesn't mention brewing-side concepts. claude.ai uses the description to decide whether to read CONTEXT.md for a given question; without brewing enumeration, it may not realize CONTEXT.md is the right surface for brewing-side vocabulary. Update the description to add a Brewing cluster enumeration (Coffee Brief / Named Consideration / Iteration budget / Diminishing returns / Strategy pivot / Wrong-zone trap / Brewer rotation discipline / Hybrid sub-form / Two-Axis Framework / extraction strategy / signal arbitration) alongside the existing roasting enumeration.

Surface: [lib/mcp/docs.ts](../../lib/mcp/docs.ts) `DOC_DESCRIPTIONS['docs://context.md']`. Single-string edit.

**2. Vercel bundle audit guardrail** [PROCESS / INFRASTRUCTURE]

The CONTEXT.md bundle miss (fixed in [PR #164](https://github.com/chrismccann-dev/latent-coffee/pull/164)) is the **third occurrence** of the same pattern (PR #65, the docs/roasting/*.md miss this session, and CONTEXT.md itself). Standing rule [feedback_vercel_bundle_static_files.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_vercel_bundle_static_files.md) exists but didn't prevent recurrence because the rule lives in memory, not in code/CI.

Mitigation candidates: (a) script that diffs `lib/mcp/docs.ts` `DOC_FILES` keys against the `outputFileTracingIncludes` glob and warns on mismatch; (b) pre-commit hook on changes to either file; (c) a one-line addition to the standing **substrate-change audit checklist** in CLAUDE.md sprint cadence #4. Option (c) is cheapest and probably sufficient.

**3. Brewer rotation discipline → Default-brewer trap split** [FUTURE AUDIT]

The Brewer rotation discipline entry contains "Default-brewer trap" as a sibling-to-Wrong-zone-trap concept embedded inside the entry. Mirror of how Wrong-zone trap got first-class treatment in Round 3 of this session. **Promotion trigger**: if a future brew lands where the default-brewer-trap diagnostic mimics wrong-zone-trap, requiring claude.ai to disambiguate which trap fired, the entry should split — Brewer rotation discipline (the practice) + Default-brewer trap (the failure mode the practice prevents) + possibly Brewer-jump (the mid-iteration recovery move parallel to Strategy pivot).

Surface: CONTEXT.md Brewing sub-section. Low priority until a triggering brew lands.

### Roasting-cluster sibling work — partially addressed by parallel session

**Update (2026-05-17, post-PR-merge)**: the roasting cross-party `/grill-with-docs` session ran in parallel with this one (Chris had a sibling Claude Code session open against `claude.ai/projects/roasting`), shipping as [latent-coffee#167](https://github.com/chrismccann-dev/latent-coffee/pull/167) — **21 entries + 9 existing edits + 3 ADRs**. Chris's actual standing rule was "don't make major roasting MCP changes until the in-flight green-bean dogfood finishes" (scoped to MCP changes only, NOT the grilling session itself); that rule is correctly captured in #167's brief. The "Sprint B queued for after dogfood" framing in this brief's earlier wording was inaccurate — corrected here for historical traceability.

Neither item below was picked up by #167. Both remain on the board as **future-scope** for a third audit or as inline edits when load-bearing-ness emerges.

**4. V-set budget headword** [FUTURE AUDIT — not picked up by #167]

Direct roasting-side sibling to **Iteration budget**. Named once in CONTEXT.md Relationships ("the roasting side's ~10-V-set budget per green lot") with no headword. Same hybrid structure (physical floor × cognitive ceiling × reference-roast judgment), different physical floor (green-bean weight rather than roasted-bag weight). Drafting this closes the symmetry that Iteration budget's body explicitly references.

Surface: CONTEXT.md Roasting sub-section. **Status**: #167's 21-entry roasting session covered FC floor / Drop ceiling / Anchor profile / Anchor confidence / Signal precedence / Multi-factor weighting / Experiment umbrella / and more — but didn't include V-set budget. Possible interpretations: deemed not-yet-load-bearing at current corpus size (13 closed lots); missed via audit-scope; or deferred to a future round. Future-scope.

**5. Cross-side parallel-table sweep** [FUTURE AUDIT — methodology, not picked up by #167]

Original recommendation: front-load a parallel-structure check before per-entry grep work in any cross-party audit that has a structurally parallel sibling-side cluster. #167's roasting session used a topic-driven structure (7 rounds covering specific concepts: WB→Gnd / schema-writing seam / taste-for / signal precedence / etc.) rather than a parallel-table opener. The methodology still has merit for future cross-party sessions (e.g. a third audit running both sides simultaneously) but wasn't applied in #167.

Method: opening question of any future cross-party session where the cluster being audited has a sibling-side cluster already-locked. Identifies which concepts have analogs, where symmetry is clean, and where asymmetry is real-and-load-bearing.

### Parked candidates (re-test triggers, not actionable today)

**6. WBC corpus check composite split** [RE-TEST TRIGGER]

The v8.5 BREWING.md bundle of "WBC corpus + cross-cutting control patterns check" was preserved as one Named Consideration with two sub-halves rather than split into two distinct Named Considerations. The entry's body flags the split as future-scope: "the composite may be load-bearing-confusing in practice; future grilling may split."

**Re-test trigger**: if a future brew fires the cross-cutting-axis half (e.g. "Clarity-First mechanically but the real move is water 90ppm → 50ppm") without the corpus-pattern half (no WBC competitor match), and the unified Named Consideration label obscures which half fired, split.

**7. Cooling Behavior Observations as separate glossary entry** [FUTURE AUDIT]

claude.ai flagged in Round 7 as moderate-conviction lower-priority. CONTEXT.md has Cooling-Curve Target (the design-time declaration) but not the empirical-observation surface that BREWING.md § Cooling Behavior Observations populates (separate from the Step 1d Named Consideration). Possible glossary entry if it becomes load-bearing.

**Re-test trigger**: if a future brew's cooling-behavior observations diverge from any Step 1d Cooling-Curve Target prediction in a load-bearing way (e.g. peak window narrower than declared), the empirical surface earns its own entry.

**8. what_i_learned dual semantic role** [PARKED — defensible omission]

6 body refs in CONTEXT.md, 0 headwords, dual semantic role (per-brew learnings as Step 4 bullets + compensation reasoning when a roast wasn't reference-quality). claude.ai's Round 2 assessment: "moderate candidate, defensible omission since column-shaped rather than concept-shaped."

**Re-test trigger**: if the dual semantic role causes claude.ai to write inconsistently across the two contexts, or if the field's load-bearing-ness grows beyond the current shape, reconsider.

## Suggested sequencing

```
[ Sprint A ] lib/mcp/docs.ts description update (#1)
              + Vercel bundle audit guardrail (#2)
              [coupled — both improve cross-system substrate-change discipline;
              bundle in one short PR]

[ Sprint B ] Roasting cluster cross-party grilling (#4 + #5)
              [queued for after Chris's green-bean dogfood closes; opens with
              parallel-table sweep, then per-entry deep-dives]

[ Future audit ] If re-test triggers fire: #3 (Default-brewer trap split),
                 #6 (WBC corpus check split), #7 (Cooling Behavior empirical),
                 #8 (what_i_learned dual role)
```

Sprint A is lowest-effort and closes the cross-system substrate-change loop. Sprint B is queued behind dogfood. Re-test triggers are passive — they fire when a real workflow event surfaces the underlying ambiguity.

## Cumulative grilling backlog (combined across sessions)

Combining with prior sessions' followups:

- **Roasting cluster** (2026-05-14, 7 items): mostly closed; remaining items folded into the 2026-05-17 roasting cross-party session below
- **Brewing cluster** (2026-05-15, 9 items): mostly closed via Sprints 1g and 8.5; some parked
- **MCP cluster** (2026-05-15): items in Sprint A category
- **Canonical registries cluster** (2026-05-16): items already tracked in PRODUCT.md sprint queue
- **WBC reference materials cluster** (2026-05-16): items already tracked
- **Synthesis cluster** (2026-05-16): items already tracked
- **Brewing cross-party** (this session, 2026-05-17, 8 items): 2 Sprint A (shipped via [#166](https://github.com/chrismccann-dev/latent-coffee/pull/166)) · 2 items not picked up by parallel roasting session [#167](https://github.com/chrismccann-dev/latent-coffee/pull/167) · 4 parked with re-test triggers
- **Roasting cross-party** (2026-05-17, sibling session shipped as [#167](https://github.com/chrismccann-dev/latent-coffee/pull/167)): 21 new entries + 9 existing edits + 3 ADRs (anchor canonicalization / vset-close schema seam / parameter-type signal arbitration) + 6 flagged ambiguities + 9 follow-ups. Surfaced the "substrate-practice gap audit" framing as a candidate name for the cross-party shape itself; if a third session repeats the pattern, ADR-0006 candidate per #167's flag.

**Mega-cleanup Session 7** (queued separately) bundles cross-cluster sequencing work. Cross-party grilling was run **before** mega-cleanup specifically to surface drift that would change Part 1 priorities — both this session's findings (R1 / R2 / R3 methodology rules, the iteration cluster build, the bundle fix) and the roasting cross-party's findings (3 ADRs, substrate-practice gap pattern) all feed into mega-cleanup's substrate.

**Cross-side asymmetry worth a third audit**: this session's Signal override entry frames brewing as "judgment-based weighting, not strict precedence"; #167's brief characterizes brewing as "pure-precedence" (vs roasting which is parameter-type-conditional per ADR-0005). Interpretive drift between two parallel sessions, not a clear bug — a third audit running both sides simultaneously would resolve which framing is canonical. Low-priority follow-up.

## Confabulation ledger (running)

This is the first session to formally log confabulations against existing headwords. Three landed:

| # | Confabulated claim | Actual state | Round |
|---|---|---|---|
| 1 | "Coffee Brief has no headword" | Headword at CONTEXT.md line 204 with full Avoid list | Pre-audit / calibration |
| 2 | "Signal override has no headword" | Headword at CONTEXT.md line 246 with full body | Round 1 (referenced) |
| 3 | "Roaster signal has no headword while Variety/Process do (asymmetry)" | Roaster signal headworded at line 242 combined with House style | Calibration |

All three resolved by Round 2's grep-first discipline lock. Rounds 3-7 ran clean — zero confabulations against existing headwords.

**Pattern**: confabulations originated from impression-based chunk-reading of the doc, not from missing data — claude.ai had the content loaded but generated structural claims from impression rather than verified index. R3 above formalizes the methodology fix.

## Audio dictation + relay note

Cross-party shape worked. Chris's pure-relay discipline (no re-framing, no context-addition) was load-bearing — claude.ai's responses surfaced its OWN authoring vocabulary, not a Chris-mediated version. The relay overhead was ~2x compared to a Chris-direct grilling session (every question + response paste added ~30s); offset by the higher confidence in the audit's findings.

Repeat the pattern for the roasting-cluster cross-party session (Sprint B). Don't ask Chris to add context mid-session even when claude.ai surfaces a confabulation — the meta-pattern is the audit material.

## Open questions for future grilling sessions

- The brewing-side iteration cluster is now load-bearing on **6 cross-referenced entries**. Future Brewing-cluster grilling should approach the cluster as a unit — adding to it should require explicit framing against the existing 6.
- **Cross-side parallel structure check** (#5 above) is generalizable beyond roasting. Future grilling that touches any cluster with a sibling-side concept (Brewing ↔ Roasting iteration loops; brews ↔ green_beans entity shapes; resolved-brew ↔ reference-roast artifact roles) should open with a parallel-table sweep.
- The **operational-vs-analytical boundary** (R2) is doing real work as a methodology rule but may itself become glossary-shaped if the boundary keeps coming up as a structural distinction. Possible future entry: "Analytical-layer concept" / "Operational-layer concept" as paired glossary terms naming the boundary itself. Low priority; would only fire if the boundary needs to be cited in new entries explicitly.
