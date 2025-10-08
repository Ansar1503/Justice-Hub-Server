import { IController } from "@interfaces/controller/Interface/IController";
import { EndSessionController } from "@interfaces/controller/Lawyer/Sessions/EndSessionController";
import { EndSessionUseCase } from "@src/application/usecases/Lawyer/implementations/EndSessionUseCase";
import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";

export function EndSessionComposer(): IController {
  const usecase = new EndSessionUseCase(new MongoUnitofWork());
  return new EndSessionController(usecase);
}
