"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetChatsComposer = GetChatsComposer;
const ChatMessageRepo_1 = require("@infrastructure/database/repo/ChatMessageRepo");
const ChatSessionRepo_1 = require("@infrastructure/database/repo/ChatSessionRepo");
const DisputesRepo_1 = require("@infrastructure/database/repo/DisputesRepo");
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const UserSubscriptionRepository_1 = require("@infrastructure/database/repo/UserSubscriptionRepository");
const UserSubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/UserSubscriptionMapper");
const GetChatscontroller_1 = require("@interfaces/controller/Chats/GetChatscontroller");
const chat_usecase_1 = require("@src/application/usecases/chat.usecase");
function GetChatsComposer() {
    const usecase = new chat_usecase_1.ChatUseCase(new ChatSessionRepo_1.ChatSessionRepository(), new ChatMessageRepo_1.ChatMessageRepository(), new SessionRepo_1.SessionsRepository(), new DisputesRepo_1.DisputesRepo(), new UserSubscriptionRepository_1.UserSubscriptionRepository(new UserSubscriptionMapper_1.UserSubscriptionMapper()));
    return new GetChatscontroller_1.GetChatsController(usecase);
}
