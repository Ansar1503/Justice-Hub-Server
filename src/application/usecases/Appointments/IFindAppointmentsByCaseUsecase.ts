import { Appointment } from "@src/application/dtos/Appointments/BaseAppointmentDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFindAppointmentsByCaseUsecase extends IUseCase<string, Appointment[] | []> {}
