import { AuthenticatedUser } from "@shared/types/authenticatedUser";
import jwt, { Secret } from "jsonwebtoken";
import "dotenv/config";
import { ForbiddenError, InternalError, UnauthorizedError } from "@interfaces/middelwares/Error/CustomError";
import { ITokenManagerProvider } from "@src/application/providers/ITokenManagerProvider";

export class TokenManagerProvider implements ITokenManagerProvider {
    private ACCESS_SECRET_KEY: Secret = process.env.JWT_ACCESS_SECRET || "your-access-secret-key";
    validateToken(token: string): AuthenticatedUser {
        try {
            const user = jwt.verify(token, this.ACCESS_SECRET_KEY);
            return user as AuthenticatedUser;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError("Token Expired");
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new ForbiddenError("invalid token");
            } else if (error instanceof jwt.NotBeforeError) {
                throw new ForbiddenError("Token is not active");
            } else {
                throw new InternalError("Authentication Error");
            }
        }
    }
}
