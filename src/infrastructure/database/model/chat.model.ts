import mongoose, { Schema, Document, Types } from "mongoose";
import { ChatSession } from "../../../domain/entities/Chat.entity";

export interface IChatModel extends Document {
  participants: {
    lawyer_id: string;
    client_id: string;
  };
  session_id: Types.ObjectId;
  last_message?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const chatSchema = new Schema<IChatModel>(
  {
    participants: {
      lawyer_id: { type: String, unique: true, required: true },
      client_id: { type: String, unique: true, required: true },
    },
    session_id: { type: Schema.Types.ObjectId, unique: true, required: true },
    last_message: {
      type: Schema.Types.ObjectId,
      unique: true,
      required: false,
    },
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model<IChatModel>("Chat", chatSchema);

