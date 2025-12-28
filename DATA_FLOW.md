# Flag Ceremony - Data Flow Design

## Overview

The app uses a **hybrid offline-first** architecture:

- **Local (Client)**: Full functionality offline via AsyncStorage
- **Server (Supabase)**: Leaderboard validation when online

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Offline-First)                   │
│                                                                  │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐            │
│  │  Ceremony  │───▶│  ceremonyStore  │───▶│ AsyncStorage │            │
│  │  Screen    │    │  (local stats)  │    │              │            │
│  └────────────┘    └───────┬────┘    └────────────┘            │
│                            │                                     │
│                            ▼                                     │
│                    ┌────────────┐                               │
│                    │ syncStore  │ ◀── Queues offline submissions │
│                    │ (pending)  │                               │
│                    └──────┬─────┘                               │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │ When online
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER (Supabase)                        │
│                                                                  │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐            │
│  │ sync_stats │───▶│ ceremonies │───▶│  patriots  │            │
│  │   (RPC)    │    │  (logs)    │    │ (ranking)  │            │
│  └────────────┘    └────────────┘    └────────────┘            │
│                                                                  │
│  Server calculates: verified_completed, verified_streak          │
│  Client stats are IGNORED for leaderboard                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Storage: Client vs Server

### Client (AsyncStorage via Storion)

| Store           | Data                                       | Purpose                         |
| --------------- | ------------------------------------------ | ------------------------------- |
| `ceremonyStore` | `logs[]`, `currentStreak`, `longestStreak` | Personal stats, offline history |
| `syncStore`     | `pendingStats[]`                           | Queue for offline submissions   |
| `settingsStore` | `language`, `reminderSettings`             | User preferences                |
| `i18nStore`     | `language`                                 | Localization                    |

### Server (Supabase)

| Table        | Data                                                                                   | Purpose                       |
| ------------ | -------------------------------------------------------------------------------------- | ----------------------------- |
| `patriots`   | `device_id`, `display_name`, `verified_completed`, `verified_streak`, `longest_streak` | Leaderboard ranking           |
| `ceremonies` | `patriot_id`, `created_at`                                                             | Server-verified ceremony logs |

---

## Two-Tier Stats System

| Stat                     | Client (Local)                | Server (Leaderboard)         |
| ------------------------ | ----------------------------- | ---------------------------- |
| **Completed Ceremonies** | From `logs.filter(completed)` | From `COUNT(ceremonies)`     |
| **Current Streak**       | Calculated locally            | Calculated from `ceremonies` |
| **Longest Streak**       | Tracked locally               | `MAX(verified_streak)`       |
| **Rank**                 | N/A                           | Calculated from `patriots`   |

> **Key Principle**: Users can see inflated local stats if they hack the app, but the leaderboard only reflects server-verified data.

---

## Data Submission Flow

### What Gets Submitted

When a ceremony completes, the client sends **only the date**:

```typescript
interface SyncPayload {
  /** ISO date string (YYYY-MM-DD) when ceremony was completed */
  ceremonyDate: string;
}
```

**Why only the date?**

- Server calculates ALL stats from `ceremonies` table
- No client hints = no way to fake stats
- Date is essential for offline ceremonies (synced days later)
- Server validates date (max 7 days backdating allowed)

### Offline Sync Example

```
Monday: Complete ceremony offline → queued: { ceremonyDate: "2024-01-15" }
Tuesday: Still offline → queued: { ceremonyDate: "2024-01-16" }
Wednesday: Online → syncs both with correct dates ✅
```

### Anti-Cheat: Date Validation

```
Today: 2024-01-17
Valid dates: 2024-01-10 to 2024-01-17 (7 days back)
Invalid: 2024-01-09 (too old, rejected)
Invalid: 2024-01-18 (future, rejected)
```

### What Server Does

```sql
1. Validate ceremony_date (not future, max 7 days old)
2. Rate limit check (max 3/day for the given date)
3. Insert into ceremonies with provided ceremony_date
4. Calculate verified_completed = COUNT(ceremonies)
5. Calculate verified_streak from ceremonies dates
6. Update patriots with SERVER-calculated values
7. Return ranking (based on server data)
```

---

## Data Flow Scenarios

### 1. Ceremony Completion (Online)

```
Client                          Server
  │                               │
  │ Complete ceremony             │
  │ ──────────────────────────────│
  │                               │
  ├─▶ Update ceremonyStore        │
  │   (local logs, streaks)       │
  │                               │
  ├─▶ Add to syncStore.pending    │
  │                               │
  │ ────sync_stats()─────────────▶│
  │                               ├─▶ Rate limit check
  │                               ├─▶ INSERT ceremonies
  │                               ├─▶ Calculate verified stats
  │                               ├─▶ UPDATE patriots
  │◀────────ranking───────────────│
  │                               │
  ├─▶ Update leaderboardStore     │
  │   (show rank)                 │
```

### 2. Ceremony Completion (Offline)

```
Client                          Server
  │                               │
  │ Complete ceremony             │ (unreachable)
  │                               │
  ├─▶ Update ceremonyStore        │
  │   (local logs, streaks)       │
  │                               │
  ├─▶ Add to syncStore.pending    │
  │   [QUEUED]                    │
  │                               │
  │ ... user continues offline ...│
  │                               │
  │ Complete another ceremony     │
  │                               │
  ├─▶ Update ceremonyStore        │
  ├─▶ Add to syncStore.pending    │
  │   [QUEUED: 2 items]           │
  │                               │
```

### 3. Sync When Back Online

```
Client                          Server
  │                               │
  │ Network restored              │
  │                               │
  │ ────sync_stats(item1)────────▶│
  │                               ├─▶ Process & verify
  │◀────────ranking───────────────│
  │                               │
  ├─▶ Remove item1 from pending   │
  │                               │
  │ ────sync_stats(item2)────────▶│
  │                               ├─▶ Process & verify
  │◀────────ranking───────────────│
  │                               │
  ├─▶ Remove item2 from pending   │
  ├─▶ Update leaderboardStore     │
  ├─▶ Reconcile local stats       │  ◀── NEW: Overwrite with server data
```

---

## Data Reconciliation

After each sync, the server may reject some ceremonies (rate limited, date too old). To keep client and server in sync, **overwrite local stats with server-verified data**.

### Why Reconcile?

```
Scenario: User completes 5 ceremonies offline over 10 days

Client (local):     5 completed, streak: 5
Server (verified):  3 completed, streak: 2  (2 rejected: dates too old)

Without reconciliation: User sees inflated stats
With reconciliation:    User sees accurate, server-verified stats
```

### Reconciliation Flow

```
Client                              Server
  │                                   │
  │ ────sync_stats(ceremony)─────────▶│
  │                                   ├─▶ Validate & process
  │◀────────ranking { ... }───────────│
  │                                   │
  │ ranking contains:                 │
  │   - completed: 3                  │
  │   - current_streak: 2             │
  │   - longest_streak: 5             │
  │                                   │
  ├─▶ ceremonyStore.reconcile({       │
  │     completed: 3,                 │
  │     currentStreak: 2,             │
  │     longestStreak: 5,             │
  │   })                              │
  │                                   │
  │ Local stats now match server ✅   │
```

### What Gets Reconciled

| Local State           | Server Response          | Action                      |
| --------------------- | ------------------------ | --------------------------- |
| `completedCeremonies` | `ranking.completed`      | Overwrite with server value |
| `currentStreak`       | `ranking.current_streak` | Overwrite with server value |
| `longestStreak`       | `ranking.longest_streak` | Keep MAX(local, server)     |

### Implementation Notes

```typescript
// syncStore: After successful sync
.then(({ ranking }) => {
  update((draft) => {
    draft.pendingStats.shift();
    draft.lastRanking = ranking;
  });

  // Reconcile local stats with server truth
  if (ranking) {
    reconcileWithServer(ranking);
  }
});

// ceremonyStore: Reconcile action
const reconcileWithServer = (ranking: RankingData) => {
  state.completedCeremonies = ranking.completed;
  state.currentStreak = ranking.current_streak;
  state.longestStreak = Math.max(state.longestStreak, ranking.longest_streak);
};
```

### Local Logs Handling

Local `logs[]` array is **not reconciled** - it remains as a local history for the user. Only the computed stats are corrected:

| Data                  | Reconciled? | Reason                               |
| --------------------- | ----------- | ------------------------------------ |
| `logs[]`              | ❌ No       | Local history, useful for UI/offline |
| `completedCeremonies` | ✅ Yes      | Must match server for consistency    |
| `currentStreak`       | ✅ Yes      | Must match server for leaderboard    |
| `longestStreak`       | ✅ Yes      | Must match server for leaderboard    |

---

## Database Setup

### Step 1: Clean Up Existing Database

Run this in Supabase SQL Editor to **completely remove** existing structure:

```sql
-- ============================================================================
-- CLEANUP: Remove all existing tables, functions, and policies
-- ============================================================================

-- Drop functions first (they may reference tables)
DROP FUNCTION IF EXISTS sync_stats(INTEGER, INTEGER, INTEGER, TEXT, TEXT, BOOLEAN);
DROP FUNCTION IF EXISTS get_ranking(TEXT);
DROP FUNCTION IF EXISTS get_global_stats();

-- Drop tables (order matters due to foreign keys)
DROP TABLE IF EXISTS ceremonies CASCADE;
DROP TABLE IF EXISTS patriots CASCADE;

-- Verify cleanup
SELECT 'Cleanup complete. Tables and functions removed.' AS status;
```

### Step 2: Create New Database Structure

```sql
-- ============================================================================
-- PATRIOTS TABLE: User profiles and leaderboard stats
-- ============================================================================

CREATE TABLE patriots (
  id SERIAL PRIMARY KEY,
  device_id TEXT UNIQUE NOT NULL,
  display_name TEXT,

  -- Server-verified stats (calculated from ceremonies table)
  verified_completed INTEGER DEFAULT 0,
  verified_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  last_sync_at TIMESTAMPTZ DEFAULT now()
);

-- Index for ranking queries
CREATE INDEX idx_patriots_ranking ON patriots (verified_completed DESC, longest_streak DESC);
CREATE INDEX idx_patriots_device ON patriots (device_id);

-- ============================================================================
-- CEREMONIES TABLE: Server-verified ceremony logs
-- ============================================================================

CREATE TABLE ceremonies (
  id SERIAL PRIMARY KEY,
  patriot_id INTEGER REFERENCES patriots(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  ceremony_date DATE DEFAULT CURRENT_DATE
);

-- Index for streak calculation and rate limiting
CREATE INDEX idx_ceremonies_patriot_date ON ceremonies (patriot_id, ceremony_date DESC);
CREATE INDEX idx_ceremonies_date ON ceremonies (ceremony_date);

-- Note: Rate limit (max 3/day) is enforced in sync_stats function, not via index
-- PostgreSQL doesn't support subqueries in index expressions

-- ============================================================================
-- HELPER FUNCTION: Calculate current streak from ceremonies
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_streak(p_patriot_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_last_ceremony_date DATE;
BEGIN
  -- Get the most recent ceremony date
  SELECT ceremony_date INTO v_last_ceremony_date
  FROM ceremonies
  WHERE patriot_id = p_patriot_id
  ORDER BY ceremony_date DESC
  LIMIT 1;

  -- No ceremonies = no streak
  IF v_last_ceremony_date IS NULL THEN
    RETURN 0;
  END IF;

  -- If last ceremony was not today or yesterday, streak is broken
  IF v_last_ceremony_date < v_current_date - 1 THEN
    RETURN 0;
  END IF;

  -- Count consecutive days backwards
  WITH RECURSIVE streak_days AS (
    -- Start from most recent ceremony
    SELECT DISTINCT ceremony_date AS d
    FROM ceremonies
    WHERE patriot_id = p_patriot_id
    AND ceremony_date = v_last_ceremony_date

    UNION ALL

    -- Add previous day if it exists
    SELECT c.ceremony_date
    FROM ceremonies c
    JOIN streak_days s ON c.ceremony_date = s.d - 1
    WHERE c.patriot_id = p_patriot_id
  )
  SELECT COUNT(DISTINCT d) INTO v_streak FROM streak_days;

  RETURN v_streak;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MAIN FUNCTION: sync_stats
-- ============================================================================

CREATE OR REPLACE FUNCTION sync_stats(
  p_ceremony_date DATE,       -- Date when ceremony was completed (YYYY-MM-DD)
  p_device_os TEXT DEFAULT NULL,
  p_app_version TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id INTEGER;
  v_device_id TEXT;
  v_date_count INTEGER;
  v_verified_completed INTEGER;
  v_verified_streak INTEGER;
  v_longest_streak INTEGER;
  v_rank INTEGER;
  v_total_users INTEGER;
  v_percentile NUMERIC;
  v_max_backdate INTEGER := 7; -- Max days allowed to backdate
BEGIN
  -- Get device_id from auth context
  v_device_id := auth.uid()::TEXT;

  -- Validate ceremony date
  IF p_ceremony_date > CURRENT_DATE THEN
    RETURN json_build_object('error', 'Cannot log future ceremonies');
  END IF;

  IF p_ceremony_date < CURRENT_DATE - v_max_backdate THEN
    RETURN json_build_object('error', 'Ceremony date too old (max 7 days)');
  END IF;

  -- Get or create user
  INSERT INTO patriots (device_id)
  VALUES (v_device_id)
  ON CONFLICT (device_id) DO UPDATE SET
    last_sync_at = now()
  RETURNING id INTO v_user_id;

  -- Rate limit: check count for the given date
  SELECT COUNT(*) INTO v_date_count
  FROM ceremonies
  WHERE patriot_id = v_user_id
  AND ceremony_date = p_ceremony_date;

  -- Allow max 3 per day
  IF v_date_count < 3 THEN
    INSERT INTO ceremonies (patriot_id, ceremony_date)
    VALUES (v_user_id, p_ceremony_date);
  END IF;

  -- Calculate SERVER-VERIFIED stats from ceremonies table
  SELECT COUNT(*) INTO v_verified_completed
  FROM ceremonies
  WHERE patriot_id = v_user_id;

  v_verified_streak := calculate_streak(v_user_id);

  -- Update patriots with verified stats
  UPDATE patriots SET
    verified_completed = v_verified_completed,
    verified_streak = v_verified_streak,
    longest_streak = GREATEST(longest_streak, v_verified_streak)
  WHERE id = v_user_id
  RETURNING longest_streak INTO v_longest_streak;

  -- Calculate ranking
  SELECT COUNT(*) INTO v_total_users FROM patriots WHERE verified_completed > 0;

  SELECT COUNT(*) + 1 INTO v_rank
  FROM patriots
  WHERE verified_completed > v_verified_completed
  OR (verified_completed = v_verified_completed AND longest_streak > v_longest_streak);

  v_percentile := CASE
    WHEN v_total_users > 0 THEN ROUND((1 - (v_rank::NUMERIC / v_total_users)) * 100, 1)
    ELSE 0
  END;

  RETURN json_build_object(
    'ranking', json_build_object(
      'rank', v_rank,
      'totalUsers', v_total_users,
      'percentile', v_percentile,
      'verifiedCompleted', v_verified_completed,
      'verifiedStreak', v_verified_streak,
      'longestStreak', v_longest_streak
    )
  );
END;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE patriots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceremonies ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for the RPC function
CREATE POLICY "Allow insert patriots" ON patriots FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update own patriot" ON patriots FOR UPDATE USING (true);
CREATE POLICY "Allow read patriots" ON patriots FOR SELECT USING (true);

CREATE POLICY "Allow insert ceremonies" ON ceremonies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read own ceremonies" ON ceremonies FOR SELECT USING (true);

-- Grant access to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON patriots TO anon;
GRANT ALL ON ceremonies TO anon;
GRANT USAGE ON SEQUENCE patriots_id_seq TO anon;
GRANT USAGE ON SEQUENCE ceremonies_id_seq TO anon;
GRANT EXECUTE ON FUNCTION sync_stats TO anon;
GRANT EXECUTE ON FUNCTION calculate_streak TO anon;

-- ============================================================================
-- VERIFY SETUP
-- ============================================================================

SELECT 'Database setup complete!' AS status;
```

---

## Anti-Cheat Summary

| Attack Vector         | Protection                                |
| --------------------- | ----------------------------------------- |
| Fake completion count | Server counts from `ceremonies` table     |
| Fake streak           | Server calculates from `ceremonies` dates |
| Bulk submissions      | Rate limited to 3/day                     |
| Replay attacks        | Each ceremony is a new row                |
| Local data tampering  | Only affects client view, not leaderboard |

---

## Store Responsibilities

### `ceremonyStore` (Client)

- **Owns**: Local ceremony logs, local stats
- **Persists to**: AsyncStorage
- **Works offline**: ✅ Yes

### `syncStore` (Client)

- **Owns**: Pending sync queue
- **Persists to**: AsyncStorage
- **Works offline**: ✅ Yes (queues submissions)

### `leaderboardStore` (Client)

- **Owns**: Cached ranking from server
- **Persists to**: Memory only (refreshed on sync)
- **Works offline**: Shows cached data

### Supabase (Server)

- **Owns**: Verified stats, ceremonies, ranking
- **Source of truth**: For leaderboard only

---

## Implementation Checklist

- [x] ceremonyStore - local stats
- [x] syncStore - queue offline submissions
- [x] Persist middleware - save to AsyncStorage
- [x] sync_stats RPC - server validation
- [ ] Update sync_stats to use server-calculated stats
- [ ] Add calculate_streak function
- [ ] Rate limiting (3/day)
- [ ] Display verified stats on leaderboard
- [ ] Show "unverified" indicator for local-only stats
