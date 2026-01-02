"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCasetypeUsecase = void 0;
class DeleteCasetypeUsecase {
    casetypeRepo;
    constructor(casetypeRepo) {
        this.casetypeRepo = casetypeRepo;
    }
    async execute(input) {
        const casetypeExists = await this.casetypeRepo.findById(input);
        if (!casetypeExists)
            throw new Error("case type doesnot exists");
        await this.casetypeRepo.delete(input);
        return {
            createdAt: casetypeExists.createdAt,
            id: casetypeExists.id,
            name: casetypeExists.name,
            practiceareaId: casetypeExists.practiceareaId,
            updatedAt: casetypeExists.updatedAt,
        };
    }
}
exports.DeleteCasetypeUsecase = DeleteCasetypeUsecase;
