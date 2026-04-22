# SYNC.md — Claude-authored Archive Sync Playbook (V1-brews)

Playbook Claude follows when Chris pastes a resolved-brew archive block from the coffee-brewing Claude project. Validates each field against the canonical registries, writes the brew to Supabase, patches `BREWING.md` where the coffee teaches something new, commits. No UI. Paste-flow runs inside a Claude Code session.

**Inputs:** the paste format defined in [BREWING.md § Step 4](BREWING.md) (Resolved Brew Output Format).
**Outputs:** one new row in `brews` + optional patches to `BREWING.md` + one commit + one squash-merged PR.

---

## Open taxonomy questions (revisit after Reference Taxonomies brainstorm)

The brainstorm may reshape these decisions. When it lands, re-run this section before trusting the playbook.

- **Composite vs. independent terroir lookup.** Post sprint 1d.1, `lib/terroir-registry.ts` exposes 2 `CanonicalLookup`s (country / macro) plus a rich `TERROIRS: TerroirEntry[]` array keyed on (country, admin_region, macro_terroir). Meso and Micro are demoted to free-text (not in the registry, not validated). The archive format writes `Country / Macro Terroir / Meso Terroir` positionally; sync validates slot 1 (country) + slot 2 (macro) against the lookups, and passes slot 3 (meso) through unchanged. Cross-country wrong-combo detection ("Panama / Sidama Highlands") still flows through `canonicalizeMacroTerroir` + `detectDrift` in [lib/brew-import.ts](lib/brew-import.ts) (now backed by the re-exported `TERROIRS`). The dual-registry drift pre-1d.1 is gone; one source of truth.
- **Alias policy.** The factory's tier-0 alias map (added PR #30) returns the canonical target on alias input (`"Geisha"` → `"Gesha"`). `isCanonical` still returns false on the alias. This playbook resolves aliases with a visible diff line + one-line confirmation. Never silent-rewrite. Revisit if the brainstorm defines a stricter or looser policy.
- **Genetic family enforcement.** New-cultivar inserts require a `genetic_family` from `GENETIC_FAMILIES` (5 values, see [lib/brew-import.ts](lib/brew-import.ts)). The newer [lib/cultivar-registry.ts](lib/cultivar-registry.ts) tracks lineages but not families. Playbook today: when a cultivar is new-to-DB, ask Chris for family + lineage before insert. Revisit once the brainstorm settles whether family stays a flat enum or becomes a hierarchy.
- **Field-order expectations.** The archive format lists fields in a fixed order (identity → origin → recipe → tasting → learnings). The parser in [lib/brew-import.ts](lib/brew-import.ts) is order-agnostic (tabbed sections + labeled prose), so the playbook does not depend on position. If the brainstorm introduces a stricter schema, the parser can tighten later.
- **Process + flavor_notes not in Step 4 spec.** `brews.process` and `brews.flavor_notes` are canonical dimensions the sync validates but the paste format (BREWING.md § Step 4) does not surface them as explicit rows. Playbook handles this by asking Chris at sync time (see Phase 2 § "Missing-from-paste fields"). A BREWING.md spec update would parallel F1/F2 from PRODUCT.md — flag for Chris, don't auto-patch.
- **Lot code / roast date / roast machine / roaster tasting notes columns don't exist on `brews`.** The paste format captures these (F2 split); the DB does not. Playbook today: stash lot code + roast date into `classification` as a short string, drop roast machine + roaster tasting notes unless Chris confirms otherwise. Flag for the "Schema additions for dropped source data" sprint (PRODUCT.md queue #3).

---

## Prerequisites

Before starting a sync:

- Confirm you're on a fresh branch off main (never main directly).
- Confirm the Supabase MCP is available — this playbook uses `mcp__supabase__execute_sql` and `mcp__supabase__apply_migration`. If the MCP isn't wired, pause and ask Chris to enable it rather than hand-rolling raw SQL via `psql`.
- Confirm you have the paste block in one contiguous message. If Chris pastes in fragments, ask him to re-paste whole — parsing a reconstructed block is a silent-error risk.

---

## Validator table

The sync validates N canonical fields. Adding a dimension = a row edit here, not a playbook rewrite.

| # | Field                    | Paste source (BREWING.md § Step 4)  | Lookup                                              | Required | On miss   |
|---|--------------------------|-------------------------------------|-----------------------------------------------------|----------|-----------|
| 1 | Roaster                  | `Roaster` row                       | `ROASTER_LOOKUP` ([lib/roaster-registry.ts](lib/roaster-registry.ts))   | yes      | block     |
| 2 | Producer                 | `Producer` row                      | `PRODUCER_LOOKUP` ([lib/producer-registry.ts](lib/producer-registry.ts)) | no       | warn      |
| 3 | Terroir country          | `Terroir` row, position 1           | `TERROIR_COUNTRY_LOOKUP` ([lib/terroir-registry.ts](lib/terroir-registry.ts)) | yes      | block     |
| 4 | Terroir macro            | `Terroir` row, position 2           | `TERROIR_MACRO_LOOKUP` (same file)                  | yes      | block     |
| 5 | Terroir meso             | `Terroir` row, position 3           | none (free-text since sprint 1d.1)                  | no       | pass-through |
| 6 | Cultivar                 | `Cultivar` row                      | `CULTIVAR_LOOKUP` ([lib/cultivar-registry.ts](lib/cultivar-registry.ts)) | yes      | block     |
| 7 | Process                  | Not in Step 4 — see Phase 2         | `getProcessFamily` ([lib/process-families.ts](lib/process-families.ts)) | yes      | block (ask Chris) |
| 8 | Extraction strategy      | `Extraction Strategy` row           | `EXTRACTION_STRATEGIES` ([lib/extraction-strategy.ts](lib/extraction-strategy.ts)) | yes      | block     |
| 9 | Extraction confirmed     | `Extraction Strategy Confirmed` row | same as #8                                          | yes      | block     |
| 10 | Flavor notes (optional) | Not in Step 4 — see Phase 2         | `FLAVOR_LOOKUP` ([lib/flavor-registry.ts](lib/flavor-registry.ts))     | no       | warn (per-note) |

**On miss** semantics:
- `block` — halt sync, show Chris the offending value + `findClosest` suggestion, wait for a decision: (a) accept suggestion, (b) "add to registry" (Chris edits the registry file before resuming), (c) "typo, meant X" (Chris corrects the paste).
- `warn` — write `null` for the field and surface a warning line in the summary. No pause.
- Tier-0 alias hits are a third case: the lookup returns the canonical target, the sync shows a one-line diff (`"Geisha" → "Gesha"`), and Chris says `ok` before the write proceeds. Never silent.

---

## Field → column mapping

Archive paste field → `brews` column (or punt decision).

| Paste field | `brews` column | Notes |
|---|---|---|
| Roaster | `roaster` | validated #1 |
| Coffee Name | `coffee_name` | required, non-empty |
| Lot Code | — | no column. Stash into `classification` as `"Lot PL#015"` if present. Flag for schema-additions sprint (PRODUCT.md #3). |
| Producer | `producer` | validated #2 |
| Roast Date | — | no column. Stash into `classification` alongside Lot Code: `"Lot PL#015 · Roasted 2026-02-15"`. Same punt. |
| Roast Machine | — | no column. Drop unless Chris confirms otherwise. |
| Roaster Tasting Notes | — | no column. Distinct from `flavor_notes` (Chris's observed). Drop unless Chris confirms otherwise. |
| Terroir (Country / Macro / Meso) | `terroir_id` | resolved via `matchTerroir` in [lib/brew-import.ts](lib/brew-import.ts). Insert new `terroirs` row if needed (Chris confirms first). |
| Cultivar | `cultivar_id` | resolved via `matchCultivar` in same file. Insert new `cultivars` row if needed (Chris confirms + provides genetic_family + lineage). |
| Process | `process` | not in Step 4 — ask Chris (Phase 2). |
| Brewer | `brewer` | free text, no canonical lookup today |
| Filter | `filter` | free text |
| Dose | `dose_g` | number, first numeric token |
| Water | `water_g` + `ratio` | "288g (1:16)" → `water_g=288`, `ratio="1:16"`. Compute ratio if missing and dose+water both present. |
| Grind | `grind` | free text (e.g. "EG-1 6.0") |
| Extraction Strategy | `extraction_strategy` | must be canonical |
| Temp | `temp_c` | number. Kettle-management prose ("on base / off base / declining") → append to `bloom` or `pour_structure` if Chris wants it preserved; otherwise drop. |
| Bloom | `bloom` | free text |
| Pour Structure | `pour_structure` | free text |
| Total Time | `total_time` | free text ("~3:00") |
| Aroma | `aroma` | free text |
| Attack | `attack` | free text |
| Mid-Palate | `mid_palate` | free text |
| Body | `body` | free text |
| Finish | `finish` | free text |
| Temperature Evolution | `temperature_evolution` | free text |
| Peak Expression | `peak_expression` | free text |
| What I Learned from This Coffee | `what_i_learned` | free text |
| Extraction Strategy Confirmed | `extraction_confirmed` | canonical strategy string |
| (Flavor notes) | `flavor_notes` | not in Step 4 — ask Chris (Phase 2). |

Columns written on every sync that aren't in the paste:
- `user_id` — from the authenticated session.
- `source` — always `'purchased'` for V1 (self-roasted goes through `/add` until sub-sprint 2).
- `green_bean_id`, `roast_id` — always null for V1.
- `is_process_dominant` — default false unless Chris flags the coffee process-dominant.

Columns not written by this sync (left null or default):
- `roast_connection`, `process_category`, `process_details`, `key_takeaways`, `classification`, `terroir_connection`, `cultivar_connection` — populated later via the edit form or a follow-up pass.

---

## Decision prompts (Claude → Chris, verbatim shapes)

The playbook pauses at these shapes. Each prompt expects one short reply.

### Alias hit (tier-0)
```
Alias: "Geisha" → "Gesha" (cultivar). The paste will be canonicalized to "Gesha" on write.
OK to proceed? (y / no-it's-a-typo / cancel)
```

### Canonical miss on required field
```
Unrecognized <field>: "<value>". Closest match: "<findClosest suggestion, or 'none'>".

Options:
  (a) accept suggestion "<suggestion>"   — rewrite paste, continue
  (b) add to registry                     — I'll pause; you edit lib/<registry>.ts, then say 'resume'
  (c) typo: the correct value is "..."    — paste correction, continue
  (d) cancel sync
```

### Canonical miss on optional field
```
Warning: <field> "<value>" is not canonical. Closest: "<suggestion>".
Writing null and continuing. Say 'fix' to pause instead.
```

### Missing-from-paste (process / flavor_notes)
```
<field> is not in the BREWING.md § Step 4 format but the sync writes it.

For process: suggested from Coffee Name / Roaster Tasting Notes → "<guess>".
Confirm (y) or provide (e.g. "Anaerobic Natural").

For flavor_notes: I can extract candidates from Aroma + Attack + Mid-Palate + Body + Finish,
show you the list, and you accept / edit / skip. Proceed? (y / skip)
```

### New terroir / cultivar insert
```
New <terroir|cultivar> "<name>" not in DB. Registry check:
  - in canonical registry: <yes|no>
  - cross-country / drift warning: <from detectDrift, if any>

For new cultivar, I also need:
  - genetic_family: one of [Ethiopian Landrace Families, Typica Family, Bourbon Family,
    Typica × Bourbon Crosses, Modern Hybrids]
  - lineage: (e.g. "Bourbon (classic)")
  - species: default "Arabica" (confirm or override)

Proceed with insert? (y / skip-brew)
```

### Dedup hit
```
Possible duplicate: an existing brew matches
  roaster="<r>", coffee_name="<n>"
  (existing brew_id: <id>, created <date>).

Aborting sync. Options:
  - this is a re-sync of the same coffee → 'update' (not yet supported in V1 — will punt)
  - different coffee with same name → pass --allow-dup in the next message
  - just stop → 'cancel'
```

---

## Phase-by-phase procedure

### Phase 0 — Load context

1. Read `MEMORY.md` (auto-loaded).
2. Read the current `BREWING.md` (in-repo copy, not Dropbox).
3. Read the five registry files + `lib/brew-import.ts` + `app/api/brews/[id]/route.ts`. Use the PATCH whitelist in the route as the reference list of columns the sync is "allowed" to write.
4. Ask Chris to paste the resolved brew archive block. Single contiguous message.

### Phase 1 — Parse

1. Call `parseSpreadsheetRow` from [lib/brew-import.ts](lib/brew-import.ts). It handles tabbed-section paste + labeled-prose + pipe-delimited, in that priority. If it returns null, do NOT ad-hoc re-parse — stop and ask Chris which format to use.
2. For a BREWING.md § Step 4-shaped paste (labeled prose, `- Field: value` bullets), the labeled-prose branch takes it. Note: the `LABEL_ALIASES` map already covers roaster / producer / cultivar / terroir fields but does NOT yet cover "Lot Code", "Roast Date", "Roast Machine", or "Roaster Tasting Notes". These fields will fall through to the unhandled bucket. Playbook handles them in Phase 2 as supplementary stash candidates.
3. Emit the parsed `BrewPayload` inline as a fenced JSON block so Chris can eyeball it before validation runs. Flag any field where the parse landed nothing (null / empty).

### Phase 2 — Validate (canonical registries)

For each row in the Validator Table:

1. Run `isCanonical` on the parsed value.
2. If true → pass, continue.
3. If false → run `findClosest`. If it returns non-null and the value matches a tier-0 alias, emit the Alias prompt. Otherwise emit the Canonical-miss prompt (block vs warn per the table).
4. For the Terroir row (3 slots in one string), split on `/` and validate each slot independently. Surface each miss separately.
5. Run `detectDrift` from [lib/brew-import.ts](lib/brew-import.ts) as a cross-check for cross-country terroirs and lineage/family mismatches on the cultivar — these are drift cases the per-slot lookups don't catch.
6. Handle missing-from-paste fields (process, flavor_notes) with the Missing-from-paste prompt. These block (process) or optional-warn (flavor_notes) per the table.
7. When all gates pass, emit a one-screen summary of the validation outcome for Chris's final `ok to write` confirmation.

### Phase 3 — Idempotency check

Before any INSERT:

```sql
SELECT id, created_at, coffee_name
FROM brews
WHERE user_id = '<chris's user_id>'
  AND roaster = '<canonical roaster>'
  AND lower(coffee_name) = lower('<canonical coffee name>')
```

If any row returns, emit the Dedup-hit prompt. V1 does not support updates — an "update existing" flow lives in a future sprint. If Chris confirms it's a different coffee with the same name (legitimate — e.g. two Moonwake naturals called "Peach Oolong" from different harvests), he passes `--allow-dup` in his reply and the sync proceeds. V1 does NOT auto-dedup by lot_code because lot_code isn't a DB column yet.

### Phase 4 — Persist

1. Call `persistBrew` from [lib/brew-import.ts](lib/brew-import.ts) with `opts: { confirmNewTerroir: true, confirmNewCultivar: true }` (both already confirmed via Phase 2). `persistBrew` handles terroir + cultivar find-or-create and the final `brews` insert.
2. Surface the returned `brewId`, `terroirId`, `cultivarId`, `createdTerroir`, `createdCultivar` flags.
3. If `persistBrew` returns `{ ok: false, code: 'db_error', message }`, do NOT auto-retry. Show Chris the message and pause.

If the Supabase MCP path is being used directly (not through `persistBrew`), mirror its shape — `mcp__supabase__execute_sql` with one INSERT into `terroirs` (if new), one into `cultivars` (if new), one into `brews`. Run each statement separately so a failure halfway leaves a diagnosable state, not a rolled-back blank.

### Phase 5 — BREWING.md patch scope

The end-of-coffee review in [BREWING.md § End-of-coffee document review](BREWING.md) names 6 candidate sections. Default-evaluate all six. For each, emit a proposed diff or "no change".

1. **Roaster Reference** — update if the brew taught something about this roaster's house style. Example trigger: confirmed a BMR strategy tag, revealed a counter-example, added a process-specific note.
2. **Archive Patterns § Coffees That Confirmed <strategy>** — append a bullet if the coffee confirmed an extraction strategy the section didn't already document. Add data points to existing bullets if the type is already listed.
3. **By Variety** — append a bullet if the variety is new to the section, or extend an existing entry if this brew added a data point (different lineage / terroir / process combo).
4. **By Process** — update the row in the Process table if this brew produced an exception worth flagging, or confirmed a pattern with a new data point.
5. **Office Brewing Notes** — update only if the brew was an office brew AND it taught something equipment-specific (e.g. Kalita draining faster than expected, SWORKS valve behavior).
6. **Open Questions** — update only if the brew resolved or partially resolved a listed question, or surfaced a new one.

For each section, the prompt to Chris is "propose edits or say 'no change' — don't force a patch." Never patch a section unless the brew's learnings genuinely concern it. Six small "no change" replies is a normal outcome.

Emit each proposed patch as a unified diff block so Chris can approve / modify / reject individually before writing.

### Phase 6 — Commit, push, PR, merge

1. Stage the `BREWING.md` patch (if any) — do NOT commit the Supabase INSERT (it's already on the server, not in git).
2. Draft a commit message of the shape:
   ```
   SYNC: <roaster> <coffee name> — brew_id <uuid> + BREWING.md <sections>
   ```
   If no BREWING.md patch, `SYNC: <roaster> <coffee name> — brew_id <uuid> (no BREWING.md edits)`.
3. Push, open PR titled `SYNC: <roaster> <coffee name>`, body includes:
   - Link to the new brew in the app (`/brews/<id>`).
   - List of registry lookups performed (including aliases / corrections / new-insert flags).
   - List of BREWING.md sections touched or explicitly skipped.
   - Rollback runbook reference.
4. Squash-merge with `gh pr merge --squash --delete-branch -R chrismccann-dev/latent-coffee` per Chris's memory rule (worktree + gh interaction).

---

## Rollback runbook

If a sync lands a wrong row and needs to be undone:

1. **Identify the brew_id.** From the PR body, the commit message, or `SELECT id, roaster, coffee_name FROM brews ORDER BY created_at DESC LIMIT 5`.
2. **Revert the git commit.** `git revert <sync-sha>` on a new branch. This undoes the BREWING.md patch only — it does NOT affect Supabase.
3. **Compensating DELETE via Supabase MCP.** Run:
   ```sql
   DELETE FROM brews
   WHERE id = '<brew_id>'
     AND user_id = '<chris's user_id>'
   RETURNING id, coffee_name;
   ```
   Expect exactly one row returned.
4. **If the sync also inserted a new terroir or cultivar** (Phase 4 flagged `createdTerroir: true` / `createdCultivar: true`), decide whether to roll those back too:
   - If no other brews reference the new row, DELETE it: `DELETE FROM terroirs WHERE id = '<id>' AND user_id = '<chris>'`.
   - If other brews reference it, leave it. Re-running the sync later would find-or-create against the same row.
   Check with `SELECT count(*) FROM brews WHERE terroir_id = '<id>'` first.
5. **Verify.** `SELECT id FROM brews WHERE id = '<brew_id>'` returns 0 rows.
6. **Push the revert PR.** Same merge flow as the forward sync. Title: `REVERT SYNC: <roaster> <coffee name> (brew_id <uuid>)`.

Never `git revert` without the compensating DELETE — the brew stays in Supabase and the app will keep showing it, but the BREWING.md claim that it was archived goes away, which is strictly worse than either "both there" or "both gone."

---

## Dry-run findings (Picolot Emerald PL#015 Mokka Natural)

Traced through the playbook on paper against the sample referenced in PRODUCT.md F1/F2 (also in [BREWING.md § Coffees That Needed Full Expression](BREWING.md)). Did not hit the DB, did not open a PR — the goal was to surface gaps in the playbook, not to actually sync the coffee.

Findings:

- **Cultivar registry is missing "Mokka".** The paste would have `Cultivar: Mokka`. `CULTIVAR_LOOKUP.isCanonical("Mokka")` returns false. `findClosest("Mokka")` returns "Mokkita" (substring match) — which is the exact pairing Chris's guidance specifically warns against (Mokka ≠ Mokkita, see BREWING.md § By Variety). The Canonical-miss prompt would fire correctly and Chris would choose (b) "add to registry" — edit `CULTIVAR_NAMES` in [lib/cultivar-registry.ts](lib/cultivar-registry.ts) to add "Mokka", and add an entry to `CULTIVAR_REGISTRY` in [lib/brew-import.ts](lib/brew-import.ts) with genetic_family "Bourbon Family" and lineage "Bourbon (classic)". **Action item for step (d):** this is likely to be the first real decision the dog-food sprint surfaces — Chris should pre-decide whether Mokka is a Bourbon Family classic Bourbon lineage or deserves its own lineage entry.
- **Producer "Gissell & Lily Garrido, Emerald Farm" is not in the registry.** `PRODUCER_LOOKUP.isCanonical` returns false. `findClosest` returns "Mama Cata Estate / Garrido Specialty Coffee" (substring on "Garrido"), which is a different entity (Mama Cata is the farm network; the Garridos are the producers). Producer is a warn-level field per the table, so the sync would write null and continue — but the warning is genuinely load-bearing here because "Garrido" is a frequently-recurring name across the archive (Mokkita DRD, Dark Room Dry Natural Gesha, etc.) and they deserve a canonical entry. **Action item:** consider promoting producer to block-level for V1 dog-food and deciding on the add-to-registry flow in-session, so the archive doesn't accumulate null producers on lots Chris actually cares about.
- **Roast Date / Lot Code / Roast Machine / Roaster Tasting Notes all fall through `parseSpreadsheetRow`'s `LABEL_ALIASES`.** They're present in the paste (post-F2) but unrecognized by the parser. Playbook handles them in Phase 2 as stash candidates into `classification`, but this is a real parser gap — the `LABEL_ALIASES` map should be extended before the dog-food sprint so these land without a manual pass.
- **Process row is missing.** As flagged in Open Questions. The Picolot Emerald paste would have no explicit Process field. Playbook asks Chris at sync time, and the Coffee Name "Emerald" doesn't signal process — he'd have to know the lot is a Natural (which the brew confirms — "fruit development" in what_i_learned). **Action item:** propose adding a `Process` row to BREWING.md § Step 4 as a follow-on spec fix, parallel to F1/F2.
- **Flavor notes are derivable from Aroma + Attack + Mid-Palate + Body + Finish.** The Picolot Mokka brew mentions "green grape attack, candied honeydew sweetness, rosemary on cooling" — a Claude-assisted extraction step can pull `["Green Grape", "Honeydew Candy", "Rosemary"]` and validate each against `FLAVOR_LOOKUP`. "Green Grape" is close to "Grape" (canonical) via substring match; "Honeydew Candy" is not in the registry at all (closest: none); "Rosemary" is not in the registry. The warn-level behavior means the sync writes the array with only the canonical hits, and flags the non-canonical ones in the summary for Chris to decide: add-to-registry, drop, or write-as-is. This is the intended behavior per the "keep data, classify on render" precedent from the flavor-canonicalization sprint.
- **Dedup check against (roaster="Picolot", coffee_name="Emerald")** — if a prior sync already landed the same brew, it blocks. If Chris has a second Picolot Emerald from a different lot / roast date, he'd pass `--allow-dup`. Works as designed.
- **BREWING.md patch scope.** The Picolot brew is already represented in BREWING.md § Coffees That Needed Full Expression with a full paragraph. A second sync of the same coffee would propose "no change" for that section. The Roaster Reference entry for Picolot is already written; By Variety § Mokka is already written. The expected patch set is empty for a dog-food re-run of this coffee — which is the correct outcome and a useful sanity check. A novel backlog brew will propose actual patches.

These findings reshape the dog-food sprint in three concrete ways:
1. Chris pre-decides Mokka's genetic_family + lineage before starting step (d).
2. Extending `LABEL_ALIASES` to cover the post-F2 fields (Lot Code / Roast Date / Roast Machine / Roaster Tasting Notes) is a parser tweak that probably wants to land before dog-food, not during.
3. The "promote Producer to block" question is a scope call Chris makes before the first real sync — the answer shapes how many times a single dog-food sync pauses.

---

## What this playbook does NOT do (V1 scope bounds)

- Does not write any code or Supabase migration. Registry extensions are hand-edits Chris does between sync pauses.
- Does not update the `/brews` UI, the synthesis endpoints, or any API route. The sync writes to `brews` and the app's existing read paths surface the new row automatically.
- Does not handle self-roasted brews. Sub-sprint 2 covers that.
- Does not auto-extract flavor_notes without Chris's approval of each candidate.
- Does not scrape the roaster product page, the Dropbox originals, or any external source. All source data comes from the pasted block.
- Does not rewrite BREWING.md structurally. Only appends / extends existing sections.
- Does not run as a cron, a webhook, or a UI paste box. Chris pastes into a Claude Code session; Claude drives the phases.
