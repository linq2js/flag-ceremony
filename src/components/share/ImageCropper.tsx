/**
 * ImageCropper - Image cropper with button controls
 * Shows a circular preview and provides zoom/pan controls via buttons
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  PanResponder,
  Modal,
} from "react-native";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { palette, spacing, textStyles } from "../../design";
import {
  CheckIcon,
  CloseIcon,
  ZoomInIcon,
  ZoomOutIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ResetIcon,
} from "../Icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CROP_SIZE = Math.min(SCREEN_WIDTH * 0.7, 300);
const MIN_SCALE = 0.2;
const MAX_SCALE = 2.0;
const PAN_STEP = 10;
const SLIDER_WIDTH = SCREEN_WIDTH * 0.7;

// Slider value mapping: sliderValue 0 = center (scale 1.0)
// Middle point: (0.2 + 2.0) / 2 = 1.1, but we use 1.0 as center (natural "no zoom")
// sliderValue ranges from -0.4 (scale 0.2) to +0.5 (scale 2.0)
// Using linear mapping: scale = 1.0 + sliderValue * 2.0
const SLIDER_MIN = -0.4; // Maps to scale 0.2: 0.2 = 1.0 + (-0.4) * 2.0
const SLIDER_MAX = 0.5;  // Maps to scale 2.0: 2.0 = 1.0 + 0.5 * 2.0
const SLIDER_CENTER = 0; // Maps to scale 1.0: 1.0 = 1.0 + 0 * 2.0

// Convert slider value to scale with clamping
// Formula: scale = 1.0 + sliderValue * 2.0
const sliderToScale = (sliderValue: number): number => {
  // Clamp slider value first
  const clampedSlider = Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, sliderValue));
  // Convert to scale: linear mapping centered at 1.0
  const scale = 1.0 + clampedSlider * 2.0;
  // Clamp scale to ensure it's within bounds (extra safety)
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
};

// Convert scale to slider value
const scaleToSlider = (scale: number): number => {
  // Clamp scale first
  const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
  // Convert to slider value: sliderValue = (scale - 1.0) / 2.0
  const sliderValue = (clampedScale - 1.0) / 2.0;
  // Clamp slider value
  return Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, sliderValue));
};

// Simple Slider Component
const SimpleSlider: React.FC<{
  value: number;
  min: number;
  max: number;
  onValueChange: (value: number) => void;
  style?: any;
}> = ({ value, min, max, onValueChange, style }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(SLIDER_WIDTH);
  const sliderRef = React.useRef<View>(null);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        if (sliderRef.current) {
          sliderRef.current.measure((x, y, width) => {
            const ratio = Math.max(0, Math.min(1, (evt.nativeEvent.locationX - x) / width));
            const newValue = min + ratio * (max - min);
            onValueChange(newValue);
          });
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (sliderRef.current) {
          sliderRef.current.measure((x, y, width) => {
            const ratio = Math.max(0, Math.min(1, (gestureState.moveX - x) / width));
            const newValue = min + ratio * (max - min);
            onValueChange(newValue);
          });
        }
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
    })
  ).current;

  const percentage = ((value - min) / (max - min)) * 100;

  if (Platform.OS === "web") {
    return (
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={value}
        onChange={(e) => onValueChange(parseFloat(e.target.value))}
        style={{
          width: "100%",
          height: 4,
          borderRadius: 2,
          outline: "none",
          ...style,
        } as any}
      />
    );
  }

  return (
    <View
      ref={sliderRef}
      style={[styles.sliderTrackNative, style]}
      onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
    >
      <View style={[styles.sliderFillNative, { width: `${percentage}%` }]} />
      <View
        style={[
          styles.sliderThumbNative,
          { left: `${percentage}%` },
          isDragging && styles.sliderThumbActive,
        ]}
      />
    </View>
  );
};

interface ImageCropperProps {
  imageUri: string;
  onCrop: (croppedUri: string) => void;
  onCancel: () => void;
  cropSize?: number;
  t: (key: string) => string;
  visible: boolean;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUri,
  onCrop,
  onCancel,
  cropSize = CROP_SIZE,
  t,
  visible,
}) => {
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sliderValue, setSliderValue] = useState(SLIDER_CENTER); // Start at center (0)
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const prevSliderValueRef = React.useRef(SLIDER_CENTER);
  
  // Convert slider value to scale
  const scale = sliderToScale(sliderValue);

  // Initialize image dimensions and scale
  useEffect(() => {
    Image.getSize(
      imageUri,
      (width, height) => {
        setImageSize({ width, height });
        // Always start slider at center (0) = scale 1.0 (middle point)
        setSliderValue(SLIDER_CENTER);
        prevSliderValueRef.current = SLIDER_CENTER;
        setTranslateX(0);
        setTranslateY(0);
      },
      () => {
        // Fallback if getSize fails
        setImageSize({ width: 400, height: 400 });
        // Always start slider at center (0) = scale 1.0 (middle point)
        setSliderValue(SLIDER_CENTER);
        prevSliderValueRef.current = SLIDER_CENTER;
        setTranslateX(0);
        setTranslateY(0);
      }
    );
  }, [imageUri, cropSize]);

  // Slider handler - maintain crop point centered when zooming
  const handleSliderChange = useCallback((newSliderValue: number) => {
    // Clamp slider value to valid range
    const clampedValue = Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, newSliderValue));
    
    // Verify the resulting scale is valid
    const resultingScale = sliderToScale(clampedValue);
    if (resultingScale < MIN_SCALE || resultingScale > MAX_SCALE) {
      console.warn(`Invalid scale value: ${resultingScale}, clamping to [${MIN_SCALE}, ${MAX_SCALE}]`);
    }
    
    // Don't adjust translateX/Y - the transform will scale around crop circle center
    // which keeps the same point centered automatically
    setSliderValue(clampedValue);
    prevSliderValueRef.current = clampedValue;
  }, []);

  const handleMoveLeft = useCallback(() => {
    setTranslateX((prev) => prev - PAN_STEP);
  }, []);

  const handleMoveRight = useCallback(() => {
    setTranslateX((prev) => prev + PAN_STEP);
  }, []);

  const handleMoveUp = useCallback(() => {
    setTranslateY((prev) => prev - PAN_STEP);
  }, []);

  const handleMoveDown = useCallback(() => {
    setTranslateY((prev) => prev + PAN_STEP);
  }, []);

  const handleReset = useCallback(() => {
    if (!imageSize) return;
    // Reset to slider center (0) = scale 1.0, centered
    setSliderValue(SLIDER_CENTER);
    setTranslateX(0);
    setTranslateY(0);
    prevSliderValueRef.current = SLIDER_CENTER;
  }, [imageSize]);

  // Calculate crop bounds
  // The crop circle is centered at (cropSize/2, cropSize/2) in preview
  // The image center is at (cropSize/2 + translateX, cropSize/2 + translateY) in preview
  // We need to find what part of the original image corresponds to the crop circle
  const getCropBounds = useCallback(() => {
    if (!imageSize) return null;

    const cropCenterX = cropSize / 2;
    const cropCenterY = cropSize / 2;

    // Image scaled dimensions
    const imageDisplayWidthScaled = imageSize.width * scale;
    const imageDisplayHeightScaled = imageSize.height * scale;
    
    // Image center position in preview coordinates
    const imageCenterX = cropCenterX + translateX;
    const imageCenterY = cropCenterY + translateY;

    // Image top-left position in preview coordinates
    const imageTopLeftX = imageCenterX - imageDisplayWidthScaled / 2;
    const imageTopLeftY = imageCenterY - imageDisplayHeightScaled / 2;
    
    // Crop circle center relative to image top-left in preview coordinates
    const cropCircleXRelative = cropCenterX - imageTopLeftX;
    const cropCircleYRelative = cropCenterY - imageTopLeftY;

    // Convert to original image coordinates (divide by scale)
    const cropCircleXInImage = cropCircleXRelative / scale;
    const cropCircleYInImage = cropCircleYRelative / scale;
    
    // Crop region size in original image coordinates
    const cropRegionSize = cropSize / scale;

    // Calculate crop rectangle (square that fits in circle)
    const originX = Math.max(0, Math.min(imageSize.width - cropRegionSize, cropCircleXInImage - cropRegionSize / 2));
    const originY = Math.max(0, Math.min(imageSize.height - cropRegionSize, cropCircleYInImage - cropRegionSize / 2));
    const width = Math.min(cropRegionSize, imageSize.width - originX);
    const height = Math.min(cropRegionSize, imageSize.height - originY);

    return {
      originX,
      originY,
      width,
      height,
    };
  }, [imageSize, cropSize, scale, translateX, translateY]);

  // Crop and save
  const handleCrop = useCallback(async () => {
    if (!imageSize || isProcessing) return;

    setIsProcessing(true);
    try {
      const bounds = getCropBounds();
      if (!bounds) {
        setIsProcessing(false);
        return;
      }

      // Crop the image using the new ImageManipulator API
      const context = ImageManipulator.manipulate(imageUri);
      context
        .crop({
          originX: Math.round(bounds.originX),
          originY: Math.round(bounds.originY),
          width: Math.round(bounds.width),
          height: Math.round(bounds.height),
        })
        .resize({ width: cropSize * 2 }); // 2x resolution for quality
      
      const imageRef = await context.renderAsync();
      const result = await imageRef.saveAsync({
        compress: 0.9,
        format: SaveFormat.JPEG,
      });

      onCrop(result.uri);
    } catch (error) {
      console.error("Crop error:", error);
      setIsProcessing(false);
    }
  }, [imageUri, imageSize, getCropBounds, cropSize, onCrop, isProcessing]);

  if (!imageSize) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={textStyles.body}>{t("loading") || "Loading"}...</Text>
        </View>
      </View>
    );
  }

  // Use original image dimensions - scaling will be done via transform
  const imageDisplayWidth = imageSize.width;
  const imageDisplayHeight = imageSize.height;
  
  // Circle center
  const circleCenterX = cropSize / 2;
  const circleCenterY = cropSize / 2;

  // Preview image style:
  // 1. left/top: FIXED initial position - center image at crop circle center (when scale = 1.0)
  //    This NEVER changes - it's the base position
  // 2. translateX/Y: Panning controls (0,0 = centered, +/- values move image)
  // 3. scale: Zoom (slider value 0 = scale 1.0, min -0.75 = scale 0.5, max +0.75 = scale 2.0)
  // 
  // Since left/top positions the element so its center is at crop circle center,
  // transformOrigin "center center" will scale around the element's center (which is crop circle center)
  const previewImageStyle = {
    width: imageDisplayWidth,
    height: imageDisplayHeight,
    // FIXED initial position: center image at crop circle center (doesn't change with scale!)
    left: circleCenterX - imageDisplayWidth / 2,
    top: circleCenterY - imageDisplayHeight / 2,
    // Transform: scale around center (crop circle center), then apply panning
    transformOrigin: "center center",
    transform: [
      { translateX: translateX }, // Panning offset
      { translateY: translateY },
      { scale: scale }, // Zoom around center
    ],
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <View style={styles.content}>
        {/* Preview section - Circular preview only */}
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>
            {(t("preview") || "Preview").toUpperCase()}
          </Text>
          
          {/* Circular preview - shows what will be cropped */}
          <View style={styles.previewContainer}>
            <View style={[styles.previewCircle, { width: cropSize, height: cropSize }]}>
              <View style={[styles.previewImageWrapper, previewImageStyle]}>
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: imageDisplayWidth,
                    height: imageDisplayHeight,
                  }}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Zoom slider */}
          <View style={styles.sliderContainer}>
            <ZoomOutIcon size={20} color={palette.white[80]} />
            <SimpleSlider
              value={sliderValue}
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              onValueChange={handleSliderChange}
              style={styles.slider}
            />
            <ZoomInIcon size={20} color={palette.white[80]} />
          </View>

          {/* Move and reset buttons - cross pattern */}
          <View style={styles.moveControlsContainer}>
            {/* Top row - Up button */}
            <View style={styles.moveControlsRow}>
              <TouchableOpacity style={styles.controlButton} onPress={handleMoveUp}>
                <ArrowUpIcon size={24} color={palette.white.full} />
              </TouchableOpacity>
            </View>
            {/* Middle row - Left, Reset, Right */}
            <View style={styles.moveControlsRow}>
              <TouchableOpacity style={styles.controlButton} onPress={handleMoveLeft}>
                <ArrowLeftIcon size={24} color={palette.white.full} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handleReset}>
                <ResetIcon size={24} color={palette.white.full} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handleMoveRight}>
                <ArrowRightIcon size={24} color={palette.white.full} />
              </TouchableOpacity>
            </View>
            {/* Bottom row - Down button */}
            <View style={styles.moveControlsRow}>
              <TouchableOpacity style={styles.controlButton} onPress={handleMoveDown}>
                <ArrowDownIcon size={24} color={palette.white.full} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={isProcessing}
          >
            <CloseIcon size={20} color={palette.white.full} />
            <Text style={styles.cancelButtonText}>{t("cancel") || "Cancel"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={handleCrop}
            disabled={isProcessing}
          >
            <CheckIcon size={20} color={palette.dark.base} />
            <Text style={styles.confirmButtonText}>
              {isProcessing ? t("processing") || "Processing..." : t("done") || "Done"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
  content: {
    flex: 1,
    paddingTop: spacing[2],
    justifyContent: "space-between",
    paddingBottom: spacing[2],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[3],
    paddingTop: spacing[2],
    flexShrink: 1, // Allow shrinking if needed
  },
  previewTitle: {
    ...textStyles.body,
    color: palette.white[80],
    marginBottom: spacing[3],
  },
  previewContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  previewCircle: {
    borderRadius: CROP_SIZE / 2,
    overflow: "hidden",
    backgroundColor: palette.dark.base,
    alignItems: "center",
    justifyContent: "center",
  },
  previewImageWrapper: {
    position: "absolute",
  },
  controls: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[2],
    gap: spacing[3],
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    paddingHorizontal: spacing[2],
  },
  slider: {
    flex: 1,
    height: 4,
  },
  sliderTrackNative: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    position: "relative",
  },
  sliderFillNative: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    backgroundColor: palette.gold[500],
    borderRadius: 2,
  },
  sliderThumbNative: {
    position: "absolute",
    top: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.gold[500],
    marginLeft: -10,
    borderWidth: 2,
    borderColor: palette.white.full,
  },
  sliderThumbActive: {
    transform: [{ scale: 1.2 }],
  },
  moveControlsContainer: {
    alignItems: "center",
    gap: spacing[2],
  },
  moveControlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing[3],
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    gap: spacing[4],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: palette.crimson[500],
  },
  confirmButton: {
    backgroundColor: palette.gold[500],
  },
  cancelButtonText: {
    ...textStyles.body,
    color: palette.white.full,
    fontWeight: "600",
  },
  confirmButtonText: {
    ...textStyles.body,
    color: palette.dark.base,
    fontWeight: "600",
  },
});
