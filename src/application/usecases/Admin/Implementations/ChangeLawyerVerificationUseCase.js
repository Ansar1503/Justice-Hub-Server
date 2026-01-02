"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeLawyerVerificationStatus = void 0;
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class ChangeLawyerVerificationStatus {
    UserRepo;
    _lawyerVerificationRepo;
    constructor(UserRepo, _lawyerVerificationRepo) {
        this.UserRepo = UserRepo;
        this._lawyerVerificationRepo = _lawyerVerificationRepo;
    }
    async execute(input) {
        const userDetails = await this.UserRepo.findByuser_id(input.user_id);
        if (!userDetails) {
            throw new CustomError_1.ValidationError("USER_NOT_FOUND");
        }
        if (userDetails.role !== "lawyer") {
            throw new CustomError_1.ValidationError("USER_NOT_LAWYER");
        }
        if (userDetails.is_blocked) {
            throw new CustomError_1.ValidationError("USER_BLOCKED");
        }
        const lawyerDetails = await this._lawyerVerificationRepo.findByUserId(input.user_id);
        if (!lawyerDetails) {
            throw new CustomError_1.ValidationError("NO_VERFICATION_RECORD");
        }
        if (lawyerDetails?.verificationStatus === "rejected") {
            throw new CustomError_1.ValidationError("VERIFICATION_REJECT");
        }
        if (lawyerDetails?.verificationStatus === "verified") {
            throw new CustomError_1.ValidationError("LAWYER_ALREADY_VERIFIED");
        }
        const updatedData = await this._lawyerVerificationRepo.update({
            id: lawyerDetails.id,
            verificationStatus: input.status,
            rejectReason: input.rejectReason,
            userId: input.user_id,
        });
        if (!updatedData)
            throw new CustomError_1.InternalError("Update Failed");
        return {
            status: updatedData.verificationStatus,
            user_id: updatedData.userId,
        };
    }
}
exports.ChangeLawyerVerificationStatus = ChangeLawyerVerificationStatus;
