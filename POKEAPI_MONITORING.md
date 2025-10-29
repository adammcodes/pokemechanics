# PokeAPI Usage Monitoring Guide

This guide helps you monitor PokeAPI usage to determine if rate limiting is needed.

## 🎯 Goal

Prevent PokeAPI 429 (rate limit) errors while allowing SEO bots to crawl and index the site.

## 📊 Current Setup

### ISR Caching (24-hour revalidation)
```typescript
export const revalidate = 86400; // 24 hours
```

**What this means:**
- First request → Hits PokeAPI
- Next 23h 59m → Served from cache (NO PokeAPI calls)
- After 24h → Background revalidation (ONE PokeAPI call)

### PokeAPI Request Logging

All PokeAPI requests are logged with these tags:
- `[PokeAPI Request]` - Initial request made
- `[PokeAPI Success] 200` - Successful response
- `[PokeAPI 429]` - Rate limited by PokeAPI

## 🔍 Monitoring Commands

### Real-Time Monitoring

```bash
# Watch all PokeAPI requests live
npx wrangler tail pokemechanics --format pretty | grep "PokeAPI"

# Count PokeAPI requests per minute
npx wrangler tail pokemechanics | grep "PokeAPI Request" | wc -l

# Watch for rate limit errors (429s)
npx wrangler tail pokemechanics | grep "429"

# Monitor both requests and errors
npx wrangler tail pokemechanics | grep -E "PokeAPI|429"
```

### Bot-Specific Monitoring

```bash
# Filter logs by user agent
npx wrangler tail pokemechanics | grep -i "User-Agent"

# Filter for specific bots
npx wrangler tail pokemechanics | grep -i "googlebot"
npx wrangler tail pokemechanics | grep -i "bingbot"
npx wrangler tail pokemechanics | grep -i "bot"

# See both requests and User-Agents together
npx wrangler tail pokemechanics | grep -E "\[Request\]|\[PokeAPI"
```

## 🧪 Testing Bot Crawling

### Simulate Bot Crawl

Test how your app handles rapid bot requests:

```bash
# Simulate 20 rapid Googlebot requests
for i in {1..20}; do
  curl -A "Googlebot/2.1" "https://pokemechanics.app/pokemon/pikachu/red-blue/kanto" > /dev/null 2>&1 &
done
wait

# Watch for issues
npx wrangler tail pokemechanics | grep -E "429|PokeAPI"
```

**Expected result with ISR:**
- Most requests hit cache (no PokeAPI calls)
- Only first uncached request hits PokeAPI
- No 429 errors

### Test Different Pages

```bash
# Test multiple different pages (more likely to hit PokeAPI)
for pokemon in pikachu charizard mewtwo bulbasaur squirtle; do
  curl -A "Googlebot/2.1" "https://pokemechanics.app/pokemon/$pokemon/red-blue/kanto" > /dev/null 2>&1
  sleep 1
done

# Count PokeAPI calls
npx wrangler tail pokemechanics | grep "PokeAPI Request" | wc -l
```

## 📈 Analysis Metrics

### Healthy Thresholds

| Metric | Healthy | Warning | Action Needed |
|--------|---------|---------|---------------|
| PokeAPI requests/hour | < 100 | 100-200 | > 200 |
| 429 errors/hour | 0 | 1-5 | > 5 |
| Cache hit rate | > 90% | 70-90% | < 70% |

### Calculate Request Rate

```bash
# Monitor for 5 minutes and count requests
npx wrangler tail pokemechanics > /tmp/logs.txt &
TAIL_PID=$!
sleep 300  # 5 minutes
kill $TAIL_PID

# Count PokeAPI requests
grep "PokeAPI Request" /tmp/logs.txt | wc -l

# Extrapolate to per hour
# (count / 5) * 60 = requests per hour
```

## 🚦 Decision Matrix

### ✅ No Rate Limit Worker Needed

If monitoring shows:
- ✅ < 100 PokeAPI requests/hour
- ✅ Zero 429 errors
- ✅ Most requests served from cache

**Action:** Remove old rate limit worker, ISR is working perfectly.

### ⚠️ Keep Rate Limit Worker

If monitoring shows:
- ❌ > 200 PokeAPI requests/hour
- ❌ Frequent 429 errors (> 5/hour)
- ❌ Low cache hit rate (< 70%)

**Action:** Keep rate limit worker active to protect PokeAPI.

### 🔄 Monitor & Decide

If monitoring shows:
- 🟡 100-200 requests/hour
- 🟡 Occasional 429s (1-5/hour)
- 🟡 Moderate cache hit rate (70-90%)

**Action:** Monitor for 48 hours, then decide. Consider bot traffic patterns.

## 🛠 Rate Limit Worker Status

### Check if Worker is Active

```bash
# List all workers
npx wrangler deployments list

# Check for bot throttling worker
# Look for worker named: bot-throttler, rate-limiter, or similar
```

### Remove Rate Limit Worker (if not needed)

```bash
# Delete the worker
npx wrangler delete <worker-name>
```

Or in Cloudflare Dashboard:
1. Go to **Workers & Pages**
2. Find the old bot throttling worker
3. **Settings** → **Delete**

### Keep Rate Limit Worker (if needed)

If you decide to keep it:

1. Verify route configuration:
   - Dashboard → **Workers & Pages** → worker → **Settings** → **Triggers**
   - Ensure route is: `pokemechanics.app/*` or `*pokemechanics.app/*`

2. Update worker settings in `cloudflare-worker.js` if needed:
   ```javascript
   const BOT_RATE_LIMIT = 10;    // Adjust based on monitoring
   const BOT_RETRY_AFTER = 60;
   ```

3. Ensure only ONE worker handles the route (your app OR the rate limiter, not both)

## 📝 Monitoring Schedule

### Initial Period (First 48 hours)

Monitor actively to establish baseline:

```bash
# Morning check
npx wrangler tail pokemechanics | grep "PokeAPI" | head -20

# Afternoon check
npx wrangler tail pokemechanics | grep "429"

# Evening check - count requests
npx wrangler tail pokemechanics | grep "PokeAPI Request" | wc -l
```

### Ongoing Monitoring (Weekly)

```bash
# Quick health check
npx wrangler tail pokemechanics --format pretty | grep -E "PokeAPI|429" | head -10

# Check dashboard metrics
# Go to: Cloudflare Dashboard → Workers & Pages → pokemechanics → Metrics
```

## 🔔 Alerts (Optional)

Set up alerts for 429 errors:

1. Use Cloudflare Workers analytics
2. Or add Sentry error tracking
3. Or set up Logpush to external monitoring

## 📚 Resources

- [PokeAPI Rate Limits](https://pokeapi.co/docs/v2#fairuse)
- [Cloudflare Workers Analytics](https://developers.cloudflare.com/workers/observability/analytics/)
- [ISR in Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)

---

## Quick Reference

```bash
# Start monitoring right now
npx wrangler tail pokemechanics --format pretty | grep "PokeAPI"

# Test bot crawling impact
for i in {1..10}; do curl -A "Googlebot" "https://pokemechanics.app/pokemon/pikachu/red-blue/kanto" -I & done; wait

# Count 429 errors
npx wrangler tail pokemechanics | grep "429" | wc -l
```

**Decision deadline:** Monitor for 24-48 hours, then decide on rate limit worker.
