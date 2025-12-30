import { type ReactNode } from "react";
import { View, StyleSheet } from "react-native";

interface ScreenProps {
  children: ReactNode;
}

export function Screen({ children }: ScreenProps) {
  return <View style={styles.root}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
