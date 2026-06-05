# Roest API — Observed Quirks

Operator-stub doc per [Roest Knowledge SKILL.md](docs/skills/roest-knowledge/SKILL.md) — Chris-stubbed-Claude-integrates. Placeholder until Chris encounters a push / pull behavior worth folding.

---

## Promotion criteria

A quirk earns an entry here when:

1. **Behavior is reproducible** (≥2 occurrences, not a one-off)
2. **Behavior diverges from API documentation or push-validation assumptions**
3. **Workaround is non-obvious** (otherwise it goes inline in the relevant `lib/mcp/*` Tool implementation as a code comment)

---

## Current state

No quirks logged. Forward investment per cluster spec.

Examples of what might land here in future Pattern A sessions:
- Profile-push validation rejection patterns (e.g. "msec ordering rejected when 0.000 is sent as floating-point vs. integer")
- Inventory pagination quirks (e.g. "list_roest_inventory returns out-of-order across pages")
- Auth-token retry behavior (e.g. "401 retries with same token succeed after N attempts")

When the first quirk lands, this doc shifts from forward-investment to active.

---

## Cross-links

- [cluster/api/read-surface.md](docs/skills/roest-knowledge/cluster/api/read-surface.md) — Roest API read endpoints.
- [cluster/api/write-surface.md](docs/skills/roest-knowledge/cluster/api/write-surface.md) — Roest API write endpoints.
- [cluster/observed-quirks.md](docs/skills/roest-knowledge/cluster/observed-quirks.md) — machine-side quirks (distinct from API-side; these live one level up).
