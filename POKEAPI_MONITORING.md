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

### ✅ Current Bot Protection (Turnstile Middleware)

The app currently uses **Turnstile middleware** for bot protection (see `middleware.ts` and `TURNSTILE_SETUP.md`):
- ✅ Verifies human users with Cloudflare Turnstile
- ✅ Allows verified search engines (Googlebot, Bingbot, etc.)
- ✅ Allows social media crawlers for link previews
- ✅ Blocks vulnerability scanners and malicious bots
- ✅ Pages are statically generated, minimizing API calls

**Note:** The old separate "rate limiting worker" is **deprecated** and no longer used. See `CLOUDFLARE_WORKER_SETUP.md` for historical reference.

### 📊 Monitoring Guidelines

If monitoring shows:

**✅ Healthy (< 100 PokeAPI requests/hour)**
- Zero 429 errors
- Most requests served from cache
- **Action:** Current setup is working well

**⚠️ Moderate Traffic (100-200 requests/hour)**
- Occasional 429s (1-5/hour)
- Moderate cache hit rate (70-90%)
- **Action:** Monitor for 48 hours. Consider increasing ISR `revalidate` time

**❌ High Traffic (> 200 requests/hour)**
- Frequent 429 errors (> 5/hour)
- Low cache hit rate (< 70%)
- **Action:**
  - Check for bot traffic bypassing Turnstile
  - Review Turnstile logs in Cloudflare dashboard
  - Consider stricter Turnstile challenge mode
  - For local builds: Use self-hosted PokeAPI (see `README.md`)

## 🛠 Bot Protection Status

### Current Protection: Turnstile Middleware

Check if Turnstile is active:

```bash
# Check middleware.ts exists
ls -la middleware.ts

# View Turnstile analytics
# Cloudflare Dashboard → Security → Turnstile
```

### Turnstile Configuration

See `TURNSTILE_SETUP.md` for:
- Production vs development setup
- Environment variables required
- Testing and troubleshooting
- Analytics and monitoring

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
