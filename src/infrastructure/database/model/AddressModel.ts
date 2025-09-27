import mongoose, { Schema, Document } from "mongoose";

export interface IAddresModel extends Document {
    _id: string;
    user_id: string;
    state: string;
    city: string;
    locality: string;
    pincode: string;
    createdAt: Date;
    updatedAt: Date;
}

const AddressSchema = new Schema<IAddresModel>(
    {
        _id: { type: String },
        state: { type: String, required: false },
        city: { type: String, required: false },
        locality: { type: String, required: false },
        pincode: { type: String, required: false },
        user_id: { type: String, required: false, unique: true },
    },

    { timestamps: true },
);

const AddressModel = mongoose.model("Address", AddressSchema);

export default AddressModel;
