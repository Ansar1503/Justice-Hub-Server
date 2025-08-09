import { IController } from "@interfaces/controller/Interface/IController";
import { UpdateEmailController } from "@interfaces/controller/Client/profile/UpdateMailController";
import { ChangeMailUseCase } from "@src/application/usecases/Client/implementations/ChangeMailUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { NodeMailerProvider } from "@infrastructure/Providers/NodeMailerProvider";
import { JwtProvider } from "@infrastructure/Providers/JwtProvider";

export function UpdateEmailComposer(): IController {
  const usecase = new ChangeMailUseCase(
    new UserRepository(),
    new NodeMailerProvider(),
    new JwtProvider()
  );
  return new UpdateEmailController(usecase);
}
