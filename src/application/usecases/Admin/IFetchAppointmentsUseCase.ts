import {
  FetchAppointmentsInputDto,
  FetchAppointmentsOutputDto,
} from "@src/application/dtos/Admin/FetchAppointmentsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchAppointmentsUseCase
  extends IUseCase<FetchAppointmentsInputDto, FetchAppointmentsOutputDto> {}
