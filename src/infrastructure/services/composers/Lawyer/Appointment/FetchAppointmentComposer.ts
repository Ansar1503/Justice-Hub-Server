import { IController } from "@interfaces/controller/Interface/IController";
import { FetchAppointmentsController } from "@interfaces/controller/Lawyer/Appointments/FetchAppointmentsController";
import { FetchAppointmentsLawyerUseCase } from "@src/application/usecases/Lawyer/implementations/FetchAppointmentDetailsLawyerUseCase";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";

export function FetchAppointmentsComposer(): IController {
  const usecase = new FetchAppointmentsLawyerUseCase(
    new AppointmentsRepository()
  );
  return new FetchAppointmentsController(usecase);
}
