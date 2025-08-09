import { IController } from "@interfaces/controller/Interface/IController";
import { GetLawyersController } from "@interfaces/controller/Client/GetLawyersController";
import { GetLawyersUseCase } from "@src/application/usecases/Client/implementations/GetLawyersUseCase";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";

export function GetLawyersComposer(): IController {
  const usecase = new GetLawyersUseCase(new LawyerRepository())
  return new GetLawyersController(usecase);
}
