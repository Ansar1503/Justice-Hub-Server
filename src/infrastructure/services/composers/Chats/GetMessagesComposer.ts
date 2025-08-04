import { ChatRepo } from "@infrastructure/database/repo/chat.repo";
import { SessionsRepository } from "@infrastructure/database/repo/sessions.repo";
import { GetMessages } from "@interfaces/controller/Chats/GetMessages";
import { IController } from "@interfaces/controller/Interface/IController";
import { ChatUseCase } from "@src/application/usecases/chat.usecase";

export function GetMessagesComposer():IController{
    const chatRepo = new ChatRepo()
    const sessionRepo = new SessionsRepository()
    const usecase = new ChatUseCase(chatRepo,sessionRepo)
    return new GetMessages(usecase)
}