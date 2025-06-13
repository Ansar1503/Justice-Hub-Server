import { STATUS_CODES } from "../../../infrastructure/constant/status.codes";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean = true;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
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

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.FORBIDDEN);
  }
}
