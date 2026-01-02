"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllpracticeAreasUsecase = void 0;
class FindAllpracticeAreasUsecase {
    practiceAreaRepo;
    constructor(practiceAreaRepo) {
        this.practiceAreaRepo = practiceAreaRepo;
    }
    async execute(input) {
        return await this.practiceAreaRepo.findAll(input);
    }
}
exports.FindAllpracticeAreasUsecase = FindAllpracticeAreasUsecase;
