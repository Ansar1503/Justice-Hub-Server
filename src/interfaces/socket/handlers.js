"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketHandlers = void 0;
const ChatMessageRepo_1 = require("@infrastructure/database/repo/ChatMessageRepo");
const ChatSessionRepo_1 = require("@infrastructure/database/repo/ChatSessionRepo");
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const NotificationRepo_1 = require("@infrastructure/database/repo/NotificationRepo");
const DisputesRepo_1 = require("@infrastructure/database/repo/DisputesRepo");
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const CreateNotification_1 = require("../../application/usecases/Notification/implementation/CreateNotification");
const SocketEventEnum_1 = require("../../infrastructure/constant/SocketEventEnum");
const chat_usecase_1 = require("../../application/usecases/chat.usecase");
const SocketStore_1 = require("./SocketStore");
const WinstonLoggerConfig_1 = require("@shared/utils/Winston/WinstonLoggerConfig");
const UserSubscriptionRepository_1 = require("@infrastructure/database/repo/UserSubscriptionRepository");
const UserSubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/UserSubscriptionMapper");
const chatUsecase = new chat_usecase_1.ChatUseCase(new ChatSessionRepo_1.ChatSessionRepository(), new ChatMessageRepo_1.ChatMessageRepository(), new SessionRepo_1.SessionsRepository(), new DisputesRepo_1.DisputesRepo(), new UserSubscriptionRepository_1.UserSubscriptionRepository(new UserSubscriptionMapper_1.UserSubscriptionMapper()));
const CreateNotification = new CreateNotification_1.NotificationUsecase(new NotificationRepo_1.NotificationRepository(), new SessionRepo_1.SessionsRepository(), new ChatSessionRepo_1.ChatSessionRepository(), new AppointmentsRepo_1.AppointmentsRepository(), new UserSubscriptionRepository_1.UserSubscriptionRepository(new UserSubscriptionMapper_1.UserSubscriptionMapper()));
class SocketHandlers {
    socket;
    io;
    eventEnum = SocketEventEnum_1.SocketEventEnum;
    constructor(socket, io) {
        this.socket = socket;
        this.io = io;
    }
    handleEmiter(id, event, payload) {
        this.socket.to(id).emit(event, payload);
    }
    getChatSessionDetails(sessionId) {
        return chatUsecase.getChatSessionById(sessionId);
    }
    getSessionDetails(sessionId) {
        return chatUsecase.getSessionDetails(sessionId);
    }
    async handleSendMessage(newMessage, cb) {
        try {
            const chatSend = await chatUsecase.createChatMessage({
                receiverId: newMessage.receiverId,
                senderId: newMessage.senderId,
                session_id: newMessage.session_id,
                attachments: newMessage.attachments,
                content: newMessage.content,
            });
            cb({ success: true, savedMessage: chatSend || undefined });
            this.handleEmiter(chatSend?.receiverId || "", this.eventEnum.MESSAGE_RECEIVED_EVENT, chatSend);
        }
        catch (error) {
            cb({
                success: false,
                error: error instanceof Error ? error.message : "Somethings went wrong",
            });
        }
    }
    handleSocketDisconnect() {
        const userId = this.socket.data.user?.id;
        if (userId) {
            for (const room of this.socket.rooms) {
                if (room !== this.socket.id) {
                    this.socket.leave(room);
                }
            }
            this.socket.disconnect();
            if (SocketStore_1.socketStore.onlineUsers.has(userId)) {
                SocketStore_1.socketStore.onlineUsers.delete(userId);
                this.io.emit(this.eventEnum.ONLINE_USERS, {
                    users: Array.from(SocketStore_1.socketStore.onlineUsers),
                });
            }
        }
    }
    async handleSocketJoin(data) {
        const sessionId = data?.sessionId;
        const userId = this.socket.data.user?.id;
        if (!sessionId || !userId)
            return;
        this.socket.join(userId);
        SocketStore_1.socketStore.onlineUsers.add(userId);
        this.io.emit(SocketEventEnum_1.SocketEventEnum.ONLINE_USERS, {
            users: Array.from(SocketStore_1.socketStore.onlineUsers),
        });
        const chatSessionDetails = await this.getChatSessionDetails(sessionId);
        const sessions = await this.getSessionDetails(sessionId);
        if (!sessions) {
            this.handleEmiter(userId, SocketEventEnum_1.SocketEventEnum.SOCKET_ERROR_EVENT, {
                message: "sessions not found",
            });
        }
        if (!chatSessionDetails) {
            this.handleEmiter(userId, SocketEventEnum_1.SocketEventEnum.SOCKET_ERROR_EVENT, {
                message: "Chat Session not found",
            });
            return;
        }
        const isParticipant = chatSessionDetails.participants.client_id === userId ||
            chatSessionDetails.participants.lawyer_id === userId;
        if (!isParticipant) {
            this.handleEmiter(userId, SocketEventEnum_1.SocketEventEnum.SOCKET_ERROR_EVENT, {
                message: "You're not a participant of this chat session.",
            });
            return;
        }
        this.socket.data.userId = userId;
        const socketsInRoom = await this.io.in(sessionId).fetchSockets();
        const userAlreadyInRoom = socketsInRoom.some((s) => s.data.userId === userId);
        if (userAlreadyInRoom) {
            return;
        }
        const uniqueUserIds = new Set(socketsInRoom.map((s) => s.data.userId));
        if (uniqueUserIds.size >= 2) {
            this.handleEmiter(userId, SocketEventEnum_1.SocketEventEnum.SOCKET_ERROR_EVENT, {
                message: "Chat room is full",
            });
            return;
        }
        this.socket.join(sessionId);
        this.socket.emit(SocketEventEnum_1.SocketEventEnum.CONNECTED_EVENT, {
            isConnected: true,
        });
    }
    async handleChangeChatName(data, cb) {
        try {
            const updatedChat = await chatUsecase.updateChatName({
                chatId: data.chatId,
                chatName: data.chatName,
            });
            if (updatedChat) {
                cb({ success: true, updatedChat });
                this.handleEmiter(data.userId, SocketEventEnum_1.SocketEventEnum.CHANGE_CHAT_NAME_EVENT, updatedChat);
            }
            else {
                cb({ success: false, error: "Chat not found or update failed" });
            }
        }
        catch (error) {
            cb({
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    async handleDeleteMessage(payload) {
        try {
            const lastMessage = await chatUsecase.deleteMessage(payload);
            this.io.in(payload.sessionId).emit(this.eventEnum.MESSAGE_DELETE_EVENT, {
                ...payload,
                lastMessage: lastMessage,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                WinstonLoggerConfig_1.WLogger.error(error.message, {
                    file: "socket_handler",
                    handler: "handleDeleteMessages",
                    error: error,
                });
            }
            WinstonLoggerConfig_1.WLogger.error("Something Went Wrong", {
                file: "socket_handler",
                handler: "handleDeleteMessages",
                error: error,
            });
        }
    }
    async handleReportMessage(payload, cb) {
        try {
            const { messageId, reason, reportedBy } = payload;
            if (!messageId) {
                cb({ success: false, error: "messageId Not found" });
                return;
            }
            if (!reason?.trim()) {
                cb({ success: false, error: "no reason found" });
                return;
            }
            if (!reportedBy) {
                cb({ success: false, error: "reported user Id required" });
            }
            await chatUsecase.reportMessage({
                messageId,
                reason,
                reportedAt: new Date(),
            });
            cb({ success: true });
        }
        catch (error) {
            cb({
                success: false,
                error: error instanceof Error ? error.message : "Something went wrong",
            });
        }
    }
    async handleSendNotification(payload) {
        try {
            if (payload.type === "message") {
                const socketsInRoom = await this.io
                    .in(payload?.sessionId || "")
                    .fetchSockets();
                const userAlreadyInRoom = socketsInRoom.some((s) => s.data.userId === payload?.recipientId);
                if (!userAlreadyInRoom) {
                    const newNotification = await CreateNotification.execute(payload);
                    this.io
                        .to(payload.recipientId)
                        .emit(this.eventEnum.NOTIFICATION_RECEIVED, newNotification);
                }
            }
            else if (payload.type === "session") {
                const newNotification = await CreateNotification.execute(payload);
                this.io
                    .to(payload.recipientId)
                    .emit(this.eventEnum.NOTIFICATION_RECEIVED, newNotification);
            }
        }
        catch (error) {
            this.io
                .to(payload.senderId)
                .emit(this.eventEnum.ERROR, error instanceof Error ? error.message : "Something Went Wrong");
        }
    }
}
exports.SocketHandlers = SocketHandlers;
