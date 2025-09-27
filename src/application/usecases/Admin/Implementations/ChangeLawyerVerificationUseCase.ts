import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { InternalError, ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { ChangeLawyerVerificationInnOutDto } from "../../../dtos/Admin/ChangeLawyerVerificationDto";
import { IChangeLawyerVerificationStatus } from "../IChangeLawyerVerificationStatus";

export class ChangeLawyerVerificationStatus implements IChangeLawyerVerificationStatus {
    constructor(
        private UserRepo: IUserRepository,
        private _lawyerVerificationRepo: ILawyerVerificationRepo,
    ) {}

    async execute(input: ChangeLawyerVerificationInnOutDto): Promise<ChangeLawyerVerificationInnOutDto> {
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
        const lawyerDetails = await this._lawyerVerificationRepo.findByUserId(input.user_id);
        if (!lawyerDetails) {
            throw new ValidationError("NO_VERFICATION_RECORD");
        }
        if (lawyerDetails?.verificationStatus === "rejected") {
            throw new ValidationError("VERIFICATION_REJECT");
        }
        if (lawyerDetails?.verificationStatus === "verified") {
            throw new ValidationError("LAWYER_ALREADY_VERIFIED");
        }
        const updatedData = await this._lawyerVerificationRepo.update({
            id: lawyerDetails.id,
            verificationStatus: input.status,
            rejectReason: input.rejectReason,
            userId: input.user_id,
        });
        if (!updatedData) throw new InternalError("Update Failed");
        return {
            status: updatedData.verificationStatus,
            user_id: updatedData.userId,
        };
    }
}
