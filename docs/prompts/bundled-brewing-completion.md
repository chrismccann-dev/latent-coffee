Use when a PURCHASED brew is finished. For self-roasted brews, the brew goes
through `close-lot.md` STAGE 4 as part of lot close-out - don't push separately.

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

STEP 2 - propose_doc_changes for lessons from this session. source =
{kind: "brew", id: "<brew_id from STEP 1>"}. BEFORE drafting any citation,
fetch the live doc with read_doc_section(uri, anchor) so current_text is
verbatim. target_doc shapes: "brewing.md" for BREWING.md, "roaster/<Canonical
Name>" for roaster cards (live at docs://brewing/roasters.md),
"taxonomies/<axis>.md" for taxonomy edits (axes: regions, varieties,
processes, roasters, producers, brewers, filters, flavors, grinders,
roast-levels). Per-citation target_doc overrides the proposal-level default.
For replace, copy current_text VERBATIM. Multi-citation + multi-target_doc
proposals are supported.

Most likely sections: By Process, By Variety, Cross-Coffee Insight Layer, Cooling
Behavior, the relevant roaster card, Open Questions.

Here is the completed archive entry:
[paste the formatted archive recipe]
