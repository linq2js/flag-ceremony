import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { StoreProvider, useStore } from "storion/react";
import {
  app,
  tMixin,
  ceremonyActiveMixin,
  stopCeremonyAndLogIncompleteMixin,
} from "../src/store";
import { showAlert } from "../src/utils/alert";
import { VietnamFlagIcon } from "../src/components/VietnamFlag";
import { HomeIcon, StatsIcon, SettingsIcon } from "../src/components/Icons";
import "../global.css";

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
  const { t, ceremonyActive, stopCeremonyAndLogIncomplete } = useStore({
    t: tMixin,
    ceremonyActive: ceremonyActiveMixin,
    stopCeremonyAndLogIncomplete: stopCeremonyAndLogIncompleteMixin,
  });

  const renderIcon = (icon: string, focused: boolean) => {
    const color = focused ? "#1a1a1a" : "rgba(255,255,255,0.5)";
    switch (icon) {
      case "home":
        return <HomeIcon size={18} color={color} />;
      case "flag":
        return <VietnamFlagIcon size={16} />;
      case "stats":
        return <StatsIcon size={18} color={color} />;
      case "settings":
        return <SettingsIcon size={18} color={color} />;
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

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const config = TAB_CONFIG.find((c) => c.name === route.name);
        if (!config) return null;

        const focused = state.index === index;
        const label = t(config.labelKey);

        return (
          <Pressable
            key={route.key}
            onPress={() => handleTabPress(route.name, state.index)}
            style={[styles.tabItem, focused && styles.tabItemFocused]}
          >
            {renderIcon(config.icon, focused)}
            {focused && <Text style={styles.label}>{label}</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}

function TabsLayout() {
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
  tabBar: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    height: 56,
    backgroundColor: "#1a1a1a",
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
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
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  tabItemFocused: {
    backgroundColor: "#ffffff",
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1a1a1a",
  },
});

export default function RootLayout() {
  return (
    <StoreProvider container={app}>
      <StatusBar style="light" />
      <TabsLayout />
    </StoreProvider>
  );
}
