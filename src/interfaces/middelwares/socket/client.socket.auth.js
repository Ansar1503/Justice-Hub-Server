"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateClientSocket = authenticateClientSocket;
const CustomError_1 = require("../Error/CustomError");
require("dotenv/config");
const jwt_service_1 = require("../../../application/services/jwt.service");
function authenticateClientSocket(socket, next) {
    let { token } = socket.handshake.auth;
    token = token?.split(" ")[1];
    if (!token) {
        return next(new CustomError_1.UnauthorizedError("Token not found"));
    }
    try {
        const payload = (0, jwt_service_1.verifyAccessToken)(token);
        socket.data.user = payload;
        next();
    }
    catch (error) {
        switch (error instanceof Error ? error.message : "Something went wrong") {
            case "TOKEN_EXPIRED":
                return next(new CustomError_1.UnauthorizedError("Token expired"));
            case "INVALID_TOKEN":
                return next(new CustomError_1.ForbiddenError("Invalid token "));
            case "TOKEN_NOT_ACTIVE":
                return next(new CustomError_1.ForbiddenError("Token not active"));
            default:
                return next(new CustomError_1.InternalError("Internal error"));
        }
    }
}
