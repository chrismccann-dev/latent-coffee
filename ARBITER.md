# Doc Proposal Arbiter Playbook

This file is the standalone playbook a Claude Code session loads when Chris says **"process pending arbitration"** (or any of the aliases below). It covers two queues now — **prose proposals** in `doc_proposals` and **canonical promotions** in `taxonomy_overrides_queue` (Phase 3, migration 045). One Claude Code session walks both.

If you're a future Claude session reading this for the first time: this is the same shape as how PRODUCT.md gets updated at the end of every sprint — Chris says "do the thing" and you read state, present diffs, get approval, edit files, commit, PR, merge. Two staging tables; one arbiter procedure.

---

## When to use

**Trigger phrase:** "process pending arbitration" (or anything functionally equivalent — "process pending doc proposals", "arbitrate", "apply pending docs", "review the proposal queue", "review canonical proposals", "process pending taxonomy queue"). All trigger phrases route to the same playbook; the playbook checks BOTH tables.

**Cadence:** Batched. Chris aggregates proposals across Claude.ai sessions and processes them in one Claude Code session. Don't expect to run this in real-time after a single proposal.

**Pre-conditions:**
- Worktree on a fresh branch (per Chris's per-sprint convention). If on `main`, create a branch first: `git checkout -b claude/<adjective-name-num>`.
- `git config user.email` resolves to `chris.r.mccann@gmail.com` (worktree-local; check before first commit).

---

## Step-by-step procedure

### 1. Read pending proposals

```sql
SELECT id, target_doc, source, citations, summary, created_at
FROM doc_proposals
WHERE user_id = $CHRIS_USER_ID
  AND status = 'pending'
ORDER BY target_doc, created_at;
```

Use the supabase MCP `execute_sql` Tool. The user_id is Chris's auth.users id — derive from one of the existing brews (`SELECT user_id FROM brews LIMIT 1` if not cached).

If there are zero pending proposals, surface that to Chris and stop.

### 2. Group by `target_doc`

The pending list is sorted by target_doc, so groups are already contiguous. Each group becomes one PR (one branch, one batch commit, one merge).

For a small batch (≤2 groups), one PR is fine. For a larger batch (3+), one PR per group keeps the diff readable.

### 3. Resolve target_doc to a file path

| target_doc                              | File path                             |
|-----------------------------------------|---------------------------------------|
| `brewing.md`                            | `BREWING.md`                          |
| `roasting.md`                           | `ROASTING.md`                          |
| `roaster/{Canonical Name}`              | `docs/brewing/roasters.md` (find `## {Name}` section) |
| `taxonomies/{axis}.md`                  | `docs/taxonomies/{axis}.md`           |

For `roaster/{Name}` proposals: open `docs/brewing/roasters.md`, locate the `## {Canonical Name}` header, and operate within that section's body.

**Multi-target_doc proposals (post Sprint 2.4 follow-up):** A single proposal may have citations that target different files (one insight from a brew debrief often touches roaster card + BREWING.md archive bullet + Open Questions). Each citation now carries its own `target_doc` field (defaults to the proposal-level value when not set). When arbitrating: **group citations by their per-citation `target_doc`**, process one group per file, but apply the entire proposal as one DB row update at the end (Step 7). The proposal-level `target_doc` is just a default — don't use it for routing if citations override it.

**Cross-doc apply (legacy / drift case):** If you encounter a pre-2.4.1 proposal where target_doc says one thing but citations clearly target another file (anchor matches in a different file), don't reject — surface the mismatch to Chris and offer to apply each citation against its natural file. Mark the proposal `applied` with notes documenting the cross-doc apply. (This is the path used in the original Sprint 2.4 dog-food when proposal `a7f37316` filed everything under `roaster/Dongzhe` but only one citation actually lived there.)

### 4. Per citation: locate the section anchor

For each citation in the proposal, use the `Read` tool to grab the file content, then locate the `## {section_anchor}` header (case-sensitive exact match).

**Three outcomes:**

- **Match.** Render a diff of `current_text` vs. `proposed_text` (or for `append` operations, just show `proposed_text` and the section name).
- **Match but content has drifted.** If `current_text` is provided and the actual file content of that section diverges meaningfully from `current_text`, flag the drift to Chris before applying. Don't assume the proposed_text still makes sense against the new content.
- **No match (orphaned anchor).** The cited section was renamed, deleted, or was never there. Surface to Chris with the proposal's `current_text` excerpt + `proposed_text` for retarget vs discard decision.

### 5. Present each citation to Chris

Format roughly:

```
Proposal $ID — target_doc: brewing.md
Summary: <summary>
Source: <source.kind>:<source.id>
─────────────
Citation 1/3 — section "Coffees That Confirmed Clarity-First"
  Operation: append
  Rationale: <rationale>
  Diff:
    + <proposed_text first 3 lines>
    + ...
  [apply / reject / edit]

Citation 2/3 — section "Equipment Reference"
  ...
```

For multi-citation proposals, ask Chris citation-by-citation, then roll up the proposal status at the end (Step 7).

### 6. Apply Chris's decision

- **apply:** use the `Edit` tool on the resolved file. For `append` operations, find the end of the section's body (first line of next header at equal-or-higher level, minus 1) and insert before that line. For `replace`, swap `current_text` for `proposed_text` (require exact match; bail if the file has drifted). For `prepend`, insert at the start of the section body.
- **reject:** no file edit; record as a rejected citation.
- **edit:** Chris dictates an alternative text; apply that instead and note the divergence.

**House style normalization at apply time.** Chris's `feedback_hyphens_not_emdashes.md` rule: always use plain hyphens (`-`), never em-dashes (`—`) or en-dashes (`–`). When applying `proposed_text`, normalize em-dashes and en-dashes to plain hyphens before writing to the file. Claude.ai's `proposed_text` often contains em-dashes by default; the arbiter is the right place to enforce house style. Don't push this back to Claude.ai as a rejection — just normalize during apply.

### 7. Roll up proposal status

After all citations in one proposal are processed:

| Outcome                                             | Proposal `status` |
|-----------------------------------------------------|-------------------|
| Every citation applied                              | `applied`         |
| Some applied, some rejected (mixed)                 | `applied` with notes (per-citation outcomes) |
| Every citation rejected (Chris discarded the lot)   | `rejected`        |
| Every citation orphaned + Chris discarded all       | `superseded`      |
| Citations partial-orphaned, Chris held some pending | leave `pending` (rare; surface to Chris) |

```sql
UPDATE doc_proposals
SET status = $STATUS,
    applied_at = now(),
    applied_by_session = $CC_SESSION_ID,
    notes = $NOTES
WHERE id = $PROPOSAL_ID;
```

Use the supabase MCP `execute_sql` Tool. Include `applied_by_session` (the Claude Code session id Chris is in) for audit trail.

### 8. Commit + PR + merge

After all proposals in the batch are applied:

```bash
git add <touched files>
git commit -m "$(cat <<'EOF'
Apply doc proposals: <one-line summary or "batch N..M">

Applied N citations across M proposals from Claude.ai sessions on <date range>.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"

git push -u origin claude/<branch>:claude/<branch>

gh pr create --title "Apply doc proposals: <summary>" --body "$(cat <<'EOF'
## Summary
- Applied N citations across M proposals
- target_docs: <list>

## Proposal IDs
- <id>: <summary>
- ...

## Test plan
- [ ] Verify Vercel auto-deploys after merge
- [ ] Verify next Claude.ai session pulls fresh files via docs:// MCP Resources

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Once merged: Vercel auto-deploys (~30-60s). Claude.ai's next session pulls fresh files. The doc_proposals rows are already marked `applied`; no post-merge DB update needed.

---

## Taxonomy queue arbitration (Phase 3)

`taxonomy_overrides_queue` (migration 045) is the canonical-side analog of `doc_proposals`. Same arbiter playbook, parallel substrate. claude.ai writes via push-tool override flags or `propose_canonical_addition`; the queue holds pending entries until Chris-as-arbiter walks them in a Claude Code session.

The procedure is structurally identical to the prose-proposal flow above, with the doc_proposals reads + edits replaced by registry edits. Run AFTER (or interleaved with) the prose-proposal pass — both queues are walked in the same session.

### T1. Read pending queue entries

Use the `list_taxonomy_queue` MCP Tool (axis filter optional) — same auth context as the prose pass.

```ts
list_taxonomy_queue({ status: 'pending' })
```

Or, equivalently, via `execute_sql`:

```sql
SELECT id, axis, raw_value, submission_path, source_kind, source_id,
       evidence, submitted_at
FROM taxonomy_overrides_queue
WHERE user_id = $CHRIS_USER_ID AND status = 'pending'
ORDER BY axis, submitted_at;
```

If zero rows, surface to Chris and skip.

### T2. Group by `axis`

Each axis becomes one PR (one branch, one batch commit). Registry edits are per-file, so axis grouping aligns naturally with PR scope:

| axis        | Registry file                    | Markdown file                          |
|-------------|----------------------------------|----------------------------------------|
| `producer`  | `lib/producer-registry.ts`       | `docs/taxonomies/producers.md`         |
| `roaster`   | `lib/roaster-registry.ts`        | `docs/taxonomies/roasters.md`          |
| `brewer`    | `lib/brewer-registry.ts`         | `docs/taxonomies/brewers.md`           |
| `filter`    | `lib/filter-registry.ts`         | `docs/taxonomies/filters.md`           |
| `grinder`   | `lib/grinder-registry.ts`        | `docs/taxonomies/grinders.md`          |
| `terroir`   | `lib/terroir-registry.ts`        | `docs/taxonomies/regions.md`           |
| `cultivar`  | `lib/cultivar-registry.ts`       | `docs/taxonomies/varieties.md`         |

Small batches (≤2 axes) → one PR. Larger batches → one PR per axis.

### T3. Per queue row: present to Chris

Show:
- The `raw_value` verbatim
- The `axis` + `submission_path` (override_flag vs manual_propose)
- The `source_kind` + `source_id` (link to the brew / green_bean / roast row that triggered it)
- The `evidence` jsonb (URLs, prose, tier, country/macro for terroir)
- The current canonical list for context (use `read_canonical(axis)` Tool — quicker than reading the full `.md`)

Ask Chris one of four resolutions:

- **promote** — net-new canonical worth adding to the registry. The arbiter edits the registry file + markdown + records `canonical_target = <new canonical>`.
- **alias** — same canonical as an existing entry under a different name. The arbiter adds an alias map entry to the registry + records `canonical_target = <existing canonical>`.
- **reject** — drift / typo / not actually net-new. No registry edit; status flips to `rejected`.
- **duplicate** — collapse to another pending row. Records `duplicate_of = <survivor queue_id>`.

### T4. Apply Chris's decision (registry edit + Tool call)

For `promote`:
1. **Edit `docs/taxonomies/{axis}.md`** — add the entry per the file's authoring template (e.g. `ProducerEntry` shape, `BrewerEntry` shape).
2. **Edit `lib/{axis}-registry.ts`** — add the rich entry to the corresponding constant (e.g. `PRODUCERS`, `ROASTERS`).
3. **Call `resolve_queue_entry({ queue_id, action: 'promoted', canonical_target, arbiter_notes })`** — flips DB row.

For `alias`:
1. **Edit `lib/{axis}-registry.ts`** — add to the alias-map argument passed to `makeCanonicalLookup` (the second arg).
2. **Edit `docs/taxonomies/{axis}.md`** — note the alias in the relevant entry's notes section if the file has one.
3. **Call `resolve_queue_entry({ queue_id, action: 'aliased', canonical_target, arbiter_notes })`**.

For `reject`:
- Just **`resolve_queue_entry({ queue_id, action: 'rejected', arbiter_notes })`**. No file edit.

For `duplicate`:
- **`resolve_queue_entry({ queue_id, action: 'duplicate', duplicate_of, arbiter_notes })`**. The survivor row gets resolved separately.

The Tool ONLY records the decision. The registry edits are the source of truth for promotion/alias — `resolve_queue_entry` does not edit TS source files (auto-editing TS from the MCP server would require Claude Code execution context the server doesn't have).

### T5. Commit + PR + merge

Per axis grouping (T2):

```bash
git checkout -b claude/taxonomy-queue-<axis>-<date>
git add docs/taxonomies/<axis>.md lib/<axis>-registry.ts
git commit -m "$(cat <<'EOF'
Promote pending <axis> queue entries to canonical: <list>

Applied N taxonomy_overrides_queue resolutions for axis=<axis>.
Source rows: <brew_ids / green_bean_ids>.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git push -u origin claude/<branch>:claude/<branch>
gh pr create --title "Promote pending <axis> taxonomy queue: <one-line summary>" --body "..."
```

Once merged + Vercel deploys: claude.ai's next push that resolves the new canonical no longer needs `*_override:true`. Validate by re-pushing one of the source rows (no override flag) — should resolve canonically with no new queue row.

### T6. Differences vs. prose-proposal flow (quick reference)

| Step | Prose (doc_proposals) | Canonical (taxonomy_overrides_queue) |
|------|------------------------|---------------------------------------|
| Read | `SELECT * FROM doc_proposals WHERE status='pending'` | `list_taxonomy_queue({ status: 'pending' })` |
| Group by | `target_doc` | `axis` |
| Edit target | `BREWING.md` / `ROASTING.md` / `docs/brewing/roasters.md` / `docs/taxonomies/{axis}.md` | `lib/{axis}-registry.ts` + `docs/taxonomies/{axis}.md` |
| Apply mechanism | Edit tool — append/prepend/replace | Edit tool — add registry entry / alias map entry |
| Status flip | UPDATE doc_proposals SET status='applied' (per citation) | `resolve_queue_entry` Tool call |
| Status values | applied / rejected / superseded | promoted / aliased / rejected / duplicate |
| Auto-supersede | Yes — per (target_doc, section_anchor) on insert | EXCLUDE constraint on (user, axis, lower(raw_value)) — second push returns existing pending row id |

---

## Stale-anchor protocol

When a citation's `section_anchor` doesn't match any header in the resolved file:

1. **Surface to Chris.** Show:
   - The proposal's `summary` + `rationale`
   - The cited `section_anchor`
   - The proposal's `current_text` excerpt (if provided) — gives Chris context to decide if the section was renamed
   - The proposed_text (so Chris can judge whether it's still applicable)
   - The actual list of section anchors in the file (use `listDocSections()` from `lib/mcp/docs.ts` if running through the MCP server, or grep `^## ` if running standalone)

2. **Three resolutions:**
   - **Retarget.** Chris names the new section; the arbiter applies the citation against that section instead.
   - **Discard.** Mark the citation `superseded` (or whole proposal `superseded` if all citations are orphaned).
   - **Edit.** Chris gives a custom edit; apply that and note divergence.

3. **Don't fuzzy-match anchors automatically.** Silent retargets to wrong sections are hard to audit. The arbiter is the human-in-the-loop precisely because fuzzy decisions need explicit approval.

---

## Multi-citation proposals

Each citation is independent. Two implications:

1. **Per-citation outcomes.** Chris can apply citation 1 + reject citation 2 in the same proposal. The proposal's overall `status` reflects the roll-up (Step 7).
2. **Atomic write per file.** All citation edits to the same file should be applied in one Edit pass + committed together. Don't write a file twice in the same arbiter session.

For multi-citation proposals targeting the SAME section_anchor (rare but possible — e.g., one append + one prepend): apply in document order if Chris approves both.

---

## Auto-supersede semantics

When Claude.ai inserts a NEW proposal targeting `(target_doc, section_anchor)` that already has a pending proposal, the Tool handler in `lib/mcp/propose-doc-changes.ts` **automatically marks the older row `superseded`** in the same call. The arbiter never sees both — only the newer one is `pending`.

The older row's `notes` field shows `Superseded by <new_id> on <timestamp>` for traceability. If Chris asks "what got superseded recently?":

```sql
SELECT id, target_doc, summary, notes, created_at
FROM doc_proposals
WHERE status = 'superseded'
ORDER BY created_at DESC
LIMIT 20;
```

Auto-supersede is per-citation: if a new proposal has 3 citations, all 3 anchors trigger separate UPDATEs, and any older proposal touching ANY of those anchors gets superseded.

---

## Drift policy: doc edit conflicts with current DB state

If a proposal references a brew that's since been re-classified (e.g., proposal says "Inmaculada needed Balanced Intensity" but the brew is now `extraction_strategy='Suppression'` in DB), surface this to Chris. Don't auto-merge; don't auto-discard.

Decision tree:
- **DB is right, proposal is stale** → reject the citation; flag for Chris to consider re-proposing with corrected framing.
- **Proposal is right, DB is wrong** → mark proposal `pending`, ask Chris if the DB should be corrected (separate sprint / fix).
- **Both are right at different points in time** → apply the proposal as historical context; note the timestamp.

---

## Substrate-practice gap audit

Cross-party `/grill-with-docs` sessions are the canonical mechanism for closing the **practice-to-substrate** direction: lived workflow practice diverges from substrate (schema / prompts / ROASTING.md / BREWING.md / CONTEXT.md), the cross-party audit surfaces the gap, the audit output becomes substrate updates.

The substrate-to-substrate direction (workflow output proposes substrate edits via `propose_doc_changes`, arbitrated through the procedure above) and the practice-to-substrate direction (cross-party audit catches drift between lived practice and documented substrate) are paired mechanisms. Both are subject to the six-actor cross-system audit discipline in [CLAUDE.md § Sprint cadence](CLAUDE.md#sprint-cadence-for-claude) item #4.

**Mechanism shape:** Claude Code (auditor) and the relevant claude.ai project (auditee) take turns through Chris as a pure message relay. The auditor proposes "missing X" / "drift in Y" / "ambiguous Z" claims about a cluster's documented terminology; the auditee responds from its lived authoring practice; Chris relays both without re-framing. Where the two diverge, the audit output is the canonical record. R1/R2/R3 grilling methodology rules apply (grep-first / analytical-vs-operational classification / confabulation ledger — see [memory/feedback_grilling_methodology_rules.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_methodology_rules.md)).

**Precedent (both 2026-05-17):**
- [grilling-2026-05-17-brewing-cross-party-followups.md](docs/sprints/grilling-2026-05-17-brewing-cross-party-followups.md) — brewing-side; 7 new headwords forming the iteration cluster (Named Consideration / Iteration budget / Wrong-zone trap / etc.); R1/R2/R3 methodology rules distilled.
- [grilling-2026-05-17-roasting-cross-party-followups.md](docs/sprints/grilling-2026-05-17-roasting-cross-party-followups.md) — roasting-side; 21 new headwords + 9 existing edits + 3 ADRs (0003 anchor canonicalization / 0004 V-set close schema seam / 0005 parameter-type signal arbitration); 7 substrate-practice gaps documented at audit-output level (six-field roast→cup trace not operational; taste-for non-articulation principled; lever-promotion-at-lot-close; ROASTING.md additive-only table; "experiment" overload; peer-roaster storage gap; carry-forward scope-tag gap). The roasting-side claude.ai named the pattern "substrate-practice gap" in round 7 retro.

**Cadence:** not on a fixed schedule. Chris-driven, triggered when claude.ai's lived authoring vocabulary feels drifted from Latent's documented terminology, or when a recurring friction pattern in a workflow suggests the substrate is incomplete. **Trigger phrase**: "let's do a cross-party grill on the {cluster} side" (or functionally equivalent — "cross-party audit", "grill against claude.ai").

**Output shape:** same as other grilling sessions — followup file at `docs/sprints/grilling-YYYY-MM-DD-<scope>-followups.md` + CONTEXT.md entries inline (per the "grow incrementally" rule) + optional ADR if a non-obvious decision crystallized. The session does NOT route through `doc_proposals` / `taxonomy_overrides_queue` — cross-party output is direct doc edits, not staged proposals.

**Future ADR-0006 candidate:** if the cross-party pattern repeats across 3+ sessions, the mechanism itself earns explicit framing alongside the existing arbiter procedures. Tracked as RO-CP-9 in [docs/sprints/post-grilling-sequencing.md](docs/sprints/post-grilling-sequencing.md); deferred per Chris-confirmed 2026-05-17 to "when a 3rd cross-party audit lands."

---

## CCIL consolidation pass

[ROASTING.md § Cross-Coffee Insight Layer](ROASTING.md#cross-coffee-insight-layer) (CCIL) grows append-only as each V-set close-out / lot close-out appends a new working hypothesis. Without periodic consolidation the section drifts toward 6+ working hypotheses per active lot, the High-confidence cross-lot-validated patterns get buried, and the Low-confidence single-lot observations accumulate without ever being retired or promoted. This pass cleans both ends: promotes confirmed patterns to a stable navigable index, retires stale single-lot hypotheses that haven't been corroborated.

**Trigger phrase:** "consolidate cross-coffee insights" / "process pending CCIL consolidation" / "do a CCIL pass" (or any functionally equivalent - same routing intent as the prose-proposal / canonical-queue passes above).

**Cadence:** Chris-driven, not on a fixed schedule. Two natural triggers:
1. Working Hypotheses (Single-Lot, Low Confidence) subsection in CCIL accumulates 6+ entries (the count Round 4 #11 flagged on 2026-05-15 as the unbounded-growth tripwire).
2. A High-confidence cross-lot pattern emerges from `log-cupping.md` STAGE 3 / `close-lot.md` STAGE 5 that deserves explicit promotion to Confirmed Patterns rather than just leaving it as an APPEND on a body subsection.

Pair the CCIL pass with the regular prose-proposal / canonical-queue passes when both queues have pending work; otherwise run standalone.

**Pre-conditions:** same as the prose-proposal pass - fresh branch, worktree-local `user.email`. Read [CONTEXT.md § Key-insight confidence ladder](CONTEXT.md) to refresh on the 4-level enum operational definitions; the consolidation pass applies the same ladder.

### CCIL-1. Audit current CCIL entries

Read [ROASTING.md § Cross-Coffee Insight Layer](ROASTING.md#cross-coffee-insight-layer). Inventory every prose paragraph or `## H2` subsection (NOT the reference tables - see below). For each entry, record:

- **Origin date** - when authored. Recoverable from the entry's lot tag (e.g. "RWA-NOVA-NAT21-RB-2026 V1, observed 2026-05") or from `git log -- ROASTING.md` if not embedded.
- **Confidence level** - Low / Medium / Medium-High / High per [CONTEXT.md § Key-insight confidence ladder](CONTEXT.md).
- **Corroborating lots since authoring** - count lots that have either reinforced or contradicted the hypothesis. Cross-reference [§ Open Questions](ROASTING.md#open-questions) for tracked-validation status. Run `git log --oneline -- ROASTING.md` to spot subsequent edits that updated the hypothesis.
- **Parallel Open Questions row** - does the hypothesis have a question entry in the Open Questions section that tracks the next-lot test?

**Out of scope for promote/retire:** the reference tables (FC Floor & Ceiling, WB-to-Ground Agtron Delta Norms, Session Position Effect, Green Spec → Starting Hypothesis, Varietal Aromatic Fingerprints, Rest Behavior Patterns) hold protocol-grade reference data with row-level mixed confidence. They are maintained inline by `propose_doc_changes` during normal sessions; the consolidation pass does not touch them.

### CCIL-2. Promote candidates → Confirmed Patterns subsection

A hypothesis is promotion-eligible when BOTH conditions hold:
- `key_insight_confidence = High` per the CONTEXT.md operational ladder, AND
- Repeated across ≥2 lots OR strong cross-lot corroboration (the pattern is invoked in V1 design for 3+ subsequent lots without contradiction; or the pattern is named explicitly in a closed lot's `roast_learnings.carry_forward_general_takeaway`; or the pattern survives an adversarial "what would change my mind?" prompting and is invoked by claude.ai during prior similar-lot V1 designs).

Surface promotion candidates to Chris before editing. For each promotion Chris approves:

1. **Add a one-line bullet** to the **Confirmed Patterns** subsection at the top of CCIL. The bullet should be short (≤2 sentences) + link to the detail section that holds the evidence (FC Floor & Ceiling, Rest Behavior Patterns, etc.). The Confirmed Patterns subsection is a navigable INDEX, not a duplication.
2. **Leave the detail section in place** - don't move or strip the source evidence.
3. **If the source was a standalone `## H2 Working Hypothesis` subsection** that has now been promoted, demote it: either delete it entirely (the Confirmed Patterns bullet is the new home) or downgrade the header (e.g. `## FC-Temp Architectural Constraint - Confirmed` → folded into the FC Floor & Ceiling table as a new row). Don't leave it sitting at H2 level with the old "Working Hypothesis" framing if the consolidation now reads it as confirmed.

### CCIL-3. Retire candidates → Open Questions or delete

A hypothesis is retirement-eligible when ANY of these hold:
- **Aged out**: Confidence is Low AND no corroborating lot has landed within **90 days** of authoring, OR
- **Tested without corroboration**: hypothesis was tested on **3+ similar lots** since authoring without repeat, OR
- **Contradicted**: a subsequent lot's evidence rules out the hypothesis (the entry should be removed; CCIL is not the place to record rebuttals).

Two retirement paths:

- **Open Questions retain** - if the hypothesis frames a question that's still operationally useful (Chris still wants to test it on future lots), move the question to [§ Open Questions](ROASTING.md#open-questions) (or update the existing parallel row) and delete the CCIL prose paragraph. The commit message captures what was retired.
- **Full delete** - if the hypothesis was contradicted OR no longer represents Chris's current thinking, delete entirely. The commit history is the audit trail.

Surface each retirement candidate to Chris before editing. Don't auto-retire - the consolidation pass is human-in-the-loop precisely because aging is contextual (a 90-day-old hypothesis on a slow-moving cultivar class may still be active; a 30-day-old hypothesis on a contradicted observation may be ready to retire).

### CCIL-4. Restructure check

After promote/retire, the three-tier CCIL structure should be coherent:
1. **Confirmed Patterns** (top) - short bullet index of High-confidence cross-lot-validated patterns.
2. **Reference tables + Medium / Medium-High `## H2` subsections** (body) - protocol-grade content + hypotheses under validation.
3. **Working Hypotheses (Single-Lot, Low Confidence)** (bottom) - holding pen for pre-ladder historical Lows; should drain over time. Do NOT accept new Low appends here per the operational ladder; this subsection is for entries authored before the ladder was finalized.

If the Working Hypotheses subsection has drained to zero entries, delete the subsection header and intro blockquote. If new Low entries appeared post-ladder (a per-session prompt bug or claude.ai drift), surface to Chris - those represent operational-ladder violations that need root-cause fix in the prompts, not just a doc-edit move.

### CCIL-5. Commit + PR + merge

Same shape as the prose-proposal commit flow (Step 8 above). Branch name suggestion: `claude/ccil-consolidation-YYYY-MM-DD`. Commit message template:

```
CCIL consolidation: promote N to Confirmed Patterns, retire M working hypotheses

- Promoted (N): <pattern-1>, <pattern-2>, ...
- Retired to Open Questions (M_a): <hypothesis-x>
- Retired (deleted) (M_b): <hypothesis-y> (contradicted by <lot>)
```

### CCIL-6. Cross-system audit

Per [CLAUDE.md § Sprint cadence](CLAUDE.md#sprint-cadence-for-claude) item #4, a CCIL consolidation IS a substrate change to ROASTING.md. Trace:

- **Actor 6 (UI):** ROASTING.md edits applied. ✓
- **Actor 4 (MCP):** `roasting.md` doc Resource auto-reflects file content; no Tool/Resource code change required. Verify by running `read_doc_section({ uri: "docs://roasting.md", anchor: "Cross-Coffee Insight Layer" })` after merge to confirm the section still resolves.
- **Actor 5 (Claude Code):** CLAUDE.md / CONTEXT.md need an edit only if the operational ladder itself shifts; pure CCIL restructure does not.
- **Actor 2 (prompts):** `log-cupping.md` / `close-lot.md` / `start-lot.md` / `one-shot.md` / `one-shot-closeout.md` reference CCIL by top-level anchor "Cross-Coffee Insight Layer" - that anchor is unchanged, so prompts continue to resolve. If any prompt links to a specific subsection by anchor (e.g. `#fc-floor--ceiling-by-processing-method`), `grep` for those anchors and verify they still resolve after restructure.
- **Actor 3 (claude.ai):** next session pulls fresh `roasting.md` via `docs://` MCP Resource. The Confirmed Patterns subsection's relative weight on V1-design is something Chris flags to the claude.ai project at the start of the next roasting session.
- **Actor 1 (Chris):** rendered ROASTING.md should read coherently. Verify navigation from Confirmed Patterns bullets → detail sections works (the bullet links use markdown `[§ Section](#section-anchor)` form; section anchors are GitHub-style slugified from H2 headings).

### CCIL-7. Worked example (2026-05-18 first pass)

The first CCIL consolidation pass ran 2026-05-18, applying the operational ladder retroactively to ~10 Low-confidence single-lot entries authored 2026-04 to 2026-05 (before the ladder finalized today):

- **Promoted to Confirmed Patterns (8 patterns):** drop-temp ceiling 205-208°C across counterflow lots; first-roast-of-session late-and-hot; Day 7 pourover as universal evaluation gate; xbloom under-extracts delicate aromatic washed coffees; WB-to-ground delta tightening as profile-dialing signal; Sudan Rume aromatic vocabulary shared across washed and natural processing; high-density washed Colombian ≥800 g/L energy-tolerant; producer notes including "lemongrass" / "jasmine" / "bergamot" predict eval-recipe under-extraction.
- **Retired none (all Lows too recent to age out yet):** entries dated 2026-04 to 2026-05 were moved to the Working Hypotheses subsection as a holding pen rather than deleted; the 90-day retire-window first applies at the 2026-08 consolidation pass.
- **Restructure:** added Confirmed Patterns subsection at top; relocated K (Session-Position Acceleration) + L (Dev-Time Outweighs Peak Inlet) + 6 inline Low paragraphs to the new Working Hypotheses (Single-Lot, Low Confidence) subsection at bottom; promoted M (xbloom_gate misranking) from an orphaned-paragraph position to a proper `## H2` subsection at Medium-High confidence; updated 2 Open Questions backlinks to new anchors.
- **Sprint shipped log:** added a row to `docs/sprints/shipped.md`; updated [Round 4 #11 in feedback_mcp_continuous_log.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md) to status `shipped`.

Use this worked example as the shape template for the next pass.

---

## Cross-references

- **Architecture:** [SYNC_V2.md § propose_doc_changes](SYNC_V2.md#propose_doc_changes) + § "Doc storage model" + § "Conflict resolution / two-store reconciliation".
- **Tool spec:** `lib/mcp/propose-doc-changes.ts` — input schema, target_doc allow-list, supersede logic.
- **Migration:** `supabase/migrations/037_doc_proposals.sql` — table schema + RLS + indices.
- **Phase 3 (taxonomy queue):** [docs/features/taxonomy-overrides-queue.md](docs/features/taxonomy-overrides-queue.md) (design) + `supabase/migrations/045_taxonomy_overrides_queue.sql` (substrate) + `lib/mcp/list-taxonomy-queue.ts` / `propose-canonical-addition.ts` / `resolve-queue-entry.ts` (Tools).
- **The PRODUCT.md retro analog:** Chris's mental model is "this is just like updating PRODUCT.md after every sprint." Same write-cycle: stage state, present diff, get approval, edit, commit, PR. Two staging surfaces (`doc_proposals` + `taxonomy_overrides_queue`); the rest is identical.
