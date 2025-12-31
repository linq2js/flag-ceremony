/**
 * FeedbackScreen - Allow users to submit feedback
 *
 * Features:
 * - Text input for feedback message
 * - Category selection (bug, feature, other)
 * - Submits to Supabase with app version/build number
 * - Rate limiting to prevent spam
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore, mixins } from "storion/react";
import Constants from "expo-constants";
import { tMixin, onlineMixin, submitFeedbackMixin } from "../stores";
import { ScreenBackground } from "../components/ScreenBackground";
import { SendIcon, CheckIcon } from "../components/Icons";
import {
  textStyles,
  spacing,
  palette,
  cardStyles,
  layout,
  buttonStyles,
} from "../design";

// =============================================================================
// TYPES
// =============================================================================

type FeedbackCategory = "bug" | "feature" | "question" | "other";

interface FeedbackData {
  category: FeedbackCategory;
  message: string;
  appVersion: string;
  buildNumber: string;
  platform: string;
  timestamp: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const CATEGORIES: { key: FeedbackCategory; emoji: string }[] = [
  { key: "bug", emoji: "🐛" },
  { key: "feature", emoji: "✨" },
  { key: "question", emoji: "❓" },
  { key: "other", emoji: "💬" },
];

const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 1000;

// Get app version info from Expo Constants
const getAppInfo = () => {
  const version = Constants.expoConfig?.version || "1.0.0";
  const buildNumber =
    Platform.OS === "ios"
      ? Constants.expoConfig?.ios?.buildNumber
      : Constants.expoConfig?.android?.versionCode?.toString();

  return {
    version,
    buildNumber: buildNumber || "1",
    platform: Platform.OS,
  };
};

// =============================================================================
// COMPONENT
// =============================================================================

export const FeedbackScreen: React.FC = () => {
  const { t, online, submitFeedback } = useStore(
    mixins({
      t: tMixin,
      online: onlineMixin,
      submitFeedback: submitFeedbackMixin,
    })
  );

  const [category, setCategory] = useState<FeedbackCategory>("bug");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const appInfo = getAppInfo();
  const canSubmit =
    message.trim().length >= MIN_MESSAGE_LENGTH && online && !isSubmitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      // Submit via RPC (auth is handled internally)
      await submitFeedback({
        category,
        message: message.trim(),
        appVersion: appInfo.version,
        buildNumber: appInfo.buildNumber,
        platform: appInfo.platform,
      });

      setIsSubmitted(true);
      setMessage("");
      setCategory("bug");

      // Reset success state after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error("Feedback submission error:", error);
      Alert.alert(t("feedback_error_title"), t("feedback_error_message"), [
        { text: t("ok") },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmit, category, message, appInfo, t, submitFeedback]);

  const renderCategoryButton = (cat: FeedbackCategory, emoji: string) => {
    const isSelected = category === cat;
    return (
      <TouchableOpacity
        key={cat}
        style={[
          styles.categoryButton,
          isSelected && styles.categoryButtonSelected,
        ]}
        onPress={() => setCategory(cat)}
        activeOpacity={0.7}
      >
        <Text style={styles.categoryEmoji}>{emoji}</Text>
        <Text
          style={[
            styles.categoryLabel,
            isSelected && styles.categoryLabelSelected,
          ]}
        >
          {t(`feedback_category_${cat}`)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={layout.screenContent} edges={["top"]}>
        <KeyboardAvoidingView
          style={layout.screenContent}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={layout.screenContent}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={textStyles.label}>{t("feedback_subtitle")}</Text>
              <Text style={[textStyles.screenTitle, { marginTop: spacing[2] }]}>
                {t("feedback_title")}
              </Text>
            </View>

            {/* Success Message */}
            {isSubmitted && (
              <View style={styles.successCard}>
                <CheckIcon size={24} color={palette.emerald[500]} />
                <Text style={styles.successText}>
                  {t("feedback_success_message")}
                </Text>
              </View>
            )}

            {/* Offline Warning */}
            {!online && (
              <View style={styles.offlineCard}>
                <Text style={styles.offlineText}>
                  {t("feedback_offline_message")}
                </Text>
              </View>
            )}

            {/* Category Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t("feedback_category_label")}
              </Text>
              <View style={styles.categoriesGrid}>
                {CATEGORIES.map(({ key, emoji }) =>
                  renderCategoryButton(key, emoji)
                )}
              </View>
            </View>

            {/* Message Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t("feedback_message_label")}
              </Text>
              <View style={[cardStyles.default, styles.inputContainer]}>
                <TextInput
                  style={styles.textInput}
                  value={message}
                  onChangeText={setMessage}
                  placeholder={t("feedback_placeholder")}
                  placeholderTextColor={palette.white[30]}
                  multiline
                  maxLength={MAX_MESSAGE_LENGTH}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>
                  {message.length}/{MAX_MESSAGE_LENGTH}
                </Text>
              </View>
              {message.length > 0 && message.length < MIN_MESSAGE_LENGTH && (
                <Text style={styles.minLengthHint}>
                  {t("feedback_min_length", { count: MIN_MESSAGE_LENGTH })}
                </Text>
              )}
            </View>

            {/* Version Info */}
            <View style={styles.versionInfo}>
              <Text style={styles.versionText}>
                v{appInfo.version} ({appInfo.buildNumber}) • {appInfo.platform}
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                buttonStyles.primary,
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!canSubmit}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={palette.dark.base} />
              ) : (
                <>
                  <SendIcon size={20} color={palette.dark.base} />
                  <Text style={buttonStyles.primaryText}>
                    {t("feedback_submit")}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[24],
  },
  header: {
    paddingTop: spacing[6],
    paddingBottom: spacing[8],
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    ...textStyles.inputLabel,
    marginBottom: spacing[3],
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  categoryButton: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  categoryButtonSelected: {
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    borderColor: palette.gold[500],
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryLabel: {
    ...textStyles.body,
    color: palette.white[70],
    fontWeight: "600",
  },
  categoryLabelSelected: {
    color: palette.gold[500],
  },
  inputContainer: {
    padding: spacing[4],
  },
  textInput: {
    ...textStyles.body,
    color: palette.white.full,
    minHeight: 150,
    maxHeight: 250,
  },
  charCount: {
    ...textStyles.caption,
    color: palette.white[30],
    textAlign: "right",
    marginTop: spacing[2],
  },
  minLengthHint: {
    ...textStyles.caption,
    color: palette.orange[400],
    marginTop: spacing[2],
  },
  versionInfo: {
    alignItems: "center",
    marginBottom: spacing[6],
  },
  versionText: {
    ...textStyles.caption,
    color: palette.white[30],
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  successCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[3],
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderRadius: 12,
    padding: spacing[4],
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: palette.emerald[500],
  },
  successText: {
    ...textStyles.body,
    color: palette.emerald[500],
    fontWeight: "600",
  },
  offlineCard: {
    backgroundColor: "rgba(251, 146, 60, 0.15)",
    borderRadius: 12,
    padding: spacing[4],
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: palette.orange[500],
  },
  offlineText: {
    ...textStyles.body,
    color: palette.orange[500],
    textAlign: "center",
  },
});

