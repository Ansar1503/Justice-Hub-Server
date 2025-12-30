import { OtpRepository } from "@infrastructure/database/repo/OtpRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { JwtProvider } from "@infrastructure/Providers/JwtProvider";
import { NodeMailerProvider } from "@infrastructure/Providers/NodeMailerProvider";
import { ForgotPasswordController } from "@interfaces/controller/Auth/ForgotPasswordController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { ForgotPasswordUsecase } from "@src/application/usecases/Auth/implementation/ForgotPasswordUsecase";

export function ForgotPasswordComposer(): IController {
  const usecase = new ForgotPasswordUsecase(
    new UserRepository(),
    new JwtProvider(),
    new NodeMailerProvider(),
    new OtpRepository()
  );
  return new ForgotPasswordController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
