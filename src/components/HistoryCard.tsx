import React from "react";
import { View, Text, Platform } from "react-native";
import type { HistoricalEvent } from "../store/types";

interface HistoryCardProps {
  events: HistoricalEvent[];
  date: string;
  title: string;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ events, date, title }) => {
  const glassStyle = Platform.select({
    web: {
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
    },
    default: {},
  });

  return (
    <View
      style={[
        {
          marginHorizontal: 16,
          backgroundColor: "rgba(255,255,255,0.03)",
          borderRadius: 28,
          padding: 24,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        },
        // @ts-ignore
        glassStyle,
      ]}
    >
      {/* Decorative glow */}
      <View
        style={{
          position: "absolute",
          top: -30,
          left: -30,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: "#fbbf24",
          opacity: 0.05,
        }}
      />

      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: "rgba(251, 191, 36, 0.12)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 14,
            borderWidth: 1,
            borderColor: "rgba(251, 191, 36, 0.2)",
          }}
        >
          <Text style={{ fontSize: 24 }}>📜</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 10,
              color: "#fbbf24",
              textTransform: "uppercase",
              letterSpacing: 2,
              fontWeight: "800",
            }}
          >
            {title}
          </Text>
          <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
            {date}
          </Text>
        </View>
      </View>

      {/* Events */}
      {events.map((event, index) => (
        <View
          key={index}
          style={{
            paddingTop: index > 0 ? 18 : 0,
            marginTop: index > 0 ? 18 : 0,
            borderTopWidth: index > 0 ? 1 : 0,
            borderTopColor: "rgba(255,255,255,0.06)",
          }}
        >
          {event.year && (
            <View
              style={{
                backgroundColor: "rgba(251, 191, 36, 0.12)",
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 10,
                alignSelf: "flex-start",
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "rgba(251, 191, 36, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "800",
                  color: "#fbbf24",
                  letterSpacing: 0.5,
                }}
              >
                {event.year}
              </Text>
            </View>
          )}
          <Text
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.8)",
              lineHeight: 24,
              fontWeight: "500",
            }}
          >
            {event.event}
          </Text>
        </View>
      ))}
    </View>
  );
};
