/**
 * User Service - Authenticated user operations for leaderboard
 *
 * This service is created after successful authentication with a cached userId.
 * All methods use `abortable()` for automatic cancellation support.
 */
import { SupabaseClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import { Resolver } from "storion";
import { abortable, logging } from "storion/async";
import Constants from "expo-constants";
import { networkService } from "storion/network";

// =============================================================================
// TYPES
// =============================================================================

export interface RankingData {
  /** User's position on the leaderboard (1 = first place) */
  rank: number;
  /** Percentile (0-100, higher is better) */
  percentile: number;
  /** Total number of patriots on the leaderboard */
  total_patriots: number;
  /** User's completed ceremony count */
  completed: number;
  /** User's current streak */
  current_streak: number;
  /** User's longest streak */
  longest_streak: number;
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
 * @param supabase - Authenticated Supabase client
 * @param userId - Cached user ID from initAuth()
 *
 * @example
 * ```ts
 * const user = userService(resolver, supabase, cachedUserId);
 * const ranking = await user.getRanking();
 * ```
 */
export function userService(
  { get }: Resolver,
  supabase: SupabaseClient,
  userId: string
) {
  // ---------------------------------------------------------------------------
  // Global Stats
  // ---------------------------------------------------------------------------
  const { offlineRetry } = get(networkService);
  /** Fetch global leaderboard statistics (total patriots, ceremonies, etc.) */
  const getGlobalStats = abortable(async (): Promise<GlobalStats | null> => {
    const { data, error } = await supabase.rpc("get_global_stats");

    if (error) {
      console.error("Get global stats failed:", error.message);
      return null;
    }

    return data?.[0] ?? null;
  }).use(logging("getGlobalStats"));

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

      const { data, error } = await supabase.rpc("sync_stats", {
        p_ceremony_date: ceremonyDate,
        p_device_os: Platform.OS,
        p_app_version: Constants.expoConfig?.version ?? "unknown",
      });

      if (error) {
        throw error;
      }

      return data as SyncResult;
    }
  )
    .use(offlineRetry())
    .use(logging("syncStats"));

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
        completed_ceremonies: number;
        longest_streak: number;
      }>
    > => {
      const { data, error } = await supabase
        .from("patriots")
        .select("completed_ceremonies, longest_streak")
        .order("completed_ceremonies", { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      // Add rank numbers
      return (data ?? []).map((p, index) => ({
        rank: index + 1,
        completed_ceremonies: p.completed_ceremonies,
        longest_streak: p.longest_streak,
      }));
    }
  )
    .use(offlineRetry())
    .use(logging("getTopPatriots"));

  /** Get current user's ranking and percentile (uses cached userId) */
  const getRanking = abortable(async () => {
    const { data, error } = await supabase.rpc("get_ranking", {
      user_id: userId,
    });

    if (error) {
      throw error;
    }

    return data?.[0] ?? null;
  });

  return { getRanking, getTopPatriots, getGlobalStats, syncStats };
}
