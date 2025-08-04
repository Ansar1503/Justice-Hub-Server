import mongoose, { Schema, Document } from "mongoose";

export interface IUserModel extends Document {
  _id: string;
  user_id: string;
  name: string;
  email: string;
  password: string;
  role: "lawyer" | "client" | "admin";
  mobile: string;
  is_blocked: boolean;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUserModel>(
  {
    _id: { type: String },
    user_id: { type: String, required: true, default: "", unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["lawyer", "client", "admin"] },
    mobile: { type: String, required: false },
    is_blocked: { type: Boolean, required: true, default: false },
    is_verified: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUserModel>("Users", UserSchema);

export default UserModel;
