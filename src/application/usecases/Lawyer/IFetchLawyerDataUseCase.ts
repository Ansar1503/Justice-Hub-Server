import { LawyerOutputDto } from "@src/application/dtos/Lawyer/VerifyLawyerDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchLawyerDataUseCase extends IUseCase<string,LawyerOutputDto>{}