import mongoose, { Document, Schema } from "mongoose";
import { Notification } from "../../../domain/entities/Notification.entity";

export interface INotificationModel extends Document, Notification {}

const NotificationSchema = new Schema<INotificationModel>(
  {
    isRead: { type: Boolean, default: false },
    message: { type: String, required: true },
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
