import { CreateFollowupCheckoutSessionInputDto } from "@src/application/dtos/client/CreateCheckoutSessionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface ICreateFollowupCheckoutUsecase
  extends IUseCase<CreateFollowupCheckoutSessionInputDto, any> {}
