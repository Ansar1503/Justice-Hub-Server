import { UseCaseInputDto, UseCaseOutputDto } from "@src/application/dtos/Admin/FetchAllUsersDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchUsersUseCase extends IUseCase<UseCaseInputDto, UseCaseOutputDto> {
    execute(input: UseCaseInputDto): Promise<UseCaseOutputDto>;
}
