# Cloudflare Turnstile Setup Guide

This document explains how to configure Cloudflare Turnstile for both local development and production deployment.

## Overview

Turnstile is integrated to protect Pokemon pages from bot traffic by requiring users to complete a one-time security challenge. The verification is valid for 24 hours via a secure session cookie.

## Local Development Setup

### 1. Configure `.dev.vars` File

The `.dev.vars` file contains your Turnstile keys for local development. This file is already created but needs your actual keys.

**Edit `.dev.vars` and replace the placeholder values:**

```bash
# Public site key (visible in client-side code)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...

# Secret key (NEVER expose to client - used for server-side validation only)
TURNSTILE_SECRET_KEY=0x4AAAAAAA...
```

**Where to find your keys:**
1. Go to Cloudflare Dashboard
2. Navigate to **Turnstile**
3. Select your widget
4. Copy the **Site Key** and **Secret Key**

### 2. Run Local Development Server

```bash
npm run preview
```

Wrangler will automatically load the `.dev.vars` file.

### 3. Test Locally

1. Visit `http://localhost:8788/pokemon/pikachu/red-blue/kanto`
2. You should be redirected to `/verify?redirect=/pokemon/pikachu/red-blue/kanto`
3. Complete the Turnstile challenge
4. You'll be redirected back to the Pokemon page
5. For the next 24 hours, you won't see the challenge again

## Production Deployment Setup

**IMPORTANT:** Never deploy `.dev.vars` to production. Cloudflare uses encrypted secrets instead.

### Option 1: Using Wrangler CLI (Recommended)

After deploying your code, set the secrets via Wrangler:

```bash
# Deploy your code first
npm run deploy

# Then set the secrets (you'll be prompted to enter each value securely)
wrangler secret put TURNSTILE_SECRET_KEY
wrangler secret put NEXT_PUBLIC_TURNSTILE_SITE_KEY
```

When prompted, paste your production Turnstile keys.

### Option 2: Using Cloudflare Dashboard

1. Go to Cloudflare Dashboard
2. Navigate to **Workers & Pages**
3. Select your `pokemechanics` worker
4. Click **Settings** → **Variables**
5. Under **Environment Variables**, click **Add variable**
6. Add two variables:
   - **Name:** `TURNSTILE_SECRET_KEY`
     - **Value:** (paste your secret key)
     - **Type:** Encrypted
   - **Name:** `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
     - **Value:** (paste your site key)
     - **Type:** Plain text (this is public anyway)
7. Click **Save**
8. Redeploy if necessary

### Verify Production Setup

After deployment:

1. Visit https://pokemechanics.app/pokemon/pikachu/red-blue/kanto
2. You should be redirected to the verification page
3. Complete the Turnstile challenge
4. Verify you're redirected back to the Pokemon page
5. Check that subsequent Pokemon page visits work without re-challenge (for 24 hours)

## How It Works

### User Flow

1. **First Visit:**
   - User → Pokemon page → Middleware detects no session cookie
   - Redirect to `/verify?redirect=/pokemon/pikachu/red-blue/kanto`
   - Turnstile widget loads (invisible unless suspicious traffic detected)
   - User passes challenge → Token sent to `/api/verify-turnstile`
   - Server validates with Cloudflare → Sets 24hr session cookie
   - Redirect back to Pokemon page

2. **Return Visits (within 24 hours):**
   - User → Pokemon page → Middleware finds valid cookie
   - Request proceeds directly to page (no challenge)

3. **Bot Traffic:**
   - Bot → Pokemon page → Middleware detects no cookie
   - Redirect to `/verify`
   - Bot fails Turnstile challenge → No cookie set
   - Bot remains blocked from all Pokemon pages

## Security Features

✅ **Session-based verification:** One challenge per 24 hours
✅ **Managed challenge mode:** Invisible to most users, only shows CAPTCHA to suspicious traffic
✅ **Middleware enforcement:** Bots blocked before reaching CPU-intensive Pokemon pages
✅ **Secure cookies:** HttpOnly, Secure, SameSite=Lax
✅ **Secret key protection:** Never exposed in client code, stored encrypted in Cloudflare

## Troubleshooting

### "Turnstile configuration error" on `/verify` page

- **Cause:** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` not set
- **Fix:** Add the environment variable and redeploy

### "Server configuration error" in API response

- **Cause:** `TURNSTILE_SECRET_KEY` not set
- **Fix:** Run `wrangler secret put TURNSTILE_SECRET_KEY` or add via Dashboard

### Challenge widget not loading

- **Cause:** Browser blocking Cloudflare challenges domain
- **Fix:** Check browser extensions/ad blockers, ensure `challenges.cloudflare.com` is not blocked

### Infinite redirect loop

- **Cause:** Cookie not being set after successful verification
- **Fix:** Check browser allows cookies, verify API route is setting cookie correctly

## Files Created/Modified

**New Files:**
- `.dev.vars` - Local development secrets
- `src/components/TurnstileChallenge.tsx` - Challenge widget component
- `app/verify/page.tsx` - Verification page
- `app/api/verify-turnstile/route.ts` - Validation API endpoint
- `src/utils/validateTurnstile.ts` - Validation utility
- `TURNSTILE_SETUP.md` - This documentation

**Modified Files:**
- `app/layout.tsx` - Added Turnstile script
- `middleware.ts` - Added session verification and `.dev.vars` blocking
- `.gitignore` - Added `.dev.vars`

## Monitoring

After deployment, monitor:

1. **Cloudflare Analytics** → Check reduction in CPU timeout errors
2. **Turnstile Dashboard** → View challenge success/failure rates
3. **Worker Logs** → Watch for validation failures

Expected results:
- Bot traffic blocked at middleware (no CPU usage)
- Legitimate users challenged once per 24 hours
- CPU timeout errors significantly reduced
