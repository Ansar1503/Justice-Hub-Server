import mongoose, { Schema, Document } from "mongoose";
import { Address } from "../../../domain/entities/Address.entity";

export interface IAddresModel extends Document, Address {}

const AddressSchema = new Schema(
  {
    state: { type: String, required: false },
    city: { type: String, required: false },
    locality: { type: String, required: false },
    pincode: { type: Number, required: false },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model("Address", AddressSchema);

export default AddressModel;
