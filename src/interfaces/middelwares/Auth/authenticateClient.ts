import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../../../infrastructure/constant/status.codes";
import { UserRepository } from "../../../infrastructure/database/repo/user.repo";
import { IUserRepository } from "../../../domain/I_repository/I_user.repo";

const userRepo: IUserRepository = new UserRepository();

export async function authenticateClient(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  const lawyer_id = req.user.id;
  if (!lawyer_id) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
  const user = await userRepo.findByuser_id(lawyer_id);
  if (!user) {
    res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "user not found",
    });
    return;
  }
  if (user.is_blocked) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success: false,
      message: "You are blocked",
    });
    return;
  }
  next();
}
