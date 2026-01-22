import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import "dotenv/config";
import { authenticateClientSocket } from "../../interfaces/middelwares/socket/client.socket.auth";

export function InitialiseSocketServer(server: HTTPServer): SocketIOServer {
  const FRONTEND_URL = process.env.FRONTEND_URL;
  const io = new SocketIOServer(server, {
    cors: {
      origin: [
        `${FRONTEND_URL}`,
        "http://localhost:4000",
        "https://c6cfac23a22c.ngrok-free.app",
      ],
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });
  io.use((socket, next) => {
    authenticateClientSocket(socket, (err) => {
      if (err) {
        console.warn("Socket auth failed:", err.message);
        return next(err);
      }
      next();
    });
  });

  io.engine.on("connection_error", (err) => {
    if (err.code === "ECONNRESET") {
      console.warn("Socket engine connection reset");
      return;
    }
    console.error("Socket engine error:", err);
  });
  io.on("connection", (socket) => {
    socket.on("error", (err) => {
      if ((err as any)?.code === "ECONNRESET") {
        console.warn("Client socket reset");
        return;
      }
      console.error("Socket error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
  });

  return io;
}
