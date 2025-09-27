import {
    UpdateDisputesStatusInputDto,
    UpdateDisputesStatusOutputDto,
} from "@src/application/dtos/Admin/UpdateDisputesStatusDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IUpdateDisputesStatusUseCase
    extends IUseCase<UpdateDisputesStatusInputDto, UpdateDisputesStatusOutputDto> {}
