# Production URL Configuration Checklist

Use this checklist to verify all URLs are configured correctly in production.

## 🔍 Critical URL Verification

### 1. Find Your Actual Railway Backend URL

1. Go to [Railway Dashboard](https://railway.app/)
2. Click on your backend service
3. Go to **Settings** tab
4. Scroll to **"Networking"** section
5. **Copy the "Public Domain" URL** - this is your actual backend URL
   - Example: `https://brokerforce-auth-production.up.railway.app`
   - ⚠️ **Note the exact spelling and hyphens!**

### 2. Find Your Actual Frontend URL

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click on your site
3. Look at the **Site overview** - your site URL is displayed there
   - Example: `https://rebrokerforceai.netlify.app` (your actual Netlify URL)
   - ⚠️ **Note the exact spelling and hyphens!**
   - ⚠️ **No trailing slash!**

### 3. Verify Railway Backend Environment Variables

Go to Railway → Your backend service → **Variables** tab:

- [ ] **`BASE_URL`** = Your Railway backend URL (from Step 1)

  - ✅ Must include `https://`
  - ✅ Must match Railway Public Domain exactly
  - Example: `https://brokerforce-auth-production.up.railway.app`

- [ ] **`FRONTEND_URL`** = Your frontend URL (from Step 2)

  - ✅ Must include `https://`
  - ✅ Must match Netlify site URL exactly
  - ✅ No trailing slash
  - Example: `https://brokerforce-website-production.up.railway.app`

- [ ] **`NODE_ENV`** = `production`

- [ ] **`DATABASE_URL`** = Your Supabase connection pooling URI

  - Format: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true`

- [ ] **`GOOGLE_CLIENT_ID`** = Your Google OAuth Client ID

- [ ] **`GOOGLE_CLIENT_SECRET`** = Your Google OAuth Client Secret

- [ ] **`SESSION_SECRET`** = Random 32+ character string

- [ ] **`JWT_SECRET`** = Random 32+ character string (different from SESSION_SECRET)

### 4. Verify Netlify Frontend Environment Variables

Go to Netlify → Your site → **Site settings** → **Environment variables**:

- [ ] **`VITE_AUTH_SERVER_URL`** = Your Railway backend URL (from Step 1)
  - ✅ Must include `https://`
  - ✅ Must match Railway Public Domain exactly
  - ✅ **Check for typos!** (e.g., `websiteproduction` vs `website-production`)
  - Example: `https://brokerforce-auth-production.up.railway.app`

### 5. Verify Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID

**Authorized JavaScript origins:**

- [ ] Your frontend URL: `https://brokerforce-website-production.up.railway.app`
- [ ] Your backend URL: `https://brokerforce-auth-production.up.railway.app`

**Authorized redirect URIs:**

- [ ] `https://your-backend-url.railway.app/auth/google/callback`
  - Replace `your-backend-url` with your actual Railway backend URL from Step 1

### 6. Test Backend Health

Open in browser:

- `https://your-backend-url.railway.app/health`
- Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

If you get 404:

- Backend is not deployed or URL is wrong
- Check Railway deployment status
- Verify the URL matches Railway Public Domain exactly

### 7. Test Backend API

Open in browser:

- `https://your-backend-url.railway.app/api/me`
- Should return JSON (either user data or `{"user":null,"message":"Not authenticated"}`)
- Should NOT return HTML or 404

## 🚨 Common URL Mistakes

❌ **Missing `https://`**

- Wrong: `brokerforce-auth-production.up.railway.app`
- Right: `https://brokerforce-auth-production.up.railway.app`

❌ **Typo in subdomain** (most common!)

- Wrong: `brokerforce-websiteproduction.up.railway.app` (missing hyphen)
- Right: `brokerforce-website-production.up.railway.app`

❌ **Trailing slash**

- Wrong: `https://your-site.netlify.app/`
- Right: `https://your-site.netlify.app`

❌ **Wrong environment variable**

- Frontend URL in `BASE_URL` (should be backend URL)
- Backend URL in `FRONTEND_URL` (should be frontend URL)

## 📋 Quick Verification Steps

1. **Copy Railway backend Public Domain URL** → Use for:

   - Railway `BASE_URL`
   - Netlify `VITE_AUTH_SERVER_URL`
   - Google OAuth callback URI

2. **Copy Netlify site URL** → Use for:

   - Railway `FRONTEND_URL`
   - Google OAuth JavaScript origins

3. **Double-check for typos** - Compare character by character

4. **Redeploy both services** after fixing URLs

5. **Test** - Visit backend `/health` endpoint to verify it's working

## 🔧 After Fixing URLs

1. **Redeploy Railway backend** (variables auto-apply on restart)
2. **Redeploy Netlify frontend** (trigger a new deployment)
3. **Wait 1-2 minutes** for changes to propagate
4. **Test sign-in** - Should redirect to Google, then back to your app

---

**Last Updated**: After CORS and URL typo fixes
**Status**: Production deployment guide
