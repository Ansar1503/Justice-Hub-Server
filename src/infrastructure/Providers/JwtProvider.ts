import jwt from "jsonwebtoken";
import "dotenv/config";
import { IJwtProvider } from "@src/application/providers/JwtProvider";

export class JwtProvider implements IJwtProvider {
  private accessSecret: jwt.Secret;
  private refreshSecret: jwt.Secret;
  private emailSecret: jwt.Secret;
  private accessExpiry: jwt.SignOptions["expiresIn"];
  private refreshExpiry: jwt.SignOptions["expiresIn"];

  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET || "access_secret";
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || "refresh_secret";
    this.emailSecret = process.env.JWT_EMAIL_SECRET || "email_secret";
    this.accessExpiry =
      (process.env.JWT_ACCESS_EXPIRY as jwt.SignOptions["expiresIn"]) || "15m";
    this.refreshExpiry =
      (process.env.JWT_REFRESH_EXPIRY as jwt.SignOptions["expiresIn"]) || "1d";
  }

  private signToken(
    payload: Record<string, unknown>,
    secret: jwt.Secret,
    expiresIn: jwt.SignOptions["expiresIn"]
  ): string {
    return jwt.sign(payload, secret, { expiresIn });
  }

  GenerateAccessToken(payload: Record<string, unknown>): string {
    const { exp, iat, ...safePayload } = payload;
    return this.signToken(safePayload, this.accessSecret, this.accessExpiry);
  }

  GenerateRefreshToken(payload: Record<string, unknown>): string {
    const { exp, iat, ...safePayload } = payload;
    return this.signToken(safePayload, this.refreshSecret, this.refreshExpiry);
  }

  GenerateEmailToken(payload: { user_id: string }): string {
    return this.signToken(payload, this.emailSecret, "15m");
  }

  VerifyAccessToken(token: string): unknown {
    return this.verifyToken(token, this.accessSecret);
  }

  VerifyRefreshToken(token: string): unknown {
    return this.verifyToken(token, this.refreshSecret);
  }
  VerifyEmailToken(token: string): unknown {
    return this.verifyToken(token, this.emailSecret);
  }

  private verifyToken(token: string, secret: jwt.Secret): unknown {
    try {
      return jwt.verify(token, secret);
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
  }
}
