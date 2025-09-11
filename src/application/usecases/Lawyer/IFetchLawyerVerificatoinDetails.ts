import { lawyerVerificationDetails } from "@src/application/dtos/Lawyer/LawyerVerificationDetailsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchLawyerVerificationDetailsUsecase
  extends IUseCase<string, lawyerVerificationDetails> {}
