/**
 * ShareBadgeScreen - Create and export shareable stats badges
 *
 * Architecture:
 * - StatsProvider: global stats via mixins useStore
 * - BadgeEditorContent: local state via scoped(badgeStore)
 */

import React, { useRef, useCallback, createContext, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useStore, mixins } from "storion/react";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

import { badgeStore } from "../stores/badge";
import {
  tMixin,
  currentStreakMixin,
  longestStreakMixin,
  totalCeremoniesMixin,
  completedCeremoniesMixin,
} from "../stores";
import { rankingMixin } from "../stores/mixins";
import { ScreenBackground } from "../components/ScreenBackground";
import {
  BadgePreview,
  PhotoPicker,
  BadgeTypeSelector,
  ThemeSelector,
  StatToggle,
} from "../components/share";
import { BackIcon, ShareIcon, DownloadIcon } from "../components/Icons";
import {
  textStyles,
  spacing,
  palette,
  cardStyles,
  layout,
  buttonStyles,
} from "../design";

// =============================================================================
// ISOLATED COMPONENT 1: Stats from global stores (mixins)
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatsContext = createContext<any>(null);

const StatsProvider: React.FC<{ children: React.ReactNode }> = React.memo(
  ({ children }) => {
    const stats = useStore(
      mixins({
        t: tMixin,
        currentStreak: currentStreakMixin,
        longestStreak: longestStreakMixin,
        totalCeremonies: totalCeremoniesMixin,
        completedCeremonies: completedCeremoniesMixin,
        ranking: rankingMixin,
      })
    );

    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <StatsContext.Provider value={stats as any}>
        {children}
      </StatsContext.Provider>
    );
  }
);

const useStats = () => {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useStats must be inside StatsProvider");
  return ctx;
};

// =============================================================================
// ISOLATED COMPONENT 2: Badge editor with local state
// =============================================================================

const BadgeEditorContent: React.FC = React.memo(() => {
  const {
    t,
    currentStreak,
    longestStreak,
    totalCeremonies,
    completedCeremonies,
    ranking,
  } = useStats();

  const router = useRouter();
  const viewShotRef = useRef<ViewShot>(null);

  // Component-local badge state via scoped() - auto-disposes on unmount
  const {
    badge,
    setBadgeType,
    setTheme,
    setPhotoUri,
    setDisplayName,
    toggleStat,
    setExporting,
    captureAndShare,
    captureAndSave,
  } = useStore(({ scoped }) => {
    const [state, actions] = scoped(badgeStore);
    return {
      // Spread state to track all properties for reactivity
      badge: { ...state },
      ...actions,
      // stable callbacks
      async captureAndShare() {
        if (!viewShotRef.current) return;
        try {
          setExporting(true);
          const uri = await viewShotRef.current.capture?.();
          if (!uri) throw new Error("Failed to capture badge");
          const canShare = await Sharing.isAvailableAsync();
          if (canShare) {
            await Sharing.shareAsync(uri, {
              mimeType: "image/png",
              dialogTitle: t("share_badge"),
            });
          } else {
            Alert.alert(t("badge_saved"), t("badge_saved_desc"));
          }
        } catch (error) {
          console.error("Share error:", error);
          Alert.alert("Error", "Failed to share badge");
        } finally {
          setExporting(false);
        }
      },
      async captureAndSave() {
        if (!viewShotRef.current) return;
        try {
          setExporting(true);
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              t("permission_denied"),
              t("gallery_permission_message")
            );
            return;
          }
          const uri = await viewShotRef.current.capture?.();
          if (!uri) throw new Error("Failed to capture badge");
          await MediaLibrary.saveToLibraryAsync(uri);
          Alert.alert(t("badge_saved"), t("badge_saved_desc"));
        } catch (error) {
          console.error("Save error:", error);
          Alert.alert("Error", "Failed to save badge");
        } finally {
          setExporting(false);
        }
      },
    };
  });

  // Build stats object for badge
  const stats = {
    totalCeremonies,
    completedCeremonies,
    currentStreak,
    longestStreak,
    percentile: ranking.data?.percentile,
  };

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BackIcon size={24} color={palette.white.full} />
        </TouchableOpacity>
        <Text style={textStyles.sectionTitle}>{t("create_badge")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={layout.screenContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge Preview */}
        <View style={styles.previewSection}>
          <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
            <BadgePreview
              badgeType={badge.badgeType}
              theme={badge.theme}
              photoUri={badge.photoUri}
              displayName={badge.displayName}
              stats={stats}
              showTotal={badge.showTotal}
              showCurrentStreak={badge.showCurrentStreak}
              showLongestStreak={badge.showLongestStreak}
              showRanking={badge.showRanking}
              showMemberSince={badge.showMemberSince}
              t={t as any}
              previewScale={1}
            />
          </ViewShot>
        </View>

        {/* Photo Picker */}
        <View style={styles.section}>
          <PhotoPicker
            photoUri={badge.photoUri}
            onPhotoChange={setPhotoUri}
            t={t as any}
          />
        </View>

        {/* Name Input */}
        <View style={styles.section}>
          <Text style={[textStyles.inputLabel, { marginBottom: spacing[4] }]}>
            {t("your_name")}
          </Text>
          <View style={[cardStyles.default, styles.inputContainer]}>
            <TextInput
              style={styles.input}
              value={badge.displayName}
              onChangeText={setDisplayName}
              placeholder={t("enter_name")}
              placeholderTextColor={palette.white[30]}
              maxLength={30}
            />
          </View>
        </View>

        {/* Badge Type Selector */}
        <View style={styles.section}>
          <BadgeTypeSelector
            selected={badge.badgeType}
            onSelect={setBadgeType}
            t={t as any}
          />
        </View>

        {/* Theme Selector */}
        <View style={styles.section}>
          <ThemeSelector
            selected={badge.theme}
            onSelect={setTheme}
            t={t as any}
          />
        </View>

        {/* Stat Toggles */}
        <View style={styles.section}>
          <StatToggle
            showTotal={badge.showTotal}
            showCurrentStreak={badge.showCurrentStreak}
            showLongestStreak={badge.showLongestStreak}
            showRanking={badge.showRanking}
            showMemberSince={badge.showMemberSince}
            onToggle={toggleStat}
            t={t as any}
            hasRanking={!!ranking.data?.percentile}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[buttonStyles.secondary, styles.actionButton]}
            onPress={captureAndSave}
            disabled={badge.isExporting}
          >
            <DownloadIcon size={20} color={palette.gold[500]} />
            <Text style={[buttonStyles.secondaryText, styles.buttonText]}>
              {t("save_to_photos")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.primary, styles.actionButton]}
            onPress={captureAndShare}
            disabled={badge.isExporting}
          >
            <ShareIcon size={20} color={palette.dark.base} />
            <Text style={[buttonStyles.primaryText, styles.buttonText]}>
              {t("share_badge_action")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
});

// =============================================================================
// MAIN SCREEN: Composes isolated components
// =============================================================================

export const ShareBadgeScreen: React.FC = React.memo(() => {
  return (
    <ScreenBackground>
      <SafeAreaView style={layout.screenContent} edges={["top"]}>
        <StatsProvider>
          <BadgeEditorContent />
        </StatsProvider>
      </SafeAreaView>
    </ScreenBackground>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  backButton: {
    padding: spacing[2],
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[24],
  },
  previewSection: {
    alignItems: "center",
    marginVertical: spacing[6],
  },
  section: {
    marginBottom: spacing[6],
  },
  inputContainer: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
  },
  input: {
    ...textStyles.body,
    color: palette.white.full,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: spacing[4],
    marginTop: spacing[4],
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[3],
  },
  buttonText: {
    fontWeight: "600",
  },
});
