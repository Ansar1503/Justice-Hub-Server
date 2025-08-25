import { Socket, Server as SocketIOServer } from "socket.io";
import { socketStore } from "./SocketStore";
import { ChatUseCase } from "../../application/usecases/chat.usecase";
import { SocketEventEnum } from "../../infrastructure/constant/SocketEventEnum";
import { NotificationUsecase } from "../../application/usecases/Notification/CreateNotification";
import { Notification } from "../../domain/entities/Notification";
import { ChatMessageRepository } from "@infrastructure/database/repo/ChatMessageRepo";
import { ChatSessionRepository } from "@infrastructure/database/repo/ChatSessionRepo";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { NotificationRepository } from "@infrastructure/database/repo/NotificationRepo";
import {
  ChatMessageInputDto,
  ChatMessageOutputDto,
} from "@src/application/dtos/chats/ChatMessageDto";
import { DisputesRepo } from "@infrastructure/database/repo/DisputesRepo";

const chatUsecase = new ChatUseCase(
  new ChatSessionRepository(),
  new ChatMessageRepository(),
  new SessionsRepository(),
  new DisputesRepo()
);
const notificationUsecase = new NotificationUsecase(
  new NotificationRepository(),
  new SessionsRepository()
);

export class SocketHandlers {
  private eventEnum = SocketEventEnum;
  constructor(private socket: Socket, private io: SocketIOServer) {}
  handleEmiter(id: string, event: SocketEventEnum, payload: any) {
    this.socket.to(id).emit(event, payload);
    // console.log(`Emitting ${event} to user ${id}`, payload);
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
    }) => {}
  ) {
    try {
      // console.log("newmessage:", newMcessage);
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
        this.eventEnum.MESSAGE_RECEIVED_EVENT,
        chatSend
      );
    } catch (error: any) {
      console.log("error sending message", error);
      cb({ success: false, error: error.message });
    }
  }

  handleSocketDisconnect() {
    console.log(
      "user has disconnected 🚫. userId: " + this.socket.data.user?.id
    );
    const userId = this.socket.data.user?.id;
    if (userId) {
      for (const room of this.socket.rooms) {
        if (room !== this.socket.id) {
          this.socket.leave(room);
        }
      }
      this.socket.disconnect();
      if (socketStore.onlineUsers.has(userId)) {
        socketStore.onlineUsers.delete(userId);
        this.io.emit(this.eventEnum.ONLINE_USERS, {
          users: Array.from(socketStore.onlineUsers),
        });
      }
    }
  }

  async handleSocketJoin(data: { sessionId: string }) {
    const sessionId = data?.sessionId;
    const userId = this.socket.data.user?.id;

    if (!sessionId || !userId) return;
    this.socket.join(userId);
    socketStore.onlineUsers.add(userId);
    this.io.emit(SocketEventEnum.ONLINE_USERS, {
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

    this.socket.data.userId = userId;

    const socketsInRoom = await this.io.in(sessionId).fetchSockets();

    const userAlreadyInRoom = socketsInRoom.some(
      (s) => s.data.userId === userId
    );
    if (userAlreadyInRoom) {
      console.log("User already in chat session room");
      return;
    }
    const uniqueUserIds = new Set(socketsInRoom.map((s) => s.data.userId));
    if (uniqueUserIds.size >= 2) {
      this.handleEmiter(userId, SocketEventEnum.SOCKET_ERROR_EVENT, {
        message: "Chat room is full",
      });
      return;
    }
    this.socket.join(sessionId);
    this.socket.emit(SocketEventEnum.CONNECTED_EVENT, {
      isConnected: true,
    });
    console.log(`User ${userId} joined chat session ${sessionId}`);
  }

  async handleChangeChatName(
    data: { chatId: string; chatName: string; userId: string },
    cb: (response: {
      success: boolean;
      updatedChat?: any;
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
    } catch (error: any) {
      console.error("Error updating chat name:", error);
      cb({ success: false, error: error?.message || "Internal server error" });
    }
  }

  async handleDeleteMessage(payload: { messageId: string; sessionId: string }) {
    try {
      // console.log("payload", payload);
      const lastMessage = await chatUsecase.deleteMessage(payload);
      // console.log("lastmessage", lastMessage);
      this.io.in(payload.sessionId).emit(this.eventEnum.MESSAGE_DELETE_EVENT, {
        ...payload,
        lastMessage: lastMessage,
      });
    } catch (error: any) {
      console.log("error occured while deleting message: " + " " + error);
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
      reportedMessage?: any | null;
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
      const reportedMessage = await chatUsecase.reportMessage({
        messageId,
        reason,
        reportedAt: new Date(),
      });

      cb({ success: true });
    } catch (error: any) {
      console.log("error reporting message :", error);
      cb({ success: false, error: error?.message });
    }
  }

  async handleSendNotification(payload: Notification) {
    try {
      const newNotification =
        await notificationUsecase.createSessionNotification(payload);

      this.io
        .to(newNotification.recipientId)
        .emit(this.eventEnum.NOTIFICATION_RECEIVED, newNotification);
    } catch (error: any) {
      console.log("error :", error);
      this.io.to(payload.senderId).emit(this.eventEnum.ERROR, error.message);
    }
  }
}
