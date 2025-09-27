import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { InternalError } from "@interfaces/middelwares/Error/CustomError";
import { IFetchUsersUseCase } from "../IFetchUsersUseCase";
import {
    UseCaseInputDto,
    UseCaseOutputDto,
} from "../../../dtos/Admin/FetchAllUsersDto";

export class FetchUsersUseCase implements IFetchUsersUseCase {
    constructor(private userRepo: IUserRepository) {}
    async execute(input: UseCaseInputDto): Promise<UseCaseOutputDto> {
        try {
            const users = await this.userRepo.findAll(input);
            return users;
        } catch (error) {
            throw new InternalError("Database Error");
        }
    }
}
