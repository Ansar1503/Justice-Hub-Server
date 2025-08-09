import { ClientRepository } from "@infrastructure/database/repo/ClientRepo";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { OtpRepository } from "@infrastructure/database/repo/OtpRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { JwtProvider } from "@infrastructure/Providers/JwtProvider";
import { NodeMailerProvider } from "@infrastructure/Providers/NodeMailerProvider";
import { PasswordManager } from "@infrastructure/Providers/PasswordHasher";
import { RegisterUser } from "@interfaces/controller/Auth/RegisterUser";
import { IController } from "@interfaces/controller/Interface/IController";
import { RegisterUserUseCase } from "@src/application/usecases/Auth/implementation/RegisterUserUseCase";

export function RegisterUserComponser(): IController {
  const userrepo = new UserRepository();
  const otprepo = new OtpRepository();
  const clientrepo = new ClientRepository();
  const lawyerRepo = new LawyerRepository();
  const passwordHasher = new PasswordManager();
  const nodeMailerProvider = new NodeMailerProvider();
  const jwtProvider = new JwtProvider();
  const usecase = new RegisterUserUseCase(
    userrepo,
    clientrepo,
    lawyerRepo,
    otprepo,
    passwordHasher,
    nodeMailerProvider,
    jwtProvider
  );
  const controller = new RegisterUser(usecase);
  return controller;
}
