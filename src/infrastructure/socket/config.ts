import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket, ExtendedError } from "socket.io";
import "dotenv/config";
import { authenticateClientSocket } from "../../interfaces/middelwares/socket/client.socket.auth";
import { SocketEventEnum } from "../constant/SocketEventEnum";

export function InitialiseSocketServer(server: HTTPServer): SocketIOServer {
  const FRONTEND_URL = process.env.FRONTEND_URL;
  const io = new SocketIOServer(server, {
    cors: {
      origin: [`${FRONTEND_URL}`, "http://localhost:4000"],
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });
  io.use(authenticateClientSocket);

  return io;
}
