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
import { settingsStore } from "./settings";

export const syncStore = store({
  name: "sync",
  state: {
    /** Pending stats data waiting to be synced to server */
    pendingStats: [] as SyncPayload[],
    lastSyncNickname: null as null | string,
    /** Server-verified stats - consumed by ceremonyStore for reconciliation */
    verifiedStats: null as null | VerifiedStats,
  },
  setup({ state, get, update }) {
    const { auth } = get(authService);
    const [settingsState] = get(settingsStore);

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

    // ---------------------------------------------------------------------------
    // Nickname Sync Effect
    // ---------------------------------------------------------------------------
    // Watches nickname changes and syncs to server when changed
    effect(({ safe }) => {
      const nickname = settingsState.nickname;

      // Skip if no nickname or already synced
      if (!nickname || nickname === state.lastSyncNickname) return;

      // Sync nickname to server
      safe(auth)
        .then(({ updateDisplayName }) => safe(updateDisplayName, nickname))
        .then(() => {
          update((draft) => {
            draft.lastSyncNickname = nickname;
          });
        })
        .catch((error) => {
          // Log but don't block - nickname is stored locally
          console.warn("Failed to sync nickname:", error);
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
