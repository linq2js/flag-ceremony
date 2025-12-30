import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { showAlert } from "../utils/alert";
import { safeGoBack } from "../utils/navigation";
import { useRouter, useNavigation, useFocusEffect } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { Button } from "../components/Button";
import { ScreenBackground } from "../components/ScreenBackground";
import { BaDinhSquare } from "../components/BaDinhSquare";
import { layout } from "../design";
import {
  CountdownView,
  PlayingView,
  CompletedView,
} from "../components/ceremony";
import {
  EyeIcon,
  HandRaisedIcon,
  FingersIcon,
  RulerIcon,
  AngleIcon,
  MusicIcon,
  HeartIcon,
  HandshakeIcon,
  StrengthIcon,
  PlayIcon,
} from "../components/Icons";
import { useStore, mixins } from "storion/react";
import { tMixin, addCeremonyLogMixin, setCeremonyActiveMixin } from "../stores";

type CeremonyState = "ready" | "countdown" | "playing" | "completed";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const CeremonyScreen: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { t, addCeremonyLog, setCeremonyActive } = useStore(
    mixins({
      t: tMixin,
      addCeremonyLog: addCeremonyLogMixin,
      setCeremonyActive: setCeremonyActiveMixin,
    })
  );

  const isActiveRef = useRef(false);

  const [ceremonyState, setCeremonyState] = useState<CeremonyState>("ready");
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [duration, setDuration] = useState(0);
  const startTimeRef = useRef<number>(0);

  const flagProgress = useSharedValue(0);
  const insets = useSafeAreaInsets();

  // Audio player hook - loads the audio file
  const player = useAudioPlayer(
    require("../../assets/audio/flag-ceremony.mp3")
  );
  const audioStatus = useAudioPlayerStatus(player);

  // Completion sound player
  const completionPlayer = useAudioPlayer(
    require("../../assets/audio/ceremony-complete.mp3")
  );

  // Countdown beep player
  const countdownPlayer = useAudioPlayer(
    require("../../assets/audio/countdown-beep.mp3")
  );

  // Play beep on countdown number change
  useEffect(() => {
    if (ceremonyState === "countdown" && countdownNumber > 0) {
      countdownPlayer.seekTo(0);
      countdownPlayer.play();
    }
  }, [countdownNumber, ceremonyState, countdownPlayer]);

  useEffect(() => {
    const isActive =
      ceremonyState === "countdown" || ceremonyState === "playing";
    isActiveRef.current = isActive;
    setCeremonyActive(isActive);
  }, [ceremonyState, setCeremonyActive]);

  useFocusEffect(
    useCallback(() => {
      setCeremonyState("ready");
      setCountdownNumber(3);
      setDuration(0);
      startTimeRef.current = 0;
      flagProgress.value = 0;
      player.pause();
      player.seekTo(0);

      return () => {
        player.pause();
      };
    }, [flagProgress, player])
  );

  const showExitConfirmation = useCallback(
    (onConfirm: () => void) => {
      const handleExit = () => {
        player.pause();
        if (startTimeRef.current > 0) {
          const partialDuration = Math.floor(
            (Date.now() - startTimeRef.current) / 1000
          );
          addCeremonyLog(partialDuration, false);
        }
        onConfirm();
      };

      showAlert(t("exit_ceremony_title"), t("exit_ceremony_message"), [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("exit_ceremony_confirm"),
          style: "destructive",
          onPress: handleExit,
        },
      ]);
    },
    [t, player, addCeremonyLog]
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (ceremonyState === "countdown" || ceremonyState === "playing") {
          showExitConfirmation(() => safeGoBack(router));
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [ceremonyState, showExitConfirmation, router]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      if (!isActiveRef.current) return;
      e.preventDefault();
      showExitConfirmation(() => navigation.dispatch(e.data.action));
    });
    return unsubscribe;
  }, [navigation, showExitConfirmation]);

  const completeCeremony = useCallback(() => {
    const ceremonyDuration = Math.floor(
      (Date.now() - startTimeRef.current) / 1000
    );
    setDuration(ceremonyDuration);
    addCeremonyLog(ceremonyDuration, true);
    setCeremonyState("completed");

    // Play completion sound
    completionPlayer.seekTo(0);
    completionPlayer.play();
  }, [addCeremonyLog, completionPlayer]);

  // Handle audio completion
  useEffect(() => {
    if (audioStatus.didJustFinish && ceremonyState === "playing") {
      flagProgress.value = withTiming(1, { duration: 500 });
      completeCeremony();
    }
  }, [audioStatus.didJustFinish, ceremonyState, flagProgress, completeCeremony]);

  const startPlaying = useCallback(() => {
    setCeremonyState("playing");
    startTimeRef.current = Date.now();
    flagProgress.value = 0;

    // Reset and play audio
    player.seekTo(0);
    player.play();

    // Animate flag based on audio duration (or fallback)
    const audioDuration = player.duration > 0 ? player.duration * 1000 : 30000;
    flagProgress.value = withTiming(1, {
      duration: audioDuration,
      easing: Easing.linear,
    });
  }, [flagProgress, player]);

  const startCountdown = useCallback(() => {
    setCeremonyState("countdown");
    setCountdownNumber(3);

    setTimeout(() => setCountdownNumber(2), 1000);
    setTimeout(() => setCountdownNumber(1), 2000);
    setTimeout(() => startPlaying(), 3000);
  }, [startPlaying]);

  const goHome = useCallback(() => router.replace("/"), [router]);

  const resetCeremony = useCallback(() => {
    setCeremonyState("ready");
    setCountdownNumber(3);
    setDuration(0);
    flagProgress.value = 0;
  }, [flagProgress]);

  const formSteps = [
    {
      icon: <EyeIcon size={18} color="rgba(255,255,255,0.7)" />,
      text: t("ceremony_form_1"),
    },
    {
      icon: <HandRaisedIcon size={18} color="rgba(255,255,255,0.7)" />,
      text: t("ceremony_form_2"),
    },
    {
      icon: <FingersIcon size={18} color="rgba(255,255,255,0.7)" />,
      text: t("ceremony_form_3"),
    },
    {
      icon: <RulerIcon size={18} color="rgba(255,255,255,0.7)" />,
      text: t("ceremony_form_4"),
    },
    {
      icon: <AngleIcon size={18} color="rgba(255,255,255,0.7)" />,
      text: t("ceremony_form_5"),
    },
  ];

  const meanings = [
    {
      icon: <HeartIcon size={18} color="#f87171" />,
      text: t("ceremony_meaning_patriotism"),
    },
    {
      icon: <HandshakeIcon size={18} color="#fbbf24" />,
      text: t("ceremony_meaning_unity"),
    },
    {
      icon: <StrengthIcon size={18} color="#fbbf24" />,
      text: t("ceremony_meaning_strength"),
    },
  ];

  const squareSize = Math.min(screenWidth - 32, 360);
  const towerHeight = Math.min(screenHeight * 0.55, 420);
  const towerWidth = towerHeight * 0.75;

  return (
    <ScreenBackground>
      <SafeAreaView
        testID="ceremony-screen"
        accessibilityLabel="ceremony-screen"
        style={layout.screenContent}
        edges={["top"]}
      >
        {ceremonyState === "ready" && (
          <ScrollView
            testID="ceremony-ready-view"
            accessibilityLabel="ceremony-ready-view"
            style={layout.screenContent}
            contentContainerStyle={layout.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                alignItems: "center",
                paddingTop: 24,
                paddingBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#fbbf24",
                  textTransform: "uppercase",
                  letterSpacing: 4,
                  fontWeight: "700",
                }}
                numberOfLines={1}
              >
                {t("flag_ceremony")}
              </Text>
            </View>

            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <View
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  ...Platform.select({
                    web: { boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)" },
                    default: {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.4,
                      shadowRadius: 16,
                      elevation: 10,
                    },
                  }),
                }}
              >
                <BaDinhSquare width={squareSize} height={squareSize * 0.75} />
              </View>
            </View>

            <View
              style={{
                alignItems: "center",
                paddingHorizontal: 24,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#ffffff",
                  textAlign: "center",
                  marginBottom: 12,
                }}
                numberOfLines={2}
              >
                {t("ready_to_honor")}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.6)",
                  textAlign: "center",
                  lineHeight: 24,
                }}
              >
                {t("ceremony_instructions")}
              </Text>
            </View>

            <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
              <Button
                testID="start-ceremony-action"
                title={t("start_ceremony")}
                icon={<PlayIcon size={20} color="#ffffff" />}
                onPress={startCountdown}
                variant="primary"
                size="large"
              />
            </View>

            <View
              style={{
                marginHorizontal: 16,
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: "rgba(251, 191, 36, 0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>🎖️</Text>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#fbbf24",
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {t("ceremony_form_title")}
                </Text>
              </View>

              {formSteps.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: index < formSteps.length - 1 ? 16 : 0,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: "rgba(255,255,255,0.05)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.8)",
                      lineHeight: 22,
                      paddingTop: 4,
                    }}
                  >
                    {item.text}
                  </Text>
                </View>
              ))}

              <View
                style={{
                  marginTop: 20,
                  paddingTop: 20,
                  borderTopWidth: 1,
                  borderTopColor: "rgba(255,255,255,0.08)",
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: "rgba(220, 38, 38, 0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    flexShrink: 0,
                  }}
                >
                  <MusicIcon size={18} color="#f87171" />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: 22,
                    paddingTop: 4,
                  }}
                >
                  {t("ceremony_anthem")}
                </Text>
              </View>
            </View>

            <View
              style={{
                marginHorizontal: 16,
                backgroundColor: "rgba(251, 191, 36, 0.05)",
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(251, 191, 36, 0.15)",
                marginBottom: 32,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: "rgba(251, 191, 36, 0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>💫</Text>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#fbbf24",
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {t("ceremony_meaning_title")}
                </Text>
              </View>

              {meanings.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: index < meanings.length - 1 ? 14 : 0,
                  }}
                >
                  <View
                    style={{
                      width: 24,
                      marginRight: 12,
                      paddingTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: "rgba(251, 191, 36, 0.8)",
                      lineHeight: 22,
                    }}
                  >
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {ceremonyState === "countdown" && (
          <CountdownView number={countdownNumber} label={t("get_ready")} />
        )}

        {ceremonyState === "playing" && (
          <>
            <PlayingView
              title={t("ceremony_in_progress")}
              subtitle={t("stand_at_attention")}
              playingLabel={t("playing_anthem")}
              towerWidth={towerWidth}
              towerHeight={towerHeight}
              flagProgress={flagProgress}
            />
            {__DEV__ && (
              <TouchableOpacity
                onPress={() => {
                  player.pause();
                  flagProgress.value = withTiming(1, { duration: 300 });
                  completeCeremony();
                }}
                style={{
                  position: "absolute",
                  top: insets.top + 16,
                  right: 16,
                  backgroundColor: "rgba(239, 68, 68, 0.9)",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 16,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "600", fontSize: 12 }}
                >
                  ⏭️ Skip
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {ceremonyState === "completed" && (
          <CompletedView
            duration={duration}
            title={t("ceremony_complete")}
            subtitle={t("honored_flag_today")}
            durationLabel={t("duration")}
            streakTitle={t("streak_updated")}
            streakSubtitle={t("keep_going_tomorrow")}
            startAgainLabel={t("start_again")}
            onStartAgain={resetCeremony}
          />
        )}
      </SafeAreaView>
    </ScreenBackground>
  );
};
