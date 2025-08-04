import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { FetchAppointmentsController } from "@interfaces/controller/Lawyer/Appointments/FetchAppointmentsController";

export function FetchAppointmentsComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new FetchAppointmentsController(usecase);
}
