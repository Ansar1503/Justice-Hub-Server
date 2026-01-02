"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllSpecializationsUsecase = void 0;
class FetchAllSpecializationsUsecase {
    specializationRepo;
    constructor(specializationRepo) {
        this.specializationRepo = specializationRepo;
    }
    async execute(input) {
        const specializations = await this.specializationRepo.findAll(input);
        return {
            data: specializations.data
                ? specializations.data.map((sp) => ({
                    name: sp.name,
                    id: sp.id,
                    createdAt: sp.createdAt,
                    updatedAt: sp.updatedAt,
                }))
                : [],
            currentPage: specializations.currentPage,
            totalCount: specializations.totalCount,
            totalPage: specializations.totalPage,
        };
    }
}
exports.FetchAllSpecializationsUsecase = FetchAllSpecializationsUsecase;
