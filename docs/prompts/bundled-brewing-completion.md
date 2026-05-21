Use when a PURCHASED brew is finished. For self-roasted brews, the brew goes
through `close-lot.md` STAGE 4 as part of lot close-out - don't push separately.

At session start, fetch the Master Coordinator catalog via
read_doc(uri="docs://skills/coordinator/catalog.md") to identify available
knowledge clusters. For brewing equipment validation (brewer / filter / grinder /
SWORKS dial behavior), dispatch to the Brewing Equipment Expert
(docs://skills/brewing-equipment-expert/cluster/). For WBC competitor recipe
references and cross-cutting control patterns, dispatch to the WBC Brewing
Archivist (docs://skills/wbc-brewing-archivist/cluster/ — Wave 2 PR 1, ADR-0011).

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
fetch the live doc with read_doc_section(uri, anchor) so current_text is
verbatim. target_doc shapes: "brewing.md" for BREWING.md, "roaster/<Canonical
Name>" for roaster cards (live at docs://brewing/roasters.md),
"taxonomies/<axis>.md" for taxonomy edits (axes: regions, varieties,
processes, roasters, producers, brewers, filters, flavors, grinders,
roast-levels), or "skills/<path>.md" for composable sub-skill cluster docs
(Wave 2 PR 1+ — e.g. "skills/wbc-brewing-archivist/cluster/wbc-reference.md"
to amend the WBC reference; validated against the registered SKILL_FILES
allow-list). Per-citation target_doc overrides the proposal-level default.
For replace, copy current_text VERBATIM. Multi-citation + multi-target_doc
proposals are supported.

Most likely targets (post-Wave-2-PR-2 the brewing-side cross-coffee learnings
live in the Brewing Historian cluster, NOT BREWING.md):

  - target_doc="skills/brewing-historian/cluster/patterns/cross-coffee-insights.md"
    for By Process / By Variety / Cooling Behavior / Office Brewing Notes /
    By Modifier / Open Questions entries
  - target_doc="skills/brewing-historian/cluster/patterns/by-strategy/<strategy>.md"
    for new "Coffees That Confirmed X" data points (clarity-first / suppression /
    balanced-intensity / full-expression / extraction-push / hybrid)
  - target_doc="skills/brewing-historian/cluster/patterns/by-cultivar/<cultivar>.md"
    or by-coffee-family/<family>.md for per-cluster deep-dive patterns
  - target_doc="roaster/<Canonical Roaster Name>" for roaster card updates
  - target_doc="brewing.md" only for residual BREWING.md sections (Two-Axis
    Framework, Step 1-4 Coffee Brief, equipment reference, WBC reference pointer)

Here is the completed archive entry:
[paste the formatted archive recipe]
