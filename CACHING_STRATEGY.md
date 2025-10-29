# Caching Strategy & Performance Guide

This document explains how caching works in the app and how to optimize PokeAPI usage.

## 🎯 Three Levels of Caching

### **Level 1: React `cache()` - Request Deduplication**

**Purpose:** Prevent duplicate API calls within the same render

**Duration:** Single render/request only

**Implementation:**
```typescript
import { cache } from "react";

export const getVersionGroup = cache(async (gen: string) => {
  // This function is called multiple times in the same render
  // (e.g., in generateMetadata() and in the page component)
  // But the API call only happens ONCE per render
  return await fetchFromGraphQL({ query, variables: { name: gen } });
});
```

**What it prevents:**
```
❌ Without cache():
  - generateMetadata() calls getVersionGroup("red-blue") → API call #1
  - Page component calls getVersionGroup("red-blue") → API call #2
  Result: 2 API calls for same data

✅ With cache():
  - generateMetadata() calls getVersionGroup("red-blue") → API call #1
  - Page component calls getVersionGroup("red-blue") → Returns cached result
  Result: 1 API call
```

**Files using this:**
- All helpers in `app/helpers/rest/`
- All helpers in `app/helpers/graphql/`

---

### **Level 2: ISR (Incremental Static Regeneration) - Page Caching**

**Purpose:** Cache entire rendered pages at the edge

**Duration:** 24 hours (86400 seconds)

**Implementation:**
```typescript
// In page.tsx files
export const revalidate = 86400; // 24 hours
```

**How it works:**
1. **First request** → Generates page, calls APIs, caches result for 24h
2. **Requests 2-N (< 24h)** → Serves cached page, NO API calls
3. **After 24h** → Background revalidation, updates cache

**Pages using this:**
- `/pokemon/[name]/[game]/[dex]/page.tsx`
- `/pokedex/[gen]/page.tsx`
- `/pokemon/[name]/page.tsx`

---

### **Level 3: Cloudflare Edge Caching**

**Purpose:** Cache at Cloudflare's global edge network

**Duration:** Automatic, managed by Cloudflare

**How it works:**
- Static assets: Cached indefinitely
- Dynamic pages with ISR: Cached per `revalidate` setting
- Cloudflare serves cached content from nearest edge location

---

## 📊 Understanding Your Logs

### **Local Preview (`npm run preview`):**

```bash
[PokeAPI Request] https://graphql.pokeapi.co/v1beta2
[PokeAPI Request] https://pokeapi.co/api/v2/pokedex/kalos-central
[PokeAPI Request] https://pokeapi.co/api/v2/pokemon-species/pikachu
```

**What this means:**
- ✅ Cache is EMPTY (first run)
- ✅ Every page visit triggers API calls
- ✅ This is NORMAL for local development
- ✅ React `cache()` still deduplicates within each render

**To see caching in action locally:**
1. Visit a page → See API calls
2. Refresh the same page → See FEWER calls (React cache working)
3. Wait for page to load completely
4. Hard refresh (Cmd+Shift+R) → Fresh cache, see API calls again

---

### **Production (`npm run deploy`):**

**First user visiting `/pokemon/pikachu/red-blue/kanto`:**
```bash
[PokeAPI Request] https://graphql.pokeapi.co/v1beta2  ← Fetching data
[PokeAPI Request] https://pokeapi.co/api/v2/pokemon-species/pikachu
[PokeAPI Success] 200
```
- Page generated
- Cached for 24 hours

**Second user (or same user) visiting same page within 24 hours:**
```bash
# NO LOGS - Page served from cache
# NO API calls made
```

**After 24 hours, next visitor:**
```bash
# User gets OLD cached page immediately
# Background revalidation happens:
[PokeAPI Request] https://graphql.pokeapi.co/v1beta2  ← Background update
[PokeAPI Success] 200
# Cache updated for next 24 hours
```

---

## 🔍 How to Tell What's Cached

### **Method 1: Check Response Headers** (Production only)

```bash
# Check cache status
curl -I https://pokemechanics.app/pokemon/pikachu/red-blue/kanto | grep -i "cf-cache"

# Possible values:
# cf-cache-status: HIT     → Served from cache (no API calls)
# cf-cache-status: MISS    → Fresh generation (API calls made)
# cf-cache-status: EXPIRED → Revalidating (background API calls)
```

### **Method 2: Monitor Logs with Timestamps**

```bash
# Watch logs with timestamps
npx wrangler tail pokemechanics --format pretty

# Visit same page multiple times
# First visit:  See [PokeAPI Request] logs
# Second visit: NO logs (cached)
```

### **Method 3: Count API Calls Per Page**

Add this to your monitoring:

```typescript
// In src/utils/api.ts
let requestCount = 0;

export async function fetchWithRetry(...) {
  if (isPokeAPIRequest) {
    requestCount++;
    console.log(`[PokeAPI Request #${requestCount}]`, url);
  }
  // ... rest of function
}
```

**Expected counts per Pokemon page:**
- First load (uncached): 4-7 API calls
- Subsequent loads (< 24h): 0 API calls
- Background revalidation: 4-7 API calls (invisible to user)

---

## ⚡ Optimization Opportunities

### **Static Data (Never Changes)**

These are cached with 7-day revalidation:

1. **Version Groups** - 25 total, never change
   ```typescript
   // ✅ Cached for 7 days via next: { revalidate: 604800 }
   // app/helpers/graphql/getVersionGroup.ts
   ```

2. **Pokedex Lists** - Updated with new Pokemon releases (rarely)
   ```typescript
   // ✅ Cached for 7 days via next: { revalidate: 604800 }
   // app/helpers/graphql/getPokedexByName.ts
   // app/helpers/graphql/getNationalDexByLimit.ts
   ```

3. **Pokemon Stats/Moves** - Updated when new games release
   ```typescript
   // ✅ Cached for 7 days via next: { revalidate: 604800 }
   // app/helpers/graphql/getPokemonComplete.ts
   ```

4. **Type Data** - 18 types, never change
   ```typescript
   // Could be hardcoded or cached indefinitely (future optimization)
   ```

### **Semi-Static Data (Changes Rarely)**

Currently, all Pokemon-related data is cached for 7 days, which is appropriate since:
- Pokemon data only changes with new game releases (yearly at most)
- Version groups are static
- Pokedex entries rarely update

### **Dynamic Data (Changes Frequently)**

None! All Pokemon data is static.

---

## 📈 Measuring Cache Performance

### **Cache Hit Rate**

```bash
# Check over 100 requests
npx wrangler tail pokemechanics | head -100 | grep "PokeAPI Request" | wc -l

# Calculate hit rate:
# (100 - API_CALLS) / 100 = cache hit rate
# Example: 5 API calls = 95% cache hit rate ✅
```

### **Expected Performance:**

| Scenario | API Calls | Cache Hit Rate |
|----------|-----------|----------------|
| Fresh deployment | High (50-100/hr) | Low (0-20%) |
| After 24 hours | Medium (10-30/hr) | Medium (50-80%) |
| Steady state (1+ week) | Low (< 10/hr) | High (90-99%) |

---

## 🚀 Caching Improvements

### **✅ Implemented: Fetch-Level Caching with 7-Day Revalidation**

We've implemented longer caching for static data at the fetch level:

```typescript
// All GraphQL helpers now use 7-day caching:
const response = await fetchFromGraphQL({
  query,
  variables,
  next: { revalidate: 604800 }, // 7 days
});
```

**Benefits:**
- ✅ Fewer API calls (saves PokeAPI rate limits)
- ✅ Faster page loads (more cache hits)
- ✅ Still allows updates (background revalidation after 7 days)

**Why 7 days?**
- Pokemon data only changes with new game releases (yearly at most)
- Version groups and Pokedex lists are essentially static
- 7-day window ensures data stays fresh while minimizing API calls

### **Future Option: Static Generation for Popular Pokemon**

Uncomment `generateStaticParams()` in page.tsx:

```typescript
export async function generateStaticParams() {
  // Pre-generate top 50 Pokemon at build time
  const popularVersionGroups = [
    { game: "scarlet-violet", dex: "paldea" },
    { game: "red-blue", dex: "kanto" },
  ];

  return PRIORITY_POKEMON.flatMap(pokemon =>
    popularVersionGroups.map(vg => ({
      name: pokemon,
      game: vg.game,
      dex: vg.dex,
    }))
  );
}
```

**Benefit:**
- ✅ Zero API calls for popular pages
- ✅ Instant page loads
- ✅ SEO boost (pages pre-rendered)

**Trade-off:**
- ⚠️ Longer build times
- ⚠️ Higher deployment size

### **Future Option: Cache Static Data in Code**

For data that NEVER changes (types, version groups):

```typescript
// constants/versionGroups.ts
export const VERSION_GROUPS = [
  { name: "red-blue", generation: "generation-i", ... },
  { name: "gold-silver", generation: "generation-ii", ... },
  // ... all 25 version groups
];

// No API call needed!
```

---

## 📋 Recommended Next Steps

1. **Monitor for 24-48 hours**
   - Track PokeAPI requests using monitoring guide
   - Calculate cache hit rate
   - Identify most-requested pages

2. **If cache hit rate < 90%:**
   - Increase `revalidate` to 7 days
   - Enable `generateStaticParams()` for top Pokemon
   - Consider hardcoding static data

3. **If seeing 429 errors:**
   - Keep rate limiting worker
   - Implement exponential backoff (already done ✅)
   - Contact PokeAPI for rate limit increase

---

## 🔗 Related Files

- `POKEAPI_MONITORING.md` - Monitoring PokeAPI usage
- `README.md` - Deployment and infrastructure
- `app/pokemon/[name]/[game]/[dex]/page.tsx` - Pokemon page with ISR
- `src/utils/api.ts` - Fetch utilities with retry logic

---

## Quick Reference

```bash
# Check cache status in production
curl -I https://pokemechanics.app/pokemon/pikachu/red-blue/kanto | grep cf-cache

# Monitor API calls
npx wrangler tail pokemechanics | grep "PokeAPI"

# Test caching locally (requires multiple visits)
npm run preview
# Visit http://localhost:8787/pokemon/pikachu/red-blue/kanto twice
```
