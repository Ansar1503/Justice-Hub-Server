import {
  FetchAppointmentsInputDto,
  FetchAppointmentsOutputDto,
} from "@src/application/dtos/Admin/FetchAppointmentsDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchAppointmentsUseCase
  extends IUseCase<FetchAppointmentsInputDto, FetchAppointmentsOutputDto> {}
