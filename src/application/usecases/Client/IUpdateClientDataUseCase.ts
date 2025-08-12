import { UpdateBasicInfoInputDto } from "@src/application/dtos/client/UpdateBasicInfoDto";
import { IUseCase } from "../IUseCases/IUseCase";
import { ClientUpdateDto } from "@src/application/dtos/client.dto";

export interface IUpdateClientDataUseCase
  extends IUseCase<UpdateBasicInfoInputDto, ClientUpdateDto> {}
