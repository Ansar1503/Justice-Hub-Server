import mongoose, { Schema, Document, Types } from "mongoose";

export interface IClientModel extends Document {
    _id: string;
    user_id: string;
    profile_image: string;
    dob: string;
    gender: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

const ClientSchema = new Schema<IClientModel>(
    {
        _id: { type: String },
        user_id: { type: String, required: true, unique: true },
        profile_image: { type: String, required: false },
        dob: { type: String, required: false },
        gender: {
            type: String,
            required: false,
            enum: ["male", "female", "others", ""],
            default: "",
        },
        address: {
            type: String,
            ref: "Address",
            required: false,
        },
    },
    { timestamps: true },
);

const ClientModel = mongoose.model<IClientModel>("Client", ClientSchema);

export default ClientModel;
