import { SupabaseClient } from "@supabase/supabase-js";

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
