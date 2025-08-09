import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../../../infrastructure/constant/status.codes";
import { ILawyerRepository } from "../../../domain/IRepository/ILawyerRepo";
import { LawyerRepository } from "../../../infrastructure/database/repo/LawyerRepo";
import { UserRepository } from "../../../infrastructure/database/repo/UserRepo";
import { IUserRepository } from "../../../domain/IRepository/IUserRepo";
import { UserMapper } from "@infrastructure/Mapper/Implementations/UserMapper";
import { LawyerMapper } from "@infrastructure/Mapper/Implementations/LawyerMapper";

const userRepo: IUserRepository = new UserRepository(new UserMapper());
const LawyerRepo: ILawyerRepository = new LawyerRepository(new LawyerMapper());

export async function authenticateLawyer(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  // console.log("lawyer getting authenticated")
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
      message: "lawyer not found",
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
  const lawyer = await LawyerRepo.findUserId(lawyer_id);
  if (!lawyer) {
    res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "lawyer not found",
    });
    return;
  }
  if (lawyer.verification_status !== "verified") {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success: false,
      message: "Lawyer are not verified",
    });
    return;
  }
  next();
}
