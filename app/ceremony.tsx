import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, BackHandler, ScrollView, Dimensions, Alert } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  interpolate,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Button } from "../src/components/Button";
import { ScreenBackground } from "../src/components/ScreenBackground";
import { BaDinhSquare } from "../src/components/BaDinhSquare";
import { FlagTower } from "../src/components/FlagTower";
import { Confetti } from "../src/components/Confetti";
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
  HomeIcon,
} from "../src/components/Icons";
import { useAppStore } from "../src/store";
import { t } from "../src/i18n";

type CeremonyState = "ready" | "countdown" | "playing" | "completed";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CeremonyScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { language, addCeremonyLog } = useAppStore((s, a) => ({
    language: s.language,
    addCeremonyLog: a.addCeremonyLog,
  }));

  const isActiveRef = useRef(false); // Track if ceremony is active

  const [ceremonyState, setCeremonyState] = useState<CeremonyState>("ready");
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [duration, setDuration] = useState(0);
  const startTimeRef = useRef<number>(0);

  const countdownScale = useSharedValue(0);
  const countdownOpacity = useSharedValue(0);
  const fadeOpacity = useSharedValue(0);
  const completedOpacity = useSharedValue(0);
  const flagProgress = useSharedValue(0); // 0 = bottom, 1 = top

  // Track active state in ref for navigation listener
  useEffect(() => {
    isActiveRef.current = ceremonyState === "countdown" || ceremonyState === "playing";
  }, [ceremonyState]);

  // Show exit confirmation dialog
  const showExitConfirmation = useCallback((onConfirm: () => void) => {
    Alert.alert(
      t(language, "exit_ceremony_title"),
      t(language, "exit_ceremony_message"),
      [
        { text: t(language, "cancel"), style: "cancel" },
        { 
          text: t(language, "exit_ceremony_confirm"), 
          style: "destructive",
          onPress: async () => {
            // Stop audio if playing
            if (sound) {
              await sound.stopAsync();
              await sound.unloadAsync();
              setSound(null);
            }
            // Log incomplete ceremony
            if (startTimeRef.current > 0) {
              const partialDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
              addCeremonyLog(partialDuration, false);
            }
            onConfirm();
          }
        },
      ]
    );
  }, [language, sound, addCeremonyLog]);

  // Handle hardware back button (Android)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (ceremonyState === "countdown" || ceremonyState === "playing") {
        showExitConfirmation(() => router.back());
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [ceremonyState, showExitConfirmation, router]);

  // Prevent navigation when ceremony is active
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      if (!isActiveRef.current) return;

      // Prevent default navigation
      e.preventDefault();

      // Show confirmation
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
    const ceremonyDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setDuration(ceremonyDuration);
    addCeremonyLog(ceremonyDuration, true); // true = completed
    completedOpacity.value = withDelay(500, withTiming(1, { duration: 1000 }));
    setCeremonyState("completed");
  }, [addCeremonyLog, completedOpacity]);

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
    fadeOpacity.value = withTiming(1, { duration: 500 });
    flagProgress.value = 0;

    try {
      const { sound: audioSound, status } = await Audio.Sound.createAsync(
        require("../assets/audio/flag-ceremony.mp3"),
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(audioSound);
      
      if (status.isLoaded && status.durationMillis) {
        const durationMs = status.durationMillis;
        flagProgress.value = withTiming(1, {
          duration: durationMs,
          easing: Easing.linear,
        });
      }
    } catch (error) {
      console.log("Audio file not found, simulating ceremony...");
      const simulatedDuration = 30000; // 30 seconds for demo
      flagProgress.value = withTiming(1, {
        duration: simulatedDuration,
        easing: Easing.linear,
      });
      setTimeout(() => completeCeremony(), simulatedDuration);
    }
  }, [fadeOpacity, flagProgress, onPlaybackStatusUpdate, completeCeremony]);

  const animateCountdown = useCallback((num: number) => {
    setCountdownNumber(num);
    countdownScale.value = 0;
    countdownOpacity.value = 1;
    
    countdownScale.value = withSequence(
      withTiming(1.2, { duration: 200, easing: Easing.out(Easing.back) }),
      withTiming(1, { duration: 100 })
    );
    
    countdownOpacity.value = withDelay(
      600,
      withTiming(0, { duration: 300 })
    );
  }, [countdownScale, countdownOpacity]);

  const startCountdown = useCallback(() => {
    setCeremonyState("countdown");
    
    // Countdown: 3 -> 2 -> 1 -> start
    animateCountdown(3);
    
    setTimeout(() => animateCountdown(2), 1000);
    setTimeout(() => animateCountdown(1), 2000);
    setTimeout(() => startPlaying(), 3000);
  }, [animateCountdown, startPlaying]);

  const goHome = useCallback(() => router.replace("/"), [router]);

  const resetCeremony = useCallback(() => {
    setCeremonyState("ready");
    setCountdownNumber(3);
    setDuration(0);
    fadeOpacity.value = 0;
    completedOpacity.value = 0;
    flagProgress.value = 0;
    countdownScale.value = 0;
    countdownOpacity.value = 0;
  }, [fadeOpacity, completedOpacity, flagProgress, countdownScale, countdownOpacity]);

  const countdownStyle = useAnimatedStyle(() => ({
    opacity: countdownOpacity.value,
    transform: [{ scale: countdownScale.value }],
  }));

  const playingContainerStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
  }));

  const completedContainerStyle = useAnimatedStyle(() => ({
    opacity: completedOpacity.value,
    transform: [{ translateY: interpolate(completedOpacity.value, [0, 1], [30, 0]) }],
  }));

  const formSteps = [
    { icon: <EyeIcon size={18} color="rgba(255,255,255,0.7)" />, text: t(language, "ceremony_form_1") },
    { icon: <HandRaisedIcon size={18} color="rgba(255,255,255,0.7)" />, text: t(language, "ceremony_form_2") },
    { icon: <FingersIcon size={18} color="rgba(255,255,255,0.7)" />, text: t(language, "ceremony_form_3") },
    { icon: <RulerIcon size={18} color="rgba(255,255,255,0.7)" />, text: t(language, "ceremony_form_4") },
    { icon: <AngleIcon size={18} color="rgba(255,255,255,0.7)" />, text: t(language, "ceremony_form_5") },
  ];

  const meanings = [
    { icon: <HeartIcon size={18} color="#f87171" />, text: t(language, "ceremony_meaning_patriotism") },
    { icon: <HandshakeIcon size={18} color="#fbbf24" />, text: t(language, "ceremony_meaning_unity") },
    { icon: <StrengthIcon size={18} color="#fbbf24" />, text: t(language, "ceremony_meaning_strength") },
  ];

  const squareSize = Math.min(screenWidth - 32, 360);
  const towerHeight = Math.min(screenHeight * 0.55, 420);
  const towerWidth = towerHeight * 0.75;

  return (
    <ScreenBackground>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Ready State */}
        {ceremonyState === "ready" && (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={{ alignItems: "center", paddingTop: 24, paddingBottom: 16 }}>
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
                {t(language, "flag_ceremony")}
              </Text>
            </View>

            {/* Ba Dinh Square */}
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <View
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              >
                <BaDinhSquare width={squareSize} height={squareSize * 0.75} />
              </View>
            </View>

            {/* Title */}
            <View style={{ alignItems: "center", paddingHorizontal: 24, marginBottom: 16 }}>
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
                {t(language, "ready_to_honor")}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.6)",
                  textAlign: "center",
                  lineHeight: 24,
                }}
              >
                {t(language, "ceremony_instructions")}
              </Text>
            </View>

            {/* Start Button */}
            <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
              <Button
                title={t(language, "start_ceremony")}
                icon={<PlayIcon size={20} color="#ffffff" />}
                onPress={startCountdown}
                variant="primary"
                size="large"
              />
            </View>

            {/* Form Instructions */}
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
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
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
                  style={{ fontSize: 16, fontWeight: "700", color: "#fbbf24", flex: 1 }}
                  numberOfLines={1}
                >
                  {t(language, "ceremony_form_title")}
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

              {/* Anthem note */}
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
                  {t(language, "ceremony_anthem")}
                </Text>
              </View>
            </View>

            {/* Meaning */}
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
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
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
                  style={{ fontSize: 16, fontWeight: "700", color: "#fbbf24", flex: 1 }}
                  numberOfLines={1}
                >
                  {t(language, "ceremony_meaning_title")}
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
                  <View style={{ width: 24, marginRight: 12, paddingTop: 2, flexShrink: 0 }}>
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

            {/* Back link */}
            <TouchableOpacity
              onPress={goHome}
              style={{ alignItems: "center", paddingVertical: 16, marginBottom: 80 }}
            >
              <Text style={{ fontSize: 15, color: "rgba(255,255,255,0.4)" }} numberOfLines={1}>
                {t(language, "cancel")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Countdown State */}
        {ceremonyState === "countdown" && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Animated.View style={countdownStyle}>
              <Text
                style={{
                  fontSize: 160,
                  fontWeight: "900",
                  color: "#fbbf24",
                  textShadowColor: "rgba(251, 191, 36, 0.5)",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 40,
                }}
              >
                {countdownNumber}
              </Text>
            </Animated.View>
            <Text
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                marginTop: 20,
                textTransform: "uppercase",
                letterSpacing: 4,
              }}
            >
              {t(language, "get_ready")}
            </Text>
          </View>
        )}

        {/* Playing State */}
        {ceremonyState === "playing" && (
          <Animated.View
            style={[
              { flex: 1, alignItems: "center", justifyContent: "center" },
              playingContainerStyle,
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
              {t(language, "ceremony_in_progress")}
            </Text>

            {/* Flag Tower with rising flag */}
            <View
              style={{
                shadowColor: "#dc2626",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <FlagTower
                width={towerWidth}
                height={towerHeight}
                flagProgress={flagProgress}
              />
            </View>

            <Text
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.6)",
                textAlign: "center",
                marginTop: 24,
              }}
              numberOfLines={2}
            >
              {t(language, "stand_at_attention")}
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
                {t(language, "playing_anthem")}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Completed State */}
        {ceremonyState === "completed" && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
            {/* Confetti & Fireworks Animation */}
            <Confetti active={ceremonyState === "completed"} />
            
            <Animated.View style={[completedContainerStyle, { alignItems: "center" }]}>
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
                {t(language, "ceremony_complete")}
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
                {t(language, "honored_flag_today")}
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
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center" }}
                  numberOfLines={1}
                >
                  {t(language, "duration")}
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
                  {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
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
                    style={{ fontSize: 16, fontWeight: "700", color: "#4ade80" }}
                    numberOfLines={1}
                  >
                    {t(language, "streak_updated")}
                  </Text>
                  <Text
                    style={{ fontSize: 13, color: "rgba(74, 222, 128, 0.7)", marginTop: 2 }}
                    numberOfLines={1}
                  >
                    {t(language, "keep_going_tomorrow")}
                  </Text>
                </View>
              </View>

              <Button
                title={t(language, "start_again")}
                icon={<PlayIcon size={20} color="#ffffff" />}
                onPress={resetCeremony}
                variant="primary"
                size="large"
              />
            </Animated.View>
          </View>
        )}
      </SafeAreaView>
    </ScreenBackground>
  );
}
