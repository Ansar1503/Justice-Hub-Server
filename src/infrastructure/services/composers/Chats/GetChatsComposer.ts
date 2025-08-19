import { ChatMessageRepository } from "@infrastructure/database/repo/ChatMessageRepo";
import { ChatSessionRepository } from "@infrastructure/database/repo/ChatSessionRepo";
import { DisputesRepo } from "@infrastructure/database/repo/DisputesRepo";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { GetChatsController } from "@interfaces/controller/Chats/GetChatscontroller";
import { IController } from "@interfaces/controller/Interface/IController";
import { ChatUseCase } from "@src/application/usecases/chat.usecase";

export function GetChatsComposer(): IController {
  const usecase = new ChatUseCase(
    new ChatSessionRepository(),
    new ChatMessageRepository(),
    new SessionsRepository(),
    new DisputesRepo()
  );
  return new GetChatsController(usecase);
}
