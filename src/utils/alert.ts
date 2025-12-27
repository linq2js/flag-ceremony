import { Alert, Platform } from "react-native";

interface AlertButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

/**
 * Cross-platform alert that works on both native and web
 */
export function showAlert(
  title: string,
  message: string,
  buttons?: AlertButton[]
) {
  if (Platform.OS === "web") {
    // Web: use window.confirm for 2-button dialogs, window.alert for single button
    if (buttons && buttons.length === 2) {
      const cancelButton = buttons.find((b) => b.style === "cancel");
      const confirmButton = buttons.find((b) => b.style !== "cancel");

      const confirmed = window.confirm(`${title}\n\n${message}`);
      if (confirmed && confirmButton?.onPress) {
        confirmButton.onPress();
      } else if (!confirmed && cancelButton?.onPress) {
        cancelButton.onPress();
      }
    } else {
      window.alert(`${title}\n\n${message}`);
      // Call the first button's onPress if it exists
      if (buttons && buttons[0]?.onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    // Native: use Alert.alert
    Alert.alert(title, message, buttons);
  }
}

/**
 * Cross-platform confirmation dialog
 * Returns a promise that resolves to true if confirmed, false if cancelled
 */
export function showConfirm(title: string, message: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(`${title}\n\n${message}`);
      resolve(confirmed);
    } else {
      Alert.alert(title, message, [
        { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
        { text: "OK", onPress: () => resolve(true) },
      ]);
    }
  });
}

