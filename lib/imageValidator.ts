/**
 * Image validation utilities for upload validation
 */

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MIN_IMAGE_DIMENSION = 200; // pixels
const MAX_IMAGE_DIMENSION = 8000; // pixels

export interface ImageValidationError {
  field: string;
  message: string;
}

export async function validateImageFile(
  file: File,
): Promise<ImageValidationError[]> {
  const errors: ImageValidationError[] = [];

  // Check file size
  if (file.size > MAX_IMAGE_SIZE) {
    errors.push({
      field: "image",
      message: `Image size must be less than 10 MB (current: ${(file.size / 1024 / 1024).toFixed(1)} MB)`,
    });
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    errors.push({
      field: "image",
      message: `Invalid image format. Allowed: JPEG, PNG, WebP (received: ${file.type || "unknown"})`,
    });
  }

  // Check image dimensions
  try {
    const dimensions = await getImageDimensions(file);
    if (
      dimensions.width < MIN_IMAGE_DIMENSION ||
      dimensions.height < MIN_IMAGE_DIMENSION
    ) {
      errors.push({
        field: "image",
        message: `Image dimensions too small. Minimum: ${MIN_IMAGE_DIMENSION}x${MIN_IMAGE_DIMENSION}px (current: ${dimensions.width}x${dimensions.height}px)`,
      });
    }
    if (
      dimensions.width > MAX_IMAGE_DIMENSION ||
      dimensions.height > MAX_IMAGE_DIMENSION
    ) {
      errors.push({
        field: "image",
        message: `Image dimensions too large. Maximum: ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION}px (current: ${dimensions.width}x${dimensions.height}px)`,
      });
    }
  } catch {
    errors.push({
      field: "image",
      message:
        "Could not read image dimensions. Please ensure the file is a valid image.",
    });
  }

  return errors;
}

function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses and resizes an image to a maximum dimension
 * This is crucial to prevent "Payload Too Large" errors from Gemini API
 * and 1MB document limit crashes in Firestore.
 */
export function compressImage(file: File, maxDimension: number = 1024): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        // Draw to canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob (JPEG with 0.8 quality)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas toBlob failed"));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          0.8
        );
      };
      img.onerror = () => reject(new Error("Failed to load image for compression"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file for compression"));
    reader.readAsDataURL(file);
  });
}
