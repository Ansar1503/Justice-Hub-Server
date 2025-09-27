import {
    FetchSpecializationInputDto,
    FetchSpecializationOutputDto,
} from "@src/application/dtos/Specializations/FetchSpecializationDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchAllSpecializationsUsecase
    extends IUseCase<FetchSpecializationInputDto, FetchSpecializationOutputDto> {}
