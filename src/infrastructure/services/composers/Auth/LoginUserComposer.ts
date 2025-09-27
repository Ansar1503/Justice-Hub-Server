import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { JwtProvider } from "@infrastructure/Providers/JwtProvider";
import { PasswordManager } from "@infrastructure/Providers/PasswordHasher";
import { LoginController } from "@interfaces/controller/Auth/Login";
import { IController } from "@interfaces/controller/Interface/IController";
import { LoginUserUseCase } from "@src/application/usecases/Auth/implementation/LoginUserUseCase";

export function LoginUserComposer(): IController {
    const userrepo = new UserRepository();
    const passwordManager = new PasswordManager();
    const tokenManager = new JwtProvider();
    const usecase = new LoginUserUseCase(userrepo, passwordManager, tokenManager);
    const controller = new LoginController(usecase);
    return controller;
}
