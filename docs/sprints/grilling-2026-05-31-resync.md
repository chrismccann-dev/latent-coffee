# Resync grill — 2026-05-31 (record)

First item sequenced out of the capstone product-roadmap-review (2026-05-31). Pre-Cluster-A doc/glossary resync: drain the grilling-queue + doc-size tripwire review + XO-as-signature, so the Cluster A scaffold grill lands on synced ground. Grilling session — ask-don't-ship; outputs are CONTEXT/ADR/doc edits, no feature code or migration. Kickoff: [resync-grill-kickoff-2026-05-31.md](resync-grill-kickoff-2026-05-31.md).

Ratification queue walked first: empty (no prior ship to ratify).

## Decisions + landings

| Item | Outcome | Landed in |
|---|---|---|
| **42** per-surface mobile pattern | ADR — IA-first: one shared IA, mobile as forcing function; single-tree vs dual-subtree is the *implementation*, not a 2nd IA | `docs/adr/0018-per-surface-mobile-pattern.md` + "Mobile as forcing function (single shared IA)" term in CLAUDE.md § Design conventions + PRODUCT.md § Design System |
| **43** hero-tile reconciliation | Decided: hero cover → lifecycle `--tile-*` gradient (per state); in-content emphasis accents (amber drop-rules, lavender predicted-cup, green verdict) STAY. Two axes: hero = state, accent = task-salience | CLAUDE.md § Design conventions (lifecycle-tile note). Small `SspNamePlate` cover-rebind touch-up on 3 green detail views QUEUED |
| **39** residual "Pour step" | New **"Pour"** headword (not "Pour step" — "step" is code-only `PourStep` artifact) + Phase _Avoid_ reconciliation; Phase clarified as expansive grouping | CONTEXT-brewing.md |
| **36** strategy-zone anchoring | No action — confirmed first-class CONTEXT-brewing headwords; operational-guide absence is intended layering | — |
| **40** process skeleton / honey | Decided (exec queued): blank process content → skeleton/arbiter queue via derive-from-missing-overview, surfaced in `list_skeleton_entries`; honey = lightweight description map (persist when stated) | PRODUCT.md § Roadmap (taxonomy-fill side-quest expanded) |
| **35** drop-rules HUD | Triaged: 6.8 mitigated acute pain; residual HUD + deviation-attribution fold into predicted-vs-actual (not Cluster A) | re-graded READY→folded |
| **XO** | No work — already a signature canonical; brew `a116bb9c` correctly tagged `signature_method:'XO'`. Stale roadmap to-do dropped | PRODUCT.md roadmap (XO clause removed) |
| **tripwire** | CLAUDE.md 149KB (OVER by 29KB), PRODUCT.md 122KB (marginally over) — both self-descriptions were stale & corrected. Root-doc compaction sprint QUEUED (Cluster B) | CLAUDE.md § Standing tripwires + PRODUCT.md § Roadmap Cluster B |
| **37 + 38 + 5b** | Consolidated into the new **claude.ai grilling review** (3-part recurring check at every grill close) | `feedback_claude_ai_grilling_review.md` + MEMORY.md index + CLAUDE.md grilling-cadence pointer + PRODUCT.md Cluster B |
| **38, 41** | Re-confirmed OBSERVING, no action | grilling-queue (outstanding) |

## Queued follow-ups (execution, post-grill — NOT done in this grill)

1. **Green detail hero-tile rebind** (Item 43) — rebind the 3 `SspNamePlate` cover colors on the green detail views from per-surface emphasis (amber/lavender/green) to the lifecycle `--tile-*` token per state. Accents untouched. Small.
2. **Process-content arbiter-queue + honey map** (Item 40) — extend `list_skeleton_entries` to a process axis (derive blank = missing overview); add lightweight honey-subprocess description map + render path. Folds into the taxonomy-fill side-quest.
3. **Root-doc compaction/split sprint** (tripwire) — CLAUDE.md primary (extract per-page IA blocks → `docs/architecture/`) + PRODUCT.md + "what else moves out" review. Cluster B, interleaved.
4. **claude.ai grilling review** — the mini-session that finalizes the Item 37 paste-ready memory block + the 3-part check. Brief: [claude-ai-grilling-review-brief-2026-05-31.md](claude-ai-grilling-review-brief-2026-05-31.md).
5. **Cluster A scaffold grill-to-spec** — the next session in the chain. Brief: [cluster-a-scaffold-grill-to-spec-kickoff-2026-05-31.md](cluster-a-scaffold-grill-to-spec-kickoff-2026-05-31.md).

## Retro

**What worked.**
- Grep-first paid off three times: XO was already a signature (kickoff premise stale), the "Phase" term already deprecated "step" (Item 39 collision), and the tripwire figures were stale in the opposite direction the kickoff assumed (CLAUDE.md is the breach, not PRODUCT.md). All three would have produced wrong substrate if taken on faith.
- Decomposing Item 43 into *two layers* (hero cover vs in-content accents) dissolved a bless-vs-reconcile binary into a clean both-and. The operator's own framing ("the highlight points me to what matters") was the unlock.
- Consolidating 37 + 38 + 5b into one recurring "claude.ai grilling review" turned three loose watch-items into one durable protocol with a real trigger.

**What surprised us.**
- How stale the self-described doc sizes were — and stale in *both* directions (CLAUDE.md understated, PRODUCT.md overstated). The kickoff inherited the stale figures verbatim; only measuring caught it. Lesson: the doc-size tripwire review must *measure*, never trust the prose.
- Several "to-do" items were already done (XO signature, 6.8 drop-rules un-hiding, Item 39 schema shipped) — the queue had drifted ahead of reality. The grill is also a reconciliation pass, not just a decision pass.

**Do differently next time.**
- The claude.ai layer (instruction + memory) is the one surface Claude Code can't see or edit — it was the source of Item 37's invisible drift. The new standing rule (review it at every grill close) is the fix; make sure it actually fires.
- When a kickoff brief carries figures or premises ("~114KB", "make XO a signature"), treat them as claims to verify, not facts — even when the brief is freshly authored.

## Six-actor trace (this grill's edits)

All edits were Actor-5 (Claude Code docs) + Actor-6 (one PRODUCT.md roadmap/render-decision) writes; no schema/MCP/prompt changes this session. The queued follow-ups (hero rebind = Actor-6; process arbiter-queue = Actor-4 MCP + Actor-6) carry their own traces when executed. The Item 37 paste-ready block is the Actor-3 (claude.ai) write, deferred to the claude.ai grilling review.
