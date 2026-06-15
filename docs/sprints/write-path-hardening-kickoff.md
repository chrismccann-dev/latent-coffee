# Kickoff — Write-path hardening (feedback-backlog sprint, 2026-06-15)

**THIS IS AN EXECUTION SPRINT.** The scope is concrete and mechanical; the two design
calls are locked below (no placeholders). Planned work with a kickoff brief → ship
autonomously per [CLAUDE.md § Git Discipline](../../CLAUDE.md) (commit + push + PR + merge
as one flow; do not stop at "ready for review"). The autonomy rule applies here.

Source: `plan-feedback` run over [docs/product/feedback-backlog.md](../product/feedback-backlog.md).
Cluster chosen by Chris: the highest-recurrence-among-buildable concrete write-path fixes.
Three members: **#54** (op/operation alias), **#56** (push_brew FK-inherit), **#46** (patch_inventory pre-load hint).

---

## Goal

Stop three recurring write-path footguns that bite the MCP write surface every workflow
session: the `op` vs `operation` citation-field mismatch (#54), push_brew minting
divergent/orphan terroir rows when a `green_bean_id` is supplied (#56), and the
patch_inventory cold-tool-search latency at every close-out's single STAGE 6 archive call (#46).

## Scope

**In:**
- **#54 — propose_doc_changes accepts `op` as a server-side alias for `operation`.** On each
  citation, accept `op` and normalize it to `operation` before the `z.enum(VALID_OPERATIONS)`
  validator runs. This is the surviving sibling of the now-resolved #52 server-side-input-
  forgiveness class. The prompt prose already says `operation` in three places (#39 / PR #409);
  this makes the server forgiving so it stops relying on each prompt's reminder.
- **#56 — push_brew inherits terroir_id / cultivar_id from the `green_bean_id` row.** When a
  brew is pushed with a `green_bean_id`, bind the brew's `terroir_id` / `cultivar_id` to the
  green bean's canonical FKs instead of re-resolving from the payload via
  `findOrCreateTerroir` / `findOrCreateCultivar` (which mints divergent rows — Round 24:
  brew terroir `5b454459…` "Central Andean Cordillera" vs green canonical `7e8d0618…`;
  Round 10: Higuito `b3a5681e` ≠ green `56dedde9`).
- **#46 — patch_inventory pre-load hint** at the top of `close-lot.md` + `one-shot-closeout.md`
  so the tool is warm before the STAGE 6 archive call (it's called exactly once per lot, so it's
  structurally never warm at STAGE 6). Mirror the existing pre-warm hint in
  [bundled-brewing-completion.md:68](../prompts/bundled-brewing-completion.md).

**Out:**
- The param-name asymmetry half of #46 (`roest_inventory_id` not `inventory_id`) — both prompts
  already pass the correct `roest_inventory_id` (close-lot.md STAGE 6, one-shot-closeout.md
  STAGE 6), and the operator called the asymmetry "not worth changing" (the error message names
  the params, so it self-corrects). Only the cold-lookup-latency half is in scope.
- The remaining doc-write-ergonomics items (#34 mid-section append, #41, #45, #50, #55) — a
  separate cluster, not this sprint.
- Any schema/lifecycle work (#22/#23 lifecycle-gate cluster — that's a grilling session folded
  into the Lot Coordinator capstone).

## Locked design calls (do not re-litigate)

1. **#54 precedence:** if a citation supplies BOTH `op` and `operation`, the explicit
   `operation` field wins and `op` is dropped silently. `op` only fills `operation` when
   `operation` is absent. Implement as a `z.preprocess` (or equivalent) on the citation object
   that copies/strips `op` before the enum validator — server-side validation behavior is
   otherwise untouched (still `z.enum(['append','replace','prepend'])`). Add a one-line note to
   the `operation` field `.describe()` that `op` is accepted as an alias.
2. **#56 inheritance rule:** when `green_bean_id` is supplied AND the green-bean row has a
   non-NULL `terroir_id` / `cultivar_id`, use the green bean's FK directly (skip findOrCreate*
   for that axis). If `green_bean_id` is supplied but the green-bean row's FK is NULL (or the
   green bean isn't found), FALL BACK to the existing payload-based `findOrCreate*` path for
   that axis. The purchased path (no `green_bean_id`) is unchanged. Provenance: a brew that
   inherited from the green bean is `terroir_provenance: 'canonical'` (it bound to an existing
   canonical row, did not mint one).

## Files likely to touch

- [lib/mcp/propose-doc-changes.ts](../../lib/mcp/propose-doc-changes.ts) — `citation` z.object
  (the `operation` field is at ~line 126; wrap the object in a preprocess that aliases `op`).
- [lib/brew-import.ts](../../lib/brew-import.ts) — `persistBrew` (the terroir/cultivar
  `Promise.all([findOrCreateTerroir, findOrCreateCultivar])` block is at ~lines 896–927; add the
  green-bean FK lookup + the inherit-or-fallback branch ahead of it). Confirm whether
  `green_bean_id` is already resolved to a row earlier in `persistBrew`; if not, add a single
  `select('terroir_id, cultivar_id')` on `green_beans` scoped to `userId`.
- [docs/prompts/close-lot.md](../prompts/close-lot.md) — pre-load hint near the top
  (tool-list / STAGE preamble region).
- [docs/prompts/one-shot-closeout.md](../prompts/one-shot-closeout.md) — same hint.
- Possibly [docs/reference/mcp-architecture.md](../reference/mcp-architecture.md) — a one-line
  note that propose_doc_changes accepts `op`|`operation` and push_brew inherits FKs from
  green_bean_id (Actor 5 hop; only if the doc already documents these tools at that grain).

## Verification plan

Build + gates (REQUIRED — this touches `lib/brew-import.ts` + MCP server input schema):
- `npx tsc --noEmit` in the **main repo** (`/Users/chrismccann/latent-coffee`) or via the
  `ln -sf ../../../node_modules node_modules` symlink trick in the worktree, then `npm run build`.
  The worktree can't run the full build (`@anthropic-ai/sdk` doesn't resolve there) — use the
  main repo. Remove the symlink before committing if you create one.
- `npm run check:mcp` — propose_doc_changes input schema changed; confirm the catalog still
  passes the type-resolvability gate (the alias preprocess must not regress published types).
- `npm run check:doc-links` — two prompt files edited; keep links root-relative.

Behavioral verification:
- **#54:** a propose_doc_changes call with a citation using `op: 'append'` (no `operation`)
  is accepted and applied as an append; a citation with both `op` and `operation` honors
  `operation`. (A live MCP call needs a fresh session per the cache rule — the input-schema
  change to an existing tool isn't callable until re-handshake. Cover the alias logic with a
  direct unit-level check / zod parse assertion if a live session isn't available this sprint;
  note the deferred live check in the completion report.)
- **#56:** push a brew with `green_bean_id` set to a lot whose green-bean terroir differs from
  the payload's terroir; assert the resulting `brews.terroir_id` equals the green bean's
  `terroir_id` and that NO new "auto_created" terroir row was minted. Verify against a real lot
  (e.g. the Round 24 lot or AN10) via the MCP path / a `.select()` probe. The brew must still
  bind to the lot via `green_bean_id` + `roast_id` (unchanged).
- **#46:** prompt-only — verify by reading the rendered prompt that the pre-load hint is present
  and names `patch_inventory` (no runtime path).

Six-actor cross-system audit (this is a substrate change to the MCP write surface):
- **Actor 6 (schema/UI):** #56 changes `lib/brew-import.ts` behavior, NO schema change (no new
  column). #54 no schema change. Confirm `lib/types.ts` needs no edit.
- **Actor 4 (MCP):** #54 = the propose_doc_changes input-schema alias + `operation` describe
  note; #56 = push_brew behavior (optionally a one-line describe note that FKs inherit from
  green_bean_id).
- **Actor 5 (Claude Code docs):** the optional mcp-architecture.md note above.
- **Actor 2 (prompts):** #46 = the two pre-load hints. #54 — prompts already say `operation`,
  no change needed (the alias is purely defensive). #56 — no prompt change (server-side behavior).
- **Actor 3 (claude.ai):** the propose_doc_changes input-schema change (#54) isn't callable
  until a fresh claude.ai session re-handshakes the catalog (standing MCP-cache rule) — note in
  the completion report that existing sessions hold the stale schema.
- **Actor 1 (Chris):** rendered brews still bind to their lot correctly; no orphan terroir rows
  accrue going forward.

Roadmap currency: these three are feedback-backlog items, not roadmap entries, so no
`docs/product/roadmap.md` move is needed — but flip their backlog `Status: planned → shipped`
(remove the lines) and add ONE `docs/sprints/shipped.md` row for the combined write-path-hardening
sprint, all in the same PR.

`/simplify` pass before commit (per sprint cadence item 5) — especially the brew-import.ts branch.

## Open questions

- **#56:** does `persistBrew` already fetch the `green_bean_id` row anywhere upstream (e.g. for
  `roast_id` validation), so the terroir/cultivar FKs can be read from an existing fetch rather
  than a new query? Check before adding a query. If not, one scoped `select` is fine — locked
  call #2 stands either way.
- **#54:** confirm `z.preprocess` is the cleanest mechanism given the current zod version
  (the codebase is on zod 4.3.6 per the schema-compat shipped note); if preprocess interacts
  badly with the published-schema rewrite in [schema-compat.ts](../../lib/mcp/schema-compat.ts),
  an optional `op` field + `.transform` on the citation object is the fallback. Either is fine;
  pick whichever keeps `check:mcp` green.

## Completion handoff

When the work is done and merged, write a completion report to
`docs/sprints/write-path-hardening-completion.md` that:
1. **Restates the plan** so the report stands alone (the three items + the two locked design calls).
2. **Recaps what shipped per item** (#54 / #56 / #46), including any divergence from this brief
   and why (e.g. if #54 used `op`-field-+-transform instead of preprocess).
3. **Gives the PR URL + merge SHA** on main.
4. **Reports actual verification results** — what was run and seen (tsc / build / check:mcp /
   check:doc-links output; the #56 no-orphan-row assertion result; the #54 alias parse result),
   not "should work." Flag the #54 live-MCP check as deferred-to-fresh-session if it was.
5. **Flags anything deferred, surprising, or newly surfaced** (e.g. new friction the build
   exposed → route via `route-feedback`).

Then tell Chris the report is ready to bring back to a Claude Code session to close the loop:
flip the backlog items #54/#56/#46 `planned → shipped` (remove the lines), confirm the
`shipped.md` row, and `route-feedback` any new friction. Also: **#52 is already removed from the
backlog open list** (resolved-by-side-effect of the 2026-06-13 schema-compat ship) — its only
remaining step is a live re-verification in the next fresh Coordinator session; no build owed.
