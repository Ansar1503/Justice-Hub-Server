import { ChatMessageRepository } from "@infrastructure/database/repo/ChatMessageRepo";
import { ChatSessionRepository } from "@infrastructure/database/repo/ChatSessionRepo";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { GetMessages } from "@interfaces/controller/Chats/GetMessages";
import { IController } from "@interfaces/controller/Interface/IController";
import { ChatUseCase } from "@src/application/usecases/chat.usecase";

export function GetMessagesComposer(): IController {
  const usecase = new ChatUseCase(
    new ChatSessionRepository(),
    new ChatMessageRepository(),
    new SessionsRepository()
  );
  return new GetMessages(usecase);
}
