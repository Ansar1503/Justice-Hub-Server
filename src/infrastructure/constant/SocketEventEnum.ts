export enum SocketEventEnum {
  CONNECTED_EVENT = "user_connected",
  ONLINE_USERS = "user_online",
  DISCONNECT_EVENT = "disconnect",
  JOIN_CHAT_EVENT = "joinChat",
  MESSAGE_RECEIVED_EVENT = "messageReceived",
  SOCKET_ERROR_EVENT = "socketError",
  STOP_TYPING_EVENT = "stopTyping",
  ERROR = "error",
  TYPING_EVENT = "typing",
  MESSAGE_DELETE_EVENT = "messageDeleted",
  REPORT_MESSAGE = "report_message",
  CHECKONLINE_STATUS = "onlineStatus",
  SEND_MESSAGE_EVENT = "sendMessage",
  CHANGE_CHAT_NAME_EVENT = "changeChatName",
}
