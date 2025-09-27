import { UseCaseInputDto, UseCaseOutputDto } from "@src/application/dtos/Admin/FetchLawyersDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchLawyerUseCase extends IUseCase<UseCaseInputDto, UseCaseOutputDto> {}
