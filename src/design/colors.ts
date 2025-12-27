/**
 * Design System - Colors
 * 
 * Color palette for the Flag Ceremony app.
 * Uses semantic naming for easy theming and consistency.
 */

// Base Colors
export const palette = {
  // Primary - Gold/Amber tones
  gold: {
    50: "rgba(251, 191, 36, 0.05)",
    100: "rgba(251, 191, 36, 0.08)",
    150: "rgba(251, 191, 36, 0.15)",
    200: "rgba(251, 191, 36, 0.25)",
    300: "rgba(251, 191, 36, 0.3)",
    400: "rgba(251, 191, 36, 0.4)",
    500: "#fbbf24",
    600: "rgba(251, 191, 36, 0.6)",
    700: "rgba(251, 191, 36, 0.7)",
  },

  // Accent - Crimson/Red tones (Vietnam flag red)
  crimson: {
    50: "rgba(220, 38, 38, 0.05)",
    100: "rgba(220, 38, 38, 0.08)",
    150: "rgba(220, 38, 38, 0.15)",
    200: "rgba(220, 38, 38, 0.25)",
    300: "rgba(220, 38, 38, 0.3)",
    400: "rgba(220, 38, 38, 0.4)",
    500: "#dc2626",
    light: "#f87171",
  },

  // Success - Green tones
  green: {
    50: "rgba(34, 197, 94, 0.08)",
    100: "rgba(34, 197, 94, 0.12)",
    150: "rgba(34, 197, 94, 0.15)",
    200: "rgba(34, 197, 94, 0.2)",
    300: "rgba(34, 197, 94, 0.25)",
    400: "rgba(34, 197, 94, 0.3)",
    500: "#22c55e",
    600: "rgba(34, 197, 94, 0.5)",
    700: "rgba(74, 222, 128, 0.7)",
    800: "rgba(34, 197, 94, 0.9)",
    light: "#4ade80",
  },

  // Warning - Orange tones
  orange: {
    50: "rgba(251, 146, 60, 0.08)",
    150: "rgba(251, 146, 60, 0.15)",
    300: "rgba(251, 146, 60, 0.3)",
    500: "#fb923c",
    600: "rgba(251, 146, 60, 0.6)",
    700: "rgba(251, 146, 60, 0.7)",
  },

  // Neutral - White with opacity
  white: {
    full: "#ffffff",
    2: "rgba(255,255,255,0.02)",
    3: "rgba(255,255,255,0.03)",
    4: "rgba(255,255,255,0.04)",
    5: "rgba(255,255,255,0.05)",
    6: "rgba(255,255,255,0.06)",
    8: "rgba(255,255,255,0.08)",
    10: "rgba(255,255,255,0.1)",
    20: "rgba(255,255,255,0.2)",
    25: "rgba(255,255,255,0.25)",
    30: "rgba(255,255,255,0.3)",
    40: "rgba(255,255,255,0.4)",
    45: "rgba(255,255,255,0.45)",
    50: "rgba(255,255,255,0.5)",
    55: "rgba(255,255,255,0.55)",
    60: "rgba(255,255,255,0.6)",
    70: "rgba(255,255,255,0.7)",
    80: "rgba(255,255,255,0.8)",
  },

  // Dark background
  dark: {
    base: "#1a0606",
    elevated: "#1a0808",
  },

  // Black with opacity
  black: {
    full: "#000000",
    40: "rgba(0, 0, 0, 0.4)",
  },
} as const;

// Semantic Colors
export const colors = {
  // Text colors
  text: {
    primary: palette.white.full,
    secondary: palette.white[60],
    tertiary: palette.white[40],
    muted: palette.white[45],
    hint: palette.white[30],
    accent: palette.gold[500],
    success: palette.green.light,
    warning: palette.orange[500],
    error: palette.crimson.light,
  },

  // Background colors
  background: {
    primary: palette.dark.base,
    elevated: palette.dark.elevated,
    card: palette.white[3],
    cardHover: palette.white[5],
  },

  // Border colors
  border: {
    default: palette.white[6],
    subtle: palette.white[4],
    accent: palette.gold[200],
    success: palette.green[300],
    warning: palette.orange[300],
  },

  // Status colors
  status: {
    success: palette.green[500],
    successLight: palette.green.light,
    warning: palette.orange[500],
    error: palette.crimson[500],
    errorLight: palette.crimson.light,
  },

  // Brand colors
  brand: {
    primary: palette.gold[500],
    secondary: palette.crimson[500],
  },
} as const;

// Color helpers for dynamic theming
export type StatusVariant = "success" | "warning" | "default" | "gold";

export const getStatusColors = (variant: StatusVariant) => {
  switch (variant) {
    case "success":
      return {
        bg: palette.green[50],
        border: palette.green[300],
        text: palette.green.light,
        textMuted: palette.green[700],
        solid: palette.green[500],
      };
    case "warning":
      return {
        bg: palette.orange[50],
        border: palette.orange[300],
        text: palette.orange[500],
        textMuted: palette.orange[700],
        solid: palette.orange[500],
      };
    case "gold":
    case "default":
    default:
      return {
        bg: palette.gold[100],
        border: palette.gold[200],
        text: palette.gold[500],
        textMuted: palette.gold[700],
        solid: palette.gold[500],
      };
  }
};

