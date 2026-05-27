# Research roadmap

**Owner:** Research Coordinator
**Cadence:** Updated at every project close + during process retro + ad-hoc when operator surfaces a new idea
**Locked in:** Research Assistant Step 2 scaffolding (Step 1 grilling, 2026-05-26)

---

## Roadmap structure

Five sections, in priority order. Each entry is a one-or-two-line pointer with optional one-paragraph context. Day 1 (Step 2 ship) deliberately starts mostly empty — the next session is a roadmap talk-through where the operator + Coordinator populate § Now / § Next / § Side quests.

| Section | Meaning |
|---|---|
| **Now** | Single-slot. The research project the Coordinator is actively running. Empty when between projects (between retro completion + next-project scoping). Per [`process-retro.md`](process-retro.md), the Coordinator does not scope a new project until the prior project's retro has completed. |
| **Next** | Queued, ordered. The next research project to start after the current one closes. Order reflects priority + sequencing constraints. May be empty when nothing is queued. |
| **Extensions of completed** | Things flagged during a closed project's retro that are worth a follow-up project but aren't on the critical path. Filter-arc example: HALO-B3 vs CONE-B3 brewing-quality test (RP4 AI-4). |
| **Side quests** | Smaller research ideas that aren't full projects — measurement campaigns, registry sanity checks, single-day investigations. May graduate to § Next if they grow scope. |
| **Closed** | Closed projects with pointers to their end-documents (or to the canonical archive at `docs/research-projects/<track-slug>.md` when the project was single-track and the protocol doc IS the end-document). Reverse-chronological. |

---

## Now

*Empty. The next operator session is the roadmap talk-through that populates this.*

---

## Next

*Empty until the roadmap talk-through. The session after Step 2 closes is the talk-through itself.*

---

## Extensions of completed

### Track 5 — Brewing-quality methodology mode (Extension of filter arc)

**Scope:** First brewing-quality research project (not a flow-rate project). Seed of brewing-quality research mode — methodology to TBD at protocol time. Listed here as forward investment per the Step 1 grilling; not in Step 2's v1 scaffolding.

**Trigger candidates:** Chris is brewing regularly with HALO-B3 + CONE-B3 + LC4 + DC4 and wants to test design-intent claims; OR a third Sibarist family research-mode question fires; OR operator wants to validate the family-conditional framework (ADR-0016) on a non-CAFEC family.

**Notes:** RP4 AI-4 specifically named a "HALO-B3 vs CONE-B3 brewing-quality test" — RP4 measured both papers at functionally identical drawdown in BS (HALO-B3 91s, CONE-B3 92s within 4s noise floor). What's HALO-B3's design rationale if drawdown is identical? Flow-only measurement doesn't capture clarity / extraction / mouthfeel differences. Brewing-quality test would investigate whether HALO-B3 differentiates on non-flow dimensions.

### RP4 AI-1 — Baseline drift investigation (Extension of filter arc)

**Scope:** Opportunistic single-session investigation. HALO-B3 measured 134s in P3 but 91s in RP4 — 43s gap on the same paper, same operator, ~3 days apart. Plastic-bag-degassing hypothesis was captured during RP4 but not tested. Re-test when Chris is naturally brewing HALO-B3 again — no need to schedule a dedicated session.

**Trigger:** Chris brews HALO-B3 with a comparison-relevant context (e.g. immediately after opening a sealed pack vs. after multi-day open-bag storage). Side-quest-sized; not project-sized.

---

## Side quests

*Empty until populated by the roadmap talk-through. The Step 1 grilling did not surface any side-quest candidates beyond what's in § Extensions.*

---

## Closed

### Filter arc (4 tracks, 2026-05-21 → 2026-05-26)

The 4-track filter arc that produced the substrate for Research Assistant Step 2 scaffolding. Closed 2026-05-26 ([PR #264](https://github.com/chrismccann-dev/latent-coffee/pull/264) + main `451935d`).

| # | Track | Methodology | Closed | End-document |
|---|---|---|---|---|
| 1 | Cone Filter Drawdown | Paper-brewer-combo (V60 Glass + Sibarist CONE B3 baseline) | 2026-05-23 | [cone-filter-drawdown.md](../../../research-projects/cone-filter-drawdown.md) |
| 2 | Flat-bottom Filter Drawdown | Paper-brewer-combo (Orea Type-A + Negotiator + BOOSTER 45 exploratory pulls) | 2026-05-24 | [flat-bottom-filter-drawdown.md](../../../research-projects/flat-bottom-filter-drawdown.md) |
| 3 | Specialty Cone Filter Drawdown | Paper-brewer-combo (Funnex + Sibarist BS, 2 sub-projects) | 2026-05-25 | [specialty-cone-filter-drawdown.md](../../../research-projects/specialty-cone-filter-drawdown.md) |
| RP4 | Paper-Only V60 Cohort Re-Measurement in Sibarist BS | Paper-only methodology validation | 2026-05-26 | [paper-only-v60-cohort-drawdown.md](../../../research-projects/paper-only-v60-cohort-drawdown.md) |

**Substrate output:** ~49 lessons (numbered #1-#40 + RP4-N1 through RP4-N9) · 23 audit items (P2 AI-1 through RP4 AI-7) · 2 ADRs ([ADR-0015](../../../adr/0015-accessory-aware-flowrate-and-booster-registry.md) FilterEntry.flowRateContexts + BoosterEntry registry, [ADR-0016](../../../adr/0016-family-conditional-flow-rate-classification.md) family-conditional flow-rate classification framework). Both ADRs locked; implementation deferred to a future sprint (trigger conditions met).

**Project-level retro:** The filter-arc retro WAS the Step 1 grilling session (2026-05-26) that locked the Research Assistant Step 2 scope. The outputs of that retro are the cluster docs in this directory + ADR-0017 + the Step 2 scaffolding ship itself. The filter arc is the canonical "first project" that the methodology primitives were forged on.

---

## Roadmap update discipline

Per [`process-retro.md`](process-retro.md): the Coordinator updates this roadmap at every project close + at every retro. Mid-project, the Coordinator may update § Side quests with emergent ideas, but should NOT add to § Next mid-project (that's the retro's job — premature queuing causes scope drift).

When updating § Closed: add the new entry at the TOP (reverse-chronological) with a brief project description + closed date + end-document pointer. Don't summarize the project's findings here — those live in the end-document.

When moving a project from § Now to § Closed: § Now becomes empty until the retro runs and the next project scopes in.
