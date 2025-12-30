/**
 * Supabase Service - Anonymous authentication and user service factory
 *
 * Architecture:
 * ```
 * supabaseService (singleton)
 *       │
 *       └── auth() ──► userService (with cached userId)
 *                            │
 *                            ├── getRanking()
 *                            ├── syncStats()
 *                            ├── getTopPatriots()
 *                            └── getGlobalStats()
 * ```
 *
 * - Each app installation gets a unique anonymous user ID
 * - User ID is cached after first auth (via `once()`)
 * - Data is protected by Row Level Security (RLS) policies
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Resolver } from "storion";
import once from "lodash-es/once";
import { userService } from "./user";
import { networkService } from "storion/network";
import { abortable, logging, retry } from "storion/async";
import { storageService } from "./storage";
import { ApiClient } from "./types";

// =============================================================================
// CONFIGURATION
// =============================================================================

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** Check if Supabase env vars are configured */
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// =============================================================================
// SERVICE FACTORY
// =============================================================================

/**
 * Create Supabase service with lazy authentication.
 *
 * @example
 * ```ts
 * // In component
 * const supabase = useStore(({ get }) => get(supabaseService));
 *
 * // First call: authenticates and caches userId
 * const user = await supabase.auth();
 *
 * // Subsequent calls: returns cached userService (instant)
 * const ranking = await user.getRanking();
 * ```
 */
export const authService = ({ create, get }: Resolver) => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase not configured");
  }

  const { offlineRetry } = get(networkService);
  const storage = get(storageService);

  // Create Supabase client with AsyncStorage for session persistence
  const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      storage, // Persist session across app restarts
      autoRefreshToken: true, // Auto-refresh JWT tokens
      persistSession: true, // Save session to storage
      detectSessionInUrl: false, // Not needed for React Native
    },
  });

  async function exec<TResult>(
    builder: (
      client: SupabaseClient
    ) => PromiseLike<{ data: unknown; error: unknown | null }>
  ): Promise<TResult> {
    const { data, error } = await builder(supabase);
    if (error) {
      throw new Error((error as any).message || JSON.stringify(error));
    }
    return data as TResult;
  }

  const apiClient: ApiClient = {
    rpc: async (method, args: any = {}) => {
      return exec((client) => client.rpc(method, args));
    },
    exec,
  };

  // ---------------------------------------------------------------------------
  // Authentication (runs once, caches result)
  // ---------------------------------------------------------------------------

  /**
   * Initialize anonymous auth and return userService.
   *
   * - First call: Creates/restores session, returns userService with cached userId
   * - Subsequent calls: Returns same userService instance (via `once()`)
   */
  const auth = once(
    abortable(async () => {
      // 1. Check for existing session (from AsyncStorage)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Already authenticated - return userService with cached userId
        return create(userService, apiClient, session.user.id);
      }

      // 2. No session - create new anonymous user
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("Anonymous sign-in failed");
      }

      // Return userService with new userId
      return create(userService, apiClient, data.user.id);
    })
      .use(retry(3))
      .use(offlineRetry())
      .use(logging("authService.auth"))
  );

  return { auth };
};
