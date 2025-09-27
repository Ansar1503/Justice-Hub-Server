import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";
import { JwtProvider } from "@infrastructure/Providers/JwtProvider";
import { NodeMailerProvider } from "@infrastructure/Providers/NodeMailerProvider";
import { PasswordManager } from "@infrastructure/Providers/PasswordHasher";
import { RegisterUser } from "@interfaces/controller/Auth/RegisterUser";
import { IController } from "@interfaces/controller/Interface/IController";
import { RegisterUserUseCase } from "@src/application/usecases/Auth/implementation/RegisterUserUseCase";

export function RegisterUserComponser(): IController {
    const passwordHasher = new PasswordManager();
    const nodeMailerProvider = new NodeMailerProvider();
    const jwtProvider = new JwtProvider();
    const usecase = new RegisterUserUseCase(passwordHasher, nodeMailerProvider, jwtProvider, new MongoUnitofWork());
    const controller = new RegisterUser(usecase);
    return controller;
}
