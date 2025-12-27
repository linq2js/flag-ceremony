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
import { useRouter, useNavigation, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { Button } from "../components/Button";
import { ScreenBackground } from "../components/ScreenBackground";
import { BaDinhSquare } from "../components/BaDinhSquare";
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
import { useStore } from "storion/react";
import { tMixin, addCeremonyLogMixin, setCeremonyActiveMixin } from "../store";

type CeremonyState = "ready" | "countdown" | "playing" | "completed";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const CeremonyScreen: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { t, addCeremonyLog, setCeremonyActive } = useStore({
    t: tMixin,
    addCeremonyLog: addCeremonyLogMixin,
    setCeremonyActive: setCeremonyActiveMixin,
  });

  const isActiveRef = useRef(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const [ceremonyState, setCeremonyState] = useState<CeremonyState>("ready");
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [duration, setDuration] = useState(0);
  const startTimeRef = useRef<number>(0);

  const flagProgress = useSharedValue(0);

  useEffect(() => {
    const isActive =
      ceremonyState === "countdown" || ceremonyState === "playing";
    isActiveRef.current = isActive;
    setCeremonyActive(isActive);
  }, [ceremonyState, setCeremonyActive]);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  useFocusEffect(
    useCallback(() => {
      setCeremonyState("ready");
      setCountdownNumber(3);
      setDuration(0);
      setSound(null);
      startTimeRef.current = 0;
      flagProgress.value = 0;

      return () => {
        if (soundRef.current) {
          soundRef.current.stopAsync().then(() => {
            soundRef.current?.unloadAsync();
          });
        }
      };
    }, [flagProgress])
  );

  const showExitConfirmation = useCallback(
    (onConfirm: () => void) => {
      const handleExit = async () => {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
        }
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
    [t, sound, addCeremonyLog]
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (ceremonyState === "countdown" || ceremonyState === "playing") {
          showExitConfirmation(() => router.back());
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

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const completeCeremony = useCallback(() => {
    const ceremonyDuration = Math.floor(
      (Date.now() - startTimeRef.current) / 1000
    );
    setDuration(ceremonyDuration);
    addCeremonyLog(ceremonyDuration, true);
    setCeremonyState("completed");
  }, [addCeremonyLog]);

  const onPlaybackStatusUpdate = useCallback(
    (status: any) => {
      if (status.didJustFinish) {
        flagProgress.value = withTiming(1, { duration: 500 });
        completeCeremony();
      }
    },
    [completeCeremony, flagProgress]
  );

  const startPlaying = useCallback(async () => {
    setCeremonyState("playing");
    startTimeRef.current = Date.now();
    flagProgress.value = 0;

    try {
      const { sound: audioSound, status } = await Audio.Sound.createAsync(
        require("../../assets/audio/flag-ceremony.mp3"),
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(audioSound);

      if (status.isLoaded && status.durationMillis) {
        flagProgress.value = withTiming(1, {
          duration: status.durationMillis,
          easing: Easing.linear,
        });
      }
    } catch (error) {
      console.log("Audio file not found, simulating ceremony...");
      const simulatedDuration = 30000;
      flagProgress.value = withTiming(1, {
        duration: simulatedDuration,
        easing: Easing.linear,
      });
      setTimeout(() => completeCeremony(), simulatedDuration);
    }
  }, [flagProgress, onPlaybackStatusUpdate, completeCeremony]);

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
      <SafeAreaView testID="ceremony-screen" accessibilityLabel="ceremony-screen" style={{ flex: 1 }}>
        {ceremonyState === "ready" && (
          <ScrollView
            testID="ceremony-ready-view"
            accessibilityLabel="ceremony-ready-view"
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 40 }}
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
          <PlayingView
            title={t("ceremony_in_progress")}
            subtitle={t("stand_at_attention")}
            playingLabel={t("playing_anthem")}
            towerWidth={towerWidth}
            towerHeight={towerHeight}
            flagProgress={flagProgress}
          />
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
