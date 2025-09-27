import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { UseCaseInputDto, UseCaseOutputDto } from "../../../dtos/Admin/FetchLawyersDto";
import { IFetchLawyerUseCase } from "../IFetchLawyersUseCase";

export class FetchLawyersUseCase implements IFetchLawyerUseCase {
    constructor(private userRepo: IUserRepository) {}
    async execute(input: UseCaseInputDto): Promise<UseCaseOutputDto> {
        try {
            const response = await this.userRepo.findLawyersByQuery(input);
            return response;
        } catch (error) {
            throw new Error("Database Error");
        }
    }
}
