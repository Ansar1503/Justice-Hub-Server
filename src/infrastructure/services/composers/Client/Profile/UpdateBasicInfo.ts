import { IController } from "@interfaces/controller/Interface/IController";
import { UpdateBasicInfoController } from "@interfaces/controller/Client/profile/UpdateBasicInfo";
import { UpdateClientDataUseCase } from "@src/application/usecases/Client/implementations/UpdateClientDataUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { ClientRepository } from "@infrastructure/database/repo/ClientRepo";

export function updateClientDataComposer(): IController {
  const usecase = new UpdateClientDataUseCase(
    new UserRepository(),
    new ClientRepository()
  );
  return new UpdateBasicInfoController(usecase);
}
