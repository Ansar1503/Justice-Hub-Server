import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { InternalError, ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { IBlockUserUseCase } from "../IBlockUserUseCase";

export class BlockUserUseCase implements IBlockUserUseCase {
    constructor(private _userRepo: IUserRepository) {}
    async execute(input: {
        user_id: string;
        status: boolean;
    }): Promise<{ status: boolean; role: "lawyer" | "client" }> {
        const userDetails = await this._userRepo.findByuser_id(input.user_id);

        if (!userDetails) {
            throw new ValidationError("USER_NOT_FOUND");
        }
        if (input.status) {
            userDetails.block();
        } else {
            userDetails.unblock();
        }
        const updateData = await this._userRepo.update(userDetails);
        if (!updateData) throw new InternalError("user update error");
        return {
            status: updateData.is_blocked,
            role: updateData.role as "lawyer" | "client",
        };
    }
}
