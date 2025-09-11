import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../../../infrastructure/constant/status.codes";
import { UserRepository } from "../../../infrastructure/database/repo/UserRepo";
import { IUserRepository } from "../../../domain/IRepository/IUserRepo";
import { UserMapper } from "@infrastructure/Mapper/Implementations/UserMapper";
import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { LawyerVerificationRepo } from "@infrastructure/database/repo/LawyerVerificationRepo";
import { LawyerVerificationMapper } from "@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper";

const userRepo: IUserRepository = new UserRepository(new UserMapper());
const lawyerverificationsRepo: ILawyerVerificationRepo =
  new LawyerVerificationRepo(new LawyerVerificationMapper());

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
  const lawyer = await lawyerverificationsRepo.findByUserId(lawyer_id);

  if (!lawyer) {
    res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "lawyer not found",
    });
    return;
  }
  if (lawyer.verificationStatus !== "verified") {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success: false,
      message: "Lawyer are not verified",
    });
    return;
  }
  next();
}
