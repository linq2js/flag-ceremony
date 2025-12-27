import { ViewStyle } from "react-native";

/**
 * Design System - Spacing & Layout
 * 
 * Consistent spacing and layout tokens.
 */

// Base spacing scale (4px increments)
export const spacing = {
  0: 0,
  1: 4,
  2: 6,
  3: 8,
  4: 10,
  5: 12,
  6: 14,
  7: 16,
  8: 18,
  9: 20,
  10: 24,
  11: 28,
  12: 32,
  14: 40,
  16: 48,
  20: 80,
  24: 120,
  32: 200,
} as const;

// Border radius
export const radius = {
  none: 0,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
  "2xl": 18,
  "3xl": 20,
  "4xl": 24,
  "5xl": 28,
  full: 9999,
} as const;

// Common icon sizes
export const iconSize = {
  xs: 14,
  sm: 18,
  md: 20,
  lg: 22,
  xl: 24,
  "2xl": 28,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 56,
  hero: 72,
} as const;

// Common avatar/icon container sizes
export const containerSize = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 44,
  xl: 48,
  "2xl": 56,
  "3xl": 76,
} as const;

// Screen paddings
export const screenPadding = {
  horizontal: spacing[7], // 16
  vertical: spacing[9], // 20
  bottom: spacing[24], // 120 (for tab bar)
  bottomLarge: spacing[32], // 200
} as const;

// Layout helpers
export const layout = {
  // Full width container with horizontal padding
  container: {
    paddingHorizontal: screenPadding.horizontal,
  } as ViewStyle,

  // Screen content wrapper
  screenContent: {
    flex: 1,
  } as ViewStyle,

  // Scroll content with bottom padding
  scrollContent: {
    paddingBottom: screenPadding.bottom,
  } as ViewStyle,

  scrollContentLarge: {
    paddingBottom: screenPadding.bottomLarge,
  } as ViewStyle,

  // Centered content
  centered: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
  } as ViewStyle,

  // Row with gap
  row: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  } as ViewStyle,

  rowBetween: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  } as ViewStyle,

  // Card grid
  cardRow: {
    flexDirection: "row" as const,
    gap: spacing[5], // 12
  } as ViewStyle,

  // Section spacing
  section: {
    marginBottom: spacing[10], // 24
  } as ViewStyle,

  sectionLarge: {
    marginBottom: spacing[12], // 32
  } as ViewStyle,
} as const;

// Gap utilities
export const gap = {
  xs: spacing[2], // 6
  sm: spacing[3], // 8
  md: spacing[4], // 10
  lg: spacing[5], // 12
  xl: spacing[7], // 16
  "2xl": spacing[9], // 20
  "3xl": spacing[10], // 24
} as const;

