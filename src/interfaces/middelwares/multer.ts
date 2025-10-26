import "dotenv/config";
import path from "path";
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
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext);
    const isRaw =
      file.mimetype === "application/pdf" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    return {
      folder: "Justice_Hub/documents",
      public_id: `${filename}-${Date.now()}${ext}`,
      resource_type: isRaw ? "raw" : "auto",
    };
  },
});

export const caseDocumentStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext);
    const isRaw = file.mimetype === "application/pdf";
    return {
      folder: "JusticeHub/CaseDocuments",
      public_id: `${filename}-${Date.now()}${ext}`,
      resource_type: isRaw ? "raw" : "auto",
    };
  },
});

export const blogImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext);
    return {
      folder: "JusticeHub/BlogImages",
      public_id: `${filename}-${Date.now()}${ext}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [
        { width: 1280, height: 720, crop: "limit", quality: "auto" },
      ],
      resource_type: "image",
    };
  },
});

export const chatDocumentstorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext);
    const isRaw =
      file.mimetype === "application/pdf" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    return {
      folder: "Justice_Hub/chat_documents",
      public_id: `${filename}-${Date.now()}${ext}`,
      resource_type: isRaw ? "raw" : "auto",
    };
  },
});

export { cloudinary };

import multer from "multer";
import { Request, Response, NextFunction } from "express";

export function handleMulterErrors(
  multerMiddleware: any
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    multerMiddleware(req, res, function (err: any) {
      // console.log("upload error ", err);
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ message: "File too large. Max 5MB allowed." });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({ message: "Maximum 3 files allowed." });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res
          .status(500)
          .json({ message: "Upload error", error: err.message });
      }

      next();
    });
  };
}
