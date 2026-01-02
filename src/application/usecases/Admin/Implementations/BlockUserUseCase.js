"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockUserUseCase = void 0;
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class BlockUserUseCase {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(input) {
        const userDetails = await this.userRepo.findByuser_id(input.user_id);
        if (!userDetails) {
            throw new CustomError_1.ValidationError("USER_NOT_FOUND");
        }
        if (input.status) {
            userDetails.block();
        }
        else {
            userDetails.unblock();
        }
        const updateData = await this.userRepo.update(userDetails);
        if (!updateData)
            throw new CustomError_1.InternalError("user update error");
        return {
            status: updateData.is_blocked,
            role: updateData.role,
        };
    }
}
exports.BlockUserUseCase = BlockUserUseCase;
