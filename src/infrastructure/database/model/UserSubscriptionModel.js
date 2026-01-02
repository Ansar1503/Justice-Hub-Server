"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscriptionModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BenefitsSnapshotSchema = new mongoose_1.Schema({
    bookingsPerMonth: { type: mongoose_1.Schema.Types.Mixed },
    followupBookingsPerCase: { type: mongoose_1.Schema.Types.Mixed },
    chatAccess: { type: Boolean },
    discountPercent: { type: Number },
    documentUploadLimit: { type: Number },
    expiryAlert: { type: Boolean },
    autoRenew: { type: Boolean },
}, { _id: false });
const UserSubscriptionSchema = new mongoose_1.Schema({
    _id: { type: String },
    userId: { type: String, required: true },
    planId: { type: String, required: true },
    stripeSubscriptionId: { type: String },
    stripeCustomerId: { type: String },
    status: {
        type: String,
        enum: ["active", "expired", "canceled", "trialing"],
        required: true,
        default: "active",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    autoRenew: { type: Boolean, default: true },
    benefitsSnapshot: { type: BenefitsSnapshotSchema, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
}, { timestamps: true });
exports.UserSubscriptionModel = mongoose_1.default.model("userSubscription", UserSubscriptionSchema);
