import jwt from "jsonwebtoken";
import "dotenv/config";

interface TokenPayload {
  user_id: string;
  email: string;
  role: string;
}

const REFRESH_SECRET_KEY: jwt.Secret =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const ACCESS_SECRET_KEY: jwt.Secret =
  process.env.JWT_ACCESS_SECRET || "your-access-secret-key";

const ACCESS_EXPIRATION_TIME = (process.env.JWT_ACCESS_EXPIRY ||
  "15m") as jwt.SignOptions["expiresIn"];
const REFRESH_EXPIRATION_TIME = (process.env.JWT_REFRESH_EXPIRY ||
  "1d") as jwt.SignOptions["expiresIn"];

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
