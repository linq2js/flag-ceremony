/**
 * PhotoPicker - Component for selecting or taking a photo
 */

import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { palette, spacing, cardStyles, textStyles } from "../../design";
import { CameraIcon, GalleryIcon, CloseIcon } from "../Icons";

interface PhotoPickerProps {
  photoUri: string | null;
  onPhotoChange: (uri: string | null) => void;
  t: (key: string) => string;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  photoUri,
  onPhotoChange,
  t,
}) => {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(t("permission_denied") + "\n" + t("gallery_permission_message"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onPhotoChange(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert(t("permission_denied") + "\n" + t("camera_permission_message"));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onPhotoChange(result.assets[0].uri);
    }
  };

  if (photoUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onPhotoChange(null)}
        >
          <CloseIcon size={16} color={palette.white.full} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[cardStyles.default, styles.button]}
        onPress={takePhoto}
      >
        <CameraIcon size={24} color={palette.gold[500]} />
        <Text style={styles.buttonText}>{t("take_photo")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[cardStyles.default, styles.button]}
        onPress={pickImage}
      >
        <GalleryIcon size={24} color={palette.gold[500]} />
        <Text style={styles.buttonText}>{t("choose_photo")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing[4],
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[3],
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[4],
  },
  buttonText: {
    ...textStyles.body,
    color: palette.white[70],
    fontWeight: "600",
  },
  previewContainer: {
    position: "relative",
    alignSelf: "center",
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: palette.gold[500],
  },
  removeButton: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: palette.crimson[500],
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

