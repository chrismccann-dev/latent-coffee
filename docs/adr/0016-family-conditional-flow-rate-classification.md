# 0016 — Family-conditional flow-rate classification framework

Refines Lesson #36 from the filter-arc trifecta (cone Project #1 → flat Project #2 → specialty cone Project #3) to its post-RP4 empirically-validated form. Companion to [ADR-0015](docs/adr/0015-accessory-aware-flowrate-and-booster-registry.md) which captures the `flowRateContexts` schema; this ADR captures the **classification framework** that interprets those measurements.

## Context

**Lesson #36 (Project #3, 2026-05-25)** was framed as: *"paper 'self-choke' is paper-brewer-INTERACTION artifact, not paper-fiber-intrinsic."* Captured in the Project #3 close-out as "deepest insight of the arc." Validated mechanistically by HALO-B3 paper-only test in Sibarist BS (no choke) vs CONE28-FAST + FS-100 in Funnex (choke) — same operator, different paper-brewer combinations, different self-choke outcomes.

**Research Project #4 (paper-only V60 cohort re-measurement in Sibarist BS, closed 2026-05-26)** empirically tested Lesson #36 across the Project #1 V60 cohort. **Result: Lesson #36 is FAMILY-CONDITIONAL, not universal.** Per RP4-N4:

| Paper family | RP4 outcome in BS vs P1 V60 | Lesson #36 status |
| :---- | :---- | :---- |
| **Hario** (METEOR-02, VCF-01-100W) | Δ +2 / +4 in BS, indistinguishable both contexts. **Converged to baseline.** | ✅ VALIDATES |
| **Sibarist** (CONE-B3) | Δ +1 in BS. **Converged to baseline.** | ✅ VALIDATES |
| **CAFEC Cup 4 family** (LC4, APC4, MC4, DC4) | Δ +16 / +17 / +7 / +19 in BS, ALL REAL SLOW. **Retained paper-fiber signal.** | ❌ PARTIALLY CONTRADICTED |

CAFEC Cup 4 family hidden slowness was systematically MASKED by P1's wider 8s noise floor (RP4-N3); BS's tighter 4s noise floor disambiguated 3 of 4 CAFEC papers from `indistinguishable → REAL slow`. Per RP4 cross-project Δ-in-deltas analysis, CAFEC papers retain real paper-fiber slowness signal even when paper-brewer-fit variability is eliminated by BS architecture.

The original Lesson #36 framing was an over-generalization from the cohort sample of #1-3 (which under-sampled CAFEC family — only P3a touched CAFEC indirectly via AFD27-100W, which is Abaca not Trad).

## Decision

**Replace the universal "paper-fiber vs paper-brewer-interaction" binary with a family-conditional classification framework.** Paper families differ in whether paper-fiber signal or paper-brewer-interaction signal dominates flow-rate variability:

### Family-conditional rules (locked per RP4 evidence)

**Sibarist family** — paper-brewer-interaction dominant. When measured in well-fit brewer (Sibarist BS for HALO papers, V60 for CONE-B3/FAST), papers converge to architectural baseline. Differences across Sibarist papers are mostly artifacts of brewer-fit variability, not paper-fiber properties.

**Hario family** — paper-brewer-interaction dominant. Same as Sibarist; Hario commodity papers (METEOR-02, VCF-01) converge to architectural baseline when paper-brewer-fit is eliminated.

**CAFEC Cup 4 family** (Trad: LC4/MC4/DC4 + Abaca: APC4) — paper-fiber signal dominant. Engineered with deliberate fiber-treatment differentiation per roast-color line. Real paper-fiber slowness survives even when paper-brewer-fit variability is eliminated. **Confirms Project #1 Headline #1 (CAFEC labels describe extraction outcome, not flow physics) and extends it to the full Cup 4 line.**

**Chemex family** — partially characterized (P3 only). HM-W (manual cone-fold) vs FS-100 (factory fan-fold) show 73s drawdown spread in Funnex on same bonded pulp fiber → **fold geometry dominant** per Lesson #26. Not yet tested in BS for paper-fiber-only signal. Tentative classification: **bed-shape-from-fold-geometry dominant**, distinct from both paper-fiber and paper-brewer-interaction binary.

**Other families** — unclassified. Add as RP-N or brewing-session evidence accumulates.

### Implementation

1. **`paperFamily` discriminator field on FilterEntry.** Required for downstream query interpretation. Values per the family rules above; add new values as new families enter inventory.
2. **Per-family default flow classification interpretation.** SKILL.md-side logic should consult `paperFamily` before defaulting an uncharacterized paper's flow expectation:
   - Hario/Sibarist family + uncharacterized in brewer X → default expectation is convergence to brewer X's architectural baseline
   - CAFEC family + uncharacterized in brewer X → default expectation is paper-fiber-real signal (no convergence assumption); measurement required
   - Chemex family + uncharacterized → default expectation depends on fold geometry; measurement required for unfamiliar fold variants
3. **Family-conditional registry queries** become possible: "show all CAFEC family papers with measured paper-fiber slowness > +10s vs baseline" is a meaningful query under this framework; the universal binary couldn't support it.

### Companion to ADR-0015

ADR-0015's `flowRateContexts` array carries the **per-(paper × brewer × seating × accessory) measurements**. ADR-0016's `paperFamily` carries the **interpretation framework**. Both are required for sound flow-rate query semantics. Implementation should land both together as a single sprint.

## Implementation trigger

**TRIGGER CONDITION MET — implementation can ship any time.** RP4 (2026-05-26) is the empirical evidence for this ADR's family-conditional decision; no further trigger required.

When implementation ships, the sprint should:

1. Add `paperFamily?: string` field to FilterEntry type (start with optional + string for back-compat; tighten to enum once value list stabilizes)
2. Populate `paperFamily` for all canonical FilterEntry rows — proposed initial mapping:
   - Hario papers (METEOR-02 / VCF-01-100W / VCF-01-100M / VCF-03 / FLOW-50 / etc.) → `'Hario'`
   - Sibarist papers (CONE-B3 / CONE-FAST / HALO-B3 / HALO-FAST / CONE28-FAST / FLAT-B3 / FLAT-FAST / FLAT2-B3 / FLAT2-FAST / WAVE-B3 / WAVE-FAST / UFO-FAST / BIRD-FAST / etc.) → `'Sibarist'`
   - CAFEC Trad papers (LC4 / MC4 / DC4 / LC1 / MC1 / DC1 / TH1 / TH2 / TH3 / etc.) → `'CAFEC-Trad'`
   - CAFEC Abaca papers (APC1 / APC4 / AFD27 / AC4 variants / etc.) → `'CAFEC-Abaca'`
   - Chemex papers (CHEMEX-HM-W / CHEMEX-HM-N / FS-100 / etc.) → `'Chemex'`
   - April papers (APRIL-STD / APRIL-FAST / April B3 / etc.) → `'April'` (uncharacterized for family-conditional rule; SKILL.md should flag)
   - Kalita papers → `'Kalita'` (uncharacterized; SKILL.md flag)
   - xBloom (XBLOOM-STD) → `'xBloom'` (uncharacterized; SKILL.md flag)
   - Weber Bird (BIRD-FILTER) → `'Weber'` (uncharacterized; SKILL.md flag)
3. Add `productCode?: string` field (RP4 AI-3 / RP4-N8) — populate CAFEC entries with T-codes (T-83 = DC1/DC4; T-90 = MC1/MC4; T-92 = LC1/LC4; TH-1 / TH-2 / TH-3 series)
4. Document the family-conditional rules in `docs/skills/brewing-equipment-expert/cluster/filters.md` as a top-level reference section (parallel to existing Project #1-4 measured-drawdown reference sections)
5. SKILL.md-side query interpretation logic per § Decision § Implementation point 2 above — this lands when SKILL.md scaffolding sprint fires

### Suggested deferred follow-up

- **HALO-B3 vs CONE-B3 brewing-quality test** (RP4 AI-4 / RP4-N9) — RP4 measured both papers at functionally identical drawdown in BS (HALO-B3 91s, CONE-B3 92s within 4s noise floor). What's HALO-B3's design rationale if drawdown is identical? Flow-only measurement doesn't capture clarity / extraction / mouthfeel differences. Brewing-quality test would investigate whether HALO-B3 differentiates on non-flow dimensions. Defer until either (a) Chris brews regularly with both, (b) a brewing-decision needs the answer, or (c) Sibarist family research-mode work fires.

## Sources

- Research Project #4 close-out ([PR pending] / 2026-05-26): RP4-N3 (P1 noise-floor systematically underestimated CAFEC slowness); RP4-N4 (Lesson #36 family-conditional refinement); RP4-N5 (cross-project Δ-in-deltas as substrate-extraction primitive); RP4-N8 (CAFEC T-code as registry identifier); RP4-N9 (HALO-B3 vs CONE-B3 design-intent question)
- Research Project #3 close-out (PR #248 / 2026-05-25): Lesson #36 original framing as deepest-insight-of-arc; mechanism captured in ADR-0015 AI-7
- Research Project #1 close-out (PR #226 / 2026-05-23): Headline Finding #1 (CAFEC label semantics vs flow physics) — RP4 confirms and extends to full Cup 4 family
- Pattern reference: Project #3 + RP4 cross-project Δ-in-deltas analysis as evidence-generation method
- Chris-locked at RP4 close-out (2026-05-26 compile session): family-conditional framework as locked decision; defer SKILL.md-side query logic to scaffolding sprint
