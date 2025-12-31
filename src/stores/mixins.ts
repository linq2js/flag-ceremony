/**
 * Re-export all mixins from their respective stores.
 *
 * Each mixin is defined in the store it belongs to.
 * This file provides a single import point for convenience.
 *
 * For mixins that combine multiple stores, define them directly in this file.
 */

import type { SelectorContext } from "storion/react";
import { networkStore } from "storion/network";
import { authService } from "../services/auth";

// =============================================================================
// NETWORK MIXINS
// =============================================================================

/**
 * Mixin to get network online status.
 *
 * @example
 * const { online } = useStore(mixins({ online: onlineMixin }));
 * if (!online) {
 *   // Show offline UI
 * }
 */
export const onlineMixin = ({ get }: SelectorContext): boolean => {
  const [state] = get(networkStore);
  return state.online;
};

// =============================================================================
// AUTH MIXINS
// =============================================================================

/**
 * Mixin to get the auth function for accessing userService.
 *
 * @example
 * const { auth } = useStore(mixins({ auth: authMixin }));
 * const user = await auth();
 * await user.submitFeedback(payload);
 */
export const authMixin = ({ service }: SelectorContext) => {
  const { auth } = service(authService);
  return auth;
};

// =============================================================================
// RE-EXPORTS
// =============================================================================

// i18n mixins
export { tMixin, languageMixin, dayNamesMixin, setLanguageMixin } from "./i18n";

// Settings mixins
export { reminderSettingsMixin, updateReminderSettingsMixin } from "./settings";

// Ceremony mixins
export {
  currentStreakMixin,
  longestStreakMixin,
  totalCeremoniesMixin,
  completedCeremoniesMixin,
  logsMixin,
  memberSinceMixin,
  ceremonyActiveMixin,
  getThisWeekCountMixin,
  getTodayCompletedCountMixin,
  getTodayIncompleteCountMixin,
  getMonthlyCountMixin,
  getRecentLogsMixin,
  addCeremonyLogMixin,
  setCeremonyActiveMixin,
  stopCeremonyAndLogIncompleteMixin,
} from "./ceremony";

// Leaderboard mixins
export { rankingMixin } from "./leaderboard";
