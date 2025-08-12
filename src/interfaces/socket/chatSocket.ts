import { Socket, Server as SocketIOServer } from "socket.io";
import { SocketEventEnum } from "../../infrastructure/constant/SocketEventEnum";
import { SocketHandlers } from "./handlers";

import { socketStore } from "./SocketStore";
import { Notification } from "../../domain/entities/Notification";
import { ChatMessageInputDto } from "@src/application/dtos/chats/ChatMessageDto";

export async function setUpChatSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    const socketHandler = new SocketHandlers(socket, io);
    const user = socket.data?.user;
    const userId = user?.id;

    socket.join(userId);
    console.log("user joined", userId);
    socketStore.onlineUsers.add(userId);
    io.emit(SocketEventEnum.ONLINE_USERS, {
      users: Array.from(socketStore.onlineUsers),
    });

    // join listener
    socket.on(
      SocketEventEnum.JOIN_CHAT_EVENT,
      async (data: { sessionId: string }) => {
        socketHandler.handleSocketJoin(data);
      }
    );

    // listen for error events
    socket.on(SocketEventEnum.SOCKET_ERROR_EVENT, (error) => {
      console.error("Socket authentication error:", error.message);
      socketHandler.handleEmiter(userId, SocketEventEnum.SOCKET_ERROR_EVENT, {
        message: error.message,
      });
      socket.disconnect();
    });

    // listen for disconnect event
    socket.on(SocketEventEnum.DISCONNECT_EVENT, () => {
      socketHandler.handleSocketDisconnect();
    });

    // typing listener
    socket.on(
      SocketEventEnum.TYPING_EVENT,
      (data: { session_id: string; userId: string }) => {
        socket.to(data.session_id).emit(SocketEventEnum.TYPING_EVENT, {
          session_id: data.session_id,
          userId: data.userId,
        });
      }
    );

    // sendmessage listender
    socket.on(
      SocketEventEnum.SEND_MESSAGE_EVENT,
      async (data: ChatMessageInputDto, cb: any) => {
        // console.log("message send listening");
        socketHandler.handleSendMessage(data, cb);
      }
    );

    socket.on(
      SocketEventEnum.CHANGE_CHAT_NAME_EVENT,
      (data: { chatId: string; chatName: string; userId: string }, cb: any) => {
        socketHandler.handleChangeChatName(data, cb);
      }
    );

    socket.on(
      SocketEventEnum.MESSAGE_DELETE_EVENT,
      (data: { messageId: string; sessionId: string }) => {
        socketHandler.handleDeleteMessage(data);
      }
    );

    socket.on(
      SocketEventEnum.REPORT_MESSAGE,
      (
        data: {
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
      ) => {
        socketHandler.handleReportMessage(data, cb);
      }
    );

    socket.on("NOTIFICATION_SEND", (data: Notification) => {
      socketHandler.handleSendNotification(data);
    });
  });
}
