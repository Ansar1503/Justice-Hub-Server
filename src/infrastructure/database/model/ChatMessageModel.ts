import mongoose, { Schema } from "mongoose";

interface Attachment {
  name: string;
  url: string;
  type: string;
}

export interface IChatMessageModel extends Document {
  _id: string;
  session_id: string;
  senderId: string;
  receiverId: string;
  content?: string;
  read: boolean;
  active: boolean;
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessageModel>(
  {
    _id: { type: String },
    session_id: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String },
    read: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    attachments: [
      {
        name: { type: String },
        url: { type: String },
        type: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model<IChatMessageModel>(
  "Message",
  chatMessageSchema
);
