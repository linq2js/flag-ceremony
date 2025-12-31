/**
 * NicknameModal - Modal for entering user's nickname
 *
 * Features:
 * - Required on first launch (no close button)
 * - Validation rules:
 *   - 2-20 characters
 *   - No leading/trailing whitespace
 *   - No consecutive spaces
 *   - No special characters except hyphen and underscore
 *   - No offensive words (basic filter)
 * - Real-time validation feedback
 */
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useStore, mixins } from "storion/react";
import { Modal, modalInputStyles } from "./Modal";
import { tMixin, nicknameMixin, updateNicknameMixin } from "../stores";
import {
  palette,
  spacing,
  textStyles,
  buttonStyles,
  radius,
} from "../design";
import { CheckIcon } from "./Icons";

// =============================================================================
// VALIDATION
// =============================================================================

const MIN_LENGTH = 2;
const MAX_LENGTH = 20;

// Basic offensive word filter (can be expanded)
const BLOCKED_WORDS = [
  "admin",
  "moderator",
  "staff",
  "support",
  "system",
  "official",
];

interface ValidationResult {
  isValid: boolean;
  error?: string;
  hint?: string;
}

/**
 * Clean nickname: trim and collapse consecutive spaces
 */
const cleanNickname = (value: string): string => {
  return value
    .trim() // Remove leading/trailing spaces
    .replace(/\s{2,}/g, " "); // Collapse consecutive spaces to single space
};

const validateNickname = (
  value: string,
  t: (key: string, params?: Record<string, any>) => string
): ValidationResult => {
  // Validation works on the cleaned value
  const cleaned = cleanNickname(value);

  // Empty check
  if (!cleaned) {
    return { isValid: false, hint: t("nickname_hint") };
  }

  // Length check
  if (cleaned.length < MIN_LENGTH) {
    return {
      isValid: false,
      error: t("nickname_too_short", { min: MIN_LENGTH }),
    };
  }

  if (cleaned.length > MAX_LENGTH) {
    return {
      isValid: false,
      error: t("nickname_too_long", { max: MAX_LENGTH }),
    };
  }

  // Character validation (letters, numbers, spaces, hyphens, underscores)
  if (!/^[a-zA-Z0-9\s\-_\u00C0-\u024F\u1E00-\u1EFF]+$/.test(cleaned)) {
    return {
      isValid: false,
      error: t("nickname_invalid_chars"),
    };
  }

  // Blocked words check
  const lowerValue = cleaned.toLowerCase();
  for (const word of BLOCKED_WORDS) {
    if (lowerValue.includes(word)) {
      return {
        isValid: false,
        error: t("nickname_reserved"),
      };
    }
  }

  return { isValid: true };
};

// =============================================================================
// TYPES
// =============================================================================

export interface NicknameModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when modal is closed (optional for required modal) */
  onClose?: () => void;
  /** Whether this is required (no close button) */
  required?: boolean;
  /** Callback when nickname is saved successfully */
  onSave?: (nickname: string) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const NicknameModal: React.FC<NicknameModalProps> = ({
  visible,
  onClose,
  required = false,
  onSave,
}) => {
  const { t, currentNickname, updateNickname } = useStore(
    mixins({
      t: tMixin,
      currentNickname: nicknameMixin,
      updateNickname: updateNicknameMixin,
    })
  );

  const [value, setValue] = useState(currentNickname || "");
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Validate on every change
  const validation = useMemo(
    () => validateNickname(value, t),
    [value, t]
  );

  const handleChangeText = useCallback((text: string) => {
    setValue(text);
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  // Get cleaned value for display and saving
  const cleanedValue = useMemo(() => cleanNickname(value), [value]);

  const handleSave = useCallback(() => {
    if (!validation.isValid) return;

    updateNickname(cleanedValue);
    Keyboard.dismiss();
    onSave?.(cleanedValue);

    if (onClose) {
      onClose();
    }
  }, [validation.isValid, cleanedValue, updateNickname, onSave, onClose]);

  // Determine what message to show
  const showError = hasInteracted && validation.error;
  const showHint = !hasInteracted || (!validation.error && validation.hint);
  const showValid = hasInteracted && validation.isValid && cleanedValue.length >= MIN_LENGTH;

  return (
    <Modal
      visible={visible}
      onClose={required ? undefined : onClose}
      showCloseButton={!required}
      closeOnBackdrop={!required}
      title={t("nickname_title")}
      subtitle={t("nickname_subtitle")}
      testID="nickname-modal"
    >
      <View style={styles.container}>
        {/* Input */}
        <View
          style={[
            modalInputStyles.inputContainer,
            isFocused && modalInputStyles.inputContainerFocused,
            showError && modalInputStyles.inputContainerError,
          ]}
        >
          <TextInput
            style={modalInputStyles.input}
            value={value}
            onChangeText={handleChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={t("nickname_placeholder")}
            placeholderTextColor={palette.white[30]}
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={MAX_LENGTH + 5} // Allow a bit over to show error
            returnKeyType="done"
            onSubmitEditing={handleSave}
            testID="nickname-input"
          />
        </View>

        {/* Validation message */}
        {showError && (
          <Text style={modalInputStyles.errorText}>{validation.error}</Text>
        )}
        {showHint && (
          <Text style={modalInputStyles.hintText}>
            {validation.hint || t("nickname_hint")}
          </Text>
        )}
        {showValid && (
          <View style={styles.validContainer}>
            <CheckIcon size={14} color={palette.green[500]} />
            <Text style={modalInputStyles.validText}>{t("nickname_valid")}</Text>
          </View>
        )}

        {/* Character count */}
        <Text style={styles.charCount}>
          {cleanedValue.length}/{MAX_LENGTH}
        </Text>

        {/* Save button */}
        <TouchableOpacity
          style={[
            buttonStyles.primary,
            styles.saveButton,
            !validation.isValid && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!validation.isValid}
          activeOpacity={0.8}
          testID="nickname-save-button"
        >
          <Text style={buttonStyles.primaryText}>{t("nickname_save")}</Text>
        </TouchableOpacity>

        {/* Skip hint for optional modals */}
        {!required && onClose && (
          <TouchableOpacity style={styles.skipButton} onPress={onClose}>
            <Text style={styles.skipText}>{t("nickname_skip")}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: spacing[20],
  },
  validContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    marginTop: spacing[2],
  },
  charCount: {
    ...textStyles.bodySmall,
    color: palette.white[30],
    textAlign: "center",
    marginTop: spacing[4],
    marginBottom: spacing[8],
  },
  saveButton: {
    marginTop: spacing[4],
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  skipButton: {
    alignSelf: "center",
    marginTop: spacing[6],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
  },
  skipText: {
    ...textStyles.body,
    color: palette.white[40],
  },
});

