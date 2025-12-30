/**
 * Badge Component Types
 */

import { BadgeTheme, BadgeStats } from "../../../stores/badge";

export interface BadgeProps {
  /** User's photo URI */
  photoUri: string | null;
  /** User's display name */
  displayName: string;
  /** Badge theme */
  theme: BadgeTheme;
  /** Stats to display */
  stats: BadgeStats | null;
  /** Which stats to show */
  showTotal: boolean;
  showCurrentStreak: boolean;
  showLongestStreak: boolean;
  showRanking: boolean;
  showMemberSince: boolean;
  /** Translation function */
  t: (key: string, params?: Record<string, unknown>) => string;
  /** Scale factor for preview (1 = full size) */
  scale?: number;
}

