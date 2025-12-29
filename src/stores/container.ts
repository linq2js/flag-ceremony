import { persist } from "storion/persist";
import { container, forStores } from "storion/react";
import { persistStore } from "./persist";
import { onlineService } from "storion/network";
import { customOnlineService } from "@/services/online";

// Create the container (the "brain" of state management)
export const app = container({
  middleware: forStores(
    persist({
      persistedOnly: true,
      handler({ spec, resolver }) {
        const key = spec.displayName;
        const { actions } = resolver.get(persistStore);

        return {
          save(state) {
            actions.saveData(key, state);
          },
          load() {
            return actions.loadData(key);
          },
        };
      },
    })
  ),
}).set(onlineService, customOnlineService);
