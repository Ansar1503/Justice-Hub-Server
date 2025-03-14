import mongoose from "mongoose";
import "dotenv/config";
let retry = 0;
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/justicehub"
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    setTimeout(connectDB, 5000);
    retry++;
    if (retry >= 5) {
      retry = 0;
      console.log("maximum tries reached, process exitting...");
      process.exit(1);
    }
  }
};

export default connectDB;
