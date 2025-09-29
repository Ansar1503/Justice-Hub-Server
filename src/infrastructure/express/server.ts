import { createServer } from "http";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "../../infrastructure/database/config";
import authRoute from "../../interfaces/routes/auth.route";
import clientRoute from "../../interfaces/routes/client.route";
import adminRoute from "../../interfaces/routes/admin.routes";
import lawyerRoute from "../../interfaces/routes/lawyer.route";
import "dotenv/config";
import { errorMiddleware, NotFoundErrorHandler } from "../../interfaces/middelwares/Error/ErrorHandler";
import { InitialiseSocketServer } from "../socket/config";
import { setUpChatSocket } from "../../interfaces/socket/chatSocket";

const PORT = process.env.PORT || 4000;
const app: Application = express();
const server = createServer(app);
const io = InitialiseSocketServer(server);
const rateLimiter = rateLimit({
    windowMs: 60000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});
connectDB();
app.use(
    cors({
        origin: [`${process.env.FRONTEND_URL}`, "https://c6cfac23a22c.ngrok-free.app"],
        methods: ["PUT", "POST", "GET", "PATCH", "DELETE"],
        credentials: true,
    }),
);
app.use(rateLimiter);
app.use("/api/client/stripe/webhooks", express.raw({ type: "application/json" }), clientRoute);
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

setUpChatSocket(io);

server.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));
