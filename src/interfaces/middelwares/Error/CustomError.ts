import { STATUS_CODES } from "../../../infrastructure/constant/status.codes";

export class AppError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.message = message;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, STATUS_CODES.BAD_REQUEST);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, STATUS_CODES.NOT_FOUND);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, STATUS_CODES.UNAUTHORIZED);
    }
}

export class InternalError extends AppError {
    constructor(message: string) {
        super(message, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, STATUS_CODES.FORBIDDEN);
    }
}
