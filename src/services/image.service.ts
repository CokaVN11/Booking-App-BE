import { v2 as cloudinary } from "cloudinary";

export class ImageService {
  private static instance: ImageService | null = null;

  private constructor() {}

  static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }

    return ImageService.instance;
  }

  uploadImage = async (file: any) => {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "joyserve",
        allowed_formats: ["jpg", "png", "jpeg"],
        public_id: file.filename,
      });
      return result.secure_url;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };

  deleteImage = async (public_id: string) => {
    try {
      const result = await cloudinary.uploader.destroy(public_id);
      return result;
    } catch (error) {
      const _error = error as Error;
      throw new Error(_error.message);
    }
  };
}
