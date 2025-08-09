import {
  ChangeAppointmentStatusInputDto,
  ChangeAppointmentStatusOutputDto,
} from "@src/application/dtos/Lawyer/ChangeAppointmentStatusDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface ICancelAppointmentUseCase
  extends IUseCase<
    ChangeAppointmentStatusInputDto,
    ChangeAppointmentStatusOutputDto
  > {}
