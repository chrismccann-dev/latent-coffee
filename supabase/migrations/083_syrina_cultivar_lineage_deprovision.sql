-- 083_syrina_cultivar_lineage_deprovision.sql
--
-- FanHua arbiter pass (2026-06-26). The Syrina cultivars row (id
-- 9fd37f6a-aa1a-4804-819f-f66ef3217ded) was minted during the FanHua brew
-- (PR #514/#515) with a provisional lineage placeholder, before genetics were
-- researched. Chris's research confirmed Syrina is a Thai modern hybrid with a
-- complex multi-parent pedigree (Sarchimor, Mundo Novo, Typica, Bourbon, Timor
-- Hybrid) — Modern Hybrids was already the correct family; only the lineage
-- needs de-provisioning. The canonical registry (lib/cultivar-registry.ts) +
-- docs/taxonomies/varieties.md were updated in the same PR; this migration
-- syncs the DB row that the /cultivars index tree + detail page render from
-- (they read genetic_family / lineage off the cultivars table, not the
-- registry). Data-only update; precedent: migrations 026 / 058.
--
-- Scoped by name (not just id) so it is idempotent and re-runnable.

UPDATE public.cultivars
  SET lineage = 'Multi-parent hybrid lineage'
  WHERE cultivar_name ILIKE 'Syrina'
    AND lineage = 'Unresolved (provisional) — pending genetic classification';

INSERT INTO public.applied_migrations (filename)
  VALUES ('083_syrina_cultivar_lineage_deprovision.sql') ON CONFLICT (filename) DO NOTHING;
