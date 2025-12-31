/**
 * User Service - Authenticated user operations for leaderboard
 *
 * This service is created after successful authentication with a cached userId.
 * All methods use `abortable()` for automatic cancellation support.
 */
import { Platform } from "react-native";
import { Resolver } from "storion";
import { abortable, logging, retry } from "storion/async";
import Constants from "expo-constants";
import { networkService } from "storion/network";
import { ApiClient } from "./types";

// =============================================================================
// TYPES
// =============================================================================

export interface RankingData {
  /** User's position on the leaderboard (1 = first place) */
  rank: number;
  /** Percentile (0-100, higher is better) */
  percentile: number;
  /** Total number of users on the leaderboard */
  totalUsers: number;
  /** Server-verified completed ceremony count */
  verifiedCompleted: number;
  /** Server-verified current streak */
  verifiedStreak: number;
  /** Server-verified longest streak */
  longestStreak: number;
}

export interface GlobalStats {
  /** Total number of registered patriots */
  total_patriots: number;
  /** Sum of all ceremonies completed by all patriots */
  total_ceremonies: number;
  /** Number of ceremonies completed today */
  ceremonies_today: number;
}

export interface SyncResult {
  success: boolean;
  ranking: RankingData | null;
  error?: string;
}

/**
 * Server-verified stats extracted from RankingData.
 * Used to reconcile local ceremonyStore state after sync.
 */
export interface VerifiedStats {
  /** Server-verified completed ceremonies count */
  completed: number;
  /** Server-verified current streak */
  currentStreak: number;
  /** Server-verified longest streak */
  longestStreak: number;
}

/**
 * Payload for syncing a ceremony completion to the server.
 * Server calculates all stats from ceremonies table.
 */
export interface SyncPayload {
  /** ISO date string (YYYY-MM-DD) when ceremony was completed */
  ceremonyDate: string;
}

// =============================================================================
// SERVICE FACTORY
// =============================================================================

/**
 * Create user service with authenticated Supabase client and cached userId.
 *
 * @param _ - Storion resolver (unused, for service signature compatibility)
 * @param api - Authenticated Supabase client
 * @param userId - Cached user ID from initAuth()
 *
 * @example
 * ```ts
 * const user = userService(resolver, supabase, cachedUserId);
 * const ranking = await user.getRanking();
 * ```
 */
export function userService({ get }: Resolver, api: ApiClient, userId: string) {
  // ---------------------------------------------------------------------------
  // Global Stats
  // ---------------------------------------------------------------------------
  const { offlineRetry } = get(networkService);
  /** Fetch global leaderboard statistics (total patriots, ceremonies, etc.) */
  const getGlobalStats = abortable(async (): Promise<GlobalStats | null> => {
    const data = await api.rpc<GlobalStats[]>("get_global_stats");

    return data?.[0] ?? null;
  }).use(logging("userService.getGlobalStats"));

  // ---------------------------------------------------------------------------
  // Sync Stats
  // ---------------------------------------------------------------------------

  /**
   * Sync a ceremony completion to Supabase.
   * Server logs the ceremony with the provided date and calculates all stats.
   * Supports offline ceremonies (synced later with original date).
   *
   * @param ceremonyDate - ISO date string (YYYY-MM-DD) when ceremony was completed
   */
  const syncStats = abortable(
    async (_, payload: SyncPayload): Promise<SyncResult> => {
      const { ceremonyDate } = payload;

      const data = await api.rpc<SyncResult>("sync_stats", {
        p_ceremony_date: ceremonyDate,
        p_device_os: Platform.OS,
        p_app_version: Constants.expoConfig?.version ?? "unknown",
      });

      return data;
    }
  )
    .use(retry(3)) // Retry up to 3 times for transient errors
    .use(offlineRetry()) // Then wait for network if still failing
    .use(logging("userService.syncStats"));

  // ---------------------------------------------------------------------------
  // Leaderboard
  // ---------------------------------------------------------------------------

  /** Fetch top N patriots for leaderboard display */
  const getTopPatriots = abortable(
    async (
      _,
      limit: number = 10
    ): Promise<
      Array<{
        rank: number;
        verified_completed: number;
        longest_streak: number;
      }>
    > => {
      const data = await api.exec<
        Array<{ verified_completed: number; longest_streak: number }>
      >(({ from }) =>
        from("patriots")
          .select("verified_completed, longest_streak")
          .order("verified_completed", { ascending: false })
          .limit(limit)
      );

      // Add rank numbers
      return (data ?? []).map((p, index) => ({
        rank: index + 1,
        verified_completed: p.verified_completed,
        longest_streak: p.longest_streak,
      }));
    }
  )
    .use(offlineRetry())
    .use(logging("userService.getTopPatriots"));

  /** Get current user's ranking and percentile (uses cached userId) */
  const getRanking = abortable(async (): Promise<RankingData | null> => {
    const data = await api.rpc<RankingData[]>("get_ranking", {
      user_id: userId,
    });

    return data?.[0] ?? null;
  }).use(logging("userService.getRanking"));

  // ---------------------------------------------------------------------------
  // Feedback
  // ---------------------------------------------------------------------------

  /** Feedback submission payload */
  interface FeedbackPayload {
    category: "bug" | "feature" | "question" | "other";
    message: string;
    appVersion: string;
    buildNumber: string;
    platform: string;
  }

  /** Submit user feedback to server */
  const submitFeedback = abortable(
    async (_, payload: FeedbackPayload): Promise<{ success: boolean }> => {
      const data = await api.rpc<{ success?: boolean; error?: string }>(
        "submit_feedback",
        {
          p_category: payload.category,
          p_message: payload.message,
          p_app_version: payload.appVersion,
          p_build_number: payload.buildNumber,
          p_platform: payload.platform,
        }
      );

      if (data?.error) {
        throw new Error(data.error);
      }

      return { success: true };
    }
  )
    .use(retry(2))
    .use(logging("userService.submitFeedback"));

  return { getRanking, getTopPatriots, getGlobalStats, syncStats, submitFeedback };
}
