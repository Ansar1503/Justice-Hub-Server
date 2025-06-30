import { v2 as cloudinary } from "cloudinary";
import { ValidationError } from "../../interfaces/middelwares/Error/CustomError";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export interface ICloudinaryService {
  deleteFile(url: string): Promise<void>;
  extractPublicIdFromUrl(url: string): string;
}

export class CloudinaryService implements ICloudinaryService {
  private cloudinary;

  constructor() {
    this.cloudinary = cloudinary;
  }
  extractPublicIdFromUrl(url: string): string {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)$/);
    if (!match) throw new ValidationError("Invalid Cloudinary URL");
    return decodeURIComponent(match[1]);
  }

  async deleteFile(url: string): Promise<void> {
    try {
      const fileId = this.extractPublicIdFromUrl(url);
      //   console.log("fileId:", fileId);
      await this.cloudinary.uploader.destroy(fileId, { resource_type: "raw" });
    } catch (error) {
      console.error("Failed to delete file:", error);
      throw error;
    }
  }
}
