import { createServer } from "http";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB, { isDBConnected } from "../../infrastructure/database/config";
import authRoute from "../../interfaces/routes/auth.route";
import clientRoute from "../../interfaces/routes/client.route";
import adminRoute from "../../interfaces/routes/admin.routes";
import lawyerRoute from "../../interfaces/routes/lawyer.route";
import "dotenv/config";
import {
  errorMiddleware,
  NotFoundErrorHandler,
} from "../../interfaces/middelwares/Error/ErrorHandler";
import { InitialiseSocketServer } from "../socket/config";
import { setUpChatSocket } from "../../interfaces/socket/chatSocket";
import { WLogger } from "@shared/utils/Winston/WinstonLoggerConfig";

const PORT = process.env.PORT || 4000;
const app: Application = express();
app.set("trust proxy", 1);
const server = createServer(app);
const io = InitialiseSocketServer(server);
const rateLimiter = rateLimit({
  windowMs: 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
  },
});

connectDB();
app.use((req, res, next) => {
  if (!isDBConnected()) {
    res.status(503).json({
      message: "Database unavailable. Please try again later.",
    });
    return;
  }
  next();
});
server.on("clientError", (err, socket) => {
  if ((err as any).code === "ECONNRESET") {
    socket.destroy();
    return;
  }

  console.error("HTTP client error:", err);
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

app.use(
  cors({
    origin: [
      `${process.env.FRONTEND_URL}`,
      "https://c6cfac23a22c.ngrok-free.app",
    ],
    methods: ["PUT", "POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(rateLimiter);
app.use(
  "/api/client/stripe/webhooks",
  express.raw({ type: "application/json" }),
  clientRoute,
);
app.use(
  "/api/client/stripe/subscription/webhooks",
  express.raw({ type: "application/json" }),
  clientRoute,
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use("/api/user/", authRoute);
app.use("/api/client/", clientRoute);
app.use("/api/admin/", adminRoute);
app.use("/api/lawyer/", lawyerRoute);

app.use(NotFoundErrorHandler);
app.use(errorMiddleware);
process.on("unhandledRejection", (reason: any) => {
  if (reason?.code === "ECONNRESET") {
    console.warn("Network connection reset");
    return;
  }
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  if ((err as any)?.code === "ECONNRESET") {
    console.warn("Uncaught ECONNRESET");
    return;
  }
  console.error("Uncaught Exception:", err);
});

setUpChatSocket(io);

server.listen(PORT, () =>
  WLogger.info("Server Started Successfully", {
    port: PORT,
    url: process.env.BASE_URL,
  }),
);
