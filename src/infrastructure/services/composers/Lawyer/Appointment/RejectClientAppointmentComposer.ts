import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { RejectClientAppointmentController } from "@interfaces/controller/Lawyer/Appointments/RejectClientAppoinment";

export function RejectClientAppointmentComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new RejectClientAppointmentController(usecase);
}
