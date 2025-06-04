import mongoose, { Schema, Document } from "mongoose";
import { Client } from "../../../domain/entities/Client.entity";

interface IClientModel extends Document, Client {}

const ClientSchema = new Schema(
  {
    user_id: { type: String, required: true, unique: true },
    profile_image: { type: String, required: false },
    dob: { type: String, required: false },
    gender: {
      type: String,
      required: false,
      enum: ["male", "female", "others"],
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: false,
    },
  },
  { timestamps: true }
);

const ClientModel = mongoose.model<IClientModel>("Client", ClientSchema);

export default ClientModel;
