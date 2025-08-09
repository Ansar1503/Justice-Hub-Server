import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { CancelAppointmentController } from "@interfaces/controller/Client/Appointment/CancelAppoitmentController";
import { IController } from "@interfaces/controller/Interface/IController";
import { CancelAppointmentUseCase } from "@src/application/usecases/Client/implementations/CancelAppointmentUseCase";

export function CancelAppointmentComposer(): IController {
  const useCase = new CancelAppointmentUseCase(new AppointmentsRepository());
  return new CancelAppointmentController(useCase)
}
