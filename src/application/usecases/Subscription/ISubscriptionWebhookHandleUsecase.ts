import { IUseCase } from "../IUseCases/IUseCase";

export interface ISubscriptionWebhookHanlderUsecase
  extends IUseCase<
    {
      rawBody: Buffer;
      signature: string;
    },
    void
  > {}
