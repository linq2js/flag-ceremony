/**
 * ShareBadgeScreen - Create and export shareable stats badges
 *
 * Architecture:
 * - StatsProvider: global stats via mixins useStore
 * - BadgeEditorContent: local state via scoped(badgeStore)
 * - Uses SVG badges for stable image export on web and native
 */

import React, { useRef, createContext, useContext, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useStore, mixins } from "storion/react";
import { safeGoBack } from "../utils/navigation";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

import { badgeStore } from "../stores/badge";
import {
  tMixin,
  currentStreakMixin,
  longestStreakMixin,
  totalCeremoniesMixin,
  completedCeremoniesMixin,
  memberSinceMixin,
} from "../stores";
import { rankingMixin } from "../stores/mixins";
import { ScreenBackground } from "../components/ScreenBackground";
import {
  BadgePreviewSVG,
  getBadgeDimensions,
} from "../components/share/BadgePreviewSVG";
import { PhotoPicker, BadgeTypeSelector } from "../components/share";
import {
  svgToPng,
  downloadDataUri,
} from "../components/share/badges-svg/utils";
import { BackIcon, DownloadIcon } from "../components/Icons";
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
        memberSince: memberSinceMixin,
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
    memberSince,
    ranking,
  } = useStats();

  const router = useRouter();
  const viewShotRef = useRef<ViewShot>(null);
  const svgContainerRef = useRef<View>(null);

  // Component-local badge state via scoped() - auto-disposes on unmount
  const { badge, setBadgeType, setPhotoUri, setDisplayName, setExporting } =
    useStore(({ scoped }) => {
      const [state, actions] = scoped(badgeStore);
      return {
        badge: { ...state },
        ...actions,
      };
    });

  // Build stats object for badge
  const stats = {
    totalCeremonies,
    completedCeremonies,
    currentStreak,
    longestStreak,
    percentile: ranking.data?.percentile,
    memberSince: memberSince ? new Date(memberSince) : undefined,
  };

  // Get current badge dimensions
  const { width: originalBadgeWidth, height: originalBadgeHeight } =
    getBadgeDimensions(badge.badgeType);

  // Calculate scale to fit screen width (accounting for padding)
  const screenWidth = Dimensions.get("window").width;
  const horizontalPadding = spacing[6] * 2; // padding on both sides
  const maxAvailableWidth = screenWidth - horizontalPadding;
  const scale = Math.min(1, maxAvailableWidth / originalBadgeWidth);

  const badgeWidth = originalBadgeWidth * scale;
  const badgeHeight = originalBadgeHeight * scale;

  // Capture and save badge
  const captureAndSave = useCallback(async () => {
    try {
      setExporting(true);

      if (Platform.OS === "web") {
        // Web: Find SVG element and convert to PNG
        const container = svgContainerRef.current as unknown as HTMLElement;
        if (!container) {
          throw new Error("SVG container not found");
        }

        const svgElement = container.querySelector("svg") as SVGSVGElement;
        if (!svgElement) {
          throw new Error("SVG element not found");
        }

        // Wait for any pending renders
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Use original dimensions for export (full resolution)
        const pngDataUri = await svgToPng(
          svgElement,
          originalBadgeWidth,
          originalBadgeHeight
        );
        if (!pngDataUri) {
          throw new Error("Failed to convert SVG to PNG");
        }

        downloadDataUri(pngDataUri, `flag-ceremony-badge-${Date.now()}.png`);
        Alert.alert(t("badge_saved"), t("badge_saved_desc"));
      } else {
        // Native: Use ViewShot
        if (!viewShotRef.current) {
          throw new Error("ViewShot ref not found");
        }

        const uri = await viewShotRef.current.capture?.();
        if (!uri) throw new Error("Failed to capture badge");

        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(t("permission_denied"), t("gallery_permission_message"));
          return;
        }

        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert(t("badge_saved"), t("badge_saved_desc"));
      }
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save badge");
    } finally {
      setExporting(false);
    }
  }, [
    badge.badgeType,
    originalBadgeWidth,
    originalBadgeHeight,
    setExporting,
    t,
  ]);

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => safeGoBack(router)}
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
          {Platform.OS === "web" ? (
            <View
              ref={(ref) => {
                svgContainerRef.current = ref;
              }}
              style={{ width: badgeWidth, height: badgeHeight }}
              collapsable={false}
            >
              <BadgePreviewSVG
                badgeType={badge.badgeType}
                photoUri={badge.photoUri}
                displayName={badge.displayName}
                stats={stats}
                t={t as any}
                previewScale={scale}
              />
            </View>
          ) : (
            <ViewShot
              ref={viewShotRef}
              options={{ format: "png", quality: 1 }}
              style={{ width: badgeWidth, height: badgeHeight }}
            >
              <BadgePreviewSVG
                badgeType={badge.badgeType}
                photoUri={badge.photoUri}
                displayName={badge.displayName}
                stats={stats}
                t={t as any}
                previewScale={scale}
              />
            </ViewShot>
          )}
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

        {/* Save Button */}
        <TouchableOpacity
          style={[buttonStyles.primary, styles.saveButton]}
          onPress={captureAndSave}
          disabled={badge.isExporting}
        >
          <DownloadIcon size={20} color={palette.dark.base} />
          <Text style={[buttonStyles.primaryText, styles.buttonText]}>
            {t("save_to_photos")}
          </Text>
        </TouchableOpacity>

        {/* Badge Type Selector */}
        <View style={[styles.section, styles.badgeTypeSection]}>
          <BadgeTypeSelector
            selected={badge.badgeType}
            onSelect={setBadgeType}
            photoUri={badge.photoUri}
            displayName={badge.displayName}
            stats={stats}
            t={t as any}
          />
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
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[3],
    marginTop: spacing[4],
  },
  buttonText: {
    fontWeight: "600",
  },
  badgeTypeSection: {
    marginTop: spacing[6],
  },
});
