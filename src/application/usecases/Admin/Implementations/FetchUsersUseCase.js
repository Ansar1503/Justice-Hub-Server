"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchUsersUseCase = void 0;
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class FetchUsersUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(input) {
        try {
            const users = await this.userRepo.findAll(input);
            return users;
        }
        catch (error) {
            throw new CustomError_1.InternalError("Database Error");
        }
    }
}
exports.FetchUsersUseCase = FetchUsersUseCase;
