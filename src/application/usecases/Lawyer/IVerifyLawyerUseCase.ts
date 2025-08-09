import { LawyerVerificationInputDto, LawyerOutputDto } from "@src/application/dtos/Lawyer/VerifyLawyerDto";
import { IUseCase } from "../I_usecases/IUseCase";
// import { LawyerVerificationDto } from "@src/application/dtos/Lawyer/VerifyLawyerDto";

export interface IVerifyLawyerUseCase
  extends IUseCase<LawyerVerificationInputDto, LawyerOutputDto> {}
