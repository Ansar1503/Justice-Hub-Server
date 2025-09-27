import { OtpRepository } from "@infrastructure/database/repo/OtpRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { VerifyEmailOtpController } from "@interfaces/controller/Auth/VerifyEmailOtpController";
import { IController } from "@interfaces/controller/Interface/IController";
import { VerifyEmailByOtpUseCase } from "@src/application/usecases/Auth/implementation/VerifyEmailByOtp";

export function VerifyEmailOtpComposer(): IController {
    const userrepo = new UserRepository();
    const otprepo = new OtpRepository();
    const usecase = new VerifyEmailByOtpUseCase(userrepo, otprepo);
    const controller = new VerifyEmailOtpController(usecase);
    return controller;
}
