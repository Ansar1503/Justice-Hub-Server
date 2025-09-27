import { AuthenticatedUser } from "@shared/types/authenticatedUser";

export interface ITokenManagerProvider {
    validateToken(token: string): AuthenticatedUser;
}
