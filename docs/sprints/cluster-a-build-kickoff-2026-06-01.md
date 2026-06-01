# Cluster A build — kickoff brief

Execution brief. The calls are grilled + Chris-ratified (2026-06-01); this is planned-execution, so the autonomy rule applies — branch, build, verify, PR, merge as one flow when each PR is green. Spec: [cluster-a-scaffold-spec-2026-06-01.md](cluster-a-scaffold-spec-2026-06-01.md). ADR: [0019](../adr/0019-lot-brew-web.md).

## Goal

Land the lot-brew cross-domain scaffold: the **brewing-to-roasting handoff brief** primitive across three workflows (simulated pourover / peer variant / optimized brew), plus the one net-new FK (`green_beans.optimized_brew_id`). Workflow-shaped, not data-model-shaped — most of the work is prompt + skill authoring.

## Scope

**IN:** the 4 PRs below. **OUT:** predicted-vs-actual / coffee-brief scoping / surface trio / cultivar arc (later tiers); the SPG cupping-row canonicalization (POD-1's job); root-doc compaction + the standalone claude.ai grilling review (Cluster B); any app UI for the peer variant (killed 2026-05-26 — lives in the Peer-Learning skill).

## PRs

**PR-A1 — schema + link (do first; the optimized-brew dogfood needs the column).**
- Migration NNN: `green_beans.optimized_brew_id uuid REFERENCES brews(id) ON DELETE SET NULL`, idempotent (`ADD COLUMN IF NOT EXISTS`), no auto-backfill. Carbon copy of [069](../../supabase/migrations/069_green_beans_peer_reference_brew.sql).
- `lib/types.ts` `GreenBean` += `optimized_brew_id: string | null`.
- `lib/mcp/push-green-bean.ts` + `lib/mcp/patch-green-bean.ts` Zod + Tool descriptions; `lib/roast-import.ts` `GreenBeanPayload` / `PatchGreenBeanPayload` / `GREEN_BEAN_PATCH_FIELDS` / `persistGreenBean` INSERT.
- Resolved view (`app/(app)/green/[id]/page.tsx`): `pickOptimizedBrew` prefers the explicit FK, heuristic as fallback.
- Backfill: **Chris supplies the per-lot optimized-brew mapping** → `patch_green_bean(optimized_brew_id)` per closed lot.
- Six-actor: 6 (schema/types/UI) + 4 (MCP — schema change to existing Tool, needs a fresh claude.ai session to re-handshake the catalog) + 1 (resolved render).

**PR-A2 — brewing prompts.**
- New `docs/prompts/simulated-pourover.md` — input: green bean via `get_green_bean`; output: simulated coffee brief + 1 initial recipe + handoff-back doc; **no iteration loop, no `push_brew`** (ephemeral).
- New `docs/prompts/peer-variant-completion.md` — shares `start-brew.md` front; strongly encourages (not requires) an Agtron + color read; emits the 5-field peer-variant handoff; sets `peer_reference_brew_id` if the green row exists, else records the pairing for start-lot.
- Edit `docs/prompts/bundled-brewing-completion.md` — add "include the pushed `brew_id` in the handoff doc."
- **Six-actor (recurring-miss watch):** the two new prompts are new `docs://` Resources → add `DOC_FILES` entries in `lib/mcp/docs.ts` AND confirm the glob in `next.config.js` `outputFileTracingIncludes['/api/mcp/**']` covers them; run `npm run check:mcp-bundle` (exits non-zero on a miss). This is the PR #65 / #164 failure pattern — do not skip.

**PR-A3 — roasting prompts + skills.**
- `docs/skills/cupping-specialist/SKILL.md` — SPG-kickoff trigger emits the thin packet (`green_bean_id` + finalist batch numbers + intent) conforming to `simulated-pourover.md`'s input contract. Keep it a few lines (Chris's bloat worry).
- `docs/prompts/start-lot.md` — peer-variant pickup step ("brewed a peer variant of this green? bring its handoff") + set deferred `peer_reference_brew_id` when creating the green row.
- `docs/prompts/close-lot.md` — read the optimized-brew handoff `brew_id`, set `optimized_brew_id`, ask-if-missing.
- `docs/skills/peer-learning-roasting-archivist/` cluster — consumption reasoning (weight by info-value, consult per lifecycle stage) + durable home for peer handoffs.

**PR-A4 — substrate (DONE in the grill; verify-only at build).** CONTEXT-shared + CONTEXT-roasting + ADR-0019 already landed this session. At build close: roadmap currency — move the three Cluster A items out of PRODUCT.md § Roadmap "top of the board," add `docs/sprints/shipped.md` rows.

## Opening dogfood (Chris has three live cases)

Run against PR-A1 + the new prompts as they land:
1. **Peer variant — Panama Janson Pacamara Natural.** Brew row exists; exercise `peer-variant-completion.md` retroactively (or just the handoff + link), set `peer_reference_brew_id`. Low-info case (47.9 Agtron) — good stress test of fields 2/3/5.
2. **Simulated pourover — two queued.** Exercise the full handoff: roasting thread → thin packet → brewing `simulated-pourover.md` → recipe back. *Caveat:* persisting the SPG cupping with `eval_method = 'Simulated Pourover'` depends on whether `eval_method` is free-text today (likely yes) vs POD-1 canonicalization — verify at push time, don't block the workflow test on it.
3. **Optimized brew — Chris points to each one.** After PR-A1, set `optimized_brew_id` per closed lot from Chris's mapping; confirm the resolved view prefers the FK over the heuristic.

## Manual Chris action (from the claude.ai grilling review — highest silent-drift risk)

Update **both** claude.ai project instructions to route to the new prompts: claude.ai/brewing needs `simulated-pourover.md` + `peer-variant-completion.md` + "brew_id in handoff"; claude.ai/roasting needs the start-lot / close-lot / cupping-specialist handoff-consumption steps. Prompt *content* reaches claude.ai via `docs://` Resources at session start; the routing *pointers* in the project instructions are hand-maintained.

## Verification

- `npx tsc --noEmit` (main repo) before push; `npm run build` if API routes / `lib/brew-import.ts` touched.
- `npm run check:mcp` (Tool count moved) + `npm run check:mcp-bundle` (new Resources traced).
- Resolved view: explicit `optimized_brew_id` wins over heuristic; legacy lots still render via fallback.
- End-to-end: each dogfood case writes the link + the resolved page renders it.

## Open questions

Effectively none — the data model, naming, link timing, prompt placement, and persistence are all ratified. The only at-build verification is the `eval_method` free-text-vs-canonical question in dogfood case 2.
