# Resource: lib/brewer-registry.ts

Validation mirror for the brewer canonical registry. **Code, not docs** — authored content lives in [../cluster/brewers.md](docs/skills/brewing-equipment-expert/cluster/brewers.md); this pointer surfaces the .ts file as a knowledge-cluster resource without migrating it out of `lib/`.

- **Source:** [lib/brewer-registry.ts](lib/brewer-registry.ts)
- **Exports:** `BREWERS` (rich `BrewerEntry[]`) · `BREWER_LOOKUP` (canonical/alias resolution) · back-compat `BREWER_NAMES` / `BREWER_REGISTRY` / `isCanonicalBrewer` / `findClosestBrewer`
- **Shape:** 46 canonical brewers (12 owned by Chris) + 24 aliases. Material axis (Glass / Porcelain / Ceramic) stripped on canonicalize per the authored decision in [../cluster/brewers.md](docs/skills/brewing-equipment-expert/cluster/brewers.md).
- **Adoption:** `CanonicalTextInput(BREWER_LOOKUP, allowOverride)` on `/add` purchased + `/brews/[id]/edit`. `brews.brewer` is text-only (no FK).
- **Editing rule:** 2-step deliberate edit per CLAUDE.md § Canonical registries — update [../cluster/brewers.md](docs/skills/brewing-equipment-expert/cluster/brewers.md) AND this .ts file in the same commit.
