import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { JwtProvider } from "@infrastructure/Providers/JwtProvider";
import { PasswordManager } from "@infrastructure/Providers/PasswordHasher";
import { ResetPasswordController } from "@interfaces/controller/Auth/ResetPasswordController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { ResetPasswordUsecase } from "@src/application/usecases/Auth/implementation/ResetPasswordUsecase";

export function ResetPasswordComposer() {
  const usecase = new ResetPasswordUsecase(
    new UserRepository(),
    new JwtProvider(),
    new PasswordManager()
  );
  return new ResetPasswordController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
