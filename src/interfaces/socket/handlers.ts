import { Socket, Server as SocketIOServer } from "socket.io";
import { ChatMessageRepository } from "@infrastructure/database/repo/ChatMessageRepo";
import { ChatSessionRepository } from "@infrastructure/database/repo/ChatSessionRepo";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { NotificationRepository } from "@infrastructure/database/repo/NotificationRepo";
import {
  ChatMessageInputDto,
  ChatMessageOutputDto,
} from "@src/application/dtos/chats/ChatMessageDto";
import { DisputesRepo } from "@infrastructure/database/repo/DisputesRepo";
import { NotificationDto } from "@src/application/dtos/Notification/BaseNotification";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { NotificationUsecase } from "../../application/usecases/Notification/implementation/CreateNotification";
import { SocketEventEnum } from "../../infrastructure/constant/SocketEventEnum";
import { ChatUseCase } from "../../application/usecases/chat.usecase";
import { socketStore } from "./SocketStore";
import { WLogger } from "@shared/utils/Winston/WinstonLoggerConfig";
import { UserSubscriptionRepository } from "@infrastructure/database/repo/UserSubscriptionRepository";
import { UserSubscriptionMapper } from "@infrastructure/Mapper/Implementations/UserSubscriptionMapper";

const chatUsecase = new ChatUseCase(
  new ChatSessionRepository(),
  new ChatMessageRepository(),
  new SessionsRepository(),
  new DisputesRepo(),
  new UserSubscriptionRepository(new UserSubscriptionMapper())
);
const CreateNotification = new NotificationUsecase(
  new NotificationRepository(),
  new SessionsRepository(),
  new ChatSessionRepository(),
  new AppointmentsRepository(),
  new UserSubscriptionRepository(new UserSubscriptionMapper())
);

export class SocketHandlers {
  private _eventEnum = SocketEventEnum;
  constructor(
    private _socket: Socket,
    private _io: SocketIOServer
  ) {}
  handleEmiter(id: string, event: SocketEventEnum, payload: unknown) {
    this._socket.to(id).emit(event, payload);
  }
  getChatSessionDetails(sessionId: string) {
    return chatUsecase.getChatSessionById(sessionId);
  }
  getSessionDetails(sessionId: string) {
    return chatUsecase.getSessionDetails(sessionId);
  }

  async handleSendMessage(
    newMessage: ChatMessageInputDto,
    cb: (payload: {
      success: boolean;
      savedMessage?: ChatMessageOutputDto;
      error?: string;
    }) => void
  ) {
    try {
      const chatSend = await chatUsecase.createChatMessage({
        receiverId: newMessage.receiverId,
        senderId: newMessage.senderId,
        session_id: newMessage.session_id,
        attachments: newMessage.attachments,
        content: newMessage.content,
      });
      cb({ success: true, savedMessage: chatSend || undefined });
      this.handleEmiter(
        chatSend?.receiverId || "",
        this._eventEnum.MESSAGE_RECEIVED_EVENT,
        chatSend
      );
    } catch (error) {
      cb({
        success: false,
        error: error instanceof Error ? error.message : "Somethings went wrong",
      });
    }
  }

  handleSocketDisconnect() {
    const userId = this._socket.data.user?.id;
    if (userId) {
      for (const room of this._socket.rooms) {
        if (room !== this._socket.id) {
          this._socket.leave(room);
        }
      }
      this._socket.disconnect();
      if (socketStore.onlineUsers.has(userId)) {
        socketStore.onlineUsers.delete(userId);
        this._io.emit(this._eventEnum.ONLINE_USERS, {
          users: Array.from(socketStore.onlineUsers),
        });
      }
    }
  }

  async handleSocketJoin(data: { sessionId: string }) {
    const sessionId = data?.sessionId;
    const userId = this._socket.data.user?.id;

    if (!sessionId || !userId) return;
    this._socket.join(userId);
    socketStore.onlineUsers.add(userId);
    this._io.emit(SocketEventEnum.ONLINE_USERS, {
      users: Array.from(socketStore.onlineUsers),
    });
    const chatSessionDetails = await this.getChatSessionDetails(sessionId);
    const sessions = await this.getSessionDetails(sessionId);
    if (!sessions) {
      this.handleEmiter(userId, SocketEventEnum.SOCKET_ERROR_EVENT, {
        message: "sessions not found",
      });
    }
    if (!chatSessionDetails) {
      this.handleEmiter(userId, SocketEventEnum.SOCKET_ERROR_EVENT, {
        message: "Chat Session not found",
      });
      return;
    }

    const isParticipant =
      chatSessionDetails.participants.client_id === userId ||
      chatSessionDetails.participants.lawyer_id === userId;

    if (!isParticipant) {
      this.handleEmiter(userId, SocketEventEnum.SOCKET_ERROR_EVENT, {
        message: "You're not a participant of this chat session.",
      });
      return;
    }

    this._socket.data.userId = userId;

    const socketsInRoom = await this._io.in(sessionId).fetchSockets();

    const userAlreadyInRoom = socketsInRoom.some(
      (s) => s.data.userId === userId
    );
    if (userAlreadyInRoom) {
      return;
    }
    const uniqueUserIds = new Set(socketsInRoom.map((s) => s.data.userId));
    if (uniqueUserIds.size >= 2) {
      this.handleEmiter(userId, SocketEventEnum.SOCKET_ERROR_EVENT, {
        message: "Chat room is full",
      });
      return;
    }
    this._socket.join(sessionId);
    this._socket.emit(SocketEventEnum.CONNECTED_EVENT, {
      isConnected: true,
    });
  }

  async handleChangeChatName(
    data: { chatId: string; chatName: string; userId: string },
    cb: (response: {
      success: boolean;
      updatedChat?: unknown;
      error?: string;
    }) => void
  ) {
    try {
      const updatedChat = await chatUsecase.updateChatName({
        chatId: data.chatId,
        chatName: data.chatName,
      });
      if (updatedChat) {
        cb({ success: true, updatedChat });
        this.handleEmiter(
          data.userId,
          SocketEventEnum.CHANGE_CHAT_NAME_EVENT,
          updatedChat
        );
      } else {
        cb({ success: false, error: "Chat not found or update failed" });
      }
    } catch (error) {
      cb({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  async handleDeleteMessage(payload: { messageId: string; sessionId: string }) {
    try {
      const lastMessage = await chatUsecase.deleteMessage(payload);
      this._io.in(payload.sessionId).emit(this._eventEnum.MESSAGE_DELETE_EVENT, {
        ...payload,
        lastMessage: lastMessage,
      });
    } catch (error) {
      if (error instanceof Error) {
        WLogger.error(error.message, {
          file: "socket_handler",
          handler: "handleDeleteMessages",
          error: error,
        });
      }
      WLogger.error("Something Went Wrong", {
        file: "socket_handler",
        handler: "handleDeleteMessages",
        error: error,
      });
    }
  }

  async handleReportMessage(
    payload: {
      messageId: string;
      sessionId: string;
      reason: string;
      reportedBy: string;
    },
    cb: (response: {
      success: boolean;
      reportedMessage?: unknown;
      error?: string;
    }) => void
  ) {
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
    } catch (error) {
      cb({
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }

  async handleSendNotification(payload: NotificationDto) {
    try {
      if (payload.type === "message") {
        const socketsInRoom = await this._io
          .in(payload?.sessionId || "")
          .fetchSockets();
        const userAlreadyInRoom = socketsInRoom.some(
          (s) => s.data.userId === payload?.recipientId
        );
        if (!userAlreadyInRoom) {
          const newNotification = await CreateNotification.execute(payload);
          this._io
            .to(payload.recipientId)
            .emit(this._eventEnum.NOTIFICATION_RECEIVED, newNotification);
        }
      } else if (payload.type === "session") {
        const newNotification = await CreateNotification.execute(payload);
        this._io
          .to(payload.recipientId)
          .emit(this._eventEnum.NOTIFICATION_RECEIVED, newNotification);
      }
    } catch (error) {
      this._io
        .to(payload.senderId)
        .emit(
          this._eventEnum.ERROR,
          error instanceof Error ? error.message : "Something Went Wrong"
        );
    }
  }
}
