import {
    ChangeAppointmentStatusInputDto,
    ChangeAppointmentStatusOutputDto,
} from "@src/application/dtos/Lawyer/ChangeAppointmentStatusDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IRejectAppointmentUseCase
  extends IUseCase<
    ChangeAppointmentStatusInputDto,
    ChangeAppointmentStatusOutputDto
  > {}
