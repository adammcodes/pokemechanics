# TODO

Project roadmap and planned improvements for Pokémechanics.

---

## 🔥 High Priority

Increase test coverage

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

### Documentation

- [x] Create comprehensive README.md

---

**Last Updated:** 2025-10-19
