/**
 * SVG Badge Utilities
 * Helpers for image conversion and export
 */

import { Platform } from "react-native";

/**
 * Convert an image URI to base64 data URI
 * This is needed because SVG Image elements need embedded data for reliable export
 */
export async function imageToDataUri(uri: string | null): Promise<string | null> {
  if (!uri) return null;

  // Already a data URI
  if (uri.startsWith("data:")) return uri;

  try {
    if (Platform.OS === "web") {
      // Web: Use fetch + FileReader
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      // Native: Use expo-file-system
      const FileSystem = await import("expo-file-system");
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });
      // Detect mime type from extension or default to jpeg
      const ext = uri.split(".").pop()?.toLowerCase();
      const mime =
        ext === "png"
          ? "image/png"
          : ext === "gif"
            ? "image/gif"
            : "image/jpeg";
      return `data:${mime};base64,${base64}`;
    }
  } catch (error) {
    console.error("Failed to convert image to data URI:", error);
    return null;
  }
}

/**
 * Convert SVG element to PNG data URI
 * Works on both web and native
 */
export async function svgToPng(
  svgElement: SVGSVGElement | null,
  width: number,
  height: number
): Promise<string | null> {
  if (!svgElement) return null;

  if (Platform.OS === "web") {
    return svgToPngWeb(svgElement, width, height);
  } else {
    // For native, we'll use ViewShot which works with SVG components
    // This function is mainly for web export
    return null;
  }
}

/**
 * Web-specific SVG to PNG conversion
 */
async function svgToPngWeb(
  svgElement: SVGSVGElement,
  width: number,
  height: number
): Promise<string> {
  // Serialize SVG to string
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgElement);

  // Ensure proper XML namespace
  if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
    svgString = svgString.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Create blob and URL
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Create image from SVG
  const img = new Image();
  img.crossOrigin = "anonymous";

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Create canvas with 2x resolution for crisp export
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Scale and draw
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, width, height);

      // Clean up
      URL.revokeObjectURL(url);

      // Export as PNG
      resolve(canvas.toDataURL("image/png", 1.0));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG as image"));
    };

    img.src = url;
  });
}

/**
 * Download a data URI as a file (web only)
 */
export function downloadDataUri(dataUri: string, filename: string): void {
  if (Platform.OS !== "web") return;

  const link = document.createElement("a");
  link.href = dataUri;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

