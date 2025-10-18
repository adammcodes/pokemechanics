# TODO

Project roadmap and planned improvements for Pokémechanics.

---

## 🔥 High Priority

### 1. Improve Test Coverage for Edge Cases

**Status:** 📋 Planned

**Description:**
Expand E2E test coverage to include edge cases and scenarios that are prone to problems and rely on more complex parts of the codebase, particularly regional variants and version-specific sprite handling.

**Target Scenarios:**

1. **Regional Variant - Legends Arceus**
   - Game: Legends Arceus
   - Dex: Hisui Dex
   - Pokemon: Typhlosion (Hisuian form)
   - Verify: Correct Hisuian sprite is displayed (not Johto form)

2. **Regional Variant - Sun/Moon**
   - Game: Sun/Moon
   - Dex: Any regional dex (Alola, Melemele, Akala, Ulaula, Poni)
   - Pokemon: Raichu (Alolan form)
   - Verify: Correct Alolan sprite is displayed (not Kanto form)

**Implementation Notes:**

- Follow established E2E patterns from `e2e/search-pokemon.spec.ts`
- Use `data-testid` attributes for reliable element selection
- Wait for `.animate-spin` to be detached before verifying content
- Scope selectors to components using `data-testid` attributes
- Verify sprite images load with correct variant-specific `data-testid`

**Why These Tests Matter:**

- Regional variants rely on complex logic in `findVarietyForRegion`
- Sprite selection for variants uses different code paths
- Sun/Moon has multiple regional dexes (5 different ones)
- These scenarios have historically been prone to bugs
- Tests document expected behavior for future developers

**Success Criteria:**

- ✅ Test navigates to Legends Arceus Hisui Dex
- ✅ Test searches for and selects Typhlosion
- ✅ Test verifies Hisuian Typhlosion sprite loads (not Johto)
- ✅ Test navigates to Sun/Moon regional dex
- ✅ Test searches for and selects Raichu
- ✅ Test verifies Alolan Raichu sprite loads (not Kanto)

**Estimated Effort:** Medium (3-4 hours for both tests + debugging variant logic if needed)

---

## 📚 Medium Priority

### 2. Add ESLint Configuration

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

### 3. Create CONTRIBUTING.md

**Status:** 📋 Planned

**Description:**
Document how to contribute to the project, including:

- How to add new routes/features
- Code conventions and patterns
- Component organization guidelines
- Git workflow and PR process

**Estimated Effort:** Medium (2-3 hours)

---

### 4. Add Inline Code Documentation

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

### 5. Centralize Configuration

Create `/src/config/` with:

- API endpoint constants
- Environment variable schema validation (Zod)
- Feature flags

### 6. Performance Improvements

- Add bundle analyzer
- Optimize image loading strategies
- Implement incremental static regeneration (ISR) for Pokémon pages
- Add service worker for offline support

### 7. New Features (Not all accessible via current PokeAPI)

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

### 8. Issues (Missing from PokeAPI)

- In-game NPC Trades (Only encounters for some pokemon)
- Trophy Garden - Daily Pokemon in Generation IV (diamond-pearl, platinum)
- No enounter data beyond Sun-Moon generation
- Fossil revived Pokemon (No data in evolution chain on which fossils to use)

---

## ✅ Completed

- [x] **Create Testing Infrastructure** - Established comprehensive testing framework with Vitest for unit tests and Playwright for E2E tests
  - **Unit Tests (134 passing):**
    - 9 utility function tests (convertHeightToCmOrM, convertWeightToGramsOrKg, romanToNumber, addPrecedingZeros, toTitleCase, convertKebabCaseToTitleCase, splitKebabCase, replaceNewlinesAndFeeds, spriteWidthBasedOnHeight)
    - 7 business logic tests (filterMovesForGen, mapMoves, relativeAttackAndDefence, findSpritesForVersion, findSpritesForGoldSilver, findEvolutionDetailForGame, findVarietyForRegion)
  - **E2E Tests (2 passing):**
    - Yellow version - National Dex - Pikachu search flow
    - Gold/Silver version - Regional Dex (Johto) - Chikorita search flow
  - **Configuration:**
    - Created `vitest.config.ts` with jsdom environment and path aliases
    - Created `playwright.config.ts` with chromium/firefox/webkit browsers
    - Added test scripts to `package.json` (test, test:ui, test:coverage, test:e2e, test:e2e:ui)
  - **Best Practices Established:**
    - Use `data-testid` attributes for reliable E2E element selection
    - Always wait for `.animate-spin` loading spinner to disappear before verifying content
    - Scope selectors to components to avoid finding wrong elements
    - Created comprehensive `e2e/README.md` documentation
- [x] **Move Route-Specific Components** - Reorganized codebase by moving route-specific components (encounters, evolutions, sprites, stats, types) from `src/components/` to `app/pokemon/[id]/_components/`, keeping only truly reusable components (common, header) in `src/components/`
- [x] **Upgrade React Query v3 → v5** - Migrated from `react-query@3.39.3` to `@tanstack/react-query@5.90.2`, updated all useQuery calls to new object-based API, renamed `cacheTime` to `gcTime`
- [x] **Migrate to GraphQL v1beta2 Endpoint** - Upgraded from v1beta to v1beta2 with cleaner schema (removed `pokemon_v2_` prefix)
- [x] **Centralize API Configuration** - Created `src/constants/apiConfig.ts` for all API endpoints (GraphQL, REST, Sprites)
- [x] Remove Apollo Client, consolidate on React Query
- [x] Fix memory leak in AutocompleteBase
- [x] Remove duplicate Move/Moves components
- [x] Optimize Suspense boundaries
- [x] Create comprehensive README.md
- [x] Improve cookie state management

---

**Last Updated:** 2025-10-17
