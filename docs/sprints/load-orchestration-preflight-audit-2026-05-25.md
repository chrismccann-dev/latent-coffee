# Pre-flight audit — Load orchestration sprint

**Sprint:** Load orchestration (per [Load orchestration handoff spec](#) authored 2026-05-25 in a clean claude.ai thread; pressure-tested by Chris + Claude Code before this audit)
**Date:** 2026-05-25
**Status:** Audit complete; resolution table below drives PRs B + C.
**Predecessor:** Pattern J pruning sprint (PR #247, 2026-05-25). The Pattern J extraction moved `Qualifier` + `Canonical Registries` term homes from CONTEXT-shared.md to `docs/reference/`; references that already use the new paths are correctly on-demand.
**Output:** per-prompt match list with classification (a) convert to `read_doc_section` / (b) move inline / (c) decorative-leave-or-strip, plus Change-2 anchor readiness check and Change-5 catalog-consumer survey.

## Scope

Two grep patterns per the spec's pre-flight call:
1. **Prose anchor references** — `CONTEXT-roasting.md §` / `CONTEXT-brewing.md §` / `CONTEXT-shared.md §` in prompt prose.
2. **Glossary-resident assertions** — phrasings asserting the glossary is already in working context (`already has` / `in project context` / `don't re-explain`).

Plus two implementation-readiness checks the spec asked for:
3. **Change 2 readiness** — verify the brewing operational-guide's section anchors are clean and map to start-brew's STAGE boundaries.
4. **Change 5 catalog-consumer survey** — confirm whether the Master Coordinator catalog has genuine consumers beyond close-lot proposal routing.

## Findings: glossary-resident assertion

**Only one prompt carries an explicit residency assertion.**

| Prompt | Line | Text | Action |
|---|---|---|---|
| `docs/prompts/start-lot.md` | 9 | `When the file ships, claude.ai already has the CONTEXT-{roasting,brewing,shared}.md glossary family in its project context - don't re-explain.` | **REWRITE in PR C.** Drop the second sentence entirely. Keep the first sentence (`Vocabulary used in this prompt is defined in CONTEXT-roasting.md (V-set, batch slot, experiment frame, variable, lever, taste-for, leading slot, reference roast, adjustment).`) — it functions as a quick-orientation pointer enumeration, not a residency claim. |

No other prompt asserts residency. The other roasting prompts' opening lines (`log-roast.md:7`, `log-cupping.md:11`, `close-lot.md:7`, `one-shot.md:9`, `one-shot-closeout.md:9`) use the `Vocabulary used in this prompt is defined in CONTEXT-roasting.md (...)` enumeration pattern WITHOUT the "already has... don't re-explain" addendum. The enumeration alone is residency-neutral and stays.

## Findings: prose anchor references

**All anchor references are decorative — the prompts carry the load-bearing rule inline.** Classified (c) leave-as-pointer across the board. Read each context to confirm: in every case the surrounding prompt prose conveys the operational rule sufficient to make the decision; the `See CONTEXT-roasting.md § X` cite is a footnote pointing at the canonical-definition home, not a load instruction.

### log-roast.md

| Line | Reference | Context | Action |
|---|---|---|---|
| 81 | `See CONTEXT-roasting.md § FC audibility state.` | Prompt enumerates 5 enum values + protocol-stack consequence in surrounding prose. | (c) — leave as decorative pointer. Cite is not load-bearing. |
| 103 | `See CONTEXT-roasting.md § Reference candidate § Timing convention.` | Prompt explains the timing rule inline (`set exclusively in log-cupping.md STAGE 3 after the V_n leading slot is identified on cup grounds, never at roast-time`). | (c) — leave. |
| 107 | `See CONTEXT-roasting.md § Maillard % § Computation rule on did_not_fire batches.` | Prompt explains the rule inline (`Maillard % MUST NOT be computed... record 'Maillard % N/A (FC did not fire)' instead`). | (c) — leave. |

### log-cupping.md

| Line | Reference | Context | Action |
|---|---|---|---|
| 11 | `Cross-cutting infrastructure terminology in CONTEXT-shared.md (glossary index — operational vocabulary lives in dedicated reference docs at docs/reference/mcp-architecture.md / canonical-registries.md / wbc-materials.md / synthesis-pipeline.md per the 2026-05-25 Pattern J pruning sprint; pull via read_doc when a specific term needs validation).` | Already correctly notes on-demand pulls post Pattern J. The phrasing is residency-neutral. | (c) — leave. No edit needed. |
| 110 | `(Phase 2 / Item 13 audio elaboration / 2026-05-24, see [CONTEXT-roasting.md § Rest-days drift]...)` | Prompt explains within-V-set vs cross-V-set drift inline (~3 paragraphs of operational rule). | (c) — leave. |
| 111 | `deprecated as a primary evaluation per CONTEXT-roasting.md § Reference cup` | Brief decorative cite; eval-method rule is inline. | (c) — leave. |
| 164 | `See CONTEXT-roasting.md § Reference candidate § Timing convention.` | Same rule as log-roast.md:103; prompt explains inline. | (c) — leave. |
| 176 | `see [CONTEXT-roasting.md § Simulated pourover gate] for the full definition` | SPG operational rule covered inline at line 225 (`V_n leading slot's identity (or the lot's reference-roast call) is provisional pending a simulated-pourover cup brewed on the real pourover setup`). | (c) — leave. |
| 187 | `Declaring roasts.is_reference = true is the load-bearing cross-domain workflow-transition gate (see [CONTEXT-roasting.md § Reference roast])` | Prompt explains the gate inline (`it transitions the lot from roasting-side iteration to brewing-side optimized-brew dial-in. The declaration must be definite, not ambiguous.`). | (c) — leave. |
| 225 | `See [CONTEXT-roasting.md § Simulated pourover gate] for the full vocabulary.` | Same SPG ref as line 176. | (c) — leave. |

### close-lot.md

| Line | Reference | Context | Action |
|---|---|---|---|
| 7 | `Cross-zone vocabulary lives in CONTEXT-shared.md (glossary index) — Qualifier + Canonical Registries terms now live in docs/reference/canonical-registries.md per the 2026-05-25 Pattern J pruning sprint; pull via read_doc when needed.` | Already correctly notes on-demand pulls post Pattern J. Residency-neutral. | (c) — leave. No edit needed. |
| 142 | `(aggregation stays at the [Anaerobic] modifier per docs/reference/canonical-registries.md § Qualifier).` | Already targets the correct on-demand home (post Pattern J). | (c) — leave. No edit needed. |

### one-shot.md

| Line | Reference | Context | Action |
|---|---|---|---|
| 113 | `See CONTEXT-roasting.md § Recipe (aggregate noun for design intent) for the three-way asymmetry (recipe / Roest profile / curve-shape names).` | Prompt explains recipe vs Roest profile distinction inline (full paragraph). | (c) — leave. |
| 186 | `See CONTEXT-roasting.md § FC audibility state + § Maillard %.` | Both rules explained inline (`fc_audibility` 5-value enum + `Maillard % N/A (FC did not fire)`). | (c) — leave. |
| 193 | `see CONTEXT-roasting.md § Reference candidate § Timing convention` | Same as log-roast.md:103 / log-cupping.md:164. | (c) — leave. |

### one-shot-closeout.md

| Line | Reference | Context | Action |
|---|---|---|---|
| 38 | `See [CONTEXT-roasting.md § Reference roast § Cross-domain workflow-transition gate] for the cross-domain transition framing` | Prompt explains the cross-domain transition inline (`declaring is_reference = true still triggers the brewing-side workflow transition on one-shots`). | (c) — leave. |

### bundled-brewing-completion.md

| Line | Reference | Context | Action |
|---|---|---|---|
| 71 | `aggregation stays at the [Anaerobic] modifier per docs/reference/canonical-registries.md § Qualifier` | Already targets the correct on-demand home (post Pattern J). | (c) — leave. No edit needed. |

### Brewing-side anchor-ref count: zero

`start-brew.md`, `log-brew.md`, `propose-doc-changes-from-brew.md` contain **no `CONTEXT-* §` prose anchor references whatsoever**. The brewing chatbox strip (Change 1) ships **without companion prompt edits**. Clean.

## Findings: Change 2 anchor readiness (brewing operational-guide)

**Anchors are clean.** [operational-guide.md](../skills/brewing-assistant/cluster/operational-guide.md) sections:

| Anchor | Line | Purpose |
|---|---|---|
| `## Step 1 — Coffee Brief` | 9 | Workflow brief phase |
| `### Axis 1 — Extraction Strategy` | 65 | Sub-section of Step 1 |
| `### Axis 2 — Modifier check` | 82 | Sub-section of Step 1 |
| `### Named considerations` | 91 | Sub-section of Step 1 |
| `## Step 2 — Recipe Output` | 99 | Recipe output phase |
| `### Output Format` | 105 | Sub-section of Step 2 |
| `## Step 3 — Iteration Loop` | 133 | In-thread iteration |
| `## Step 4 — Resolved Brew Output Format` | 172 | Log-time resolved output |

These map exactly to the spec's proposed section pulls:
- **At brief (Phase 1):** `read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md", anchor="step-1-coffee-brief")` + `..., anchor="step-2-recipe-output")` to construct the starting recipe.
- **At iteration (Phase 2):** `read_doc_section(..., anchor="step-3-iteration-loop")` only when the operator returns with tasting notes.
- **At log/resolve (Phase 3):** `read_doc_section(..., anchor="step-4-resolved-brew-output-format")` only when producing the final resolved brew.

Anchor drift risk: low (anchor names are stable + load-bearing). The spec's `list_doc_sections` fallback recommendation still applies as defense-in-depth but isn't blocking.

**Size note:** the operational-guide is **49.5 KB** (290 lines) — 2x the spec's stated ~22 KB estimate. Change 2's section split is **more valuable than the spec assumed**; the full-pull waste was bigger than diagnosed.

## Findings: Change 2 follow-up — operator-guide split-check

The spec's split-check ("confirm operator-guide's contents are actually used at session start, not only later") surfaces real candidates. [operator-guide.md](../skills/coordinator/operator-guide.md) sections (159 lines / under-budget for the resident exemption):

| Section | Line | Resident? | Reasoning |
|---|---|---|---|
| `## Schema model — roasting redesign` | 11 | **Split candidate** | Schema-write reference; only needed at canonical-validation / write moments, not session start. |
| `## Canonical taxonomy lookups (live via MCP)` | 39 | **Split candidate** | Per the spec — only needed once the coffee is named (i.e. canonical-validation moment). Section-pull candidate. |
| `## Working with the Latent MCP server` | 71 | **Resident** | Every-session mechanics. Earns exemption. |
| `## Per-Coffee Threads (claude.ai workflow)` | 82 | **Resident** | Workflow framing; every-session. |
| `## How to start a new session` | 88 | **Resident** | Cold-start convenience; every-session. |
| `## Session debrief paste template` | 112 | **Split candidate** | End-of-session only; not session-start. |
| `## Cross-references` | 159 | **Resident** | Pointer table; every-session. |

**Three sections (Schema model / Canonical lookups / Session debrief) are split candidates.** Surfacing as a deferred follow-up — NOT in scope for this sprint, but consistent with the spec's principles. If a future cleanup pass wants to tighten the operator-guide exemption further, these are the three sections to extract / make on-demand. The spec's canary discipline ("if a future change proposes a second resident doc on the same reasoning, audit the operator-guide exemption first") would naturally surface this work.

**Recommendation:** defer to a follow-up sprint after PRs B + C land. The pre-flight audit closes the spec's explicit checklist; this is opportunistic surfacing.

## Findings: Change 5 catalog-consumer survey

The spec's question: "is the catalog's job genuinely cross-domain routing, or has it accreted into a general index that earns its keep elsewhere too?"

**Catalog `read_doc` / link references across all prompts:**

| Prompt | Line | Consumer type | Earns its keep? |
|---|---|---|---|
| `start-brew.md` | 1-2 | Session-start fetch ("identify available knowledge clusters") | **NO** — Change 3 target. Operational-guide is the actual brewing manifest; the catalog adds nothing for a single-user brew. Remove. |
| `bundled-brewing-completion.md` | 46 | Session-start fetch (Layer-2 duplication of start-brew) | **NO** — Change 3 target. Remove. |
| `start-lot.md` | 145 | Cluster-path lookup for `<lot-slug>` convention | **BORDERLINE** — the prompt offers `list_docs(prefix="skills/roasting-historian/cluster/active-lots/")` as the alternative immediately preceding this line. The catalog reference is backup, not load-bearing. **Rewrite to lean on `list_docs`**, drop the catalog cite. |
| `close-lot.md` | 153 | Proposal routing — "identify the right cluster home for each insight" | **YES** — genuine cross-domain consumer. Change 5 keeps it pullable here, with inline trigger note. |
| `one-shot-closeout.md` | 113 | Proposal routing — mirrors close-lot | **YES** — genuine cross-domain consumer. Same treatment as close-lot. |

**Sharpened finding for Change 5:** the catalog has **two confirmed cross-domain consumers** (close-lot.md:153 + one-shot-closeout.md:113 — both proposal-routing-at-lifecycle-close). Plus one borderline case (start-lot.md:145) that should be rewritten to use `list_docs` directly. After PRs B + C the catalog should be:

- **Session-start (brewing chatbox):** removed entirely (Change 3).
- **Session-start (roasting chatbox):** removed entirely (Change 5 chatbox half).
- **Mid-workflow (start-lot.md:145):** removed, replaced by `list_docs` lookup.
- **At lifecycle close (close-lot.md STAGE 5 + one-shot-closeout.md STAGE 5):** kept pullable with **inline trigger note** documenting why the fetch lives here and only here. The Chris-suggested wording from the spec: `"Catalog fetch lives here because cross-domain proposal routing is the one moment in roasting where intent is genuinely ambiguous. Do not promote to session-start; do not duplicate at other stages."`

Brewing has zero genuine catalog consumers post-Change 3. The Cupping Specialist Path A handoff (Chain 1) does NOT route through start-brew's catalog fetch — it routes through the operator-guide's Per-Coffee Threads framing.

## Resolution table — what ships in PR B vs PR C

### PR B (brewing side)

**Repo edits:**
- **Change 2:** Convert `start-brew.md`'s single full `read_doc(uri="docs://skills/brewing-assistant/cluster/operational-guide.md")` into 3 stage-keyed `read_doc_section` calls (Step 1 + Step 2 at brief; Step 3 at iteration; Step 4 at log/resolve).
- **Change 3 (repo half):** Remove the duplicate catalog fetch from `start-brew.md:1-2`. Remove the catalog fetch from `bundled-brewing-completion.md:46`.

**Chatbox edits (Chris-applied in claude.ai UI):**
- **Change 1:** Remove `read_doc(uri="docs://context-brewing.md")` + `read_doc(uri="docs://context-shared.md")` from brewing project instructions session-start sequence.
- **Change 3 (chatbox half):** Remove the unconditional Coordinator catalog fetch from brewing project instructions session-start sequence.

**No brewing prompt edits required for the chatbox strip** — brewing prompts contain zero `CONTEXT-* §` anchor refs and zero residency assertions.

### PR C (roasting side)

**Repo edits:**
- **Change 4 (repo half):** Rewrite `start-lot.md:9` — drop the second sentence (`When the file ships, claude.ai already has the CONTEXT-{roasting,brewing,shared}.md glossary family in its project context - don't re-explain.`). Keep the first-sentence vocabulary enumeration.
- **Change 5 (repo half):**
  - Rewrite `start-lot.md:145` — replace the Master Coordinator catalog backup-cite with the `list_docs` alternative the prompt already proposes.
  - Add inline trigger note to `close-lot.md` near line 153 (and the equivalent in `one-shot-closeout.md` near line 113) documenting why the catalog fetch lives at proposal-routing time and only there. Suggested wording from the spec: `"Catalog fetch lives here because cross-domain proposal routing is the one moment in roasting where intent is genuinely ambiguous. Do not promote to session-start; do not duplicate at other stages."`

**Chatbox edits (Chris-applied in claude.ai UI):**
- **Change 4 (chatbox half):** Remove `read_doc(uri="docs://context-roasting.md")` + `read_doc(uri="docs://context-shared.md")` from roasting project instructions session-start sequence.
- **Change 5 (chatbox half):** Remove the unconditional Coordinator catalog fetch from roasting project instructions session-start sequence.

**No edits to the (c)-classified anchor refs** — all CONTEXT-roasting.md § citations across log-roast.md / log-cupping.md / one-shot.md / one-shot-closeout.md are decorative footnote-style pointers. The prompts carry the load-bearing rule inline; the citations remain as reader-facing source pointers and never trigger a fetch.

## Deferred follow-ups (not in scope)

- **Operator-guide split** — 3 candidate sections (Schema model / Canonical lookups / Session debrief) could be extracted to tighten the resident exemption further. Defer until lived practice surfaces friction at the resident size, or until a future cleanup pass proposes a second resident-doc exemption (which would trigger the canary).
- **Anchor-drift validation** — the spec recommends a `list_doc_sections` fallback pattern. Defer to PR B's Change 2 implementation; if anchor drift bites during testing, add the fallback then. Otherwise the clean-anchor finding above is sufficient.
- **Pattern J reference docs (`docs/reference/*.md`) + `docs/grilling-flagged-ambiguities.md`** — already correctly on-demand by construction; no edit needed. Worth a one-liner in the post-sprint CLAUDE.md update so a future cleanup pass doesn't accidentally promote them.

## Implementation gate

PRs B + C are ready to draft. Brewing side has the smaller blast radius (zero prompt edits required); recommend B first to validate the chatbox-strip + prompt-edit coordination pattern, then C with confidence.
