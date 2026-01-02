"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpChatSocket = setUpChatSocket;
const SocketEventEnum_1 = require("../../infrastructure/constant/SocketEventEnum");
const handlers_1 = require("./handlers");
const SocketStore_1 = require("./SocketStore");
async function setUpChatSocket(io) {
    io.on("connection", (socket) => {
        const socketHandler = new handlers_1.SocketHandlers(socket, io);
        const user = socket.data?.user;
        const userId = user?.id;
        socket.join(userId);
        SocketStore_1.socketStore.onlineUsers.add(userId);
        io.emit(SocketEventEnum_1.SocketEventEnum.ONLINE_USERS, {
            users: Array.from(SocketStore_1.socketStore.onlineUsers),
        });
        // join listener
        socket.on(SocketEventEnum_1.SocketEventEnum.JOIN_CHAT_EVENT, async (data) => {
            socketHandler.handleSocketJoin(data);
        });
        // listen for error events
        socket.on(SocketEventEnum_1.SocketEventEnum.SOCKET_ERROR_EVENT, (error) => {
            socketHandler.handleEmiter(userId, SocketEventEnum_1.SocketEventEnum.SOCKET_ERROR_EVENT, {
                message: error.message,
            });
            socket.disconnect();
        });
        // listen for disconnect event
        socket.on(SocketEventEnum_1.SocketEventEnum.DISCONNECT_EVENT, () => {
            socketHandler.handleSocketDisconnect();
        });
        // typing listener
        socket.on(SocketEventEnum_1.SocketEventEnum.TYPING_EVENT, (data) => {
            socket.to(data.session_id).emit(SocketEventEnum_1.SocketEventEnum.TYPING_EVENT, {
                session_id: data.session_id,
                userId: data.userId,
            });
        });
        // sendmessage listender
        socket.on(SocketEventEnum_1.SocketEventEnum.SEND_MESSAGE_EVENT, async (data, cb) => {
            // console.log("message send listening");
            socketHandler.handleSendMessage(data, cb);
        });
        socket.on(SocketEventEnum_1.SocketEventEnum.CHANGE_CHAT_NAME_EVENT, (data, cb) => {
            socketHandler.handleChangeChatName(data, cb);
        });
        socket.on(SocketEventEnum_1.SocketEventEnum.MESSAGE_DELETE_EVENT, (data) => {
            socketHandler.handleDeleteMessage(data);
        });
        socket.on(SocketEventEnum_1.SocketEventEnum.REPORT_MESSAGE, (data, cb) => {
            socketHandler.handleReportMessage(data, cb);
        });
        socket.on(SocketEventEnum_1.SocketEventEnum.NOTIFICATION_SEND, (data) => {
            socketHandler.handleSendNotification(data);
        });
    });
}
