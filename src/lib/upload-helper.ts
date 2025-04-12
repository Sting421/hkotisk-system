/**
 * Helper function to upload files to Cloudinary
 * @param file File to upload
 * @returns Promise containing the uploaded file URL and public ID
 */
export const uploadToCloudinary = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      public_id: data.public_id
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}
