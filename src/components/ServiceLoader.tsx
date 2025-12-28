import { persistStore } from "@/stores/persist";
import { useStore } from "storion/react";
import { async } from "storion/async";
import { syncStore } from "@/stores/sync";

/**
 * ServiceLoader - Blocks rendering until all persist tasks are loaded.
 * When a child component triggers persist middleware, tasks are added to
 * persistStore.tasks. This triggers a re-render of ServiceLoader, and
 * async.all() throws the pending promise to suspend rendering.
 */
export function ServiceLoader() {
  useStore(({ get }) => {
    const [state] = get(persistStore);
    // Trigger syncStore to start background sync
    get(syncStore);
    // This should suspend when tasks are pending
    async.all(state.tasks);
  });

  return null;
}
