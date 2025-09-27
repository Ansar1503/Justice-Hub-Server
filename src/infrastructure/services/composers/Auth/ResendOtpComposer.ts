import { OtpRepository } from "@infrastructure/database/repo/OtpRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { JwtProvider } from "@infrastructure/Providers/JwtProvider";
import { NodeMailerProvider } from "@infrastructure/Providers/NodeMailerProvider";
import { ResendOtpController } from "@interfaces/controller/Auth/ResendOtp";
import { IController } from "@interfaces/controller/Interface/IController";
import { ResendOtpUseCase } from "@src/application/usecases/Auth/implementation/ResendOtpUseCase";

export function ResendOtpComposer(): IController {
    const userrepo = new UserRepository();
    const otprepo = new OtpRepository();
    const emailProvider = new NodeMailerProvider();
    const tokentProvider = new JwtProvider();
    const usecase = new ResendOtpUseCase(userrepo, otprepo, emailProvider, tokentProvider);
    const controller = new ResendOtpController(usecase);
    return controller;
}
