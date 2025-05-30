import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const profilestorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "Justice_Hub/profile",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

export const documentstorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "Justice_Hub/documents",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
    };
  },
});



export { cloudinary };
