-- 082_green_beans_intake_hypothesis_roast_priority.sql — pre-roast design + roast-queue ordering
--
-- intake_hypothesis: operator/Coordinator pre-roast design hypothesis captured at
-- inventory intake (anchor profile + confidence, drop ceiling, V1 inlet spread,
-- FC-marking plan, density/process gating, brew-direction lean). Nullable — NOT
-- required at intake (a lot can sit in inventory with no hypothesis). A STARTING
-- SNAPSHOT, not canon: the Roasting Coordinator regenerates a live derivation from
-- the anchor profiles + green specs at roast-design time. Distinct from
-- additional_notes (processing/history catch-all).
--
-- roast_priority + roast_priority_rationale: the in_inventory "what to roast next"
-- soft stack-rank. Stored (not derived) so the /green inventory section can sort by
-- it without an LLM call at render; the Roasting Coordinator refreshes it on demand.
-- Lower roast_priority = roast sooner (1 = next up); NULL = unranked. Both columns
-- land now (Phase 1); the Coordinator write path + index ordering arrive in Phase 2.

ALTER TABLE public.green_beans
  ADD COLUMN IF NOT EXISTS intake_hypothesis text,
  ADD COLUMN IF NOT EXISTS roast_priority integer,
  ADD COLUMN IF NOT EXISTS roast_priority_rationale text;

INSERT INTO public.applied_migrations (filename)
  VALUES ('082_green_beans_intake_hypothesis_roast_priority.sql') ON CONFLICT (filename) DO NOTHING;
