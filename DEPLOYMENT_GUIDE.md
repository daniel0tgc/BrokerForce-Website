# BrokerForce Deployment Guide

Complete step-by-step guide to deploy BrokerForce to production. This guide will walk you through deploying both the frontend and backend, setting up the database, and configuring everything to work together.

## 📋 Overview

**Recommended Production Stack:**

- **Frontend**: React app → Netlify (free tier available)
- **Backend**: Express.js auth server → Railway (free tier available)
- **Database**: PostgreSQL → Supabase (free tier: 500MB)

**Why This Stack?**

- ✅ All services have generous free tiers
- ✅ Easy to set up and maintain
- ✅ Automatic SSL/HTTPS
- ✅ Scales as you grow
- ✅ Great developer experience

BrokerForce consists of:

- **Frontend**: React app (deploy to Netlify)
- **Backend**: Express.js auth server (deploy to Railway)
- **Database**: PostgreSQL (deploy to Supabase)

## 🚀 Quick Start (Step-by-Step)

### Step 1: Set Up Production Database (Supabase)

**📖 For detailed Supabase setup, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

**Quick Setup:**

**Why Supabase?**

- ✅ Free tier with 500MB database storage
- ✅ Built-in PostgreSQL (compatible with our setup)
- ✅ Easy connection pooling
- ✅ Nice dashboard for managing data
- ✅ Automatic backups
- ✅ Works seamlessly with our existing code

**Setup Steps:**

1. Go to [Supabase.com](https://supabase.com/) and sign up/login
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `brokerforce-production` (or any name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (500MB database)
4. Click **"Create new project"** (takes ~2 minutes to provision)
5. Once created, go to **Settings** (gear icon) > **Database**
6. Scroll to **"Connection string"** section
7. Find **"Connection pooling"** tab and click it
8. Copy the **URI** connection string (starts with `postgresql://...`)
   - It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true`
9. ✅ Save this connection string - you'll need it in Step 2!

**Important Notes:**

- Use the **Connection pooling** URI (with `pgbouncer=true`) - this is optimized for serverless/cloud deployments
- The password in the URI is the one you created when setting up the project
- Keep your database password secure - don't commit it to git

### Step 2: Deploy Backend (Auth Server)

#### Using Railway (Recommended)

1. Go to [Railway.app](https://railway.app/)
2. Click **"New Project"** > **"Deploy from GitHub repo"**
3. Select your repository
4. Railway should detect the `google-login-demo` folder automatically
5. If not, set **Root Directory** to `google-login-demo` in project settings

6. **Add Environment Variables** (go to **Variables** tab):

   ```env
   # Google OAuth (get from Google Cloud Console)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Session
   SESSION_SECRET=generate-a-random-secret-32-chars-minimum

   # Server Config
   PORT=3001
   NODE_ENV=production

   # URLs (update after deployment)
   BASE_URL=https://your-app-name.railway.app
   FRONTEND_URL=https://your-site.netlify.app

   # Database (from Step 1)
   DATABASE_URL=postgresql://user:pass@host:5432/db

   # JWT
   JWT_SECRET=generate-a-random-secret-32-chars-minimum
   JWT_EXPIRES_IN=7d
   ```

7. **Generate Secrets** (run these commands):

   ```bash
   # Generate SESSION_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

   # Generate JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

8. After deployment, copy your Railway app URL (e.g., `https://brokerforce-auth.railway.app`)

9. **Update BASE_URL** in Railway variables to match your actual URL

10. ✅ Backend deployed!

### Step 3: Initialize Database Schema

✅ **Automatic Initialization (No Action Needed!)**

The database schema will be initialized **automatically** when the backend server starts for the first time. You don't need to do anything!

**What Happens:**

1. When Railway deploys your backend, the server starts
2. On startup, it automatically runs the database schema initialization
3. All tables are created (`users`, `user_favorites`, `purchase_requests`, `offers`, `documents`, `payments`)
4. Check Railway logs to see: `✅ Database schema initialized successfully!`

**Verify It Worked:**

1. Go to your Railway project dashboard
2. Click on your service
3. Go to **"Deployments"** tab > Click on latest deployment > **"View Logs"**
4. Look for: `✅ Database schema initialized successfully!`

**Manual Option (If Needed):**

If automatic initialization doesn't work (rare), you can manually initialize:

1. Go to your Supabase project dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Copy and paste the contents of `google-login-demo/db/schema.sql`
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see: "Success. No rows returned"

### Step 4: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized JavaScript origins**, add:
   - `https://your-site.netlify.app`
   - `https://your-backend.railway.app`
5. Under **Authorized redirect URIs**, add:
   - `https://your-backend.railway.app/auth/google/callback`
6. Click **Save**
7. ✅ Google OAuth configured!

### Step 5: Deploy Frontend (Netlify)

1. Go to [Netlify.com](https://app.netlify.com/) and sign in
2. Click **"Add new site"** > **"Import an existing project"**
3. Connect your GitHub repository
4. Configure build settings:

   - **Base directory**: (leave empty - root)
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`

   **Note**: If Netlify doesn't have pnpm, add this to `netlify.toml`:

   ```toml
   [build.environment]
     NPM_FLAGS = "--version=8.10.0"
   ```

   Or install pnpm in Netlify build settings.

5. **Add Environment Variable**:

   - Go to **Site settings** > **Environment variables**
   - Click **"Add a variable"**
   - Key: `VITE_AUTH_SERVER_URL`
   - Value: `https://your-backend.railway.app` (from Step 2)
   - Context: Production

6. Click **"Deploy site"**
7. ✅ Frontend deployed!

### Step 6: Test Everything

1. Visit your Netlify site URL
2. Try to sign in with Google
3. If it works, you're done! 🎉

## 🔧 Environment Variables Reference

### Backend (Railway)

All required variables (set these in Railway dashboard):

```env
# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session (generate a random 32+ character string)
SESSION_SECRET=your-secret-32-chars-minimum

# Server (Railway sets PORT automatically, but you can override)
PORT=3001
NODE_ENV=production

# URLs (update after deployment)
BASE_URL=https://your-app-name.railway.app
FRONTEND_URL=https://your-site-name.netlify.app

# Database (from Supabase - use Connection Pooling URI)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true

# JWT (generate a random 32+ character string)
JWT_SECRET=your-secret-32-chars-minimum
JWT_EXPIRES_IN=7d
```

**Generating Secure Secrets:**

Run these commands locally to generate secure random secrets:

```bash
# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_SECRET (different from SESSION_SECRET)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Important Notes:**

- Use the **Connection Pooling** URI from Supabase (includes `?pgbouncer=true`)
- Replace `[PASSWORD]` with your actual Supabase database password
- Never commit secrets to git - only store them in Railway environment variables

### Frontend (Netlify)

```env
VITE_AUTH_SERVER_URL=https://your-backend-domain.com
```

(Optional - only if using SimplyRETS API):

```env
VITE_SIMPLYRETS_API_URL=https://api.simplyrets.com
VITE_SIMPLYRETS_API_KEY=your_api_key
VITE_SIMPLYRETS_SECRET=your_secret
```

## 📝 Deployment Checklist

Before going live, verify:

- [ ] Database is set up and accessible
- [ ] Backend is deployed and accessible at `/health` endpoint
- [ ] All backend environment variables are set correctly
- [ ] Database schema is initialized (check backend logs)
- [ ] Google OAuth is configured with production URLs
- [ ] Frontend is deployed and environment variable is set
- [ ] Frontend can connect to backend (test login)
- [ ] Users can sign in with Google
- [ ] User data is saved to database (test favorites)

## 🐛 Troubleshooting

### Backend won't start

**Check Railway/Heroku logs:**

- Database connection errors → Verify `DATABASE_URL` is correct
- Missing environment variables → Check all required vars are set
- Port errors → Railway/Heroku sets PORT automatically, don't hardcode it

### Database connection fails

**Verify:**

- `DATABASE_URL` format is correct: `postgresql://user:pass@host:port/db`
- Database is accessible from your hosting platform
- No firewall blocking connections

### Google OAuth errors

**Common issues:**

- `redirect_uri_mismatch` → Add your backend callback URL to Google Console
- `invalid_client` → Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

### Frontend can't connect to backend

**Verify:**

- `VITE_AUTH_SERVER_URL` is set in Netlify environment variables
- Frontend was redeployed after setting the variable
- CORS is configured correctly (backend `FRONTEND_URL` matches Netlify URL)

### Database schema not created

**Solutions:**

- Check backend logs for "✅ Database schema initialized successfully!" message
- Schema should initialize automatically on first startup
- If it doesn't, manually run `google-login-demo/db/schema.sql` in your database
- Restart the backend service

## 🔒 Security Notes

1. **Never commit secrets** to git
2. **Use different secrets** for development and production
3. **Rotate secrets** periodically
4. **Enable HTTPS** (automatic on Railway/Netlify)
5. **Keep dependencies updated**

## 📚 Additional Resources

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Detailed Supabase setup guide
- [Supabase Documentation](https://supabase.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🎯 Why This Stack?

### Supabase + Railway + Netlify

This combination provides:

- **Supabase**: Free, managed PostgreSQL with great tooling (500MB free tier)
- **Railway**: Simple backend deployment with auto-scaling (free tier available)
- **Netlify**: Fast, reliable frontend hosting with CDN (free tier available)

**Alternative Options:**

- **Database**: Supabase ✅ (recommended), Railway PostgreSQL, Render PostgreSQL, Heroku Postgres
- **Backend**: Railway ✅ (recommended), Render, Heroku, Fly.io
- **Frontend**: Netlify ✅ (recommended), Vercel, Cloudflare Pages

All use standard PostgreSQL and Node.js, so they're interchangeable.

## 🆘 Need Help?

If you encounter issues:

1. Check the backend logs (Railway/Heroku dashboard)
2. Check the frontend build logs (Netlify dashboard)
3. Verify all environment variables are set correctly
4. Test database connection separately
5. Review the troubleshooting section above

---

**Last Updated**: After production deployment setup
**Status**: Ready for production deployment
