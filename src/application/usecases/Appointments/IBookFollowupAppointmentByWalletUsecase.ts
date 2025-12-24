import { Appointment } from "@src/application/dtos/Appointments/BaseAppointmentDto";
import { CreateFollowupCheckoutSessionInputDto } from "@src/application/dtos/client/CreateCheckoutSessionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IBookFollowupAppointmentByWalletUsecase
  extends IUseCase<CreateFollowupCheckoutSessionInputDto, Appointment> {}
