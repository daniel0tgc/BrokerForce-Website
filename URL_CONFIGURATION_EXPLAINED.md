# URL Configuration Explained

This document explains which URLs go where and why.

## 🔑 Key Concept: Two Different Services, Two Different URLs

You have **two separate services** that need to communicate:

1. **Frontend** (React app) → Deployed on **Netlify**
2. **Backend** (Express server) → Deployed on **Railway**

Each service needs to know where the other one is located.

---

## 📍 Where Each URL Goes

### Railway Backend Environment Variables

**`BASE_URL`** = Your Railway backend's own URL

- Where: Railway dashboard → Backend service → Variables
- Example: `https://brokerforce-auth-production.up.railway.app`
- Purpose: Used for OAuth callbacks (Google needs to redirect back here)
- **This is Railway's Public Domain URL**

**`FRONTEND_URL`** = Your Netlify frontend URL

- Where: Railway dashboard → Backend service → Variables
- Example: `https://rebrokerforceai.netlify.app`
- Purpose: Used for CORS (tells backend which origin to allow)
- **This is your Netlify site URL**

### Netlify Frontend Environment Variables

**`VITE_AUTH_SERVER_URL`** = Your Railway backend URL

- Where: Netlify dashboard → Site settings → Environment variables
- Example: `https://brokerforce-auth-production.up.railway.app`
- Purpose: Tells the frontend where to send API requests
- **This is Railway's Public Domain URL (same as Railway's BASE_URL)**

---

## ✅ Correct Configuration Example

Let's say:

- **Frontend (Netlify)**: `https://rebrokerforceai.netlify.app`
- **Backend (Railway)**: `https://brokerforce-auth-production.up.railway.app`

### Railway Variables:

```env
BASE_URL=https://brokerforce-auth-production.up.railway.app
FRONTEND_URL=https://rebrokerforceai.netlify.app
NODE_ENV=production
# ... other variables
```

### Netlify Variables:

```env
VITE_AUTH_SERVER_URL=https://brokerforce-auth-production.up.railway.app
```

### Google OAuth Configuration:

- **Authorized JavaScript origins**:
  - `https://rebrokerforceai.netlify.app` (frontend)
  - `https://brokerforce-auth-production.up.railway.app` (backend)
- **Authorized redirect URIs**:
  - `https://brokerforce-auth-production.up.railway.app/auth/google/callback` (backend)

---

## 🔄 How They Work Together

1. **User clicks "Sign in"** on frontend (`rebrokerforceai.netlify.app`)

   - Frontend uses `VITE_AUTH_SERVER_URL` to redirect to backend
   - Redirects to: `https://brokerforce-auth-production.up.railway.app/auth/google`

2. **Backend redirects to Google** for authentication

   - Uses `BASE_URL` to tell Google where to redirect back
   - Google callback URL: `https://brokerforce-auth-production.up.railway.app/auth/google/callback`

3. **Google redirects back to backend** (`/auth/google/callback`)

   - Backend creates session
   - Backend redirects to frontend using `FRONTEND_URL`
   - Redirects to: `https://rebrokerforceai.netlify.app?auth=success`

4. **Frontend makes API calls** to backend
   - Uses `VITE_AUTH_SERVER_URL` for all API requests
   - Example: `https://brokerforce-auth-production.up.railway.app/api/me`
   - Backend allows this because `FRONTEND_URL` matches the request origin

---

## ⚠️ Common Mistakes

❌ **Using frontend URL in `BASE_URL`**

```env
# Wrong!
BASE_URL=https://rebrokerforceai.netlify.app
```

**Problem**: Google OAuth callbacks will fail (Google tries to redirect to frontend instead of backend)

❌ **Using backend URL in `FRONTEND_URL`** (less common, but happens)

```env
# Wrong!
FRONTEND_URL=https://brokerforce-auth-production.up.railway.app
```

**Problem**: CORS will fail (backend expects requests from backend URL, but they come from Netlify)

❌ **Trailing slashes**

```env
# Wrong!
FRONTEND_URL=https://rebrokerforceai.netlify.app/
VITE_AUTH_SERVER_URL=https://brokerforce-auth-production.up.railway.app/
```

**Problem**: URL matching fails, CORS and redirects break

❌ **Missing `https://`**

```env
# Wrong!
BASE_URL=brokerforce-auth-production.up.railway.app
```

**Problem**: URLs won't work, redirects and API calls fail

---

## 📝 Quick Reference

| Variable               | Service | Value                | Where to Find                                 |
| ---------------------- | ------- | -------------------- | --------------------------------------------- |
| `BASE_URL`             | Railway | Railway backend URL  | Railway Settings → Networking → Public Domain |
| `FRONTEND_URL`         | Railway | Netlify frontend URL | Netlify Site Overview                         |
| `VITE_AUTH_SERVER_URL` | Netlify | Railway backend URL  | Railway Settings → Networking → Public Domain |

---

**Summary**:

- Railway needs to know its own URL (`BASE_URL`) and the frontend URL (`FRONTEND_URL`)
- Netlify needs to know the backend URL (`VITE_AUTH_SERVER_URL`)
- They're different because they're different services!
