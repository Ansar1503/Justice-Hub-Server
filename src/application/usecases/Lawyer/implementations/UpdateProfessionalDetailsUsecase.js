"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfessionalDetailsUsecase = void 0;
const Lawyer_1 = require("@domain/entities/Lawyer");
class UpdateProfessionalDetailsUsecase {
    _lawyerProfessionRepo;
    constructor(_lawyerProfessionRepo) {
        this._lawyerProfessionRepo = _lawyerProfessionRepo;
    }
    async execute(input) {
        const professionalInfo = await this._lawyerProfessionRepo.findUserId(input.userId);
        const practiceAreas = input.practiceAreas.map((p) => p.id);
        const specialisation = input.specialisations.map((s) => s.id);
        if (!professionalInfo) {
            const lawyerPayload = Lawyer_1.Lawyer.create({
                consultationFee: input.consultationFee,
                description: input.description,
                experience: input.experience,
                practiceAreas: practiceAreas,
                specializations: specialisation,
                userId: input.userId,
            });
            await this._lawyerProfessionRepo.create(lawyerPayload);
        }
        else {
            await this._lawyerProfessionRepo.update({
                consultationFee: input.consultationFee,
                description: input.description,
                experience: input.experience,
                practiceAreas: practiceAreas,
                specializations: specialisation,
                updatedAt: new Date(),
                userId: input.userId,
            });
        }
        const data = await this._lawyerProfessionRepo.findUserId(input.userId);
        if (!data)
            throw new Error("adding professional details error");
        return data;
    }
}
exports.UpdateProfessionalDetailsUsecase = UpdateProfessionalDetailsUsecase;
