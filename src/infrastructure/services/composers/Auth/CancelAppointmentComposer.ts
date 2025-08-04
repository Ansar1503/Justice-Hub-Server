import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "../Client/clientusecasecomposer";
import { CancelAppointmentController } from "@interfaces/controller/Client/CancelAppoitmentController";

export function CancelAppointmentComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new CancelAppointmentController(usecase);
}
