# Completion - Per-lot file registration tickets (feedback-backlog #33)

> Implementer completion report. Generated 2026-06-06 by the execution sprint kicked
> off from [per-lot-file-registration-kickoff.md](per-lot-file-registration-kickoff.md).
> This report stands alone; paste it into a Claude Code session to close out #33.

## 1. The plan (restated)

When a lot closes, `close-lot.md` STAGE 5 (V-set) and `one-shot-closeout.md` STAGE 5
(one-shot) route the close-out narrative to net-new per-lot files under two prefixes:

- `skills/roasting-historian/cluster/learnings/<lot-slug>.md`
- `skills/roasting-historian/cluster/one-shot-calibrations/<lot-slug>.md`

`propose_doc_changes` validates every `skills/` target against the registered
`SKILL_FILES` allow-list in `lib/mcp/docs.ts` (via `isKnownDoc`), so a brand-new
per-lot file rejected with "Unknown skills target." Every closed lot orphaned its
canonical-home content (recurrence 3: UGA-MH-ELGON, RWA-NOVA Bukure, COS-HIG Higuito;
criticality high). The interim manual recovery ("draft content -> deferred artifact +
note to Chris -> Chris hand-registers the path") had run clean twice.

Option (b), Chris-chosen at planning to keep the human-in-the-loop gate (vs option (a)
auto-register): formalize the recovery into a standardized **arbiter ticket**. Close-out
STAGE 5 emits a per-lot-file-registration ticket; a new ARBITER.md playbook section
registers the path (`SKILL_FILES` + `DOC_DESCRIPTIONS` + glob check) and seeds the file
with the ticketed content.

## 2. What shipped (per scope item)

1. **Ticket format defined** - a machine-scannable fenced block emitted at STAGE 5
   (rendered to Chris at STAGE 7): `ticket_type: per-lot-file-registration` /
   `lot_slug` / `target_path` (one of the two whitelisted prefixes) / `seed_content`
   (full drafted markdown body) / `source` (`{kind: "session", id: "<lot_id close-out>"}`).
   One ticket per net-new file (a lot may emit up to 2).
2. **Both close-out prompts' STAGE 5 patched** - `docs/prompts/close-lot.md` (the
   "Closed-lot learnings" bullet) and `docs/prompts/one-shot-closeout.md` (the
   "Closed-lot learnings" + "One-Shot Calibrations in Process" bullets): the three-step
   "deferred artifact + note to Chris" recovery prose is replaced with formalized ticket
   emission. The auto-split-per-`(target_doc, section_anchor)` rule for registered
   citations is preserved; the ticket flow is ONLY for the two net-new per-lot prefixes;
   everything else still routes through `propose_doc_changes`.
3. **Whitelisted prefixes constrained** to exactly the two `learnings/` +
   `one-shot-calibrations/` prefixes. Any other net-new `skills/` path stays
   hard-rejected (forces the normal deliberate `SKILL_FILES` registration). No
   brewing-side per-lot files added.
4. **ARBITER.md consumer section added** - `## Per-lot file registration tickets`
   (declared the sixth arbiter queue type, walked alongside the existing five during a
   `process pending arbitration` run). Matches the Skeleton review / Taxonomy queue
   numbered-substep shape. Steps: **P1** read pending ticket(s) from the pasted artifact;
   **P2** validate `target_path` under a whitelisted prefix + `lot_slug` matches the
   stem (reject otherwise); **P3** add the `SKILL_FILES` entry + matching
   `DOC_DESCRIPTIONS` entry in `lib/mcp/docs.ts`; **P4** verify the
   `outputFileTracingIncludes` glob covers the path, then run `npm run check:mcp-bundle`
   (must exit 0) - the check instruction is carried verbatim so every future per-lot
   registration is glob-verified; **P5** seed the file with `seed_content` (house-style
   hyphen normalization applied); **P6** commit + PR + merge.
5. **propose-doc-changes.ts rejection-message hint** (decide-and-proceed point 5,
   default taken) - added a `PER_LOT_REGISTRATION_PREFIXES` constant + an
   `isPerLotRegistrationPath` predicate. When a rejected `skills/` target is a
   well-formed path (`<prefix>/<stem>.md`) under a whitelisted per-lot prefix, the
   rejection now points the operator at the ticket flow ("Do not retry
   propose_doc_changes; emit a per-lot-file-registration arbiter ticket ...") instead of
   the bare "Register the path in lib/mcp/docs.ts SKILL_FILES first." Non-per-lot
   net-new paths keep the original bare-register message. Same Tool, no schema change.

Plus (per the kickoff's grilling-queue line): the "future Tool sprint"
create-in-registered-directory tracker (the inline note in close-lot.md / grilling-queue)
is **drained to grilling-queue.md § Resolved** with a 2026-06-06 entry.

### Divergences from the brief

- **Ticket transport (open question):** kept response-emitted (the default). No
  DB-backed queue; the ticket is a fenced block Chris pastes into a Claude Code arbiter
  session, matching the proven manual walk.
- **The "future Tool sprint tracker":** the brief said to "drain/update the future Tool
  sprint tracker that flagged this as pending." There was no literal standalone numbered
  grilling-queue item for it - the tracker was the inline prose note inside close-lot.md
  STAGE 5 ("create-in-registered-directory support (future Tool sprint; tracked in
  docs/grilling-queue.md)"). Resolved both ways: the close-lot.md inline note was removed
  as part of the STAGE 5 rewrite, AND a § Resolved entry was appended to grilling-queue.md
  documenting the drain. (A separate, unrelated "future Tool sprint" note about
  `push_brew` terroir/cultivar FK inheritance was left untouched - different surface.)
- **Docs.ts not modified in this PR:** per the brief, real per-lot registration happens
  at arbiter-time per lot, not in this sprint. The dry run temporarily registered a
  throwaway slug and reverted it; `lib/mcp/docs.ts` is unchanged in the shipped diff.

## 3. PR + merge

- **PR:** https://github.com/chrismccann-dev/latent-coffee/pull/418
- **Merge commit (squash) on main:** `b530827` (full:
  `b5308272bb8738baca83be7a9d7b95b8ca68ce02`), merged 2026-06-07.
- Files: `ARBITER.md`, `docs/prompts/close-lot.md`, `docs/prompts/one-shot-closeout.md`,
  `lib/mcp/propose-doc-changes.ts`, `docs/grilling-queue.md` (+ the kickoff doc).

## 4. Verification results (actuals, not "should work")

- **End-to-end dry run (Actor 1):** temporarily added a `SKILL_FILES` +
  `DOC_DESCRIPTIONS` entry for throwaway slug `zzz-dryrun-lot` + seeded a throwaway file,
  then probed `isKnownDoc` (the exact gate `propose_doc_changes` checks before the
  "Unknown skills target" rejection):
  - registered per-lot path -> `isKnownDoc` **true** (propose_doc_changes would ACCEPT
    an append to the now-registered path) ✓
  - unregistered per-lot path -> **false** (would emit the new ticket-flow hint) ✓
  - non-per-lot net-new path -> **false** (bare register-first reject, unchanged) ✓
  - All dry-run artifacts (docs.ts entries + seed file + probe script) reverted; the
    shipped diff contains none of them.
- **`npm run check:mcp-bundle`:** exit **0**, both during the dry run (with the
  throwaway path registered) and on the final tree. The `./docs/skills/**/*.md` glob in
  `next.config.js` already covers both whitelisted per-lot prefixes, so no
  `next.config.js` edit is needed for a per-lot file.
- **`npm run check:doc-links`:** **0 live misses** (66 archive-layer warnings, all
  non-gating by design - includes the file-relative links in the kickoff brief itself
  and the forward-reference to this completion doc).
- **`npx tsc --noEmit`** (main-repo proxy per CLAUDE.md build-hygiene): no source errors;
  the only tsc output is stale `.next/types` artifacts for the already-deprecated `/add`
  + `/brews/[id]/edit` pages, unrelated to this change. The message change compiles under
  `strictNullChecks`.
- **Six-actor cross-system audit:** Actor 6 (schema/UI) explicit skip; Actor 4 (MCP
  message compiles, no new Tool/Resource/catalog refresh); Actor 5 (ARBITER.md section
  coherent next to existing arbitration sections, P4 carries the bundle-check verbatim,
  grilling-queue tracker drained); Actor 2 (both STAGE 5 sections emit the ticket,
  auto-split preserved, slug->path mapping unambiguous); Actor 3 (plain-text fenced
  ticket, no Tool dependency); Actor 1 (dry run above).

## 5. Deferred / surprising / newly surfaced (route-feedback fodder)

- **No real per-lot file registered yet.** This PR ships the *procedure*. The first
  real exercise of the ARBITER P1-P6 walk happens at the next lot close-out that emits a
  ticket. That walk is the live integration test - watch for any friction (ticket-block
  parse ambiguity, slug-vs-path mismatch edge cases) and route it back.
- **"Sixth arbiter queue type" framing** - the ARBITER section now declares six queue
  types. If the queue-type count keeps growing, a future arbiter-doc consolidation /
  index pass may be worth flagging (not actionable now).
- **The "run BEFORE the prose-proposal pass" ordering** is documented but untested in a
  real batch where a close-out's `propose_doc_changes` citations target the
  just-registered path in the same session. The dry run confirmed the gate flips
  correctly; the in-session ordering is the thing to watch on the first real walk.
- **No backlog flip done here** (per the kickoff handoff): leaving backlog #33 at
  `planned`. The close-out session should flip #33 `planned -> shipped`, move the line to
  `docs/sprints/shipped.md`, and `route-feedback` any new friction the first real walk
  surfaces. This report is ready to bring back.
