# Master-doc transition plan: BREWING.md + ROASTING.md → ~500-byte redirect stubs

**Status:** Plan, not implementation. Wave-by-wave shrink schedule for the two master docs as their content migrates into sub-skill clusters. Ratifies the decisions locked in [ADR-0011](../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../adr/0012-master-coordinator-pattern.md).

## Starting state (2026-05-26 baseline)

| Doc | Size at brainstorm end | Contents in scope for migration |
|---|---|---|
| **BREWING.md** | 213KB (grew +7KB during this brainstorm session via PR #198) | 6 strategies + 4 modifiers + Two-Axis Framework + equipment reference + Cross-Coffee Insight Layer section + WBC reference (Section 4) + lessons-learned compounding |
| **ROASTING.md** | 147KB (grew +12KB during this brainstorm session via PR #200) | Counterflow methodology on Roest L200 Ultra + evaluation protocol + fan/inlet curves + FC marking protocol + per-bean experiment patterns + lot knowledge + roast-to-brew translation + cross-coffee insights section (parallel to BREWING.md's) |

**Both files are past the 120KB CLAUDE.md § Sprint cadence § Standing tripwires for ~2-3 weeks before this plan was authored. Both grew during the brainstorm itself. Compaction urgency is real and increasing.**

## End state (after Wave 4 cross-system sync)

Both files become ~500-byte redirect stubs:

```markdown
# BREWING.md

Content migrated to the composable sub-skills architecture per [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) (2026-05-26).

**Where to find what was here:**
- Brewing domain principles + strategy framing → `docs/skills/coordinator/catalog.md § brewing-domain-principles`
- 6 extraction strategies + 4 modifiers + Two-Axis Framework → `docs/skills/brewing-equipment-expert/cluster/` + per-strategy docs in `docs/skills/brewing-historian/cluster/patterns/by-strategy/`
- WBC reference (Section 4 + 8 strategy families + recipe corpus) → `docs/skills/wbc-brewing-archivist/cluster/`
- Cross-Coffee Insight Layer section → `docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md`
- Equipment reference → `docs/skills/brewing-equipment-expert/cluster/`

See `docs/skills/coordinator/catalog.md § brewing-domain` for the full per-sub-skill index.
```

Same shape for ROASTING.md, pointing at the roasting-side clusters.

## Wave-by-wave shrink schedule

### Wave 1 (Master Coordinator + Brewing Equipment Expert paired ship)

**BREWING.md delta:** Equipment-related content extracts into `docs/skills/brewing-equipment-expert/cluster/`. Specifically the existing 4 `docs/taxonomies/{brewers,filters,grinders,sworks}.md` files migrate (those are referenced from BREWING.md but live as separate files today; the references in BREWING.md become pointers to the cluster).

Estimated BREWING.md shrink: ~5-10KB (equipment cross-reference sections + scattered equipment guidance).

**ROASTING.md delta:** No content migration in Wave 1; only catalog reference added at top of file.

**Master Coordinator catalog gets:** Brewing Equipment Expert as first sub-skill entry; brewing + roasting domain principles populated (~1-2KB each absorbed from the two master docs' top sections).

### Wave 2 (4 consolidation ships: Brewing Historian + Roasting Historian + WBC Brewing + WBC Roasting Archivists)

**BREWING.md deltas:**
- Cross-Coffee Insight Layer section → migrates to `docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md` (Brewing Historian inherits this section per ADR-0011)
- WBC reference (Section 4 — 5-axis foundational map + 8 strategy families) → migrates to `docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md`
- WBC 102-recipe corpus → migrates to `docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md`
- Per-strategy patterns + cross-coffee learnings → migrates to `docs/skills/brewing-historian/cluster/patterns/`

Estimated BREWING.md shrink after Wave 2: ~60-80KB total (down from 213KB to ~130-150KB).

**ROASTING.md deltas:**
- Counterflow methodology + per-bean experiment patterns + lot knowledge → migrates to `docs/skills/roasting-historian/cluster/`
- Cross-coffee insights section (parallel to BREWING.md's) → migrates to `docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md`
- WBC roasting reference → migrates to `docs/skills/wbc-roasting-archivist/cluster/wbc-roasting.md` (existing `docs/roasting/wbc-roasting.md` moves into the cluster)
- WBC sourcing reference → migrates to `docs/skills/wbc-roasting-archivist/cluster/sourcing/` (existing `docs/roasting/wbc-sourcing.md` moves; tentatively merged with WBC Roasting per ADR-0011)

Estimated ROASTING.md shrink after Wave 2: ~60-80KB total (down from 147KB to ~70-90KB).

### Wave 3 (2 operator-stub clusters + 9 workflow tier sub-skills)

**BREWING.md deltas:** Minimal direct migration. Some equipment + brewing-method scattered prose may move to workflow planning sub-skills' notes (Brewing Assistant). Net shrink: ~5-10KB.

**ROASTING.md deltas:**
- Roest-specific content → migrates to `docs/skills/roest-knowledge/cluster/` (Wave 3 operator-stub ship)
- Peer-roaster references (e.g. Dongzhe content) → migrates to `docs/skills/peer-learning-roasting-archivist/cluster/` (Wave 3 operator-stub ship)
- FC marking protocol + evaluation protocol + fan/inlet curves + roast-to-brew translation → migrates to `docs/skills/roast-recorder/cluster/` or `docs/skills/cupping-specialist/cluster/` or distributes across workflow tier sub-skill clusters
- POD-1-relevant content (current Path C-1/C-2 prose + simulated-pourover hints) → migrates to `docs/skills/cupping-specialist/cluster/` (POD-1 absorbed)

Estimated ROASTING.md shrink after Wave 3: ~30-50KB total (down to ~40-50KB).

### Wave 4 (CCIL + cross-system sync)

**BREWING.md:** Final residual content migrates to CCIL (`docs/skills/ccil/cluster/`) for any cross-domain pattern docs that emerged from the Brewing Historian's content. Stub redirect lands at end of Wave 4.

**ROASTING.md:** Final residual content migrates to CCIL or remaining sub-skill clusters. Stub redirect lands at end of Wave 4.

**End-state size target:** ~500 bytes each (redirect stub only).

## Per-wave acceptance gates

Each Wave's PR includes the master-doc shrink delta as part of its cross-system audit:

- **Actor 6 (substrate):** verify content moved to its target cluster, NOT deleted
- **Actor 4 (MCP Resources):** verify new cluster docs registered in `lib/mcp/docs.ts` `DOC_FILES`; verify `outputFileTracingIncludes['/api/mcp/**']` in `next.config.js` covers the new paths (`npm run check:mcp-bundle` passes)
- **Actor 5 (Claude Code / CLAUDE.md):** verify CLAUDE.md docs-index sections for the migrated content point at new locations
- **Actor 2 (prompts):** verify `docs/prompts/*.md` files referencing the migrated content point at new locations
- **Actor 3 (claude.ai):** trust that session-start MCP Resource catalog refresh picks up new paths (per [feedback_claude_ai_memory_merge_only](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_claude_ai_memory_merge_only.md): substrate-fetched-live shape means stale memory is functionally inert)
- **Actor 1 (operator):** verify rendered behavior is unchanged or improved — content still findable, no broken references

## Risk: content loss during migration

The two master docs are dense and intricately cross-referenced. Migration risk = content getting deleted instead of moved, or losing context that was implicit in the doc's flow.

**Mitigation:**
- Each Wave's PR includes a `git diff` review of the master-doc shrink to confirm every deleted line lands somewhere in the new cluster docs
- BREWING.md + ROASTING.md `git history` is preserved (these files don't get deleted; they shrink in place and become redirect stubs at Wave 4 end-state)
- The redirect stubs explicitly enumerate where each former section now lives — a forward-reference safety net

## Risk: BREWING.md / ROASTING.md keep growing during migration

The arbiter pipeline (PR #198 + #200 from 2026-05-26 are recent examples) continues to add content to BREWING.md + ROASTING.md while migration is in progress. If the rate of additions exceeds the rate of migration, the files won't shrink.

**Mitigation:**
- During Wave 2-4 implementation, route NEW content directly to sub-skill clusters via the new architecture, NOT to BREWING.md / ROASTING.md
- The arbiter playbook ([ARBITER.md](../../ARBITER.md)) updates as part of Wave 2 implementation to direct new proposals to the appropriate sub-skill cluster instead of the master docs
- Existing pending arbitration queues are processed under the old destinations through the end of Wave 1; new queue entries from Wave 2 onward target sub-skill clusters

## Cross-references

- [ADR-0011](../adr/0011-composable-sub-skills-architecture.md) — the architectural decision driving this migration
- [ADR-0012](../adr/0012-master-coordinator-pattern.md) — Master Coordinator catalog absorbs domain principles from the master doc tops
- [docs/skills/coordinator/catalog.md](../skills/coordinator/catalog.md) — the unified catalog that supersedes per-domain master docs
- [ARBITER.md](../../ARBITER.md) — needs updating in Wave 2 to route new doc proposals to sub-skill clusters
