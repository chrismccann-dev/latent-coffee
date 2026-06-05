# Architecture audit 03 — the MCP + synthesis core

**Session:** 2026-06-04 dogfood (Session 3 of the architecture-review-skill plan). Read-only, no code edited.
**Surface:** `lib/mcp/` (40 files, ~7,087 LOC, 35 Tools + Resources) + `lib/synthesis/` (adapter pipeline + 3-call orchestrator, ~1,400 LOC).
**Centered smell:** module depth — shallow-vs-deep, seam/adapter, "everything imports this," the deletion test.
**Rubric:** Part B of [architecture-review-skill-brainstorm-2026-06-04.md](docs/features/architecture-review-skill-brainstorm-2026-06-04.md).

---

## Headline

The core abstractions in this surface are **mostly earning their keep.** The two named seams — the synthesis `EntityAdapter` and the MCP per-tool registration files — are *correctly* shaped: the adapter genuinely captures per-entity prompt variation, and the tool files are *supposed* to be thin (they're adapters at the MCP↔engine seam). The real depth lives where it should: `lib/brew-import.ts` / `lib/roast-import.ts` are deep engines that pass the deletion test resoundingly.

The friction is not shallow modules. It is **duplicated boilerplate that the abstractions stopped one layer short of absorbing**:
1. A 596-line hand-maintained literal in `docs.ts` that re-lists data already held in two adjacent maps (the single highest-churn file in the surface).
2. A 3-line MCP response envelope copy-pasted across ~31 tools, plus a validation-error marshaling block across ~15.
3. An exact-duplicate `maxUpdatedAt` function.
4. A copy-pasted fetch→synthesize→persist→return tail across the 4 synthesize routes.

In deletion-test terms: deleting any one *tool file* or *adapter* makes complexity reappear at the callers (they're deep enough). But the **envelope, the doc-list literal, and `maxUpdatedAt` fail the inverse test** — they are the same knowledge written in N places, and a shared helper would make N−1 of them vanish with zero behavior change.

---

## Mechanical scan (the hotspot crossing)

| File | LOC | Churn (6mo) | Import fanout | Read |
|---|---|---|---|---|
| `lib/mcp/docs.ts` | 1,342 | **42** | 8 | manifest (588) + `listDocs()` 596-line literal + parse/read helpers |
| `lib/brew-import.ts` | 1,459 | 21 (push-brew) | 4 (push/patch/canonicals/roast-import) | deep engine — validate + persist + patch + findOrCreate* family |
| `lib/mcp/canonicals.ts` | 626 | 8 | 2 | canonical-payload builder |
| `lib/mcp/server.ts` | 446 | 18 | 2 | registration manifest + Resource defs |
| `lib/mcp/push-brew.ts` | 409 | 21 | 1 | schema (mostly `.describe()`) + thin handler |
| `lib/synthesis/buildPrompt.ts` | 199 | 4 | (via runSynthesis) | tier classifier + prompt assembler |
| `lib/mcp/tool-wrapper.ts` | 22 | — | **31** | `withToolErrorLogging` — universally adopted |

**Crossing churn × fanout × size:** `docs.ts` is the unambiguous #1 (highest churn in the surface, 4 internal collections that must move together, a 596-line literal). Everything else is lower-churn or genuinely deep.

---

## Candidate cards

### Candidate 1: `docs.ts` — derive the doc catalog from one registry `[STRONG — first]`
- **Files:** `lib/mcp/docs.ts` (+ enforcement awareness of `next.config.js` `outputFileTracingIncludes`, `scripts/check-mcp-bundle.ts`).
- **Current shape:** A doc URI lives in **four** places that must be edited together to add one doc: (a) `SKILL_FILES` or `DOC_FILES` map (uri→path), (b) `DOC_DESCRIPTIONS` map (uri→description), (c) the `listDocs()` return literal (lines 695–1275, ~596 lines of hand-written `entry('docs://…', 'docs/…', 'Title')` calls), and (d) the `next.config.js` glob. Measured overlap: **121 of the 123 URIs in the `listDocs()` literal are already keys in the maps.** `listDocs()` already reads `DOC_DESCRIPTIONS[uri]` — so the literal contributes only `name` + `title`, both derivable.
- **Problem:** Shotgun-surgery + data-duplicated-in-two-places. This is *why* `docs.ts` has 42 commits in 6 months — every doc/cluster addition (and the sub-skills migration added ~150 of them) edits the same file in 3 spots, and a miss is silent (the recurring "MCP Resource bundle check" misses called out in CLAUDE.md are this exact class). The 596-line literal is the single biggest cognitive-load object in the surface and it carries almost no information the maps don't already have.
- **Proposed deepening:** One ordered `DOC_REGISTRY` — an array of `{ uri, file, title, description, group }` records. `DOC_FILES`/`SKILL_FILES` (uri→file), `DOC_DESCRIPTIONS` (uri→description), and `listDocs()` all become 3-line derivations (`.map`/`.reduce`) over it. Adding a doc = appending one record. The human-curated *ordering and grouping* in `listDocs()` (which is real signal — it's not in DOC_FILES order) is preserved by keeping the registry an ordered array with an optional `group` field. The `check-mcp-bundle` script can then lint the single registry against the glob.
- **Before / After (seam):**
  ```
  before:  add-doc ──► SKILL_FILES/DOC_FILES  (uri→path)
                  ├──► DOC_DESCRIPTIONS        (uri→desc)
                  ├──► listDocs() literal      (uri→name+title)   ← 596 lines, 121/123 redundant
                  └──► next.config glob
  after:   add-doc ──► DOC_REGISTRY record {uri,file,title,description,group}
                  └──► next.config glob   (lintable from the registry)
  ```
- **Verification to lock behavior first:** Snapshot `listDocs()` output + every `readDoc`/`readDocSection` URI resolution (a one-shot script that calls each and JSON-dumps), refactor, diff for byte-equality. `npm run build` (tsc). `npm run check:mcp-bundle` + `check:mcp`. No DB, no preview — this is pure server-internal.
- **Recommendation:** Strong
- **Size:** M (1 focused PR; the literal→registry transform is mechanical but large)
- **Risk:** Medium — the listing feeds claude.ai's Resource catalog; an ordering/title regression is low-stakes but visible. Byte-diff verification de-risks it.
- **Why first:** Highest churn in the surface × highest edit-site coupling. Its ugliness taxes *every* future doc/cluster/prune operation — exactly the "taxes every future change" signal Step 5 says to rank above raw size.

### Candidate 2: extract the MCP tool response envelope + persist-error marshaling `[STRONG]`
- **Files:** ~31 tool files under `lib/mcp/` (`push-*`, `patch-*`, `push-roast`, `push-green-bean`, …); new shared helper alongside `tool-wrapper.ts`.
- **Current shape:** Every write tool ends with the identical tail:
  ```ts
  if (!result.ok) {
    if (result.code === 'validation')
      throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
    if (result.code === 'db_error') throw new Error(`Database error: ${result.message}`)
    …
  }
  const out = { … }
  return { content: [{ type: 'text', text: JSON.stringify(out) }], structuredContent: out }
  ```
  Census: `structuredContent` envelope hand-rolled in **31** files; `Validation failed:` marshaling in **16**; `result.code === 'validation'` branch in **15**.
- **Problem:** The tool files are *correctly* shallow — they're adapters at the MCP seam, and `withToolErrorLogging` already proves the team extracts cross-tool concerns when they spot them (32/32 adoption, zero unwrapped). But the **shallowness is copy-pasted**: the envelope and the persist-result→error translation are the same knowledge in ~31 / ~15 places. When the response shape changes (it has: `warnings`, `created_with_overrides`, `queued_for_taxonomy_review` were all retrofitted across tools by hand), it's an N-file sweep.
- **Proposed deepening:** Two tiny deep helpers in the `tool-wrapper.ts` neighborhood: `toolJson(out)` → returns `{ content: [...], structuredContent: out }`; and `throwOnPersistError(result)` → the validation/db_error/unknown translation (push_brew's richer hint logic stays inline as the one documented exception). Tools shrink to `const result = await persistX(...); throwOnPersistError(result); return toolJson({ ... })`. The seam already exists (every `persistX` returns the same `{ ok, code, errors|message }` discriminated union) — this just names it.
- **Before / After:** N copies of a 6-line tail → one `toolJson(out)` call + one `throwOnPersistError(result)` call per tool.
- **Verification to lock behavior first:** `npm run build` (tsc carries the discriminated-union narrowing — see the `strictNullChecks` note in CLAUDE.md). Spot-call 2–3 tools via MCP `execute_sql`-adjacent paths or a live `push_brew`/`push_roast` round-trip to confirm the envelope is byte-identical. The error-message strings must stay verbatim (claude.ai parses them for retry hints) — diff them.
- **Recommendation:** Strong
- **Size:** S–M (one helper PR + a mechanical per-tool sweep; can land incrementally — helper first, migrate callers in batches, no big-bang)
- **Risk:** Low — pure extraction behind an unchanged interface; tsc + string-diff catch regressions.
- **Why first / later:** Lowest-risk of the structural candidates; a good *warm-up* that also exercises the back-compat-stub muscle (helper + migrate callers). Slightly lower priority than #1 only because each individual tool's tax is smaller than the doc-list's.

### Candidate 3: `maxUpdatedAt` is an exact duplicate of `computeInputMaxUpdatedAt` `[STRONG — trivial]`
- **Files:** `lib/synthesis/runSynthesis.ts:50-62` vs `lib/synthesis/inputUpdatedAt.ts:19-31`.
- **Current shape:** Byte-identical reduce-over-rows-to-max-`updated_at` logic, defined twice in the *same directory*. `runSynthesis` does not import the shared one (`inputUpdatedAt.ts` exists precisely to be that shared one — it's imported by 8 consumer pages).
- **Problem:** Duplication-at-distance in miniature, inside the synthesis core. If the `updated_at` comparison logic ever changes (timezone, null-handling), the page-side signal and the orchestrator-side signal silently diverge — and these two values are *literally compared against each other* to trigger regeneration (SYN-7). A divergence here is a correctness bug, not just tidiness.
- **Proposed deepening:** Delete `maxUpdatedAt` from `runSynthesis.ts`; import `computeInputMaxUpdatedAt` from `./inputUpdatedAt`.
- **Verification:** `npm run build`. The functions are identical so output is unchanged by construction.
- **Recommendation:** Strong
- **Size:** S (one-line import swap + delete)
- **Risk:** Low
- **Why:** Free correctness-hardening on the regeneration-trigger path. Bundle it into whichever synthesis PR lands first.

### Candidate 4: the 4 synthesize routes copy-paste the orchestration tail `[WORTH EXPLORING]`
- **Files:** `app/api/{terroirs,cultivars,roasters,processes}/synthesize/route.ts`.
- **Current shape:** Each route does: parse body → fetch entity → fetch brews → fetch roast_learnings (cross-source) → `runSynthesis(...)` → if `outcome.synthesis` persist → return the same 5-key JSON → identical `catch`. The `EntityAdapter` abstracts the *prompt*; it does **not** abstract the *route*. The fetch step genuinely varies per entity (and `processes` is a 172-line outlier with extra grouping logic), but the `runSynthesis → persist → return → catch` tail is ~identical, differing only in the persist target (`terroirs.update` vs `roaster_syntheses.upsert` vs …).
- **Problem:** Medium duplication; lower-stakes than #1/#2 because it's 4 sites not 31. Also surfaces a frozen interface leak: the terroir route's request field is misspelled **`terriorIds`** (and `terroirs/synthesize` reads `terriorIds`) — a typo baked into the client contract.
- **Proposed deepening:** A `finishSynthesis({ adapter, entity, entityName, brews, roastLearnings, persist })` wrapper that owns the `runSynthesis → persist-if-present → return-shape → catch` tail, taking the per-entity `persist(outcome)` as a callback. Routes keep their genuinely-varying fetch logic and hand off. Do **not** try to abstract the fetch — that's the real per-entity variation and collapsing it would be over-abstraction (the rubric's explicit warning). Fix `terriorIds` → `terroirIds` with a back-compat accept-both during transition.
- **Verification:** `npm run build`; hit each synthesize route via the preview app (auth-gated) and confirm a capsule regenerates + caches; diff the returned JSON shape.
- **Recommendation:** Worth exploring (confirm the callback seam is cleaner than the dup before committing; the `processes` outlier may not fit and can stay bespoke).
- **Size:** M
- **Risk:** Medium — live API contract + the typo fix touches the client caller.
- **Why later:** Real but smaller blast radius; the typo fix is the most concrete win and could be split out as an S on its own.

---

## Calibration — what the deletion test says to LEAVE ALONE

The rubric demands the skill *kill bad refactor ideas*. These are the central modules a naive "big file / everything imports this" finder would flag, and why each is depth earning its keep:

- **`lib/brew-import.ts` (1,459 LOC) / `lib/roast-import.ts` — deep, keep.** Single source of truth for validation + persistence; `push_brew`, `patch_brew`, the `app/api/brews/[id]` route, and `canonicals.ts` all funnel through it. Deletion test: removing it scatters the entire canonical-validation + findOrCreate + UPSERT engine across every write caller. Its only smell is *size* (a separable large-file concern: registry re-exports + `findOrCreate*` family + `validate` + `persist` + `patch` in one file) — out of scope for *this* module-depth session, and a lower priority than the duplication above. Note for a future session, not this one.
- **`lib/mcp/tool-wrapper.ts` (`withToolErrorLogging`, 22 LOC) — deep, keep.** Tiny interface, 31 importers, universal adoption, non-negotiable re-throw semantics. The textbook deep module. It is also the *proof the team already does this well* — Candidate 2 is just "do it again for the envelope."
- **`lib/mcp/discoverability-check.ts` (160 LOC) — deep, keep.** Small interface (`assertToolDiscoverability`), real behavior (synonym matching + first-sentence parsing), heavily documented intent, dual-surface use (dev assertion + `check:mcp` script). Exemplary.
- **`lib/mcp/auth.ts` — deep, keep.** One `requireApiKey` entry, clean RFC-9728 error path. No duplication.
- **The `EntityAdapter` abstraction itself — keep, do NOT collapse.** Four adapters confirm the seam (one adapter hints, two confirm — here there are four); the per-entity weighting/output-format/learning-row variation is genuine, not incidental. The `formatRoastLearningRow?` optional-member pattern correctly models "process is brews-only" without a fifth code path. This is the adapter pattern working as intended.
- **The large `push-*` schema files (push-brew 409, push-roast 168 with huge `.describe()` blocks) — keep.** The bulk is `.describe()` documentation, which is load-bearing: it's the claude.ai tool-introspection surface (the whole `discoverability-check` apparatus exists to protect it). A line-count finder would flag these as "large"; they are *documentation density*, not logic bloat. The skill must not score `.describe()` prose as cognitive load the way it scores branching logic.

---

## Priority scores (Step 5)

`priority = change_freq + cognitive_load + coupling + interface_mess + leverage − risk` (each 1–5)

| Candidate | freq | load | coupling | iface-mess | leverage | risk | **priority** |
|---|---|---|---|---|---|---|---|
| 1 — `docs.ts` DOC_REGISTRY | 5 | 4 | 5 | 3 | 4 | 2 | **19** |
| 2 — tool envelope helper | 4 | 2 | 4 | 3 | 4 | 1 | **16** |
| 4 — synthesize route tail | 2 | 3 | 3 | 3 | 3 | 3 | **11** |
| 3 — `maxUpdatedAt` dup | 1 | 1 | 2 | 1 | 2 | 1 | **6** |

**Top 3:** #1 `docs.ts` registry · #2 tool envelope helper · #4 synthesize route tail.
**Recommended first refactor:** **Candidate 1** (highest priority + highest churn = it taxes every doc operation), with **Candidate 2** as the lower-risk warm-up if a gentler first move is wanted, and **Candidate 3** bundled into whatever synthesis PR lands.

**Open questions before any implementation (not this session):**
- Candidate 1: is the `listDocs()` ordering/grouping load-bearing for claude.ai's catalog UX, or incidental? (Preserve it as an ordered registry either way, but it affects whether `group` is needed.)
- Candidate 2: does `push_brew`'s richer hint logic (the `hasOverridable`/`hasRegistryGap` branching) stay inline as the documented exception, or get a `hints` extension point on the helper? Lean inline — one special case doesn't justify a plugin seam.
- Candidate 4: does the `processes` route's extra grouping logic fit the `finishSynthesis` callback shape, or does it stay bespoke? Confirm before abstracting.

---

## FRICTION LOG — what was awkward about *doing this audit* (the most important output)

1. **The v0 rubric has no inverse-deletion test, and this surface needed it most.** The deletion test as written ("delete the module; does complexity reappear at callers?") screens for *shallow pass-throughs*. But this surface has almost none of those — the tool files are *correctly* thin, and the engines are *correctly* deep, so the plain deletion test returned "everything's fine" on every file. The actual smell here is the **opposite**: knowledge duplicated across N siblings where a shared helper would make N−1 vanish. I had to run an *inverse* test by hand ("if I extracted a helper, how many copies collapse?"). **The skill needs a named second heuristic — call it the "extraction test" or "DRY-fanout test" — and the rubric should pair it with the deletion test.** Module-depth audits of mature, well-factored cores will lean on the inverse far more than the original.

2. **Line-count is an actively misleading signal on this surface and the rubric leans on it (Step 2).** The two biggest files (`docs.ts` 1,342, `brew-import.ts` 1,459) are big for *opposite* reasons: one is duplicated-literal bloat (refactor target), the other is legitimate engine depth (leave alone). And the `push-*` tool files are "large" only because of `.describe()` documentation prose, which is load-bearing, not bloat. **A raw `wc -l` sort would have mis-ranked all three.** The mechanical scan needs a "what *kind* of lines" pass — logic vs. data-literal vs. doc-string — before size means anything. Churn was a far more honest signal than size here (it pointed straight at `docs.ts`).

3. **Churn × fanout had to be read together, and the tooling for "edit-sites-per-change" doesn't exist.** The real cost of `docs.ts` isn't its churn count — it's that *one logical change touches 3–4 collections in the file*. I only found that by manually `comm`-ing the URIs in `listDocs()` against the map keys (121/123 overlap). **The skill wants a "shotgun-surgery detector": for a high-churn file, sample its recent commits and measure how many distinct sites/collections each logical change touched.** That number, not the churn count, is the shotgun-surgery signal. I did it by hand; it should be a scripted heuristic.

4. **`.describe()`-heavy schemas broke my grep-based "how big is the real logic" instinct.** I kept having to open files to discover that 350 of 409 lines were documentation. A purely mechanical scan can't tell load-bearing doc-prose from logic. **The skill should special-case the MCP tool files: their `inputSchema` `.describe()` blocks are documentation, and their handler is the only logic to weigh.** Possibly a per-file "logic LOC" = total minus string-literal lines.

5. **The "everything imports this" prompt pointed me at the wrong nodes.** The top-fanout modules (`tool-wrapper` 31, `auth` 31) are the *deepest, healthiest* modules in the surface — high fanout was a sign of good extraction, not a smell. The actual problems were in *low-fanout* files (`docs.ts` fanout 8, the synthesize routes fanout ~1). **High import-fanout correlates with depth-done-right at least as often as with god-object risk; the skill should not treat fanout as a smell on its own — only fanout × (interface-instability or mixed-concern) is.**

6. **Reconstructing "is this seam real or incidental" required reading the consumers, and that's expensive.** Deciding the `EntityAdapter` was earning its keep meant reading all 4 adapters *and* all 4 routes to confirm the variation was genuine. The "one adapter hints, two confirm" vocabulary (Part B) was genuinely useful here and resolved it cleanly — keep that line in the skill, it did real work. But there's no cheap version: you can't judge a seam without reading both sides. **The skill should budget for "read N consumers" explicitly when evaluating an abstraction, and the candidate card should require citing the consumer count as evidence.**

7. **The rubric's candidate card lacks an "inverse" recommendation strength — "this looks bad but leave it alone."** I needed a whole *Calibration* section to record the leave-alone verdicts (brew-import size, the deep helpers, the `.describe()` files), because the card format only has room for *refactor* candidates. On a well-factored surface, the leave-alone calls are half the value (they're what stops a future agent from "tidying" a deep module into shards). **The skill's report format should have a first-class "Considered and rejected" list, not just a candidate list** — the doc-pruning mechanism's "kill bad ideas" discipline applies verbatim here.

8. **Minor: no quick way to confirm two functions are byte-identical across files.** I confirmed the `maxUpdatedAt` dup by eyeballing both. For a real duplication-at-distance pass the skill wants a structural-clone check (even a normalized-whitespace hash of function bodies) so exact dups surface deterministically rather than relying on the auditor having read both files in the same session.
