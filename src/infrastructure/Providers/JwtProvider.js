"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtProvider = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
class JwtProvider {
    accessSecret;
    refreshSecret;
    emailSecret;
    accessExpiry;
    refreshExpiry;
    constructor() {
        this.accessSecret = process.env.JWT_ACCESS_SECRET || "access_secret";
        this.refreshSecret = process.env.JWT_REFRESH_SECRET || "refresh_secret";
        this.emailSecret = process.env.JWT_EMAIL_SECRET || "email_secret";
        this.accessExpiry = process.env.JWT_ACCESS_EXPIRY || "15m";
        this.refreshExpiry = process.env.JWT_REFRESH_EXPIRY || "1d";
    }
    signToken(payload, secret, expiresIn) {
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
    }
    GenerateAccessToken(payload) {
        const { exp, iat, ...safePayload } = payload;
        return this.signToken(safePayload, this.accessSecret, this.accessExpiry);
    }
    GenerateRefreshToken(payload) {
        const { exp, iat, ...safePayload } = payload;
        return this.signToken(safePayload, this.refreshSecret, this.refreshExpiry);
    }
    GenerateEmailToken(payload) {
        return this.signToken(payload, this.emailSecret, "15m");
    }
    VerifyAccessToken(token) {
        return this.verifyToken(token, this.accessSecret);
    }
    VerifyRefreshToken(token) {
        return this.verifyToken(token, this.refreshSecret);
    }
    VerifyEmailToken(token) {
        return this.verifyToken(token, this.emailSecret);
    }
    verifyToken(token, secret) {
        try {
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new Error("TOKEN_EXPIRED");
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new Error("INVALID_TOKEN");
            }
            else if (error instanceof jsonwebtoken_1.default.NotBeforeError) {
                throw new Error("TOKEN_NOT_ACTIVE");
            }
            else {
                throw new Error("AUTH_FAIL");
            }
        }
    }
}
exports.JwtProvider = JwtProvider;
