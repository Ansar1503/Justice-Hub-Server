import { VerifyEmailController } from "@interfaces/controller/Auth/VerifyEmailController";
import { OtpRepository } from "@infrastructure/database/repo/OtpRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { IController } from "@interfaces/controller/Interface/IController";
import { VerifyEmailUseCase } from "@src/application/usecases/Auth/implementation/VerifyEmailUseCase";
import { JwtProvider } from "@infrastructure/Providers/JwtProvider";

export function VerifyEmailComposer(): IController {
  const userrepo = new UserRepository();
  const otprepo = new OtpRepository();
  const jwtManager = new JwtProvider();
  const usecase = new VerifyEmailUseCase(userrepo, otprepo, jwtManager);
  const controller = new VerifyEmailController(usecase);
  return controller;
}
