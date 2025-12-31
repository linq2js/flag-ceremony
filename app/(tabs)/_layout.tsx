import { Tabs } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useStore, mixins } from "storion/react";
import { LinearGradient } from "expo-linear-gradient";
import {
  tMixin,
  ceremonyActiveMixin,
  stopCeremonyAndLogIncompleteMixin,
} from "../../src/stores";
import { showAlert } from "../../src/utils/alert";
import { VietnamFlagIcon } from "../../src/components/VietnamFlag";
import { HomeIcon, StatsIcon, SettingsIcon } from "../../src/components/Icons";
import { palette } from "../../src/design/colors";

// Type for custom tab bar props
interface TabBarProps {
  state: {
    index: number;
    routes: Array<{ key: string; name: string }>;
  };
  navigation: {
    navigate: (name: string) => void;
  };
}

const TAB_CONFIG = [
  { name: "index", icon: "home" as const, labelKey: "tab_home" as const },
  {
    name: "ceremony",
    icon: "flag" as const,
    labelKey: "tab_ceremony" as const,
  },
  { name: "stats", icon: "stats" as const, labelKey: "tab_stats" as const },
  {
    name: "settings",
    icon: "settings" as const,
    labelKey: "tab_settings" as const,
  },
];

function CustomTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { t, ceremonyActive, stopCeremonyAndLogIncomplete } = useStore(
    mixins({
      t: tMixin,
      ceremonyActive: ceremonyActiveMixin,
      stopCeremonyAndLogIncomplete: stopCeremonyAndLogIncompleteMixin,
    })
  );

  const tabBarHeight = 74;
  const iconSize = 22;

  const activeColor = palette.orange[500];
  const inactiveColor = palette.white[55];

  // Local layout state (avoid Storion for this component-local UI value)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [layoutWidth, setLayoutWidth] = require("react").useState(0);

  // Active indicator animation
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const indicatorX = require("react").useRef(new Animated.Value(0)).current;

  const renderIcon = (icon: string, focused: boolean) => {
    const color = focused ? activeColor : inactiveColor;
    switch (icon) {
      case "home":
        return (
          <View style={styles.iconBox}>
            <HomeIcon size={iconSize} color={color} />
          </View>
        );
      case "flag":
        // Keep the flag icon as-is (it has its own colors)
        return (
          <View style={styles.iconBox}>
            <VietnamFlagIcon height={iconSize} />
          </View>
        );
      case "stats":
        return (
          <View style={styles.iconBox}>
            <StatsIcon size={iconSize} color={color} />
          </View>
        );
      case "settings":
        return (
          <View style={styles.iconBox}>
            <SettingsIcon size={iconSize} color={color} />
          </View>
        );
      default:
        return null;
    }
  };

  const handleTabPress = (routeName: string, currentIndex: number) => {
    const targetIndex = state.routes.findIndex((r) => r.name === routeName);
    const isOnCeremony = state.routes[currentIndex]?.name === "ceremony";

    // If navigating away from ceremony while active, show confirmation
    if (isOnCeremony && ceremonyActive && targetIndex !== currentIndex) {
      showAlert(t("exit_ceremony_title"), t("exit_ceremony_message"), [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("exit_ceremony_confirm"),
          style: "destructive",
          onPress: () => {
            stopCeremonyAndLogIncomplete();
            navigation.navigate(routeName);
          },
        },
      ]);
    } else {
      navigation.navigate(routeName);
    }
  };

  // Use TAB_CONFIG.length (visible tabs) not state.routes.length (may include hidden routes)
  const tabCount = TAB_CONFIG.length;
  const tabBarPadding = 10; // matches paddingHorizontal on tabBar
  const contentWidth = layoutWidth > 0 ? layoutWidth - tabBarPadding * 2 : 0;
  const segmentWidth = contentWidth > 0 ? contentWidth / tabCount : 0;

  // Find the visual index based on TAB_CONFIG order, not state.routes order
  const currentRouteName = state.routes[state.index]?.name;
  const visualIndex = TAB_CONFIG.findIndex((c) => c.name === currentRouteName);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  require("react").useEffect(() => {
    if (segmentWidth <= 0 || visualIndex < 0) return;
    Animated.spring(indicatorX, {
      toValue: segmentWidth * visualIndex,
      useNativeDriver: Platform.OS !== "web", // Native driver not supported on web
      damping: 18,
      stiffness: 220,
      mass: 0.7,
    }).start();
  }, [segmentWidth, visualIndex, indicatorX]);

  return (
    <View
      style={[
        styles.tabBarShell,
        { bottom: insets.bottom + 12 },
        { pointerEvents: "box-none" },
      ]}
    >
      <BlurView
        tint="dark"
        intensity={45}
        style={[styles.tabBar, { height: tabBarHeight }]}
        onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
      >
        {/* Active top indicator */}
        {segmentWidth > 0 && (
          <Animated.View
            style={[
              styles.activeIndicator,
              {
                left: tabBarPadding,
                width: segmentWidth,
                transform: [{ translateX: indicatorX }],
              },
            ]}
          >
            <LinearGradient
              colors={[palette.crimson[500], palette.orange[500]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        )}

        {state.routes.map((route, index) => {
          const config = TAB_CONFIG.find((c) => c.name === route.name);
          if (!config) return null;

          const focused = state.index === index;
          const label = t(config.labelKey);

          const testID = `tab-${
            config.name === "index" ? "home" : config.name
          }`;
          return (
            <Pressable
              key={route.key}
              testID={testID}
              accessibilityLabel={testID}
              onPress={() => handleTabPress(route.name, state.index)}
              style={styles.tabItem}
            >
              {renderIcon(config.icon, focused)}
              <Text style={[styles.label, focused && styles.labelFocused]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
        sceneStyle: styles.sceneContainer,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="ceremony" />
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  sceneContainer: {
    backgroundColor: "#0a0a0a",
  },
  tabBarShell: {
    position: "absolute",
    left: 12,
    right: 12,
    alignItems: "center",
  },
  tabBar: {
    width: "100%",
    maxWidth: 420,
    height: 74,
    borderRadius: 18,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: "rgba(18,18,18,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    ...Platform.select({
      web: {
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
      },
    }),
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    height: 4,
    opacity: 0.9,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingTop: 12,
    paddingBottom: 10,
    gap: 7,
  },
  iconBox: {
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
  },
  labelFocused: {
    color: palette.orange[500],
  },
});
