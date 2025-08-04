import { AppointmentsRepository } from "@infrastructure/database/repo/appointments.repo";
import { FetchAppointments } from "@interfaces/controller/Admin/FetchAppointments";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchAppointmentsUseCase } from "@src/application/usecases/Admin/Implementations/FetchAppointmentsUseCase";

export function FetchAppointmentsComposer(): IController {
  const repo = new AppointmentsRepository();
  const useCase = new FetchAppointmentsUseCase(repo);
  const controller = new FetchAppointments(useCase);
  return controller;
}
