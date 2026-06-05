# Architecture-Review Skill — brainstorm + dogfood plan (Cluster B member)

**Session:** 2026-06-04 brainstorm (Chris audio-driven; no autonomous build calls). Cluster B member of the system-maintenance / anti-bloat layer — the **code-side sibling of the doc-pruning skill**.
**Status:** BRAINSTORM. No code this session. Method defined; **skill deliberately NOT authored yet** — it gets derived from dogfooding 3-5 real Latent surfaces first, exactly as the doc-pruning mechanism was derived from worked pruning cases.

## The reframe (Chris's framing, 2026-06-04 audio)

This started as "what cleanup skills does the codebase need?" (dead-code finder / dedup-at-distance / dead-anchor / type-tightening / schema-hygiene). The survey below answered that. But Chris pulled it up a level:

> "...we wanna check this on an ongoing basis. I think about it similar to the doc-pruning skill. It's almost like the architectural code-review skill that finds these surfaces and then we take these actions."

So the target is **one standing architecture-review skill**, not five point tools. The point tools become *findings categories* inside it. And — per all substrate Chris hands over — the two external inputs (his attached "Repo Architecture Audit Skill" doc + Matt Pocock's `improve-codebase-architecture` skill) are **borrow-from, not gospel.** Take what's load-bearing for Latent, drop what isn't, adapt the rest.

## Method: dogfood, then derive (the doc-pruning template)

We do NOT author the skill from theory. We mirror how the doc-pruning mechanism was built ([doc-pruning brainstorm](doc-pruning-mechanism-brainstorm-2026-06-03.md)):

1. **Run 3-5 real architecture audits** on distinct Latent surfaces — each a **separate, self-contained Claude Code session** (no memory of this thread), read-only, producing a structured **handoff doc**.
2. Each session hits a **different smell family** so the derived skill's taxonomy is grounded in real Latent examples across the whole space (the way pruning needed all six shapes worked before locking the mechanism).
3. Chris brings each handoff back to the originating thread.
4. Once 3-5 are in, **derive the standing skill from first principles + the real friction logs** — what the audit process actually needed, what the rubric got wrong, what tooling was missing.

Handoff docs land in `docs/audits/architecture/` (precedent: `docs/audits/2026-05-18/`), named `NN-<surface>.md`.

---

## Part A — What to borrow / drop / adapt

Triangulating my survey evidence (Part C) against the two external sources.

### BORROW (carry into Latent's rubric)

| Idea | Source | Why it earns its place |
|---|---|---|
| **Deep vs shallow modules + the deletion test** | Pocock + doc | Sharpest screening heuristic in either source. "Imagine deleting the module: if complexity vanishes it was a pass-through; if it reappears across N callers it was earning its keep." Concrete, not vibes. |
| **Static structure × git change-history** | doc | The single best prioritization idea: "a 500-line file touched every week is a better target than a 900-line file touched yearly." Latent has ~380 PRs of churn to mine. Churn × cognitive-load = the real hotspot. |
| **Surface ambitious candidates, operator picks, never auto-rewrite** | doc | "False positives are less dangerous than missed opportunities" → surface, don't rewrite. Matches Latent's ask-don't-ship + grilling culture exactly. |
| **Candidate-card report format** | both | Files / Current shape / Problem / Proposed deepening / Before-After / Recommendation strength (Strong/Worth-exploring/Speculative) / Size (S/M/L) / Risk. (Rendered as **markdown**, see DROP.) |
| **Mechanical scan layer** | doc | Largest files, most-imported, most-changed, files-changed-together, many-exports. Doable with `wc`/`git log`/`grep`. |
| **Grill before any refactor** | both | Already native to Latent via [`/grill-with-docs`](../../.claude/skills/grill-with-docs/SKILL.md). The architecture skill *reuses* it rather than reinventing the grilling loop. |
| **Vocabulary discipline** | Pocock | module / interface / implementation / depth / seam / adapter / locality / leverage — enforced consistently. Candidate CONTEXT-shared headword (`re-home` precedent). |
| **ADR-aware** | Pocock | Don't re-litigate settled decisions; offer an ADR when the operator rejects a candidate with a load-bearing reason. Latent has [docs/adr/](../adr/). |

### DROP (does not apply to Latent)

| Dropped | Source | Why it's wrong for Latent |
|---|---|---|
| **The entire test pillar** — characterization tests, "the interface is the test surface," test-coverage-by-module, test-hostile architecture | both (heavily) | **Latent has no test suite** (no jest/vitest; only `check:*` scripts + preview verification). This is the biggest single cut. Replaced by Latent's real safety net → see ADAPT. |
| **HTML report (Tailwind CDN + Mermaid CDN, temp-dir)** | Pocock | Latent's whole substrate is markdown docs. A markdown candidate report in `docs/audits/architecture/` fits the repo + the MCP-readable doc culture; a throwaway HTML file in tmp doesn't. (Mermaid before/after fences inline are fine if a diagram helps.) |
| **madge / image dependency graph** | doc | Not installed, not worth it for a ~140-file repo. Grep-based import counting is enough. |
| **`src/` layout assumptions** | both | Latent is `app/` + `lib/` + `components/` at root. Adapt paths. |

### ADAPT (Latent-specific deepening — beyond both sources)

| Adaptation | Rationale |
|---|---|
| **Replace "characterization tests before refactor" → "characterization *verification* before refactor"** | Latent's safety net is `npm run build` (tsc) + **preview verification** + the **six-actor cross-system audit** ([CLAUDE.md § Cross-system audit](../../CLAUDE.md)) + targeted DB reads via MCP `execute_sql`. The safe-change sequence keeps the *shape* (lock behavior → seam → move → migrate callers → delete old path) but swaps the lock mechanism. |
| **The doc substrate is first-class architecture.** Agents navigate `docs/skills/` clusters + CONTEXT-* + prompts as much as they navigate code. | "AI-navigability" in Latent includes "can an agent find the right cluster doc / is the pointer alive." The **dead-anchor problem IS an architecture smell** in Latent terms, not a separate concern. One dogfood session targets the doc substrate explicitly. |
| **Redirect-stub / back-compat-shim discipline IS the safe-migration mechanism Latent already runs** (the doc-pruning arc). | The skill's "migrate callers, then delete old path" maps onto Latent's existing stub pattern — no new mechanism needed, reuse the muscle. |
| **"Everything imports this" detection maps to `lib/` helpers + the `lib/*-registry.ts` validation mirrors.** | Latent's central modules are the registries + brew-import.ts + the synthesis adapters. The junk-drawer-vs-deep-module test runs against those. |

---

## Part B — Latent's architecture-review rubric (v0)

This is the method each dogfood session follows. **v0 — explicitly expected to change** once the friction logs come back.

### Vocabulary (enforce consistently)
- **Module** — anything with an interface and an implementation.
- **Interface** — everything a caller must know: types, invariants, errors, ordering, config.
- **Implementation** — code hidden behind the interface.
- **Depth** — leverage behind the interface (lots of behavior, small interface = deep).
- **Seam** — where behavior can change without editing callers.
- **Adapter** — a concrete implementation at a seam. (One adapter hints at a seam; two confirm it.)
- **Locality** — related knowledge/change lives in one place.
- **Leverage** — callers get more behavior while knowing less.

### Step 1 — Explore (read-only)
Read the orienting substrate first: CLAUDE.md, the relevant CONTEXT-{zone}.md, PRODUCT.md, the relevant `docs/architecture/*` and ADRs, and the surface's own files. Use the deletion test + vocabulary as the lens.

### Step 2 — Mechanical scan (cheap signals)
- Largest files: `find app lib components -name '*.ts*' | xargs wc -l | sort -nr | head -30`
- Highest churn: `git log --name-only --pretty=format: --since="3 months ago" -- app lib components | sort | uniq -c | sort -nr | head -30`
- Files-changed-together (coupling tell): inspect co-occurrence in recent commits.
- Most-imported + most-exporting: grep import counts (no madge).
- **Cross the two:** churn × size × import-fanout = the hotspot list. High-churn + high-fanout + large = audit first.

### Step 3 — Smell taxonomy (Latent-tuned)
Flag against these families. Each dogfood session is *centered* on one but reports any it hits:

| Smell | Latent tell | Seed evidence |
|---|---|---|
| **Duplication-at-distance** | Same orchestration copy-pasted across files 100+ lines apart (what `/simplify`'s diff-scope misses) | detail-page brew-loop ×7, BackLink ×10, slug-regex ×4 |
| **Large mixed-concern file** | One file forces an agent to ingest the whole thing; many reasons to change | `app/(app)/green/[id]/page.tsx` ~1,400 lines, 25 `any`s, all 5 lifecycle states |
| **Shallow / pass-through module** | Wrapper that only renames; helper with one caller; fails the deletion test | `lib/process-routing.ts` `modifierSlug`/`signatureSlug` (internal-only exports) |
| **Scattered conditionals** | Same `if (x === ...)` concept across UI + write-path + validation | (to find — lifecycle-state derivation, process-routing dispatch are candidates) |
| **Weak type boundary** | `any`/`as any` in internal (not edge) code; non-null asserts on nullable Supabase fields | 5-6 `!` asserts on nullable fields (crash risk); 25 `any` in green/[id] |
| **Doc-substrate non-navigability** | Dead anchors, redirect-stub subsection links, cluster a concept is scattered across | ~282 broken links / 1,747; redirect-stub subsection anchors |
| **Dead code** | Unused exports, orphan modules | LOW — ~6-7 cases, zero orphans (a *calibration* surface: the skill must also kill bad refactor ideas) |
| **Adoption gap** | A good helper exists but callers inline the logic anyway | slug regex inlined despite `kebab()`/`baseSlug()` existing |

### Step 4 — Candidate cards
One card per surface (the borrowed format):
```
### Candidate: <name>
- Files involved: <paths>
- Current shape: <1 para, how it works today>
- Problem: <which smell(s); why it creates friction for a future agent/human>
- Proposed deepening: <plain-English refactor, NO code>
- Before / After: <optional mermaid or ascii seam diagram>
- Verification to lock behavior first: <preview checks / tsc / targeted DB reads — NOT tests>
- Recommendation: Strong | Worth exploring | Speculative
- Size: S (1 PR) | M (2-3 PRs) | L (staged migration)
- Risk: Low | Medium | High
- Why first / why later: <1 sentence>
```

### Step 5 — Score + prioritize
Score each candidate 1-5 on: change-frequency · cognitive-load · coupling · interface-mess · refactor-leverage · risk.
`priority = change_freq + cognitive_load + coupling + interface_mess + leverage − risk`
The top items are rarely the ugliest files — they're the ones whose ugliness taxes *every future change*.

### Step 6 — Grill, then safe-change (NOT in the audit session)
The audit session **stops at the report**. Actual refactor is a later, separate, grilled exercise:
1. `/grill-with-docs` the chosen candidate (own concept? right interface? what should callers stop knowing? which ADRs constrain it?).
2. Characterization **verification** (preview snapshot + targeted reads) to capture current behavior.
3. Name/extract the seam → move implementation behind it → migrate one caller → migrate the rest → delete the old path (back-compat stub per Latent discipline) → update docs/ADR/CONTEXT → `npm run build` + preview verify + six-actor audit.

### Stop condition (audit sessions)
**Do not edit code.** End with: top 3 candidates, the recommended first refactor, open questions to resolve before implementation, and the **friction log** (below).

---

## Part C — Evidence baseline (survey 2026-06-04)

Already gathered this session; seeds the dogfood sessions so they don't start cold.

- **Dead code: LOW.** Zero orphan files, zero `@ts-ignore`/`@ts-nocheck`, zero commented-out blocks. ~6-7 genuinely-unused exports (mostly intentional MCP re-exports). The ~380-PR accretion shows up as *duplication*, not *dead code*. **This reorders the original kickoff's gut list — dead-code was its #1 instinct; it's actually last.**
- **Duplication-at-distance: PERVASIVE.** Detail-page template copy-pasted 7× — brew→cross-link aggregation loop (7 identical copies: `app/(app)/terroirs/[id]/page.tsx:142`, cultivars, roasters, 4× processes), BackLink JSX ×10, inline slug regex ×4 (despite `lib/process-routing.ts` exporting the helper), SynthesisCard wiring ×7, Additional-Info block ×6. Color maps ARE centralized (no dup there). **#1 pain.**
- **Doc dead-anchors: PERVASIVE.** ~282 broken / 1,747 internal links. High-value class = redirect-stub subsection anchors (`ROASTING.md#step-3-...`, `BREWING.md#coffees-that-needed-full-expression` — anchors gone post-migration). Plus 111 redundant-`docs/`-prefix + 28 missing-`../`. Memory refs (`~/.claude/...`) must be skipped, not "fixed." **Deterministic → CI-gate-shaped (the fix needs judgment).**
- **Type-safety: MEDIUM, concentrated.** Not chaos. 25 `any` in one file (green/[id]), ~5 non-null asserts on nullable Supabase fields = real crash risk. `noImplicitAny` enable is a one-time sprint, not a standing skill.
- **Migration/schema hygiene: MEDIUM, script-shaped.** `check:migrations` covers apply-state drift well. Remaining gaps: constraint↔registry sync, column↔`lib/types.ts` drift, Zod-enum completeness (`roast_recipes.end_condition_type` is `z.string()` while `roasts.end_condition_type` is `z.enum`). CI-gate-shaped, not skill-shaped.

**Shape verdict (Chris-confirmed 2026-06-04):** judgment-heavy + repo-wide + can't-automate-the-fix → **standing skill** (architecture review, duplication, large-file deepening). Deterministic pass/fail → **CI gate** in the `check:*` family (dead-anchor checker, schema-hygiene checker). The architecture-review *skill* is this doc's subject; the two gates are spun out as separate Cluster B members.

---

## Part D — Dogfood plan: the sessions

Five self-contained session briefs. **Run 3-5** (recommend the order below; 1 / 2 / 4 are the minimum that covers three distinct smell families + the doc-substrate extension). Each is read-only, produces a handoff doc, does NOT refactor.

**Prerequisite:** merge this scoping doc to `main` first (docs-only) so each fresh session can `Read` Part B for the shared rubric.

Each brief, pasted into a fresh Claude Code session, should be prefixed with this header:

> **ARCHITECTURE-AUDIT DOGFOOD SESSION. READ-ONLY. DO NOT EDIT CODE. DO NOT REFACTOR.** The autonomy rule does NOT apply — this is an interpretive audit, surface candidates only. Read `docs/features/architecture-review-skill-brainstorm-2026-06-04.md` Part B for the rubric + vocabulary, then audit the surface below. End by writing your handoff to `docs/audits/architecture/NN-<surface>.md` AND printing it in full so it can be carried back to the originating thread. The handoff MUST include: (a) candidate cards per Step 4, (b) the priority scores per Step 5, (c) a **FRICTION LOG** — what was awkward about *doing this audit*: what was hard to find, what tooling/heuristic was missing, where the v0 rubric was wrong or thin. The friction log is the most important output — it's what the standing skill gets derived from.

### Session 1 — Duplication-at-distance: the detail-page family `[RECOMMENDED FIRST]`
**Surface:** `app/(app)/{terroirs,cultivars,roasters,processes}/[*]/page.tsx` (the 7 aggregation detail pages).
**Centered smell:** duplication-at-distance + adoption gap.
**Seed:** brew→cross-link loop ×7, BackLink ×10, slug regex ×4, SynthesisCard ×7, Additional-Info ×6 (Part C).
**Why first:** highest-leverage, lowest-risk, clearest win → it's also the "best first refactor template" the doc recommends starting from. Tests whether the rubric can turn known dup into a deep shared module (e.g. `extractCrossLinks(brews)`, `<BackLink>`, a detail-page shell) without over-abstracting the meaningful per-page variation.

### Session 2 — Large mixed-concern file: `green/[id]/page.tsx` `[RECOMMENDED]`
**Surface:** `app/(app)/green/[id]/page.tsx` (~1,400 lines) + its lifecycle helpers (`lib/lifecycle-state.ts`).
**Centered smell:** large mixed-concern file + weak type boundary.
**Seed:** 25 `any`, all 5 lifecycle view-shapes in one file, the riskiest non-null asserts.
**Why:** the clearest "agent must hold too much in its head" case. Higher refactor risk (workflow-companion surface, complex lifecycle) → exercises the depth/seam path on a genuinely hard target and tests the no-tests "characterization verification" safety net.

### Session 3 — Module depth: the MCP + synthesis core
**Surface:** `lib/mcp/` (35 tools) + `lib/synthesis/` (adapter pipeline + 3-call orchestrator).
**Centered smell:** shallow-vs-deep, seam/adapter, "everything imports this," deletion test.
**Why:** Latent's most central modules. Tests whether the existing abstractions (the adapter pattern, tool-wrapper, brew-import) are earning their keep or leaking implementation. The deletion test gets its real workout here.

### Session 4 — Doc-substrate navigability + dead anchors `[RECOMMENDED]`
**Surface:** the `docs/skills/` cluster tree + CONTEXT-* + `docs/prompts/` + the ~282 broken links.
**Centered smell:** doc-substrate non-navigability (the Latent-specific extension).
**Seed:** redirect-stub subsection anchors, prefix/`../` breakage, memory-ref skip rule (Part C).
**Why:** proves the review method generalizes beyond code to the doc substrate agents navigate. Also produces the spec for the dead-anchor CI gate (the deterministic spin-out). Tests the "is this concept scattered across the wrong clusters" question.

### Session 5 — Type-boundary + dead-code sweep `[OPTIONAL — calibration]`
**Surface:** `lib/` broadly (type boundaries) + the unused-export candidates.
**Centered smell:** weak type boundary + dead code (LOW-volume).
**Why:** the **calibration** session. Evidence says there's little here. A session that correctly returns "mostly leave it alone, here are the 5-6 real fixes" is a valuable data point — the standing skill must *kill bad refactor ideas*, not just generate them. Tests the rubric's false-positive discipline.

---

## Part E — Reconvene + derive

After 3-5 handoffs are back in the originating thread:
1. **Cross-read the friction logs** — the recurring "this was awkward / the rubric missed X / I wished I had tool Y" notes are the skill's real requirements.
2. **Lock the smell taxonomy** against what actually appeared (drop families that never fired; add any that recurred unnamed) — same move as locking the six pruning shapes only after all were worked.
3. **Decide the standing cadence** — like a doc tripwire? On-demand `/architecture-review`? Fires at feature-ship like grilling? (Open question for the derive session.)
4. **Author the skill** at `.claude/skills/architecture-review/` with the locked rubric + the dogfood handoffs as its worked-example corpus (mirroring `docs/sprints/pruning-cases/` for doc-pruning).
5. **Spin out the two CI gates** (dead-anchor, schema-hygiene) as separate `check:*` scripts — the deterministic residue that doesn't belong in the judgment skill.

## Open questions for the derive session
- Standing cadence: tripwire-style (what's the trigger metric for *code*?), on-demand, or feature-ship-coupled?
- Does the architecture-review skill *call* `/grill-with-docs` and the future `/simplify`, or restate their logic? (Compose, don't duplicate — but confirm the seams.)
- Where do the audit handoffs live long-term — `docs/audits/architecture/` as a growing corpus, or archived after derive?
- Relationship to the six-actor cross-system audit: is architecture-review a *seventh* standing check, or does it subsume the "is this duplicated across surfaces" part of the existing audit?
