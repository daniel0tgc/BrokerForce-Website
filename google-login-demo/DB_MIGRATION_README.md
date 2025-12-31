# Database Migration Guide

## Adding Username/Password Authentication

If you have an existing database with users, you need to run a migration to add the new `username` and `password_hash` columns.

### Migration Steps

1. **For new databases**: The schema will be created automatically with the new columns when the server starts.

2. **For existing databases**: Run the migration script to add the new columns:

```bash
# Option 1: Run via psql
psql $DATABASE_URL -f db/migrate_add_username_password.sql

# Option 2: Run via Node.js (if you have a connection)
node -e "
const { query } = require('./db/index');
const fs = require('fs');
const migration = fs.readFileSync('./db/migrate_add_username_password.sql', 'utf8');
query(migration).then(() => {
  console.log('Migration complete!');
  process.exit(0);
}).catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
"
```

### What the Migration Does

- Adds `username` column (VARCHAR(50), UNIQUE, nullable)
- Adds `password_hash` column (VARCHAR(255), nullable)
- Makes `email` column nullable (was NOT NULL before)
- Adds username validation constraint
- Creates indexes on username and email

### Notes

- Existing Google OAuth users will have `username = NULL` and `password_hash = NULL`
- New username/password users can optionally provide an email
- Account linking: If a user signs in with Google using the same email as an existing username/password account, the accounts will be automatically linked

