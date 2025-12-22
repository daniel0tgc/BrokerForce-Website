# Production Environment Variables Setup

## Quick Reference for Production Deployment

### Frontend (Netlify)

Set these in **Netlify Dashboard → Site Settings → Environment Variables**:

```env
VITE_AUTH_SERVER_URL=https://your-backend.railway.app
```

**Important**: Replace `https://your-backend.railway.app` with your actual Railway backend URL.

### Backend (Railway)

Set these in **Railway Dashboard → Your Service → Variables**:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session
SESSION_SECRET=your-secret-32-chars-minimum

# Server Config
PORT=3001
NODE_ENV=production

# URLs (update after deployment)
BASE_URL=https://your-backend.railway.app
FRONTEND_URL=https://your-site.netlify.app

# Database (Supabase Connection Pooling URI)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true

# JWT
JWT_SECRET=your-secret-32-chars-minimum
JWT_EXPIRES_IN=7d
```

## How the Code Works

All frontend services (`authService`, `favoritesService`, `purchaseService`, `dashboardService`, etc.) use this pattern:

```typescript
const baseUrl = import.meta.env.VITE_AUTH_SERVER_URL || "http://localhost:3001";
```

This means:

- ✅ **Production**: Uses `VITE_AUTH_SERVER_URL` from Netlify environment variables
- ✅ **Development**: Falls back to `http://localhost:3001` if not set

**No code changes needed!** Just set the environment variable in Netlify.

## Verification

After setting `VITE_AUTH_SERVER_URL` in Netlify:

1. **Redeploy** your Netlify site (or it will auto-deploy if connected to GitHub)
2. **Test login** - should redirect to your Railway backend
3. **Check browser console** - should show API calls going to your Railway URL, not localhost

## Troubleshooting

### Login still redirects to localhost

- ✅ Make sure `VITE_AUTH_SERVER_URL` is set in Netlify environment variables
- ✅ Redeploy Netlify after setting the variable
- ✅ Check browser console Network tab - what URL is being used?

### CORS errors

- ✅ Make sure `FRONTEND_URL` in Railway matches your Netlify domain
- ✅ Check Railway CORS configuration in `server.js`

### Cookie/session issues

- ✅ Backend cookie settings are already configured for production (`sameSite: "none"`, `secure: true`)
- ✅ Make sure `NODE_ENV=production` is set in Railway
