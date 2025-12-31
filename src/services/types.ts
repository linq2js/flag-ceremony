/**
 * Service Types - Shared types for API services
 */
import { SupabaseClient } from "@supabase/supabase-js";

// =============================================================================
// API CLIENT
// =============================================================================

export interface ApiClient {
  /**
   * Call a server-side function.
   * @param method - The name of the function to call.
   * @param args - The arguments to pass to the function.
   * @returns The result of the function call.
   */
  rpc<TResult = unknown, TArgs extends object = object>(
    method: string,
    args?: TArgs
  ): Promise<TResult>;

  exec<TResult>(
    builder: (
      client: SupabaseClient
    ) => PromiseLike<{ data: unknown; error: unknown | null }>
  ): Promise<TResult>;
}

// =============================================================================
// RANKING & LEADERBOARD
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

// =============================================================================
// SYNC
// =============================================================================

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
// FEEDBACK
// =============================================================================

/** Feedback submission payload */
export interface FeedbackPayload {
  category: "bug" | "feature" | "question" | "other";
  message: string;
  appVersion: string;
  buildNumber: string;
  platform: string;
}
