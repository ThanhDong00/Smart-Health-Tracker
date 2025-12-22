export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
}

export class CloudinaryService {
  private static cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  private static uploadPreset =
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  private static uploadUrl = `https://api.cloudinary.com/v1_1/${CloudinaryService.cloudName}/image/upload`;

  /**
   * Upload an image to Cloudinary
   * @param imageUri - Local URI of the image
   * @param folder - Folder name in Cloudinary (default: "smarthealth")
   * @returns Promise with the uploaded image URL
   */
  static async uploadImage(
    imageUri: string,
    folder: string = "smarthealth"
  ): Promise<string> {
    try {
      // Create form data
      const formData = new FormData();

      // Extract filename from URI
      const filename = imageUri.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      // Append image file
      formData.append("file", {
        uri: imageUri,
        type,
        name: filename,
      } as any);

      formData.append("upload_preset", CloudinaryService.uploadPreset!);
      formData.append("folder", folder);

      // Upload to Cloudinary
      const response = await fetch(CloudinaryService.uploadUrl, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to upload image to Cloudinary"
        );
      }

      const data: CloudinaryUploadResponse = await response.json();
      return data.secure_url;
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      throw new Error(error.message || "Failed to upload image");
    }
  }

  /**
   * Validate image size
   * @param imageUri - Local URI of the image
   * @param maxSizeMB - Maximum size in MB (default: 5)
   * @returns Promise<boolean>
   */
  static async validateImageSize(
    imageUri: string,
    maxSizeMB: number = 5
  ): Promise<boolean> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const sizeInMB = blob.size / (1024 * 1024);
      return sizeInMB <= maxSizeMB;
    } catch (error) {
      console.error("Error validating image size:", error);
      return false;
    }
  }
}
