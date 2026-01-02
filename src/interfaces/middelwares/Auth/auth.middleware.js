"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const TokenManager_1 = require("@infrastructure/Providers/TokenManager");
const CustomError_1 = require("../Error/CustomError");
const authenticateUser = (req, res, next) => {
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
        const TokenManager = new TokenManager_1.TokenManagerProvider();
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
    }
    catch (error) {
        if (error instanceof CustomError_1.UnauthorizedError) {
            res.status(401).json({ success: false, message: error.message });
            return;
        }
        if (error instanceof CustomError_1.ForbiddenError) {
            res.status(403).json({ success: false, message: error.message });
            return;
        }
        if (error instanceof CustomError_1.InternalError) {
            res.status(500).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.authenticateUser = authenticateUser;
