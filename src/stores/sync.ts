/**
 * Sync Store - Handles background syncing of ceremony completions to Supabase
 *
 * Data flow:
 * ```
 * addPendingStats(payload) ──► effect detects change ──► auth() ──► syncStats()
 *                                                                      │
 *                                                                      ▼
 *                                              verifiedStats ◄── extracted from response
 *                                                    │
 *                                                    ▼
 *                                              ceremonyStore.effect() ──► reconcile local stats
 * ```
 *
 * - `verifiedStats` is consumed by `ceremonyStore` to reconcile local state
 */
import { authService } from "@/services/auth";
import { SyncPayload, VerifiedStats } from "@/services/user";
import { effect, meta, store } from "storion";
import { notPersisted, persisted } from "storion/persist";

export const syncStore = store({
  name: "sync",
  state: {
    /** Pending stats data waiting to be synced to server */
    pendingStats: [] as SyncPayload[],
    /** Server-verified stats - consumed by ceremonyStore for reconciliation */
    verifiedStats: null as null | VerifiedStats,
  },
  setup({ state, get, update }) {
    const { auth } = get(authService);

    // ---------------------------------------------------------------------------
    // Background Sync Effect
    // ---------------------------------------------------------------------------
    // Watches pendingSync and automatically syncs when data is available
    // - Uses safe() to handle cancellation if effect re-runs
    // - Updates verifiedStats for ceremonyStore reconciliation
    effect(({ safe }) => {
      // when pendingStats is set, sync to Supabase
      const pendingStats = state.pendingStats;
      if (!pendingStats.length) return;

      // 1. Authenticate (or get cached userService)
      // 2. Sync stats to Supabase
      // 3. Store ranking for leaderboardStore and verifiedStats for ceremonyStore
      safe(auth)
        .then(({ syncStats }) => safe(syncStats, pendingStats[0]))
        .then(({ ranking }) => {
          update((draft) => {
            draft.pendingStats.shift();

            // Extract verified stats for ceremonyStore reconciliation
            // Server returns: verifiedCompleted, verifiedStreak, longestStreak
            if (ranking) {
              draft.verifiedStats = {
                completed: ranking.verifiedCompleted,
                currentStreak: ranking.verifiedStreak,
                longestStreak: ranking.longestStreak,
              };
            }
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
  meta: meta.of(persisted(), notPersisted.for("verifiedStats")),
});
