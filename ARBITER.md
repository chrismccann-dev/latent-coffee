# Doc Proposal Arbiter Playbook

This file is the standalone playbook a Claude Code session loads when Chris says **"process pending doc proposals."** It's the "apply side" of the V2 bidirectional sync (Claude.ai writes proposals via the `propose_doc_changes` MCP Tool; Claude Code arbitrates and applies them to repo prose docs).

If you're a future Claude session reading this for the first time: this is the same shape as how PRODUCT.md gets updated at the end of every sprint — Chris says "do the thing" and you read state, present diffs, get approval, edit files, commit, PR, merge. The doc_proposals table is the queue; this playbook is the procedure.

---

## When to use

**Trigger phrase:** "process pending doc proposals" (or anything functionally equivalent — "arbitrate", "apply pending docs", "review the proposal queue").

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
| `roasting.md`                           | `ROASTING.md` (lands in 2.5; ENOENT until then) |
| `roaster/{Canonical Name}`              | `docs/brewing/roasters.md` (find `## {Name}` section) |
| `taxonomies/{axis}.md`                  | `docs/taxonomies/{axis}.md`           |

For `roaster/{Name}` proposals: open `docs/brewing/roasters.md`, locate the `## {Canonical Name}` header, and operate within that section's body.

For `roasting.md` before 2.5 ships: surface to Chris that the file doesn't exist yet, and ask whether to discard (mark `rejected`) or hold (leave `pending` until 2.5).

**Multi-target_doc proposals (post Sprint 2.4.1):** A single proposal may have citations that target different files (one insight from a brew debrief often touches roaster card + BREWING.md archive bullet + Open Questions). Each citation now carries its own `target_doc` field (defaults to the proposal-level value when not set). When arbitrating: **group citations by their per-citation `target_doc`**, process one group per file, but apply the entire proposal as one DB row update at the end (Step 7). The proposal-level `target_doc` is just a default — don't use it for routing if citations override it.

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

## Cross-references

- **Architecture:** [SYNC_V2.md § propose_doc_changes](SYNC_V2.md#propose_doc_changes) + § "Doc storage model" + § "Conflict resolution / two-store reconciliation".
- **Tool spec:** `lib/mcp/propose-doc-changes.ts` — input schema, target_doc allow-list, supersede logic.
- **Migration:** `supabase/migrations/037_doc_proposals.sql` — table schema + RLS + indices.
- **The PRODUCT.md retro analog:** Chris's mental model is "this is just like updating PRODUCT.md after every sprint." Same write-cycle: stage state, present diff, get approval, edit, commit, PR. The doc_proposals table is the staging surface; the rest is identical.
