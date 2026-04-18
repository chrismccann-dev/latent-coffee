# Latent Research — Web UI Kit

Recreation of the Next.js app at `latent-coffee/` as a client-side click-through prototype.

**Entry:** `index.html` — boots into the Brews index after a stub login. Navigate via the header; click book covers to see a detail; `+ ADD` opens the self-roasted wizard stub.

**Files:**
- `index.html` — app shell + React root + routing.
- `styles.css` — all component styles (mirrors `app/globals.css` + Tailwind patterns).
- `data.js` — fake seed data: brews, terroirs, cultivars, green beans.
- `components/Chrome.jsx` — `Header`, `Footer`, `BrandLockup`, `BrewCover`, `StrategyPill`, `FilterChips`.
- `components/Pages.jsx` — page-level components: `BrewsPage`, `BrewDetailPage`, `TerroirsPage`, `TerroirDetailPage`, `CultivarsPage`, `GreenPage`, `GreenDetailPage`, `LoginPage`, `AddWizardPage`.

**Coverage:**
- Login screen
- Brews index (book-cover grid) with Strategy filter
- Brew detail (hero cover, coffee details, terroir, cultivar, recipe, sensory, peak expression, takeaways, what I learned)
- Terroirs index (grouped by country) + detail (synthesis + coffee list)
- Cultivars index (grouped by genetic family)
- Green beans list + detail (roast log table + learnings)
- Add wizard (9-step self-roasted flow)
- Header, Footer, empty states, strategy pills, tags, section cards (light + dark)

Persistence: current route is saved in `localStorage.lc_route`. Logout by clearing `lc_auth`.
