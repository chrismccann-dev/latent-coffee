# Architecture Audit 06 — Full-Codebase Sweep (2026-06-10)

Surface: the whole repo (cleanliness / dedup / efficiency pass, operator-requested). Read-only; no code edited. Builds on the 01-05 corpus — this session's first job was establishing which prior candidates already landed, so nothing below re-reports shipped work.

## Do this now

**Ship the Audit-03 backlog — it is the only prior audit with zero candidates landed, and two of its findings are actively rotting.** Concretely, in order: (1) the one-line `maxUpdatedAt` dedup in `lib/synthesis/runSynthesis.ts` (a correctness-class risk on the SYN-7 resynthesis trigger), (2) the MCP tool-tail helpers (15 hand-rolled error-marshal blocks + 25 hand-rolled response envelopes), (3) the `DOC_REGISTRY` collapse in `lib/mcp/docs.ts` (every new skill-cluster doc currently costs 3-4 edit sites, and skill-cluster docs are the highest-velocity substrate in the repo right now — 17 sub-skills and counting). Alongside, a half-day hygiene PR: **`check:doc-links` has regressed from green to 25 live misses** since 2026-06-05, two new skill clusters are missing their `SKILL_CLUSTER_CLASS` mapping in `check-doc-sizes`, and two CLAUDE.md dev notes are stale.

## Re-measure (R1)

| Seed claim | Re-measured |
|---|---|
| `check:doc-links` "green as of 2026-06-05" (CLAUDE.md) | **Red: 25 live misses + 76 archive warnings.** Regression from new sprint docs (file-relative links in `docs/sprints/per-lot-file-registration-*.md`, `grilling-2026-06-05-claude-ai-review.md`, etc.) |
| CLAUDE.md dev notes: "country color swatches hardcoded in terroir pages; cultivar family colors hardcoded in cultivar pages" | **Stale.** Both live in `lib/country-colors.ts` / `lib/cultivar-family-colors.ts` (landed with PR #395) |
| Audit 02: `green/[id]/page.tsx` 2,098 LOC | Now **2,168 LOC** — grew 70 LOC since the audit despite C1 (typing) landing |
| Audit 03: `docs.ts` 4-edit-site shotgun surgery | Confirmed still live: `SKILL_FILES`/`DOC_FILES` (key + derivable value), `DOC_DESCRIPTIONS`, `listDocs()` 596-line literal (uri + name + title re-stated), plus the `next.config.js` glob |
| Hotspot top-5 | `roaster-registry` (data literal — non-finding), `roast-import.ts` (1,815 raw / 1,324 logic LOC — **never audited**), `types.ts` (churn 5 × fanout 27 — healthy, gate-enforced), `producer-registry` (data), `mcp/docs.ts` |

Prior-candidate status (verified file-by-file this session): Audit 01 — 4/6 landed, SynthesisCard wiring (cand 6) open. Audit 02 — C1 landed (typed `GreenLotDetail`), C2/C3/C4 open. Audit 03 — **0/4 landed**. Audit 04 — fully landed (but see the gate regression above). Audit 05 — calibration session; both low-priority candidates open by design.

## Candidate cards

### Candidate 1: `maxUpdatedAt` dedup  [STRONG]
- Files / consumers: `lib/synthesis/runSynthesis.ts:50-62` (private copy) vs `lib/synthesis/inputUpdatedAt.ts:19-31` (exported `computeInputMaxUpdatedAt`) · consumer count: runSynthesis orchestrator + all detail pages computing the SYN-7 signal
- Current shape: byte-equivalent logic, two definitions; only the parameter typing differs (`Record<string, unknown>[]` vs `RowWithUpdatedAt[]`).
- Smell: duplication-at-distance · divergence delta: none **yet** — that is the window to act in
- Existing-helper check: the exported helper already exists; this is a pure adoption gap (R4 — adopt, not author)
- Proposed deepening: delete the private copy, import the exported one.
- Depends on: none
- Verification matrix: `npm run build`; trigger one synthesis regen (any terroir page with a recent brew) and confirm `synthesis_input_max_updated_at` still moves.
- Size: S · Risk: Low
- Cost of inaction: the page-side and orchestrator-side resynthesis signals are computed by two functions that nothing keeps in sync; the day one is edited alone, stale-cache bugs appear with no error anywhere.
- Why first: one-line class of fix; carries the audit-03 momentum.

### Candidate 2: Gate-regression hygiene batch  [STRONG]
- Files: ~6 sprint docs with live dead links (run `check:doc-links` for the list); `scripts/check-doc-sizes.ts` `SKILL_CLUSTER_CLASS` (add `roasting-coordinator`, `v-set-assistant` from PR #424); CLAUDE.md § Dev notes (2 stale color-swatch lines) and § Standing tripwires ("green as of 2026-06-05" claim)
- Current shape: the repo's own gates are red/warning while CLAUDE.md asserts green — the docs-currency discipline is the project's core mechanism, so this is substrate drift, not cosmetics.
- Smell: stale-pointer + doc-substrate non-navigability (live tier)
- Existing-helper check: the gates themselves are the detection; nothing to build.
- Proposed deepening: repoint/root-relativize the 25 live links, add the two class mappings, refresh the two CLAUDE.md notes. Also note `wbc-recipes.md` at 48.8/60KB (pre-tripwire watch, no action).
- Depends on: none
- Verification matrix: `npm run check:doc-links` exits 0; `npm run check:doc-sizes` shows no class-mapping warnings.
- Size: S · Risk: Low
- Cost of inaction: a red gate trains everyone to ignore the gate; the daily CI cron is presumably already failing silently or being skipped.

### Candidate 3: `DOC_REGISTRY` collapse in `lib/mcp/docs.ts`  [STRONG]  *(carries over Audit 03 C1)*
- Files / consumers: `lib/mcp/docs.ts` (1,345 raw LOC, ~600 of which is the `listDocs()` literal) · consumers: `doc-tools.ts` (4 Tools), `server.ts` Resources, `check:mcp-bundle`
- Current shape: registering one doc = an entry in `SKILL_FILES`/`DOC_FILES` (where the value is mechanically `uri.replace('docs://','docs/')`), a `DOC_DESCRIPTIONS` entry, and a `listDocs()` `entry(uri, name, title)` line that re-states the uri and derivable name. Per-lot file registration (now formalized via arbiter ticket flow, PR #418) makes this the highest-churn registration surface in the repo.
- Smell: shotgun-surgery (1 doc → 3-4 edit sites) · divergence delta: ordering in `listDocs()` is load-bearing (catalog presentation) and maintained by hand
- Existing-helper check: none; this is the authoring case (R4 fork: no existing shape to adopt)
- Proposed deepening: one ordered array of `{ uri, title, description, redirectTargets? }`; derive filesystem path from uri; derive `listDocs()`, `DOC_DESCRIPTIONS` lookups, `isRedirectStub`, and `isKnownDoc` from it. One doc = one entry.
- Depends on: none (Candidate 4 is in the same module family — sequence them as separate PRs to keep diffs reviewable)
- Verification matrix: `npm run check:mcp` (tool/resource count unchanged), `npm run check:mcp-bundle`, `npm run build`, one `read_doc` + `list_docs` MCP roundtrip, diff of `listDocs()` JSON output before/after (must be byte-identical including order).
- Size: M · Risk: Low-Med (mechanical, but the MCP catalog is claude.ai's discovery surface — verify ordering)
- Cost of inaction: every new lot file / skill cluster doc pays the 4-site tax and risks the PR-#65/#164-class bundle miss the comment block at line 45 already warns about.

### Candidate 4: MCP tool-tail helpers  [STRONG]  *(carries over Audit 03 C2)*
- Files / consumers: 15 per-tool files hand-roll the persist-error marshal block (`validation` / `no_op` / `not_found` / `db_error` → `throw`); 25 hand-roll the `{ content: [{type:'text', text: JSON.stringify(out)}], structuredContent: out }` envelope; 7 hand-roll the `updated_fields` echo · seam already exists: `lib/mcp/tool-wrapper.ts`
- Current shape: every push/patch tool ends with the same ~20-line tail, copy-pasted (see `patch-cupping.ts:63-84` as the canonical specimen).
- Smell: duplication-at-distance; the abstraction (`withToolErrorLogging`) stopped one layer short — exactly the Audit-03 pattern
- Existing-helper check: `tool-wrapper.ts` is the natural home; no equivalent helpers exist yet
- Proposed deepening: three small helpers — `toolJson(out)` for the envelope, `throwOnPersistFail(result)` for the error marshal, `echoUpdatedFields(payload, FIELDS)` for the patch echo — then migrate the ~25 tools mechanically.
- Depends on: none
- Verification matrix: `npm run build`; one push + one patch MCP roundtrip (e.g. `patch_cupping` no-op → confirm the `no_op` error text is unchanged — claude.ai parses these messages).
- Size: M (wide but shallow) · Risk: Low
- Cost of inaction: every new Tool (35 today, tripwire at 50) copies the tail again; error-message drift across tools degrades claude.ai's recovery behavior on failed writes.

### Candidate 5: `green/[id]/page.tsx` — finish the Audit-02 sequence  [WORTH EXPLORING]
- Files / consumers: `app/(app)/green/[id]/page.tsx` (2,168 LOC, the repo's largest page) · 0 importers (leaf page)
- Current shape: typed (C1 landed) but still a monolithic dispatcher + 4 lifecycle views. New this audit: it is also the detail family's only **adoption-gap holdout** — inlines the back-link 4× (lines 291, 858, 1511, 1988) instead of `DetailBackLink`, inlines the Additional-Information disclosure 2× instead of `AdditionalInfo`, and keeps 2 page-local batch-id parsers (`parseBatchIdsForHighlight` L462, `parseDeclaredBatchOrder` L688) whose own comment admits they "mirror the lib version".
- Smell: large mixed-concern (sectioned-long, not tangled) + adoption gap
- Existing-helper check: `DetailBackLink`, `AdditionalInfo`, and the lib batch-id parser all exist — adopt, not author
- Proposed deepening: in order — (a) adopt the three existing helpers (S, trivially safe), (b) extract the shared header + per-view derive helpers (Audit 02 C2), (c) split per-view modules (Audit 02 C4) only after (a)+(b).
- Depends on: internal ordering only; (c) before (a)/(b) would copy the inlined duplicates into 5 files
- Verification matrix: `npm run build` + preview all 4 lifecycle states at 390/1024 (waiting-roast: Rancho Tio · resolved: Sudan Rume — per Audit 02's named matrix; re-confirm lots still exemplify those states)
- Size: S for (a), M for (b), M for (c) · Risk: Low for (a), Med for (b)/(c) — this is a workflow-companion (mobile-primary) surface
- Cost of inaction: the page grew 70 LOC since Audit 02; every lifecycle-view edit pays the scroll-and-find tax, and the inlined copies are the next drift bug.

### Candidate 6: `lib/roast-import.ts` patch-executor extraction  [WORTH EXPLORING]  *(new finding — never audited)*
- Files / consumers: `lib/roast-import.ts` (1,815 raw / 1,324 logic LOC — the #1 non-registry hotspot) · consumers: 13 importers (the MCP push/patch tools)
- Current shape: 7 entities × (Payload + validate + persist + `*_PATCH_FIELDS` + patch). The 6 patch functions share an identical ~30-line skeleton (id-check → lookup existing → `buildPatchObject` → entity-specific canonicalization middle → empty-check → `.update().eq().eq().select('id').single()` → result marshal); `buildPatchObject` exists but the executor around it does not.
- Smell: duplication-at-distance, abstraction one layer short (the brew-import precedent: engine depth is correct, the *scaffolding* repetition is not)
- Existing-helper check: `buildPatchObject<T>` is the partial seam; no patch-executor helper exists
- Proposed deepening: a generic `runPatch({ table, idField, fields, customize? })` where `customize` is the per-entity hook (producer/terroir/cultivar canonicalization on green-bean, `coerceWorthRepeating` on roast, composite-key lookup on cupping). Persist functions stay as-is — their entity-specific logic dominates (deletion test: deep, keep).
- Depends on: best after Candidate 4 (same write-path; land the low-risk one first and reuse its verification rig)
- Verification matrix: `npm run build`; MCP roundtrips for `patch_green_bean` (canonicals bump path), `patch_roast` (worth_repeating coercion), `patch_cupping` (composite key + NULLS NOT DISTINCT)
- Size: M · Risk: Med — this is the canonical write path; the composite-key and canonicals-bump edge cases are exactly where a generic executor can subtly regress. **Risk is why this is not STRONG: do it deliberately, with the matrix above, or not at all.**
- Why later: real win (~150-180 LOC of skeleton plus future-entity leverage) but the highest blast radius on this list.

### Candidate 7: Synthesize-route tail + SynthesisCard wiring  [WORTH EXPLORING]  *(carries over Audit 03 C4 + Audit 01 C6)*
- Files: `app/api/{terroirs,cultivars,roasters}/synthesize/route.ts` (73-90 LOC each, near-identical `runSynthesis → persist → respond → catch` tails; processes route is deliberately different per ADR-0010) + the ~11-prop SynthesisCard wiring inlined across 8 detail pages
- Smell: duplication-at-distance, low churn
- Proposed deepening: a `finishSynthesis()` shared tail for the 3 symmetric routes; a per-axis SynthesisCard wrapper only if a 5th synthesis surface ever lands (the adapters are the real seam and they are healthy).
- Depends on: none · Size: S · Risk: Low
- Why later: low churn — the tax is small until a new synthesis surface appears; bundle it with whichever sprint next touches synthesis.

## Considered and rejected (R8)

- **`lib/roaster-registry.ts` / `producer-registry.ts` / `filter-registry.ts` etc. (hotspot ranks 1, 4, 9)** — large *data literals*, the intentional symmetric API surface class from Audit 05. The 2-step authored-md → registry-mirror edit is a deliberate design. Leave alone.
- **`lib/brew-import.ts` (1,459 LOC)** — re-affirmed Audit 03's verdict: engine depth. Deletion test fails loudly (complexity reappears in every MCP tool). Leave alone.
- **`lib/types.ts` (churn 5 × fanout 27)** — churn is *by design*: `check:types-vs-schema` forces same-PR typing of every new column. High-churn + high-fanout here is the system working. Leave alone.
- **`lib/roest-client.ts` (874 LOC)** — sectioned-long, not tangled: API client → curve math → payload normalization, each section cohesive, churn 1. A split would add file hops for zero edit-tax relief. Leave alone.
- **`components/Ssp.tsx` (fanout 21)** — the deep primitive family doing exactly what ADR-grade primitives should: 15 small components, one interface each. Fanout is health here (R11). Leave alone.
- **`formatVLabel` twins (`green/page.tsx:271` vs `green/[id]/page.tsx:451`)** — looks like drift, is documented-deliberate: the comment at `green/page.tsx:188-190` states the contracts differ on purpose (`null` for the index pill slot vs `'V?'` placeholder on detail). A shared helper would need a flag param — shallower than two honest 6-liners. Leave alone; revisit only if a third copy appears.
- **Index-page grouping logic (cultivars/terroirs/roasters)** — three different domain hierarchies (3-level species tree vs 2-level country/macro vs family groups). A generic grouping abstraction would be a config-shaped interface wider than the three implementations. Leave alone.
- **`RegistryDetailShell` full-page abstraction** — stays dead per Audit 01's explicit rejection; re-flagging it here so no future "tidying" session resurrects it.
- **`'use client'` audit** — all 5 client components justified (forms, menu toggle, filter state, async fetch). No conversions.
- **Audit 05 orphan sweep + `process-aggregation.ts` edge casts** — still real, still not worth a dedicated session; fold the orphan deletions opportunistically into whichever sprint next touches those files.

## Dependency sequence (R7)

1. **PR A (hygiene, S):** Candidate 2 — doc-link repoints + `SKILL_CLUSTER_CLASS` mappings + CLAUDE.md note refresh. Gates back to green.
2. **PR B (S):** Candidate 1 — `maxUpdatedAt` adoption.
3. **PR C (M):** Candidate 4 — tool-tail helpers (establishes the MCP write-path verification rig).
4. **PR D (M):** Candidate 3 — `DOC_REGISTRY` collapse (independent of C; sequenced after only for review bandwidth).
5. **PR E (S→M→M):** Candidate 5 in its internal order — helper adoption, then header extraction, then per-view split.
6. **Later / opportunistic:** Candidate 6 (after C, deliberately), Candidate 7 (bundle with next synthesis-touching sprint).

No substrate changes anywhere in this list (no schema, no Tool surface, no prompt vocabulary) — the six-actor audit is not triggered for A-E; Candidate 3 touches Actor 4's *implementation* but not its interface (catalog output must diff clean, which the verification matrix enforces).

## Open questions before implementation

- Candidate 3: is `listDocs()` ordering observable-and-relied-upon by claude.ai's catalog UI, or is alphabetical fine? (Verification matrix assumes order-preserving; confirm or relax.)
- Candidate 5(c): per-view files under `app/(app)/green/[id]/` or a `views/` subdir? (Next.js colocation rules allow either; pick one in the grill.)
- Candidate 6: grill whether `customize` hooks are the right shape, or whether cupping's composite-key lookup makes it a 5-of-6 executor with cupping left bespoke.
