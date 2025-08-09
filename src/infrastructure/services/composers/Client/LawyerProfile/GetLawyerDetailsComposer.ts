import { IController } from "@interfaces/controller/Interface/IController";
import { GetLawyerDetailController } from "@interfaces/controller/Client/GetLawyerDetailsController";
import { GetLawyerDetailsUseCase } from "@src/application/usecases/Client/implementations/GetLawyerDetailsUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { ClientRepository } from "@infrastructure/database/repo/ClientRepo";
import { AddressRepository } from "@infrastructure/database/repo/AddressRepo";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";

export function GetLawyerDetailComposer(): IController {
  const usecase = new GetLawyerDetailsUseCase(
    new UserRepository(),
    new ClientRepository(),
    new AddressRepository(),
    new LawyerRepository()
  );
  return new GetLawyerDetailController(usecase);
}
