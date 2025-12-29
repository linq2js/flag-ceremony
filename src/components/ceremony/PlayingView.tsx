import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from "react-native-reanimated";
import { FlagTower } from "../FlagTower";

interface PlayingViewProps {
  title: string;
  subtitle: string;
  playingLabel: string;
  towerWidth: number;
  towerHeight: number;
  flagProgress: SharedValue<number>;
}

export const PlayingView: React.FC<PlayingViewProps> = ({
  title,
  subtitle,
  playingLabel,
  towerWidth,
  towerHeight,
  flagProgress,
}) => {
  const fadeOpacity = useSharedValue(0);

  useEffect(() => {
    fadeOpacity.value = withTiming(1, { duration: 500 });
  }, [fadeOpacity]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        { flex: 1, alignItems: "center", justifyContent: "center" },
        containerStyle,
      ]}
    >
      <Text
        style={{
          fontSize: 12,
          color: "#fbbf24",
          textTransform: "uppercase",
          letterSpacing: 4,
          fontWeight: "700",
          marginBottom: 16,
        }}
        numberOfLines={1}
      >
        {title}
      </Text>

      {/* Flag Tower with rising flag */}
      <FlagTower
        width={towerWidth}
        height={towerHeight}
        flagProgress={flagProgress}
      />

      <Text
        style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.6)",
          textAlign: "center",
          marginTop: 24,
        }}
        numberOfLines={2}
      >
        {subtitle}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 16,
          backgroundColor: "rgba(220, 38, 38, 0.1)",
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 20,
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#dc2626",
            marginRight: 10,
          }}
        />
        <Text
          style={{ fontSize: 14, color: "#dc2626", fontWeight: "600" }}
          numberOfLines={1}
        >
          {playingLabel}
        </Text>
      </View>
    </Animated.View>
  );
};

