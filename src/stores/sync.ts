/**
 * Sync Store - Background syncing of local data to Supabase
 *
 * ## Offline-First Pattern
 * 1. All changes are stored locally first (with persist middleware)
 * 2. Effects watch for state changes and trigger syncs automatically
 * 3. Uses `offlineRetry()` to auto-retry when network comes back online
 * 4. Syncs run at app startup since effects execute on store initialization
 *
 * ## Data Flows
 *
 * ### Ceremony Stats Sync
 * ```
 * addPendingStats(payload) ──► effect detects change ──► auth() ──► syncStats()
 *                                                                       │
 *                                                                       ▼
 *                                               verifiedStats ◄── extracted from response
 *                                                     │
 *                                                     ▼
 *                                               ceremonyStore.effect() ──► reconcile local stats
 * ```
 *
 * ### Nickname Sync
 * ```
 * settingsStore.nickname changes ──► effect detects diff ──► auth() ──► updateDisplayName()
 *                                                                              │
 *                                                                              ▼
 *                                                          lastSyncNickname ◄── updated on success
 * ```
 *
 * ## Mixins
 * - `pendingStatsMixin`: Handles ceremony stats sync queue
 * - `nicknameSyncMixin`: Syncs nickname/display_name to server
 */
import { authService } from "@/services/auth";
import type { SyncPayload } from "@/services/types";
import { effect, meta, store, StoreContext } from "storion";
import { notPersisted, persisted } from "storion/persist";
import { settingsStore } from "./settings";
import type { SyncStoreState } from "./types";

// Re-export types for convenience
export type { SyncStoreState } from "./types";

// =============================================================================
// STORE DEFINITION
// =============================================================================

export const syncStore = store({
  name: "sync",
  state: {
    /** Pending stats data waiting to be synced to server */
    pendingStats: [],
    lastSyncNickname: null,
    /** Server-verified stats - consumed by ceremonyStore for reconciliation */
    verifiedStats: null,
  } as SyncStoreState,
  setup({ mixin }) {
    mixin(nicknameSyncMixin);
    return mixin(pendingStatsMixin);
  },
  meta: meta.of(persisted(), notPersisted.for("verifiedStats")),
});

// =============================================================================
// PENDING STATS MIXIN
// =============================================================================

/**
 * Handles syncing ceremony completion stats to Supabase.
 * - Watches `pendingStats` array for new entries
 * - Syncs one at a time, removes from queue on success
 * - Extracts `verifiedStats` for ceremonyStore reconciliation
 */
const pendingStatsMixin = ({
  state,
  get,
  update,
}: StoreContext<Pick<SyncStoreState, "pendingStats" | "verifiedStats">>) => {
  const { auth } = get(authService);

  // Watches pendingStats and syncs when data is available
  // Uses safe() to handle cancellation if effect re-runs
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
};

// =============================================================================
// NICKNAME SYNC MIXIN
// =============================================================================

/**
 * Syncs nickname to Supabase `patriots.display_name`.
 * - Watches `settingsStore.nickname` for changes
 * - Compares with `lastSyncNickname` to avoid redundant syncs
 * - Non-blocking: logs errors but doesn't prevent local storage
 */
const nicknameSyncMixin = ({
  state,
  get,
}: StoreContext<Pick<SyncStoreState, "lastSyncNickname">>) => {
  const { auth } = get(authService);
  const [settingsState] = get(settingsStore);

  effect(({ safe }) => {
    const nickname = settingsState.nickname;

    // Skip if no nickname or already synced
    if (!nickname || nickname === state.lastSyncNickname) return;

    // Sync to server, update lastSyncNickname on success
    safe(auth)
      .then(({ updateDisplayName }) => safe(updateDisplayName, nickname))
      .then(() => {
        state.lastSyncNickname = nickname;
      })
      .catch((error) => {
        // Non-blocking: nickname is stored locally regardless
        console.warn("Failed to sync nickname:", error);
      });
  });
};
