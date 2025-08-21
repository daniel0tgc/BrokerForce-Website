# Google OAuth Deployment Guide for Netlify

## Overview
To make Google Sign-In work on your Netlify deployment (https://rebrokerforceai.netlify.app), you need to deploy your authentication server and configure Google OAuth properly.

## Step 1: Deploy Auth Server

### Option A: Deploy to Heroku (Recommended)

1. **Create a new Heroku app:**
   ```bash
   cd google-login-demo
   heroku create your-brokerforce-auth-server
   ```

2. **Set environment variables in Heroku:**
   ```bash
   heroku config:set GOOGLE_CLIENT_ID=your_google_client_id
   heroku config:set GOOGLE_CLIENT_SECRET=your_google_client_secret
   heroku config:set SESSION_SECRET=your_secure_session_secret
   heroku config:set FRONTEND_URL=https://rebrokerforceai.netlify.app
   heroku config:set BASE_URL=https://your-brokerforce-auth-server.herokuapp.com
   heroku config:set NODE_ENV=production
   ```

3. **Deploy to Heroku:**
   ```bash
   git add .
   git commit -m "Deploy auth server"
   git push heroku main
   ```

### Option B: Deploy to Railway

1. Go to [Railway](https://railway.app/)
2. Create a new project
3. Connect your GitHub repository
4. Set the same environment variables as above
5. Deploy

## Step 2: Update Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add these URLs to "Authorized redirect URIs":
   - `https://your-auth-server-domain.com/auth/google/callback`
   - `https://rebrokerforceai.netlify.app/auth/google/callback`

## Step 3: Update Frontend Configuration

Once your auth server is deployed, update the `baseUrl` in `src/services/authService.ts`:

```typescript
private baseUrl = 'https://your-auth-server-domain.com'; // Replace with your actual domain
```

## Step 4: Environment Variables for Production

Your auth server needs these environment variables:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_secure_session_secret
FRONTEND_URL=https://rebrokerforceai.netlify.app
BASE_URL=https://your-auth-server-domain.com
NODE_ENV=production
```

## Step 5: Test the Integration

1. Deploy your updated frontend to Netlify
2. Test the Google Sign-In button on https://rebrokerforceai.netlify.app
3. Verify that authentication works properly

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure `FRONTEND_URL` is set correctly in your auth server
2. **Redirect URI Mismatch**: Double-check the redirect URIs in Google Cloud Console
3. **Session Issues**: Verify `SESSION_SECRET` is set and secure
4. **HTTPS Required**: Google OAuth requires HTTPS in production

### Debug Steps:

1. Check auth server logs for errors
2. Verify environment variables are set correctly
3. Test the auth server health endpoint: `https://your-auth-server-domain.com/health`
4. Check browser console for CORS or network errors

## Security Notes

- Use strong, unique session secrets
- Keep your Google Client Secret secure
- Enable HTTPS everywhere
- Consider implementing rate limiting
- Regularly rotate secrets

## Next Steps

After deployment:
1. Monitor auth server logs
2. Set up error tracking (Sentry, etc.)
3. Implement user management features
4. Add logout functionality
5. Consider adding other OAuth providers
