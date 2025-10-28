# TODO

Project roadmap and planned improvements for Pokémechanics.

---

## 🔥 High Priority

### Rate Limiting & API Optimization

**Context:** PokeAPI has a 100 calls/hour per IP rate limit. Each page requires ~10 API calls. Bot/crawler traffic was causing 429 (Too Many Requests) errors.

#### ✅ Immediate Fixes (Completed)

- [x] **Add robots.txt** - Control crawler behavior and prevent bot abuse
  - 360-second crawl-delay (calculated from 100 calls/hour ÷ 10 calls/page)
  - Block AI training bots (GPTBot, Claude-Web, anthropic-ai, etc.)
  - Block aggressive SEO crawlers (AhrefsBot, SemrushBot, SerpstatBot, etc.)
  - Allow legitimate search engines (Googlebot, Bingbot) with rate limiting
  - Allow meta-webindexer for social media link previews
  - Explicitly allow only valid pokedex/version-group combinations
  - Include sitemap reference for search engines
  - **Note:** Disabled CloudFlare managed robots.txt to ensure custom rules apply
- [x] **Add comprehensive sitemap** - Created `app/sitemap.ts` with 39,557 valid URLs
  - Generation-based filtering with maxPokemonId overrides for remakes
  - Gen 1 games only include Pokemon 1-151
  - BDSP only includes Pokemon 1-493 (not full Gen 8)
  - Single PokeAPI call cached for 24 hours
  - Includes national + regional dex URLs for all 25 version groups
  - Priority scoring for popular Pokemon (starters, legendaries)
  - Prevents invalid URLs (e.g., Greninja in Gen 1 games, Tornadus in BDSP)
- [x] **Increase ISR caching** - Increased from 1 hour to 24 hours (`revalidate = 86400`)
  - Pokemon data is static, longer cache times are safe
  - Significantly reduces API calls to PokeAPI
  - Applied to all dynamic Pokemon and Pokedex pages
- [x] **Add retry logic** - Implement exponential backoff (1s, 2s, 4s) for 429 errors in all API helpers
- [x] **Consolidate duplicate fetches** - Wrapped all fetch helpers with React `cache()` to deduplicate requests
  - Eliminates duplicate API calls between `generateMetadata()` and page components
  - Reduces ~2 API calls per page load (~20% reduction)
  - Applied to all 9 fetch helpers (REST and GraphQL)
- [x] **Add generateStaticParams** - Pre-generate 360 popular Pokemon pages at build time
  - 66 priority Pokemon (starters, legendaries, fan favorites)
  - 6 popular version groups (scarlet-violet, sword-shield, red-blue with national/regional dex)
  - Eliminates runtime API calls for most visited pages
  - Improves page load performance significantly
- [x] **CloudFlare CDN & Bot Protection** - Deployed CloudFlare as edge protection layer
  - Cache rules configured for Pokemon pages (24h), static assets (7d)
  - Bot Fight Mode enabled for automated bot detection
  - 90%+ cache hit rate after warm-up period (24-48 hours)
- [x] **CloudFlare Worker - Smart Bot Throttling** - Deployed `cloudflare-worker.js`
  - Allows verified bots (Googlebot, Bingbot) to crawl but rate limits them
  - Returns 429 with Retry-After: 60 when bots exceed 10 uncached requests/minute
  - Cached requests pass through instantly (no throttling)
  - Humans never throttled
  - Bots naturally slow down, preventing PokeAPI 429 errors
  - Created `CLOUDFLARE_WORKER_SETUP.md` with deployment guide

#### 📋 Short-term Fixes (Planned)

**Status:** Ready to implement
**Estimated Effort:** Low (1-2 hours)

- [ ] **Optimize request patterns** - Review and reduce unnecessary nested fetches in components
- [ ] **Monitor CloudFlare cache performance** - Track cache hit rate and bot throttling effectiveness
  - Target: 90%+ cache hit rate
  - Target: <1% 429 errors from PokeAPI

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
- [ ] **Edge caching** - Implement proper Cache-Control headers for CDN caching
  - Leverage Vercel Edge Network or Cloudflare
  - Cache static assets and API responses at edge locations

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

**Estimated Effort:** Low (1 hour)

---

### 2. Create CONTRIBUTING.md

**Status:** 📋 Planned

**Description:**
Document how to contribute to the project, including:

- How to add new routes/features
- Code conventions and patterns
- Component organization guidelines
- Git workflow and PR process

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

## ✅ Completed

### Testing & Quality

- [x] **Testing Infrastructure** - Established comprehensive testing framework with Vitest and Playwright
  - **142 unit tests** covering all utility functions and business logic (100% coverage for src/utils and src/lib)
  - **4 E2E tests** including regional variant edge cases (Hisuian Typhlosion, Alolan Raichu)
  - Created `e2e/README.md` with best practices and patterns
- [x] **Test Coverage Improvements** - Added tests for GraphQL API utility and refactored unreachable code in weight conversion

### Architecture & Performance

- [x] **Component Reorganization** - Moved route-specific components to co-located `app/` directories
- [x] **React Query v5 Migration** - Upgraded from v3 to v5 with new API patterns
- [x] **GraphQL v1beta2 Migration** - Upgraded to cleaner schema without `pokemon_v2_` prefix
- [x] **API Configuration** - Centralized all endpoints in `src/constants/apiConfig.ts`
- [x] **State Management** - Improved cookie and local storage state handling
- [x] **Remove Apollo Client** - Consolidated on React Query for all data fetching

### Bug Fixes & Optimization

- [x] Fix memory leak in AutocompleteBase
- [x] Remove duplicate Move/Moves components
- [x] Optimize Suspense boundaries
- [x] Fix invalid version group URLs - Gracefully redirect `/pokedex/971` to `/pokedex` instead of crashing
- [x] Handle variant Pokemon in metadata - Fixed form-suffixed Pokemon names (e.g., "tornadus-incarnate")
- [x] **Regional Variant Pokemon Fixes** - Comprehensive fix for Alolan, Galarian, Hisuian, and Paldean forms
  - Created `getBasePokemonName()` helper to strip regional suffixes before species API calls (fixes 404 errors)
  - Created `getVariantPokemonName()` helper to determine correct variant based on region
  - Updated `page.tsx` to detect and use correct variant names for Pokemon data and GraphQL queries
  - Fixed encounters for regional variants (e.g., Alolan Rattata now shows encounters in Sun/Moon)
  - Updated sitemap generation to include variant URLs (e.g., `/pokemon/rattata-alola/sun-moon/original-melemele`)
  - Added region mapping for all version groups with regional variants (Gen 7-9)

### Documentation

- [x] Create comprehensive README.md
- [x] Create CloudFlare Worker deployment guide - `CLOUDFLARE_WORKER_SETUP.md`

### SEO & Social Media

- [x] **Open Graph & Twitter Card meta tags** - Added comprehensive social media meta tags
  - Regional variant support (Alolan, Galarian, Hisuian, Paldean)
  - Game-specific sprites using `getSpriteUrl()`
  - Enhanced titles: "Raichu (Alolan) - Sun Moon (Original Alola Pokédex)"
  - Detailed descriptions mentioning version group and Pokédex name
  - Proper fallback metadata if Pokemon data fetch fails
  - Images display correct variant sprites in link previews on Facebook, Twitter, WhatsApp, etc.

---

**Last Updated:** 2025-10-27
