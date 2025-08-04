import { UserRepository } from "@infrastructure/database/repo/user.repo";
import { UserMapper } from "@infrastructure/Mapper/Implementations/UserMapper";
import { FetchAllLawyers } from "@interfaces/controller/Admin/FetchAllLawyers";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchLawyersUseCase } from "@src/application/usecases/Admin/Implementations/FetchLawyersUseCase";

export function FetchAllLawyersComposer(): IController {
  const mapper = new UserMapper();
  const repo = new UserRepository(mapper);
  const useCase = new FetchLawyersUseCase(repo);
  const controller = new FetchAllLawyers(useCase);
  return controller;
}
