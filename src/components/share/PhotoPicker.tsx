/**
 * PhotoPicker - Component for selecting or taking a photo with cropping
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { palette, spacing, cardStyles, textStyles } from "../../design";
import { CameraIcon, GalleryIcon, CloseIcon, EditIcon } from "../Icons";
import { ImageCropper } from "./ImageCropper";

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
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(t("permission_denied") + "\n" + t("gallery_permission_message"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false, // We'll use custom cropper instead
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      // Use custom cropper for all platforms
      setTempImageUri(result.assets[0].uri);
      setShowCropper(true);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert(t("permission_denied") + "\n" + t("camera_permission_message"));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false, // We'll use custom cropper instead
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      // Use custom cropper for all platforms
      setTempImageUri(result.assets[0].uri);
      setShowCropper(true);
    }
  };

  const handleCrop = (croppedUri: string) => {
    onPhotoChange(croppedUri);
    setShowCropper(false);
    setTempImageUri(null);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setTempImageUri(null);
  };

  const handleEditPhoto = () => {
    if (photoUri) {
      setTempImageUri(photoUri);
      setShowCropper(true);
    }
  };

  return (
    <>
      {showCropper && tempImageUri && (
        <ImageCropper
          imageUri={tempImageUri}
          onCrop={handleCrop}
          onCancel={handleCancelCrop}
          t={t}
          visible={showCropper}
        />
      )}

      {photoUri ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[cardStyles.default, styles.actionButton, styles.editButton]}
            onPress={handleEditPhoto}
          >
            <EditIcon size={20} color={palette.dark.base} />
            <Text style={[styles.buttonText, styles.editButtonText]}>
              {t("edit_photo")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              cardStyles.default,
              styles.actionButton,
              styles.removeButton,
            ]}
            onPress={() => onPhotoChange(null)}
          >
            <CloseIcon size={20} color={palette.white.full} />
            <Text style={[styles.buttonText, styles.removeButtonText]}>
              {t("remove_photo")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
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
      )}
    </>
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
  buttonContainer: {
    flexDirection: "row",
    gap: spacing[4],
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  editButton: {
    backgroundColor: palette.gold[500],
  },
  editButtonText: {
    color: palette.dark.base,
  },
  removeButton: {
    backgroundColor: palette.crimson[500],
  },
  removeButtonText: {
    color: palette.white.full,
  },
});
