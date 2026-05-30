// Shared "Process Breakdown" row builder for the /processes sub-pages that
// decompose a process into canonical axes (modifier-combo + signature).
// Drops empty axes (SspStructure renders every row it's given) and wraps each
// chip name into the { name } shape SspStructure expects — the return type is
// structurally assignable to StructureRow[] without importing the Ssp type into
// lib (keeps the dependency arrow pointing component → lib).

export interface BreakdownAxis {
  lbl: string
  chips: readonly string[]
}

export function buildBreakdownRows(axes: BreakdownAxis[]): { lbl: string; chips: { name: string }[] }[] {
  return axes
    .filter((axis) => axis.chips.length > 0)
    .map((axis) => ({ lbl: axis.lbl, chips: axis.chips.map((name) => ({ name })) }))
}
