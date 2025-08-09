import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../../../infrastructure/constant/status.codes";
import { UserRepository } from "../../../infrastructure/database/repo/UserRepo";
import { IUserRepository } from "../../../domain/IRepository/IUserRepo";
import { UserMapper } from "@infrastructure/Mapper/Implementations/UserMapper";

const userRepo: IUserRepository = new UserRepository(new UserMapper());

export async function authenticateClient(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  const client_id = req.user.id;
  if (!client_id) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }
  const user = await userRepo.findByuser_id(client_id);
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
