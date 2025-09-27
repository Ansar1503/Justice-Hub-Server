import mongoose, { Schema, Document } from "mongoose";

export interface IcallLogModel extends Document {
    _id: string;
    roomId: string;
    session_id: string;
    start_time: Date;
    end_time?: Date;
    client_joined_at?: Date;
    client_left_at?: Date;
    lawyer_joined_at?: Date;
    lawyer_left_at?: Date;
    end_reason?: string;
    callDuration?: number;
    status: "ongoing" | "completed" | "cancelled" | "missed" | "dropped";
    createdAt: Date;
    updatedAt: Date;
}

const callLogsSchema = new Schema<IcallLogModel>(
    {
        _id: { type: String },
        roomId: { type: String, required: true },
        session_id: { type: String, required: true, ref: "Session" },
        client_joined_at: { type: Date },
        client_left_at: { type: Date },
        lawyer_joined_at: { type: Date },
        lawyer_left_at: { type: Date },
        start_time: { type: Date },
        end_time: { type: Date },
        callDuration: { type: Number },
        end_reason: { type: String },
        status: {
            type: String,
            enum: ["ongoing", "completed", "cancelled", "missed", "dropped"],
            required: true,
            default: "ongoing",
        },
    },
    { timestamps: true },
);

export const CallLogsModel = mongoose.model<IcallLogModel>("CallLogs", callLogsSchema);
