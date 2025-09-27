import mongoose, { Schema } from "mongoose";

interface ChatParticipants {
    lawyer_id: string;
    client_id: string;
}

export interface IChatSessionModel extends Document {
    _id: string;
    name: string;
    participants: ChatParticipants;
    last_message: string;
    session_id: string;
    createdAt: Date;
    updatedAt: Date;
}

const chatSessionSchema = new Schema<IChatSessionModel>(
    {
        _id: { type: String },
        participants: {
            lawyer_id: { type: String, required: true },
            client_id: { type: String, required: true },
        },
        name: { type: String, required: true },
        session_id: { type: String, unique: true, required: true },
        last_message: {
            type: String,
            required: false,
        },
    },
    { timestamps: true },
);

export const ChatModel = mongoose.model<IChatSessionModel>("ChatSession", chatSessionSchema);
