# Deploy Auth Server to Fix redirect_uri_mismatch

## Step 1: Deploy Auth Server to Railway

### 1.1 Go to Railway
- Visit [https://railway.app/](https://railway.app/)
- Sign up/Login with GitHub

### 1.2 Create New Project
- Click **"New Project"**
- Select **"Deploy from GitHub repo"**
- Choose your `google-login-demo` repository
- Railway will automatically detect it's a Node.js app

### 1.3 Get Your Production URL
After deployment, Railway will give you a URL like:
```
https://your-project-name.railway.app
```
**Save this URL - you'll need it for the next steps!**

## Step 2: Set Environment Variables in Railway

In your Railway project dashboard:
1. Go to **"Variables"** tab
2. Add these environment variables:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_secure_session_secret
FRONTEND_URL=https://rebrokerforceai.netlify.app
BASE_URL=https://your-project-name.railway.app
NODE_ENV=production
```

## Step 3: Update Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **"APIs & Services"** > **"Credentials"**
3. Edit your OAuth 2.0 Client ID
4. In **"Authorized redirect URIs"**, add:
   ```
   https://your-project-name.railway.app/auth/google/callback
   ```
5. **Remove** any localhost URLs
6. Click **"Save"**

## Step 4: Set Netlify Environment Variable

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site: `rebrokerforceai`
3. Go to **"Site settings"** > **"Environment variables"**
4. Click **"Add a variable"**
5. Set:
   - **Key**: `VITE_AUTH_SERVER_URL`
   - **Value**: `https://your-project-name.railway.app` (use your actual Railway URL)
   - **Context**: Production
   - **Scope**: All scopes
6. Click **"Save"**

## Step 5: Redeploy Netlify Site

1. In your Netlify dashboard, go to **"Deploys"** tab
2. Click **"Trigger deploy"** > **"Deploy site"**
3. Wait for the deployment to complete

## Step 6: Test

1. Visit https://rebrokerforceai.netlify.app
2. Open browser developer tools (F12)
3. Go to **Console** tab
4. Try clicking the Google Sign-In button
5. Check for any errors in the console

## Troubleshooting

### If you still get localhost errors:
1. Check that `VITE_AUTH_SERVER_URL` is set correctly in Netlify
2. Make sure you redeployed after setting the environment variable
3. Clear your browser cache and try again

### If Railway deployment fails:
1. Check the Railway logs for errors
2. Make sure all environment variables are set correctly
3. Verify your Google OAuth credentials are correct

### To verify the environment variable is working:
1. Open browser developer tools
2. In the Console, type: `console.log(import.meta.env.VITE_AUTH_SERVER_URL)`
3. It should show your Railway URL, not localhost

## Expected Result

After completing these steps:
- Your auth server will run on Railway
- Your frontend will connect to the Railway auth server
- Google OAuth will accept redirects to your Railway domain
- No more localhost redirect errors
