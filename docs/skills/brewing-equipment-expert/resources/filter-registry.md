# Resource: lib/filter-registry.ts

Validation mirror for the filter paper canonical registry. **Code, not docs** — authored content lives in [../cluster/filters.md](../cluster/filters.md); this pointer surfaces the .ts file as a knowledge-cluster resource without migrating it out of `lib/`.

- **Source:** [lib/filter-registry.ts](../../../../lib/filter-registry.ts)
- **Exports:** `FILTERS` (rich `FilterEntry[]` ~23 fields per entry) · `FILTER_LOOKUP` (canonical/alias resolution) · back-compat `FILTER_NAMES` / `isCanonicalFilter` / `findClosestFilter`
- **Shape:** 64 canonical filters (22 owned) + 34 aliases. Size variants (S/M) and Cafec roast-pack-size duplicates collapsed on canonicalize per [../cluster/filters.md](../cluster/filters.md).
- **Adoption:** `CanonicalTextInput(FILTER_LOOKUP, allowOverride)` on `/add` purchased + `/brews/[id]/edit`. `brews.filter` is text-only (no FK).
- **Sibarist drift handling:** Brewer-aware migration (bare "Sibarist FAST" / "Sibarist FAST Cone" maps to FLAT FAST / CONE FAST / UFO FAST depending on brewer pairing); migration 032 used per-row WHERE clauses for ambiguous strings.
- **Editing rule:** 2-step deliberate edit per CLAUDE.md § Canonical registries — update [../cluster/filters.md](../cluster/filters.md) AND this .ts file in the same commit.
