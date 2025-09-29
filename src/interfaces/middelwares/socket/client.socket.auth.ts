import {
  ForbiddenError,
  InternalError,
  UnauthorizedError,
} from "../Error/CustomError";
import "dotenv/config";
import { verifyAccessToken } from "../../../application/services/jwt.service";
import { DefaultEventsMap, ExtendedError, Socket } from "socket.io";

export function authenticateClientSocket(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError) => void
) {
  let { token } = socket.handshake.auth;
  token = token?.split(" ")[1];
  if (!token) {
    return next(new UnauthorizedError("Token not found"));
  }
  try {
    const payload = verifyAccessToken(token);
    socket.data.user = payload;
    next();
  } catch (error) {
    switch (error instanceof Error ? error.message : "Something went wrong") {
      case "TOKEN_EXPIRED":
        return next(new UnauthorizedError("Token expired"));
      case "INVALID_TOKEN":
        return next(new ForbiddenError("Invalid token "));
      case "TOKEN_NOT_ACTIVE":
        return next(new ForbiddenError("Token not active"));
      default:
        return next(new InternalError("Internal error"));
    }
  }
}
