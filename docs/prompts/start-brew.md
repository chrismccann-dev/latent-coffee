New coffee. Fetch the Master Coordinator catalog via
read_doc(uri="docs://skills/coordinator/catalog.md") to identify available
knowledge clusters. For the full BREW PROMPT operational guidance (Step 1 Coffee
Brief + Step 2 Recipe Output + Step 3 Iteration Loop + Step 4 Resolved Brew
Output Format), fetch
read_doc(uri="docs://skills/brewing-assistant/cluster/operational-guide.md").
For brewing equipment knowledge (brewer / filter / grinder / SWORKS dial
behavior + Location Constraints + Equipment + Valve + Filter System + Example
Outputs), dispatch to the Brewing Equipment Expert
(docs://skills/brewing-equipment-expert/cluster/operational-reference.md +
brewers.md + filters.md + grinder-eg1.md + sworks.md). For WBC competitor
recipe anchors + cross-cutting control patterns (Step 1d Named Consideration),
dispatch to the WBC Brewing Archivist
(docs://skills/wbc-brewing-archivist/cluster/wbc-reference.md +
docs://skills/wbc-brewing-archivist/cluster/wbc-recipes.md). For canonical
lookups, call read_canonical Tool with the axis name per
docs://skills/coordinator/operator-guide.md § Canonical taxonomy lookups. Run
Step 1 Coffee Brief; pause at Step 1d for strategy + modifier confirmation
before producing the recipe.

Coffee URL:
Dose: 15g
Brewing location: [Home or Office]
Reference experience (optional):
Roaster brew guide URL (optional):
