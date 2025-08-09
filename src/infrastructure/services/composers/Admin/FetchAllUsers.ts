import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { UserMapper } from "@infrastructure/Mapper/Implementations/UserMapper";
import { FetchALLUsers } from "@interfaces/controller/Admin/FetchUsers";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchUsersUseCase } from "@src/application/usecases/Admin/Implementations/FetchUsersUseCase";

export function FetchAllUserComposer(): IController {
  const mapper = new UserMapper();
  const repo = new UserRepository(mapper);
  const usecase = new FetchUsersUseCase(repo);
  return new FetchALLUsers(usecase);
}
