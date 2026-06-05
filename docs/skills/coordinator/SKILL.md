# Master Coordinator

**Tier:** Special (outside the 3-tier architecture)
**Wave:** 1 (paired with Brewing Equipment Expert as first ship)
**ADR origin:** [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](docs/adr/0012-master-coordinator-pattern.md)

## Job-to-be-done

Route the operator's intent (from a claude.ai prompt-driven session) to the right Workflow tier sub-skill from the 18-sub-skill enumeration. Lazy-load the dispatched sub-skill's `SKILL.md` + its knowledge cluster dependencies. Orchestrate cross-domain handoffs (e.g. Cupping Specialist Path A → Brewing Assistant for optimized brew dial-in → Close-Lot Specialist for resolved-lot completion).

## Inputs

- User intent (natural-language message from operator in a claude.ai session)
- Workflow context from the entry-point prompt (`start-lot.md`, `log-roast.md`, `start-brew.md`, `bundled-brewing-completion.md`, etc.)
- (Stage 2+ autonomy) System signals — e.g. "a new closed lot just landed; should we dispatch CCIL refresh?"

## Outputs

- Dispatch event = `{ sub_skill, knowledge_clusters_to_load, mcp_tools_in_scope, ...context }` — instructs the runtime to load the right artifacts and invoke the right sub-skill
- For cross-domain workflows: a sequenced dispatch chain (e.g. Cupping Specialist → Brewing Assistant → Close-Lot Specialist)

## Called by / Calls

- **Called by:** Operator (always entry point, via `docs/prompts/*.md` prompts loaded into claude.ai sessions) · System cron (Stage 2+ autonomy only)
- **Calls:** Any workflow sub-skill (lazy-load at dispatch time) · Any knowledge cluster (lazy-load when a planner needs it)

## MCP Tools in scope

None directly. Master Coordinator does not write substrate. The dispatched sub-skill's MCP Tools come into scope after dispatch.

## Self-improvement patterns

- **Pattern G — Catalog-update refresh:** new sub-skill ships → `catalog.md` + `dispatch-rules.md` + `handoff-rules.md` refresh via cross-system audit at sub-skill ship time
- **Pattern H — Dispatch-accuracy refresh:** operator overrides proposed dispatch → log tuple → `dispatch-rules.md` patches via periodic review

## Self-improvement signal

- Catalog audits gate every sub-skill ship (Actor 4 in 6-actor matrix)
- Dispatch-accuracy log review: when override rate < 10% across 3 quarters → consider Stage 1 → Stage 2 advancement on Pattern H specifically (NOT on Pattern G — catalog stays Stage 1 indefinitely)

## Cluster contents

- [`catalog.md`](docs/skills/coordinator/catalog.md) — the 18-sub-skill registry + brewing/roasting domain principles
- [`dispatch-rules.md`](docs/skills/coordinator/dispatch-rules.md) — intent → sub-skill mapping
- [`handoff-rules.md`](docs/skills/coordinator/handoff-rules.md) — cross-domain handoff dispatch paths

## Implementation notes

- **Wave 1 ships markdown-only.** Natural-language reasoning over the dispatch rules is sufficient until proven otherwise; code-backed dispatch (`lib/agents/coordinator.ts`) deferred to Wave 2+ if needed.
- **No `.claude/skills/coordinator/` entry.** Master Coordinator is invoked from claude.ai via prompts, not from Claude Code via slash commands.
- **MCP Resource registration:** every `docs/skills/coordinator/*.md` file MUST be registered in `lib/mcp/docs.ts` `DOC_FILES` AND covered by `outputFileTracingIncludes['/api/mcp/**']` in `next.config.js`. Run `npm run check:mcp-bundle` before shipping.
- **Catalog size discipline:** if `catalog.md` exceeds 30KB → propose splitting into domain shards (re-introduces BREWING.md + ROASTING.md domain layer that ADR-0011 deliberately collapsed). Wave 1 target: ~10-15KB.
