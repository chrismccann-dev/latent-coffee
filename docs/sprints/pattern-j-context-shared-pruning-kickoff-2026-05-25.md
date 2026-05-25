# Pattern J pruning sprint — CONTEXT-shared.md decomposition

**Date:** 2026-05-25
**Predecessor:** Item 5b calibration session (2026-05-25) — closed grilling-queue item 5b
**Successor:** Re-audit claude.ai surfaces → roasting calibration on cleaned substrate
**Sizing:** M (~3-5h Claude Code execution; mostly mechanical extraction + back-pointer stubs)
**Branch:** TBD at kickoff (suggest `claude/pattern-j-context-shared-pruning`)

## Goal

Extract the 4 over-scope operational subsections out of CONTEXT-shared.md into proper homes (sub-skill clusters / dedicated reference docs), leaving a thin glossary-only doc that fits under the new ADR-0014 session-load tier cap (40 KB).

## Why this sprint (calibration finding)

The 2026-05-25 brewing calibration session measured CONTEXT-shared.md at 319 KB - 8x over the new session-load cap from ADR-0014. The doc overflows claude.ai's per-tool-result inline cap (~200 KB) and gets spilled to disk on every session start. Result: every brewing/roasting session has been running without the shared glossary actually loaded into working context. The zone-split sprint (PR #244) was structurally correct but absorbed pre-existing operational content rather than distilling to glossary shape.

## Scope (in)

### Extract 4 operational subsections from CONTEXT-shared.md

| Subsection | Current size | Target home | Disposition |
|---|---|---|---|
| `### Synthesis Pipeline` | 108 KB | Likely **new dedicated reference** at `docs/reference/synthesis-pipeline.md` OR fold into CCIL cluster | Cross-domain operational reference; not glossary-shaped |
| `### Canonical Registries` | 77 KB | **Back-pointer doc** at `docs/reference/canonical-registries.md` pointing at `lib/*-registry.ts` + `docs/taxonomies/*.md` | Likely duplicative of existing registries; verify before extraction |
| `### MCP / Sync Architecture` | 66 KB | **Fold into SYNC_V2.md** (already the MCP infrastructure home) OR new `docs/reference/mcp-architecture.md` | Operational infrastructure; not glossary-shaped |
| `### WBC Reference Materials` | 66 KB | **Back-pointer doc** pointing at WBC Brewing/Roasting Archivist clusters (Wave 2 PR 1) | Likely duplicative of cluster content; verify before extraction |

### Distill remaining content to glossary shape

Sections to keep in CONTEXT-shared.md (~83 KB current):
- `## Relationships` (43 KB) — cardinality + relationships ARE glossary-shaped, keep
- `## Flagged ambiguities` (38 KB) — explicitly part of grilling-queue → glossary pipeline, keep
- `## Example dialogue` (2 KB) — keep

**Second-pass split likely needed** even after extraction: 83 KB > 40 KB session-load cap. Probable second-pass move: extract `## Flagged ambiguities` to a dedicated `docs/grilling-flagged-ambiguities.md` queue doc, keeping CONTEXT-shared.md to ~45 KB of pure language + relationships. Defer the second pass to a follow-up if the primary extraction lands cleanly.

### Update reference paths

Every `docs://context-shared.md` reference in CLAUDE.md / docs/prompts/*.md / docs/skills/coordinator/catalog.md / lib/mcp/docs.ts / etc. continues to point at the (now-thinner) shared doc. New extracted docs get their own `docs://` URIs registered in lib/mcp/docs.ts.

### Re-audit claude.ai surfaces after pruning

The brewing + roasting project Instructions reference `docs://context-shared.md` in step 3 of session-start. After pruning, the fetch still works but loads ~5-10x less substrate. Verify with a quick session-start fetch test before declaring the sprint done.

## Scope (out)

- Pruning of CONTEXT-roasting.md (108 KB, 2.7x over cap) and CONTEXT-brewing.md (59 KB, 1.5x over cap) — both over the session-load cap but defer to a follow-up sprint; this sprint focuses on the worst offender
- Brewing lifecycle redesign (claude.ai retrospective finding #5) — separate sprint
- start-brew.md continuation-fork (claude.ai #2) — small prompt edit, grilling-queue candidate
- ADR-0014 amendment itself — lands in same PR as this sprint's first commit

## Verification

- CONTEXT-shared.md < 50 KB after extraction (target 40 KB)
- All `docs://context-shared.md` references in CLAUDE.md / prompts / catalog / lib/mcp/docs.ts still resolve
- New extracted docs registered in lib/mcp/docs.ts + visible via `list_docs()`
- Smoke test: session-start fetch protocol loads all 4 docs inline (no spill)

## Success criteria

The 2026-05-25 brewing calibration measured baseline at 94 KB inline + 319 KB spilled. Post-pruning target: baseline ~94 KB inline + 0 KB spilled, with extracted operational docs available on-demand via specific cluster fetches when needed.
