import { IController } from "@interfaces/controller/Interface/IController";
import { EndSessionController } from "@interfaces/controller/Lawyer/Sessions/EndSessionController";
import { EndSessionUseCase } from "@src/application/usecases/Lawyer/implementations/EndSessionUseCase";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { CallLogsRepository } from "@infrastructure/database/repo/CallLogsRepo";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";

export function EndSessionComposer(): IController {
    const usecase = new EndSessionUseCase(
        new SessionsRepository(),
        new CallLogsRepository(),
        new AppointmentsRepository(),
    );
    return new EndSessionController(usecase);
}
