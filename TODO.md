# TODO

Project roadmap and planned improvements for Pokémechanics.

---

## 🔥 High Priority

### 1. Migrate to GraphQL v1beta2 Endpoint

**Status:** 📋 Planned

**Description:**
Upgrade from PokéAPI GraphQL v1beta to v1beta2. The newer endpoint removes the `pokemon_v2_` prefix from all schema types, providing a cleaner API surface.

**Changes Required:**

- Update endpoint URL in `src/utils/api.ts`:
  - From: `https://beta.pokeapi.co/graphql/v1beta`
  - To: `https://beta.pokeapi.co/graphql/v1beta2`
- Update all GraphQL queries in `/app/helpers/graphql/`:
  - `pokemon_v2_pokedex` → `pokedex`
  - `pokemon_v2_pokemonspecies` → `pokemon_species`
  - `pokemon_v2_versiongroup` → `version_group`
  - etc.
- Update client-side queries:
  - `src/components/encounters/Encounters.tsx`
  - There are more...
- Test all queries after migration

**Benefits:**

- Cleaner, more intuitive query syntax
- Future-proofed against v1beta deprecation
- Better alignment with GraphQL best practices

**Resources:**

- [PokéAPI GraphQL Docs](https://beta.pokeapi.co/graphql/console/)
- GraphQL schema explorer for field mappings
- Use graphiQL console for development: https://graphql.pokeapi.co/v1beta2/console

**Estimated Effort:** Medium (2-4 hours)

---

### 2. Upgrade React Query v3 → v5

**Status:** 📋 Planned

**Description:**
Upgrade from deprecated `react-query@3.39.3` to latest `@tanstack/react-query@5.x`. The package has been renamed and includes significant API improvements.

**Changes Required:**

- Uninstall old package: `npm uninstall react-query`
- Install new package: `npm install @tanstack/react-query@5`
- Update imports across codebase:
  - `import { useQuery } from 'react-query'` → `import { useQuery } from '@tanstack/react-query'`
  - `import { QueryClient, QueryClientProvider } from 'react-query'` → same with `@tanstack/react-query`
- Update `QueryClient` configuration (new defaults in v5)
- Review and update `useQuery` options:
  - `staleTime`, `cacheTime` (now `gcTime`), etc.
- Update error handling patterns (v5 has better TypeScript support)

**Breaking Changes:**

- `cacheTime` renamed to `gcTime` (garbage collection time)
- `useQuery` signature changes
- Query keys must be arrays (already using this pattern ✅)
- SSR hydration API changes (may not affect this project)

**Benefits:**

- Better TypeScript support and type inference
- Improved performance
- Active maintenance and security updates
- Better devtools
- Suspense support improvements

**Resources:**

- [React Query v5 Migration Guide](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5)
- [TanStack Query v5 Docs](https://tanstack.com/query/latest/docs/react/overview)

**Estimated Effort:** Medium (3-5 hours)

---

### 3. Create Testing Infrastructure

**Status:** 📋 Planned

**Description:**
Establish a testing framework to prevent regressions and ensure code quality as the project grows.

**Recommended Stack:**

- **Vitest** - Fast, Vite-powered test runner with Jest-compatible API
- **React Testing Library** - Component testing following best practices
- **Playwright** (optional) - E2E testing for critical user flows

**Setup Steps:**

1. **Install dependencies:**

   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom
   npm install -D @testing-library/user-event jsdom
   ```

2. **Configure Vitest:**

   - Create `vitest.config.ts`
   - Set up jsdom environment
   - Configure path aliases to match `tsconfig.json`

3. **Add test scripts to `package.json`:**

   ```json
   "test": "vitest",
   "test:ui": "vitest --ui",
   "test:coverage": "vitest --coverage"
   ```

4. **Create initial tests:**
   - `src/utils/api.test.ts` - Test `fetchFromGraphQL` utility
   - `src/hooks/useCookieState.test.ts` - Test cookie hook
   - `src/components/common/AutocompleteBase.test.tsx` - Test autocomplete component

**Priority Test Coverage:**

- Data fetching utilities (`fetchFromGraphQL`, REST helpers)
- Custom hooks (`useCookieState`, `useGameVersion`)
- Shared components (Autocomplete, Tooltip, ErrorBoundary)
- Critical user flows (search Pokémon, navigate between pages)

**Benefits:**

- Prevent regressions during refactors
- Catch bugs early in development
- Documentation through test cases
- Confidence when upgrading dependencies

**Resources:**

- [Vitest Getting Started](https://vitest.dev/guide/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing Docs](https://nextjs.org/docs/app/building-your-application/testing/vitest)

**Estimated Effort:** Medium-Large (4-8 hours initial setup + ongoing test writing)

---

## 📚 Medium Priority

### 4. Add ESLint Configuration

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

### 5. Create CONTRIBUTING.md

**Status:** 📋 Planned

**Description:**
Document how to contribute to the project, including:

- How to add new routes/features
- Code conventions and patterns
- Component organization guidelines
- Git workflow and PR process

**Estimated Effort:** Medium (2-3 hours)

---

### 6. Add Inline Code Documentation

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

### 7. Centralize Configuration

Create `/src/config/` with:

- API endpoint constants
- Environment variable schema validation (Zod)
- Feature flags

### 8. Move Route-Specific Components

Audit `src/components/` and move route-specific components closer to their routes:

- Consider moving `Encounters.tsx` to `app/pokemon/[id]/_components/`
- Keep only truly reusable components in `/src/components`

### 9. Performance Improvements

- Add bundle analyzer
- Optimize image loading strategies
- Implement incremental static regeneration (ISR) for Pokémon pages
- Add service worker for offline support

### 10. New Features

- Team builder tool
- Damage calculator
- Advanced search/filtering
- Comparison tool (compare two Pokémon side-by-side)
- User accounts with favorites/teams

---

## ✅ Completed

- [x] Remove Apollo Client, consolidate on React Query
- [x] Fix memory leak in AutocompleteBase
- [x] Remove duplicate Move/Moves components
- [x] Optimize Suspense boundaries
- [x] Create comprehensive README.md
- [x] Improve cookie state management

---

**Last Updated:** 2025-10-02
