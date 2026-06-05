# ADR-0021: Internal doc links are root-relative

**Date:** 2026-06-04 · **Status:** Accepted

## Decision

All internal markdown links in the repo resolve **relative to the repository root** (`docs/x.md`, `app/(app)/green/[id]/page.tsx`, `CONTEXT-roasting.md`), not relative to the containing file (`../../docs/x.md`).

## Context

Architecture-audit dogfood Session 4 ([04-doc-substrate.md](docs/audits/architecture/04-doc-substrate.md)) found the repo had **no single link convention** — two coexisted, split by author-era. Root-relative links dominate `docs/architecture/*`, `docs/sprints/*`, `docs/reference/*`; file-relative `../../` links dominate `docs/skills/` clusters. The result: 169 links that resolve fine for the Claude Code agent (cwd = repo root) but 404 on GitHub web, plus a recurring off-by-one `../` fragility in the 5-6-level-deep cluster tree. The absence of a *stated* convention (Session 4-F7: it was only implicit in CLAUDE.md's harness instruction) was itself the root cause of three downstream doc-rot candidates.

## Why root-relative

- **Matches the primary consumer.** The Claude Code agent — which navigates these docs every session — resolves links from cwd = repo root, per CLAUDE.md's own link instruction. claude.ai doesn't follow markdown links at all (it reads `docs://` MCP Resources). The substrate's two live readers are already root-relative or link-agnostic.
- **Eliminates the deep-`../` fragility.** Hand-authored `../../../../` at cluster depth is error-prone by construction and breaks on any tree reorg; root-relative paths are stable under moves.
- **Aligns the existing majority** — the architecture/reference/sprints docs already do this.

## Trade-off accepted

Root-relative links **404 when browsing files on GitHub web.** Accepted: Chris navigates via Claude Code + claude.ai, not GitHub's file browser. GitHub-web correctness is explicitly out of scope.

## Consequences

- `docs://` MCP Resource URIs are a separate, third address space (validated against `lib/mcp/docs.ts`, not the filesystem) — unaffected.
- Enforced by the spun-out `check:doc-links` gate (spec in Session 4), whose resolution base is repo-root and whose skip-list comes from Session 4's false-positive taxonomy.
- The file-relative minority (chiefly `docs/skills/` clusters) migrates to root-relative in the follow-up remediation sprint (Session 4 Candidates 1/3/4).
