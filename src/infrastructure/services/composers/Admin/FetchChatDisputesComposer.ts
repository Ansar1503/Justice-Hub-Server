import { DisputesRepo } from "@infrastructure/database/repo/DisputesRepo";
import { FetchChatDisputesController } from "@interfaces/controller/Admin/FetchChatDisputes";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchChatDisputesUseCase } from "@src/application/usecases/Admin/Implementations/FetchChatDisputesUseCase";

export function FetchChatDisputesComposer(): IController {
  const usecase = new FetchChatDisputesUseCase(new DisputesRepo());
  return new FetchChatDisputesController(usecase);
}
