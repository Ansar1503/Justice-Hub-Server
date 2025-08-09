import { CreateCheckoutSessionInputDto } from "@src/application/dtos/client/CreateCheckoutSessionDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface ICreateCheckoutSessionUseCase
  extends IUseCase<CreateCheckoutSessionInputDto, any> {}
