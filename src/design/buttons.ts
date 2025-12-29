/**
 * Design System - Buttons
 *
 * Button styles for the Flag Ceremony app.
 * Provides consistent styling for primary, secondary, and other button variants.
 */
import { StyleSheet, type ViewStyle, type TextStyle } from "react-native";
import { palette } from "./colors";
import { spacing, radius } from "./spacing";

// =============================================================================
// BUTTON BASE STYLES
// =============================================================================

const buttonBase: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: radius.lg,
  paddingHorizontal: spacing[6],
  paddingVertical: spacing[4],
};

const buttonTextBase: TextStyle = {
  fontSize: 16,
  fontWeight: "600",
};

// =============================================================================
// BUTTON VARIANTS
// =============================================================================

export const buttonStyles = StyleSheet.create({
  // Primary button - Gold solid background
  primary: {
    ...buttonBase,
    backgroundColor: palette.gold[500],
  },
  primaryText: {
    ...buttonTextBase,
    color: palette.dark.base,
  },
  primaryPressed: {
    opacity: 0.85,
  },
  primaryDisabled: {
    backgroundColor: palette.gold[300],
  },

  // Secondary button - Outlined with gold border
  secondary: {
    ...buttonBase,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: palette.gold[400],
  },
  secondaryText: {
    ...buttonTextBase,
    color: palette.gold[500],
  },
  secondaryPressed: {
    backgroundColor: palette.gold[50],
  },
  secondaryDisabled: {
    borderColor: palette.white[20],
  },
  secondaryTextDisabled: {
    color: palette.white[30],
  },

  // Ghost button - No background, subtle text
  ghost: {
    ...buttonBase,
    backgroundColor: "transparent",
  },
  ghostText: {
    ...buttonTextBase,
    color: palette.white[60],
  },
  ghostPressed: {
    backgroundColor: palette.white[5],
  },

  // Small variant modifier
  small: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
  },
  smallText: {
    fontSize: 14,
  },

  // Icon button (square)
  icon: {
    width: 44,
    height: 44,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: radius.md,
    backgroundColor: palette.white[8],
  },
  iconPressed: {
    backgroundColor: palette.white[12],
  },
});

// =============================================================================
// BUTTON CONTAINER STYLES
// =============================================================================

/**
 * Use these styles to wrap buttons with proper spacing from card edges.
 */
export const buttonContainer = StyleSheet.create({
  /** Standard padding for button inside a card/section */
  inCard: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  /** Larger padding for prominent actions */
  inCardLarge: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[5],
  },
});

