import mongoose, { Schema, Document, Types } from "mongoose";
import { ChatMessage } from "../../../domain/entities/Chat.entity";

export interface IChatModel extends Document {
  participants: {
    lawyer_id: string;
    client_id: string;
  };
  name: string;
  session_id: Types.ObjectId;
  last_message?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessageModel
  extends Document,
    Omit<ChatMessage, "_id" | "session_id" | "createdAt" | "updatedAt"> {
  session_id: Types.ObjectId;
}

const chatSchema = new Schema<IChatModel>(
  {
    participants: {
      lawyer_id: { type: String, required: true },
      client_id: { type: String, required: true },
    },
    name: { type: String, required: true },
    session_id: { type: Schema.Types.ObjectId, unique: true, required: true },
    last_message: {
      type: Schema.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: true }
);

const messageSchema = new Schema<IMessageModel>(
  {
    session_id: {
      type: Schema.Types.ObjectId,
      ref: "Chats",
      required: true,
    },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, required: false },
    read: { type: Boolean, required: true, default: false },
    attachments: [
      {
        name: { type: String, required: false },
        url: { type: String, required: false },
        type: { type: String, required: false },
      },
    ],
    report: {
      reportedAt: { type: Date },
      reason: { type: String },
    },
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model<IChatModel>("Chat", chatSchema);
export const MessageModel = mongoose.model<IMessageModel>(
  "Message",
  messageSchema
);
