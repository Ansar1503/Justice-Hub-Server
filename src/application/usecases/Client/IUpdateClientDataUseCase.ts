import { UpdateBasicInfoInputDto } from "@src/application/dtos/client/UpdateBasicInfoDto";
import { ClientUpdateDto } from "@src/application/dtos/client.dto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IUpdateClientDataUseCase extends IUseCase<UpdateBasicInfoInputDto, ClientUpdateDto> {}
