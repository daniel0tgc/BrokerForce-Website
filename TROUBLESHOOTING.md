# Troubleshooting Guide

Common issues and solutions for BrokerForce deployment and development.

## 🔴 Auth Check Failed: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

### Symptoms

- Frontend shows error: `Auth check failed: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`
- 404 error in browser console
- Sign in button doesn't work

### Causes & Solutions

#### 1. Missing `https://` in BASE_URL

**Problem**: The `BASE_URL` environment variable in Railway is missing the `https://` protocol.

**Solution**:

1. Go to Railway dashboard → Your backend service → Variables tab
2. Find `BASE_URL` variable
3. Ensure it includes `https://`:
   ```
   ✅ Correct: https://brokerforce-website-production.up.railway.app
   ❌ Wrong: brokerforce-website-production.up.railway.app
   ```
4. Redeploy the backend service

#### 2. VITE_AUTH_SERVER_URL Not Set in Netlify

**Problem**: The frontend doesn't know where the backend is located.

**Solution**:

1. Go to Netlify dashboard → Your site → Site settings → Environment variables
2. Add or update:
   - **Key**: `VITE_AUTH_SERVER_URL`
   - **Value**: `https://your-backend.railway.app` (your actual Railway backend URL)
   - **Context**: Production (and Preview if needed)
3. Redeploy the frontend site

#### 3. Backend URL Mismatch

**Problem**: The frontend is trying to connect to the wrong backend URL.

**How to Check**:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to sign in
4. Look for the failed request to `/api/me`
5. Check the full URL in the request - it should match your Railway backend URL

**Solution**: Ensure `VITE_AUTH_SERVER_URL` in Netlify matches your Railway backend URL exactly.

#### 4. CORS Issues

**Problem**: Backend is rejecting requests from frontend due to CORS.

**Solution**:

1. Check Railway backend logs for CORS errors
2. Verify `FRONTEND_URL` in Railway matches your Netlify site URL exactly:
   ```
   ✅ Correct: https://your-site.netlify.app
   ❌ Wrong: http://your-site.netlify.app (missing https)
   ❌ Wrong: https://your-site.netlify.app/ (trailing slash)
   ```
3. Redeploy backend after fixing

#### 5. Backend Not Running

**Problem**: The backend service is down or not deployed.

**How to Check**:

1. Visit `https://your-backend.railway.app/health` in your browser
2. You should see: `{"status":"OK","timestamp":"...","environment":"production"}`

**Solution**:

1. Check Railway dashboard for deployment status
2. Check Railway logs for errors
3. Verify all required environment variables are set
4. Redeploy if necessary

---

## 🔴 Database Connection Errors

### Symptoms

- `ECONNREFUSED` errors in backend logs
- `FATAL: password authentication failed`
- Database queries failing

### Solutions

#### 1. DATABASE_URL Format Issue

**Problem**: The `DATABASE_URL` in Railway is incorrectly formatted.

**Solution**:

1. Go to Supabase → Settings → Database
2. Copy the **Connection Pooling** URI (not the direct connection URI)
3. It should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true
   ```
4. Replace `[YOUR-PASSWORD]` with your actual Supabase database password
5. Paste into Railway `DATABASE_URL` variable
6. Redeploy backend

#### 2. Database Schema Not Initialized

**Problem**: Tables don't exist in the database.

**Solution**:

1. Check Railway backend logs for schema initialization messages
2. You should see: `✅ Database schema initialized successfully!`
3. If not, the backend will try to initialize automatically on startup
4. If it fails, you can manually run the schema SQL in Supabase SQL Editor

---

## 🔴 Google OAuth Not Working

### Symptoms

- Clicking "Sign in with Google" redirects but fails
- `redirect_uri_mismatch` error
- OAuth callback returns error

### Solutions

#### 1. OAuth Callback URL Not Configured

**Problem**: Google OAuth doesn't recognize your production callback URL.

**Solution**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   ```
   https://your-backend.railway.app/auth/google/callback
   ```
5. Under **Authorized JavaScript origins**, add:
   ```
   https://your-backend.railway.app
   https://your-frontend.netlify.app
   ```
6. Click **Save**
7. Wait a few minutes for changes to propagate

#### 2. BASE_URL Mismatch

**Problem**: `BASE_URL` in Railway doesn't match your actual Railway backend URL.

**Solution**:

1. Get your actual Railway backend URL (from Railway dashboard)
2. Update `BASE_URL` in Railway to match exactly (with `https://`)
3. Redeploy backend

---

## 🔴 Frontend Build Errors

### Symptoms

- Netlify build fails
- `pnpm: command not found` error
- Build timeout

### Solutions

#### 1. pnpm Not Available

**Solution**: The `netlify.toml` should handle this, but if it doesn't:

1. Check `netlify.toml` has:
   ```toml
   [build]
     command = "pnpm build"
   ```
2. If pnpm still not found, add to `netlify.toml`:
   ```toml
   [build.environment]
     NPM_FLAGS = "--version=8.10.0"
   ```

#### 2. Environment Variables Not Available at Build Time

**Problem**: `VITE_*` variables need to be set in Netlify for the build to work.

**Solution**: Set all `VITE_*` environment variables in Netlify dashboard before building.

---

## 📋 Quick Checklist

When troubleshooting, verify:

- [ ] `BASE_URL` in Railway includes `https://` and matches actual Railway URL
- [ ] `VITE_AUTH_SERVER_URL` in Netlify matches Railway backend URL exactly
- [ ] `FRONTEND_URL` in Railway matches Netlify site URL exactly (no trailing slash)
- [ ] `DATABASE_URL` in Railway uses Supabase Connection Pooling URI with correct password
- [ ] Google OAuth callback URL is configured in Google Cloud Console
- [ ] Backend is running (check `/health` endpoint)
- [ ] All environment variables are set in both Railway and Netlify
- [ ] Both services have been redeployed after environment variable changes

---

## 🆘 Still Having Issues?

1. **Check Logs**:

   - Railway backend logs: Railway dashboard → Your service → Logs
   - Netlify build logs: Netlify dashboard → Your site → Deploys → Latest deploy → Build log
   - Browser console: F12 → Console tab

2. **Verify URLs**:

   - Backend health: `https://your-backend.railway.app/health`
   - Backend API: `https://your-backend.railway.app/api/me` (should return JSON, not HTML)

3. **Test Locally**:

   - Ensure everything works in local development first
   - Use the same environment variable values locally to test

4. **Common Mistakes**:
   - Forgetting `https://` in URLs
   - Trailing slashes in URLs
   - Wrong environment (development vs production)
   - Not redeploying after environment variable changes
