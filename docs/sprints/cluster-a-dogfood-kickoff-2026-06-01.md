# Cluster A — dogfood + A2/A3 prompt authoring (kickoff)

Execution session. Cluster A was grilled to spec and PR-A1 shipped; this session runs the live dogfood and authors the A2/A3 prompts/skills the dogfood shapes. The spec calls are ratified, so the autonomy rule applies for mechanical work — but A2/A3 *prompt wording* is interpretive: let the live cases shape it and surface drafts before finalizing.

## What already shipped (read these first)
- **Spec:** [docs/sprints/cluster-a-scaffold-spec-2026-06-01.md](cluster-a-scaffold-spec-2026-06-01.md) — the full three-workflow design + the unifying "brewing-to-roasting handoff brief" primitive.
- **Decision:** [ADR-0019](../adr/0019-lot-brew-web.md) — the lot brew-web (two sibling FKs over heuristic/join-table).
- **Glossary:** CONTEXT-shared § Cross-domain Workflow ("Brewing-to-roasting handoff brief") + § Relationships (brew-web); CONTEXT-roasting § Peer-roasted reference brew (Information value + Peer-variant handoff) + § Optimized brew (optimized_brew_id link).
- **PR-A1 (merged):** `green_beans.optimized_brew_id` FK (migration 075) + FK-hinted brews↔green_beans embeds. Live on main.

## ⚠️ Standing tripwire (memory/feedback_postgrest_multi_fk_embed.md)
`brews ↔ green_beans` now has **three** FKs (`green_bean_id` forward, `peer_reference_brew_id` + `optimized_brew_id` reverse). Every PostgREST embed across that pair MUST carry an explicit FK hint (`green_beans!green_bean_id` / `brews!green_bean_id`) — a bare embed throws `PGRST201` and silently empties `/brews` + `/green` + the brew MCP reads. Do not write a bare cross-table embed, and FK-hint proactively if you add any new green_beans↔brews FK.

## This session's work

### 1. Optimized-brew backfill (dogfood)
Chris names each closed lot + which brew is its optimized brew (coffee names are enough). Resolve UUIDs via MCP (`get_green_bean` / `list_recent_brews`), then `patch_green_bean(green_bean_id, optimized_brew_id)`. Verify the resolved `/green/[id]` page now resolves the optimized brew via the FK — the resolved view's `pickOptimizedBrew` prefers `green_beans.optimized_brew_id` over the legacy `roast_id === best_roast_id` heuristic.

### 2. Peer variant — Panama Janson (dogfood, low-info case)
Peer brew row: `24b39678-903d-4ebb-a5e9-e8fcb51d3c44` (Panama Janson Pacamara Natural (Hacienda 491), roaster Untold Coffee Lab, whole-bean Agtron 47.9, visibly oily — the "dark roast overtakes everything → low information value" case). Set `green_beans.peer_reference_brew_id` for the matching green lot. **If that green lot has no Latent row yet (it's inventory-only)**, this exercises the deferred-link path: don't skeleton it — record the pairing and let `start-lot.md` set the FK when the lot is created. Walk the 5-field peer-variant handoff (pairing+provenance / info-value rating / bean-vs-roast split / roast-design takeaway / discount list).

### 3. Simulated pourover (dogfood — Chris has two queued)
Exercise the handoff loop: roasting thread emits a thin packet (`green_bean_id` + finalist batch numbers + intent) → a brewing thread runs `simulated-pourover.md` → returns a recipe handoff. **Open question to settle at push time:** does `cuppings.eval_method` accept `'Simulated Pourover'` as free-text today, or does it wait on the POD-1 canonicalization? Find out empirically; don't block the workflow test on it.

### 4. Author A2 / A3 (shaped by the dogfood above)
**A2 — brewing prompts:**
- New `docs/prompts/simulated-pourover.md` — input: a green bean via `get_green_bean`; output: simulated coffee brief + ONE initial recipe + handoff-back doc; **no iteration loop, no `push_brew`** (ephemeral).
- New `docs/prompts/peer-variant-completion.md` — shares `start-brew.md` front; strongly encourages an Agtron + color read (not required); emits the 5-field handoff; sets `peer_reference_brew_id` if the green row exists, else records the pairing for start-lot.
- Edit `docs/prompts/bundled-brewing-completion.md` — add "include the pushed `brew_id` in the handoff doc" (so close-lot can link `optimized_brew_id`).

**A3 — roasting prompts + skills:**
- `docs/skills/cupping-specialist/SKILL.md` — thin SPG-kickoff trigger that emits the packet (keep it a few lines — roasting-side context-bloat is the operator's stated worry).
- `docs/prompts/start-lot.md` — peer-variant pickup step ("brewed a peer variant of this green? bring its handoff") + set the deferred `peer_reference_brew_id`.
- `docs/prompts/close-lot.md` — read the optimized-brew handoff `brew_id`, set `optimized_brew_id`, ask-if-missing.
- `docs/skills/peer-learning-roasting-archivist/` cluster — consumption reasoning (weight by info-value, consult per lifecycle stage) + durable home for the peer handoffs.

**⚠️ Six-actor (recurring-miss watch):** the two new `docs/prompts/*.md` are new `docs://` Resources → add `DOC_FILES` entries in `lib/mcp/docs.ts`, confirm the glob in `next.config.js` `outputFileTracingIncludes['/api/mcp/**']` covers them, and run `npm run check:mcp-bundle` (exits non-zero on a miss). This is the PR #65 / #164 failure pattern.

## Manual Chris action (do not skip)
Update **both** claude.ai project instructions: claude.ai/brewing needs to route to `simulated-pourover.md` + `peer-variant-completion.md` + "brew_id in handoff"; claude.ai/roasting needs the start-lot / close-lot / cupping-specialist handoff-consumption steps. Prompt *content* reaches claude.ai via `docs://` Resources at session start; the routing *pointers* in the project instructions are hand-maintained. (This is the one surface Claude Code can't see or edit.)

## Verification
- `npx tsc --noEmit` (main repo `/Users/chrismccann/latent-coffee`, or symlink `node_modules` into the worktree). `npm run build` if API routes / `lib/brew-import.ts` touched.
- `npm run check:mcp-bundle` after adding the new `docs://` Resources; `npm run check:mcp` if a Tool count moves (none expected).
- After the optimized-brew backfill, load `/brews` AND `/green` (the PostgREST tripwire — exercise the embed surfaces, not just the page the code touched) and the resolved `/green/[id]` to confirm the FK path.

## Branch
Off latest `main` (includes PR-A1 #339 + the embed hotfix #340). New PRs decompose as: dogfood patches (data only) / A2 brewing prompts / A3 roasting prompts+skills.
