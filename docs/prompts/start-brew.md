New coffee. Fetch the Master Coordinator catalog via
read_doc(uri="docs://skills/coordinator/catalog.md") to identify available
knowledge clusters. For brewing equipment knowledge (brewer / filter / grinder /
SWORKS dial behavior), dispatch to the Brewing Equipment Expert
(docs://skills/brewing-equipment-expert/cluster/). For WBC competitor recipe
anchors + cross-cutting control patterns (Step 1d Named Consideration: "WBC
corpus + cross-cutting control patterns check"), dispatch to the WBC Brewing
Archivist (docs://skills/wbc-brewing-archivist/cluster/wbc-reference.md +
docs://skills/wbc-brewing-archivist/cluster/wbc-recipes.md — Wave 2 PR 1, ADR-0011).
Then fetch BREWING.md via read_doc(uri="docs://brewing.md"). Run Step 1 Coffee
Brief; pause at Step 1d for strategy + modifier confirmation before producing
the recipe. Follow BREWING.md's lookup discipline for any canonical-registry
fields.

Coffee URL:
Dose: 15g
Brewing location: [Home or Office]
Reference experience (optional):
Roaster brew guide URL (optional):
