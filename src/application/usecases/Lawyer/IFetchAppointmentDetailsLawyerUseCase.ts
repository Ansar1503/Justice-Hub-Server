import {
  FetchAppointmentInputDto,
  FetchAppointmentsOutputDto,
} from "@src/application/dtos/Lawyer/FetchAppointmentDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchAppointmentDetailsLawyerUseCase
  extends IUseCase<FetchAppointmentInputDto, FetchAppointmentsOutputDto> {}
