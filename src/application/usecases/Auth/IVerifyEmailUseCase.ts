import { VerifyEmailInput } from "@src/application/dtos/Auth/VerifyEmailDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IVerifyEmailUseCase extends IUseCase<VerifyEmailInput,void>{}