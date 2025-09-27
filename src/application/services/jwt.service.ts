import jwt from "jsonwebtoken";
import "dotenv/config";

interface TokenPayload {
    id: string;
    email: string;
    role: string;
    status: boolean;
}

const REFRESH_SECRET_KEY: jwt.Secret = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const ACCESS_SECRET_KEY: jwt.Secret = process.env.JWT_ACCESS_SECRET || "your-access-secret-key";

const ACCESS_EXPIRATION_TIME = (process.env.JWT_ACCESS_EXPIRY || "15m") as jwt.SignOptions["expiresIn"];
const REFRESH_EXPIRATION_TIME = (process.env.JWT_REFRESH_EXPIRY || "1d") as jwt.SignOptions["expiresIn"];

if (!ACCESS_SECRET_KEY || !REFRESH_SECRET_KEY) {
    throw new Error("JWT secret keys are missing in environment variables.");
}

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, ACCESS_SECRET_KEY, {
        expiresIn: ACCESS_EXPIRATION_TIME,
    });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, REFRESH_SECRET_KEY, {
        expiresIn: REFRESH_EXPIRATION_TIME,
    });
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, ACCESS_SECRET_KEY);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error("TOKEN_EXPIRED");
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error("INVALID_TOKEN");
        } else if (error instanceof jwt.NotBeforeError) {
            throw new Error("TOKEN_NOT_ACTIVE");
        } else {
            throw new Error("AUTH_FAIL");
        }
    }
};

export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, REFRESH_SECRET_KEY);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error("TOKEN_EXPIRED");
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error("INVALID_TOKEN");
        } else if (error instanceof jwt.NotBeforeError) {
            throw new Error("TOKEN_NOT_ACTIVE");
        } else {
            throw new Error("AUTH_FAIL");
        }
    }
};
