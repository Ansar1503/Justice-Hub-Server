import mongoose, { Schema } from "mongoose";

export interface ISessionDocumentModel extends Document {
    _id: string;
    session_id: string;
    client_id: string;
    caseId: string;
    document: { name: string; type: string; url: string }[];
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true },
});

const sessionDocumentSchema = new Schema<ISessionDocumentModel>(
    {
        _id: { type: String },
        caseId: { type: String, required: true },
        session_id: {
            type: String,
            required: true,
            ref: "sessions",
        },
        client_id: { type: String, required: true, ref: "clients" },
        document: [documentSchema],
    },
    { timestamps: true },
);

export default mongoose.model<ISessionDocumentModel>("session_documents", sessionDocumentSchema);
