# TODO

Project roadmap and planned improvements for Pokémechanics.

---

## 🔥 High Priority

Next: Fix Open Graph metadata

- Since migrating to cloudflare these previews no longer work:
  https://opengraph.dev/panel?url=https%3A%2F%2Fwww.pokemechanics.app%2Fpokemon%2Fpikachu-kalos-cap%2Fx-y%2Fkalos-central

### Rate Limiting & API Optimization

**Context:** PokeAPI has a 100 calls/hour per IP rate limit. Each page requires ~10 API calls. Bot/crawler traffic was causing 429 (Too Many Requests) errors.

#### 📋 Short-term Fixes (Planned)

#### 🚀 Long-term Solutions (Future)

**Status:** Research phase
**Estimated Effort:** High (20-40 hours)

- [ ] **Local PokeAPI cache** - Download and cache PokeAPI data locally in a database
  - Eliminates external API dependency for static data
  - Options: PostgreSQL, SQLite, or JSON files
  - Requires sync strategy for PokeAPI updates
- [ ] **Redis/KV caching layer** - Add distributed cache for API responses
  - Reduces duplicate API calls across deployments
  - Options: Vercel KV, Upstash Redis, or self-hosted

---

### Increase test coverage

- React Testing Library for testing hooks and components.
- Write failing tests for bugs below. Then implement the fixes to have passing tests:
  - Choosing Version group "colosseum" -> Venusaur shows Mega-Venusaur sprite by default instead of regular sprite.

---

## 📚 Medium Priority

### 1. Add ESLint Configuration

**Status:** 📋 Planned

**Description:**
Set up ESLint with Next.js recommended rules to catch common errors and enforce code consistency.

**Setup:**

```bash
npm install -D eslint eslint-config-next
```

Create `.eslintrc.json`:

```json
{
  "extends": "next/core-web-vitals"
}
```

**Estimated Effort:** Medium (2-3 hours)

---

### 3. Add Inline Code Documentation

**Status:** 📋 Planned

**Description:**
Add JSDoc comments to complex functions and utilities:

- `src/constants/spriteUrlTemplates.ts` - Sprite URL generation logic
- Evolution chain traversal helpers
- GraphQL query builders
- State management utilities

**Estimated Effort:** Medium (3-4 hours)

---

## 🚀 Future Ideas

### 4. Centralize Configuration

Create `/src/config/` with:

- API endpoint constants
- Environment variable schema validation (Zod)
- Feature flags

### 5. Performance Improvements

- Add bundle analyzer
- Optimize image loading strategies
- Implement incremental static regeneration (ISR) for Pokémon pages
- Add service worker for offline support

### 6. New Features (Not all accessible via current PokeAPI)

- Add Shiny sprites
- Use Type images from api (Game-Specific images) instead of local static images
- Add "Bag" page and route "/bag" for searching items in the current game they are playing:
  - What items do, where to find them
  - Medicines, Berries, Balls, Machines, Machines
- Add "Map" page and route "/map" for searching locations in the current game
  - What pokemon are encountered there?
  - What items are found there?
  - What trainer battles happen there? (Trainers and Gym Leaders)
  - What NPC trades can be made there?
- Comparison tool (compare two Pokémon side-by-side)
- Add a database: Add user accounts
  - Add User Sign Up, Login, and Auth
  - Add User Team/Party Builder
  - User can set current game(s) they are playing.
  - Add "Walkthroughs" where users can author/publish their own walkthroughs
- Add "Walkthrough" page where visitors can search walkthroughs for the current game they are playing

### 7. Issues (Missing from PokeAPI)

- In-game NPC Trades (Only encounters for some pokemon)
- Trophy Garden - Daily Pokemon in Generation IV (diamond-pearl, platinum)
- No enounter data beyond Sun-Moon generation
- Fossil revived Pokemon (No data in evolution chain on which fossils to use)

---

**Last Updated:** 2025-11-07
