"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatUseCase = void 0;
const ChatMessage_1 = require("@domain/entities/ChatMessage");
const Disputes_1 = require("@domain/entities/Disputes");
// import { IChatRepo } from "../../domain/IRepository/IChatRepo";
const CustomError_1 = require("../../interfaces/middelwares/Error/CustomError");
class ChatUseCase {
    _chatSessionRepo;
    _chatMessageRepo;
    _sessionRepo;
    _disputesRepo;
    _userSubRepo;
    constructor(_chatSessionRepo, _chatMessageRepo, _sessionRepo, _disputesRepo, _userSubRepo) {
        this._chatSessionRepo = _chatSessionRepo;
        this._chatMessageRepo = _chatMessageRepo;
        this._sessionRepo = _sessionRepo;
        this._disputesRepo = _disputesRepo;
        this._userSubRepo = _userSubRepo;
    }
    async fetchChats(payload) {
        const aggregateresult = await this._chatSessionRepo.aggregate(payload);
        // console.log("aggregation resltu;", aggregateresult);
        return aggregateresult;
    }
    async getChatSessionById(sessionId) {
        const chatSession = await this._chatSessionRepo.findById(sessionId);
        if (!chatSession)
            return null;
        return {
            createdAt: chatSession.createdAt,
            id: chatSession.id,
            last_message: chatSession.lastMessage,
            name: chatSession.name,
            participants: chatSession.participants,
            session_id: chatSession.sessionId,
            updatedAt: chatSession.updatedAt,
        };
    }
    async createChatMessage(message) {
        // console.log("newmessage", message);
        const [senderSub, receiverSub] = await Promise.all([
            this._userSubRepo.findByUser(message.senderId),
            this._userSubRepo.findByUser(message.receiverId),
        ]);
        if (senderSub && !senderSub.benefitsSnapshot.chatAccess) {
            throw new Error("Chat access doesnt exist for this user");
        }
        if (receiverSub && !receiverSub.benefitsSnapshot.chatAccess) {
            throw new Error("Chat access doesnt exist for this user");
        }
        const messagepayload = ChatMessage_1.ChatMessage.create({
            receiverId: message.receiverId,
            senderId: message.senderId,
            session_id: message.session_id,
            attachments: message.attachments,
            content: message.content,
        });
        const newChatMessage = await this._chatMessageRepo.create(messagepayload);
        if (!newChatMessage)
            return null;
        await this._chatSessionRepo.update({
            id: newChatMessage?.sessionId || "",
            last_message: newChatMessage?.id || "",
        });
        return {
            createdAt: newChatMessage.createdAt,
            id: newChatMessage.id,
            read: newChatMessage.read,
            active: newChatMessage.active,
            receiverId: newChatMessage.receiverId,
            senderId: newChatMessage.senderId,
            session_id: newChatMessage.sessionId,
            updatedAt: newChatMessage.updatedAt,
            attachments: newChatMessage.attachments,
            content: newChatMessage.content,
        };
    }
    async fetchChatMessages(payload) {
        const messages = await this._chatMessageRepo.findMessagesBySessionId(payload.session_id, payload.page);
        return {
            data: messages.data.map((m) => ({
                id: m.id,
                createdAt: m.createdAt,
                read: m.read,
                active: m.active,
                receiverId: m.receiverId,
                senderId: m.senderId,
                session_id: m.sessionId,
                updatedAt: m.updatedAt,
                attachments: m.attachments,
                content: m.content,
            })),
            nextCursor: messages.nextCursor,
        };
    }
    async updateChatName(payload) {
        const { chatId, chatName } = payload;
        const chat = await this._chatMessageRepo.findById(chatId);
        if (!chat)
            throw new Error("no chat found");
        const [senderSub, receiverSub] = await Promise.all([
            this._userSubRepo.findByUser(chat.senderId),
            this._userSubRepo.findByUser(chat.receiverId),
        ]);
        if (senderSub && !senderSub.benefitsSnapshot.chatAccess) {
            throw new Error("Chat access doesnt exist for this user");
        }
        if (receiverSub && !receiverSub.benefitsSnapshot.chatAccess) {
            throw new Error("Chat access doesnt exist for this user");
        }
        const updatedChat = await this._chatSessionRepo.update({
            name: chatName,
            id: chatId,
        });
        return updatedChat;
    }
    async deleteMessage(payload) {
        if (!payload.messageId)
            throw new CustomError_1.ValidationError("MessageId not found");
        // console.log("delete paylaod :: ", payload);
        const message = await this._chatMessageRepo.findById(payload.messageId);
        if (!message)
            throw new Error("Chat message not found");
        const [senderSub, receiverSub] = await Promise.all([
            this._userSubRepo.findByUser(message.senderId),
            this._userSubRepo.findByUser(message.receiverId),
        ]);
        if (senderSub && !senderSub.benefitsSnapshot.chatAccess) {
            throw new Error("Chat access doesnt exist for this user");
        }
        if (receiverSub && !receiverSub.benefitsSnapshot.chatAccess) {
            throw new Error("Chat access doesnt exist for this user");
        }
        await this._chatMessageRepo.update({
            messageId: payload.messageId,
            active: false,
        });
        const messages = await this._chatMessageRepo.findMessagesBySessionId(payload.sessionId, 1);
        const lastMessage = messages.data.length > 0
            ? messages?.data[messages?.data?.length - 1]
            : null;
        await this._chatSessionRepo.update({
            id: payload.sessionId,
            last_message: lastMessage?.id || "no message",
        });
        if (!lastMessage)
            return null;
        return {
            active: lastMessage.active,
            createdAt: lastMessage.createdAt,
            id: lastMessage.id,
            read: lastMessage.read,
            updatedAt: lastMessage.updatedAt,
            receiverId: lastMessage.receiverId,
            senderId: lastMessage.senderId,
            session_id: lastMessage.sessionId,
            attachments: lastMessage.attachments,
            content: lastMessage.content,
        };
    }
    async reportMessage(payload) {
        const chatExists = await this._chatMessageRepo.findById(payload.messageId);
        if (!chatExists)
            throw new Error("message doesnt exist");
        const [senderSub, receiverSub] = await Promise.all([
            this._userSubRepo.findByUser(chatExists.senderId),
            this._userSubRepo.findByUser(chatExists.receiverId),
        ]);
        if (senderSub && !senderSub.benefitsSnapshot.chatAccess) {
            throw new Error("Chat access doesnt exist for this user");
        }
        if (receiverSub && !receiverSub.benefitsSnapshot.chatAccess) {
            throw new Error("Chat access doesnt exist for this user");
        }
        const disputePayload = Disputes_1.Disputes.create({
            contentId: payload.messageId,
            reason: payload.reason,
            disputeType: "messages",
            reportedBy: chatExists.senderId,
            reportedUser: chatExists.receiverId,
            status: "pending",
        });
        await this._disputesRepo.create(disputePayload);
    }
    async getSessionDetails(sessionId) {
        return await this._sessionRepo.findById({ session_id: sessionId });
    }
    async fetchDisputes(payload) {
        return await this._chatMessageRepo.fetchDisputesAggregation(payload);
    }
}
exports.ChatUseCase = ChatUseCase;
