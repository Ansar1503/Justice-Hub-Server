import { IUseCase } from "../IUseCases/IUseCase";

export interface IHandleStripeHookUseCase extends IUseCase<{ body: any; signature: string | string[] }, void> {}
