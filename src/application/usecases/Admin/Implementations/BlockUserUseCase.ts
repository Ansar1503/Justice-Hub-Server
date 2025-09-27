import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IBlockUserUseCase } from "../IBlockUserUseCase";
import {
    InternalError,
    ValidationError,
} from "@interfaces/middelwares/Error/CustomError";

export class BlockUserUseCase implements IBlockUserUseCase {
    constructor(private userRepo: IUserRepository) {}
    async execute(input: {
    user_id: string;
    status: boolean;
  }): Promise<{ status: boolean; role: "lawyer" | "client" }> {
        const userDetails = await this.userRepo.findByuser_id(input.user_id);

        if (!userDetails) {
            throw new ValidationError("USER_NOT_FOUND");
        }
        if (input.status) {
            userDetails.block();
        } else {
            userDetails.unblock();
        }
        const updateData = await this.userRepo.update(userDetails);
        if (!updateData) throw new InternalError("user update error");
        return {
            status: updateData.is_blocked,
            role: updateData.role as "lawyer" | "client",
        };
    }
}
