# CloudFlare Worker Setup: Smart Bot Throttling

## Overview

This Worker implements intelligent bot rate limiting that:
- ✅ Allows bots to crawl the site
- ✅ Sends 429 signals when bots hit too many uncached pages
- ✅ Respects Retry-After headers (Googlebot compliant)
- ✅ Never throttles human visitors
- ✅ Cached requests pass through instantly

---

## Deployment Steps

### 1. Go to CloudFlare Workers Dashboard

1. Log into CloudFlare: https://dash.cloudflare.com
2. Click **Workers & Pages** in left sidebar
3. Click **Create application** button
4. Click **Create Worker**

### 2. Deploy the Worker

1. **Name it:** `bot-throttler` (or any name you prefer)
2. Click **Deploy** (deploys the default worker)
3. Click **Edit code** button
4. **Delete all existing code**
5. **Copy and paste** the entire contents of `cloudflare-worker.js`
6. Click **Save and Deploy**

### 3. Add Route to Your Domain

**Option A: From Worker Overview Page**
1. After deploying, you should see your Worker overview page
2. Look for a **Triggers** section (may be in the middle of the page, not a tab)
3. Click **Add route** button
4. Enter:
   - **Route:** `pokemechanics.app/*`
   - **Zone:** Select `pokemechanics.app` from dropdown
5. Click **Add route** or **Save**

**Option B: If you don't see Triggers section**
1. Go back to **Workers & Pages** in the left sidebar
2. Click on your `bot-throttler` worker name from the list
3. Scroll down on the overview page to find **Triggers** section
4. Click **Add route** button
5. Enter route pattern and zone as above

**Option C: Via Settings Tab**
1. In the Worker page, click **Settings** tab (if available)
2. Look for **Triggers** or **Domains & Routes** section
3. Click **Add route** button
4. Enter route pattern and zone as above

**⚠️ Important:** If you already have a `rate-limiter` Worker with a route, **delete that route first** before adding this one. Only one Worker can handle a route.

### 4. Remove Googlebot Block (If You Added One)

1. Go to **Security** → **WAF** → **Custom rules**
2. Find any rule blocking Googlebot
3. Delete it or disable it
4. Click **Save**

### 5. Verify Bot Fight Mode Settings

1. Go to **Security** → **Bots**
2. Ensure **Bot Fight Mode** is **enabled**
3. Under configuration:
   - **Definitely automated:** Block (blocks bad bots)
   - **Verified bots:** Allow (allows Googlebot, etc.)
   - **Likely automated:** Challenge or JS Challenge

---

## Configuration

You can adjust these values in `cloudflare-worker.js`:

```javascript
const BOT_RATE_LIMIT = 10;    // Max uncached requests per minute
const BOT_RETRY_AFTER = 60;   // Seconds to wait when throttled
```

### Recommended Settings by Traffic Level:

**Low traffic (< 1k visitors/day):**
```javascript
const BOT_RATE_LIMIT = 20;
const BOT_RETRY_AFTER = 30;
```

**Medium traffic (1k-10k visitors/day) - Recommended:**
```javascript
const BOT_RATE_LIMIT = 10;
const BOT_RETRY_AFTER = 60;
```

**High traffic (> 10k visitors/day):**
```javascript
const BOT_RATE_LIMIT = 5;
const BOT_RETRY_AFTER = 120;
```

**During crawler surge (temporary):**
```javascript
const BOT_RATE_LIMIT = 3;
const BOT_RETRY_AFTER = 180;
```

---

## How It Works

### For Cached Requests (90% of traffic after 24h):

```
Bot → CloudFlare Worker
      ↓
      Checks cache
      ↓
      ✅ Cache HIT
      ↓
      Returns cached page instantly
      (No rate limiting, no origin hit)
```

**Result:** Instant response, no API calls, no throttling

### For Uncached Requests (10% of traffic):

```
Bot → CloudFlare Worker
      ↓
      Checks cache
      ↓
      ❌ Cache MISS
      ↓
      Checks rate limit
      ↓
      Under limit (≤10/min) → Pass to Vercel → Return page
      Over limit (>10/min)  → Return 429 with Retry-After: 60
```

**Result:**
- First 10 uncached pages/min: Allowed through
- Pages 11+: Get 429, bot waits 60 seconds
- Bot naturally slows down

### For Human Visitors:

```
Human → CloudFlare Worker
        ↓
        Detects human (not bot)
        ↓
        Always passes through
        (No rate limiting ever)
```

**Result:** Normal browsing, never throttled

### For Error Responses - Selective Caching:

**429 Rate Limit Errors (cached for 60s):**
```
Request → CloudFlare Worker
        ↓
        Fetches from origin
        ↓
        ❌ 429 Rate Limited
        ↓
        Adds Cache-Control: max-age=60
        ↓
        Returns error, CACHED for 60 seconds
```

**Result:** Protects PokeAPI from being hammered. Subsequent requests in 60s window get cached error.

**5xx Server Errors (never cached):**
```
Request → CloudFlare Worker
        ↓
        Fetches from origin
        ↓
        ❌ 500/502/503/504 Server Error
        ↓
        Adds Cache-Control: no-store
        ↓
        Returns error WITHOUT caching
```

**Result:** Bug fixes are immediately visible. No cache purge needed.

**Other 4xx Errors (never cached):**
```
Request → CloudFlare Worker
        ↓
        Fetches from origin
        ↓
        ❌ 400/404/etc Client Error
        ↓
        Adds Cache-Control: no-store
        ↓
        Returns error WITHOUT caching
```

**Result:** Client errors (bad requests, not found) aren't cached, fixes show immediately.

**Why this selective approach matters:**
- **429s cached briefly** - Prevents thundering herd on PokeAPI during rate limits
- **5xx never cached** - Deploy a bug fix, users see it instantly
- **4xx never cached** - Fix routing/validation bugs without cache purge
- **Protects your API** - 60s cache on 429s gives PokeAPI time to recover

---

## Testing

### Test 1: Verify Worker is Active

```bash
curl -I https://pokemechanics.app/pokemon/pikachu/red-blue/kanto
```

**Expected:** Should see `cf-cache-status` header indicating CloudFlare handled it

### Test 2: Test Bot Rate Limiting

```bash
# Simulate bot requests (will get rate limited after 10)
for i in {1..15}; do
  curl -A "Googlebot/2.1" -I https://pokemechanics.app/pokemon/pokemon-$i/red-blue/kanto
  echo "Request $i"
done
```

**Expected:**
- First 10: `200 OK` or `304 Not Modified`
- Requests 11-15: `429 Too Many Requests` with `Retry-After: 60` header

### Test 3: Verify Humans Unaffected

```bash
# Normal browser request (not a bot)
curl -I https://pokemechanics.app/pokemon/pikachu/red-blue/kanto
```

**Expected:** Always `200 OK`, never throttled

---

## Monitoring

### View Worker Metrics

1. Go to **Workers & Pages** in CloudFlare
2. Click your `bot-throttler` worker
3. Click **Metrics** tab

**Watch for:**
- **Requests:** Should be handling all traffic to your site
- **Errors:** Should be 0% or very low
- **CPU time:** Should be < 5ms per request

### Check Worker Logs (Real-time)

1. In Worker page, click **Logs** tab
2. Click **Begin log stream**
3. Visit your site in another tab
4. See live logs of Worker decisions

**Log messages you'll see:**
- `[Bot Cache Hit]` - Bot hit cached page (good!)
- `[Bot Allowed]` - Bot under limit, request passed through
- `[Bot Throttled]` - Bot over limit, returned 429

---

## Troubleshooting

### Problem: Cache hit rate still low

**Solution:** Wait 24-48 hours for cache to warm up. Worker + cache work together.

### Problem: Googlebot still causing 429 errors

**Solution:** Increase `BOT_RATE_LIMIT` to 20 or remove the Worker temporarily and let cache handle it.

### Problem: Worker not running

**Check:**
1. Worker is deployed (green checkmark)
2. Route is configured: `pokemechanics.app/*`
3. No other Worker on same route

### Problem: Humans getting throttled

**This should never happen.** Check the Worker code - `detectBot()` function might be misconfigured.

---

## Performance Impact

**Worker overhead:** < 5ms per request
**Free tier limit:** 100,000 requests/day
**Your expected usage:** ~5,000-10,000 requests/day

**Verdict:** Well within free tier limits, negligible performance impact

---

## When to Disable This Worker

You can disable this Worker when:
- ✅ CloudFlare cache hit rate reaches 90%+ sustained
- ✅ 429 errors drop to < 1% of requests
- ✅ PokeAPI usage is consistently under 50 calls/hour

At that point, the cache alone provides sufficient protection and the Worker becomes redundant.

---

## Summary

**This Worker solves:**
- ❌ Aggressive bot crawling overwhelming your API
- ❌ Googlebot causing PokeAPI rate limits
- ❌ 429 errors during cache warm-up

**While maintaining:**
- ✅ SEO (Googlebot can still crawl)
- ✅ User experience (humans never throttled)
- ✅ Site availability (bots slow down naturally)

**Estimated time to stable state:** 2-4 hours after deployment
- Cache warms up
- Bots see 429s and slow down
- Traffic normalizes
- 429 errors drop to near-zero
