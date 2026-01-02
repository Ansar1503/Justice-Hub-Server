"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET || "your-access-secret-key";
const ACCESS_EXPIRATION_TIME = (process.env.JWT_ACCESS_EXPIRY || "15m");
const REFRESH_EXPIRATION_TIME = (process.env.JWT_REFRESH_EXPIRY || "1d");
if (!ACCESS_SECRET_KEY || !REFRESH_SECRET_KEY) {
    throw new Error("JWT secret keys are missing in environment variables.");
}
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, ACCESS_SECRET_KEY, {
        expiresIn: ACCESS_EXPIRATION_TIME,
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, REFRESH_SECRET_KEY, {
        expiresIn: REFRESH_EXPIRATION_TIME,
    });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, ACCESS_SECRET_KEY);
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
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, REFRESH_SECRET_KEY);
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
};
exports.verifyRefreshToken = verifyRefreshToken;
