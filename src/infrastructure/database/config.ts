import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async (retry = 0): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/justicehub"
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    retry++;
    if (retry > 3) {
      console.log("Maximum retries reached. Exiting...");
      process.exit(1);
    } else {
      console.log(`Retrying to connect... Attempt ${retry}`);
      setTimeout(() => connectDB(retry), 5000);
    }
  }
};

export default connectDB;
