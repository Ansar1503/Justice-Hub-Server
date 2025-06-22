import { Socket, Server as SocketIOServer } from "socket.io";
import { SocketEventEnum } from "../../infrastructure/constant/SocketEventEnum";
import { SocketHandlers } from "./handlers";

export function setUpChatSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log("Socket connected");
    const socketHandler = new SocketHandlers(socket, io);
    const user = socket.data?.user;
    const userId = user?.id;
    // console.log(`user : ${user}`);
    if (userId) {
      socket.join(userId);
      console.log(`user ${userId} connected`);
    }

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
        socket.leave(socket.data.user.id);
      }
    });
  });
}
