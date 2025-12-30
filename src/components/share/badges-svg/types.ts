/**
 * SVG Badge Component Types
 */

import { Platform } from "react-native";
import { BadgeStats } from "../../../stores/badge";

export interface SVGBadgeProps {
  /** User's photo as base64 data URI (for SVG embedding) */
  photoDataUri: string | null;
  /** User's display name */
  displayName: string;
  /** Stats to display */
  stats: BadgeStats | null;
  /** Translation function */
  t: (key: string, params?: Record<string, unknown>) => string;
  /** Width of the badge (default 300) */
  width?: number;
  /** Height of the badge (default 300) */
  height?: number;
}

export interface BadgeType {
  id: string;
  name: string;
  component: React.FC<SVGBadgeProps>;
  /** Aspect ratio (width/height), default 1 */
  aspectRatio?: number;
}

/**
 * Platform-specific font family for SVG text
 * Uses system fonts for best compatibility
 */
export const FONT_FAMILY = Platform.select({
  ios: "System",
  android: "Roboto",
  default: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
});

export const FONT_FAMILY_BOLD = Platform.select({
  ios: "System",
  android: "Roboto",
  default: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
});

