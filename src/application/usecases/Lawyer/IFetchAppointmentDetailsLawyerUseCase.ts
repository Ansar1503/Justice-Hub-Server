import {
  FetchAppointmentInputDto,
  FetchAppointmentsOutputDto,
} from "@src/application/dtos/Lawyer/FetchAppointmentDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchAppointmentDetailsLawyerUseCase
  extends IUseCase<FetchAppointmentInputDto, FetchAppointmentsOutputDto> {}
