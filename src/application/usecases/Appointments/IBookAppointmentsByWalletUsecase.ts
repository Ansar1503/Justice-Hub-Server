import { CreateCheckoutSessionInputDto } from "@src/application/dtos/client/CreateCheckoutSessionDto";
import { IUseCase } from "../IUseCases/IUseCase";
import { Appointment } from "@src/application/dtos/Appointments/BaseAppointmentDto";

export interface IBookAppointmentsByWalletUsecase
  extends IUseCase<CreateCheckoutSessionInputDto, Appointment> {}
