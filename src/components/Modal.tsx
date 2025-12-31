/**
 * Modal - Full-screen modal component with design system integration
 *
 * Features:
 * - Full screen overlay with backdrop blur
 * - Optional close button (can be disabled for required modals)
 * - Animated entrance/exit
 * - Keyboard-aware layout
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal as RNModal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { CloseIcon } from "./Icons";
import { palette, spacing, textStyles, radius } from "../design";

// =============================================================================
// TYPES
// =============================================================================

export interface ModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when modal is closed */
  onClose?: () => void;
  /** Modal title */
  title?: string;
  /** Modal subtitle/description */
  subtitle?: string;
  /** Whether to show close button (default: true) */
  showCloseButton?: boolean;
  /** Whether tapping backdrop closes the modal (default: true if showCloseButton) */
  closeOnBackdrop?: boolean;
  /** Content to render inside the modal */
  children: React.ReactNode;
  /** Test ID for e2e testing */
  testID?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  showCloseButton = true,
  closeOnBackdrop,
  children,
  testID,
}) => {
  const insets = useSafeAreaInsets();

  // Default closeOnBackdrop to showCloseButton value
  const canCloseOnBackdrop = closeOnBackdrop ?? showCloseButton;

  const handleBackdropPress = () => {
    if (canCloseOnBackdrop && onClose) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={showCloseButton ? onClose : undefined}
      testID={testID}
    >
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress}>
          <View style={styles.backdrop} />
        </Pressable>
      </BlurView>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        pointerEvents="box-none"
      >
        <View
          style={[
            styles.content,
            {
              paddingTop: insets.top + spacing[6],
              paddingBottom: insets.bottom + spacing[6],
            },
          ]}
          pointerEvents="box-none"
        >
          {/* Header */}
          <View style={styles.header}>
            {/* Close button */}
            {showCloseButton && onClose && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityLabel="Close modal"
              >
                <CloseIcon size={24} color={palette.white[60]} />
              </TouchableOpacity>
            )}

            {/* Title & Subtitle */}
            {(title || subtitle) && (
              <View style={styles.titleContainer}>
                {title && <Text style={styles.title}>{title}</Text>}
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              </View>
            )}
          </View>

          {/* Body */}
          <View style={styles.body}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
  },
  header: {
    marginBottom: spacing[8],
  },
  closeButton: {
    alignSelf: "flex-end",
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: palette.white[8],
    marginBottom: spacing[4],
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    ...textStyles.screenTitle,
    textAlign: "center",
    marginBottom: spacing[2],
  },
  subtitle: {
    ...textStyles.body,
    textAlign: "center",
    color: palette.white[60],
    maxWidth: 280,
  },
  body: {
    flex: 1,
  },
});

// =============================================================================
// MODAL INPUT STYLES (for use in modal content)
// =============================================================================

export const modalInputStyles = StyleSheet.create({
  inputContainer: {
    backgroundColor: palette.white[5],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.white[10],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    marginBottom: spacing[4],
  },
  inputContainerFocused: {
    borderColor: palette.gold[400],
    backgroundColor: palette.white[8],
  },
  inputContainerError: {
    borderColor: palette.crimson[500],
  },
  input: {
    ...textStyles.body,
    color: palette.white.full,
    fontSize: 18,
    textAlign: "center",
  },
  errorText: {
    ...textStyles.bodySmall,
    color: palette.crimson.light,
    textAlign: "center",
    marginTop: spacing[2],
  },
  hintText: {
    ...textStyles.bodySmall,
    color: palette.white[40],
    textAlign: "center",
    marginTop: spacing[2],
  },
  validText: {
    ...textStyles.bodySmall,
    color: palette.green[500],
    textAlign: "center",
    marginTop: spacing[2],
  },
});

