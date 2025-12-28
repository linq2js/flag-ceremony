/**
 * Sync Store - Handles background syncing of ceremony completions to Supabase
 *
 * Data flow:
 * ```
 * setPendingSync(payload) ──► effect detects change ──► auth() ──► syncStats()
 *                                                                      │
 *                                                                      ▼
 *                                              lastRanking ◄── ranking from response
 * ```
 *
 * The `lastRanking` is consumed by `leaderboardStore` via `.success()` to
 * hydrate the ranking state without triggering a separate API call.
 */
import { authService } from "@/services/auth";
import { RankingData, SyncPayload } from "@/services/user";
import { effect, store } from "storion";
import { notPersisted, persisted } from "storion/persist";

export const syncStore = store({
  name: "sync",
  state: {
    /** Pending stats data waiting to be synced to server */
    pendingStats: [] as SyncPayload[],
    /** Latest ranking returned from sync - consumed by leaderboardStore */
    lastRanking: null as null | RankingData,
  },
  setup({ state, get, update }) {
    const { auth } = get(authService);

    // ---------------------------------------------------------------------------
    // Background Sync Effect
    // ---------------------------------------------------------------------------
    // Watches pendingSync and automatically syncs when data is available
    // - Uses safe() to handle cancellation if effect re-runs
    // - Uses batch() to update both state props atomically
    effect(({ safe }) => {
      // when pendingSync is set, sync to Supabase
      const pendingStats = state.pendingStats;
      if (!pendingStats.length) return;

      // 1. Authenticate (or get cached userService)
      // 2. Sync stats to Supabase
      // 3. Store returned ranking for leaderboardStore to consume
      safe(auth)
        .then(({ syncStats }) => safe(syncStats, pendingStats[0]))
        .then(({ ranking }) => {
          update((draft) => {
            draft.pendingStats.shift();
            draft.lastRanking = ranking;
          });
        });
    });

    return {
      /** Queue ceremony completion data for background sync */
      addPendingStats: update.action((draft, payload: SyncPayload) => {
        draft.pendingStats.push(payload);
      }),
    };
  },
  meta: [persisted(), notPersisted.for("lastRanking")],
});
