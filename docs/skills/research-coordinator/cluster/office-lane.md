# Office lane — lane charter + protocol conventions

**Status:** RATIFIED at the RP8 process retro (2026-08-27) — first occupant (RP8 concentrated pour-over, 5 tracks) ran the lane end-to-end; operator verdict: "the office experiments work great... definitely keep this."
**Origin:** Lane established 2026-07-29 (operator-called); conventions graduated from RP8-N3 (fired every track) + the RP8 retro.
**Scope:** This doc is the office lane's standing charter. Coordinator bakes these conventions into every office-lane protocol doc instead of re-declaring them per track.

---

## Why the lane exists (ratified rationale)

Home research time is weekends-only and not every weekend — the reason research runs serial. Office time is Monday–Friday, and office brewing was free-play time that never hosted research. The lane converts it: one office-lane project may run concurrently with the home-lane § Now occupant (see [SKILL.md § Operational tempo](docs/skills/research-coordinator/SKILL.md)). Operator: the lane "greatly expands the time spent on dedicated experiments" and cost nothing at home — resource-pool separation held cleanly (separate freezers, separate equipment sets, equipment may shuttle home↔office deliberately).

**Scope limit:** brewing-side research only. Roasting cannot run at the office.

## The design budget: ≤15 minutes per experiment cup

Operator-stated at the retro: an office experiment is brewed *while making office coffee* — ~10–12 minutes lived (T5 AeroPress cups); **target under 15 minutes per cup, all-in**. Anything above that becomes cumbersome. Corollaries:

- **Serial cadence, one cup per sitting-slot, ≤~3/office day.** No back-to-back flights (that's a home-bench format). Cross-cup ordering is memory-mediated → unblinded-serial tags + acknowledged recency bias (the operator tends to prefer the cup just tasted over the remembered one — weight serial ordering claims accordingly).
- **Track designs must fit the budget:** rungs/cups that each stand alone in ≤15 min; multi-sitting tracks are normal; the protocol tolerates cups spread across days.

## Capture trims (STANDING — graduated from RP8-N3, pre-declared here once for all office-lane protocols)

- **Single TDS read per cup** (when TDS is instrumented at all — see below).
- **No thermometer** — temperature stages by feel; stage labels approximate.
- **No pour timestamps** beyond count + rough final-pour timing.
- **Liquid yield captured when load-bearing** (split-cup pairs, press mechanisms — RP8-N13/N16) and best-effort otherwise; the operator will get it "sometimes, not perfectly all the time" — protocols mark yield as required only where the math depends on it.
- **Blank NUMBER recorded** (not just the act) at every instrumented sitting open; distilled blank bottle is standing office equipment.
- **One bench-free parameter maximum** (RP8-N9): the operator can hold ONE thing in their head per cup (e.g. "steep 1 min, press to 2:00") and report it as a number afterward; designs that require live mid-brew measurement or multi-parameter recall violate the lane budget.
- **Actual brew date recorded per cup at brew time** (sessions span calendar days).

## Instrumentation rule

**TDS (VST LAB III) is concentration-track instrumentation, not standing office instrumentation** (retro call): deploy it when the design varies concentration/strength; skip it for same-recipe comparative tracks where it would be overkill. Every-sitting re-zero with recorded blank number whenever it deploys.

## Inventory reality (shared freezer)

- **Freezer stock is shared-space volatile** — coworkers consume vials; counts drift without operator action. **Physical count + per-vial weigh at Step 0 is the whole mitigation** (RP8-N1, fired three times), plus: protocol coffee locks are PRESUMPTIVE until the physical check; Coordinator patches on swap.
- Vials are nominally 15 g but bag-excess partials exist (operator marks them with taped gram counts "less perfectly" at the office than at home) — weigh, don't trust the label.
- **Low-inventory budget rule (retro friction, operator-flagged):** control re-brews + repeats are methodologically right but expensive at ≤4 vials ("I only really get to do two tests"). Standing guidance: (a) the **split-cup blind pair** (calibration-arc § split-cup) is the first lever — it doubles conditions per vial; (b) the rung-0 control re-brew is **budget-conditional**: waivable with explicit reason when an in-cup control exists (split designs) or when the comparison is cross-mechanism vs an archived profile (RP8-N10 waiver pattern, used twice with logged rationale); (c) the later-day repeat of a winner stays protected when it gates a project-level claim, and is otherwise droppable-with-anecdote-tag. The trade is made consciously at scoping, never silently at the bench.

## Related primitives

- [`calibration-arc.md`](docs/skills/research-coordinator/cluster/calibration-arc.md) — Step 0 primitives incl. the split-cup blind pair + per-vial weigh
- [`role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md) — unchanged in the lane; all three roles apply
- [`process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md) — the ratification mechanism that produced this doc
