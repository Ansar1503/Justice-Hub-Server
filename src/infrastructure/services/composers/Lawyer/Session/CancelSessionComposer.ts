import { IController } from "@interfaces/controller/Interface/IController";
import { CancelSessionController } from "@interfaces/controller/Lawyer/Sessions/CancelSessionController";
import { CancelSessionUseCase } from "@src/application/usecases/Lawyer/implementations/CancelSessionUseCase";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";

export function CancelSessionComposer(): IController {
    const usecase = new CancelSessionUseCase(
        new SessionsRepository(),
        new AppointmentsRepository(),
        new MongoUnitofWork(),
    );
    return new CancelSessionController(usecase);
}
