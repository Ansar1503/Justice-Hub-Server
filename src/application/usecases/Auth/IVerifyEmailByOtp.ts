import { VerifyEmailByOtpInput } from "@src/application/dtos/Auth/VerifyEmailDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IVerifyEmailByOtp
  extends IUseCase<VerifyEmailByOtpInput, void> {}
