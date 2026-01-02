"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSpecializationUsecase = void 0;
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class DeleteSpecializationUsecase {
    specializationRepo;
    practiceAreaRepo;
    constructor(specializationRepo, practiceAreaRepo) {
        this.specializationRepo = specializationRepo;
        this.practiceAreaRepo = practiceAreaRepo;
    }
    async execute(input) {
        const exists = await this.specializationRepo.findById(input);
        if (!exists)
            throw new CustomError_1.ValidationError("specialization doesnt exist");
        const deleted = await this.specializationRepo.delete(input);
        if (!deleted)
            throw new CustomError_1.ValidationError("specialization delete error");
        await this.practiceAreaRepo.deleteBySpec(deleted.id);
        return {
            createdAt: deleted.createdAt,
            id: deleted.id,
            name: deleted.name,
            updatedAt: deleted.updatedAt,
        };
    }
}
exports.DeleteSpecializationUsecase = DeleteSpecializationUsecase;
