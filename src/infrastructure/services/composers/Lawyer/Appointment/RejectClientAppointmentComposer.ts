import { IController } from "@interfaces/controller/Interface/IController";
import { RejectClientAppointmentController } from "@interfaces/controller/Lawyer/Appointments/RejectClientAppoinment";
import { RejectAppointmentUseCase } from "@src/application/usecases/Lawyer/implementations/RejectAppointmentUseCase";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";

export function RejectClientAppointmentComposer(): IController {
  const usecase = new RejectAppointmentUseCase(new AppointmentsRepository())
  return new RejectClientAppointmentController(usecase);
}
