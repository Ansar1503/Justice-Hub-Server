import { JoinVideoSessionController } from "@interfaces/controller/Client/JoinVideoSessionController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { IController } from "@interfaces/controller/Interface/IController";

export function JoinVideoSessionComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new JoinVideoSessionController(usecase);
}
