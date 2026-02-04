# Migration to .env

## Changes Made

1. Created `.env.example` with correct environment variable names:
   - Changed `MONGO_USERNAME` → `MONGO_USER`
   - Changed `MONGO_PASSWORD` (kept same)
   - Changed `MONGO_CLUSTER` (kept same)
   - Changed `MONGO_DATABASE` (kept same)

2. Created `.env` with actual values (for development):
   ```
   MONGO_USER=YOUR_ID
   MONGO_PASSWORD=YOUR_PASSWORD
   MONGO_CLUSTER=YOUR_CLUSTER
   MONGO_DATABASE=todoapp
   ```

3. Updated `db/uri.js`:
   - Changed `dotenv.config({ path: "../.env" })` 
   - To `dotenv.config()` (uses `.env` in project root)

## Action Required

**Delete the old `env` file (without dot):**
```bash
rm env
```

The new `.env` file (with dot) should be used instead.

## Summary

- **Old:** `env` file with `MONGO_USERNAME`
- **New:** `.env` file with `MONGO_USER`
- **Location:** Project root (not parent directory)
- **Same as:** Steps 1-4 environment variable names
