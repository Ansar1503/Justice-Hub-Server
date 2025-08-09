import { IController } from "@interfaces/controller/Interface/IController";
import { SendVerificationMailController } from "@interfaces/controller/Client/profile/SendVerificationMailController";
import { VerifyMailUseCase } from "@src/application/usecases/Client/implementations/VerifyMailUseCase";
import { NodeMailerProvider } from "@infrastructure/Providers/NodeMailerProvider";
import { JwtProvider } from "@infrastructure/Providers/JwtProvider";

export function SendVerificationMailComposer(): IController {
  const usecase = new VerifyMailUseCase(
    new NodeMailerProvider(),
    new JwtProvider()
  );
  return new SendVerificationMailController(usecase);
}
