import { Request, Response, NextFunction } from "express";
import { ForbiddenError, ValidationError } from "../Error/CustomError";
import { TokenManagerProvider } from "@infrastructure/Providers/TokenManager";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token || token === "undefined" || token === "null") {
    throw new ValidationError("Token not found or malformed");
  }
  try {
    const TokenManager = new TokenManagerProvider();

    const decode = TokenManager.validateToken(token);
    if (req.url.startsWith("/api/admin") && decode.role !== "admin") {
      throw new ForbiddenError(
        "You are not authorized to access this resource"
      );
    }

    if (req.url.startsWith("/api/lawyer") && decode.role !== "lawyer") {
      throw new ForbiddenError(
        "You are not authorized to access this resource"
      );
    }

    if (req.url.startsWith("/api/client") && decode.role == "admin") {
      throw new ForbiddenError(
        "You are not authorized to access this resource"
      );
    }

    req.user = decode;
    next();
  } catch (error: any) {
    next(error);
  }
};
