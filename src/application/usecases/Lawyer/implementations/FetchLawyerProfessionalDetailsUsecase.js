"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyerProfessionalDetailsUsecase = void 0;
class FetchLawyerProfessionalDetailsUsecase {
    _lawyerRepo;
    constructor(_lawyerRepo) {
        this._lawyerRepo = _lawyerRepo;
    }
    async execute(input) {
        const details = await this._lawyerRepo.findUserId(input);
        if (!details)
            throw new Error("no lawyer details found");
        return details;
    }
}
exports.FetchLawyerProfessionalDetailsUsecase = FetchLawyerProfessionalDetailsUsecase;
