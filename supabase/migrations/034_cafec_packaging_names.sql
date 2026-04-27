-- Sprint 1f follow-up: Cafec filter papers gain their packaging-printed
-- T-XX codes (T-92 light, T-90 medium, T-83 dark, plus the "+" on Abaca+).
-- Only the 5 owned variants rename; non-owned Cafec papers stay as-is.
--
-- The owned Abaca+ entry (APC1-100W) was deduped from the registry during
-- sprint 1f because it shared a canonical name ("CAFEC Abaca Cup 1 Cone
-- Paper Filter") with the not-owned AC1-100W entry. The Python generator
-- used last-row-wins on canonical name, and AC1 came after APC1 in the
-- source CSV, so AC1 won. Renaming APC1 to "CAFEC Abaca+ Cup 1 Cone Paper
-- Filter" lets both coexist as distinct canonicals.
--
-- Four other owned Cafec papers (LC4 / MC1 / DC1 / LC1) gain their T-XX
-- packaging codes — pure rename, no DB impact since none of these names
-- appear in brews.filter.
--
-- Only 1 DB row affected (the Cafec Abaca paper used on the Orea brew,
-- previously aliased "CAFEC Abaca Plus" → "CAFEC Abaca Cup 1 Cone Paper
-- Filter" via sprint 1f migration 032; now resolves to the owned APC1
-- entry).

UPDATE brews
SET filter = 'CAFEC Abaca+ Cup 1 Cone Paper Filter'
WHERE filter = 'CAFEC Abaca Cup 1 Cone Paper Filter';
