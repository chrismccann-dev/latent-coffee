# Architecture audit 05 — lib/ type boundaries + dead-code sweep

**Session:** 2026-06-04. Dogfood Session 5 (the OPTIONAL calibration session). Read-only, no code edited.
**Surface:** lib/ type boundaries + every exported symbol in lib/.
**Purpose:** calibration — prove the rubric can return "mostly leave it alone, here are the few real fixes" and kill bad refactor ideas.

## Headline verdict

lib/ is healthy. Leave the overwhelming majority alone. That's the calibration data point.

- Type boundaries: clean. 0 @ts-ignore, 0 as any, 8 explicit any (all idiomatic), 5 non-null asserts (all env-var idioms or guarded). The 21 `as unknown as` casts look alarming by count but ≈18 are legitimate edge casts at the Supabase / MCP-SDK boundary. Exactly one nameable internal weak-boundary finding.
- Dead code: genuinely LOW; the survey miscounted size + dominant class. Of 602 lib/ exports, 54 are truly unreferenced. ~38 of those are intentional symmetric API surface (factory re-exports + Insert* types + registry constants) — non-findings. The real orphan set is ~15 standalone helpers, all stable 3-8 weeks.
- Net actionable: one tiny optional dead-code sweep (S/Low) + one minor type-tighten (S/Low). Neither urgent.

## Candidate cards (both low-priority)

1 — Orphan-helper sweep (~15 zero-caller functions across hybrid-subform, process-aggregation, extraction-modifiers, registries, brew-import's matchCultivar, etc.). Per-symbol 30-sec triage, not bulk delete: scaffolding-for-named-feature → keep+note; post-refactor litter → delete. tsc is the whole safety net. Worth exploring / S / Low. Priority 7.
2 — `as readonly any[]` cluster in process-aggregation.ts:46-55 (brewToStructured launders 5 jsonb modifier columns to untyped arrays). The one genuine *internal* weak boundary; contained. Speculative / S / Low. Priority 6.
Recommended first refactor: none from this surface. Manufacturing a third would be the exact false positive this session exists to avoid. Spend the slot on Session 1's duplication.

## NON-findings (the calibration payload — DO NOT touch)

A naive tool flags all of these; they're correct as-is:

- Per-axis isCanonical*/findClosest* (~23): one-line makeCanonicalLookup factory re-exports; canonical-registry.ts documents this as deliberate symmetric surface.
- Insert* type family (8): symmetric per-table types mirroring the schema.
- Registry data constants (7): public lookups/data for the registry modules.
- exported-but-used-internally (~150, e.g. pushBrewInputSchema used at push-brew.ts:312): at most an unnecessary export keyword, never dead.
- `as unknown as` edge casts (~18/21): Supabase rows in, MCP structuredContent out, generic patch-key iteration — all boundary, not interior.
- 5 non-null asserts: env-var idioms + one guarded. The survey's "crash-risk Supabase asserts" are NOT in lib/ — they're in Session 2's green/[id].

Survey correction: Part C said "~6-7 unused, mostly MCP re-exports." Re-derived: ~15 genuine orphans, dominant class is registry factory re-exports + Insert* types.

## FRICTION LOG (most important output — the standing skill's requirements)

1. "Unused export" has no defined metric, and the obvious one is wrong. "Zero external-file refs" → 200+ false positives (internally-used exports look dead). Correct metric: total repo occurrences == 1. Skill must split *dead code* (delete) from *unnecessary export* (downgrade visibility).
2. Biggest gap: no concept of "intentional symmetric API surface." Any tool mass-flags the factory re-export families. Requirement: when N siblings share a name template + one-line factory-re-export pattern, collapse to ONE keep/cut decision. An allowlist (registry re-exports, Insert*, *InputSchema) is the cheap version. This is the exact false-positive the calibration session was built to expose.
3. Type-boundary smell needs an edge-vs-interior axis. 34 casts/asserts by tally, ~32 legitimate. Classify each by location-in-dataflow, don't count. Only ~1 survived the filter.
4. The seed survey was itself miscalibrated (orphans 7→15; mislabeled dominant class). Calibration sessions must re-derive, not trust headline numbers.
5. Tooling gap — should not be hand-grep. No ts-prune/knip in repo; I shipped two buggy bash scans before a correct one. Delegate the mechanical pass to ts-prune/knip; spend judgment on classification. CI-gate spin-out needs an allowlist or it'll never be clean (and a noisy gate gets ignored).
6. Git-recency (git log -S) was the best disambiguator and isn't in the rubric — separates "added this week, not yet wired" (keep) from "orphaned weeks ago" (cut). Add it as a required step.
7. Worked well: the deletion test correctly reframed the NON-findings ("delete isCanonicalRoaster → registry symmetry vanishes across all axes"). Vocabulary held up; no additions needed.
