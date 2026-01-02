"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const connectDB = async (retry = 0) => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI || "mongodb://localhost:27017/justicehub");
    }
    catch (error) {
        retry++;
        if (retry > 3) {
            process.exit(1);
        }
        else {
            setTimeout(() => connectDB(retry), 5000);
        }
    }
};
exports.default = connectDB;
