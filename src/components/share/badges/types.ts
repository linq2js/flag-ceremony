/**
 * Badge Component Types
 */

import { BadgeStats } from "../../../stores/badge";

export interface BadgeProps {
  /** User's photo URI */
  photoUri: string | null;
  /** User's display name */
  displayName: string;
  /** Stats to display */
  stats: BadgeStats | null;
  /** Translation function */
  t: (key: string, params?: Record<string, unknown>) => string;
  /** Scale factor for preview (1 = full size) */
  scale?: number;
}
