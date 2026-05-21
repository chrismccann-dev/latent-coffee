# Roest Firmware — Per-Version Notes

Operator-stub doc per [Roest Knowledge SKILL.md](../../SKILL.md). Placeholder for per-firmware-version behavioral notes when Roest behavior changes across versions.

---

## Promotion criteria

A new file `<version>.md` earns a spot here when:

1. **Firmware version change introduces a behavioral change** affecting the machine (thermal behavior / control surface / probe readings) OR the API (accepted formats / endpoint shapes / response schemas)
2. The change is **documented** by Roest (release notes) or **observed empirically** (Chris compares pre- and post-update behavior on the same coffee)
3. The change is **non-cosmetic** (a UI tweak that doesn't affect Chris's roasts doesn't warrant a file)

---

## Current state

No per-version files. Forward investment per cluster spec.

Examples of what might land here in future Pattern B sessions:
- `v3.2.md` — "Bean-temp end-condition trigger latency reduced to <0.1s (was ~0.5s)"
- `v3.3.md` — "Fan curve interpolation changed from linear to cubic"

When the first version-specific behavior lands, file as `<version>.md` and link from here.

---

## Cross-links

- [cluster/api/quirks.md](../api/quirks.md) — API quirks (firmware-independent; machine-firmware vs. cloud-API).
- [cluster/machine/counterflow-observations.md](../machine/counterflow-observations.md) — current machine behavior on the current firmware.
