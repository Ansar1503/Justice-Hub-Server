import { VerifyEmailByOtpInput } from "@src/application/dtos/Auth/VerifyEmailDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IVerifyEmailByOtp
  extends IUseCase<VerifyEmailByOtpInput, void> {}
