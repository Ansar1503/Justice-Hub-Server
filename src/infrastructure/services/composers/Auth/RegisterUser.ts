import { ClientRepository } from "@infrastructure/database/repo/client.repo";
import { LawyerRepository } from "@infrastructure/database/repo/lawyer.repo";
import { OtpRepository } from "@infrastructure/database/repo/otp.repo";
import { UserRepository } from "@infrastructure/database/repo/user.repo";
import { LawyerMapper } from "@infrastructure/Mapper/Implementations/LawyerMapper";
import { UserMapper } from "@infrastructure/Mapper/Implementations/UserMapper";
import { RegisterUser } from "@interfaces/controller/Auth/RegisterUser";
import { IController } from "@interfaces/controller/Interface/IController";
import { UserUseCase } from "@src/application/usecases/user.usecase";

export function RegisterUserComponser(): IController {
  const usermapper = new UserMapper();
  const lawyermapper = new LawyerMapper();
  const userrepo = new UserRepository(usermapper);
  const otprepo = new OtpRepository();
  const clientrepo = new ClientRepository();
  const lawyerRepo = new LawyerRepository(lawyermapper);
  const usecase = new UserUseCase(userrepo, otprepo, clientrepo, lawyerRepo);
  const controller = new RegisterUser(usecase);
  return controller;
}
