import { UpdateAddressController } from "@interfaces/controller/Client/UpdateAddressController";
import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";

export function UpdateAddressComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new UpdateAddressController(usecase);
}
