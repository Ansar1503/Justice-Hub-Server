import jwt from "jsonwebtoken";
import "dotenv/config";
import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { JwtPayloadDto } from "@src/application/dtos/JwtPayloadDto"; // adjust path

export class JwtProvider implements IJwtProvider {
    private _accessSecret: jwt.Secret;
    private _refreshSecret: jwt.Secret;
    private _emailSecret: jwt.Secret;
    private _accessExpiry: jwt.SignOptions["expiresIn"];
    private _refreshExpiry: jwt.SignOptions["expiresIn"];

    constructor() {
        this._accessSecret = process.env.JWT_ACCESS_SECRET || "access_secret";
        this._refreshSecret = process.env.JWT_REFRESH_SECRET || "refresh_secret";
        this._emailSecret = process.env.JWT_EMAIL_SECRET || "email_secret";
        this._accessExpiry = (process.env.JWT_ACCESS_EXPIRY as jwt.SignOptions["expiresIn"]) || "15m";
        this._refreshExpiry = (process.env.JWT_REFRESH_EXPIRY as jwt.SignOptions["expiresIn"]) || "1d";
    }

    private _signToken<T extends object>(
        payload: T,
        secret: jwt.Secret,
        expiresIn: jwt.SignOptions["expiresIn"],
    ): string {
        return jwt.sign(payload, secret, { expiresIn });
    }

    GenerateAccessToken(payload: JwtPayloadDto): string {
        const { exp, iat, ...safePayload } = payload as any;
        return this._signToken<JwtPayloadDto>(safePayload, this._accessSecret, this._accessExpiry);
    }

    GenerateRefreshToken(payload: JwtPayloadDto): string {
        const { exp, iat, ...safePayload } = payload as any;
        return this._signToken<JwtPayloadDto>(safePayload, this._refreshSecret, this._refreshExpiry);
    }

    GenerateEmailToken(payload: { user_id: string }): string {
        return this._signToken(payload, this._emailSecret, "15m");
    }

    VerifyAccessToken(token: string): JwtPayloadDto {
        return this._verifyToken<JwtPayloadDto>(token, this._accessSecret);
    }

    VerifyRefreshToken(token: string): JwtPayloadDto {
        return this._verifyToken<JwtPayloadDto>(token, this._refreshSecret);
    }

    VerifyEmailToken(token: string): { user_id: string } {
        return this._verifyToken<{ user_id: string }>(token, this._emailSecret);
    }

    private _verifyToken<T>(token: string, secret: jwt.Secret): T {
        try {
            return jwt.verify(token, secret) as T;
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
