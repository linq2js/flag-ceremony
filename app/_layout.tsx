import { useEffect } from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { appStore, useAppStore } from "../src/store";
import { t } from "../src/i18n";
import { VietnamFlagIcon } from "../src/components/VietnamFlag";
import { HomeIcon, StatsIcon, SettingsIcon } from "../src/components/Icons";
import "../global.css";

interface TabIconProps {
  icon: "home" | "flag" | "stats" | "settings";
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  const iconColor = focused ? "#1a1a1a" : "rgba(255,255,255,0.5)";
  
  const renderIcon = () => {
    switch (icon) {
      case "home":
        return <HomeIcon size={20} color={iconColor} />;
      case "flag":
        return <VietnamFlagIcon size={18} />;
      case "stats":
        return <StatsIcon size={20} color={iconColor} />;
      case "settings":
        return <SettingsIcon size={20} color={iconColor} />;
    }
  };

  return (
    <View
      style={[
        styles.tabItem,
        focused && styles.tabItemFocused,
      ]}
    >
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      {focused && (
        <Text style={styles.labelFocused} numberOfLines={1}>{label}</Text>
      )}
    </View>
  );
}

function TabsLayout() {
  const { language } = useAppStore((s) => ({
    language: s.language,
  }));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t(language, "tab_home"),
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="home" label={t(language, "tab_home")} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="ceremony"
        options={{
          title: t(language, "tab_ceremony"),
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="flag" label={t(language, "tab_ceremony")} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: t(language, "tab_stats"),
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="stats" label={t(language, "tab_stats")} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t(language, "tab_settings"),
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="settings" label={t(language, "tab_settings")} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    height: 56,
    backgroundColor: "#1a1a1a",
    borderRadius: 28,
    borderTopWidth: 0,
    paddingHorizontal: 6,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    gap: 6,
    flexWrap: "nowrap",
  },
  tabItemFocused: {
    backgroundColor: "#ffffff",
  },
  iconContainer: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  labelFocused: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1a1a1a",
    flexShrink: 0,
  },
});

export default function RootLayout() {
  useEffect(() => {
    appStore.actions.loadState();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <TabsLayout />
    </>
  );
}
