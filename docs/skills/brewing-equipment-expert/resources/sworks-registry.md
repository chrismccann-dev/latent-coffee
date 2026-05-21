# Resource: lib/sworks-registry.ts

Validation mirror for the SWORKS Bottomless Dripper valve-dial canonical registry. **Code, not docs** — authored content lives in [../cluster/sworks.md](../cluster/sworks.md); this pointer surfaces the .ts file as a knowledge-cluster resource without migrating it out of `lib/`.

- **Source:** [lib/sworks-registry.ts](../../../../lib/sworks-registry.ts)
- **Exports:** `SWORKS_DRIPPERS` (rich `SworksEntry[]` with `validDials: SworksDialEntry[]`) · `SWORKS_LOOKUP` (dripper-name canonical/alias resolution) · `SWORKS_DIAL_STATE_LOOKUP` (per-dial state vocabulary: Closed / Restricted / Half-Open / Open / Dead Zone / Maximum Flow)
- **Shape:** 1 canonical (SWORKS Bottomless Dripper, office). Useful dials: 0 (Closed) / 5 (Restricted, ~60 sec/100g) / 6 (Half-Open, ~45 sec/100g) / 7 (Open, ~30 sec/100g) / past-7 (Maximum Flow recovery). Dials 1-4 marked `status: 'dead_zone'`.
- **Adoption status:** Vocabulary anchor only — no `brews` schema column references this registry yet. Per-pour valve-dial structure persists in `brews.pour_structure` free-text.
- **Editing rule:** 2-step deliberate edit per CLAUDE.md § Canonical registries — update [../cluster/sworks.md](../cluster/sworks.md) AND this .ts file in the same commit. Adding a second valve-modulated brewer = deliberate registry extension.
