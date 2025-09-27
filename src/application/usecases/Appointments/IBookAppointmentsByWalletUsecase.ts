import { CreateCheckoutSessionInputDto } from "@src/application/dtos/client/CreateCheckoutSessionDto";
import { Appointment } from "@src/application/dtos/Appointments/BaseAppointmentDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IBookAppointmentsByWalletUsecase extends IUseCase<CreateCheckoutSessionInputDto, Appointment> {}
