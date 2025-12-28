# Flag Ceremony - Supabase Leaderboard Setup Guide

This guide walks through setting up Supabase for the Flag Ceremony app's leaderboard and ranking system.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Supabase Registration](#step-1-supabase-registration)
3. [Project Setup](#step-2-create-supabase-project)
4. [Database Schema](#step-3-database-schema)
5. [Row Level Security](#step-4-row-level-security-rls)
6. [Client Setup](#step-5-client-side-setup) ✅ **DONE**
7. [Testing](#step-6-testing)
8. [Deployment Checklist](#deployment-checklist)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Flag Ceremony App                            │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │   Storion     │  │  Supabase     │  │    Screens    │        │
│  │   Stores      │◄─┤  Service      │◄─┤  (Stats, etc) │        │
│  └───────────────┘  └───────────────┘  └───────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                        Supabase                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │    Auth     │  │  Database   │  │     RLS     │              │
│  │ (Anonymous) │  │ (PostgreSQL)│  │  (Security) │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  Tables:                    Functions:                           │
│  - patriots (users)         - get_ranking()                      │
│  - ceremonies (log)         - submit_ceremony()                  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User completes ceremony
        │
        ▼
┌─────────────────┐
│ Local Storage   │  ← Storion persists locally (offline-first)
│ (AsyncStorage)  │
└────────┬────────┘
         │
         ▼ (when online)
┌─────────────────┐
│ Supabase Sync   │  ← Submit ceremony count
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Get Ranking     │  ← Fetch updated rank & percentile
└─────────────────┘
```

---

## Step 1: Supabase Registration

### 🌐 Done on: Supabase Website

1. **Go to Supabase**

   - URL: https://supabase.com
   - Click "Start your project"

2. **Sign Up**

   - Sign up with GitHub (recommended) or email
   - Verify email if needed

3. **Free Tier Limits** (more than enough for this app)
   | Resource | Limit |
   |----------|-------|
   | Database | 500 MB |
   | Auth Users | 50,000 MAU |
   | Edge Functions | 500K invocations |
   | Realtime | 200 concurrent |
   | Storage | 1 GB |

---

## Step 2: Create Supabase Project

### 🌐 Done on: Supabase Dashboard

1. **Create New Project**
   - Click "New Project"
   - Organization: Create one or use existing
2. **Project Settings**

   ```
   Name: flag-ceremony
   Database Password: [Generate strong password - SAVE THIS!]
   Region: Southeast Asia (Singapore) ← closest to Vietnam
   ```

3. **Wait for Setup** (~2 minutes)

4. **Get API Credentials**

   - Go to: Settings → API
   - Copy and save:
     ```
     Project URL: https://xxxxx.supabase.co
     anon (public) key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

   ⚠️ **Note:** The `anon` key is safe to use in client code (protected by RLS)

---

## Step 3: Database Schema

### 🌐 Done on: Supabase SQL Editor

Go to: **SQL Editor** → **New Query**

### 3.1 Create Tables

```sql
-- ============================================================
-- PATRIOTS TABLE (Users)
-- ============================================================
-- Each app installation is a "patriot" with anonymous auth

CREATE TABLE patriots (
  -- Primary key from Supabase Auth
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Stats synced from device
  completed_ceremonies INT NOT NULL DEFAULT 0,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_ceremony_at TIMESTAMPTZ,

  -- Optional: device info for analytics
  device_os TEXT,  -- 'ios' | 'android' | 'web'
  app_version TEXT
);

-- Index for leaderboard queries
CREATE INDEX idx_patriots_completed ON patriots(completed_ceremonies DESC);
CREATE INDEX idx_patriots_streak ON patriots(longest_streak DESC);

-- ============================================================
-- CEREMONIES TABLE (Activity Log)
-- ============================================================
-- Optional: Log each ceremony for verification & analytics

CREATE TABLE ceremonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patriot_id UUID NOT NULL REFERENCES patriots(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Optional metadata
  duration_seconds INT,  -- How long the ceremony took

  -- Prevent duplicate submissions
  ceremony_date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(patriot_id, ceremony_date)
);

CREATE INDEX idx_ceremonies_patriot ON ceremonies(patriot_id);
CREATE INDEX idx_ceremonies_date ON ceremonies(completed_at DESC);

-- ============================================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER patriots_updated_at
  BEFORE UPDATE ON patriots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

Click **Run** to execute.

---

## Step 4: Row Level Security (RLS)

### 🌐 Done on: Supabase SQL Editor

**This is critical for security!** Without RLS, anyone with the anon key could modify any data.

```sql
-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================

ALTER TABLE patriots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceremonies ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PATRIOTS POLICIES
-- ============================================================

-- Anyone can read the leaderboard (for ranking display)
CREATE POLICY "Public read patriots"
  ON patriots FOR SELECT
  USING (true);

-- Users can only insert their own row (on first sync)
CREATE POLICY "Insert own patriot"
  ON patriots FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can only update their own row
CREATE POLICY "Update own patriot"
  ON patriots FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users cannot delete (preserve history)
-- No DELETE policy = cannot delete

-- ============================================================
-- CEREMONIES POLICIES
-- ============================================================

-- Users can only read their own ceremonies
CREATE POLICY "Read own ceremonies"
  ON ceremonies FOR SELECT
  USING (auth.uid() = patriot_id);

-- Users can only insert their own ceremonies
-- Rate limit: one per day (enforced by UNIQUE constraint)
CREATE POLICY "Insert own ceremony"
  ON ceremonies FOR INSERT
  WITH CHECK (auth.uid() = patriot_id);

-- No update or delete allowed
```

Click **Run** to execute.

### Verify RLS is Enabled

Go to: **Table Editor** → Click on `patriots` → Check that RLS badge shows "RLS Enabled"

---

## Step 5: Client-Side Setup ✅ COMPLETED

### 📱 Files Created

The following files have been created:

| File                                 | Description                     |
| ------------------------------------ | ------------------------------- |
| `src/services/supabase.ts`           | Supabase client & API functions |
| `src/services/leaderboardService.ts` | Storion service integration     |
| `src/services/index.ts`              | Re-exports all services         |

### 5.1 Environment Variables

Create `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important:** `.env` is already in `.gitignore` - never commit API keys!

### 5.2 Usage in Components

```tsx
import { useStore } from "storion/react";
import { leaderboardService } from "@/services";

function StatsScreen() {
  const { ranking, globalStats, syncing, init, refresh } = useStore(
    ({ get }) => {
      const [state, actions] = get(leaderboardService);
      return {
        ranking: state.ranking,
        globalStats: state.globalStats,
        syncing: state.syncing,
        init: actions.init,
        refresh: actions.refresh,
      };
    }
  );

  // Initialize on mount
  useEffect(() => {
    init();
  }, []);

  if (!ranking) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>Rank: #{ranking.rank}</Text>
      <Text>Top {ranking.percentile}%</Text>
      <Text>Total Patriots: {globalStats?.total_patriots}</Text>
    </View>
  );
}
```

### 5.3 Submit Ceremony Completion

```tsx
import { leaderboardService } from "@/services";

// After ceremony completes:
const [, actions] = useStore(({ get }) => get(leaderboardService));

// Submit to leaderboard
await actions.submitCeremony(
  totalCompleted, // Total ceremonies completed
  currentStreak, // Current streak
  longestStreak // Longest streak achieved
);
```

### 5.4 API Functions Available

| Function           | Description                         |
| ------------------ | ----------------------------------- |
| `initAuth()`       | Initialize anonymous user           |
| `syncStats()`      | Sync stats without logging ceremony |
| `getRanking()`     | Get user's rank & percentile        |
| `getGlobalStats()` | Get total patriots & ceremonies     |
| `getTopPatriots()` | Get top N for leaderboard display   |

### 5.5 Service State

```typescript
interface LeaderboardState {
  configured: boolean; // Supabase env vars present
  initialized: boolean; // Auth completed
  syncing: boolean; // Currently syncing
  ranking: RankingData | null;
  globalStats: GlobalStats | null;
  topPatriots: TopPatriot[];
  lastSyncAt: number | null;
  error: string | null;
}
```

---

## Step 6: Testing

### 🌐 Test on Supabase Dashboard

1. **Test Anonymous Auth**

   - Go to: Authentication → Users
   - You should see users appear after app connections

2. **Test RLS Policies**

   - Go to: SQL Editor

   ```sql
   -- This should return data (public read)
   SELECT * FROM patriots LIMIT 10;

   -- Test the sync function (as authenticated user)
   SELECT sync_stats(5, 2, 3, 'test', '1.0.0', false);
   ```

3. **Check Data**
   - Go to: Table Editor → patriots
   - Verify data is being inserted

### 📱 Test in App

```typescript
// Temporary test in App component
import { useEffect } from "react";
import { initAuth, syncStats, getRanking } from "./src/services/supabase";

useEffect(() => {
  async function test() {
    console.log("Testing Supabase...");

    // Test auth
    const userId = await initAuth();
    console.log("User ID:", userId);

    // Test sync
    const result = await syncStats(10, 3, 5);
    console.log("Sync result:", result);

    // Test ranking
    const ranking = await getRanking();
    console.log("Ranking:", ranking);
  }

  test();
}, []);
```

---

## Deployment Checklist

### Before Release

- [ ] **Supabase Dashboard**

  - [ ] RLS enabled on all tables
  - [ ] All policies created
  - [ ] Functions tested
  - [ ] Database backups enabled (Settings → Database)

- [ ] **Security**

  - [ ] `.env` added to `.gitignore`
  - [ ] No service_role key in client code
  - [ ] Rate limiting considered

- [ ] **Client**

  - [ ] Environment variables set for production
  - [ ] Error handling in place
  - [ ] Offline mode works (graceful degradation)

- [ ] **Testing**
  - [ ] Auth flow tested
  - [ ] Sync tested
  - [ ] Ranking calculation verified
  - [ ] Edge cases (new user, no internet)

---

## Quick Reference

### Supabase Dashboard URLs

| Page                                                                | Purpose      |
| ------------------------------------------------------------------- | ------------ |
| https://supabase.com/dashboard/project/YOUR_PROJECT/editor          | SQL Editor   |
| https://supabase.com/dashboard/project/YOUR_PROJECT/auth/users      | Auth Users   |
| https://supabase.com/dashboard/project/YOUR_PROJECT/editor/patriots | Table Editor |
| https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api    | API Keys     |

### Key Files in Project

| File                                 | Purpose                     |
| ------------------------------------ | --------------------------- |
| `src/services/supabase.ts`           | Supabase client & API       |
| `src/services/leaderboardService.ts` | Storion service integration |
| `.env`                               | API keys (gitignored)       |

### API Functions

| Function           | Purpose                         |
| ------------------ | ------------------------------- |
| `initAuth()`       | Create/restore anonymous user   |
| `syncStats()`      | Sync local stats to server      |
| `getRanking()`     | Get user's rank & percentile    |
| `getGlobalStats()` | Get total patriots & ceremonies |

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Dashboard Status**: https://status.supabase.com
