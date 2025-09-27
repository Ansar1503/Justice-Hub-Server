import { IController } from "@interfaces/controller/Interface/IController";
import { UpdatePasswordController } from "@interfaces/controller/Client/profile/UpdatePassword";
import { UpdatePasswordUseCase } from "@src/application/usecases/Client/implementations/UpdatePasswordUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { ClientRepository } from "@infrastructure/database/repo/ClientRepo";
import { PasswordManager } from "@infrastructure/Providers/PasswordHasher";

export function UpdatePasswordComposer(): IController {
    const usecase = new UpdatePasswordUseCase(
        new UserRepository(),
        new ClientRepository(),
        new PasswordManager()
    );
    return new UpdatePasswordController(usecase);
}
