# Supabase Database Setup Guide

Quick reference guide for setting up Supabase as the production database for BrokerForce.

## Why Supabase?

- ✅ **Free Tier**: 500MB database, 2GB bandwidth/month
- ✅ **PostgreSQL**: Full PostgreSQL 15+ compatibility
- ✅ **Easy Setup**: No server management needed
- ✅ **Great Dashboard**: Visual database management
- ✅ **Connection Pooling**: Built-in PgBouncer for better performance
- ✅ **Automatic Backups**: Daily backups included
- ✅ **SSL/TLS**: Secure connections by default

## Quick Setup

### 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub (recommended) or email
3. Verify your email if needed

### 2. Create New Project

1. Click **"New Project"**
2. Fill in:
   - **Organization**: Select or create one
   - **Name**: `brokerforce-production` (or your preferred name)
   - **Database Password**: Create a strong password
     - ⚠️ **Save this password!** You'll need it for the connection string
   - **Region**: Choose closest to your users (US East, EU West, etc.)
   - **Pricing Plan**: **Free** (500MB database)
3. Click **"Create new project"**
4. Wait ~2 minutes for provisioning

### 3. Get Connection String

1. In your Supabase project dashboard, click **Settings** (gear icon) → **Database**
2. Scroll to **"Connection string"** section
3. Click the **"Connection pooling"** tab
4. Under **"Session mode"**, copy the **URI** connection string
   - It looks like: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
   - Or: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true`

**Important:**

- Use the **Connection Pooling** URI (not the direct connection)
- Replace `[YOUR-PASSWORD]` with the password you created
- The connection string format varies slightly by region

### 4. Configure Railway

1. In Railway, go to your backend service
2. Click **"Variables"** tab
3. Add/Update `DATABASE_URL`:
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true
   ```
4. Replace `[YOUR-PASSWORD]` with your actual Supabase password

### 5. Verify Connection

1. After Railway redeploys, check the logs
2. Look for: `✅ Connected to PostgreSQL database`
3. Look for: `✅ Database schema initialized successfully!`

## Database Schema

The schema will be initialized **automatically** when the backend starts. No manual SQL needed!

If you want to view/manage your database:

1. Go to Supabase dashboard
2. Click **"Table Editor"** in left sidebar
3. You'll see all tables: `users`, `user_favorites`, `purchase_requests`, `offers`, `documents`, `payments`

## Manual Schema Initialization (Optional)

If automatic initialization doesn't work:

1. Go to Supabase dashboard → **SQL Editor**
2. Click **"New Query"**
3. Copy contents from `google-login-demo/db/schema.sql`
4. Paste and click **"Run"**

## Connection Pooling

Supabase uses PgBouncer for connection pooling, which is why we use the pooling URI:

- ✅ Better for serverless/cloud deployments
- ✅ Handles many concurrent connections efficiently
- ✅ Reduces connection overhead

**Use Connection Pooling URI** (includes `pgbouncer=true` or port `6543`):

```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true
```

**Don't use Direct Connection URI** (only port `5432`):

```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

## Network Security

Supabase databases are secure by default. Railway should be able to connect without additional configuration.

If you have connection issues:

1. Go to Supabase → Settings → Database
2. Check **"Network Restrictions"**
3. Make sure **"Allow all IPs"** is enabled (default for most projects)
4. Or add Railway's IP range if needed

## Monitoring

**View Database Usage:**

- Supabase dashboard → Settings → Usage
- Check database size, bandwidth, etc.

**View Database Logs:**

- Supabase dashboard → Logs → Database
- Useful for debugging queries

**View Tables:**

- Supabase dashboard → Table Editor
- Browse and manage your data visually

## Free Tier Limits

- **Database Size**: 500MB
- **Bandwidth**: 2GB/month
- **API Requests**: 50,000/month
- **File Storage**: 1GB

For production with real users, this should be sufficient to start. You can upgrade later if needed.

## Troubleshooting

### Can't Connect from Railway

1. **Check connection string format**: Must include password
2. **Use pooling URI**: Should have `?pgbouncer=true` or port `6543`
3. **Verify password**: Test connection string in a PostgreSQL client first
4. **Check network restrictions**: Supabase → Settings → Database

### Schema Not Initializing

1. **Check Railway logs**: Look for error messages
2. **Verify DATABASE_URL**: Make sure it's set correctly
3. **Manual initialization**: Use SQL Editor as fallback (see above)

### Connection Timeout

1. **Use Connection Pooling URI**: This handles timeouts better
2. **Check Railway region**: Should be close to Supabase region
3. **Verify network settings**: Supabase should allow all IPs by default

## Next Steps

After Supabase is set up:

1. ✅ Database is ready
2. ➡️ Deploy backend to Railway (see DEPLOYMENT_GUIDE.md Step 2)
3. ➡️ Deploy frontend to Netlify (see DEPLOYMENT_GUIDE.md Step 5)

---

**Related Documentation:**

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Full deployment instructions
- [Supabase Docs](https://supabase.com/docs) - Official Supabase documentation
