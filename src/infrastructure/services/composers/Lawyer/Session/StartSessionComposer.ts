import { IController } from "@interfaces/controller/Interface/IController";
import { StartSessionController } from "@interfaces/controller/Lawyer/Sessions/StartSessionController";
import { StartSessionUseCase } from "@src/application/usecases/Lawyer/implementations/StartSessionUseCase";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { CallLogsRepository } from "@infrastructure/database/repo/CallLogsRepo";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";

export function StartSessionComposer(): IController {
  const usecase = new StartSessionUseCase(
    new SessionsRepository(),
    new CallLogsRepository(),
    new AppointmentsRepository(),
    new MongoUnitofWork()
  );
  return new StartSessionController(usecase);
}
