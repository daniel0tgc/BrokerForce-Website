# Google Login Setup Guide for BrokerForce

This guide will help you set up Google OAuth authentication for your BrokerForce website.

## Overview

The Google login system consists of:
1. **Backend Server** (`google-login-demo/`) - Express.js server handling OAuth
2. **Frontend Integration** - React components and services
3. **Google Cloud Console** - OAuth credentials and configuration

## Step 1: Google Cloud Console Setup

### 1.1 Create/Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make sure the project is active

### 1.2 Enable Google+ API
1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on it and press "Enable"

### 1.3 Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. If prompted, configure the OAuth consent screen first:
   - User Type: External
   - App name: "BrokerForce"
   - User support email: Your email
   - Developer contact information: Your email
   - Save and continue through the steps

### 1.4 Configure OAuth Client
1. Application type: "Web application"
2. Name: "BrokerForce Web Client"
3. **Authorized JavaScript origins:**
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (alternative Vite port)
4. **Authorized redirect URIs:**
   - `http://localhost:3001/auth/google/callback` (for development)
5. Click "Create"
6. **Save the Client ID and Client Secret** - you'll need these for the next step

## Step 2: Backend Server Setup

### 2.1 Install Dependencies
```bash
cd google-login-demo
npm install
```

### 2.2 Configure Environment
1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your Google credentials:
   ```env
   GOOGLE_CLIENT_ID=your_actual_client_id_from_step_1
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_from_step_1
   SESSION_SECRET=your-super-secret-session-key-change-this
   BASE_URL=http://localhost:3001
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   PORT=3001
   ```

### 2.3 Start the Server
```bash
npm run dev
```

The server should start on `http://localhost:3001`

### 2.4 Test the Backend
1. Open `http://localhost:3001` in your browser
2. You should see the "BrokerForce Google Login Demo" page
3. Click "Sign in with Google" to test the OAuth flow
4. You should be redirected to Google, then back to the demo page

## Step 3: Frontend Integration

The frontend integration is already set up! The following components have been created/updated:

### 3.1 New Files Created
- `src/services/authService.ts` - Authentication service
- `src/hooks/useAuth.tsx` - React hook for authentication
- `src/components/SignInButton.tsx` - Sign-in button component

### 3.2 Updated Files
- `src/App.tsx` - Added AuthProvider
- All page components - Updated to use SignInButton

### 3.3 Start the Frontend
```bash
# In the main project directory
npm run dev
```

The React app should start on `http://localhost:5173`

## Step 4: Testing the Integration

### 4.1 Test the Complete Flow
1. Make sure both servers are running:
   - Backend: `http://localhost:3001`
   - Frontend: `http://localhost:5173`

2. Go to your React app homepage
3. Click the "Sign in" button in the header
4. You should be redirected to Google OAuth
5. After signing in, you'll be redirected back to your app
6. The sign-in button should now show your name and avatar
7. Click on your name to see a dropdown with logout option

### 4.2 Verify Session Persistence
1. Refresh the page - you should still be signed in
2. Close the browser and reopen - you should still be signed in
3. Click logout and verify you're signed out

## Step 5: Production Deployment

### 5.1 Update Environment Variables
For production, update the `.env` file:
```env
NODE_ENV=production
BASE_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com
SESSION_SECRET=very-long-random-secret-key
```

### 5.2 Update Google Cloud Console
1. Go back to your OAuth client settings
2. Add your production domain to authorized origins:
   - `https://your-domain.com`
3. Add your production callback URL:
   - `https://your-domain.com/auth/google/callback`

### 5.3 Security Considerations
- Use HTTPS in production
- Use a strong SESSION_SECRET
- Consider using a database instead of in-memory storage
- Set up proper CORS for your production domain

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Check that the redirect URI in Google Console matches exactly
   - Make sure there are no trailing slashes

2. **CORS errors**
   - Verify the frontend URL is correct in the backend CORS configuration
   - Check that credentials are included in requests

3. **Session not persisting**
   - Ensure cookies are being set properly
   - Check that the domain and path are correct

4. **"Invalid client" error**
   - Verify your Google Client ID and Secret are correct
   - Make sure the OAuth consent screen is configured

### Debug Mode
- Check browser console for frontend errors
- Check server console for backend errors
- Use browser dev tools to inspect network requests
- Verify cookies are being set in Application/Storage tab

## API Reference

### Backend Endpoints
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback (handled automatically)
- `POST /auth/logout` - Logout user
- `GET /api/me` - Get current user info
- `GET /api/session` - Get session status
- `GET /health` - Health check

### Frontend Usage
```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Welcome, {user?.name}!</div>;
  }
  
  return <button onClick={login}>Sign in</button>;
}
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure both servers are running
4. Check browser and server console logs
5. Test the backend demo page first to isolate issues
