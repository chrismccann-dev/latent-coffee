# Architecture Audit 07 — Quarterly Whole-Repo Sweep (2026-06-18)

Surface: the whole repo (scheduled quarterly review, automated run). Read-only; no code edited. Builds on the 01-06 corpus. Per the carryover discipline (cycle 1, from 06), this session's first job was establishing file-by-file which prior candidates landed before deriving anything new — so nothing below re-reports shipped work.

## Do this now

**Fix the `check:doc-links` gate — it has gone blind, and CLAUDE.md asserts it is green.** The gate's file walk (`scripts/check-doc-links.ts:348` calls `walkMd('.', ...)`) descends from the repo root into `.claude/worktrees/`, which currently holds **285 stale git worktrees (11 GB)** — full repo copies, each with its own `docs/` tree. The gate therefore scans 52,501 markdown files and reports **166,209 "live" misses**, of which the true live-substrate count (excluding worktrees + archive) is exactly **1** (a dead `#roasting` anchor in `docs/grilling-flagged-ambiguities.md:48`). The repo's core docs-currency gate is producing pure noise, the daily CI cron is presumably red-and-ignored, and CLAUDE.md § Standing tripwires still claims "Green as of 2026-06-10." Concretely, in order: (1) add `.claude/worktrees` to the gate's skip-set so it scans only the real tree, (2) `git worktree prune` + remove the 285 orphaned worktree dirs (11 GB reclaimed), (3) fix the one real dead anchor, (4) refresh the CLAUDE.md currency line. This is the same *class* of finding as Audit 06's C2 (a gate red behind a "green as of" claim) recurring through a new root cause — the second occurrence; the N=3 dial says watch for a third before formalizing a standing guard, but the worktree-skip itself is a one-line permanent fix.

Everything else on this list is a WORTH-EXPLORING carryover from Audit 06 that remains open by design (the green/[id] split, the roast-import patch-executor, the synthesize-route tail). The mature core remains mature: no new STRONG code-refactor candidate surfaced this quarter.

## Re-measure (R1)

| Seed / prior claim | Re-measured |
|---|---|
| CLAUDE.md § tripwires: "`check:doc-links` Green as of 2026-06-10" | **False.** Gate exits non-zero: 166,209 live misses reported, 52,501 md files scanned. Root cause = worktree descent, not a real substrate regression. |
| `check:doc-links` "166,209 live misses" (the gate's own output) | **Noise.** ~166,206 are duplicated worktree-copy links across 285 `.claude/worktrees/*`. True live-substrate misses excluding worktrees + archive = **1** (`docs/grilling-flagged-ambiguities.md:48 → #roasting`). |
| `.claude/worktrees/` size | **285 worktrees, 11 GB, 286 entries in `git worktree list`.** Orphaned `isolation: worktree` / EnterWorktree checkouts never pruned. |
| Audit 06: `green/[id]/page.tsx` 2,168 LOC | Now **2,187 LOC** — grew another ~19 LOC since Audit 06 (was 2,098 at Audit 02). The page keeps accreting. |
| Audit 06 C1-C4 (the four STRONG cards) | **All landed, PR #427.** Verified in live code (see status block below). |
| Hotspot top-5 | `roast-import.ts` (1,473 logic LOC, churn 27 — C6 carryover), `roaster-registry` / `producer-registry` (data literals — non-finding), `types.ts` (churn 35 × fanout 27 — healthy by design), `mcp/docs.ts` (churn 49, post-DOC_CATALOG — healthy). No new non-registry hotspot appeared. |
| `check:hotspots` / `check:doc-sizes` worktree exposure | **Not affected.** `check-hotspots` scans only `['app','lib','components']` (SCAN_DIRS, 142 files); `check-doc-sizes` scans a scoped manifest. The worktree blindness is isolated to `check-doc-links` — a single-file bug, not a class. |

### Prior-candidate status (verified file-by-file this session)

| Audit | Candidate | Status |
|---|---|---|
| 06 | C1 `maxUpdatedAt` dedup | **LANDED** — `runSynthesis.ts:26` imports `computeInputMaxUpdatedAt`; private copy gone (PR #427) |
| 06 | C2 gate-regression hygiene batch | **LANDED** (PR #427) — but the gate has **re-regressed via a new cause** (worktrees); carried forward as this audit's lead |
| 06 | C3 `DOC_CATALOG` collapse | **LANDED** — `lib/mcp/docs.ts:69` `DOC_CATALOG` is the single registration point; `DOC_FILES`/`DOC_DESCRIPTIONS` derive via `Object.fromEntries` (PR #427) |
| 06 | C4 MCP tool-tail helpers | **LANDED** — `tool-wrapper.ts` exports `toolJson`, `echoUpdatedFields`, `throwToolFail`; push/patch tools migrated (PR #427) |
| 06 | C5 green/[id] sequence | **PARTIAL** — (a) `DetailBackLink` adopted (5 refs); (b)/(c) open: batch-id parsers still inlined (L463/L686, mirror private `lib/lifecycle-state.ts:284`), `AdditionalInfo` still raw `<details>` (L358/L600); page grew to 2,187 LOC. Carried forward as C3 below |
| 06 | C6 roast-import `runPatch` | **OPEN by design** (WORTH EXPLORING, highest blast radius). Carried forward as C4 below |
| 06 | C7 synthesize tail + SynthesisCard | **OPEN by design** (low churn, bundle-later). Carried forward as C5 below |
| 01 | C6 SynthesisCard wiring | Open (folded into 06-C7 → this-C5) |
| 02 | C1 typed `GreenLotDetail` | LANDED (pre-06); C2/C4 = this-C3 |
| 03 | all four | LANDED via PR #427 (06's carryover surfaced them) |
| 04 | doc-substrate | Landed; gate now re-regressed (see lead) |
| 05 | orphan sweep + edge casts | Open by design (opportunistic) |

## Candidate cards

### Candidate 1: `check:doc-links` worktree-blindness fix + gate-currency batch  [STRONG]  *(carries the Audit-06 C2 pattern — 2nd occurrence)*
- Files / consumers: `scripts/check-doc-links.ts:75` (skip-set) + `:348` (`walkMd('.', ...)`); `docs/grilling-flagged-ambiguities.md:48` (the 1 real dead anchor); CLAUDE.md § Standing tripwires (the false "Green as of 2026-06-10" line) · consumers: the daily CI cron + every architecture-review / arbiter / grilling-review session that reads the gate
- Current shape: `walkMd` recurses from repo root skipping only `node_modules`/`.next`/`.git`. It descends into all 285 `.claude/worktrees/<name>/` repo copies, multiplying every doc link ~285× and burying the true live count (1) under 166,209.
- Smell: stale-pointer (false "green" claim) + doc-substrate non-navigability (the gate that *enforces* navigability is itself broken) · divergence delta: the gate output diverged from CLAUDE.md's asserted state silently — exactly the drift the gate exists to catch
- Existing-helper check: the skip-set already exists at line 75; the fix is one more guard, not new machinery. **Important nuance:** skip `.claude/worktrees` specifically, NOT all of `.claude/` — the 8 real `.claude/skills/*/SKILL.md` files contain doc links that MUST stay checked (Audit 06 caught file-relative links exactly there). Guard on the relative path (`childRel === '.claude/worktrees'` or `e.name === 'worktrees' && rel === '.claude'`), not the bare dirname.
- Proposed deepening: (1) add the `.claude/worktrees` skip to `walkMd`; (2) fix the `#roasting` dead anchor in `grilling-flagged-ambiguities.md` (repoint or drop the fragment); (3) refresh the CLAUDE.md tripwire line to the re-measured truth + date; (4) re-run `npm run check:doc-links` to confirm exit 0.
- Depends on: Candidate 2 is the *root cause* (the worktrees), but the gate fix should land regardless — it makes the gate correct even if a worktree is legitimately present mid-session
- Verification matrix: `npm run check:doc-links` exits 0 after the skip + anchor fix; confirm md-files-scanned drops from 52,501 to ~383; spot-check that a known `.claude/skills/architecture-review/SKILL.md` link is still validated (skip is scoped, not over-broad)
- Size: S · Risk: Low
- Cost of inaction: a gate screaming 166K is a gate everyone learns to ignore; the docs-currency discipline is *the* project's core mechanism, so a permanently-red core gate quietly disables the whole substrate-drift safety net. A real live dead link (or the next one) now hides in the noise with zero signal.
- Why first: one-line code fix restores the single most load-bearing doc gate; carries the Audit-06 momentum on gate hygiene.

### Candidate 2: stale-worktree reclamation (285 trees / 11 GB)  [STRONG]  *(ops / root cause)*
- Files / consumers: `.claude/worktrees/*` (285 dirs, 11 GB); `git worktree list` (286 entries); the `SessionStart` hook in `.claude/settings.json` (symlinks `.env.local` into each on session start) · consumers: disk, the doc-links gate (Candidate 1's noise source), any `git worktree`-aware tooling
- Current shape: `isolation: worktree` agents and `EnterWorktree` sessions create worktrees under `.claude/worktrees/` that are auto-cleaned only *if unchanged*; changed/abandoned ones accumulate indefinitely. 285 have piled up at 11 GB.
- Smell: dead code, repo-hygiene grade — "unused worktree" is the disk analog of an unused export; the metric here is "no live session references it" (all 285 are stale checkouts of old branches)
- Existing-helper check: `git worktree prune` (removes administrative refs for deleted dirs) + `git worktree remove` per tree; no new tooling needed. A guard (e.g. a periodic prune or an age cap) would prevent re-accumulation
- Proposed deepening: `git worktree prune`, then remove the orphaned dirs (verify none has uncommitted work first — `git -C <wt> status` before removal, per Latent's never-reset-without-reflog discipline applied to worktrees). Then decide a standing guard: an age-based prune in the SessionStart hook, or accept manual quarterly cleanup.
- Depends on: none (but lands Candidate 1's noise source; do alongside)
- Verification matrix: `git worktree list` returns ~1-2 entries after prune; `du -sh .claude/worktrees` near zero; `npm run check:doc-links` md-files-scanned matches the real tree (~383) even before Candidate 1's code fix
- Size: S (mechanical) · Risk: **Med** — removing a worktree with un-pushed work is destructive; gate to WORTH EXPLORING on automation, but the manual prune-after-status-check is Low-risk. Per R6, the automation half (a hook that auto-removes) caps at WORTH EXPLORING; the one-time manual reclamation is the STRONG action.
- Cost of inaction: 11 GB and growing ~1 worktree/session; the doc-links gate stays noisy until pruned; future `git` operations slow as the worktree count climbs.
- Why first: it is the literal cause of Candidate 1's 166K; the two ship together.

### Candidate 3: `green/[id]/page.tsx` — finish the Audit-02/06 sequence  [WORTH EXPLORING]  *(carries Audit 06 C5 + Audit 02 C2/C4)*
- Files / consumers: `app/(app)/green/[id]/page.tsx` (2,187 LOC, the repo's largest page) · 0 importers (leaf page)
- Current shape: typed (02-C1 landed), `DetailBackLink` adopted (06-C5a landed). Still a monolithic dispatcher + 4 lifecycle views. Remaining adoption-gap holdouts: 2 page-local batch-id parsers (`parseBatchIdsForHighlight` L463, `parseDeclaredBatchOrder` L686) whose own comment admits they mirror the lib version — but the lib version (`lib/lifecycle-state.ts:284 parseBatchIds`) is **private/unexported**, so adoption needs an export first; plus the Additional-Information disclosure inlined as raw `<details>` twice (L358, L600).
- Smell: large mixed-concern (sectioned-long, not tangled) + adoption gap · divergence delta: the inlined batch parsers vs `lib/lifecycle-state.ts` are the next drift bug (the parser there returns ordered `string[]`; the two page copies split into a Set + an ordered list)
- Existing-helper check: `parseBatchIds` exists in `lib/lifecycle-state.ts` but is private — export it, then reconcile the two page variants against it. No shared `AdditionalInfo` primitive exists yet; the raw `<details className="ssp-anchor">` pattern repeats
- Proposed deepening: in order — (a) export `lib/lifecycle-state.ts:parseBatchIds`, reconcile the 2 page parsers against it (S, the Set-vs-ordered split needs one shared parser + two thin shapers); (b) extract the shared header + per-view derive helpers (Audit 02 C2); (c) split per-view modules (Audit 02 C4) only after (a)+(b)
- Depends on: internal ordering only — (c) before (a)/(b) copies the inlined duplicates into 5 files
- Verification matrix: `npm run build` + preview all 4 lifecycle states at 390/1024 (re-confirm a live lot exemplifies each state via `list_green_inventory` / `execute_sql` — the Audit 02 named-lot matrix is now ~9 months stale; re-name the exemplar lots in the grill)
- Size: S for (a), M for (b), M for (c) · Risk: Low for (a), Med for (b)/(c) — workflow-companion (mobile-primary) surface
- Cost of inaction: the page has grown ~89 LOC across two audits with no structural change; every lifecycle-view edit pays the scroll-and-find tax, and the inlined batch-parser copies are a live divergence-bug-in-waiting.
- Why later: the (a) adoption is genuinely safe and could go straight to execution; (b)/(c) need the grill (per-view file layout is an open question, below).

### Candidate 4: `lib/roast-import.ts` patch-executor extraction  [WORTH EXPLORING]  *(carries Audit 06 C6)*
- Files / consumers: `lib/roast-import.ts` (1,473 logic LOC — the #1 non-registry hotspot, +250 LOC since Audit 06) · consumers: 13-14 importers (the MCP push/patch tools)
- Current shape: unchanged from Audit 06's reading — 6 patch functions share an identical ~30-line skeleton (id-check → lookup existing → `buildPatchObject` → entity-specific canonicalization → empty-check → `.update().eq().eq().select('id').single()` → marshal). `buildPatchObject<T>` is the partial seam; no patch-executor wraps it. No `runPatch` helper exists (verified this session).
- Smell: duplication-at-distance, abstraction one layer short (the brew-import precedent: engine depth correct, scaffolding repetition not)
- Existing-helper check: `buildPatchObject<T>` only; no executor
- Proposed deepening: a generic `runPatch({ table, idField, fields, customize? })` with a per-entity `customize` hook (green-bean canonicalization, roast `coerceWorthRepeating`, cupping composite-key lookup). Persist functions stay as-is (deletion test: deep, keep).
- Depends on: none new (the C4 tool-tail rig it wanted to reuse already landed)
- Verification matrix: `npm run build`; MCP roundtrips for `patch_green_bean` (canonicals bump), `patch_roast` (worth_repeating coercion), `patch_cupping` (composite key + NULLS NOT DISTINCT)
- Size: M · Risk: **Med** — the canonical write path; composite-key + canonicals-bump edge cases are exactly where a generic executor subtly regresses. Risk is why this stays WORTH EXPLORING (R6): do it deliberately with the matrix, or not at all.
- Cost of inaction: the file grew +250 LOC since Audit 06; the skeleton repetition compounds as the 7-entity write path keeps accreting (PR #438 schema-compat just added another layer).
- Why later: real win (~150-180 LOC + future-entity leverage) but the highest blast radius on this list; the `customize`-hook shape is an open question (below).

### Candidate 5: synthesize-route tail (`finishSynthesis`)  [WORTH EXPLORING]  *(carries Audit 06 C7 + Audit 01 C6)*
- Files / consumers: `app/api/{terroirs,cultivars,roasters}/synthesize/route.ts` (98/86/73 LOC, near-identical `runSynthesis → persist → respond → catch` tails; the processes route is deliberately different per ADR-0010) + the ~11-prop SynthesisCard wiring inlined across the detail pages
- Current shape: unchanged from Audit 06 — three symmetric route tails, no shared helper (`finishSynthesis` does not exist, verified this session)
- Smell: duplication-at-distance, low churn
- Existing-helper check: none; authoring case
- Proposed deepening: a `finishSynthesis()` shared tail for the 3 symmetric routes; a per-axis SynthesisCard wrapper only if a 5th synthesis surface ever lands (the adapters are the real seam and they are healthy)
- Depends on: none · Size: S · Risk: Low
- Cost of inaction: small until a new synthesis surface appears; the tax is bounded
- Why later: low churn — bundle with whichever sprint next touches synthesis.

## Considered and rejected (R8)

Re-affirming Audit 06's rejections verbatim (re-flagged so no future "tidying" session resurrects them), plus this quarter's new non-findings:

- **`lib/roaster-registry.ts` / `producer-registry.ts` / `filter-registry.ts` (hotspot ranks 1-2, 4)** — large *data literals*, the intentional symmetric API surface class (Audit 05). `producer-registry` grew +582 LOC since Audit 06 — that is data entry, not logic bloat. Leave alone.
- **`lib/brew-import.ts` (1,084 logic LOC)** — engine depth (Audit 03). Deletion test fails loudly. Leave alone.
- **`lib/types.ts` (churn 35 × fanout 27)** — churn is by design: `check:types-vs-schema` forces same-PR typing of every new column. High-churn + high-fanout here is the system working. Leave alone.
- **`lib/mcp/docs.ts` (churn 49, #1 churn)** — post-DOC_CATALOG (06-C3) this is now one-entry-per-doc; the churn is doc-registration *velocity* (17 sub-skills + per-lot files), not structural tax. The collapse already did its job. Leave alone.
- **`lib/mcp/schema-compat.ts` (new, 182 LOC, PR #438)** — net-new this quarter, deep (the published-schema nullable→type-array compat is a single cohesive concern behind a small interface). Not duplication; do not audit a fresh deep module as bloat. Leave alone.
- **`lib/roest-client.ts` (623 logic LOC)** — sectioned-long, not tangled (Audit 06). Leave alone.
- **`components/Ssp.tsx` (fanout 22)** — deep primitive family; fanout is health (R11). Leave alone.
- **`formatVLabel` twins (`green/page.tsx` vs `green/[id]/page.tsx`)** — documented-deliberate divergent contracts (Audit 06). **Revisit trigger: only if a third copy appears (the N=3 dial).** Leave alone.
- **Index-page grouping logic (cultivars/terroirs/roasters)** — three different domain hierarchies; a generic abstraction would be wider than its three implementations (Audit 06). Leave alone.
- **`RegistryDetailShell` full-page abstraction** — stays dead per Audit 01's explicit rejection; re-flagged so no "tidying" session resurrects it.
- **The MCP tool-tail adoption + `DOC_CATALOG` + `maxUpdatedAt` (06-C1/C3/C4)** — already landed (PR #427); not re-audited. Verified clean this session.
- **Audit 05 orphan sweep + `process-aggregation.ts` edge casts** — still real, still not worth a dedicated session; fold opportunistically into whichever sprint next touches those files.

## Dependency sequence (R7)

1. **PR A (S, lead):** Candidate 1 — add the `.claude/worktrees` skip to `check-doc-links`, fix the 1 dead anchor, refresh the CLAUDE.md currency line. Gate back to green-and-meaningful.
2. **PR/op B (S, alongside A):** Candidate 2 — `git worktree prune` + reclaim the 285 orphaned worktrees (11 GB), status-check each before removal. Decide the re-accumulation guard.
3. **Later / opportunistic, in any order (all WORTH EXPLORING carryovers):**
   - Candidate 3(a) — export + reconcile the green/[id] batch parsers (safe; could go straight to an operator-approved execution session). 3(b)/(c) need the grill.
   - Candidate 4 — roast-import `runPatch` (deliberate, with the write-path matrix; highest blast radius).
   - Candidate 5 — `finishSynthesis` tail (bundle with the next synthesis-touching sprint).

No substrate changes anywhere in this list (no schema, no Tool surface, no prompt vocabulary) — the six-actor audit is **not** triggered for A-B or the carryovers. Candidate 1 touches a CI gate's implementation + one CLAUDE.md tripwire line (Actor 5 doc currency), not any Tool/Resource interface.

## Open questions before implementation

- **Candidate 2 (worktree guard):** should the SessionStart hook gain an age-based auto-prune (e.g. remove worktrees with no commits and mtime > N days), or stay manual-quarterly? Auto-removal of a worktree is destructive (R6 caps the automation at WORTH EXPLORING) — grill whether the convenience is worth the foot-gun, or whether a `--dry-run` report is the safer guard.
- **Candidate 3(c):** per-view files under `app/(app)/green/[id]/` or a `views/` subdir? (Carried from Audit 06 — still unresolved; pick one in the grill.)
- **Candidate 4:** are `customize` hooks the right shape, or does cupping's composite-key lookup make it a 5-of-6 executor with cupping left bespoke? (Carried from Audit 06.)
- **Candidate 3 verification:** the Audit 02 named-lot matrix (waiting-roast = Rancho Tio, resolved = Sudan Rume) is ~9 months stale — re-derive live exemplar lots per lifecycle state via `list_green_inventory` before any green/[id] refactor.
