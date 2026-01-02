"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialiseSocketServer = InitialiseSocketServer;
const socket_io_1 = require("socket.io");
require("dotenv/config");
const client_socket_auth_1 = require("../../interfaces/middelwares/socket/client.socket.auth");
function InitialiseSocketServer(server) {
    const FRONTEND_URL = process.env.FRONTEND_URL;
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: [`${FRONTEND_URL}`, "http://localhost:4000", "https://c6cfac23a22c.ngrok-free.app"],
            credentials: true,
            methods: ["GET", "POST"],
        },
        pingInterval: 25000,
        pingTimeout: 20000,
    });
    io.use(client_socket_auth_1.authenticateClientSocket);
    return io;
}
