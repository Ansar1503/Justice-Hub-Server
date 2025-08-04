import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { UpdateBasicInfoController } from "@interfaces/controller/Client/UpdateBasicInfo";

export function updateClientDataComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new UpdateBasicInfoController(usecase);
}
