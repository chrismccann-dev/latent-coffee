# Sub-sprint 4b Bundle B — Handoff for fresh session

**Authored 2026-05-28** at the end of the Bundle A session. Bundle A shipped (PR #281, main `178d7a8`). Bundle B is the substrate-touching half of Sub-sprint 4b — the brew guide official-vs-implied refactor + the "No official brew guide" render gate fix that affects 14 roaster pages today.

This doc is the **single entry surface for the new session**. Read in this order:

1. **This doc** (full Bundle B execution playbook, locked decisions, exact files + line ranges)
2. [Phase 2 complementary pass § Bucket E1 + F1](docs/sprints/sub-sprint-4b-roasters-polish-complementary-pass-2026-05-28.md) — the substrate-gap reasoning + the 17-row affected-roasters table
3. **CLAUDE.md § Roasters** (lines 146-153) — current page-job framing post Bundle A
4. [Sub-sprint 4b kickoff brief](docs/sprints/sub-sprint-4b-roasters-polish-kickoff-2026-05-27.md) — only if Phase 1/2 context is missing

Everything else (the original plan file at `~/.claude/plans/quizzical-knitting-pinwheel.md`, the roaster registry, the page render code) is referenced inline below — no need to read upfront.

## ⚠️ NOT a planned-execution start

Bundle B has **one outstanding audio-confirm gate** before the new session touches the registry: the 3-state substrate definitions need Chris's ratification. Default mode at session start = **ask, then execute**. Treat the kickoff as: "I'm starting Bundle B. Here are my draft definitions of Official / Implied / None — can you ratify or correct before I draft the classifications table?"

Per [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md): substrate definitions are interpretive calls Chris owns. The autonomy rule applies only AFTER the definitions are ratified — at which point the rest of Bundle B is mechanical and ships autonomously per the plan.

## Where we are

**Sub-sprint 4b status**:
- Phase 1 (Chris's audit) ✅ closed 2026-05-28
- Phase 2 (Claude's complementary pass) ✅ shipped in Bundle A's PR #281
- Phase 3 plan ✅ approved via plan-mode ExitPlanMode
- **Bundle A** ✅ shipped 2026-05-28 — PR #281 / main `178d7a8` (Roasters Reference Brew Recipe IA polish + producer in coffees meta)
- **Bundle B** ⏳ pending — this doc

**What Bundle A did NOT touch** (Bundle B's scope):
- `RoasterEntry` type shape (no `brewGuideStatus` field yet)
- `brewGuideSource` value drift (18 unique values across 70 populated entries)
- The render gate at `app/(app)/roasters/[slug]/page.tsx:170-181` that prints "No official brew guide" on 14 roasters today as a false negative
- `docs/taxonomies/roasters.md` authored canonical content
- CLAUDE.md count drift (line 99 says "21 canonical names"; lines 150-151 say "70 canonical roasters"; actual is 73)
- `lib/synthesis/adapters/roaster.ts` (optional brewGuideStatus anchor add)

## Locked decisions from prior phases (do NOT re-litigate)

These are settled per Chris's audio Phase 1 + Phase 2 ratification (2026-05-28). Carrying through to Bundle B:

1. ✓ Coffees list position stays at section #6 — defended in Bundle A's CLAUDE.md edit
2. ✓ Sort orders unchanged (detail: `created_at DESC`; index: `brewCount DESC` with alpha tiebreak)
3. ✓ Producer in coffees-list meta — shipped in Bundle A
4. ✓ BMR prefix rename — deferred; "BMR" = "Brewing Master Reference" (prior name for BREWING.md, now a redirect stub)
5. ✓ `url` field cleanup — deferred per Chris's PDF (low value)
6. ✓ Index page changes — none; "Honestly no feedback. Well organized."

## Bundle B scope (exhaustive)

### Substrate change
Add a required `brewGuideStatus: 'official' | 'implied' | 'none'` field to `RoasterEntry`. Classify all 73 entries. Keep `brewGuideSource` + `brewGuideType` as separate provenance fields (where this came from — YouTube, blog, brew card, etc.); only the page-front render gate changes.

### 3-state substrate definition (DRAFT — gate before applying)

These are Claude's draft definitions. Chris's audio ratification is the first thing to ask for in the new session:

- **`'official'`** — Chris has a verified source authored by the roaster on any surface: their published website brew guide, official video / podcast appearance, social channel post they own (Instagram / YouTube), printed brew card bundled with the bag, documented competition appearance. The roaster owns the recipe.
- **`'implied'`** — Chris derived a recipe from community sources: Reddit, brew-card aggregations from third parties, FAQ inferences, structural inference from the roast style + similar peers, brewer competition footage where the roaster wasn't the protagonist. Best estimate, not roaster-verified.
- **`'none'`** — no recipe known, official or implied.

Open ambiguity: how to classify `Direct (brew card)` (Dongzhe), `Direct (social)` (Thankfully), `Direct (community)` (Oma) — does "Direct" mean the roaster's own surface (→ official) or any direct interaction (→ implied)? Chris should clarify during the kickoff ratification.

### Render gate fix

`app/(app)/roasters/[slug]/page.tsx:170-181` currently:
```tsx
{entry.brewGuideLink ? (
  <a href={entry.brewGuideLink} target="_blank" ...>{entry.brewGuideLink.replace(...)}</a>
) : (
  <span className="font-sans text-sm">No official brew guide</span>
)}
```

Replace with a 3-branch status switch:
- `status === 'official'`: today's link path when `brewGuideLink` present; OR fallback prose `Official guide — {brewGuideType}` when no link captured (Picolot / Drop / Center / Five Elephant pattern — 14 roasters today)
- `status === 'implied'`: render `Implied recipe — sourced from {brewGuideType}` with a status differentiator. Exact wording to ratify with Chris during kickoff.
- `status === 'none'`: render `No recipe recorded` (replaces today's misleading "No official brew guide")

Keep `<LabelledField>` rows for `houseStyle` + `extractionPurpose` below the gate-rendered block. No structural change beyond the gate.

### Files to modify

| File | Change |
|---|---|
| `lib/roaster-registry.ts` | Add `brewGuideStatus` field to `RoasterEntry` interface (line ~61-107) + add classification to each of 73 entries |
| `app/(app)/roasters/[slug]/page.tsx` | Render gate fix at lines ~170-181 (Brewing Philosophy block) |
| `docs/taxonomies/roasters.md` | Document the new field; add `brewGuideStatus` column to canonical entry tables |
| `CLAUDE.md` | Lines 99 (21→73), 150-151 (70→73, also field count 29→30), add `brewGuideStatus` to rich-shape paragraph |
| `lib/synthesis/adapters/roaster.ts` | Optional small add (~3 lines): anchor line surfacing `brewGuideStatus` so the synthesis prompt knows whether the recipe baseline is roaster-verified or community-derived |
| `docs/sprints/shipped.md` | One consolidated row for Sub-sprint 4b covering Bundles A + B (mirrors 4a's single-row pattern) |
| `PRODUCT.md` § Active Sprints #4 | Update sub-row status: 4b SHIPPED (after this PR lands) |

## Execution sequence (suggested for the new session)

### Step 0: Initial session setup
- Read this doc + Phase 2 complementary pass § Bucket E1 + F1
- Verify branch is up to date with main (Bundle A's `178d7a8` should be the tip)
- Read CLAUDE.md § Roasters (lines 146-153) for post-Bundle-A framing

### Step 1: Audio-confirm substrate definitions ⚠️ blocking
Open the session by presenting the draft 3-state definitions to Chris. Get explicit ratification. Specifically clarify:
- Are `Direct (brew card)` / `Direct (social)` / `Direct (community)` → Official or Implied?
- For `implied` status pages, what's the exact wording on the render? "Implied recipe — sourced from {brewGuideType}"? Or something tighter?
- For `none` status, is "No recipe recorded" right? Or "No guide known" / something else?

### Step 2: Draft the classifications table
Author a single new doc at `docs/sprints/sub-sprint-4b-brew-guide-classifications-2026-05-28.md` (or whatever date). One row per of the 73 entries with:
- Roaster name
- Current `brewGuideSource` value (if any)
- Current `brewGuideType` value (if any)
- `brewGuideLink` present? (yes/no)
- Best-guess status (official / implied / none)
- 1-line rationale

Best-guess starting point from Phase 2 doc § E1 (subject to Chris's `Direct (X)` ratification):

| Current value | Likely status | Count |
|---|---|---|
| Official | official | 46 |
| Official / Secondary | official | 1 |
| Official (archived) | official | 1 |
| Direct | official | 1 |
| Direct / Competition | official | 1 |
| Direct (competition/official) | official | 1 |
| Direct (brew card) | TBD (official?) | 1 |
| Archived | official | 1 |
| Unofficial | implied | 6 |
| Unofficial / Aggregated | implied | 2 |
| Inferred | implied | 1 |
| Indirect | implied | 2 |
| Indirect (Rao) | implied | 1 |
| Indirect (FAQ) | implied | 1 |
| Indirect (FAQ + collab) | implied | 1 |
| Direct (social) | TBD (implied?) | 1 |
| Direct (community) | TBD (implied?) | 1 |
| None | none | 3 |
| (unset) | TBD — needs investigation | 3 |

The 3 entries currently lacking `brewGuideSource` need investigation — likely either authoring drift (Chris just hadn't filled it in) or genuinely-unknown. Sample them and surface in the kickoff conversation.

### Step 3: Chris reviews the classifications table
Hand off, let Chris review row-by-row, correct what's wrong. Don't proceed to registry edits until ratified.

### Step 4: Apply classifications
Edit `lib/roaster-registry.ts`:
- Update the `RoasterEntry` interface to add the required field
- Add `brewGuideStatus: '<status>'` to each of 73 entries

The interface edit is small (one new property in the type). The per-entry edits are mechanical but voluminous — be patient + don't risk a typo mid-application. The TS build will fail loudly if any entry is missing the new required field, which is the type-safety property to lean on.

### Step 5: Render gate fix
Edit `app/(app)/roasters/[slug]/page.tsx:170-181`:
- Replace the `brewGuideLink ? ... : 'No official brew guide'` ternary with the 3-branch status switch
- Use the exact Implied / None wording ratified in Step 1
- Keep the existing structural shape (the brew guide row's parent `<div className="mb-3 last:mb-0">` + the source suffix render flow)

### Step 6: docs/taxonomies/roasters.md
Add `brewGuideStatus` to the documented canonical schema. The doc has per-family entry tables — add the column there too. This is the substrate doc that flows to claude.ai via the MCP Resource — needs the same field-level coverage as the registry.

### Step 7: CLAUDE.md drift fixes (same PR)
- Line 99: `21 canonical names` → `73 canonical names`
- Line 150: `70 canonical roasters` → `73 canonical roasters`; field count `29` → `30`
- Line 151: `wires the 70 canonicals` → `wires the 73 canonicals`
- Add `brewGuideStatus` to the rich-shape field list in line 150's paragraph

### Step 8 (optional): synthesis adapter touch
`lib/synthesis/adapters/roaster.ts` line ~16-19 has the strategyTag / bmrHouseStyle anchor. Add 3 lines surfacing `brewGuideStatus` so the synthesis prompt has the official-vs-implied context when reasoning about the recipe baseline. Small, low-risk add.

### Step 9: Six-actor cross-check before opening PR
Per CLAUDE.md sprint cadence #4:
- **Actor 6** (UI + lib): primary; all edits above
- **Actor 5** (Claude Code): CLAUDE.md updated
- **Actor 4** (MCP): no Tool surface change (roaster registry data is read-only on the MCP side via the `docs://taxonomies/roasters.md` Resource — claude.ai sees the new column on next session refresh; no Tool catalog update)
- **Actor 3** (claude.ai): same — Resource catalog content updates, Tool catalog unchanged
- **Actor 2** (prompts): no `docs/prompts/*.md` flows reference brewGuideSource today; no change
- **Actor 1** (Chris): visual verification per the spec below

Also run `npm run check:mcp-bundle` even though no new Resources land — cheap sanity.

### Step 10: Sprint-close housekeeping
- Add a consolidated Sub-sprint 4b row to `docs/sprints/shipped.md` covering both Bundle A and Bundle B (mirror 4a's single-row pattern at line ~9)
- Update `PRODUCT.md` § Active Sprints #4: 4b SHIPPED; sub-sprint 4c (next read-path target) promotes to next-active per the series plan

### Step 11: Build + verify + commit + PR + merge
- `ln -sf ../../../node_modules node_modules` (worktree symlink for tsc)
- `npx tsc --noEmit` — strict TS check (must pass with the new required field across 73 entries)
- `rm node_modules` before commit
- Preview verification on the verification spec below
- Commit + push + open PR
- Wait for Vercel preview SUCCESS
- Squash merge (gh's local checkout step will error with the cowork "main is already used by worktree" warning; the remote merge succeeds anyway — verify via `gh pr view`)

## Verification spec (Bundle B)

**Render-gate render-target spot-check** — the 14 false-negative entries Bundle B specifically fixes:

| Roaster | Pre-Bundle-B render | Expected post-Bundle-B |
|---|---|---|
| Drop Coffee Roasters | "No official brew guide" | `Official guide — Website / PDF` |
| Picolot (Brian Quan) | "No official brew guide" | `Official guide — YouTube` |
| Five Elephant Coffee | "No official brew guide" | `Official guide — Video / Website` |
| Center Coffee | "No official brew guide" | `Official guide — In-store / Image` |
| Dongzhe | "No official brew guide" | TBD (Official vs Implied per Step 1 ratification) |
| VWI by CHADWANG | "No official brew guide" | `Official guide — Competition / Community` (or per ratification) |
| Shoebox Coffee | "No official brew guide" | `Implied recipe — sourced from YouTube + Brew Cards` |
| September Coffee | "No official brew guide" | `Implied recipe — sourced from Reddit + Community` |
| H&S Coffee Roasters | "No official brew guide" | `Implied recipe — sourced from Community (Reddit)` |
| Thankfully Coffee | "No official brew guide" | TBD (Implied? per ratification) |
| Oma Coffee Roaster | "No official brew guide" | TBD per ratification |
| Little Wolf Coffee | "No official brew guide" | `Implied recipe — sourced from Collab / Community` |
| Finca Coffee (Coffee Libre) | "No official brew guide" | `Implied recipe` (TBD: implied vs none) |
| Switch Coffee | "No official brew guide" | TBD: implied vs none |

**None-status spot-check** (these should NOT show recipe info post-fix):

| Roaster | Expected post-Bundle-B |
|---|---|
| TM Coffee | `No recipe recorded` |
| Colibri Coffee Roasters | `No recipe recorded` |
| Untold Coffee Lab | `No recipe recorded` |

**Control** (unchanged behavior):

| Roaster | Expected post-Bundle-B |
|---|---|
| Tim Wendelboe | Today's path: `timwendelboe.no/pages/...` link + `(Official)` suffix — unchanged |
| Hydrangea Coffee | Today's path: link + `(Official)` suffix — unchanged |
| Picolot Bundle-B-only entry (3-state retention check) | `Official` status retains link path |

**Verify** Additional Information > Roaster Metadata still shows `brewGuideSource` + `brewGuideType` (provenance preserved; only the page-front render gate changed).

**TS strict-build check** — the new required field will fail the build on any unclassified entry; that's the type-safety net.

## What's deferred to Sub-sprint 4c or later

Carry-forward from Phase 2 doc § Bucket G (do NOT include in Bundle B):
- B1.b coffees list section reorder (defended; section #6 stays)
- B1.c sort-order changes (both correct)
- D1 BMR prefix rename (deferred)
- A5 `url` field (deferred)
- G3 synthesis card position (no signal for change)
- G4 mobile full pass (tablet spot-check only in Bundle B)
- G5 per-roaster deep archive sub-view
- G6 family color tokens (System vs Varies hue proximity)
- B2 richer Processes Explored cross-link block (punt to Sub-sprint 4f)

## Open questions to surface in the kickoff conversation

1. Ratify the 3-state definitions verbatim (or correct the wording)
2. Classify the 5 ambiguous current values: `Direct (brew card)` / `Direct (social)` / `Direct (community)` / `Inferred` / `Indirect` — official, implied, or different?
3. Exact render wording for `implied` and `none` paths — keep the drafts, or adjust?
4. Should a small visible status pill (e.g. `<Tag>`) be rendered to differentiate `implied` from `official`, or is the prose differentiation enough?
5. For the 3 entries with no `brewGuideSource`, are they unknowns (→ none) or authoring drift (→ pick a status based on knowledge)?

## Reference: relevant memory files

- [feedback_autonomy.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_autonomy.md) — autonomy rule applies post-ratification; before then = ask, don't ship
- [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md) — substrate definitions are interpretive calls Chris owns
- [feedback_cross_system_audit.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_cross_system_audit.md) — six-actor audit before PR
- [feedback_sprint_closeout_roadmap_currency.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_sprint_closeout_roadmap_currency.md) — move out of Active Sprints + add shipped.md row same PR
- [feedback_canonical_registry_picker.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_canonical_registry_picker.md) — registry editing discipline

## Bundle A precedent (commit message + PR template)

Bundle A's commit message at `178d7a8` and PR #281 description follow the standard project format. Bundle B should match shape:

- Title: `Sub-sprint 4b Bundle B: brewGuideStatus 3-state substrate + render gate fix`
- Body sections: Summary / Substrate definitions / Per-affected-roaster verification / Cross-system audit / Sprint close (shipped.md row + PRODUCT.md update)

## Sub-sprint 4b series-close housekeeping

When Bundle B's PR opens, it's also the closing PR for Sub-sprint 4b. That means:

1. `docs/sprints/shipped.md` gets one row covering both bundles (date `2026-05-28` or whatever Bundle B's actual ship date is, name `**Sub-sprint 4b — Roasters polish bundle (Bundles A + B)**`, body describing both). Mirror 4a's pattern at the top of shipped.md.
2. `PRODUCT.md` § Active Sprints #4 — flip 4b sub-row to SHIPPED; promote next sub-sprint to active (the next read-path target per the series plan)
3. The Bundle A complementary pass doc + this handoff doc remain in `docs/sprints/` as the audit trail

## Closing note

The substrate changes here are small mechanically but require Chris's interpretive input on the 3-state definitions + the ~5 ambiguous classifications. Run Step 1 fully before any registry edit — that's the only gate that matters. Everything downstream is straight execution.
