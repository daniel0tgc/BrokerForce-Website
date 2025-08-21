# Quick Fix for redirect_uri_mismatch Error

## The Problem
You're getting `Error 400: redirect_uri_mismatch` because:
- Your auth server is still running locally (`localhost:3001`)
- Google OAuth only allows redirects to registered domains
- You need to deploy your auth server to production first

## Solution: Deploy to Railway (Free & Easy)

### Step 1: Deploy Auth Server
1. Go to [Railway](https://railway.app/)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `google-login-demo` repository
6. Railway will automatically detect it's a Node.js app and deploy

### Step 2: Get Your Production URL
After deployment, Railway will give you a URL like:
```
https://your-project-name.railway.app
```

### Step 3: Set Environment Variables in Railway
In your Railway project dashboard:
1. Go to "Variables" tab
2. Add these environment variables:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_secure_session_secret
FRONTEND_URL=https://rebrokerforceai.netlify.app
BASE_URL=https://your-project-name.railway.app
NODE_ENV=production
```

### Step 4: Update Google OAuth Redirect URIs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Edit your OAuth 2.0 Client ID
4. **Remove** `https://rebrokerforceai.netlify.app/auth/google/callback`
5. **Add** `https://your-project-name.railway.app/auth/google/callback`

### Step 5: Update Netlify Environment Variable
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site: `rebrokerforceai`
3. Go to "Site settings" > "Environment variables"
4. Set: `VITE_AUTH_SERVER_URL = https://your-project-name.railway.app`

### Step 6: Test
1. Visit https://rebrokerforceai.netlify.app
2. Try Google Sign-In
3. It should now work without the redirect_uri_mismatch error

## Alternative: Deploy to Render
If Railway doesn't work, try [Render](https://render.com/):
1. Create new Web Service
2. Connect GitHub repo
3. Set environment variables
4. Deploy

## Why This Fixes the Error
- Your auth server will run on a real domain (not localhost)
- Google OAuth will accept redirects to your production domain
- Your frontend will connect to the deployed auth server
- No more localhost redirects

## Troubleshooting
- If Railway deployment fails, check the logs
- Make sure all environment variables are set correctly
- Verify the Google OAuth redirect URI matches exactly
- Test the auth server health: `https://your-domain.com/health`
