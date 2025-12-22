# Fix: Sign In Button Redirecting to Localhost

## Problem

When you visit `https://rebrokerforceai.netlify.app/`, clicking "Sign in" redirects to `localhost:3001` instead of your Railway backend URL.

## Root Cause

The `VITE_AUTH_SERVER_URL` environment variable is either:

1. Not set in Netlify environment variables
2. Set incorrectly (e.g., to `http://localhost:3001`)
3. Frontend wasn't rebuilt after setting the variable

## Solution

### Step 1: Set Environment Variable in Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click on your site (`rebrokerforceai`)
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"**
5. Set:
   - **Key**: `VITE_AUTH_SERVER_URL`
   - **Value**: `https://your-backend-url.railway.app` (your actual Railway backend URL)
   - **Context**: Production (and Preview if needed)
   - **Scope**: All scopes
6. Click **"Save"**

### Step 2: Trigger a New Deployment

**Important**: After setting environment variables, you MUST redeploy for changes to take effect!

1. In Netlify dashboard, go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for the build to complete (usually 1-2 minutes)

### Step 3: Verify

1. After deployment completes, visit `https://rebrokerforceai.netlify.app/`
2. Open browser DevTools (F12) → Console tab
3. Click "Sign in"
4. Check the URL in the address bar - it should redirect to your Railway backend URL, NOT localhost

## How Vite Environment Variables Work

- `VITE_*` variables are **baked into the build** at build time
- They are **NOT** read at runtime
- You **must rebuild** the frontend after changing them
- The build process replaces `import.meta.env.VITE_AUTH_SERVER_URL` with the actual value

## Alternative: Verify Current Value

To check what value is currently in your deployed frontend:

1. Visit `https://rebrokerforceai.netlify.app/`
2. Open DevTools (F12) → Console tab
3. Type: `console.log(import.meta.env.VITE_AUTH_SERVER_URL)`
4. Press Enter
5. You'll see the current value (likely `http://localhost:3001` or `undefined`)

## Quick Checklist

- [ ] `VITE_AUTH_SERVER_URL` is set in Netlify environment variables
- [ ] Value is your Railway backend URL with `https://`
- [ ] Value has no trailing slash
- [ ] Context is set to "Production" (and "Preview" if needed)
- [ ] Frontend has been redeployed after setting the variable
- [ ] New deployment shows the updated environment variable in build logs

---

**Note**: If you're still seeing localhost after following these steps, the frontend build may be cached. Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) or clear your browser cache.
