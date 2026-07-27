# Kickoff brief — two N=3 graduations from the brewing friction log

**Source:** close retro of the Untold Fazenda Um Pink Bourbon brew, 2026-07-27 (`brew_id 91a014fd`, friction-log entry merged in PR #595 / `07214a2`). Authored by the retro session; ratified into the repo by the 2026-07-27 route-feedback → plan-feedback pass.

**Status at ratification (2026-07-27):**
- **Item 1 — SHIPPED in the same pass** (small, fully specified, live-verified fix; the autonomy rule applied). See the completion summary at the bottom.
- **Item 2 — PLANNED, build gated on the design fork below.** Chris's (a)-vs-(b) call is the entry condition for the implementer session.

Two standing frictions both hit the N=3 graduation threshold in one session. They are **independent** — no shared files, no sequencing dependency.

---

## Item 1 — Freezer-stock lookup overflows the read cap (execute) — ✅ shipped 2026-07-27

### Problem

The brew workflow's first act on a purchased coffee is a freezer-stock lookup, and that lookup is now a coin flip. `docs/brewing/freezer-stock.md` has grown to **107 bags / 785 lines / 70.8 KB**, past the whole-doc read cap that both brewing entry surfaces still instruct. A whole-doc `read_doc` truncates around line 487, so whether the lookup succeeds depends on where the bag happens to sit in the file.

On 2026-07-27 the target bag sat at **line 585 — past the truncation point.** The session only recovered by falling back to `grep`, which a mobile Claude Code session cannot do. **On mobile this would have hard-blocked the brew outright**, not degraded gracefully. At N=1 (2026-07-01) and N=2 (2026-07-10) the target bag happened to land on page 1 both times, so the failure was theoretical. It isn't anymore.

### Goal

Make the freezer-stock lookup bounded and truncation-proof regardless of table size, by replacing the whole-doc read with an enumerate-then-read-one-section pattern.

### The fix (verified working, not hypothetical)

Both steps were tested live against the MCP server during the retro:

1. `list_doc_sections(uri="docs://brewing/freezer-stock.md")` → returns 107 anchors, **~8.2 KB** of heading text.
2. `read_doc_section(uri="docs://brewing/freezer-stock.md", anchor="<matched ## heading>")` → returns the single bag record, **~500 bytes**.

Confirmed round-trip on the real anchor `Untold Coffee Lab — Brazil Fazenda Um Pink Bourbon — Dark Room Natural (TUVADKNAT)`, which returned the full record cleanly.

**~8.7 KB vs 70.8 KB — an 8× reduction, and critically it never truncates, so it cannot hard-block.**

**Enumerate first; do not skip it and guess the anchor.** Anchor matching is case-sensitive exact, and the heading formats vary (em-dash count and position differ, lot codes appear inconsistently, `Picolot — Picolot #20:` doubles the roaster name). A constructed-anchor guess will miss often enough that the enumerate step pays for itself.

### Scope

**In:**
- `.claude/skills/brew/SKILL.md` Step 1a — replace the whole-doc `read_doc` instruction with the enumerate-then-read-section pattern.
- `docs/prompts/start-brew.md` (mobile fallback entry) — same instruction, must change identically.
- Keep the existing "read the file directly" desktop affordance.

**Out:**
- Restructuring or splitting `freezer-stock.md` itself — the *access pattern* is the bug.
- `.claude/skills/freezer-stock/SKILL.md` — confirmed clean (appends/edits directly, no whole-doc read).

### Completion summary (2026-07-27)

Shipped in the same PR as this ratification. Both surfaces edited identically (enumerate-then-read-section, always-enumerate rule, desktop affordance kept); friction-log entries 2026-07-01 / 2026-07-10 / 2026-07-27 annotated `→ graduated:` per § Discipline; freezer-stock skill confirmed unaffected. Verification results recorded in the PR description.

---

## Item 2 — Brew lookups have no filter or projection (decide, then execute) — planned, fork open

### Problem

There is no way to ask the brew corpus a targeted question. `list_recent_brews` returns latest-first across all sources with **only a `limit` parameter** and a fixed ~30-column select, so any lookup narrower than "what did I brew lately?" means pulling a wide window and filtering client-side.

In the 2026-07-27 session this fired twice and blew the token ceiling both times:

| Call | Question being asked | Payload |
|---|---|---|
| `list_recent_brews(limit: 20)` | Has this coffee been brewed before? | 112,594 chars → routed to file |
| `list_recent_brews(limit: 50)` | What terroir/producer did the sibling Fazenda Um lot use, so the same farm resolves to the same canonical FKs? | 239,484 chars → routed to file |

Both were answered with a one-line `jq` filter on `roaster == "Untold Coffee Lab"`. Both are the shape the 2026-07-01 friction entry already named: **sibling-variant lookup by roaster + coffee family.** A mobile session cannot do the save-to-file + `jq` recovery, so this is a mobile hard-block in the same way item 1 was.

The second call was **correctness**, not curiosity — matching the sibling lot's terroir is what kept both Fazenda Um coffees resolving to one canonical farm instead of minting a divergent terroir row.

### The design fork (resolve this before writing code) — BLOCKING

The Tool's own description already stakes out an answer:

> *"Filtered fetches (by strategy / process / cultivar / since_date) belong on a future `query_brews` Tool — this one returns latest-first across all sources."*

**(a) Add filter params to `list_recent_brews`.** Cheapest diff, but contradicts the documented design intent and collapses two distinct jobs into one surface.

**(b) Build `query_brews` as a new Tool. ← recommended.** Matches documented intent, keeps `list_recent_brews` a clean recency feed, gives the filter axes room to grow. Tool count 38 → 39, well under the 50 tripwire.

**(c) `fields` projection only, no filters.** Rejected on analysis: **the filter is the load-bearing part, not the projection** — a projection alone would have turned two 100K+ payloads into two 20K payloads, still wasteful and still the wrong shape.

### Goal (assuming (b))

Ship a `query_brews` Tool that answers targeted brew-corpus questions in a bounded payload, so sibling-lot and prior-brew lookups stop being wide dumps.

### Scope

**In (proposed filter axes):**
- `roaster`, `coffee_name` (substring match) — **the pair that drove both blown calls; do not ship without these**
- `extraction_strategy`, `base_process`, `cultivar`, `since_date` — the axes already named in the existing description
- `fields` projection (or a trimmed default returning ~8 identity + recipe columns) so even a wide match stays bounded
- Reuse `fetchRecentBrews`'s select/clamp machinery in `lib/mcp/brews.ts` rather than duplicating the column list

**Out:**
- Free-text search across prose fields (`what_i_learned`, `strategy_notes`) — a different feature with its own indexing question.
- Any change to `get_brew`.
- Deprecating or narrowing `list_recent_brews` — it stays the recency feed; only its description's forward-reference gets updated to point at the real Tool.

### Entry surface

Fresh Claude Code session. **Open with the design fork above and get an explicit answer on (a) vs (b) before writing code.**

### Files likely to touch

- `lib/mcp/query-brews.ts` (new) — model on `lib/mcp/list-recent-brews.ts`
- `lib/mcp/brews.ts` — a `fetchBrewsFiltered` sibling to `fetchRecentBrews`; reuse `RECENT_SELECT` / the clamp logic
- `lib/mcp/server.ts` — registration
- `lib/mcp/list-recent-brews.ts` — update the "future `query_brews`" forward-reference
- `SYNC_V2.md` — Tool table + the "38 Tools live" line
- `CLAUDE.md` — **two** places: § MCP server status and § Standing tripwires Tool-count line
- `PRODUCT.md` — § Scaling Watch-Items Tool-count mention
- `docs/skills/brewing-assistant/cluster/process-friction-log.md` — flip the "graduation in flight" annotations to `→ graduated:`
- `docs/product/feedback-backlog.md` — flip the `query_brews` entry `planned → shipped`

### Verification plan

1. `npm run check:mcp` — registered count moves **38 → 39**; force a fresh session (or explicit `tool_search`) before concluding the Tool is live (catalog cache rule).
2. `npx tsc --noEmit` clean (main repo dir or node_modules symlink).
3. Live regression: `query_brews(roaster: "Untold Coffee Lab")` returns the 2–3 Untold rows in **well under 10 KB**, vs 239 KB for the `list_recent_brews(limit: 50)` that answered the same question.
4. Empty-result case returns a clean empty array, not an error.
5. `limit` clamping still enforced (`RECENT_MAX_LIMIT` = 50).
6. Cross-system audit, actor by actor: Actor 4 (Tool schema + description), Actor 5 (CLAUDE.md / SYNC_V2.md / PRODUCT.md counts), Actor 2 (does any `docs/prompts/*.md` flow want the new Tool?), Actor 3→5 (catalog refresh on next fresh session).
7. `npm run check:mcp-bundle` only if a new `docs://` Resource is added — not expected.

### Open questions

1. **(a) vs (b)** — the fork above. **Blocking; Chris's call.**
2. Trimmed-by-default column set with `fields` as opt-in widener, or full `RECENT_SELECT` shape with `fields` as narrower? Trimmed-by-default is the safer instinct given the failure mode is payload size.
3. Substring match on roaster/coffee_name, or canonical-resolve through `ROASTER_LOOKUP` first (so "Hydrangea Coffee Roasters" and "Hydrangea Coffee" return the same rows)?
4. Worth a `green_bean_id` filter for self-roasted lot lookups while the Tool is being built? Cheap now, awkward to retrofit.

---

## Completion handoff (item 2 implementer: read this)

When the item-2 work is done and merged, write a completion report to `docs/sprints/query-brews-completion.md` that (1) restates the plan so the report stands alone, (2) recaps what shipped per the scope incl. divergences + why, (3) gives the PR URL + merge SHA, (4) reports **actual** verification results (what was run and seen, not "should work"), and (5) flags anything deferred, surprising, or newly surfaced. Then tell Chris the report is ready to close out: flip the backlog entry `planned → shipped` (move the line to `docs/sprints/shipped.md`), flip the friction-log "graduation in flight" annotation to `→ graduated:`, and `route-feedback` any new friction the build surfaced.

## Notes

- The friction log's § Discipline requires graduated entries get a trailing `→ graduated: <where>` annotation **rather than deletion**. Done for item 1; item 2's annotations currently read "graduation in flight."
- Unrelated but pending on the same brew: three `propose_doc_changes` proposals sit in the arbiter queue (`c6ad5939` Untold roaster card, `9f844879` hybrid.md, `fa6c84c4` cross-coffee-insights.md) awaiting a `process pending arbitration` pass. Independent of both items here.
