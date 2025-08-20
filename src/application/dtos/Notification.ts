type NotificationType = "message" | "session";

export interface NotificationDto {
  id: string;
  recipientId: string;
  senderId: string;
  type: NotificationType;
  roomId?: string;
  sessionId?: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
