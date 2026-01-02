"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePracticeAreaUsecase = void 0;
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class DeletePracticeAreaUsecase {
    practiceAreaRepo;
    constructor(practiceAreaRepo) {
        this.practiceAreaRepo = practiceAreaRepo;
    }
    async execute(input) {
        const exists = await this.practiceAreaRepo.findById(input);
        if (!exists)
            throw new CustomError_1.ValidationError("no practice area found");
        const delted = await this.practiceAreaRepo.delete(input);
        if (!delted)
            throw new Error("practice area delte error");
        return {
            id: exists.id,
            createdAt: exists.createdAt,
            name: exists.name,
            specializationId: exists.specializationId,
            updatedAt: exists.udpatedAt,
        };
    }
}
exports.DeletePracticeAreaUsecase = DeletePracticeAreaUsecase;
