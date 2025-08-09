import { IUseCase } from "../I_usecases/IUseCase";

export interface IHandleStripeHookUseCase
  extends IUseCase<{ body: any; signature: string | string[] }, void> {}
