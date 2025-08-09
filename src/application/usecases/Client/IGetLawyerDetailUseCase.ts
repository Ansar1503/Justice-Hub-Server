import { LawyerResponseDto } from "@src/application/dtos/lawyer.dto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IGetLawyerDetailUseCase
  extends IUseCase<string, LawyerResponseDto | null> {}
