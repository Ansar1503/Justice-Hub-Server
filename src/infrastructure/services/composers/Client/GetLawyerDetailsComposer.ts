import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { GetLawyerDetailController } from "@interfaces/controller/Client/GetLawyerDetailsController";

export function GetLawyerDetailComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new GetLawyerDetailController(usecase);
}
