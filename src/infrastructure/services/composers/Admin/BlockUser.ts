import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { UserMapper } from "@infrastructure/Mapper/Implementations/UserMapper";
import { BlockUser } from "@interfaces/controller/Admin/BlockUser";
import { IController } from "@interfaces/controller/Interface/IController";
import { BlockUserUseCase } from "@src/application/usecases/Admin/Implementations/BlockUserUseCase";

export function BlockUserComposer(): IController {
    const mapper = new UserMapper();
    const repo = new UserRepository(mapper);
    const usecase = new BlockUserUseCase(repo);
    const controller = new BlockUser(usecase);
    return controller;
}
