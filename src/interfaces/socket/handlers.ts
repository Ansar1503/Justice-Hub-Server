import { Socket, Server as SocketIOServer } from "socket.io";
import { socketStore } from "./SocketStore";
import { ChatUseCase } from "../../application/usecases/chat.usecase";
import { ChatRepo } from "../../infrastructure/database/repo/chat.repo";
import { SocketEventEnum } from "../../infrastructure/constant/SocketEventEnum";

const chatUsecase = new ChatUseCase(new ChatRepo());

export class SocketHandlers {
  private eventEnum = SocketEventEnum;
  constructor(private socket: Socket, private io: SocketIOServer) {}
  handleEmiter(id: string, event: SocketEventEnum, payload: any) {
    this.socket.to(id).emit(event, payload);
  }
  handleCheckOnline(targetId: string) {
    const isOnline = socketStore.onlineStatus.has(targetId);
    this.socket.emit(this.eventEnum.CHECKONLINE_STATUS, {
      userId: targetId,
      isOnline,
    });
  }
  handleDisconnect(userId: string) {
    socketStore.onlineStatus.delete(userId);
    this.io.emit(this.eventEnum.CHECKONLINE_STATUS, {
      userId,
      isOnline: false,
    });
  }
}
