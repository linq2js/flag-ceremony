import { Platform, ViewStyle, TextStyle } from "react-native";
import { palette } from "./colors";

/**
 * Design System - Effects
 * 
 * Shadows, glass effects, and other visual effects.
 */

// Shadow definitions
type ShadowStyle = {
  web: ViewStyle;
  native: ViewStyle;
};

const createShadow = (
  color: string,
  offsetY: number,
  radius: number,
  opacity: number,
  elevation: number
): ShadowStyle => ({
  web: {
    // @ts-ignore - boxShadow is valid on web
    boxShadow: `0 ${offsetY}px ${radius}px ${color}`,
  },
  native: {
    shadowColor: color.includes("rgba") ? color.split(",")[0].replace("rgba(", "#") : color,
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  },
});

export const shadows = {
  // Card shadows
  card: createShadow("rgba(0, 0, 0, 0.4)", 8, 16, 0.4, 10),
  cardLg: createShadow("rgba(0, 0, 0, 0.4)", 8, 20, 0.4, 15),

  // Colored shadows
  crimson: createShadow("rgba(220, 38, 38, 0.4)", 8, 20, 0.4, 10),
  gold: createShadow("rgba(251, 191, 36, 0.5)", 0, 40, 0.5, 15),
  green: createShadow("rgba(34, 197, 94, 0.4)", 8, 20, 0.4, 10),

  // Tab bar shadow
  tabBar: createShadow("rgba(0, 0, 0, 0.5)", -4, 16, 0.5, 20),
} as const;

// Helper to get platform-specific shadow
export const getShadow = (shadow: ShadowStyle): ViewStyle => {
  return Platform.select({
    web: shadow.web,
    default: shadow.native,
  }) as ViewStyle;
};

// Glass effect (backdrop blur)
export const glassEffect = Platform.select({
  web: {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  },
  default: {},
}) as ViewStyle;

// Text shadow definitions
type TextShadowStyle = {
  web: TextStyle;
  native: TextStyle;
};

const createTextShadow = (
  color: string,
  offsetY: number,
  radius: number
): TextShadowStyle => ({
  web: {
    // @ts-ignore - textShadow is valid on web
    textShadow: `0 ${offsetY}px ${radius}px ${color}`,
  },
  native: {
    textShadowColor: color,
    textShadowOffset: { width: 0, height: offsetY },
    textShadowRadius: radius,
  },
});

export const textShadows = {
  glow: createTextShadow("rgba(251, 191, 36, 0.5)", 0, 40),
  soft: createTextShadow("rgba(0, 0, 0, 0.3)", 2, 4),
} as const;

// Helper to get platform-specific text shadow
export const getTextShadow = (shadow: TextShadowStyle): TextStyle => {
  return Platform.select({
    web: shadow.web,
    default: shadow.native,
  }) as TextStyle;
};

// Decorative orb/blob styles
export const decorativeOrb = (
  color: string,
  size: number,
  position: { top?: number; bottom?: number; left?: number; right?: number }
): ViewStyle => ({
  position: "absolute",
  width: size,
  height: size,
  borderRadius: size / 2,
  backgroundColor: color,
  opacity: 0.1,
  ...position,
});

