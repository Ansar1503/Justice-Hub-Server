"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePracticeAreasUsecase = void 0;
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class UpdatePracticeAreasUsecase {
    practiceAreasRepo;
    constructor(practiceAreasRepo) {
        this.practiceAreasRepo = practiceAreasRepo;
    }
    async execute(input) {
        const existing = await this.practiceAreasRepo.findById(input.id);
        if (!existing)
            throw new CustomError_1.ValidationError("no practice area found");
        const existingname = await this.practiceAreasRepo.findByName(input.name);
        if (existingname?.name) {
            throw new CustomError_1.ValidationError("practice already exists with the name " + existingname.name);
        }
        existing.updateName(input.name);
        existing.updateSpecialisation(input.specId);
        const updated = await this.practiceAreasRepo.update(existing.id, existing.name, existing.specializationId);
        if (!updated)
            throw new Error("Practice Area Update Failed!");
        return {
            createdAt: updated.createdAt,
            id: updated.id,
            name: updated.name,
            specializationId: updated.specializationId,
            updatedAt: updated.udpatedAt,
        };
    }
}
exports.UpdatePracticeAreasUsecase = UpdatePracticeAreasUsecase;
