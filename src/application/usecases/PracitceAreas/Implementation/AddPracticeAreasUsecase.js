"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPracticeAreaUsecase = void 0;
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
const PracticeArea_1 = require("@domain/entities/PracticeArea");
class AddPracticeAreaUsecase {
    practiceAreaRepo;
    specRepo;
    constructor(practiceAreaRepo, specRepo) {
        this.practiceAreaRepo = practiceAreaRepo;
        this.specRepo = specRepo;
    }
    async execute(input) {
        const exsits = await this.practiceAreaRepo.findByName(input.name);
        if (exsits?.name === input.name) {
            throw new CustomError_1.ValidationError("Name already exists");
        }
        const specExist = await this.specRepo.findById(input.specId);
        if (!specExist) {
            throw new CustomError_1.ValidationError("specification not found");
        }
        const newPractice = PracticeArea_1.PracticeArea.create({
            name: input.name,
            specializationId: input.specId,
        });
        const created = await this.practiceAreaRepo.create(newPractice);
        return {
            createdAt: created.createdAt,
            id: created.id,
            name: created.name,
            specializationId: created.specializationId,
            updatedAt: created.udpatedAt,
        };
    }
}
exports.AddPracticeAreaUsecase = AddPracticeAreaUsecase;
