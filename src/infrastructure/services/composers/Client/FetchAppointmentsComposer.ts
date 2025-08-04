import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { FetchAppointmentDataController } from "@interfaces/controller/Client/FetchAppointmentDataController";

export function FetchAppointmentDataComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new FetchAppointmentDataController(usecase)
}
