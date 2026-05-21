# Resource: lib/grinder-registry.ts

Validation mirror for the grinder canonical registry. **Code, not docs** — authored content lives in [../cluster/grinder-eg1.md](../cluster/grinder-eg1.md); this pointer surfaces the .ts file as a knowledge-cluster resource without migrating it out of `lib/`.

- **Source:** [lib/grinder-registry.ts](../../../../lib/grinder-registry.ts)
- **Exports:** `GRINDERS` (rich `GrinderEntry[]` with `validSettings: GrinderSettingEntry[]`) · `GRINDER_LOOKUP` (canonical/alias resolution) · `isResolvableSetting(grinder, setting)`
- **Shape:** 1 canonical (EG-1, Weber Workshop, ULTRA SSP burrs, 80mm flat) with 51 enumerated settings (3.0-8.0 in 0.1 steps); 16 carry rich content (D50 / zone / extraction behavior / use case). Status flags: `needs_fresh_measurement` (6.6) and `anomalous` (7.0).
- **Adoption:** `CanonicalTextInput(GRINDER_LOOKUP, allowOverride)` + `<GrindSettingInput>` on `/add` purchased + `/brews/[id]/edit`. Two-axis decomposition on `brews`: `brews.grinder` (canonical) + `brews.grind_setting` (canonical setting value).
- **Editing rule:** 2-step deliberate edit per CLAUDE.md § Canonical registries — update [../cluster/grinder-eg1.md](../cluster/grinder-eg1.md) AND this .ts file in the same commit. Adding a new grinder = registry edit + new `validSettings` enumeration.
