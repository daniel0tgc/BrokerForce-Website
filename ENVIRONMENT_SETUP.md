# Environment Variables Setup for Production

## Overview
To make Google OAuth work on your Netlify deployment, you need to configure environment variables in two places:
1. **Netlify** (for your frontend)
2. **Auth Server** (Heroku/Railway/etc.)

## 1. Netlify Environment Variables (Frontend)

### Step 1: Access Netlify Dashboard
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site: `rebrokerforceai`
3. Go to **Site settings** > **Environment variables**

### Step 2: Add Environment Variables
Add these variables to your Netlify dashboard:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `VITE_AUTH_SERVER_URL` | `https://your-auth-server-domain.com` | Your deployed auth server URL |

### Step 3: Set for Production
- **Context**: Production
- **Scope**: All scopes

### Example:
```
VITE_AUTH_SERVER_URL = https://brokerforce-auth-server.herokuapp.com
```

## 2. Auth Server Environment Variables

### If using Heroku:
```bash
cd google-login-demo
heroku config:set GOOGLE_CLIENT_ID=your_google_client_id
heroku config:set GOOGLE_CLIENT_SECRET=your_google_client_secret
heroku config:set SESSION_SECRET=your_secure_session_secret
heroku config:set FRONTEND_URL=https://rebrokerforceai.netlify.app
heroku config:set BASE_URL=https://your-auth-server-domain.com
heroku config:set NODE_ENV=production
```

### If using Railway:
1. Go to your Railway project dashboard
2. Navigate to **Variables** tab
3. Add the same variables as above

### If using Render:
1. Go to your Render service dashboard
2. Navigate to **Environment** tab
3. Add the same variables as above

## 3. Google OAuth Configuration

### Update Authorized Redirect URIs:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add these URLs to **Authorized redirect URIs**:
   ```
   https://your-auth-server-domain.com/auth/google/callback
   https://rebrokerforceai.netlify.app/auth/google/callback
   ```

## 4. Verification Steps

### Check Netlify Environment Variables:
1. Go to your Netlify dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Verify `VITE_AUTH_SERVER_URL` is set correctly
4. Redeploy your site if needed

### Check Auth Server Environment Variables:
```bash
# For Heroku
heroku config

# For Railway/Render
# Check in their respective dashboards
```

### Test the Integration:
1. Visit https://rebrokerforceai.netlify.app
2. Open browser developer tools (F12)
3. Check the Console tab for any errors
4. Try clicking the Google Sign-In button
5. Verify the redirect works properly

## 5. Troubleshooting

### Common Issues:

#### "VITE_AUTH_SERVER_URL is not defined"
- **Solution**: Make sure the environment variable is set in Netlify dashboard
- **Check**: Go to Site settings > Environment variables

#### CORS Errors
- **Solution**: Verify `FRONTEND_URL` is set correctly in your auth server
- **Check**: Should be `https://rebrokerforceai.netlify.app`

#### Redirect URI Mismatch
- **Solution**: Update Google OAuth redirect URIs
- **Check**: Include both auth server and Netlify domains

#### Auth Server Not Responding
- **Solution**: Check auth server logs
- **Command**: `heroku logs --tail` (for Heroku)

## 6. Environment Variable Reference

### Frontend (Netlify):
```env
VITE_AUTH_SERVER_URL=https://your-auth-server-domain.com
```

### Auth Server (Heroku/Railway/Render):
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_secure_session_secret
FRONTEND_URL=https://rebrokerforceai.netlify.app
BASE_URL=https://your-auth-server-domain.com
NODE_ENV=production
```

## 7. Quick Setup Commands

### For Heroku Auth Server:
```bash
cd google-login-demo
heroku create your-brokerforce-auth-server
heroku config:set GOOGLE_CLIENT_ID=your_google_client_id
heroku config:set GOOGLE_CLIENT_SECRET=your_google_client_secret
heroku config:set SESSION_SECRET=your_secure_session_secret
heroku config:set FRONTEND_URL=https://rebrokerforceai.netlify.app
heroku config:set BASE_URL=https://your-brokerforce-auth-server.herokuapp.com
heroku config:set NODE_ENV=production
git push heroku main
```

### For Netlify Frontend:
1. Set `VITE_AUTH_SERVER_URL` in Netlify dashboard
2. Redeploy your site
3. Test the Google Sign-In functionality

## 8. Security Notes

- Keep your Google Client Secret secure
- Use strong, unique session secrets
- Never commit environment variables to git
- Regularly rotate secrets
- Enable HTTPS everywhere
