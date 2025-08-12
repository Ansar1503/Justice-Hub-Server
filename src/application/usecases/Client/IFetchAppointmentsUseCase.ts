import {
  FetchAppointmentsInputDto,
  FetchAppointmentsOutputDto,
} from "@src/application/dtos/Admin/FetchAppointmentsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchAppointmentsClientUseCase
  extends IUseCase<FetchAppointmentsInputDto, FetchAppointmentsOutputDto> {}
