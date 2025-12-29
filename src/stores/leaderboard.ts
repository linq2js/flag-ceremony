/**
 * Leaderboard Store - User ranking and leaderboard state
 *
 * Data flow:
 * ```
 * fetchRanking() ──► authService.auth() ──► userService.getRanking() ──► ranking state
 * ```
 *
 * Uses `async.stale()` to keep showing previous ranking while loading new data.
 */
import { RankingData } from "@/services/user";
import { authService } from "@/services/auth";
import { effect, store } from "storion";
import { trigger, type SelectorContext } from "storion/react";
import { async } from "storion/async";
import { syncStore } from "./sync";

export const leaderboardStore = store({
  state: {
    /**
     * User's ranking data (rank, percentile, streaks, etc.)
     * - `async.stale()`: keeps previous value during loading/error
     * - Shows last known ranking while refreshing
     */
    ranking: async.stale<RankingData | null>(),
  },

  setup({ state, get, focus }) {
    // Get auth service (lazy - doesn't authenticate until auth() called)
    const { auth } = get(authService);
    const [syncState] = get(syncStore);

    // ---------------------------------------------------------------------------
    // Async Actions
    // ---------------------------------------------------------------------------

    /**
     * Fetch user's ranking from Supabase.
     * - `safe(auth)`: ensures authenticated before fetching
     * - `focus("ranking")`: binds result to ranking state
     */
    const rankingAction = async.action(focus("ranking"), async ({ safe }) => {
      // 1. Authenticate (or get cached userService)
      const { getRanking } = await safe(auth);
      // 2. Fetch ranking
      return getRanking();
    });

    // When syncState.verifiedStats changes, update ranking with verified data
    // - Avoids unnecessary fetch if we already have recent data
    // - Uses .success() to directly update state without triggering API call
    effect(() => {
      const verifiedStats = syncState.verifiedStats;
      if (verifiedStats) {
        const currentRanking = state.ranking.data;
        if (currentRanking) {
          // Map VerifiedStats props to RankingData props
          rankingAction.success({
            ...currentRanking,
            verifiedCompleted: verifiedStats.completed,
            verifiedStreak: verifiedStats.currentStreak,
            longestStreak: verifiedStats.longestStreak,
          });
        }
      }
    });

    return {
      /** Trigger ranking fetch (call on Stats screen mount or pull-to-refresh) */
      fetchRanking: rankingAction.dispatch,
    };
  },
});

// =============================================================================
// MIXINS
// =============================================================================

export const rankingMixin = ({ get }: SelectorContext) => {
  const [state, { fetchRanking }] = get(leaderboardStore);
  trigger(fetchRanking);
  return state.ranking;
};
