# KICKOFF — claude.ai grilling review (firing: post-2026-06-05 system-level grill)

**This is the recurring 3-part claude.ai grilling review** (protocol: [feedback_claude_ai_grilling_review](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_claude_ai_grilling_review.md)), fired because the 2026-06-05 session changed **claude.ai-facing substrate**. The claude.ai layer (project instructions + its own memory) is the one surface Claude Code can't see or edit, so it drifts silently — this is the periodic check. Cross-party by nature: Chris drives it *with* claude.ai (brewing + roasting projects).

## What triggered this firing

New claude.ai-readable substrate landed since the last review (2026-05-31):
- New `docs/reference/mcp-architecture.md` headwords (a `docs://` Resource claude.ai reads): **formalization tax**, **graduation threshold (N=3)**, **arbiter-shaped mechanism**, **prototype-as-input-not-canon**, the **six pruning shapes**, + the **self-improving skill loop** disambiguation.
- New ADRs 0020 (feedback pipeline) / 0021 (root-relative links) / 0022 (formalization tax) / 0023 (self-improving skill loop).
- A lot of other shipped substrate (doc-pruning arc, filter registry reconciliation, the CCIL re-architecture, log-cupping prune).

**Calibration note:** most of the *new* vocabulary is Claude-Code / build-process concepts, NOT brewing/roasting *workflow* concepts — so the likely finding is that claude.ai's workflow instructions do **not** need the new system-vocab. Confirm that rather than assume it. The higher-value parts of this firing are the **general currency sweep** (a lot shipped since 2026-05-31) and the **roasting context-window check** (right before the Lot Coordinator restructure rethinks the roasting surface).

## The 3-part protocol (run each)

1. **Memory + instruction currency.** Do claude.ai's brewing + roasting project instructions + its memory reflect the *current* substrate? Sweep for stale claims (the CCIL was re-architected; filters split owned/not-owned; log-cupping was pruned + a STAGE 0 sibling exists; "Inverted Temperature Staging" → "Thermal Staging"; the 4→5 lifecycle state). Land any corrections via the claude.ai memory chatbox ("Forget X. Remember Y." — it merges, never replaces).
2. **Cross-party claude.ai grill.** Grill claude.ai on a few live concepts to surface drift between what it *believes* and current substrate — roasting-emphasized (lifecycle truth, reference-roast designation, the extraction-strategy + modifier vocabulary the librarian audit just corrected: 6 strategies / 5 modifiers incl. Thermal Staging).
3. **Context-window usage check (roasting-emphasized).** Instrument a real roasting session; capture substrate-pull totals + observe scope creep against the ADR-0014 budget. Especially valuable now: it's the empirical input for the Lot Coordinator design (which exists *because* the single-session-per-lot model bloats context).

## Output

- claude.ai memory/instruction corrections (via the chatbox).
- A short record at `docs/sprints/grilling-2026-06-05-claude-ai-review.md` (per-firing record convention) — what drifted, what was corrected, the context-window numbers.
- Any substrate-side follow-ups → grilling-queue or issues.md.

This does NOT block the Lot Coordinator brainstorm — but doing it *before* that brainstorm gives you fresh roasting-context-window numbers to design against.
