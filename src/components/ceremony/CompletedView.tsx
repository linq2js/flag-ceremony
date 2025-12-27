import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
} from "react-native-reanimated";
import { Confetti } from "../Confetti";
import { Button } from "../Button";
import { PlayIcon } from "../Icons";

interface CompletedViewProps {
  duration: number;
  title: string;
  subtitle: string;
  durationLabel: string;
  streakTitle: string;
  streakSubtitle: string;
  startAgainLabel: string;
  onStartAgain: () => void;
}

export const CompletedView: React.FC<CompletedViewProps> = ({
  duration,
  title,
  subtitle,
  durationLabel,
  streakTitle,
  streakSubtitle,
  startAgainLabel,
  onStartAgain,
}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(500, withTiming(1, { duration: 1000 }));
  }, [opacity]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: interpolate(opacity.value, [0, 1], [30, 0]) }],
  }));

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Confetti & Fireworks Animation */}
      <Confetti active />

      <Animated.View style={[containerStyle, { alignItems: "center" }]}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "rgba(34, 197, 94, 0.15)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 48 }}>🎉</Text>
        </View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: "#4ade80",
            textAlign: "center",
            marginBottom: 8,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
            marginBottom: 24,
          }}
          numberOfLines={2}
        >
          {subtitle}
        </Text>

        {/* Duration */}
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: 16,
            paddingHorizontal: 24,
            paddingVertical: 16,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
            }}
            numberOfLines={1}
          >
            {durationLabel}
          </Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: "#fbbf24",
              textAlign: "center",
              marginTop: 4,
            }}
            numberOfLines={1}
          >
            {formatDuration(duration)}
          </Text>
        </View>

        {/* Streak updated */}
        <View
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            borderWidth: 1,
            borderColor: "rgba(34, 197, 94, 0.3)",
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 32,
            width: "100%",
          }}
        >
          <Text style={{ fontSize: 28, marginRight: 12 }}>🔥</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#4ade80",
              }}
              numberOfLines={1}
            >
              {streakTitle}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "rgba(74, 222, 128, 0.7)",
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {streakSubtitle}
            </Text>
          </View>
        </View>

        <Button
          title={startAgainLabel}
          icon={<PlayIcon size={20} color="#ffffff" />}
          onPress={onStartAgain}
          variant="primary"
          size="large"
        />
      </Animated.View>
    </View>
  );
};

