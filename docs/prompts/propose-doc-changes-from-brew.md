Take the lessons from this brewing session and propose doc updates via
propose_doc_changes. If you have feedback for Claude Code on the proposal
path, mention it.

BEFORE drafting any citation, fetch the live document so current_text is
verbatim from what's deployed (project-uploaded copies may have drifted):

  - Brewing Historian cluster (post-Wave-2-PR-2 home for By Process / By Variety /
    Cross-Coffee Insight Layer / Cooling Behavior / Office Brewing Notes / By
    Modifier / Open Questions / per-strategy "Coffees That Confirmed X" /
    per-cultivar / per-coffee-family content):
      read_doc_section(uri="docs://skills/brewing-historian/cluster/patterns/cross-coffee-insights.md", anchor="<Section Name>")
      read_doc_section(uri="docs://skills/brewing-historian/cluster/patterns/by-strategy/<strategy>.md", anchor="<Section Name>")
      read_doc_section(uri="docs://skills/brewing-historian/cluster/patterns/by-cultivar/<cultivar>.md", anchor="<Section Name>")
    target_doc is "skills/brewing-historian/cluster/patterns/<path>.md".

  - BREWING.md residual sections (Two-Axis Framework / Step 1-4 Coffee Brief /
    equipment reference / WBC reference pointer): read_doc_section(uri="docs://brewing.md",
    anchor="<Section Name>"). If anchor doesn't resolve, call
    list_doc_sections(uri="docs://brewing.md") to find the verbatim header.
    section_anchor must match a header verbatim (case-sensitive, no leading #).
    target_doc is "brewing.md".

  - Roaster cards live in docs/brewing/roasters.md, NOT BREWING.md. Fetch
    read_doc_section(uri="docs://brewing/roasters.md", anchor="<Canonical
    Roaster Name>"). Verify the canonical roaster name via read_canonical(
    axis: "roasters") if unsure. target_doc for these citations is
    "roaster/<Canonical Roaster Name>".

  - Taxonomy edits (rare from a brew session - new flavor alias, new
    producer entry): read_doc_section(uri="docs://taxonomies/<axis>.md",
    anchor="<Section>"). Doc-path axes: regions, varieties, processes,
    roasters, producers, brewers, filters, flavors, grinders, roast-levels.
    target_doc is "taxonomies/<axis>.md".

For replace operations, copy the existing text VERBATIM from the fetched
section into current_text so the arbiter detects drift. For append /
prepend, omit current_text unless a positional hint is helpful.

Submit as a single multi-citation propose_doc_changes call with source =
{kind: "brew", id: "<brew_id>"}. Per-citation target_doc overrides the
proposal-level default; one proposal can update a roaster card +
BREWING.md archive bullet + Open Questions entry simultaneously.

Most likely sections from a brew session: By Process, By Variety, Archive
Patterns (relevant strategy section), Cooling Behavior, the relevant
roaster card, Open Questions.
