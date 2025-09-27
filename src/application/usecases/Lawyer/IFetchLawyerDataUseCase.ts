import { LawyerOutputDto } from "@src/application/dtos/Lawyer/VerifyLawyerDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchLawyerDataUseCase extends IUseCase<string, LawyerOutputDto> {}
