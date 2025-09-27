import { NextFunction, Request, Response } from "express";

import { AppError } from "./CustomError";
import { STATUS_CODES } from "../../../infrastructure/constant/status.codes";

export const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    console.log("error :", err);
    // console.log("original Url:", req.originalUrl);

    const statusCode =
        err.statusCode >= 100 && err.statusCode < 600 ? err.statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR;

    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message: message,
    });
};

export const NotFoundErrorHandler = (req: Request, res: Response) => {
    res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Resource Not Found",
    });
    return;
};
