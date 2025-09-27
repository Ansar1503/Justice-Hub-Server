import { CreateCheckoutSessionInputDto } from "@src/application/dtos/client/CreateCheckoutSessionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface ICreateCheckoutSessionUseCase extends IUseCase<CreateCheckoutSessionInputDto, any> {}
