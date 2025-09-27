import mongoose, { Schema } from "mongoose";

export interface IWalletModel extends Document {
    _id: string;
    user_id: string;
    balance: number;
    status: boolean;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const walletSchema = new Schema<IWalletModel>(
    {
        _id: { type: String },
        user_id: { type: String, required: true },
        balance: { type: Number, required: true, min: 0 },
        status: { type: Boolean, default: true },
        isAdmin: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export const WalletModel = mongoose.model<IWalletModel>("wallets", walletSchema);
