export interface Notification {
  recipientId: string;
  senderId: string;
  type: "message" | "session";
  roomId?: string;
  sessionId?: string;
  title: string;
  message: string;
  isRead: boolean;
}
