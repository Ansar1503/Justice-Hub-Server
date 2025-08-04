import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IBlockUserUseCase } from "../IBlockUserUseCase";
import {
  InternalError,
  ValidationError,
} from "@interfaces/middelwares/Error/CustomError";

export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(private userRepo: IUserRepository) {}
  async execute(input: string): Promise<{status:boolean}> {
    const userDetails = await this.userRepo.findByuser_id(input);

    if (!userDetails) {
      throw new ValidationError("USER_NOT_FOUND");
    }
    userDetails.block();
    const updateData = await this.userRepo.update(userDetails);
    if (!updateData) throw new InternalError("user update error");
    return {status:updateData.is_blocked};
  }
}
