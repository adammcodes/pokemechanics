# Pokémechanics

A comprehensive Pokémon resource web application for the video game series, built with modern web technologies. Browse Pokédex entries, view detailed stats, moves, abilities, evolutions, and encounter locations across all Pokémon generations.

🔗 **Live Site:** [newbarktown.ca](https://www.newbarktown.ca)

## ✨ Features

- **Generation-specific game data** - All page data is tailored to the game you are playing.
- **Detailed Pokémon Information** - Stats, types, abilities, and flavor text
- **Move Data** - Complete movesets organized by learn method (level-up, TM/HM, egg moves, tutors)
- **Evolution Chains** - Visual evolution paths with trigger conditions
- **Encounter Locations** - Where to find Pokémon in specific game versions
- **Type Effectiveness** - Offensive and defensive type matchups

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + CSS Modules
- **State Management:** React Query + React Context
- **Data Source:** [PokéAPI](https://pokeapi.co/) (REST & GraphQL)
- **Deployment:** [Cloudflare Pages](https://pages.cloudflare.com/) via [@cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages)

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

- `getVariantPokemonName(speciesData, regionName)` - Determines correct variant name

  - Returns variant name (e.g., "rattata-alola") if Pokemon has regional form for that region
  - Returns base name if no variant exists for the region
  - Used for Pokemon data and GraphQL queries to get correct encounters/moves

- `findSpriteFromPokemonData` - Determines the correct sprite url to use given:

  - pokemonData = The response data from the pokeapi REST endpoint /pokemon/:name
  - generationName e.g. "generation-i"
  - versionGroup e.g. "red-blue"

**Implementation Flow:**

1. Extract name from URL parameter then use it in the `/pokemon/:name` REST endpoint
2. Fetch species data with species name: `fetchPokemonSpeciesByName(speciesName)`
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

#### Development

- `npm run dev` - Start Next.js development server (port 3000)
- `npm run preview` - Build and preview locally in Cloudflare Workers runtime (port 8787)

#### Testing

- `npm test` - Run unit tests with Vitest
- `npm run test:ui` - Run Vitest with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run Playwright E2E tests with UI

#### Deployment

- `npm run deploy` - Build and deploy to Cloudflare Workers
- `npm run cf-typegen` - Generate TypeScript types for Cloudflare environment

#### Legacy (deprecated)

- `npm run build` - Build Next.js (now handled by `deploy`)
- `npm start` - Start production server (not used with Cloudflare Workers)

## 🏗️ Building Locally with Self-Hosted PokeAPI

For local static generation of all ~8,500+ Pokemon pages, you'll need a self-hosted instance of PokeAPI to handle the high volume of requests during the build process.

### Prerequisites

1. **Self-Hosted PokeAPI** - Set up a local PokeAPI instance following the [official setup guide](https://github.com/PokeAPI/pokeapi)

   - **GraphQL endpoint:** `http://localhost:8080/v1/graphql`
   - **REST endpoint:** `http://localhost/api/v2`

2. **Sufficient Server Resources** - The build process makes thousands of API requests. Ensure your local PokeAPI instance has adequate resources to handle the load.

### Environment Configuration

Create or update your `.env.local` file to point to your local PokeAPI instance:

```bash
# Local PokeAPI endpoints
NEXT_PUBLIC_POKEAPI_REST_ENDPOINT=http://localhost/api/v2
NEXT_PUBLIC_POKEAPI_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
POKEAPI_REST_ENDPOINT=http://localhost/api/v2
POKEAPI_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
```

### Build Throttling Configuration

To prevent overwhelming the local PokeAPI server, the build uses two levels of throttling:

**1. Next.js Static Generation Concurrency** (`next.config.js`)

```javascript
experimental: {
  staticGenerationMaxConcurrency: 4; // Max 4 pages building simultaneously
}
```

**2. API Request Concurrency** (`src/utils/rateLimiter.ts`)

```javascript
const API_CONCURRENCY_LIMIT = 10; // Max 10 concurrent API requests
```

You can adjust these values based on your server's capacity. Higher concurrency = faster builds but more server load.

### Running a Monitored Build

Use the monitoring script to track build progress and identify any 503 errors:

```bash
node scripts/monitored-build.js
```

This script:

- Runs the standard `npm run build` process
- Monitors output for 503 errors and route failures
- Logs all errors to `build-errors.log`
- Reports build statistics when complete

### Build Output

A successful build will show:

```
============================================================
BUILD COMPLETE - SUMMARY
============================================================

Build exit code: 0 (SUCCESS)

Total routes generated: 8,617
Pokemon routes generated: 8,590

✅ No 503 errors detected in build output!

============================================================
```

### Troubleshooting Build Errors

**503 Service Unavailable Errors:**

- Indicates your local PokeAPI server is overwhelmed
- Solutions:
  - Reduce `staticGenerationMaxConcurrency` in `next.config.js`
  - Reduce `API_CONCURRENCY_LIMIT` in `src/utils/rateLimiter.ts`
  - Increase resources allocated to your PokeAPI instance
  - Check `build-errors.log` to identify which Pokemon are failing

**Build Hangs or Times Out:**

- Verify your local PokeAPI instance is running and accessible
- Check that environment variables are correctly set in `.env.local`
- Ensure no firewall is blocking local API requests

**Missing Routes in Build:**

- Check the prerender manifest: `.next/prerender-manifest.json`
- Look for errors in the build output related to specific Pokemon
- Review `build-errors.log` for detailed error messages

### Preview the Built Site

After a successful build, preview the static site locally:

```bash
npx next start -p 3001
```

Then test specific Pokemon pages to verify the build:

- http://localhost:3001/pokemon/pikachu/red-blue/kanto
- http://localhost:3001/pokemon/charizard/red-blue/kanto
- http://localhost:3001/pokemon/arceus/platinum/extended-sinnoh

All pages should return 200 OK and display complete Pokemon data.

## 🧩 Key Technologies & Patterns

### State Management

- Selected Version Group is referred to as `game` around the codebase
- **URL Search Params** - /[name]/[version-group]/[dex]
- **Cookies** - Persist user preferences (selected game, theme)
- **React Context** - Share game selection across components (`GenerationContext`)
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
**GraphQL API:** `https://graphql.pokeapi.co/v1beta2`

API routes in `/app/api/` act as proxies to handle CORS for client-side requests.

## 🚀 Deployment & Infrastructure

### Cloudflare Workers Deployment

This app is deployed on [Cloudflare Workers](https://workers.cloudflare.com/) using [@opennextjs/cloudflare](https://opennext.js.org/cloudflare), which provides:

- **Free tier** - 100,000 requests/day included

### Deployment Commands

```bash
# First time setup - Login to Cloudflare
npx wrangler login

# Preview locally before deploying (recommended)
npm run preview
# Opens at http://localhost:8787

# Deploy to production
npm run deploy
```

### Configuration Files

- **`wrangler.jsonc`** - Cloudflare Worker configuration
- **`open-next.config.ts`** - OpenNext adapter configuration for Cloudflare

## 📊 Monitoring & Observability

### Real-Time Log Streaming

Monitor production errors and requests in real-time:

```bash
# Stream live logs with formatting
npx wrangler tail pokemechanics --format pretty

# Filter by status
npx wrangler tail pokemechanics --status error  # Only errors
npx wrangler tail pokemechanics --status ok     # Only successful requests
```

### Adding Custom Logs

Add logging anywhere in your code - logs will appear in `wrangler tail`:

### Deployment Management

```bash
# View recent deployments
npx wrangler deployments list

# Rollback to previous version if needed
npx wrangler rollback <version-id>

# Check Worker status
npx wrangler whoami
```

For production monitoring, consider adding:

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) - Pokémon data source
- Pokémon © Nintendo/Game Freak/Creatures Inc.
