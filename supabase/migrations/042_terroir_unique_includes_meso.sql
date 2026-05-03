-- 042_terroir_unique_includes_meso.sql
-- Sprint 2.6 cleanup follow-up (2026-05-02): align the terroirs UNIQUE
-- constraint with the meso-aware matching logic that Sprint 2.6 PR1
-- (#85) added to findOrCreateTerroir.
--
-- Background: PR1 made `matchTerroir` include meso_terroir in the match
-- key (closes R12 silent meso-conflation), but the underlying UNIQUE
-- constraint stayed at (user_id, country, admin_region, macro_terroir).
-- Result: two rows with the same (country, admin, macro) triple but
-- distinct mesos cannot coexist, even though the matching logic treats
-- them as distinct. Surfaced during the post-2.6 cleanup mini-session
-- when 4 brews + 2 green_beans needed distinct (Finca El Paraiso /
-- Las Margaritas) mesos under Colombia / Western Andean Cordillera /
-- "Valle del Cauca / Risaralda / Cauca".
--
-- Fix: extend the UNIQUE constraint to (user_id, country, admin_region,
-- macro_terroir, meso_terroir) with NULLS NOT DISTINCT so a single
-- null-meso row per (country, admin, macro) is still enforced (otherwise
-- Postgres' default null-distinct semantics would allow infinitely many
-- null-meso duplicates). NULLS NOT DISTINCT is a Postgres 15+ feature;
-- this project runs Postgres 17.
--
-- This is purely additive coverage: rows that were valid before are
-- still valid, and rows that the application logic intends to be
-- distinct can now actually be inserted.

ALTER TABLE terroirs
  DROP CONSTRAINT terroirs_user_id_country_admin_region_macro_terroir_key;

ALTER TABLE terroirs
  ADD CONSTRAINT terroirs_user_id_country_admin_macro_meso_key
    UNIQUE NULLS NOT DISTINCT (user_id, country, admin_region, macro_terroir, meso_terroir);
