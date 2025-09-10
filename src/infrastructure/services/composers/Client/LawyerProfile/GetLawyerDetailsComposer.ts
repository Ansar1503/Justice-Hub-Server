import { IController } from "@interfaces/controller/Interface/IController";
import { GetLawyerDetailController } from "@interfaces/controller/Client/GetLawyerDetailsController";
import { GetLawyerDetailsUseCase } from "@src/application/usecases/Client/implementations/GetLawyerDetailsUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { ClientRepository } from "@infrastructure/database/repo/ClientRepo";
import { AddressRepository } from "@infrastructure/database/repo/AddressRepo";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { LawyerVerificationRepo } from "@infrastructure/database/repo/LawyerVerificationRepo";
import { LawyerVerificationMapper } from "@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper";

export function GetLawyerDetailComposer(): IController {
  const usecase = new GetLawyerDetailsUseCase(
    new UserRepository(),
    new ClientRepository(),
    new AddressRepository(),
    new LawyerRepository(),
    new LawyerVerificationRepo(new LawyerVerificationMapper())
  );
  return new GetLawyerDetailController(usecase);
}
