import mongoose, { Schema, Document } from "mongoose";

export interface IUserModel extends Document {
  _id: string;
  user_id: string;
  name: string;
  email: string;
  password: string;
  role: "lawyer" | "client" | "admin";
  mobile?: string;
  is_blocked: boolean;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserModel>(
  {
    _id: { type: String },
    user_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["lawyer", "client", "admin"], required: true },
    mobile: { type: String },
    is_blocked: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserModel =
  mongoose.models.Users || mongoose.model<IUserModel>("Users", UserSchema);

export default UserModel;
