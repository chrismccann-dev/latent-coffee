# claude.ai grilling review — 2026-06-05 (second run of the recurring protocol)

Fired post the 2026-06-05 system-level grill (ADR-0022 / ADR-0023 / grilling-queue items 47-49), per the standing rule [`feedback_claude_ai_grilling_review`](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_claude_ai_grilling_review.md). Kickoff: [claude-ai-grilling-review-kickoff-2026-06-05.md](claude-ai-grilling-review-kickoff-2026-06-05.md) (authored in a sibling worktree). Chris drove the claude.ai UI; Claude Code drafted edits + cross-party questions + scored the answers.

**Headline:** the calibration note held — this firing was **light on claude.ai-facing drift** (3 small memory edits, 0 instruction edits, none of the new system vocab). The high-value output was **Component 3**: the REDPLUM context-window check confirmed the single-session-per-lot model is now the binding context constraint, directly motivating the Lot Coordinator restructure as the next sprint.

---

## Component 1 — Memory + instruction currency

Reviewed both projects' full instruction + memory sets (Chris pasted them). Diffed every line against current substrate. **Calibration confirmed:** none of the 2026-06-05 system vocab (formalization tax / graduation threshold N=3 / six pruning shapes / arbiter-shaped mechanism / ADRs 0020-0023 / architecture-review skill / check:types-vs-schema) belongs in claude.ai's workflow memory — all Claude-Code/build-process.

**3 memory edits landed (merge-only "Forget X. Remember Y." chatbox passes; Chris confirmed both pasted):**

1. **Roasting — lifecycle 4→5 states.** Memory said *"4-state … `in_inventory` → `waiting_for_next_roast` → `waiting_for_next_cupping` → `resolved`. Presence of a roast_learnings row promotes to resolved and wins over all other rules."* Corrected to **5 states** (`unresolved` added, Sub-sprint 4a) with the conditional rule: `why_this_roast_won` populated → resolved; NULL → unresolved.
2. **Roasting — stale on-the-horizon item.** Memory claimed `cos-hig-bor-2026.md` learnings doc is unregistered/deferred. Verified it **is** registered now (`lib/mcp/docs.ts:126`). Retired the note.
3. **Brewing — modifier list 3→5.** Memory said *"Modifiers: Output Selection, Inverted Temperature Staging, Aroma Capture."* Corrected to **5**: Output Selection, **Thermal Staging** (renamed, alias-safe), Aroma Capture, **Role-Based Pulse**, **Equipment** (4c, 2026-05-28). The six strategies + five Hybrid sub-forms in the same line were already correct (and "Temperature-Staged" *sub-form* correctly NOT renamed — the rename was modifier-only).

**No edit needed (auto-picked-up via live fetch or already correct):** CCIL re-arch (claude.ai only needs the propose-target path, which it has), filters owned/not-owned (read via `read_canonical(filters)` live), log-cupping prune/STAGE 0 (live `log-cupping.md` fetch each session), the 05-31 "context docs are not stubs" fix (still correct), tool count 35 (15/9/8/3 checks out).

**2 substrate-side follow-ups filed to [issues.md](../product/issues.md)** (NOT claude.ai edits):
- `CONTEXT-brewing.md:20` stale the same way brewing memory was (4 modifiers / "Inverted Temperature Staging") — claude.ai reads it as a `docs://` Resource, so a missed hop in the 4c/#399 six-actor trace. (Lowered urgency after Component 2 — claude.ai answers counts via `read_canonical`, not this file — but still a currency fix.)
- `log-cupping-stage0-migration.md` not registered in `docs.ts` — latent break-glass gap (no pre-rewrite lots remain today).
- (Item 48 SKILL.md description drift at `docs.ts:503/519` — confirmed still drifted; already banked in the grilling-queue for the roasting-coordinator grill.)

---

## Component 2 — Cross-party claude.ai grill

Put open-phrased questions to fresh threads in each project. **Zero claude.ai drift beyond what the two pastes already fixed.**

| Q | Project | Result |
|---|---|---|
| Strategies + modifiers count/names | Brewing | ✅ 6 / 5, named correctly incl. Thermal Staging + Equipment; explicitly flagged *"the old three-modifier picture is stale."* Answered via live `read_canonical`. |
| Filters source + ownership split | Brewing | ⚠️ **Reviewer's baseline was wrong, not claude.ai.** claude.ai: flat registry with `owned: bool` + `location` per-entry attributes, NOT a structural split. Verified against `lib/filter-registry.ts:63-64` — claude.ai correct. Kickoff's "split owned/not-owned" phrasing was imprecise. |
| Lifecycle states + unresolved | Roasting | ✅ 5 states, `unresolved` terminal, `why_this_roast_won` gating exactly right. Paste verified landed. |
| Reference roast vs candidate | Roasting | ✅ candidate (log-cupping S3) / reference (close-lot S2) / worth_repeating / `why_this_roast_won` discriminator — all correct. |
| Cupping stages + STAGE 0 | Roasting | ✅ Best-case: **refused to confabulate** the stage list, deferred to the live prompt, did NOT claim a per-session STAGE 0 (the drift watched for). Its guess "STAGE 0 = a get_bean_pipeline check" was self-flagged as inference. |

---

## Component 3 — Context-window check (REDPLUM, roasting-emphasized) — THE HEADLINE

REDPLUM-CAS-2026, mid-V-set (V1 closed, V2 pushed but not yet roasted; V3 designed). Still no fully-closed multi-V-set thread → forward lower bound, not the clean full-lifecycle number. claude.ai's self-estimate (caveated as estimate, not byte-count):

**Peak ~80-90% of the 200K window** — up from ~55-65% on 2026-05-31. **The dominant bucket FLIPPED:**

| Bucket | 2026-05-31 | 2026-06-05 |
|---|---|---|
| Session-start / fetched docs | ~5-8% | ~3-5% (didn't re-fetch main prompts after first use) |
| MCP tool-call payloads | **dominant ~55-65%** | ~30-35% (no longer dominant) |
| Conversation prose (mostly claude.ai's own responses) | not the driver | **largest ~50-55%** |

**Why it flipped:** three sessions stacked in one thread (V2 log-roast → V2 log-cupping → SPG cuppings + V3 design), each carrying forward roast prose + recipe payloads + proposal text; "every turn stays in the window forever." The #1 waste is **claude.ai's own prose duplication** — the same V_n narrative restated across `push_roast.what_*` + `patch_experiment.observed_outcome/key_insight/delta_*` + `propose_doc_changes` proposed_text + end-of-turn summary tables (~3x the needed information density, each differently phrased so not literal dupes).

**Heaviest single MCP call:** `get_bean_pipeline` at V2 log-roast (~25-35KB — 6 roasts, 6 cuppings, 2 experiments w/ 30+ fields each, 6 recipes w/ full bezier arrays + 8-12 prose fields). claude.ai *skipped* the two later pipeline pulls to save ~50-70KB, accepting stale-state risk (it later missed that V2 recipes had grown `predicted_*` fields).

**Runners-up:** `read_canonical(producers/cultivars/terroirs)` full-registry returns at intake where one row was used each (3rd observation of this cost). Notably claude.ai said its *memory documents* a `read_canonical(axis, name)` filter — but the bare form still returned everything, i.e. **the memory promises a filter that isn't implemented yet.**

### Dispositions

- **Lot Coordinator = correctly sequenced next.** This is the empirical confirmation Chris was worried about: the single-long-thread-per-lot model fills the window before the lot even closes. The Coordinator/V-Set-Assistant split (ephemeral per-V-set sessions emitting thin results packets, then stopping) structurally attacks the now-#1 cost — cumulative conversation prose across stacked sessions. A fresh V-Set Assistant reconstructs its input from a `since:` pull rather than inheriting all prior prose.
- **ADR-0014 amendment target refined** (Item 5b): the 05-31 conclusion was "threshold against MCP-payload accumulation." 06-05 refines it — at multi-session scale the binding constraint is **conversation-history accumulation across stacked sessions** (with prose duplication as the amplifier), MCP payloads second. The structural fix is the Lot Coordinator; the supporting fixes are the two `issues.md` MCP-efficiency items.
- **Both `issues.md` MCP-efficiency items reinforced** — `read_canonical` name filter (now also a memory-vs-implementation gap) and `get_bean_pipeline since:` (claude.ai skipping pulls to cope proves the cost is real). Both already tagged Lot-Coordinator prerequisites.

---

## Open follow-ups out of this firing

1. `issues.md`: `CONTEXT-brewing.md:20` currency fix (filed).
2. `issues.md`: register `log-cupping-stage0-migration.md` in `docs.ts` (filed).
3. grilling-queue Item 5b: appended the 06-05 data point (peak 80-90%, bucket-flip to conversation prose).
4. The clean full-lifecycle context number still awaits REDPLUM's close (or any first fully-closed multi-V-set thread) — by which point it will be even higher than 80-90%. Re-measure at REDPLUM close-out.
