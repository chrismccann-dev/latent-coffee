Use when a PURCHASED brew is finished. **HARD GATE — STOP before STEP 1
if this brew is self-roasted.** Self-roasted brews (`roaster: "Latent"`,
or brewed from a coffee with a `green_bean_id` in the Latent app) push via
`close-lot.md` STAGE 4 as part of lot close-out — NOT through this prompt.
A push_brew here on a self-roasted lot creates an orphan brew row that the
architecture explicitly routes elsewhere. Recovery from accidental push:
patch_brew to update the row, but prefer not pushing in the first place.

**Self-roasted detection at session start** (do this BEFORE any other STEP):
ask "is this brew from a coffee Chris roasted himself?" Signals: explicit
"self-roasted" or "Latent" framing in the user message, batch # references,
a roast date instead of a roaster purchase date, the coffee URL pointing
at a green-bean source (Sweet Maria's, Showroom, Untold green) rather than
a finished-roast roaster. If self-roasted, STOP — give Chris the handoff
context (recipe + tasting arc + brewing-side learnings worth carrying into
the lot record), and tell him to run `close-lot.md` (or `one-shot-closeout.md`
if `green_beans.is_one_shot=true`) in the roasting thread instead.

At session start (after the self-roasted gate clears), fetch the Master
Coordinator catalog via read_doc(uri="docs://skills/coordinator/catalog.md")
to identify available knowledge clusters. For brewing equipment validation
(brewer / filter / grinder / SWORKS dial behavior), dispatch to the
Brewing Equipment Expert (docs://skills/brewing-equipment-expert/cluster/).
For WBC competitor recipe references and cross-cutting control patterns,
dispatch to the WBC Brewing Archivist
(docs://skills/wbc-brewing-archivist/cluster/ — Wave 2 PR 1, ADR-0011).

Complete this brew session: push_brew first, then propose any doc updates.
If you have feedback for Claude Code on either path, mention it.

STEP 1 - push_brew. Treat fields as final, no confirmation. Validation
errors aggregate in one response - fix all in one retry round. For canonical
lookups call read_canonical(axis: "<name>"). For net-new roaster / producer /
brewer / filter / grinder, set *_override: true (the override path also queues
the value for canonical promotion via taxonomy_overrides_queue; push_brew echoes
queued_for_taxonomy_review[] in the response). Cultivars and terroirs are
strict (no override) — net-new requires a registry edit or a propose_canonical_addition
call. Capture the brew_id from the success response.

When the source coffee's process detail indicates sealed-container / no-headspace /
Grain-Pro-at-low-moisture fermentation execution, set fermentation_qualifiers: ['Anoxic']
on push_brew (Sprint T3 / CR-5 / migration 059, 2026-05-18). Canonical via
FERMENTATION_QUALIFIER_LOOKUP; aliases No Oxygen / Zero O2 / Oxygen Free resolve to
Anoxic. Record-when-known annotation — does not dictate strategy (aggregation stays
at the [Anaerobic] modifier per CONTEXT.md § Qualifier). Omit (leave as []) when not
applicable or not knowable from the source.

STEP 2 - propose_doc_changes for lessons from this session. source =
{kind: "brew", id: "<brew_id from STEP 1>"}. BEFORE drafting any citation,
fetch the live cluster doc with read_doc(uri="docs://skills/<cluster-path>.md")
(or read_doc_section against the same URI) so current_text is verbatim.
target_doc shapes: "skills/<path>.md" for composable sub-skill cluster docs
(canonical post Wave 4 PR 4b — e.g. "skills/wbc-brewing-archivist/cluster/wbc-reference.md"
to amend the WBC reference; validated against the registered SKILL_FILES
allow-list), "roaster/<Canonical Name>" for roaster cards (live at
docs://brewing/roasters.md), or "taxonomies/<axis>.md" for taxonomy edits
(axes: regions, varieties, processes, roasters, producers, flavors,
roast-levels — note: brewers, filters, grinders, sworks have migrated to
the Brewing Equipment Expert cluster; use "skills/brewing-equipment-expert/cluster/<axis>.md").
`'brewing.md'` as target_doc is deprecated post Wave 4 PR 4b per ARBITER.md §
target_doc routing — BREWING.md is now a 3KB redirect stub. Per-citation
target_doc overrides the proposal-level default. For replace, copy
current_text VERBATIM. Multi-citation + multi-target_doc proposals supported.

Most likely targets (all brewing-side learnings now live in cluster docs):

  - target_doc="skills/brewing-historian/cluster/patterns/cross-coffee-insights.md"
    for By Process / By Variety / Cooling Behavior / Office Brewing Notes /
    By Modifier / Open Questions entries
  - target_doc="skills/brewing-historian/cluster/patterns/by-strategy/<strategy>.md"
    for new "Coffees That Confirmed X" data points (clarity-first / suppression /
    balanced-intensity / full-expression / extraction-push / hybrid)
  - target_doc="skills/brewing-historian/cluster/patterns/by-cultivar/<cultivar>.md"
    or by-coffee-family/<family>.md for per-cluster deep-dive patterns
  - target_doc="skills/brewing-assistant/cluster/operational-guide.md" for
    the BREW PROMPT operational guidance (Step 1-4 Coffee Brief / Recipe
    Output / Iteration Loop / Resolved Brew Output Format)
  - target_doc="skills/brewing-equipment-expert/cluster/operational-reference.md"
    (or brewers.md / filters.md / grinder-eg1.md / sworks.md) for equipment-side updates
  - target_doc="skills/wbc-brewing-archivist/cluster/wbc-reference.md" (or
    wbc-recipes.md) for WBC reference updates
  - target_doc="skills/ccil/cluster/coffee/<cultivar-slug>/across-roasting-and-brewing.md"
    for cross-domain (roasting + brewing) patterns
  - target_doc="roaster/<Canonical Roaster Name>" for roaster card updates

Here is the completed archive entry:
[paste the formatted archive recipe]
