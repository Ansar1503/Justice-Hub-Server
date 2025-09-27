import { FetchCallLogsInputDto, FetchCallLogsOutputDto } from "@src/application/dtos/Lawyer/FetchCallLogsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchCallLogsUseCase extends IUseCase<FetchCallLogsInputDto, FetchCallLogsOutputDto> {}
