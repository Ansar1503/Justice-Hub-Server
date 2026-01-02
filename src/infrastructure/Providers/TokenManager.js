"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManagerProvider = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class TokenManagerProvider {
    ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET || "your-access-secret-key";
    validateToken(token) {
        try {
            const user = jsonwebtoken_1.default.verify(token, this.ACCESS_SECRET_KEY);
            return user;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new CustomError_1.UnauthorizedError("Token Expired");
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new CustomError_1.ForbiddenError("invalid token");
            }
            else if (error instanceof jsonwebtoken_1.default.NotBeforeError) {
                throw new CustomError_1.ForbiddenError("Token is not active");
            }
            else {
                throw new CustomError_1.InternalError("Authentication Error");
            }
        }
    }
}
exports.TokenManagerProvider = TokenManagerProvider;
