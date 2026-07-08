# Architecture-Review Skill — improvement log

Loop-1 cycle records for the architecture-review skill, **instance 1 of the self-improving skill loop** ([ADR-0023](docs/adr/0023-self-improving-skill-loop.md), loop-record convention in its 2026-06-12 amendment). One dated entry per improvement cycle: evidence base → lived-record scorecard → amendments made (each citing its evidence) → considered-and-rejected suggestion ledger with recurrence counts → Loop-2 trigger check → next-cycle trigger. Archive layer; not MCP-registered (matches the audit corpus).

## Cycle 1 — 2026-06-12

**Evidence base:** [SKILL.md](.claude/skills/architecture-review/SKILL.md) (rubric R1-R13 + v1 smell taxonomy + candidate-card-v1), the [derivation doc](docs/features/architecture-review-skill-derivation-2026-06-04.md), audits [01](docs/audits/architecture/01-detail-pages.md)-[06](docs/audits/architecture/06-full-codebase.md), and the remediation trail: PR #391 (skill build), #393 (audit-02 C1), #394 (audit-04 doc-links), #395 (audit-01 dedup), #426 (audit-06 report), #427 (audit-06 remediation A-D), cross-checked against [shipped.md](docs/sprints/shipped.md) and `git log`.

### Scorecard (the lived record, 2026-06-04 → 2026-06-12)

- **27 candidates across 6 audits; 13 shipped via 5 remediation PRs.** Every shipped candidate was STRONG (or the hygiene batch); every open candidate carries an explicit defer reason (low churn / sequencing / risk-needs-grilling). No STRONG finding was rejected on contact with implementation.
- **Zero recorded misses.** No architecture or code-quality problem surfaced post-audit on a covered surface (checked `docs/product/issues.md` + `docs/grilling-queue.md`). The one green→red event (`check:doc-links` regression, 2026-06-05→06-10) was post-remediation authoring drift caught by 06's own R1 re-measure — an enforcement-timing issue, not a discovery miss.
- **Zero reversed leave-alone verdicts.** Audit 05's calibration verdicts were re-affirmed wholesale by 06's R8 section; Audit 01's `RegistryDetailShell` rejection held and was re-flagged.
- **Candidate-card-v1 survived contact.** All 27 cards kept the format; the two deviations were by-design (04's doc-substrate slot swap per R12; 05's null recommendation set). The R9 verification matrix was used as the literal ship checklist in #427 (byte-identical `DOC_CATALOG` characterization dump; error-string identity on tool tails) — the strongest validation the format has.
- **R13 + R7 convert.** 06's "do this now" lead became four merged PRs in the report's dependency order, same session — the best finding→remediation conversion in the record. R1 fired in all six audits (every seed corrected); R4 decided strength/size on 4 of 06's 7 candidates; R6 correctly capped the highest-blast-radius candidate (roast-import C6) below STRONG.
- **The real failure mode was remediation lag, not finding quality.** Audit 03 sat at 0/4 landed for six days with a correctness-class finding (the `maxUpdatedAt` twin) rotting; what shipped it was 06's invented-on-the-fly prior-candidate carryover check — a practice the skill text did not contain. That gap drives amendment 1.

### Amendments made (each cites its evidence)

1. **Step 0 + prior-candidate status check.** When prior audits overlap the surface, verify file-by-file which candidates landed before deriving anew; open STRONG candidates carry forward, rejections carry into R8. *Evidence:* 06 invented this as its "first job"; the audit-03 0/4 rot is the cost of its absence. N=1 tier: an edge case of the existing R1 rule (prior-audit status is a seed claim), not a new abstraction.
2. **Step 0 + gate-currency claims are seed claims.** Re-run the gates; "green as of <date>" is a hypothesis. *Evidence:* 06 found 25 live misses behind CLAUDE.md's green claim + two stale dev notes. Same R1 edge-case tier.
3. **Step 6 (R8) + two carry-forward rules.** Re-flag prior rejected-by-design candidates (06: `RegistryDetailShell`); give deliberate-twin non-findings an explicit revisit trigger (06: `formatVLabel`, "revisit if a third copy appears" — the N=3 dial). R8 edge case.
4. **Stop-condition handoff calibration.** Grill-first applies to candidates with an open interface question (the report's `Open questions` section marks them); behavior-preserving adoptions/derivations with a deterministic verification matrix go straight to operator-approved execution. *Evidence:* all five remediation PRs (#393, #394, #395, #427 A-D) shipped ungrilled with zero regressions — ≥3 recurrences of lived practice diverging from the written "always grill" flow, so this graduates under Loop 1's threshold. Guard text added in both directions (don't over-grill adoptions; don't cite this to skip a real grill).
5. **Worked-example corpus + 06; taxonomy currency.** Added the 06 entry (whole-repo sweep + carryover discipline); refreshed the Seen column where 06 re-fired a smell (duplication-at-distance, shotgun-surgery, stale-pointer); noted whole-repo as a valid surface. N=1 structural-currency tier.
6. **Loop hookup.** `<relationship-to-the-rest>` now names the skill as ADR-0023 instance 1 and points here; ADR-0023's instance line updated + loop-record convention amended in. N=1 structural.

### Considered and rejected (the anti-lawyer-redline ledger — recurrence counts accumulate here)

- **Drop the shallow/pass-through taxonomy row** (0/6 audits fired it). Rejected: it is the deletion-test screen that pairs with R3 and costs one table row. **WATCH (recurrence 1):** if still silent after cycle 2, fold it into Step-3 prose and drop the row.
- **A remediation-lag tripwire** (standing nag on open STRONG candidates). Rejected: amendment 1's carryover check covers it at zero standing cost; a tripwire is new formalization with cron weight. (recurrence 1)
- **Score-formula reweighting.** No evidence: the one historical anomaly (01's full-page shell) was already fixed by the R6 gate in v1; no scored candidate has misbehaved since. (recurrence 0 — logged only to show it was checked)
- **Frontmatter description edit** to advertise whole-repo sweeps. Rejected: triggering already works ("architecture-review <surface>"); description churn risks trigger drift for zero observed friction. (recurrence 1)

### Loop-2 trigger check

Not triggered. SKILL.md was ~20KB pre-cycle, ~23KB post — no `check:doc-sizes` tripwire, no sectioning problem, the skill still does one job. Checked, not skipped.

### Next-cycle trigger

After the next 2-3 audit runs; or when any deferred-ledger item above reaches recurrence 3; or immediately if a real post-audit miss surfaces (that class is currently empty — its first member is an automatic cycle trigger, since "what the rubric missed" is the highest-value input this cycle didn't have).

## Inter-cycle deferred suggestions — 2026-07-08 (external source: mattpocock/skills code-review)

Reviewed Matt Pocock's updated code-review skill (Fowler's 12 classic smells, diff-shaped) against the v1 taxonomy. Most rows are already covered in sharper, audit-derived form (Duplicated Code → duplication-at-distance + R5; Shotgun Surgery → verbatim row; Divergent Change → mixed-concern; Speculative Generality → R6 gate + R8; Middle Man → deletion test; Feature Envy / Message Chains / Refused Bequest → OO-inheritance smells with no purchase on this codebase). Two genuinely uncovered items, deferred per the anti-lawyer-redline rule — no audit in 01-07 has fired either:

- **Mysterious Name as a taxonomy row** (naming lens; his fix-heuristic "if no honest name comes, the design's murky" pairs well with the deletion/extraction tests). Graduate if an audit surfaces a naming finding the current rubric had no slot for. (recurrence 1 — external suggestion, zero lived evidence)
- **Data Clumps / Primitive Obsession named as explicit sub-lenses of the weak-type-boundary row** (same fields/params travelling together wanting a type; primitive standing in for a domain concept). Partially covered today; graduate if an audit finds a clump/primitive case the row's current wording didn't prompt. (recurrence 1 — external suggestion)
