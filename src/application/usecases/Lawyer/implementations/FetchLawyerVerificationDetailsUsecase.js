"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyerVerificationDetailsUsecase = void 0;
class FetchLawyerVerificationDetailsUsecase {
    _lawyerverificationRepo;
    constructor(_lawyerverificationRepo) {
        this._lawyerverificationRepo = _lawyerverificationRepo;
    }
    async execute(input) {
        const verificationData = await this._lawyerverificationRepo.findByUserId(input);
        if (!verificationData)
            throw new Error("verification data not found");
        return verificationData;
    }
}
exports.FetchLawyerVerificationDetailsUsecase = FetchLawyerVerificationDetailsUsecase;
