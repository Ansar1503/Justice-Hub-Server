import { FetchSessionOutputDto, FetchSessionsInputDto } from "@src/application/dtos/client/FetchSessionsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchSessionsUseCase extends IUseCase<FetchSessionsInputDto, FetchSessionOutputDto> {}
