import { TextStyle } from "react-native";
import { colors, palette } from "./colors";

/**
 * Design System - Typography
 * 
 * Consistent text styles across the app.
 */

// Font sizes
export const fontSize = {
  xs: 10,
  sm: 11,
  md: 12,
  base: 13,
  lg: 14,
  xl: 15,
  "2xl": 16,
  "3xl": 18,
  "4xl": 20,
  "5xl": 24,
  "6xl": 28,
  "7xl": 32,
  "8xl": 36,
  "9xl": 40,
  display: 48,
  hero: 72,
  countdown: 160,
} as const;

// Font weights
export const fontWeight = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
  black: "900" as const,
};

// Letter spacing
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 2,
  wider: 4,
} as const;

// Line heights
export const lineHeight = {
  tight: 18,
  normal: 20,
  relaxed: 22,
  loose: 24,
} as const;

// Pre-defined text styles
export const textStyles = {
  // Headers
  screenTitle: {
    fontSize: fontSize["8xl"],
    fontWeight: fontWeight.extrabold,
    color: colors.text.primary,
    letterSpacing: letterSpacing.tighter,
  } as TextStyle,

  sectionTitle: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  } as TextStyle,

  cardTitle: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
    color: colors.text.accent,
  } as TextStyle,

  // Labels
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.accent,
    textTransform: "uppercase" as const,
    letterSpacing: letterSpacing.wider,
  } as TextStyle,

  sublabel: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    color: colors.text.tertiary,
  } as TextStyle,

  // Body text
  body: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.normal,
    color: colors.text.secondary,
    lineHeight: lineHeight.relaxed,
  } as TextStyle,

  bodySmall: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    color: colors.text.muted,
  } as TextStyle,

  // Stats/Numbers
  statValue: {
    fontSize: fontSize["9xl"],
    fontWeight: fontWeight.extrabold,
    color: colors.text.accent,
  } as TextStyle,

  statLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.tertiary,
  } as TextStyle,

  // Ranking
  rankingValue: {
    fontSize: fontSize["9xl"],
    fontWeight: fontWeight.extrabold,
    color: palette.gold[500],
  } as TextStyle,

  // Countdown
  countdown: {
    fontSize: fontSize.countdown,
    fontWeight: fontWeight.black,
    color: palette.gold[500],
  } as TextStyle,

  // Navigation
  tabLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.tertiary,
  } as TextStyle,

  tabLabelActive: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.accent,
  } as TextStyle,

  // Form
  inputLabel: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  } as TextStyle,

  inputHint: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    color: colors.text.muted,
  } as TextStyle,

  // Actions
  buttonText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  } as TextStyle,

  linkText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.normal,
    color: colors.text.tertiary,
  } as TextStyle,

  // Time/Duration
  duration: {
    fontSize: fontSize["7xl"],
    fontWeight: fontWeight.extrabold,
    color: palette.gold[500],
  } as TextStyle,

  time: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.normal,
    color: colors.text.hint,
  } as TextStyle,
} as const;

