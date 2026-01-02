"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const CustomError_1 = require("../../interfaces/middelwares/Error/CustomError");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
class CloudinaryService {
    cloudinary;
    constructor() {
        this.cloudinary = cloudinary_1.v2;
    }
    extractPublicIdFromUrl(input) {
        if (!input.includes("res.cloudinary.com") && !input.includes("/upload/")) {
            return input;
        }
        const match = input.match(/\/upload\/(?:v\d+\/)?(.+?)$/);
        if (!match)
            throw new CustomError_1.ValidationError("Invalid Cloudinary URL");
        return decodeURIComponent(match[1]);
    }
    async deleteFile(url) {
        try {
            const fileId = this.extractPublicIdFromUrl(url);
            //   console.log("fileId:", fileId);
            await this.cloudinary.uploader.destroy(fileId, { resource_type: "raw" });
        }
        catch (error) {
            throw error;
        }
    }
    async genrateSecureUrl(publicId) {
        const signedUrl = cloudinary_1.v2.url(publicId, {
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + 300,
        });
        return signedUrl;
    }
}
exports.CloudinaryService = CloudinaryService;
