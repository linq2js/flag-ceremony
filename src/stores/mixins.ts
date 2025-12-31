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
// FEEDBACK MIXINS
// =============================================================================

interface FeedbackPayload {
  category: "bug" | "feature" | "question" | "other";
  message: string;
  appVersion: string;
  buildNumber: string;
  platform: string;
}

/**
 * Mixin to get feedback submission function.
 *
 * @example
 * const { submitFeedback } = useStore(mixins({ submitFeedback: submitFeedbackMixin }));
 * await submitFeedback({ category: "bug", message: "...", ... });
 */
export const submitFeedbackMixin = ({ get }: SelectorContext) => {
  const { auth } = get(authService);

  return async (payload: FeedbackPayload) => {
    const user = await auth();
    return user.submitFeedback(payload);
  };
};

// =============================================================================
// RE-EXPORTS
// =============================================================================

// i18n mixins
export { tMixin, languageMixin, dayNamesMixin, setLanguageMixin } from "./i18n";

// Settings mixins
export {
  reminderSettingsMixin,
  updateReminderSettingsMixin,
  nicknameMixin,
  updateNicknameMixin,
} from "./settings";

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
