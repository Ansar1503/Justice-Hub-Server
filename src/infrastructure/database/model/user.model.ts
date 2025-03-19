import mongoose, { Schema, Document } from "mongoose";
import { User } from "../../../domain/entities/User.entity";

export interface IUserModel extends Document, User {}

const UserSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true, default: "", unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["lawyer", "client"] },
    mobile: { type: String, required: false, unique: true },
    is_blocked: { type: Boolean, required: true, default: false },
    is_verified: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUserModel>("users", UserSchema);

export default UserModel;
