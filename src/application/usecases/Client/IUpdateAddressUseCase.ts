import { AddressInputDto } from "@src/application/dtos/AdressDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IUpdateAddressUseCase extends IUseCase<AddressInputDto, void> {}
