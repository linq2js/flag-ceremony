import type { Resolver } from "storion/react";
import { settingsStore } from "./settings";

// Service for notification management (uses settings store via DI)
export const notificationService = ({ get }: Resolver) => {
  const { state, actions } = get(settingsStore);

  return {
    getNotificationId: () => state.notificationId,
    setNotificationId: (id: string | null) => actions.setNotificationId(id),
  };
};
