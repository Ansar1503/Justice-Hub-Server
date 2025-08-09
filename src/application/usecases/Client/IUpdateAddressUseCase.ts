import { AddressInputDto } from "@src/application/dtos/AdressDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IUpdateAddressUseCase extends IUseCase<AddressInputDto,void>{}