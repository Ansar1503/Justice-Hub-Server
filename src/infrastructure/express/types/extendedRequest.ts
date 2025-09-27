import { AuthenticatedUser } from "@shared/types/authenticatedUser";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}
