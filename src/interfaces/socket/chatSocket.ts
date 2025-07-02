import { Socket, Server as SocketIOServer } from "socket.io";
import { SocketEventEnum } from "../../infrastructure/constant/SocketEventEnum";
import { SocketHandlers } from "./handlers";
import { ChatMessage, ChatSession } from "../../domain/entities/Chat.entity";
import { socketStore } from "./SocketStore";

export async function setUpChatSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    const socketHandler = new SocketHandlers(socket, io);
    const user = socket.data?.user;
    const userId = user?.id;
    // console.log(`user : ${user}`);

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
      console.log("user has disconnected 🚫. userId: " + socket.data.user?.id);
      if (socket.data.user?.id) {
        for (const room of socket.rooms) {
          if (room !== socket.id) {
            socket.leave(room);
          }
        }
      }
    });

    // typing listener
    socket.on(
      SocketEventEnum.TYPING_EVENT,
      (data: { session_id: string; userId: string }) => {
        // console.log("data", data);
        socket.to(data.session_id).emit(SocketEventEnum.TYPING_EVENT, {
          session_id: data.session_id,
          userId: data.userId,
        });
      }
    );

    // sendmessage listender
    socket.on(
      SocketEventEnum.SEND_MESSAGE_EVENT,
      async (data: ChatMessage, cb: any) => {
        socketHandler.handleSendMessage(data, cb);
      }
    );

    socket.on(
      SocketEventEnum.CHANGE_CHAT_NAME_EVENT,
      (data: { chatId: string; chatName: string; userId: string }, cb: any) => {
        socketHandler.handleChangeChatName(data, cb);
      }
    );
  });
}
