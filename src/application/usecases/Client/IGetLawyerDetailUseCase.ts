import { LawyerResponseDto } from "@src/application/dtos/lawyer.dto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IGetLawyerDetailUseCase extends IUseCase<string, LawyerResponseDto | null> {}
