import mongoose, { Document, Schema } from "mongoose";

type NotificationType = "message" | "session";

export interface INotificationModel extends Document {
  _id: string;
  recipientId: string;
  senderId: string;
  type: NotificationType;
  roomId: string;
  sessionId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotificationModel>(
  {
    _id: { type: String },
    isRead: { type: Boolean, default: false },
    message: { type: String },
    recipientId: { type: String, required: true },
    senderId: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["message", "session"], required: true },
    roomId: { type: String, required: false },
    sessionId: { type: String, required: false },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<INotificationModel>(
  "Notification",
  NotificationSchema
);
