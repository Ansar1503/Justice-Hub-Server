"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.chatDocumentstorage = exports.blogImageStorage = exports.caseDocumentStorage = exports.documentstorage = exports.profilestorage = void 0;
exports.handleMulterErrors = handleMulterErrors;
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.profilestorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        return {
            folder: "Justice_Hub/profile",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            transformation: [{ width: 500, height: 500, crop: "limit" }],
        };
    },
});
exports.documentstorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        const ext = path_1.default.extname(file.originalname);
        const filename = path_1.default.basename(file.originalname, ext);
        const isRaw = file.mimetype === "application/pdf" ||
            file.mimetype ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        return {
            folder: "Justice_Hub/documents",
            public_id: `${filename}-${Date.now()}${ext}`,
            resource_type: isRaw ? "raw" : "auto",
        };
    },
});
exports.caseDocumentStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        const ext = path_1.default.extname(file.originalname);
        const filename = path_1.default.basename(file.originalname, ext);
        const isRaw = file.mimetype === "application/pdf";
        return {
            folder: "JusticeHub/CaseDocuments",
            public_id: `${filename}-${Date.now()}${ext}`,
            resource_type: isRaw ? "raw" : "auto",
        };
    },
});
exports.blogImageStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        const ext = path_1.default.extname(file.originalname);
        const filename = path_1.default.basename(file.originalname, ext);
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
exports.chatDocumentstorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        const ext = path_1.default.extname(file.originalname);
        const filename = path_1.default.basename(file.originalname, ext);
        const isRaw = file.mimetype === "application/pdf" ||
            file.mimetype ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        return {
            folder: "Justice_Hub/chat_documents",
            public_id: `${filename}-${Date.now()}${ext}`,
            resource_type: isRaw ? "raw" : "auto",
        };
    },
});
const multer_1 = __importDefault(require("multer"));
function handleMulterErrors(multerMiddleware) {
    return (req, res, next) => {
        multerMiddleware(req, res, function (err) {
            // console.log("upload error ", err);
            if (err instanceof multer_1.default.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res
                        .status(400)
                        .json({ message: "File too large. Max 5MB allowed." });
                }
                if (err.code === "LIMIT_FILE_COUNT") {
                    return res.status(400).json({ message: "Maximum 3 files allowed." });
                }
                return res.status(400).json({ message: err.message });
            }
            else if (err) {
                return res
                    .status(500)
                    .json({ message: "Upload error", error: err.message });
            }
            next();
        });
    };
}
