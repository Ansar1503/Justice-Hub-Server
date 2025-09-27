import { IController } from "@interfaces/controller/Interface/IController";
import { RemoveFailedSessionController } from "@interfaces/controller/Client/Sessions/RemoveFailedSessionController";
import { GetSessionMetadataUseCase } from "@src/application/usecases/Client/implementations/GetSessionMetadataUseCase";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";

export function RemoveFailedSessionComposer(): IController {
    const usecase = new GetSessionMetadataUseCase(new AppointmentsRepository());
    return new RemoveFailedSessionController(usecase);
}
