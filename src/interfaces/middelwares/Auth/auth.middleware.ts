import { Request, Response, NextFunction } from "express";
import {
    ForbiddenError,
    UnauthorizedError,
    InternalError,
} from "../Error/CustomError";
import { TokenManagerProvider } from "@infrastructure/Providers/TokenManager";

export const authenticateUser = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : null;

    if (!token || token === "undefined" || token === "null") {
        res.status(401).json({
            success: false,
            message: "Token not found or malformed",
        });
        return;
    }

    try {
        const TokenManager = new TokenManagerProvider();
        const decode = TokenManager.validateToken(token);

        if (req.url.startsWith("/api/admin") && decode.role !== "admin") {
            res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource",
            });
            return;
        }

        if (req.url.startsWith("/api/lawyer") && decode.role !== "lawyer") {
            res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource",
            });
            return;
        }

        if (req.url.startsWith("/api/client") && decode.role === "admin") {
            res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource",
            });
            return;
        }

        req.user = decode;
        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            res.status(401).json({ success: false, message: error.message });
            return;
        }
        if (error instanceof ForbiddenError) {
            res.status(403).json({ success: false, message: error.message });
            return;
        }
        if (error instanceof InternalError) {
            res.status(500).json({ success: false, message: error.message });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
