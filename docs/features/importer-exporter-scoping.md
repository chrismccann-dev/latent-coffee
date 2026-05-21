# Importer / exporter as a future canonical axis — scoping

**Status:** scoping only — implementation deferred.
**Decision target:** how (or whether) Latent should model coffee importers and exporters as a typed canonical axis distinct from the producer axis.
**Authored:** 2026-05-18, Sprint T3 / CR-3, in response to Round 4 of the 2026-05-16 canonical-registries grilling session ([followups](../sprints/grilling-2026-05-16-canonical-registries-followups.md) #3) and as the architectural sibling of the [CR-2 Nordic Approach alias removal](../taxonomies/producers.md).

This doc weighs three options for an axis Latent does not currently model, names the concrete pain that surfaced it, sets out what data already exists vs. what would be net-new, and proposes a deferred default. It does not propose a registry, a schema migration, or a Tool. Implementation lands in a follow-up sprint if and when the pain crosses the threshold.

---

## 1. The concrete pain

The brewing corpus has 79 rows as of 2026-05-13. Across that corpus, two distinct kinds of entity show up under the `brews.producer` column today:

1. **Actual producers** — the farmers, washing stations, exporting groups, or estates that grew, processed, and dried the cherry. 120 of these are registered canonically in [lib/producer-registry.ts](../../lib/producer-registry.ts) ([authored markdown](../taxonomies/producers.md)) with a tier-scoped coverage strategy and an `allowOverride` escape hatch for net-new entries.

2. **Importers and exporters** — companies that sourced the green from the producer, brought it across an ocean, and sold it to a roaster. These are NOT producers, but historically the brew picker had no other slot for them, so a small number drifted into `brews.producer` and got canonicalized as if they were producers.

The drift surfaced concretely in the sprint 1l producer canonicalization pass (migration 031, 2026-04-26). One of the six collapses applied at that time was:

```
Nordic Approach → Mekuria Mergia & Elias Rooba
```

Nordic Approach is a Norwegian green-coffee importer founded in 2010 that sources high-end East African lots. They are not a producer; they don't grow coffee, they buy and import it. The collapse landed on the legitimate producer of the one affected brew (`Ethiopia Burtukaana Goro Bedesa`, Substance Café roast) only because Mekuria Mergia & Elias Rooba IS one of Nordic Approach's Ethiopian sourcing partners. The collapse was coincidentally correct; it could just as easily have collapsed onto the wrong producer.

The alias was removed in Sprint T3 / CR-2 (2026-05-18). Going forward, `producer = "Nordic Approach"` fails canonical resolution and surfaces in the override queue rather than silently re-collapsing onto the wrong axis. But this fix only addresses the alias side of the data error — it doesn't give importers and exporters a place to live. A future brew sourced through Nordic Approach has no clean slot to record that fact.

Chris-framed at the 2026-05-16 grilling: "maybe in some sense I probably should [model importers/exporters], but I don't." The Nordic Approach alias error was the trigger for the question; the answer is the subject of this doc.

---

## 2. What already exists in the model

The producer registry's `ProducerEntry` shape ([lib/producer-registry.ts:55-95](../../lib/producer-registry.ts)) already carries two relationship arrays:

```ts
exporters: string[]   // optional: known exporters this producer ships through
importers: string[]   // optional: known importers this producer ships through
```

These are **typed metadata**, NOT canonical entries. They're free-text strings that describe the producer's outbound supply chain at the producer level. For example, the `Mekuria Mergia & Elias Rooba` entry records:

```ts
exporters: ["Wete Ambela"],
importers: ["Nordic Approach"],
```

That is correct relational metadata — Wete Ambela exports for them, Nordic Approach imports from them. The shape is right; the entries are not validated, not autocompleted, not surfaced in a registry, and not stored on individual brew rows. They exist as descriptive content on a producer card.

39 of 120 producer entries (33%) populate `importers`; 41 (34%) populate `exporters`. Coverage is uneven and Tier-1-biased.

---

## 3. The three options

### Option A — New canonical axis with its own registry

Mirror the existing producer / roaster / brewer / filter pattern:

- `docs/taxonomies/importers.md` + `docs/taxonomies/exporters.md` as authored markdown
- `lib/importer-registry.ts` + `lib/exporter-registry.ts` as validation mirrors
- New `brews.importer text` + `brews.exporter text` columns (no FK; same shape as `brews.roaster`)
- `ImporterEntry` + `ExporterEntry` rich shapes (~10-15 fields per entry — name / country / founding-year / specialty / partner producers / partner roasters / notes)
- `push_brew` Zod accepts both fields with the established `CanonicalLookup` + `allowOverride` pattern

**Coverage strategy:** tier-scoped, same as producer + roaster. The global green-coffee importer count is probably 200-500 entities Chris would care about; the Latent-relevant subset is much smaller.

**Pros:**
- Clean separation — never again can an importer drift into the producer slot
- Forward-investment matches the championship-mode sourcing pipeline (WBC sourcing on competition lots routes through specific importers)
- Plays well with the existing alias / override / validation-mirror discipline

**Cons:**
- Two new axes to maintain (not one — importer and exporter are structurally distinct roles in the supply chain even when the same company does both)
- Coverage authoring is a multi-session research load (analogous to the producer 1l sprint at 120 entries)
- 79-brew corpus today populates importer/exporter information sparsely — most brews would carry empty fields for years before the axis pays off
- Two-axis decomposition adds complexity to `/add` purchased step 5 / `/brews/[id]/edit` (deprecation candidates already; see [feedback_mcp_only_input.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_only_input.md))

**Sizing:** Large (~M-L on each of 2 sprints — taxonomy authoring + schema + Tool + UI). Heavier than the 1l producer sprint because two registries land together.

### Option B — Elevate ProducerEntry.importers + .exporters to typed canonicals

Keep the existing field shape but tighten validation: the strings inside `producer.importers[]` and `producer.exporters[]` must resolve to a canonical list. The canonical list lives in [lib/importer-registry.ts](../../lib/importer-registry.ts) + [lib/exporter-registry.ts](../../lib/exporter-registry.ts) but ONLY as validation lookups (no rich entries, no rich detail pages, no brew-level columns).

Brew-level attribution stays at the producer level; the importer / exporter relationship is recoverable by joining `brews.producer` → `producer-registry.ts` → `producer.importers[]`.

**Pros:**
- Smallest schema footprint — no new `brews` columns
- Closes the immediate drift class (a write of `producer = "Nordic Approach"` still fails canonical, surfacing the override queue, but the registry now knows what Nordic Approach is and can suggest "this looks like an importer, not a producer")
- Reuses existing canonical-registry plumbing (`makeCanonicalLookup`, `CanonicalTextInput allowOverride`)
- Coverage strategy can be self-only-at-first (only the importers / exporters Chris has actually encountered)

**Cons:**
- Loses lot-level fidelity — when a producer ships through multiple importers, the brew row can't distinguish which importer's lot landed in the cup. For Tier 1 sourcing decisions this matters: the same Mekuria Mergia lot might come through Nordic Approach (Norway-routed) vs. The Coffee Quest (Netherlands-routed) and the green handling differs.
- Doesn't extend cleanly to brews without a producer attribution (a single-origin blend or a brew where the producer is genuinely unknown but the importer is)
- Adds a validation surface that's not surfaced in the UI today — the rule "producer.importers[] must be canonical" lives only in the registry build, not in the picker (the existing producer picker has no importer field to validate against)

**Sizing:** Medium (~S-M, one sprint — two skinny registries + validation in the producer-registry build step).

### Option C — Unmodeled forever, but flagged

Accept that importer / exporter is permanently a producer-card metadata field — not a brew-row attribute, not a canonical axis. The Nordic Approach alias-class drift is prevented by:

1. The producer-axis override queue (`taxonomy_overrides_queue`) — `producer = "Nordic Approach"` no longer auto-collapses; it surfaces for Chris-as-arbiter review
2. The arbiter playbook ([ARBITER.md](../../ARBITER.md)) — Chris hand-routes the row to "this is an importer, please re-identify the actual producer"
3. The existing `producer.importers[]` + `producer.exporters[]` free-text fields on the producer registry — kept for descriptive context but never promoted to canonical

**Pros:**
- Zero schema work, zero new registries, zero new sprint queue items
- Matches the standing principle that Latent models what Chris encounters in the cup, not the global coffee supply chain
- Forces the override queue to do the work it was designed for (catching drift at write time rather than at canonicalization time)

**Cons:**
- The next Nordic-Approach-class drift still surfaces in the override queue as a no-action item (Chris confirms it's an importer, marks the row as "producer unknown / importer = Nordic Approach", and the importer information has no permanent home)
- Sourcing-pipeline reasoning (especially around WBC competition lots that route through specific importers) stays in prose docs / lot names rather than queryable structured data
- Doesn't scale if Chris's sourcing model shifts from "I bought this roaster's bag" to "I'm buying greens through specific importers" — at that point the cost of retrofitting an importer axis onto an established corpus is higher than the cost of adding it now

**Sizing:** Zero (default unless one of A or B is selected).

---

## 4. Recommendation — Option C (unmodeled, deferred)

**The standing reason for deferral:** Chris's brewing corpus today is roaster-anchored, not importer-anchored. 79 brews; importer information is recoverable from the producer card in ~33% of rows (the ones with `ProducerEntry.importers` populated) and irrelevant to brewing recipe design in 100% of rows. Modeling an axis now to solve a 1-row historical drift would be the textbook "designing for hypothetical future requirements" mistake the [CLAUDE.md tone-and-style rule](../../CLAUDE.md) calls out.

**The override queue is the right place to catch this class of drift.** Sprint T3 / CR-2 already made that surface load-bearing: `producer = "Nordic Approach"` now fails canonical and surfaces in the queue. Chris-as-arbiter resolves the entry on a case-by-case basis with the right interpretation in hand at that moment.

**Forward triggers — when to revisit Option A or B:**

1. **Sourcing-model shift.** If Chris begins sourcing greens directly through importers (i.e. buying green himself rather than through roasters' finished bags), the importer relationship becomes load-bearing for the brewing model. At that point Option A's lot-level fidelity earns its keep.

2. **Override-queue drift accumulates.** If the `taxonomy_overrides_queue` collects ≥5 importer-class entries within a year, that's evidence the drift is recurring and the override queue is doing maintenance work an axis would automate.

3. **WBC sourcing structured-data need.** If [docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md](../skills/wbc-roasting-archivist/cluster/sourcing/strategy.md) (migrated from `docs/roasting/wbc-sourcing.md` in Wave 2 PR 1, 2026-05-26) reaches a point where importer attribution is querying-relevant for sourcing decisions (e.g. "show me all lots that came through Red Fox in the past 2 years"), the Option A queryability becomes worth the schema cost.

4. **Cross-system audit catches a quiet drift.** If a future grilling session surfaces that producer attributions have continued drifting onto importer names even with the override queue in place (i.e. Chris is bypassing the queue and pasting through), the friction model isn't working and a hard structural separation is the right response.

Until one of those triggers fires, the existing `ProducerEntry.importers[]` + `.exporters[]` fields stay as free-text descriptive metadata on the producer card and the brew row stays at `producer` only.

---

## 5. What landed in Sprint T3 / CR-2 (the alias removal)

The full Sprint T3 / CR-2 alias-removal fix is documented in the [producers.md changelog](../taxonomies/producers.md) under the 2026-05-18 entry. Briefly: the `Nordic Approach → Mekuria Mergia & Elias Rooba` alias was removed from `PRODUCER_ALIASES` ([lib/producer-registry.ts](../../lib/producer-registry.ts)) with a load-bearing comment block in its place explaining why. The DB rename had already happened in migration 031 (April 2026) and landed on the legitimate producer of the affected lot, so no DB re-identification was needed. The `Mekuria Mergia & Elias Rooba` producer entry continues to record `importers: ["Nordic Approach"]` as the real relationship.

This means a future write attempt of `producer = "Nordic Approach"` will:

1. Fail canonical resolution
2. Surface in `taxonomy_overrides_queue` (or be rejected at the strict-validation surface, depending on which write path is used)
3. Prompt Chris-as-arbiter to re-identify the actual producer of the lot — Nordic Approach is the importer, not the producer

The override queue is the load-bearing mechanism for catching the next instance.

---

## 6. Open questions for the future implementation sprint (if any)

If trigger 1, 2, 3, or 4 above fires, the implementation sprint will need to answer:

- **One axis or two?** Importer and exporter are structurally distinct (an exporter sells from origin to importer; an importer sells from importer-side to the roaster), but in practice the same company often does both. Latent might land "supply chain partner" as a single axis with a `role` enum, or two parallel axes. The producer-registry CSV pattern suggests two axes; the brew-row footprint suggests one.

- **Where does it sit relative to the producer?** A brew row would have `producer` + `importer` + `exporter` (3 axes) or `producer` + `supply_chain_partner` (2 axes). The latter is cheaper but loses role attribution.

- **Coverage strategy.** Tier-scoped like producer (60-70%), self-only like grinder (just what Chris encounters), or owned-comprehensive like brewer (full coverage of a finite scope)? Probably tier-scoped, but the tier definition is different — Tier 1 importers are global (Red Fox, Nordic Approach, The Coffee Quest, La Cabra's own importing arm) rather than per-origin.

- **Backfill scope.** Re-walk the 79 existing brews and populate importer/exporter where recoverable? Or net-new only? Per the migration 031 sprint 1l precedent (which backfilled aggressively), backfill probably wins.

None of these need answering today. They're the agenda for the future sprint that earns the axis.

---

## Sources

- [docs/sprints/grilling-2026-05-16-canonical-registries-followups.md](../sprints/grilling-2026-05-16-canonical-registries-followups.md) — Round 4 surfacing the unmodeled axis; followup item #3
- [docs/taxonomies/producers.md](../taxonomies/producers.md) — current producer registry incl. importer/exporter relational metadata
- [lib/producer-registry.ts](../../lib/producer-registry.ts) — `ProducerEntry` shape definition (importers / exporters fields)
- Migration 031 (2026-04-26) — the sprint 1l producer canonicalization that introduced the Nordic Approach alias
- [docs/features/taxonomy-overrides-queue.md](./taxonomy-overrides-queue.md) — the override queue that catches future Nordic-Approach-class drift
- [ARBITER.md](../../ARBITER.md) — the queue-resolution playbook
- [CONTEXT.md](../../CONTEXT.md) § Canonical Registries — the four-way coverage strategy framing
