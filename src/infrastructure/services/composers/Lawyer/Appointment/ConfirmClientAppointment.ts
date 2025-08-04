import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { ConfirmClientAppointment } from "@interfaces/controller/Lawyer/Appointments/ConfirmClientAppointmentController";

export function ConfirmClientAppointmentComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new ConfirmClientAppointment(usecase);
}
