-- Sprint MCP feedback batch 1: strategy_notes free-text column on brews.
--
-- Surfaced 2026-04-29 via push_brew dog-food: extraction_strategy is a strict
-- 5-value enum (Suppression / Clarity-First / Balanced Intensity / Full
-- Expression / Extraction Push) but Chris's prose carries within-strategy
-- gradient context ("Balanced Intensity (lower edge)") + miscellaneous
-- recipe nuance that doesn't fit the enum and shouldn't be stuffed into
-- `classification` (which is the lot-code + roast-date stash).
--
-- Free-text by design — no canonical registry, no validation. Sits next to
-- extraction_strategy + extraction_confirmed as the third axis of strategy
-- discussion: extraction_strategy = canonical pick, extraction_confirmed =
-- divergence-from-planned (free-text), strategy_notes = within-strategy
-- gradient + miscellany (free-text).
--
-- Writeable today via push_brew (V2 MCP) + PATCH /api/brews/[id] (V1 /edit).
-- App UI render on /brews/[id] + /brews/[id]/edit form input deferred to a
-- follow-up UI sprint.

ALTER TABLE brews ADD COLUMN strategy_notes text;

COMMENT ON COLUMN brews.strategy_notes IS
  'Free-text within-strategy gradient + miscellaneous recipe nuance that doesn''t fit the canonical extraction_strategy enum (e.g. "lower edge of Balanced Intensity"). Distinct from extraction_confirmed (cross-strategy divergence) and classification (lot-code stash).';
