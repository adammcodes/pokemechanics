# Pokémechanics

A comprehensive Pokémon resource web application for the video game series, built with modern web technologies. Browse Pokédex entries, view detailed stats, moves, abilities, evolutions, and encounter locations across all Pokémon generations.

🔗 **Live Site:** [pokemechanics.app](https://www.pokemechanics.app)

## ✨ Features

- **Generation-specific game data** - All page data is tailored to the game you are playing.
- **Detailed Pokémon Information** - Stats, types, abilities, and flavor text
- **Move Data** - Complete movesets organized by learn method (level-up, TM/HM, egg moves, tutors)
- **Evolution Chains** - Visual evolution paths with trigger conditions
- **Encounter Locations** - Where to find Pokémon in specific game versions
- **Type Effectiveness** - Offensive and defensive type matchups
- **Sprite Galleries** - Generation-accurate sprites with shiny variants

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + CSS Modules
- **State Management:** React Query + React Context
- **Data Source:** [PokéAPI](https://pokeapi.co/) (REST & GraphQL)
- **Deployment:** [Vercel](https://vercel.com)

## 📂 Project Architecture

This project follows Next.js 14 App Router conventions with a clear separation between route-specific and reusable code:

```
pokemechanics/
├── app/                      # Route-specific components & pages
│   ├── pokemon/[name]/[game]/[dex]/  # Pokemon detail route
│   │   ├── _components/     # Route-specific components (not a route)
│   │   │   ├── abilities/   # Ability display components
│   │   │   ├── card/        # Pokemon card components
│   │   │   ├── encounters/  # Encounter location components
│   │   │   ├── evolutions/  # Evolution chain components
│   │   │   ├── flavor-text/ # Flavor text components
│   │   │   ├── moves/       # Move-related components
│   │   │   ├── navigation/  # Navigation components
│   │   │   ├── sprites/     # Sprite display components
│   │   │   ├── stats/       # Stats display components
│   │   │   ├── type-efficacy/ # Type effectiveness components
│   │   │   └── types/       # Type display components
│   │   ├── page.tsx         # Pokemon detail page
│   │   └── *.tsx            # Route components
│   │
│   ├── pokedex/[gen]/       # Pokedex route
│   │   └── page.tsx         # Pokedex listing page
│   │
│   ├── api/                 # API proxy routes
│   │   ├── graphql/         # GraphQL proxy (CORS handling)
│   │   └── rest/            # REST API proxy
│   │
│   ├── helpers/             # Server-side data fetching
│   │   ├── graphql/         # GraphQL query helpers
│   │   └── rest/            # REST API helpers
│   │
│   ├── layout.tsx           # Root layout
│   ├── loading.tsx          # Global loading UI
│   └── Client.tsx           # Client-side providers wrapper
│
└── src/                     # Reusable/shared code
    ├── components/          # Shared UI components (used across routes)
    │   ├── common/         # Generic components (Box, Tooltip, etc.)
    │   └── header/         # Header components
    │
    ├── context/            # React context providers
    ├── hooks/              # Custom React hooks
    ├── utils/              # Utility functions
    ├── lib/                # Business logic & helpers
    │   ├── getBasePokemonName.ts      # Strip regional suffixes from Pokemon names
    │   ├── getVariantPokemonName.ts   # Determine correct variant based on region
    │   └── findVarietyForRegion.ts    # Find variety matching a region
    ├── types/              # TypeScript type definitions
    ├── constants/          # App-wide constants
    └── styles/             # Global styles & CSS modules
```

### 🗂 Organization Principles

**`/app` directory** - Route-specific code

- Components that are only used by a single route should be colocated with that route
- Use `_components/` subdirectory (with underscore prefix) to store components without creating routes
- Example: `app/pokemon/[id]/_components/encounters/` contains encounter components only used on Pokemon detail pages
- Benefits: Better code splitting, easier maintenance, clearer dependencies

**`/src` directory** - Reusable code

- Components used across **multiple routes** (Header, Autocomplete, ErrorBoundary, etc.)
- Shared utilities, hooks, types, and constants
- Business logic that isn't tied to a specific route
- If a component is only used in one place, it should live in `/app` near that route

**Component Colocation Example**

```
app/pokemon/[name]/[game]/[dex]/
├── _components/              # Private components (underscore prevents routing)
│   ├── encounters/
│   │   ├── Encounters.tsx    # Only used by LocationsForVersionGroup
│   │   └── groupEncountersByLocation.ts
│   ├── evolutions/
│   │   ├── EvolutionNode.tsx
│   │   └── PokemonEvolutionChain.js
│   └── stats/
│       └── Stats.tsx
├── page.tsx                  # Main route page
```

**File Naming Conventions**

- All components are **server components by default** (no special naming needed)
- `"use client"` directive at top of file - Client components (require interactivity)
- `*.module.css` - CSS Modules for component-scoped styles
- `_folder/` - Private folders (underscore prefix prevents Next.js route creation)
- `page.tsx` - Next.js route pages
- `layout.tsx` - Next.js layouts
- `loading.tsx` - Next.js loading UI

## 🔄 Data Fetching Strategy

### When to use REST vs GraphQL

**Use REST API (`/app/helpers/rest/`) when:**

- You need all data across generations for a resource
- The REST endpoint provides complete, well-structured data
- Example: `fetchPokemonByName()` - returns complete Pokemon object with all game data

**Use GraphQL (`/app/helpers/graphql/`) when:**

- You need specific fields or want to reduce payload size
- You need to filter or aggregate data with variables
- You want more control over the exact data shape
- Example: `getPokedexById()` - fetch only needed fields for a specific generation

### Server vs Client Components

**Server Components (default):**

- Fetch directly from external APIs: `https://pokeapi.co` or `https://graphql.pokeapi.co/v1beta2
- Better performance, reduced bundle size, SEO-friendly

```typescript
// Server component - fetch directly
const data = await fetchFromGraphQL({
  query,
  variables,
  // endpoint defaults to external API
});
```

**Client Components:**

- Use `/api/graphql` proxy route to avoid CORS issues
- Use with React Query for caching and state management
- Required for interactive features

```typescript
// Client component - use proxy
const { data } = useQuery(["key"], async () => {
  return await fetchFromGraphQL({
    query,
    variables,
    endpoint: "/api/graphql", // Use Next.js API route
  });
});
```

### Regional Variant Pokemon Handling

**Context:** Regional variants (Alolan, Galarian, Hisuian, Paldean) require special handling to ensure correct data fetching and URL structure.

**Key Helper Functions:**

- `getBasePokemonName(name)` - Strips regional suffixes (e.g., "rattata-alola" → "rattata")

  - Required for `fetchPokemonSpeciesByName()` API calls (only accepts base names)
  - Prevents 404 errors when fetching species data

- `getVariantPokemonName(speciesData, regionName)` - Determines correct variant name
  - Returns variant name (e.g., "rattata-alola") if Pokemon has regional form for that region
  - Returns base name if no variant exists for the region
  - Used for Pokemon data and GraphQL queries to get correct encounters/moves

**Implementation Flow:**

1. Extract base name from URL parameter using `getBasePokemonName(name)`
2. Fetch species data with base name: `fetchPokemonSpeciesByName(baseName)`
3. Determine region from version group and pokedex data
4. Get actual variant name: `getVariantPokemonName(speciesData, regionName)`
5. Fetch Pokemon data and GraphQL with variant name for correct encounters

**URL Structure:**

- Sitemap generates variant URLs: `/pokemon/rattata-alola/sun-moon/original-melemele`
- Navigation can use base names, variant detection happens server-side
- Ensures correct data for encounters (e.g., Alolan Rattata encounters in Sun/Moon)

### Path Aliases

TypeScript path aliases are configured in `tsconfig.json`:

```typescript
import Component from "@/components/common/Component"; // src/components/common/Component
import { useHook } from "@/hooks/useHook"; // src/hooks/useHook
import { fetchData } from "@/utils/api"; // src/utils/api
import type { Pokemon } from "@/types"; // src/types/index
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/adammcodes/pokemechanics.git
   cd pokemechanics
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build production bundle
- `npm start` - Start production server (after build)
- `npm test` - vitest
- `npm run test:e2e:ui` - Playwright e2e testing locally

## 🧩 Key Technologies & Patterns

### State Management

- Selected Version Group is referred to as `game` around the codebase
- **URL Search Params** - /[name]/[version-group]/[dex]
- **Cookies** - Persist user preferences (selected game, theme)
- **React Context** - Share game selection across components (`GameContext`)
- **React Query** - Client-side data fetching, caching, and synchronization

### Styling Approach

- **Tailwind CSS** - Utility-first styling for layouts and common patterns
- **CSS Modules** - Component-scoped styles for complex UI (animations, custom layouts)
- **CSS Custom Properties** - Theme variables for consistent design

### Type Safety

- Comprehensive TypeScript types in `src/types/index.ts`

## 🌐 API Usage

This app uses [PokéAPI](https://pokeapi.co/), a free RESTful and GraphQL API for Pokémon data.

**REST API:** `https://pokeapi.co/api/v2/`
**GraphQL API:** `https://graphql.pokeapi.co/v1beta2

API routes in `/app/api/` act as proxies to handle CORS for client-side requests.

## 📝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) - Pokémon data source
- Pokémon © Nintendo/Game Freak/Creatures Inc.
