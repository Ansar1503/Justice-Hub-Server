import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../../infrastructure/services/jwt.service";
import { STATUS_CODES } from "../../../infrastructure/constant/status.codes";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!token) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Access token not found",
    });
    return;
  }
  try {
    const decode = verifyAccessToken(token);
    console.log(decode)
    next();
  } catch (error: any) {
    switch (error.message) {
      case "TOKEN_EXPIRED":
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "Token has expired. Please refresh your token.",
        });
        return;
      case "INVALID_TOKEN":
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "Invalid token. Please log in again.",
        });
        return;
      case "TOKEN_NOT_ACTIVE":
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: "Token is not yet active. Please try again later.",
        });
        return;
      default:
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Authentication failed.",
        });
        return;
    }
  }
};

