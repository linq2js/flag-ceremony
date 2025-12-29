/**
 * Design System
 * 
 * Central export for all design tokens and utilities.
 * 
 * Usage:
 * ```ts
 * import { colors, textStyles, spacing, cardStyles, getShadow, shadows } from '../design';
 * 
 * // Use in components
 * <View style={[cardStyles.default, { padding: spacing[9] }]}>
 *   <Text style={textStyles.cardTitle}>Hello</Text>
 * </View>
 * ```
 */

// Colors
export {
  palette,
  colors,
  getStatusColors,
  type StatusVariant,
} from "./colors";

// Typography
export {
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  textStyles,
} from "./typography";

// Spacing & Layout
export {
  spacing,
  radius,
  iconSize,
  containerSize,
  screenPadding,
  layout,
  gap,
} from "./spacing";

// Effects
export {
  shadows,
  getShadow,
  glassEffect,
  textShadows,
  getTextShadow,
  decorativeOrb,
} from "./effects";

// Cards & Containers
export {
  cardStyles,
  cardPadding,
  sectionHeader,
  iconContainer,
  listItem,
  listItemDivider,
  badge,
  statusDot,
  calendarDay,
  withGlass,
} from "./cards";

// Buttons
export { buttonStyles, buttonContainer } from "./buttons";

// Convenient re-exports for common patterns
export const ds = {
  // Quick access to common values
  color: {
    gold: "#fbbf24",
    crimson: "#dc2626",
    green: "#22c55e",
    white: "#ffffff",
  },
  
  // Common opacity patterns
  opacity: {
    subtle: 0.05,
    light: 0.1,
    medium: 0.15,
    visible: 0.25,
    prominent: 0.4,
  },
} as const;

