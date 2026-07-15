# Completion report — Lifecycle-gate reconciliation (SPG) grill

**Date:** 2026-07-15 · **Kickoff:** [lifecycle-spg-reconciliation-grilling-kickoff.md](docs/sprints/lifecycle-spg-reconciliation-grilling-kickoff.md) · **ADR:** [0025-spg-pending-composite-encoding.md](docs/adr/0025-spg-pending-composite-encoding.md) · **PR:** see § Shipped below

## 1. The plan, restated

Grilling session (emitted by the 2026-07-15 plan-feedback pass) to resolve the lifecycle-gate-not-modeled meta-pattern — the backlog's highest-recurrence theme (#22 recurrence 5+, #23 recurrence 2, #58 recurrence 2). Three member items: **#22** whether the SPG deserves a first-class lifecycle state vs riding migration-080's `waiting_for_brewing` (which conflates SPG-wait with optimized-brew-wait); **#23** a partial-proposal rule + deferred-proposals concept for gated sessions (STAGE 7's blanket skip left the active-lot doc stale); **#58** log-cupping Path C-2's two prompt-vs-schema drifts (the "state stays Waiting for next cupping" line that reddened `check:lifecycle-consistency` on every SPG handoff, and the phantom `cuppings.additional_notes` column). Rules of engagement: grill, don't execute — except #58 facet 1, executable in-session once ratified; schema decisions get an ADR + follow-on execution brief.

## 2. Decisions + divergences

Every open question from the brief was resolved; two findings the brief didn't anticipate reshaped the scope.

1. **#22 — no new state (brief question 1).** Ratified the `waiting_for_brewing` conflation as deliberate: **SPG-pending is the two-column composite** `lot_status = 'waiting_for_brewing'` + `experiments.winner = 'deferred pending SPG'`. The candidates from the backlog (`waiting_for_spg` enum, `gates` table) were declined — the two states behave identically everywhere, and the sentinel already disambiguates SPG-wait from optimized-brew-wait (which carries a real slot id in `winner`). Extends ADR-0024 § 6; recorded as ADR-0025. Chris: "waiting for brewing is fine - that is what im doing in this case so this does seem to match reality."
2. **Sentinel stays prose, canonicalized (brief question 2).** No structured field — a NULL-`winner` + flag design would break the designed exception and force a derivation rewrite. Two exact canonical strings, now documented in `CONTEXT-roasting.md -> Simulated Pourover Gate system -> Lifecycle behavior`: `deferred pending SPG` (gate open) and `none - SPG eliminated all finalists` (patched at a no-winner re-entry so the deferral never dangles — new concept the grill surfaced; Chris ratified the string).
3. **The SPG process is not recorded (new — surfaced by Chris's four lived cases).** Hard-to-call gates may take extra SPG iterations; those stay in the brewing thread, archive-driven, exactly like brewing. Only the **decisive cup-set** re-enters as cupping rows (`eval_method: 'Simulated Pourover'`), in BOTH outcomes (a negative result is still roast evidence). Two-outcome re-entry contract written into Path C: winner → patch sentinel to slot + re-assess `is_reference_candidate` → Path A; no winner → patch sentinel to the no-winner canonical string → Path B.
4. **#23 — winner-dependence partial-write rule (brief question 3).** STAGE 7's blanket skip replaced by one test: does the proposal's content depend on the leading-slot identity? Winner-INDEPENDENT lands now (active-lot status flip, findings true regardless of finalist, CCIL violations); winner-DEPENDENT defers; **defer on doubt** (a deferred proposal costs one re-entry write; a wrong landed one costs an arbiter reversal).
5. **#23 — deferred set home (brief question 4).** No queue table. Grep-able `DEFERRED_PROPOSAL: <target doc> - <one-line gist>` lines appended to the experiment's `additional_notes` (the `REST_DAYS_DRIFT:` prefix precedent); Path C re-entry drains them mechanically. Ports to a table later if it ever strains (prototype-before-generalizing).
6. **#58 facet 2 — already shipped (divergence from the brief).** The same-morning roasting-prompt-hygiene batch (PR #579, item #45a) had already homed the SPG note in the cupping's `overall` prose behind the canonical `SPG:` prefix (the brief's option (c)), with `eval_method` as the grep key. The grill ratified that choice rather than re-deciding it.
7. **Peer-cup gate DEMOTED to advisory (surprise ratification — the brief's question 5 asked something narrower).** Probing whether the sentinel applied to the peer-cup gate ("Path C-1") surfaced that the prompt modeled it as a halting gate while Chris's lived practice treats it as a nice-to-have: transfer value requires BOTH same green AND compatible roast philosophy (the Untold dark-roast case rates Low), it's one roaster's interpretation to calibrate against, never a target to match, and it should never halt, defer `winner`, or touch `lot_status`. Demoted to a non-route advisory; **the SPG is the only Path C and the only winner-deferring gate**, which also resolved log-cupping's internal STAGE-4.5-vs-report-format contradiction and pod-1-routing.md's dormant consolidation question (option (c) won). Chris also asked for plain-English names over path codes in conversation — saved to memory (`feedback_plain_english_gate_names.md`).

Tag-alongs from the brief NOT reached: #36 (inference-overridden-by-cup — still observing at N=2, untouched), #34/#55 (doc-write-ergonomics — the deferred-proposals design didn't touch the ticket-tracking seam).

## 3. Shipped

All edits are doc/prompt/glossary layer (Actor 2 + Actor 5) plus one MCP Resource title string (Actor 4). **No migration — every schema candidate was deliberately declined, so no follow-on execution brief is needed; the arc closes here.**

- `docs/prompts/log-cupping.md` — STAGE 4.3 sentinel exception; STAGE 4.5 sentinel-scoped; peer-cup advisory replaces the Path C-1 route; Path C (renamed from C-2) gains the two-write handoff + re-entry contract + deferred-proposals drain; STAGE 7 partial-write rule; STAGE 8 report format (routes, sentinel, `waiting_for_brewing` confirmation).
- `CONTEXT-roasting.md` — § SPG "Lifecycle behavior" rewritten (composite + canonical strings + process-not-recorded; the stale "stays Waiting for next cupping / agents should not invent one" prose removed); § Pre-V_n calibration gate rewritten (SPG only halting variant; peer cup advisory + rationale).
- `docs/adr/0025-spg-pending-composite-encoding.md` — new.
- `docs/skills/cupping-specialist/SKILL.md` — routing steps, Path C entries, STAGE 6 partial-write alignment, outputs/handoffs.
- `docs/skills/cupping-specialist/cluster/pod-1-routing.md` — status header + substrate note record the consolidation-question resolution.
- `lib/mcp/docs.ts` — Cupping Specialist Resource title `Path A/B/C-1/C-2` → `Path A/B/C`.
- `docs/product/feedback-backlog.md` — #22/#23/#58 → shipped blocks; new freezer-stock peer-roast reminder item; header updated. `docs/sprints/shipped.md` — new row.

**PR:** _(URL + merge SHA filled at merge — see the ship message in-session)_

## 4. Verification (what was actually run)

- `npm run check:doc-sizes` — all Tier-1 surfaces within cap; `log-cupping.md` at 33.7KB against the 40KB claude.ai-prompt cap.
- `npm run check:doc-links` — 439 files scanned, **0 live misses** (104 pre-existing archive warnings, non-gating by design).
- `npm run check:mcp-bundle` — 139 DOC_FILES paths covered by 15 globs.
- `npx tsc --noEmit` (via main-repo node_modules symlink, removed after) — clean, covering the `lib/mcp/docs.ts` edit.
- Repo-wide grep for `C-1` / `C-2` / `deferred pending` — remaining hits are historical-by-design (backlog shipped blocks, grilling-queue archive, sprint archives, pod-1-routing's historical substrate list, this report).
- Mismatch mechanics verified in code before deciding, not assumed: `lib/lifecycle-state.ts:255` (truthy `winner` → derived `waiting_for_next_roast`) + `scripts/check-lifecycle-consistency.ts:119` (the designed exception) confirm the backlog's red-cron diagnosis and that the ratified handoff pair lands green.
- **NOT run:** `check:lifecycle-consistency` against PROD — the live proof waits for the next real SPG handoff (the AN10 lot is the live test case per the brief); the prompt now instructs the exact write pair the designed exception requires.

## 5. Deferred / surprising / newly surfaced

- **Surprising:** #58 facet 2 was already closed by the same-day hygiene batch; the peer-cup gate demotion was the grill's biggest unplanned outcome; every schema candidate died in the interview (the "grill output = migration brief" expectation inverted — the modeling gap was documentation, not schema).
- **Newly surfaced:** freezer-stock peer-roast reminder (filed, backlog, low); plain-English-names preference (memory).
- **Deferred:** `eval_method` canonicalization stays gated in pod-1-routing.md; #36 stays observing; the 2-row SPG `eval_method` data patch remains with the #57 MCP required-axis sprint as its verification case.

**Next for Chris:** bring this report to a plan-feedback/close-out session — #22/#23/#58 are flipped to shipped in the backlog, the shipped.md row is in, and `route-feedback` has nothing pending from this grill beyond the two items above (already filed/saved).
