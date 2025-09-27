import { VerifyEmailInput } from "@src/application/dtos/Auth/VerifyEmailDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IVerifyEmailUseCase extends IUseCase<VerifyEmailInput, void> {}
