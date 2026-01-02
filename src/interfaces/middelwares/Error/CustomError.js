"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.InternalError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = exports.AppError = void 0;
const status_codes_1 = require("../../../infrastructure/constant/status.codes");
class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.message = message;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message) {
        super(message, status_codes_1.STATUS_CODES.BAD_REQUEST);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends AppError {
    constructor(message) {
        super(message, status_codes_1.STATUS_CODES.NOT_FOUND);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, status_codes_1.STATUS_CODES.UNAUTHORIZED);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class InternalError extends AppError {
    constructor(message) {
        super(message, status_codes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
}
exports.InternalError = InternalError;
class ForbiddenError extends AppError {
    constructor(message) {
        super(message, status_codes_1.STATUS_CODES.FORBIDDEN);
    }
}
exports.ForbiddenError = ForbiddenError;
