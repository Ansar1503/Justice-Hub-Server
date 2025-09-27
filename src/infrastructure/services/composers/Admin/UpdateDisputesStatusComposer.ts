import { DisputesRepo } from "@infrastructure/database/repo/DisputesRepo";
import { ChangeDisputesStatusController } from "@interfaces/controller/Admin/ChangeDisputesStatus";
import { IController } from "@interfaces/controller/Interface/IController";
import { UpdateDisputesStatusUseCase } from "@src/application/usecases/Admin/Implementations/UpdateDisputesStatusUseCase";

export function UpdateDisputesStatusComposer(): IController {
    const usecase = new UpdateDisputesStatusUseCase(new DisputesRepo());
    return new ChangeDisputesStatusController(usecase);
}
