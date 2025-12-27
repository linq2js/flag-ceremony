import { ViewStyle } from "react-native";
import { palette, colors } from "./colors";
import { radius, spacing } from "./spacing";
import { glassEffect } from "./effects";

/**
 * Design System - Card & Container Styles
 * 
 * Reusable card and container styles.
 */

// Base card style
const baseCard: ViewStyle = {
  borderRadius: radius["4xl"],
  borderWidth: 1,
  overflow: "hidden",
};

// Card variants
export const cardStyles = {
  // Default card with subtle background
  default: {
    ...baseCard,
    backgroundColor: colors.background.card,
    borderColor: colors.border.default,
  } as ViewStyle,

  // Elevated card with more contrast
  elevated: {
    ...baseCard,
    backgroundColor: palette.white[5],
    borderColor: palette.white[8],
  } as ViewStyle,

  // Gold/accent themed card
  gold: {
    ...baseCard,
    backgroundColor: palette.gold[50],
    borderColor: palette.gold[150],
  } as ViewStyle,

  // Gold featured card (more prominent)
  goldFeatured: {
    ...baseCard,
    borderRadius: radius["5xl"],
    backgroundColor: palette.gold[100],
    borderColor: palette.gold[150],
    padding: spacing[10],
  } as ViewStyle,

  // Success/green themed card
  success: {
    ...baseCard,
    backgroundColor: palette.green[50],
    borderColor: palette.green[300],
  } as ViewStyle,

  // Warning/orange themed card
  warning: {
    ...baseCard,
    backgroundColor: palette.orange[50],
    borderColor: palette.orange[300],
  } as ViewStyle,

  // List container (no padding, for items)
  list: {
    ...baseCard,
    backgroundColor: colors.background.card,
    borderColor: colors.border.default,
    padding: 0,
  } as ViewStyle,
} as const;

// Card padding presets
export const cardPadding = {
  none: 0,
  sm: spacing[7], // 16
  md: spacing[9], // 20
  lg: spacing[10], // 24
  xl: spacing[11], // 28
} as const;

// Section header with icon
export const sectionHeader: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: spacing[7],
};

// Icon container in cards
export const iconContainer = {
  small: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  } as ViewStyle,

  medium: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  } as ViewStyle,

  large: {
    width: 48,
    height: 48,
    borderRadius: radius.xl,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  } as ViewStyle,

  xlarge: {
    width: 56,
    height: 56,
    borderRadius: radius["2xl"],
    alignItems: "center" as const,
    justifyContent: "center" as const,
  } as ViewStyle,

  featured: {
    width: 76,
    height: 76,
    borderRadius: radius["4xl"],
    alignItems: "center" as const,
    justifyContent: "center" as const,
  } as ViewStyle,
} as const;

// List item styles
export const listItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  padding: spacing[7],
};

export const listItemDivider: ViewStyle = {
  borderTopWidth: 1,
  borderTopColor: palette.white[4],
};

// Badge/tag styles
export const badge = {
  base: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderWidth: 1,
  } as ViewStyle,

  unlocked: {
    backgroundColor: palette.gold[100],
    borderColor: palette.gold[200],
  } as ViewStyle,

  locked: {
    backgroundColor: palette.white[2],
    borderColor: palette.white[4],
    opacity: 0.5,
  } as ViewStyle,
} as const;

// Status indicator dot
export const statusDot = (color: string): ViewStyle => ({
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: color,
  marginRight: spacing[4],
});

// Calendar day cell
export const calendarDay = {
  cell: {
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 1,
  } as ViewStyle,

  default: {
    backgroundColor: palette.white[4],
    borderColor: palette.white[6],
  } as ViewStyle,

  today: {
    backgroundColor: palette.gold[150],
    borderColor: palette.gold[400],
    borderWidth: 2,
  } as ViewStyle,

  completed: {
    backgroundColor: palette.green[800],
    borderColor: palette.green[600],
  } as ViewStyle,

  future: {
    backgroundColor: palette.white[4],
    borderColor: palette.white[6],
    opacity: 0.5,
  } as ViewStyle,
} as const;

// Merge card style with glass effect
export const withGlass = (cardStyle: ViewStyle): ViewStyle[] => [
  cardStyle,
  glassEffect,
];

