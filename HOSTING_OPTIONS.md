# Frontend Hosting Options

You have several options for hosting your React frontend. You don't have to use Netlify!

## Current Setup: Netlify (Recommended)

**Pros:**

- ✅ Free tier with good limits
- ✅ Easy setup and deployment
- ✅ Automatic deployments from Git
- ✅ Built-in CDN
- ✅ Custom domains
- ✅ Environment variable management

**Cons:**

- ⚠️ Must rebuild after changing environment variables
- ⚠️ Build time limits on free tier

---

## Option 1: Keep Netlify (Easiest)

**Best if**: You want the simplest setup with automatic deployments.

Just make sure to:

1. Set `VITE_AUTH_SERVER_URL` in Netlify environment variables
2. Redeploy after setting environment variables
3. Configure `FRONTEND_URL` in Railway to point to your Netlify URL

---

## Option 2: Host Frontend on Railway

**Best if**: You want everything in one place, or you're already using Railway.

### Steps:

1. **Deploy Frontend to Railway**:

   - Railway dashboard → New Project → Deploy from GitHub
   - Set **Root Directory** to root of your project (not `google-login-demo`)
   - Set **Build Command**: `pnpm build`
   - Set **Start Command**: Serve static files (Railway may auto-detect this)

2. **Configure Railway Service**:

   - Railway will automatically create a public URL for your frontend
   - Example: `https://brokerforce-frontend.up.railway.app`

3. **Update Environment Variables**:

   **Railway Backend**:

   ```env
   BASE_URL=https://your-backend.railway.app
   FRONTEND_URL=https://your-frontend.railway.app  # Update this!
   ```

   **Railway Frontend**:

   ```env
   VITE_AUTH_SERVER_URL=https://your-backend.railway.app
   ```

4. **Update Google OAuth**:
   - Update Authorized JavaScript origins to include your Railway frontend URL

**Pros:**

- ✅ Everything in one platform
- ✅ Easy to manage
- ✅ No separate accounts needed

**Cons:**

- ⚠️ Railway free tier has usage limits
- ⚠️ May need to configure static file serving

---

## Option 3: Vercel

**Best if**: You want fast builds and excellent performance.

### Steps:

1. **Deploy to Vercel**:

   - Go to [Vercel](https://vercel.com/)
   - Import your GitHub repository
   - Vercel will auto-detect React/Vite
   - Set build command: `pnpm build`
   - Set output directory: `dist`

2. **Set Environment Variables**:

   - Vercel dashboard → Your project → Settings → Environment Variables
   - Add: `VITE_AUTH_SERVER_URL=https://your-backend.railway.app`

3. **Update Railway**:
   ```env
   FRONTEND_URL=https://your-app.vercel.app
   ```

**Pros:**

- ✅ Very fast builds
- ✅ Excellent performance
- ✅ Easy Git integration
- ✅ Free tier with good limits

**Cons:**

- ⚠️ Need another account

---

## Option 4: GitHub Pages

**Best if**: You want completely free hosting and already use GitHub.

**Note**: Requires additional configuration for client-side routing (React Router).

**Pros:**

- ✅ Completely free
- ✅ Integrated with GitHub
- ✅ Custom domains supported

**Cons:**

- ⚠️ Requires extra setup for SPA routing
- ⚠️ Must rebuild and commit for updates
- ⚠️ Less convenient for environment variables

---

## Option 5: Same Railway Service (Backend Serves Frontend)

**Best if**: You want everything in one service (not recommended for production).

You can modify the backend to serve the built frontend files, but this is generally not recommended because:

- Mixed concerns (API and static files)
- Harder to scale
- Less optimal for static assets

---

## Recommendation

**For Production**: Stick with Netlify or switch to Vercel

- Both are excellent for React apps
- Easy environment variable management
- Automatic deployments
- Free tiers are generous

**For Simplification**: Use Railway for both frontend and backend

- Everything in one place
- Easier to manage
- Still need to set environment variables correctly

---

## Important: Environment Variables Work the Same Way

**No matter which hosting you choose**, remember:

1. `VITE_AUTH_SERVER_URL` must be set in your **frontend hosting** environment variables
2. `FRONTEND_URL` in Railway must point to your **actual frontend URL**
3. **Must rebuild/redeploy** after changing environment variables (for Vite apps)

---

## Migration Checklist

If switching hosting providers:

- [ ] Set up new hosting service
- [ ] Deploy frontend to new service
- [ ] Set `VITE_AUTH_SERVER_URL` in new service's environment variables
- [ ] Update `FRONTEND_URL` in Railway to new frontend URL
- [ ] Update Google OAuth Authorized JavaScript origins
- [ ] Test sign-in flow
- [ ] Update any documentation or links
