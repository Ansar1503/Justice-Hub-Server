"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyersUseCase = void 0;
class FetchLawyersUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(input) {
        try {
            const response = await this.userRepo.findLawyersByQuery(input);
            return response;
        }
        catch (error) {
            throw new Error("Database Error");
        }
    }
}
exports.FetchLawyersUseCase = FetchLawyersUseCase;
