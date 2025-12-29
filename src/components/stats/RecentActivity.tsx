import React from "react";
import { View, Text } from "react-native";
import {
  layout,
  spacing,
  cardStyles,
  iconContainer,
  listItem,
  listItemDivider,
  glassEffect,
  palette,
  textStyles,
} from "../../design";
import { formatDate, formatTime } from "../../utils/history";

interface CeremonyLog {
  id: string;
  date: string;
  completed: boolean;
  duration: number;
  completedAt: string;
}

interface RecentActivityProps {
  t: (key: string, params?: Record<string, unknown>) => string;
  language: "vi" | "en";
  recentLogs: CeremonyLog[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  t,
  language,
  recentLogs,
}) => {
  return (
    <View style={[layout.container, { marginBottom: spacing[10] }]}>
      <Text style={[textStyles.sectionTitle, { marginBottom: spacing[7] }]}>
        {t("recent_activity")}
      </Text>
      {recentLogs.length === 0 ? (
        <View
          // @ts-ignore - glassEffect contains web-only props
          style={[
            cardStyles.default,
            { padding: spacing[14], alignItems: "center" },
            glassEffect,
          ]}
        >
          <Text style={{ fontSize: 56, marginBottom: spacing[7] }}>🇻🇳</Text>
          <Text style={[textStyles.body, { textAlign: "center" }]}>
            {t("no_ceremonies_yet")}
          </Text>
        </View>
      ) : (
        <View
          // @ts-ignore - glassEffect contains web-only props
          style={[cardStyles.list, glassEffect]}
        >
          {recentLogs.map((log, index) => (
            <View
              key={log.id}
              style={[
                listItem,
                index > 0 && listItemDivider,
                { opacity: log.completed ? 1 : 0.6 },
              ]}
            >
              <View
                style={[
                  iconContainer.large,
                  {
                    backgroundColor: log.completed
                      ? palette.green[100]
                      : palette.white[8],
                    borderWidth: 1,
                    borderColor: log.completed
                      ? palette.green[200]
                      : palette.white[10],
                    marginRight: spacing[6],
                  },
                ]}
              >
                <Text style={{ fontSize: 24 }}>
                  {log.completed ? "✅" : "⏹️"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={textStyles.inputLabel}>
                  {log.completed ? t("flag_ceremony") : t("incomplete_ceremony")}
                </Text>
                <Text
                  style={[textStyles.bodySmall, { marginTop: spacing[1] }]}
                >
                  {formatDate(new Date(log.date), language)}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: log.completed
                      ? palette.gold[500]
                      : palette.white[40],
                  }}
                >
                  {Math.floor(log.duration / 60)}:
                  {String(log.duration % 60).padStart(2, "0")}
                </Text>
                <Text style={[textStyles.time, { marginTop: spacing[1] }]}>
                  {formatTime(new Date(log.completedAt), language)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

