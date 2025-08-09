import { IChangeLawyerVerificationStatus } from "../IChangeLawyerVerificationStatus";
import { ChangeLawyerVerificationInnOutDto } from "../../../dtos/Admin/ChangeLawyerVerificationDto";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import {
  InternalError,
  ValidationError,
} from "@interfaces/middelwares/Error/CustomError";

export class ChangeLawyerVerificationStatus
  implements IChangeLawyerVerificationStatus
{
  constructor(
    private UserRepo: IUserRepository,
    private LawyerRepo: ILawyerRepository
  ) {}

  async execute(
    input: ChangeLawyerVerificationInnOutDto
  ): Promise<ChangeLawyerVerificationInnOutDto> {
    console.log("input for changeing", input);
    const userDetails = await this.UserRepo.findByuser_id(input.user_id);
    if (!userDetails) {
      throw new ValidationError("USER_NOT_FOUND");
    }
    if (userDetails.role !== "lawyer") {
      throw new ValidationError("USER_NOT_LAWYER");
    }
    if (userDetails.is_blocked) {
      throw new ValidationError("USER_BLOCKED");
    }
    const lawyerDetails = await this.LawyerRepo.findUserId(input.user_id);
    if (!lawyerDetails) {
      throw new ValidationError("NO_VERFICATION_RECORD");
    }
    if (lawyerDetails?.verification_status === "rejected") {
      throw new ValidationError("VERIFICATION_REJECT");
    }
    if (lawyerDetails?.verification_status === "verified") {
      throw new ValidationError("LAWYER_ALREADY_VERIFIED");
    }
    if (input.status === "verified") {
      lawyerDetails.verify();
    } else if (input.status === "rejected") {
      lawyerDetails.reject(input.rejectReason || "");
    }

    const updatedData = await this.LawyerRepo.update({
      verification_status: input.status,
      rejectReason: input.rejectReason,
      user_id: input.user_id,
    });
    if (!updatedData) throw new InternalError("Update Failed");
    return {
      status: updatedData.verification_status,
      user_id: updatedData.user_id,
    };
  }
}
