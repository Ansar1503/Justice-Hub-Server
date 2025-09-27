import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async (retry = 0): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/justicehub");
    } catch (error) {
        retry++;
        if (retry > 3) {
            process.exit(1);
        } else {
            setTimeout(() => connectDB(retry), 5000);
        }
    }
};

export default connectDB;
