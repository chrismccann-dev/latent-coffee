# Roest API — Read Surface

Roest API read endpoints used by Latent MCP server. Knowledge anchor for Roast Recorder + Roest API Worker (Workflow tier sub-skills, Wave 3 PRs 2-3); they execute the calls, this doc holds the *knowledge* of how the API behaves.

Operator-stub scope per [Roest Knowledge SKILL.md](../../SKILL.md) — Chris-stubbed-Claude-integrates pattern. Today's content seeded from Sprint 2.5 (Roasting MCP + ROASTING.md) + Sprint 2.7.5 (workflow walkthrough + Roest API write dogfood) + Roest API write Phase 1+2 (2026-05-06). Patterns A + B (substrate-event + external-event refresh) flow content here as new endpoints land or behavior drifts.

---

## Endpoints in scope

| Endpoint | Latent MCP Tool / Resource | Implementation |
|---|---|---|
| Roest log fetch (per-roast time-series + summary) | `pull_roest_log` Tool | [lib/mcp/pull-roest-log.ts](../../../../../lib/mcp/pull-roest-log.ts) |
| Roest inventory list (read all green-lot inventory rows) | `list_roest_inventory` Tool | [lib/mcp/](../../../../../lib/mcp/) (handler colocated with write surface) |
| Roest log index (paginated index of all roast logs) | `list_roest_logs` Tool | [lib/mcp/](../../../../../lib/mcp/) (handler colocated with write surface) |

---

## Authentication + auth state

Bearer-token auth on the Roest API side; Chris's token loaded via env var at request time. See SYNC_V2.md for the full auth chain.

---

## Behavioral notes

Today: placeholder. Pattern A refresh expected as Chris accumulates same-endpoint anomalies across roasts (e.g. log-fetch retry patterns, inventory-list pagination quirks). Pattern B refresh expected at Roest firmware updates that change the read surface shape.

For per-endpoint pagination + response-shape detail beyond what `lib/mcp/pull-roest-log.ts` documents inline, this doc's first sustained authoring happens when Chris next surfaces an observation worth folding.

---

## Cross-links

- [cluster/api/write-surface.md](write-surface.md) — Roest API write endpoints (profile push + inventory write).
- [cluster/api/quirks.md](quirks.md) — observed API quirks (drift, retry patterns, edge cases). Placeholder today.
- [SYNC_V2.md](../../../../../SYNC_V2.md) — full MCP transport / auth / Resources / Tool catalog.
