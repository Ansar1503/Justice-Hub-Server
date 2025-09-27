import mongoose, { Schema, Document } from "mongoose";

export interface IDisputesModel extends Document {
    _id: string;
    disputeType: "reviews" | "messages";
    contentId: string;
    reason: string;
    reportedBy: string;
    reportedUser: string;
    status: "pending" | "resolved" | "rejected";
    resolveAction?: "deleted" | "blocked";
    createdAt: Date;
    updatedAt: Date;
}

const diputesSchema = new Schema<IDisputesModel>(
    {
        _id: { type: String },
        disputeType: {
            type: String,
            required: true,
            enum: ["reviews", "messages"],
        },
        contentId: {
            type: String,
            required: true,
            refPath: "disputeType",
        },
        reason: { type: String, required: true },
        reportedBy: { type: String, required: true },
        reportedUser: { type: String, required: true },
        status: {
            type: String,
            required: true,
            enum: ["pending", "resolved", "rejected"],
            default: "pending",
        },
        resolveAction: {
            type: String,
            required: false,
            enum: ["deleted", "blocked"],
        },
    },
    { timestamps: true },
);

export const DisputesModel = mongoose.model<IDisputesModel>("Disputes", diputesSchema);
