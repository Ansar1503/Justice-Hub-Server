import mongoose, { Document, Schema } from "mongoose";

type StatusType = "open" | "closed" | "onhold";
export interface ICaseModel extends Document {
    _id: string;
    title: string;
    clientId: string;
    lawyerId: string;
    caseType: string;
    summary?: string;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;
}

const CaseSchema = new Schema<ICaseModel>(
    {
        _id: { type: String },
        title: { type: String, required: true },
        clientId: { type: String, required: true },
        lawyerId: { type: String, required: true },
        caseType: { type: String, required: true },
        summary: { type: String },
        status: {
            type: String,
            required: true,
            enum: ["open", "closed", "onhold"],
        },
        createdAt: { type: Date },
        updatedAt: { type: Date },
    },
    { timestamps: true },
);

export const CaseModel = mongoose.model("case", CaseSchema);
