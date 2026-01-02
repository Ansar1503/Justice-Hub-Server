"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundErrorHandler = exports.errorMiddleware = void 0;
const status_codes_1 = require("../../../infrastructure/constant/status.codes");
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode >= 100 && err.statusCode < 600
        ? err.statusCode
        : status_codes_1.STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message: message,
    });
};
exports.errorMiddleware = errorMiddleware;
const NotFoundErrorHandler = (req, res) => {
    res.status(status_codes_1.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Resource Not Found",
    });
    return;
};
exports.NotFoundErrorHandler = NotFoundErrorHandler;
