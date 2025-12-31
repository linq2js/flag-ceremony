/**
 * PhotoPicker - Component for selecting or taking a photo with cropping
 *
 * Persists original image and crop settings so users can re-edit with same state.
 * Only clears everything when "Remove Photo" is pressed.
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
import { ImageCropper, CropSettings } from "./ImageCropper";

interface PhotoPickerProps {
  /** Cropped photo URI (displayed in badge) */
  photoUri: string | null;
  /** Original uploaded image URI (before cropping) */
  originalPhotoUri: string | null;
  /** Persisted crop settings */
  cropSettings: CropSettings | null;
  /** Called when a new photo is selected and cropped */
  onPhotoSet: (
    originalUri: string,
    croppedUri: string,
    cropSettings: CropSettings
  ) => void;
  /** Called when existing photo is re-cropped */
  onPhotoUpdate: (croppedUri: string, cropSettings: CropSettings) => void;
  /** Called when photo is removed */
  onPhotoClear: () => void;
  t: (key: string) => string;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  photoUri,
  originalPhotoUri,
  cropSettings,
  onPhotoSet,
  onPhotoUpdate,
  onPhotoClear,
  t,
}) => {
  const [showCropper, setShowCropper] = useState(false);
  // tempImageUri is only used for NEW image selections (not for editing)
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);
  // Track if we're editing existing photo vs uploading new one
  const [isEditing, setIsEditing] = useState(false);

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
      // New image - reset editing state
      setTempImageUri(result.assets[0].uri);
      setIsEditing(false);
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
      // New image - reset editing state
      setTempImageUri(result.assets[0].uri);
      setIsEditing(false);
      setShowCropper(true);
    }
  };

  const handleCrop = (croppedUri: string, newCropSettings: CropSettings) => {
    if (isEditing && originalPhotoUri) {
      // Re-editing existing photo - just update crop
      onPhotoUpdate(croppedUri, newCropSettings);
    } else if (tempImageUri) {
      // New photo - set both original and cropped
      onPhotoSet(tempImageUri, croppedUri, newCropSettings);
    }
    setShowCropper(false);
    setTempImageUri(null);
    setIsEditing(false);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setTempImageUri(null);
    setIsEditing(false);
  };

  const handleEditPhoto = () => {
    // Edit existing photo - use original image with persisted crop settings
    if (originalPhotoUri) {
      setIsEditing(true);
      setTempImageUri(null); // Don't use temp, we'll use originalPhotoUri
      setShowCropper(true);
    }
  };

  // Determine which image URI to use for cropper
  const cropperImageUri = isEditing ? originalPhotoUri : tempImageUri;
  // Only pass initial settings when editing existing photo
  const initialCropSettings = isEditing ? cropSettings : null;

  return (
    <>
      {showCropper && cropperImageUri && (
        <ImageCropper
          imageUri={cropperImageUri}
          onCrop={handleCrop}
          onCancel={handleCancelCrop}
          t={t}
          visible={showCropper}
          initialSettings={initialCropSettings}
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
            onPress={onPhotoClear}
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
