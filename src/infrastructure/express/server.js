"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = __importDefault(require("../../infrastructure/database/config"));
const auth_route_1 = __importDefault(require("../../interfaces/routes/auth.route"));
const client_route_1 = __importDefault(require("../../interfaces/routes/client.route"));
const admin_routes_1 = __importDefault(require("../../interfaces/routes/admin.routes"));
const lawyer_route_1 = __importDefault(require("../../interfaces/routes/lawyer.route"));
require("dotenv/config");
const ErrorHandler_1 = require("../../interfaces/middelwares/Error/ErrorHandler");
const config_2 = require("../socket/config");
const chatSocket_1 = require("../../interfaces/socket/chatSocket");
const WinstonLoggerConfig_1 = require("@shared/utils/Winston/WinstonLoggerConfig");
const PORT = process.env.PORT || 4000;
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = (0, config_2.InitialiseSocketServer)(server);
const rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1000,
    max: 1000,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});
(0, config_1.default)();
app.use((0, cors_1.default)({
    origin: [
        `${process.env.FRONTEND_URL}`,
        "https://c6cfac23a22c.ngrok-free.app",
    ],
    methods: ["PUT", "POST", "GET", "PATCH", "DELETE"],
    credentials: true,
}));
app.use(rateLimiter);
app.use("/api/client/stripe/webhooks", express_1.default.raw({ type: "application/json" }), client_route_1.default);
app.use("/api/client/stripe/subscription/webhooks", express_1.default.raw({ type: "application/json" }), client_route_1.default);
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/user/", auth_route_1.default);
app.use("/api/client/", client_route_1.default);
app.use("/api/admin/", admin_routes_1.default);
app.use("/api/lawyer/", lawyer_route_1.default);
app.use(ErrorHandler_1.NotFoundErrorHandler);
app.use(ErrorHandler_1.errorMiddleware);
(0, chatSocket_1.setUpChatSocket)(io);
server.listen(PORT, () => WinstonLoggerConfig_1.WLogger.info("Server Started Successfully", {
    port: PORT,
    url: process.env.BASE_URL,
}));
