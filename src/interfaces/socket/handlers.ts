import { Socket, Server as SocketIOServer } from "socket.io";
import { socketStore } from "./SocketStore";
import { ChatUseCase } from "../../application/usecases/chat.usecase";
import { ChatRepo } from "../../infrastructure/database/repo/chat.repo";
import { SocketEventEnum } from "../../infrastructure/constant/SocketEventEnum";
import { ChatMessage } from "../../domain/entities/Chat.entity";

const chatUsecase = new ChatUseCase(new ChatRepo());

export class SocketHandlers {
  private eventEnum = SocketEventEnum;
  constructor(private socket: Socket, private io: SocketIOServer) {}
  handleEmiter(id: string, event: SocketEventEnum, payload: any) {
    this.socket.to(id).emit(event, payload);
    console.log(`Emitting ${event} to user ${id}`, payload);
  }
  // handleCheckOnline(targetId: string) {
  //   const isOnline = socketStore.onlineStatus.has(targetId);
  //   this.socket.emit(this.eventEnum.CHECKONLINE_STATUS, {
  //     userId: targetId,
  //     isOnline,
  //   });
  // }
  getChatSessionDetails(sessionId: string) {
    return chatUsecase.getChatSessionById(sessionId);
  }

  async handleSendMessage(
    newMessage: ChatMessage,
    cb: (payload: {
      success: boolean;
      savedMessage?: ChatMessage;
      error?: string;
    }) => {}
  ) {
    try {
      const chatSend = await chatUsecase.createChatMessage(newMessage);
      cb({ success: true, savedMessage: chatSend || undefined });
      this.handleEmiter(
        chatSend?.receiverId || "",
        this.eventEnum.MESSAGE_RECEIVED_EVENT,
        chatSend
      );
    } catch (error: any) {
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
      if (socketStore.onlineStatus.has(userId)) {
        socketStore.onlineStatus.delete(userId);
        this.io.emit(this.eventEnum.USER_OFFLINE_EVENT, { userId });
      }
    }
  }

  async handleSocketJoin(data: { sessionId: string }) {
    const sessionId = data?.sessionId;
    const userId = this.socket.data.user?.id;

    if (!sessionId || !userId) return;
    this.socket.join(userId);
    socketStore.onlineStatus.add(userId);
    this.io.emit(SocketEventEnum.USER_ONLINE_EVENT, { userId });
    const chatSessionDetails = await this.getChatSessionDetails(sessionId);
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

  async handleDeleteMessage(
    payload: { messageId: string; sessionId: string },
    cb: any
  ) {
    try {
      const lastMessage = await chatUsecase.deleteMessage(payload);
      if (lastMessage) {
        this.handleEmiter(
          lastMessage.receiverId,
          this.eventEnum.MESSAGE_DELETE_EVENT,
          { ...payload, lastMessage }
        );
      }
      cb({ success: true, message: "successfully deleted", lastMessage });
    } catch (error: any) {
      cb({
        success: false,
        message: error.message || "message delete failed",
        lastMessage: null,
      });
    }
  }
}
