"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSpecializationUsecase = void 0;
const Specialization_1 = require("@domain/entities/Specialization");
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class AddSpecializationUsecase {
    specializationRepo;
    constructor(specializationRepo) {
        this.specializationRepo = specializationRepo;
    }
    async execute(input) {
        if (!input.id?.trim()) {
            const exist = await this.specializationRepo.findByName(input.name);
            if (exist && exist.name == input.name) {
                throw new Error("Specialization Already exsits");
            }
            const newSpec = Specialization_1.Specialization.create({ name: input.name });
            const specialization = await this.specializationRepo.create(newSpec);
            return {
                createdAt: specialization.createdAt,
                id: specialization.id,
                name: specialization.name,
                updatedAt: specialization.updatedAt,
            };
        }
        const exist = await this.specializationRepo.findById(input.id);
        if (!exist)
            throw new CustomError_1.ValidationError("No spc found with the id");
        exist.updateName(input.name);
        const updated = await this.specializationRepo.updateName(exist.id, exist.name);
        return {
            createdAt: updated.createdAt,
            id: updated.id,
            name: updated.name,
            updatedAt: updated.updatedAt,
        };
    }
}
exports.AddSpecializationUsecase = AddSpecializationUsecase;
